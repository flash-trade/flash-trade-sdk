import { BN } from "@coral-xyz/anchor";
import { BN_ZERO, BPS_DECIMALS, USD_DECIMALS } from "./constants";
import { checkedDecimalDiv, checkedDecimalMul, nativeToUiDecimals } from "./utils";
import { ContractOraclePrice } from "./types";

export class OraclePrice {

    price: BN;
    exponent: BN;
    confidence: BN;
    timestamp: BN;

    // TODO: add confidence
    constructor(  parseData : { price : BN, exponent: BN, confidence: BN, timestamp?: BN}) {
        Object.assign(this, parseData);
    }

    static from(parseData : { price : BN, exponent: BN, confidence: BN, timestamp: BN}): OraclePrice {
        return new OraclePrice(parseData);
    }

    toContractOraclePrice(): ContractOraclePrice {
        return {
            price: this.price,
            exponent: this.exponent.toNumber()
        }   
    }

    /**
     * @description lhs.cmp(rhs) === (lhs > rhs) compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result
     */
    cmp(other: OraclePrice): -1 | 0 | 1 {
        
        let lhs:BN, rhs:BN; 
        if (this.exponent.eq(other.exponent)) {
            lhs =this.price;
            rhs = other.price;
        } else if (this.exponent.lt(other.exponent)) {
            
            let scaled_price = other.scale_to_exponent(this.exponent);
            lhs =this.price;
            rhs = scaled_price.price;
            
        }  else {
            let scaled_price = this.scale_to_exponent(other.exponent);
            lhs =scaled_price.price;
            rhs = other.price;
        };
         return lhs.cmp(rhs);
    }

    getDivergenceFactor(other: OraclePrice) : BN {
      
        // rather than throwing , we will scale to the one that has higher exponent and then compare 
        let thisPrice:OraclePrice, reference: OraclePrice;
        // need to take LESS THAN as expos are negative
        if(this.exponent.lte(other.exponent)){
            // this has higher so use this.expo 
            thisPrice = this;
            reference = other.scale_to_exponent(this.exponent)
        } else {
            thisPrice = this.scale_to_exponent(other.exponent);
            reference = other
        }

        if(!thisPrice.exponent.eq(reference.exponent)) {
            throw `Exponents mistmatch ${thisPrice.exponent.toNumber()} != ${reference.exponent.toNumber()}`
        }

        // only use new variables
        let factor: OraclePrice;
        if(thisPrice.price.gt(reference.price)) {
            factor = OraclePrice.from({price: (thisPrice.price.sub(reference.price).div(reference.price)), exponent: thisPrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO})
        } else {
            if(!reference.price.isZero()){
                factor =  OraclePrice.from({price: (reference.price.sub(thisPrice.price).div(reference.price)), exponent: thisPrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO})
            } else {
                factor =  OraclePrice.from({price: BN_ZERO, exponent: thisPrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO})
            }
        }
        return (factor.scale_to_exponent(new BN(-1 * BPS_DECIMALS)).price)
    }


    scale_to_exponent( target_exponent: BN) : OraclePrice {
        if(!target_exponent.isNeg()) {
            throw new Error("Target exponent must be negative");
        }

        if (target_exponent.eq(this.exponent)) {
            return this;
        }
        let delta = target_exponent.sub(this.exponent);
        if (delta.gt(BN_ZERO)) {
            
            return new OraclePrice({
                price : this.price.div(new BN(10).pow(delta)),
                confidence : this.confidence.div(new BN(10).pow(delta)),
                exponent : target_exponent
            })
        } else {
            
            return new OraclePrice({
                price : this.price.mul(new BN(10).pow(delta.neg())),
                confidence : this.confidence.mul(new BN(10).pow(delta.neg())),
                exponent : target_exponent
            })
        }
     }

     // Converts USD amount with implied USD_DECIMALS decimals to token amount
     getTokenAmount( asset_amount_usd: BN, token_decimals: number) : BN {
        if (asset_amount_usd.isZero() || this.price.isZero()) {
            return BN_ZERO;
        }
        return checkedDecimalDiv(
            asset_amount_usd,
            new BN(-1* USD_DECIMALS),
            this.price,
            this.exponent,
            new BN(-1 * token_decimals),
        )
     }

    // Converts token amount to USD with implied USD_DECIMALS decimals using oracle price
    getAssetAmountUsd( token_amount: BN, token_decimals: number) : BN {
        if (token_amount.isZero() || this.price.isZero())  {
            return BN_ZERO;
        }
        return checkedDecimalMul(
            token_amount,
            new BN(-1 * token_decimals),
            this.price,
            this.exponent,
            new BN(-1 * USD_DECIMALS),
        )
    }

    toUiPrice(precision: number): string {
        // TODO: rewrite code with BigNumber.js
        // const divisor = new BN(10).pow(new BN((this.exponent.toNumber()*-1) - precision))
        // const x: BN = this.price.div(divisor)
        // return (x.toNumber()/10**precision).toString() //this might break
        // *-1 since exponent is stored as negative
        return nativeToUiDecimals(this.price, this.exponent.toNumber()*-1,precision)
    }
}
