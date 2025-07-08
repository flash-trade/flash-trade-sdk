import dotenv from 'dotenv';
import { BN_ZERO, BPS_DECIMALS, CustodyAccount, getUnixTs, nativeToUiDecimals, OraclePrice, PerpetualsClient, PoolAccount, PoolConfig, PoolDataClient, PositionAccount, Privilege, Side, uiDecimalsToNative, USD_DECIMALS } from 'flash-sdk';
dotenv.config();
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { TransactionInstruction, Signer, PublicKey, ComputeBudgetProgram, Connection } from '@solana/web3.js';

export const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');


export const RPC_URL = process.env.RPC_URL;
console.log("RPC_URL:>> ", RPC_URL);
if (!RPC_URL) {
    throw new Error('RPC_URL is not set');
}

const provider: AnchorProvider = AnchorProvider.local(RPC_URL, {
    commitment: 'processed',
    preflightCommitment: 'processed',
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
)

// addLiquidityAndStake 1 USDC 
const getUserClaimableRevenueAmount = async () => {
   
    await flashClient.loadAddressLookupTable(POOL_CONFIG)

    // flash-sdk version >= 2.52.1
    const revenueAmount = await flashClient.getUserClaimableRevenueAmount( POOL_CONFIG, new PublicKey('GKTLG6uuNnhCZkVwNbPk1g4uuQQMmM2YFqNXC2MoffMd'));

    console.log('revenueAmount :>> ', revenueAmount.toString(), nativeToUiDecimals(revenueAmount, USD_DECIMALS));
   
}


(async () => {

    console.log("testing...");
    // await getUserClaimableRevenueAmount();
   
})()
