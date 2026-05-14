/**
 * Flash Perps — liquidity example.
 *
 * Demonstrates the full LP lifecycle against a single Flash perps pool:
 *   - mint sFLP (staked LP)            -> addLiquidityAndStake
 *   - mint FLP  (compounding LP)       -> addCompoundingLiquidity
 *   - burn sFLP back into the deposit  -> removeSflpLiquidity
 *   - burn FLP  back into the deposit  -> removeFlpLiquidity
 *   - read on-chain LP token prices    -> getLpTokenPrices
 *   - keeper / housekeeping helpers    -> setLpTokenPrice, collectStakeFees
 *
 * ───────────────────────────────────────────────────────────────────────────
 * sFLP vs FLP — pick one before you deposit.
 * ───────────────────────────────────────────────────────────────────────────
 *   sFLP (staked LP)
 *     - `addLiquidityAndStake` mints LP and auto-stakes it in one trx.
 *     - Pool fees accrue as a *claimable* balance on the stake account.
 *     - You call `collectStakeFees` (or compound manually) to realise rewards.
 *     - Unstaking goes through `unstakeInstant` + `withdrawStake` before the
 *       underlying tokens can be returned via `removeLiquidity`. This file's
 *       `removeSflpLiquidity` chains all three in a single transaction.
 *
 *   FLP (compounding LP)
 *     - `addCompoundingLiquidity` mints a rebasing SPL token whose price
 *       grows as pool fees accrue — no manual claim step.
 *     - Burn it with `removeCompoundingLiquidity` (see `removeFlpLiquidity`).
 *
 * Unless you have a reason to manage rewards yourself, prefer FLP.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Required env vars
 * ───────────────────────────────────────────────────────────────────────────
 *   RPC_URL          - Solana RPC for the cluster (mainnet or devnet)
 *   ANCHOR_WALLET    - path to a keypair JSON (consumed by AnchorProvider.local)
 *
 * Run:
 *   npm install
 *   ANCHOR_WALLET=~/.config/solana/id.json npx ts-node src/liquidity.ts
 *
 * Switching pools:
 *   `POOL_CONFIG` below selects the pool you operate on. Liquidity is *per
 *   pool* — each pool has its own sFLP / FLP mints. Pick a pool from the list
 *   in the "Pool registry" section.
 *
 * Typical flow (see the IIFE at the bottom for a runnable scaffold):
 * @example
 *   // Deposit 1 USDC and receive compounding FLP:
 *   await addCompoundingLiquidity()
 *
 *   // Or deposit 1 USDC and stake the resulting sFLP:
 *   await addLiquidityAndStake()
 *
 *   // Read the current LP token prices (USD per token):
 *   await getLpTokenPrices()
 *
 *   // Withdraw everything later:
 *   await removeFlpLiquidity()   // for FLP
 *   await removeSflpLiquidity()  // for sFLP (unstakes then burns)
 */
import dotenv from 'dotenv';
import { BN_ZERO, BPS_DECIMALS, PerpetualsClient, PoolConfig } from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import {
    TransactionInstruction,
    Signer,
    PublicKey,
    ComputeBudgetProgram,
    AddressLookupTableAccount,
} from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

// ============================================================================
// Pool registry
// ----------------------------------------------------------------------------
// Pick ONE pool to operate on. Liquidity is pool-scoped: each pool has its
// own sFLP / FLP mints, its own custodies, and its own deposit token. The
// examples below assume USDC is a valid custody in the selected pool —
// switch the deposit token by changing the `DEPOSIT_TOKEN_SYMBOL` constant
// further down if you need to.
//
// Mainnet pools:
//   Crypto.1     -> flp.1   (BTC/ETH/SOL majors)
//   Virtual.1    -> flp.2
//   Governance.1 -> flp.3
//   Community.1  -> flp.4
//   Community.2  -> flp.5
//   Trump.1      -> flp.7
//   Ore.1        -> flp.8
//   Remora.1     -> flp.r
//   Equity.1     -> flp.x   (US equities: SPY, NVDA, TSLA, AAPL, ...)
//
// Devnet:
//   devnet.1
// ============================================================================
export const POOL_CONFIG = PoolConfig.fromIdsByName('devnet.1', 'devnet');
// export const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');

// Symbol of the token used to deposit into / receive from the pool.
// Must match a custody in `POOL_CONFIG.custodies`.
const DEPOSIT_TOKEN_SYMBOL = 'USDC';

// Slippage tolerance in basis points (1 bp = 0.01%). 800 = 0.8%.
const SLIPPAGE_BPS = 800;

// Compute-unit budgets (rough, generous defaults that match flash-main-ui).
const CU_LP_OP = 400_000;     // add / remove liquidity
const CU_PRICE_OP = 120_000;  // setLpTokenPrice / collectStakeFees

// ============================================================================
// Provider + client
// ============================================================================
export const RPC_URL = process.env.RPC_URL;
console.log('RPC_URL:>> ', RPC_URL);
if (!RPC_URL) {
    throw new Error('RPC_URL is not set');
}

const provider: AnchorProvider = AnchorProvider.local(RPC_URL, {
    commitment: 'processed',
    preflightCommitment: 'processed',
    skipPreflight: true,
});

export const flashClient = new PerpetualsClient(
    provider,
    POOL_CONFIG.programId,
    POOL_CONFIG.perpComposibilityProgramId,
    POOL_CONFIG.fbNftRewardProgramId,
    POOL_CONFIG.rewardDistributionProgram.programId,
    { prioritizationFee: 0 }
);

// ============================================================================
// Helpers
// ============================================================================

/** Apply `SLIPPAGE_BPS` slippage tolerance to a minimum-out amount. */
const applySlippage = (amount: BN): BN =>
    amount.mul(new BN(10 ** BPS_DECIMALS - SLIPPAGE_BPS)).div(new BN(10 ** BPS_DECIMALS));

/** PDA of the caller's `flpStake` account for the current pool. */
const getFlpStakeAccountPk = (): PublicKey =>
    PublicKey.findProgramAddressSync(
        [Buffer.from('stake'), flashClient.provider.publicKey.toBuffer(), POOL_CONFIG.poolAddress.toBuffer()],
        POOL_CONFIG.programId
    )[0];

// ============================================================================
// Keeper helper — refresh LP token prices
// ----------------------------------------------------------------------------
// The pool stores LP token prices in an account that anyone can refresh.
// Most flows do NOT need to call this — production keepers run it on a
// schedule. It's included here for completeness / parity with the SDK API.
// Requires flash-sdk >= 3.1.10.
// ============================================================================
const setLpTokenPrice = async () => {
    await flashClient.loadAddressLookupTable(POOL_CONFIG);

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_PRICE_OP });

    const { instructions, additionalSigners } = await flashClient.setLpTokenPrice(POOL_CONFIG);

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners,
    });
    console.log('setLpTokenPrice trx :>> ', trxId);
};

// ============================================================================
// addLiquidityAndStake — deposit `DEPOSIT_TOKEN_SYMBOL` and mint + auto-stake sFLP.
// ----------------------------------------------------------------------------
// Result: caller's `flpStake` account is credited with the new sFLP.
// The follow-up `refreshStakeWithTokenStake` instruction makes sure unrealised
// rewards are accounted for at the same epoch.
// ============================================================================
const addLiquidityAndStake = async () => {
    const inputAmount = new BN(1_000_000); // 1 USDC (6 decimals)
    const custody = POOL_CONFIG.custodies.find((c) => c.symbol === DEPOSIT_TOKEN_SYMBOL)!;

    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];

    // Quote: how many LP tokens this deposit will mint, before slippage.
    const { amount: minLpAmountOut } = await flashClient.getAddLiquidityAmountAndFeeView(
        inputAmount,
        POOL_CONFIG.poolAddress,
        custody.custodyAccount,
        POOL_CONFIG
    );
    const minLpAmountOutAfterSlippage = applySlippage(minLpAmountOut);

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LP_OP });

    const addLiquidityAndStakeData = await flashClient.addLiquidityAndStake(
        DEPOSIT_TOKEN_SYMBOL,
        inputAmount,
        minLpAmountOutAfterSlippage,
        POOL_CONFIG
    );
    instructions.push(...addLiquidityAndStakeData.instructions);
    additionalSigners.push(...addLiquidityAndStakeData.additionalSigners);

    // Refresh the stake account so pending rewards are settled in this trx.
    const refreshStakeInstruction = await flashClient.refreshStakeWithTokenStake(
        DEPOSIT_TOKEN_SYMBOL,
        POOL_CONFIG,
        getFlpStakeAccountPk()
    );
    instructions.push(refreshStakeInstruction);

    const addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables;

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners,
        alts: addresslookupTables,
    });
    console.log('addLiquidityAndStake trx :>> ', trxId);
};

// ============================================================================
// addCompoundingLiquidity — deposit `DEPOSIT_TOKEN_SYMBOL` and receive FLP.
// ----------------------------------------------------------------------------
// FLP is a rebasing SPL token: its price grows as pool fees accrue, with no
// claim step. Burn it later with `removeFlpLiquidity`.
// ============================================================================
const addCompoundingLiquidity = async () => {
    const inputAmount = new BN(1_000_000); // 1 USDC
    const custody = POOL_CONFIG.custodies.find((c) => c.symbol === DEPOSIT_TOKEN_SYMBOL)!;

    const { amount: minLpAmountOut, fee } = await flashClient.getAddLiquidityAmountAndFeeView(
        inputAmount,
        POOL_CONFIG.poolAddress,
        custody.custodyAccount,
        POOL_CONFIG
    );
    console.log('minLpAmountOut :>> ', minLpAmountOut.toString());
    console.log('fee            :>> ', fee.toString());

    const minLpAmountOutAfterSlippage = applySlippage(minLpAmountOut);

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LP_OP });

    try {
        // Trailing options on addCompoundingLiquidity. See PerpetualsClient.ts.
        const { instructions, additionalSigners } = await flashClient.addCompoundingLiquidity(
            inputAmount,
            minLpAmountOutAfterSlippage,
            DEPOSIT_TOKEN_SYMBOL,
            custody.mintKey,
            POOL_CONFIG,
            false,     // skipBalanceChecks       (default false)
            null,      // ephemeralSignerPubkey   (SquadsX wallets only)
            undefined, // userPublicKey           (defaults to provider wallet)
            false,     // enableHeapSizeIx        (default true; flip on for very large pools)
            false,     // isWhitelistedUser
            false      // includeRemainingAccounts (default true)
        );

        const addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
        ).addressLookupTables;

        const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
            additionalSigners,
            alts: addresslookupTables,
        });
        console.log('addCompoundingLiquidity trx :>> ', trxId);
    } catch (error) {
        console.log('addCompoundingLiquidity error :>> ', error);
    }
};

// ============================================================================
// removeSflpLiquidity — unstake the caller's sFLP and burn it back to `DEPOSIT_TOKEN_SYMBOL`.
// ----------------------------------------------------------------------------
// sFLP must first leave the stake account, then be redeemed against the pool.
// We bundle all three steps in one transaction:
//   1. `unstakeInstant`    — move active+pending sFLP into a withdrawable bucket
//   2. `withdrawStake`     — pull it back to the caller's ATA
//   3. `removeLiquidity`   — burn the LP and receive the deposit token
// ============================================================================
const removeSflpLiquidity = async () => {
    const custody = POOL_CONFIG.custodies.find((c) => c.symbol === DEPOSIT_TOKEN_SYMBOL)!;
    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];

    // How much sFLP the caller has (active + pending activation).
    const flpStakeAccount = await flashClient.program.account.flpStake.fetch(getFlpStakeAccountPk());
    const flpWithPendingAndActive =
        flpStakeAccount?.stakeStats.activeAmount.add(flpStakeAccount?.stakeStats.pendingActivation) ?? BN_ZERO;

    // Quote: how much `DEPOSIT_TOKEN_SYMBOL` you'd get for burning that much LP.
    const { amount: minTokenAmountOut } = await flashClient.getRemoveLiquidityAmountAndFeeView(
        flpWithPendingAndActive,
        POOL_CONFIG.poolAddress,
        custody.custodyAccount,
        POOL_CONFIG
    );
    const minTokenAmountOutAfterSlippage = applySlippage(minTokenAmountOut);

    console.log('flpWithPendingAndActive          :>> ', flpWithPendingAndActive.toString());
    console.log('minTokenAmountOut                :>> ', minTokenAmountOut.toString());
    console.log('minTokenAmountOutAfterSlippage   :>> ', minTokenAmountOutAfterSlippage.toString());

    // 1) Move the sFLP out of the staked bucket.
    const { instructions: unstakeIxs, additionalSigners: unstakeSigners } = await flashClient.unstakeInstant(
        DEPOSIT_TOKEN_SYMBOL,
        flpWithPendingAndActive,
        POOL_CONFIG
    );
    instructions.push(...unstakeIxs);
    additionalSigners.push(...unstakeSigners);

    // 2) Withdraw to the caller's ATA.
    const { instructions: withdrawIxs, additionalSigners: withdrawSigners } = await flashClient.withdrawStake(
        POOL_CONFIG,
        true,
        true
    );
    instructions.push(...withdrawIxs);
    additionalSigners.push(...withdrawSigners);

    try {
        // 3) Burn the LP for the deposit token.
        const removeLiquidityData = await flashClient.removeLiquidity(
            DEPOSIT_TOKEN_SYMBOL,
            flpWithPendingAndActive,
            minTokenAmountOutAfterSlippage,
            POOL_CONFIG
        );
        instructions.push(...removeLiquidityData.instructions);
        additionalSigners.push(...removeLiquidityData.additionalSigners);

        const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LP_OP });

        const addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
        ).addressLookupTables;

        const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
            additionalSigners,
            alts: addresslookupTables,
        });
        console.log('removeSflpLiquidity trx :>> ', trxId);
    } catch (error) {
        console.log('removeSflpLiquidity error :>> ', error);
    }
};

// ============================================================================
// removeFlpLiquidity — burn the caller's full FLP balance back to `DEPOSIT_TOKEN_SYMBOL`.
// ----------------------------------------------------------------------------
// Reads the caller's compounding-LP ATA, quotes the redemption, applies
// slippage, and burns the whole balance in one trx.
// ============================================================================
const removeFlpLiquidity = async () => {
    const custody = POOL_CONFIG.custodies.find((c) => c.symbol === DEPOSIT_TOKEN_SYMBOL)!;
    const token = POOL_CONFIG.tokens.find((t) => t.symbol === DEPOSIT_TOKEN_SYMBOL)!;

    const compoundingAta = getAssociatedTokenAddressSync(
        POOL_CONFIG.compoundingTokenMint,
        flashClient.provider.publicKey,
        true
    );
    console.log('compoundingTokenMint ATA :>> ', compoundingAta.toBase58());

    const accountInfo = await flashClient.provider.connection.getAccountInfo(compoundingAta, 'processed');
    if (!accountInfo) {
        throw new Error(`Compounding ATA ${compoundingAta.toBase58()} not found`);
    }
    const walletBalance = await flashClient.provider.connection.getTokenAccountBalance(
        compoundingAta,
        'processed'
    );
    console.log('walletBalance :>> ', walletBalance);
    if (!Number(walletBalance.value.amount)) {
        throw new Error(`Compounding ATA ${compoundingAta.toBase58()} has no balance`);
    }
    const compoundingTokenBalance = new BN(walletBalance.value.amount);

    const { amount: minTokenAmountOut } = await flashClient.getRemoveCompoundingLiquidityAmountAndFeeView(
        compoundingTokenBalance,
        POOL_CONFIG.poolAddress,
        custody.custodyAccount,
        POOL_CONFIG
    );
    const minTokenAmountOutAfterSlippage = applySlippage(minTokenAmountOut);

    const { instructions, additionalSigners } = await flashClient.removeCompoundingLiquidity(
        compoundingTokenBalance,
        minTokenAmountOutAfterSlippage,
        DEPOSIT_TOKEN_SYMBOL,
        token.mintKey,
        POOL_CONFIG,
        true // createUserATA — auto-creates the receive-token ATA if missing
    );

    const addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables;

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_LP_OP });

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners,
        alts: addresslookupTables,
    });
    console.log('removeFlpLiquidity trx :>> ', trxId);
};

// ============================================================================
// getLpTokenPrices — read the on-chain USD price of both LP tokens.
// ----------------------------------------------------------------------------
// Useful for UI, accounting, and PnL. Returns `OraclePrice`-style numbers
// (price + exponent). The values are refreshed by `setLpTokenPrice`.
// ============================================================================
const getLpTokenPrices = async () => {
    await flashClient.loadAddressLookupTable(POOL_CONFIG);

    const stakedLpPrice = await flashClient.getStakedLpTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG); // sFLP
    const compoundingLPTokenPrice = await flashClient.getCompoundingLPTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG); // FLP

    console.log('stakedLpPrice (sFLP)         :>> ', stakedLpPrice);
    console.log('compoundingLPTokenPrice (FLP):>> ', compoundingLPTokenPrice);
};

// ============================================================================
// collectStakeFees — claim accrued fee rewards from the sFLP stake account.
// ----------------------------------------------------------------------------
// Only relevant to sFLP holders. FLP rewards auto-compound and don't require
// a claim. Requires flash-sdk >= 3.1.10.
// ============================================================================
const collectStakeFees = async () => {
    await flashClient.loadAddressLookupTable(POOL_CONFIG);

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_PRICE_OP });

    const { instructions, additionalSigners } = await flashClient.collectStakeFees(
        DEPOSIT_TOKEN_SYMBOL,
        POOL_CONFIG,
        getFlpStakeAccountPk()
    );

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners,
    });
    console.log('collectStakeFees trx :>> ', trxId);
};

// ============================================================================
// Runnable scaffold
// ----------------------------------------------------------------------------
// Uncomment the function(s) you want to exercise. The defaults run a
// no-op-friendly demo: refresh prices, mint a small amount of FLP, and read
// the current LP prices back. Always test on devnet before mainnet.
// ============================================================================
(async () => {
    console.log('testing...');

    await setLpTokenPrice();
    console.log('setLpTokenPrice done');

    // await addLiquidityAndStake();
    // console.log('addLiquidityAndStake done');

    // await removeSflpLiquidity();
    // console.log('removeSflpLiquidity done');

    await addCompoundingLiquidity();
    console.log('addCompoundingLiquidity done');

    // await removeFlpLiquidity();
    // console.log('removeFlpLiquidity done');

    await getLpTokenPrices();
    console.log('getLpTokenPrices done');

    // await collectStakeFees();
    // console.log('collectStakeFees done');
})();
