import dotenv from 'dotenv';
import { BN_ZERO, BPS_DECIMALS, PerpetualsClient, PoolConfig } from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { TransactionInstruction, Signer, PublicKey, ComputeBudgetProgram, AddressLookupTableAccount } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

export const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');
// NOTE: choose the correct POOL_CONFIG based on the pool you want to interact 
// flp.1
// const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1','mainnet-beta')
// flp.2
// const POOL_CONFIG = PoolConfig.fromIdsByName('Virtual.1','mainnet-beta')
// flp.3
// const POOL_CONFIG = PoolConfig.fromIdsByName('Governance.1','mainnet-beta')
// flp.4
// const POOL_CONFIG = PoolConfig.fromIdsByName('Community.1','mainnet-beta')
// flp.5
// const POOL_CONFIG = PoolConfig.fromIdsByName('Community.2','mainnet-beta')
// flp.7
// const POOL_CONFIG = PoolConfig.fromIdsByName('Trump.1','mainnet-beta')
// flp.8
// const POOL_CONFIG = PoolConfig.fromIdsByName('Ore.1','mainnet-beta')
// flp.r
// const POOL_CONFIG = PoolConfig.fromIdsByName('Remora.1','mainnet-beta')

export const RPC_URL = process.env.RPC_URL;
console.log("RPC_URL:>> ", RPC_URL);
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
    {
        prioritizationFee: 0,
    }
)

const setLpTokenPrice = async () => {

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []
    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 120_000 }) // setLpTokenPrice

    // flash-sdk version >= "3.1.10"
    const setLpTokenPriceData = await flashClient.setLpTokenPrice(POOL_CONFIG);

    instructions.push(...setLpTokenPriceData.instructions)
    additionalSigners.push(...setLpTokenPriceData.additionalSigners)

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('setLpTokenPrice trx :>> ', trxId);
}

// addLiquidityAndStake 1 USDC 
const addLiquidityAndStake = async () => {
    const usdcInputAmount = new BN(1_000_000); // 6 Decimals
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    // flash-sdk version >= 2.31.6
    const { amount: minLpAmountOut, fee } = await flashClient.getAddLiquidityAmountAndFeeView(usdcInputAmount, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);

    const minLpAmountOutAfterSlippage = minLpAmountOut
        .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
        .div(new BN(10 ** BPS_DECIMALS))

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

    const addLiquidityAndStakeData = await flashClient.addLiquidityAndStake('USDC', usdcInputAmount, minLpAmountOutAfterSlippage, POOL_CONFIG);
    instructions.push(...addLiquidityAndStakeData.instructions)
    additionalSigners.push(...addLiquidityAndStakeData.additionalSigners)

    const flpStakeAccountPK = PublicKey.findProgramAddressSync(
        [Buffer.from('stake'), flashClient.provider.publicKey.toBuffer(), POOL_CONFIG.poolAddress.toBuffer()],
        POOL_CONFIG.programId
    )[0]

    const refreshStakeInstruction = await flashClient.refreshStakeWithTokenStake('USDC', POOL_CONFIG, flpStakeAccountPK)

    instructions.push(refreshStakeInstruction)

    let addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners: additionalSigners,
        alts: addresslookupTables
    })

    console.log('addLiquidityAndStake trx :>> ', trxId);
}

const addCompoundingLiquidity = async () => {
    const usdcInputAmount = new BN(1_000_000);
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 700 // 0.7%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    // flash-sdk version >= 2.31.6
    const { amount: minLpAmountOut, fee } = await flashClient.getAddLiquidityAmountAndFeeView(usdcInputAmount, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);
    console.log("minLpAmountOut :>> ", minLpAmountOut.toString());
    console.log("fee :>> ", fee.toString());

    const minLpAmountOutAfterSlippage = minLpAmountOut
        .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
        .div(new BN(10 ** BPS_DECIMALS))

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

    try {
        const addCompoundingLiquidityData = await flashClient.addCompoundingLiquidity(
            usdcInputAmount,
            minLpAmountOutAfterSlippage,
            'USDC',
            usdcCustody.mintKey,
            POOL_CONFIG,
            false
        )

        instructions.push(...addCompoundingLiquidityData.instructions)
        additionalSigners.push(...addCompoundingLiquidityData.additionalSigners)

        let addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
        ).addressLookupTables

        const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
            additionalSigners: additionalSigners,
            alts: addresslookupTables
        })

        console.log('addCompoundingLiquidity trx :>> ', trxId);
    } catch (error) {
        console.log('error :>> ', error);
    }
}

const removeSflpLiquidity = async () => {
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    const flpStakeAccountPK = PublicKey.findProgramAddressSync(
        [Buffer.from('stake'), flashClient.provider.publicKey.toBuffer(), POOL_CONFIG.poolAddress.toBuffer()],
        POOL_CONFIG.programId
    )[0]

    const flpStakeAccount = await flashClient.program.account.flpStake.fetch(flpStakeAccountPK);
    // console.log('flpStakeAccount :>> ', flpStakeAccount);

    const flpWithPendingAndActive =
        flpStakeAccount?.stakeStats.activeAmount.add(flpStakeAccount?.stakeStats.pendingActivation) ??
        BN_ZERO

    // flash-sdk version >= 2.31.6
    const { amount: minTokenAmountOut, fee } = await flashClient.getRemoveLiquidityAmountAndFeeView(flpWithPendingAndActive, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);
    console.log('minTokenAmountOut :>> ', minTokenAmountOut.toString());

    const { instructions: unstakeInstantInstructions, additionalSigners: unstakeInstantAdditionalSigners } =
        await flashClient.unstakeInstant('USDC', flpWithPendingAndActive, POOL_CONFIG)

    const { instructions: withdrawStakeInstructions, additionalSigners: withdrawStakeAdditionalSigners } =
        await flashClient.withdrawStake(POOL_CONFIG, true, true)

    instructions.push(...unstakeInstantInstructions)
    additionalSigners.push(...unstakeInstantAdditionalSigners)

    instructions.push(...withdrawStakeInstructions)
    additionalSigners.push(...withdrawStakeAdditionalSigners)

    const minTokenAmountOutAfterSlippage = minTokenAmountOut
        .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
        .div(new BN(10 ** BPS_DECIMALS))


    console.log('minTokenAmountOutAfterSlippage :>> ', minTokenAmountOutAfterSlippage.toString());
    console.log('flpWithPendingAndActive :>> ', flpWithPendingAndActive.toString());
    console.log('usdcCustody.custodyAccount :>> ', usdcCustody.custodyAccount.toString());
    console.log('POOL_CONFIG.poolAddress :>> ', POOL_CONFIG.poolAddress.toString());

    try {
        const removeLiquidityData = await flashClient.removeLiquidity(
            'USDC',
            flpWithPendingAndActive,
            minTokenAmountOutAfterSlippage,
            POOL_CONFIG
        )

        instructions.push(...removeLiquidityData.instructions)
        additionalSigners.push(...removeLiquidityData.additionalSigners)

        const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

        let addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
        ).addressLookupTables

        const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
            additionalSigners: additionalSigners,
            alts: addresslookupTables
        })

        console.log('trx :>> ', trxId);
    } catch (error) {
        console.log('removeLiquidity error :>> ', error);
    }
}

const removeFlpLiquidity = async () => {
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []
    const usdcToken = POOL_CONFIG.tokens.find(t => t.symbol === 'USDC')!;

    const account = getAssociatedTokenAddressSync(POOL_CONFIG.compoundingTokenMint, flashClient.provider.publicKey, true)
    console.log('compoundingTokenMint account :>> ', account.toBase58());
    const accountInfo = await flashClient.provider.connection.getAccountInfo(account, 'processed')
    if (!accountInfo) {
        throw new Error(`Account ${account.toBase58()} not found`)
    }

    const walletBalance = await flashClient.provider.connection.getTokenAccountBalance(account, 'processed')
    console.log('walletBalance :>> ', walletBalance);
    if (!Number(walletBalance.value.amount)) {
        throw new Error(`Account ${account.toBase58()} not sufficient balance`)
    }
    const compoundingTokenBalance = new BN(walletBalance.value.amount)

    // const { amount: minTokenAmountOut, fee } = await flashClient.getSFLPRemoveLiquidityAmountAndFee(compoundingTokenBalance, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);
    // flash-sdk version >= 2.31.6
    const { amount: minTokenAmountOut, fee } = await flashClient.getRemoveCompoundingLiquidityAmountAndFeeView(compoundingTokenBalance, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);

    const minTokenAmountOutAfterSlippage = minTokenAmountOut
        .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
        .div(new BN(10 ** BPS_DECIMALS))

    const removeCompoundingLiquidityData = await flashClient.removeCompoundingLiquidity(
        compoundingTokenBalance,
        minTokenAmountOutAfterSlippage,
        'USDC',
        usdcToken.mintKey,
        POOL_CONFIG,
        true
    )

    instructions.push(...removeCompoundingLiquidityData.instructions)
    additionalSigners.push(...removeCompoundingLiquidityData.additionalSigners)

    let addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners: additionalSigners,
        alts: addresslookupTables
    })

    console.log('trx :>> ', trxId);
}


const getLpTokenPrices = async () => {
    const stakedLpPrice = await flashClient.getStakedLpTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG); // sFLP price
    const compoundingLPTokenPrice = await flashClient.getCompoundingLPTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG); // FLP price

    console.log('stakedLpPrice :>> ', stakedLpPrice);
    console.log('compoundingLPTokenPrice :>> ', compoundingLPTokenPrice);
}

(async () => {

    console.log("testing...");

    //  await addLiquidityAndStake()
    //  console.log("addLiquidityAndStake done");

    // await removeSflpLiquidity()
    // console.log("removeSflpLiquidity done");

    // await addCompoundingLiquidity()
    // console.log("addCompoundingLiquidity done");

    // await removeFlpLiquidity()
    //  console.log("removeFlpLiquidity done");

    //  await getLpTokenPrices()
    // console.log("getLpTokenPrices done");
})()
