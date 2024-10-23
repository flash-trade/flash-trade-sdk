import { PublicKey, TransactionInstruction } from '@solana/web3.js'
import { API_ENDPOINT } from './constants'

export async function createBackupOracleInstruction(poolAddress: string, overrideCheck: boolean = false) {
    try {
        const backupOracleData: any = await (
            await fetch(`${API_ENDPOINT}/backup-oracle/prices?poolAddress=${poolAddress}`)
        ).json()
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
