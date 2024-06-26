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
} from "@solana/spl-token";

import { sha256 } from "js-sha256";
import { encode } from "bs58";
import { PoolAccount } from "./PoolAccount";
import { PositionAccount } from "./PositionAccount";
import { AddLiquidityAmountAndFee, BorrowRateParams, Custody, DEFAULT_POSITION, EntryPriceAndFee, ExitPriceAndFee, Fees, OracleParams, Permissions, Position, PricingParams, RemoveCollateralData, RemoveLiquidityAmountAndFee, Side, SwapAmountAndFees, TokenRatios, isVariant, MinAndMaxPrice, FeesAction, FeesMode, RatioFee, PermissionlessPythCache, OpenPositionParams, ContractOraclePrice, Privilege, FlpStake, } from "./types";
import { OraclePrice } from "./OraclePrice";
import { CustodyAccount } from "./CustodyAccount";
import { Perpetuals } from "./idl/perpetuals";
import { PerpComposability } from "./idl/perp_composability";

import { IDL } from './idl/perpetuals';
import { IDL as PerpComposabilityIDL } from './idl/perp_composability';
import { IDL as FbNftIDL } from './idl/fbnft_rewards';

import { SendTransactionOpts, sendTransaction } from "./utils/rpc";
import { MarketConfig, PoolConfig, Token } from "./PoolConfig";
import { checkIfAccountExists, checkedDecimalCeilMul, checkedDecimalMul, getUnixTs, nativeToUiDecimals, scaleToExponent, uiDecimalsToNative } from "./utils";
import { BPS_DECIMALS, BPS_POWER, LP_DECIMALS, RATE_DECIMALS, USD_DECIMALS, BN_ZERO, RATE_POWER, METAPLEX_PROGRAM_ID, BN_ONE, ORACLE_EXPONENT } from "./constants";
import BigNumber from "bignumber.js";
import { max } from "bn.js";
import { pythPriceServiceConnection } from "./backupOracle";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import * as nacl from "tweetnacl";
import { MarketAccount } from "./MarketAccount";
import { getNftAccounts } from "./utils/getNftAccounts";
import { FbnftRewards } from "./idl/fbnft_rewards";

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

  admin: PublicKey;
  programId: PublicKey;
  composabilityProgramId: PublicKey;

  // pdas
  multisig: { publicKey: PublicKey; bump: number };
  authority: { publicKey: PublicKey; bump: number };
  perpetuals: { publicKey: PublicKey; bump: number };
  addressLookupTables: AddressLookupTableAccount[] = [];

  eventAuthority : { publicKey: PublicKey; bump: number };

  private postSendTxCallback?: ({ txid }) => void;
  private prioritizationFee: number;
  private useCustomOracle: boolean;
  private txConfirmationCommitment: Commitment;
  
  constructor(provider: AnchorProvider, programId: PublicKey, composabilityProgramId: PublicKey, fbNftRewardProgramId: PublicKey, opts: PerpClientOptions, useCustomOracle = false) {
   
    this.provider = provider;
    setProvider(provider);

    this.program = new Program(IDL, programId);
    this.programPerpComposability = new Program(PerpComposabilityIDL, composabilityProgramId);
    this.programFbnftReward = new Program(FbNftIDL, fbNftRewardProgramId);
    this.programId = programId;
    this.composabilityProgramId = composabilityProgramId;
    this.admin = this.provider.wallet.publicKey;
    this.multisig = this.findProgramAddress("multisig");
    this.authority = this.findProgramAddress("transfer_authority");
    this.perpetuals = this.findProgramAddress("perpetuals");
    this.eventAuthority = this.findProgramAddress("__event_authority");

    this.prioritizationFee = opts?.prioritizationFee || 0;
    this.useCustomOracle = useCustomOracle;
    this.postSendTxCallback = opts?.postSendTxCallback;
    this.txConfirmationCommitment = opts?.txConfirmationCommitment ?? 'processed'

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

  getPosition = async (postionKey: PublicKey) => {
    return this.program.account.position.fetch(postionKey);
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
      {memcmp: {offset: 72, bytes: data}},
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
        targetOracleAccount: this.useCustomOracle ? targetCustodyConfig.customOracleAddress : targetCustodyConfig.oracleAddress,
        collateralCustody: collateralCustodyConfig.custodyAccount,
        collateralOracleAccount: this.useCustomOracle ? collateralCustodyConfig.customOracleAddress : collateralCustodyConfig.oracleAddress,
        eventAuthority: this.eventAuthority.publicKey,
        program: this.program.programId,
        ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
      })
      .instruction();
  };

  ///////
  /// UI/SDK INSTRUCTIONS HELPERS
  

  // - handle SOL wrapping to WSOL and create a ATA - DONE
  // - Balance checks - DONE
  // - ATA check - else create  - DONE 
  // - for close Accounts - NOT NEEDED
  addLiquidity = async (
    payTokenSymbol: string,
    tokenAmountIn: BN,
    minLpAmountOut: BN, // give this value based on slippage 
    poolConfig: PoolConfig,
    skipBalanceChecks = false
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

    try {

      let userPayingTokenAccount = await getAssociatedTokenAddress(
        payTokenCustodyConfig.mintKey,
        publicKey
      );

      let lpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.lpTokenMint,
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
          pubkey: this.useCustomOracle ? custody.customOracleAddress : custody.oracleAddress,
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
            poolConfig.lpTokenMint
          )
        );
      }

    // FOR SOL :  Create WSOL Token account and not ATA and close it in end 
    if (payTokenSymbol == 'SOL') {
      console.log("payTokenSymbol === SOL", payTokenSymbol);
      wrappedSolAccount = new Keypair();
      const accCreationLamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation
      console.log("accCreationLamports:", accCreationLamports)
      const lamports = tokenAmountIn.add(new BN(accCreationLamports)); // for account creation

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
        if (!(await checkIfAccountExists(userPayingTokenAccount, this.provider.connection))) {
          throw "Insufficient Funds , token Account doesn't exist"
        }
        if (!skipBalanceChecks) {
          const tokenAccountBalance = new BN((await this.provider.connection.getTokenAccountBalance(userPayingTokenAccount)).value.amount);
          if (tokenAccountBalance.lt(tokenAmountIn)) {
            throw `Insufficient Funds need more ${tokenAmountIn.sub(tokenAccountBalance)} tokens`
          }
        }
    }//else
      
    // // breakpoint fix:
    //   let poolAumInstruction = await this.program.methods
    //     .updatePoolAum()
    //     .accounts({
    //       payer: publicKey,
    //       perpetuals: poolConfig.perpetuals,
    //       pool: poolConfig.poolAddress,
    //       ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
    //     })
    //     .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...custodyCustomOracles])
    //     .instruction();

    //   preInstructions.push(poolAumInstruction)

      let instruction = await this.program.methods
        .addLiquidity({
          amountIn: tokenAmountIn,
          minLpAmountOut
        })
        .accounts({
          owner: publicKey,
          fundingAccount: payTokenSymbol == 'SOL' ? wrappedSolAccount.publicKey : userPayingTokenAccount, // user token account for custody token account
          lpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          custody: payTokenCustodyConfig.custodyAccount,
          custodyOracleAccount: this.useCustomOracle ? payTokenCustodyConfig.customOracleAddress : payTokenCustodyConfig.oracleAddress,
          custodyTokenAccount: payTokenCustodyConfig.tokenAccount,
          lpTokenMint: poolConfig.lpTokenMint,
          eventAuthority : this.eventAuthority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
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

  // - handle SOL wrapping to WSOL and create a ATA - NOT NEEDED
  // - Balance checks - DONE
  // - ATA check - else create  - DONE 
  // - for LP close Accounts - DONE
  // - if out token WSOL -> unwrap to SOL - DONE
  removeLiquidity = async (
    recieveTokenSymbol: string,
    liquidityAmountIn: BN,
    minTokenAmountOut: BN, // give this value based on slippage 
    poolConfig: PoolConfig,
    closeLpATA = false,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false // to get back WSOL=>SOL
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {

    const recieveTokenCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(recieveTokenSymbol).mintKey))!;
    if (!recieveTokenCustodyConfig) {
      throw "recieveTokenCustody not found";
    }
    let publicKey = this.provider.wallet.publicKey;

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try { 
      let lpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.lpTokenMint,
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
          pubkey: this.useCustomOracle ? custody.customOracleAddress : custody.oracleAddress,
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
      } // else


      // // breakpoint fix:
      // let poolAumInstruction = await this.program.methods
      //   .updatePoolAum()
      //   .accounts({
      //     payer: publicKey,
      //     perpetuals: poolConfig.perpetuals,
      //     pool: poolConfig.poolAddress,
      //     ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
      //   })
      //   .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...custodyCustomOracles])
      //   .instruction();

      // preInstructions.push(poolAumInstruction)

      console.log("liquidityAmountIn", liquidityAmountIn.toString());

      let removeLiquidityTx = await this.program.methods
        .removeLiquidity({
          lpAmountIn: liquidityAmountIn,
          minAmountOut: minTokenAmountOut
        })
        .accounts({
          owner: publicKey,
          receivingAccount: recieveTokenSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount, // user token account for custody token account
          lpTokenAccount,
          transferAuthority: poolConfig.transferAuthority,
          perpetuals: poolConfig.perpetuals,
          pool: poolConfig.poolAddress,
          custody: recieveTokenCustodyConfig.custodyAccount,
          custodyOracleAccount: this.useCustomOracle ? recieveTokenCustodyConfig.customOracleAddress : recieveTokenCustodyConfig.oracleAddress,
          custodyTokenAccount: recieveTokenCustodyConfig.tokenAccount,
          lpTokenMint: poolConfig.lpTokenMint,
          eventAuthority : this.eventAuthority.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          program: this.programId,
          ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
        })
        .remainingAccounts([...custodyAccountMetas, ...custodyOracleAccountMetas, ...markets])
        .instruction();
      instructions.push(removeLiquidityTx)

      if (closeLpATA) {
        const closeInx = createCloseAccountInstruction(lpTokenAccount, publicKey, publicKey);
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
    nftTradingAccount: PublicKey,
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
            tradingAccount: nftTradingAccount,
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

  createNftTradingAccount = async (
    nftMint: PublicKey,
    owner : PublicKey,
    poolConfig: PoolConfig
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

      let nftTokenAccount = await getAssociatedTokenAddress(
        nftMint,
        owner
      );

      let createNftTradingAccountInstruction = await this.program.methods
          .createTradingAccount({
            collectionIndex: 0
          })
          .accounts({
            owner: publicKey,
            feePayer: publicKey,
            perpetuals: poolConfig.perpetuals,
            nftMint: nftMint,
            nftTokenAccount: nftTokenAccount,
            tradingAccount: nftTradingAccount,
            metadataAccount: metadataAccount,
            systemProgram: SystemProgram.programId
          })
          .instruction();
        instructions.push(createNftTradingAccountInstruction)

    } catch (err) {
      console.log("perpClient createNftAccount error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
      additionalSigners
    };

  }

  updateNftAccount = async (
    nftMint: PublicKey,
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
        publicKey
      );

      let updateNftTradingAccountInstruction = await this.program.methods
          .updateTradingAccount({})
          .accounts({
            owner: publicKey,
            feePayer: publicKey,
            nftTokenAccount: nftTokenAccount,
            referralAccount: nftReferralAccount,
            tradingAccount: nftTradingAccount
          })
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
  
  // admin Instruction
  initStake = async (
    stakingFeeShareBps: BN,
    rewardSymbol: string,
    poolConfig: PoolConfig
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      
      const lpTokenMint = poolConfig.lpTokenMint;
      const stakedLpTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("staked_lp_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
        this.programId
      )[0];

      const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

      let initStakeInstruction = await this.program.methods
          .initStaking({
            stakingFeeShareBps: stakingFeeShareBps
          })
          .accounts({
            admin: publicKey,
            multisig: this.multisig.publicKey,
            transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            custody: rewardCustodyConfig.custodyAccount,
            lpTokenMint: lpTokenMint,
            stakedLpTokenAccount: stakedLpTokenAccount,

            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY

          })
          .instruction();
        instructions.push(initStakeInstruction)

    } catch (err) {
      console.log("perpClient InitStaking error:: ", err);
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
      
      const lpTokenMint = poolConfig.lpTokenMint;
      const poolFlpTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("staked_lp_token_account"), poolConfig.poolAddress.toBuffer(), lpTokenMint.toBuffer()],
        this.programId
      )[0];

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), owner.toBuffer(), poolConfig.poolAddress.toBuffer()],
        this.programId
      )[0];

      let userLpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.lpTokenMint,
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
            fundingFlpTokenAccount: userLpTokenAccount,
            transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            flpStakeAccount: flpStakeAccount,
            poolFlpTokenAccount: poolFlpTokenAccount,

            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority: this.eventAuthority.publicKey,

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

  refreshStakeWithAllFlpStakeAccounts = async (poolConfig: PoolConfig,) => {
    const flpStakeAccounts = ((await this.program.account.flpStake.all()))
    console.log("total no of flpStakeAccounts: ",flpStakeAccounts.length)
    const maxFlpStakeAccountLength = 32 - (4 + poolConfig.custodies.length);
    const pendingActivationAccounts: PublicKey[] = [];

    for (const flpStakeAccount of flpStakeAccounts) {
      const account: FlpStake = flpStakeAccount.account;
      // if(account.stakeStats.pendingActivation.gt(BN_ZERO)) {
        pendingActivationAccounts.push(flpStakeAccount.publicKey);
      // }
    }

    const refreshStakeInstructions: TransactionInstruction[] = [];

    console.log("total no of pendingActivationAccounts: ",pendingActivationAccounts.length)
    
    for (let i = 0; i < pendingActivationAccounts.length; i += maxFlpStakeAccountLength) {
      const batch = pendingActivationAccounts.slice(i, i + maxFlpStakeAccountLength);
      const  instruction  = await this.refreshStake('USDC', poolConfig, batch);
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
          })
          .remainingAccounts([...custodyAccountMetas, ...flpStakeAccountMetas])
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
    poolConfig: PoolConfig
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {


      const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
      const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

      const pool = poolConfig.poolAddress
      const feeDistributionTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("custody_token_account"), pool.toBuffer(), rewardCustodyMint.toBuffer()],
        this.programId
      )[0];
      
      const lpTokenMint = poolConfig.lpTokenMint;

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
            feeDistributionTokenAccount: feeDistributionTokenAccount,

          })
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
      // const lpTokenMint = poolConfig.lpTokenMint;
      // const poolFlpTokenAccount = PublicKey.findProgramAddressSync(
      //   [Buffer.from("staked_lp_token_account"), pool.toBuffer(), lpTokenMint.toBuffer()],
      //   this.programId
      // )[0];

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.programId
      )[0];

      // let userLpTokenAccount = await getAssociatedTokenAddress(
      //   poolConfig.lpTokenMint,
      //   publicKey
      // );

      let unstakeRequestInstruction = await this.program.methods
          .unstakeRequest({
            unstakeAmount: unstakeAmount
          })
          .accounts({
            owner: publicKey,
            // fundingFlpTokenAccount: userLpTokenAccount,
            // transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: pool,
            flpStakeAccount: flpStakeAccount,
            // poolFlpTokenAccount: poolFlpTokenAccount,

            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority: this.eventAuthority.publicKey,

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

  // deactiveStake = async (
  //   rewardSymbol: string,
  //   poolName: string,
  //   poolConfig: PoolConfig
  // ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
  //   let publicKey = this.provider.wallet.publicKey;

  //   let preInstructions: TransactionInstruction[] = [];
  //   let instructions: TransactionInstruction[] = [];
  //   let postInstructions: TransactionInstruction[] = [];
  //   const additionalSigners: Signer[] = [];

  //   try {
      
  //     const rewardCustodyMint = poolConfig.getTokenFromSymbol(rewardSymbol).mintKey
  //     const rewardCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;

  //     const pool = this.getPoolKey(poolName)
  //     const feeDistributionTokenAccount = PublicKey.findProgramAddressSync(
  //       [Buffer.from("custody_token_account"), pool.toBuffer(), rewardCustodyMint.toBuffer()],
  //       this.programId
  //     )[0];

  //     let custodyAccountMetas = [];
  //     let flpStakeAccountMetas = []; //todo: get all flpStakeAccounts that need to be activated

  //     // const flpStakeAccountKey = new PublicKey('C3jFMGLyzTXnURjPDp4NdyAMtZpZsYiUEbJ55wEGSF5j')
  //     // flpStakeAccountMetas.push({
  //     //   pubkey: flpStakeAccountKey,
  //     //   isSigner: false,
  //     //   isWritable: true,
  //     // });

  //     for (const custody of poolConfig.custodies) {
  //       custodyAccountMetas.push({
  //         pubkey: custody.custodyAccount,
  //         isSigner: false,
  //         isWritable: false,
  //       });
  //     }
      
  //     let deactivateStakeInstruction = await this.program.methods
  //         .deactivateStake({})
  //         .accounts({
  //           perpetuals: this.perpetuals.publicKey,
  //           pool: pool,
  //           rewardCustody: rewardCustodyConfig.custodyAccount,
  //           feeDistributionTokenAccount: feeDistributionTokenAccount,

  //         })
  //         .remainingAccounts([...custodyAccountMetas, ...flpStakeAccountMetas])
  //         .instruction();
  //       instructions.push(deactivateStakeInstruction)

  //   } catch (err) {
  //     console.log("perpClient deactivateStaking error:: ", err);
  //     throw err;
  //   }

  //   return {
  //     instructions : [...preInstructions, ...instructions ,...postInstructions],
  //     additionalSigners
  //   };

  // }


  withdrawStake = async (
    poolConfig: PoolConfig,
    pendingActivation = true,
    deactivated = true,
    createUserLPTA = true, //create new ATA for USER in the end 
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      const lpTokenMint = poolConfig.lpTokenMint;
      const pool = poolConfig.poolAddress
      const poolFlpTokenAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("staked_lp_token_account"), pool.toBuffer(), lpTokenMint.toBuffer()],
        this.program.programId
      )[0];

      const flpStakeAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("stake"), publicKey.toBuffer(), pool.toBuffer()],
        this.program.programId
      )[0];

      let userLpTokenAccount = await getAssociatedTokenAddress(
        poolConfig.lpTokenMint,
        publicKey
      );

      if (createUserLPTA && !(await checkIfAccountExists(userLpTokenAccount, this.provider.connection))) {
        preInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userLpTokenAccount,
            publicKey,
            poolConfig.lpTokenMint
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
            receivingFlpTokenAccount: userLpTokenAccount,
            transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: pool,
            flpStakeAccount: flpStakeAccount,
            poolFlpTokenAccount: poolFlpTokenAccount,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority: this.eventAuthority.publicKey,
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
    nftTradingAccount?: PublicKey,
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
        publicKey
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

      let fundingAccount = await getAssociatedTokenAddress(
        rewardCustodyMint,
        publicKey
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
            targetOracleAccount: this.useCustomOracle ? targetCustodyConfig.customOracleAddress : targetCustodyConfig.oracleAddress,
            collateralCustody: collateralCustodyConfig.custodyAccount,
            collateralOracleAccount: this.useCustomOracle ? collateralCustodyConfig.customOracleAddress : collateralCustodyConfig.oracleAddress,
            
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
    // nftTradingAccount: PublicKey,
    // nftReferralAccount: PublicKey,
    // nftRebateTokenAccount: PublicKey,
    // privilege: Privilege,
    createUserATA = true, //create new ATA for USER in the end 
    closeUsersWSOLATA = false // to get back WSOL=>SOL
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    
    let payerPubkey = this.provider.wallet.publicKey;

    const targetCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(targetSymbol).mintKey))!;
    const collateralCustodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(collateralSymbol).mintKey))!;

    const marketAccount = poolConfig.getMarketPk(targetCustodyConfig.custodyAccount, collateralCustodyConfig.custodyAccount, side)

    // let positionAccount = poolConfig.getPositionFromMarketPk(publicKey, marketAccount)

    let userReceivingTokenAccount : PublicKey;
    let wrappedSolAccount: Keypair | undefined;
    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {

      if (collateralSymbol == 'SOL') {
        console.log("collateralSymbol === SOL", collateralSymbol);

        wrappedSolAccount = new Keypair();
        const lamports = (await getMinimumBalanceForRentExemptAccount(this.provider.connection)); // for account creation

        preInstructions = [
          SystemProgram.createAccount({
            fromPubkey: payerPubkey,
            newAccountPubkey: wrappedSolAccount.publicKey,
            lamports: lamports, //will this break for large amounts ??
            space: 165,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeAccount3Instruction(
            wrappedSolAccount.publicKey,
            NATIVE_MINT,
            positionAccount.owner,
          ),
        ];
        postInstructions = [
          createCloseAccountInstruction(
            wrappedSolAccount.publicKey,
            positionAccount.owner,
            positionAccount.owner,
          ),
        ];
        additionalSigners.push(wrappedSolAccount);
      } else {
        // OTHER TOKENS including WSOL,USDC,..
        userReceivingTokenAccount = await getAssociatedTokenAddress(
          poolConfig.getTokenFromSymbol(collateralSymbol).mintKey,
          positionAccount.owner
        );

        if (createUserATA && !(await checkIfAccountExists(userReceivingTokenAccount, this.provider.connection))) {
          preInstructions.push(
            createAssociatedTokenAccountInstruction(
              payerPubkey,
              userReceivingTokenAccount,
              positionAccount.owner,
              poolConfig.getTokenFromSymbol(collateralSymbol).mintKey
            )
          );
        }
      } 

      let forceClosePosition = await this.program.methods
          .forceClosePosition({
            privilege: Privilege.None, // currently passing inorder to not have any breakin change , will later remove from program
            isStopLoss: isStopLoss
          })
          .accounts({
            owner: positionAccount.owner,
            receivingAccount: collateralSymbol == 'SOL' ? wrappedSolAccount.publicKey : userReceivingTokenAccount,
            transferAuthority: poolConfig.transferAuthority,
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            position: positionAccount.publicKey,
            market: marketAccount,
            targetCustody: targetCustodyConfig.custodyAccount,
            targetOracleAccount: this.useCustomOracle ? targetCustodyConfig.customOracleAddress : targetCustodyConfig.oracleAddress,
            collateralCustody: collateralCustodyConfig.custodyAccount,
            collateralOracleAccount: this.useCustomOracle ? collateralCustodyConfig.customOracleAddress : collateralCustodyConfig.oracleAddress,
            collateralCustodyTokenAccount: collateralCustodyConfig.tokenAccount,
          
            tokenProgram: TOKEN_PROGRAM_ID,
            eventAuthority: this.eventAuthority.publicKey,
            program: this.programId,
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY
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
            custodyOracleAccount: this.useCustomOracle ? targetCustodyConfig.customOracleAddress : targetCustodyConfig.oracleAddress,
            collateralCustody: collateralCustodyConfig.custodyAccount,
            collateralOracleAccount: this.useCustomOracle ? collateralCustodyConfig.customOracleAddress : collateralCustodyConfig.oracleAddress,
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

  protocolWithdrawFees = async (
    rewardSymbol: string,
    poolConfig: PoolConfig
  ) => {
    let publicKey = this.provider.wallet.publicKey;

    const custodyConfig = poolConfig.custodies.find(i => i.mintKey.equals(poolConfig.getTokenFromSymbol(rewardSymbol).mintKey))!;
    
    const receivingTokenAccount = await getAssociatedTokenAddress(
      poolConfig.getTokenFromSymbol(rewardSymbol).mintKey,
      publicKey
    );

    let instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];
    
    try {
      
      let withdrawFeesIx = await this.program.methods
          .withdrawFees({})
          .accounts({
            admin: publicKey,
            multisig: this.multisig.publicKey,
            transferAuthority: this.authority.publicKey,
            perpetuals: this.perpetuals.publicKey,
            pool: poolConfig.poolAddress,
            custody: custodyConfig.custodyAccount,
            custodyTokenAccount: custodyConfig.tokenAccount,
            receivingTokenAccount: receivingTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID
          })
          .instruction();

      instructions.push(withdrawFeesIx)


    } catch (err) {
      console.log("perpClient setPool error:: ", err);
      throw err;
    }

    return {
      instructions: [...instructions],
      additionalSigners
    };
  }

  setPermissions = async (
    permissions: Permissions,
  ): Promise< { instructions : TransactionInstruction[] , additionalSigners: Signer[]}> => {
    let publicKey = this.provider.wallet.publicKey;

    let preInstructions: TransactionInstruction[] = [];
    let instructions: TransactionInstruction[] = [];
    let postInstructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    try {
      
    
      let setPermissionsInstruction = await this.program.methods
          .setPermissions({
            permissions: permissions,
          })
          .accounts({
            admin: publicKey,
            multisig: this.multisig.publicKey,
            perpetuals: this.perpetuals.publicKey

          })
          .instruction();
        instructions.push(setPermissionsInstruction)

    } catch (err) {
      console.log("perpClient setPool error:: ", err);
      throw err;
    }

    return {
      instructions : [...preInstructions, ...instructions ,...postInstructions],
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

}


