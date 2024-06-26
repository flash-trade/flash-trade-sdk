
import { BN } from "@coral-xyz/anchor";
import {  Pool, TokenRatios, StakeStats, Permissions } from "./types";
import { PublicKey } from "@solana/web3.js";

export class PoolAccount implements Pool {

    publicKey: PublicKey;

    name: string;
    permissions: Permissions;
    inceptionTime: BN;
    flpMint: PublicKey;
    oracleAuthority: PublicKey;
    flpTokenAccount: PublicKey; // set in init_staking
    rewardCustody: PublicKey; // set in init_staking
    custodies:  PublicKey[];
    ratios: TokenRatios[];
    markets:  PublicKey[];
    maxAumUsd: BN;
    aumUsd: BN; // For persistnace
    totalStaked: StakeStats;
    stakingFeeShareBps: BN;
    bump: number;
    flpMintBump: number;
    flpTokenAccountBump: number;
    vpVolumeFactor: number;

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

    getTokenId(custodyKey: PublicKey) : number {
        return this.custodies.findIndex(i => i.toBase58()==custodyKey.toBase58())
    }

} // Pool
