import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { ComputeBudgetProgram, PublicKey } from "@solana/web3.js";
import { BN_ZERO, PerpetualsClient, PoolConfig, confirmTransaction, uiDecimalsToNative } from "flash-sdk";
import dotenv from 'dotenv';
dotenv.config();

let client: PerpetualsClient;

const POOL_CONFIG = PoolConfig.fromIdsByName("devnet.4", 'devnet')
const composabilityProgramId = POOL_CONFIG.perpComposibilityProgramId;
const fbNftRewardProgramId = POOL_CONFIG.fbNftRewardProgramId;

const initClient = (clusterUrl: string, adminKeyPath: string, programId: PublicKey) => {
    process.env["ANCHOR_WALLET"] = adminKeyPath;
    const provider: AnchorProvider = AnchorProvider.local(clusterUrl, {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
        skipPreflight: true
    });

    client = new PerpetualsClient(provider, programId, composabilityProgramId, fbNftRewardProgramId, POOL_CONFIG.rewardDistributionProgram.programId, null);
    client.log("Client Initialized");
}

const url = process.env["RPC_URL"] ?? 'https://api.devnet.solana.com';
const adminKey = process.env["KEYPAIR_PATH"] ?? '';
const programId = POOL_CONFIG.programId;

// console.log("POOL_CONFIG:",POOL_CONFIG)


const main = async () => {
    initClient(url, adminKey, programId);
    console.log("POOL_CONFIG:",POOL_CONFIG)
    const { instructions, additionalSigners } = await client.addLiquidity(
        'BONK',
        new BN('10000000'),
        new BN('10000'),
        POOL_CONFIG,
        true,
    )

    await client.loadAddressLookupTable(POOL_CONFIG);

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 500_000 })

    console.log("instructions:",instructions.length)

    const trx = await client.sendTransaction([setCULimitIx, ...instructions], {
        additionalSigners,
        alts: client.addressLookupTables,
    });
    
    console.log('tx :>> ', `https://explorer.solana.com/tx/${trx}?cluster=devnet`);
    await confirmTransaction(client.provider,trx);

}

main()