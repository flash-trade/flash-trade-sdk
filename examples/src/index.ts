import dotenv from 'dotenv';
import { BN_ZERO, BPS_DECIMALS, CustodyAccount, getUnixTs, OraclePrice, PerpetualsClient, PoolAccount, PoolConfig, PoolDataClient, PositionAccount, Privilege, Side, uiDecimalsToNative } from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { TransactionInstruction, Signer, PublicKey, ComputeBudgetProgram, Connection } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, getMint } from '@solana/spl-token';
import { PriceData, PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';

export const RPC_URL = process.env.RPC_URL;

export const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');

const connectionFromPyth = new Connection(
    process.env.PYTHNET_URL!
)

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

const addLiquidityAndStake = async () => {
    const usdcInputAmount = new BN(1_000_000);
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    const { amount: minLpAmountOut, fee } = await flashClient.getAddLiquidityAmountAndFee(usdcInputAmount, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);

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

    const refreshStakeInstruction = await flashClient.refreshStake('USDC', POOL_CONFIG, [flpStakeAccountPK])

    instructions.push(refreshStakeInstruction)

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('addLiquidityAndStake trx :>> ', trxId);
}

const addCompoundingLiquidity = async () => {
    const usdcInputAmount = new BN(1_000_000);
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    const { amount: minLpAmountOut, fee } = await flashClient.getSFLPAddLiquidityAmountAndFee(usdcInputAmount, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);

    const minLpAmountOutAfterSlippage = minLpAmountOut
        .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
        .div(new BN(10 ** BPS_DECIMALS))

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

    const addCompoundingLiquidityData = await flashClient.addCompoundingLiquidity(
        usdcInputAmount,
        minLpAmountOutAfterSlippage,
        'USDC',
        usdcCustody.mintKey,
        POOL_CONFIG
    )

    instructions.push(...addCompoundingLiquidityData.instructions)
    additionalSigners.push(...addCompoundingLiquidityData.additionalSigners)

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('addCompoundingLiquidity trx :>> ', trxId);
}

const removeSflpLiquidity = async () => {
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    const flpStakeAccountPK = PublicKey.findProgramAddressSync(
        [Buffer.from('stake'), flashClient.provider.publicKey.toBuffer(), POOL_CONFIG.poolAddress.toBuffer()],
        POOL_CONFIG.programId
    )[0]

    const flpStakeAccount = await flashClient.program.account.flpStake.fetch(flpStakeAccountPK);

    const flpWithPendingAndActive =
        flpStakeAccount?.stakeStats.activeAmount.add(flpStakeAccount?.stakeStats.pendingActivation) ??
        BN_ZERO

    const { amount: minTokenAmountOut, fee } = await flashClient.getRemoveLiquidityAmountAndFee(flpWithPendingAndActive, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);

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

    const removeLiquidityData = await flashClient.removeLiquidity(
        'USDC',
        flpWithPendingAndActive,
        minTokenAmountOutAfterSlippage,
        POOL_CONFIG
    )

    instructions.push(...removeLiquidityData.instructions)
    additionalSigners.push(...removeLiquidityData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('trx :>> ', trxId);
}

const removeFlpLiquidity = async () => {
    const usdcCustody = POOL_CONFIG.custodies.find(c => c.symbol === 'USDC')!;
    const slippageBps: number = 800 // 0.8%
    let instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []
    const usdcToken = POOL_CONFIG.tokens.find(t => t.symbol === 'USDC')!;

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    const account = getAssociatedTokenAddressSync(POOL_CONFIG.compoundingTokenMint, flashClient.provider.publicKey, true)

    const walletBalance = await flashClient.provider.connection.getTokenAccountBalance(account, 'processed')
    const compoundingTokenBalance = new BN(walletBalance.value.amount)


    const { amount: minTokenAmountOut, fee } = await flashClient.getSFLPRemoveLiquidityAmountAndFee(compoundingTokenBalance, POOL_CONFIG.poolAddress, usdcCustody.custodyAccount, POOL_CONFIG);

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

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }) // addLiquidity

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('trx :>> ', trxId);
}

const pythClient = new PythHttpClient(connectionFromPyth, getPythProgramKeyForCluster('pythnet'))

const getPrices = async () => { 
    const pythHttpClientResult = await pythClient.getData()
    
    const priceMap = new Map<string, { price: OraclePrice; emaPrice: OraclePrice }>();

    for (let token of POOL_CONFIG.tokens) {
        const priceData: PriceData = pythHttpClientResult.productPrice.get(token.pythTicker)!
        if (!priceData) {
            throw new Error(`priceData not found for ${token.symbol}`)
        }
        const priceOracle = new OraclePrice({
            price: new BN(priceData?.aggregate.priceComponent.toString()),
            exponent: new BN(priceData?.exponent),
            confidence: new BN(priceData?.confidence!),
            timestamp: new BN(priceData?.timestamp.toString()),
        })

        const emaPriceOracle = new OraclePrice({
            price: new BN(priceData?.emaPrice.valueComponent.toString()),
            exponent: new BN(priceData?.exponent),
            confidence: new BN(priceData?.emaConfidence.valueComponent.toString()),
            timestamp: new BN(priceData?.timestamp.toString()),
        })
        priceMap.set(token.symbol, { price: priceOracle, emaPrice: emaPriceOracle })
    }

    return priceMap;
}


const openPosition = async (inputTokenSymbol: string, outputTokenSymbol: string, inputAmount: string, side: Side) => {

    const slippageBps: number = 800 // 0.8%

    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    const inputToken = POOL_CONFIG.tokens.find(t => t.symbol === inputTokenSymbol)!;
    const outputToken = POOL_CONFIG.tokens.find(t => t.symbol === outputTokenSymbol)!;

    const priceMap = await getPrices();

    const inputTokenPrice = priceMap.get(inputToken.symbol)!.price
    const inputTokenPriceEma = priceMap.get(inputToken.symbol)!.emaPrice
    const outputTokenPrice = priceMap.get(outputToken.symbol)!.price
    const outputTokenPriceEma = priceMap.get(outputToken.symbol)!.emaPrice

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    const priceAfterSlippage = flashClient.getPriceAfterSlippage(
        true,
        new BN(slippageBps),
        outputTokenPrice,
        side
    )

    const collateralWithFee = uiDecimalsToNative(inputAmount, inputToken.decimals);
    const leverage = 1.1;

    const inputCustody = POOL_CONFIG.custodies.find(c => c.symbol === inputToken.symbol)!;
    const outputCustody = POOL_CONFIG.custodies.find(c => c.symbol === outputToken.symbol)!;

    const custodies = await flashClient.program.account.custody.fetchMultiple([inputCustody.custodyAccount, outputCustody.custodyAccount]);

    const outputAmount = flashClient.getSizeAmountFromLeverageAndCollateral( //
        collateralWithFee,
        leverage.toString(),
        outputToken,
        inputToken,
        side,
        outputTokenPrice,
        outputTokenPriceEma,
        CustodyAccount.from(outputCustody.custodyAccount, custodies[1]!),
        inputTokenPrice,
        inputTokenPriceEma,
        CustodyAccount.from(inputCustody.custodyAccount, custodies[0]!),
        uiDecimalsToNative(`5`, 2)
    )

    const openPositionData = await flashClient.openPosition(
        outputToken.symbol,
        inputToken.symbol,
        priceAfterSlippage,
        collateralWithFee,
        outputAmount,
        side,
        POOL_CONFIG,
        new PublicKey('...'), // nftTradingAccount,
        new PublicKey('...'), // nftRerralAccount
        new PublicKey('...'), // nftRebateTokenAccount
        Privilege.Referral // if you own the nft, set this to Privilege.NFT
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // addLiquidity
    const setCUPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 20
    })

    const trxId = await flashClient.sendTransaction([setCULimitIx, setCUPriceIx, ...instructions])

    console.log('trx :>> ', trxId);
}

// openPosition('SOL', 'SOL', '0.1', Side.Long)

const closePosition = async (targetTokenSymbol: string, side: Side) => {
    const slippageBps: number = 800 // 0.8%
    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    const targetToken = POOL_CONFIG.tokens.find(t => t.symbol === targetTokenSymbol)!;
    const userRecievingToken = POOL_CONFIG.tokens.find(t => t.symbol === targetTokenSymbol)!;

   const priceMap = await getPrices();

    const targetTokenPrice = priceMap.get(targetTokenSymbol)!.price

    const priceAfterSlippage = flashClient.getPriceAfterSlippage(false, new BN(slippageBps), targetTokenPrice, side)

    const openPositionData =await flashClient.closePosition(
        targetToken.symbol,
        userRecievingToken.symbol, // for WSOL
        priceAfterSlippage,
        side,
        POOL_CONFIG,
        new PublicKey('...'), // nftTradingAccount,
        new PublicKey('...'), // nftRerralAccount
        new PublicKey('...'), // nftRebateTokenAccount
        Privilege.Referral
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // addLiquidity
    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])
    console.log('trxId :>> ', trxId);
}

// closePosition('BTC', Side.Long);

const openPositionWithSwap = async (inputTokenSymbol: string, outputTokenSymbol: string, inputAmount: string, side: Side) => {

    const slippageBps: number = 800 // 0.8%

    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    const inputToken = POOL_CONFIG.tokens.find(t => t.symbol === inputTokenSymbol)!;
    const outputToken = POOL_CONFIG.tokens.find(t => t.symbol === outputTokenSymbol)!;

    const priceMap = await getPrices();

    const inputTokenPrice = priceMap.get(inputToken.symbol)!.price
    const inputTokenPriceEma = priceMap.get(inputToken.symbol)!.emaPrice
    const outputTokenPrice = priceMap.get(outputToken.symbol)!.price
    const outputTokenPriceEma = priceMap.get(outputToken.symbol)!.emaPrice

    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    const priceAfterSlippage = flashClient.getPriceAfterSlippage(
        true,
        new BN(slippageBps),
        outputTokenPrice,
        side
    )

    const collateralWithFee = uiDecimalsToNative(inputAmount, inputToken.decimals);
    const leverage = 1.1;

    const inputCustody = POOL_CONFIG.custodies.find(c => c.symbol === inputToken.symbol)!;
    const outputCustody = POOL_CONFIG.custodies.find(c => c.symbol === outputToken.symbol)!;

    const custodies = await flashClient.program.account.custody.fetchMultiple([inputCustody.custodyAccount, outputCustody.custodyAccount]);
    const poolAccount = PoolAccount.from(POOL_CONFIG.poolAddress, await flashClient.program.account.pool.fetch(POOL_CONFIG.poolAddress));

    const allCustodies = await flashClient.program.account.custody.all()

    const lpMintData = await getMint(flashClient.provider.connection, POOL_CONFIG.stakedLpTokenMint);

    const poolDataClient = new PoolDataClient(
        POOL_CONFIG,
        poolAccount,
        lpMintData,
        [...allCustodies.map(c => CustodyAccount.from(c.publicKey, c.account))],
    )

    let lpStats = poolDataClient.getLpStats(await getPrices())

    const inputCustodyAccount = CustodyAccount.from(inputCustody.custodyAccount, custodies[0]!);
    const ouputCustodyAccount = CustodyAccount.from(outputCustody.custodyAccount, custodies[1]!);
    
    const size = flashClient.getSizeAmountWithSwapSync(
        collateralWithFee,
        leverage.toString(),
        Side.Long,
        poolAccount,
        inputTokenPrice,
        inputTokenPriceEma,
        inputCustodyAccount,
        outputTokenPrice,
        outputTokenPriceEma,
        ouputCustodyAccount,
        outputTokenPrice,
        outputTokenPriceEma,
        ouputCustodyAccount,
        outputTokenPrice,
        outputTokenPriceEma,
        ouputCustodyAccount,
        lpStats.totalPoolValueUsd,
        POOL_CONFIG,
        uiDecimalsToNative(`${5}`, 2)
    )

    const minAmountOut = flashClient.getSwapAmountAndFeesSync(
        collateralWithFee,
        BN_ZERO,
        poolAccount,
        inputTokenPrice,
        inputTokenPriceEma,
        CustodyAccount.from(inputCustody.custodyAccount, custodies[0]!),
        outputTokenPrice,
        outputTokenPriceEma,
        CustodyAccount.from(outputCustody.custodyAccount, custodies[1]!),
        lpStats.totalPoolValueUsd,
        POOL_CONFIG
    ).minAmountOut

    const minAmountOutAfterSlippage = minAmountOut
        .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
        .div(new BN(10 ** BPS_DECIMALS))

    const openPositionData = await flashClient.openPositionWithSwap(
        outputToken.symbol,
        outputToken.symbol,
        inputToken.symbol,
        collateralWithFee,
        minAmountOutAfterSlippage,
        priceAfterSlippage,
        size,
        side,
        POOL_CONFIG,
        POOL_CONFIG,
        new PublicKey('...'), // nftTradingAccount,
        new PublicKey('...'), // nftRerralAccount
        new PublicKey('...'),
        Privilege.Referral
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // addLiquidity
    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('trx :>> ', trxId);
}

const closePositionWithSwap = async (userRecievingTokenSymbol: string) => {  
    const slippageBps: number = 800 // 0.8%

    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    const positions = await flashClient.getUserPositions(flashClient.provider.publicKey, POOL_CONFIG);

    const positionToClose = positions[1];

    const marketConfig = POOL_CONFIG.markets.find(f => f.marketAccount.equals(positionToClose.market))!;

    const custodies = await flashClient.program.account.custody.fetchMultiple([marketConfig.targetCustody, marketConfig.collateralCustody]);

    const userRecievingToken = POOL_CONFIG.tokens.find(t => t.symbol === userRecievingTokenSymbol)!;
    const targetCustodyAccount = CustodyAccount.from(marketConfig.targetCustody, custodies[0]!);
    const collateralCustodyAccount = CustodyAccount.from(marketConfig.collateralCustody, custodies[1]!);
    const side = marketConfig.side!;
    const positionAccount = PositionAccount.from(positionToClose.pubkey, positionToClose);;

    const targetToken = POOL_CONFIG.tokens.find(t => t.mintKey.equals(marketConfig.targetMint))!;
    const collateralToken = POOL_CONFIG.tokens.find(t => t.mintKey.equals(marketConfig.collateralMint))!;

    const priceMap = await getPrices()

    const targetTokenPrice = priceMap.get(targetToken.symbol)!.price
    const targetTokenPriceEma = priceMap.get(targetToken.symbol)!.emaPrice
    const collateralTokenPrice = priceMap.get(collateralToken.symbol)!.price
    const collateralTokenPriceEma = priceMap.get(collateralToken.symbol)!.emaPrice
    const userRecievingTokenPrice = priceMap.get(userRecievingToken.symbol)!.price

    const { closeAmount, feesAmount } = flashClient.getFinalCloseAmountSync(
        positionAccount,
        marketConfig.targetCustody.equals(marketConfig.collateralCustody),
        marketConfig.side,
        targetTokenPrice,
        targetTokenPriceEma,
        targetCustodyAccount,
        collateralTokenPrice,
        collateralTokenPriceEma,
        collateralCustodyAccount,
        new BN(getUnixTs()),
        POOL_CONFIG
    )

    const receiveUsd = collateralTokenPrice.getAssetAmountUsd(closeAmount, collateralToken.decimals)

    const minAmountOut = userRecievingTokenPrice.getTokenAmount(
        receiveUsd,
        userRecievingToken.decimals
    )

    const priceAfterSlippage = flashClient.getPriceAfterSlippage(false, new BN(slippageBps), targetTokenPrice, side)

    const minAmountOutWithSlippage = minAmountOut
        .mul(new BN(100 - Number(0.8)))
        .div(new BN(100))
    
    const closePositionWithSwapData = await flashClient.closePositionWithSwap(
        targetToken.symbol,
        userRecievingToken.symbol,
        collateralToken.symbol,
        minAmountOutWithSlippage,
        priceAfterSlippage,
        side,
        POOL_CONFIG,
        POOL_CONFIG,
        new PublicKey('...'), // nftTradingAccount,
        new PublicKey('...'), // nftRerralAccount
        new PublicKey('...'),
        Privilege.Referral
    )

    instructions.push(...closePositionWithSwapData.instructions)
    additionalSigners.push(...closePositionWithSwapData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // addLiquidity
    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions])

    console.log('trx :>> ', trxId);
}

const getLpTokenPrices = async () => {
    const stakedLpPrice = await flashClient.getStakedLpTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG); // sFLP price
    const compoundingLPTokenPrice = await flashClient.getCompoundingLPTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG); // FLP price

    console.log('stakedLpPrice :>> ', stakedLpPrice);
    console.log('compoundingLPTokenPrice :>> ', compoundingLPTokenPrice);
}
