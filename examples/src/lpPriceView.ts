import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { AddressLookupTableAccount, Cluster, ComputeBudgetProgram, PublicKey, RpcResponseAndContext, SimulatedTransactionResponse, SYSVAR_INSTRUCTIONS_PUBKEY,
    Connection,
     Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { BN_ZERO, IDL, IdlCoder, PerpetualsClient, PoolConfig, } from "flash-sdk";
import { decode } from '@coral-xyz/anchor/dist/cjs/utils/bytes/base64'
import fetch from 'node-fetch'; 


// NOTE : SET your RPC URL AND KEYPAIR PATH HERE
const url = process.env["RPC_URL"] ?? 'https://xxxxx';
const signerKeyPath = process.env["KEYPAIR_PATH"] ?? "/Users/xxx/.config/solana/xxxx.json";
console.log("url:",url, process.env["RPC_URL"],  "signerKeyPath:",signerKeyPath)

// use SDK version :  "flash-sdk": "2.13.7", 
//  command :  yarn add flash-sdk@2.13.7       


let client: PerpetualsClient;

const DEFAULT_CLUSTER: Cluster = 'mainnet-beta'
const POOL_NAMES =  ['Crypto.1','Virtual.1','Governance.1','Community.1','Community.2']
console.log('POOL_NAMES:', POOL_NAMES)
const POOL_CONFIGS = POOL_NAMES.map((f) => PoolConfig.fromIdsByName(f, DEFAULT_CLUSTER))

const composabilityProgramId = POOL_CONFIGS[0].perpComposibilityProgramId;
const fbNftRewardProgramId = POOL_CONFIGS[0].fbNftRewardProgramId;
const fbRewardDistributionProgramId = POOL_CONFIGS[0].rewardDistributionProgram.programId;
const PROGRAM_ID = POOL_CONFIGS[0].programId;


const initClient = (clusterUrl: string, adminKeyPath: string, programId: PublicKey) => {
    process.env["ANCHOR_WALLET"] = adminKeyPath;
    const provider: AnchorProvider = AnchorProvider.local(clusterUrl, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
        skipPreflight: true
    });

    client = new PerpetualsClient(provider, programId, composabilityProgramId, fbNftRewardProgramId,fbRewardDistributionProgramId, null);
    client.log("Client Initialized");
}

let addressLookupTableAddresses: AddressLookupTableAccount[] = [] ;

const API_ENDPOINT =  'https://api.prod.flash.trade'
 async function createBackupOracleInstruction(poolAddress: string) {
    try {
        const backupOracleData: any = await (
            await fetch(`${API_ENDPOINT}/backup-oracle/prices?poolAddress=${poolAddress}`)
        ).json()

        const backUpOracleInstruction = new TransactionInstruction({
            keys: backupOracleData.keys,
            programId: new PublicKey(backupOracleData.programId),
            data: Buffer.from(backupOracleData.data),
        })
        // console.log("backupOracleData:", backupOracleData)
        return [backUpOracleInstruction]
    } catch (error) {
        console.error('Error creating backup oracle instruction:', error)
    }
    return []
}

const decodeLogs = <T>(
    data: RpcResponseAndContext<SimulatedTransactionResponse>,
    instructionNumber: number,
    instructionName = ''
): T | undefined => {
    try {
        const returnPrefix = `Program return: ${PROGRAM_ID} `
        // console.log("Data:",data);
        if (data.value.logs && data.value.err === null) {
            let returnLog = data.value.logs.find((l: any) => l.startsWith(returnPrefix))
            if (!returnLog) {
                throw new Error('View expected return log')
            }
            let returnData = decode(returnLog.slice(returnPrefix.length))
            // @ts-ignore
            let returnType = IDL.instructions[instructionNumber].returns

            if (!returnType) {
                throw new Error('View expected return type')
            }
            const coder = IdlCoder.fieldLayout(
                { type: returnType },
                Array.from([...(IDL.accounts ?? []), ...(IDL.types ?? [])])
            )
            // return coder.decode(returnData);
            // console.log("coder.decode(returnData); ::: ", coder.decode(returnData));
            return coder.decode(returnData)
        } else {
            console.error('No Logs Found : name : data:', instructionName, data)
            console.error('Logs err::', data.value.logs?.toString())

            throw new Error(`FLASH No Logs Found `)
        }
    } catch (error) {
        console.log(error)
    }
}

const getLpTokenPrice = async (poolKey: PublicKey, POOL_CONFIG: PoolConfig): Promise<string> => {

    // const View = new ViewHelper(client.provider.connection, client.provider)
    // await View.loadAddressLookupTables(POOL_CONFIG)

    let program = new Program(IDL, PROGRAM_ID, client.provider)

   
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58())

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
        custodyMetas.push({
            isSigner: false,
            isWritable: false,
            pubkey: token.custodyAccount,
        })
    }
    for (const custody of custodies) {
        custodyMetas.push({
            isSigner: false,
            isWritable: false,
            pubkey: custody.intOracleAccount,
        })
    }

    for (const market of POOL_CONFIG.markets) {
        marketMetas.push({
            pubkey: market.marketAccount,
            isSigner: false,
            isWritable: false,
        })
    }

    let transaction = await program.methods
        .getLpTokenPrice({})
        .accounts({
            perpetuals: POOL_CONFIG.perpetuals,
            pool: poolKey,
            lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .remainingAccounts([...custodyMetas, ...marketMetas])
        .transaction()

    const backUpOracleInstruction = await backUpOracleInstructionPromise
    // console.log('>> getLpTokenPrice backUpOracleInstruction:', backUpOracleInstruction)

    transaction.instructions.unshift(...backUpOracleInstruction)

    // 
    transaction.feePayer = client.admin
    let latestBlockhash = await client.provider.connection.getLatestBlockhash('confirmed')

    const messageV0 = new TransactionMessage({
        payerKey: client.provider.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: transaction.instructions,
    }).compileToV0Message(addressLookupTableAddresses)

    const transaction2 = new VersionedTransaction(messageV0)
    const result =  await client.provider.connection.simulateTransaction(transaction2, { sigVerify: false, replaceRecentBlockhash: true })
    // const result = await simulateTransaction(transaction)

    const index = IDL.instructions.findIndex((f) => f.name === 'getLpTokenPrice')
    const res: any = decodeLogs(result, index, 'getLpTokenPrice')

    return res.toString()
}


const main = async () => {
    initClient(url, signerKeyPath, PROGRAM_ID);
    // console.log("POOL_CONFIGS:",POOL_CONFIGS)


    const addresses: AddressLookupTableAccount[] = []

    for (const address of POOL_CONFIGS[0].addressLookupTableAddresses) {
        const addressLookupTable = (await client.provider.connection.getAddressLookupTable(address)).value
        if (addressLookupTable) {
            addresses.push(addressLookupTable)
        }
    }
    addressLookupTableAddresses = addresses


    for (let index = 0; index < POOL_CONFIGS.length; index++) {
        try {
            const POOL_CONFIG = POOL_CONFIGS[index];

            const lpTokenPriceUSD = await getLpTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG)
    
            const priceUi = Number(lpTokenPriceUSD) / 10**6
            
            console.log("POOL_CONFIG.poolAddress:",POOL_CONFIG.poolAddress.toBase58(), "POOL_CONFIG.lpTokenSymbol", POOL_CONFIG.stakedLpTokenSymbol  ,"lpTokenPriceUSD :" ,lpTokenPriceUSD , "priceUi:",priceUi)
            
        } catch (error) {
            console.error("err: ",error)
        }
       
    }
   
}

main()