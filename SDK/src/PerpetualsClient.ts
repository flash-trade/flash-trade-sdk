import {
  setProvider,
  Program,
  AnchorProvider,
  utils,
  BN,
} from "@coral-xyz/anchor";
import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
  Keypair,
  SYSVAR_RENT_PUBKEY,
  Commitment,
  Signer,
  AddressLookupTableAccount,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  createInitializeAccount3Instruction,
  getMinimumBalanceForRentExemptAccount,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { decode } from '@coral-xyz/anchor/dist/cjs/utils/bytes/base64'

import { sha256 } from "js-sha256";
import { encode } from "bs58";
import { Position, Side, TokenRatios, FlpStake, ContractOraclePrice, Privilege, OpenPositionParams, isVariant, FeesAction, AddLiquidityAmountAndFee, RemoveLiquidityAmountAndFee, RatioFee, FeesMode, MinAndMaxPrice, DEFAULT_POSITION, EntryPriceAndFee, ExitPriceAndFee, RemoveCollateralData, } from "./types";
import { Perpetuals } from "./idl/perpetuals";
import { PerpComposability } from "./idl/perp_composability";
import { FbnftRewards } from "./idl/fbnft_rewards";
import { RewardDistribution } from "./idl/reward_distribution";

import { IDL } from './idl/perpetuals';
import { IDL as PerpComposabilityIDL } from './idl/perp_composability';
import { IDL as FbNftIDL } from './idl/fbnft_rewards';
import { IDL as RewardDistributionIDL } from './idl/reward_distribution';

import { SendTransactionOpts, sendTransaction } from "./utils/rpc";
import { MarketConfig, PoolConfig, Token } from "./PoolConfig";
import { checkedDecimalCeilMul, checkedDecimalMul, checkIfAccountExists, getUnixTs, uiDecimalsToNative } from "./utils";
import { BN_ONE, BN_ZERO, BPS_DECIMALS, BPS_POWER, METAPLEX_PROGRAM_ID, ORACLE_EXPONENT, RATE_DECIMALS, RATE_POWER, USD_DECIMALS } from "./constants";
import { IdlCoder } from "./IdlCoder";
import { ViewHelper } from "./ViewHelper";
import { createBackupOracleInstruction } from "./createBackupOracleInstruction";
import { getNftAccounts } from "./utils/getNftAccounts";
import { PositionAccount } from "./PositionAccount";
import { OraclePrice } from "./OraclePrice";
import { CustodyAccount } from "./CustodyAccount";
import { PoolAccount } from "./PoolAccount";
import { MarketAccount } from "./MarketAccount";
import BigNumber from "bignumber.js";

export type PerpClientOptions = {
  postSendTxCallback?: ({ txid }: { txid: string }) => void;
  prioritizationFee?: number;
  txConfirmationCommitment?: Commitment;
};

export class PerpetualsClient {
  provider: AnchorProvider;
  program: Program<Perpetuals>;
  programPerpComposability: Program<PerpComposability>;
  programFbnftReward: Program<FbnftRewards>;
  programRewardDistribution: Program<RewardDistribution>;

  admin: PublicKey;
  programId: PublicKey;
  composabilityProgramId: PublicKey;

  // pdas
  multisig: { publicKey: PublicKey; bump: number };
  authority: { publicKey: PublicKey; bump: number };
  perpetuals: { publicKey: PublicKey; bump: number };
  addressLookupTables: AddressLookupTableAccount[] = [];

  eventAuthority: { publicKey: PublicKey; bump: number };
  eventAuthorityRewardDistribution: { publicKey: PublicKey; bump: number };

  private postSendTxCallback?: ({ txid }) => void;
  private prioritizationFee: number;
  private useExtOracleAccount: boolean;
  private txConfirmationCommitment: Commitment;
  private viewHelper: ViewHelper;

  constructor(provider: AnchorProvider, programId: PublicKey, composabilityProgramId: PublicKey, fbNftRewardProgramId: PublicKey, rewardDistributionProgramId: PublicKey, opts: PerpClientOptions, useExtOracleAccount = false) {

    this.provider = provider;
    setProvider(provider);

    this.program = new Program(IDL, programId);
    this.programPerpComposability = new Program(PerpComposabilityIDL, composabilityProgramId);
    this.programFbnftReward = new Program(FbNftIDL, fbNftRewardProgramId);
    this.programRewardDistribution = new Program(RewardDistributionIDL, rewardDistributionProgramId);
    this.programId = programId;
    this.composabilityProgramId = composabilityProgramId;
    this.admin = this.provider.wallet.publicKey;
    this.multisig = this.findProgramAddress("multisig");
    this.authority = this.findProgramAddress("transfer_authority");
    this.perpetuals = this.findProgramAddress("perpetuals");
    this.eventAuthority = this.findProgramAddress("__event_authority");
    this.eventAuthorityRewardDistribution = this.findProgramAddressFromProgramId("__event_authority", null, this.programRewardDistribution.programId)

    this.prioritizationFee = opts?.prioritizationFee || 0;
    this.useExtOracleAccount = useExtOracleAccount;
    this.postSendTxCallback = opts?.postSendTxCallback;
    this.txConfirmationCommitment = opts?.txConfirmationCommitment ?? 'processed'

    this.viewHelper = new ViewHelper(this);

    BN.prototype.toJSON = function () {
      return this.toString(10);
    };
  }

  setPrioritizationFee = (fee: number) => {
    this.prioritizationFee = fee;
  }

  loadAddressLookupTable = async (poolConfig: PoolConfig) => {
    const addresses: AddressLookupTableAccount[] = []
    for (const address of poolConfig.addressLookupTableAddresses) {
      const addressLookupTable = (await this.provider.connection.getAddressLookupTable(address)).value;
      if (addressLookupTable) {
        addresses.push(addressLookupTable);
      }
    }
    this.addressLookupTables = addresses;
  }

  findProgramAddress = (label: string, extraSeeds: any = null) => {
    let seeds = [Buffer.from(utils.bytes.utf8.encode(label))];
    if (extraSeeds) {
      for (let extraSeed of extraSeeds) {
        if (typeof extraSeed === "string") {
          seeds.push(Buffer.from(utils.bytes.utf8.encode(extraSeed)));
        } else if (Array.isArray(extraSeed)) {
          seeds.push(Buffer.from(extraSeed));
        } else {
          seeds.push(extraSeed.toBuffer());
        }
      }
    }
    let res = PublicKey.findProgramAddressSync(seeds, this.program.programId);
    return { publicKey: res[0], bump: res[1] };
  };

  findProgramAddressFromProgramId = (label: string, extraSeeds: any = null, programId = this.program.programId) => {
    let seeds = [Buffer.from(utils.bytes.utf8.encode(label))];
    if (extraSeeds) {
      for (let extraSeed of extraSeeds) {
        if (typeof extraSeed === "string") {
          seeds.push(Buffer.from(utils.bytes.utf8.encode(extraSeed)));
        } else if (Array.isArray(extraSeed)) {
          seeds.push(Buffer.from(extraSeed));
        } else {
          seeds.push(extraSeed.toBuffer());
        }
      }
    }
    let res = PublicKey.findProgramAddressSync(seeds, programId);
    return { publicKey: res[0], bump: res[1] };
  };


  // test helper
  adjustTokenRatios = (ratios: TokenRatios[]) => {
    if (ratios.length == 0) {
      return ratios;
    }
    let target = Math.floor(10000 / ratios.length);

    for (let ratio of ratios) {
      ratio.target = new BN(target);
    }

    if (10000 % ratios.length !== 0) {
      ratios[ratios.length - 1].target = new BN(
        target + (10000 % ratios.length)
      );
    }

    return ratios;
  };

  getPerpetuals = async () => {
    return this.program.account.perpetuals.fetch(this.perpetuals.publicKey);
  };

  getPoolKey = (name: string) => {
    return this.findProgramAddress("pool", name).publicKey;
  };

  getPool = async (name: string) => {
    return this.program.account.pool.fetch(this.getPoolKey(name));
  };

  getPools = async () => {

    let perpetuals = await this.getPerpetuals();
    return this.program.account.pool.fetchMultiple(perpetuals.pools);
  };

  getPoolLpTokenKey = (name: string) => {
    return this.findProgramAddress("lp_token_mint", [this.getPoolKey(name)])
      .publicKey;
  };

  getPoolCompoundingTokenKey = (name: string) => {
    return this.findProgramAddress("compounding_token_mint", [this.getPoolKey(name)])
      .publicKey;
  };

  getCustodyKey = (poolName: string, tokenMint: PublicKey) => {
    return this.findProgramAddress("custody", [
      this.getPoolKey(poolName),
      tokenMint,
    ]).publicKey;
  };

  getCustodyTokenAccountKey = (poolName: string, tokenMint: PublicKey) => {
    return this.findProgramAddress("custody_token_account", [
      this.getPoolKey(poolName),
      tokenMint,
    ]).publicKey;
  };

  getTradingAccount = async (tradingAccount: PublicKey) => {
    return this.program.account.trading.fetch(tradingAccount);
  };

  getMarketPk(
    targetCustody: PublicKey,
    collateralCustody: PublicKey,
    side: Side
  ): PublicKey {
    // return PublicKey.findProgramAddressSync([
    //   Buffer.from('market'),
    //   targetCustody.toBuffer(),
    //   collateralCustody.toBuffer(),
    //   Buffer.from([isVariant(side, 'long') ? 1 : 0])
    // ],  this.program.programId)[0]

    return this.findProgramAddress("market", [
      targetCustody,
      collateralCustody,
      side === 'long' ? [1] : [2], // short
    ]).publicKey;
  }

  getPositionKey(
    owner: PublicKey,
    targetCustody: PublicKey,
    collateralCustody: PublicKey,
    side: Side
  ): PublicKey {
    return this.findProgramAddress("position", [
      owner,
      this.getMarketPk(targetCustody, collateralCustody, side),
    ]).publicKey;
  }

  getPosition = async (postionKey: PublicKey) => {
    return this.program.account.position.fetch(postionKey);
  };

  getUserPosition = async (
    owner: PublicKey,
    targetCustody: PublicKey,
    collateralCustody: PublicKey,
    side: Side
  ) => {
    return this.program.account.position.fetch(
      this.getPositionKey(owner, targetCustody, collateralCustody, side)
    );
  };

  // also used in UI for fetching positions 
  getUserPositions = async (
    wallet: PublicKey,
    poolConfig: PoolConfig
  ) => {

    const marketAccountsPks = poolConfig.getAllMarketPks();

    const positionKeys = marketAccountsPks.map(f => this.findProgramAddress("position", [
      wallet,
      f
    ])).map(p => p.publicKey);

    let positionsDatas = (await this.provider.connection.getMultipleAccountsInfo(positionKeys)) ?? [];

    return positionsDatas
      .map((p, i) => ({ pubkey: positionKeys[i], data: p }))
      .filter(f => f.data !== null)
      .map(k => ({ pubkey: k.pubkey, ...this.program.account.position.coder.accounts.decode<Position>('position', k.data!.data) }))
  };

  getPoolTokenPositions = async (poolName: string, tokenMint: PublicKey, collateralMint: PublicKey) => {
    let poolKey = this.getPoolKey(poolName);
    let custodyKey = this.getCustodyKey(poolName, tokenMint);
    let collateralCustodyKey = this.getCustodyKey(poolName, collateralMint);

    let data = encode(
      Buffer.concat([poolKey.toBuffer(), custodyKey.toBuffer(), collateralCustodyKey.toBuffer()])
    );

    const positions = await this.program.account.position.all([
      { memcmp: { offset: 72, bytes: data } },
    ])

    return positions;
  };

  getAllPositions = async () => {
    return this.program.account.position.all();
  };

  getAccountDiscriminator = (name: string) => {
    return Buffer.from(sha256.digest(`account:${name}`)).slice(0, 8);
  };


  log = (...message: string[]) => {
    let date = new Date();
    let date_str = date.toDateString();
    let time = date.toLocaleTimeString();
    console.log(`[${date_str} ${time}] ${message}`);
  };

  prettyPrint = (object: object) => {
    console.log(JSON.stringify(object, null, 2));
  };


  ///////
  // instructions

  liquidate = async (
    positionAccount: PublicKey,
    poolConfig: PoolConfig,
    tokenMint: PublicKey,
    collateralMint: PublicKey,
    marketPk: PublicKey,
  ) => {

    const targetCustodyConfig = poolConfig.custodies.find(f => f.mintKey.equals(tokenMint))
    const collateralCustodyConfig = poolConfig.custodies.find(f => f.mintKey.equals(collateralMint))

    return await this.program.methods
      .liquidate({})
      .accounts({
        signer: this.provider.wallet.publicKey,
        perpetuals: this.perpetuals.publicKey,
        pool: poolConfig.poolAddress,
        position: positionAccount,
        market: marketPk,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
        eventAuthority: this.eventAuthority.publicKey,
        program: this.program.programId,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .instruction();
  };



  ///////
  /// SYNC FUNCTIONS
  
  // ** SYNC


  getAddLiquidityAmountAndFeeSync = (
      amountIn: BN,
      poolAccount: PoolAccount,
      inputTokenPrice: OraclePrice,
      inputTokenEmaPrice: OraclePrice,
      inputTokenCustodyAccount: CustodyAccount,
      lpTokenSupplyAmount: BN, //with 10**LP_DECIMALS
      poolAumUsdMax: BN, //always pass the updated poolAumUsdMax
      poolConfig: PoolConfig,
  ): AddLiquidityAmountAndFee => {
     
      if(inputTokenCustodyAccount.isVirtual) {
        throw new Error("Virtual custody, cannot add liquidity")
      }

      if (!inputTokenPrice.exponent.eq(inputTokenEmaPrice.exponent)) { 
        throw new Error("exponent mistach")
      }

      const minMaxPrice = this.getMinAndMaxOraclePriceSync(inputTokenPrice, inputTokenEmaPrice, inputTokenCustodyAccount)
      const fee = this.getFeeHelper(FeesAction.AddLiquidity, amountIn, BN_ZERO, inputTokenCustodyAccount, minMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount;

      const tokenAmountUsd = minMaxPrice.min.getAssetAmountUsd((amountIn.sub(fee)), inputTokenCustodyAccount.decimals)
      let lpTokenOut
      if (poolAumUsdMax.isZero()) {
        lpTokenOut = tokenAmountUsd
      } else {
        lpTokenOut = (tokenAmountUsd.mul(lpTokenSupplyAmount)).div(poolAumUsdMax)
      }

      return {
        lpAmountOut: lpTokenOut,
        fee: fee
      }
  }

  getRemoveLiquidityAmountAndFeeSync = (
    lpAmountIn: BN,
    poolAccount: PoolAccount,
    outputTokenPrice: OraclePrice,
    outputTokenEmaPrice: OraclePrice,
    outputTokenCustodyAccount: CustodyAccount,
    lpTokenSupply: BN,
    poolAumUsdMax: BN, //always pass the updated poolAumUsdMax
    poolConfig: PoolConfig,
): RemoveLiquidityAmountAndFee => {
    
    if (!outputTokenPrice.exponent.eq(outputTokenEmaPrice.exponent)  ) { // || !outputTokenPrice.exponent.eq(new BN(-8))
      throw new Error("exponent mistach")
    }

    const minMaxPrice = this.getMinAndMaxOraclePriceSync(outputTokenPrice, outputTokenEmaPrice, outputTokenCustodyAccount)

    const removeAmountUsd = (poolAumUsdMax.mul(lpAmountIn)).div(lpTokenSupply)
    let removeAmount
    const oneOracle = OraclePrice.from({price: new BN(10**8), exponent: new BN(-8), confidence: BN_ZERO, timestamp: BN_ZERO })
    if(outputTokenCustodyAccount.isStable && minMaxPrice.min != minMaxPrice.max && minMaxPrice.max.price.lt(oneOracle.price) ) {
      removeAmount = oneOracle.getTokenAmount(removeAmountUsd, outputTokenCustodyAccount.decimals)
    } else {
      removeAmount = minMaxPrice.max.getTokenAmount(removeAmountUsd, outputTokenCustodyAccount.decimals)
    }

    const fee = this.getFeeHelper(FeesAction.RemoveLiquidity, BN_ZERO, removeAmount, outputTokenCustodyAccount, minMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount
    return {
        tokenAmountOut: removeAmount.sub(fee),
        fee: fee, // NOTE: this fee is in normal tokens and not LP
    }

  }

  private getNewRatioHelper(
    amountAdd: BN,
    amountRemove: BN,
    custodyAccount: CustodyAccount, 
    maxPriceOracle: OraclePrice, //max price
    poolAumUsdMax: BN
  ): BN {
    let newRatio = BN_ZERO;

    let tokenAumUsd = maxPriceOracle.getAssetAmountUsd(custodyAccount.assets.owned, custodyAccount.decimals)

    if (amountAdd.gt(BN_ZERO) && amountRemove.gt(BN_ZERO) ){
      throw new Error("cannot add and remove liquidity together")
    } else if (amountAdd.isZero() && amountRemove.isZero()){
      newRatio = (tokenAumUsd.mul(new BN(BPS_POWER))).div(poolAumUsdMax)
    } else if (amountAdd.gt(BN_ZERO)) {
      let amountUsd = maxPriceOracle.getAssetAmountUsd(amountAdd, custodyAccount.decimals)
      newRatio = ((tokenAumUsd.add(amountUsd)).mul(new BN(BPS_POWER))).div(poolAumUsdMax.add(amountUsd))
    } else {
      let amountUsd = maxPriceOracle.getAssetAmountUsd(amountRemove, custodyAccount.decimals)
      if (amountUsd.gte(poolAumUsdMax) || amountRemove.gte(custodyAccount.assets.owned)) {
        newRatio = BN_ZERO
      } else {
        newRatio = ((tokenAumUsd.sub(amountUsd)).mul(new BN(BPS_POWER))).div(poolAumUsdMax.sub(amountUsd))
      }
    }
    return newRatio
  }

  getFeeHelper = (
    action: FeesAction,
    amountAdd: BN,
    amountRemove: BN,
    inputTokenCustodyAccount: CustodyAccount, 
    maxOraclePrice: OraclePrice, //max price
    poolAumUsdMax: BN,
    poolAccount: PoolAccount,
    poolConfig: PoolConfig,
  ): {feeBps: BN, feeAmount: BN} => {
    let fees : RatioFee;
    switch (action) { // check if we have to use isVarient? currently working fine
      case FeesAction.AddLiquidity:
        fees = inputTokenCustodyAccount.fees.addLiquidity;
        break;
      case FeesAction.RemoveLiquidity:
        fees = inputTokenCustodyAccount.fees.removeLiquidity;
        break;
      case FeesAction.SwapIn:
        fees = inputTokenCustodyAccount.fees.swapIn;
        break;
      case FeesAction.SwapOut:
        fees = inputTokenCustodyAccount.fees.swapOut;
        break;
    }

    if(inputTokenCustodyAccount.fees.mode == FeesMode.Fixed) {
      return {feeBps: fees.minFee, feeAmount: BN.max(amountAdd, amountRemove).mul(fees.minFee).div(new BN(RATE_POWER))}
    } 

    const newRatio = this.getNewRatioHelper(amountAdd, amountRemove, inputTokenCustodyAccount, maxOraclePrice, poolAumUsdMax) 

    const inputCustodyConfig = poolConfig.custodies.find(i => i.custodyAccount.equals(inputTokenCustodyAccount.publicKey))!;
    const index = inputCustodyConfig.custodyId; 

    const ratios = poolAccount.ratios[index]
    let fee = BN_ZERO;
    if (action == FeesAction.AddLiquidity || action == FeesAction.SwapIn || action == FeesAction.StableSwapIn) {
      if (newRatio.lte(ratios.min)) {
        fee = fees.minFee;
      } else if (newRatio.lte(ratios.target)  && ratios.target.gt(ratios.min)) {
        fee = fees.minFee.add(
          (newRatio.sub(ratios.min)).mul(fees.targetFee.sub(fees.minFee)).div(
            ratios.target.sub(ratios.min)
          )
        )
      } else if (newRatio.lte(ratios.max) && ratios.max.gt(ratios.target)) {
        fee = fees.targetFee.add(
          (newRatio.sub(ratios.target)).mul(fees.maxFee.sub(fees.targetFee)).div(
            ratios.max.sub(ratios.target)
          )
        )
      } else {
        fee = fees.maxFee;
      }
    } else {
      if (newRatio.gte(ratios.max)) {
        fee = fees.minFee
      } else if (newRatio.gte(ratios.target) && ratios.max.gt(ratios.target) ) {
        fee = fees.minFee.add(
          (ratios.max.sub(newRatio)).mul(fees.targetFee.sub(fees.minFee)).div(
            ratios.max.sub(ratios.target)
          )
        )
      } else if (newRatio.gte(ratios.min) && ratios.target.gt(ratios.min) ) {
        fee = fees.targetFee.add(
          (ratios.target.sub(newRatio)).mul(fees.maxFee.sub(fees.targetFee)).div(
            ratios.target.sub(ratios.min)
          )
        )
      } else {
        fee = fees.maxFee
      }
    }
    // console.log("fee", fee.toString())
    const feeAmount = BN.max(amountAdd, amountRemove).mul(fee).div(new BN(RATE_POWER));
    return {feeBps: fee, feeAmount}
  }

  getMinAndMaxOraclePriceSync = (
    price: OraclePrice,
    emaPrice: OraclePrice,
    custodyAccount: CustodyAccount,
  ): {
    min: OraclePrice,
    max: OraclePrice
  } => {

    let maxPrice = price;
    let minPrice = price; 
    let divergenceBps: BN;
    if (custodyAccount.isStable) {
      const oneUsdPrice =  OraclePrice.from({
        price: new BN(10).pow(maxPrice.exponent.abs()), // 1 USD
        exponent: maxPrice.exponent,
        confidence: maxPrice.confidence,
        timestamp: maxPrice.timestamp 
      })
      divergenceBps = maxPrice.getDivergenceFactor(oneUsdPrice)
    } else {

      divergenceBps = maxPrice.getDivergenceFactor(emaPrice)
    }
    
    // greater than max divergence
    if (divergenceBps.gte(custodyAccount.oracle.maxDivergenceBps)) {

      let confBps = (maxPrice.confidence.muln(BPS_POWER)).div(maxPrice.price);

      if (confBps.lt(custodyAccount.oracle.maxConfBps)) {
      
        minPrice.price = maxPrice.price.sub(maxPrice.confidence);
        maxPrice.price = maxPrice.price.add(maxPrice.confidence);

        return {
          min: minPrice,
          max: maxPrice
        };
      } else { 
        //TODO: Flag close only mode and default to backup oracle
         minPrice.price = maxPrice.price.sub(maxPrice.confidence);
         return {
          min: minPrice,
          max: maxPrice
        };
      }
    } else{
      return {
        min: maxPrice, 
        max: maxPrice
      };
    }
    
  }

  getMinAndMaxPriceSync = (
    price: OraclePrice,
    emaPrice: OraclePrice,
    custodyAccount: CustodyAccount,
  ): MinAndMaxPrice => {

    let minPrice = price; 
    let divergenceBps: BN;
    if (custodyAccount.isStable) {
      divergenceBps = price.getDivergenceFactor(OraclePrice.from({price: new BN(10).pow(price.exponent.abs()), exponent: price.exponent, confidence: price.confidence, timestamp: price.timestamp }))
    } else {
      divergenceBps = price.getDivergenceFactor(emaPrice)
    }
    
    if (divergenceBps.gte(custodyAccount.oracle.maxDivergenceBps)) {
      let factorBps = (divergenceBps.mul(new BN(BPS_POWER))).div(custodyAccount.oracle.maxDivergenceBps)

      let confBps = (price.confidence.muln(BPS_POWER)).div(price.price);
      if (confBps.lt(custodyAccount.oracle.maxConfBps)) {
        let confFactor = BN.min(factorBps, new BN(50000)) 
        let confScale = (price.confidence.mul(confFactor)).div(new BN(BPS_POWER))

        minPrice.price = price.price.sub(confScale);
      } else { 
         minPrice.price = price.price.sub(price.confidence);
      }
    } else{
      return {
        min: price.scale_to_exponent(new BN(USD_DECIMALS).neg()).price, 
        max: price.scale_to_exponent(new BN(USD_DECIMALS).neg()).price
      };
    }
    return {
      min: minPrice.scale_to_exponent(new BN(USD_DECIMALS).neg()).price, 
      max: price.scale_to_exponent(new BN(USD_DECIMALS).neg()).price
    };
  }

  checkIfPriceStaleOrCustom = (
    price: OraclePrice,
    emaPrice: OraclePrice,
    custodyAccount: CustodyAccount,
    timestampInSeconds : BN,
  ): boolean => {

    // check for stale
    if(timestampInSeconds.lt(price.timestamp)){
      throw new Error("current time cannot be timepassed")
    }
    if( timestampInSeconds.sub(price.timestamp).gt(new BN(custodyAccount.oracle.maxPriceAgeSec)) ){
      return true;
    }

    // check for Custom oracle or CLOSE MODE
    let deviation: BN;
    if (custodyAccount.isStable) {
      deviation = price.getDivergenceFactor(OraclePrice.from({price: new BN(10).pow(price.exponent.abs()), exponent: price.exponent, confidence: price.confidence, timestamp: price.timestamp }))
    } else {
      deviation = price.getDivergenceFactor(emaPrice)
    }
    if (deviation.gte(custodyAccount.oracle.maxDivergenceBps)) {
      let confFactor = (price.confidence.muln(BPS_POWER)).div(price.price);
      if (confFactor.lt(custodyAccount.oracle.maxConfBps)) {
         return false;
      } else { 
         return true;
      }
    } 
    return false;
  }

  getAveragePriceSync = (price1: BN, size1: BN, price2: BN, size2: BN): BN => {
    const initialValue = size1.mul(price1)
    const addedValue = size2.mul(price2)

    const totalValue = initialValue.add(addedValue)
    const totalSize = size1.add(size2)

    const averageEntryPrice = totalValue.div(totalSize)
    return averageEntryPrice;
  }

  getLeverageSync = (
    sizeUsd : BN,
    collateralAmount : BN,
    collateralMinOraclePrice : OraclePrice,
    collateralTokenDecimals : number,
    pnlUsd : BN, // ZERO means isInitial = FALSE
  ) => {
    const currentCollateralUsd = collateralMinOraclePrice.getAssetAmountUsd(collateralAmount, collateralTokenDecimals)
    // called currentMarginUsd
    const currentCollateralUsdIncludingPnl =  currentCollateralUsd.add(pnlUsd)

    if(currentCollateralUsdIncludingPnl.gt(BN_ZERO)){
      return  sizeUsd.mul(new BN(BPS_POWER)).div(currentCollateralUsdIncludingPnl)
    } else {
      // U64_MAX
      return new BN( Number.MAX_SAFE_INTEGER)
    }
  }

   
  getLeverageAtAmountEntryWithSwapSync = (
    positionAccount: PositionAccount | null,   // because for new Position no Account
    inputDeltaAmount: BN, // should be +ve
    sizeDeltaAmount: BN, // should be +ve
    side : Side,
    poolAccount: PoolAccount,
    inputTokenPrice: OraclePrice,
    inputTokenEmaPrice: OraclePrice,
    inputTokenCustodyAccount: CustodyAccount,
    swapOutTokenPrice: OraclePrice,
    swapOutTokenEmaPrice: OraclePrice,
    swapOutTokenCustodyAccount: CustodyAccount,
    collateralTokenPrice: OraclePrice,
    collateralTokenEmaPrice: OraclePrice,
    collateralTokenCustodyAccount: CustodyAccount,
    targetTokenPrice: OraclePrice,
    targetTokenEmaPrice: OraclePrice,
    targetTokenCustodyAccount: CustodyAccount,
    swapPoolAumUsdMax: BN, //always pass the updated poolAumUsdMax 
    poolConfigPosition: PoolConfig,
    poolConfigSwap: PoolConfig,
    pnlUsd : BN, // ZERO means isInitial = FALSE used when EXISITING POSITION
  ) => {

    let finalCollateralAmount = BN_ZERO;
    if(!inputDeltaAmount.isZero()){
      if(inputTokenCustodyAccount.publicKey.equals(collateralTokenCustodyAccount.publicKey)){
        // no swap need
        finalCollateralAmount = inputDeltaAmount;
      } else {
        const swapAmountOut = this.getSwapAmountAndFeesSync(inputDeltaAmount, BN_ZERO, poolAccount, inputTokenPrice, inputTokenEmaPrice, inputTokenCustodyAccount, 
          swapOutTokenPrice, swapOutTokenEmaPrice, swapOutTokenCustodyAccount, swapPoolAumUsdMax, poolConfigSwap).minAmountOut
          finalCollateralAmount = swapAmountOut
      }
    }
   
    // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
    const lockedUsd = targetTokenPrice.getAssetAmountUsd(sizeDeltaAmount, targetTokenCustodyAccount.decimals)
    let entryOraclePrice = this.getEntryPriceUsdSync(
      side,
      targetTokenPrice,
      targetTokenEmaPrice,
      targetTokenCustodyAccount,
      lockedUsd// need sizeDeltaAmountUSDD 
    );

    let openFeeUsd:BN = BN_ZERO
    if (sizeDeltaAmount != BN_ZERO) {
      const sizeDeltaUsd = entryOraclePrice.getAssetAmountUsd(sizeDeltaAmount, targetTokenCustodyAccount.decimals)
      openFeeUsd = sizeDeltaUsd.mul(targetTokenCustodyAccount.fees.openPosition).div(new BN(RATE_POWER));
    }

    if (positionAccount === null) {
      const data: Position = {
          ...DEFAULT_POSITION,
      }
      positionAccount = PositionAccount.from(PublicKey.default, data);
    } else {
        positionAccount = positionAccount.clone()
        const positionEntryPrice = OraclePrice.from({
          price: positionAccount.entryPrice.price,
          exponent: new BN(positionAccount.entryPrice.exponent),
          confidence: BN_ZERO,
          timestamp: BN_ZERO})

          // new average
        entryOraclePrice.price = this.getAveragePriceSync(
            positionEntryPrice.price,
            positionAccount.sizeAmount,
            entryOraclePrice.price,
            sizeDeltaAmount
        )
    }

    const collateralMinOraclePrice = this.getMinAndMaxOraclePriceSync(
      collateralTokenPrice,
      collateralTokenEmaPrice,
      collateralTokenCustodyAccount
    ).min

    const collateralAmount = positionAccount.collateralAmount.add(finalCollateralAmount)
    const currentCollateralUsd = collateralMinOraclePrice.getAssetAmountUsd(collateralAmount, collateralTokenCustodyAccount.decimals)

    // called currentMarginUsd
    const currentCollateralUsdIncludingPnl =  currentCollateralUsd.add(pnlUsd).sub(openFeeUsd)

    const sizeAmount = positionAccount.sizeAmount.add(sizeDeltaAmount);

    const sizeAmountUsd = entryOraclePrice.getAssetAmountUsd(sizeAmount, targetTokenCustodyAccount.decimals);

    if(currentCollateralUsdIncludingPnl.gt(BN_ZERO)){
      return  sizeAmountUsd.mul(new BN(BPS_POWER)).div(currentCollateralUsdIncludingPnl)
    } else {
      // U64_MAX
      return new BN( Number.MAX_SAFE_INTEGER)
    }
  }


  getEntryPriceAndFeeSync = (
      positionAccount: PositionAccount | null,   // because for new Position no Account
      marketCorrelation: boolean,
      collateralDeltaAmount: BN, // should be +ve
      sizeDeltaAmount: BN, // should be +ve
      side : Side,
      targetPrice: OraclePrice,
      targetEmaPrice: OraclePrice,
      targetCustodyAccount: CustodyAccount,
      collateralPrice: OraclePrice,
      collateralEmaPrice: OraclePrice,
      collateralCustodyAccount: CustodyAccount,
      currentTimestamp : BN,
      discountBps = BN_ZERO,
  ): EntryPriceAndFee => {

      if (collateralDeltaAmount.isNeg() || sizeDeltaAmount.isNeg()) {
        throw new Error("Delta Amounts cannot be negative.")
      }

    const lockedUsd = targetPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)
      let entryOraclePrice = this.getEntryPriceUsdSync(
          side,
          targetPrice,
          targetEmaPrice,
          targetCustodyAccount,
          lockedUsd
      );


      if (positionAccount === null) {
          const data: Position = {
              ...DEFAULT_POSITION,
          }

          positionAccount = PositionAccount.from(PublicKey.default, data);
          let sizeUsd = entryOraclePrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals);
          positionAccount.sizeUsd = sizeUsd;
          positionAccount.sizeDecimals = targetCustodyAccount.decimals;
          positionAccount.collateralDecimals = collateralCustodyAccount.decimals;
          positionAccount.lockedDecimals = collateralCustodyAccount.decimals;

      } else {
          positionAccount = positionAccount.clone()
          const positionEntryPrice = OraclePrice.from({
            price: positionAccount.entryPrice.price,
            exponent: new BN(positionAccount.entryPrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })


          entryOraclePrice.price = this.getAveragePriceSync(
              positionEntryPrice.price, //USD_DECIMALS
              positionAccount.sizeAmount,
              entryOraclePrice.price, //USD_DECIMALS
              sizeDeltaAmount
          )

          let sizeDeltaUsd = entryOraclePrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals);
          positionAccount.sizeUsd = positionAccount.sizeUsd.add(sizeDeltaUsd)
      }

      positionAccount.collateralAmount = positionAccount.collateralAmount.add(collateralDeltaAmount);
      positionAccount.sizeAmount = positionAccount.sizeAmount.add(sizeDeltaAmount);

      const lockFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(positionAccount, collateralCustodyAccount, currentTimestamp)

      const liquidationPrice = this.getLiquidationPriceSync(
        positionAccount.collateralAmount,
        positionAccount.sizeAmount,
        entryOraclePrice,
        lockFeeUsd,
        marketCorrelation,
        side,
        targetCustodyAccount,
        collateralPrice, 
        collateralEmaPrice,
        collateralCustodyAccount,
        positionAccount,
      )

      const sizeAmountUsd = entryOraclePrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals);
      const collateralTokenMinOraclePrice = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount).min;

      let feeUsd = BN_ZERO;
      let feeAmount = BN_ZERO;
      let feeUsdAfterDiscount = BN_ZERO;
      let feeAmountAfterDiscount = BN_ZERO;


      if (positionAccount !== null && sizeDeltaAmount.isZero()) {
          // no fee when adding collateral
      } else {
          feeUsd = sizeAmountUsd.mul(targetCustodyAccount.fees.openPosition).div(new BN(RATE_POWER));
          feeAmount = feeUsd.mul(new BN(10**collateralCustodyAccount.decimals)).div(collateralTokenMinOraclePrice.price);

          if(discountBps.gt(BN_ZERO)){
            feeUsdAfterDiscount = feeUsd.mul(discountBps).div(new BN(BPS_POWER));
            feeUsdAfterDiscount = feeUsd.sub(feeUsdAfterDiscount);
            feeAmountAfterDiscount = feeUsdAfterDiscount.mul(new BN(10**collateralCustodyAccount.decimals)).div(collateralTokenMinOraclePrice.price);
          } else {
            feeUsdAfterDiscount = feeUsd
            feeAmountAfterDiscount = feeAmount
          }
      }

      return {
          entryOraclePrice: entryOraclePrice,
          feeUsd: feeUsd,
          feeAmount: feeAmount,
          feeUsdAfterDiscount : feeUsdAfterDiscount,
          feeAmountAfterDiscount: feeAmountAfterDiscount,
          liquidationPrice: liquidationPrice
      }
  }

  getEntryPriceUsdSync = (
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    lockedUsd : BN
  ): OraclePrice => {
  
    const { min: minPrice, max: maxPrice } = this.getMinAndMaxOraclePriceSync(targetPrice, targetEmaPrice, targetCustodyAccount);
    const spread = this.getTradeSpread(targetCustodyAccount, lockedUsd)
    // console.log("SDK : spread:",spread.toString())

    const USD_POWER = (new BN(10)).pow(new BN(USD_DECIMALS))
    const entryPriceBN = isVariant(side, 'long') ?
        maxPrice.price.add(maxPrice.price.mul(spread).div(USD_POWER)):
        minPrice.price.sub(minPrice.price.mul(spread).div(USD_POWER));

    const entryOraclePrice = OraclePrice.from({ price : entryPriceBN, exponent : maxPrice.exponent, confidence : maxPrice.confidence, timestamp : maxPrice.timestamp })

    return entryOraclePrice; 
  }

  getPriceAfterSlippage (
    isEntry : boolean,
    slippageBps : BN,
    targetPrice: OraclePrice,
    side: Side
) : ContractOraclePrice {
    if(isEntry){
        const currentPrice = targetPrice.price
        
        let spread_i = checkedDecimalCeilMul(
            currentPrice,
            targetPrice.exponent,
            slippageBps,
            new BN(-1 * BPS_DECIMALS),
            targetPrice.exponent,
        );

        if (isVariant(side, 'long')) {
            return { price : currentPrice.add(spread_i) , exponent : targetPrice.exponent.toNumber() };
        } else {
            if (spread_i.lt(currentPrice) ){
              return { price : currentPrice.sub(spread_i) , exponent : targetPrice.exponent.toNumber() };
            } else {
              return { price : BN_ZERO , exponent : targetPrice.exponent.toNumber() };
            };
        }
    } else {
      const current_price = targetPrice.price;
        
        let spread_i = checkedDecimalCeilMul(
            current_price,
            targetPrice.exponent,
            slippageBps,
            new BN(-1 * BPS_DECIMALS),
            targetPrice.exponent,
        );
        if (isVariant(side, 'long')) {
            if (spread_i.lt(current_price) ){
              return { price : current_price.sub(spread_i) , exponent : targetPrice.exponent.toNumber() };
            } else {
              return { price : BN_ZERO , exponent : targetPrice.exponent.toNumber() };
            };
        } else {
          return { price : current_price.add(spread_i) , exponent : targetPrice.exponent.toNumber() };
        }

    }
   }

  getExitFeeSync = (
    positionAccount: PositionAccount,
    targetCustody: CustodyAccount,
    collateralCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    discountBps = BN_ZERO
  ) => {

    let closePositionFeeRate = targetCustody.fees.closePosition

    if(!discountBps.isZero()){
      closePositionFeeRate = closePositionFeeRate.mul(BN_ONE.sub(discountBps));
    }

    const exitFeeUsd = positionAccount.sizeUsd.mul(closePositionFeeRate).div(new BN(RATE_POWER));// this should be in PRICE DECIMALS
    const { min: collateralTokenMinOraclePrice } = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount);    
    const exitFeeAmount = collateralTokenMinOraclePrice.getTokenAmount(exitFeeUsd, collateralCustodyAccount.decimals)
    return {
      exitFeeAmount,
      exitFeeUsd
    }
  }


  getExitPriceAndFeeSync = (
    positionAccount: PositionAccount,
    marketCorrelation: boolean,
    collateralDeltaAmount: BN, // should be +ve
    sizeDeltaAmount: BN, // should be +ve
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp : BN,
    discountBps = BN_ZERO,
  ): ExitPriceAndFee => {
    // Clone the positionAccount so as to not update the original param
    const resultingPositionAccount = positionAccount.clone()

    if (collateralDeltaAmount.isNeg() || sizeDeltaAmount.isNeg()) {
      throw new Error("Delta Amounts cannot be negative ")
    }

    resultingPositionAccount.collateralAmount = resultingPositionAccount.collateralAmount.sub(collateralDeltaAmount);
    resultingPositionAccount.sizeAmount = resultingPositionAccount.sizeAmount.sub(sizeDeltaAmount);

    if (resultingPositionAccount.collateralAmount.isNeg() || resultingPositionAccount.sizeAmount.isNeg()) {
      throw new Error("cannot remove/close more than collateral/Size")
    }

    const lockedUsd = targetPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)
    const exitOraclePrice = this.getExitOraclePriceSync(
      side,
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      lockedUsd
    )
    const { min: collateralTokenMinOraclePrice, max: collateralTokenMaxOraclePrice } = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount);


    const lockAndUnsettledFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(resultingPositionAccount, collateralCustodyAccount, currentTimestamp)
    const lockAndUnsettledFee = collateralTokenMinOraclePrice.getTokenAmount(lockAndUnsettledFeeUsd, collateralCustodyAccount.decimals);

    const sizeAmountUsd = exitOraclePrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals);
    
    // exitFee
    const exitFeeUsd = sizeAmountUsd.mul(targetCustodyAccount.fees.closePosition).div(new BN(RATE_POWER));
    const exitFeeAmount = collateralTokenMaxOraclePrice.getTokenAmount(exitFeeUsd, collateralCustodyAccount.decimals)

    let exitFeeUsdAfterDiscount = BN_ZERO;
    let exitFeeAmountAfterDiscount = BN_ZERO;

    if(discountBps.gt(BN_ZERO)){
      exitFeeUsdAfterDiscount = exitFeeUsd.mul(discountBps).div(new BN(BPS_POWER));
      exitFeeUsdAfterDiscount = exitFeeUsd.sub(exitFeeUsdAfterDiscount);
      exitFeeAmountAfterDiscount = collateralTokenMaxOraclePrice.getTokenAmount(exitFeeUsdAfterDiscount, collateralCustodyAccount.decimals)
    } else {
      exitFeeUsdAfterDiscount = exitFeeUsd
      exitFeeAmountAfterDiscount = exitFeeAmount
    }
    const positionEntryOraclePrice = new OraclePrice({
      price: positionAccount.entryPrice.price, exponent: new BN(positionAccount.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO
    })

    resultingPositionAccount.sizeUsd = positionEntryOraclePrice.getAssetAmountUsd(resultingPositionAccount.sizeAmount, targetCustodyAccount.decimals);

    const liquidationPrice = this.getLiquidationPriceSync(
      resultingPositionAccount.collateralAmount,
      resultingPositionAccount.sizeAmount,
      positionEntryOraclePrice,
      lockAndUnsettledFeeUsd,
      marketCorrelation,
      side,
      targetCustodyAccount,
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount,
      positionAccount
    )

    return {
      exitOraclePrice: exitOraclePrice,
      borrowFeeUsd: lockAndUnsettledFeeUsd,
      borrowFeeAmount: lockAndUnsettledFee,
      exitFeeUsd: exitFeeUsd,
      exitFeeAmount: exitFeeAmount,
      exitFeeUsdAfterDiscount: exitFeeUsdAfterDiscount,
      exitFeeAmountAfterDiscount: exitFeeAmountAfterDiscount,
      liquidationPrice: liquidationPrice
    }
  }


  getTradeSpread = ( targetCustodyAccount : CustodyAccount ,lockedUsd : BN) : BN => {
   
    if(
      targetCustodyAccount.pricing.tradeSpreadMax.sub(targetCustodyAccount.pricing.tradeSpreadMin).isZero()
       ||
       lockedUsd.isZero()
     ) {
      return BN_ZERO
     }
    let slope = ( (targetCustodyAccount.pricing.tradeSpreadMax.sub(targetCustodyAccount.pricing.tradeSpreadMin)).mul( new BN(10**(RATE_DECIMALS + BPS_DECIMALS)) ) )
                                .div(targetCustodyAccount.pricing.maxPositionLockedUsd)
    let variable = (slope.mul(lockedUsd)).div(new BN(10**(RATE_DECIMALS + BPS_DECIMALS)))

    let finalSpread = targetCustodyAccount.pricing.tradeSpreadMin.add(variable)
    return finalSpread;
  }

  getExitOraclePriceSync = (
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    lockedUsd : BN
  ): OraclePrice => {
    const { min: minPrice, max: maxPrice } = this.getMinAndMaxOraclePriceSync(targetPrice, targetEmaPrice, targetCustodyAccount);

    const spread = this.getTradeSpread(targetCustodyAccount, lockedUsd)

    const USD_POWER = (new BN(10)).pow(new BN(USD_DECIMALS))
    const exitPriceBN = isVariant(side, 'long') ?
        maxPrice.price.sub(maxPrice.price.mul(spread).div(USD_POWER)):
        minPrice.price.add(minPrice.price.mul(spread).div(USD_POWER));

    const exitOraclePrice = OraclePrice.from({ price : exitPriceBN, exponent : maxPrice.exponent, confidence : maxPrice.confidence, timestamp : maxPrice.timestamp })

    return exitOraclePrice;
  }

  getExitOraclePriceWithoutSpreadSync = (
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount
  ): OraclePrice => {
    const { min: minPrice, max: maxPrice } = this.getMinAndMaxOraclePriceSync(targetPrice, targetEmaPrice, targetCustodyAccount);

    if(isVariant(side, 'long') ) {
       return minPrice;
    } else {
      return maxPrice;
    }
  }

  getSizeAmountFromLeverageAndCollateral = (
    collateralAmtWithFee: BN,
    leverage: string, 
    marketToken: Token, 
    collateralToken: Token, 
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    discountBps = BN_ZERO
  ) : BN => {

    const collateralTokenMinPrice = this.getMinAndMaxPriceSync(
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount
      ).min
    const collateralTokenMinPriceUi = new BigNumber(collateralTokenMinPrice.toString()).dividedBy(10**USD_DECIMALS);

  

    const collateralAmtMinUsdUi = new BigNumber(collateralAmtWithFee.toString()).dividedBy(10**collateralToken.decimals)
                                      .multipliedBy(collateralTokenMinPriceUi);
   
    let openPosFeeRateUi = new BigNumber(targetCustodyAccount.fees.openPosition.toString()).dividedBy(10**RATE_DECIMALS)

    if(!discountBps.isZero()){
      const discountBpsUi = new BigNumber(discountBps.toString()).dividedBy(10**BPS_DECIMALS)
      openPosFeeRateUi = openPosFeeRateUi.multipliedBy(  new BigNumber(1).minus(discountBpsUi) );
    }

    const sizeUsdUi = collateralAmtMinUsdUi.multipliedBy(leverage)
                          .dividedBy(
                            new BigNumber(1).plus( openPosFeeRateUi.multipliedBy(leverage) )
                          )
      const lockedUsd = uiDecimalsToNative(sizeUsdUi.toString(),USD_DECIMALS) 
      const entryOraclePrice = this.getEntryPriceUsdSync(
        side,
        targetPrice,
        targetEmaPrice,
        targetCustodyAccount,
        lockedUsd
      )
      const entryPriceUsdUi = new BigNumber(entryOraclePrice.toUiPrice(ORACLE_EXPONENT)); 
 
     const sizeAmountUi = sizeUsdUi.dividedBy(entryPriceUsdUi);

     return uiDecimalsToNative(sizeAmountUi.toFixed(marketToken.decimals, BigNumber.ROUND_DOWN), marketToken.decimals)
  }

  getSizeAmountWithSwapSync = (
    amountIn: BN,
    leverage: string,
    side: Side,
    poolAccount: PoolAccount,
    inputTokenPrice: OraclePrice,
    inputTokenEmaPrice: OraclePrice,
    inputTokenCustodyAccount: CustodyAccount,
    collateralTokenPrice: OraclePrice,
    collateralTokenEmaPrice: OraclePrice,
    collateralTokenCustodyAccount: CustodyAccount,
    swapOutTokenPrice: OraclePrice,
    swapOutTokenEmaPrice: OraclePrice,
    swapOutTokenCustodyAccount: CustodyAccount,
    targetTokenPrice: OraclePrice,
    targetTokenEmaPrice: OraclePrice,
    targetTokenCustodyAccount: CustodyAccount,
    swapPoolAumUsdMax: BN, //always pass the updated poolAumUsdMax 
    poolConfigSwap: PoolConfig,
    discountBps = BN_ZERO
  ): BN => {

    let finalCollateralAmount = BN_ZERO;
    if(inputTokenCustodyAccount.publicKey.equals(collateralTokenCustodyAccount.publicKey)){
      // no swap need
      finalCollateralAmount = amountIn;
      console.log("no swap needed")
    } else {
      const swapAmountOut = this.getSwapAmountAndFeesSync(amountIn, BN_ZERO, poolAccount, inputTokenPrice, inputTokenEmaPrice, 
        inputTokenCustodyAccount, swapOutTokenPrice, swapOutTokenEmaPrice, swapOutTokenCustodyAccount, swapPoolAumUsdMax, poolConfigSwap).minAmountOut
        finalCollateralAmount = swapAmountOut
    }
      const collateralTokenMinPrice = this.getMinAndMaxPriceSync(
        collateralTokenPrice,
        collateralTokenEmaPrice,
        collateralTokenCustodyAccount
        ).min
      const collateralTokenMinPriceUi = new BigNumber(collateralTokenMinPrice.toString()).dividedBy(10**USD_DECIMALS);
  
    

      const collateralAmtMinUsdUi = new BigNumber(finalCollateralAmount.toString()).dividedBy(10**collateralTokenCustodyAccount.decimals)
                                        .multipliedBy(collateralTokenMinPriceUi);
     
      let openPosFeeRateUi = new BigNumber(targetTokenCustodyAccount.fees.openPosition.toString()).dividedBy(10**RATE_DECIMALS)
  
      if(!discountBps.isZero()){
        const discountBpsUi = new BigNumber(discountBps.toString()).dividedBy(10**BPS_DECIMALS)
        openPosFeeRateUi = openPosFeeRateUi.multipliedBy(  new BigNumber(1).minus(discountBpsUi) );
      }

      const sizeUsdUi = collateralAmtMinUsdUi.multipliedBy(leverage)
                            .dividedBy(
                              new BigNumber(1).plus( openPosFeeRateUi.multipliedBy(leverage) )
                            )
      
    const lockedUsd= uiDecimalsToNative(sizeUsdUi.toFixed(USD_DECIMALS), USD_DECIMALS)
    const entryOraclePrice = this.getEntryPriceUsdSync(
        side,
        targetTokenPrice,
        targetTokenEmaPrice,
        targetTokenCustodyAccount,
        lockedUsd
      )
    const entryPriceUsdUi = new BigNumber(entryOraclePrice.toUiPrice(ORACLE_EXPONENT)); 
   
       const sizeAmountUi = sizeUsdUi.dividedBy(entryPriceUsdUi);
  
       return uiDecimalsToNative(sizeAmountUi.toFixed(targetTokenCustodyAccount.decimals, BigNumber.ROUND_DOWN), targetTokenCustodyAccount.decimals)
  }

  // NOTE : this doesn't include swap 
  getCollateralAmountWithFeeFromLeverageAndSize = (
    sizeAmount: BN,
    leverage: string, // 55.5x 
    marketToken: Token, //todo: we can remove this and use marketCustodyAccount
    collateralToken: Token, //todo: we can remove this and use marketCustodyAccount
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    discountBps = BN_ZERO
  ) : BN => {

    const collateralTokenMinPrice = this.getMinAndMaxPriceSync(
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount
      ).min
    const collateralTokenMinPriceUi = new BigNumber(collateralTokenMinPrice.toString()).dividedBy(10**USD_DECIMALS);

    const lockedUsd = targetPrice.getAssetAmountUsd(sizeAmount, targetCustodyAccount.decimals)
    const entryOraclePrice = this.getEntryPriceUsdSync(
      side,
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      lockedUsd
    )
    const entryPriceUsdUi = new BigNumber(entryOraclePrice.toUiPrice(ORACLE_EXPONENT)); 

    
    let openPosFeeRateUi = new BigNumber(targetCustodyAccount.fees.openPosition.toString()).dividedBy(10**RATE_DECIMALS)

    if(!discountBps.isZero()){
      const discountBpsUi = new BigNumber(discountBps.toString()).dividedBy(10**BPS_DECIMALS)
      openPosFeeRateUi = openPosFeeRateUi.multipliedBy(  new BigNumber(1).minus(discountBpsUi) );
    }

    const sizeAmountUi = new BigNumber(sizeAmount.toString()).dividedBy(10**marketToken.decimals)

    const sizeUsdUi = entryPriceUsdUi.multipliedBy(sizeAmountUi)

    const collateralWithFeeUsdUi = sizeUsdUi.multipliedBy(
                                          new BigNumber(1).plus( openPosFeeRateUi.multipliedBy(leverage) )
                                        ).dividedBy(leverage)

    const collateralAmtWithFeeUi = collateralWithFeeUsdUi.dividedBy(collateralTokenMinPriceUi)

      return uiDecimalsToNative(collateralAmtWithFeeUi.toFixed(collateralToken.decimals, BigNumber.ROUND_DOWN), collateralToken.decimals)
  }

  getCollateralAmountWithSwapSync = (
    sizeAmount: BN,
    leverage: string,
    side: Side,
    poolAccount: PoolAccount,
    inputTokenPrice: OraclePrice,
    inputTokenEmaPrice: OraclePrice,
    inputTokenCustodyAccount: CustodyAccount,
    swapOutTokenPrice: OraclePrice,
    swapOutTokenEmaPrice: OraclePrice,
    swapOutTokenCustodyAccount: CustodyAccount,
    collateralTokenPrice: OraclePrice,
    collateralTokenEmaPrice: OraclePrice,
    collateralTokenCustodyAccount: CustodyAccount,
    targetTokenPrice: OraclePrice,
    targetTokenEmaPrice: OraclePrice,
    targetTokenCustodyAccount: CustodyAccount,
    swapPoolAumUsdMax: BN, //always pass the updated poolAumUsdMax 
    poolConfigPosition: PoolConfig,
    poolConfigSwap: PoolConfig
  ): BN => {

      const collateralTokenMinPrice = this.getMinAndMaxPriceSync(
        collateralTokenPrice,
        collateralTokenEmaPrice,
        collateralTokenCustodyAccount
        ).min
      const collateralTokenMinPriceUi = new BigNumber(collateralTokenMinPrice.toString()).dividedBy(10**USD_DECIMALS);
  
     const lockedUsd = targetTokenPrice.getAssetAmountUsd(sizeAmount, targetTokenCustodyAccount.decimals)
      const entryOraclePrice = this.getEntryPriceUsdSync(
        side,
        targetTokenPrice,
        targetTokenEmaPrice,
        targetTokenCustodyAccount,
        lockedUsd
      )
      const entryPriceUsdUi = new BigNumber(entryOraclePrice.toUiPrice(ORACLE_EXPONENT)); 
      
      const openPosFeeRateUi = new BigNumber(targetTokenCustodyAccount.fees.openPosition.toString()).dividedBy(10**RATE_DECIMALS)
  
      const sizeAmountUi = new BigNumber(sizeAmount.toString()).dividedBy(10**targetTokenCustodyAccount.decimals)
  
      const sizeUsdUi = entryPriceUsdUi.multipliedBy(sizeAmountUi)
  
      const collateralWithFeeUsdUi = sizeUsdUi.multipliedBy(
                                            new BigNumber(1).plus( openPosFeeRateUi.multipliedBy(leverage) )
                                          ).dividedBy(leverage)
  
      const collateralAmtWithFeeUi = collateralWithFeeUsdUi.dividedBy(collateralTokenMinPriceUi)
      const collateralAmountWithFee = uiDecimalsToNative(collateralAmtWithFeeUi.toFixed(collateralTokenCustodyAccount.decimals, BigNumber.ROUND_DOWN), collateralTokenCustodyAccount.decimals)

      let collateralInInputToken: BN 
      if(inputTokenCustodyAccount.publicKey.equals(collateralTokenCustodyAccount.publicKey)){
        // no swap need
        console.log("no swap needed")
        collateralInInputToken = collateralAmountWithFee
      } else {
        collateralInInputToken = this.getSwapAmountAndFeesSync(BN_ZERO, collateralAmountWithFee, poolAccount, inputTokenPrice, inputTokenEmaPrice, 
          inputTokenCustodyAccount, swapOutTokenPrice, swapOutTokenEmaPrice, swapOutTokenCustodyAccount, swapPoolAumUsdMax, poolConfigSwap).minAmountIn
      }

      return collateralInInputToken
  }

  // used in decreaseSize Modal
  getDecreaseSizeCollateralAndFeeSync = ( //todo: validate this function
    positionAccount: PositionAccount,
    marketCorrelation: boolean,
    sizeDeltaUsd: BN,  // should be +ve
    keepLevSame : boolean,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    marketConfig : MarketConfig, 
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp: BN,
    side: Side,
    poolConfig : PoolConfig,
    discountBps = BN_ZERO,
    // includePnlInLeverage = false, ALWAYS WILL INCLUDE PNL 
    // includeFeeinPnl = false  ALWAYS WITH FEE 
  ): RemoveCollateralData => {

    


    if(!marketConfig.marketAccount.equals(positionAccount.market)){
      throw new Error("marketCustodyAccount mismatch")
    }

    if(!targetCustodyAccount.publicKey.equals(marketConfig.targetCustody)){
      throw new Error("marketCustodyAccount mismatch")
    }

    if(!collateralCustodyAccount.publicKey.equals(marketConfig.collateralCustody)){
      throw new Error("collateralCustodyAccount mismatch")
    }

    const collateralMinMaxPrice = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount)

     let positionDelta = PositionAccount.from(positionAccount.publicKey ,  { ...positionAccount} as Position) 

     
     const positionEntryOraclePrice = new OraclePrice({
      price: positionAccount.entryPrice.price, exponent: new BN(positionAccount.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO
    })

    const sizeDeltaAmount = positionEntryOraclePrice.getTokenAmount(sizeDeltaUsd, targetCustodyAccount.decimals)
    positionDelta.sizeAmount = sizeDeltaAmount


    const decimalPower = new BN(10 ** targetCustodyAccount.decimals)
    const closeRatio = (positionDelta.sizeAmount.mul(decimalPower)).div(positionAccount.sizeAmount)

    positionDelta.sizeUsd = (positionAccount.sizeUsd.mul(closeRatio)).div(decimalPower)
    positionDelta.unsettledFeesUsd = (positionAccount.unsettledFeesUsd.mul(closeRatio)).div(decimalPower)
    positionDelta.lockedAmount = (positionAccount.lockedAmount.mul(closeRatio)).div(decimalPower)
    positionDelta.lockedUsd = (positionAccount.lockedUsd.mul(closeRatio)).div(decimalPower)
    positionDelta.collateralAmount = (positionAccount.collateralAmount.mul(closeRatio)).div(decimalPower)
    const newPnl = this.getPnlSync(positionDelta, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)
    let exitFeeUsd = positionDelta.sizeUsd.mul(targetCustodyAccount.fees.closePosition).div(new BN(RATE_POWER));
    if(discountBps.gt(BN_ZERO)){
      const discount  = exitFeeUsd.mul(discountBps).div(new BN(BPS_POWER));
      exitFeeUsd = exitFeeUsd.sub(discount);
    }

    const lockAndUnsettledFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(positionDelta, collateralCustodyAccount, currentTimestamp)
    const totalFeesUsd = (exitFeeUsd.add(lockAndUnsettledFeeUsd))

    const currentCollateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(positionDelta.collateralAmount, collateralCustodyAccount.decimals)
    const liabilityUsd = newPnl.lossUsd.add(totalFeesUsd)
    const assetsUsd = newPnl.profitUsd.add(currentCollateralUsd)

    let closeAmount: BN, feesAmount: BN
    if (assetsUsd.gte(liabilityUsd)){
      closeAmount = collateralMinMaxPrice.max.getTokenAmount(assetsUsd.sub(liabilityUsd), collateralCustodyAccount.decimals)
      feesAmount = collateralMinMaxPrice.min.getTokenAmount(totalFeesUsd, collateralCustodyAccount.decimals)
    } else {
      closeAmount = BN_ZERO
      feesAmount = collateralMinMaxPrice.min.getTokenAmount(assetsUsd.sub(newPnl.lossUsd), collateralCustodyAccount.decimals)
    }

    
   

    let newPosition = PositionAccount.from(positionAccount.publicKey , { ...positionAccount } as Position) 

    newPosition.sizeAmount = positionAccount.sizeAmount.sub(positionDelta.sizeAmount)
    newPosition.sizeUsd = positionAccount.sizeUsd.sub(positionDelta.sizeUsd)

    newPosition.lockedUsd = positionAccount.lockedUsd.sub(positionDelta.lockedUsd)
    newPosition.lockedAmount = positionAccount.lockedAmount.sub(positionDelta.lockedAmount)

    newPosition.unsettledFeesUsd = positionAccount.unsettledFeesUsd.sub(positionDelta.unsettledFeesUsd)
    newPosition.collateralAmount = positionAccount.collateralAmount.sub(positionDelta.collateralAmount).add(closeAmount)

    newPosition.collateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(newPosition.collateralAmount, collateralCustodyAccount.decimals)


    let feeUsdWithDiscount = BN_ZERO;
    let feeUsd = sizeDeltaUsd.mul(targetCustodyAccount.fees.closePosition).div(new BN(RATE_POWER))

    if(discountBps.gt(BN_ZERO)){
      feeUsdWithDiscount = feeUsd.mul(discountBps).div(new BN(BPS_POWER));
      feeUsdWithDiscount = exitFeeUsd.sub(feeUsdWithDiscount);
    } else {
      feeUsdWithDiscount = feeUsd
    }

    if(keepLevSame){ 

      const previousPnl = this.getPnlSync(positionAccount, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig) //pnl calculated here should be before decrease size instruction
      const pnlUsd = previousPnl.profitUsd.sub(previousPnl.lossUsd)


      const exitFee = this.getExitFeeSync(positionAccount, targetCustodyAccount, collateralCustodyAccount, collateralPrice, collateralEmaPrice)
      const lockAndUnsettledFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(positionAccount, collateralCustodyAccount, currentTimestamp)

      const pnlUsdWithFee = pnlUsd.sub(lockAndUnsettledFeeUsd).sub(exitFee.exitFeeUsd)

      const currentlev = this.getLeverageSync(positionAccount.sizeUsd, positionAccount.collateralAmount, collateralMinMaxPrice.min, collateralCustodyAccount.decimals, pnlUsdWithFee)


      let collateralAmountRecievedUsd = newPosition.collateralUsd.sub( 
                                              newPosition.sizeUsd.mul(new BN(BPS_POWER)).div(currentlev)
                                              )
      let collateralAmountReceived =  collateralMinMaxPrice.max.getTokenAmount(collateralAmountRecievedUsd, collateralCustodyAccount.decimals)
       


      const maxWithdrawableAmount = this.getMaxWithdrawableAmountSync(newPosition, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, poolConfig)
     
      if(collateralAmountReceived.lt(BN_ZERO)) {
        collateralAmountReceived = BN_ZERO
        collateralAmountRecievedUsd = BN_ZERO
      } else if(collateralAmountReceived.gt(maxWithdrawableAmount)){
        collateralAmountReceived = maxWithdrawableAmount
        collateralAmountRecievedUsd = collateralMinMaxPrice.min.getAssetAmountUsd(maxWithdrawableAmount, collateralCustodyAccount.decimals)
      }
    

      let collateralFeeUsd = collateralAmountRecievedUsd.mul(targetCustodyAccount.fees.removeCollateral).div(new BN(RATE_POWER))
      if(discountBps.gt(BN_ZERO)){
        const discount = collateralFeeUsd.mul(discountBps).div(new BN(BPS_POWER));
        collateralFeeUsd = exitFeeUsd.sub(discount);
      }
      
      newPosition.collateralAmount = newPosition.collateralAmount.sub(collateralAmountReceived)
      newPosition.collateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(newPosition.collateralAmount, collateralCustodyAccount.decimals)
      

      const entryPrice = OraclePrice.from({price: newPosition.entryPrice.price, exponent: new BN(newPosition.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO})

      const finalInterestUsd = this.getLockFeeAndUnsettledUsdForPosition( newPosition, collateralCustodyAccount, currentTimestamp)
      const finalLiquidationPrice = this.getLiquidationPriceSync(
        newPosition.collateralAmount,
        newPosition.sizeAmount,
        entryPrice,
        finalInterestUsd,
        marketCorrelation,
        side,
        targetCustodyAccount,
        collateralPrice,
        collateralEmaPrice,
        collateralCustodyAccount,
        newPosition
      );

      const finalPnl = this.getPnlSync(newPosition, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)
      const finalPnlUsd = finalPnl.profitUsd.sub(finalPnl.lossUsd)

      const newExitFee = this.getExitFeeSync(newPosition,targetCustodyAccount, collateralCustodyAccount, collateralPrice, collateralEmaPrice)

      const finalPnlUsdWithFee = finalPnlUsd.sub(finalInterestUsd).sub(newExitFee.exitFeeUsd)
      const newLev = this.getLeverageSync(newPosition.sizeUsd, newPosition.collateralAmount, collateralMinMaxPrice.min, collateralCustodyAccount.decimals, finalPnlUsdWithFee) 
      
      return {
        newSizeUsd: newPosition.sizeUsd,
        feeUsd: feeUsd.add(collateralFeeUsd),
        feeUsdWithDiscount : feeUsdWithDiscount.add(collateralFeeUsd),
        newLev: newLev,
        liquidationPrice: finalLiquidationPrice,
        collateralAmountRecieved: collateralAmountReceived, // remove collateral fee must be subtracted from this to show on UI, as of now we dont have any fee on remove collateral
        newCollateralAmount : newPosition.collateralAmount,
        newPnl: finalPnl.profitUsd.sub(finalPnl.lossUsd)
      }
    } else {
      const entryPrice = OraclePrice.from({price: newPosition.entryPrice.price, exponent: new BN(newPosition.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO})
      
      const finalInterestUsd = this.getLockFeeAndUnsettledUsdForPosition( newPosition, collateralCustodyAccount, currentTimestamp)
      const finalLiquidationPrice = this.getLiquidationPriceSync(
        newPosition.collateralAmount,
        newPosition.sizeAmount,
        entryPrice,
        finalInterestUsd,
        marketCorrelation,
        side,
        targetCustodyAccount,
        collateralPrice,
        collateralEmaPrice,
        collateralCustodyAccount,
        newPosition
      );

      const finalPnl = this.getPnlSync(newPosition, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)
      const finalPnlUsd = finalPnl.profitUsd.sub(finalPnl.lossUsd) // includeFeeinPnl ?

      const exitFee = this.getExitFeeSync(newPosition, targetCustodyAccount, collateralCustodyAccount, collateralPrice, collateralEmaPrice)
      const lockFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(newPosition, collateralCustodyAccount, currentTimestamp)

      const finalPnlUsdWithFee = finalPnlUsd.sub(lockFeeUsd).sub(exitFee.exitFeeUsd)
      const newLev = this.getLeverageSync(newPosition.sizeUsd, newPosition.collateralAmount, collateralMinMaxPrice.min, collateralCustodyAccount.decimals, finalPnlUsdWithFee) 
 
      let collateralAmountReceived = newPosition.collateralAmount.sub(positionAccount.collateralAmount)
      if(collateralAmountReceived.lte(BN_ZERO)){
        collateralAmountReceived = BN_ZERO
      } 

      return {
        newSizeUsd: newPosition.sizeUsd,
        feeUsd: feeUsd,
        feeUsdWithDiscount : feeUsdWithDiscount,
        newLev: newLev,
        liquidationPrice: finalLiquidationPrice,
        collateralAmountRecieved: collateralAmountReceived,
        newCollateralAmount : newPosition.collateralAmount.sub(collateralAmountReceived),
        newPnl: finalPnlUsd
      }
    }
  }

  getFinalCloseAmountSync = (
    positionAccount: PositionAccount,
    marketCorrelation: boolean,
    side: Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp: BN,
    poolConfig: PoolConfig
  ) => {
    let position = PositionAccount.from(positionAccount.publicKey, { ...positionAccount } as Position)
    const collateralMinMaxPrice = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount)
    const collateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(position.collateralAmount, collateralCustodyAccount.decimals)
    const newPnl = this.getPnlSync(position, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)

    const exitPriceAndFee: ExitPriceAndFee = this.getExitPriceAndFeeSync(
      positionAccount,
      marketCorrelation,
      positionAccount.collateralAmount,
      positionAccount.sizeAmount,
      side,
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount,
      currentTimestamp
    );

    const totalFeesUsd = (exitPriceAndFee.exitFeeUsd.add(exitPriceAndFee.borrowFeeUsd))
    const liabilityUsd = newPnl.lossUsd.add(totalFeesUsd)
    const assetsUsd = newPnl.profitUsd.add(collateralMinMaxPrice.min.getAssetAmountUsd(positionAccount.collateralAmount, positionAccount.collateralDecimals))

    let closeAmount: BN, feesAmount:BN
    if (assetsUsd.gt(liabilityUsd)) {
      closeAmount = collateralMinMaxPrice.max.getTokenAmount(assetsUsd.sub(liabilityUsd), position.collateralDecimals)
      feesAmount = collateralMinMaxPrice.min.getTokenAmount(totalFeesUsd, positionAccount.collateralDecimals)
    } else {
      closeAmount = BN_ZERO
      feesAmount = collateralMinMaxPrice.min.getTokenAmount(assetsUsd.sub(newPnl.lossUsd), positionAccount.collateralDecimals)
    }

    return {closeAmount, feesAmount}


   
  }

  getMaxWithdrawableAmountSync = ( 
    positionAccount: PositionAccount,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp: BN,
    poolConfig: PoolConfig,
    errorBandwidthPercentageUi = 5, // 5% increase MinCollateral , add 5% decrease in Max_Init_Lev 
  ) : BN => {

    if(errorBandwidthPercentageUi > 100 || errorBandwidthPercentageUi < 0) {
      throw new Error("errorBandwidthPercentageUi cannot be >100 or <0")
    }
    const MAX_INIT_LEVERAGE = targetCustodyAccount.pricing.maxInitialLeverage.mul(new BN(100 - errorBandwidthPercentageUi)).div(new BN(100)) 

   
    const maxRemoveableCollateralUsdAfterMinRequired = positionAccount.collateralUsd.sub(
      targetCustodyAccount.pricing.minCollateralUsd.mul(new BN(100 + errorBandwidthPercentageUi)).div(new BN(100)) 
    )

    if(maxRemoveableCollateralUsdAfterMinRequired.isNeg()){
      console.log("THIS cannot happen but still")
      return BN_ZERO;
    }

    const profitLoss = this.getPnlSync(
      positionAccount,
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount,
      currentTimestamp,
      targetCustodyAccount.pricing.delaySeconds,
      poolConfig
  )
    const { min :collateralMinPrice , max : collateralMaxPrice  } = this.getMinAndMaxOraclePriceSync(
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount
    );
    const currentCollateralUsd = collateralMinPrice.getAssetAmountUsd(positionAccount.collateralAmount, collateralCustodyAccount.decimals);

    let availableInitMarginUsd : BN = BN_ZERO
    if( profitLoss.lossUsd.lt( currentCollateralUsd ) ){
      availableInitMarginUsd = currentCollateralUsd.sub(profitLoss.lossUsd)
    } else {
      console.log("profitLoss.lossUsd > coll :: should have been liquidated")
      return BN_ZERO; //should have been liquidated
    }

    const maxRemovableCollateralUsd = availableInitMarginUsd.sub( positionAccount.sizeUsd.muln(BPS_POWER).div(MAX_INIT_LEVERAGE))
    if (maxRemovableCollateralUsd.isNeg()){
      return BN_ZERO
    }

    // now check for MIN Collateral  
    let maxWithdrawableAmount: BN
    if (maxRemoveableCollateralUsdAfterMinRequired.lt(maxRemovableCollateralUsd)) {
        maxWithdrawableAmount = collateralMaxPrice.getTokenAmount(maxRemoveableCollateralUsdAfterMinRequired, collateralCustodyAccount.decimals) 
    } else {
        maxWithdrawableAmount = collateralMaxPrice.getTokenAmount(maxRemovableCollateralUsd, collateralCustodyAccount.decimals)
    }

    return maxWithdrawableAmount
  }

  getCumulativeLockFeeSync = (
    custodyAccount: CustodyAccount,
    currentTimestamp : BN
  ) => {
    let cumulativeLockFee = BN_ZERO;
    if(currentTimestamp.gt(custodyAccount.borrowRateState.lastUpdate)) {
      cumulativeLockFee = (currentTimestamp
        .sub(custodyAccount.borrowRateState.lastUpdate))
        .mul(custodyAccount.borrowRateState.currentRate)
        .div(new BN(3600)) // hourly
        .add(custodyAccount.borrowRateState.cumulativeLockFee);
    } else {
      cumulativeLockFee = custodyAccount.borrowRateState.cumulativeLockFee;
    }
    return cumulativeLockFee;
  }


  getLockFeeAndUnsettledUsdForPosition = (
    position: PositionAccount,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp : BN
  ) => {
    const cumulativeLockFee = this.getCumulativeLockFeeSync(collateralCustodyAccount, currentTimestamp);
    let lockFeeUsd = BN_ZERO;
    if(cumulativeLockFee.gt(position.cumulativeLockFeeSnapshot)) {
      lockFeeUsd = cumulativeLockFee.sub(position.cumulativeLockFeeSnapshot).mul(position.lockedUsd).div(new BN(RATE_POWER));
    }
    lockFeeUsd = lockFeeUsd.add(position.unsettledFeesUsd)
    return lockFeeUsd;
  }


  getLockedUsd = (
    sideUsd : BN,
    side : Side,
    marketCorrelation : boolean,
    maxPayOffBps : BN
  ) => {

    let maxPayOffBpsNew = BN_ZERO
    if (marketCorrelation || isVariant(side, 'short')) {
      maxPayOffBpsNew = BN.min(new BN(BPS_POWER), maxPayOffBps)
    } else {
      maxPayOffBpsNew = maxPayOffBps
    }
    let lockedUsd =  (sideUsd.mul(maxPayOffBpsNew)).div(new BN(BPS_POWER))
    return lockedUsd
  }

  getLiquidationPriceSync =  (
    collateralAmount: BN,
    sizeAmount: BN,
    entryOraclePrice: OraclePrice,
    lockAndUnsettledFeeUsd: BN, // if existing position then call getLockFeeAndUnsettledUsdForPosition first and pass here else pass 0
    marketCorrelation : boolean,
    side : Side,
    custodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    positionAccount: PositionAccount,
  ) => {
    const zeroOraclePrice = OraclePrice.from({
      price: BN_ZERO,
      exponent: BN_ZERO,
      confidence: BN_ZERO,
      timestamp: BN_ZERO
    })
    if(collateralAmount.isZero() || sizeAmount.isZero()) {
        return zeroOraclePrice;
    }

    if (positionAccount.entryPrice.exponent && !entryOraclePrice.exponent.eq(new BN(positionAccount.entryPrice.exponent))){
       throw new Error(`Exponent mismatch : ${positionAccount.entryPrice.exponent} & ${entryOraclePrice.exponent.toString()} ${entryOraclePrice?.toUiPrice(8)}`)
    }
    
    const exitFeeUsd = positionAccount.sizeUsd.mul(custodyAccount.fees.closePosition).div(new BN(RATE_POWER));
    const unsettledLossUsd = exitFeeUsd.add(lockAndUnsettledFeeUsd);

    const liablitiesUsd = positionAccount.sizeUsd.mul(new BN(BPS_POWER)).div(custodyAccount.pricing.maxLeverage).add(unsettledLossUsd)

    let assetsUsd = BN_ZERO
    if (marketCorrelation) {
      assetsUsd = positionAccount.collateralUsd
    } else {
      const collateralMinPriceOracle = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount).min;
      assetsUsd = collateralMinPriceOracle.getAssetAmountUsd(collateralAmount, collateralCustodyAccount.decimals)
    }

    let liquidationPrice:OraclePrice
    if (marketCorrelation && isVariant(side, 'long')) {
      let lp:OraclePrice = OraclePrice.from({
        price: (positionAccount.sizeUsd.add(liablitiesUsd)).mul(new BN(10**(positionAccount.sizeDecimals+3)))
          .div(sizeAmount.add(collateralAmount)),
        exponent: new BN(-1*RATE_DECIMALS),
        confidence: BN_ZERO,
        timestamp: BN_ZERO
      })

      liquidationPrice = lp.scale_to_exponent(new BN(entryOraclePrice.exponent))
    } else {
      if (assetsUsd.gte(liablitiesUsd)) {
        let priceDiffLossOracle: OraclePrice = OraclePrice.from({
          price: (assetsUsd.sub(liablitiesUsd)).mul(new BN(10**(positionAccount.sizeDecimals+3)))
            .div(positionAccount.sizeAmount),
          exponent: new BN(-1*RATE_DECIMALS),
          confidence: BN_ZERO,
          timestamp: BN_ZERO
        }).scale_to_exponent(new BN(entryOraclePrice.exponent))

        if (isVariant(side, 'long')) {
          liquidationPrice = OraclePrice.from({
            price: entryOraclePrice.price.sub(priceDiffLossOracle.price),
            exponent: new BN(entryOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        } else {
          liquidationPrice = OraclePrice.from({
            price: entryOraclePrice.price.add(priceDiffLossOracle.price),
            exponent: new BN(entryOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        }
      } else {
        let priceDiffProfitOracle: OraclePrice = OraclePrice.from({
          price: (liablitiesUsd.sub(assetsUsd)).mul(new BN(10**(positionAccount.sizeDecimals+3)))
            .div(positionAccount.sizeAmount),
          exponent: new BN(-1*RATE_DECIMALS),
          confidence: BN_ZERO,
          timestamp: BN_ZERO
        }).scale_to_exponent(new BN(entryOraclePrice.exponent))

        if (isVariant(side, 'long')) {
          liquidationPrice = OraclePrice.from({
            price: entryOraclePrice.price.add(priceDiffProfitOracle.price),
            exponent: new BN(entryOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        } else {
          liquidationPrice = OraclePrice.from({
            price: entryOraclePrice.price.sub(priceDiffProfitOracle.price),
            exponent: new BN(entryOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        }
      }
    }
    

    return liquidationPrice.price.isNeg() ? zeroOraclePrice : liquidationPrice;
  };

  getMaxProfitPriceSync =  (
    entryPrice: OraclePrice,
    marketCorrelation : boolean,
    side : Side,
    positionAccount: PositionAccount,
  ) : OraclePrice => { //returns the maxProfitPrice in OraclePrice
    const zeroOraclePrice = OraclePrice.from({
      price: BN_ZERO,
      exponent: BN_ZERO,
      confidence: BN_ZERO,
      timestamp: BN_ZERO
    })
    if(positionAccount.sizeAmount.isZero()) {
        return zeroOraclePrice;
    }

    const priceDiffProfit = OraclePrice.from({
      price: positionAccount.lockedUsd.mul(new BN(10).pow(new BN(positionAccount.sizeDecimals+3)))
        .div(positionAccount.sizeAmount),
      exponent: new BN(-1*RATE_DECIMALS),
      confidence: BN_ZERO,
      timestamp: BN_ZERO
    }).scale_to_exponent(entryPrice.exponent)

    let maxProfitPrice:OraclePrice;
    if(isVariant(side, 'long')) {
      if(marketCorrelation){ return zeroOraclePrice}

      maxProfitPrice = OraclePrice.from({
        price: entryPrice.price.add(priceDiffProfit.price),
        exponent: entryPrice.exponent,
        confidence: BN_ZERO,
        timestamp: BN_ZERO
      })
    } else {
      maxProfitPrice = OraclePrice.from({
        price: entryPrice.price.sub(priceDiffProfit.price),
        exponent: entryPrice.exponent,
        confidence: BN_ZERO,
        timestamp: BN_ZERO
      })
    }

    return maxProfitPrice.price.isNeg() ? zeroOraclePrice : maxProfitPrice
  }

  getEstimateProfitLossforTpSlEntry = (
    positionAccount: PositionAccount | null,   
    isTakeProfit : boolean,
    userEntrytpSlOraclePrice: OraclePrice, // user enters : should be in space decimals
    collateralDeltaAmount: BN, // user enters : in case of increase size 
    sizeDeltaAmount: BN, // user enters :  in case of increase size 
    side : Side,
    marketAccountPk : PublicKey,
    targetTokenPrice: OraclePrice,
    targetTokenEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    poolConfig: PoolConfig
  ):{
    pnlUsd: BN,
    pnlPercentage: BN,
  } => {

    if (collateralDeltaAmount.isNeg() || sizeDeltaAmount.isNeg()) {
      throw new Error("Delta Amounts cannot be negative.")
    }

    let lockedUsd = targetTokenEmaPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)
    let entryOraclePrice = this.getEntryPriceUsdSync(
      side,
      targetTokenPrice,
      targetTokenEmaPrice,
      targetCustodyAccount,
      lockedUsd
    )

    if (positionAccount === null) {
      const data: Position = {
          ...DEFAULT_POSITION,
      }
      positionAccount = PositionAccount.from(PublicKey.default, data);

      positionAccount.sizeDecimals = targetCustodyAccount.decimals;
      positionAccount.collateralDecimals = collateralCustodyAccount.decimals;
      positionAccount.lockedDecimals = collateralCustodyAccount.decimals;

      positionAccount.entryPrice.price = entryOraclePrice.price
      positionAccount.entryPrice.exponent = entryOraclePrice.exponent.toNumber()

    } else {
      positionAccount = positionAccount.clone()
      const positionEntryPrice = OraclePrice.from({
        price: positionAccount.entryPrice.price,
        exponent: new BN(positionAccount.entryPrice.exponent),
        confidence: BN_ZERO,
        timestamp: BN_ZERO
      })

      // new average
      entryOraclePrice.price = this.getAveragePriceSync(
        positionEntryPrice.price,
        positionAccount.sizeAmount,
        entryOraclePrice.price,
        sizeDeltaAmount
      )
      positionAccount.entryPrice.price = entryOraclePrice.price
    }

    let sizeDeltaUsd = entryOraclePrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals);
    positionAccount.sizeUsd = positionAccount.sizeUsd.add(sizeDeltaUsd)

    positionAccount.sizeAmount = positionAccount.sizeAmount.add(sizeDeltaAmount);
    positionAccount.market = marketAccountPk;
    positionAccount.lockedUsd = targetTokenPrice.getAssetAmountUsd(positionAccount.sizeAmount, targetCustodyAccount.decimals)
    positionAccount.lockedAmount = collateralPrice.getTokenAmount(
      positionAccount.lockedUsd,
      collateralCustodyAccount.decimals
    );
    
    positionAccount.collateralAmount = positionAccount.collateralAmount.add(collateralDeltaAmount);
    positionAccount.collateralUsd = collateralPrice.getAssetAmountUsd(positionAccount.collateralAmount, collateralCustodyAccount.decimals);

    const currentTime = new BN(getUnixTs())
    let pnl = this.getPnlSync(
      positionAccount,
      userEntrytpSlOraclePrice,
      userEntrytpSlOraclePrice,
      targetCustodyAccount,
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount,
      currentTime,
      targetCustodyAccount.pricing.delaySeconds,
      poolConfig
    )

    let pnlUsd = pnl.profitUsd.sub(pnl.lossUsd)
    let pnlPercentage = pnlUsd.mul(new BN(BPS_POWER)).div(positionAccount.sizeUsd)
    
    if (isTakeProfit) {
      return {
        pnlUsd: pnl.profitUsd,
        pnlPercentage: pnlPercentage
      }
    } else {
      return {
        pnlUsd: pnl.lossUsd,
        pnlPercentage: pnlPercentage
      }
    }

  }

  // used in UI : positionTable 
  getPnlSync = (
    positionAccount: PositionAccount,
    targetTokenPrice: OraclePrice,
    targetTokenEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp: BN,
    delay: BN,
    poolConfig: PoolConfig
  ): {
    profitUsd: BN,
    lossUsd: BN,
  } => {
    if (positionAccount.sizeUsd.isZero() || positionAccount.entryPrice.price.isZero()) {
      return {
        profitUsd: BN_ZERO,
        lossUsd: BN_ZERO,
      }
    }

  const { side } = poolConfig.getMarketConfigByPk(positionAccount.market)

 
  const lockedUsd = targetTokenPrice.getAssetAmountUsd(positionAccount.sizeAmount, targetCustodyAccount.decimals)
  let exitOraclePrice = this.getExitOraclePriceSync(side, targetTokenPrice, targetTokenEmaPrice,targetCustodyAccount, lockedUsd);


  const collateralMinPrice = this.getMinAndMaxOraclePriceSync(
    collateralPrice,
    collateralEmaPrice,
    collateralCustodyAccount
  ).min;

  let priceDiffProfit: OraclePrice, priceDiffLoss: OraclePrice;

  const positionEntryPrice = OraclePrice.from({
    price: positionAccount.entryPrice.price,
    exponent: new BN(positionAccount.entryPrice.exponent),
    confidence: BN_ZERO,
    timestamp: BN_ZERO})
    //  no need to scale
    // .scale_to_exponent(new BN(-1 * USD_DECIMALS))


    if (!exitOraclePrice.exponent.eq(positionEntryPrice.exponent)) { // 
      throw new Error("exponent mistach")
    }

  if (isVariant(side, 'long'))  {
  //  LONG
    // NOTE: keep both in price decimals
      if (exitOraclePrice.price.gt(positionEntryPrice.price))  {
        if (currentTimestamp.gt(positionAccount.updateTime.add(delay))){
          priceDiffProfit =  new OraclePrice({price: exitOraclePrice.price.sub(positionEntryPrice.price), exponent: exitOraclePrice.exponent, confidence: exitOraclePrice.confidence, timestamp: BN_ZERO});
          priceDiffLoss = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
        } else {
          priceDiffProfit = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
          priceDiffLoss = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});

        }
      } else {
        priceDiffProfit = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
        priceDiffLoss = new OraclePrice({price: positionEntryPrice.price.sub(exitOraclePrice.price), exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
      }
  } else {
    // SHORT 
    if (exitOraclePrice.price.lt(positionEntryPrice.price) ){ 
      if (currentTimestamp.gt(positionAccount.updateTime.add(delay))) {
        priceDiffProfit = new OraclePrice({price: positionEntryPrice.price.sub(exitOraclePrice.price), exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
        priceDiffLoss = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});

      } else {
          priceDiffProfit = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
          priceDiffLoss = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
      }
    } else {
        priceDiffProfit = new OraclePrice({price: BN_ZERO, exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});
        priceDiffLoss = new OraclePrice({price: exitOraclePrice.price.sub(positionEntryPrice.price), exponent: exitOraclePrice.exponent, confidence: BN_ZERO, timestamp: BN_ZERO});

    }
  };

  if (!priceDiffProfit.exponent.eq(priceDiffLoss.exponent)) { // 
    throw new Error("exponent mistach")
  }


  if (priceDiffProfit.price.gt(BN_ZERO)) {  
    return {
      profitUsd: BN.min(
            priceDiffProfit.getAssetAmountUsd(positionAccount.sizeAmount, positionAccount.sizeDecimals),
            collateralMinPrice.getAssetAmountUsd(positionAccount.lockedAmount, positionAccount.lockedDecimals)),
      lossUsd: BN_ZERO,
    }
  } else {
    return {
      profitUsd: BN_ZERO,
      lossUsd: priceDiffLoss.getAssetAmountUsd(positionAccount.sizeAmount, positionAccount.sizeDecimals),
    }
  }

  }


  getSwapAmountAndFeesSync = (
    amountIn: BN,
    amountOut: BN, // if the amount is entered in the output token field else PASS BN_ZERO
    poolAccount: PoolAccount,
    inputTokenPrice: OraclePrice,
    inputTokenEmaPrice: OraclePrice,
    inputTokenCustodyAccount: CustodyAccount,
    outputTokenPrice: OraclePrice,
    outputTokenEmaPrice: OraclePrice,
    outputTokenCustodyAccount: CustodyAccount,
    poolAumUsdMax: BN, //always pass the updated poolAumUsdMax 
    poolConfig: PoolConfig
): {
  minAmountOut: BN, // this is the amount for output custody
  minAmountIn: BN, // this is the amount for input custody
  feeIn: BN,
  feeOut: BN,
} => {
    

    if (!amountIn.isZero() && !amountOut.isZero()){
      throw new Error("both amountIn and amountOut cannot be non-zero")
    }
    if (amountIn.isZero() && amountOut.isZero()){
      return {
        minAmountIn : BN_ZERO,  // this is the amount for Input custody
        minAmountOut:  BN_ZERO,
        feeIn: BN_ZERO,
        feeOut: BN_ZERO,
      }
    }

        let newInputTokenPrice:OraclePrice, newInputTokenEmaPrice: OraclePrice;
     let newOutputTokenPrice:OraclePrice, newOutputTokenEmaPrice: OraclePrice;

     // need to take LESS THAN as expos are negative
    if(inputTokenPrice.exponent.lte(outputTokenPrice.exponent)){
        // this has higher so use this.expo 
        newInputTokenPrice = inputTokenPrice;
        newInputTokenEmaPrice = inputTokenEmaPrice;

        newOutputTokenPrice = outputTokenPrice.scale_to_exponent(inputTokenPrice.exponent)
        newOutputTokenEmaPrice = outputTokenEmaPrice.scale_to_exponent(inputTokenPrice.exponent)

    } else {
        newInputTokenPrice = inputTokenPrice.scale_to_exponent(outputTokenPrice.exponent);
        newInputTokenEmaPrice = inputTokenEmaPrice.scale_to_exponent(outputTokenPrice.exponent);

        newOutputTokenPrice = outputTokenPrice
        newOutputTokenEmaPrice = outputTokenEmaPrice
    }

    if(!newInputTokenPrice.exponent.eq(newOutputTokenPrice.exponent)) {
      throw `Exponents mistmatch ${newInputTokenPrice.exponent.toNumber()} != ${newOutputTokenPrice.exponent.toNumber()}`
    }

    const inputMinMaxPrice = this.getMinAndMaxOraclePriceSync(newInputTokenPrice, newInputTokenEmaPrice, inputTokenCustodyAccount);
    const outputMinMaxPrice = this.getMinAndMaxOraclePriceSync(newOutputTokenPrice, newOutputTokenEmaPrice, outputTokenCustodyAccount);



    let pairPrice;
    
    let inputTokenAmount: BN
    let outputTokenAmount: BN
    let feeIn: BN
    let feeOut: BN

    // for OUT => IN
    if (amountIn.isZero()) {

      if (
        inputTokenCustodyAccount.isStable &&
        inputMinMaxPrice.min != inputMinMaxPrice.max &&
        inputTokenCustodyAccount.depegAdjustment
      ) {
        pairPrice = outputMinMaxPrice.min.price;
      } else {
        pairPrice = outputMinMaxPrice.min.price.mul(new BN(10).pow(outputMinMaxPrice.min.exponent)).div(inputMinMaxPrice.max.price)
      }
      const swapPrice = pairPrice.sub(pairPrice.mul(outputTokenCustodyAccount.pricing.swapSpread).div(new BN(BPS_POWER)))

      inputTokenAmount = checkedDecimalMul(amountOut, new BN(-1 * outputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * inputTokenCustodyAccount.decimals))

      feeIn = this.getFeeHelper(FeesAction.SwapIn, inputTokenAmount, BN_ZERO, inputTokenCustodyAccount, inputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount
      feeOut = this.getFeeHelper(FeesAction.SwapOut, BN_ZERO, amountOut, outputTokenCustodyAccount, outputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount

      let swapAmount = checkedDecimalMul(amountOut.add(feeOut), new BN(-1 * outputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * inputTokenCustodyAccount.decimals)).add(feeIn)


      return {
        minAmountIn: swapAmount,  // this is the amount for Input custody, and includes all fees(feeIn & feeOut)
        minAmountOut: BN_ZERO,
        feeIn: feeIn,
        feeOut: feeOut,
      }
    } else {   // for IN => OUT

      // IF tokenOut is USDC
      if (
        outputTokenCustodyAccount.isStable &&
        outputMinMaxPrice.min != outputMinMaxPrice.max &&
        outputTokenCustodyAccount.depegAdjustment
      ) {
        pairPrice = inputMinMaxPrice.min.price;
      } else {
        pairPrice = inputMinMaxPrice.min.price.mul(new BN(10).pow(inputMinMaxPrice.min.exponent)).div(outputMinMaxPrice.max.price)
      }
      const swapPrice = pairPrice.sub(pairPrice.mul(inputTokenCustodyAccount.pricing.swapSpread).div(new BN(BPS_POWER)))

      outputTokenAmount = checkedDecimalMul(amountIn, new BN(-1 * inputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * outputTokenCustodyAccount.decimals))


      feeIn = this.getFeeHelper(FeesAction.SwapIn, amountIn, BN_ZERO, inputTokenCustodyAccount, inputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount
      feeOut = this.getFeeHelper(FeesAction.SwapOut, BN_ZERO, outputTokenAmount, outputTokenCustodyAccount, outputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount

      let swapAmount = checkedDecimalMul(amountIn.sub(feeIn), new BN(-1 * inputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * outputTokenCustodyAccount.decimals)).sub(feeOut)
      
      return {
        minAmountIn: BN_ZERO,
        minAmountOut: swapAmount, // this is the amount for output custody, And includes all fee(feeIn, FeeOut)
        feeIn: feeIn,
        feeOut: feeOut,
      }
    }

  }


  // CHECKED
  getAssetsUnderManagementUsdSync = (
    poolAccount: PoolAccount,
    tokenPrices: OraclePrice[],
    tokenEmaPrices: OraclePrice[],
    custodies: CustodyAccount[], // poolAccount.custodies
    markets: MarketAccount[],
    aumCalcMode: "includePnl" | "excludePnl",
    currentTime: BN,
    poolConfig: PoolConfig
  ): {poolAmountUsd: BN, poolEquityUsd: BN} => {
  
    let  poolAmountUsd: BN = BN_ZERO;

    for (let index=0;index<custodies.length;index++) {
      if (custodies.length != poolAccount.custodies.length || !custodies[index].publicKey.equals(poolAccount.custodies[index])){
        throw Error("incorrect custodies")
      }
      if( tokenPrices.length != custodies.length || tokenPrices.length != tokenEmaPrices.length ){
        throw Error("token prices length incorrect");
      }

      const tokenMinMaxPrice = this.getMinAndMaxOraclePriceSync(tokenPrices[index], tokenEmaPrices[index], custodies[index])

      let token_amount_usd :BN = tokenMinMaxPrice.max.getAssetAmountUsd(custodies[index].assets.owned, custodies[index].decimals)
      poolAmountUsd = poolAmountUsd.add(token_amount_usd);
    }

    if(aumCalcMode === "includePnl"){
      let poolEquityUsd = poolAmountUsd
      for(let index=0;index<markets.length;index++){
        if (markets.length != poolAccount.markets.length || !markets[index].publicKey.equals(poolAccount.markets[index])){
          throw Error("incorrect markets")
        }

        const position = markets[index].getCollectivePosition(); //todo: Verify
        let collectivePnl = this.getPnlSync(
          position, 
          tokenPrices[markets[index].targetCustodyId.toNumber()],
          tokenEmaPrices[markets[index].targetCustodyId.toNumber()],
          custodies[markets[index].targetCustodyId.toNumber()],
          tokenPrices[markets[index].collateralCustodyId.toNumber()],
          tokenEmaPrices[markets[index].collateralCustodyId.toNumber()],
          custodies[markets[index].collateralCustodyId.toNumber()],
          currentTime,
          custodies[markets[index].targetCustodyId.toNumber()].pricing.delaySeconds,
          poolConfig
        );

        let collateralMinMaxPrice = this.getMinAndMaxOraclePriceSync(tokenPrices[markets[index].collateralCustodyId.toNumber()], tokenEmaPrices[markets[index].collateralCustodyId.toNumber()], custodies[markets[index].collateralCustodyId.toNumber()])
        let collectiveCollateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(position.collateralAmount, position.collateralDecimals)
        let collectiveLossUsd = BN.min(collectivePnl.lossUsd, collectiveCollateralUsd)

        poolEquityUsd = (poolEquityUsd.add(collectiveLossUsd)).sub(collectivePnl.profitUsd)
      }
      return {poolAmountUsd, poolEquityUsd}
    } else {
      return {poolAmountUsd, poolEquityUsd: BN_ZERO}
    }

  };
  

  ///////
  /// UI/SDK INSTRUCTIONS HELPERS


  // TRADE 

  openPosition = async (
    targetSymbol: string,
    collateralSymbol: string,
    priceWithSlippage: ContractOraclePrice,
    collateralWithfee: BN,
    size: BN,
    side: Side,
    poolConfig: PoolConfig,
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege: Privilege,
    skipBalanceChecks = false
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    
    let userCollateralTokenAccount = await getAssociatedTokenAddress(
      poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
      publicKey
    );
    
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    // Create WSOL Token account and not ATA and close it in end 
    if (collateralSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      const lamports = collateralWithfee.add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
      if (unWrappedSolBalance.lt(lamports)) {
        throw "Insufficient SOL Funds"
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
      // for other tokens check if ATA and balance 
      if (!(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
        throw "Insufficient Funds , token Account doesn't exist"
      }
      if (!skipBalanceChecks) {
        const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userCollateralTokenAccount)).value.amount);
        if (tokenAccountBalance.lt(collateralWithfee)) {
          throw `Insufficient Funds need more ${collateralWithfee.sub(tokenAccountBalance)} tokens`
        }
      }
    }//else

    // replace with getPositionKey()
    let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

    const params: OpenPositionParams = {
      priceWithSlippage: priceWithSlippage,
      collateralAmount: collateralWithfee,
      sizeAmount : size,
      privilege : privilege
    };

    let instruction = await this.program.methods
      .openPosition(params)
      .accounts({
        owner: publicKey,
        feePayer: publicKey,
        fundingAccount: collateralSymbol == 'SOL' ? wrappedSolAccount.publicKey : userCollateralTokenAccount,
        perpetuals: poolConfig.perpetuals,
        pool: poolConfig.poolAddress,
        position: positionAccount,
        market: marketAccount,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
        collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        eventAuthority: this.eventAuthority.publicKey,
        program: this.programId,
        transferAuthority: this.authority.publicKey,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege)])
      .instruction()

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  openPositionWithSwap = async (
    targetSymbol: string,
    collateralSymbol : string,
    inputSymbol: string,
    amountIn: BN, // with fee
    minAmountOut: BN,
    priceWithSlippage: ContractOraclePrice,
    size: BN,
    side: Side,
    swapPoolConfig: PoolConfig,
    positionPoolConfig: PoolConfig,
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege: Privilege,
    skipBalanceChecks = false
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {



    let publicKey = this.provider.wallet.publicKey;
    const targetCustodyConfig = positionPoolConfig.custodies.find(i => i.mintKey.equals(positionPoolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = positionPoolConfig.custodies.find(i => i.mintKey.equals(positionPoolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const swapOutCustodyConfig = swapPoolConfig.custodies.find(i => i.mintKey.equals(swapPoolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const swapInCustodyConfig = swapPoolConfig.custodies.find(i => i.mintKey.equals(swapPoolConfig.getTokenFromSymbol(inputSymbol).mintKey))!;

    if(swapInCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)){
      throw "Don't use Swap, just call Open position"
    }

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userInputTokenAccount : PublicKey;


    // Create WSOL Token account and not ATA and close it in end 
    if (inputSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      const lamports = amountIn.add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
      if (unWrappedSolBalance.lt(lamports)) {
        throw "Insufficient SOL Funds"
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
      // for other tokens check if ATA and balance 
      userInputTokenAccount =  getAssociatedTokenAddressSync(
        swapPoolConfig.getTokenFromSymbol(inputSymbol).mintKey,
        publicKey,
        true
      );
      if (!(await checkIfAccountExists(userInputTokenAccount, this.provider.connection))) {
        throw "Insufficient Funds , Token Account doesn't exist"
      }
      if (!skipBalanceChecks) {
        const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userInputTokenAccount)).value.amount);
        if (tokenAccountBalance.lt(amountIn)) {
          throw `Insufficient Funds need more ${amountIn.sub(tokenAccountBalance)} tokens`
        }
      }
    }//else

    let userOutputTokenAccount =  getAssociatedTokenAddressSync(
      swapPoolConfig.getTokenFromSymbol(swapOutCustodyConfig.symbol).mintKey,
      publicKey,
      true
    );

    if ( !(await checkIfAccountExists(userOutputTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userOutputTokenAccount,
          publicKey,
          swapPoolConfig.getTokenFromSymbol(swapOutCustodyConfig.symbol).mintKey
        )
      );
    }
    const marketAccount = positionPoolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    const positionAccount = positionPoolConfig.getPositionFromMarketPk(publicKey, marketAccount);

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    for (const custody of swapPoolConfig.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount: custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
    }
 

    let instruction = await this.programPerpComposability.methods
    .swapAndOpen({
        amountIn,
        minAmountOut,
        openPriceWithSlippage: priceWithSlippage,
        openSizeAmount: size,
        privilege
      })
      .accounts({
        perpProgram: this.programId,
        owner: publicKey,
        fundingAccount: inputSymbol == 'SOL' ? wrappedSolAccount.publicKey : userInputTokenAccount,
        receivingAccount : userOutputTokenAccount,

        transferAuthority: swapPoolConfig.transferAuthority,
        perpetuals: swapPoolConfig.perpetuals,
        swapPool: swapPoolConfig.poolAddress,

        receivingCustody: swapInCustodyConfig.custodyAccount,
        receivingCustodyOracleAccount: this.useExtOracleAccount ? swapInCustodyConfig.extOracleAccount : swapInCustodyConfig.intOracleAccount,
        receivingCustodyTokenAccount: swapInCustodyConfig.tokenAccount,

        dispensingCustody: swapOutCustodyConfig.custodyAccount,
        dispensingCustodyOracleAccount: this.useExtOracleAccount ? swapOutCustodyConfig.extOracleAccount : swapOutCustodyConfig.intOracleAccount,
        dispensingCustodyTokenAccount: swapOutCustodyConfig.tokenAccount,

        positionPool: positionPoolConfig.poolAddress,
        position: positionAccount,
        market: marketAccount,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
        collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

        eventAuthority: this.eventAuthority.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege), ...custodyAccountMetas, ...custodyOracleAccountMetas])
      .instruction()

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  closePosition = async (
    marketSymbol: string,
    collateralSymbol: string,
    priceWithSlippage: ContractOraclePrice,
    side: Side,
    poolConfig: PoolConfig,
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege: Privilege,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false // to get back WSOL=>SOL
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {


    let publicKey = this.provider.wallet.publicKey;

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    try {

      if (collateralSymbol == 'SOL') {
        wrappedSolAccount = new Keypair();
        const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: wrappedSolAccount.publicKey,
            lamports: lamports, //will this break for large amounts ??
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            wrappedSolAccount.publicKey,
            NATIVE_MINT,
            publicKey,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            wrappedSolAccount.publicKey,
            publicKey,
            publicKey,
          ),
        ];
        additionalSigners.push(wrappedSolAccount);
      } else {
        // OTHER TOKENS including WSOL,USDC,..
        userReceivingTokenAccount = await getAssociatedTokenAddress(
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
          publicKey
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userReceivingTokenAccount,
              publicKey,
              poolConfig.getTokenFromSymbol(collateralSymbol).mintKey
            )
          );
        }
      } // else
      

      const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
      const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(marketSymbol).mintKey))!;
      const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

      const positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount);


      let instruction = await this.program.methods
        .closePosition({
          priceWithSlippage: priceWithSlippage,
          privilege: privilege
        })
        .accounts({
          feePayer: publicKey,
          owner: publicKey,
          receivingAccount: collateralSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount:  collateralCustodyConfig.tokenAccount, 
          eventAuthority : this.eventAuthority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege)])
        .instruction();
      instructions.push(instruction)

      if (collateralSymbol == 'WSOL' && closeUsersWSOLATA) {
        const closeWsolATAIns = createCloseAccountInstruction(userReceivingTokenAccount, publicKey, publicKey);
        postInstructions.push(closeWsolATAIns);
      }
    } catch (error) {
      console.error("perpclient closePosition error:", error);
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  closePositionWithSwap = async (
    targetSymbol: string,
    outputSymbol: string,
    collateralSymbol : string,
    minAmountOut: BN, 
    priceAfterSlippage: ContractOraclePrice,
    side: Side,
    swapPoolConfig: PoolConfig,
    positionPoolConfig: PoolConfig,
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege : Privilege,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;
    const targetCustodyConfig = positionPoolConfig.custodies.find(i => i.mintKey.equals(positionPoolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = positionPoolConfig.custodies.find(i => i.mintKey.equals(positionPoolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const swapInCustodyConfig = swapPoolConfig.custodies.find(i => i.mintKey.equals(swapPoolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const swapOutCustodyConfig = swapPoolConfig.custodies.find(i => i.mintKey.equals(swapPoolConfig.getTokenFromSymbol(outputSymbol).mintKey))!;

    if(swapOutCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)){
      throw "Dont use swap, just call close position"
    }

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userReceivingTokenAccount : PublicKey;


    // Create WSOL Token account and not ATA and close it in end 
    if (outputSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      
      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
     
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount = await getAssociatedTokenAddress(
        swapPoolConfig.getTokenFromSymbol(outputSymbol).mintKey,
        publicKey
      );

      if (!(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            swapPoolConfig.getTokenFromSymbol(outputSymbol).mintKey
          )
        );
      }
     
    }//else


    let userCollateralTokenAccount =  getAssociatedTokenAddressSync(
      positionPoolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
      publicKey,
      true
    );
    if ( !(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userCollateralTokenAccount,
          publicKey,
          positionPoolConfig.getTokenFromSymbol(collateralSymbol).mintKey
        )
      );
    }
   

    const marketAccount = positionPoolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    const positionAccount = positionPoolConfig.getPositionFromMarketPk(publicKey, marketAccount);

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    for (const custody of swapPoolConfig.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount: custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
    }


    let instruction = await this.programPerpComposability.methods
      // @ts-ignore
      .closeAndSwap({
        minAmountOut,
        closePriceWithSlippage: priceAfterSlippage,
        privilege,
      })
      .accounts({
        perpProgram: this.programId, 
        owner: publicKey,
        // swapInput
        fundingAccount: userCollateralTokenAccount, 
        // swapOutput
        receivingAccount : outputSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount,

        transferAuthority: swapPoolConfig.transferAuthority,
        perpetuals: swapPoolConfig.perpetuals,
        swapPool: swapPoolConfig.poolAddress,

        // swapIn Custody
        receivingCustody: swapInCustodyConfig.custodyAccount,
        receivingCustodyOracleAccount: this.useExtOracleAccount ? swapInCustodyConfig.extOracleAccount: swapInCustodyConfig.intOracleAccount,
        receivingCustodyTokenAccount: swapInCustodyConfig.tokenAccount,

        // swapOut Custody
        dispensingCustody: swapOutCustodyConfig.custodyAccount,
        dispensingCustodyOracleAccount: this.useExtOracleAccount ? swapOutCustodyConfig.extOracleAccount: swapOutCustodyConfig.intOracleAccount,
        dispensingCustodyTokenAccount: swapOutCustodyConfig.tokenAccount,

        positionPool: positionPoolConfig.poolAddress,
        position: positionAccount,
        market: marketAccount,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount: targetCustodyConfig.intOracleAccount,

        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount: collateralCustodyConfig.intOracleAccount,
        collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

        eventAuthority: this.eventAuthority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege), ...custodyAccountMetas, ...custodyOracleAccountMetas])
      .instruction()

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  addCollateral = async (
    collateralWithFee: BN,
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    positionPubKey: PublicKey,
    poolConfig: PoolConfig,
    skipBalanceChecks = false
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    if (!collateralCustodyConfig || !targetCustodyConfig) {
      throw "payTokenCustody not found";
    }

    let userPayingTokenAccount = getAssociatedTokenAddressSync(
      collateralCustodyConfig.mintKey,
      publicKey,
      true
    );

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    // Create WSOL Token account and not ATA and close it in end 
    if (collateralSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      const lamports = collateralWithFee.add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
      if (unWrappedSolBalance.lt(lamports)) {
        throw "Insufficient SOL Funds"
      }

      const solBal = await this.provider.connection.getBalance(publicKey)

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
      // for other tokens check if ATA and balance 
      if (!(await checkIfAccountExists(userPayingTokenAccount, this.provider.connection))) {
        throw "Insufficient Funds , token Account doesn't exist"
      }
      if (!skipBalanceChecks) {
        const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userPayingTokenAccount)).value.amount);
        if (tokenAccountBalance.lt(collateralWithFee)) {
          throw `Insufficient Funds need more ${collateralWithFee.sub(tokenAccountBalance)} tokens`
        }
      }
    }//else

    let instruction = await this.program.methods.addCollateral({
      collateralDelta: collateralWithFee
    }).accounts({
      owner: publicKey,
      position: positionPubKey,
      market: marketAccount,
      fundingAccount: collateralSymbol == 'SOL' ? wrappedSolAccount.publicKey :  userPayingTokenAccount, // user token account for custody token account
      perpetuals: poolConfig.perpetuals,
      pool: poolConfig.poolAddress,
      targetCustody: targetCustodyConfig.custodyAccount,
      targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
      collateralCustody: collateralCustodyConfig.custodyAccount,
      collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
      collateralCustodyTokenAccount:  collateralCustodyConfig.tokenAccount, 
      eventAuthority: this.eventAuthority.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
    })
    .instruction();

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  addCollateralWithSwap = async (
    targetSymbol: string,
    inputSymbol: string,
    collateralSymbol: string,
    amountIn: BN, // with fee
    minAmountOut: BN, 
    side: Side,
    positionPubKey: PublicKey,
    poolConfigSwap: PoolConfig,
    poolConfigPosition: PoolConfig,
    skipBalanceChecks = false
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const collateralCustodyConfig = poolConfigPosition.custodies.find(i => i.mintKey.equals(poolConfigPosition.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const targetCustodyConfig = poolConfigPosition.custodies.find(i => i.mintKey.equals(poolConfigPosition.getTokenFromSymbol(targetSymbol).mintKey))!;
    const outputCustodyConfig = poolConfigSwap.custodies.find(i => i.mintKey.equals(poolConfigSwap.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const inputCustodyConfig = poolConfigSwap.custodies.find(i => i.mintKey.equals(poolConfigSwap.getTokenFromSymbol(inputSymbol).mintKey))!;

    if (!collateralCustodyConfig || !targetCustodyConfig || !inputCustodyConfig) {
      throw "payTokenCustody not found";
    }

    if(inputCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)){
      throw "Use Simple Swap"
    }

  
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userInputTokenAccount : PublicKey;

    // Create WSOL Token account and not ATA and close it in end 
    if (inputSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      const lamports = amountIn.add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
      if (unWrappedSolBalance.lt(lamports)) {
        throw "Insufficient SOL Funds"
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
       userInputTokenAccount = getAssociatedTokenAddressSync(
        inputCustodyConfig.mintKey,
        publicKey,
        true
      );
      // for other tokens check if ATA and balance 
      if (!(await checkIfAccountExists(userInputTokenAccount, this.provider.connection))) {
        throw "Insufficient Funds , token Account doesn't exist"
      }
      if (!skipBalanceChecks) {
        const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userInputTokenAccount)).value.amount);
        if (tokenAccountBalance.lt(amountIn)) {
          throw `Insufficient Funds need more ${amountIn.sub(tokenAccountBalance)} tokens`
        }
      }
    }//else

    let userCollateralTokenAccount =  getAssociatedTokenAddressSync(
      collateralCustodyConfig.mintKey,
      publicKey,
      true
    );
    if ( !(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userCollateralTokenAccount,
          publicKey,
          collateralCustodyConfig.mintKey
        )
      );
    }

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];

    for (const custody of poolConfigSwap.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount : custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
    }
    

    const marketAccount = poolConfigPosition.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let instruction = await this.programPerpComposability.methods.swapAndAddCollateral({
      amountIn: amountIn,
      minAmountOut : minAmountOut,
    }).accounts({
      perpProgram: this.programId, 
      owner: publicKey,
      
      fundingAccount: inputSymbol == 'SOL' ? wrappedSolAccount.publicKey :  userInputTokenAccount, // user token account for custody token account
      receivingAccount : userCollateralTokenAccount,
      
      transferAuthority: poolConfigSwap.transferAuthority,
      perpetuals: poolConfigSwap.perpetuals,
      swapPool: poolConfigSwap.poolAddress,

      receivingCustody: inputCustodyConfig.custodyAccount,
      receivingCustodyOracleAccount: this.useExtOracleAccount ? inputCustodyConfig.extOracleAccount : inputCustodyConfig.intOracleAccount,
      receivingCustodyTokenAccount: inputCustodyConfig.tokenAccount,

      dispensingCustody: outputCustodyConfig.custodyAccount,
      dispensingCustodyOracleAccount: this.useExtOracleAccount ? outputCustodyConfig.extOracleAccount : outputCustodyConfig.intOracleAccount,
      dispensingCustodyTokenAccount: outputCustodyConfig.tokenAccount,

      positionPool: poolConfigPosition.poolAddress,

      position: positionPubKey,
      market: marketAccount,
      targetCustody: targetCustodyConfig.custodyAccount,
      targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

      collateralCustody: collateralCustodyConfig.custodyAccount,
      collateralOracleAccount:  this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
      collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

      eventAuthority: this.eventAuthority.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
    })
    .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas])
    .instruction();

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  removeCollateral = async (
    collateralWithFee: BN,
    marketSymbol: string,
    collateralSymbol: string,
    side: Side,
    positionPubKey: PublicKey,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false // to get back WSOL=>SOL
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}>  => {
    let publicKey = this.provider.wallet.publicKey;

    const collateralCustodyConfig = poolConfig.custodies.find((i) =>
      i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey)
    )!
    const targetCustodyConfig = poolConfig.custodies.find((i) =>
      i.mintKey.equals(poolConfig.getTokenFromSymbol(marketSymbol).mintKey)
    )!

    
    if (!collateralCustodyConfig || !targetCustodyConfig) {
      throw "collateralCustodyConfig/marketCustodyConfig  not found";
    }

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    try {


    if (collateralSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      userReceivingTokenAccount = wrappedSolAccount.publicKey;
      const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);
    } else {
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount = await getAssociatedTokenAddress(
        poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
        publicKey
      );

      if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            poolConfig.getTokenFromSymbol(collateralSymbol).mintKey
          )
        );
      }
    } // else

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)


    let instruction = await this.program.methods
    .removeCollateral({
        collateralDelta: collateralWithFee,
    })
    .accounts({
        owner: publicKey,
        receivingAccount: collateralSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount, // user token account for custody token account
        transferAuthority: poolConfig.transferAuthority,
        perpetuals: poolConfig.perpetuals,
        pool: poolConfig.poolAddress,
        position: positionPubKey,
        market: marketAccount,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
        collateralCustodyTokenAccount:  collateralCustodyConfig.tokenAccount,
        eventAuthority : this.eventAuthority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        program: this.programId,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
    })
    .instruction()

    instructions.push(instruction)

      if (collateralSymbol == 'WSOL' && closeUsersWSOLATA) {
        const closeWsolATAIns = createCloseAccountInstruction(userReceivingTokenAccount, publicKey, publicKey);
        postInstructions.push(closeWsolATAIns);
      }

    } catch (error) {
      console.error("perpclient removeCollateral error:", error);
    }

      return {
        instructions : [...preInstructions, ...instructions ,...postInstructions],
        additionalSigners
      };
  }

  removeCollateralWithSwap = async (
    targetSymbol: string,
    collateralSymbol : string,
    outputSymbol: string,
    minAmountOut: BN, 
    collateralDelta: BN,
    side: Side,
    poolConfigSwap: PoolConfig,
    poolConfigPosition: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {


    let publicKey = this.provider.wallet.publicKey;
    const targetCustodyConfig = poolConfigPosition.custodies.find(i => i.mintKey.equals(poolConfigPosition.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfigPosition.custodies.find(i => i.mintKey.equals(poolConfigPosition.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const inputCusotdyConfig = poolConfigSwap.custodies.find(i => i.mintKey.equals(poolConfigSwap.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const outputCustodyConfig = poolConfigSwap.custodies.find(i => i.mintKey.equals(poolConfigSwap.getTokenFromSymbol(outputSymbol).mintKey))!;

    if(outputCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)){
      throw "Dont use swap, just call remove collateral"
    }

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userReceivingTokenAccount : PublicKey;


    // Create WSOL Token account and not ATA and close it in end 
    if (outputSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      
      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
     
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount = await getAssociatedTokenAddress(
        poolConfigSwap.getTokenFromSymbol(outputSymbol).mintKey,
        publicKey
      );

      if (!(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            poolConfigSwap.getTokenFromSymbol(outputSymbol).mintKey
          )
        );
      }
     
    }//else


    let userCollateralTokenAccount =  getAssociatedTokenAddressSync(
      poolConfigPosition.getTokenFromSymbol(collateralSymbol).mintKey,
      publicKey,
      true
    );
    if ( !(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userCollateralTokenAccount,
          publicKey,
          poolConfigPosition.getTokenFromSymbol(collateralSymbol).mintKey
        )
      );
    }
   

    const marketAccount = poolConfigPosition.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    const positionAccount = poolConfigPosition.getPositionFromMarketPk(publicKey, marketAccount);

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    for (const custody of poolConfigSwap.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount : custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
    }



    let instruction = await this.programPerpComposability.methods
      .removeCollateralAndSwap({
        minAmountOut,
        collateralDelta: collateralDelta,
      })
      .accounts({
        perpProgram: this.programId, 
        owner: publicKey,
        // swapInput
        fundingAccount: userCollateralTokenAccount, 
        // swapOutput
        receivingAccount : outputSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount,

        transferAuthority: poolConfigSwap.transferAuthority,
        perpetuals: poolConfigSwap.perpetuals,
        swapPool: poolConfigSwap.poolAddress,

        // swapIn Custody
        receivingCustody: inputCusotdyConfig.custodyAccount,
        receivingCustodyOracleAccount: this.useExtOracleAccount ? inputCusotdyConfig.extOracleAccount : inputCusotdyConfig.intOracleAccount,
        receivingCustodyTokenAccount: inputCusotdyConfig.tokenAccount,

        // swapOut Custody
        dispensingCustody: outputCustodyConfig.custodyAccount,
        dispensingCustodyOracleAccount: this.useExtOracleAccount ? outputCustodyConfig.extOracleAccount : outputCustodyConfig.intOracleAccount,
        dispensingCustodyTokenAccount: outputCustodyConfig.tokenAccount,

        positionPool: poolConfigPosition.poolAddress,
        position: positionAccount,
        market: marketAccount,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
        collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

        eventAuthority: this.eventAuthority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas])
      .instruction()

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  increaseSize = async (
    targetSymbol: string,
    collateralSymbol: string,
    positionPubKey: PublicKey,
    side: Side,
    poolConfig: PoolConfig,
    priceWithSlippage: ContractOraclePrice,
    sizeDelta: BN,
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege: Privilege,
    ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}>  => {
    let publicKey = this.provider.wallet.publicKey;

    const collateralCustodyConfig = poolConfig.custodies.find((i) =>
      i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey)
    )!
    const targetCustodyConfig = poolConfig.custodies.find((i) =>
      i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey)
    )!

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    if (!collateralCustodyConfig || !targetCustodyConfig) {
      throw "collateralCustodyConfig/marketCustodyConfig  not found";
    }

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];


    let instruction = await this.program.methods
    .increaseSize( {
      priceWithSlippage: priceWithSlippage,
      sizeDelta: sizeDelta,
      privilege : privilege
     } )
    .accounts({
      owner: publicKey,
      transferAuthority: poolConfig.transferAuthority,
      perpetuals: poolConfig.perpetuals,
      pool: poolConfig.poolAddress,
      position: positionPubKey,
      market: marketAccount,
      targetCustody: targetCustodyConfig.custodyAccount,
      targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
      collateralCustody: collateralCustodyConfig.custodyAccount,
      collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
      collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      eventAuthority : this.eventAuthority.publicKey,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
    })
    .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege)])
    .instruction()
  
    instructions.push(instruction)

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  decreaseSize = async (
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    positionPubKey: PublicKey,
    poolConfig: PoolConfig,
    priceWithSlippage: ContractOraclePrice,
    sizeDelta: BN,
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege: Privilege,
    ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}>  => {

    let publicKey = this.provider.wallet.publicKey;

    const collateralCustodyConfig = poolConfig.custodies.find((i) =>
      i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey)
    )!
    const targetCustodyConfig = poolConfig.custodies.find((i) =>
      i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey)
    )!

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    if (!collateralCustodyConfig || !targetCustodyConfig) {
      throw "collateralCustodyConfig/marketCustodyConfig  not found";
    }

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = []

   
    
    let instruction = await this.program.methods
    .decreaseSize( {
      priceWithSlippage: priceWithSlippage,
      sizeDelta: sizeDelta,
      privilege : privilege
    } )
    .accounts({
      owner: publicKey,
      transferAuthority: poolConfig.transferAuthority,
      perpetuals: poolConfig.perpetuals,
      pool: poolConfig.poolAddress,
      position: positionPubKey,
      market: marketAccount,
      targetCustody: targetCustodyConfig.custodyAccount,
      targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

      collateralCustody: collateralCustodyConfig.custodyAccount,
      collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
      collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      eventAuthority : this.eventAuthority.publicKey,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
    })
    .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege)])
    .instruction()
  
    instructions.push(instruction)

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
    
  }



  //  EARN  / LP 

  addLiquidityAndStake = async (
    inputSymbol: string,
    amountIn: BN, // with fee
    minLpAmountOut: BN,
    poolConfig: PoolConfig,
    skipBalanceChecks = false
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userInputTokenAccount: PublicKey;
    let lpTokenMint = poolConfig.stakedLpTokenMint
    const inputCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(inputSymbol).mintKey))!;

    let lpTokenAccount = await getAssociatedTokenAddress(
      lpTokenMint,
      publicKey
    );

    const flpStakeAccount = PublicKey.findProgramAddressSync(
      [Buffer.from("stake"), publicKey.toBuffer(), poolConfig.poolAddress.toBuffer()],
      this.programId
    )[0];

    const poolStakedLpVault = PublicKey.findProgramAddressSync(
      [Buffer.from("staked_lp_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
      this.programId
    )[0];


    // Create WSOL Token account and not ATA and close it in end 
    if (inputSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      const lamports = amountIn.add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
      if (unWrappedSolBalance.lt(lamports)) {
        throw "Insufficient SOL Funds"
      }
      if (!(await checkIfAccountExists(lpTokenAccount, this.provider.connection))) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            lpTokenAccount,
            publicKey,
            poolConfig.stakedLpTokenMint
          )
        );
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    } else {
      userInputTokenAccount = getAssociatedTokenAddressSync(
        inputCustodyConfig.mintKey,
        publicKey,
        true
      );

      // for other tokens check if ATA and balance 
      if (!(await checkIfAccountExists(userInputTokenAccount, this.provider.connection))) {
        throw "Insufficient Funds , token Account doesn't exist"
      }
      if (!skipBalanceChecks) {
        const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userInputTokenAccount)).value.amount);
        if (tokenAccountBalance.lt(amountIn)) {
          throw `Insufficient Funds need more ${amountIn.sub(tokenAccountBalance)} tokens`
        }
      }
    }


    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    let markets = [];
    for (const custody of poolConfig.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount : custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
    }
    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      });
    }


    let instruction = await this.program.methods.addLiquidityAndStake({
      amountIn: amountIn,
      minLpAmountOut: minLpAmountOut,
    }).accounts({
      owner: publicKey,
      feePayer: publicKey,
      fundingAccount: inputSymbol == 'SOL' ? wrappedSolAccount.publicKey : userInputTokenAccount, // user token account for custody token account

      transferAuthority: poolConfig.transferAuthority,
      perpetuals: poolConfig.perpetuals,
      pool: poolConfig.poolAddress,

      custody: inputCustodyConfig.custodyAccount,
      custodyOracleAccount: this.useExtOracleAccount ? inputCustodyConfig.extOracleAccount : inputCustodyConfig.intOracleAccount,
      custodyTokenAccount: inputCustodyConfig.tokenAccount,

      lpTokenMint: lpTokenMint,
      flpStakeAccount: flpStakeAccount,
      poolStakedLpVault: poolStakedLpVault,

      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      eventAuthority: this.eventAuthority.publicKey,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
    })
      .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
      .instruction();

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }


  addCompoundingLiquidity = async (
    amountIn: BN,
    minCompoundingAmountOut: BN,
    inTokenSymbol: string,
    rewardTokenMint: PublicKey,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];
    let postInstructions: TransactionInstruction[] = [];

    const rewardCustody = poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;
    const inCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(inTokenSymbol).mintKey))!;
    const lpTokenMint = poolConfig.stakedLpTokenMint;
    const compoundingTokenMint = poolConfig.compoundingTokenMint;
    let wrappedSolAccount: Keypair | undefined;

    let lpTokenAccount = await getAssociatedTokenAddress(
      poolConfig.stakedLpTokenMint,
      publicKey
    );

    let compoundingTokenAccount = await getAssociatedTokenAddress(
      compoundingTokenMint,
      publicKey
    );

    let fundingAccount = await getAssociatedTokenAddress(
      inCustodyConfig.mintKey,
      publicKey
    );

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    // let custodyCustomOracles = []
    let markets = []
    for (const custody of poolConfig.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount : custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
      // custodyCustomOracles.push({
      //   pubkey: poolConfig.backupOracle,
      //   isSigner: false,
      //   isWritable: false,
      // })
    }

    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      });
    }

    if (!(await checkIfAccountExists(lpTokenAccount, this.provider.connection))) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          lpTokenAccount,
          publicKey,
          poolConfig.stakedLpTokenMint
        )
      );
    }

    if (!(await checkIfAccountExists(compoundingTokenAccount, this.provider.connection))) {
      instructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          compoundingTokenAccount,
          publicKey,
          poolConfig.compoundingTokenMint
        )
      );
    }

    // FOR SOL :  Create WSOL Token account and not ATA and close it in end 
    if (inTokenSymbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      const lamports = amountIn.add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
      if (unWrappedSolBalance.lt(lamports)) {
        throw "Insufficient SOL Funds"
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    } else {
      // for other tokens check if ATA and balance 
      if (!(await checkIfAccountExists(fundingAccount, this.provider.connection))) {
        throw "Insufficient Funds , token Account doesn't exist"
      }
    }//else

    const compoundingLpVault = PublicKey.findProgramAddressSync(
      [Buffer.from("compounding_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
      this.programId
    )[0]

    try {
      let addCompoundingLiquidity = await this.program.methods
        .addCompoundingLiquidity({
          amountIn: amountIn,
          minCompoundingAmountOut: minCompoundingAmountOut
        })
        .accounts({
          owner: publicKey,
          fundingAccount: fundingAccount,
          compoundingTokenAccount: compoundingTokenAccount,
          poolCompoundingLpVault: compoundingLpVault,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          inCustody: inCustodyConfig.custodyAccount,
          inCustodyOracleAccount: this.useExtOracleAccount ? inCustodyConfig.extOracleAccount : inCustodyConfig.intOracleAccount,
          inCustodyTokenAccount: inCustodyConfig.tokenAccount,

          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount : rewardCustody.intOracleAccount,
          lpTokenMint: lpTokenMint,
          compoundingTokenMint: compoundingTokenMint,

          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(addCompoundingLiquidity)

    } catch (err) {
      console.error("perpClient addCompoundingLiquidity error:: ", err);
    }

    return {
      instructions: [...instructions],
      additionalSigners
    };
  }

  removeCompoundingLiquidity = async (
    compoundingAmountIn: BN,
    minAmountOut: BN,
    outTokenSymbol: string,
    rewardTokenMint: PublicKey,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end 
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let userReceivingTokenAccount: PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    const rewardCustody = poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;
    const outCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(outTokenSymbol).mintKey))!;
    const lpTokenMint = poolConfig.stakedLpTokenMint;
    const compoundingTokenMint = poolConfig.compoundingTokenMint;

    if (outCustodyConfig.symbol == 'SOL') {
      wrappedSolAccount = new Keypair();
      userReceivingTokenAccount = wrappedSolAccount.publicKey;
      const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: wrappedSolAccount.publicKey,
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          wrappedSolAccount.publicKey,
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          wrappedSolAccount.publicKey,
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);
    } else {
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount = await getAssociatedTokenAddress(
        outCustodyConfig.mintKey,
        publicKey
      );

      if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            outCustodyConfig.mintKey,
          )
        );
      }
    }

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    // const custodyCustomOracles = []
    const markets = [];
    for (const custody of poolConfig.custodies) {
      custodyAccountMetas.push({
        pubkey: custody.custodyAccount,
        isSigner: false,
        isWritable: false,
      });

      custodyOracleAccountMetas.push({
        pubkey: this.useExtOracleAccount ? custody.extOracleAccount : custody.intOracleAccount,
        isSigner: false,
        isWritable: false,
      });
    }

    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    let compoundingTokenAccount = await getAssociatedTokenAddress(
      compoundingTokenMint,
      publicKey
    );

    let receivingAccount = await getAssociatedTokenAddress(
      outCustodyConfig.mintKey,
      publicKey
    );

    const compoundingLpVault = PublicKey.findProgramAddressSync(
      [Buffer.from("compounding_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
      this.programId
    )[0]

    try {
      let removeCompoundingLiquidity = await this.program.methods
        .removeCompoundingLiquidity({
          compoundingAmountIn: compoundingAmountIn,
          minAmountOut: minAmountOut
        })
        .accounts({
          owner: publicKey,
          receivingAccount: outCustodyConfig.symbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount,
          compoundingTokenAccount: compoundingTokenAccount,
          poolCompoundingLpVault: compoundingLpVault,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          outCustody: outCustodyConfig.custodyAccount,
          outCustodyOracleAccount: this.useExtOracleAccount ? outCustodyConfig.extOracleAccount : outCustodyConfig.intOracleAccount,
          outCustodyTokenAccount: outCustodyConfig.tokenAccount,

          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount : rewardCustody.intOracleAccount,
          lpTokenMint: lpTokenMint,
          compoundingTokenMint: compoundingTokenMint,

          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(removeCompoundingLiquidity)

    } catch (err) {
      console.error("perpClient removeCompoundingLiquidity error:: ", err);
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

 
  removeLiquidity = async (
    recieveTokenSymbol: string,
    liquidityAmountIn: BN,
    minTokenAmountOut: BN, // give this value based on slippage 
    poolConfig: PoolConfig,
    closeLpATA = false,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false // to get back WSOL=>SOL
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    const recieveTokenCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(recieveTokenSymbol).mintKey))!;
    if (!recieveTokenCustodyConfig) {
      throw "recieveTokenCustody not found";
    }
    let publicKey = this.provider.wallet.publicKey;

    let userReceivingTokenAccount: PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let stakedLpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.stakedLpTokenMint,
        publicKey
      );

      let custodyAccountMetas = [];
      let custodyOracleAccountMetas = [];
      // const custodyCustomOracles = []
      const markets = [];
      for (const custody of poolConfig.custodies) {
        custodyAccountMetas.push({
          pubkey: custody.custodyAccount,
          isSigner: false,
          isWritable: false,
        });

        custodyOracleAccountMetas.push({
          pubkey: this.useExtOracleAccount ? custody.extOracleAccount : custody.intOracleAccount,
          isSigner: false,
          isWritable: false,
        });

        // custodyCustomOracles.push({
        //   pubkey: poolConfig.backupOracle,
        //   isSigner: false,
        //   isWritable: false,
        // })
      }

      for (const market of poolConfig.markets) {
        markets.push({
          pubkey: market.marketAccount,
          isSigner: false,
          isWritable: false,
        })
      }


      if (recieveTokenSymbol == 'SOL') {
        wrappedSolAccount = new Keypair();
        userReceivingTokenAccount = wrappedSolAccount.publicKey;
        const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: wrappedSolAccount.publicKey,
            lamports: lamports, //will this break for large amounts ??
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            wrappedSolAccount.publicKey,
            NATIVE_MINT,
            publicKey,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            wrappedSolAccount.publicKey,
            publicKey,
            publicKey,
          ),
        ];
        additionalSigners.push(wrappedSolAccount);
      } else {
        // OTHER TOKENS including WSOL,USDC,..
        userReceivingTokenAccount = await getAssociatedTokenAddress(
          poolConfig.getTokenFromSymbol(recieveTokenSymbol).mintKey,
          publicKey
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userReceivingTokenAccount,
              publicKey,
              poolConfig.getTokenFromSymbol(recieveTokenSymbol).mintKey
            )
          );
        }
      }


      let removeLiquidityTx = await this.program.methods
        .removeLiquidity({
          lpAmountIn: liquidityAmountIn,
          minAmountOut: minTokenAmountOut
        })
        .accounts({
          owner: publicKey,
          receivingAccount: recieveTokenSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount, // user token account for custody token account
          lpTokenAccount: stakedLpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          custody: recieveTokenCustodyConfig.custodyAccount,
          custodyOracleAccount: this.useExtOracleAccount ? recieveTokenCustodyConfig.extOracleAccount : recieveTokenCustodyConfig.intOracleAccount,
          custodyTokenAccount: recieveTokenCustodyConfig.tokenAccount,
          lpTokenMint: poolConfig.stakedLpTokenMint,
          eventAuthority: this.eventAuthority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction();
      instructions.push(removeLiquidityTx)

      if (closeLpATA) {
        const closeInx = createCloseAccountInstruction(stakedLpTokenAccount, publicKey, publicKey);
        instructions.push(closeInx);
      }

      if (recieveTokenSymbol == 'WSOL' && closeUsersWSOLATA) {
        const closeWsolATAIns = createCloseAccountInstruction(userReceivingTokenAccount, publicKey, publicKey);
        postInstructions.push(closeWsolATAIns);
      }

    } catch (err) {
      console.error("perpClient removeLiquidity error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  addReferral = async (
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let addReferralInstruction = await this.program.methods
        .createReferral({

        })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          referralAccount: nftReferralAccount,
          tradingAccount: nftTradingAccount,
          systemProgram: SystemProgram.programId,

        })
        .instruction();
      instructions.push(addReferralInstruction)

    } catch (err) {
      console.error("perpClient addReferral error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  updateNftAccount = async (
    nftMint: PublicKey,
    updateReferer: boolean,
    updateBooster: boolean,
    flpStakeAccounts: PublicKey[]
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let nftTradingAccount = PublicKey.findProgramAddressSync(
        [
          Buffer.from("trading"),
          nftMint.toBuffer(),
        ],
        this.programId
      )[0];

      let nftReferralAccount = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral"),
          publicKey.toBuffer(),
        ],
        this.programId
      )[0];

      let nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        publicKey
      );

      let flpStakeAccountMetas = [];
      for (const flpStakeAccountPk of flpStakeAccounts) {
        flpStakeAccountMetas.push({
          pubkey: flpStakeAccountPk,
          isSigner: false,
          isWritable: true,
        });
      }

      let updateNftTradingAccountInstruction = await this.program.methods
        .updateTradingAccount({
          updateReferer: updateReferer,
          updateBooster: updateBooster
        })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          nftTokenAccount: nftTokenAccount,
          referralAccount: nftReferralAccount,
          tradingAccount: nftTradingAccount
        })
        // .remainingAccounts([...flpStakeAccountMetas]) //pass flpStakeAccounts
        .instruction();
      instructions.push(updateNftTradingAccountInstruction)

    } catch (err) {
      console.error("perpClient updateNftAccount error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  levelUp = async (
    poolConfig: PoolConfig,
    // collectionIndex: number,
    nftMint: PublicKey,
    authorizationRulesAccount: PublicKey,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let nftTradingAccount = PublicKey.findProgramAddressSync(
        [
          Buffer.from("trading"),
          nftMint.toBuffer(),
        ],
        this.programId
      )[0];

      const metadataAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      let levelUpInstruction = await this.program.methods
        .levelUp({
          // collectionIndex: collectionIndex
        })
        .accounts({
          owner: publicKey,
          perpetuals: this.perpetuals.publicKey,
          pool: poolConfig.poolAddress,
          metadataAccount: metadataAccount,
          nftMint: nftMint,
          metadataProgram: METAPLEX_PROGRAM_ID,
          tradingAccount: nftTradingAccount,
          transferAuthority: this.authority.publicKey,
          authorizationRulesAccount: authorizationRulesAccount,
          authorizationRulesProgram: new PublicKey('auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'),
          systemProgram: SystemProgram.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .instruction();
      instructions.push(levelUpInstruction)

    } catch (err) {
      console.error("perpClient levelUp error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  depositStake = async (
    owner: PublicKey,
    feePayer: PublicKey,
    depositAmount: BN,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const lpTokenMint = poolConfig.stakedLpTokenMint;
      const poolStakedLpVault = PublicKey.findProgramAddressSync(
        [Buffer.from("staked_lp_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
        this.programId
      )[0];

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), owner.toBuffer(), poolConfig.poolAddress.toBuffer()],
        this.programId
      )[0];

      let userLpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.stakedLpTokenMint,
        owner
      );
      // NOT NEED since user can ADD LP and STAKE in single trx
      // if ( !(await checkIfAccountExists(userLpTokenAccount, this.provider.connection))) {
      //   throw `userLpTokenAccount doesn't exist : ${userLpTokenAccount.toBase58()}`
      // }

      let depositStakeInstruction = await this.program.methods
        .depositStake({
          depositAmount: depositAmount
        })
        .accounts({
          owner,
          feePayer,
          fundingLpTokenAccount: userLpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: this.perpetuals.publicKey,
          pool: poolConfig.poolAddress,
          flpStakeAccount: flpStakeAccount,
          poolStakedLpVault: poolStakedLpVault,

          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId
        })
        .instruction();
      instructions.push(depositStakeInstruction)

    } catch (err) {
      console.error("perpClient depositStaking error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  refreshStakeWithAllFlpStakeAccounts = async (poolConfig: PoolConfig,) => {
    const flpStakeAccounts = ((await this.program.account.flpStake.all()))
    const maxFlpStakeAccountLength = 32 - (4 + poolConfig.custodies.length);
    const pendingActivationAccounts: PublicKey[] = [];

    for (const flpStakeAccount of flpStakeAccounts) {
      // const account: FlpStake = flpStakeAccount.account;
      // if(account.stakeStats.pendingActivation.gt(BN_ZERO)) {
      pendingActivationAccounts.push(flpStakeAccount.publicKey);
      // }
    }

    const refreshStakeInstructions: TransactionInstruction[] = [];


    for (let i = 0; i < pendingActivationAccounts.length; i += maxFlpStakeAccountLength) {
      const batch = pendingActivationAccounts.slice(i, i + maxFlpStakeAccountLength);
      const instruction = await this.refreshStake('USDC', poolConfig, batch);
      refreshStakeInstructions.push(instruction);
    }

    return refreshStakeInstructions;
  }

  refreshStake = async (
    rewardSymbol: string,
    poolConfig: PoolConfig,
    flpStakeAccountPks: PublicKey[]
  ): Promise<TransactionInstruction> => {

    try {

      const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
      const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

      const pool = poolConfig.poolAddress
      const feeDistributionTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("custody_token_account"), pool.toBuffer(), rewardCustodyMint.toBuffer()],
        this.programId
      )[0];

      let custodyAccountMetas = [];

      for (const custody of poolConfig.custodies) {
        custodyAccountMetas.push({
          pubkey: custody.custodyAccount,
          isSigner: false,
          isWritable: false,
        });
      }

      const maxFlpStakeAccountPkLength = 32 - 4 + custodyAccountMetas.length; // 4 default accounts, custody accs, max # of accounts per ins is 32

      if (flpStakeAccountPks.length > maxFlpStakeAccountPkLength) {
        throw new Error(`Max of ${maxFlpStakeAccountPkLength} flpStakeAccountPks can be updated at a time.`)
      }

      let flpStakeAccountMetas = [];
      for (const flpStakeAccountPk of flpStakeAccountPks) {
        flpStakeAccountMetas.push({
          pubkey: flpStakeAccountPk,
          isSigner: false,
          isWritable: true,
        });
      }

      let refreshStakeInstruction = await this.program.methods
        .refreshStake({})
        .accounts({
          perpetuals: this.perpetuals.publicKey,
          pool: pool,
          rewardCustody: rewardCustodyConfig.custodyAccount,
          feeDistributionTokenAccount: feeDistributionTokenAccount,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
        })
        .remainingAccounts([...custodyAccountMetas, ...flpStakeAccountMetas])
        .instruction();

      return refreshStakeInstruction;

    } catch (err) {
      console.error("perpClient refreshStaking error:: ", err);
      throw err;
    }

  }

  unstakeInstant = async (
    rewardSymbol: string,
    unstakeAmount: BN,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
      const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

      const pool = poolConfig.poolAddress

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.programId
      )[0];

      let unstakeInstantInstruction = await this.program.methods
        .unstakeInstant({
          unstakeAmount: unstakeAmount
        })
        .accounts({
          owner: publicKey,
          perpetuals: this.perpetuals.publicKey,
          pool: pool,
          flpStakeAccount: flpStakeAccount,
          rewardCustody: rewardCustodyConfig.custodyAccount,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
        })
        .instruction();
      instructions.push(unstakeInstantInstruction)

    } catch (err) {
      console.error("perpClient unstakeInstant error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  unstakeRequest = async (
    unstakeAmount: BN,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const pool = poolConfig.poolAddress

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.programId
      )[0];

      let unstakeRequestInstruction = await this.program.methods
        .unstakeRequest({
          unstakeAmount: unstakeAmount
        })
        .accounts({
          owner: publicKey,
          perpetuals: this.perpetuals.publicKey,
          pool: pool,
          flpStakeAccount: flpStakeAccount,

          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId
        })
        .instruction();
      instructions.push(unstakeRequestInstruction)

    } catch (err) {
      console.error("perpClient unstakeRequest error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }


  withdrawStake = async (
    poolConfig: PoolConfig,
    pendingActivation = true,
    deactivated = true,
    createUserLPTA = true, //create new ATA for USER in the end 
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      const lpTokenMint = poolConfig.stakedLpTokenMint;
      const pool = poolConfig.poolAddress
      const poolStakedLpVault = PublicKey.findProgramAddressSync(
        [Buffer.from("staked_lp_token_account"), pool.toBuffer(), lpTokenMint.toBuffer()],
        this.program.programId
      )[0];

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.program.programId
      )[0];

      let userLpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.stakedLpTokenMint,
        publicKey
      );

      if (createUserLPTA && !(await checkIfAccountExists(userLpTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userLpTokenAccount,
            publicKey,
            poolConfig.stakedLpTokenMint
          )
        );
      }

      let withdrawStakeInstruction = await this.program.methods
        .withdrawStake({
          pendingActivation: pendingActivation,
          deactivated: deactivated
        })
        .accounts({
          owner: publicKey,
          receivingLpTokenAccount: userLpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: this.perpetuals.publicKey,
          pool: pool,
          flpStakeAccount: flpStakeAccount,
          poolStakedLpVault: poolStakedLpVault,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
        })
        .instruction();
      instructions.push(withdrawStakeInstruction)

    } catch (err) {
      console.error("perpClient withdrawStake error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  collectStakeFees = async (
    rewardSymbol: string,// majorly 'USDC' - so no WSOL/SOL handling
    poolConfig: PoolConfig,
    nftTradingAccount?: PublicKey,
    nftBoostingAccount?: PublicKey, //pass this even if the trading account and the boosting account are same
    createUserATA = true, //create new ATA for USER in the end 
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
    const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      const pool = poolConfig.poolAddress

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.program.programId
      )[0];

      let receivingTokenAccount = getAssociatedTokenAddressSync(
        rewardCustodyMint,
        publicKey,
        true
      );

      if (createUserATA && !(await checkIfAccountExists(receivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            receivingTokenAccount,
            publicKey,
            rewardCustodyMint
          )
        );
      }

      let tradingAccount = []
      if (nftTradingAccount) {
        tradingAccount.push({
          pubkey: nftTradingAccount,
          isSigner: false,
          isWritable: true,
        })
      }
      let boostingAccount = []
      if (nftBoostingAccount) {
        boostingAccount.push({
          pubkey: nftBoostingAccount,
          isSigner: false,
          isWritable: true,
        })
      }

      let withdrawStakeInstruction = await this.program.methods
        .collectStakeFees({})
        .accounts({
          owner: publicKey,
          receivingTokenAccount: receivingTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: this.perpetuals.publicKey,
          pool: pool,
          feeCustody: rewardCustodyConfig.custodyAccount,
          flpStakeAccount: flpStakeAccount,
          feeCustodyTokenAccount: rewardCustodyConfig.tokenAccount,

          program: this.program.programId,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...tradingAccount, ...boostingAccount])
        .instruction();
      instructions.push(withdrawStakeInstruction)

    } catch (err) {
      console.error("perpClient withdrawStake error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  collectNftReward = async (
    rewardSymbol: string,
    poolConfig: PoolConfig,
    nftMint: PublicKey,
    createUserATA = true, //create new ATA for USER in the end 
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey

    let instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        publicKey
      );

      const metadataAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      let receivingTokenAccount = await getAssociatedTokenAddress(
        rewardCustodyMint,
        publicKey
      );

      if (createUserATA && !(await checkIfAccountExists(receivingTokenAccount, this.provider.connection))) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            receivingTokenAccount,
            publicKey,
            rewardCustodyMint
          )
        );
      }

      const rewardRecord = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_record"), nftMint.toBuffer()],
        this.programFbnftReward.programId
      )[0];

      const rewardVault = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_vault")],
        this.programFbnftReward.programId
      )[0];

      const rewardTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_token_account")],
        this.programFbnftReward.programId
      )[0];

      const nftTransferAuthority = PublicKey.findProgramAddressSync(
        [Buffer.from("transfer_authority")],
        this.programFbnftReward.programId
      )[0];

      // 32 - 8 - 24 / 3
      let collectNftReward = await this.programFbnftReward.methods
        .collectReward()
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          nftMint: nftMint,
          nftTokenAccount: nftTokenAccount,
          metadataAccount: metadataAccount,
          receivingAccount: receivingTokenAccount,
          rewardRecord: rewardRecord,
          rewardVault: rewardVault,
          rewardTokenAccount: rewardTokenAccount,
          transferAuthority: nftTransferAuthority,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
      instructions.push(collectNftReward)

    } catch (err) {
      throw err;
    }

    return {
      instructions: [...instructions],
      additionalSigners
    };

  }

  public async sendTransaction(
    ixs: TransactionInstruction[],
    opts: SendTransactionOpts = {},
  ): Promise<string> {
    return await sendTransaction(
      this.program.provider as AnchorProvider,
      ixs,
      {
        postSendTxCallback: this.postSendTxCallback,
        prioritizationFee: this.prioritizationFee,
        ...opts,
      },
    );
  }

  getStakedLpTokenPrice = async (poolKey: PublicKey, POOL_CONFIG: PoolConfig): Promise<string> => {
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: token.custodyAccount,
      })
    }
    for (const custody of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: custody.intOracleAccount,
      })
    }

    for (const market of POOL_CONFIG.markets) {
      marketMetas.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    let transaction = await this.program.methods
      .getLpTokenPrice({})
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .transaction()

    const backUpOracleInstruction = await backUpOracleInstructionPromise

    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)
    const index = IDL.instructions.findIndex((f) => f.name === 'getLpTokenPrice')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getLpTokenPrice')

    return res.toString()
  }

  getAddLiquidityAmountAndFee = async (
    amount: BN,
    poolKey: PublicKey,
    depositCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig
  ): Promise<{
    amount: BN
    fee: BN
  }> => {
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: token.custodyAccount,
      })
    }
    for (const custody of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: custody.intOracleAccount,
      })
    }

    for (const market of POOL_CONFIG.markets) {
      marketMetas.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    const depositCustodyConfig = custodies.find((i) => i.custodyAccount.equals(depositCustodyKey))!

    let transaction = await this.program.methods
      .getAddLiquidityAmountAndFee({
        amountIn: amount,
      })
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        custody: depositCustodyKey,
        custodyOracleAccount: depositCustodyConfig.intOracleAccount,
        lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .transaction()

    const backUpOracleInstruction = await backUpOracleInstructionPromise
    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)
    const index = IDL.instructions.findIndex((f) => f.name === 'getAddLiquidityAmountAndFee')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getAddLiquidityAmountAndFee')

    return {
      amount: res.amount,
      fee: res.fee,
    }
  }

  getRemoveLiquidityAmountAndFee = async (
    amount: BN,
    poolKey: PublicKey,
    removeTokenCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig
  ): Promise<{
    amount: BN
    fee: BN
  }> => {
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: token.custodyAccount,
      })
    }
    for (const custody of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: custody.intOracleAccount,
      })
    }

    for (const market of POOL_CONFIG.markets) {
      marketMetas.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    const removeCustodyConfig = custodies.find((i) => i.custodyAccount.equals(removeTokenCustodyKey))!

    let transaction = await this.program.methods
      .getRemoveLiquidityAmountAndFee({
        lpAmountIn: amount,
      })
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        custody: removeTokenCustodyKey,
        custodyOracleAccount: removeCustodyConfig.intOracleAccount,
        lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .transaction()

    const backUpOracleInstruction = await backUpOracleInstructionPromise

    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)
    const index = IDL.instructions.findIndex((f) => f.name === 'getRemoveLiquidityAmountAndFee')
    if (result.value.err) {
      return {
        amount: new BN(0),
        fee: new BN(0),
      }
    }
    const res: any = this.viewHelper.decodeLogs(result, index, 'getRemoveLiquidityAmountAndFee')

    return {
      amount: res.amount,
      fee: res.fee,
    }
  }

  getCompoundingLPTokenPrice = async (poolKey: PublicKey, POOL_CONFIG: PoolConfig): Promise<string> => {
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: token.custodyAccount,
      })
    }
    for (const custody of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: custody.intOracleAccount,
      })
    }

    for (const market of POOL_CONFIG.markets) {
      marketMetas.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    const backUpOracleInstruction = await backUpOracleInstructionPromise

    let transaction = await this.program.methods
      .getCompoundingTokenPrice({})
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .transaction()

    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)

    const index = IDL.instructions.findIndex((f) => f.name === 'getCompoundingTokenPrice')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getCompoundingTokenPrice')

    return res.toString()
  }

  getSFLPAddLiquidityAmountAndFee = async (
    amount: BN,
    poolKey: PublicKey,
    depositCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig
  ): Promise<{
    amount: BN
    fee: BN
  }> => {
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: token.custodyAccount,
      })
    }
    for (const custody of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: custody.intOracleAccount,
      })
    }

    for (const market of POOL_CONFIG.markets) {
      marketMetas.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    const depositCustodyConfig = custodies.find((i) => i.custodyAccount.equals(depositCustodyKey))!
    const rewardCustody = POOL_CONFIG.custodies.find((f) => f.symbol == 'USDC')!

    const backUpOracleInstruction = await backUpOracleInstructionPromise

    let transaction = await this.program.methods
      .getAddCompoundingLiquidityAmountAndFee({
        amountIn: amount,
      })
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        inCustody: depositCustodyKey,
        inCustodyOracleAccount: depositCustodyConfig.intOracleAccount,
        rewardCustody: rewardCustody.custodyAccount,
        rewardCustodyOracleAccount: rewardCustody.intOracleAccount,
        lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
        compoundingTokenMint: POOL_CONFIG.compoundingTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .transaction()

    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)
    const index = IDL.instructions.findIndex((f) => f.name === 'getAddCompoundingLiquidityAmountAndFee')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getAddCompoundingLiquidityAmountAndFee')

    return {
      amount: res.amount,
      fee: res.fee,
    }
  }

  getSFLPRemoveLiquidityAmountAndFee = async (
    amount: BN,
    poolKey: PublicKey,
    removeTokenCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig
  ): Promise<{
    amount: BN
    fee: BN
  }> => {
    const backUpOracleInstructionPromise = createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)

    const custodies = POOL_CONFIG.custodies
    let custodyMetas = []
    let marketMetas = []

    for (const token of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: token.custodyAccount,
      })
    }
    for (const custody of custodies) {
      custodyMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: custody.intOracleAccount,
      })
    }

    for (const market of POOL_CONFIG.markets) {
      marketMetas.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      })
    }

    const removeCustodyConfig = custodies.find((i) => i.custodyAccount.equals(removeTokenCustodyKey))!
    const rewardCustody = POOL_CONFIG.custodies.find((f) => f.symbol == 'USDC')!
    const backUpOracleInstruction = await backUpOracleInstructionPromise

    let transaction = await this.program.methods
      .getRemoveCompoundingLiquidityAmountAndFee({
        compoundingAmountIn: amount,
      })
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        outCustody: removeTokenCustodyKey,
        outCustodyOracleAccount: removeCustodyConfig.intOracleAccount,
        rewardCustody: rewardCustody.custodyAccount,
        rewardCustodyOracleAccount: rewardCustody.intOracleAccount,
        compoundingTokenMint: POOL_CONFIG.compoundingTokenMint,
        lpTokenMint: POOL_CONFIG.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .transaction()
    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)
    const index = IDL.instructions.findIndex((f) => f.name === 'getRemoveCompoundingLiquidityAmountAndFee')
    if (result.value.err) {
      return {
        amount: new BN(0),
        fee: new BN(0),
      }
    }
    const res: any = this.viewHelper.decodeLogs(result, index, 'getRemoveCompoundingLiquidityAmountAndFee')

    return {
      amount: res.amount,
      fee: res.fee,
    }
  }
}


