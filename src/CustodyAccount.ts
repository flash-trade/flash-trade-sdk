import { PublicKey } from "@solana/web3.js";
import { Assets, FeesStats, Custody, Fees,  PricingParams, Permissions, BorrowRateParams, OracleParams, PositionStats, BorrowRateState, Side, isVariant, Position, DEFAULT_POSITION } from "./types";
import { PositionAccount } from "./PositionAccount";
import BN from "bn.js";
import { BN_ZERO, RATE_POWER } from "./constants";
import { checkedCeilDiv } from "./utils";


export class CustodyAccount implements Custody {

      publicKey: PublicKey;

      //  all Custody Type data IMP:: SHOULD MATCH NAMES 
      pool: PublicKey;
      mint: PublicKey;
      tokenAccount: PublicKey;
      decimals: number;
      isStable: boolean;
      depegAdjustment: boolean;
      isVirtual: boolean;
      distributeRewards: boolean; 
      oracle: OracleParams;
      pricing: PricingParams;
      permissions: Permissions;
      fees: Fees;
      borrowRate: BorrowRateParams;
      rewardThreshold: BN;

      assets: Assets;
      feesStats: FeesStats;
      borrowRateState: BorrowRateState;

      // longPositions: PositionStats;
      // shortPositions: PositionStats;

      bump: number;
      tokenAccountBump: number;

    constructor( publicKey : PublicKey, parseData : Custody) {
      this.publicKey = publicKey;
      Object.assign(this, parseData);
    }

    static from( publicKey: PublicKey, parseData : Custody): CustodyAccount {
        return new CustodyAccount(
          publicKey,
          parseData
        );
      }
  
      updateCustodyData(custody: Custody) {
            Object.assign(this,{...custody})
      }

      // getCollectivePosition(side: Side):PositionAccount {
      //   let stats : PositionStats; 
      //   if ( isVariant(side,'long')) {
      //     stats = this.longPositions;
      //   } else {
      //     stats = this.shortPositions;
      //   };
      //   if (stats.openPositions.gt(BN_ZERO)) {
            
      //       const obj: Position =  {
      //         side,
      //         price: stats.averagePrice.div(stats.totalQuantity),
      //         sizeUsd: stats.sizeUsd,
      //         collateralUsd: stats.collateralUsd,
      //         unrealizedLossUsd: stats.cumulativeInterestUsd,
      //         cumulativeInterestSnapshot: stats.cumulativeInterestSnapshot,
      //         lockedAmount: stats.lockedAmount,
      //         ...DEFAULT_POSITION
      //       } as Position;
      //       return new PositionAccount(
      //         PublicKey.default,
      //         obj
      //       )
      //   } else {
      //     return new PositionAccount(
      //       PublicKey.default,
      //       DEFAULT_POSITION
      //     )
      //   }
      // }

      
      

  }