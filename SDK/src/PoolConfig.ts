import { Address } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import poolConfigs from './PoolConfig.json';
import { Side, isVariant } from './types';


export interface CustodyConfig {
  custodyId: number;
  custodyAccount: PublicKey;
  tokenAccount: PublicKey;
  symbol: string;
  mintKey: PublicKey;
  decimals: number;
  usdPrecision : number;
  tokenPrecision : number;
  isStable: boolean;
  isVirtual: boolean;
  intOracleAccount: PublicKey;
  extOracleAccount: PublicKey;
  pythTicker: string;
  pythPriceId: string;
}

export interface MarketConfig {
  marketId: number;
  marketAccount: PublicKey;
  marketCorrelation: boolean;
  pool: PublicKey;
  targetCustody: PublicKey;
  collateralCustody: PublicKey;
  side: Side;
  maxLev : number;
  targetCustodyId: number;
  collateralCustodyId: number;
  targetMint: PublicKey;
  collateralMint: PublicKey;
}

export type Token = {
  symbol: string;
  mintKey: PublicKey;
  decimals: number;
  usdPrecision : number;
  tokenPrecision : number;
  isStable: boolean;
  isVirtual: boolean;
  pythTicker: string;
  pythPriceId: string;
};

export class PoolConfig {
  constructor(
    public programId: PublicKey,
    public perpComposibilityProgramId: PublicKey,
    public fbNftRewardProgramId: PublicKey,
    public cluster: Cluster,
    public poolName: string,
    public poolAddress: PublicKey,
    public stakedLpTokenMint: PublicKey,
    public compoundingTokenMint: PublicKey,
    public stakedLpVault: PublicKey,
    public compoundingLpVault: PublicKey,
    public lpDecimals: number,
    public compoundingLpTokenSymbol: string,
    public stakedLpTokenSymbol: string,
    public perpetuals: PublicKey,
    public transferAuthority: PublicKey,
    public tokenMint: PublicKey,
    public tokenVault: PublicKey,
    public tokenVaultTokenAccount: PublicKey,
    public revenueTokenAccount: PublicKey,
    public protocolVault: PublicKey,
    public protocolTokenAccount: PublicKey,
    public multisig: PublicKey,
    public addressLookupTableAddresses: PublicKey[],
    public backupOracle: PublicKey,
    public nftCollectionAddress: PublicKey,
    public rewardDistributionProgram: {
      programId: PublicKey,
      transferAuthority: PublicKey,
      rewardVault: PublicKey,
      rewardMint: PublicKey,
      rewardTokenAccount: PublicKey,
    },

    public tokens: Token[],

    public custodies: CustodyConfig[],

    public markets: MarketConfig[],
  ) { }

  public getAllTokenMints(): PublicKey[] {
    return Array.from(
      this.tokens.map((token) => new PublicKey(token.mintKey)),
    );
  }

  public getMarketConfigByPk(marketAccountPk: PublicKey): MarketConfig {
    const market = this.markets.find(f => f.marketAccount.equals(marketAccountPk));
    if(!market) throw new Error(`No such market ${marketAccountPk.toBase58()} exists.`)
    return market
  }

  public getMarketConfig(
    targetCustody: PublicKey,
    collateralCustody: PublicKey,
    side: Side): MarketConfig | null {
    const marketAccountPk = this.getMarketPk(targetCustody, collateralCustody, side)
    const market = this.markets.find(f => f.marketAccount.equals(marketAccountPk));
    if(!market) return null
    // better to return NULL so that we can handle on UI , since difficult to validate each input
    // if(!market) throw new Error(`No such market : ${marketAccountPk.toBase58()} target:${targetCustody.toBase58()} collateral:${collateralCustody.toBase58()} side:${side} exists.`)
    return market
  }

  public getMarketPk(
    targetCustody: PublicKey,
    collateralCustody: PublicKey,
    side: Side
  ): PublicKey {
    return PublicKey.findProgramAddressSync([
      Buffer.from('market'),
      targetCustody.toBuffer(),
      collateralCustody.toBuffer(),
      Buffer.from([isVariant(side, 'long') ? 1 : 2])
    ], this.programId)[0]
  }

  public getPositionFromMarketPk(
    owner: PublicKey,
    marketAccount : PublicKey,
  ): PublicKey {
    return PublicKey.findProgramAddressSync([
      Buffer.from("position"),
      owner.toBuffer(),
      marketAccount.toBuffer(),
    ], this.programId)[0]
  }

  public getOrderFromMarketPk(
    owner: PublicKey,
    marketAccount : PublicKey,
  ): PublicKey {
    return PublicKey.findProgramAddressSync([
      Buffer.from("order"),
      owner.toBuffer(),
      marketAccount.toBuffer(),
    ], this.programId)[0]
  }

  public getPositionFromCustodyPk(
    owner: PublicKey,
    targetCustody : PublicKey,
    collateralCustody : PublicKey,
    side: Side
  ): PublicKey {
    return PublicKey.findProgramAddressSync([
      Buffer.from("position"),
      owner.toBuffer(),
       this.getMarketPk(targetCustody, collateralCustody, side).toBuffer(),
    ], this.programId)[0]
  }

  public doesMarketExist(pubkey: PublicKey): boolean {
    return 
  }

  public getAllMarketPks(): PublicKey[] {
    return this.markets.map(m => m.marketAccount);
  }

  public getNonStableTokens(): PublicKey[] {
    return Array.from(
      this.tokens
        .filter((token) => !token.isStable)
        .map((token) => new PublicKey(token.mintKey)),
    );
  }

  public getAllCustodies(): PublicKey[] {
    return Array.from(
      this.custodies.map((custody) => new PublicKey(custody.custodyAccount)),
    );
  }

  public getNonStableCustodies(): PublicKey[] {
    return Array.from(
      this.custodies
        .filter((custody) => !custody.isStable)
        .map((custody) => new PublicKey(custody.custodyAccount)),
    );
  }


  public getTokenFromSymbol = (symbol: string) : Token => {
    return this.tokens.find(f => f.symbol.toUpperCase() === symbol.toUpperCase())!;
  }

  public getTokenFromMintString = (mint: string) : Token => {
      return this.tokens.find(f => f.mintKey.toBase58() === mint)!;
  }

  public getTokenFromMintPk = (mint: PublicKey) : Token => {
      return this.tokens.find(f => f.mintKey.equals(mint))!;
  }


  // static getAllPoolConfigs(cluster: Cluster): PoolConfig[] {
  //   return poolConfigs.pools.map(p => this.fromIdsByName(p.poolName, cluster))
  // }

  static getCustodyConfig(custodyAccountPk: Address, poolName: string, cluster: Cluster) : CustodyConfig {
    return this.fromIdsByName(poolName, cluster).custodies.find(f => f.custodyAccount.toBase58() === custodyAccountPk.toString())
  }

  public getCustodyIdFromCustodyAccount(custodyAccountPk: Address): number {
    return this.custodies.find(f => f.custodyAccount.toBase58() === custodyAccountPk.toString()).custodyId;
  }

  public getCustodyAccountFromCustodyId(custodyId: number): PublicKey {
    return this.custodies.find(f => f.custodyId === custodyId).custodyAccount;
  }

  static getTokensInPool(name: string, cluster: Cluster): Token[] {
    const poolConfig = poolConfigs.pools.find((pool) => pool['poolName'] === name && cluster === pool['cluster']);
    if (!poolConfig) throw new Error(`No pool config ${name} found in Ids!`);
    const tokens :Token[] = poolConfig['tokens'].map(i => {
      return {
        ...i,
        usdPrecision : i.usdPrecision,
        tokenPrecision : i.tokenPrecision,
        mintKey: new PublicKey(i.mintKey)
      }
    })
    return tokens
  }

  static buildPoolconfigFromJson(poolConfig: typeof poolConfigs['pools'][0]): PoolConfig {
    let tokens: Token[] ;
    try {
      tokens = poolConfig['tokens'].map(i => {
        return {
          ...i,
          mintKey: new PublicKey(i.mintKey)
        }
      })
      
    } catch (error) {
      console.log("ERROR: buildPoolconfigFromJson  unable to load tokens ")
    }
    let custodies: CustodyConfig[];
    try {
      custodies = poolConfig['custodies'].map((i, index) => {
        return {
          ...i,
          custodyId: i.custodyId,
          custodyAccount: new PublicKey(i.custodyAccount),
          tokenAccount: new PublicKey(i.tokenAccount),
          mintKey: new PublicKey(i.mintKey),
          intOracleAccount: new PublicKey(i.intOracleAddress),
          extOracleAccount: new PublicKey(i.extOracleAddress),
          usdPrecision : i.usdPrecision,
          tokenPrecision : i.tokenPrecision,
        }
      })
      
    } catch (error) {
      console.log("ERROR: buildPoolconfigFromJson  unable to load custodies ")
    }

   
    let addressLookupTableAddresses: PublicKey[]
    try {
      addressLookupTableAddresses  = poolConfig['addressLookupTableAddresses'].map(i => {
        return new PublicKey(i)
      });
    } catch (error) {
      console.log("ERROR: buildPoolconfigFromJson  unable to load addressLookupTableAddresses ")
    }
   
    let markets: MarketConfig[]
    try {
      markets  = poolConfig['markets'].map(i => {
        return {
          ...i,
          marketAccount: new PublicKey(i.marketAccount),
          marketCorrelation : i.marketCorrelation,
          pool: new PublicKey(i.pool),
          targetCustody: new PublicKey(i.targetCustody),
          collateralCustody: new PublicKey(i.collateralCustody),
          side: i.side === 'long' ? Side.Long : Side.Short,
          maxLev : i.maxLev,
          targetMint: new PublicKey(i.targetMint),
          collateralMint: new PublicKey(i.collateralMint)
        }
      });
    } catch (error) {
      console.log("ERROR: buildPoolconfigFromJson  unable to load markets ")
    }

    return new PoolConfig(
      new PublicKey(poolConfig.programId),
      new PublicKey(poolConfig.perpComposibilityProgramId),
      new PublicKey(poolConfig.fbNftRewardProgramId),
      poolConfig.cluster as Cluster,
      poolConfig.poolName,
      new PublicKey(poolConfig.poolAddress),
      new PublicKey(poolConfig.stakedLpTokenMint),
      new PublicKey(poolConfig.compoundingTokenMint),
      new PublicKey(poolConfig.stakedLpVault),
      new PublicKey(poolConfig.compoundingLpVault),
      poolConfig.lpDecimals,
      poolConfig.compoundingLpTokenSymbol,
      poolConfig.stakedLpTokenSymbol,
      new PublicKey(poolConfig.perpetuals),
      new PublicKey(poolConfig.transferAuthority),
      new PublicKey(poolConfig.tokenMint),
      new PublicKey(poolConfig.tokenVault),
      new PublicKey(poolConfig.tokenVaultTokenAccount),
      new PublicKey(poolConfig.revenueTokenAccount),
      new PublicKey(poolConfig.protocolVault),
      new PublicKey(poolConfig.protocolTokenAccount),
      new PublicKey(poolConfig.multisig),
      addressLookupTableAddresses,
      new PublicKey(poolConfig.backupOracle),
      new PublicKey(poolConfig.nftCollectionAddress),
      {
        programId: new PublicKey(poolConfig.rewardDistributionProgram.programId),
        rewardMint: new PublicKey(poolConfig.rewardDistributionProgram.rewardMint),
        rewardTokenAccount: new PublicKey(poolConfig.rewardDistributionProgram.rewardTokenAccount),
        rewardVault:new PublicKey(poolConfig.rewardDistributionProgram.rewardVault),
        transferAuthority: new PublicKey(poolConfig.rewardDistributionProgram.transferAuthority),
      },
      tokens,
      custodies,
      markets
    );
  }

  static fromIdsByName(name: string, cluster: Cluster): PoolConfig {
    const poolConfig = poolConfigs.pools.find((pool) => pool['poolName'] === name && cluster === pool['cluster']);
    if (!poolConfig) {
      throw new Error(`No pool with ${name} found!`);
    }

    return PoolConfig.buildPoolconfigFromJson(poolConfig);
  }

  static fromIdsByPk(poolPk: PublicKey, cluster: Cluster): PoolConfig {
    const poolConfig = poolConfigs.pools.find(
      (pool) => pool['poolAddress'] === poolPk.toString() && cluster === pool['cluster'],
    );
    if (!poolConfig) {
      throw new Error(`No pool with ${poolPk.toString()} found!`);
    }

    return PoolConfig.buildPoolconfigFromJson(poolConfig)
  }
}
