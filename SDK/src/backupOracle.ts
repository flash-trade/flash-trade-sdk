import { PriceFeed, PriceServiceConnection } from "@pythnetwork/price-service-client"
import { Keypair, Ed25519Program, PublicKey, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { PoolConfig, Token } from "./PoolConfig";
import { BackupOracle, PermissionlessPythCache } from "./types";
import { Program } from "@coral-xyz/anchor";
import { Perpetuals } from "./idl/perpetuals";

const BACKUP_ORACLE_SIZE = 36; // i64 + i32 + i64 + i64 + i64

function encodePermissionlessPythCache(cache: PermissionlessPythCache): Uint8Array {
    const { backupCache } = cache;
    const buf = Buffer.alloc(4 + backupCache.length * BACKUP_ORACLE_SIZE);
    buf.writeUInt32LE(backupCache.length, 0);
    let offset = 4;
    for (const oracle of backupCache) {
        buf.writeBigInt64LE(BigInt(oracle.price.toString()), offset); offset += 8;
        buf.writeInt32LE(oracle.expo, offset); offset += 4;
        buf.writeBigInt64LE(BigInt(oracle.conf.toString()), offset); offset += 8;
        buf.writeBigInt64LE(BigInt(oracle.emaPrice.toString()), offset); offset += 8;
        buf.writeBigInt64LE(BigInt(oracle.publishTime.toString()), offset); offset += 8;
    }
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'https://api.prod.flash.trade'

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

        let message = encodePermissionlessPythCache(permissionlessPythCache);

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

        let message = encodePermissionlessPythCache(permissionlessPythCache);

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


export async function createBackupOracleInstruction(poolAddress: string, overrideCheck: boolean = false) {
    try {
        // console.log("poolAddress:",poolAddress, `${API_ENDPOINT}/backup-oracle/prices?poolAddress=${poolAddress}` )

        const backupOracleData: any = await (
            await fetch(`${API_ENDPOINT}/backup-oracle/prices?poolAddress=${poolAddress}`)
        ).json()
        // console.log("backupOracleData:",poolAddress, backupOracleData, )
        
        const backUpOracleInstruction = new TransactionInstruction({
            keys: backupOracleData.keys,
            programId: new PublicKey(backupOracleData.programId),
            data: Buffer.from(backupOracleData.data),
        })

        return [backUpOracleInstruction]
    } catch (error) {
        console.error('Error creating backup oracle instruction:', error)
    }

    return []
}