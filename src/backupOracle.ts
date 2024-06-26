import { PriceFeed, PriceServiceConnection } from "@pythnetwork/price-service-client"
import { Keypair, Ed25519Program, PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { PoolConfig, Token } from "./PoolConfig";
import { BackupOracle, PermissionlessPythCache } from "./types";
import { Program } from "@coral-xyz/anchor";
import { Perpetuals } from "./idl/perpetuals";

export const pythPriceServiceConnection = new PriceServiceConnection('https://hermes.pyth.network', {
    priceFeedRequestConfig: {
        // Provide this option to retrieve signed price updates for on-chain contracts.
        // Ignore this option for off-chain use.
        // binary: true,
    },
})

export const getPythnetOraclePrices = async (
    program: Program<Perpetuals>,
    poolConfig: PoolConfig,
    backupOracleSecretKey: string
) : Promise<TransactionInstruction> => {
    const custodyMintKeys = poolConfig.custodies.map(f => f.mintKey)
    const pythPriceIds: string[] = [];

    for (const custodyMintKey of custodyMintKeys) {
        const t = poolConfig.tokens.find(f => f.mintKey.equals(custodyMintKey))
        if(t) {
            pythPriceIds.push(t.pythPriceId);
        }
    }
    
    const currentPrices = await pythPriceServiceConnection.getLatestPriceFeeds(pythPriceIds);
    if(!currentPrices) return;

    const backupOracleAccount = Keypair.fromSecretKey(bs58.decode(backupOracleSecretKey))

    if (pythPriceIds.length === currentPrices.length) {
        const caches = currentPrices.map(price => {
            const uncheckedPrice = price.getPriceUnchecked();
            const uncheckedEmaPrice = price.getEmaPriceUnchecked();
            return {
                price: new BN(uncheckedPrice.price),
                expo: uncheckedPrice.expo,
                conf: new BN(uncheckedPrice.conf),
                emaPrice: new BN(uncheckedEmaPrice.price),
                publishTime: new BN(uncheckedPrice.publishTime)
            }
        })
        let permissionlessPythCache: PermissionlessPythCache = {
            backupCache: caches
        };

        // @ts-ignore
        let message = program._coder.types.encode('PermissionlessPythCache', permissionlessPythCache);

        const signature = nacl.sign.detached(message, backupOracleAccount.secretKey);

        const preInstruction = Ed25519Program.createInstructionWithPublicKey({
            publicKey: backupOracleAccount.publicKey.toBytes(),
            message: message,
            signature: signature,
        })

        return preInstruction;
    }
}

export const getBackupOracleInstruction =  (
    program: Program<Perpetuals>,
    poolConfig: PoolConfig,
    backupOracleSecretKey: string,
    backupCaches : BackupOracle[]
) : TransactionInstruction => {

    const custodiesLength = poolConfig.custodies.length;

    if(!backupCaches.length) {
        console.error("incorrect prices passed ,",custodiesLength ,backupCaches.length)
        throw new Error(`incorrect prices passed : custodiesLength: ${custodiesLength} , backupCaches.length: ${backupCaches.length}`)
    };

    const backupOracleAccount = Keypair.fromSecretKey(bs58.decode(backupOracleSecretKey))

    if (custodiesLength === backupCaches.length) {
        let permissionlessPythCache: PermissionlessPythCache = {
            backupCache: backupCaches
        };

        // @ts-ignore
        let message = program._coder.types.encode('PermissionlessPythCache', permissionlessPythCache);

        const signature = nacl.sign.detached(message, backupOracleAccount.secretKey);

        const preInstruction = Ed25519Program.createInstructionWithPublicKey({
            publicKey: backupOracleAccount.publicKey.toBytes(),
            message: message,
            signature: signature,
        })

        return preInstruction;
    } else {
        console.error("incorrect prices passed ,",custodiesLength ,backupCaches.length)
        throw new Error(`incorrect prices passed : custodiesLength: ${custodiesLength} , currentPrices.length: ${backupCaches.length}`)
    }
}