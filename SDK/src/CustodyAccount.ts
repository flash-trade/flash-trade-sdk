import { PublicKey } from "@solana/web3.js";
import { Assets, FeesStats, Custody, Fees,  PricingParams, Permissions, BorrowRateParams, OracleParams, PositionStats, BorrowRateState, Side, isVariant, Position, DEFAULT_POSITION } from "./types";
import { PositionAccount } from "./PositionAccount";
import BN from "bn.js";
import { BN_ZERO, RATE_POWER } from "./constants";
import { checkedCeilDiv } from "./utils";


export class CustodyAccount implements Custody {

      publicKey: PublicKey;

      //  all Custody Type data IMP:: SHOULD MATCH NAMES (camelCase for Anchor v0.32)
      pool: PublicKey;
      mint: PublicKey;
      tokenAccount: PublicKey;
      decimals: number;
      isStable: boolean;
      depegAdjustment: boolean;
      isVirtual: boolean;
      inversePrice: boolean; 
      oracle: OracleParams;
      pricing: PricingParams;
      permissions: Permissions;
      fees: Fees;
      borrowRate: BorrowRateParams;
      rewardThreshold: BN;

      assets: Assets;
      feesStats: FeesStats;
      borrowRateState: BorrowRateState;

      bump: number;
      tokenAccountBump: number;
      token22: boolean;
      uid: number;
      reservedAmount: BN;
      minReserveUsd: BN;
      limitPriceBufferBps: BN;
      padding: number[]

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

  }
