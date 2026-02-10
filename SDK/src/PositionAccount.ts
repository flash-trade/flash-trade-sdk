import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ContractOraclePrice, Position } from "./types";


export class PositionAccount implements Position {

    public publicKey: PublicKey;

    //  all Position Type data IMP:: SHOULD MATCH NAMES (camelCase for Anchor v0.32)
    public owner: PublicKey;
    public market: PublicKey;
    public delegate: PublicKey;

    public openTime: BN;
    public updateTime: BN;

    public entryPrice: ContractOraclePrice;

    public sizeUsd: BN;
    public sizeAmount: BN;

    public lockedAmount: BN;
    public lockedUsd: BN;

    public priceImpactUsd: BN;
    public collateralUsd: BN;

    public unsettledValueUsd: BN;
    public unsettledFeesUsd: BN;

    public cumulativeLockFeeSnapshot: BN;

    public degenSizeUsd: BN;
    public referencePrice: ContractOraclePrice;

    public buffer: number[];
    public priceImpactSet: number;

    public sizeDecimals: number;
    public lockedDecimals: number;
    public collateralDecimals: number;

    // extra
    public bump: number
    public padding: number[];

    constructor( publicKey : PublicKey, parseData : Position) {
        this.publicKey = publicKey;
        Object.assign(this, parseData);
    }

    static from(publicKey: PublicKey,parseData : Position): PositionAccount {
        return new PositionAccount(publicKey, parseData);
    }

    clone(): PositionAccount {
        return { ...this };  // Again, this is a shallow copy
    }

    updatePositionData(position: Position) {
        Object.assign(this, { ...position })
    }

    isDegenMode(): boolean {
        return this.degenSizeUsd.gte(this.sizeUsd);
    }

}
