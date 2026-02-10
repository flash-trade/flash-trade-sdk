import { PublicKey, RpcResponseAndContext, SimulatedTransactionResponse, Transaction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { decode } from '@coral-xyz/anchor/dist/cjs/utils/bytes/base64'
import IDL from "./idl/perpetuals.json";
import { IdlCoder } from "./utils/IdlCoder";
import { PerpetualsClient } from "./PerpetualsClient";
import { AddressLookupTableAccount } from "@solana/web3.js";

export class ViewHelper {
    private perpetualsClient: PerpetualsClient;

    constructor(client: PerpetualsClient) {
        this.perpetualsClient = client;
    }

    decodeLogs<T>(
        data: RpcResponseAndContext<SimulatedTransactionResponse>,
        instructionNumber: number,
        instructionName = ''
    ): T | undefined {
        try {
            const returnPrefix = `Program return: ${this.perpetualsClient.programId} `;
            if (data.value.logs && data.value.err === null) {
                let returnLog = data.value.logs.find((l: any) => l.startsWith(returnPrefix));
                if (!returnLog) {
                    throw new Error('View expected return log');
                }
                let returnData = decode(returnLog.slice(returnPrefix.length));
                // @ts-ignore
                let returnType = IDL.instructions[instructionNumber].returns;

                if (!returnType) {
                    throw new Error('View expected return type');
                }
                const coder = IdlCoder.fieldLayout(
                    { type: returnType as any },
                    Array.from([...(IDL.accounts ?? []), ...(IDL.types ?? [])]) as any
                );
                return coder.decode(returnData);
            } else {
                console.error('No Logs Found : name : data:', instructionName, data);
                console.error('Logs err::', data.value.logs?.toString());
                throw new Error(`FLASH No Logs Found ${{ cause: data }}`);
            }
        } catch (error) {
            console.log("decode error::",error);
        }
    }

    async simulateTransaction(
        transaction: Transaction,
        addressLookupTableAccounts: AddressLookupTableAccount[],
        userPublicKey: PublicKey | undefined = undefined
    ): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
        transaction.feePayer = userPublicKey ?? this.perpetualsClient.provider.publicKey;
        let latestBlockhash = await this.perpetualsClient.provider.connection.getLatestBlockhash('confirmed');

        const messageV0 = new TransactionMessage({
            payerKey: this.perpetualsClient.provider.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: transaction.instructions,
        }).compileToV0Message(addressLookupTableAccounts);

        const transaction2 = new VersionedTransaction(messageV0);
        return this.perpetualsClient.provider.connection.simulateTransaction(transaction2, { sigVerify: false, replaceRecentBlockhash: true });
    }

    // ... (other methods would be here)
}