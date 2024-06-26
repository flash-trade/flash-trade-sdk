export type Perpetuals = {
  "version": "0.1.0",
  "name": "perpetuals",
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "upgradeAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetualsProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetualsProgramData",
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
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitParams"
          }
        }
      ]
    },
    {
      "name": "addPool",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "oracleAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
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
          "name": "metadataProgram",
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
            "defined": "AddPoolParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removePool",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemovePoolParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addCustody",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenMint",
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
            "defined": "AddCustodyParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addCollection",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddCollectionParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removeCustody",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCustodyParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addMarket",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
            "defined": "AddMarketParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removeMarket",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
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
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveMarketParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setAdminSigners",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetAdminSignersParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setCustodyConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetCustodyConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPerpetualsConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetPerpetualsConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPermissions",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetPermissionsParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPoolConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetPoolConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setMarketConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetMarketConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setFlpStakeConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetFlpStakeConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawFees",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingTokenAccount",
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
            "defined": "WithdrawFeesParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawSolFees",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawSolFeesParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "updateTokenRatios",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateTokenRatiosParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initStaking",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedLpTokenAccount",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitStakingParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setCustomOraclePrice",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetCustomOraclePriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "testInit",
      "accounts": [
        {
          "name": "upgradeAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TestInitParams"
          }
        }
      ]
    },
    {
      "name": "setTestTime",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetTestTimeParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddLiquidityParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeLiquidity",
      "accounts": [
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
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveLiquidityParams"
          }
        }
      ]
    },
    {
      "name": "depositStake",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundingFlpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFlpTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DepositStakeParams"
          }
        }
      ]
    },
    {
      "name": "refreshStake",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDistributionTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RefreshStakeParams"
          }
        }
      ]
    },
    {
      "name": "unstakeInstant",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDistributionTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UnstakeInstantParams"
          }
        }
      ]
    },
    {
      "name": "withdrawStake",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingFlpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFlpTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawStakeParams"
          }
        }
      ]
    },
    {
      "name": "collectStakeFees",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeCustodyTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectStakeRewardParams"
          }
        }
      ]
    },
    {
      "name": "unstakeRequest",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UnstakeRequestParams"
          }
        }
      ]
    },
    {
      "name": "createTradingAccount",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
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
          "name": "tradingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateTradingAccountParams"
          }
        }
      ]
    },
    {
      "name": "updateTradingAccount",
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
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateTradingAccountParams"
          }
        }
      ]
    },
    {
      "name": "createReferral",
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
          "name": "tradingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateReferralParams"
          }
        }
      ]
    },
    {
      "name": "openPosition",
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
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "OpenPositionParams"
          }
        }
      ]
    },
    {
      "name": "setTriggerPrice",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetTriggerPriceParams"
          }
        }
      ]
    },
    {
      "name": "addCollateral",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddCollateralParams"
          }
        }
      ]
    },
    {
      "name": "removeCollateral",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCollateralParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "increaseSize",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "IncreaseSizeParams"
          }
        }
      ]
    },
    {
      "name": "decreaseSize",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DecreaseSizeParams"
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ClosePositionParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "forceClosePosition",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ForceClosePositionParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "levelUp",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "LevelUpParams"
          }
        }
      ]
    },
    {
      "name": "liquidate",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "LiquidateParams"
          }
        }
      ]
    },
    {
      "name": "getAddLiquidityAmountAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetAddLiquidityAmountAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "AmountAndFee"
      }
    },
    {
      "name": "getRemoveLiquidityAmountAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetRemoveLiquidityAmountAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "AmountAndFee"
      }
    },
    {
      "name": "getEntryPriceAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetEntryPriceAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "NewPositionPricesAndFee"
      }
    },
    {
      "name": "getExitPriceAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetExitPriceAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "PriceAndFee"
      }
    },
    {
      "name": "getPnl",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetPnlParams"
          }
        }
      ],
      "returns": {
        "defined": "ProfitAndLoss"
      }
    },
    {
      "name": "getPositionData",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetPositionDataParams"
          }
        }
      ],
      "returns": {
        "defined": "PositionData"
      }
    },
    {
      "name": "getLiquidationState",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetLiquidationStateParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "getLiquidationPrice",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetLiquidationPriceParams"
          }
        }
      ],
      "returns": {
        "defined": "OraclePrice"
      }
    },
    {
      "name": "getOraclePrice",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetOraclePriceParams"
          }
        }
      ],
      "returns": {
        "defined": "(OraclePrice,OraclePrice)"
      }
    },
    {
      "name": "getSwapAmountAndFees",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetSwapAmountAndFeesParams"
          }
        }
      ],
      "returns": {
        "defined": "SwapAmountAndFees"
      }
    },
    {
      "name": "getAssetsUnderManagement",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetAssetsUnderManagementParams"
          }
        }
      ],
      "returns": {
        "defined": "(u128,u128)"
      }
    },
    {
      "name": "getLpTokenPrice",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetLpTokenPriceParams"
          }
        }
      ],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "custody",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "isStable",
            "type": "bool"
          },
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "isVirtual",
            "type": "bool"
          },
          {
            "name": "distributeRewards",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": "OracleParams"
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": "PricingParams"
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": "BorrowRateParams"
            }
          },
          {
            "name": "rewardThreshold",
            "type": "u64"
          },
          {
            "name": "assets",
            "type": {
              "defined": "Assets"
            }
          },
          {
            "name": "feesStats",
            "type": {
              "defined": "FeesStats"
            }
          },
          {
            "name": "borrowRateState",
            "type": {
              "defined": "BorrowRateState"
            }
          },
          {
            "name": "bump",
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
      "name": "flpStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "stakeStats",
            "type": {
              "defined": "StakeStats"
            }
          },
          {
            "name": "rewardSnapshot",
            "type": "u128"
          },
          {
            "name": "unclaimedRewards",
            "type": "u64"
          },
          {
            "name": "feeShareBps",
            "type": "u64"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "targetCustody",
            "type": "publicKey"
          },
          {
            "name": "collateralCustody",
            "type": "publicKey"
          },
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          },
          {
            "name": "correlation",
            "type": "bool"
          },
          {
            "name": "maxPayoffBps",
            "type": "u64"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "MarketPermissions"
            }
          },
          {
            "name": "openInterest",
            "type": "u64"
          },
          {
            "name": "collectivePosition",
            "type": {
              "defined": "PositionStats"
            }
          },
          {
            "name": "targetCustodyId",
            "type": "u64"
          },
          {
            "name": "collateralCustodyId",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numSigners",
            "type": "u8"
          },
          {
            "name": "numSigned",
            "type": "u8"
          },
          {
            "name": "minSignatures",
            "type": "u8"
          },
          {
            "name": "instructionAccountsLen",
            "type": "u8"
          },
          {
            "name": "instructionDataLen",
            "type": "u16"
          },
          {
            "name": "instructionHash",
            "type": "u64"
          },
          {
            "name": "signers",
            "type": {
              "array": [
                "publicKey",
                6
              ]
            }
          },
          {
            "name": "signed",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "customOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "conf",
            "type": "u64"
          },
          {
            "name": "ema",
            "type": "u64"
          },
          {
            "name": "publishTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "perpetuals",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "pools",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "collections",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          },
          {
            "name": "tradingDiscount",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralRebate",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralDiscount",
            "type": "u64"
          },
          {
            "name": "inceptionTime",
            "type": "i64"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          },
          {
            "name": "perpetualsBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "inceptionTime",
            "type": "i64"
          },
          {
            "name": "flpMint",
            "type": "publicKey"
          },
          {
            "name": "oracleAuthority",
            "type": "publicKey"
          },
          {
            "name": "flpTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "rewardCustody",
            "type": "publicKey"
          },
          {
            "name": "custodies",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          },
          {
            "name": "markets",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "maxAumUsd",
            "type": "u128"
          },
          {
            "name": "aumUsd",
            "type": "u128"
          },
          {
            "name": "totalStaked",
            "type": {
              "defined": "StakeStats"
            }
          },
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "flpMintBump",
            "type": "u8"
          },
          {
            "name": "flpTokenAccountBump",
            "type": "u8"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": "publicKey"
          },
          {
            "name": "openTime",
            "type": "i64"
          },
          {
            "name": "updateTime",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "lockedUsd",
            "type": "u64"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "unsettledAmount",
            "type": "u64"
          },
          {
            "name": "unsettledFeesUsd",
            "type": "u64"
          },
          {
            "name": "cumulativeLockFeeSnapshot",
            "type": "u128"
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeDecimals",
            "type": "u8"
          },
          {
            "name": "lockedDecimals",
            "type": "u8"
          },
          {
            "name": "collateralDecimals",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "referral",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "refererTradingAccount",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "trading",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "voltagePoints",
            "type": "u64"
          },
          {
            "name": "stats",
            "type": {
              "defined": "VoltageStats"
            }
          },
          {
            "name": "snapshot",
            "type": {
              "defined": "VoltageStats"
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AddCollectionParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "AddCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isStable",
            "type": "bool"
          },
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "isVirtual",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": "OracleParams"
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": "PricingParams"
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": "BorrowRateParams"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          }
        ]
      }
    },
    {
      "name": "AddLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minLpAmountOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AddMarketParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          },
          {
            "name": "correlation",
            "type": "bool"
          },
          {
            "name": "maxPayoffBps",
            "type": "u64"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "MarketPermissions"
            }
          }
        ]
      }
    },
    {
      "name": "AddPoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "maxAumUsd",
            "type": "u128"
          },
          {
            "name": "metadataTitle",
            "type": "string"
          },
          {
            "name": "metadataSymbol",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ClosePositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "CollectStakeRewardParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CreateReferralParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CreateTradingAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collectionIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "DecreaseSizeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "DepositStakeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ForceClosePositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "GetAddLiquidityAmountAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetAssetsUnderManagementParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetEntryPriceAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateral",
            "type": "u64"
          },
          {
            "name": "size",
            "type": "u64"
          },
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          }
        ]
      }
    },
    {
      "name": "GetExitPriceAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetLiquidationPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetLiquidationStateParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetLpTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetOraclePriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetPnlParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetPositionDataParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetRemoveLiquidityAmountAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpAmountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetSwapAmountAndFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "useFeePool",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "IncreaseSizeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "InitStakingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minSignatures",
            "type": "u8"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          },
          {
            "name": "tradingDiscount",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralRebate",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralDiscount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "LevelUpParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "LiquidateParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "OpenPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "RefreshStakeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemoveCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RemoveCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          }
        ]
      }
    },
    {
      "name": "RemoveLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpAmountIn",
            "type": "u64"
          },
          {
            "name": "minAmountOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RemoveMarketParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemovePoolParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "SetAdminSignersParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minSignatures",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SetCustodyConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": "OracleParams"
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": "PricingParams"
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": "BorrowRateParams"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          },
          {
            "name": "rewardThreshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetCustomOraclePriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "conf",
            "type": "u64"
          },
          {
            "name": "ema",
            "type": "u64"
          },
          {
            "name": "publishTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SetFlpStakeConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeShareBps",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetMarketConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxPayoffBps",
            "type": "u64"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "MarketPermissions"
            }
          }
        ]
      }
    },
    {
      "name": "SetPermissionsParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          }
        ]
      }
    },
    {
      "name": "SetPerpetualsConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowUngatedTrading",
            "type": "bool"
          },
          {
            "name": "tradingDiscount",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralRebate",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralDiscount",
            "type": "u64"
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          }
        ]
      }
    },
    {
      "name": "SetPoolConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "oracleAuthority",
            "type": "publicKey"
          },
          {
            "name": "maxAumUsd",
            "type": "u128"
          },
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SetTestTimeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "time",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SetTriggerPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "triggerPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "SwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "useFeesPool",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TestInitParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minSignatures",
            "type": "u8"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          }
        ]
      }
    },
    {
      "name": "UnstakeInstantParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UnstakeRequestParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateTokenRatiosParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          }
        ]
      }
    },
    {
      "name": "UpdateTradingAccountParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "WithdrawFeesParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "WithdrawSolFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WithdrawStakeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingActivation",
            "type": "bool"
          },
          {
            "name": "deactivated",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Fees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mode",
            "type": {
              "defined": "FeesMode"
            }
          },
          {
            "name": "swapIn",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "swapOut",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "stableSwapIn",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "stableSwapOut",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "addLiquidity",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "removeLiquidity",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "openPosition",
            "type": "u64"
          },
          {
            "name": "closePosition",
            "type": "u64"
          },
          {
            "name": "removeCollateral",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RatioFees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minFee",
            "type": "u64"
          },
          {
            "name": "targetFee",
            "type": "u64"
          },
          {
            "name": "maxFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Assets",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateral",
            "type": "u64"
          },
          {
            "name": "owned",
            "type": "u64"
          },
          {
            "name": "locked",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FeesStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accrued",
            "type": "u128"
          },
          {
            "name": "distributed",
            "type": "u128"
          },
          {
            "name": "paid",
            "type": "u128"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "protocolFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PricingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradeSpreadLong",
            "type": "u64"
          },
          {
            "name": "tradeSpreadShort",
            "type": "u64"
          },
          {
            "name": "swapSpread",
            "type": "u64"
          },
          {
            "name": "minInitialLeverage",
            "type": "u64"
          },
          {
            "name": "maxInitialLeverage",
            "type": "u64"
          },
          {
            "name": "maxLeverage",
            "type": "u64"
          },
          {
            "name": "minCollateralUsd",
            "type": "u64"
          },
          {
            "name": "delaySeconds",
            "type": "i64"
          },
          {
            "name": "maxUtilization",
            "type": "u64"
          },
          {
            "name": "maxPositionLockedUsd",
            "type": "u64"
          },
          {
            "name": "maxExposureUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BorrowRateParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseRate",
            "type": "u64"
          },
          {
            "name": "slope1",
            "type": "u64"
          },
          {
            "name": "slope2",
            "type": "u64"
          },
          {
            "name": "optimalUtilization",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BorrowRateState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentRate",
            "type": "u64"
          },
          {
            "name": "cumulativeLockFee",
            "type": "u128"
          },
          {
            "name": "lastUpdate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "StakeStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingActivation",
            "type": "u64"
          },
          {
            "name": "activeAmount",
            "type": "u64"
          },
          {
            "name": "pendingDeactivation",
            "type": "u64"
          },
          {
            "name": "deactivatedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MarketPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowOpenPosition",
            "type": "bool"
          },
          {
            "name": "allowClosePosition",
            "type": "bool"
          },
          {
            "name": "allowCollateralWithdrawal",
            "type": "bool"
          },
          {
            "name": "allowSizeChange",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PositionStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openPositions",
            "type": "u64"
          },
          {
            "name": "updateTime",
            "type": "i64"
          },
          {
            "name": "averageEntryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "lockedUsd",
            "type": "u64"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "unsettledFeeUsd",
            "type": "u64"
          },
          {
            "name": "cumulativeLockFeeSnapshot",
            "type": "u128"
          },
          {
            "name": "sizeDecimals",
            "type": "u8"
          },
          {
            "name": "lockedDecimals",
            "type": "u8"
          },
          {
            "name": "collateralDecimals",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "OraclePrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "exponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "OracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oracleAccount",
            "type": "publicKey"
          },
          {
            "name": "customOracleAccount",
            "type": "publicKey"
          },
          {
            "name": "oracleType",
            "type": {
              "defined": "OracleType"
            }
          },
          {
            "name": "maxDivergenceBps",
            "type": "u64"
          },
          {
            "name": "maxConfBps",
            "type": "u64"
          },
          {
            "name": "maxPriceAgeSec",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BackupOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "i64"
          },
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "conf",
            "type": "i64"
          },
          {
            "name": "emaPrice",
            "type": "i64"
          },
          {
            "name": "publishTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PermissionlessPythCache",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "backupCache",
            "type": {
              "vec": {
                "defined": "BackupOracle"
              }
            }
          }
        ]
      }
    },
    {
      "name": "PriceAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AmountAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "NewPositionPricesAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SwapAmountAndFees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeIn",
            "type": "u64"
          },
          {
            "name": "feeOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ProfitAndLoss",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "profit",
            "type": "u64"
          },
          {
            "name": "loss",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PositionData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "profitUsd",
            "type": "u64"
          },
          {
            "name": "lossUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "leverage",
            "type": "u64"
          },
          {
            "name": "liquidationPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "Permissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowSwap",
            "type": "bool"
          },
          {
            "name": "allowAddLiquidity",
            "type": "bool"
          },
          {
            "name": "allowRemoveLiquidity",
            "type": "bool"
          },
          {
            "name": "allowOpenPosition",
            "type": "bool"
          },
          {
            "name": "allowClosePosition",
            "type": "bool"
          },
          {
            "name": "allowCollateralWithdrawal",
            "type": "bool"
          },
          {
            "name": "allowSizeChange",
            "type": "bool"
          },
          {
            "name": "allowLiquidation",
            "type": "bool"
          },
          {
            "name": "allowFlpStaking",
            "type": "bool"
          },
          {
            "name": "allowFeeDistribution",
            "type": "bool"
          },
          {
            "name": "allowUngatedTrading",
            "type": "bool"
          },
          {
            "name": "allowFeeDiscounts",
            "type": "bool"
          },
          {
            "name": "allowReferralRebates",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "VoltageMultiplier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "volume",
            "type": "u64"
          },
          {
            "name": "rewards",
            "type": "u64"
          },
          {
            "name": "rebates",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TokenRatios",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "target",
            "type": "u64"
          },
          {
            "name": "min",
            "type": "u64"
          },
          {
            "name": "max",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "CustodyDetails",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradeSpreadLong",
            "type": "u64"
          },
          {
            "name": "tradeSpreadShort",
            "type": "u64"
          },
          {
            "name": "delaySeconds",
            "type": "i64"
          },
          {
            "name": "minPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "maxPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "VoltageStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "volumeUsd",
            "type": "u128"
          },
          {
            "name": "lpRewardsUsd",
            "type": "u128"
          },
          {
            "name": "referralRebateUsd",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "FeesMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Fixed"
          },
          {
            "name": "Linear"
          }
        ]
      }
    },
    {
      "name": "FeesAction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AddLiquidity"
          },
          {
            "name": "RemoveLiquidity"
          },
          {
            "name": "SwapIn"
          },
          {
            "name": "SwapOut"
          },
          {
            "name": "StableSwapIn"
          },
          {
            "name": "StableSwapOut"
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Long"
          },
          {
            "name": "Short"
          }
        ]
      }
    },
    {
      "name": "AdminInstruction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AddPool"
          },
          {
            "name": "RemovePool"
          },
          {
            "name": "AddCustody"
          },
          {
            "name": "RemoveCustody"
          },
          {
            "name": "AddMarket"
          },
          {
            "name": "RemoveMarket"
          },
          {
            "name": "InitStaking"
          },
          {
            "name": "SetAdminSigners"
          },
          {
            "name": "SetCustodyConfig"
          },
          {
            "name": "SetPermissions"
          },
          {
            "name": "SetBorrowRate"
          },
          {
            "name": "SetPerpetualsConfig"
          },
          {
            "name": "SetPoolConfig"
          },
          {
            "name": "SetFlpStakeConfig"
          },
          {
            "name": "SetMarketConfig"
          },
          {
            "name": "AddCollection"
          },
          {
            "name": "WithdrawFees"
          },
          {
            "name": "WithdrawSolFees"
          },
          {
            "name": "SetCustomOraclePrice"
          },
          {
            "name": "SetTestTime"
          },
          {
            "name": "UpdateTokenRatios"
          }
        ]
      }
    },
    {
      "name": "OracleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Custom"
          },
          {
            "name": "Pyth"
          }
        ]
      }
    },
    {
      "name": "AumCalcMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IncludePnl"
          },
          {
            "name": "ExcludePnl"
          }
        ]
      }
    },
    {
      "name": "Privilege",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "NFT"
          },
          {
            "name": "Referral"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "AddCollateralLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddCollateralLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "AddLiquidityLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "custodyId",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClosePositionLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClosePositionLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectStakeRewardLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeCollected",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseSizeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeDelta",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeDeltaUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "settledReturns",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaProfitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaLossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseSizeLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeDelta",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeDeltaUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "settledReturns",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaProfitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaLossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ForceClosePositionLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "ForceClosePositionLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseSizeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseSizeLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidateLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidateLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "OpenPositionLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "OpenPositionLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCollateralLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCollateralLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveLiquidityLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "custodyId",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpAmountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SetTriggerPriceLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "SetTriggerPriceLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "SwapLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "custodyIdIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyIdOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeInAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeOutAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeRequestLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MultisigAccountNotAuthorized",
      "msg": "Account is not authorized to sign this instruction"
    },
    {
      "code": 6001,
      "name": "MultisigAlreadySigned",
      "msg": "Account has already signed this instruction"
    },
    {
      "code": 6002,
      "name": "MultisigAlreadyExecuted",
      "msg": "This instruction has already been executed"
    },
    {
      "code": 6003,
      "name": "MathOverflow",
      "msg": "Overflow in arithmetic operation"
    },
    {
      "code": 6004,
      "name": "UnsupportedOracle",
      "msg": "Unsupported price oracle"
    },
    {
      "code": 6005,
      "name": "InvalidOracleAccount",
      "msg": "Invalid oracle account"
    },
    {
      "code": 6006,
      "name": "InvalidOracleState",
      "msg": "Invalid oracle state"
    },
    {
      "code": 6007,
      "name": "StaleOraclePrice",
      "msg": "Stale oracle price"
    },
    {
      "code": 6008,
      "name": "InvalidOraclePrice",
      "msg": "Invalid oracle price"
    },
    {
      "code": 6009,
      "name": "InvalidEnvironment",
      "msg": "Instruction is not allowed in production"
    },
    {
      "code": 6010,
      "name": "InvalidPoolState",
      "msg": "Invalid pool state"
    },
    {
      "code": 6011,
      "name": "InvalidCustodyState",
      "msg": "Invalid custody state"
    },
    {
      "code": 6012,
      "name": "InvalidMarketState",
      "msg": "Invalid custody state"
    },
    {
      "code": 6013,
      "name": "InvalidCollateralCustody",
      "msg": "Invalid collateral custody"
    },
    {
      "code": 6014,
      "name": "InvalidPositionState",
      "msg": "Invalid position state"
    },
    {
      "code": 6015,
      "name": "InvalidDispensingCustody",
      "msg": "Invalid Dispensing Custody"
    },
    {
      "code": 6016,
      "name": "InvalidPerpetualsConfig",
      "msg": "Invalid perpetuals config"
    },
    {
      "code": 6017,
      "name": "InvalidPoolConfig",
      "msg": "Invalid pool config"
    },
    {
      "code": 6018,
      "name": "InvalidCustodyConfig",
      "msg": "Invalid custody config"
    },
    {
      "code": 6019,
      "name": "InsufficientAmountReturned",
      "msg": "Insufficient token amount returned"
    },
    {
      "code": 6020,
      "name": "MaxPriceSlippage",
      "msg": "Price slippage limit exceeded"
    },
    {
      "code": 6021,
      "name": "MaxLeverage",
      "msg": "Position leverage limit exceeded"
    },
    {
      "code": 6022,
      "name": "MaxInitLeverage",
      "msg": "Position initial leverage limit exceeded"
    },
    {
      "code": 6023,
      "name": "MinLeverage",
      "msg": "Position leverage less than minimum"
    },
    {
      "code": 6024,
      "name": "CustodyAmountLimit",
      "msg": "Custody amount limit exceeded"
    },
    {
      "code": 6025,
      "name": "PositionAmountLimit",
      "msg": "Position amount limit exceeded"
    },
    {
      "code": 6026,
      "name": "TokenRatioOutOfRange",
      "msg": "Token ratio out of range"
    },
    {
      "code": 6027,
      "name": "UnsupportedToken",
      "msg": "Token is not supported"
    },
    {
      "code": 6028,
      "name": "UnsupportedCustody",
      "msg": "Token is not supported"
    },
    {
      "code": 6029,
      "name": "UnsupportedPool",
      "msg": "Token is not supported"
    },
    {
      "code": 6030,
      "name": "UnsupportedMarket",
      "msg": "Token is not supported"
    },
    {
      "code": 6031,
      "name": "InstructionNotAllowed",
      "msg": "Instruction is not allowed at this time"
    },
    {
      "code": 6032,
      "name": "MaxUtilization",
      "msg": "Token utilization limit exceeded"
    },
    {
      "code": 6033,
      "name": "CloseOnlyMode",
      "msg": "Close-only mode activated"
    },
    {
      "code": 6034,
      "name": "MinCollateral",
      "msg": "Minimum collateral limit breached"
    },
    {
      "code": 6035,
      "name": "PermissionlessOracleMissingSignature",
      "msg": "Permissionless oracle update must be preceded by Ed25519 signature verification instruction"
    },
    {
      "code": 6036,
      "name": "PermissionlessOracleMalformedEd25519Data",
      "msg": "Ed25519 signature verification data does not match expected format"
    },
    {
      "code": 6037,
      "name": "PermissionlessOracleSignerMismatch",
      "msg": "Ed25519 signature was not signed by the oracle authority"
    },
    {
      "code": 6038,
      "name": "PermissionlessOracleMessageMismatch",
      "msg": "Signed message does not match instruction params"
    },
    {
      "code": 6039,
      "name": "ExponentMismatch",
      "msg": "Exponent Mismatch betweeen operands"
    },
    {
      "code": 6040,
      "name": "CloseRatio",
      "msg": "Invalid Close Ratio"
    },
    {
      "code": 6041,
      "name": "InsufficientStakeAmount",
      "msg": "Insufficient FLP tokens staked"
    },
    {
      "code": 6042,
      "name": "InvalidFeeDeltas",
      "msg": "Invalid Fee Deltas"
    },
    {
      "code": 6043,
      "name": "InvalidFeeDistributionCustody",
      "msg": "Invalid Fee Distrivution Custody"
    },
    {
      "code": 6044,
      "name": "InvalidCollection",
      "msg": "Invalid Collection"
    },
    {
      "code": 6045,
      "name": "InvalidOwner",
      "msg": "Owner of Token Account does not match"
    },
    {
      "code": 6046,
      "name": "InvalidAccess",
      "msg": "Only nft holders or referred users can trade"
    },
    {
      "code": 6047,
      "name": "TradingAccountMismatch",
      "msg": "Trading account doesnot match referral account"
    },
    {
      "code": 6048,
      "name": "MaxDepostsReached",
      "msg": "Max deposits reached"
    },
    {
      "code": 6049,
      "name": "InvalidStopLossPrice",
      "msg": "Invalid Stop Loss price"
    },
    {
      "code": 6050,
      "name": "InvalidTakeProfitPrice",
      "msg": "Invalid Take Profit price"
    },
    {
      "code": 6051,
      "name": "ExposureLimitExceeded",
      "msg": "Max exposure limit exceeded for the market"
    }
  ]
};

export const IDL: Perpetuals = {
  "version": "0.1.0",
  "name": "perpetuals",
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "upgradeAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetualsProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetualsProgramData",
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
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitParams"
          }
        }
      ]
    },
    {
      "name": "addPool",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "oracleAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
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
          "name": "metadataProgram",
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
            "defined": "AddPoolParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removePool",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemovePoolParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addCustody",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenMint",
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
            "defined": "AddCustodyParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addCollection",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddCollectionParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removeCustody",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCustodyParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addMarket",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
            "defined": "AddMarketParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removeMarket",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
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
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveMarketParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setAdminSigners",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetAdminSignersParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setCustodyConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetCustodyConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPerpetualsConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetPerpetualsConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPermissions",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetPermissionsParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPoolConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetPoolConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setMarketConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetMarketConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setFlpStakeConfig",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetFlpStakeConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawFees",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingTokenAccount",
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
            "defined": "WithdrawFeesParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawSolFees",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawSolFeesParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "updateTokenRatios",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateTokenRatiosParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initStaking",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stakedLpTokenAccount",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitStakingParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setCustomOraclePrice",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetCustomOraclePriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "testInit",
      "accounts": [
        {
          "name": "upgradeAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "TestInitParams"
          }
        }
      ]
    },
    {
      "name": "setTestTime",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetTestTimeParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddLiquidityParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeLiquidity",
      "accounts": [
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
          "name": "lpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveLiquidityParams"
          }
        }
      ]
    },
    {
      "name": "depositStake",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundingFlpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFlpTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DepositStakeParams"
          }
        }
      ]
    },
    {
      "name": "refreshStake",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDistributionTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RefreshStakeParams"
          }
        }
      ]
    },
    {
      "name": "unstakeInstant",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDistributionTokenAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UnstakeInstantParams"
          }
        }
      ]
    },
    {
      "name": "withdrawStake",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingFlpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFlpTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawStakeParams"
          }
        }
      ]
    },
    {
      "name": "collectStakeFees",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeCustodyTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectStakeRewardParams"
          }
        }
      ]
    },
    {
      "name": "unstakeRequest",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "flpStakeAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UnstakeRequestParams"
          }
        }
      ]
    },
    {
      "name": "createTradingAccount",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
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
          "name": "tradingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateTradingAccountParams"
          }
        }
      ]
    },
    {
      "name": "updateTradingAccount",
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
          "name": "nftTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UpdateTradingAccountParams"
          }
        }
      ]
    },
    {
      "name": "createReferral",
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
          "name": "tradingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CreateReferralParams"
          }
        }
      ]
    },
    {
      "name": "openPosition",
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
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
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
          "name": "eventAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "OpenPositionParams"
          }
        }
      ]
    },
    {
      "name": "setTriggerPrice",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetTriggerPriceParams"
          }
        }
      ]
    },
    {
      "name": "addCollateral",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddCollateralParams"
          }
        }
      ]
    },
    {
      "name": "removeCollateral",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCollateralParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "increaseSize",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "IncreaseSizeParams"
          }
        }
      ]
    },
    {
      "name": "decreaseSize",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DecreaseSizeParams"
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ClosePositionParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "forceClosePosition",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ForceClosePositionParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "levelUp",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "LevelUpParams"
          }
        }
      ]
    },
    {
      "name": "liquidate",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
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
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "LiquidateParams"
          }
        }
      ]
    },
    {
      "name": "getAddLiquidityAmountAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetAddLiquidityAmountAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "AmountAndFee"
      }
    },
    {
      "name": "getRemoveLiquidityAmountAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetRemoveLiquidityAmountAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "AmountAndFee"
      }
    },
    {
      "name": "getEntryPriceAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetEntryPriceAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "NewPositionPricesAndFee"
      }
    },
    {
      "name": "getExitPriceAndFee",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetExitPriceAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "PriceAndFee"
      }
    },
    {
      "name": "getPnl",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetPnlParams"
          }
        }
      ],
      "returns": {
        "defined": "ProfitAndLoss"
      }
    },
    {
      "name": "getPositionData",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetPositionDataParams"
          }
        }
      ],
      "returns": {
        "defined": "PositionData"
      }
    },
    {
      "name": "getLiquidationState",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetLiquidationStateParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "getLiquidationPrice",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "targetCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetLiquidationPriceParams"
          }
        }
      ],
      "returns": {
        "defined": "OraclePrice"
      }
    },
    {
      "name": "getOraclePrice",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetOraclePriceParams"
          }
        }
      ],
      "returns": {
        "defined": "(OraclePrice,OraclePrice)"
      }
    },
    {
      "name": "getSwapAmountAndFees",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetSwapAmountAndFeesParams"
          }
        }
      ],
      "returns": {
        "defined": "SwapAmountAndFees"
      }
    },
    {
      "name": "getAssetsUnderManagement",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetAssetsUnderManagementParams"
          }
        }
      ],
      "returns": {
        "defined": "(u128,u128)"
      }
    },
    {
      "name": "getLpTokenPrice",
      "accounts": [
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetLpTokenPriceParams"
          }
        }
      ],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "custody",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "isStable",
            "type": "bool"
          },
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "isVirtual",
            "type": "bool"
          },
          {
            "name": "distributeRewards",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": "OracleParams"
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": "PricingParams"
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": "BorrowRateParams"
            }
          },
          {
            "name": "rewardThreshold",
            "type": "u64"
          },
          {
            "name": "assets",
            "type": {
              "defined": "Assets"
            }
          },
          {
            "name": "feesStats",
            "type": {
              "defined": "FeesStats"
            }
          },
          {
            "name": "borrowRateState",
            "type": {
              "defined": "BorrowRateState"
            }
          },
          {
            "name": "bump",
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
      "name": "flpStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "stakeStats",
            "type": {
              "defined": "StakeStats"
            }
          },
          {
            "name": "rewardSnapshot",
            "type": "u128"
          },
          {
            "name": "unclaimedRewards",
            "type": "u64"
          },
          {
            "name": "feeShareBps",
            "type": "u64"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "publicKey"
          },
          {
            "name": "targetCustody",
            "type": "publicKey"
          },
          {
            "name": "collateralCustody",
            "type": "publicKey"
          },
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          },
          {
            "name": "correlation",
            "type": "bool"
          },
          {
            "name": "maxPayoffBps",
            "type": "u64"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "MarketPermissions"
            }
          },
          {
            "name": "openInterest",
            "type": "u64"
          },
          {
            "name": "collectivePosition",
            "type": {
              "defined": "PositionStats"
            }
          },
          {
            "name": "targetCustodyId",
            "type": "u64"
          },
          {
            "name": "collateralCustodyId",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "numSigners",
            "type": "u8"
          },
          {
            "name": "numSigned",
            "type": "u8"
          },
          {
            "name": "minSignatures",
            "type": "u8"
          },
          {
            "name": "instructionAccountsLen",
            "type": "u8"
          },
          {
            "name": "instructionDataLen",
            "type": "u16"
          },
          {
            "name": "instructionHash",
            "type": "u64"
          },
          {
            "name": "signers",
            "type": {
              "array": [
                "publicKey",
                6
              ]
            }
          },
          {
            "name": "signed",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "customOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "conf",
            "type": "u64"
          },
          {
            "name": "ema",
            "type": "u64"
          },
          {
            "name": "publishTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "perpetuals",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "pools",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "collections",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          },
          {
            "name": "tradingDiscount",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralRebate",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralDiscount",
            "type": "u64"
          },
          {
            "name": "inceptionTime",
            "type": "i64"
          },
          {
            "name": "transferAuthorityBump",
            "type": "u8"
          },
          {
            "name": "perpetualsBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "inceptionTime",
            "type": "i64"
          },
          {
            "name": "flpMint",
            "type": "publicKey"
          },
          {
            "name": "oracleAuthority",
            "type": "publicKey"
          },
          {
            "name": "flpTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "rewardCustody",
            "type": "publicKey"
          },
          {
            "name": "custodies",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          },
          {
            "name": "markets",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "maxAumUsd",
            "type": "u128"
          },
          {
            "name": "aumUsd",
            "type": "u128"
          },
          {
            "name": "totalStaked",
            "type": {
              "defined": "StakeStats"
            }
          },
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "flpMintBump",
            "type": "u8"
          },
          {
            "name": "flpTokenAccountBump",
            "type": "u8"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": "publicKey"
          },
          {
            "name": "openTime",
            "type": "i64"
          },
          {
            "name": "updateTime",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "lockedUsd",
            "type": "u64"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "unsettledAmount",
            "type": "u64"
          },
          {
            "name": "unsettledFeesUsd",
            "type": "u64"
          },
          {
            "name": "cumulativeLockFeeSnapshot",
            "type": "u128"
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeDecimals",
            "type": "u8"
          },
          {
            "name": "lockedDecimals",
            "type": "u8"
          },
          {
            "name": "collateralDecimals",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "referral",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "refererTradingAccount",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "trading",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nftMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "voltagePoints",
            "type": "u64"
          },
          {
            "name": "stats",
            "type": {
              "defined": "VoltageStats"
            }
          },
          {
            "name": "snapshot",
            "type": {
              "defined": "VoltageStats"
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                8
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AddCollectionParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "AddCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isStable",
            "type": "bool"
          },
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "isVirtual",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": "OracleParams"
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": "PricingParams"
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": "BorrowRateParams"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          }
        ]
      }
    },
    {
      "name": "AddLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minLpAmountOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AddMarketParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          },
          {
            "name": "correlation",
            "type": "bool"
          },
          {
            "name": "maxPayoffBps",
            "type": "u64"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "MarketPermissions"
            }
          }
        ]
      }
    },
    {
      "name": "AddPoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "maxAumUsd",
            "type": "u128"
          },
          {
            "name": "metadataTitle",
            "type": "string"
          },
          {
            "name": "metadataSymbol",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ClosePositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "CollectStakeRewardParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CreateReferralParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CreateTradingAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collectionIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "DecreaseSizeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "DepositStakeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ForceClosePositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "GetAddLiquidityAmountAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetAssetsUnderManagementParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetEntryPriceAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateral",
            "type": "u64"
          },
          {
            "name": "size",
            "type": "u64"
          },
          {
            "name": "side",
            "type": {
              "defined": "Side"
            }
          }
        ]
      }
    },
    {
      "name": "GetExitPriceAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetLiquidationPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetLiquidationStateParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetLpTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetOraclePriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetPnlParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetPositionDataParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetRemoveLiquidityAmountAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpAmountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetSwapAmountAndFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "useFeePool",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "IncreaseSizeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "InitStakingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minSignatures",
            "type": "u8"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          },
          {
            "name": "tradingDiscount",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralRebate",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralDiscount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "LevelUpParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "LiquidateParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "OpenPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          }
        ]
      }
    },
    {
      "name": "RefreshStakeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemoveCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RemoveCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          }
        ]
      }
    },
    {
      "name": "RemoveLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpAmountIn",
            "type": "u64"
          },
          {
            "name": "minAmountOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RemoveMarketParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "RemovePoolParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "SetAdminSignersParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minSignatures",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SetCustodyConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": "OracleParams"
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": "PricingParams"
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": "Fees"
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": "BorrowRateParams"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          },
          {
            "name": "rewardThreshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetCustomOraclePriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "conf",
            "type": "u64"
          },
          {
            "name": "ema",
            "type": "u64"
          },
          {
            "name": "publishTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SetFlpStakeConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeShareBps",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetMarketConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxPayoffBps",
            "type": "u64"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "MarketPermissions"
            }
          }
        ]
      }
    },
    {
      "name": "SetPermissionsParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          }
        ]
      }
    },
    {
      "name": "SetPerpetualsConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowUngatedTrading",
            "type": "bool"
          },
          {
            "name": "tradingDiscount",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralRebate",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "referralDiscount",
            "type": "u64"
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          }
        ]
      }
    },
    {
      "name": "SetPoolConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          },
          {
            "name": "oracleAuthority",
            "type": "publicKey"
          },
          {
            "name": "maxAumUsd",
            "type": "u128"
          },
          {
            "name": "stakingFeeShareBps",
            "type": "u64"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SetTestTimeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "time",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SetTriggerPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "triggerPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "SwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "useFeesPool",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TestInitParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minSignatures",
            "type": "u8"
          },
          {
            "name": "permissions",
            "type": {
              "defined": "Permissions"
            }
          }
        ]
      }
    },
    {
      "name": "UnstakeInstantParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UnstakeRequestParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unstakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateTokenRatiosParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": "TokenRatios"
              }
            }
          }
        ]
      }
    },
    {
      "name": "UpdateTradingAccountParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "WithdrawFeesParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "WithdrawSolFeesParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "WithdrawStakeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingActivation",
            "type": "bool"
          },
          {
            "name": "deactivated",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Fees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mode",
            "type": {
              "defined": "FeesMode"
            }
          },
          {
            "name": "swapIn",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "swapOut",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "stableSwapIn",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "stableSwapOut",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "addLiquidity",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "removeLiquidity",
            "type": {
              "defined": "RatioFees"
            }
          },
          {
            "name": "openPosition",
            "type": "u64"
          },
          {
            "name": "closePosition",
            "type": "u64"
          },
          {
            "name": "removeCollateral",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "RatioFees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minFee",
            "type": "u64"
          },
          {
            "name": "targetFee",
            "type": "u64"
          },
          {
            "name": "maxFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Assets",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateral",
            "type": "u64"
          },
          {
            "name": "owned",
            "type": "u64"
          },
          {
            "name": "locked",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FeesStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "accrued",
            "type": "u128"
          },
          {
            "name": "distributed",
            "type": "u128"
          },
          {
            "name": "paid",
            "type": "u128"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "protocolFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PricingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradeSpreadLong",
            "type": "u64"
          },
          {
            "name": "tradeSpreadShort",
            "type": "u64"
          },
          {
            "name": "swapSpread",
            "type": "u64"
          },
          {
            "name": "minInitialLeverage",
            "type": "u64"
          },
          {
            "name": "maxInitialLeverage",
            "type": "u64"
          },
          {
            "name": "maxLeverage",
            "type": "u64"
          },
          {
            "name": "minCollateralUsd",
            "type": "u64"
          },
          {
            "name": "delaySeconds",
            "type": "i64"
          },
          {
            "name": "maxUtilization",
            "type": "u64"
          },
          {
            "name": "maxPositionLockedUsd",
            "type": "u64"
          },
          {
            "name": "maxExposureUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BorrowRateParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseRate",
            "type": "u64"
          },
          {
            "name": "slope1",
            "type": "u64"
          },
          {
            "name": "slope2",
            "type": "u64"
          },
          {
            "name": "optimalUtilization",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BorrowRateState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentRate",
            "type": "u64"
          },
          {
            "name": "cumulativeLockFee",
            "type": "u128"
          },
          {
            "name": "lastUpdate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "StakeStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingActivation",
            "type": "u64"
          },
          {
            "name": "activeAmount",
            "type": "u64"
          },
          {
            "name": "pendingDeactivation",
            "type": "u64"
          },
          {
            "name": "deactivatedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MarketPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowOpenPosition",
            "type": "bool"
          },
          {
            "name": "allowClosePosition",
            "type": "bool"
          },
          {
            "name": "allowCollateralWithdrawal",
            "type": "bool"
          },
          {
            "name": "allowSizeChange",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PositionStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "openPositions",
            "type": "u64"
          },
          {
            "name": "updateTime",
            "type": "i64"
          },
          {
            "name": "averageEntryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "lockedUsd",
            "type": "u64"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "unsettledFeeUsd",
            "type": "u64"
          },
          {
            "name": "cumulativeLockFeeSnapshot",
            "type": "u128"
          },
          {
            "name": "sizeDecimals",
            "type": "u8"
          },
          {
            "name": "lockedDecimals",
            "type": "u8"
          },
          {
            "name": "collateralDecimals",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "OraclePrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "exponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "OracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oracleAccount",
            "type": "publicKey"
          },
          {
            "name": "customOracleAccount",
            "type": "publicKey"
          },
          {
            "name": "oracleType",
            "type": {
              "defined": "OracleType"
            }
          },
          {
            "name": "maxDivergenceBps",
            "type": "u64"
          },
          {
            "name": "maxConfBps",
            "type": "u64"
          },
          {
            "name": "maxPriceAgeSec",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BackupOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "i64"
          },
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "conf",
            "type": "i64"
          },
          {
            "name": "emaPrice",
            "type": "i64"
          },
          {
            "name": "publishTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PermissionlessPythCache",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "backupCache",
            "type": {
              "vec": {
                "defined": "BackupOracle"
              }
            }
          }
        ]
      }
    },
    {
      "name": "PriceAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AmountAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "NewPositionPricesAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "fee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SwapAmountAndFees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeIn",
            "type": "u64"
          },
          {
            "name": "feeOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ProfitAndLoss",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "profit",
            "type": "u64"
          },
          {
            "name": "loss",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PositionData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "profitUsd",
            "type": "u64"
          },
          {
            "name": "lossUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "leverage",
            "type": "u64"
          },
          {
            "name": "liquidationPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "Permissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowSwap",
            "type": "bool"
          },
          {
            "name": "allowAddLiquidity",
            "type": "bool"
          },
          {
            "name": "allowRemoveLiquidity",
            "type": "bool"
          },
          {
            "name": "allowOpenPosition",
            "type": "bool"
          },
          {
            "name": "allowClosePosition",
            "type": "bool"
          },
          {
            "name": "allowCollateralWithdrawal",
            "type": "bool"
          },
          {
            "name": "allowSizeChange",
            "type": "bool"
          },
          {
            "name": "allowLiquidation",
            "type": "bool"
          },
          {
            "name": "allowFlpStaking",
            "type": "bool"
          },
          {
            "name": "allowFeeDistribution",
            "type": "bool"
          },
          {
            "name": "allowUngatedTrading",
            "type": "bool"
          },
          {
            "name": "allowFeeDiscounts",
            "type": "bool"
          },
          {
            "name": "allowReferralRebates",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "VoltageMultiplier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "volume",
            "type": "u64"
          },
          {
            "name": "rewards",
            "type": "u64"
          },
          {
            "name": "rebates",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TokenRatios",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "target",
            "type": "u64"
          },
          {
            "name": "min",
            "type": "u64"
          },
          {
            "name": "max",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "CustodyDetails",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradeSpreadLong",
            "type": "u64"
          },
          {
            "name": "tradeSpreadShort",
            "type": "u64"
          },
          {
            "name": "delaySeconds",
            "type": "i64"
          },
          {
            "name": "minPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "maxPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "VoltageStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "volumeUsd",
            "type": "u128"
          },
          {
            "name": "lpRewardsUsd",
            "type": "u128"
          },
          {
            "name": "referralRebateUsd",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "FeesMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Fixed"
          },
          {
            "name": "Linear"
          }
        ]
      }
    },
    {
      "name": "FeesAction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AddLiquidity"
          },
          {
            "name": "RemoveLiquidity"
          },
          {
            "name": "SwapIn"
          },
          {
            "name": "SwapOut"
          },
          {
            "name": "StableSwapIn"
          },
          {
            "name": "StableSwapOut"
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Long"
          },
          {
            "name": "Short"
          }
        ]
      }
    },
    {
      "name": "AdminInstruction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "AddPool"
          },
          {
            "name": "RemovePool"
          },
          {
            "name": "AddCustody"
          },
          {
            "name": "RemoveCustody"
          },
          {
            "name": "AddMarket"
          },
          {
            "name": "RemoveMarket"
          },
          {
            "name": "InitStaking"
          },
          {
            "name": "SetAdminSigners"
          },
          {
            "name": "SetCustodyConfig"
          },
          {
            "name": "SetPermissions"
          },
          {
            "name": "SetBorrowRate"
          },
          {
            "name": "SetPerpetualsConfig"
          },
          {
            "name": "SetPoolConfig"
          },
          {
            "name": "SetFlpStakeConfig"
          },
          {
            "name": "SetMarketConfig"
          },
          {
            "name": "AddCollection"
          },
          {
            "name": "WithdrawFees"
          },
          {
            "name": "WithdrawSolFees"
          },
          {
            "name": "SetCustomOraclePrice"
          },
          {
            "name": "SetTestTime"
          },
          {
            "name": "UpdateTokenRatios"
          }
        ]
      }
    },
    {
      "name": "OracleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Custom"
          },
          {
            "name": "Pyth"
          }
        ]
      }
    },
    {
      "name": "AumCalcMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IncludePnl"
          },
          {
            "name": "ExcludePnl"
          }
        ]
      }
    },
    {
      "name": "Privilege",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "NFT"
          },
          {
            "name": "Referral"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "AddCollateralLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddCollateralLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "AddLiquidityLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "custodyId",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClosePositionLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClosePositionLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectStakeRewardLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "feeCollected",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseSizeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeDelta",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeDeltaUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "settledReturns",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaProfitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaLossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DecreaseSizeLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeDelta",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeDeltaUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "settledReturns",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaProfitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaLossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ForceClosePositionLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "ForceClosePositionLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "profitUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "lossUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseSizeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseSizeLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidateLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidateLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "OpenPositionLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "OpenPositionLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "sizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "sizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCollateralLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCollateralLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "collateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveLiquidityLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "custodyId",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpAmountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SetTriggerPriceLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "priceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "SetTriggerPriceLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "price",
          "type": "u64",
          "index": false
        },
        {
          "name": "priceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "SwapLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "custodyIdIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyIdOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeInAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeOutAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeRequestLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MultisigAccountNotAuthorized",
      "msg": "Account is not authorized to sign this instruction"
    },
    {
      "code": 6001,
      "name": "MultisigAlreadySigned",
      "msg": "Account has already signed this instruction"
    },
    {
      "code": 6002,
      "name": "MultisigAlreadyExecuted",
      "msg": "This instruction has already been executed"
    },
    {
      "code": 6003,
      "name": "MathOverflow",
      "msg": "Overflow in arithmetic operation"
    },
    {
      "code": 6004,
      "name": "UnsupportedOracle",
      "msg": "Unsupported price oracle"
    },
    {
      "code": 6005,
      "name": "InvalidOracleAccount",
      "msg": "Invalid oracle account"
    },
    {
      "code": 6006,
      "name": "InvalidOracleState",
      "msg": "Invalid oracle state"
    },
    {
      "code": 6007,
      "name": "StaleOraclePrice",
      "msg": "Stale oracle price"
    },
    {
      "code": 6008,
      "name": "InvalidOraclePrice",
      "msg": "Invalid oracle price"
    },
    {
      "code": 6009,
      "name": "InvalidEnvironment",
      "msg": "Instruction is not allowed in production"
    },
    {
      "code": 6010,
      "name": "InvalidPoolState",
      "msg": "Invalid pool state"
    },
    {
      "code": 6011,
      "name": "InvalidCustodyState",
      "msg": "Invalid custody state"
    },
    {
      "code": 6012,
      "name": "InvalidMarketState",
      "msg": "Invalid custody state"
    },
    {
      "code": 6013,
      "name": "InvalidCollateralCustody",
      "msg": "Invalid collateral custody"
    },
    {
      "code": 6014,
      "name": "InvalidPositionState",
      "msg": "Invalid position state"
    },
    {
      "code": 6015,
      "name": "InvalidDispensingCustody",
      "msg": "Invalid Dispensing Custody"
    },
    {
      "code": 6016,
      "name": "InvalidPerpetualsConfig",
      "msg": "Invalid perpetuals config"
    },
    {
      "code": 6017,
      "name": "InvalidPoolConfig",
      "msg": "Invalid pool config"
    },
    {
      "code": 6018,
      "name": "InvalidCustodyConfig",
      "msg": "Invalid custody config"
    },
    {
      "code": 6019,
      "name": "InsufficientAmountReturned",
      "msg": "Insufficient token amount returned"
    },
    {
      "code": 6020,
      "name": "MaxPriceSlippage",
      "msg": "Price slippage limit exceeded"
    },
    {
      "code": 6021,
      "name": "MaxLeverage",
      "msg": "Position leverage limit exceeded"
    },
    {
      "code": 6022,
      "name": "MaxInitLeverage",
      "msg": "Position initial leverage limit exceeded"
    },
    {
      "code": 6023,
      "name": "MinLeverage",
      "msg": "Position leverage less than minimum"
    },
    {
      "code": 6024,
      "name": "CustodyAmountLimit",
      "msg": "Custody amount limit exceeded"
    },
    {
      "code": 6025,
      "name": "PositionAmountLimit",
      "msg": "Position amount limit exceeded"
    },
    {
      "code": 6026,
      "name": "TokenRatioOutOfRange",
      "msg": "Token ratio out of range"
    },
    {
      "code": 6027,
      "name": "UnsupportedToken",
      "msg": "Token is not supported"
    },
    {
      "code": 6028,
      "name": "UnsupportedCustody",
      "msg": "Token is not supported"
    },
    {
      "code": 6029,
      "name": "UnsupportedPool",
      "msg": "Token is not supported"
    },
    {
      "code": 6030,
      "name": "UnsupportedMarket",
      "msg": "Token is not supported"
    },
    {
      "code": 6031,
      "name": "InstructionNotAllowed",
      "msg": "Instruction is not allowed at this time"
    },
    {
      "code": 6032,
      "name": "MaxUtilization",
      "msg": "Token utilization limit exceeded"
    },
    {
      "code": 6033,
      "name": "CloseOnlyMode",
      "msg": "Close-only mode activated"
    },
    {
      "code": 6034,
      "name": "MinCollateral",
      "msg": "Minimum collateral limit breached"
    },
    {
      "code": 6035,
      "name": "PermissionlessOracleMissingSignature",
      "msg": "Permissionless oracle update must be preceded by Ed25519 signature verification instruction"
    },
    {
      "code": 6036,
      "name": "PermissionlessOracleMalformedEd25519Data",
      "msg": "Ed25519 signature verification data does not match expected format"
    },
    {
      "code": 6037,
      "name": "PermissionlessOracleSignerMismatch",
      "msg": "Ed25519 signature was not signed by the oracle authority"
    },
    {
      "code": 6038,
      "name": "PermissionlessOracleMessageMismatch",
      "msg": "Signed message does not match instruction params"
    },
    {
      "code": 6039,
      "name": "ExponentMismatch",
      "msg": "Exponent Mismatch betweeen operands"
    },
    {
      "code": 6040,
      "name": "CloseRatio",
      "msg": "Invalid Close Ratio"
    },
    {
      "code": 6041,
      "name": "InsufficientStakeAmount",
      "msg": "Insufficient FLP tokens staked"
    },
    {
      "code": 6042,
      "name": "InvalidFeeDeltas",
      "msg": "Invalid Fee Deltas"
    },
    {
      "code": 6043,
      "name": "InvalidFeeDistributionCustody",
      "msg": "Invalid Fee Distrivution Custody"
    },
    {
      "code": 6044,
      "name": "InvalidCollection",
      "msg": "Invalid Collection"
    },
    {
      "code": 6045,
      "name": "InvalidOwner",
      "msg": "Owner of Token Account does not match"
    },
    {
      "code": 6046,
      "name": "InvalidAccess",
      "msg": "Only nft holders or referred users can trade"
    },
    {
      "code": 6047,
      "name": "TradingAccountMismatch",
      "msg": "Trading account doesnot match referral account"
    },
    {
      "code": 6048,
      "name": "MaxDepostsReached",
      "msg": "Max deposits reached"
    },
    {
      "code": 6049,
      "name": "InvalidStopLossPrice",
      "msg": "Invalid Stop Loss price"
    },
    {
      "code": 6050,
      "name": "InvalidTakeProfitPrice",
      "msg": "Invalid Take Profit price"
    },
    {
      "code": 6051,
      "name": "ExposureLimitExceeded",
      "msg": "Max exposure limit exceeded for the market"
    }
  ]
};
