import { PublicKey } from "@solana/web3.js";
import { BN_ZERO } from "../constants";
import { BN } from "@coral-xyz/anchor";
import { OraclePrice } from "../OraclePrice";

// Import generated types from IDL
// Run `npm run generate-types` to regenerate these
// Note: OraclePrice is renamed to ContractOraclePrice in generated.ts to avoid conflict with OraclePrice class
export * from "./generated";

// Re-import account types from generated for explicit exports
// These were previously derived from IdlAccounts<Perpetuals> which caused TS2589 recursion errors
import {
    Custody as GeneratedCustody,
    Market as GeneratedMarket,
    Pool as GeneratedPool,
    Position as GeneratedPosition,
    Order as GeneratedOrder,
    Perpetuals as GeneratedPerpetuals,
    Referral as GeneratedReferral,
    Whitelist as GeneratedWhitelist,
    FlpStake as GeneratedFlpStake,
    TokenVault as GeneratedTokenVault,
    TokenStake as GeneratedTokenStake,
    ProtocolVault as GeneratedProtocolVault,
} from "./generated";

export type PositionSide = "long" | "short";

// Account types - using generated types instead of IdlAccounts<Perpetuals> to avoid TS2589 recursion error
export type Custody = GeneratedCustody;
export type Market = GeneratedMarket;
export type Pool = GeneratedPool;
export type Position = GeneratedPosition;
export type Order = GeneratedOrder;

export type PerpetualsAccount = GeneratedPerpetuals;
export type Referral = GeneratedReferral;
export type Whitelist = GeneratedWhitelist;

// Deprecated: Trading account was removed from IDL
// Kept for backwards compatibility but not used
export type Trading = Record<string, never>;

export type FlpStake = GeneratedFlpStake;

export type TokenVault = GeneratedTokenVault;
export type TokenStake = GeneratedTokenStake;
export type ProtocolVault = GeneratedProtocolVault;


// Helper functions for enum variants
export function isVariant(object: any, type: string) {
    return object.hasOwnProperty(type);
}

export function isOneOfVariant(object: any, types: string[]) {
    return types.reduce((result, type) => {
        return result || object.hasOwnProperty(type);
    }, false);
}

// Enum helper classes for convenient static access
// Anchor v0.32 uses empty objects {} for unit enum variants
export class Privilege {
    static None = { none: {} as Record<string, never> };
    static Stake = { stake: {} as Record<string, never> };
    static Referral = { referral: {} as Record<string, never> };
}

export class Side {
    static None = { none: {} as Record<string, never> };
    static Long = { long: {} as Record<string, never> };
    static Short = { short: {} as Record<string, never> };
}

export class OracleType {
    static None = { none: {} as Record<string, never> };
    static Custom = { custom: {} as Record<string, never> };
    static Pyth = { pyth: {} as Record<string, never> };
}

export class FeesMode {
    static Fixed = { fixed: {} as Record<string, never> };
    static Linear = { linear: {} as Record<string, never> };
}

export class FeesAction {
    static AddLiquidity = { addLiquidity: {} as Record<string, never> };
    static RemoveLiquidity = { removeLiquidity: {} as Record<string, never> };
    static SwapIn = { swapIn: {} as Record<string, never> };
    static SwapOut = { swapOut: {} as Record<string, never> };
    static StableSwapIn = { stableSwapIn: {} as Record<string, never> };
    static StableSwapOut = { stableSwapOut: {} as Record<string, never> };
}

// Default position for initialization
// Note: Anchor v0.32 uses camelCase field names for account data
export const DEFAULT_POSITION: Position = {
    owner: PublicKey.default,
    delegate: PublicKey.default,
    market: PublicKey.default,

    openTime: BN_ZERO,
    updateTime: BN_ZERO,

    entryPrice: { price: BN_ZERO, exponent: 0 },

    sizeAmount: BN_ZERO,
    sizeUsd: BN_ZERO,

    lockedAmount: BN_ZERO,
    lockedUsd: BN_ZERO,

    priceImpactUsd: BN_ZERO,
    collateralUsd: BN_ZERO,

    unsettledValueUsd: BN_ZERO,
    unsettledFeesUsd: BN_ZERO,

    cumulativeLockFeeSnapshot: BN_ZERO,

    degenSizeUsd: BN_ZERO,
    referencePrice: { price: BN_ZERO, exponent: 0 },

    buffer: [0, 0, 0],
    priceImpactSet: 0,

    sizeDecimals: 0,
    lockedDecimals: 0,
    collateralDecimals: 0,

    bump: 0,
    padding: []
}

// Custom interface types (not in IDL)
export interface ExitPriceAndFee {
    exitOraclePrice: OraclePrice
    borrowFeeUsd: BN
    borrowFeeAmount: BN
    exitFeeUsd: BN
    exitFeeAmount: BN
    exitFeeUsdAfterDiscount: BN,
    exitFeeAmountAfterDiscount: BN,
    liquidationPrice: OraclePrice
}

export interface MinAndMaxPrice {
    min: BN
    max: BN
}

export interface EntryPriceAndFee {
    entryOraclePrice: OraclePrice
    feeUsd: BN,
    feeAmount: BN,
    feeUsdAfterDiscount: BN,
    feeAmountAfterDiscount: BN,
    liquidationPrice: OraclePrice
}

export interface EntryPriceAndFeeV2 {
    entryDeltaOraclePrice: OraclePrice
    entryAvgOraclePrice: OraclePrice
    feeUsd: BN,
    feeAmount: BN,
    feeUsdAfterDiscount: BN,
    feeAmountAfterDiscount: BN,
    liquidationPrice: OraclePrice
    vbFeeUsd: BN,
}

export interface RemoveCollateralData {
    newSizeUsd: BN,
    feeUsd: BN,
    feeUsdWithDiscount: BN,
    lockAndUnsettledFeeUsd: BN,
    newLev: BN,
    liquidationPrice: OraclePrice,
    collateralAmountReceived: BN,
    collateralAmountReceivedUsd: BN,
    newCollateralUsd: BN,
    newPnl: BN
}

export interface AddLiquidityAmountAndFee {
    lpAmountOut: BN
    fee: BN
}

export interface RemoveLiquidityAmountAndFee {
    tokenAmountOut: BN
    fee: BN
}

// Type aliases for backwards compatibility
// These types are now exported from generated.ts
// If you need a specific type that's not exported, import it from generated.ts directly

// Re-export type aliases for backwards compatibility
import { RatioFees } from "./generated";
export type RatioFee = RatioFees;

// Types that were removed from IDL but are still used in backupOracle.ts
// Defined manually based on usage in the codebase
export interface BackupOracle {
    price: BN;
    expo: number;
    conf: BN;
    emaPrice: BN;
    publishTime: BN;
}

export interface PermissionlessPythCache {
    backupCache: BackupOracle[];
}

// Deprecated: VoltageStats was removed from IDL
// Related types that exist: VoltageMultiplier, VoltagePointsLog
// Kept for backwards compatibility but not used
export type VoltageStats = Record<string, never>;
