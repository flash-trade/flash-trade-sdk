/**
 * Flash Perps — trading example.
 *
 * Demonstrates the full perp lifecycle against any mainnet pool:
 *   - open / close positions
 *   - open with input-token swap (`openPositionWithSwap`)
 *   - close into a different token (handled by `closePosition`'s `userReceivingTokenSymbol` option)
 *   - add / remove collateral (with optional swap)
 *   - list user positions across all pools
 *   - read liquidation price
 *
 * Pools are picked automatically from the (token, side) you ask for —
 * SOL/BTC -> Crypto.1, SPY -> Equity.1, ORE -> Ore.1, TRUMP -> Trump.1, etc.
 *
 * Prices come from the Pyth Lazer proxy via a single HTTP poll, mirroring
 * flash-main-ui (no Pythnet/PythHttpClient dependency).
 *
 * Required env vars:
 *   RPC_URL          - mainnet Solana RPC
 *   ANCHOR_WALLET    - path to a keypair JSON (consumed by AnchorProvider.local)
 *   LAZER_PROXY_URL  - optional; defaults to https://pyth-lazer-proxy-3.dourolabs.app
 *
 * Run:
 *   npm install
 *   ANCHOR_WALLET=~/.config/solana/id.json npx ts-node src/trade.ts
 *
 * Typical flow (see the IIFE at the bottom for a runnable scaffold):
 * @example
 *   // 1) Open a 3x long SOL position with 0.1 SOL collateral.
 *   //    Use `openPositionAuto` if you'd rather not think about whether the
 *   //    input token needs to be swapped — it dispatches to `openPosition`
 *   //    or `openPositionWithSwap` for you.
 *   await openPositionAuto('SOL', 'SOL', '0.1', Side.Long, 3)
 *   // (equivalent direct call:)
 *   // await openPosition('SOL', 'SOL', '0.1', Side.Long, 3)
 *
 *   // 2) List your open positions across every pool:
 *   const positions = await displayUserPositions()
 *
 *   // 3) Top up the first one with $5 USDC (swap-and-add):
 *   await addCollateral(positions[0].position.pubkey, '5', { depositTokenSymbol: 'USDC' })
 *
 *   // 4) Pull $2 of collateral back out as USDC (remove-and-swap):
 *   await removeCollateral(positions[0].position.pubkey, '2', { withdrawTokenSymbol: 'USDC' })
 *
 *   // 5) Close into USDC instead of the original collateral:
 *   await closePosition(positions[0].position.pubkey, { userReceivingTokenSymbol: 'USDC' })
 */
import dotenv from 'dotenv';
import { BN_ZERO, BPS_DECIMALS, createComputeBudgetIx, CustodyAccount, isVariant, nativeToUiDecimals, OraclePrice, PerpetualsClient, PoolAccount, PoolConfig, PoolDataClient, PositionAccount, Privilege, Referral, SendTransactionOpts, Side, TokenStake, uiDecimalsToNative, USD_DECIMALS } from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { TransactionInstruction, Signer, PublicKey, ComputeBudgetProgram, Connection, AddressLookupTableAccount, MessageV0, VersionedTransaction } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

// ============================================================================
// Pool registry — load every mainnet pool up front. The right one is picked
// dynamically per trade based on the token + side, mirroring flash-main-ui
// (utils/constants.ts -> POOL_CONFIGS / getRequiredPoolConfig).
// ============================================================================
export const MAINNET_POOL_NAMES = [
    'Crypto.1',     // flp.1
    'Virtual.1',    // flp.2
    'Governance.1', // flp.3
    'Community.1',  // flp.4
    'Community.2',  // flp.5
    'Trump.1',      // flp.7
    'Ore.1',        // flp.8
    'Remora.1',     // flp.r
    'Equity.1',     // equities (SPY, etc.)
] as const

export const POOL_CONFIGS: PoolConfig[] = MAINNET_POOL_NAMES.map((n) =>
    PoolConfig.fromIdsByName(n, 'mainnet-beta')
)

// All mainnet pools share the same on-chain program IDs, so the
// PerpetualsClient and PDA derivations can use any one of them. We use the
// first pool as the "anchor" — the per-trade `poolConfig` argument is what
// actually scopes each instruction.
export const PROGRAM_ID = POOL_CONFIGS[0].programId

/**
 * Find the pool that has a market for `targetSymbol` on the given `side`.
 * Port of flash-main-ui/utils/constants.ts -> getRequiredPoolConfig.
 */
const getRequiredPoolConfig = (targetSymbol: string, side: Side): PoolConfig => {
    for (const config of POOL_CONFIGS) {
        const targetToken = config.tokens.find((t) => t.symbol === targetSymbol)
        if (!targetToken) continue
        const market = config.markets.find(
            (m) =>
                m.targetMint.equals(targetToken.mintKey) &&
                isVariant(m.side, 'long') === isVariant(side, 'long')
        )
        if (market) return config
    }
    throw new Error(`No pool found with a ${isVariant(side, 'long') ? 'long' : 'short'} market for ${targetSymbol}`)
}

/**
 * Find the pool that owns a given position's market account.
 * Port of flash-main-ui/utils/constants.ts -> getRequiredPoolConfigFromMarketPk.
 */
const getPoolConfigForMarket = (marketPk: PublicKey): PoolConfig => {
    for (const config of POOL_CONFIGS) {
        if (
            config.markets.find((m) => m.marketAccount.equals(marketPk)) ||
            config.marketsDeprecated.find((m) => m.marketAccount.equals(marketPk))
        ) {
            return config
        }
    }
    throw new Error(`No pool found containing market ${marketPk.toBase58()}`)
}

export const RPC_URL = process.env.RPC_URL;
console.log("RPC_URL:>> ", RPC_URL);
if (!RPC_URL) {
    throw new Error('RPC_URL is not set');
}

const connection = new Connection(RPC_URL);

// Pyth Lazer proxy — same default the flash-main-ui uses (see utils/lazerConstants.ts).
// Lazer replaces the old Pythnet RPC + PythHttpClient approach: a single HTTP
// poll returns prices for all the feed ids we care about.
export const LAZER_PROXY_BASE_URL = process.env.LAZER_PROXY_URL ?? 'https://pyth-lazer-proxy-3.dourolabs.app';
console.log("LAZER_PROXY_BASE_URL:>> ", LAZER_PROXY_BASE_URL);

const provider: AnchorProvider = AnchorProvider.local(RPC_URL, {
    commitment: 'processed',
    preflightCommitment: 'processed',
    skipPreflight: true,
});

// All mainnet pools share the same program IDs, so one client serves all pools.
export const flashClient = new PerpetualsClient(
    provider,
    POOL_CONFIGS[0].programId,
    POOL_CONFIGS[0].perpComposibilityProgramId,
    POOL_CONFIGS[0].fbNftRewardProgramId,
    POOL_CONFIGS[0].rewardDistributionProgram.programId,
    {
        prioritizationFee: 0,
    }
)

// ============================================================================
// Lazer price feed types
// ----------------------------------------------------------------------------
// Shape of a single feed in `GET /v1/latest_price?price_feed_ids=...` response.
// See flash-main-ui/workers/lazerPrice.worker.ts for the canonical typing.
// ============================================================================
interface LazerV1Feed {
    priceFeedId: number
    price: string
    exponent: number
    confidence: number
    marketSession: string
    feedUpdateTimestamp: number // microseconds
    bestBidPrice?: string
    bestAskPrice?: string
    publisherCount?: number
}

interface LazerV1Response {
    timestampUs: string
    priceFeeds: LazerV1Feed[]
}

// ============================================================================
// Referral / Stake account helpers
// ----------------------------------------------------------------------------
// `userReferralAccount` and `tokenStakeAccount` are PDAs on the perp program.
// They are OPTIONAL — only required when the trader is using the `Referral`
// or `Stake` privilege to receive fee discounts / rebates. When not used,
// pass `PublicKey.default` and `Privilege.None`.
// ============================================================================

// PDA: seeds = ['referral', wallet]
export const getUserReferralAccountPK = (publicKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('referral'), publicKey.toBuffer()],
        PROGRAM_ID
    )[0]
}

// PDA: seeds = ['token_stake', wallet] — the trader's own FAF token-stake account
export const getFafTokenStakeAccountPk = (publicKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('token_stake'), publicKey.toBuffer()],
        PROGRAM_ID
    )[0]
}

/**
 * Resolves the (privilege, tokenStakeAccount, userReferralAccount) triplet
 * that needs to be passed to openPosition / closePosition / swapAndOpen /
 * closeAndSwap, based on the trader's on-chain state.
 *
 * Mirrors the resolution logic used in flash-main-ui
 * (see hooks/useOpenPositionApi.ts → enrichRequestWithAccounts):
 *
 *   - If the trader has their own FAF token stake (level >= 1):
 *       privilege          = Stake
 *       tokenStakeAccount  = PDA(token_stake, trader)
 *       userReferralAccount = PDA(referral, trader)
 *
 *   - Else if the trader has a referral account with a referrer:
 *       privilege          = Referral
 *       tokenStakeAccount  = referral.refererTokenStakeAccount   (the REFERRER's stake)
 *       userReferralAccount = PDA(referral, trader)
 *
 *   - Otherwise:
 *       privilege          = None
 *       tokenStakeAccount  = PublicKey.default
 *       userReferralAccount = PublicKey.default
 */
const resolvePrivilegeAccounts = async (
    trader: PublicKey
): Promise<{
    privilege: Privilege
    tokenStakeAccount: PublicKey
    userReferralAccount: PublicKey
}> => {
    const userReferralAccountPk = getUserReferralAccountPK(trader)
    const userTokenStakeAccountPk = getFafTokenStakeAccountPk(trader)

    const [referralInfo, tokenStakeInfo] = await connection.getMultipleAccountsInfo([
        userReferralAccountPk,
        userTokenStakeAccountPk,
    ])

    // 1) Own stake takes priority (Privilege.Stake)
    if (tokenStakeInfo) {
        const tokenStake = flashClient.program.coder.accounts.decode<TokenStake>(
            'tokenStake',
            tokenStakeInfo.data
        )
        // level >= 1 means the trader has actively staked
        if (tokenStake.level >= 1) {
            return {
                privilege: Privilege.Stake,
                tokenStakeAccount: userTokenStakeAccountPk,
                userReferralAccount: userReferralAccountPk,
            }
        }
    }

    // 2) Otherwise fall back to a referrer (Privilege.Referral)
    if (referralInfo) {
        const referral = flashClient.program.coder.accounts.decode<Referral>(
            'referral',
            referralInfo.data
        )
        // refererTokenStakeAccount points at the REFERRER'S stake PDA
        return {
            privilege: Privilege.Referral,
            tokenStakeAccount: referral.refererTokenStakeAccount,
            userReferralAccount: userReferralAccountPk,
        }
    }

    // 3) No privilege
    return {
        privilege: Privilege.None,
        tokenStakeAccount: PublicKey.default,
        userReferralAccount: PublicKey.default,
    }
}

type PoolToken = PoolConfig['tokens'][number]

/**
 * Fetch latest oracle prices for ALL tokens across ALL mainnet pools from the
 * Pyth Lazer proxy. Mirrors flash-main-ui (workers/lazerPrice.worker.ts ->
 * handleLazerPrices) — minus the Web-Worker / SSE / Zustand wiring, since
 * this is a one-shot Node script.
 *
 * One HTTP call covers every pool, so callers don't need to know which pool
 * a trade lands in before fetching prices. Multiple tokens can share a
 * `lazerId` (e.g. SOL and WSOL across pools), so each feed is applied to
 * every matching token.
 *
 * Note: Lazer V1 does NOT provide a separate EMA price, so we reuse the
 * same OraclePrice for both `price` and `emaPrice` — exactly what
 * flash-main-ui does (hooks/usePythPrices.ts).
 */
const getPrices = async () => {
    // Union all tokens across all pools, keyed by lazerId.
    const lazerIdToTokens = new Map<number, PoolToken[]>()
    for (const config of POOL_CONFIGS) {
        for (const token of config.tokens) {
            const list = lazerIdToTokens.get(token.lazerId) ?? []
            list.push(token)
            lazerIdToTokens.set(token.lazerId, list)
        }
    }

    const uniqueIds = Array.from(lazerIdToTokens.keys())
    const feedParams = uniqueIds.map((id) => `price_feed_ids=${id}`).join('&')
    const url = `${LAZER_PROXY_BASE_URL}/v1/latest_price?${feedParams}`

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Lazer latest_price HTTP ${response.status} ${response.statusText}`)
    }
    const json = (await response.json()) as LazerV1Response

    const priceMap = new Map<string, { price: OraclePrice; emaPrice: OraclePrice }>()

    for (const feed of json.priceFeeds) {
        const matchedTokens = lazerIdToTokens.get(feed.priceFeedId)
        if (!matchedTokens) continue

        // feedUpdateTimestamp is microseconds — OraclePrice expects seconds.
        const priceOracle = new OraclePrice({
            price: new BN(feed.price),
            exponent: new BN(feed.exponent),
            confidence: new BN(feed.confidence.toString()),
            timestamp: new BN(Math.floor(feed.feedUpdateTimestamp / 1_000_000)),
        })

        for (const token of matchedTokens) {
            // Lazer V1 has no separate EMA — reuse the same OraclePrice.
            priceMap.set(token.symbol, { price: priceOracle, emaPrice: priceOracle })
        }
    }

    return priceMap
}

/**
 * Open a leveraged position. The pool is picked automatically from
 * `(outputTokenSymbol, side)` — the input token must already be in that pool's
 * `tokens` list (otherwise use `openPositionWithSwap`).
 *
 * @param inputTokenSymbol   - collateral token deposited (must be in the same pool)
 * @param outputTokenSymbol  - target market (e.g. 'SOL', 'BTC', 'SPY', 'TRUMP')
 * @param inputAmount        - UI amount of collateral, in `inputTokenSymbol` units
 * @param side               - `Side.Long` or `Side.Short`
 * @param leverage           - target leverage; must be within the market's min/max
 *
 * @example
 *   await openPosition('SOL',  'SOL',  '0.1', Side.Long,  3)    // 3x long  SOL with 0.1 SOL
 *   await openPosition('USDC', 'BTC',  '50',  Side.Short, 5)    // 5x short BTC with 50 USDC
 *   await openPosition('USDC', 'SPY',  '10',  Side.Long,  2)    // 2x long  SPY (Equity.1 pool)
 */
const openPosition = async (
    inputTokenSymbol: string,
    outputTokenSymbol: string,
    inputAmount: string,
    side: Side,
    leverage: number, // e.g. 1.1, 2, 5, 10 — caller picks; must be within the market's min/max leverage
) => {

    const slippageBps: number = 800 // 0.8%

    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    // Pick the pool that has a `side` market for `outputTokenSymbol`.
    const poolConfig = getRequiredPoolConfig(outputTokenSymbol, side)
    console.log(`openPosition -> pool: ${poolConfig.poolName}`)

    const inputToken = poolConfig.tokens.find(t => t.symbol === inputTokenSymbol)
    if (!inputToken) {
        throw new Error(`Input token ${inputTokenSymbol} is not in pool ${poolConfig.poolName}. Use openPositionWithSwap or pick a collateral the pool supports.`)
    }
    const outputToken = poolConfig.tokens.find(t => t.symbol === outputTokenSymbol)!;

    const priceMap = await getPrices();

    const inputTokenPrice = priceMap.get(inputToken.symbol)!.price
    const inputTokenPriceEma = priceMap.get(inputToken.symbol)!.emaPrice
    const outputTokenPrice = priceMap.get(outputToken.symbol)!.price
    const outputTokenPriceEma = priceMap.get(outputToken.symbol)!.emaPrice


    const priceAfterSlippage = flashClient.getPriceAfterSlippage(
        true,
        new BN(slippageBps),
        outputTokenPrice,
        side
    )

    const collateralWithFee = uiDecimalsToNative(inputAmount, inputToken.decimals);

    const inputCustody = poolConfig.custodies.find(c => c.symbol === inputToken.symbol)!;
    const outputCustody = poolConfig.custodies.find(c => c.symbol === outputToken.symbol)!;

    const custodies = await flashClient.program.account.custody.fetchMultiple([inputCustody.custodyAccount, outputCustody.custodyAccount]);

    const outputAmount = flashClient.getSizeAmountFromLeverageAndCollateral( //
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
        BN_ZERO // discountBps
    )

    // Resolve trader's privilege from on-chain state (Stake > Referral > None).
    // If you already know the trader has neither, you can skip this and pass:
    //   privilege          = Privilege.None
    //   tokenStakeAccount  = PublicKey.default
    //   userReferralAccount = PublicKey.default
    const { privilege, tokenStakeAccount, userReferralAccount } =
        await resolvePrivilegeAccounts(flashClient.provider.publicKey)

    const openPositionData = await flashClient.openPosition(
        outputToken.symbol,
        inputToken.symbol,
        priceAfterSlippage,
        collateralWithFee,
        outputAmount,
        side,
        poolConfig,
        privilege,            // Privilege.None | Privilege.Stake | Privilege.Referral
        tokenStakeAccount,    // own stake PDA (Stake) or referrer's stake (Referral); else PublicKey.default
        userReferralAccount,  // PDA(referral, trader); else PublicKey.default
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 }) // open position
    const setCUPriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 50
    })

    let addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(poolConfig)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, setCUPriceIx, ...instructions], {
        alts: addresslookupTables,
        additionalSigners: additionalSigners
    })

    console.log('trx main :>> ', `: https://explorer.solana.com/tx/${trxId}`);
    // console.log('trx dev:>> ',  `: https://explorer.solana.com/tx/${trxId}?cluster=devnet`);
}

// openPosition('SOL', 'SOL', '0.1', Side.Long, 1.1)

// ============================================================================
// Positions: list + close
// ============================================================================

/**
 * Fetches every open position the caller's wallet has across all mainnet pools
 * and returns them enriched with their pool / market / token context — enough
 * to either pretty-print or close.
 */
const getAllUserPositions = async (trader: PublicKey = flashClient.provider.publicKey) => {
    const perPool = await Promise.all(
        POOL_CONFIGS.map(async (poolConfig) => {
            const positions = await flashClient.getUserPositions(trader, poolConfig)
            return positions
                // Drop closed/inactive positions — they still exist as accounts on-chain.
                .filter((p) => (p as { isActive?: boolean }).isActive)
                .flatMap((position) => {
                    // Check active markets first, then deprecated; skip anything we can't map.
                    const market =
                        poolConfig.markets.find((m) => m.marketAccount.equals(position.market)) ??
                        poolConfig.marketsDeprecated.find((m) => m.marketAccount.equals(position.market))
                    if (!market) {
                        console.warn(
                            `Skipping position ${position.pubkey.toBase58()}: market ${position.market.toBase58()} not found in pool ${poolConfig.poolName}`
                        )
                        return []
                    }
                    const targetToken = poolConfig.tokens.find((t) => t.mintKey.equals(market.targetMint))
                    const collateralToken = poolConfig.tokens.find((t) => t.mintKey.equals(market.collateralMint))
                    if (!targetToken || !collateralToken) {
                        console.warn(
                            `Skipping position ${position.pubkey.toBase58()}: token metadata missing in pool ${poolConfig.poolName}`
                        )
                        return []
                    }
                    return [{ position, poolConfig, market, targetToken, collateralToken }]
                })
        })
    )
    return perPool.flat()
}

/**
 * Pretty-prints every open position for the caller's wallet in a fixed-width table.
 * Returns the raw enriched rows so callers can act on them programmatically.
 */
// PnL percentages are returned by the program scaled by 10^4 — i.e. the value
// 12345 means 1.2345%. flash-main-ui defines the same constant locally
// (hooks/fallback/positions/positionsAndOrdersFallback.ts).
const PCT_DECIMALS = 4

// Minimal ANSI helpers. Disabled when stdout isn't a TTY (e.g. piping to a file).
const USE_COLOR = !!process.stdout.isTTY
const ansi = (code: string, s: string) => (USE_COLOR ? `\x1b[${code}m${s}\x1b[0m` : s)
const green = (s: string) => ansi('32', s)
const red = (s: string) => ansi('31', s)
const dim = (s: string) => ansi('2', s)
const bold = (s: string) => ansi('1', s)

// Strip ANSI codes when measuring "visible" width (so coloring doesn't break alignment).
const VISIBLE = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '')
const vlen = (s: string) => VISIBLE(s).length
const padR = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - vlen(s))) // left-align
const padL = (s: string, w: number) => ' '.repeat(Math.max(0, w - vlen(s))) + s // right-align

// Shorten a long pubkey like '4hXHkgakfMxRo1TMYbT6iFUET7748VYs9CY8GVjZsDT1' -> '4hXH..sDT1'
const shortPk = (pk: PublicKey) => {
    const s = pk.toBase58()
    return `${s.slice(0, 4)}..${s.slice(-4)}`
}

const signed = (n: string) => (n.startsWith('-') ? n : `+${n}`)
const tintByNumber = (numericStr: string, formatted: string) => {
    const n = parseFloat(numericStr)
    if (!isFinite(n) || n === 0) return formatted
    return n > 0 ? green(formatted) : red(formatted)
}

/**
 * Fetches every open position for `trader` and pretty-prints a clean table with
 * derived live values (mark price, liquidation price, PnL, current leverage,
 * accrued borrow fees). Uses `flashClient.getPositionData(...)` per row —
 * a simulated on-chain call that returns everything in one shot, mirroring
 * how flash-main-ui populates its positions table
 * (hooks/fallback/positions/positionsAndOrdersFallback.ts).
 *
 * Returns the enriched rows so callers can act on them programmatically.
 */
const displayUserPositions = async (trader: PublicKey = flashClient.provider.publicKey) => {
    const rows = await getAllUserPositions(trader)

    console.log(`\n${bold('Open positions')} for ${dim(trader.toBase58())}`)
    if (!rows.length) {
        console.log(dim('  (none)'))
        return rows
    }

    // One call per row: returns pnl / leverage / liquidation price / fees.
    // Errors fall back to undefined so the table still prints the rest of the data.
    const priceMapPromise = getPrices()
    const positionDatas = await Promise.all(
        rows.map(async ({ position, poolConfig }) => {
            try {
                const positionAccount = PositionAccount.from(position.pubkey, position)
                return await flashClient.getPositionData(positionAccount, poolConfig, trader)
            } catch (err) {
                console.warn(`getPositionData failed for ${position.pubkey.toBase58()}:`, (err as Error).message)
                return undefined
            }
        })
    )
    const priceMap = await priceMapPromise

    // Build cells: each row is an array of { raw, display } pairs so we can size
    // columns by the uncolored width and still render with ANSI escapes.
    type Cell = { raw: string; display: string }
    const cell = (s: string, display = s): Cell => ({ raw: s, display })

    const columns: { label: string; align: 'L' | 'R' }[] = [
        { label: '#',       align: 'R' },
        { label: 'POOL',    align: 'L' },
        { label: 'MARKET',  align: 'L' },
        { label: 'SIDE',    align: 'L' },
        { label: 'SIZE',    align: 'R' },
        { label: 'ENTRY',   align: 'R' },
        { label: 'MARK',    align: 'R' },
        { label: 'LIQ',     align: 'R' },
        { label: 'PNL',     align: 'R' },
        { label: 'PNL%',    align: 'R' },
        { label: 'LEV',     align: 'R' },
        { label: 'BORROW',  align: 'R' },
        { label: 'COLLAT',  align: 'R' },
        { label: 'TOKEN',   align: 'L' },
        { label: 'PUBKEY',  align: 'L' },
    ]

    const headerCells: Cell[] = columns.map((c) => cell(c.label, bold(c.label)))

    const bodyCells: Cell[][] = rows.map(({ position, poolConfig, market, targetToken, collateralToken }, i) => {
        const sideStr = isVariant(market.side, 'long') ? 'LONG' : 'SHORT'
        const sideColored = isVariant(market.side, 'long') ? green(sideStr) : red(sideStr)

        const entryPriceUi = OraclePrice.from({
            price: position.entryPrice.price,
            exponent: new BN(position.entryPrice.exponent),
            confidence: BN_ZERO,
            timestamp: BN_ZERO,
        }).toUiPrice(targetToken.usdPrecision)

        const markPriceUi = priceMap.get(targetToken.symbol)?.price.toUiPrice(targetToken.usdPrecision) ?? '-'

        const data = positionDatas[i]
        const liqUi = data
            ? OraclePrice.from({
                  price: data.liquidationPrice.price,
                  exponent: new BN(data.liquidationPrice.exponent),
                  confidence: BN_ZERO,
                  timestamp: BN_ZERO,
              }).toUiPrice(targetToken.usdPrecision)
            : '-'

        const pnlUsdRaw = data ? nativeToUiDecimals(data.pnlWithFeeUsd, USD_DECIMALS, 2) : '-'
        const pnlPctRaw = data ? nativeToUiDecimals(data.pnlPercentageWithFee, PCT_DECIMALS, 2) : '-'
        const pnlUsdLabel = pnlUsdRaw === '-' ? '-' : `${signed(pnlUsdRaw)}`
        const pnlPctLabel = pnlPctRaw === '-' ? '-' : `${signed(pnlPctRaw)}%`

        const leverageRaw = data ? nativeToUiDecimals(data.leverage, BPS_DECIMALS, 2) : '-'
        const leverageLabel = leverageRaw === '-' ? '-' : `${leverageRaw}x`

        const borrowFeeUsd = data ? `$${nativeToUiDecimals(data.pnl.borrowFeeUsd, USD_DECIMALS, 2)}` : '-'
        const collateralUsd = `$${nativeToUiDecimals(position.collateralUsd, USD_DECIMALS, 2)}`
        const sizeUi = nativeToUiDecimals(position.sizeAmount, position.sizeDecimals, targetToken.tokenPrecision)

        return [
            cell(String(i)),
            cell(poolConfig.poolName),
            cell(targetToken.symbol),
            cell(sideStr, sideColored),
            cell(sizeUi),
            cell(entryPriceUi),
            cell(markPriceUi),
            cell(liqUi),
            cell(pnlUsdLabel, tintByNumber(pnlUsdRaw, pnlUsdLabel)),
            cell(pnlPctLabel, tintByNumber(pnlPctRaw, pnlPctLabel)),
            cell(leverageLabel),
            cell(borrowFeeUsd),
            cell(collateralUsd),
            cell(collateralToken.symbol),
            cell(shortPk(position.pubkey), dim(shortPk(position.pubkey))),
        ]
    })

    // Column widths driven by the longest raw cell.
    const colWidths = columns.map((_, c) =>
        Math.max(headerCells[c].raw.length, ...bodyCells.map((row) => row[c].raw.length))
    )

    const renderRow = (cells: Cell[]) =>
        cells
            .map((cellVal, c) =>
                columns[c].align === 'R' ? padL(cellVal.display, colWidths[c]) : padR(cellVal.display, colWidths[c])
            )
            .join(dim(' │ '))

    const separator = dim(colWidths.map((w) => '─'.repeat(w)).join('─┼─'))

    console.log(renderRow(headerCells))
    console.log(separator)
    bodyCells.forEach((r) => console.log(renderRow(r)))
    return rows
}

/**
 * Close a position by pubkey. Routes to:
 *   - `closeAndSwap`  when `userReceivingTokenSymbol` differs from the position's collateral, or
 *   - `closePosition` (no swap) when receiving the collateral token directly.
 *
 * The pool is resolved from the position's `market` field, so the caller never
 * needs to know which pool the position lives in.
 */
const closePosition = async (
    positionPubKey: PublicKey,
    options: {
        userReceivingTokenSymbol?: string // defaults to the position's collateral symbol
        slippageBps?: number              // defaults to 800 (0.8%)
    } = {}
) => {
    const slippageBps = options.slippageBps ?? 800

    // 1) Resolve position -> pool -> market -> tokens (active or deprecated).
    const positionData = await flashClient.program.account.position.fetch(positionPubKey)
    const poolConfig = getPoolConfigForMarket(positionData.market)
    const marketConfig =
        poolConfig.markets.find((m) => m.marketAccount.equals(positionData.market)) ??
        poolConfig.marketsDeprecated.find((m) => m.marketAccount.equals(positionData.market))
    if (!marketConfig) {
        throw new Error(`market ${positionData.market.toBase58()} not found in pool ${poolConfig.poolName}`)
    }
    const targetToken = poolConfig.tokens.find((t) => t.mintKey.equals(marketConfig.targetMint))!
    const collateralToken = poolConfig.tokens.find((t) => t.mintKey.equals(marketConfig.collateralMint))!
    const side = marketConfig.side!

    const userReceivingTokenSymbol = options.userReceivingTokenSymbol ?? collateralToken.symbol
    const userReceivingToken = poolConfig.tokens.find((t) => t.symbol === userReceivingTokenSymbol)
    if (!userReceivingToken) {
        throw new Error(`Receiving token ${userReceivingTokenSymbol} is not in pool ${poolConfig.poolName}`)
    }
    const needsSwap = !userReceivingToken.mintKey.equals(collateralToken.mintKey)

    console.log(
        `closePosition -> pool=${poolConfig.poolName} market=${targetToken.symbol} ` +
        `side=${isVariant(side, 'long') ? 'LONG' : 'SHORT'} ` +
        `receive=${userReceivingToken.symbol}${needsSwap ? ' (swap)' : ''}`
    )

    // 2) Price + slippage, on the target leg.
    const priceMap = await getPrices()
    const targetTokenPrice = priceMap.get(targetToken.symbol)!.price
    const priceAfterSlippage = flashClient.getPriceAfterSlippage(false, new BN(slippageBps), targetTokenPrice, side)

    // 3) Privilege accounts (Stake > Referral > None).
    const { privilege, tokenStakeAccount, userReferralAccount } =
        await resolvePrivilegeAccounts(flashClient.provider.publicKey)

    // 4) Build the right SDK call.
    const closeData = needsSwap
        ? await flashClient.closeAndSwap(
              targetToken.symbol,
              userReceivingToken.symbol,
              collateralToken.symbol,
              priceAfterSlippage,
              side,
              poolConfig,
              privilege,
              tokenStakeAccount,
              userReferralAccount,
          )
        : await flashClient.closePosition(
              targetToken.symbol,
              userReceivingToken.symbol,
              priceAfterSlippage,
              side,
              poolConfig,
              privilege,
              tokenStakeAccount,
              userReferralAccount,
          )

    // 5) Send.
    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 })
    const addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(poolConfig)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...closeData.instructions], {
        alts: addresslookupTables,
        additionalSigners: closeData.additionalSigners,
    })
    console.log('trx main :>> ', `: https://explorer.solana.com/tx/${trxId}`)
    return trxId
}

/**
 * Add collateral to an existing position. Routes to:
 *   - `swapAndAddCollateral` when `depositTokenSymbol` differs from the position's collateral, or
 *   - `addCollateral` (no swap) when depositing the collateral token directly.
 *
 * `depositAmount` is the UI amount of the DEPOSIT token (not the collateral, when swapping).
 */
const addCollateral = async (
    positionPubKey: PublicKey,
    depositAmount: string,
    options: {
        depositTokenSymbol?: string // defaults to the position's collateral symbol (no swap)
    } = {}
) => {
    // 1) Resolve position -> pool -> market -> tokens.
    const positionData = await flashClient.program.account.position.fetch(positionPubKey)
    const poolConfig = getPoolConfigForMarket(positionData.market)
    const marketConfig =
        poolConfig.markets.find((m) => m.marketAccount.equals(positionData.market)) ??
        poolConfig.marketsDeprecated.find((m) => m.marketAccount.equals(positionData.market))
    if (!marketConfig) {
        throw new Error(`market ${positionData.market.toBase58()} not found in pool ${poolConfig.poolName}`)
    }
    const targetToken = poolConfig.tokens.find((t) => t.mintKey.equals(marketConfig.targetMint))!
    const collateralToken = poolConfig.tokens.find((t) => t.mintKey.equals(marketConfig.collateralMint))!
    const side = marketConfig.side!

    const depositTokenSymbol = options.depositTokenSymbol ?? collateralToken.symbol
    const depositToken = poolConfig.tokens.find((t) => t.symbol === depositTokenSymbol)
    if (!depositToken) {
        throw new Error(`Deposit token ${depositTokenSymbol} is not in pool ${poolConfig.poolName}`)
    }
    const needsSwap = !depositToken.mintKey.equals(collateralToken.mintKey)

    console.log(
        `addCollateral -> pool=${poolConfig.poolName} market=${targetToken.symbol} ` +
        `side=${isVariant(side, 'long') ? 'LONG' : 'SHORT'} ` +
        `deposit=${depositAmount} ${depositToken.symbol}${needsSwap ? ` (swap -> ${collateralToken.symbol})` : ''}`
    )

    const amountIn = uiDecimalsToNative(depositAmount, depositToken.decimals)

    const data = needsSwap
        ? await flashClient.swapAndAddCollateral(
              targetToken.symbol,
              depositToken.symbol,
              collateralToken.symbol,
              amountIn,
              side,
              positionPubKey,
              poolConfig,
          )
        : await flashClient.addCollateral(
              amountIn,
              targetToken.symbol,
              depositToken.symbol,
              side,
              positionPubKey,
              poolConfig,
          )

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 })
    const addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(poolConfig)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...data.instructions], {
        alts: addresslookupTables,
        additionalSigners: data.additionalSigners,
    })
    console.log('trx main :>> ', `: https://explorer.solana.com/tx/${trxId}`)
    return trxId
}

/**
 * Remove collateral from an existing position. Routes to:
 *   - `removeCollateralAndSwap` when `withdrawTokenSymbol` differs from the position's collateral, or
 *   - `removeCollateral` (no swap) when withdrawing as the collateral token directly.
 *
 * `withdrawAmountUsd` is a UI USD amount (e.g. "10" = $10). The program denominates
 * collateral changes in USD, not in native token units.
 */
const removeCollateral = async (
    positionPubKey: PublicKey,
    withdrawAmountUsd: string,
    options: {
        withdrawTokenSymbol?: string // defaults to the position's collateral symbol (no swap)
    } = {}
) => {
    // 1) Resolve position -> pool -> market -> tokens.
    const positionData = await flashClient.program.account.position.fetch(positionPubKey)
    const poolConfig = getPoolConfigForMarket(positionData.market)
    const marketConfig =
        poolConfig.markets.find((m) => m.marketAccount.equals(positionData.market)) ??
        poolConfig.marketsDeprecated.find((m) => m.marketAccount.equals(positionData.market))
    if (!marketConfig) {
        throw new Error(`market ${positionData.market.toBase58()} not found in pool ${poolConfig.poolName}`)
    }
    const targetToken = poolConfig.tokens.find((t) => t.mintKey.equals(marketConfig.targetMint))!
    const collateralToken = poolConfig.tokens.find((t) => t.mintKey.equals(marketConfig.collateralMint))!
    const side = marketConfig.side!

    const withdrawTokenSymbol = options.withdrawTokenSymbol ?? collateralToken.symbol
    const withdrawToken = poolConfig.tokens.find((t) => t.symbol === withdrawTokenSymbol)
    if (!withdrawToken) {
        throw new Error(`Withdraw token ${withdrawTokenSymbol} is not in pool ${poolConfig.poolName}`)
    }
    const needsSwap = !withdrawToken.mintKey.equals(collateralToken.mintKey)

    console.log(
        `removeCollateral -> pool=${poolConfig.poolName} market=${targetToken.symbol} ` +
        `side=${isVariant(side, 'long') ? 'LONG' : 'SHORT'} ` +
        `withdraw=$${withdrawAmountUsd} as=${withdrawToken.symbol}${needsSwap ? ` (swap from ${collateralToken.symbol})` : ''}`
    )

    const collateralDeltaUsd = uiDecimalsToNative(withdrawAmountUsd, USD_DECIMALS)

    const data = needsSwap
        ? await flashClient.removeCollateralAndSwap(
              targetToken.symbol,
              collateralToken.symbol,
              withdrawToken.symbol,
              collateralDeltaUsd,
              side,
              poolConfig,
          )
        : await flashClient.removeCollateral(
              collateralDeltaUsd,
              targetToken.symbol,
              withdrawToken.symbol,
              side,
              positionPubKey,
              poolConfig,
          )

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 })
    const addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(poolConfig)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...data.instructions], {
        alts: addresslookupTables,
        additionalSigners: data.additionalSigners,
    })
    console.log('trx main :>> ', `: https://explorer.solana.com/tx/${trxId}`)
    return trxId
}

/**
 * Open a leveraged position with an embedded swap. Use this when your input
 * token isn't the collateral the pool's market expects — the SDK swaps inside
 * the same transaction, then opens. The chosen pool must still contain both
 * the input token and the target market.
 *
 * @param inputTokenSymbol   - token you're depositing (must be in the resolved pool's tokens)
 * @param outputTokenSymbol  - target market (e.g. 'ORE', 'SOL')
 * @param inputAmount        - UI amount of input token
 * @param side               - `Side.Long` or `Side.Short`
 * @param leverage           - target leverage; must be within the market's min/max
 *
 * @example
 *   await openPositionWithSwap('USDC', 'ORE', '2', Side.Long, 1.1)   // pay 2 USDC, swap+open 1.1x long ORE
 *   await openPositionWithSwap('USDC', 'SOL', '50', Side.Short, 5)   // pay 50 USDC, swap+open 5x short SOL
 */
const openPositionWithSwap = async (
    inputTokenSymbol: string,
    outputTokenSymbol: string,
    inputAmount: string,
    side: Side,
    leverage: number, // e.g. 1.1, 2, 5, 10 — caller picks; must be within the market's min/max leverage
) => {

    const slippageBps: number = 800 // 0.8%

    const instructions: TransactionInstruction[] = []
    let additionalSigners: Signer[] = []

    // The target market lives in the pool returned by `getRequiredPoolConfig`.
    // `swapAndOpen` swaps the user's input token into the pool's collateral side
    // before opening the position — the input token must therefore be in this
    // same pool's `tokens` set.
    const poolConfig = getRequiredPoolConfig(outputTokenSymbol, side)
    console.log(`openPositionWithSwap -> pool: ${poolConfig.poolName}`)

    const inputToken = poolConfig.tokens.find(t => t.symbol === inputTokenSymbol)
    if (!inputToken) {
        throw new Error(`Input token ${inputTokenSymbol} is not in pool ${poolConfig.poolName} — swapAndOpen needs the input token to be one of the pool's listed tokens.`)
    }
    const outputToken = poolConfig.tokens.find(t => t.symbol === outputTokenSymbol)!;

    const priceMap = await getPrices();

    const inputTokenPrice = priceMap.get(inputToken.symbol)!.price
    const inputTokenPriceEma = priceMap.get(inputToken.symbol)!.emaPrice
    const outputTokenPrice = priceMap.get(outputToken.symbol)!.price
    const outputTokenPriceEma = priceMap.get(outputToken.symbol)!.emaPrice


    const priceAfterSlippage = flashClient.getPriceAfterSlippage(
        true,
        new BN(slippageBps),
        outputTokenPrice,
        side
    )

    const collateralWithFee = uiDecimalsToNative(inputAmount, inputToken.decimals);

    const inputCustody = poolConfig.custodies.find(c => c.symbol === inputToken.symbol)!;
    const outputCustody = poolConfig.custodies.find(c => c.symbol === outputToken.symbol)!;

    const custodies = await flashClient.program.account.custody.fetchMultiple([inputCustody.custodyAccount, outputCustody.custodyAccount]);
    const poolAccount = PoolAccount.from(poolConfig.poolAddress, await flashClient.program.account.pool.fetch(poolConfig.poolAddress));

    const allCustodies = await flashClient.program.account.custody.all()

    const lpMintData = await getMint(connection, poolConfig.stakedLpTokenMint);

    const poolDataClient = new PoolDataClient(
        poolConfig,
        poolAccount,
        lpMintData,
        [...allCustodies.map(c => CustodyAccount.from(c.publicKey, c.account))],
    )

    let lpStats = poolDataClient.getLpStats(await getPrices())

    const inputCustodyAccount = CustodyAccount.from(inputCustody.custodyAccount, custodies[0]!);
    const ouputCustodyAccount = CustodyAccount.from(outputCustody.custodyAccount, custodies[1]!);

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
        poolConfig,
        BN_ZERO // discountBps //uiDecimalsToNative(`${5}`, 2)
    )


    const { privilege, tokenStakeAccount, userReferralAccount } =
        await resolvePrivilegeAccounts(flashClient.provider.publicKey)

    const openPositionData = await flashClient.swapAndOpen(
        outputToken.symbol,
        outputToken.symbol,
        inputToken.symbol,
        collateralWithFee,
        priceAfterSlippage,
        size,
        side,
        poolConfig,
        privilege,            // Privilege.None | Privilege.Stake | Privilege.Referral
        tokenStakeAccount,    // own stake PDA (Stake) or referrer's stake (Referral); else PublicKey.default
        userReferralAccount,  // PDA(referral, trader); else PublicKey.default
    )

    instructions.push(...openPositionData.instructions)
    additionalSigners.push(...openPositionData.additionalSigners)

    const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 })

    let addresslookupTables: AddressLookupTableAccount[] = (
        await flashClient.getOrLoadAddressLookupTable(poolConfig)
    ).addressLookupTables

    const trxId = await flashClient.sendTransaction([setCULimitIx, ...instructions], {
        alts: addresslookupTables,
        additionalSigners: additionalSigners
    })

    console.log('trx main :>> ', `: https://explorer.solana.com/tx/${trxId}`);
    // console.log('trx dev:>> ',  `: https://explorer.solana.com/tx/${trxId}?cluster=devnet`);
}

/**
 * Open a leveraged position and automatically decide whether the input token
 * needs to be swapped first. This is a thin dispatcher over `openPosition` and
 * `openPositionWithSwap` — both kept above as concrete reference implementations
 * so you can see exactly what each path does.
 *
 * Routing rules (mirrors how flash-main-ui's "open" flow picks its tx builder):
 *   1. Find the pool that hosts a `(outputTokenSymbol, side)` market.
 *      → `getRequiredPoolConfig(outputTokenSymbol, side)`.
 *   2. Look for a market in that pool whose collateral mint equals the input
 *      token's mint. If one exists, the input IS the collateral — no swap.
 *      → delegate to `openPosition`.
 *   3. Otherwise the input has to be swapped into the pool's collateral inside
 *      the same tx. Verify the input is at least listed in the pool's tokens
 *      (the swap leg can't quote tokens the pool doesn't know about).
 *      → delegate to `openPositionWithSwap`.
 *
 * @param inputTokenSymbol   - token you're paying with (collateral, or a token to swap)
 * @param outputTokenSymbol  - target market (e.g. 'SOL', 'BTC', 'SPY', 'TRUMP')
 * @param inputAmount        - UI amount of input token
 * @param side               - `Side.Long` or `Side.Short`
 * @param leverage           - target leverage; must be within the market's min/max
 *
 * @example
 *   // No swap — SOL is the collateral the SOL-LONG market expects.
 *   await openPositionAuto('SOL', 'SOL', '0.1', Side.Long, 3)
 *
 *   // Swap required — USDC is in Trump.1 but isn't the TRUMP-LONG market's collateral.
 *   await openPositionAuto('USDC', 'TRUMP', '25', Side.Long, 2)
 */
const openPositionAuto = async (
    inputTokenSymbol: string,
    outputTokenSymbol: string,
    inputAmount: string,
    side: Side,
    leverage: number,
) => {
    // Step 1 — pick the pool that has the target market.
    const poolConfig = getRequiredPoolConfig(outputTokenSymbol, side)

    const inputToken = poolConfig.tokens.find((t) => t.symbol === inputTokenSymbol)
    if (!inputToken) {
        throw new Error(
            `Input token ${inputTokenSymbol} is not listed in pool ${poolConfig.poolName} ` +
            `(which hosts the ${outputTokenSymbol} ${isVariant(side, 'long') ? 'long' : 'short'} market). ` +
            `Pool tokens: ${poolConfig.tokens.map((t) => t.symbol).join(', ')}.`
        )
    }
    const outputToken = poolConfig.tokens.find((t) => t.symbol === outputTokenSymbol)!

    // Step 2 — is there a market with this exact target + side + collateral?
    // If yes, the input token IS the collateral and we skip the swap step.
    const directMarket = poolConfig.markets.find(
        (m) =>
            m.targetMint.equals(outputToken.mintKey) &&
            m.collateralMint.equals(inputToken.mintKey) &&
            isVariant(m.side, 'long') === isVariant(side, 'long')
    )

    if (directMarket) {
        console.log(
            `openPositionAuto -> no swap (input=${inputTokenSymbol} matches market collateral)`
        )
        return openPosition(inputTokenSymbol, outputTokenSymbol, inputAmount, side, leverage)
    }

    // Step 3 — input token differs from the market's collateral → swap-and-open.
    console.log(
        `openPositionAuto -> swap (input=${inputTokenSymbol} -> market collateral)`
    )
    return openPositionWithSwap(inputTokenSymbol, outputTokenSymbol, inputAmount, side, leverage)
}

/**
 * Read the current liquidation price for a position. Scans every pool because
 * `getLiquidationPriceView` is pool-scoped on the SDK side; returns the first
 * match. Result is a UI string at 6 decimals (`OraclePrice.toUiPrice(6)`).
 *
 * @example
 *   const liqPx = await getLiquidationPrice(new PublicKey('4hXHkgakfMxRo1TMYbT6iFUET7748VYs9CY8GVjZsDT1'))
 *   console.log(`liquidates at $${liqPx}`)
 */
const getLiquidationPrice = async (positionPubKey: PublicKey) => {

    // Try every pool — getLiquidationPriceView is pool-scoped.
    let data: Awaited<ReturnType<typeof flashClient.getLiquidationPriceView>> | undefined
    for (const config of POOL_CONFIGS) {
        try {
            data = await flashClient.getLiquidationPriceView(positionPubKey, config)
            if (data) break
        } catch {
            // position isn't in this pool — keep looking
        }
    }
    if (!data) {
        throw new Error('position not found in any pool')
    }

    const LiqOraclePrice = OraclePrice.from({
        price: data.price,
        exponent: new BN(data.exponent),
        confidence: new BN(0),
        timestamp: new BN(0),
    })

    console.log('price :>> ', LiqOraclePrice.toUiPrice(6));
    return LiqOraclePrice.toUiPrice(6) // 6 is the decimals precision for liquidation price, you can change it based on your needs
}

(async () => {

    console.log(" testing... uncomment below to test");


    // NOTE: pool is now picked automatically from (token, side) — SOL+BTC land in Crypto.1,
    // SPY lands in Equity.1, TRUMP lands in Trump.1, ORE lands in Ore.1, etc.

    // ---- OPEN (one-liner: auto-routes between direct open and swap-and-open) ----
    // await openPositionAuto('SOL',  'SOL',   '0.1', Side.Long, 3.1)  // no swap
    // await openPositionAuto('USDC', 'BTC', '10',  Side.Long, 2)    // swap required


    // ---- OPEN (explicit, for reference) ----
    // await openPosition('SOL', 'SOL', '0.1', Side.Long, 1.1)
    // await openPosition('JUP', 'JUP', '10',  Side.Long, 3.1)

    // ---- OPEN with input-token swap (explicit, for reference) ----
    // await openPositionWithSwap('USDC', 'ORE', '2', Side.Long, 1.1)
    // await openPositionWithSwap('USDC', 'SOL', '2', Side.Long, 1.1)

    // ---- LIST positions (pretty-prints; also returns the rows) ----
    const positions = await displayUserPositions()

    // ---- CLOSE (one unified call — auto-swaps if userReceivingTokenSymbol != collateral) ----
    if (positions.length) {
        const { position, collateralToken } = positions[0]
        // (a) close into the position's collateral (no swap):
        await closePosition(position.pubkey)
        // (b) close + swap into USDC:
        // await closePosition(position.pubkey, { userReceivingTokenSymbol: 'USDC' })
        // (c) close into the same collateral with custom slippage:
        // await closePosition(position.pubkey, { userReceivingTokenSymbol: collateralToken.symbol, slippageBps: 1500 })
        void collateralToken
    }

    // ---- ADD COLLATERAL (auto-swaps when depositTokenSymbol != position's collateral) ----
    // if (positions.length) {
    //     const { position } = positions[0]
    //     // (a) deposit the collateral token directly:
    //     await addCollateral(position.pubkey, '0.05')
    //     // (b) deposit a different token (swaps under the hood):
    //     // await addCollateral(position.pubkey, '5', { depositTokenSymbol: 'USDC' })
    // }

    // ---- REMOVE COLLATERAL (amount is in USD; auto-swaps when withdrawTokenSymbol != collateral) ----
    // if (positions.length) {
    //     const { position } = positions[0]
    //     // (a) withdraw $10 as the position's collateral token:
    //     await removeCollateral(position.pubkey, '10')
    //     // (b) withdraw $10 received as USDC (swaps under the hood):
    //     // await removeCollateral(position.pubkey, '10', { withdrawTokenSymbol: 'USDC' })
    // }

    // await getLiquidationPrice(new PublicKey('4hXHkgakfMxRo1TMYbT6iFUET7748VYs9CY8GVjZsDT1'));

})()
