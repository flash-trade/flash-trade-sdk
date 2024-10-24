import dotenv from "dotenv";
import {
  BN_ZERO,
  BPS_DECIMALS,
  CustodyAccount,
  getUnixTs,
  OraclePrice,
  PerpetualsClient,
  PoolAccount,
  PoolConfig,
  PoolDataClient,
  PositionAccount,
  Privilege,
  Side,
  uiDecimalsToNative,
} from "flash-sdk";
dotenv.config();
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  TransactionInstruction,
  Signer,
  PublicKey,
  ComputeBudgetProgram,
  Connection,
} from "@solana/web3.js";
import { getAssociatedTokenAddressSync, getMint } from "@solana/spl-token";
import {
  PriceData,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";

export const RPC_URL = process.env.RPC_URL;

export const POOL_CONFIG = PoolConfig.fromIdsByName("Crypto.1", "mainnet-beta");

const connectionFromPyth = new Connection(process.env.PYTHNET_URL!);

const provider: AnchorProvider = AnchorProvider.local(RPC_URL, {
  commitment: "processed",
  preflightCommitment: "processed",
  skipPreflight: true,
});

export const flashClient = new PerpetualsClient(
  provider,
  POOL_CONFIG.programId,
  POOL_CONFIG.perpComposibilityProgramId,
  POOL_CONFIG.fbNftRewardProgramId,
  POOL_CONFIG.rewardDistributionProgram.programId,
  {
    prioritizationFee: 0,
  }
);

const addLiquidityAndStake = async () => {
  const usdcInputAmount = new BN(1_000_000);
  const usdcCustody = POOL_CONFIG.custodies.find((c) => c.symbol === "USDC")!;
  const slippageBps: number = 800; // 0.8%
  let instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  await flashClient.loadAddressLookupTable(POOL_CONFIG);

  const { amount: minLpAmountOut, fee } =
    await flashClient.getAddLiquidityAmountAndFee(
      usdcInputAmount,
      POOL_CONFIG.poolAddress,
      usdcCustody.custodyAccount,
      POOL_CONFIG
    );

  const minLpAmountOutAfterSlippage = minLpAmountOut
    .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
    .div(new BN(10 ** BPS_DECIMALS));

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 400_000,
  }); // addLiquidity

  const addLiquidityAndStakeData = await flashClient.addLiquidityAndStake(
    "USDC",
    usdcInputAmount,
    minLpAmountOutAfterSlippage,
    POOL_CONFIG
  );
  instructions.push(...addLiquidityAndStakeData.instructions);
  additionalSigners.push(...addLiquidityAndStakeData.additionalSigners);

  const flpStakeAccountPK = PublicKey.findProgramAddressSync(
    [
      Buffer.from("stake"),
      flashClient.provider.publicKey.toBuffer(),
      POOL_CONFIG.poolAddress.toBuffer(),
    ],
    POOL_CONFIG.programId
  )[0];

  const refreshStakeInstruction = await flashClient.refreshStake(
    "USDC",
    POOL_CONFIG,
    [flpStakeAccountPK]
  );

  instructions.push(refreshStakeInstruction);

  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);

  console.log("addLiquidityAndStake trx :>> ", trxId);
};

const addCompoundingLiquidity = async () => {
  const usdcInputAmount = new BN(1_000_000);
  const usdcCustody = POOL_CONFIG.custodies.find((c) => c.symbol === "USDC")!;
  const slippageBps: number = 800; // 0.8%
  let instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  await flashClient.loadAddressLookupTable(POOL_CONFIG);

  const { amount: minLpAmountOut, fee } =
    await flashClient.getSFLPAddLiquidityAmountAndFee(
      usdcInputAmount,
      POOL_CONFIG.poolAddress,
      usdcCustody.custodyAccount,
      POOL_CONFIG
    );

  const minLpAmountOutAfterSlippage = minLpAmountOut
    .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
    .div(new BN(10 ** BPS_DECIMALS));

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 400_000,
  }); // addLiquidity

  const addCompoundingLiquidityData = await flashClient.addCompoundingLiquidity(
    usdcInputAmount,
    minLpAmountOutAfterSlippage,
    "USDC",
    usdcCustody.mintKey,
    POOL_CONFIG
  );

  instructions.push(...addCompoundingLiquidityData.instructions);
  additionalSigners.push(...addCompoundingLiquidityData.additionalSigners);

  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);

  console.log("addCompoundingLiquidity trx :>> ", trxId);
};

const removeSflpLiquidity = async () => {
  const usdcCustody = POOL_CONFIG.custodies.find((c) => c.symbol === "USDC")!;
  const slippageBps: number = 800; // 0.8%
  let instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  await flashClient.loadAddressLookupTable(POOL_CONFIG);

  const flpStakeAccountPK = PublicKey.findProgramAddressSync(
    [
      Buffer.from("stake"),
      flashClient.provider.publicKey.toBuffer(),
      POOL_CONFIG.poolAddress.toBuffer(),
    ],
    POOL_CONFIG.programId
  )[0];

  const flpStakeAccount = await flashClient.program.account.flpStake.fetch(
    flpStakeAccountPK
  );

  const flpWithPendingAndActive =
    flpStakeAccount?.stakeStats.activeAmount.add(
      flpStakeAccount?.stakeStats.pendingActivation
    ) ?? BN_ZERO;

  const { amount: minTokenAmountOut, fee } =
    await flashClient.getRemoveLiquidityAmountAndFee(
      flpWithPendingAndActive,
      POOL_CONFIG.poolAddress,
      usdcCustody.custodyAccount,
      POOL_CONFIG
    );

  const {
    instructions: unstakeInstantInstructions,
    additionalSigners: unstakeInstantAdditionalSigners,
  } = await flashClient.unstakeInstant(
    "USDC",
    flpWithPendingAndActive,
    POOL_CONFIG
  );

  const {
    instructions: withdrawStakeInstructions,
    additionalSigners: withdrawStakeAdditionalSigners,
  } = await flashClient.withdrawStake(POOL_CONFIG, true, true);

  instructions.push(...unstakeInstantInstructions);
  additionalSigners.push(...unstakeInstantAdditionalSigners);

  instructions.push(...withdrawStakeInstructions);
  additionalSigners.push(...withdrawStakeAdditionalSigners);

  const minTokenAmountOutAfterSlippage = minTokenAmountOut
    .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
    .div(new BN(10 ** BPS_DECIMALS));

  const removeLiquidityData = await flashClient.removeLiquidity(
    "USDC",
    flpWithPendingAndActive,
    minTokenAmountOutAfterSlippage,
    POOL_CONFIG
  );

  instructions.push(...removeLiquidityData.instructions);
  additionalSigners.push(...removeLiquidityData.additionalSigners);

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 400_000,
  }); // addLiquidity

  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);

  console.log("trx :>> ", trxId);
};

const removeFlpLiquidity = async () => {
  const usdcCustody = POOL_CONFIG.custodies.find((c) => c.symbol === "USDC")!;
  const slippageBps: number = 800; // 0.8%
  let instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];
  const usdcToken = POOL_CONFIG.tokens.find((t) => t.symbol === "USDC")!;

  await flashClient.loadAddressLookupTable(POOL_CONFIG);

  const account = getAssociatedTokenAddressSync(
    POOL_CONFIG.compoundingTokenMint,
    flashClient.provider.publicKey,
    true
  );

  const walletBalance =
    await flashClient.provider.connection.getTokenAccountBalance(
      account,
      "processed"
    );
  const compoundingTokenBalance = new BN(walletBalance.value.amount);

  const { amount: minTokenAmountOut, fee } =
    await flashClient.getSFLPRemoveLiquidityAmountAndFee(
      compoundingTokenBalance,
      POOL_CONFIG.poolAddress,
      usdcCustody.custodyAccount,
      POOL_CONFIG
    );

  const minTokenAmountOutAfterSlippage = minTokenAmountOut
    .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
    .div(new BN(10 ** BPS_DECIMALS));

  const removeCompoundingLiquidityData =
    await flashClient.removeCompoundingLiquidity(
      compoundingTokenBalance,
      minTokenAmountOutAfterSlippage,
      "USDC",
      usdcToken.mintKey,
      POOL_CONFIG,
      true
    );

  instructions.push(...removeCompoundingLiquidityData.instructions);
  additionalSigners.push(...removeCompoundingLiquidityData.additionalSigners);

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 400_000,
  }); // addLiquidity

  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);

  console.log("trx :>> ", trxId);
};

const pythClient = new PythHttpClient(
  connectionFromPyth,
  getPythProgramKeyForCluster("pythnet")
);

const getPrices = async () => {
  const pythHttpClientResult = await pythClient.getData();

  const priceMap = new Map<
    string,
    { price: OraclePrice; emaPrice: OraclePrice }
  >();

  for (let token of POOL_CONFIG.tokens) {
    const priceData: PriceData = pythHttpClientResult.productPrice.get(
      token.pythTicker
    )!;
    if (!priceData) {
      throw new Error(`priceData not found for ${token.symbol}`);
    }
    const priceOracle = new OraclePrice({
      price: new BN(priceData?.aggregate.priceComponent.toString()),
      exponent: new BN(priceData?.exponent),
      confidence: new BN(priceData?.confidence!),
      timestamp: new BN(priceData?.timestamp.toString()),
    });

    const emaPriceOracle = new OraclePrice({
      price: new BN(priceData?.emaPrice.valueComponent.toString()),
      exponent: new BN(priceData?.exponent),
      confidence: new BN(priceData?.emaConfidence.valueComponent.toString()),
      timestamp: new BN(priceData?.timestamp.toString()),
    });
    priceMap.set(token.symbol, {
      price: priceOracle,
      emaPrice: emaPriceOracle,
    });
  }

  return priceMap;
};

const openPosition = async (
  inputTokenSymbol: string,
  outputTokenSymbol: string,
  inputAmount: string,
  side: Side
) => {
  const slippageBps: number = 800; // 0.8%

  const instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  const inputToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === inputTokenSymbol
  )!;
  const outputToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === outputTokenSymbol
  )!;

  const priceMap = await getPrices();

  const inputTokenPrice = priceMap.get(inputToken.symbol)!.price;
  const inputTokenPriceEma = priceMap.get(inputToken.symbol)!.emaPrice;
  const outputTokenPrice = priceMap.get(outputToken.symbol)!.price;
  const outputTokenPriceEma = priceMap.get(outputToken.symbol)!.emaPrice;

  await flashClient.loadAddressLookupTable(POOL_CONFIG);

  const priceAfterSlippage = flashClient.getPriceAfterSlippage(
    true,
    new BN(slippageBps),
    outputTokenPrice,
    side
  );

  const collateralWithFee = uiDecimalsToNative(
    inputAmount,
    inputToken.decimals
  );
  const leverage = 1.1;

  const inputCustody = POOL_CONFIG.custodies.find(
    (c) => c.symbol === inputToken.symbol
  )!;
  const outputCustody = POOL_CONFIG.custodies.find(
    (c) => c.symbol === outputToken.symbol
  )!;

  const custodies = await flashClient.program.account.custody.fetchMultiple([
    inputCustody.custodyAccount,
    outputCustody.custodyAccount,
  ]);

  const outputAmount = flashClient.getSizeAmountFromLeverageAndCollateral(
    //
    collateralWithFee,
    leverage.toString(),
    outputToken,
    inputToken,
    side,
    outputTokenPrice,
    outputTokenPriceEma,
    CustodyAccount.from(outputCustody.custodyAccount, custodies[1]!),
    inputTokenPrice,
    inputTokenPriceEma,
    CustodyAccount.from(inputCustody.custodyAccount, custodies[0]!),
    uiDecimalsToNative(`5`, 2)
  );

  const openPositionData = await flashClient.openPosition(
    outputToken.symbol,
    inputToken.symbol,
    priceAfterSlippage,
    collateralWithFee,
    outputAmount,
    side,
    POOL_CONFIG,
    new PublicKey("..."), // nftTradingAccount,
    new PublicKey("..."), // nftRerralAccount
    new PublicKey("..."), // nftRebateTokenAccount
    Privilege.Referral // if you own the nft, set this to Privilege.NFT
  );

  instructions.push(...openPositionData.instructions);
  additionalSigners.push(...openPositionData.additionalSigners);

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 600_000,
  }); // addLiquidity
  const setCUPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 20,
  });

  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    setCUPriceIx,
    ...instructions,
  ]);

  console.log("trx :>> ", trxId);
};

// openPosition('SOL', 'SOL', '0.1', Side.Long)

const closePosition = async (targetTokenSymbol: string, side: Side) => {
  const slippageBps: number = 800; // 0.8%
  const instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  const targetToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === targetTokenSymbol
  )!;
  const userRecievingToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === targetTokenSymbol
  )!;

  const priceMap = await getPrices();

  const targetTokenPrice = priceMap.get(targetTokenSymbol)!.price;

  const priceAfterSlippage = flashClient.getPriceAfterSlippage(
    false,
    new BN(slippageBps),
    targetTokenPrice,
    side
  );

  const openPositionData = await flashClient.closePosition(
    targetToken.symbol,
    userRecievingToken.symbol, // for WSOL
    priceAfterSlippage,
    side,
    POOL_CONFIG,
    new PublicKey("..."), // nftTradingAccount,
    new PublicKey("..."), // nftRerralAccount
    new PublicKey("..."), // nftRebateTokenAccount
    Privilege.Referral
  );

  instructions.push(...openPositionData.instructions);
  additionalSigners.push(...openPositionData.additionalSigners);

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 600_000,
  }); // addLiquidity
  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);
  console.log("trxId :>> ", trxId);
};

// closePosition('BTC', Side.Long);

const openPositionWithSwap = async (
  inputTokenSymbol: string,
  outputTokenSymbol: string,
  inputAmount: string,
  side: Side
) => {
  const slippageBps: number = 800; // 0.8%

  const instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  const inputToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === inputTokenSymbol
  )!;
  const outputToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === outputTokenSymbol
  )!;

  const priceMap = await getPrices();

  const inputTokenPrice = priceMap.get(inputToken.symbol)!.price;
  const inputTokenPriceEma = priceMap.get(inputToken.symbol)!.emaPrice;
  const outputTokenPrice = priceMap.get(outputToken.symbol)!.price;
  const outputTokenPriceEma = priceMap.get(outputToken.symbol)!.emaPrice;

  await flashClient.loadAddressLookupTable(POOL_CONFIG);

  const priceAfterSlippage = flashClient.getPriceAfterSlippage(
    true,
    new BN(slippageBps),
    outputTokenPrice,
    side
  );

  const collateralWithFee = uiDecimalsToNative(
    inputAmount,
    inputToken.decimals
  );
  const leverage = 1.1;

  const inputCustody = POOL_CONFIG.custodies.find(
    (c) => c.symbol === inputToken.symbol
  )!;
  const outputCustody = POOL_CONFIG.custodies.find(
    (c) => c.symbol === outputToken.symbol
  )!;

  const custodies = await flashClient.program.account.custody.fetchMultiple([
    inputCustody.custodyAccount,
    outputCustody.custodyAccount,
  ]);
  const poolAccount = PoolAccount.from(
    POOL_CONFIG.poolAddress,
    await flashClient.program.account.pool.fetch(POOL_CONFIG.poolAddress)
  );

  const allCustodies = await flashClient.program.account.custody.all();

  const lpMintData = await getMint(
    flashClient.provider.connection,
    POOL_CONFIG.stakedLpTokenMint
  );

  const poolDataClient = new PoolDataClient(
    POOL_CONFIG,
    poolAccount,
    lpMintData,
    [...allCustodies.map((c) => CustodyAccount.from(c.publicKey, c.account))]
  );

  let lpStats = poolDataClient.getLpStats(await getPrices());

  const inputCustodyAccount = CustodyAccount.from(
    inputCustody.custodyAccount,
    custodies[0]!
  );
  const ouputCustodyAccount = CustodyAccount.from(
    outputCustody.custodyAccount,
    custodies[1]!
  );

  const size = flashClient.getSizeAmountWithSwapSync(
    collateralWithFee,
    leverage.toString(),
    Side.Long,
    poolAccount,
    inputTokenPrice,
    inputTokenPriceEma,
    inputCustodyAccount,
    outputTokenPrice,
    outputTokenPriceEma,
    ouputCustodyAccount,
    outputTokenPrice,
    outputTokenPriceEma,
    ouputCustodyAccount,
    outputTokenPrice,
    outputTokenPriceEma,
    ouputCustodyAccount,
    lpStats.totalPoolValueUsd,
    POOL_CONFIG,
    uiDecimalsToNative(`${5}`, 2)
  );

  const minAmountOut = flashClient.getSwapAmountAndFeesSync(
    collateralWithFee,
    BN_ZERO,
    poolAccount,
    inputTokenPrice,
    inputTokenPriceEma,
    CustodyAccount.from(inputCustody.custodyAccount, custodies[0]!),
    outputTokenPrice,
    outputTokenPriceEma,
    CustodyAccount.from(outputCustody.custodyAccount, custodies[1]!),
    lpStats.totalPoolValueUsd,
    POOL_CONFIG
  ).minAmountOut;

  const minAmountOutAfterSlippage = minAmountOut
    .mul(new BN(10 ** BPS_DECIMALS - slippageBps))
    .div(new BN(10 ** BPS_DECIMALS));

  const openPositionData = await flashClient.openPositionWithSwap(
    outputToken.symbol,
    outputToken.symbol,
    inputToken.symbol,
    collateralWithFee,
    minAmountOutAfterSlippage,
    priceAfterSlippage,
    size,
    side,
    POOL_CONFIG,
    POOL_CONFIG,
    new PublicKey("..."), // nftTradingAccount,
    new PublicKey("..."), // nftRerralAccount
    new PublicKey("..."),
    Privilege.Referral
  );

  instructions.push(...openPositionData.instructions);
  additionalSigners.push(...openPositionData.additionalSigners);

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 600_000,
  }); // addLiquidity
  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);

  console.log("trx :>> ", trxId);
};

const closePositionWithSwap = async (userRecievingTokenSymbol: string) => {
  const slippageBps: number = 800; // 0.8%

  const instructions: TransactionInstruction[] = [];
  let additionalSigners: Signer[] = [];

  const positions = await flashClient.getUserPositions(
    flashClient.provider.publicKey,
    POOL_CONFIG
  );

  const positionToClose = positions[1];

  const marketConfig = POOL_CONFIG.markets.find((f) =>
    f.marketAccount.equals(positionToClose.market)
  )!;

  const custodies = await flashClient.program.account.custody.fetchMultiple([
    marketConfig.targetCustody,
    marketConfig.collateralCustody,
  ]);

  const userRecievingToken = POOL_CONFIG.tokens.find(
    (t) => t.symbol === userRecievingTokenSymbol
  )!;
  const targetCustodyAccount = CustodyAccount.from(
    marketConfig.targetCustody,
    custodies[0]!
  );
  const collateralCustodyAccount = CustodyAccount.from(
    marketConfig.collateralCustody,
    custodies[1]!
  );
  const side = marketConfig.side!;
  const positionAccount = PositionAccount.from(
    positionToClose.pubkey,
    positionToClose
  );

  const targetToken = POOL_CONFIG.tokens.find((t) =>
    t.mintKey.equals(marketConfig.targetMint)
  )!;
  const collateralToken = POOL_CONFIG.tokens.find((t) =>
    t.mintKey.equals(marketConfig.collateralMint)
  )!;

  const priceMap = await getPrices();

  const targetTokenPrice = priceMap.get(targetToken.symbol)!.price;
  const targetTokenPriceEma = priceMap.get(targetToken.symbol)!.emaPrice;
  const collateralTokenPrice = priceMap.get(collateralToken.symbol)!.price;
  const collateralTokenPriceEma = priceMap.get(
    collateralToken.symbol
  )!.emaPrice;
  const userRecievingTokenPrice = priceMap.get(
    userRecievingToken.symbol
  )!.price;

  const { closeAmount, feesAmount } = flashClient.getFinalCloseAmountSync(
    positionAccount,
    marketConfig.targetCustody.equals(marketConfig.collateralCustody),
    marketConfig.side,
    targetTokenPrice,
    targetTokenPriceEma,
    targetCustodyAccount,
    collateralTokenPrice,
    collateralTokenPriceEma,
    collateralCustodyAccount,
    new BN(getUnixTs()),
    POOL_CONFIG
  );

  const receiveUsd = collateralTokenPrice.getAssetAmountUsd(
    closeAmount,
    collateralToken.decimals
  );

  const minAmountOut = userRecievingTokenPrice.getTokenAmount(
    receiveUsd,
    userRecievingToken.decimals
  );

  const priceAfterSlippage = flashClient.getPriceAfterSlippage(
    false,
    new BN(slippageBps),
    targetTokenPrice,
    side
  );

  const minAmountOutWithSlippage = minAmountOut
    .mul(new BN(100 - Number(0.8)))
    .div(new BN(100));

  const closePositionWithSwapData = await flashClient.closePositionWithSwap(
    targetToken.symbol,
    userRecievingToken.symbol,
    collateralToken.symbol,
    minAmountOutWithSlippage,
    priceAfterSlippage,
    side,
    POOL_CONFIG,
    POOL_CONFIG,
    new PublicKey("..."), // nftTradingAccount,
    new PublicKey("..."), // nftRerralAccount
    new PublicKey("..."),
    Privilege.Referral
  );

  instructions.push(...closePositionWithSwapData.instructions);
  additionalSigners.push(...closePositionWithSwapData.additionalSigners);

  const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
    units: 600_000,
  }); // addLiquidity
  const trxId = await flashClient.sendTransaction([
    setCULimitIx,
    ...instructions,
  ]);

  console.log("trx :>> ", trxId);
};

const getLpTokenPrices = async () => {
  const stakedLpPrice = await flashClient.getStakedLpTokenPrice(
    POOL_CONFIG.poolAddress,
    POOL_CONFIG
  ); // sFLP price
  const compoundingLPTokenPrice = await flashClient.getCompoundingLPTokenPrice(
    POOL_CONFIG.poolAddress,
    POOL_CONFIG
  ); // FLP price

  console.log("stakedLpPrice :>> ", stakedLpPrice);
  console.log("compoundingLPTokenPrice :>> ", compoundingLPTokenPrice);
};

// ... previous setup for flash-client

export async function createAddCollateralInstruction(
  perpClient: PerpetualsClient,
  market: string,
  addCollateralUsd: number,
  userPublicKey: PublicKey,
  poolName: string,
  connection: Connection,
  userInputTokenSymbol: string,
  targetSymbol: string,
  collateralSymbol: string
) {
  try {
    const targetToken = ALL_TOKENS.find((t) => t.symbol === targetSymbol);
    const collateralToken = ALL_TOKENS.find(
      (t) => t.symbol === collateralSymbol
    );
    const userInputToken = ALL_TOKENS.find(
      (t) => t.symbol === userInputTokenSymbol
    );

    if (!targetToken || !collateralToken || !userInputToken) {
      throw new Error("Token not found");
    }

    // Fetch oracle prices for relevant tokens
    const targetTokenPriceEntry: PythPriceEntry = await fetchOraclePrice(
      targetSymbol
    );
    const collateralTokenPriceEntry: PythPriceEntry = await fetchOraclePrice(
      collateralSymbol
    );
    const userInputTokenPriceEntry: PythPriceEntry = await fetchOraclePrice(
      userInputTokenSymbol
    );

    const targetOraclePrice: OraclePrice = targetTokenPriceEntry.price;
    const collateralOraclePrice: OraclePrice = collateralTokenPriceEntry.price;
    const userInputTokenOraclePrice: OraclePrice =
      userInputTokenPriceEntry.price;

    // Convert collateral token price to number
    const collateralTokenPrice =
      hexToNumber(collateralOraclePrice.price.toString("hex")) *
      Math.pow(10, hexToNumber(collateralOraclePrice.exponent.toString("hex")));

    // Calculate addCollateralAmountBN based on USD amount
    const addCollateralAmountBN = new BN(
      (addCollateralUsd / collateralTokenPrice) * 10 ** collateralToken.decimals
    );

    const poolConfig = PoolConfig.fromIdsByName(poolName, "mainnet-beta");

    // Get existing position
    const positionAccountPublicKey = await getPositionInfo(
      userPublicKey,
      connection,
      perpClient,
      market
    );
    if (!positionAccountPublicKey) {
      throw new Error("No existing position found for this market");
    }

    // Find market config
    const marketConfig = POOL_CONFIGS.map((f) => f.markets)
      .flat()
      .find((m) =>
        m.marketAccount.equals(positionAccountPublicKey.marketPublicKey)
      );

    if (!marketConfig) {
      throw new Error("Market config not found");
    }

    // Get trade execution details
    const tradeExecutionDetails = getTradeExecutionDetails(
      userInputToken,
      targetToken,
      marketConfig.side
    );
    const POOL_CONFIG_POSITION = tradeExecutionDetails.positionPoolConfig;

    // Find market custody config
    const marketCustodyConfig = ALL_CUSTODIES.find((f) =>
      f.custodyAccount.equals(marketConfig.targetCustody)
    );
    if (!marketCustodyConfig) {
      throw new Error("Market custody config not found");
    }

    // Check if swap is required
    const isSwapRequired = userInputTokenSymbol !== collateralSymbol;

    const instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    if (isSwapRequired) {
      // Handle swap scenario
      const SWAP_POOL_CONFIG = tradeExecutionDetails.swapPoolConfig;
      if (!SWAP_POOL_CONFIG) {
        throw new Error("Swap pool config not found");
      }
      const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: SWAP_ADD_COLLATERAL_CU,
      });
      instructions.push(setCULimitIx);

      // Calculate minAmountOut with fixed 1% slippage
      const addCollateralAmountUsd =
        userInputTokenOraclePrice.getAssetAmountUsd(
          addCollateralAmountBN,
          userInputToken.decimals
        );
      const minAmountOut = collateralOraclePrice.getTokenAmount(
        addCollateralAmountUsd,
        collateralToken.decimals
      );
      const minAmountOutWithSlippage = minAmountOut
        .mul(new BN(99))
        .div(new BN(100));

      const data = await perpClient.addCollateralWithSwap(
        targetToken.symbol,
        userInputToken.symbol,
        collateralToken.symbol,
        addCollateralAmountBN,
        minAmountOutWithSlippage,
        marketConfig.side,
        positionAccountPublicKey.publicKey,
        SWAP_POOL_CONFIG,
        POOL_CONFIG_POSITION
      );
      instructions.push(...data.instructions);
      additionalSigners.push(...data.additionalSigners);
    } else {
      // Handle direct add collateral scenario
      const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: ADD_COLLATERAL_CU,
      });
      instructions.push(setCULimitIx);

      const data = await perpClient.addCollateral(
        addCollateralAmountBN,
        marketCustodyConfig.symbol,
        collateralToken.symbol,
        marketConfig.side,
        positionAccountPublicKey.publicKey,
        poolConfig
      );
      instructions.push(...data.instructions);
      additionalSigners.push(...data.additionalSigners);
    }

    await perpClient.loadAddressLookupTable(poolConfig);

    return {
      instructions,
      additionalSigners,
      alts: perpClient.addressLookupTables,
    };
  } catch (error) {
    console.error("Error creating add collateral instruction:", error);
    throw error;
  }
}

export async function getPositionInfo(
  walletPublicKey: PublicKey,
  connection: Connection,
  perpClient: PerpetualsClient,
  market: string
): Promise<{ publicKey: PublicKey; marketPublicKey: PublicKey }> {
  // Initialize positions Map
  const positionsMap = new Map<string, PositionAccount>();

  // Iterate through all pool configs and get user positions
  for (const poolConfig of POOL_CONFIGS) {
    const positions = await perpClient.getUserPositions(
      walletPublicKey,
      poolConfig
    );
    positions.forEach((position) =>
      positionsMap.set(
        position.pubkey.toBase58(),
        PositionAccount.from(position.pubkey, position)
      )
    );
  }

  // Convert Map to array and sort by market
  const sortedPositions = Array.from(positionsMap.values()).sort((a, b) =>
    a.market.toBase58().localeCompare(b.market.toBase58())
  );

  // Find the position that matches the given market
  const matchingPosition = sortedPositions.find(
    (position) => position.market.toBase58() === market
  );

  // Throw an error if no matching position is found
  if (!matchingPosition) {
    throw new Error(`No existing position found for market: ${market}`);
  }

  // Return the public key and market of the matching position
  return {
    publicKey: matchingPosition.publicKey,
    marketPublicKey: matchingPosition.market,
  };
}

export function getTradeExecutionDetails(
  userInputToken: Token,
  targetToken: Token,
  side: Side
): TradeExecutionDetails {
  // Find the market configuration
  const marketConfig = ALL_MARKET_CONFIGS.find(
    (f) =>
      f.targetMint.equals(targetToken.mintKey) &&
      JSON.stringify(f.side) === JSON.stringify(side)
  );

  if (!marketConfig) {
    throw new Error("Market configuration not found");
  }

  // Find the position pool configuration
  const positionPoolConfig = POOL_CONFIGS.find((p) =>
    p.poolAddress.equals(marketConfig.pool)
  );

  if (!positionPoolConfig) {
    throw new Error("Position pool configuration not found");
  }

  // Find the collateral token
  const collateralToken = positionPoolConfig.tokens.find((t) =>
    t.mintKey.equals(marketConfig.collateralMint)
  );

  if (!collateralToken) {
    throw new Error("Collateral token not found");
  }

  // Find custody configurations
  const targetTokenCustodyConfig = positionPoolConfig.custodies.find(
    (c) => c.symbol === targetToken.symbol
  );
  const collateralCustodyConfig = positionPoolConfig.custodies.find(
    (c) => c.symbol === collateralToken.symbol
  );

  if (!targetTokenCustodyConfig || !collateralCustodyConfig) {
    throw new Error("Custody configuration not found");
  }

  // Check if swap is required
  const isSwapRequired = !collateralToken.mintKey.equals(
    userInputToken.mintKey
  );
  let swapPoolConfig: PoolConfig | undefined;
  let swapInCustodyConfig: CustodyConfig | undefined;
  let swapOutCustodyConfig: CustodyConfig | undefined;

  if (isSwapRequired) {
    // Determine swap pool configuration
    const inputTokenIsInPool = positionPoolConfig.tokens.some((i) =>
      i.mintKey.equals(userInputToken.mintKey)
    );
    const targetTokenIsInPool = positionPoolConfig.tokens.some((i) =>
      i.mintKey.equals(targetToken.mintKey)
    );

    if (inputTokenIsInPool && targetTokenIsInPool) {
      // same pool swap
      swapPoolConfig = positionPoolConfig;
    } else {
      swapPoolConfig = getRequiredSwapPoolConfig(
        userInputToken,
        collateralToken
      );
    }

    if (swapPoolConfig) {
      // Find swap custody configurations
      swapInCustodyConfig = swapPoolConfig.custodies.find((i) =>
        i.mintKey.equals(userInputToken.mintKey)
      );
      swapOutCustodyConfig = swapPoolConfig.custodies.find((i) =>
        i.mintKey.equals(collateralToken.mintKey)
      );
    }
  }

  // Return trade execution details
  return {
    marketConfig,
    collateralToken,
    targetTokenCustodyConfig,
    collateralCustodyConfig,
    positionPoolConfig,
    isSwapRequired,
    swapPoolConfig,
    swapInCustodyConfig,
    swapOutCustodyConfig,
    isTradeDisabled: isSwapRequired && !swapPoolConfig,
  };
}

export async function createRemoveCollateralInstruction(
  perpClient: PerpetualsClient,
  market: string,
  removeCollateralUsd: number,
  userPublicKey: PublicKey,
  poolName: string,
  connection: Connection,
  userReceivingTokenSymbol: string,
  targetSymbol: string,
  collateralSymbol: string,
  slippagePercentage: number = 1 // Default slippage set to 1%
) {
  try {
    // Find the tokens involved in the transaction
    const targetToken = ALL_TOKENS.find((t) => t.symbol === targetSymbol);
    const collateralToken = ALL_TOKENS.find(
      (t) => t.symbol === collateralSymbol
    );
    const userReceivingToken = ALL_TOKENS.find(
      (t) => t.symbol === userReceivingTokenSymbol
    );

    if (!targetToken || !collateralToken || !userReceivingToken) {
      throw new Error("Token not found");
    }

    // Fetch oracle prices for the tokens
    const targetTokenPriceEntry: PythPriceEntry = await fetchOraclePrice(
      targetSymbol
    );
    const collateralTokenPriceEntry: PythPriceEntry = await fetchOraclePrice(
      collateralSymbol
    );
    const userReceivingTokenPriceEntry: PythPriceEntry = await fetchOraclePrice(
      userReceivingTokenSymbol
    );

    const targetOraclePrice: OraclePrice = targetTokenPriceEntry.price;
    const collateralOraclePrice: OraclePrice = collateralTokenPriceEntry.price;
    const userReceivingTokenOraclePrice: OraclePrice =
      userReceivingTokenPriceEntry.price;

    // Convert collateral token price to number
    const collateralTokenPrice =
      hexToNumber(collateralOraclePrice.price.toString("hex")) *
      Math.pow(10, hexToNumber(collateralOraclePrice.exponent.toString("hex")));

    // Calculate removeCollateralAmountBN based on USD amount
    const removeCollateralAmountBN = new BN(
      (removeCollateralUsd / collateralTokenPrice) *
        10 ** collateralToken.decimals
    );

    console.log(`Remove Collateral: ${removeCollateralUsd} USD`);
    console.log(
      `Calculated remove collateral: ${removeCollateralAmountBN.toString()} (${removeCollateralAmountBN
        .div(new BN(10).pow(new BN(collateralToken.decimals)))
        .toString()} ${collateralToken.symbol})`
    );

    // Get pool configuration
    const poolConfig = PoolConfig.fromIdsByName(poolName, "mainnet-beta");

    // Get existing position
    const positionAccountPublicKey = await getPositionInfo(
      userPublicKey,
      connection,
      perpClient,
      market
    );
    if (!positionAccountPublicKey) {
      throw new Error("No existing position found for this market");
    }

    // Find market configuration
    const marketConfig = POOL_CONFIGS.map((f) => f.markets)
      .flat()
      .find((m) =>
        m.marketAccount.equals(positionAccountPublicKey.marketPublicKey)
      );

    if (!marketConfig) {
      throw new Error("Market config not found");
    }

    // Get trade execution details
    const tradeExecutionDetails = getTradeExecutionDetails(
      userReceivingToken,
      targetToken,
      marketConfig.side
    );
    const POOL_CONFIG_POSITION = tradeExecutionDetails.positionPoolConfig;

    // Find market custody configuration
    const marketCustodyConfig = ALL_CUSTODIES.find((f) =>
      f.custodyAccount.equals(marketConfig.targetCustody)
    );
    if (!marketCustodyConfig) {
      throw new Error("Market custody config not found");
    }

    // Check if swap is required
    const isSwapRequired = userReceivingTokenSymbol !== collateralSymbol;

    const instructions: TransactionInstruction[] = [];
    const additionalSigners: Signer[] = [];

    if (isSwapRequired) {
      // Handle swap scenario
      const SWAP_POOL_CONFIG = tradeExecutionDetails.swapPoolConfig;
      if (!SWAP_POOL_CONFIG) {
        throw new Error("Swap pool config not found");
      }
      const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: DECREASE_SIZE_REMOVE_COLLATERAL_SWAP_CU,
      });
      instructions.push(setCULimitIx);

      // Calculate minimum amount out with slippage
      const removeCollateralAmountUsd = collateralOraclePrice.getAssetAmountUsd(
        removeCollateralAmountBN,
        collateralToken.decimals
      );
      const minAmountOut = userReceivingTokenOraclePrice.getTokenAmount(
        removeCollateralAmountUsd,
        userReceivingToken.decimals
      );
      const minAmountOutWithSlippage = minAmountOut
        .mul(new BN(100 - slippagePercentage))
        .div(new BN(100));

      // Create remove collateral with swap instruction
      const data = await perpClient.removeCollateralWithSwap(
        targetToken.symbol,
        collateralToken.symbol,
        userReceivingToken.symbol,
        minAmountOutWithSlippage,
        removeCollateralAmountBN,
        marketConfig.side,
        SWAP_POOL_CONFIG,
        POOL_CONFIG_POSITION
      );
      instructions.push(...data.instructions);
      additionalSigners.push(...data.additionalSigners);
    } else {
      // Handle direct remove collateral scenario
      const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: DECREASE_SIZE_REMOVE_COLLATERAL_CU,
      });
      instructions.push(setCULimitIx);

      // Create remove collateral instruction
      const data = await perpClient.removeCollateral(
        removeCollateralAmountBN,
        targetToken.symbol,
        userReceivingToken.symbol,
        marketConfig.side,
        positionAccountPublicKey.publicKey,
        POOL_CONFIG_POSITION
      );
      instructions.push(...data.instructions);
      additionalSigners.push(...data.additionalSigners);
    }

    // Load address lookup table
    await perpClient.loadAddressLookupTable(POOL_CONFIG_POSITION);

    // Return instructions, signers, and address lookup tables
    return {
      instructions,
      additionalSigners,
      alts: perpClient.addressLookupTables,
    };
  } catch (error) {
    console.error("Error creating remove collateral instruction:", error);
    throw error;
  }
}
