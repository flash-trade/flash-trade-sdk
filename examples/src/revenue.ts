/**
 * Flash Perps — FAF revenue example.
 *
 * Demonstrates how to read and claim the USDC revenue share that the
 * protocol distributes to FAF (Flash Foundation token) stakers:
 *   - quote how much USDC a wallet can currently claim  -> getUserClaimableRevenue
 *   - claim it on-chain                                 -> claimRevenue
 *
 * ───────────────────────────────────────────────────────────────────────────
 * What is "revenue" here?
 * ───────────────────────────────────────────────────────────────────────────
 *   A slice of protocol fees is paid out to wallets that have FAF staked in
 *   the global `token_stake` PDA. Eligibility and the per-FAF rate live on
 *   the cluster-wide `TokenVault` account, not on a specific pool.
 *
 *   Wallets without an FAF stake account, or with zero eligible amount, will
 *   see `revenueAmount == 0` and `claimRevenue` will fail. Stake FAF first
 *   via `depositFafStake` (see flash-main-ui/actions/useFaf.tsx) if you
 *   want to test the claim path.
 *
 *   `tokenVault` and `revenueTokenAccount` are shared across all mainnet
 *   pools, so we use Crypto.1 as the "anchor" pool here — any pool would
 *   resolve to the same vault. On devnet they're a separate (also-shared)
 *   pair, so switch the POOL_CONFIG below for devnet testing.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Required env vars
 * ───────────────────────────────────────────────────────────────────────────
 *   RPC_URL          - Solana RPC for the cluster (mainnet or devnet)
 *   ANCHOR_WALLET    - path to a keypair JSON (consumed by AnchorProvider.local)
 *
 * Run:
 *   npm install
 *   ANCHOR_WALLET=~/.config/solana/id.json npx ts-node src/revenue.ts
 *
 * Typical flow (see the IIFE at the bottom for a runnable scaffold):
 * @example
 *   // 1) Check how much USDC the connected wallet can claim:
 *   const owed = await getUserClaimableRevenue()
 *
 *   // 2) Or check an arbitrary wallet:
 *   const owed = await getUserClaimableRevenue(new PublicKey('GKTL...MoffMd'))
 *
 *   // 3) Claim it (sends a transaction):
 *   await claimRevenue()
 */
import dotenv from 'dotenv';
import {
    BN_ZERO,
    nativeToUiDecimals,
    PerpetualsClient,
    PoolConfig,
    USD_DECIMALS,
} from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import {
    AddressLookupTableAccount,
    ComputeBudgetProgram,
    PublicKey,
    Signer,
    TransactionInstruction,
} from '@solana/web3.js';

// ============================================================================
// Pool registry
// ----------------------------------------------------------------------------
// Revenue is FAF-scoped, not pool-scoped. The `tokenVault` and
// `revenueTokenAccount` referenced by the SDK are the same across every
// mainnet pool — so Crypto.1 is used here as the canonical "anchor". Switch
// to `devnet.1` (with the devnet cluster) when testing on devnet.
// ============================================================================
export const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');
// export const POOL_CONFIG = PoolConfig.fromIdsByName('devnet.1', 'devnet');

// Revenue is paid in USDC. Override only if a future pool changes this.
const REVENUE_TOKEN_SYMBOL = 'USDC';

// Compute-unit budget for `claimRevenue`. Generous default that matches
// the flash-main-ui claim flow (`actions/useFaf.tsx -> claimUserRevenue`).
const CU_CLAIM_REVENUE = 200_000;

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
// getUserClaimableRevenue — view how much USDC `wallet` can currently claim.
// ----------------------------------------------------------------------------
// Pure read; no transaction. Returns native BN amount (6 decimals for USDC).
// Defaults to the connected wallet when no argument is passed.
// Requires flash-sdk >= 2.52.1.
// ============================================================================
export const getUserClaimableRevenue = async (wallet?: PublicKey): Promise<BN> => {
    const target = wallet ?? flashClient.provider.publicKey;

    await flashClient.loadAddressLookupTable(POOL_CONFIG);

    const revenueAmount = await flashClient.getUserClaimableRevenueAmount(POOL_CONFIG, target);

    console.log(
        'revenueAmount :>> ',
        revenueAmount.toString(),
        `(${nativeToUiDecimals(revenueAmount, USD_DECIMALS)} ${REVENUE_TOKEN_SYMBOL})`
    );
    return revenueAmount;
};

// ============================================================================
// claimRevenue — withdraw the connected wallet's claimable revenue to its USDC ATA.
// ----------------------------------------------------------------------------
// Fails if the wallet has no FAF token-stake account or zero eligible
// amount. Auto-creates the receiving USDC ATA if missing.
// ============================================================================
export const claimRevenue = async () => {
    // Sanity-check there's something to claim before paying for a trx.
    const owed = await getUserClaimableRevenue();
    if (owed.lte(BN_ZERO)) {
        console.log('Nothing to claim — wallet has no eligible FAF revenue.');
        return;
    }

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: CU_CLAIM_REVENUE });

    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];

    const collectRevenueData = await flashClient.collectRevenue(
        flashClient.provider.publicKey,
        REVENUE_TOKEN_SYMBOL,
        POOL_CONFIG,
        true // createUserATA — auto-creates the receiving USDC ATA if missing
    );
    instructions.push(...collectRevenueData.instructions);
    additionalSigners.push(...collectRevenueData.additionalSigners);

    const addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables;

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners,
        alts: addresslookupTables,
    });
    console.log('claimRevenue trx :>> ', trxId);
};

// ============================================================================
// Runnable scaffold
// ----------------------------------------------------------------------------
// Defaults to the read-only quote. Uncomment `claimRevenue` to actually
// submit a transaction — make sure the wallet has FAF staked first.
// ============================================================================
(async () => {
    console.log('testing...');

    await getUserClaimableRevenue();
    console.log('getUserClaimableRevenue done');

    // await claimRevenue();
    // console.log('claimRevenue done');
})();
