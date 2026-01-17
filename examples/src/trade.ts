import dotenv from 'dotenv';
import { BN_ZERO, BPS_DECIMALS, CustodyAccount, getUnixTs, OraclePrice, PerpetualsClient, PoolAccount, PoolConfig, PoolDataClient, PositionAccount, Privilege, Side, uiDecimalsToNative } from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { TransactionInstruction, Signer, PublicKey, ComputeBudgetProgram, Connection, AddressLookupTableAccount } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, getMint } from '@solana/spl-token';
import { PriceData, PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';


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

// export const POOL_CONFIG = PoolConfig.fromIdsByName('Ore.1', 'mainnet-beta');
export const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');


export const RPC_URL = process.env.RPC_URL;
console.log("RPC_URL:>> ", RPC_URL);
if (!RPC_URL) {
    throw new Error('RPC_URL is not set');
}




export const PYTHNET_URL = process.env.PYTHNET_URL!;
console.log("PYTHNET_URL:>> ", PYTHNET_URL);
if (!PYTHNET_URL) {
    throw new Error('PYTHNET_URL is not set');
}

const connectionFromPyth = new Connection(
    PYTHNET_URL
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
        BN_ZERO // discountBps
    )

    const openPositionData = await flashClient.openPosition(
        outputToken.symbol,
        inputToken.symbol,
        priceAfterSlippage,
        collateralWithFee,
        outputAmount,
        side,
        POOL_CONFIG,
        Privilege.None, //Privilege.Referral, // if you own the nft, set this to Privilege.NFT
        // new PublicKey('...'), // nftTradingAccount,
        // new PublicKey('...'), // nftRerralAccount
        // new PublicKey('...'), // nftRebateTokenAccount
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // open position
    const setCUPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 50
    })

    let addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, setCUPriceIx, ...instructions], { 
        alts : addresslookupTables
    })

    console.log('trx main :>> ',  `: https://explorer.solana.com/tx/${trxId}`);
    // console.log('trx dev:>> ',  `: https://explorer.solana.com/tx/${trxId}?cluster=devnet`);
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
        Privilege.None, // Privilege.Referral, // if you own the nft, set this to Privilege.NFT
        // new PublicKey('...'), // nftTradingAccount,
        // new PublicKey('...'), // nftRerralAccount
        // new PublicKey('...'), // nftRebateTokenAccount
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // addLiquidity

    let addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables
    
    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], { 
        alts : addresslookupTables
    })
    console.log('trx main :>> ',  `: https://explorer.solana.com/tx/${trxId}`);
    // console.log('trx dev:>> ',  `: https://explorer.solana.com/tx/${trxId}?cluster=devnet`);
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
         BN_ZERO // discountBps //uiDecimalsToNative(`${5}`, 2)
    )


    const openPositionData = await flashClient.swapAndOpen(
        outputToken.symbol,
        outputToken.symbol,
        inputToken.symbol,
        collateralWithFee,
        priceAfterSlippage,
        size,
        side,
        POOL_CONFIG,
        Privilege.None, //Privilege.Referral,
        // new PublicKey('...'), // nftTradingAccount,
        // new PublicKey('...'), // nftRerralAccount
        // new PublicKey('...'),
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) 
    
    let addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions] ,{ 
        alts : addresslookupTables,
        additionalSigners: additionalSigners
    })

     console.log('trx main :>> ',  `: https://explorer.solana.com/tx/${trxId}`);
    // console.log('trx dev:>> ',  `: https://explorer.solana.com/tx/${trxId}?cluster=devnet`);
}

const closePositionWithSwap = async ( positionPubKey : PublicKey, userRecievingTokenSymbol: string) => {  
    const slippageBps: number = 800 // 0.8%

    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    const positions = await flashClient.getUserPositions(flashClient.provider.publicKey, POOL_CONFIG);

    const positionToClose =  positions.find(p => p.pubkey.equals(positionPubKey));
    if(!positionToClose){
        throw new Error('position not found')
    }

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

    

    const priceAfterSlippage = flashClient.getPriceAfterSlippage(false, new BN(slippageBps), targetTokenPrice, side)

   
    
    const closePositionWithSwapData = await flashClient.closeAndSwap(
        targetToken.symbol,
        userRecievingToken.symbol,
        collateralToken.symbol,
        priceAfterSlippage,
        side,
        POOL_CONFIG,
        Privilege.None, //Privilege.Referral,
        // new PublicKey('...'), // nftTradingAccount,
        // new PublicKey('...'), // nftRerralAccount
        // new PublicKey('...'),
    )

    instructions.push(...closePositionWithSwapData.instructions)
    additionalSigners.push(...closePositionWithSwapData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // addLiquidity

     let addresslookupTables: AddressLookupTableAccount[] = (
            await flashClient.getOrLoadAddressLookupTable(POOL_CONFIG)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], { 
        alts : addresslookupTables
        
    })

    console.log('trx main :>> ',  `: https://explorer.solana.com/tx/${trxId}`);
    // console.log('trx dev:>> ',  `: https://explorer.solana.com/tx/${trxId}?cluster=devnet`);
}


const getLiquidationPrice = async (positionPubKey : PublicKey) => {
   
    const data =  await flashClient.getLiquidationPriceView(positionPubKey, POOL_CONFIG)
    if(!data){
        throw new Error('position not found')
    }

     const LiqOraclePrice = OraclePrice.from({
                        price: data.price,
                        exponent: new BN(data.exponent),
                        confidence: new BN(0),
                        timestamp: new BN(0),
                    })

    console.log('price :>> ', LiqOraclePrice.toUiPrice(6) );
    return LiqOraclePrice.toUiPrice(6) // 6 is the decimals precision for liquidation price, you can change it based on your needs
}



(async () => {

    console.log(" testing... uncomment below to test");


  // NOTE: choose the correct POOL_CONFIG based on the pool you want to interact (check readme)

     await openPosition('SOL', 'SOL', '0.3', Side.Long)
    //  await openPosition('ORE', 'ORE', '1', Side.Long)
     console.log("openPosition done");

    // await closePosition('SOL', Side.Long);
    // console.log("closePosition done");

    // NOTE use openPositionWithSwap only when you want to swap and open 
    // await openPositionWithSwap('USDC', 'ORE', '2', Side.Long)
    // await openPositionWithSwap('USDC', 'SOL', '2', Side.Long)
    // console.log("openPositionWithSwap done");


    // const positions = await flashClient.getUserPositions(flashClient.provider.publicKey, POOL_CONFIG);
    // if(!positions.length){
    //      throw new Error('no positions to close');
    // }
    // const closePositionPubKey = positions[0].pubkey
    // // NOTE use closePositionWithSwap only when you want to close and swap 
    // await closePositionWithSwap(closePositionPubKey, 'USDC')
    //  console.log("closePositionWithSwap done");

    // await getLiquidationPrice(new PublicKey('4hXHkgakfMxRo1TMYbT6iFUET7748VYs9CY8GVjZsDT1'));

})()
