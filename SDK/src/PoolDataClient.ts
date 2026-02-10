
import {  LP_DECIMALS, USD_DECIMALS } from "./constants";
import { BN } from "@coral-xyz/anchor";
import { Mint } from "@solana/spl-token";
import { CustodyAccount } from "./CustodyAccount";
import { OraclePrice } from "./OraclePrice";
import { nativeToUiDecimals, uiDecimalsToNative } from "./utils";
import { PoolConfig } from "./PoolConfig";
import { PoolAccount } from "./PoolAccount";
import BigNumber from 'bignumber.js'
import { MarketAccount } from "./MarketAccount";


export interface LpStats {
  lpTokenSupply: BN;
  decimals: number;
  totalPoolValueUsd: BN;
  totalPoolValueUsdUi : string;
  price: BN;
  priceUi: string;
  stableCoinPercentage: string;
  marketCap : BN;
}

export interface CustodyStats {
  symbol: string;
  priceUi: string;
  minRatio: BN;
  minRatioUi : string;
  maxRatio: BN;
  maxRatioUi : string;
  targetRatio: BN;
  targetRatioUi : string;
  currentRatio: BN;
  currentRatioUi: string;
  utilizationUi: string;
  lockedAmountUi: string;
  assetsOwnedAmountUi: string;
  totalUsdOwnedAmountUi: string;
  availableToAddAmountUi: string;
  availableToAddUsdUi: string;
  availableToRemoveAmountUi: string;
  availableToRemoveUsdUi: string;
  minCapacityAmountUi: string;
  maxCapacityAmountUi: string;
}

// export interface PoolStats {
//   totalFees: BN;
//   totalVolume: BN;
//   currentLongPositionsUsd: BN;
//   currentShortPositionsUsd : BN;
// }

export class PoolDataClient {

  public poolConfig: PoolConfig;
  public pool: PoolAccount;
  public lpTokenInfo: Mint;
  public custodies: CustodyAccount[];
  public markets: MarketAccount[];


  constructor(poolConfig: PoolConfig, pool: PoolAccount, lpTokenInfo: Mint, custodies: CustodyAccount[]) {
    this.poolConfig = poolConfig;
    this.pool = pool;
    this.lpTokenInfo = lpTokenInfo;
    this.custodies = custodies;
  }

  loadCustodies(custodies: CustodyAccount[]) {
    this.custodies = custodies;
  }

  loadPoolData(pool: PoolAccount) {
    this.pool = pool
  }

  loadLpData(lpTokenInfo: Mint) {
    this.lpTokenInfo = lpTokenInfo
  }

  // getOiLongUI() {
  //   let totalAmount = new BN('0');
  //   this.custodies.forEach(i => {
  //     totalAmount = totalAmount.add(i.tradeStats.oiLong);
  //   })
  //   return totalAmount;
  // }

  // getOiShortUI() {
  //   let totalAmount = new BN('0');
  //   this.custodies.forEach(i => {
  //     totalAmount = totalAmount.add(i.tradeStats.oiShort);
  //   })
  //   return totalAmount;
  // }

  // TODO: should take pnl's into account 
  getLpStats(pricesMap: Map<string, { price: OraclePrice; emaPrice: OraclePrice }>) :LpStats {

    let stableCoinAmountBni = new BigNumber(0);
    let totalPoolValueUsdBnUi = new BigNumber(0);

    for (const custodyConfig of this.poolConfig.custodies) {
      if(custodyConfig.isVirtual) continue
      const custodyAccount = this.custodies.find(t => t.mint.toBase58() === custodyConfig.mintKey.toBase58())
      if (custodyAccount) {
        const priceBnUi = new BigNumber(pricesMap.get(custodyConfig.symbol).price.toUiPrice(8));   // need to take 8 decimals than USD_DECIMALS for bonk
        const ownedBnUi = new BigNumber(custodyAccount.assets.owned.toString()).dividedBy(10**custodyConfig.decimals); 
        const ownedUsdBnUi = ownedBnUi.multipliedBy(priceBnUi)

        if (custodyAccount.isStable) {
          stableCoinAmountBni = stableCoinAmountBni.plus(ownedBnUi)
        }
       // TODO: later do MAX price for POOL AUM 
        totalPoolValueUsdBnUi = totalPoolValueUsdBnUi.plus(ownedUsdBnUi)
      }
    }

    // const lpPrice = totalPoolValueUsdBnUi.div(new BN(this.lpTokenInfo.supply.toString() === '0' ? 1 : ))
    const lpTokenSupplyUi = new BigNumber(this.lpTokenInfo.supply.toString()).dividedBy(10**LP_DECIMALS);
    const lpTokenPriceUsdBnUi = this.lpTokenInfo.supply.toString() === '0' ? 
                          totalPoolValueUsdBnUi : 
                          totalPoolValueUsdBnUi.dividedBy(lpTokenSupplyUi)

    // const stableCoinPercentage = stableCoinAmountBni.mul(new BN(PERCENTAGE_DECIMALS)).div(totalPoolValueUsdBnUi)
    const stableCoinPercentageBnUi = stableCoinAmountBni.multipliedBy(100).dividedBy(totalPoolValueUsdBnUi)
    return {
      lpTokenSupply: new BN(this.lpTokenInfo.supply.toString()),
      decimals: this.poolConfig.lpDecimals,
      totalPoolValueUsd: uiDecimalsToNative(totalPoolValueUsdBnUi.toString(),USD_DECIMALS),
      totalPoolValueUsdUi : totalPoolValueUsdBnUi.toFixed(2,BigNumber.ROUND_DOWN),
      price : (uiDecimalsToNative(lpTokenPriceUsdBnUi.toString(),USD_DECIMALS)),
      priceUi: lpTokenPriceUsdBnUi.toFixed(2,BigNumber.ROUND_DOWN),
      stableCoinPercentage: stableCoinPercentageBnUi.toFixed(2,BigNumber.ROUND_DOWN),
      marketCap: uiDecimalsToNative(totalPoolValueUsdBnUi.toString(),USD_DECIMALS), // will be same as AUM 
    }
  }

  // TODO: should take pnl's into account and MIN/MAX ratio remove HARD-CODED values
  getCustodyStats(pricesMap: Map<string, { price: OraclePrice; emaPrice: OraclePrice }> ): CustodyStats[]  {
    const totalPoolValueUsd = this.getLpStats(pricesMap).totalPoolValueUsd;

    const totalPoolValueUsdUi = totalPoolValueUsd.isZero() ? '0' : nativeToUiDecimals(totalPoolValueUsd, USD_DECIMALS, USD_DECIMALS);
    
    const custodyDetails : CustodyStats[] = [];

    for (let i = 0; i < this.poolConfig.custodies.length; i++) {
      const custodyConfig = this.poolConfig.custodies[i];
      if(custodyConfig.isVirtual) continue

      const tokenRatio = this.pool.ratios[i]
      const custodyAccount = this.custodies.find(t => t.mint.toBase58() === custodyConfig.mintKey.toBase58())
      if (!custodyAccount) continue;
      // TODO: later do MAX price for POOL AUM  
      const priceBnUi = new BigNumber(pricesMap.get(custodyConfig.symbol).price.toUiPrice(8));  // need to take 8 decimals than USD_DECIMALS for bonk

      const ownedBnUi = new BigNumber(custodyAccount.assets.owned.toString()).dividedBy(10**custodyConfig.decimals); 
      const ownedUsdBnUi = ownedBnUi.multipliedBy(priceBnUi); 

      const lockedBnUi = new BigNumber(custodyAccount.assets.locked.toString()).dividedBy(10**custodyConfig.decimals); 

      const utilizationBnUi = (custodyAccount.assets.locked.isZero() || custodyAccount.assets.owned.isZero()) ? new BigNumber(0) :
                                  lockedBnUi.dividedBy(ownedBnUi).multipliedBy(100);

      const currentRatioBnUi = totalPoolValueUsd.isZero() ? new BigNumber(0) : ownedBnUi.multipliedBy(priceBnUi).dividedBy(totalPoolValueUsdUi).multipliedBy(100);

      let minRatioBnUi = tokenRatio.min.isZero() ? new BigNumber(5) : new BigNumber(tokenRatio.min.toString()).div(100);
      let maxRatioBnUi = tokenRatio.max.toString()==='10000' ? new BigNumber(95) : new BigNumber(tokenRatio.max.toString()).div(100); 
      // currently just hardcoding to 20 and 30
      // let minRatioBnUi = new BigNumber(20) 
      // let maxRatioBnUi = new BigNumber(30)

      const availableToAddUsdBnUi = currentRatioBnUi.isGreaterThanOrEqualTo(maxRatioBnUi) ?
                                         new BigNumber(0) :
                                        maxRatioBnUi.minus(currentRatioBnUi).multipliedBy(totalPoolValueUsdUi).div(100);
      const availableToAddAmountBnUi = availableToAddUsdBnUi.dividedBy(priceBnUi)

      const availableToRemoveUsdUi = minRatioBnUi.isGreaterThanOrEqualTo(currentRatioBnUi) ?
                                      new BigNumber(0) :
                                      currentRatioBnUi.minus(minRatioBnUi).multipliedBy(totalPoolValueUsdUi).div(100);
      const availableToRemoveAmountBnUi = availableToRemoveUsdUi.dividedBy(priceBnUi)

      const minCapacityUsdBnUi = minRatioBnUi.multipliedBy(totalPoolValueUsdUi).div(100);
      const minCapacityAmountBnUi = minCapacityUsdBnUi.dividedBy(priceBnUi)

      const maxCapacityUsdBnUi = maxRatioBnUi.multipliedBy(totalPoolValueUsdUi).div(100);
      const maxCapacityAmountBnUi = maxCapacityUsdBnUi.dividedBy(priceBnUi)

      if (custodyAccount && tokenRatio) {
        custodyDetails.push({
          symbol: custodyConfig.symbol,
          priceUi: pricesMap.get(custodyConfig.symbol).price.toUiPrice(custodyConfig.usdPrecision),

          minRatio: tokenRatio.min,
          minRatioUi: nativeToUiDecimals(tokenRatio.min, 2, 2),

          maxRatio: tokenRatio.max,
          maxRatioUi: nativeToUiDecimals(tokenRatio.max, 2, 2),


          targetRatio: tokenRatio.target,
          targetRatioUi: nativeToUiDecimals(tokenRatio.target, 2, 2),

          currentRatio: uiDecimalsToNative(currentRatioBnUi.toString(),2),
          currentRatioUi: currentRatioBnUi.toFixed(2, BigNumber.ROUND_DOWN),

          utilizationUi: utilizationBnUi.toFixed(2,BigNumber.ROUND_DOWN),// 50% = 5000 decimals=2

          lockedAmountUi: lockedBnUi.toFixed(4,BigNumber.ROUND_DOWN),
          assetsOwnedAmountUi: ownedBnUi.toFixed(4,BigNumber.ROUND_DOWN),
          totalUsdOwnedAmountUi: ownedUsdBnUi.toFixed(2,BigNumber.ROUND_DOWN),

          availableToAddAmountUi: availableToAddAmountBnUi.toFixed(4,BigNumber.ROUND_DOWN),
          availableToAddUsdUi: availableToAddUsdBnUi.toFixed(2, BigNumber.ROUND_DOWN),

          availableToRemoveAmountUi: availableToRemoveAmountBnUi.toFixed(4,BigNumber.ROUND_DOWN),
          availableToRemoveUsdUi: availableToRemoveUsdUi.toFixed(2, BigNumber.ROUND_DOWN),

          minCapacityAmountUi: minCapacityAmountBnUi.toFixed(custodyConfig.decimals),
          maxCapacityAmountUi: maxCapacityAmountBnUi.toFixed(custodyConfig.decimals),
        })
      }
    }
    return custodyDetails;
  }

  // getPoolStats() : PoolStats {
  //   let totalFees = new BN(0)
  //   let totalVolume = new BN(0)
  //   let currentLongPositionsUsd = new BN(0)
  //   let currentShortPositionsUsd = new BN(0)

  //   for (const custody of this.poolConfig.custodies) {
  //     const custodyData = this.custodies.find(t => t.mint.toBase58() === custody.mintKey.toBase58())
  //     if (custodyData) {
  //       const collectedFees = custodyData.fees_stats.accrued.sub(custodyData.fees_stats.paid)
  //       totalFees = totalFees.add(collectedFees)

        
  //     }
  //   }
  //   for (const market of this.poolConfig.markets) {
  //     const marketData = this.markets.find(t => t.publicKey.toBase58() === market.marketAccount.toBase58())
  //     if (marketData) {
  //       // const custodyVolume = Object.values(custodyData.volumeStats).reduce((a: BN, b: BN) => a.add(b), new BN(0))
  //       // totalVolume = totalVolume.add(custodyVolume)
  //       if(market.side === Side.Long) {
  //         currentLongPositionsUsd = currentLongPositionsUsd.add(marketData.openInterest)
  //       } else {
  //         currentShortPositionsUsd = currentShortPositionsUsd.add(marketData.openInterest)
  //       }
  //     }
  //   }
  //   return {
  //     totalFees,
  //     totalVolume,
  //     currentLongPositionsUsd,
  //     currentShortPositionsUsd
  //   }
  // }

} // PoolDisplayData