import { AnchorProvider } from "@coral-xyz/anchor";
import { ComputeBudgetProgram, Connection, Keypair, MessageV0, PublicKey, Signer, TransactionInstruction, VersionedTransaction } from "@solana/web3.js";
import { BN_ZERO, CustodyAccount, OraclePrice, PerpetualsClient, PoolConfig, Position, PositionAccount, Privilege, Side, confirmTransaction, confirmTransactionV2, isVariant, uiDecimalsToNative } from "flash-sdk";
import { readFileSync } from "fs";
import { confirmTransactionV3 } from "./rpcUtils";
import { PriceData, PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client'
import { BN } from "bn.js";
import dotenv from 'dotenv';
dotenv.config();

// NOTE : SET your RPC URL AND KEYPAIR PATH HERE
const url =  process.env["RPC_URL"] ?? 'https://xxxxx';
const adminKey = process.env["KEYPAIR_PATH"] ?? "/Users/xxx/.config/solana/xxxx.json";
// https://docs.pyth.network/price-feeds/api-instances-and-providers/pythnet-rpc 
const PYTHNET_RPC_URL = process.env["PYTHNET_RPC_URL"] ?? 'https://xxxxx'
console.log("url:",url , "adminKey:",adminKey, "PYTHNET_RPC_URL:",PYTHNET_RPC_URL)

const connectionFromPyth = new Connection( PYTHNET_RPC_URL)


let client: PerpetualsClient;

const POOL_CONFIG = PoolConfig.fromIdsByName("Crypto.1", 'mainnet-beta')
const composabilityProgramId = POOL_CONFIG.perpComposibilityProgramId;
const fbNftRewardProgramId = POOL_CONFIG.fbNftRewardProgramId;

const initClient = (clusterUrl: string, adminKeyPath: string, programId: PublicKey) => {
    process.env["ANCHOR_WALLET"] = adminKeyPath;
    const provider: AnchorProvider = AnchorProvider.local(clusterUrl, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
        skipPreflight: false
    });

    client = new PerpetualsClient(provider, programId, composabilityProgramId, fbNftRewardProgramId, fbNftRewardProgramId, null);
    client.log("Client Initialized");
}


const programId = POOL_CONFIG.programId;
const payer = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(readFileSync(adminKey).toString()))
);
console.log("payer: ", payer.publicKey.toBase58()); 



const openLongPosition = async () => {

    const slippageBps: number = 800 // 0.8%
    const instructions: TransactionInstruction[] = []

    let additionalSigners: Signer[] = []
    const outputToken = POOL_CONFIG.tokens.find(t => t.symbol === 'SOL')!;
    const inputToken = POOL_CONFIG.tokens.find(t => t.symbol === 'USDC')!;
    const inputAmount = '2';
    const side = Side.Short;

    const pythClient = new PythHttpClient(connectionFromPyth, getPythProgramKeyForCluster('pythnet'))
    const pythHttpClientResult = await pythClient.getData()

    const inputTokenPriceData: PriceData = pythHttpClientResult.productPrice.get(inputToken.pythTicker)!
    const outputTokenPriceData: PriceData = pythHttpClientResult.productPrice.get(outputToken.pythTicker)!

    const inputTokenPrice = new OraclePrice({
        price: new BN(inputTokenPriceData?.aggregate.priceComponent.toString()),
        exponent: new BN(inputTokenPriceData?.exponent),
        confidence: new BN(inputTokenPriceData?.confidence!),
        timestamp: new BN(inputTokenPriceData?.timestamp.toString()),
    })

    const inputTokenPriceEma = new OraclePrice({
        price: new BN(inputTokenPriceData?.emaPrice.valueComponent.toString()),
        exponent: new BN(inputTokenPriceData?.exponent),
        confidence: new BN(inputTokenPriceData?.emaConfidence.valueComponent.toString()),
        timestamp: new BN(inputTokenPriceData?.timestamp.toString()),
    })

    const outputTokenPrice = new OraclePrice({
        price: new BN(outputTokenPriceData?.aggregate.priceComponent.toString()),
        exponent: new BN(outputTokenPriceData?.exponent),
        confidence: new BN(outputTokenPriceData?.confidence!),
        timestamp: new BN(outputTokenPriceData?.timestamp.toString()),
    })

    const outputTokenPriceEma = new OraclePrice({
        price: new BN(outputTokenPriceData?.emaPrice.valueComponent.toString()),
        exponent: new BN(outputTokenPriceData?.exponent),
        confidence: new BN(outputTokenPriceData?.emaConfidence.valueComponent.toString()),
        timestamp: new BN(outputTokenPriceData?.timestamp.toString()),
    })

    await client.loadAddressLookupTable(POOL_CONFIG)

    const priceAfterSlippage = client.getPriceAfterSlippage(
        true,
        new BN(slippageBps),
        inputTokenPrice,
        side
    )

    const collateralWithFee = uiDecimalsToNative(inputAmount, inputToken.decimals);
    const leverage = 1.1;

    const outputCustody = POOL_CONFIG.custodies.find(c => c.symbol === inputToken.symbol)!;
    const inputCustody = POOL_CONFIG.custodies.find(c => c.symbol === outputToken.symbol)!;

    const custodies = await client.program.account.custody.fetchMultiple([outputCustody.custodyAccount, inputCustody.custodyAccount]);

    const outputAmount = client.getSizeAmountFromLeverageAndCollateral( //
        collateralWithFee,
        leverage.toString(),
        outputToken,
        inputToken,
        side,
        outputTokenPrice,
        outputTokenPriceEma,
        CustodyAccount.from(outputCustody.custodyAccount, custodies[0]!),
        inputTokenPrice,
        inputTokenPriceEma,
        CustodyAccount.from(inputCustody.custodyAccount, custodies[1]!),
        uiDecimalsToNative(`5`, 2)
    )

    console.log('outputAmount :>> ', outputAmount.toString());

    const openPositionData = await client.openPosition(
        outputToken.symbol,
        inputToken.symbol,
        priceAfterSlippage,
        collateralWithFee,
        outputAmount,
        side,
        POOL_CONFIG,
        PublicKey.default, // nftTradingAccount,
        PublicKey.default, // nftRerralAccount
        PublicKey.default, // nftRebateTokenAccount  
        Privilege.None, // if you own the nft, set this to Privilege.NFT
    )
    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    return {
        instructions,
        additionalSigners
    }

    
}

const main = async () => {
    initClient(url, adminKey, programId);
    

    const { instructions , additionalSigners} =  await openLongPosition()

    await client.loadAddressLookupTable(POOL_CONFIG);

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 500_000 })
    const setCUPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 10
    })


    console.log("instructions:",instructions.length)

    const trx = await client.sendTransaction([setCULimitIx, setCUPriceIx, ...instructions], {
        additionalSigners,
        alts: client.addressLookupTables,
    });

    const connection = client.provider.connection
    const latestBlockhash = (await connection.getLatestBlockhash('processed'))


    const message = MessageV0.compile({
        payerKey: client.provider.publicKey,
        instructions: [setCULimitIx, setCUPriceIx,  ...instructions],
        recentBlockhash: latestBlockhash.blockhash,
        addressLookupTableAccounts: client.addressLookupTables,
    })

    // OLD way
    let vtx = new VersionedTransaction(message)
    if (additionalSigners.length) {
        vtx.sign([...additionalSigners])
    }
    
   
    
    console.log('tx :>> ', `https://explorer.solana.com/tx/${trx}`);
    await confirmTransaction(client.provider,trx);

    const x = await confirmTransactionV3(client.provider, vtx, trx)
    console.log("x",x)

    // await confirmTransactionV2(client.provider,trx);/


}

main()


