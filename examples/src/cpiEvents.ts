//@ts-nocheck
import { Connection, PublicKey } from "@solana/web3.js";
import {
    PublicKey,
    Transaction,
    Keypair,
} from "@solana/web3.js";

import { getCpiEventsFromTransaction, sendTransaction, IDL } from "flash-sdk";

const url = process.env["RPC_URL"] ?? 'https://api.devnet.solana.com';
console.log("url:",url)

const main = async () => {
    try {
        const connection = new Connection(url, { commitment : 'confirmed'})
        const tx = '3yym4zuU69TN5mVCZsRPfVQWsUQuxekq13UwGgHf5aWrxnGzCp5ZzV6K7yJoQH8QTz59o3jR49mVySsqji8RoSAf';
        const transactionDetails = await connection.getTransactions(
            [tx],
            { maxSupportedTransactionVersion: 0, commitment: "confirmed" }
          );
        // console.log("transactionDetails:",JSON.stringify(transactionDetails))    
        // console.log("transactionDetails slot:",transactionDetails[0].slot)    

          const events = await getCpiEventsFromTransaction(transactionDetails[0])
          console.log("events len :",events.length)
          for(let i=0;i<events.length;i++){
            console.log("i:",i,events[i]);
          }

    } catch (error) {
        console.error("out caught error ::: ", error);
    }
};
main();
