export type RewardDistribution = {
  "version": "0.1.0",
  "name": "reward_distribution",
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
      "args": []
    },
    {
      "name": "updateCounter",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "distributeRewards",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": false
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
          "name": "rewardRecord",
          "isMut": true,
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
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
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
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingAccount",
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
          "name": "rewardRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
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
            "name": "winnersCount",
            "type": "u64"
          },
          {
            "name": "raffleCounter",
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
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "reward",
            "type": "u64"
          },
          {
            "name": "paid",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
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
  "events": [
    {
      "name": "DistributeRewardsLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "raffleCount",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectRewardLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "raffleCount",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ]
};

export const IDL: RewardDistribution = {
  "version": "0.1.0",
  "name": "reward_distribution",
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
      "args": []
    },
    {
      "name": "updateCounter",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "distributeRewards",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": false
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
          "name": "rewardRecord",
          "isMut": true,
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
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
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
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingAccount",
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
          "name": "rewardRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
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
            "name": "winnersCount",
            "type": "u64"
          },
          {
            "name": "raffleCounter",
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
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "reward",
            "type": "u64"
          },
          {
            "name": "paid",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
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
  "events": [
    {
      "name": "DistributeRewardsLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "raffleCount",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectRewardLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "raffleCount",
          "type": "u64",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ]
};
