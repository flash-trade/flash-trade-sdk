import { PublicKey } from "@solana/web3.js";
import { BN_ZERO } from "../constants";
import { MethodsNamespace, IdlTypes, IdlAccounts, BN, IdlEvents } from "@coral-xyz/anchor";
import { Perpetuals } from "../idl/perpetuals";
import { FbnftRewards } from "../idl/fbnft_rewards";
import { OraclePrice } from "../OraclePrice";

export type PositionSide = "long" | "short";

export type Methods = MethodsNamespace<Perpetuals>;
export type Accounts = IdlAccounts<Perpetuals>;
export type Types = IdlTypes<Perpetuals>;
export type Events = IdlEvents<Perpetuals>;

export type FbnftRewardsAccounts = IdlAccounts<FbnftRewards>;

export type OpenPositionParams = Types["OpenPositionParams"];
export type InitParams = Types["InitParams"];
export type OracleParams = Types["OracleParams"];
export type PricingParams = Types["PricingParams"];
export type Permissions = Types["Permissions"];
export type Fees = Types["Fees"];
export type BorrowRateParams = Types["BorrowRateParams"];
export type TokenRatios = Types["TokenRatios"];
export type SetCustomOraclePriceParams = Types["SetCustomOraclePriceParams"];
export type AmountAndFee = Types["AmountAndFee"];
export type NewPositionPricesAndFee = Types["NewPositionPricesAndFee"];
export type PriceAndFee = Types["PriceAndFee"];
export type ProfitAndLoss = Types["ProfitAndLoss"];
export type SwapAmountAndFees = Types["SwapAmountAndFees"];
export type RatioFee = Types["RatioFees"];
export type PermissionlessPythCache = Types["PermissionlessPythCache"];
export type BackupOracle = Types["BackupOracle"];
export type MarketPermissions = Types["MarketPermissions"];
export type ContractOraclePrice = Types["OraclePrice"];
export type StakeStats = Types["StakeStats"];
export type CompoundingStats = Types["CompoundingStats"];
export type VoltageStats = Types["VoltageStats"];
export type LimitOrder = Types["LimitOrder"];
export type TriggerOrder = Types["TriggerOrder"];

export type Assets = Types["Assets"];
export type FeesStats = Types["FeesStats"];
export type PositionStats = Types["PositionStats"];
export type BorrowRateState = Types["BorrowRateState"];

// export type CustomOracle = Types["CustomOracle"]

export type Custody = Accounts["custody"];
export type Market = Accounts["market"];
export type Pool = Accounts["pool"];
export type Position = Accounts["position"];
export type Order = Accounts["order"];



export type PerpetualsAccount = Accounts["perpetuals"];
export type Referral = Accounts["referral"];
export type Trading = Accounts["trading"];
export type FlpStake = Accounts["flpStake"];

export type RewardRecord = FbnftRewardsAccounts["rewardRecord"];
export type RewardVault = FbnftRewardsAccounts["rewardVault"];

export type AddCollateralLog = Events["AddCollateralLog"];
export type AddLiquidityLog = Events["AddLiquidityLog"];
export type ClosePositionLog = Events["ClosePositionLog"];
export type DecreaseSizeLog = Events["DecreaseSizeLog"];
export type LiquidateLog = Events["LiquidateLog"];
export type IncreaseSizeLog = Events["IncreaseSizeLog"];
export type OpenPositionLog = Events["OpenPositionLog"];
export type RemoveCollateralLog = Events["RemoveCollateralLog"];
export type RemoveLiquidityLog = Events["RemoveLiquidityLog"];
export type SwapLog = Events["SwapLog"];
export type ForceClosePositionLog = Events["ForceClosePositionLog"];

export type AddCollateralLogV2 = Events["AddCollateralLogV2"];
export type ClosePositionLogV2 = Events["ClosePositionLogV2"];
export type DecreaseSizeLogV2 = Events["DecreaseSizeLogV2"];
export type LiquidateLogV2 = Events["LiquidateLogV2"];
export type IncreaseSizeLogV2 = Events["IncreaseSizeLogV2"];
export type OpenPositionLogV2 = Events["OpenPositionLogV2"];
export type RemoveCollateralLogV2 = Events["RemoveCollateralLogV2"];
export type ForceClosePositionLogV2 = Events["ForceClosePositionLogV2"];

export type AddCollateralLogV3 = Events["AddCollateralLogV3"];
export type ClosePositionLogV3 = Events["ClosePositionLogV3"];
export type DecreaseSizeLogV3 = Events["DecreaseSizeLogV3"];
export type LiquidateLogV3 = Events["LiquidateLogV3"];
export type IncreaseSizeLogV3 = Events["IncreaseSizeLogV3"];
export type OpenPositionLogV3 = Events["OpenPositionLogV3"];
export type RemoveCollateralLogV3 = Events["RemoveCollateralLogV3"];
export type ForceClosePositionLogV3 = Events["ForceClosePositionLogV3"];


export type IncreaseSizeLogV4 = Events["IncreaseSizeLogV4"];
export type OpenPositionLogV4 = Events["OpenPositionLogV4"];
export type ExecuteLimitOrderLogV2 = Events["ExecuteLimitOrderLogV2"]
export type ExecuteLimitWithSwapLogV2 = Events["ExecuteLimitWithSwapLogV2"]
export type SwapAndOpenLogV2 = Events["SwapAndOpenLogV2"]


export type AddLiquidityLogV2 = Events["AddLiquidityLogV2"];
export type RemoveLiquidityLogV2 = Events["RemoveLiquidityLogV2"];
export type AddCompoundingLiquidityLog = Events["AddCompoundingLiquidityLog"];
export type AddLiquidityAndStakeLog = Events["AddLiquidityAndStakeLog"];
export type DepositStakeLog = Events["DepositStakeLog"];
export type MigrateStakeLog = Events["MigrateStakeLog"];
export type RefreshStakeLog = Events["RefreshStakeLog"];
export type CompoundingFeesLog = Events["CompoundingFeesLog"];
export type RemoveCompoundingLiquidityLog = Events["RemoveCompoundingLiquidityLog"];
export type SwapFeeInternalLog = Events["SwapFeeInternalLog"];
export type UnstakeInstantLog = Events["UnstakeInstantLog"];
export type UnstakeRequestLog = Events["UnstakeRequestLog"];
export type WithdrawStakeLog = Events["WithdrawStakeLog"];

export type EditLimitOrderLog = Events["EditLimitOrderLog"]
export type EditTriggerOrderLog = Events["EditTriggerOrderLog"]
export type ExecuteLimitOrderLog = Events["ExecuteLimitOrderLog"]

export type ExecuteTriggerOrderLog = Events["ExecuteTriggerOrderLog"]
export type PlaceLimitOrderLog = Events["PlaceLimitOrderLog"]
export type PlaceTriggerOrderLog = Events["PlaceTriggerOrderLog"]
export type CancelLimitOrderLog = Events["CancelLimitOrderLog"]
export type CancelTriggerOrderLog = Events["CancelTriggerOrderLog"]
export type ExecuteLimitWithSwapLog = Events["ExecuteLimitWithSwapLog"]

export type ExecuteTriggerWithSwapLog = Events["ExecuteTriggerWithSwapLog"]

export type SwapAndOpenLog = Events["SwapAndOpenLog"]
export type CloseAndSwapLog = Events["CloseAndSwapLog"]
export type SwapAndAddCollateralLog = Events["SwapAndAddCollateralLog"]
export type RemoveCollateralAndSwapLog = Events["RemoveCollateralAndSwapLog"]



//  taken from drift 
export function isVariant(object: any, type: string) {
    return object.hasOwnProperty(type);
}

// isOneOfVariant(side, ['long', 'short']
export function isOneOfVariant(object: any, types: string[]) {
    return types.reduce((result, type) => {
        return result || object.hasOwnProperty(type);
    }, false);
}

export class Privilege {
    static None = { none: {} };
    static NFT = { nft: {} };
    static Referral = { referral: {} };
}


//  simple type cannot be used as anchor somehow makes it a object while parseing 
// export enum Side {
//     None,
//     Long,
//     Short,
// }
export class Side {
    static None = { none: {} };
    static Long = { long: {} };
    static Short = { short: {} };
}

export class OracleType {
    static None = { none: {} };
    static Test = { test: {} };
    static Pyth = { pyth: {} };
}

export class FeesMode {
    static Fixed = { fixed: {} };
    static Linear = { linear: {} };
}

export class FeesAction {
    static AddLiquidity = { addLiquidity: {} };
    static RemoveLiquidity = { removeLiquidity: {} };
    static SwapIn = { swapIn: {} };
    static SwapOut = { swapOut: {} };
    static StableSwapIn = { stableSwapIn: {} };
    static StableSwapOut = { stableSwapOut: {} };
}

export const DEFAULT_POSITION : Position = {
    owner: PublicKey.default,
    delegate: PublicKey.default,
    market : PublicKey.default,

    // targetCustody: PublicKey.default,
    // collateralCustody: PublicKey.default,
    // side: Side.Long,

    openTime: BN_ZERO,
    updateTime: BN_ZERO,

    entryPrice: { price : BN_ZERO, exponent: 0},

    sizeAmount: BN_ZERO,
    sizeUsd: BN_ZERO,

    lockedAmount: BN_ZERO,
    lockedUsd: BN_ZERO,

    collateralAmount: BN_ZERO,
    collateralUsd: BN_ZERO,

    unsettledAmount: BN_ZERO,
    unsettledFeesUsd: BN_ZERO,

    cumulativeLockFeeSnapshot: BN_ZERO,

    takeProfitPrice : { price : BN_ZERO, exponent: 0},
    stopLossPrice : { price : BN_ZERO, exponent: 0},
    
    sizeDecimals : 0,
    lockedDecimals : 0,
    collateralDecimals : 0,

    bump: 0
}


export interface ExitPriceAndFee {
    exitOraclePrice: OraclePrice
    borrowFeeUsd: BN
    borrowFeeAmount: BN
    exitFeeUsd: BN
    exitFeeAmount: BN
    exitFeeUsdAfterDiscount : BN,
    exitFeeAmountAfterDiscount : BN,
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
    feeUsdAfterDiscount : BN,
    feeAmountAfterDiscount : BN,
    liquidationPrice: OraclePrice
}

export interface EntryPriceAndFeeV2 {
    entryOraclePrice: OraclePrice
    feeUsd: BN,
    feeAmount: BN,
    feeUsdAfterDiscount : BN,
    feeAmountAfterDiscount : BN,
    liquidationPrice: OraclePrice
    vbFeeUsd: BN,
}

export interface RemoveCollateralData {
    newSizeUsd: BN,
    feeUsd: BN,
    feeUsdWithDiscount : BN,
    newLev: BN,
    liquidationPrice: OraclePrice,
    collateralAmountRecieved: BN
    newCollateralAmount: BN,
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