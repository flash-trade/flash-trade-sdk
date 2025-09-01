import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ContractOraclePrice, LimitOrder, Order, Position, TriggerOrder } from "./types";


export class OrderAccount implements Order{

    public publicKey: PublicKey;

    //  all Position Type data IMP:: SHOULD MATCH NAMES 
    public owner: PublicKey;
    public market: PublicKey;

    public limitOrders: LimitOrder[];
    public takeProfitOrders: TriggerOrder[];
    public stopLossOrders: TriggerOrder[];

    public isInitialised: boolean;
    public openOrders: number;

    public openSl: number;
    public openTp: number;
    public inactiveSl: number;
    public inactiveTp: number;
    public activeOrders: number;

    // extra 
    public bump: number;
    public referenceTimestamp: BN;
    public executionCount: BN;
    public padding: BN[];

    constructor( publicKey : PublicKey, parseData : Order) {
        this.publicKey = publicKey;
        Object.assign(this, parseData);
    }

    static from(publicKey: PublicKey,parseData : Order): OrderAccount {
        return new OrderAccount(publicKey, parseData);
    }

    clone(): OrderAccount {
        return { ...this };  // Again, this is a shallow copy
    }

    updateOrderAccountData(order: Order) {
        Object.assign(this, { ...order })
    }

}
