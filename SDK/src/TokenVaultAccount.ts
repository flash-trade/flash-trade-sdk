import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ContractOraclePrice, LimitOrder, Order, Position, TokenVault, TriggerOrder } from "./types";



export class TokenVaultAccount implements TokenVault {
   

    public publicKey: PublicKey;
    public isInitialized: boolean; // Add this property to satisfy the interface
    public bump: number;
    public tokenAccountBump: number;

    public tokenMint: PublicKey;
    public tokenVaultTokenAccount: PublicKey;

    public tokenPermissions: any; // Replace 'any' with the correct type if known
    public withdrawTimeLimit: BN;
    public withdrawInstantFee: BN;
    public withdrawInstantFeeEarned: BN;
    public stakeLevel: BN[];
    public tokensStaked: any; // Replace 'any' with the correct type if known
    public rewardTokensToDistribute: BN;
    public rewardTokensPaid: BN;

    public tokensToDistribute: BN;
    public tokensDistributed: BN;
    public lastRewardEpochCount: number;
    public rewardTokensDistributed: BN;
    public padding: number[];

    public revenueTokenAccountBump: number;
    public revenuePerFafStaked: BN;
    public revenueAccrued: BN;
    public revenueDistributed: BN;
    public revenuePaid: BN;
    public padding2: BN[];

    constructor( publicKey : PublicKey, parseData : TokenVault) {
        this.publicKey = publicKey;
        Object.assign(this, parseData);
    }

    static from(publicKey: PublicKey,parseData : TokenVault): TokenVaultAccount {
        return new TokenVaultAccount(publicKey, parseData);
    }

    clone(): TokenVaultAccount {
        return { ...this };  // Again, this is a shallow copy
    }

    updateTokenVaultAccountData(order: TokenVault) {
        Object.assign(this, { ...order })
    }

}
