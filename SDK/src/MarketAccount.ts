import { PublicKey } from "@solana/web3.js";
import { DEFAULT_POSITION, Market, MarketPermissions, Position, PositionStats, Side } from "./types";
import BN from "bn.js";
import { PositionAccount } from "./PositionAccount";
import { BN_ZERO } from "./constants";

export class MarketAccount implements Market {

    publicKey: PublicKey;

    pool: PublicKey;
    targetCustody: PublicKey;
    collateralCustody: PublicKey;
    side: Side;
    correlation: boolean;
    maxPayoffBps: BN;
    permissions: MarketPermissions;
    openInterest: BN;
    collectivePosition: PositionStats;
    targetCustodyUid: number;
    padding: number[];
    collateralCustodyUid: number;
    padding2: number[];
    bump: number;

    constructor(publicKey: PublicKey, parseData: Market) {
        this.publicKey = publicKey;
        Object.assign(this, parseData);
    }

    static from(publicKey: PublicKey, parseData: Market): MarketAccount {
        return new MarketAccount(
            publicKey,
            parseData
        );
    }

    updateMarketData(market: Market) {
        Object.assign(this, { ...market })
    }

    getCollectivePosition(): PositionAccount {
        if (this.collectivePosition.openPositions.gt(BN_ZERO)) {

            const obj: Position = {
                entryPrice: this.collectivePosition.averageEntryPrice,

                sizeAmount : this.collectivePosition.sizeAmount,
                sizeUsd: this.collectivePosition.sizeUsd,

                collateralAmount : this.collectivePosition.collateralAmount,
                collateralUsd: this.collectivePosition.collateralUsd,

                lockedAmount : this.collectivePosition.lockedAmount,
                lockedUsd : this.collectivePosition.lockedUsd,

                unsettledFeesUsd: this.collectivePosition.unsettledFeeUsd,
                cumulativeLockFeeSnapshot: this.collectivePosition.cumulativeLockFeeSnapshot,

                ...DEFAULT_POSITION // dangersous here
            } as Position;
            return new PositionAccount(
                PublicKey.default,
                obj
            )
        } else {
            return new PositionAccount(
                PublicKey.default,
                DEFAULT_POSITION
            )
        }

    }
}