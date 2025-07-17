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
  Ed25519Program,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createCloseAccountInstruction,
  createSyncNativeInstruction,
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  createInitializeAccount3Instruction,
  getMinimumBalanceForRentExemptAccount,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

import { sha256 } from "js-sha256";
import { encode } from "bs58";
import { PoolAccount } from "./PoolAccount";
import { PositionAccount } from "./PositionAccount";
import { AddLiquidityAmountAndFee,  BorrowRateParams, Custody, DEFAULT_POSITION, ExitPriceAndFee, Fees, OracleParams, Permissions, Position, PricingParams, RemoveCollateralData, RemoveLiquidityAmountAndFee, Side, SwapAmountAndFees, TokenRatios, isVariant, MinAndMaxPrice, FeesAction, FeesMode, RatioFee, PermissionlessPythCache, OpenPositionParams, ContractOraclePrice, Privilege, FlpStake, PerpetualsAccount, Trading, Order, EntryPriceAndFeeV2, EntryPriceAndFee, TokenPermissions, TokenStake, InternalEmaPrice } from "./types";
import { OraclePrice } from "./OraclePrice";
import { CustodyAccount } from "./CustodyAccount";
import { Perpetuals } from "./idl/perpetuals";
import { PerpComposability } from "./idl/perp_composability";
import { FbnftRewards } from "./idl/fbnft_rewards";
import { RewardDistribution } from "./idl/reward_distribution";

import { IDL } from './idl/perpetuals';
import { IDL as PerpComposabilityIDL } from './idl/perp_composability';
import { IDL as FbNftIDL } from './idl/fbnft_rewards';
import { IDL as RewardDistributionIDL } from './idl/reward_distribution';

import { SendTransactionOpts, sendTransaction, sendTransactionV3 } from "./utils/rpc";
import { MarketConfig, PoolConfig, Token } from "./PoolConfig";
import { checkIfAccountExists, checkedDecimalCeilMul, checkedDecimalMul, getUnixTs, nativeToUiDecimals, scaleToExponent, uiDecimalsToNative } from "./utils";
import { BPS_DECIMALS, BPS_POWER, LP_DECIMALS, RATE_DECIMALS, USD_DECIMALS, BN_ZERO, RATE_POWER, METAPLEX_PROGRAM_ID, BN_ONE, ORACLE_EXPONENT, DAY_SECONDS, FAF_DECIMALS } from "./constants";
import BigNumber from "bignumber.js";
import { max } from "bn.js";
import { createBackupOracleInstruction } from "./backupOracle";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import * as nacl from "tweetnacl";
import { MarketAccount } from "./MarketAccount";
import { getReferralAccounts } from "./utils/getReferralAccounts";
import { ViewHelper } from "./ViewHelper";
import { TokenStakeAccount } from "./TokenStakeAccount";
import { TokenVaultAccount } from "./TokenVaultAccount";

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

  eventAuthority : { publicKey: PublicKey; bump: number };
  eventAuthorityRewardDistribution: { publicKey: PublicKey; bump: number };

  prioritizationFee: number;
  minimumBalanceForRentExemptAccountLamports: number;
  
  private postSendTxCallback?: ({ txid }) => void;
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

    this.minimumBalanceForRentExemptAccountLamports = 2_039_280;
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

    const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
    // console.log("accCreationLamports:", accCreationLamports)
     if(accCreationLamports){
       this.minimumBalanceForRentExemptAccountLamports = accCreationLamports
     }
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
    targetCustody : PublicKey,
    collateralCustody : PublicKey,
    side: Side
  ): PublicKey {
    return  this.findProgramAddress("position", [
        owner,
        this.getMarketPk(targetCustody, collateralCustody, side ),
      ]).publicKey;
  }

  getOrderAccountKey(
    owner: PublicKey,
    targetCustody : PublicKey,
    collateralCustody : PublicKey,
    side: Side
  ): PublicKey {
    return  this.findProgramAddress("order", [
        owner,
        this.getMarketPk(targetCustody, collateralCustody, side ),
      ]).publicKey;
  }

  getPosition = async (postionKey: PublicKey) => {
    return this.program.account.position.fetch(postionKey);
  };

  getPositionData = async (
    position: PositionAccount,
    poolConfig: PoolConfig
  ) => {

    const marketConfig = poolConfig.markets.find(i => i.marketAccount.equals(position.market))!;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.custodyAccount.equals(marketConfig.targetCustody))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.custodyAccount.equals(marketConfig.collateralCustody))!;

    try {
      
      let getPositionData = await this.program.methods
          .getPositionData({})
          .accounts({
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            position: position.publicKey,
            market: marketConfig.marketAccount,
            targetCustody: targetCustodyConfig.custodyAccount,
            custodyOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
            collateralCustody: collateralCustodyConfig.custodyAccount,
            collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
          })
          .view();

          console.log(getPositionData)
          return getPositionData

    } catch (err) {
      console.log("perpClient setPool error:: ", err);
      throw err;
    }
  }

  getOrderAccount = async (orderAccountKey: PublicKey) => {
    return this.program.account.order.fetch(orderAccountKey);
  };

  getUserPosition = async (
    owner: PublicKey,
    targetCustody : PublicKey,
    collateralCustody : PublicKey,
    side: Side
  ) => {
    return this.program.account.position.fetch(
      this.getPositionKey(owner, targetCustody, collateralCustody, side)
    );
  };

  getUserOrderAccount = async (
    owner: PublicKey,
    targetCustody : PublicKey,
    collateralCustody : PublicKey,
    side: Side
  ) => {
    return this.program.account.position.fetch(
      this.getOrderAccountKey(owner, targetCustody, collateralCustody, side)
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

  getUserOrderAccounts = async (
    wallet: PublicKey,
    poolConfig: PoolConfig
  ) => {

    const marketAccountsPks = poolConfig.getAllMarketPks();

    const orderAccountKeys = marketAccountsPks.map(f => this.findProgramAddress("order", [
      wallet,
      f
    ])).map(p => p.publicKey);

    let orderAccountsDatas = (await this.provider.connection.getMultipleAccountsInfo(orderAccountKeys)) ?? [];

    return orderAccountsDatas
      .map((p, i) => ({ pubkey: orderAccountKeys[i], data: p }))
      .filter(f => f.data !== null)
      .map(k => ({ pubkey: k.pubkey, ...this.program.account.position.coder.accounts.decode<Order>('order', k.data!.data) }))
  };

  getAllPositions = async () => {
    return this.program.account.position.all();
  };
  
  getAllActivePositions = async () => {
    const allPositions = await this.program.account.position.all();

    const activePositions  = allPositions.filter(f => !f.account.sizeAmount.isZero());

    return activePositions;
  };

  getAllPositionsByMarket = async (marketKey: PublicKey ) => {
    // return this.program.account.position.all();
    const data = encode(
        Buffer.concat([marketKey.toBuffer()])
    );
    const allPositions = await this.program.account.position.all([
        {
            memcmp: { bytes: data, offset: 40 }
        }
    ]);
    //  console.log("allPositions from market :",marketKey.toBase58() ,allPositions.length)
     return allPositions;
  };

  getAllActivePositionsByMarket = async (marketKey: PublicKey ) => {
    // return this.program.account.position.all();
    const data = encode(
        Buffer.concat([marketKey.toBuffer()])
    );
    const allPositions = await this.program.account.position.all([
        {
            memcmp: { bytes: data, offset: 40 }
        }
    ]);

    //  console.log("allPositions from market :",marketKey.toBase58() ,allPositions.length)
     const activePositions  = allPositions.filter(f => !f.account.sizeAmount.isZero());
    //  console.log("allActivePositions from market :",marketKey.toBase58() ,activePositions.length)
     return activePositions
  };

  getAllOrderAccounts = async () => {
    return this.program.account.order.all();
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
  
  liquidate = async (
    positionAccount: PublicKey,
    poolConfig : PoolConfig,
    tokenMint: PublicKey,
    collateralMint: PublicKey,
    marketPk : PublicKey,
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

  getApyPercentageUi = (
    rewardCustodyAccount: CustodyAccount, // usdcCustodyAccount
    previousSnapShotRewardPerLpStaked : BN, // daily
    lpTokenUsdPrice : BN // for this pool
  )  => {
    const currentRewardPerLpStaked = rewardCustodyAccount.feesStats.rewardPerLpStaked; // daily  before
    const difference = currentRewardPerLpStaked.sub(previousSnapShotRewardPerLpStaked);
    // console.log("difference:",difference.toString())
    // const anualizedReward =  difference.muln(365).div(lpTokenUsdPrice)
    const anualizedRewardUi =  new BigNumber(difference.toString()).multipliedBy(365).dividedBy(lpTokenUsdPrice.toString())
    // console.log("anualizedRewardUi:",anualizedRewardUi)
    const percentage = anualizedRewardUi.multipliedBy(100)
    return percentage.toString();
  } 

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
      // if(poolAumUsdMax.isZero()){ 
      //   return {
      //     lpAmountOut: amountIn,
      //     fee: amountIn.mul(new BN(90)).div(new BN(100)),
      //   }
      // }
      // const amountInUsdUi = new BigNumber(inputTokenPrice.toUiPrice(USD_DECIMALS))
      //     .multipliedBy(amountIn.toString())
      //     .dividedBy(10 ** inputToken.decimals)
      // const lpAmountOutUi = new BigNumber(amountInUsdUi)
      //     .multipliedBy(new BigNumber(lpTokenSupplyAmount.toString()).dividedBy(10 ** LP_DECIMALS))
      //     .dividedBy(new BigNumber(poolAumUsdMax.toString()).dividedBy(new BigNumber(10 ** USD_DECIMALS)))
      // const lpAmountOut = lpAmountOutUi.multipliedBy(new BigNumber(10 ** LP_DECIMALS))
      // const lpAmountOutBn = new BN(lpAmountOut.toFixed(0, BigNumber.ROUND_DOWN))
      // const fee = amountIn.mul(new BN(90)).div(new BN(100))
      // return {
      //     lpAmountOut: lpAmountOutBn,
      //     fee: fee,
      // }

      //todo: do u check if the transaction fails and do not show the fee or deactivate the button?

      if(inputTokenCustodyAccount.isVirtual) {
        throw new Error("Virtual custody, cannot add liquidity")
      }

      if (!inputTokenPrice.exponent.eq(inputTokenEmaPrice.exponent)) { // || !inputTokenPrice.exponent.eq(new BN(-8) NO NEED to force 
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
    // const amountOutUsdUi = new BigNumber(poolAumUsdMax.toString())
    //     .dividedBy(new BigNumber(10 ** USD_DECIMALS))
    //     .multipliedBy(new BigNumber(lpAmountIn.toString()).dividedBy(new BigNumber(10 ** LP_DECIMALS)))
    //     .dividedBy(new BigNumber(lpTokenSupply.toString()).dividedBy(new BigNumber(10 ** LP_DECIMALS)))

    // const amountOutUi = amountOutUsdUi.dividedBy(new BigNumber(outputTokenPrice.toUiPrice(USD_DECIMALS)))

    // const amountOut = new BN(
    //     amountOutUi.multipliedBy(new BigNumber(10 ** outputToken.decimals)).toFixed(0, BigNumber.ROUND_DOWN)
    // )

    // const fee = amountOut.mul(new BN(90)).div(new BN(100))

    if (!outputTokenPrice.exponent.eq(outputTokenEmaPrice.exponent)  ) { // || !outputTokenPrice.exponent.eq(new BN(-8))
      throw new Error("exponent mistach")
    }

    const minMaxPrice = this.getMinAndMaxOraclePriceSync(outputTokenPrice, outputTokenEmaPrice, outputTokenCustodyAccount)

    const removeAmountUsd = (poolAumUsdMax.mul(lpAmountIn)).div(lpTokenSupply)
    // const MaxPriceoracle = OraclePrice.from({price: new BN(minMaxPrice.max.price), exponent: new BN(-8), confidence: BN_ZERO, timestamp: BN_ZERO })
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

    // maxPriceOracle is in PriceDecimals
    let tokenAumUsd = maxPriceOracle.getAssetAmountUsd(custodyAccount.assets.owned, custodyAccount.decimals)
    // console.log("tokenAumUsd: ", tokenAumUsd.toString())
    // console.log("poolAmountUsd: ", poolAumUsdMax.toString())

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
    // console.log("newRatio ",newRatio.toString())
    
    const index = poolAccount.custodies.findIndex(c => c.equals(inputTokenCustodyAccount.publicKey));

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
      // let factorBps = (divergenceBps.mul(new BN(BPS_POWER))).div(custodyAccount.oracle.maxDivergenceBps)

      let confBps = (maxPrice.confidence.muln(BPS_POWER)).div(maxPrice.price);

      if (confBps.lt(custodyAccount.oracle.maxConfBps)) {
        // let confFactor = BN.min(factorBps, new BN(50000)) //todo: update, this should be a variable
        // let confScale = (maxPriceUsd.confidence.mul(confFactor)).div(new BN(BPS_POWER))

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
      let factorBps =  custodyAccount.oracle.maxDivergenceBps.isZero ? BN_ZERO :  (divergenceBps.mul(new BN(BPS_POWER))).div(custodyAccount.oracle.maxDivergenceBps)

      let confBps = (price.confidence.muln(BPS_POWER)).div(price.price);
      if (confBps.lt(custodyAccount.oracle.maxConfBps)) {
        let confFactor = BN.min(factorBps, new BN(50000)) //todo: update, this should be a variable
        let confScale = (price.confidence.mul(confFactor)).div(new BN(BPS_POWER))

        minPrice.price = price.price.sub(confScale);
      } else { 
        //TODO: Flag close only mode and default to backup oracle
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
         //TODO: Flag close only mode and default to backup oracle
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

  // this is just used in Position Table to DISPLAY when position is Live
  //  SHOULD NOT BE USED IN AMOUNT ENTRY - in UI 
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

  // used in the AMOUNT ENTRY - in UI for OPEN_POSITION or ADD_COLLATERAL_WITH_INCREASE_SIZE
  // 1) open
  // 2) open with swap
  // 3) addwithIncrease 
  // 4) addwithIncrease with swap 
  // 5) Increase 
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
      // const newEntryPriceOracle = new OraclePrice({price: entryPriceUsdBN, exponent: new BN(USD_DECIMALS).neg(), confidence: targetTokenPrice.confidence, timestamp: targetTokenPrice.timestamp});
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

    // const entryOraclePrice = new OraclePrice({price: entryPrice, exponent: new BN(USD_DECIMALS).neg(), confidence: targetTokenPrice.confidence, timestamp: targetTokenPrice.timestamp});
    const sizeAmountUsd = entryOraclePrice.getAssetAmountUsd(sizeAmount, targetTokenCustodyAccount.decimals);

    if(currentCollateralUsdIncludingPnl.gt(BN_ZERO)){
      return  sizeAmountUsd.mul(new BN(BPS_POWER)).div(currentCollateralUsdIncludingPnl)
    } else {
      // U64_MAX
      return new BN( Number.MAX_SAFE_INTEGER)
    }
  }

  // used in
  // 1) OpenPosition amount entry - in below display card 
  // 2) AddCollateral amount entry -
  // 3) Increase Size
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

    // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
    const lockedUsd = targetPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)
      let entryOraclePrice = this.getEntryPriceUsdSync(
          side,
          targetPrice,
          targetEmaPrice,
          targetCustodyAccount,
          lockedUsd
      );

      // const entryOraclePrice = OraclePrice.from({ price: entryOraclePrice, exponent: new BN(-1 * USD_DECIMALS), confidence: BN_ZERO, timestamp: BN_ZERO })

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
        targetPrice,
        targetEmaPrice,
        targetCustodyAccount,
        collateralPrice, 
        collateralEmaPrice,
        collateralCustodyAccount,
        positionAccount,
      )

      // const entryOraclePrice = new OraclePrice({price: entryOraclePrice, exponent: new BN(USD_DECIMALS).neg(), confidence: targetPrice.confidence, timestamp: targetPrice.timestamp});
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

  // used in
  // 1) OpenPosition amount entry - in below display card 
  // 2) AddCollateral amount entry -
  // 3) Increase Size
  getEntryPriceAndFeeSyncV2 = (
    positionAccount: PositionAccount | null,   // because for new Position no Account
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
    currentTimestamp: BN,
    discountBps = BN_ZERO,
    enableLogs = false
  ): EntryPriceAndFeeV2 => {

    if (collateralDeltaAmount.isNeg() || sizeDeltaAmount.isNeg()) {
      throw new Error("Delta Amounts cannot be negative.")
    }

    // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
    const lockedUsd = targetPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)
    let entryOraclePrice = this.getEntryPriceUsdSync(
      side,
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      lockedUsd
    );

    // const entryOraclePrice = OraclePrice.from({ price: entryOraclePrice, exponent: new BN(-1 * USD_DECIMALS), confidence: BN_ZERO, timestamp: BN_ZERO })

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
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      collateralPrice,
      collateralEmaPrice,
      collateralCustodyAccount,
      positionAccount,
    )

    // const entryOraclePrice = new OraclePrice({price: entryOraclePrice, exponent: new BN(USD_DECIMALS).neg(), confidence: targetPrice.confidence, timestamp: targetPrice.timestamp});
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
      feeAmount = feeUsd.mul(new BN(10 ** collateralCustodyAccount.decimals)).div(collateralTokenMinOraclePrice.price);

      if (discountBps.gt(BN_ZERO)) {
        feeUsdAfterDiscount = feeUsd.mul(discountBps).div(new BN(BPS_POWER));
        feeUsdAfterDiscount = feeUsd.sub(feeUsdAfterDiscount);
        feeAmountAfterDiscount = feeUsdAfterDiscount.mul(new BN(10 ** collateralCustodyAccount.decimals)).div(collateralTokenMinOraclePrice.price);
      } else {
        feeUsdAfterDiscount = feeUsd
        feeAmountAfterDiscount = feeAmount
      }
    }

    // check closeOnly and add Volatility fee
    let divergenceBps: BN;

    // skipping oneUsdPrice check as targetCustodyAccount is never stable
    // if (targetCustodyAccount.isStable) {
    //   const oneUsdPrice =  OraclePrice.from({
    //     price: new BN(10).pow(maxPrice.exponent.abs()), // 1 USD
    //     exponent: maxPrice.exponent,
    //     confidence: maxPrice.confidence,
    //     timestamp: maxPrice.timestamp 
    //   })
    //   divergenceBps = maxPrice.getDivergenceFactor(oneUsdPrice)
    // } else {

    // }
    divergenceBps = targetPrice.getDivergenceFactor(targetEmaPrice)

    let vbFeeUsd = BN_ZERO;
    // greater than max divergence
    if (divergenceBps.gte(targetCustodyAccount.oracle.maxDivergenceBps)) {
      if(enableLogs)
        console.log("volitlity fee added:", "divergenceBps", divergenceBps.toString() , "maxDivergenceBps" , targetCustodyAccount.oracle.maxDivergenceBps.toString())
      vbFeeUsd = sizeAmountUsd.mul(targetCustodyAccount.fees.volatility).div(new BN(RATE_POWER))
    } else {
      if(enableLogs)
        console.log("volitlity fee zero:", "divergenceBps", divergenceBps.toString() , "maxDivergenceBps" , targetCustodyAccount.oracle.maxDivergenceBps.toString())
    }

    return {
      entryOraclePrice: entryOraclePrice,
      feeUsd: feeUsd,
      feeAmount: feeAmount,
      vbFeeUsd: vbFeeUsd,
      feeUsdAfterDiscount: feeUsdAfterDiscount,
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

  // used in 
  // 1) Close position amount entry -
  // 2) RemoveCollateral amount entry -
  // 3) Decrease size
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
    })//.scale_to_exponent(new BN(-1 * USD_DECIMALS));

    resultingPositionAccount.sizeUsd = positionEntryOraclePrice.getAssetAmountUsd(resultingPositionAccount.sizeAmount, targetCustodyAccount.decimals);

    const liquidationPrice = this.getLiquidationPriceSync(
      resultingPositionAccount.collateralAmount,
      resultingPositionAccount.sizeAmount,
      positionEntryOraclePrice,
      lockAndUnsettledFeeUsd,
      marketCorrelation,
      side,
      targetPrice,
      targetEmaPrice,
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

  // getExitPriceSync = (
  //   side: Side,
  //   targetPrice: OraclePrice,
  //   targetEmaPrice: OraclePrice,
  //   targetCustodyAccount: CustodyAccount,
  // ): BN => {
  //   const { min: minPrice, max: maxPrice } = this.getMinAndMaxPriceSync(targetPrice, targetEmaPrice, targetCustodyAccount);
  //   const exitPriceBN = isVariant(side, 'long') ?
  //     minPrice.sub(minPrice.mul(targetCustodyAccount.pricing.tradeSpreadShort).div(new BN(BPS_POWER))) :
  //     maxPrice.add(maxPrice.mul(targetCustodyAccount.pricing.tradeSpreadLong).div(new BN(BPS_POWER)));

  //   return exitPriceBN; // IN PRICE DECIMALS
  // }

  getTradeSpread = ( targetCustodyAccount : CustodyAccount ,lockedUsd : BN) : BN => {
    // if ( 
    //   targetCustodyAccount.pricing.tradeSpreadMax.eq(BN_ZERO) ||
    //    ( targetCustodyAccount.sizeFactorForSpread !== 0  
    //       &&
    //     lockedUsd.lte( targetCustodyAccount.pricing.maxPositionLockedUsd.divn(targetCustodyAccount.sizeFactorForSpread) )
    //    ) 
    //  ) { 
    //   return BN_ZERO
    //  }
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
    // console.log("finalSpread:",finalSpread.toString())
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
    // console.log("SDK : spread:",spread.toString())

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

  //  NOTE : this doesn't include swap 
  getSizeAmountFromLeverageAndCollateral = (
    collateralAmtWithFee: BN,
    leverage: string, // 55.5x 
    marketToken: Token, //todo: we can remove this and use CustodyAccount
    collateralToken: Token, //todo: we can remove this and use CustodyAccount
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
      // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
      const lockedUsd = uiDecimalsToNative(sizeUsdUi.toString(),USD_DECIMALS) //targetPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)
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
      // console.log("no swap needed")
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
      
    // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
    // const lockedUsd = targetTokenPrice.getAssetAmountUsd(sizeDeltaAmount, targetTokenCustodyAccount.decimals)
    const lockedUsd= uiDecimalsToNative(sizeUsdUi.toFixed(USD_DECIMALS), USD_DECIMALS)
    const entryOraclePrice = this.getEntryPriceUsdSync(
        side,
        targetTokenPrice,
        targetTokenEmaPrice,
        targetTokenCustodyAccount,
        lockedUsd
      )
      // const entryPriceUsdUi = new BigNumber(entryOraclePrice.toString()).dividedBy(10**USD_DECIMALS);
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

        // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
    const lockedUsd = targetPrice.getAssetAmountUsd(sizeAmount, targetCustodyAccount.decimals)
    // const lockedUsd= uiDecimalsToNative(sizeUsdUi.toFixed(USD_DECIMALS), USD_DECIMALS)
    const entryOraclePrice = this.getEntryPriceUsdSync(
      side,
      targetPrice,
      targetEmaPrice,
      targetCustodyAccount,
      lockedUsd
    )
    // const entryPriceUsdUi = new BigNumber(entryPriceUsdBN.toString()).dividedBy(10**USD_DECIMALS);
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
  
         // NOTE : initially we take the lockedUsd based on the current Price then we use the getEntryPriceUsdSync() to calculate the final entry price after spread
     const lockedUsd = targetTokenPrice.getAssetAmountUsd(sizeAmount, targetTokenCustodyAccount.decimals)
     // const lockedUsd= uiDecimalsToNative(sizeUsdUi.toFixed(USD_DECIMALS), USD_DECIMALS)
      const entryOraclePrice = this.getEntryPriceUsdSync(
        side,
        targetTokenPrice,
        targetTokenEmaPrice,
        targetTokenCustodyAccount,
        lockedUsd
      )
      // const entryPriceUsdUi = new BigNumber(entryPriceUsdBN.toString()).dividedBy(10**USD_DECIMALS);
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
        // console.log("no swap needed")
        collateralInInputToken = collateralAmountWithFee
      } else {
        collateralInInputToken = this.getSwapAmountAndFeesSync(BN_ZERO, collateralAmountWithFee, poolAccount, inputTokenPrice, inputTokenEmaPrice, 
          inputTokenCustodyAccount, swapOutTokenPrice, swapOutTokenEmaPrice, swapOutTokenCustodyAccount, swapPoolAumUsdMax, poolConfigSwap).minAmountIn
      }

      return collateralInInputToken
  }

  // used in decreaseSize Modal
  getDecreaseSizeCollateralAndFeeSync = ( 
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
    debugLogs = false,
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
    // const marketMinMaxPrice = this.getMinAndMaxOraclePriceSync(targetPrice, targetEmaPrice, targetCustodyAccount)

     // const positionDelta = positionAccount.clone() // CHECK : gives error 
     let positionDelta = PositionAccount.from(positionAccount.publicKey ,  { ...positionAccount} as Position) 

     
     const positionEntryOraclePrice = new OraclePrice({
      price: positionAccount.entryPrice.price, exponent: new BN(positionAccount.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO
    })

    const sizeDeltaAmount = positionEntryOraclePrice.getTokenAmount(sizeDeltaUsd, targetCustodyAccount.decimals)
    positionDelta.sizeAmount = sizeDeltaAmount

    // console.log("sizeDeltaAmountL:",sizeDeltaAmount.toString()) // 11034

    const decimalPower = new BN(10 ** targetCustodyAccount.decimals)
    const closeRatio = (positionDelta.sizeAmount.mul(decimalPower)).div(positionAccount.sizeAmount)
    // console.log("closeRatio:",closeRatio.toString())

    positionDelta.sizeUsd = (positionAccount.sizeUsd.mul(closeRatio)).div(decimalPower)
    // console.log("positionDelta.sizeUsd:",positionDelta.sizeUsd.toString())
    positionDelta.unsettledFeesUsd = (positionAccount.unsettledFeesUsd.mul(closeRatio)).div(decimalPower)
    // positionDelta.unsettledAmount = (positionAccount.unsettledAmount.mul(closeRatio)).div(decimalPower)
    positionDelta.lockedAmount = (positionAccount.lockedAmount.mul(closeRatio)).div(decimalPower)
    positionDelta.lockedUsd = (positionAccount.lockedUsd.mul(closeRatio)).div(decimalPower)
    positionDelta.collateralAmount = (positionAccount.collateralAmount.mul(closeRatio)).div(decimalPower)
    //check if the positionDelta needs any other updates? only collateral_usd is not being updated and it is not being used
    // console.log("first pnl --- ")
    const newPnl = this.getPnlSync(positionDelta, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)
    // console.log("first pnl : ",newPnl.profitUsd.toString(), newPnl.lossUsd.toString())
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
    if(debugLogs){
      console.log("assetsUsd.sub(liabilityUsd):", collateralCustodyAccount.decimals , assetsUsd.toString(),   liabilityUsd.toString(), assetsUsd.sub(liabilityUsd).toString())
    }
    if (assetsUsd.gte(liabilityUsd)){
      closeAmount = collateralMinMaxPrice.max.getTokenAmount(assetsUsd.sub(liabilityUsd), collateralCustodyAccount.decimals)
      feesAmount = collateralMinMaxPrice.min.getTokenAmount(totalFeesUsd, collateralCustodyAccount.decimals)
    } else {
      closeAmount = BN_ZERO
      feesAmount = collateralMinMaxPrice.min.getTokenAmount(assetsUsd.sub(newPnl.lossUsd), collateralCustodyAccount.decimals)
    }

    
    // let availableAmountUsd :BN; 
    // if(newPnl.profitUsd.gt(BN_ZERO)){
    //   availableAmountUsd = currentCollateralUsd.add(newPnl.profitUsd)
    // } else if (newPnl.lossUsd.lt(currentCollateralUsd) ) {
    //   availableAmountUsd = currentCollateralUsd.sub(newPnl.lossUsd)
    // } else {
    //   availableAmountUsd = BN_ZERO
    // }

    // //  implementing close Amount function 
    // let closeAmount = collateralMinMaxPrice.max.getTokenAmount(availableAmountUsd, collateralCustodyAccount.decimals)
    // const maxAmount = (positionDelta.lockedAmount.sub(
    //     newPnl.exitFeeAmount.add(newPnl.borrowFeeAmount)
    //   )).add(positionDelta.collateralAmount)

    // closeAmount = BN.min(closeAmount,maxAmount)

    let newPosition = PositionAccount.from(positionAccount.publicKey , { ...positionAccount } as Position) 
    // need to check if we can omit some updates to the variables
    newPosition.sizeAmount = positionAccount.sizeAmount.sub(positionDelta.sizeAmount)
    newPosition.sizeUsd = positionAccount.sizeUsd.sub(positionDelta.sizeUsd)
    // console.log("newPosition.sizeUsd:",newPosition.sizeUsd.toString())
    newPosition.lockedUsd = positionAccount.lockedUsd.sub(positionDelta.lockedUsd)
    newPosition.lockedAmount = positionAccount.lockedAmount.sub(positionDelta.lockedAmount)
    newPosition.collateralAmount = positionAccount.collateralAmount.sub(positionDelta.collateralAmount)
    newPosition.unsettledFeesUsd = positionAccount.unsettledFeesUsd.sub(positionDelta.unsettledFeesUsd)
    // calc new collateralUsd
    newPosition.collateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(newPosition.collateralAmount, collateralCustodyAccount.decimals)


    let feeUsdWithDiscount = BN_ZERO;
    let feeUsd = sizeDeltaUsd.mul(targetCustodyAccount.fees.closePosition).div(new BN(RATE_POWER))

    if(discountBps.gt(BN_ZERO)){
      feeUsdWithDiscount = feeUsd.mul(discountBps).div(new BN(BPS_POWER));
      feeUsdWithDiscount = exitFeeUsd.sub(feeUsdWithDiscount);
    } else {
      feeUsdWithDiscount = feeUsd
    }

    feeUsd = feeUsd.add(lockAndUnsettledFeeUsd)
    feeUsdWithDiscount = feeUsdWithDiscount.add(lockAndUnsettledFeeUsd)

    if(keepLevSame){ 
      // console.log("inside keepLevSame :",keepLevSame)
      // const previousPnl = this.getPnlSync(positionAccount, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig) //pnl calculated here should be before decrease size instruction
      // const pnlUsd = previousPnl.profitUsd.sub(previousPnl.lossUsd)


      // const exitFee = this.getExitFeeSync(positionAccount, targetCustodyAccount, collateralCustodyAccount, collateralPrice, collateralEmaPrice)
      // const lockAndUnsettledFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(positionAccount, collateralCustodyAccount, currentTimestamp)

      // const pnlUsdWithFee = pnlUsd.sub(lockAndUnsettledFeeUsd).sub(exitFee.exitFeeUsd)

      // const currentlev = this.getLeverageSync(positionAccount.sizeUsd, positionAccount.collateralAmount, collateralMinMaxPrice.min, collateralCustodyAccount.decimals, pnlUsdWithFee)
      // console.log("currentLev", currentlev.toString())

      let collateralAmountReceived =  closeAmount;
      let collateralAmountRecievedUsd = collateralMinMaxPrice.min.getAssetAmountUsd(collateralAmountReceived, collateralCustodyAccount.decimals)
      // let collateralAmountRecievedUsd = (newPosition.sizeUsd.mul(new BN(BPS_POWER)).div(currentlev)).sub(newPosition.collateralUsd)
        // console.log("before minCollateral check : collateralAmountReceived : ", collateralAmountReceived.toString())
      // ===
      // console.log("newPosition.collateralUsd:",newPosition.collateralUsd.toString())
      // console.log("newPosition.collateralAmount:",newPosition.collateralAmount.toString())
      // console.log("newPosition.sizeUsd:",newPosition.sizeUsd.toString())
      // console.log("newPosition.sizeAmount:",newPosition.sizeAmount.toString())


      const maxWithdrawableAmount = this.getMaxWithdrawableAmountSyncInternal(newPosition, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, poolConfig, closeAmount)
      // console.log("collateralAmountReceived USD before ", collateralAmountRecievedUsd.toString())
      // console.log("collateralAmountReceived", collateralAmountReceived.toString())
      // console.log("curr coll ", newPosition.collateralAmount.toString())
      if(debugLogs){
        console.log("maxWithdrawableAmount ", maxWithdrawableAmount.toString(), keepLevSame)
        console.log("collateralAmountReceived ", collateralAmountReceived.toString(), keepLevSame)
      }


      if(collateralAmountReceived.lt(BN_ZERO)) {
        collateralAmountReceived = BN_ZERO
        collateralAmountRecievedUsd = BN_ZERO
      } 
      else if(collateralAmountReceived.gt(maxWithdrawableAmount)){
        if(debugLogs){
          console.log("exceeding to redicing maxWithdrawableAmount ", maxWithdrawableAmount.toString(), collateralAmountReceived.toString())
        }
        collateralAmountReceived = maxWithdrawableAmount
        collateralAmountRecievedUsd = collateralMinMaxPrice.min.getAssetAmountUsd(maxWithdrawableAmount, collateralCustodyAccount.decimals)
      }

      // let collateralFeeUsd = collateralAmountRecievedUsd.mul(targetCustodyAccount.fees.volatility).div(new BN(RATE_POWER))
      // if(discountBps.gt(BN_ZERO)){
      //   const discount = collateralAmountRecievedUsd.mul(discountBps).div(new BN(BPS_POWER));
      //   collateralAmountRecievedUsd = exitFeeUsd.sub(discount);
      // }
      // console.log("newPos coll before", newPosition.collateralAmount.toString())
      // console.log("newPos coll Usd before", newPosition.collateralUsd.toString())
      // newPosition.collateralAmount = newPosition.collateralAmount.sub(collateralAmountReceived)
      // newPosition.collateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(newPosition.collateralAmount, collateralCustodyAccount.decimals)
      // console.log("newPos coll after", newPosition.collateralAmount.toString())
      // console.log("newPos coll usd after", newPosition.collateralUsd.toString())

      const entryPrice = OraclePrice.from({price: newPosition.entryPrice.price, exponent: new BN(newPosition.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO})

      const finalInterestUsd = this.getLockFeeAndUnsettledUsdForPosition( newPosition, collateralCustodyAccount, currentTimestamp)
      const finalLiquidationPrice = this.getLiquidationPriceSync(
        newPosition.collateralAmount,
        newPosition.sizeAmount,
        entryPrice,
        finalInterestUsd,
        marketCorrelation,
        side,
        targetPrice,
        targetEmaPrice,
        targetCustodyAccount,
        collateralPrice,
        collateralEmaPrice,
        collateralCustodyAccount,
        newPosition
      );

      // console.log("before finalPNl calacl")
      const finalPnl = this.getPnlSync(newPosition, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)
      const finalPnlUsd = finalPnl.profitUsd.sub(finalPnl.lossUsd)

      const newLev = this.getLeverageSync(newPosition.sizeUsd, newPosition.collateralAmount, collateralMinMaxPrice.min, collateralCustodyAccount.decimals, BN_ZERO) 
      
      return {
        newSizeUsd: newPosition.sizeUsd,
        feeUsd: feeUsd,
        feeUsdWithDiscount : feeUsdWithDiscount, // incorrect UNUSED 
        lockAndUnsettledFeeUsd : lockAndUnsettledFeeUsd,
        newLev: newLev,
        liquidationPrice: finalLiquidationPrice,
        collateralAmountRecieved: collateralAmountReceived, // remove collateral fee must be subtracted from this to show on UI, as of now we dont have any fee on remove collateral
        newCollateralAmount : newPosition.collateralAmount,
        newPnl: finalPnlUsd
      }
    } else {

      throw "only same leverage is supported for now";
      // let collateralAmountReceived = closeAmount
      // if(collateralAmountReceived.lte(BN_ZERO)){
      //   collateralAmountReceived = BN_ZERO
      // }

      // const entryPrice = OraclePrice.from({price: newPosition.entryPrice.price, exponent: new BN(newPosition.entryPrice.exponent), confidence: BN_ZERO, timestamp: BN_ZERO})
      
      // const finalInterestUsd = this.getLockFeeAndUnsettledUsdForPosition( newPosition, collateralCustodyAccount, currentTimestamp)
      // const finalLiquidationPrice = this.getLiquidationPriceSync(
      //   newPosition.collateralAmount,
      //   newPosition.sizeAmount,
      //   entryPrice,
      //   finalInterestUsd,
      //   marketCorrelation,
      //   side,
      //   targetPrice,
      //   targetEmaPrice,
      //   targetCustodyAccount,
      //   collateralPrice,
      //   collateralEmaPrice,
      //   collateralCustodyAccount,
      //   newPosition
      // );

      // const finalPnl = this.getPnlSync(newPosition, targetPrice, targetEmaPrice, targetCustodyAccount, collateralPrice, collateralEmaPrice, collateralCustodyAccount, currentTimestamp, targetCustodyAccount.pricing.delaySeconds, poolConfig)
      // const finalPnlUsd = finalPnl.profitUsd.sub(finalPnl.lossUsd) // includeFeeinPnl ?

      // const exitFee = this.getExitFeeSync(newPosition, targetCustodyAccount, collateralCustodyAccount, collateralPrice, collateralEmaPrice)
      // const lockFeeUsd = this.getLockFeeAndUnsettledUsdForPosition(newPosition, collateralCustodyAccount, currentTimestamp)

      // const finalPnlUsdWithFee = finalPnlUsd.sub(lockFeeUsd).sub(exitFee.exitFeeUsd)
      // const newLev = this.getLeverageSync(newPosition.sizeUsd, newPosition.collateralAmount, collateralMinMaxPrice.min, collateralCustodyAccount.decimals, finalPnlUsdWithFee) 
 

      // return {
      //   newSizeUsd: newPosition.sizeUsd,
      //   feeUsd: feeUsd,
      //   feeUsdWithDiscount : feeUsdWithDiscount,
      //   newLev: newLev,
      //   liquidationPrice: finalLiquidationPrice,
      //   collateralAmountRecieved: collateralAmountReceived,
      //   newCollateralAmount : newPosition.collateralAmount,
      //   newPnl: finalPnlUsd
      // }
    }
  }

  getMaxWithdrawableAmountSyncInternal = ( 
    positionAccount: PositionAccount,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
    currentTimestamp: BN,
    poolConfig: PoolConfig,
    closeAmount = BN_ZERO,
    errorBandwidthPercentageUi = 5, // 5% increase MinCollateral , add 5% decrease in Max_Init_Lev 
  ) : BN => {

    if(errorBandwidthPercentageUi > 100 || errorBandwidthPercentageUi < 0) {
      throw new Error("errorBandwidthPercentageUi cannot be >100 or <0")
    }
    // to keep a calculation slippage of 10% so this will be 100x => 95x
    const MAX_INIT_LEVERAGE = targetCustodyAccount.pricing.maxInitialLeverage.mul(new BN(100 - errorBandwidthPercentageUi)).div(new BN(100)) 

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
    const currentCollateralUsd = collateralMinPrice.getAssetAmountUsd(positionAccount.collateralAmount.add(closeAmount), collateralCustodyAccount.decimals);

    let availableInitMarginUsd : BN = BN_ZERO
    // should not include profit in currentCollateral for initial lev 
    if( profitLoss.lossUsd.lt( currentCollateralUsd ) ){
      availableInitMarginUsd = currentCollateralUsd.sub(profitLoss.lossUsd)
    } else {
      console.log("profitLoss.lossUsd > coll :: should have been liquidated")
      return BN_ZERO; //should have been liquidated
    }

    const maxRemovableCollateralUsd = availableInitMarginUsd.sub( positionAccount.sizeUsd.muln(BPS_POWER).div(MAX_INIT_LEVERAGE))
    if (maxRemovableCollateralUsd.isNeg()){
      // console.log("maxRemovableCollateralUsd < 0 :: cannot withdraw")
      return BN_ZERO
    }

    // now check for MIN Collateral  
    let maxWithdrawableAmount: BN


    let remainingCollateralUsd = availableInitMarginUsd.sub(maxRemovableCollateralUsd)

    if (remainingCollateralUsd < targetCustodyAccount.pricing.minCollateralUsd) {
      let diff = targetCustodyAccount.pricing.minCollateralUsd.sub(remainingCollateralUsd)
      let updatedMaxRemovableCollateralUsd = maxRemovableCollateralUsd.sub(diff)
      if (updatedMaxRemovableCollateralUsd.isNeg()){
        return BN_ZERO
      }
      else {
        maxWithdrawableAmount = collateralMaxPrice.getTokenAmount(updatedMaxRemovableCollateralUsd, collateralCustodyAccount.decimals)
      }
    } else {
      maxWithdrawableAmount = collateralMaxPrice.getTokenAmount(maxRemovableCollateralUsd, collateralCustodyAccount.decimals)
    }
    return maxWithdrawableAmount
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


    // let pnlUsd: BN;
    // if (newPnl.profitUsd.gt(BN_ZERO)) {
    //   pnlUsd = newPnl.profitUsd
    // } else if (newPnl.lossUsd.lt(collateralUsd)) {
    //   pnlUsd = newPnl.lossUsd.neg()
    // } else {
    //   pnlUsd = BN_ZERO
    // }

    // let finalUsd = collateralUsd.add(pnlUsd);
    // let finalAmount = BN_ZERO;
    // const feeUsd = newPnl.exitFeeUsd.add(newPnl.borrowFeeUsd)
    // if (!finalUsd.isNeg()) {
    //   finalAmount = collateralMinMaxPrice.min.getTokenAmount(finalUsd, collateralCustodyAccount.decimals)
    // }
    // return { finalAmount, feeUsd }
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
    // to keep a calculation slippage of 10% so this will be 100x => 95x
    const MAX_INIT_LEVERAGE = targetCustodyAccount.pricing.maxInitialLeverage.mul(new BN(100 - errorBandwidthPercentageUi)).div(new BN(100)) 

    // taking positionAccount.collateralUsd and not collateralWithPNL because we will not letting user withdraw collateral 
    // without settling position
    // so this will be 10$ => 10.5$
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
    // should not include profit in currentCollateral for initial lev 
    if( profitLoss.lossUsd.lt( currentCollateralUsd ) ){
      availableInitMarginUsd = currentCollateralUsd.sub(profitLoss.lossUsd)
    } else {
      console.log("profitLoss.lossUsd > coll :: should have been liquidated")
      return BN_ZERO; //should have been liquidated
    }

    const maxRemovableCollateralUsd = availableInitMarginUsd.sub( positionAccount.sizeUsd.muln(BPS_POWER).div(MAX_INIT_LEVERAGE))
    if (maxRemovableCollateralUsd.isNeg()){
      // console.log("maxRemovableCollateralUsd < 0 :: cannot withdraw")
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
    // const currentTimestamp = new BN(getUnixTs());
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

  getBorrowRateSync = (
    custodyAccount: CustodyAccount,
    currentUtilization: BN,
  ) => {
    let borrowRate = BN_ZERO;

    if(currentUtilization.lt(custodyAccount.borrowRate.optimalUtilization) 
    || (custodyAccount.borrowRate.optimalUtilization.gte(new BN(RATE_POWER)))) {
      borrowRate = (currentUtilization.mul(custodyAccount.borrowRate.slope1))
        .div(custodyAccount.borrowRate.optimalUtilization);
    } else if(currentUtilization.lt(custodyAccount.pricing.maxUtilization)) {
      borrowRate = custodyAccount.borrowRate.slope1
        .add(
          currentUtilization.sub(custodyAccount.borrowRate.optimalUtilization)
          .mul(custodyAccount.borrowRate.slope2)
          .div(custodyAccount.pricing.maxUtilization.sub(custodyAccount.borrowRate.optimalUtilization))
        )
    } else {
      borrowRate = custodyAccount.borrowRate.slope1.add(custodyAccount.borrowRate.slope2)
    } 
    
    return borrowRate
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
    // const lockedUsd = targetPrice.getAssetAmountUsd(sizeDeltaAmount, targetCustodyAccount.decimals)

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
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
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
    
    const exitFeeUsd = positionAccount.sizeUsd.mul(targetCustodyAccount.fees.closePosition).div(new BN(RATE_POWER));
    const unsettledLossUsd = exitFeeUsd.add(lockAndUnsettledFeeUsd);

    const liablitiesUsd = positionAccount.sizeUsd.mul(new BN(BPS_POWER)).div(targetCustodyAccount.pricing.maxLeverage).add(unsettledLossUsd)
    
    const targetMinMaxPriceOracle = this.getMinAndMaxOraclePriceSync(targetPrice, targetEmaPrice, targetCustodyAccount);
    const collateralMinMaxPriceOracle = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount);

    // let assetsUsd = BN_ZERO
    // if (marketCorrelation) {
    //   assetsUsd = positionAccount.collateralUsd
    // } else {
    //   assetsUsd = collateralMinMaxPriceOracle.min.getAssetAmountUsd(collateralAmount, collateralCustodyAccount.decimals)
    // }

    let liquidationPrice:OraclePrice
    if (marketCorrelation && isVariant(side, 'long')) {
      let newCollateralAmount:BN;
      if (targetCustodyAccount.mint == collateralCustodyAccount.mint) {
        newCollateralAmount = collateralAmount
      } else {
        let pairPrice = collateralMinMaxPriceOracle.min.price.mul(new BN(10).pow(collateralMinMaxPriceOracle.min.exponent)).div(targetMinMaxPriceOracle.max.price)
        const swapPrice = pairPrice.sub(pairPrice.mul(collateralCustodyAccount.pricing.swapSpread).div(new BN(BPS_POWER)))

        newCollateralAmount = checkedDecimalMul(collateralAmount, new BN(-1 * collateralCustodyAccount.decimals), swapPrice, collateralMinMaxPriceOracle.min.exponent, new BN(-1 * targetCustodyAccount.decimals))
      }

      // Liq Price = (size_usd + liabilities_usd) / (size_amount + collateral_amount) subject to constraints
      let lp:OraclePrice = OraclePrice.from({
        price: (positionAccount.sizeUsd.add(liablitiesUsd)).mul(new BN(10**(positionAccount.sizeDecimals+3)))
          .div(sizeAmount.add(newCollateralAmount)),
        exponent: new BN(-1*RATE_DECIMALS),
        confidence: BN_ZERO,
        timestamp: BN_ZERO
      })

      liquidationPrice = lp.scale_to_exponent(new BN(entryOraclePrice.exponent))
    } else {
      let assetsUsd = collateralMinMaxPriceOracle.min.getAssetAmountUsd(collateralAmount, collateralCustodyAccount.decimals)
      
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


    // let nominalSolvency: boolean
    // if( currentCollateralUsd.gt(liablitiesUsd)){ nominalSolvency = true } else { nominalSolvency = false }

    // let remainingMarginUsd: BN, requiredMarginUsd: BN
    // if (nominalSolvency) {
    //   remainingMarginUsd = currentCollateralUsd.sub(liablitiesUsd)
    //   requiredMarginUsd = BN_ZERO
    // } else {
    //   remainingMarginUsd = BN_ZERO
    //   requiredMarginUsd = liablitiesUsd.sub(currentCollateralUsd)
    // }

    // let liquidationPrice = BN_ZERO;
    // if(isVariant(side, 'long')) {
    //   if (marketCorrelation) {
    //     liquidationPrice = positionAccount.sizeUsd.add(liablitiesUsd).mul(new BN(10).pow(new BN(positionAccount.sizeDecimals))).div(sizeAmount.add(collateralAmount))
    //   } else if (nominalSolvency) {
    //       const priceDiscount = (remainingMarginUsd.mul(new BN(10).pow(new BN(positionAccount.sizeDecimals)))).div(sizeAmount)
    //       liquidationPrice = entryPriceUsd.sub(priceDiscount)
    //     } else {
    //     const pricePremium = (requiredMarginUsd.mul(new BN(10).pow(new BN(positionAccount.sizeDecimals)))).div(sizeAmount)
    //     liquidationPrice = entryPriceUsd.add(pricePremium)
    //   }
    // } else {
    //   if (nominalSolvency) {
    //     const pricePremium = (remainingMarginUsd.mul(new BN(10).pow(new BN(positionAccount.sizeDecimals)))).div(sizeAmount)
    //     liquidationPrice = entryPriceUsd.add(pricePremium)
    //   } else {
    //     const priceDiscount = (requiredMarginUsd.mul(new BN(10).pow(new BN(positionAccount.sizeDecimals)))).div(sizeAmount)
    //     liquidationPrice = entryPriceUsd.sub(priceDiscount)
    //   }
    // }


    // // const maxLossUsd = sizeUsd.add(currentCollateralUsd)
    // // const sizeDecimals = scaleToExponent(sizeAmount, new BN(-1*custodyAccount.decimals), new BN(-1*USD_DECIMALS)) // This leads to loss of pricision
    // // const collateralDecimals = scaleToExponent(collateralAmount, new BN(-1*custodyAccount.decimals), new BN(-1*USD_DECIMALS)); // This leads to loss of pricision

    // // let liquidationPrice = BN_ZERO;
    // // if (isVariant(side,'long') ) {
    // //   if (!custodyAccount.isVirtual){
    // //     liquidationPrice = sizeUsd.add(liablityThresholdUsd).mul(new BN(10**USD_DECIMALS)).div(sizeDecimals.add(collateralDecimals))
    // //   } else {
    // //     const sum = sizeUsd.add(liablityThresholdUsd)
    // //     liquidationPrice = sum.sub(currentCollateralUsd).mul(new BN(10**USD_DECIMALS)).div(sizeDecimals)
    // //   }
    // // } else {
    // //   liquidationPrice = maxLossUsd.sub(liablityThresholdUsd).mul(new BN(10**USD_DECIMALS)).div(sizeDecimals)
    // // }
    

    return liquidationPrice.price.isNeg() ? zeroOraclePrice : liquidationPrice;
  };

  getLiquidationPriceWithOrder =  (
    collateralAmount: BN,
    collateralUsd: BN,
    sizeAmount: BN,
    sizeUsd: BN,
    sizeDecimals: number,
    limitOraclePrice: OraclePrice,
    marketCorrelation : boolean,
    side : Side,
    targetPrice: OraclePrice,
    targetEmaPrice: OraclePrice,
    targetCustodyAccount: CustodyAccount,
    collateralPrice: OraclePrice,
    collateralEmaPrice: OraclePrice,
    collateralCustodyAccount: CustodyAccount,
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

    // if (positionAccount.entryPrice.exponent && !entryOraclePrice.exponent.eq(new BN(positionAccount.entryPrice.exponent))){
    //    throw new Error(`Exponent mismatch : ${positionAccount.entryPrice.exponent} & ${entryOraclePrice.exponent.toString()} ${entryOraclePrice?.toUiPrice(8)}`)
    // }
    
    const exitFeeUsd = sizeUsd.mul(targetCustodyAccount.fees.closePosition).div(new BN(RATE_POWER));
    const unsettledLossUsd = exitFeeUsd

    const liablitiesUsd = sizeUsd.mul(new BN(BPS_POWER)).div(targetCustodyAccount.pricing.maxLeverage).add(unsettledLossUsd)

    const targetMinMaxPriceOracle = this.getMinAndMaxOraclePriceSync(targetPrice, targetEmaPrice, targetCustodyAccount);
    const collateralMinMaxPriceOracle = this.getMinAndMaxOraclePriceSync(collateralPrice, collateralEmaPrice, collateralCustodyAccount);

    let liquidationPrice:OraclePrice
    if (marketCorrelation && isVariant(side, 'long')) {
      let newCollateralAmount:BN;
      if (targetCustodyAccount.mint == collateralCustodyAccount.mint) {
        newCollateralAmount = collateralAmount
      } else {
        let pairPrice = collateralMinMaxPriceOracle.min.price.mul(new BN(10).pow(collateralMinMaxPriceOracle.min.exponent)).div(targetMinMaxPriceOracle.max.price)
        const swapPrice = pairPrice.sub(pairPrice.mul(collateralCustodyAccount.pricing.swapSpread).div(new BN(BPS_POWER)))

        newCollateralAmount = checkedDecimalMul(collateralAmount, new BN(-1 * collateralCustodyAccount.decimals), swapPrice, collateralMinMaxPriceOracle.min.exponent, new BN(-1 * targetCustodyAccount.decimals))
      }

      // Liq Price = (size_usd + liabilities_usd) / (size_amount + collateral_amount) subject to constraints
      let lp:OraclePrice = OraclePrice.from({
        price: (sizeUsd.add(liablitiesUsd)).mul(new BN(10**(sizeDecimals+3)))
          .div(sizeAmount.add(newCollateralAmount)),
        exponent: new BN(-1*RATE_DECIMALS),
        confidence: BN_ZERO,
        timestamp: BN_ZERO
      })

      liquidationPrice = lp.scale_to_exponent(new BN(limitOraclePrice.exponent))
    } else {
      let assetsUsd = collateralUsd // collateralUsd is calc with the current collateral price
      if (assetsUsd.gte(liablitiesUsd)) {
        let priceDiffLossOracle: OraclePrice = OraclePrice.from({
          price: (assetsUsd.sub(liablitiesUsd)).mul(new BN(10**(sizeDecimals+3)))
            .div(sizeAmount),
          exponent: new BN(-1*RATE_DECIMALS),
          confidence: BN_ZERO,
          timestamp: BN_ZERO
        }).scale_to_exponent(new BN(limitOraclePrice.exponent))

        if (isVariant(side, 'long')) {
          liquidationPrice = OraclePrice.from({
            price: limitOraclePrice.price.sub(priceDiffLossOracle.price),
            exponent: new BN(limitOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        } else {
          liquidationPrice = OraclePrice.from({
            price: limitOraclePrice.price.add(priceDiffLossOracle.price),
            exponent: new BN(limitOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        }
      } else {
        let priceDiffProfitOracle: OraclePrice = OraclePrice.from({
          price: (liablitiesUsd.sub(assetsUsd)).mul(new BN(10**(sizeDecimals+3)))
            .div(sizeAmount),
          exponent: new BN(-1*RATE_DECIMALS),
          confidence: BN_ZERO,
          timestamp: BN_ZERO
        }).scale_to_exponent(new BN(limitOraclePrice.exponent))

        if (isVariant(side, 'long')) {
          liquidationPrice = OraclePrice.from({
            price: limitOraclePrice.price.add(priceDiffProfitOracle.price),
            exponent: new BN(limitOraclePrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO
          })
        } else {
          liquidationPrice = OraclePrice.from({
            price: limitOraclePrice.price.sub(priceDiffProfitOracle.price),
            exponent: new BN(limitOraclePrice.exponent),
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
    positionAccount: PositionAccount | null,   //,
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
    let pnlPercentage = pnlUsd.mul(new BN(BPS_POWER)).div(positionAccount.collateralUsd)
    
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

  getTriggerPriceFromPnlSync = (
    pnlUsd: BN,
    exitFeeUsd: BN,
    positionSize: BN, // in asset units
    sizeDecimals: number,
    entryPrice: OraclePrice,
    side: Side,
  ): OraclePrice  => {
    const usdDecimals = 6;

    // Scale sizeAmount to USD decimals
    let scaledSizeAmount;
    if (sizeDecimals > usdDecimals) {
      scaledSizeAmount = positionSize.div(new BN(10).pow(new BN(sizeDecimals - usdDecimals)));
    } else {
      scaledSizeAmount = positionSize.mul(new BN(10).pow(new BN(usdDecimals - sizeDecimals)));
    }

    if (scaledSizeAmount.isZero()) {
      throw new Error("Position size cannot be zero");
    }

    let exitPrice: BN;
    if (isVariant(side, 'long')) {
      // Long position
      exitPrice = entryPrice.price.add((pnlUsd.add(exitFeeUsd)).mul(new BN(10 ** entryPrice.exponent.abs().toNumber())).div(scaledSizeAmount));
    } else {
      // Short position
      exitPrice = entryPrice.price.sub((pnlUsd.add(exitFeeUsd)).mul(new BN(10 ** entryPrice.exponent.abs().toNumber())).div(scaledSizeAmount));
    }

    return new OraclePrice({
        price: exitPrice,
        exponent: entryPrice.exponent,
        confidence: entryPrice.confidence, 
        timestamp: BN_ZERO, 
      })
  }

  getTriggerPriceFromRoiSync = (
    roi: BN, // in percentage
    collateralUsd: BN,
    exitFeeUsd: BN,
    positionSize: BN, // in asset units
    sizeDecimals: number,
    entryPrice: OraclePrice,
    side: Side,
  ): OraclePrice  => {
    const usdDecimals = 6;

    // Scale sizeAmount to USD decimals
    let scaledSizeAmount;
    if (sizeDecimals > usdDecimals) {
      scaledSizeAmount = positionSize.div(new BN(10).pow(new BN(sizeDecimals - usdDecimals)));
    } else {
      scaledSizeAmount = positionSize.mul(new BN(10).pow(new BN(usdDecimals - sizeDecimals)));
    }

    if (scaledSizeAmount.isZero()) {
      throw new Error("Position size cannot be zero");
    }

    let pnlUsd = roi.mul(collateralUsd).div(new BN(100));

    let exitPrice: BN;
    if (isVariant(side, 'long')) {
      // Long position
      exitPrice = entryPrice.price.add((pnlUsd.add(exitFeeUsd)).mul(new BN(10 ** entryPrice.exponent.abs().toNumber())).div(scaledSizeAmount));
    } else {
      // Short position
      exitPrice = entryPrice.price.sub((pnlUsd.add(exitFeeUsd)).mul(new BN(10 ** entryPrice.exponent.abs().toNumber())).div(scaledSizeAmount));
    }

    return new OraclePrice({
        price: exitPrice,
        exponent: entryPrice.exponent,
        confidence: entryPrice.confidence, 
        timestamp: BN_ZERO, 
      })
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

  // const exitPriceAndFee: ExitPriceAndFee = this.getExitPriceAndFeeSync(
  //   positionAccount,
  //   marketAccount,
  //   positionAccount.collateralAmount,
  //   positionAccount.sizeAmount,
  //   side,
  //   targetTokenPrice,
  //   targetTokenEmaPrice,
  //   targetCustodyAccount,
  //   collateralPrice,
  //   collateralEmaPrice,
  //   collateralCustodyAccount,
  //   currentTimestamp
  // );

  // let exitFee = this.getExitFeeSync(positionAccount, targetCustodyAccount, collateralCustodyAccount, collateralPrice, collateralEmaPrice)
  // let exitOraclePrice = this.getExitPriceSync(side, targetTokenPrice, targetTokenEmaPrice,targetCustodyAccount);
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
  
  // ** SYNC  
  // todo: optimise this logic with a boolean for output custody amount
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

    // if(
    //   !inputTokenPrice.exponent.eq(outputTokenPrice.exponent) || 
    //   !inputTokenEmaPrice.exponent.eq(outputTokenEmaPrice.exponent)
    //   ) {
    //     throw new Error("exponent mismatch")
    // }
    //  not needed since we scale expo now


     // rather than throwing , we will scale to the one that has higher exponent and then compare 
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


    //todo: calc poolAum here instead of taking it as parameter (getAssetsUnderManagementUsdSdk())

    let pairPrice;
    // check if stable coin 
    
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
        // in this senario the MAX price = 1 so to get pair price we div it by 1 
        // pairPrice = inputMinMaxPrice.min.price.mul( new BN(10).pow(inputMinMaxPrice.min.exponent) ).div( new BN(10).pow(inputMinMaxPrice.min.exponent) )
        pairPrice = outputMinMaxPrice.min.price;
      } else {
        pairPrice = outputMinMaxPrice.min.price.mul(new BN(10).pow(outputMinMaxPrice.min.exponent)).div(inputMinMaxPrice.max.price)
      }
      const swapPrice = pairPrice.sub(pairPrice.mul(outputTokenCustodyAccount.pricing.swapSpread).div(new BN(BPS_POWER)))
    //  console.log("NEWW swapPrice", swapPrice.toString())

      inputTokenAmount = checkedDecimalMul(amountOut, new BN(-1 * outputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * inputTokenCustodyAccount.decimals))
      // console.log(" OUT => IN inputTokenAmount :", inputTokenAmount.toString())

      //todo: check for stable swap
      feeIn = this.getFeeHelper(FeesAction.SwapIn, inputTokenAmount, BN_ZERO, inputTokenCustodyAccount, inputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount
      feeOut = this.getFeeHelper(FeesAction.SwapOut, BN_ZERO, amountOut, outputTokenCustodyAccount, outputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount

      let swapAmount = checkedDecimalMul(amountOut.add(feeOut), new BN(-1 * outputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * inputTokenCustodyAccount.decimals)).add(feeIn)
      // console.log(" OUT => IN swapAmount :", swapAmount.toString())


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
        // in this senario the MAX price = 1 so to get pair price we div it by 1 
        // pairPrice = inputMinMaxPrice.min.price.mul( new BN(10).pow(inputMinMaxPrice.min.exponent) ).div( new BN(10).pow(inputMinMaxPrice.min.exponent) )
        pairPrice = inputMinMaxPrice.min.price;
      } else {
        pairPrice = inputMinMaxPrice.min.price.mul(new BN(10).pow(inputMinMaxPrice.min.exponent)).div(outputMinMaxPrice.max.price)
      }
      const swapPrice = pairPrice.sub(pairPrice.mul(inputTokenCustodyAccount.pricing.swapSpread).div(new BN(BPS_POWER)))
      // console.log("NEWW swapPrice", swapPrice.toString())

      outputTokenAmount = checkedDecimalMul(amountIn, new BN(-1 * inputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * outputTokenCustodyAccount.decimals))

      // console.log("  IN => OUT outputTokenAmount :", outputTokenAmount.toString())

      //todo: check for stable swap
      feeIn = this.getFeeHelper(FeesAction.SwapIn, amountIn, BN_ZERO, inputTokenCustodyAccount, inputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount
      feeOut = this.getFeeHelper(FeesAction.SwapOut, BN_ZERO, outputTokenAmount, outputTokenCustodyAccount, outputMinMaxPrice.max, poolAumUsdMax, poolAccount, poolConfig).feeAmount

      let swapAmount = checkedDecimalMul(amountIn.sub(feeIn), new BN(-1 * inputTokenCustodyAccount.decimals), swapPrice, inputMinMaxPrice.min.exponent, new BN(-1 * outputTokenCustodyAccount.decimals)).sub(feeOut)
      // console.log("  IN => OUT swapAmount :", swapAmount.toString())
      
      return {
        minAmountIn: BN_ZERO,
        minAmountOut: swapAmount, // this is the amount for output custody, And includes all fee(feeIn, FeeOut)
        feeIn: feeIn,
        feeOut: feeOut,
      }
    }

  }

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
        let targetCustodyId = poolAccount.getCustodyId(markets[index].targetCustody);
        let collateralCustodyId = poolAccount.getCustodyId(markets[index].collateralCustody);

        const position = markets[index].getCollectivePosition(); //todo: Verify
        let collectivePnl = this.getPnlSync(
          position, 
          tokenPrices[targetCustodyId],
          tokenEmaPrices[targetCustodyId],
          custodies[targetCustodyId],
          tokenPrices[collateralCustodyId],
          tokenEmaPrices[collateralCustodyId],
          custodies[collateralCustodyId],
          currentTime,
          custodies[targetCustodyId].pricing.delaySeconds,
          poolConfig
        );

        let collateralMinMaxPrice = this.getMinAndMaxOraclePriceSync(tokenPrices[collateralCustodyId], tokenEmaPrices[collateralCustodyId], custodies[collateralCustodyId])
        let collectiveCollateralUsd = collateralMinMaxPrice.min.getAssetAmountUsd(position.collateralAmount, position.collateralDecimals)
        let collectiveLossUsd = BN.min(collectivePnl.lossUsd, collectiveCollateralUsd)

        poolEquityUsd = (poolEquityUsd.add(collectiveLossUsd)).sub(collectivePnl.profitUsd)
      }
      return {poolAmountUsd, poolEquityUsd}
    } else {
      return {poolAmountUsd, poolEquityUsd: BN_ZERO}
    }

  };

  getNftFinalDiscount  = (
    perpetualsAccount : PerpetualsAccount,
    nftTradingAccount: Trading,
    currentTime: BN,
  ) : { discountBn : BN } => {


    if (currentTime.sub(nftTradingAccount.timestamp).lt(DAY_SECONDS) && nftTradingAccount.counter.gt(new BN(perpetualsAccount.tradeLimit))) {
      return { discountBn: BN_ZERO }
    } else {
      return { discountBn: perpetualsAccount.tradingDiscount[nftTradingAccount.level - 1]}
    }

  }

  getFeeDiscount = (
    perpetualsAccount: PerpetualsAccount,
    tokenStakeAccount: TokenStake,
    currentTime: BN,
  ): { discountBn: BN } => {
    if (tokenStakeAccount.level === 0) {
      return { discountBn: BN_ZERO }
    } else if (currentTime.sub(tokenStakeAccount.tradeTimestamp).lt(DAY_SECONDS) && (new BN(tokenStakeAccount.tradeCounter)).gt(new BN(perpetualsAccount.tradeLimit))) {
      return { discountBn: BN_ZERO }
    } else {
      return { discountBn: perpetualsAccount.tradingDiscount[tokenStakeAccount.level - 1] }
    }
  }

  //  price at time t1 
   getIndexPriceAtParticularTime = ( 
     poolConfig: PoolConfig,
     targetPricesAtT1Ui: Number[], // price at t1 
     targetPricesAtT2Ui: Number[], // price at t2= t1-1
     tokenRatiosAtT2BN : BN[],
     // poolAccount: PoolAccount, // current
     // custodyAccountsAtT1: CustodyAccount[], // custody at t1
     // custodyAccountsAtT2: CustodyAccount[],  // custody at t2 = t1 -1
    ) => {

      const custodyTokens = poolConfig.custodies
      let finalIndexPriceAtT1 = new BigNumber(0);


      if(!(targetPricesAtT1Ui.length === custodyTokens.length && targetPricesAtT2Ui.length === custodyTokens.length)){
        throw new Error(`targetPrices length mismatch custodyTokens.length : ${custodyTokens.length } ,  targetPricesAtT1.length : ${targetPricesAtT1Ui.length} , targetPricesAtT2.length : ${targetPricesAtT2Ui.length}`)
      }
      //  NOTE : 
      // - calculations below are in UI price not contract decimals 
      //  - targetPricesAtT1 / T2 should be inorder in array based on poolConfig tokens
      for (let index = 0; index < custodyTokens.length; index++) {
        const tokenCustody = custodyTokens[index];

        const tokenPriceAtT1 =  new BigNumber(targetPricesAtT1Ui[index].toString()) ;
        const tokenPriceAtT2 =  new BigNumber(targetPricesAtT2Ui[index].toString()) ;
      
        // const tokenRatio = this.pool.ratios[i]
        // const custodyAccount = custodyAccountsAtT2[index];
        // const custodyConfig = poolConfig.custodies[index];

        // const ownedBnUi = new BigNumber(custodyAccount.assets.owned.toString()).dividedBy(10**custodyConfig.decimals); 
        // const ownedUsdBnUi = ownedBnUi.multipliedBy(tokenPriceAtT2); 
        // const lockedBnUi = new BigNumber(custodyAccount.assets.locked.toString()).dividedBy(10**custodyConfig.decimals); 
        // const utilizationBnUi =   lockedBnUi.dividedBy(ownedBnUi).multipliedBy(100);
        // totalPoolValueUsdUi ??
        // const currentRatioBnUi =  ownedBnUi.multipliedBy(tokenPriceAtT2).dividedBy(totalPoolValueUsdUi).multipliedBy(100);
  
        const ratioUi =  nativeToUiDecimals(tokenRatiosAtT2BN[index], 4 , 4)
        const ratioOfTokenAtT2 = new BigNumber(ratioUi);

        finalIndexPriceAtT1 =  (tokenPriceAtT1.minus(tokenPriceAtT2).dividedBy(tokenPriceAtT2)).multipliedBy(ratioOfTokenAtT2)
        
      }
      return finalIndexPriceAtT1.toString();
  }

  getUserClaimableRevenueAmount = async (
    POOL_CONFIG: PoolConfig,
    userPublicKey: PublicKey,
    // tokenStakeFafAccount: TokenStakeAccount,
    // fafTokenVaultAccount:  TokenVaultAccount,
    enableDebuglogs: boolean = false
  ): Promise<BN> => {

        const fafTokenVaultPk = POOL_CONFIG.tokenVault
        const fafTokenVaultAccountInfo = await this.provider.connection.getAccountInfo(fafTokenVaultPk)
        let fafTokenVaultAccount: TokenVaultAccount | null = null
        if (fafTokenVaultAccountInfo) {
            const fafTokenVault = this.program.coder.accounts.decode<TokenVaultAccount>(
                'tokenVault',
                fafTokenVaultAccountInfo.data
            )
            // console.log(
            //     'fafTokenVaultAccount:',
            //     fafTokenVault?.withdrawInstantFeeEarned.toString(),
            //     nativeToUiDecimals(fafTokenVault?.withdrawInstantFeeEarned, 6, 2, true)
            // )
            fafTokenVaultAccount = TokenVaultAccount.from(fafTokenVaultPk , fafTokenVault )
        } else {
            console.log('No account info found for fafTokenVaultPk:', fafTokenVaultPk.toBase58())
            throw new Error('No account info found for fafTokenVaultPk')
        }

        if (!fafTokenVaultAccount) {
                return BN_ZERO
          }

       const tokenStakeAccount = PublicKey.findProgramAddressSync(
                    [Buffer.from('token_stake'), userPublicKey.toBuffer()],
                    POOL_CONFIG.programId
                )[0]
       // console.log(tokenStakeAccount.toBase58(), 'checking token stake account mint')

      const accountInfo = await this.provider.connection.getAccountInfo(tokenStakeAccount)
      if (accountInfo) {
            const fafStakeData = this.program.coder.accounts.decode<TokenStake>(
                'tokenStake',
                accountInfo.data
            )
            const tokenStakeFafAccount = TokenStakeAccount.from(fafStakeData)

            const activeStakeAmount = tokenStakeFafAccount?.activeStakeAmount ?? BN_ZERO
            const revenuePerFafStaked = fafTokenVaultAccount?.revenuePerFafStaked ?? BN_ZERO

            const revenueWatermark = activeStakeAmount
                .mul(revenuePerFafStaked)
                .div(new BN(10).pow(new BN(FAF_DECIMALS)))

            const revenueSnapshot = tokenStakeFafAccount?.revenueSnapshot ?? BN_ZERO
            const unclaimedRevenue = tokenStakeFafAccount?.unclaimedRevenueAmount ?? BN_ZERO

            let revenueAmount = revenueWatermark.sub(revenueSnapshot).add(unclaimedRevenue)

            if (revenueAmount.lt(BN_ZERO)) {
                revenueAmount = BN_ZERO
            }
            return revenueAmount

      } else {
        return BN_ZERO
      }

  }


  // ==================
  // View function
  // ==================
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
    // console.log('>> getLpTokenPrice backUpOracleInstruction:', backUpOracleInstruction)

    transaction.instructions.unshift(...backUpOracleInstruction)

    const result = await this.viewHelper.simulateTransaction(transaction)
    // console.log('result :>> ', result)
    const index = IDL.instructions.findIndex((f) => f.name === 'getLpTokenPrice')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getLpTokenPrice')
    // console.log("res:",res)
    return res.toString()
  }

  getAssetsUnderManagement = async (poolKey: PublicKey, POOL_CONFIG: PoolConfig): Promise<string> => {
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

    return await this.program.methods
      .getAssetsUnderManagement({})
      .accounts({
        perpetuals: POOL_CONFIG.perpetuals,
        pool: poolKey,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,

      })
      .remainingAccounts([...custodyMetas, ...marketMetas])
      .view()
      .catch((err) => {
        console.error(err);
        throw err;
      });



  }

  getAddLiquidityAmountAndFeeView = async (
    amount: BN,
    poolKey: PublicKey,
    depositCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig,
    userPublicKey: PublicKey | undefined = undefined,
    enableBackupOracle: boolean = false
  ): Promise<{
    amount: BN
    fee: BN
  }> => {
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

    if (enableBackupOracle) {
      const backUpOracleInstruction = await createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)
      transaction.instructions.unshift(...backUpOracleInstruction)
    }

    const result = await this.viewHelper.simulateTransaction(transaction, userPublicKey)
    const index = IDL.instructions.findIndex((f) => f.name === 'getAddLiquidityAmountAndFee')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getAddLiquidityAmountAndFee')

    return {
      amount: res.amount,
      fee: res.fee,
    }
  }

  getRemoveLiquidityAmountAndFeeView = async (
    amount: BN,
    poolKey: PublicKey,
    removeTokenCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig,
    userPublicKey: PublicKey | undefined = undefined,
    enableBackupOracle: boolean = false
  ): Promise<{
    amount: BN
    fee: BN
  }> => {

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

    if (enableBackupOracle) {
      const backUpOracleInstruction = await createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)
      transaction.instructions.unshift(...backUpOracleInstruction)
    }

    const result = await this.viewHelper.simulateTransaction(transaction, userPublicKey)
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

    // console.log('result :>> ', result)
    const index = IDL.instructions.findIndex((f) => f.name === 'getCompoundingTokenPrice')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getCompoundingTokenPrice')

    return res.toString()
  }

  getAddCompoundingLiquidityAmountAndFeeView = async (
    amount: BN,
    poolKey: PublicKey,
    depositCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig,
    userPublicKey: PublicKey | undefined = undefined,
    enableBackupOracle: boolean = false
  ): Promise<{
    amount: BN
    fee: BN
  }> => {
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

    if (enableBackupOracle) {
      const backUpOracleInstruction = await createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)
      transaction.instructions.unshift(...backUpOracleInstruction)
    }

    const result = await this.viewHelper.simulateTransaction(transaction, userPublicKey)
    const index = IDL.instructions.findIndex((f) => f.name === 'getAddCompoundingLiquidityAmountAndFee')
    const res: any = this.viewHelper.decodeLogs(result, index, 'getAddCompoundingLiquidityAmountAndFee')

    return {
      amount: res.amount,
      fee: res.fee,
    }
  }

  getRemoveCompoundingLiquidityAmountAndFeeView = async (
    amount: BN,
    poolKey: PublicKey,
    removeTokenCustodyKey: PublicKey,
    POOL_CONFIG: PoolConfig,
    userPublicKey: PublicKey | undefined = undefined,
    enableBackupOracle: boolean = false
  ): Promise<{
    amount: BN
    fee: BN
  }> => {

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

    if (enableBackupOracle) {
      const backUpOracleInstruction = await createBackupOracleInstruction(POOL_CONFIG.poolAddress.toBase58(), true)
      transaction.instructions.unshift(...backUpOracleInstruction)
    }

    const result = await this.viewHelper.simulateTransaction(transaction, userPublicKey)
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

   getLiquidationPriceView = async (
    positionAccountKey: PublicKey,
    poolConfig: PoolConfig,
    ) => {
    try {

      const positionAccount = await this.getPosition(positionAccountKey)

        const marketConfig = poolConfig.markets.find((m) => m.marketAccount.equals(positionAccount.market))
        if (!marketConfig) {
        throw new Error(`Market config not found for position account: ${positionAccountKey.toBase58()}`);
        }

         const targetCustodyConfig = poolConfig.custodies.find((f) => f.custodyAccount.equals(marketConfig.targetCustody))!
        const collateralCustodyConfig = poolConfig.custodies.find(f => f.custodyAccount.equals(marketConfig.collateralCustody))!
   

      return await this.program.methods
        .getLiquidationPrice({})
        .accounts({
          perpetuals: this.perpetuals.publicKey,
          pool: poolConfig.poolAddress,
          position: positionAccountKey,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: collateralCustodyConfig.intOracleAccount,
          market: marketConfig.marketAccount,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .view()
        .catch((err) => {
          console.error(err);
          throw err;
        });
        
    } catch (err) {
      console.error("Error in getLiquidationPriceView:", err);
      throw err;
    }
  };


  getLiquidationStateView = async (
    positionAccount: PublicKey,
    poolName: string,
    tokenMint: PublicKey,
    collateralMint: PublicKey,
    poolConfig: PoolConfig,
  ) => {
    const targetCustodyConfig = poolConfig.custodies.find(f => f.mintKey.equals(tokenMint))
    const collateralCustodyConfig = poolConfig.custodies.find(f => f.mintKey.equals(collateralMint))
   
    return await this.program.methods
      .getLiquidationState({})
      .accounts({
        perpetuals: this.perpetuals.publicKey,
        pool: poolConfig.poolAddress,
        position: positionAccount,
        targetCustody: this.getCustodyKey(poolName, tokenMint),
        targetOracleAccount: targetCustodyConfig.custodyAccount,
        collateralCustody: this.getCustodyKey(poolName, collateralMint),
        collateralOracleAccount: collateralCustodyConfig.custodyAccount,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .view()
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  getCompoundingTokenDataView = async (
    poolConfig: PoolConfig,
  ) => {
    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    let markets = []
    for (const custody of poolConfig.custodies) {
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
    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      });
    }

    return await this.program.methods
      .getCompoundingTokenData({})
      .accounts({
        perpetuals: this.perpetuals.publicKey,
        pool: poolConfig.poolAddress,
        lpTokenMint: poolConfig.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
      .view()
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };

  getLpTokenPriceView = async (
    poolConfig: PoolConfig,
  ) => {
    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    let markets = []
    for (const custody of poolConfig.custodies) {
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
    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      });
    }

    return await this.program.methods
      .getLpTokenPrice({})
      .accounts({
        perpetuals: this.perpetuals.publicKey,
        pool: poolConfig.poolAddress,
        lpTokenMint: poolConfig.stakedLpTokenMint,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
      .view()
      .catch((err) => {
        console.error(err);
        throw err;
      });
  };


  ///////
  /// UI/SDK INSTRUCTIONS HELPERS
  

  openPosition = async (
    targetSymbol: string,
    collateralSymbol: string,
    priceWithSlippage: ContractOraclePrice,
    collateralWithfee: BN,
    size: BN,
    side: Side,
    poolConfig: PoolConfig,
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
    skipBalanceChecks = false, // calling this with true will skip balance checks, which is suitable for UI to be quick
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const collateralToken = poolConfig.getTokenFromSymbol(collateralSymbol);
    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    
    let userCollateralTokenAccount =  getAssociatedTokenAddressSync(
      poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
      publicKey,
      true,
      collateralToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
    );
    
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    // https://github.com/blockworks-foundation/mango-v4/blob/1ba6513b5ea2b0e557808e712fcf0a811968b45b/ts/client/src/client.ts#L1252 
    // Create WSOL Token account and not ATA and close it in end 
    if (  collateralSymbol == 'SOL'  ) {
      console.log("collateralSymbol === SOL", collateralSymbol);

      // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      // console.log("accCreationLamports:", accCreationLamports)
      const lamports = collateralWithfee.add(new BN(this.minimumBalanceForRentExemptAccountLamports));  //add(new BN(accCreationLamports)); // for account creation


      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
              throw "Insufficient SOL Funds"
        }
      }
      
      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
         (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];

    }  else {
      // for other tokens check if ATA and balance 
      
      if (!skipBalanceChecks) {
        if (!(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }

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

    // ephemeralSignerPubkey = undefined // for Squads wallet
    // !ephemeralSignerPubkey && 
    // (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey)
    
    let instruction = await this.program.methods
      .openPosition(params)
      .accounts({
        owner: publicKey,
        feePayer: publicKey,
        fundingAccount: collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userCollateralTokenAccount,
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
        fundingTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
        eventAuthority: this.eventAuthority.publicKey,
        program: this.programId,
        transferAuthority: this.authority.publicKey,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        fundingMint: collateralCustodyConfig.mintKey
      })
      .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
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
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false, // to get back WSOL=>SOL
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {

    console.log("close position :::", marketSymbol, poolConfig.getTokenFromSymbol(marketSymbol).mintKey.toBase58());

    let publicKey = this.provider.wallet.publicKey;

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    try {

      if (collateralSymbol == 'SOL') {


        const lamports = (this.minimumBalanceForRentExemptAccountLamports) //(await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

        if(!ephemeralSignerPubkey){
          wrappedSolAccount = new Keypair();
          additionalSigners.push(wrappedSolAccount);
        }

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            lamports: lamports, //will this break for large amounts ??
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            NATIVE_MINT,
            publicKey,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            publicKey,
            publicKey,
          ),
        ];
      } else {
        // OTHER TOKENS including WSOL,USDC,..
        userReceivingTokenAccount = getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
          publicKey,
          true,
          poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );


      // cannot skip this await TODO- check
        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userReceivingTokenAccount,
              publicKey,
              poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
              poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
            )
          );
        }
      } // else
      

      const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
      const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(marketSymbol).mintKey))!;
      const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

      const positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount);

      // console.log("positionAccount:", positionAccount.toBase58())

      let instruction = await this.program.methods
        .closePosition({
          priceWithSlippage: priceWithSlippage,
          privilege: privilege
        })
        .accounts({
          feePayer: publicKey,
          owner: publicKey,
          receivingAccount: collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey)  : userReceivingTokenAccount,
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

          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          collateralMint: collateralCustodyConfig.mintKey,
          collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID 
        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();
      instructions.push(instruction)

      if (collateralSymbol == 'WSOL' && closeUsersWSOLATA) {
        const closeWsolATAIns = createCloseAccountInstruction(userReceivingTokenAccount, publicKey, publicKey);
        postInstructions.push(closeWsolATAIns);
      }
    } catch (error) {
      console.error("perpclient closePosition error:", error);
      throw error;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  swapAndOpen = async (
    targetTokenSymbol: string,
    collateralTokenSymbol: string,
    userInputTokenSymbol: string,
    amountIn: BN,
    minCollateralAmountOut: BN,
    priceWithSlippage: ContractOraclePrice,
    sizeAmount: BN,
    side: Side,
    poolConfig: PoolConfig,
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
    skipBalanceChecks = false, // calling this with true will skip balance checks, which is suitable for UI to be quick
    ephemeralSignerPubkey = undefined
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = this.provider.wallet.publicKey;

    const userInputCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(userInputTokenSymbol).mintKey))!;
    if (!userInputCustodyConfig) {
      throw "userInputCustodyConfig not found";
    }
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralTokenSymbol).mintKey))!;
    if (!collateralCustodyConfig) {
      throw "collateralCustodyConfig not found";
    }
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetTokenSymbol).mintKey))!;
    if (!targetCustodyConfig) {
      throw "targetCustodyConfig not found";
    }
    if(userInputCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)){
      throw "Don't use Swap, just call Open position"
    }

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    const targetToken = poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol);
    let userInputTokenAccount : PublicKey;

    const userInputToken = poolConfig.getTokenFromSymbol(userInputTokenSymbol);

    // https://github.com/blockworks-foundation/mango-v4/blob/1ba6513b5ea2b0e557808e712fcf0a811968b45b/ts/client/src/client.ts#L1252 
    // Create WSOL Token account and not ATA and close it in end 
    if (userInputTokenSymbol == 'SOL') {
      console.log("inputSymbol === SOL", userInputTokenSymbol);

      // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      // console.log("accCreationLamports:", accCreationLamports)
      //  fixed value now
      const lamports = amountIn.add(new BN(this.minimumBalanceForRentExemptAccountLamports));  //add(new BN(accCreationLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
              throw "Insufficient SOL Funds"
        }
      }

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


      if(!poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).mintKey.equals(NATIVE_MINT) ){
        let userOutputTokenAccount =  getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).mintKey,
          publicKey,
          true,
          poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );
    
        // cannot skip this await TODO- check
        if ( !(await checkIfAccountExists(userOutputTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userOutputTokenAccount,
              publicKey,
              poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).mintKey
            )
          );
        }
      }

    }  else {
      // for other tokens check if ATA and balance 
      userInputTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.getTokenFromSymbol(userInputTokenSymbol).mintKey,
        publicKey,
        true,
        poolConfig.getTokenFromSymbol(userInputTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );
     
      if (!skipBalanceChecks) {
          if (!(await checkIfAccountExists(userInputTokenAccount, this.provider.connection))) {
            throw "Insufficient Funds , Token Account doesn't exist"
          }

          const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userInputTokenAccount)).value.amount);
          if (tokenAccountBalance.lt(amountIn)) {
            throw `Insufficient Funds need more ${amountIn.sub(tokenAccountBalance)} tokens`
          }
      }

      let userOutputTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).mintKey,
        publicKey,
        true,
        poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID 
      );
  
      // cannot skip this await TODO- check
      if ( !(await checkIfAccountExists(userOutputTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userOutputTokenAccount,
            publicKey,
            poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).mintKey,
            poolConfig.getTokenFromSymbol(targetCustodyConfig.symbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID  
          )
        );
      }

    }//else


   
   
    // let custodyAccountMetas = [];
    // let custodyOracleAccountMetas = [];
    // for (const custody of poolConfig.custodies) {
    //   custodyAccountMetas.push({
    //     pubkey: custody.custodyAccount,
    //     isSigner: false,
    //     isWritable: false,
    //   });

    //   custodyOracleAccountMetas.push({
    //     pubkey: this.useExtOracleAccount ? custody.extOracleAccount: custody.intOracleAccount,
    //     isSigner: false,
    //     isWritable: false,
    //   });
    // }


    let rebateMintAccount = {
      pubkey: collateralCustodyConfig.mintKey,
      isSigner: false,
      isWritable: false
    }

    try {
      
      let inx = await this.program.methods
        .swapAndOpen({
            amountIn,
            minCollateralAmountOut,
            priceWithSlippage,
            sizeAmount,
            privilege
          })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          fundingAccount: userInputTokenSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey)  : userInputTokenAccount,

          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,


          receivingCustody: userInputCustodyConfig.custodyAccount,
          receivingCustodyOracleAccount: this.useExtOracleAccount ? userInputCustodyConfig.extOracleAccount: userInputCustodyConfig.intOracleAccount,
          receivingCustodyTokenAccount: userInputCustodyConfig.tokenAccount,

          position: positionAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount: targetCustodyConfig.intOracleAccount,

          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount: collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

          systemProgram: SystemProgram.programId,
          eventAuthority : this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          fundingMint: userInputCustodyConfig.mintKey,
          fundingTokenProgram: poolConfig.getTokenFromSymbol(userInputTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
          collateralMint: collateralCustodyConfig.mintKey,
          collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID 
        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();

      instructions.push(inx)      

    } catch (err) {
      console.error("perpClient SwapAndOpen error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  closeAndSwap = async (
    targetTokenSymbol: string,
    userOutputTokenSymbol: string,
    collateralTokenSymbol: string,
    minSwapAmountOut: BN,
    priceWithSlippage: ContractOraclePrice,
    side: Side,
    poolConfig: PoolConfig,
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const userOutputCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(userOutputTokenSymbol).mintKey))!;
    if (!userOutputCustodyConfig) {
      throw "userOutputCustodyConfig not found";
    }
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralTokenSymbol).mintKey))!;
    if (!collateralCustodyConfig) {
      throw "collateralCustodyConfig not found";
    }
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetTokenSymbol).mintKey))!;
    if (!targetCustodyConfig) {
      throw "targetCustodyConfig not found";
    }

    if(userOutputCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)){
      throw "Dont use swap, just call close position"
    }

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userReceivingTokenAccount : PublicKey;
    const collateralToken = poolConfig.getTokenFromSymbol(collateralTokenSymbol);
    const userOutputToken = poolConfig.getTokenFromSymbol(userOutputTokenSymbol);
    
    // https://github.com/blockworks-foundation/mango-v4/blob/1ba6513b5ea2b0e557808e712fcf0a811968b45b/ts/client/src/client.ts#L1252 
    // Create WSOL Token account and not ATA and close it in end 
    if (userOutputTokenSymbol == 'SOL') {
      console.log("outputSymbol === SOL", userOutputTokenSymbol);

      const lamports = (this.minimumBalanceForRentExemptAccountLamports);//(await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      
      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];
      additionalSigners.push(wrappedSolAccount);

    }  else {
     
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount = getAssociatedTokenAddressSync(
        userOutputToken.mintKey,
        publicKey,
        true,
        userOutputToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );

      if (!(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            userOutputToken.mintKey,
            userOutputToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
          )
        );
      }
     
    }//else


    let userCollateralTokenAccount =  getAssociatedTokenAddressSync(
      collateralToken.mintKey,
      publicKey,
      true,
      collateralToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
    );
    if ( !(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userCollateralTokenAccount,
          publicKey,
          collateralToken.mintKey,
          collateralToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        )
      );
    }

    let rebateMintAccount = {
      pubkey: collateralCustodyConfig.mintKey,
      isSigner: false,
      isWritable: false
    }
   

    try {
    

      let inx = await this.program.methods
        .closeAndSwap({
          priceWithSlippage,
          minSwapAmountOut,
          privilege
        })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          receivingAccount : userOutputTokenSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userReceivingTokenAccount,
          collateralAccount: userCollateralTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,

          position: positionAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

          dispensingCustody: userOutputCustodyConfig.custodyAccount,
          dispensingOracleAccount: this.useExtOracleAccount ? userOutputCustodyConfig.extOracleAccount : userOutputCustodyConfig.intOracleAccount,
          dispensingCustodyTokenAccount: userOutputCustodyConfig.tokenAccount,

          // tokenProgram: TOKEN_PROGRAM_ID,
          
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,

          receivingMint: userOutputCustodyConfig.mintKey,
          receivingTokenProgram: userOutputToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID, //TODO: tokenType

          collateralMint: collateralCustodyConfig.mintKey,
          collateralTokenProgram: collateralToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID 

        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();

      instructions.push(inx)

    
    } catch (err) {
      console.error("perpClient CloseAndSwap error:: ", err);
      throw err;
    }

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
    skipBalanceChecks = false, // calling this with true will skip balance checks, which is suitable for UI to be quick
    ephemeralSignerPubkey = undefined // for Squads wallet
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
      console.log("collateralSymbol === SOL", collateralSymbol);

      // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      // console.log("accCreationLamports:", accCreationLamports)
      const lamports = collateralWithFee.add(new BN(this.minimumBalanceForRentExemptAccountLamports)); // for account creation
      console.log("lamports:", lamports.toNumber())

      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
          throw "Insufficient SOL Funds"
        }
      }

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


    }  else {
      // for other tokens check if ATA and balance 
      if (!skipBalanceChecks) {
        if (!(await checkIfAccountExists(userPayingTokenAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }
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
      fundingAccount: collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) :  userPayingTokenAccount, // user token account for custody token account
      perpetuals: poolConfig.perpetuals,
      pool: poolConfig.poolAddress,
      targetCustody: targetCustodyConfig.custodyAccount,
      targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
      collateralCustody: collateralCustodyConfig.custodyAccount,
      collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
      collateralCustodyTokenAccount:  collateralCustodyConfig.tokenAccount, 
      eventAuthority: this.eventAuthority.publicKey,
      fundingTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      fundingMint: collateralCustodyConfig.mintKey
    })
    .instruction();

    instructions.push(instruction);

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  swapAndAddCollateral = async (
    targetSymbol: string,
    inputSymbol: string,
    collateralSymbol: string,
    amountIn: BN, // with fee
    minCollateralAmountOut: BN,
    side: Side,
    positionPubKey: PublicKey,
    poolConfig: PoolConfig,
    skipBalanceChecks = false, // calling this with true will skip balance checks, which is suitable for UI to be quick
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const inputCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(inputSymbol).mintKey))!;

    if (!collateralCustodyConfig || !targetCustodyConfig || !inputCustodyConfig) {
      throw "payTokenCustody not found";
    }

    if (inputCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)) {
      throw "Use Simple Swap"
    }


    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userInputTokenAccount: PublicKey;

    // Create WSOL Token account and not ATA and close it in end 
    if (inputSymbol == 'SOL') {
      console.log("inputSymbol === SOL", inputSymbol);

      const lamports = amountIn.add(new BN(this.minimumBalanceForRentExemptAccountLamports)); // for account creation
      console.log("lamports:", lamports.toNumber())

      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
          throw "Insufficient SOL Funds"
        }
      }

      if (!ephemeralSignerPubkey) {
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


    } else {
      userInputTokenAccount = getAssociatedTokenAddressSync(
        inputCustodyConfig.mintKey,
        publicKey,
        true,
        poolConfig.getTokenFromSymbol(inputSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );
      // for other tokens check if ATA and balance 
      if (!skipBalanceChecks) {
        if (!(await checkIfAccountExists(userInputTokenAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }
        const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userInputTokenAccount)).value.amount);
        if (tokenAccountBalance.lt(amountIn)) {
          throw `Insufficient Funds need more ${amountIn.sub(tokenAccountBalance)} tokens`
        }
      }
    }

    let userCollateralTokenAccount = getAssociatedTokenAddressSync(
      collateralCustodyConfig.mintKey,
      publicKey,
      true,
      poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
    );
    if (!(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userCollateralTokenAccount,
          publicKey,
          collateralCustodyConfig.mintKey,
          poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        )
      );
    }

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let instruction = await this.program.methods.swapAndAddCollateral({
      amountIn: amountIn,
      minCollateralAmountOut: minCollateralAmountOut,
    }).accounts({
      owner: publicKey,
      feePayer: publicKey,
      fundingAccount: inputSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userInputTokenAccount, // user token account for custody token account

      transferAuthority: poolConfig.transferAuthority,
      perpetuals: poolConfig.perpetuals,
      pool: poolConfig.poolAddress,

      receivingCustody: inputCustodyConfig.custodyAccount,
      receivingCustodyOracleAccount: this.useExtOracleAccount ? inputCustodyConfig.extOracleAccount : inputCustodyConfig.intOracleAccount,
      receivingCustodyTokenAccount: inputCustodyConfig.tokenAccount,

      position: positionPubKey,
      market: marketAccount,
      targetCustody: targetCustodyConfig.custodyAccount,
      targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

      collateralCustody: collateralCustodyConfig.custodyAccount,
      collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
      collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

      eventAuthority: this.eventAuthority.publicKey,
      fundingTokenProgram: poolConfig.getTokenFromSymbol(inputSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
      program: this.programId,

      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      fundingMint: poolConfig.getTokenFromSymbol(inputSymbol).mintKey,
    })
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
    closeUsersWSOLATA = false, // to get back WSOL=>SOL
    ephemeralSignerPubkey = undefined // for Squads wallet
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

      console.log("removeCollateral  -- collateralSymbol:",collateralSymbol)

    if (collateralSymbol == 'SOL') {
      console.log("remove collateral in SOL ...create WSOL temp and close it ")

      const lamports = this.minimumBalanceForRentExemptAccountLamports // (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];

    } else {
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
        publicKey,
        true,
        poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID  
      );

      if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
            poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
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
        receivingAccount: collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userReceivingTokenAccount, // user token account for custody token account
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
        receivingTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
        program: this.programId,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        receivingMint: collateralCustodyConfig.mintKey
    })
    .instruction()

    instructions.push(instruction)

      if (collateralSymbol == 'WSOL' && closeUsersWSOLATA) {
        const closeWsolATAIns = createCloseAccountInstruction(userReceivingTokenAccount, publicKey, publicKey);
        postInstructions.push(closeWsolATAIns);
      }

    } catch (error) {
      console.error("perpclient removeCollateral error:", error);
      throw error;
    }

      return {
        instructions : [...preInstructions, ...instructions ,...postInstructions],
        additionalSigners
      };
  }

  removeCollateralAndSwap = async (
    targetSymbol: string,
    collateralSymbol: string,
    outputSymbol: string,
    minSwapAmountOut: BN,
    collateralDelta: BN,
    side: Side,
    poolConfig: PoolConfig,
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

   

    let publicKey = this.provider.wallet.publicKey;
    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const outputCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(outputSymbol).mintKey))!;

    if (outputCustodyConfig.mintKey.equals(collateralCustodyConfig.mintKey)) {
      throw "Dont use swap, just call remove collateral"
    }

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userReceivingTokenAccount: PublicKey;


    // https://github.com/blockworks-foundation/mango-v4/blob/1ba6513b5ea2b0e557808e712fcf0a811968b45b/ts/client/src/client.ts#L1252 
    // Create WSOL Token account and not ATA and close it in end 
    if (outputSymbol == 'SOL') {
      console.log("outputSymbol === SOL", outputSymbol);

      const lamports = this.minimumBalanceForRentExemptAccountLamports // (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

      if (!ephemeralSignerPubkey) {
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


    } else {

      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount = getAssociatedTokenAddressSync(
        poolConfig.getTokenFromSymbol(outputSymbol).mintKey,
        publicKey,
        true,
        poolConfig.getTokenFromSymbol(outputSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
      );

      if (!(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            poolConfig.getTokenFromSymbol(outputSymbol).mintKey,
            poolConfig.getTokenFromSymbol(outputSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
          )
        );
      }

    }


    let userCollateralTokenAccount = getAssociatedTokenAddressSync(
      poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
      publicKey,
      true,
      poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
    );
    if (!(await checkIfAccountExists(userCollateralTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          userCollateralTokenAccount,
          publicKey,
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
          poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        )
      );
    }


    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)
    const positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount);

    let instruction = await this.program.methods
      .removeCollateralAndSwap({
        collateralDelta: collateralDelta,
        minSwapAmountOut: minSwapAmountOut,
      })
      .accounts({
        owner: publicKey,
        feePayer: publicKey,
        // swapOutput
        receivingAccount: outputSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userReceivingTokenAccount,
        collateralAccount: userCollateralTokenAccount,
        transferAuthority: poolConfig.transferAuthority,
        perpetuals: poolConfig.perpetuals,
        pool: poolConfig.poolAddress,

        position: positionAccount,
        market: marketAccount,
        targetCustody: targetCustodyConfig.custodyAccount,
        targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,

        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
        collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

        // swapOut Custody
        dispensingCustody: outputCustodyConfig.custodyAccount,
        dispensingOracleAccount: this.useExtOracleAccount ? outputCustodyConfig.extOracleAccount : outputCustodyConfig.intOracleAccount,
        dispensingCustodyTokenAccount: outputCustodyConfig.tokenAccount,

        eventAuthority: this.eventAuthority.publicKey,

        program: this.programId,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        receivingMint: outputCustodyConfig.mintKey,
        receivingTokenProgram: poolConfig.getTokenFromSymbol(outputSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID, //TODO: tokenType
        collateralMint: collateralCustodyConfig.mintKey,
        collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID

      })
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
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
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
      collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
      eventAuthority : this.eventAuthority.publicKey,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      collateralMint: collateralCustodyConfig.mintKey
    })
    .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
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
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
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
      collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
      eventAuthority : this.eventAuthority.publicKey,
      program: this.programId,
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      collateralMint: collateralCustodyConfig.mintKey
    })
    .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
    .instruction()
  
    instructions.push(instruction)

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
    
  }

  addLiquidity = async (
    payTokenSymbol: string,
    tokenAmountIn: BN,
    minLpAmountOut: BN, // give this value based on slippage 
    poolConfig: PoolConfig,
    skipBalanceChecks = false, // calling this with true will skip balance checks, which is suitable for UI to be quick
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;
    const payTokenCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(payTokenSymbol).mintKey))!;
    if (!payTokenCustodyConfig) {
      throw "payTokenCustodyConfig not found";
    }

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    const payToken = poolConfig.getTokenFromSymbol(payTokenSymbol);

    try {

      let userPayingTokenAccount =  getAssociatedTokenAddressSync(
        payTokenCustodyConfig.mintKey,
        publicKey,
        true,
        payToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );

      let lpTokenAccount = getAssociatedTokenAddressSync(
        poolConfig.stakedLpTokenMint,
        publicKey,
        true,
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

    // FOR SOL :  Create WSOL Token account and not ATA and close it in end 
    if (payTokenSymbol == 'SOL') {
      console.log("payTokenSymbol === SOL", payTokenSymbol);

      // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      // console.log("accCreationLamports:", accCreationLamports)
      const lamports = tokenAmountIn.add(new BN(this.minimumBalanceForRentExemptAccountLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
          throw "Insufficient SOL Funds"
        }
      }

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


    }  else {
        // for other tokens check if ATA and balance 
        if (!skipBalanceChecks) {
          if (!(await checkIfAccountExists(userPayingTokenAccount, this.provider.connection))) {
            throw "Insufficient Funds , token Account doesn't exist"
          }
          const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userPayingTokenAccount)).value.amount);
          if (tokenAccountBalance.lt(tokenAmountIn)) {
            throw `Insufficient Funds need more ${tokenAmountIn.sub(tokenAccountBalance)} tokens`
          }
        }
    }//else
      

      let instruction = await this.program.methods
        .addLiquidity({
          amountIn: tokenAmountIn,
          minLpAmountOut
        })
        .accounts({
          owner: publicKey,
          fundingAccount: payTokenSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userPayingTokenAccount, // user token account for custody token account
          lpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          custody: payTokenCustodyConfig.custodyAccount,
          custodyOracleAccount: this.useExtOracleAccount ? payTokenCustodyConfig.extOracleAccount : payTokenCustodyConfig.intOracleAccount,
          custodyTokenAccount: payTokenCustodyConfig.tokenAccount,
          lpTokenMint: poolConfig.stakedLpTokenMint,
          eventAuthority : this.eventAuthority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          fundingMint: payTokenCustodyConfig.mintKey,
          fundingTokenProgram: payToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID 
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction();

        instructions.push(instruction);
    } catch (err) {
      console.error("perpClient addLiquidity error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  addLiquidityAndStake = async (
    inputSymbol: string,
    amountIn: BN, // with fee
    minLpAmountOut: BN,
    poolConfig: PoolConfig,
    skipBalanceChecks = false,
    ephemeralSignerPubkey = undefined, // for Squads wallet
    userPublicKey: PublicKey | undefined = undefined
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = userPublicKey ?? this.provider.wallet.publicKey;

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    let userInputTokenAccount: PublicKey;
    let lpTokenMint = poolConfig.stakedLpTokenMint
    const inputCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(inputSymbol).mintKey))!;

    let lpTokenAccount = getAssociatedTokenAddressSync(
      lpTokenMint,
      publicKey,
      true
    );
    const inputToken = poolConfig.getTokenFromSymbol(inputSymbol);

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
      console.log("inputSymbol === SOL", inputSymbol);

      // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      // console.log("accCreationLamports:", accCreationLamports)
      const lamports = amountIn.add(new BN(this.minimumBalanceForRentExemptAccountLamports)); // for account creation
      console.log("lamports:", lamports.toNumber())

      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
          throw "Insufficient SOL Funds"
        }
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

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


    } else {
      userInputTokenAccount = getAssociatedTokenAddressSync(
        inputCustodyConfig.mintKey,
        publicKey,
        true,
        inputToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );

      // for other tokens check if ATA and balance 
      if (!skipBalanceChecks) {
        if (!(await checkIfAccountExists(userInputTokenAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }
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
      fundingAccount: inputSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userInputTokenAccount, // user token account for custody token account
      
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
      ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      fundingMint: inputCustodyConfig.mintKey,
      fundingTokenProgram: inputToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID //TODO: tokenType
    })
    .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
    .instruction();

    instructions.push(instruction);

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
    closeUsersWSOLATA = false, // to get back WSOL=>SOL
    ephemeralSignerPubkey = undefined, // for Squads wallet
    userPublicKey: PublicKey | undefined = undefined
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {

    const recieveTokenCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(recieveTokenSymbol).mintKey))!;
    if (!recieveTokenCustodyConfig) {
      throw "recieveTokenCustody not found";
    }
    let publicKey = userPublicKey ?? this.provider.wallet.publicKey;

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    const recieveToken = poolConfig.getTokenFromSymbol(recieveTokenSymbol);
    try { 
      let stakedLpTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.stakedLpTokenMint,
        publicKey,
        true
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

        // userReceivingTokenAccount = wrappedSolAccount.publicKey;
        const lamports = this.minimumBalanceForRentExemptAccountLamports //(await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

        if(!ephemeralSignerPubkey){
          wrappedSolAccount = new Keypair();
          additionalSigners.push(wrappedSolAccount);
        }

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            lamports: lamports, //will this break for large amounts ??
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            NATIVE_MINT,
            publicKey,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            publicKey,
            publicKey,
          ),
        ];

      } else {
        // OTHER TOKENS including WSOL,USDC,..
        userReceivingTokenAccount = getAssociatedTokenAddressSync(
          recieveToken.mintKey,
          publicKey,
          true,
          recieveToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userReceivingTokenAccount,
              publicKey,
              recieveToken.mintKey,
              recieveToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
            )
          );
        }
      } // else

      let removeLiquidityTx = await this.program.methods
        .removeLiquidity({
          lpAmountIn: liquidityAmountIn,
          minAmountOut: minTokenAmountOut
        })
        .accounts({
          owner: publicKey,
          receivingAccount: recieveTokenSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userReceivingTokenAccount, // user token account for custody token account
          lpTokenAccount: stakedLpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          custody: recieveTokenCustodyConfig.custodyAccount,
          custodyOracleAccount: this.useExtOracleAccount ? recieveTokenCustodyConfig.extOracleAccount : recieveTokenCustodyConfig.intOracleAccount,
          custodyTokenAccount: recieveTokenCustodyConfig.tokenAccount,
          lpTokenMint: poolConfig.stakedLpTokenMint,
          eventAuthority : this.eventAuthority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          receivingMint: recieveTokenCustodyConfig.mintKey,
          receivingTokenProgram: recieveToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID //TODO: tokenType
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
      console.log("perpClient removeLiquidity error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  addReferral = async (
    tokenStakeAccount: PublicKey,
    nftReferralAccount: PublicKey,
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
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
            tokenStakeAccount: tokenStakeAccount,
            systemProgram: SystemProgram.programId,
          })
          .instruction();
        instructions.push(addReferralInstruction)

    } catch (err) {
      console.log("perpClient addReferral error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }


  updateNftAccount = async (
    nftMint: PublicKey,
    updateReferer: boolean,
    updateBooster: boolean,
    flpStakeAccounts: PublicKey[]
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
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
        publicKey,
        true
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
      console.log("perpClient updateNftAccount error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  levelUp = async (
    poolConfig :PoolConfig,
    // collectionIndex: number,
    nftMint: PublicKey,
    authorizationRulesAccount : PublicKey,
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
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
            nftMint : nftMint, 
            metadataProgram: METAPLEX_PROGRAM_ID,
            tradingAccount: nftTradingAccount,
            transferAuthority: this.authority.publicKey,
            authorizationRulesAccount : authorizationRulesAccount,
            authorizationRulesProgram : new PublicKey('auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'),
            systemProgram: SystemProgram.programId,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
          })
          .instruction();
        instructions.push(levelUpInstruction)

    } catch (err) {
      console.log("perpClient levelUp error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }
  
  depositStake = async (
    owner: PublicKey,
    feePayer: PublicKey,
    depositAmount: BN,
    poolConfig: PoolConfig
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
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
        owner,
        true
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
            program: this.programId,
            lpTokenMint: poolConfig.stakedLpTokenMint,
          })
          .instruction();
        instructions.push(depositStakeInstruction)

    } catch (err) {
      console.log("perpClient depositStaking error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  refreshStakeWithAllFlpStakeAccounts = async (
    rewardSymbol: string,
    poolConfig: PoolConfig,
    flpStakeAccountPks: PublicKey[] // array of [flpStakeAccountPks, tokenStakeAccountPks]
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
      console.log("perpClient refreshStaking error:: ", err);
      throw err;
    }

  }

  refreshStakeWithTokenStake = async (
    rewardSymbol: string,
    poolConfig: PoolConfig,
    flpStakeAccountPk: PublicKey,
    userPublicKey: PublicKey | undefined = undefined
  ): Promise<TransactionInstruction> => {
    try {
      let publicKey = userPublicKey ?? this.provider.wallet.publicKey;
      
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

      // const maxFlpStakeAccountPkLength = 32 - 4 + custodyAccountMetas.length; // 4 default accounts, custody accs, max # of accounts per ins is 32
      // if (flpStakeAccountPks.length > maxFlpStakeAccountPkLength) {
      //   throw new Error(`Max of ${maxFlpStakeAccountPkLength} flpStakeAccountPks can be updated at a time.`)
      // }

      let stakeAccountMetas = [];
        stakeAccountMetas.push({
          pubkey: flpStakeAccountPk,
          isSigner: false,
          isWritable: true,
        });

        const tokenStakeAccount = PublicKey.findProgramAddressSync(
          [Buffer.from("token_stake"), publicKey.toBuffer()],
          this.programId
        )[0];

        stakeAccountMetas.push({
          pubkey: tokenStakeAccount,
          isSigner: false,
          isWritable: false,
        })
      
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
          .remainingAccounts([...custodyAccountMetas, ...stakeAccountMetas ])
          .instruction();

      return refreshStakeInstruction;

    } catch (err) {
      console.log("perpClient refreshStaking error:: ", err);
      throw err;
    }

  }

  unstakeInstant = async (
    rewardSymbol: string,
    unstakeAmount: BN,
    poolConfig: PoolConfig,
    userPublicKey: PublicKey | undefined = undefined
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = userPublicKey ?? this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {


      // const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
      const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

      const pool = poolConfig.poolAddress
      // const feeDistributionTokenAccount = PublicKey.findProgramAddressSync(
      //   [Buffer.from("custody_token_account"), pool.toBuffer(), rewardCustodyMint.toBuffer()],
      //   this.programId
      // )[0];
      
      // const lpTokenMint = poolConfig.stakedLpTokenMint;

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.programId
      )[0];

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), publicKey.toBuffer()],
        this.programId
      )[0];

      let tokenStakeAccounts = []
      if (tokenStakeAccount && await checkIfAccountExists(tokenStakeAccount, this.provider.connection)) {
        tokenStakeAccounts.push({
          pubkey: tokenStakeAccount,
          isSigner: false,
          isWritable: false,
        })
      }

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
          .remainingAccounts([...tokenStakeAccounts])
          .instruction();
        instructions.push(unstakeInstantInstruction)

    } catch (err) {
      console.log("perpClient unstakeInstant error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  setFeeShareBps = async (
    poolConfig: PoolConfig,
    flpStakeAccountPks: PublicKey[]
  ): Promise<TransactionInstruction> => {

    try {
      let publicKey = this.provider.wallet.publicKey;

      const pool = poolConfig.poolAddress

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
        .setFeeShare({
          feeShareBps: new BN(7000)
        })
        .accounts({
          admin: publicKey,
          multisig: this.multisig.publicKey,
          pool: pool,
        })
        .remainingAccounts([...flpStakeAccountMetas])
        .instruction();

      return refreshStakeInstruction;

    } catch (err) {
      console.log("perpClient refreshStaking error:: ", err);
      throw err;
    }

  }

  unstakeRequest = async (
    unstakeAmount: BN,
    poolConfig: PoolConfig
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
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
      console.log("perpClient unstakeRequest error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }


  withdrawStake = async (
    poolConfig: PoolConfig,
    pendingActivation = true,
    deactivated = true,
    createUserLPTA = true, //create new ATA for USER in the end 
    userPublicKey: PublicKey | undefined = undefined
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = userPublicKey ?? this.provider.wallet.publicKey;

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

      let userLpTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.stakedLpTokenMint,
        publicKey,
        true
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
            lpMint: poolConfig.stakedLpTokenMint,
          })
          .instruction();
        instructions.push(withdrawStakeInstruction)

    } catch (err) {
      console.log("perpClient withdrawStake error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  collectStakeFees = async (
    rewardSymbol: string,// majorly 'USDC' - so no WSOL/SOL handling
    poolConfig: PoolConfig,
    tokenStakeAccount?: PublicKey,
    createUserATA = true, //create new ATA for USER in the end 
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
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

      let tokenStakeAccounts = []
      if (tokenStakeAccount) {
        tokenStakeAccounts.push({
          pubkey: tokenStakeAccount,
          isSigner: false,
          isWritable: true,
        })
      }
      // let boostingAccount = []
      // if (nftBoostingAccount) {
      //   boostingAccount.push({
      //     pubkey: nftBoostingAccount,
      //     isSigner: false,
      //     isWritable: true,
      //   })
      // }

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
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
            receivingMint: rewardCustodyMint,
          })
          .remainingAccounts([...tokenStakeAccounts])
          .instruction();
        instructions.push(withdrawStakeInstruction)

    } catch (err) {
      console.log("perpClient withdrawStake error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  addCompoundingLiquidity = async (
    amountIn: BN,
    minCompoundingAmountOut: BN,
    inTokenSymbol: string,
    rewardTokenMint: PublicKey,
    poolConfig: PoolConfig,
    skipBalanceChecks = false, // calling this with true will skip balance checks, which is suitable for UI to be quick
    ephemeralSignerPubkey = undefined, // for Squads wallet
    userPublicKey: PublicKey | undefined = undefined
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = userPublicKey ?? this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];
    let postInstructions: TransactionInstruction[] = [];

    // const rewardCustody = poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;
    const rewardCustody =  poolConfig.custodies.find((f) => f.symbol == 'USDC')! //poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;

    const inCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(inTokenSymbol).mintKey))!;
    const lpTokenMint = poolConfig.stakedLpTokenMint;
    const compoundingTokenMint = poolConfig.compoundingTokenMint;
    let wrappedSolAccount: Keypair | undefined;

    let lpTokenAccount =  getAssociatedTokenAddressSync(
      poolConfig.stakedLpTokenMint,
      publicKey,
      true
    );

    let compoundingTokenAccount =  getAssociatedTokenAddressSync(
      compoundingTokenMint,
      publicKey,
      true
    );

    let fundingAccount =  getAssociatedTokenAddressSync(
      inCustodyConfig.mintKey,
      publicKey,
      true,
      poolConfig.getTokenFromSymbol(inTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
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
      console.log("inTokenSymbol === SOL", inTokenSymbol);

      // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      // console.log("accCreationLamports:", accCreationLamports)
      const lamports = amountIn.add(new BN(this.minimumBalanceForRentExemptAccountLamports)); // for account creation

      // CHECK BASIC SOL BALANCE
      if (!skipBalanceChecks) {
        let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
        if (unWrappedSolBalance.lt(lamports)) {
          throw "Insufficient SOL Funds"
        }
      }

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports.toNumber(), //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];


    } else {
      // for other tokens check if ATA and balance 
      if (!skipBalanceChecks) {
        if (!(await checkIfAccountExists(fundingAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }
      }
    }//else


    try {
      let addCompoundingLiquidity = await this.program.methods
        .addCompoundingLiquidity({
          amountIn: amountIn,
          minCompoundingAmountOut: minCompoundingAmountOut
        })
        .accounts({
          owner: publicKey,
          fundingAccount: inTokenSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : fundingAccount,
          compoundingTokenAccount: compoundingTokenAccount,
          poolCompoundingLpVault: poolConfig.compoundingLpVault,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          inCustody: inCustodyConfig.custodyAccount,
          inCustodyOracleAccount: this.useExtOracleAccount ? inCustodyConfig.extOracleAccount: inCustodyConfig.intOracleAccount,
          inCustodyTokenAccount: inCustodyConfig.tokenAccount,

          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount: rewardCustody.intOracleAccount,
          lpTokenMint: lpTokenMint,
          compoundingTokenMint: compoundingTokenMint,
          
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          fundingMint: inCustodyConfig.mintKey,
          fundingTokenProgram: poolConfig.getTokenFromSymbol(inTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(addCompoundingLiquidity)

    } catch (err) {
      console.log("perpClient addCompoundingLiquidity error:: ", err);
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
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
    ephemeralSignerPubkey = undefined, // for Squads wallet
    userPublicKey: PublicKey | undefined = undefined
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = userPublicKey ?? this.provider.wallet.publicKey;

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    const rewardCustody =  poolConfig.custodies.find((f) => f.symbol == 'USDC')! //poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;
    const outCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(outTokenSymbol).mintKey))!;
    const lpTokenMint = poolConfig.stakedLpTokenMint;
    const compoundingTokenMint = poolConfig.compoundingTokenMint;

    if (outCustodyConfig.symbol == 'SOL') {


      const lamports = this.minimumBalanceForRentExemptAccountLamports //(await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

      if(!ephemeralSignerPubkey){
        wrappedSolAccount = new Keypair();
        additionalSigners.push(wrappedSolAccount);
      }

      preInstructions = [
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          lamports: lamports, //will this break for large amounts ??
          space: 165,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccount3Instruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          NATIVE_MINT,
          publicKey,
        ),
      ];
      postInstructions = [
        createCloseAccountInstruction(
          (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
          publicKey,
          publicKey,
        ),
      ];

    } else {
      // OTHER TOKENS including WSOL,USDC,..
      userReceivingTokenAccount =  getAssociatedTokenAddressSync(
        outCustodyConfig.mintKey,
        publicKey,
        true,
        poolConfig.getTokenFromSymbol(outTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );

      if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userReceivingTokenAccount,
            publicKey,
            outCustodyConfig.mintKey,
            poolConfig.getTokenFromSymbol(outTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
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

    let compoundingTokenAccount =  getAssociatedTokenAddressSync(
      compoundingTokenMint,
      publicKey,
      true
    );

    // let receivingAccount =  getAssociatedTokenAddressSync(
    //   outCustodyConfig.mintKey,
    //   publicKey,
    //   true
    // );

    try {
      let removeCompoundingLiquidity = await this.program.methods
        .removeCompoundingLiquidity({
          compoundingAmountIn: compoundingAmountIn,
          minAmountOut: minAmountOut
        })
        .accounts({
          owner: publicKey,
          receivingAccount: outCustodyConfig.symbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userReceivingTokenAccount,
          compoundingTokenAccount: compoundingTokenAccount,
          poolCompoundingLpVault: poolConfig.compoundingLpVault,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          outCustody: outCustodyConfig.custodyAccount,
          outCustodyOracleAccount: this.useExtOracleAccount ? outCustodyConfig.extOracleAccount: outCustodyConfig.intOracleAccount,
          outCustodyTokenAccount: outCustodyConfig.tokenAccount,

          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount: rewardCustody.intOracleAccount,
          lpTokenMint: lpTokenMint,
          compoundingTokenMint: compoundingTokenMint,
          
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          receivingMint: outCustodyConfig.mintKey,
          receivingTokenProgram: poolConfig.getTokenFromSymbol(outTokenSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(removeCompoundingLiquidity)

    } catch (err) {
      console.log("perpClient removeCompoundingLiquidity error:: ", err);
    }

    return {
      instructions: [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  migrateStake = async (
    amount: BN,
    rewardTokenMint: PublicKey,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end 
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    
    let additionalSigners: Signer[] = [];

    // const rewardCustody = poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;
    const rewardCustody =  poolConfig.custodies.find((f) => f.symbol == 'USDC')! //poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;

    const lpTokenMint = poolConfig.stakedLpTokenMint;
    const compoundingTokenMint = poolConfig.compoundingTokenMint;

    let compoudingTokenAccount =  getAssociatedTokenAddressSync(
      compoundingTokenMint,
      publicKey,
      true
    );

    if (createUserATA && !(await checkIfAccountExists(compoudingTokenAccount, this.provider.connection))) {
      preInstructions.push(
        createAssociatedTokenAccountInstruction(
          publicKey,
          compoudingTokenAccount,
          publicKey,
          compoundingTokenMint,
        )
      );
    }

    const flpStakeAccount = PublicKey.findProgramAddressSync(
      [Buffer.from("stake"), publicKey.toBuffer(), poolConfig.poolAddress.toBuffer()],
      this.programId
    )[0];

    const tokenStakeAccount = PublicKey.findProgramAddressSync(
      [Buffer.from("token_stake"), publicKey.toBuffer()],
      this.programId
    )[0];

    let tokenStakeAccounts = []
    if (tokenStakeAccount && await checkIfAccountExists(tokenStakeAccount, this.provider.connection)) {
      tokenStakeAccounts.push({
        pubkey: tokenStakeAccount,
        isSigner: false,
        isWritable: true,
      })
    }


    const poolStakedLpVault = PublicKey.findProgramAddressSync(
      [Buffer.from("staked_lp_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
      this.programId
    )[0];

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

    try {
      let migrateStake = await this.program.methods
        .migrateStake({
          amount: amount
        })
        .accounts({
          owner: publicKey,
          compoundingTokenAccount: compoudingTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          flpStakeAccount: flpStakeAccount,
          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount : rewardCustody.intOracleAccount,
          poolStakedLpVault: poolStakedLpVault,
          poolCompoundingLpVault: poolConfig.compoundingLpVault,
          lpTokenMint: lpTokenMint,
          compoundingTokenMint: compoundingTokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets, ...tokenStakeAccounts])
        .instruction()
      instructions.push(migrateStake)

    } catch (err) {
      console.log("perpClient migrateStake error:: ", err);
    }

    return {
      instructions: [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  migrateFlp = async (
    amount: BN,
    rewardTokenMint: PublicKey,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    
    let additionalSigners: Signer[] = [];

    // const rewardCustody = poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;
    const rewardCustody =  poolConfig.custodies.find((f) => f.symbol == 'USDC')! //poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;

    const lpTokenMint = poolConfig.stakedLpTokenMint;
    const compoundingTokenMint = poolConfig.compoundingTokenMint;

    let compoudingTokenAccount =  getAssociatedTokenAddressSync(
      compoundingTokenMint,
      publicKey,
      true
    );

    const flpStakeAccount = PublicKey.findProgramAddressSync(
      [Buffer.from("stake"), publicKey.toBuffer(), poolConfig.poolAddress.toBuffer()],
      this.programId
    )[0];

    const poolStakedLpVault = PublicKey.findProgramAddressSync(
      [Buffer.from("staked_lp_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
      this.programId
    )[0];

    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
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
    }

    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      });
    }

    try {
      let migrateFlp = await this.program.methods
        .migrateFlp({
          compoundingTokenAmount: amount
        })
        .accounts({
          owner: publicKey,
          compoundingTokenAccount: compoudingTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          flpStakeAccount: flpStakeAccount,
          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount : rewardCustody.intOracleAccount,
          poolStakedLpVault: poolStakedLpVault,
          poolCompoundingLpVault: poolConfig.compoundingLpVault,
          lpTokenMint: lpTokenMint,
          compoundingTokenMint: compoundingTokenMint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(migrateFlp)

    } catch (err) {
      console.log("perpClient migrateFlp error:: ", err);
    }

    return {
      instructions: [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };
  }

  compoundingFee = async (
    poolConfig: PoolConfig,
    rewardTokenSymbol = 'USDC',
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];

    // const rewardCustody = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardTokenSymbol).mintKey))!;
    const rewardCustody =  poolConfig.custodies.find((f) => f.symbol == 'USDC')! //poolConfig.custodies.find(i => i.mintKey.equals(rewardTokenMint))!;

    const lpTokenMint = poolConfig.stakedLpTokenMint;


    let custodyAccountMetas = [];
    let custodyOracleAccountMetas = [];
    let markets = []
    for (const custody of poolConfig.custodies) {
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
    for (const market of poolConfig.markets) {
      markets.push({
        pubkey: market.marketAccount,
        isSigner: false,
        isWritable: false,
      });
    }

    try {
      let compoundingFee = await this.program.methods
        .compoundFees({})
        .accounts({
          poolCompoundingLpVault: poolConfig.compoundingLpVault,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          rewardCustody: rewardCustody.custodyAccount,
          rewardCustodyOracleAccount: this.useExtOracleAccount ? rewardCustody.extOracleAccount: rewardCustody.intOracleAccount,
          lpTokenMint: lpTokenMint,

          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.program.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(compoundingFee)

    } catch (err) {
      console.log("perpClient compoundingFee error:: ", err);
    }

    return {
      instructions: [...instructions],
      additionalSigners
    };
  }

  burnAndClaim = async (
    owner: PublicKey,
    nftMint: PublicKey,
    poolConfig: PoolConfig,
    createAta: boolean
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let userTokenAccount = await getAssociatedTokenAddress(
        poolConfig.tokenMint,
        owner,
        true
      );

      if (createAta && !(await checkIfAccountExists(userTokenAccount, this.provider.connection))) {
        // throw `userTokenAccount doesn't exist : ${userTokenAccount.toBase58()}`
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            owner,
            userTokenAccount,
            owner,
            poolConfig.tokenMint,
          )
        );
      }
      let nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        owner,
        true
      );

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

      const collectionMetadata = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), poolConfig.nftCollectionAddress.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      const edition = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer(), Buffer.from("edition")],
        METAPLEX_PROGRAM_ID
      )[0];

      const tokenRecord = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer(), Buffer.from("token_record"), nftTokenAccount.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      let burnAndClaimInstruction = await this.program.methods
        .burnAndClaim({})
        .accounts({
          owner: owner,
          receivingTokenAccount: userTokenAccount,
          perpetuals: this.perpetuals.publicKey,
          tokenVault: poolConfig.tokenVault,
          tokenVaultTokenAccount: poolConfig.tokenVaultTokenAccount,

          metadataAccount: metadataAccount,
          collectionMetadata: collectionMetadata,
          edition: edition,
          tokenRecord: tokenRecord,
          tradingAccount: nftTradingAccount,
          transferAuthority: poolConfig.transferAuthority,
          metadataProgram: METAPLEX_PROGRAM_ID,
          nftMint: nftMint,
          nftTokenAccount: nftTokenAccount,

          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          receivingTokenMint: poolConfig.tokenMint,
        })
        .instruction();
      instructions.push(burnAndClaimInstruction)

    } catch (err) {
      console.log("perpClient burnAndClaimInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  burnAndStake = async (
    owner: PublicKey,
    feePayer: PublicKey,
    nftMint: PublicKey,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let nftTokenAccount =  getAssociatedTokenAddressSync(
        nftMint,
        owner,
        true
      );

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

      const collectionMetadata = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), poolConfig.nftCollectionAddress.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      const edition = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer(), Buffer.from("edition")],
        METAPLEX_PROGRAM_ID
      )[0];

      const tokenRecord = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer(), Buffer.from("token_record"), nftTokenAccount.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      let burnAndStakeInstruction = await this.program.methods
        .burnAndStake({})
        .accounts({
          owner: owner,
          feePayer: feePayer,
          perpetuals: this.perpetuals.publicKey,
          tokenVault: poolConfig.tokenVault,
          tokenVaultTokenAccount: poolConfig.tokenVaultTokenAccount,
          tokenStakeAccount: tokenStakeAccount,

          metadataAccount: metadataAccount,
          collectionMetadata: collectionMetadata,
          edition: edition,
          tokenRecord: tokenRecord,
          tradingAccount: nftTradingAccount,
          transferAuthority: poolConfig.transferAuthority,
          metadataProgram: METAPLEX_PROGRAM_ID,
          nftMint: nftMint,
          nftTokenAccount: nftTokenAccount,

          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId
        })
        .instruction();
      instructions.push(burnAndStakeInstruction)

    } catch (err) {
      console.log("perpClient burnAndStakeInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }
  
  depositTokenStake = async (
    owner: PublicKey,
    feePayer: PublicKey,
    depositAmount: BN,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let userTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.tokenMint,
        owner,
        true
      );

      if (!(await checkIfAccountExists(userTokenAccount, this.provider.connection))) {
        // throw `userTokenAccount doesn't exist : ${userTokenAccount.toBase58()}`
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            feePayer,
            userTokenAccount,
            owner,
            poolConfig.tokenMint,
          )
        );
      }

      let depositTokenStakeInstruction = await this.program.methods
        .depositTokenStake({
          depositAmount: depositAmount
        })
        .accounts({
          owner: owner,
          feePayer: feePayer,
          fundingTokenAccount: userTokenAccount,
          perpetuals: this.perpetuals.publicKey,
          tokenVault: poolConfig.tokenVault,
          tokenVaultTokenAccount: poolConfig.tokenVaultTokenAccount,

          tokenStakeAccount: tokenStakeAccount,

          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          tokenMint: poolConfig.tokenMint,
        })
        .instruction();
      instructions.push(depositTokenStakeInstruction)

    } catch (err) {
      console.log("perpClient depositStakingInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  unstakeTokenRequest = async (
    owner: PublicKey,
    unstakeAmount: BN,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let unstakeTokenRequestInstruction = await this.program.methods
        .unstakeTokenRequest({
          unstakeAmount: unstakeAmount
        })
        .accounts({
          owner: owner,
          tokenVault: poolConfig.tokenVault,
          tokenStakeAccount: tokenStakeAccount,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId
        })
        .instruction();
      instructions.push(unstakeTokenRequestInstruction)

    } catch (err) {
      console.log("perpClient unstakeTokenRequestInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  unstakeTokenInstant = async (
    owner: PublicKey,
    unstakeAmount: BN,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let userTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.tokenMint,
        owner,
        true
      );

      if (!(await checkIfAccountExists(userTokenAccount, this.provider.connection))) {
        // throw `userTokenAccount doesn't exist : ${userTokenAccount.toBase58()}`
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            this.provider.wallet.publicKey,
            userTokenAccount,
            owner,
            poolConfig.tokenMint,
          )
        );
      }

      let unstakeTokenInstantInstruction = await this.program.methods
        .unstakeTokenInstant({
          unstakeAmount: unstakeAmount
        })
        .accounts({
          owner: owner,
          receivingTokenAccount: userTokenAccount,
          perpetuals: poolConfig.perpetuals,
          transferAuthority: poolConfig.transferAuthority,
          tokenVault: poolConfig.tokenVault,
          tokenVaultTokenAccount: poolConfig.tokenVaultTokenAccount,

          tokenStakeAccount: tokenStakeAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          tokenMint: poolConfig.tokenMint,
        })
        .instruction();
      instructions.push(unstakeTokenInstantInstruction)

    } catch (err) {
      console.log("perpClient unstakeTokenInstantInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  withdrawToken = async (
    owner: PublicKey,
    withdrawRequestId: number,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let userTokenAccount =  getAssociatedTokenAddressSync(
        poolConfig.tokenMint,
        owner,
        true
      );

      if (!(await checkIfAccountExists(userTokenAccount, this.provider.connection))) {
        // throw `userTokenAccount doesn't exist : ${userTokenAccount.toBase58()}`
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            this.provider.wallet.publicKey,
            userTokenAccount,
            owner,
            poolConfig.tokenMint,
          )
        );
      }

      let withdrawTokenInstruction = await this.program.methods
        .withdrawToken({
          withdrawRequestId: withdrawRequestId
        })
        .accounts({
          owner: owner,
          receivingTokenAccount: userTokenAccount,
          perpetuals: this.perpetuals.publicKey,
          transferAuthority: poolConfig.transferAuthority,
          tokenVault: poolConfig.tokenVault,
          tokenVaultTokenAccount: poolConfig.tokenVaultTokenAccount,

          tokenStakeAccount: tokenStakeAccount,

          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          tokenMint: poolConfig.tokenMint,
        })
        .instruction();
      instructions.push(withdrawTokenInstruction)

    } catch (err) {
      console.log("perpClient withdrawTokenInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  cancelUnstakeRequest = async (
    owner: PublicKey,
    withdrawRequestId: number,
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let cancelUnstakeRequestInstruction = await this.program.methods
        .cancelUnstakeTokenRequest({
          withdrawRequestId: withdrawRequestId
        })
        .accounts({
          owner: owner,
          tokenVault: poolConfig.tokenVault,
          tokenStakeAccount: tokenStakeAccount,

          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId
        })
        .instruction();
      instructions.push(cancelUnstakeRequestInstruction)

    } catch (err) {
      console.log("perpClient cancelUnstakeRequestInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }


  collectTokenReward = async (
    owner: PublicKey,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let userTokenAccount = getAssociatedTokenAddressSync(
        poolConfig.tokenMint,
        owner,
        true
      );

       if (createUserATA && !(await checkIfAccountExists(userTokenAccount, this.provider.connection))) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userTokenAccount,
            publicKey,
            poolConfig.tokenMint
          )
        );
      }


      let collectTokenRewardInstruction = await this.program.methods
        .collectTokenReward({})
        .accounts({
          owner: owner,
          receivingTokenAccount: userTokenAccount,
          perpetuals: this.perpetuals.publicKey,
          transferAuthority: poolConfig.transferAuthority,
          tokenVault: poolConfig.tokenVault,
          tokenVaultTokenAccount: poolConfig.tokenVaultTokenAccount,
          tokenStakeAccount: tokenStakeAccount,

          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          tokenMint: poolConfig.tokenMint,
        })
        .instruction();
      instructions.push(collectTokenRewardInstruction)

    } catch (err) {
      console.log("perpClient collectTokenRewardInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  collectRevenue = async (
    owner: PublicKey,
    rewardSymbol: string,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
      const tokenStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("token_stake"), owner.toBuffer()],
        this.programId
      )[0];

      let userTokenAccount = getAssociatedTokenAddressSync(
        rewardCustodyMint,
        owner,
        true
      );

       if (createUserATA && !(await checkIfAccountExists(userTokenAccount, this.provider.connection))) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userTokenAccount,
            publicKey,
            rewardCustodyMint
          )
        );
      }


      let collectRevenueInstruction = await this.program.methods
        .collectRevenue({})
        .accounts({
          owner: owner,
          receivingRevenueAccount: userTokenAccount,
          perpetuals: this.perpetuals.publicKey,
          transferAuthority: poolConfig.transferAuthority,
          tokenVault: poolConfig.tokenVault,
          revenueTokenAccount: poolConfig.revenueTokenAccount,
          tokenStakeAccount: tokenStakeAccount,

          tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          receivingTokenMint: rewardCustodyMint,
        })
        .instruction();
      instructions.push(collectRevenueInstruction)

    } catch (err) {
      console.log("perpClient collectRevenueInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }


  /// FbnftReward Instructions
  initRewardVault = async (
    nftCount: BN,
    rewardSymbol: string,
    collectionMint: PublicKey,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey

    let instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      const fbNftProgramData = PublicKey.findProgramAddressSync(
        [this.programFbnftReward.programId.toBuffer()],
        new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
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

      let initRewardVault = await this.programFbnftReward.methods
          .initRewardVault({
            nftCount: nftCount
          })
          .accounts({
            admin: publicKey,
            transferAuthority: nftTransferAuthority,
            rewardVault: rewardVault,
            rewardMint: rewardCustodyMint,
            rewardTokenAccount: rewardTokenAccount,
            collectionMint: collectionMint,
            
            programData: fbNftProgramData,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY
          })
          .instruction();
        instructions.push(initRewardVault)

    } catch (err) {
      console.log("perpClient InitRewardVault error:: ", err);
      throw err;
    }

    return {
      instructions: [...instructions],
      additionalSigners
    };
  }

  distributeReward = async (
    rewardAmount: BN,
    rewardSymbol: string,
    poolConfig: PoolConfig,
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = this.provider.wallet.publicKey;

    const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey

    let instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let fundingAccount =  getAssociatedTokenAddressSync(
        rewardCustodyMint,
        publicKey,
        true
      );

      const rewardVault = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_vault")],
        this.programFbnftReward.programId
      )[0];

      const rewardTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_token_account")],
        this.programFbnftReward.programId
      )[0];

      let distributeReward = await this.programFbnftReward.methods
          .distributeRewards({
            rewardAmount: rewardAmount
          })
          .accounts({
            admin: publicKey,
            fundingAccount: fundingAccount,
            rewardVault: rewardVault,
            rewardTokenAccount: rewardTokenAccount,

            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction();
        instructions.push(distributeReward)

    } catch (err) {
      console.log("perpClient distributeReward error:: ", err);
      throw err;
    }

    return {
      instructions : [...instructions ],
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
    const rewardToken = poolConfig.getTokenFromSymbol(rewardSymbol)
    const rewardCustodyMint = rewardToken.mintKey

    let instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let nftTokenAccount =  getAssociatedTokenAddressSync(
        nftMint,
        publicKey,
        true
      );

      const metadataAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), nftMint.toBuffer()],
        METAPLEX_PROGRAM_ID
      )[0];

      let receivingTokenAccount =  getAssociatedTokenAddressSync(
        rewardCustodyMint,
        publicKey,
        true,
        rewardToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
      );

      if (createUserATA && !(await checkIfAccountExists(receivingTokenAccount, this.provider.connection))) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            receivingTokenAccount,
            publicKey,
            rewardCustodyMint,
            rewardToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
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
          tokenProgram: rewardToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
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

  collectAndDistributeFee = async (
    rewardSymbol: string,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end 
    nftTradingAccount?: PublicKey,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {
    let publicKey = this.provider.wallet.publicKey;

    const rewardToken = poolConfig.getTokenFromSymbol(rewardSymbol);
    const rewardCustodyMint = rewardToken.mintKey
    const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(rewardToken.mintKey))!;


   
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
        true,
        rewardToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
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

      const rewardVault = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_vault")],
        this.programFbnftReward.programId
      )[0];

      const rewardTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("reward_token_account")],
        this.programFbnftReward.programId
      )[0];

      let withdrawStakeInstruction = await this.programPerpComposability.methods
          .collectAndDistributeFee()
          .accounts({
            perpProgram: this.programId,
            owner: publicKey,
            receivingTokenAccount: receivingTokenAccount,
            transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: pool,
            feeCustody: rewardCustodyConfig.custodyAccount,
            flpStakeAccount: flpStakeAccount,
            feeCustodyTokenAccount: rewardCustodyConfig.tokenAccount,

            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority: this.eventAuthority.publicKey,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
            fbnftRewardsProgram: this.programFbnftReward.programId,
            rewardVault: rewardVault,
            rewardTokenAccount: rewardTokenAccount
          })
          .remainingAccounts(tradingAccount)
          .instruction();
        instructions.push(withdrawStakeInstruction)

    } catch (err) {
      console.log("perpClient withdrawStake error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  setTriggerPrice = async (
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    triggerPrice: ContractOraclePrice,
    isStopLoss: boolean,
    poolConfig: PoolConfig,
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    
    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

    let instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

    
      let setTriggerPrice = await this.program.methods
          .setTriggerPrice({
            triggerPrice: triggerPrice,
            isStopLoss: isStopLoss
          })
          .accounts({
            owner: publicKey,
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            position: positionAccount,
            market: marketAccount,
            targetCustody: targetCustodyConfig.custodyAccount,
            targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
            collateralCustody: collateralCustodyConfig.custodyAccount,
            collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
            
            eventAuthority: this.eventAuthority.publicKey,
            program: this.programId,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
          })
          .instruction();
        instructions.push(setTriggerPrice)

    } catch (err) {
      console.log("perpClient setTriggerPrice error:: ", err);
      throw err;
    }

    return {
      instructions : [...instructions ],
      additionalSigners
    };

  }

  forceClosePosition = async (
    positionAccount: PositionAccount,
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    isStopLoss: boolean,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false, // to get back WSOL=>SOL
    ephemeralSignerPubkey = undefined
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    
    let payerPubkey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    // let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

    let userReceivingTokenAccount : PublicKey;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    
    try {

      // reason not supporting SOL is 
      // 1) owner of the WSOL ATA has to be positionAccount.owner CHECK on contract
      // 2) while closing if we want to retract back the rent of ATA we need to be the owner
      
      // let wrappedSolAccount: Keypair | undefined;
      // if (collateralSymbol == 'SOL') {
      //   console.log("collateralSymbol === SOL", collateralSymbol);

      //   wrappedSolAccount = new Keypair();
      //   const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

      //   preInstructions = [
      //     SystemProgram.createAccount({
      //       fromPubkey: payerPubkey,
      //       newAccountPubkey: wrappedSolAccount.publicKey,
      //       lamports: lamports, //will this break for large amounts ??
      //       space: 165,
      //       programId: TOKEN_PROGRAM_ID,
      //     }),
      //     createInitializeAccount3Instruction(
      //       wrappedSolAccount.publicKey,
      //       NATIVE_MINT,
      //       positionAccount.owner,
      //     ),
      //   ];
      //   postInstructions = [
      //     createCloseAccountInstruction(
      //       wrappedSolAccount.publicKey,
      //       //  the rent SOL should be transferred back to the payer and not the owner of positionAccount
      //       //  this cannot be done - since the owner has to sign
      //       payerPubkey, 
      //       positionAccount.owner,
      //     ),
      //   ];
      //   additionalSigners.push(wrappedSolAccount);
      // } 
      // else {
        // OTHER TOKENS including WSOL,USDC,..
        userReceivingTokenAccount = getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey, // works for SOL and WSOL
          positionAccount.owner,
          false,
          poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              payerPubkey,
              userReceivingTokenAccount,
              positionAccount.owner,
              poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
              poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
            )
          );
        }
      // } 

      let forceClosePosition = await this.program.methods
          .forceClosePosition({
            privilege: Privilege.None, // currently passing inorder to not have any breakin change , will later remove from program
            isStopLoss: isStopLoss
          })
          .accounts({
            owner: positionAccount.owner,
            receivingAccount: userReceivingTokenAccount, //collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey) : userReceivingTokenAccount,
            transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            position: positionAccount.publicKey,
            market: marketAccount,
            targetCustody: targetCustodyConfig.custodyAccount,
            targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
            collateralCustody: collateralCustodyConfig.custodyAccount,
            collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
            collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
          
            tokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
            eventAuthority: this.eventAuthority.publicKey,
            program: this.programId,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
            receivingMint: collateralCustodyConfig.mintKey
          })
          // .remainingAccounts([...getNftAccounts(nftTradingAccount, nftReferralAccount, nftRebateTokenAccount, privilege)])
          .instruction();
        instructions.push(forceClosePosition)

        if (collateralSymbol == 'WSOL' && closeUsersWSOLATA) {
          const closeWsolATAIns = createCloseAccountInstruction(userReceivingTokenAccount, positionAccount.owner, positionAccount.owner);
          postInstructions.push(closeWsolATAIns);
        }

    } catch (err) {
      console.log("perpClient forceClosePosition error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  placeLimitOrder = async (
    targetSymbol: string,
    collateralSymbol: string,
    reserveSymbol: string,
    receiveSymbol: string,
    side: Side,
    limitPrice: ContractOraclePrice,
    reserveAmount: BN,
    sizeAmount: BN,
    stopLossPrice: ContractOraclePrice,
    takeProfitPrice: ContractOraclePrice,
    poolConfig: PoolConfig,
    skipBalanceChecks = false,
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const reserveCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(reserveSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const receiveCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(receiveSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)


    let userReserveTokenAccount = getAssociatedTokenAddressSync(
      poolConfig.getTokenFromSymbol(reserveSymbol).mintKey,
      publicKey,
      true,
      poolConfig.getTokenFromSymbol(reserveSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
    );

    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      // Create WSOL Token account and not ATA and close it in end 
      if (reserveSymbol == 'SOL') {
        console.log("reserveSymbol === SOL", reserveSymbol);

        const accCreationLamports =  this.minimumBalanceForRentExemptAccountLamports //(await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
        // console.log("accCreationLamports:", accCreationLamports)
        const lamports = reserveAmount.add(new BN(accCreationLamports)); // for account creation

        // CHECK BASIC SOL BALANCE
        if (!skipBalanceChecks) {
          let unWrappedSolBalance = new BN(await this.provider.connection.getBalance(publicKey));
          if (unWrappedSolBalance.lt(lamports)) {
                throw "Insufficient SOL Funds"
          }
        }
        if(!ephemeralSignerPubkey){
          wrappedSolAccount = new Keypair();
          additionalSigners.push(wrappedSolAccount);
        }
  

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            lamports: lamports.toNumber(),
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            NATIVE_MINT,
            publicKey,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            publicKey,
            publicKey,
          ),
        ];
        additionalSigners.push(wrappedSolAccount);

      } else {
        // for other tokens check if ATA and balance 
        if (!(await checkIfAccountExists(userReserveTokenAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }
        if (!skipBalanceChecks) {
          const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userReserveTokenAccount)).value.amount);
          if (tokenAccountBalance.lt(reserveAmount)) {
            throw `Insufficient Funds need more ${reserveAmount.sub(tokenAccountBalance)} tokens`
          }
        }
      }

      let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(publicKey, marketAccount)

      let placeLimitOrder = await this.program.methods
        .placeLimitOrder({
          limitPrice: limitPrice,
          reserveAmount: reserveAmount,
          sizeAmount: sizeAmount,
          stopLossPrice: stopLossPrice,
          takeProfitPrice: takeProfitPrice
        })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          fundingAccount: reserveSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReserveTokenAccount,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          reserveCustody: reserveCustodyConfig.custodyAccount,
          reserveOracleAccount: this.useExtOracleAccount ? reserveCustodyConfig.extOracleAccount : reserveCustodyConfig.intOracleAccount,
          reserveCustodyTokenAccount: reserveCustodyConfig.tokenAccount,
          receiveCustody: receiveCustodyConfig.custodyAccount,

          systemProgram: SystemProgram.programId,
          fundingTokenProgram: poolConfig.getTokenFromSymbol(reserveSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          fundingMint: reserveCustodyConfig.mintKey,
        })
        .instruction();

      instructions.push(placeLimitOrder)

    } catch (err) {
      console.log("perpClient placeLimitOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  editLimitOrder = async (
    targetSymbol: string,
    collateralSymbol: string,
    reserveSymbol: string,
    receiveSymbol: string,
    side: Side,
    orderId: number,
    limitPrice: ContractOraclePrice,
    sizeAmount: BN,
    stopLossPrice: ContractOraclePrice,
    takeProfitPrice: ContractOraclePrice,
    poolConfig: PoolConfig,
    createUserATA = true, 
    ephemeralSignerPubkey = undefined // for Squads wallet
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const reserveCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(reserveSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const receiveCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(receiveSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    let wrappedSolAccount: Keypair | undefined;
    let userReceivingTokenAccount : PublicKey;

    try {

      if (reserveSymbol == 'SOL') {
        const lamports = (this.minimumBalanceForRentExemptAccountLamports) //(await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

        if(!ephemeralSignerPubkey){
          wrappedSolAccount = new Keypair();
          additionalSigners.push(wrappedSolAccount);
        }

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: publicKey,
            newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            lamports: lamports, //will this break for large amounts ??
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            NATIVE_MINT,
            publicKey,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
            publicKey,
            publicKey,
          ),
        ];
      } else {

         userReceivingTokenAccount = getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(reserveSymbol).mintKey,
          publicKey,
          true,
          poolConfig.getTokenFromSymbol(reserveSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              publicKey,
              userReceivingTokenAccount,
              publicKey,
              poolConfig.getTokenFromSymbol(reserveSymbol).mintKey,
              poolConfig.getTokenFromSymbol(reserveSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
            )
          )
        }      

      }

      let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(publicKey, marketAccount)

      let editLimitOrder = await this.program.methods
        .editLimitOrder({
          orderId: orderId,
          limitPrice: limitPrice,
          sizeAmount: sizeAmount,
          stopLossPrice: stopLossPrice,
          takeProfitPrice: takeProfitPrice
        })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          receivingAccount: reserveSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey)  : userReceivingTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          reserveCustody: reserveCustodyConfig.custodyAccount,
          reserveOracleAccount: this.useExtOracleAccount ? reserveCustodyConfig.extOracleAccount : reserveCustodyConfig.intOracleAccount,
          reserveCustodyTokenAccount: reserveCustodyConfig.tokenAccount,
          receiveCustody: receiveCustodyConfig.custodyAccount,
          receivingTokenProgram: poolConfig.getTokenFromSymbol(reserveSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          receivingMint: poolConfig.getTokenFromSymbol(reserveSymbol).mintKey

        })
        .instruction();

      instructions.push(editLimitOrder)

    } catch (err) {
      console.log("perpClient editLimitOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  executeLimitOrder = async (
    userPubkey: PublicKey,
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    orderId: number,
    poolConfig: PoolConfig,
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let positionAccount = poolConfig.getPositionFromMarketPk(userPubkey, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(userPubkey, marketAccount)

      let executeLimitOrder = await this.program.methods
        .executeLimitOrder({
          orderId: orderId,
          privilege: privilege
        })
        .accounts({
          positionOwner: userPubkey,
          feePayer: publicKey,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

          systemProgram: SystemProgram.programId,
          collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          collateralMint: collateralCustodyConfig.mintKey,
        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();

      instructions.push(executeLimitOrder)

    } catch (err) {
      console.log("perpClient executeLimitOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  executeLimitWithSwap = async (
    userPubkey: PublicKey,
    targetSymbol: string,
    collateralSymbol: string,
    reserveSymbol: string,
    side: Side,
    orderId: number,
    poolConfig: PoolConfig,
    privilege: Privilege,
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const reserveCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(reserveSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let positionAccount = poolConfig.getPositionFromMarketPk(userPubkey, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(userPubkey, marketAccount)

      let executeLimitWithSwap = await this.program.methods
        .executeLimitWithSwap({
          orderId: orderId,
          privilege: privilege
        })
        .accounts({
          positionOwner: userPubkey,
          feePayer: publicKey,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          reserveCustody: reserveCustodyConfig.custodyAccount,
          reserveCustodyOracleAccount: this.useExtOracleAccount ? reserveCustodyConfig.extOracleAccount : reserveCustodyConfig.intOracleAccount,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,

          systemProgram: SystemProgram.programId,
          collateralTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          collateralMint: collateralCustodyConfig.mintKey,
        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();

      instructions.push(executeLimitWithSwap)

    } catch (err) {
      console.log("perpClient executeLimitWithSwap error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  placeTriggerOrder = async (
    targetSymbol: string,
    collateralSymbol: string,
    receiveSymbol: string,
    side: Side,
    triggerPrice: ContractOraclePrice,
    deltaSizeAmount: BN,
    isStopLoss: boolean,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const receivingCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(receiveSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(publicKey, marketAccount)

      let placeTriggerOrder = await this.program.methods
        .placeTriggerOrder({
          triggerPrice: triggerPrice,
          deltaSizeAmount: deltaSizeAmount,
          isStopLoss: isStopLoss
        })
        .accounts({
          owner: publicKey,
          feePayer: publicKey,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          receiveCustody: receivingCustodyConfig.custodyAccount,

          systemProgram: SystemProgram.programId,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .instruction();

      instructions.push(placeTriggerOrder)

    } catch (err) {
      console.log("perpClient placeTriggerOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  editTriggerOrder = async (
    targetSymbol: string,
    collateralSymbol: string,
    receiveSymbol: string,
    side: Side,
    orderId: number,
    triggerPrice: ContractOraclePrice,
    deltaSizeAmount: BN,
    isStopLoss: boolean,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const receivingCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(receiveSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(publicKey, marketAccount)

      let editTriggerOrder = await this.program.methods
        .editTriggerOrder({
          orderId: orderId,
          triggerPrice: triggerPrice,
          deltaSizeAmount: deltaSizeAmount,
          isStopLoss: isStopLoss
        })
        .accounts({
          owner: publicKey,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          receiveCustody: receivingCustodyConfig.custodyAccount,

          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .instruction();

      instructions.push(editTriggerOrder)

    } catch (err) {
      console.log("perpClient editTriggerOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }

  cancelTriggerOrder = async (
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    orderId: number,
    isStopLoss: boolean,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      let orderAccount = poolConfig.getOrderFromMarketPk(publicKey, marketAccount)

      let cancelTriggerOrder = await this.program.methods
        .cancelTriggerOrder({
          orderId: orderId,
          isStopLoss: isStopLoss
        })
        .accounts({
          owner: publicKey,
          order: orderAccount,

          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
        })
        .instruction();

      instructions.push(cancelTriggerOrder)

    } catch (err) {
      console.log("perpClient cancelTriggerOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  cancelAllTriggerOrders = async (
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let publicKey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let orderAccount = poolConfig.getOrderFromMarketPk(publicKey, marketAccount)
      let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

      let cancelAllTriggerOrders = await this.program.methods
        .cancelAllTriggerOrders()
        .accounts({
          position: positionAccount,
          order: orderAccount,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
        })
        .instruction();

      instructions.push(cancelAllTriggerOrders)
    } catch (err) {
      console.log("perpClient cancelAllTriggerOrders error:: ", err);
      throw err;
    }
    
    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  executeTriggerWithSwap = async (
    owner: PublicKey,
    targetSymbol: string,
    collateralSymbol: string,
    receivingSymbol: string,
    side: Side,
    orderId: number,
    isStopLoss: boolean,
    privilege: Privilege,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end
    ephemeralSignerPubkey = undefined, // for Squads wallet
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let payerPubkey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;
    const receivingCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(receivingSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let userReceivingTokenAccount: PublicKey;
    let userReceivingTokenAccountCollateral: PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    const collateralToken = poolConfig.getTokenFromSymbol(collateralSymbol)
    const receivingToken = poolConfig.getTokenFromSymbol(receivingSymbol);
    try {
      // Create WSOL Token account and not ATA and close it in end 
      if (false) {
        // console.log("collateralSymbol === SOL", collateralSymbol);
        // wrappedSolAccount = new Keypair();
        // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
        // console.log("accCreationLamports:", accCreationLamports)
        // const lamports = accCreationLamports; // for account creation

        // if(!ephemeralSignerPubkey){
        //   wrappedSolAccount = new Keypair();
        //   additionalSigners.push(wrappedSolAccount);
        // }

        // preInstructions = [
        //   SystemProgram.createAccount({
        //     fromPubkey: owner,
        //     newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
        //     lamports: lamports,
        //     space: 165,
        //     programId: TOKEN_PROGRAM_ID,
        //   }),
        //   createInitializeAccount3Instruction(
        //     (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
        //     NATIVE_MINT,
        //     owner,
        //   ),
        // ];
        // postInstructions = [
        //   createCloseAccountInstruction(
        //     (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
        //     publicKey,
        //     publicKey,
        //   ),
        // ];
        // additionalSigners.push(wrappedSolAccount);

      } else {
        userReceivingTokenAccount = getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(receivingSymbol).mintKey,
          owner,
          true,
          receivingToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              payerPubkey,
              userReceivingTokenAccount,
              owner,
              poolConfig.getTokenFromSymbol(receivingSymbol).mintKey
            )
          );
        }

        userReceivingTokenAccountCollateral = getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
          owner,
          true,
          poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccountCollateral, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              payerPubkey,
              userReceivingTokenAccountCollateral,
              owner,
              poolConfig.getTokenFromSymbol(collateralSymbol).mintKey
            )
          );
        }
      }

      let positionAccount = poolConfig.getPositionFromMarketPk(owner, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(owner, marketAccount)

      let custodyAccountMetas = [];
      let custodyOracleAccountMetas = [];
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

      let executeTriggerWithSwap = await this.program.methods
        .executeTriggerWithSwap({
          isStopLoss: isStopLoss,
          orderId: orderId,
          privilege: privilege
        })
        .accounts({
          positionOwner: owner,
          feePayer: payerPubkey,
          receivingAccount: userReceivingTokenAccount, // collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey)  : userReceivingTokenAccount,
          collateralAccount: userReceivingTokenAccountCollateral,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
          dispensingCustody: receivingCustodyConfig.custodyAccount,
          dispensingOracleAccount: this.useExtOracleAccount ? receivingCustodyConfig.extOracleAccount : receivingCustodyConfig.intOracleAccount,
          dispensingCustodyTokenAccount: receivingCustodyConfig.tokenAccount,
          // tokenProgram: TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          receivingMint: receivingCustodyConfig.mintKey,
          receivingTokenProgram: receivingToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID, //TODO: tokenType
          collateralMint: collateralCustodyConfig.mintKey,
          collateralTokenProgram: collateralToken.isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID //TODO: tokenType
        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();

      instructions.push(executeTriggerWithSwap)

    } catch (err) {
      console.log("perpClient executeTriggerWithSwap error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  executeTriggerOrder = async (
    owner: PublicKey,
    targetSymbol: string,
    collateralSymbol: string,
    side: Side,
    orderId: number,
    isStopLoss: boolean,
    privilege: Privilege,
    poolConfig: PoolConfig,
    createUserATA = true, //create new ATA for USER in the end
    ephemeralSignerPubkey = undefined, // for Squads wallet
    tokenStakeAccount = PublicKey.default,
    userReferralAccount = PublicKey.default,
    rebateTokenAccount = PublicKey.default,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let payerPubkey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    let userReceivingTokenAccount: PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      // Create WSOL Token account and not ATA and close it in end 
      if (false) {
        // console.log("collateralSymbol === SOL", collateralSymbol);
        // wrappedSolAccount = new Keypair();
        // const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
        // console.log("accCreationLamports:", accCreationLamports)
        // const lamports = accCreationLamports; // for account creation

        // if(!ephemeralSignerPubkey){
        //   wrappedSolAccount = new Keypair();
        //   additionalSigners.push(wrappedSolAccount);
        // }

        // preInstructions = [
        //   SystemProgram.createAccount({
        //     fromPubkey: owner,
        //     newAccountPubkey: (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
        //     lamports: lamports,
        //     space: 165,
        //     programId: TOKEN_PROGRAM_ID,
        //   }),
        //   createInitializeAccount3Instruction(
        //     (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
        //     NATIVE_MINT,
        //     owner,
        //   ),
        // ];
        // postInstructions = [
        //   createCloseAccountInstruction(
        //     (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey),
        //     publicKey,
        //     publicKey,
        //   ),
        // ];
        // additionalSigners.push(wrappedSolAccount);

      } else {
        userReceivingTokenAccount = getAssociatedTokenAddressSync(
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
          owner,
          true,
          poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              payerPubkey,
              userReceivingTokenAccount,
              owner,
              poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
              poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
            )
          );
        }
      }

      let positionAccount = poolConfig.getPositionFromMarketPk(owner, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(owner, marketAccount)

      let executeTriggerOrder = await this.program.methods
        .executeTriggerOrder({
          isStopLoss: isStopLoss,
          orderId: orderId,
          privilege: privilege
        })
        .accounts({
          feePayer: payerPubkey,
          positionOwner : owner,
          receivingAccount: userReceivingTokenAccount, // collateralSymbol == 'SOL' ? (ephemeralSignerPubkey ? ephemeralSignerPubkey : wrappedSolAccount.publicKey)  : userReceivingTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          targetCustody: targetCustodyConfig.custodyAccount,
          targetOracleAccount: this.useExtOracleAccount ? targetCustodyConfig.extOracleAccount : targetCustodyConfig.intOracleAccount,
          collateralCustody: collateralCustodyConfig.custodyAccount,
          collateralOracleAccount: this.useExtOracleAccount ? collateralCustodyConfig.extOracleAccount : collateralCustodyConfig.intOracleAccount,
          collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
          receivingTokenProgram: poolConfig.getTokenFromSymbol(collateralSymbol).isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID,
          eventAuthority: this.eventAuthority.publicKey,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
          receivingMint: collateralCustodyConfig.mintKey
        })
        .remainingAccounts([...getReferralAccounts(tokenStakeAccount, userReferralAccount, rebateTokenAccount, privilege)])
        .instruction();

      instructions.push(executeTriggerOrder)

    } catch (err) {
      console.log("perpClient executeTriggerOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };

  }


  migrateTriggerOrder = async (
    owner: PublicKey,
    marketAccount: PublicKey,
    poolConfig: PoolConfig,
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let payerPubkey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      let positionAccount = poolConfig.getPositionFromMarketPk(owner, marketAccount)
      let orderAccount = poolConfig.getOrderFromMarketPk(owner, marketAccount)

      let migrateTriggerOrder = await this.program.methods
        .migrateTriggerOrder()
        .accounts({
          owner: owner,
          feePayer: payerPubkey,
          position: positionAccount,
          order: orderAccount,
          market: marketAccount,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      instructions.push(migrateTriggerOrder)

    } catch (err) {
      console.log("perpClient migrateTriggerOrder error:: ", err);
      throw err;
    }

    return {
      instructions: [...preInstructions, ...instructions, ...postInstructions],
      additionalSigners
    };
  }

  setLpTokenPrice = async (
    poolConfig: PoolConfig
  ): Promise<{ instructions: TransactionInstruction[], additionalSigners: Signer[] }> => {

    let instructions: TransactionInstruction[] = [];
    let additionalSigners: Signer[] = [];

    try {

      let custodyAccountMetas = [];
      let custodyOracleAccountMetas = [];
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
      }

      for (const market of poolConfig.markets) {
        markets.push({
          pubkey: market.marketAccount,
          isSigner: false,
          isWritable: false,
        });
      }

      let setLpTokenPriceInstruction = await this.program.methods
        .setLpTokenPrice({})
        .accounts({
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          lpTokenMint: poolConfig.stakedLpTokenMint,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction()
      instructions.push(setLpTokenPriceInstruction)

    } catch (err) {
      console.log("perpClient setLpTokenPriceInstruction error:: ", err);
      throw err;
    }

    return {
      instructions: [...instructions],
      additionalSigners
    };
  };


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

  public async sendTransactionV3(
    ixs: TransactionInstruction[],
    opts: SendTransactionOpts = {},
  ): Promise<{
    signature: string;
    versionedTransaction: VersionedTransaction;
}> {
    return await sendTransactionV3(
      this.program.provider as AnchorProvider,
      ixs,
      {
        postSendTxCallback: this.postSendTxCallback,
        prioritizationFee: this.prioritizationFee,
        ...opts,
      },
    );
  }

}

