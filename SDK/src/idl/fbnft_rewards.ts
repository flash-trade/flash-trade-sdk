export type FbnftRewards = {
  "version": "0.1.0",
  "name": "fbnft_rewards",
  "instructions": [
    {
      "name": "initRewardVault",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitRewardVaultParams"
          }
        }
      ]
    },
    {
      "name": "distributeRewards",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DistributeRewardsParams"
          }
        }
      ]
    },
    {
      "name": "collectReward",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "rewardVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "transferAuthority",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "lpTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "nftCount",
            "type": "u64"
          },
          {
            "name": "accruedAmount",
            "type": "u128"
          },
          {
            "name": "paidAmount",
            "type": "u128"
          },
          {
            "name": "rewardsPerNft",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "rewardRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "rewardDebt",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitRewardVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "DistributeRewardsParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCollection",
      "msg": "Unsuppported NFT collection"
    },
    {
      "code": 6001,
      "name": "InvalidCount",
      "msg": "Invalid NFT Count"
    }
  ]
};

export const IDL: FbnftRewards = {
  "version": "0.1.0",
  "name": "fbnft_rewards",
  "instructions": [
    {
      "name": "initRewardVault",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitRewardVaultParams"
          }
        }
      ]
    },
    {
      "name": "distributeRewards",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DistributeRewardsParams"
          }
        }
      ]
    },
    {
      "name": "collectReward",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "rewardVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "collection",
            "type": "publicKey"
          },
          {
            "name": "rewardMint",
            "type": "publicKey"
          },
          {
            "name": "transferAuthority",
            "type": "publicKey"
          },
          {
            "name": "rewardTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "lpTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "nftCount",
            "type": "u64"
          },
          {
            "name": "accruedAmount",
            "type": "u128"
          },
          {
            "name": "paidAmount",
            "type": "u128"
          },
          {
            "name": "rewardsPerNft",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "rewardRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "rewardDebt",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitRewardVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "DistributeRewardsParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardAmount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidCollection",
      "msg": "Unsuppported NFT collection"
    },
    {
      "code": 6001,
      "name": "InvalidCount",
      "msg": "Invalid NFT Count"
    }
  ]
};
