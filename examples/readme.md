# Flash Trade SDK — Examples

Runnable scripts that show how to use [`flash-sdk`](https://www.npmjs.com/package/flash-sdk) for the full perp-trading lifecycle. Each file is meant to be read top-to-bottom — every step has comments and JSDoc with `@example` blocks.

| File | What it covers |
| --- | --- |
| `src/trade.ts` | Open / close / manage perp positions across **all mainnet pools** (Crypto.1, Equity.1, Trump.1, Ore.1, …). Includes price fetching, privilege/referral resolution, and a pretty positions table with live PnL. |
| `src/liquidity.ts` | LP flows: add / remove liquidity, stake LP, set LP token price. |
| `src/revenue.ts` | Read the wallet's claimable revenue. |

---

## 1. One-time setup

```bash
# Create a keypair (or reuse ~/.config/solana/id.json — just point ANCHOR_WALLET at it)
solana-keygen new --outfile localPublicKey.json

# Fund it on mainnet from your own wallet, or for devnet:
solana airdrop 0.2 $(solana-keygen pubkey ./localPublicKey.json)

# Copy the env template and fill RPC_URL with a mainnet endpoint
cp .env.example .env

# Install deps
yarn
```

`.env` only needs two values:

```env
ANCHOR_WALLET=localPublicKey.json
RPC_URL=https://your-mainnet-rpc.example.com
# LAZER_PROXY_URL is optional — defaults to https://pyth-lazer-proxy-3.dourolabs.app
```

---

## 2. Run

```bash
# Trading
npx ts-node src/trade.ts

# Liquidity / LP
npx ts-node src/liquidity.ts

# Revenue read
npx ts-node src/revenue.ts
```

Each script has an `async` IIFE at the bottom — most calls are commented out so the script is a safe no-op out of the box. Uncomment the lines you want to execute.

---

## 3. What's inside `trade.ts`

### Pool auto-routing

You don't pick a `POOL_CONFIG` anymore. Every mainnet pool is loaded into `POOL_CONFIGS`, and the right one is chosen automatically from the `(token, side)` you ask for. SOL / BTC → `Crypto.1`, SPY → `Equity.1`, TRUMP → `Trump.1`, ORE → `Ore.1`, etc.

### Prices

A single HTTP GET to the **Pyth Lazer proxy** (`/v1/latest_price`) returns the prices for every token across every pool. No Pythnet RPC, no `PythHttpClient` — same approach `flash-main-ui` uses (see `workers/lazerPrice.worker.ts`).

### Function reference

| Function | One-liner |
| --- | --- |
| `openPosition(input, output, amount, side, lev)` | Open a position. The input token must already be the market's collateral. |
| `openPositionWithSwap(input, output, amount, side, lev)` | Open a position, swapping the input into the market's collateral inside the same tx. |
| `openPositionAuto(input, output, amount, side, lev)` | **Recommended.** Auto-decides between the two above based on whether a swap is needed. |
| `closePosition(positionPubKey, { userReceivingTokenSymbol?, slippageBps? })` | Close a position. If `userReceivingTokenSymbol` differs from the position's collateral, routes to `closeAndSwap`. |
| `addCollateral(positionPubKey, depositAmount, { depositTokenSymbol? })` | Top up collateral. Auto-routes to `swapAndAddCollateral` when the deposit token differs from collateral. |
| `removeCollateral(positionPubKey, withdrawAmountUsd, { withdrawTokenSymbol? })` | Pull collateral out — amount is in **USD** (not native units). Auto-routes to `removeCollateralAndSwap` when needed. |
| `displayUserPositions()` | Pretty-prints every open position across every pool with live mark, liq price, PnL ($ and %), live leverage, accrued borrow fees. Returns the enriched rows. |
| `getAllUserPositions()` | Same data as `displayUserPositions` but without the printing — for programmatic use. |
| `getLiquidationPrice(positionPubKey)` | Returns liquidation price as a UI string. |

### Sample flow

```ts
// 1) Open a 3x long SOL with 0.1 SOL collateral (no swap):
await openPositionAuto('SOL', 'SOL', '0.1', Side.Long, 3)

// 2) Open a 2x long TRUMP using USDC (swap-and-open inside the tx):
await openPositionAuto('USDC', 'TRUMP', '25', Side.Long, 2)

// 3) See what you have:
const positions = await displayUserPositions()
// # │ POOL     │ MARKET │ SIDE │   SIZE │ ENTRY │  MARK │   LIQ │   PNL │  PNL% │  LEV  │ BORROW │ COLLAT │ TOKEN │ PUBKEY
// ──┼──────────┼────────┼──────┼────────┼───────┼───────┼───────┼───────┼───────┼───────┼────────┼────────┼───────┼─────────────
// 0 │ Crypto.1 │ SOL    │ LONG │ 0.1098 │ 92.18 │ 92.16 │  8.47 │ +0.21 │ +2.1% │ 1.10x │  $0.00 │ $10.12 │ SOL   │ 9LiN..Bii9

// 4) Top up the first one with $5 USDC (swap-and-add):
const { position } = positions[0]
await addCollateral(position.pubkey, '5', { depositTokenSymbol: 'USDC' })

// 5) Pull $2 of collateral back out as USDC (remove-and-swap):
await removeCollateral(position.pubkey, '2', { withdrawTokenSymbol: 'USDC' })

// 6) Close into USDC instead of the original collateral:
await closePosition(position.pubkey, { userReceivingTokenSymbol: 'USDC' })
```

### Optional: stake / referral fee discounts

`trade.ts` resolves your `Privilege` automatically before every trade — if you have an active FAF token-stake (level ≥ 1) you get `Privilege.Stake`, if you have a referral account you get `Privilege.Referral`, otherwise `Privilege.None`. The helper is `resolvePrivilegeAccounts(trader)` and the PDA derivations are:

- `userReferralAccount` = PDA(`['referral', wallet]`)
- `tokenStakeAccount` = PDA(`['token_stake', wallet]`)

Both use the perp `programId` (shared across all mainnet pools).

---

## 4. What's inside `liquidity.ts`

LP-side flows: `addLiquidityAndStake`, `removeLiquidity`, `setLpTokenPrice`, etc. Pool is selected explicitly at the top of the file (LP isn't per-market, so auto-routing doesn't apply).

---

## Common gotchas

- **`RPC_URL is not set`** — your `.env` isn't loaded. Make sure the file exists in `examples/` and `dotenv` is finding it (the scripts call `dotenv.config()` at the top).
- **`Insufficient SOL Funds`** — fund the wallet derived from `ANCHOR_WALLET` (use `solana-keygen pubkey $ANCHOR_WALLET` to see the address).
- **`No pool found with a … market for X`** — the symbol isn't tradeable on mainnet, or you typo'd it. Check `POOL_CONFIGS[i].markets` for available markets.
- **Position lookup returns nothing** — `displayUserPositions` filters out `isActive: false`. Stale/closed positions stay on-chain but are skipped.
