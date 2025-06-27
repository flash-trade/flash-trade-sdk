
import { BN } from "@coral-xyz/anchor";
import {  Trading, VoltageStats } from "./types";
import { PublicKey } from "@solana/web3.js";

export class TradingAccount implements Trading {

    publicKey: PublicKey;

    nftMint: PublicKey;
    owner: PublicKey;
    delegate: PublicKey;
    isInitialized: boolean;
    level: number;
    bump: number;

    voltagePoints: BN;

    stats: VoltageStats;
    snapshot: VoltageStats;
    timestamp: BN;
    counter: BN;
    tokenStakeAccount: PublicKey;
    burnt: boolean;
    padding: number[];


    constructor(publicKey: PublicKey, parseData: Trading) {
        this.publicKey = publicKey;
        Object.assign(this, parseData);
    }

    static from(publicKey: PublicKey, parseData: Trading): TradingAccount {
        return new TradingAccount(publicKey, parseData);
    }


    updatePoolData(parseData: Trading) {
        Object.assign(this, parseData);
    }

} // TradingAccount
