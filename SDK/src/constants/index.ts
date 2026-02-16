import { Cluster, PublicKey} from '@solana/web3.js'
import { BN } from "bn.js";


export const PERCENTAGE_DECIMALS = 4; // stableCoinPercentage
export const USD_DECIMALS = 6; 


export const BPS_DECIMALS = 4; 
export const BPS_POWER = 10**(BPS_DECIMALS);

export const LP_DECIMALS = USD_DECIMALS;

export const FAF_DECIMALS = 6;


export const RATE_DECIMALS = 9; // borow rate 
export const RATE_POWER = 10**(RATE_DECIMALS);

export const ORACLE_EXPONENT = 9 // for bonk like pairs price should be higher than 6 (USD decimals) 

export const BN_ZERO = new BN(0);
export const BN_ONE = new BN(1);

export const DAY_SECONDS = new BN(3600)

export const METAPLEX_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
export const PYTH_LAZER_PROGRAM_ID = new PublicKey("pytd2yyk641x7ak7mkaasSJVXh6YYZnC7wTmtgAyxPt")
