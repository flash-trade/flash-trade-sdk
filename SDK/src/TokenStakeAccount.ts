import { TokenStake, WithdrawRequest } from "./types"
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const BN_ZERO = new BN(0);

export interface LockRequestStatus {
    requestId: number;
    lockedAmount: BN;
    withdrawableAmount: BN;
    timeRemaining: BN;
    totalAmount: BN;
}

export class TokenStakeAccount implements TokenStake {
    owner: PublicKey
    isInitialized: boolean
    bump: number
    level: number
    withdrawRequestCount: number
    withdrawRequest: WithdrawRequest[]
    buffer: number[]
    activeStakeAmount: BN
    updateTimestamp: BN
    tradeTimestamp: BN
    tradeCounter: number
    lastRewardEpochCount: number
    rewardTokens: BN
    unclaimedRevenueAmount: BN
    revenueSnapshot: BN
    claimableRebateUsd: BN

    constructor(data: {
        owner: PublicKey
        isInitialized: boolean
        bump: number
        level: number
        withdrawRequestCount: number
        withdrawRequest: WithdrawRequest[]
        buffer: number[]
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
        this.buffer = data.buffer
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

    static from(decodedData: any): TokenStakeAccount {
        return new TokenStakeAccount({
            owner: decodedData.owner,
            isInitialized: decodedData.isInitialized,
            bump: decodedData.bump,
            level: decodedData.level,
            withdrawRequestCount: decodedData.withdrawRequestCount,
            withdrawRequest: decodedData.withdrawRequest,
            buffer: decodedData.buffer,
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

    /** Total locked amount across all active withdraw requests. */
    getLockedAmount(): BN {
        let total = BN_ZERO;
        for (let i = 0; i < this.withdrawRequestCount; i++) {
            total = total.add(new BN(this.withdrawRequest[i].lockedAmount));
        }
        return total;
    }

    /** Total withdrawable (vested) amount across all active withdraw requests. */
    getWithdrawableAmount(): BN {
        let total = BN_ZERO;
        for (let i = 0; i < this.withdrawRequestCount; i++) {
            total = total.add(new BN(this.withdrawRequest[i].withdrawableAmount));
        }
        return total;
    }

    /** Revenue-eligible amount: active stake + locked tokens. */
    getRevenueEligibleAmount(): BN {
        return this.activeStakeAmount.add(this.getLockedAmount());
    }

    /** Per-request lock status with amounts and time remaining. */
    getLockStatus(): LockRequestStatus[] {
        const statuses: LockRequestStatus[] = [];
        for (let i = 0; i < this.withdrawRequestCount; i++) {
            const req = this.withdrawRequest[i];
            const locked = new BN(req.lockedAmount);
            const withdrawable = new BN(req.withdrawableAmount);
            statuses.push({
                requestId: i,
                lockedAmount: locked,
                withdrawableAmount: withdrawable,
                timeRemaining: new BN(req.timeRemaining),
                totalAmount: locked.add(withdrawable),
            });
        }
        return statuses;
    }

    updateData(newData: Partial<TokenStakeAccount>) {
        Object.assign(this, newData)
    }
}
