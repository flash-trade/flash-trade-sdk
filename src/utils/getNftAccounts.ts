import { PublicKey } from "@solana/web3.js";
import { Privilege, isVariant } from "../types";

export const getNftAccounts = (
    nftTradingAccount: PublicKey,
    nftReferralAccount: PublicKey,
    nftRebateTokenAccount: PublicKey,
    privilege: Privilege
) => {
    if (isVariant(privilege, 'none')) {
        return [];
    }

    const isNFTPrivilege = isVariant(privilege, 'nft');
    
    return [
        {
            pubkey: nftReferralAccount,
            isSigner: false,
            isWritable: !isNFTPrivilege,
        },
        {
            pubkey: nftTradingAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: nftRebateTokenAccount,
            isSigner: false,
            isWritable: !isNFTPrivilege,
        },
    ];
};
