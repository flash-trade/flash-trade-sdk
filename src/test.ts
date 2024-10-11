import { AnchorProvider, BN } from "@coral-xyz/anchor"
import { PublicKey, ConfirmOptions, Connection } from "@solana/web3.js"
import { PerpetualsClient } from "./PerpetualsClient"
import { PoolConfig } from "./PoolConfig"

const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta')

const defaultWallet = {
    publicKey: new PublicKey('FXdKGsKHjigiMZjjQdmQwQTeTLs5hCVnvChbM7tZyK47'), //PublicKey.default,
    // @ts-ignore
    signTransaction: () => Promise.any([]),
    // @ts-ignore
    signAllTransactions: () => Promise.any([]),
}

const options: ConfirmOptions = {
    commitment: 'processed',
    skipPreflight: true,
}

const CLUSTER_URL = 'https://flashtr-flash-885f.mainnet.rpcpool.com/11a75a74-fd8e-44cc-87f4-d84bb82d0983'

const main = async () => {
    const PROGRAM_ID = POOL_CONFIG.programId
    const PERP_COMPOSIBILITY_PROGRAM_ID = POOL_CONFIG.perpComposibilityProgramId
    const FB_NFT_REWARD_PROGRAM_ID = POOL_CONFIG.fbNftRewardProgramId
    const RAFFLE_REWARD_PROGRAM_ID = POOL_CONFIG.rewardDistributionProgram.programId

    const USDC_CUSTODY = POOL_CONFIG.custodies.find((i) => i.symbol == 'USDC')!

    const dummyProvider = new AnchorProvider(new Connection(CLUSTER_URL), defaultWallet, options)
    const dummyPerpClient = new PerpetualsClient(
        dummyProvider,
        PROGRAM_ID,
        PERP_COMPOSIBILITY_PROGRAM_ID,
        FB_NFT_REWARD_PROGRAM_ID,
        RAFFLE_REWARD_PROGRAM_ID,
        {
            prioritizationFee: 0,
        }
    )

    const compoundingLPTokenPrice = await dummyPerpClient.getCompoundingLPTokenPrice(POOL_CONFIG.poolAddress, POOL_CONFIG)
    console.log('compoundingLPTokenPrice :>> ', compoundingLPTokenPrice);

    const sFLPAddLiquidityAmountAndFee = await dummyPerpClient.getSFLPAddLiquidityAmountAndFee(new BN(1_000_000), POOL_CONFIG.poolAddress, USDC_CUSTODY.custodyAccount, POOL_CONFIG)
    console.log('sFLPAddLiquidityAmountAndFee :>> ', JSON.stringify(sFLPAddLiquidityAmountAndFee));

    const sFLPRemoveLiquidityAmountAndFee = await dummyPerpClient.getSFLPRemoveLiquidityAmountAndFee(new BN(1_000_000), POOL_CONFIG.poolAddress, USDC_CUSTODY.custodyAccount, POOL_CONFIG)
    console.log('sFLPRemoveLiquidityAmountAndFee :>> ', JSON.stringify(sFLPRemoveLiquidityAmountAndFee));
}
