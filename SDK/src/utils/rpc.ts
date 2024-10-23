import { AnchorProvider } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import {
  AddressLookupTableAccount,
  BlockhashWithExpiryBlockHeight,
  Commitment,
  ComputeBudgetProgram,
  MessageV0,
  Signer,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';

export interface SendTransactionOpts {
  postSendTxCallback?: ({ txid }) => void;
  latestBlockhash?: BlockhashWithExpiryBlockHeight;
  preflightCommitment?: Commitment;
  prioritizationFee?: number;
  additionalSigners?: Signer[];
  alts?: AddressLookupTableAccount[];
}

export async function sendTransaction(
  provider: AnchorProvider,
  ixs: TransactionInstruction[],
  opts: SendTransactionOpts = {},
): Promise<string> {
  const connection = provider.connection;
  const latestBlockhash =
    opts.latestBlockhash ??
    (await connection.getLatestBlockhash(
      opts.preflightCommitment ??
      provider.opts.preflightCommitment ??
      'finalized',
    ));

  const payer = (provider as AnchorProvider).wallet;

  if (opts.prioritizationFee) {
    ixs = [...ixs, createComputeBudgetIx(opts.prioritizationFee)];
  }

  const message = MessageV0.compile({
    payerKey: (provider as AnchorProvider).wallet.publicKey,
    instructions: ixs,
    recentBlockhash: latestBlockhash.blockhash,
    addressLookupTableAccounts: opts.alts,
  });

  let vtx = new VersionedTransaction(message);
  if (opts?.additionalSigners?.length) {
    vtx.sign([...opts?.additionalSigners]);
  }

  if (
    typeof payer.signTransaction === 'function' &&
    !(payer instanceof NodeWallet || payer.constructor.name == 'NodeWallet')
  ) {
    vtx = (await payer.signTransaction(
      vtx as any,
    )) as unknown as VersionedTransaction;
  } else {
    // Maybe this path is only correct for NodeWallet?
    vtx.sign([(payer as any).payer as Signer]);
  }

  //  way-1
  // const signature = await connection.sendRawTransaction(vtx.serialize(), {
  //   skipPreflight: true, // mergedOpts.skipPreflight,
  // });

  //  way-2
  const signature = await connection.sendTransaction(vtx, {
    skipPreflight: true, // mergedOpts.skipPreflight,
    // maxRetries : 0
  });

  return signature;
}

export async function confirmTransaction(
  provider: AnchorProvider,
  signature: string,
  opts: any = {},
): Promise<string> {
  const connection = provider.connection;
  const latestBlockhash =
    opts.latestBlockhash ??
    (await connection.getLatestBlockhash(
      opts.preflightCommitment ??
      provider.opts.preflightCommitment ??
      'finalized',
    ));

  const txConfirmationCommitment = opts.txConfirmationCommitment ?? 'processed';
  let status: any;
  if (
    latestBlockhash.blockhash != null &&
    latestBlockhash.lastValidBlockHeight != null
  ) {
    status = (
      await connection.confirmTransaction(
        {
          signature: signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        txConfirmationCommitment,
      )
    ).value;
  } else {
    status = (
      await connection.confirmTransaction(signature, txConfirmationCommitment)
    ).value;
  }

  if (status.err) {
    console.warn('Tx status: ', status);
    throw new TransactionFailError({
      txid: signature,
      message: `${JSON.stringify(status)}`,
    });
  }
  return signature;
}

// --- TESTT
export async function sendTransactionV2(
  provider: AnchorProvider,
  ixs: TransactionInstruction[],
  opts: SendTransactionOpts = {},
) {
  const connection = provider.connection;
  const latestBlockhash =
    opts.latestBlockhash ??
    (await connection.getLatestBlockhash(
      opts.preflightCommitment ??
      provider.opts.preflightCommitment ??
      'finalized',
    ));

  const payer = (provider as AnchorProvider).wallet;

  if (opts.prioritizationFee) {
    ixs = [...ixs, createComputeBudgetIx(opts.prioritizationFee)];
  }

  const message = MessageV0.compile({
    payerKey: (provider as AnchorProvider).wallet.publicKey,
    instructions: ixs,
    recentBlockhash: latestBlockhash.blockhash,
    addressLookupTableAccounts: opts.alts,
  });

  // OLD way 
  let vtx = new VersionedTransaction(message);
  if (opts?.additionalSigners?.length) {
    vtx.sign([...opts?.additionalSigners]);
  }

  if (
    typeof payer.signTransaction === 'function' &&
    !(payer instanceof NodeWallet || payer.constructor.name == 'NodeWallet')
  ) {
    vtx = (await payer.signTransaction(
      vtx as any,
    )) as unknown as VersionedTransaction;
  } else {
    // Maybe this path is only correct for NodeWallet?
    vtx.sign([(payer as any).payer as Signer]);
  }

  //  way-1
  // const signature = await connection.sendRawTransaction(vtx.serialize(), {
  //   skipPreflight: true, // mergedOpts.skipPreflight,
  //   // maxRetries: 0,
  // });

  //  way-2
  const signature = await connection.sendTransaction(vtx, {
    skipPreflight: true, // mergedOpts.skipPreflight,
    // maxRetries : 0
  });

  return {signature , versionedTransaction: vtx };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


export async function confirmTransactionV2(
  provider: AnchorProvider,
  versionedTransaction : VersionedTransaction,
  signature: string,
  opts: any = {},
): Promise<string> {
  const connection = provider.connection;
  let status: any;
  let done = false;
  const blockhashResponse = await connection.getLatestBlockhashAndContext();
  const lastValidBlockHeight = blockhashResponse.context.slot + 150;
  let blockheight = await connection.getBlockHeight();
  while (blockheight < lastValidBlockHeight && !done) {
    const signatureStatuses = await connection.getSignatureStatuses([signature]);
    const result = signatureStatuses && signatureStatuses.value[0];

    if (!result) {
      // console.log('REST null result for', txid, result);
    } else if (result.err) {
      // console.log('REST error for', txid, result);
      done = true;
      status = (result.err);
    } else if (!(['processed','confirmed','finalized'].includes(result.confirmationStatus))) {
      // console.log('REST not confirmed', txid, result);
    } else {
      // console.log('REST confirmed', txid, result);
      done = true;
      status = (result);
    }
    const x = await connection.sendTransaction(versionedTransaction, {
      skipPreflight: true, // mergedOpts.skipPreflight,
      // maxRetries : 0
    });
    await sleep(1000);
    blockheight = await connection.getBlockHeight();
  }

  // const latestBlockhash =
  // opts.latestBlockhash ??
  // (await connection.getLatestBlockhash(
  //   opts.preflightCommitment ??
  //   provider.opts.preflightCommitment ??
  //   'finalized',
  // ));
  // const txConfirmationCommitment = opts.txConfirmationCommitment ?? 'processed';
  // if (
  //   latestBlockhash.blockhash != null &&
  //   latestBlockhash.lastValidBlockHeight != null
  // ) {
  //   status = (
  //     await connection.confirmTransaction(
  //       {
  //         signature: signature,
  //         blockhash: latestBlockhash.blockhash,
  //         lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  //       },
  //       txConfirmationCommitment,
  //     )
  //   ).value;
  // } else {
  //   status = (
  //     await connection.confirmTransaction(signature, txConfirmationCommitment)
  //   ).value;
  // }

  if (status.err) {
    console.warn('Tx status: ', status);
    throw new TransactionFailError({
      txid: signature,
      message: `${JSON.stringify(status)}`,
    });
  }
  return signature;
}
// ----

export const createComputeBudgetIx = (
  microLamports: number,
): TransactionInstruction => {
  const computeBudgetIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports,
  });
  return computeBudgetIx;
};

export class TransactionFailError extends Error {
  message: string;
  txid: string;

  constructor({ txid, message }) {
    super();
    this.message = message;
    this.txid = txid;
  }
}

// const sendAndConfirmTransaction = async (
//     ixs: TransactionInstruction[],
//     opts: any = {},
//     provider: AnchorProvider,
//     postSendTxCallback?: Function,
//     prioritizationFee?: number,
//     txConfirmationCommitment?: Commitment
//   ): Promise<string> => {
//     return await sendTransaction(
//       provider,
//       ixs,
//       opts.alts ?? [],
//       {
//         postSendTxCallback,
//         prioritizationFee,
//         txConfirmationCommitment,
//         ...opts,
//       },
//     );
//   }

//   private async sendAndConfirmTransactionForGroup(
//     group: Group,
//     ixs: TransactionInstruction[],
//     opts: any = {},
//   ): Promise<string> {
//     return await this.sendAndConfirmTransaction(ixs, {
//       alts: group.addressLookupTablesList,
//       ...opts,
//     });
//   }

