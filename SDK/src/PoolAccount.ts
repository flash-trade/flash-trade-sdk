
import { BN } from "@coral-xyz/anchor";
import {  Pool, TokenRatios, StakeStats, CompoundingStats, Permissions } from "./types";
import { PublicKey } from "@solana/web3.js";

export class PoolAccount implements Pool {

    publicKey: PublicKey;

    name: string;
    permissions: Permissions;
    inceptionTime: BN;
    lpMint: PublicKey;
    oracleAuthority: PublicKey;
    stakedLpVault: PublicKey; // set in init_staking
    rewardCustody: PublicKey; // set in init_staking
    custodies:  PublicKey[];
    ratios: TokenRatios[];
    markets:  PublicKey[];
    maxAumUsd: BN;
    buffer: BN;
    rawAumUsd: BN; 
    equityUsd: BN; 
    totalStaked: StakeStats;
    stakingFeeShareBps: BN;
    bump: number;
    lpMintBump: number;
    stakedLpVaultBump: number;
    vpVolumeFactor: number;
    uniqueCustodyCount: number;
    padding: number[];
    stakingFeeBoostBps: BN[];
    compoundingMint: PublicKey;
    compoundingLpVault: PublicKey;
    compoundingStats: CompoundingStats;
    compoundingMintBump: number;
    compoundingLpVaultBump: number;

    minLpPriceUsd: BN;
    maxLpPriceUsd: BN;

    lpPrice: BN;
    compoundingLpPrice: BN;
    lastUpdatedTimestamp: BN;
    padding2: BN[];

    constructor(publicKey: PublicKey, parseData: Pool) {
        this.publicKey = publicKey;
        Object.assign(this, parseData);
    }

    static from(publicKey: PublicKey, parseData: Pool): PoolAccount {
        return new PoolAccount(publicKey, parseData);
    }


    updatePoolData(parseData: Pool) {
        Object.assign(this, parseData);
    }

    getCustodyId(custodyKey: PublicKey) : number {
        return this.custodies.findIndex(i => i.toBase58()==custodyKey.toBase58())
    }

} // Pool
