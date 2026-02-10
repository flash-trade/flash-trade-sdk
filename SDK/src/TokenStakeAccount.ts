import { TokenStake, WithdrawStakeLog } from "./types"
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";


export class TokenStakeAccount implements TokenStake {
    owner: PublicKey
    isInitialized: boolean
    bump: number
    level: number
    withdrawRequestCount: number
    withdrawRequest: WithdrawStakeLog[] | any
    activeStakeAmount: BN
    updateTimestamp: BN
    tradeTimestamp: BN
    tradeCounter: number
    lastRewardEpochCount: number
    rewardTokens: BN
    unclaimedRevenueAmount: BN
    revenueSnapshot: BN
    claimableRebateUsd: BN

    // Constructor for initializing the object from provided data
    constructor(data: {
        owner: PublicKey
        isInitialized: boolean
        bump: number
        level: number
        withdrawRequestCount: number
        withdrawRequest: WithdrawStakeLog[]
        activeStakeAmount: BN
        updateTimestamp: BN
        tradeTimestamp: BN
        tradeCounter: number
        lastRewardEpochCount: number
        rewardTokens: BN
        unclaimedRevenueAmount: BN
        revenueSnapshot: BN
        claimableRebateUsd: BN
    }) {
        this.owner = data.owner
        this.isInitialized = data.isInitialized
        this.bump = data.bump
        this.level = data.level
        this.withdrawRequestCount = data.withdrawRequestCount
        this.withdrawRequest = data.withdrawRequest
        this.activeStakeAmount = data.activeStakeAmount
        this.updateTimestamp = data.updateTimestamp
        this.tradeTimestamp = data.tradeTimestamp
        this.tradeCounter = data.tradeCounter
        this.rewardTokens = data.rewardTokens
        this.lastRewardEpochCount = data.lastRewardEpochCount
        this.unclaimedRevenueAmount = data.unclaimedRevenueAmount
        this.revenueSnapshot = data.revenueSnapshot
        this.claimableRebateUsd = data.claimableRebateUsd
    }

    // Static method to create a TokenStakeAccount from decoded data
    static from(decodedData: any): TokenStakeAccount {
        // Assume decodedData is an object that matches the structure of TokenStake
        return new TokenStakeAccount({
            owner: decodedData.owner,
            isInitialized: decodedData.isInitialized,
            bump: decodedData.bump,
            level: decodedData.level,
            withdrawRequestCount: decodedData.withdrawRequestCount,
            withdrawRequest: decodedData.withdrawRequest,
            activeStakeAmount: new BN(decodedData.activeStakeAmount),
            updateTimestamp: new BN(decodedData.updateTimestamp),
            tradeTimestamp: new BN(decodedData.tradeTimestamp),
            tradeCounter: decodedData.tradeCounter,
            rewardTokens: new BN(decodedData.rewardTokens),
            lastRewardEpochCount: decodedData.lastRewardEpochCount,
            unclaimedRevenueAmount: decodedData.unclaimedRevenueAmount,
            revenueSnapshot: decodedData.revenueSnapshot,
            claimableRebateUsd: decodedData.claimableRebateUsd,
        })
    }

    // You can add methods to manipulate or display data as needed
    updateData(newData: Partial<TokenStakeAccount>) {
        Object.assign(this, newData)
    }
}
