import { PublicKey } from "@solana/web3.js";
import { Privilege, isVariant } from "../types";

export const getReferralAccounts = (
    tokenStakeAccount: PublicKey,
    userReferralAccount: PublicKey,
    privilege: Privilege
) => {
    if (isVariant(privilege, 'none')) {
        return [];
    }

    if (tokenStakeAccount.equals(PublicKey.default) || userReferralAccount.equals(PublicKey.default) ) {
        console.log("skipping refferals")
        return [];
    }

    const isStake = isVariant(privilege, 'stake');
    
    return [
        {
            pubkey: userReferralAccount,
            isSigner: false,
            isWritable: !isStake,
        },
        {
            pubkey: tokenStakeAccount,
            isSigner: false,
            isWritable: true,
        }
    ];
};
