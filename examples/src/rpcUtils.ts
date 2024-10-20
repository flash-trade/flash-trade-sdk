import { AnchorProvider } from '@coral-xyz/anchor'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import {
    AddressLookupTableAccount,
    BlockhashWithExpiryBlockHeight,
    Commitment,
    ComputeBudgetProgram,
    MessageV0,
    Signer,
    TransactionInstruction,
    VersionedTransaction,
} from '@solana/web3.js'


export interface SendTransactionOpts {
    // @ts-ignore
    postSendTxCallback?: ({ txid }) => void
    latestBlockhash?: BlockhashWithExpiryBlockHeight
    preflightCommitment?: Commitment
    prioritizationFee?: number
    additionalSigners?: Signer[]
    alts?: AddressLookupTableAccount[]
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))



export async function sendTransactionV3(
    provider: AnchorProvider,
    ixs: TransactionInstruction[],
    opts: SendTransactionOpts = {}
) {
    const connection = provider.connection
    const latestBlockhash =
        opts.latestBlockhash ??
        (await connection.getLatestBlockhash(
            opts.preflightCommitment ?? provider.opts.preflightCommitment ?? 'finalized'
        ))

    const payer = (provider as AnchorProvider).wallet
   

    const message = MessageV0.compile({
        payerKey: (provider as AnchorProvider).wallet.publicKey,
        instructions: ixs,
        recentBlockhash: latestBlockhash.blockhash,
        addressLookupTableAccounts: opts.alts,
    })

    // OLD way
    let vtx = new VersionedTransaction(message)
    if (opts?.additionalSigners?.length) {
        vtx.sign([...opts?.additionalSigners])
    }

    if (
        typeof payer.signTransaction === 'function' &&
        !(payer instanceof NodeWallet || payer.constructor.name == 'NodeWallet')
    ) {
        vtx = (await payer.signTransaction(vtx as any)) as unknown as VersionedTransaction
    } else {
        // Maybe this path is only correct for NodeWallet?
        vtx.sign([(payer as any).payer as Signer])
    }

    bs58.encode(vtx.serialize())   
    const signature = await connection.sendTransaction(vtx, {
        skipPreflight: true, // mergedOpts.skipPreflight,
        maxRetries: 0,
    })

    return { signature, versionedTransaction: vtx }
}

export async function confirmTransactionV3(
    provider: AnchorProvider,
    versionedTransaction: VersionedTransaction,
    signature: string,
    opts: any = {}
): Promise<string> {
    const connection = provider.connection
    let status: any
    //   let done = false;
    const blockhashResponse = await connection.getLatestBlockhashAndContext()
    const lastValidBlockHeight = blockhashResponse.context.slot + 150
    let blockheight = await connection.getBlockHeight()

    while (blockheight < lastValidBlockHeight) {
        console.log('inside while :', signature, blockheight, lastValidBlockHeight)
        const signatureStatuses = await connection.getSignatureStatuses([signature])
        const result = signatureStatuses && signatureStatuses.value[0]
        console.log('result:', result, signatureStatuses.value[0])
        if (!result) {
            // console.log('REST null result for', txid, result);
        } else if (result.err) {
            // console.log('REST error for', txid, result);
            //   done = true;
            status = result // shouln't user result.err here
            console.log('breakinng with err', result.err)
            break
            // @ts-ignore
        } else if (!['processed', 'confirmed', 'finalized'].includes(result.confirmationStatus)) {
            // console.log('REST not confirmed', txid, result);
        } else {
            // console.log('REST confirmed', txid, result);
            //   done = true;
            status = result
            console.log('breakinng with susccess', result)
            break
        }
        console.log('status:', status)

      
        const x = await connection.sendTransaction(versionedTransaction, {
            skipPreflight: true, // mergedOpts.skipPreflight,
            maxRetries: 0,
        })
        console.log('retyr send :', x)
        await sleep(2_000)
        blockheight = await connection.getBlockHeight()
    }


    if (status.err) {
        console.warn('Tx status: ', status)
        throw new TransactionFailError({
            txid: signature,
            message: `${JSON.stringify(status)}`,
        })
    }
    return signature
}

export class TransactionFailError extends Error {
    message: string
    txid: string
    // @ts-ignore
    constructor({ txid, message }) {
        super()
        this.message = message
        this.txid = txid
    }
}

export const createComputeBudgetIx = (microLamports: number): TransactionInstruction => {
    const computeBudgetIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports,
    })
    return computeBudgetIx
}
