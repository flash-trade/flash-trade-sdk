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
      "name": "addInternalOracle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "intOracleAccount",
          "isMut": true,
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
            "defined": "AddInternalOracleParams"
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
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
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
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenMint",
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
      "name": "reimburse",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
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
          "name": "tokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ReimburseParams"
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
        },
        {
          "name": "custody",
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
            "defined": "SetPoolConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setProtocolFeeShare",
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
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetProtocolFeeShareParams"
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
      "name": "setTokenReward",
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
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
            "defined": "SetTokenRewardParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenStakeLevel",
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
          "name": "tokenStakeAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetTokenStakeLevelParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenVaultConfig",
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
          "name": "tokenVault",
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
            "defined": "SetTokenVaultConfigParams"
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
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolTokenAccount",
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
        },
        {
          "name": "receivingMint",
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
      "name": "withdrawInstantFees",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
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
        },
        {
          "name": "receivingTokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawInstantFeesParams"
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
      "name": "updateCustody",
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
        },
        {
          "name": "custody",
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
            "defined": "UpdateCustodyParams"
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
      "name": "initCompounding",
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
          "name": "compoundingVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "InitCompoundingParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initRevenueTokenAccount",
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "revenueTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolTokenAccount",
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
            "defined": "InitRevenueTokenAccountParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initTokenVault",
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
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
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
            "defined": "InitTokenVaultParams"
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
      "name": "setInternalCurrentPrice",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetInternalCurrentPriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalEmaPrice",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetInternalEmaPriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalOraclePrice",
      "accounts": [
        {
          "name": "authority",
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
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "intOracleAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "extOracleAccount",
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
            "defined": "SetInternalOraclePriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setLpTokenPrice",
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
            "defined": "SetLpTokenPriceParams"
          }
        }
      ]
    },
    {
      "name": "setFeeShare",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetFeeShareParams"
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
      "name": "swapFeeInternal",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustodyTokenAccount",
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
            "defined": "SwapFeeInternalParams"
          }
        }
      ]
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
      "name": "swapAndAddCollateral",
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
          "isMut": true,
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapAndAddCollateralParams"
          }
        }
      ]
    },
    {
      "name": "swapAndOpen",
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
          "isMut": true,
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapAndOpenParams"
          }
        }
      ]
    },
    {
      "name": "closeAndSwap",
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
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralAccount",
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
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CloseAndSwapParams"
          }
        }
      ]
    },
    {
      "name": "addLiquidityAndStake",
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
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolStakedLpVault",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddLiquidityAndStakeParams"
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
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
      "name": "addCompoundingLiquidity",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
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
          "name": "inCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddCompoundingLiquidityParams"
          }
        }
      ]
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
      "name": "depositTokenStake",
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
          "name": "fundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DepositTokenStakeParams"
          }
        }
      ]
    },
    {
      "name": "distributeTokenReward",
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
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DistributeTokenRewardParams"
          }
        }
      ],
      "returns": "u8"
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
          "name": "fundingLpTokenAccount",
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
          "name": "poolStakedLpVault",
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
          "name": "lpTokenMint",
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
          "name": "receivingLpTokenAccount",
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
          "name": "poolStakedLpVault",
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
          "name": "lpMint",
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
      "name": "withdrawToken",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawTokenParams"
          }
        }
      ]
    },
    {
      "name": "collectRevenue",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingRevenueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "revenueTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "receivingTokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectRevenueParams"
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
        },
        {
          "name": "receivingMint",
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
      ],
      "returns": "u64"
    },
    {
      "name": "collectTokenReward",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectTokenRewardParams"
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
            "defined": "UnstakeRequestParams"
          }
        }
      ]
    },
    {
      "name": "unstakeTokenInstant",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "receivingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UnstakeTokenInstantParams"
          }
        }
      ]
    },
    {
      "name": "unstakeTokenRequest",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
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
            "defined": "UnstakeTokenRequestParams"
          }
        }
      ]
    },
    {
      "name": "migrateFlp",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "compoundingTokenAccount",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolStakedLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "MigrateFlpParams"
          }
        }
      ]
    },
    {
      "name": "migrateStake",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "compoundingTokenAccount",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolStakedLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "MigrateStakeParams"
          }
        }
      ]
    },
    {
      "name": "migrateTriggerOrder",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "moveProtocolFees",
      "accounts": [
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
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
          "name": "revenueTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolTokenAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "compoundFees",
      "accounts": [
        {
          "name": "poolCompoundingLpVault",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
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
            "defined": "CompoundFeesParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeCompoundingLiquidity",
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
          "name": "compoundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
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
          "name": "outCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCompoundingLiquidityParams"
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
          "name": "tokenStakeAccount",
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
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
      "name": "removeCollateralAndSwap",
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
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralAccount",
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
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCollateralAndSwapParams"
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
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
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
      "name": "cancelAllTriggerOrders",
      "accounts": [
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
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
    },
    {
      "name": "cancelTriggerOrder",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "order",
          "isMut": true,
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
            "defined": "CancelTriggerOrderParams"
          }
        }
      ]
    },
    {
      "name": "cancelUnstakeTokenRequest",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
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
            "defined": "CancelUnstakeTokenRequestParams"
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
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
        },
        {
          "name": "receivingMint",
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
      "name": "executeLimitWithSwap",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
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
          "name": "reserveCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteLimitWithSwapParams"
          }
        }
      ]
    },
    {
      "name": "executeLimitOrder",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
          "isMut": true,
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
          "name": "order",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteLimitOrderParams"
          }
        }
      ]
    },
    {
      "name": "placeLimitOrder",
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
          "name": "order",
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
          "name": "reserveCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reserveCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiveCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PlaceLimitOrderParams"
          }
        }
      ]
    },
    {
      "name": "editLimitOrder",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
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
          "name": "reserveCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reserveCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiveCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "EditLimitOrderParams"
          }
        }
      ]
    },
    {
      "name": "editTriggerOrder",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
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
          "name": "receiveCustody",
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
            "defined": "EditTriggerOrderParams"
          }
        }
      ]
    },
    {
      "name": "placeTriggerOrder",
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
          "name": "order",
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
          "name": "receiveCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
            "defined": "PlaceTriggerOrderParams"
          }
        }
      ]
    },
    {
      "name": "executeTriggerWithSwap",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralAccount",
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
          "name": "order",
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
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteTriggerWithSwapParams"
          }
        }
      ]
    },
    {
      "name": "executeTriggerOrder",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
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
          "name": "order",
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
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteTriggerOrderParams"
          }
        }
      ]
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
      "name": "getAddCompoundingLiquidityAmountAndFee",
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
          "name": "inCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "GetAddCompoundingLiquidityAmountAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "AmountAndFee"
      }
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
      "name": "getRemoveCompoundingLiquidityAmountAndFee",
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
          "name": "outCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "GetRemoveCompoundingLiquidityAmountAndFeeParams"
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
      "name": "getCompoundingTokenData",
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
            "defined": "GetCompoundingTokenDataParams"
          }
        }
      ],
      "returns": {
        "defined": "CompoundingTokenData"
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
    },
    {
      "name": "getCompoundingTokenPrice",
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
            "defined": "GetCompoundingTokenPriceParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "getPositionQuote",
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
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetPositionQuoteParams"
          }
        }
      ],
      "returns": {
        "defined": "QuoteData"
      }
    },
    {
      "name": "getAddCollateralQuote",
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
          "name": "receivingCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingOracleAccount",
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
            "defined": "GetAddCollateralQuoteParams"
          }
        }
      ],
      "returns": {
        "defined": "GetAddCollateralQuoteData"
      }
    },
    {
      "name": "getClosePositionQuote",
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
          "name": "position",
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
            "defined": "GetClosePositionQuoteParams"
          }
        }
      ],
      "returns": {
        "defined": "CloseQuoteData"
      }
    },
    {
      "name": "renameFlp",
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
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpMetadataAccount",
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
            "defined": "RenameFlpParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "burnAndClaim",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "edition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecord",
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
          "isMut": true,
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
          "name": "nftTokenAccount",
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
          "name": "ixSysvar",
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
          "name": "receivingTokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "BurnAndClaimParams"
          }
        }
      ]
    },
    {
      "name": "burnAndStake",
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "edition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecord",
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
          "isMut": true,
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
          "name": "nftTokenAccount",
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
          "name": "ixSysvar",
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
            "defined": "BurnAndStakeParams"
          }
        }
      ]
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
          },
          {
            "name": "token22",
            "type": "bool"
          },
          {
            "name": "uid",
            "type": "u8"
          },
          {
            "name": "reservedAmount",
            "type": "u64"
          },
          {
            "name": "minReserveUsd",
            "type": "u64"
          },
          {
            "name": "limitPriceBufferBps",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
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
            "name": "targetCustodyUid",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "collateralCustodyUid",
            "type": "u8"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u8",
                7
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
      "name": "order",
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
            "name": "limitOrders",
            "type": {
              "array": [
                {
                  "defined": "LimitOrder"
                },
                5
              ]
            }
          },
          {
            "name": "takeProfitOrders",
            "type": {
              "array": [
                {
                  "defined": "TriggerOrder"
                },
                5
              ]
            }
          },
          {
            "name": "stopLossOrders",
            "type": {
              "array": [
                {
                  "defined": "TriggerOrder"
                },
                5
              ]
            }
          },
          {
            "name": "isInitialised",
            "type": "bool"
          },
          {
            "name": "openOrders",
            "type": "u8"
          },
          {
            "name": "openSl",
            "type": "u8"
          },
          {
            "name": "openTp",
            "type": "u8"
          },
          {
            "name": "inactiveSl",
            "type": "u8"
          },
          {
            "name": "inactiveTp",
            "type": "u8"
          },
          {
            "name": "activeOrders",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
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
            "name": "defaultRebate",
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
          },
          {
            "name": "tradeLimit",
            "type": "u16"
          },
          {
            "name": "rebateLimitUsd",
            "type": "u32"
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
            "name": "lpMint",
            "type": "publicKey"
          },
          {
            "name": "oracleAuthority",
            "type": "publicKey"
          },
          {
            "name": "stakedLpVault",
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
            "name": "lpMintBump",
            "type": "u8"
          },
          {
            "name": "stakedLpVaultBump",
            "type": "u8"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          },
          {
            "name": "uniqueCustodyCount",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "stakingFeeBoostBps",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "compoundingMint",
            "type": "publicKey"
          },
          {
            "name": "compoundingLpVault",
            "type": "publicKey"
          },
          {
            "name": "compoundingStats",
            "type": {
              "defined": "CompoundingStats"
            }
          },
          {
            "name": "compoundingMintBump",
            "type": "u8"
          },
          {
            "name": "compoundingLpVaultBump",
            "type": "u8"
          },
          {
            "name": "minLpPriceUsd",
            "type": "u64"
          },
          {
            "name": "maxLpPriceUsd",
            "type": "u64"
          },
          {
            "name": "lpPrice",
            "type": "u64"
          },
          {
            "name": "compoundingLpPrice",
            "type": "u64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                1
              ]
            }
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
      "name": "protocolVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          },
          {
            "name": "feeShareBps",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
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
            "name": "refererTokenStakeAccount",
            "type": "publicKey"
          },
          {
            "name": "refererBoosterAccount",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tokenStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "withdrawRequestCount",
            "type": "u8"
          },
          {
            "name": "withdrawRequest",
            "type": {
              "array": [
                {
                  "defined": "WithdrawRequest"
                },
                5
              ]
            }
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          },
          {
            "name": "updateTimestamp",
            "type": "i64"
          },
          {
            "name": "tradeTimestamp",
            "type": "i64"
          },
          {
            "name": "tradeCounter",
            "type": "u32"
          },
          {
            "name": "lastRewardEpochCount",
            "type": "u32"
          },
          {
            "name": "rewardTokens",
            "type": "u64"
          },
          {
            "name": "unclaimedRevenueAmount",
            "type": "u64"
          },
          {
            "name": "revenueSnapshot",
            "type": "u128"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tokenVault",
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
            "name": "tokenAccountBump",
            "type": "u8"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVaultTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "tokenPermissions",
            "type": {
              "defined": "TokenPermissions"
            }
          },
          {
            "name": "withdrawTimeLimit",
            "type": "i64"
          },
          {
            "name": "withdrawInstantFee",
            "type": "u64"
          },
          {
            "name": "withdrawInstantFeeEarned",
            "type": "u64"
          },
          {
            "name": "stakeLevel",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "tokensStaked",
            "type": {
              "defined": "StakeStats"
            }
          },
          {
            "name": "rewardTokensToDistribute",
            "type": "u128"
          },
          {
            "name": "rewardTokensPaid",
            "type": "u128"
          },
          {
            "name": "tokensToDistribute",
            "type": "u128"
          },
          {
            "name": "tokensDistributed",
            "type": "u128"
          },
          {
            "name": "lastRewardEpochCount",
            "type": "u32"
          },
          {
            "name": "rewardTokensDistributed",
            "type": "u128"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                3
              ]
            }
          },
          {
            "name": "revenueTokenAccountBump",
            "type": "u8"
          },
          {
            "name": "revenuePerFafStaked",
            "type": "u64"
          },
          {
            "name": "revenueAccrued",
            "type": "u128"
          },
          {
            "name": "revenueDistributed",
            "type": "u128"
          },
          {
            "name": "revenuePaid",
            "type": "u128"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                4
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
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "counter",
            "type": "u64"
          },
          {
            "name": "tokenStakeAccount",
            "type": "publicKey"
          },
          {
            "name": "burnt",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                15
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
      "name": "AddCompoundingLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minCompoundingAmountOut",
            "type": "u64"
          }
        ]
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
            "name": "token22",
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
      "name": "AddInternalOracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expo",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "AddLiquidityAndStakeParams",
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
      "name": "BurnAndClaimParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "BurnAndStakeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CancelTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "CancelUnstakeTokenRequestParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawRequestId",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CloseAndSwapParams",
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
            "name": "minSwapAmountOut",
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
      "name": "CollectRevenueParams",
      "type": {
        "kind": "struct",
        "fields": []
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
      "name": "CollectTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CompoundFeesParams",
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
      "name": "DepositTokenStakeParams",
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
      "name": "DistributeTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "epochCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "EditLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
          },
          {
            "name": "limitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "EditTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
          },
          {
            "name": "triggerPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "ExecuteLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "ExecuteLimitWithSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "ExecuteTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "ExecuteTriggerWithSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "GetAddCollateralQuoteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "collateralDelta",
            "type": "u64"
          },
          {
            "name": "finalCollateralAmount",
            "type": "u64"
          },
          {
            "name": "finalCollateralUsd",
            "type": "u64"
          },
          {
            "name": "finalSizeAmount",
            "type": "u64"
          },
          {
            "name": "finalSizeUsd",
            "type": "u64"
          },
          {
            "name": "finalAvgEntryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "passesMinCollateralCheck",
            "type": "bool"
          },
          {
            "name": "passesLeverageCheck",
            "type": "bool"
          },
          {
            "name": "swapRequired",
            "type": "bool"
          },
          {
            "name": "receivingCustodyId",
            "type": "u64"
          },
          {
            "name": "swapPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeUsd",
            "type": "u64"
          },
          {
            "name": "swapPossible",
            "type": "bool"
          },
          {
            "name": "increaseSizeEntryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "increaseSizeFeeUsd",
            "type": "u64"
          },
          {
            "name": "increaseSizeFeeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetAddCollateralQuoteParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "isIncreaseSize",
            "type": "bool"
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
          },
          {
            "name": "discountIndex",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "GetAddCompoundingLiquidityAmountAndFeeParams",
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
      "name": "CloseQuoteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "exitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "collateralReturn",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "pnlAmount",
            "type": "u64"
          },
          {
            "name": "pnlUsd",
            "type": "u64"
          },
          {
            "name": "isProfitable",
            "type": "bool"
          },
          {
            "name": "remainingCollateral",
            "type": "u64"
          },
          {
            "name": "remainingSize",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetClosePositionQuoteParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "closeAmount",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          },
          {
            "name": "discountIndex",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "GetCompoundingTokenDataParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetCompoundingTokenPriceParams",
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
      "name": "GetPositionQuoteParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "leverage",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          },
          {
            "name": "discountIndex",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "GetRemoveCompoundingLiquidityAmountAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "compoundingAmountIn",
            "type": "u64"
          }
        ]
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
      "name": "InitCompoundingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeShareBps",
            "type": "u64"
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
          }
        ]
      }
    },
    {
      "name": "InitRevenueTokenAccountParams",
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
      "name": "InitTokenVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPermissions",
            "type": {
              "defined": "TokenPermissions"
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "withdrawTimeLimit",
            "type": "i64"
          },
          {
            "name": "withdrawInstantFee",
            "type": "u64"
          },
          {
            "name": "stakeLevel",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
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
            "name": "defaultRebate",
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
      "name": "MigrateFlpParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "compoundingTokenAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MigrateStakeParams",
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
      "name": "PlaceLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "limitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "PlaceTriggerOrderParams",
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
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
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
      "name": "ReimburseParams",
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
      "name": "RemoveCollateralAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDelta",
            "type": "u64"
          },
          {
            "name": "minSwapAmountOut",
            "type": "u64"
          }
        ]
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
      "name": "RemoveCompoundingLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "compoundingAmountIn",
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
      "name": "RenameFlpParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "flag",
            "type": "u64"
          },
          {
            "name": "lpTokenName",
            "type": "string"
          },
          {
            "name": "lpTokenSymbol",
            "type": "string"
          },
          {
            "name": "lpTokenUri",
            "type": "string"
          }
        ]
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
          },
          {
            "name": "minReserveUsd",
            "type": "u64"
          },
          {
            "name": "limitPriceBufferBps",
            "type": "u64"
          },
          {
            "name": "token22",
            "type": "bool"
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
      "name": "SetFeeShareParams",
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
      "name": "SetInternalCurrentPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": "InternalPrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "SetInternalEmaPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": "InternalEmaPrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "SetInternalOraclePriceParams",
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
      "name": "SetLpTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
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
          },
          {
            "name": "correlation",
            "type": "bool"
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
            "name": "defaultRebate",
            "type": "u64"
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          },
          {
            "name": "tradeLimit",
            "type": "u16"
          },
          {
            "name": "rebateLimitUsd",
            "type": "u32"
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
          },
          {
            "name": "stakingFeeBoostBps",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "minLpPriceUsd",
            "type": "u64"
          },
          {
            "name": "maxLpPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetProtocolFeeShareParams",
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
      "name": "SetTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "epochCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "SetTokenStakeLevelParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "level",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SetTokenVaultConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPermissions",
            "type": {
              "defined": "TokenPermissions"
            }
          },
          {
            "name": "withdrawTimeLimit",
            "type": "i64"
          },
          {
            "name": "withdrawInstantFee",
            "type": "u64"
          },
          {
            "name": "stakeLevel",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
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
      "name": "SwapAndAddCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minCollateralAmountOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SwapAndOpenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minCollateralAmountOut",
            "type": "u64"
          },
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
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
      "name": "SwapFeeInternalParams",
      "type": {
        "kind": "struct",
        "fields": []
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
      "name": "UnstakeTokenInstantParams",
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
      "name": "UnstakeTokenRequestParams",
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
      "name": "UpdateCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minReserveUsd",
            "type": "u64"
          },
          {
            "name": "limitPriceBufferBps",
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
        "fields": [
          {
            "name": "updateReferer",
            "type": "bool"
          },
          {
            "name": "updateBooster",
            "type": "bool"
          }
        ]
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
      "name": "WithdrawInstantFeesParams",
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
      "name": "WithdrawTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawRequestId",
            "type": "u8"
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
            "name": "volatility",
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
            "name": "tradeSpreadMin",
            "type": "u64"
          },
          {
            "name": "tradeSpreadMax",
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
            "name": "intOracleAccount",
            "type": "publicKey"
          },
          {
            "name": "extOracleAccount",
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
            "type": "u32"
          },
          {
            "name": "maxBackupAgeSec",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "InternalPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "conf",
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
      "name": "InternalEmaPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "emaPrice",
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
      "name": "LimitOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "limitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "reserveCustodyUid",
            "type": "u8"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "TriggerOrder",
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
            "name": "triggerSize",
            "type": "u64"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
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
      "name": "QuoteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
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
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "entryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "totalFeeAmount",
            "type": "u64"
          },
          {
            "name": "totalFeeUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "volatilityFeeAmount",
            "type": "u64"
          },
          {
            "name": "volatilityFeeUsd",
            "type": "u64"
          },
          {
            "name": "swapRequired",
            "type": "bool"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeUsd",
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
            "name": "allowLpStaking",
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
      "name": "CompoundingStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "activeAmount",
            "type": "u64"
          },
          {
            "name": "totalSupply",
            "type": "u64"
          },
          {
            "name": "rewardSnapshot",
            "type": "u128"
          },
          {
            "name": "feeShareBps",
            "type": "u64"
          },
          {
            "name": "lastCompoundTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "CompoundingTokenData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpPrice",
            "type": "u64"
          },
          {
            "name": "compoundingPrice",
            "type": "u64"
          },
          {
            "name": "ratios",
            "type": {
              "vec": "u64"
            }
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
            "name": "tradeSpreadMin",
            "type": "u64"
          },
          {
            "name": "tradeSpreadMax",
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
      "name": "WithdrawRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingDeactivation",
            "type": "u64"
          },
          {
            "name": "withdrawRequestTimestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "TokenPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowDeposits",
            "type": "bool"
          },
          {
            "name": "allowWithdrawal",
            "type": "bool"
          },
          {
            "name": "allowRewardWithdrawal",
            "type": "bool"
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
            "name": "Reimburse"
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
            "name": "UpdateCustody"
          },
          {
            "name": "UpdateTokenRatios"
          },
          {
            "name": "AddInternalOracle"
          },
          {
            "name": "RenameFlp"
          },
          {
            "name": "SetFeeShare"
          },
          {
            "name": "InitCompounding"
          },
          {
            "name": "InitTokenVault"
          },
          {
            "name": "SetTokenVaultConfig"
          },
          {
            "name": "WithdrawInstantFees"
          },
          {
            "name": "DistributeTokenReward"
          },
          {
            "name": "SetTokenReward"
          },
          {
            "name": "SetTokenStakeLevel"
          },
          {
            "name": "InitRevenueTokenAccount"
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
      "name": "OracleAccountType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Internal"
          },
          {
            "name": "External"
          },
          {
            "name": "Backup"
          },
          {
            "name": "Custom"
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
            "name": "Stake"
          },
          {
            "name": "Referral"
          }
        ]
      }
    },
    {
      "name": "VoltagePointsType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OpenPosition"
          },
          {
            "name": "SwapAndOpen"
          },
          {
            "name": "IncreaseSize"
          },
          {
            "name": "DecreaseSize"
          },
          {
            "name": "CloseAndSwap"
          },
          {
            "name": "ClosePosition"
          },
          {
            "name": "ExecuteLimitOrder"
          },
          {
            "name": "ExecuteLimitWithSwap"
          },
          {
            "name": "ExecuteTriggerOrder"
          },
          {
            "name": "ExecuteTriggerWithSwap"
          },
          {
            "name": "CollectStakeReward"
          },
          {
            "name": "DecreaseAndRemoveCollateral"
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
      "name": "AddCollateralLogV3",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "AddCompoundingLiquidityLog",
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
          "name": "custodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "AddLiquidityAndStakeLog",
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
          "name": "custodyUid",
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
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPriceExponent",
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
          "name": "custodyUid",
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
      "name": "AddLiquidityLogV2",
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
          "name": "custodyUid",
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
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "BurnAndClaimLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "BurnAndStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CancelTriggerOrderLog",
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
          "name": "receiveCustodyUid",
          "type": "u8",
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
      "name": "CancelUnstakeTokenRequestLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CloseAndSwapLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
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
      "name": "ClosePositionLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "CollectRevenueLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "revenueAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lastEpochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
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
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CollectStakeRewardLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardShare",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectTokenRewardLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lastEpochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "CompoundingFeesLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardLpAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
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
      "name": "DecreaseSizeLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
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
        },
        {
          "name": "deltaCollateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "DepositStakeLog",
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
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositTokenStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "depositAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DistributeTokenRewardLog",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "epochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "EditLimitOrderLog",
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
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
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
          "name": "reservePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "reservePriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "takeProfitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "takeProfitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "CancelLimitOrderLog",
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
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
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
          "name": "reservePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "reservePriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "takeProfitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "takeProfitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "EditTriggerOrderLog",
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
          "name": "receiveCustodyUid",
          "type": "u8",
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
      "name": "ExecuteLimitOrderLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteLimitOrderLogV2",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteLimitWithSwapLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "reserveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteLimitWithSwapLogV2",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteTriggerOrderLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "triggerPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "triggerPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteTriggerWithSwapLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "triggerPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "triggerPriceExponent",
          "type": "i32",
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
      "name": "ForceClosePositionLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
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
      "name": "IncreaseSizeLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseSizeLogV4",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
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
      "name": "LiquidateLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "MigrateFlpLog",
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
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardLpAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "MigrateStakeLog",
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
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "poolLpAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "MoveProtocolFeesLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "revenueAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "protocolFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "revenueFeeShare",
          "type": "u64",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
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
      "name": "OpenPositionLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "OpenPositionLogV4",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "PlaceLimitOrderLog",
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
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
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
          "name": "reservePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "reservePriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "takeProfitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "takeProfitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "PlaceTriggerOrderLog",
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
          "name": "receiveCustodyUid",
          "type": "u8",
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
      "name": "RefreshStakeLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RefreshStakeUserLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardShare",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCollateralAndSwapLog",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
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
      "name": "RemoveCollateralLogV3",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCompoundingLiquidityLog",
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
          "name": "custodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingAmountIn",
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
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPriceExponent",
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
          "name": "custodyUid",
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
      "name": "RemoveLiquidityLogV2",
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
          "name": "custodyUid",
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
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "SetTokenRewardLog",
      "fields": [
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "epochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
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
      "name": "SwapAndAddCollateralLog",
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
          "name": "receivingCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
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
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "SwapAndOpenLog",
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
          "name": "receivingCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
          "name": "positionFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "receivingOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "receivingOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "collateralOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "collateralOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "targetOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "targetOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "targetOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "SwapAndOpenLogV2",
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
          "name": "receivingCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
          "name": "positionFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "receivingOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "receivingOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "collateralOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "collateralOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "targetOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "targetOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "targetOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "SwapFeeInternalLog",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardCustodyAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapFeeInternalLogV2",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardCustodyAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "inOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "inOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "inOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "inOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "outOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "outOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "outOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "outOracleAccountPriceExponent",
          "type": "i32",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
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
      "name": "SwapLogV2",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
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
        },
        {
          "name": "inOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "inOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "inOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "inOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "outOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "outOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "outOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "outOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeInstantLog",
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
          "name": "unstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeRequestLog",
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
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeTokenInstantLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "withdrawAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeTokenRequestLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "unstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawStakeLog",
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
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawTokenLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "withdrawAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "VoltagePointsLog",
      "fields": [
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "voltagePoints",
          "type": "u64",
          "index": false
        },
        {
          "name": "rebateUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "voltagePointsType",
          "type": "u8",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
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
      "msg": "Invalid Market state"
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
      "msg": "Custody is not supported"
    },
    {
      "code": 6029,
      "name": "UnsupportedPool",
      "msg": "Pool is not supported"
    },
    {
      "code": 6030,
      "name": "UnsupportedMarket",
      "msg": "Market is not supported"
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
      "msg": "Insufficient LP tokens staked"
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
      "name": "TokenStakeAccountMismatch",
      "msg": "Token Stake account doesnot match referral account"
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
    },
    {
      "code": 6052,
      "name": "MaxStopLossOrders",
      "msg": "Stop Loss limit exhausted"
    },
    {
      "code": 6053,
      "name": "MaxTakeProfitOrders",
      "msg": "Take Profit limit exhausted"
    },
    {
      "code": 6054,
      "name": "MaxOpenOrder",
      "msg": "Open order limit exhausted"
    },
    {
      "code": 6055,
      "name": "InvalidOrder",
      "msg": "Invalid Order"
    },
    {
      "code": 6056,
      "name": "InvalidLimitPrice",
      "msg": "Invalid Limit price"
    },
    {
      "code": 6057,
      "name": "MinReserve",
      "msg": "Minimum reserve limit breached"
    },
    {
      "code": 6058,
      "name": "MaxWithdrawTokenRequest",
      "msg": "Withdraw Token Request limit exhausted"
    },
    {
      "code": 6059,
      "name": "InvalidRewardDistribution",
      "msg": "Invalid Reward Distribution"
    },
    {
      "code": 6060,
      "name": "LpPriceOutOfBounds",
      "msg": "Liquidity Token price is out of bounds"
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
      "name": "addInternalOracle",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "custodyTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "intOracleAccount",
          "isMut": true,
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
            "defined": "AddInternalOracleParams"
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
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
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
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenMint",
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
      "name": "reimburse",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "multisig",
          "isMut": false,
          "isSigner": false
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
          "name": "tokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ReimburseParams"
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
        },
        {
          "name": "custody",
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
            "defined": "SetPoolConfigParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setProtocolFeeShare",
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
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetProtocolFeeShareParams"
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
      "name": "setTokenReward",
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
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
            "defined": "SetTokenRewardParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenStakeLevel",
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
          "name": "tokenStakeAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetTokenStakeLevelParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenVaultConfig",
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
          "name": "tokenVault",
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
            "defined": "SetTokenVaultConfigParams"
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
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolTokenAccount",
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
        },
        {
          "name": "receivingMint",
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
      "name": "withdrawInstantFees",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
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
        },
        {
          "name": "receivingTokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawInstantFeesParams"
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
      "name": "updateCustody",
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
        },
        {
          "name": "custody",
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
            "defined": "UpdateCustodyParams"
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
      "name": "initCompounding",
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
          "name": "compoundingVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "InitCompoundingParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initRevenueTokenAccount",
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "revenueTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolTokenAccount",
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
            "defined": "InitRevenueTokenAccountParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initTokenVault",
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
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
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
            "defined": "InitTokenVaultParams"
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
      "name": "setInternalCurrentPrice",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetInternalCurrentPriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalEmaPrice",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetInternalEmaPriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalOraclePrice",
      "accounts": [
        {
          "name": "authority",
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
          "name": "custody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "intOracleAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "extOracleAccount",
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
            "defined": "SetInternalOraclePriceParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setLpTokenPrice",
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
            "defined": "SetLpTokenPriceParams"
          }
        }
      ]
    },
    {
      "name": "setFeeShare",
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
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SetFeeShareParams"
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
      "name": "swapFeeInternal",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustodyTokenAccount",
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
            "defined": "SwapFeeInternalParams"
          }
        }
      ]
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
      "name": "swapAndAddCollateral",
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
          "isMut": true,
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapAndAddCollateralParams"
          }
        }
      ]
    },
    {
      "name": "swapAndOpen",
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
          "isMut": true,
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapAndOpenParams"
          }
        }
      ]
    },
    {
      "name": "closeAndSwap",
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
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralAccount",
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
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CloseAndSwapParams"
          }
        }
      ]
    },
    {
      "name": "addLiquidityAndStake",
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
          "name": "flpStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolStakedLpVault",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddLiquidityAndStakeParams"
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
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
      "name": "addCompoundingLiquidity",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
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
          "name": "inCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "inCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "AddCompoundingLiquidityParams"
          }
        }
      ]
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
      "name": "depositTokenStake",
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
          "name": "fundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DepositTokenStakeParams"
          }
        }
      ]
    },
    {
      "name": "distributeTokenReward",
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
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "DistributeTokenRewardParams"
          }
        }
      ],
      "returns": "u8"
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
          "name": "fundingLpTokenAccount",
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
          "name": "poolStakedLpVault",
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
          "name": "lpTokenMint",
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
          "name": "receivingLpTokenAccount",
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
          "name": "poolStakedLpVault",
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
          "name": "lpMint",
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
      "name": "withdrawToken",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "WithdrawTokenParams"
          }
        }
      ]
    },
    {
      "name": "collectRevenue",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "receivingRevenueAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "revenueTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "receivingTokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectRevenueParams"
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
        },
        {
          "name": "receivingMint",
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
      ],
      "returns": "u64"
    },
    {
      "name": "collectTokenReward",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "CollectTokenRewardParams"
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
            "defined": "UnstakeRequestParams"
          }
        }
      ]
    },
    {
      "name": "unstakeTokenInstant",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "receivingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transferAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "UnstakeTokenInstantParams"
          }
        }
      ]
    },
    {
      "name": "unstakeTokenRequest",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
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
            "defined": "UnstakeTokenRequestParams"
          }
        }
      ]
    },
    {
      "name": "migrateFlp",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "compoundingTokenAccount",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolStakedLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "MigrateFlpParams"
          }
        }
      ]
    },
    {
      "name": "migrateStake",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "compoundingTokenAccount",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolStakedLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "MigrateStakeParams"
          }
        }
      ]
    },
    {
      "name": "migrateTriggerOrder",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "moveProtocolFees",
      "accounts": [
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pool",
          "isMut": false,
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
          "name": "revenueTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "protocolTokenAccount",
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
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "compoundFees",
      "accounts": [
        {
          "name": "poolCompoundingLpVault",
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
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
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
            "defined": "CompoundFeesParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeCompoundingLiquidity",
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
          "name": "compoundingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolCompoundingLpVault",
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
          "name": "outCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "outCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCompoundingLiquidityParams"
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
          "name": "tokenStakeAccount",
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
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
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
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
      "name": "removeCollateralAndSwap",
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
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralAccount",
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
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "RemoveCollateralAndSwapParams"
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
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
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
      "name": "cancelAllTriggerOrders",
      "accounts": [
        {
          "name": "position",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
          "isMut": true,
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
    },
    {
      "name": "cancelTriggerOrder",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "order",
          "isMut": true,
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
            "defined": "CancelTriggerOrderParams"
          }
        }
      ]
    },
    {
      "name": "cancelUnstakeTokenRequest",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
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
            "defined": "CancelUnstakeTokenRequestParams"
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
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
        },
        {
          "name": "receivingMint",
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
      "name": "executeLimitWithSwap",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
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
          "name": "reserveCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "position",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "order",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteLimitWithSwapParams"
          }
        }
      ]
    },
    {
      "name": "executeLimitOrder",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
          "isMut": true,
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
          "name": "order",
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
          "name": "collateralTokenProgram",
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
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteLimitOrderParams"
          }
        }
      ]
    },
    {
      "name": "placeLimitOrder",
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
          "name": "order",
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
          "name": "reserveCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reserveCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiveCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fundingTokenProgram",
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
        },
        {
          "name": "fundingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PlaceLimitOrderParams"
          }
        }
      ]
    },
    {
      "name": "editLimitOrder",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
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
          "name": "reserveCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reserveOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reserveCustodyTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receiveCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "EditLimitOrderParams"
          }
        }
      ]
    },
    {
      "name": "editTriggerOrder",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "order",
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
          "name": "receiveCustody",
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
            "defined": "EditTriggerOrderParams"
          }
        }
      ]
    },
    {
      "name": "placeTriggerOrder",
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
          "name": "order",
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
          "name": "receiveCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
            "defined": "PlaceTriggerOrderParams"
          }
        }
      ]
    },
    {
      "name": "executeTriggerWithSwap",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "receivingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralAccount",
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
          "name": "order",
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
          "name": "dispensingCustody",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dispensingOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "isMut": true,
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteTriggerWithSwapParams"
          }
        }
      ]
    },
    {
      "name": "executeTriggerOrder",
      "accounts": [
        {
          "name": "positionOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feePayer",
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
          "name": "order",
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
          "name": "receivingTokenProgram",
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
        },
        {
          "name": "receivingMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "ExecuteTriggerOrderParams"
          }
        }
      ]
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
      "name": "getAddCompoundingLiquidityAmountAndFee",
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
          "name": "inCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "inCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "GetAddCompoundingLiquidityAmountAndFeeParams"
          }
        }
      ],
      "returns": {
        "defined": "AmountAndFee"
      }
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
      "name": "getRemoveCompoundingLiquidityAmountAndFee",
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
          "name": "outCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "outCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardCustodyOracleAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "compoundingTokenMint",
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
            "defined": "GetRemoveCompoundingLiquidityAmountAndFeeParams"
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
      "name": "getCompoundingTokenData",
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
            "defined": "GetCompoundingTokenDataParams"
          }
        }
      ],
      "returns": {
        "defined": "CompoundingTokenData"
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
    },
    {
      "name": "getCompoundingTokenPrice",
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
            "defined": "GetCompoundingTokenPriceParams"
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "getPositionQuote",
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
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "GetPositionQuoteParams"
          }
        }
      ],
      "returns": {
        "defined": "QuoteData"
      }
    },
    {
      "name": "getAddCollateralQuote",
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
          "name": "receivingCustody",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "receivingOracleAccount",
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
            "defined": "GetAddCollateralQuoteParams"
          }
        }
      ],
      "returns": {
        "defined": "GetAddCollateralQuoteData"
      }
    },
    {
      "name": "getClosePositionQuote",
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
          "name": "position",
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
            "defined": "GetClosePositionQuoteParams"
          }
        }
      ],
      "returns": {
        "defined": "CloseQuoteData"
      }
    },
    {
      "name": "renameFlp",
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
          "name": "lpTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lpMetadataAccount",
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
            "defined": "RenameFlpParams"
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "burnAndClaim",
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
          "name": "perpetuals",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "edition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecord",
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
          "isMut": true,
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
          "name": "nftTokenAccount",
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
          "name": "ixSysvar",
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
          "name": "receivingTokenMint",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "BurnAndClaimParams"
          }
        }
      ]
    },
    {
      "name": "burnAndStake",
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
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVaultTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenStakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "edition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenRecord",
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
          "isMut": true,
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
          "name": "nftTokenAccount",
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
          "name": "ixSysvar",
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
            "defined": "BurnAndStakeParams"
          }
        }
      ]
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
          },
          {
            "name": "token22",
            "type": "bool"
          },
          {
            "name": "uid",
            "type": "u8"
          },
          {
            "name": "reservedAmount",
            "type": "u64"
          },
          {
            "name": "minReserveUsd",
            "type": "u64"
          },
          {
            "name": "limitPriceBufferBps",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
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
            "name": "targetCustodyUid",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "collateralCustodyUid",
            "type": "u8"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u8",
                7
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
      "name": "order",
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
            "name": "limitOrders",
            "type": {
              "array": [
                {
                  "defined": "LimitOrder"
                },
                5
              ]
            }
          },
          {
            "name": "takeProfitOrders",
            "type": {
              "array": [
                {
                  "defined": "TriggerOrder"
                },
                5
              ]
            }
          },
          {
            "name": "stopLossOrders",
            "type": {
              "array": [
                {
                  "defined": "TriggerOrder"
                },
                5
              ]
            }
          },
          {
            "name": "isInitialised",
            "type": "bool"
          },
          {
            "name": "openOrders",
            "type": "u8"
          },
          {
            "name": "openSl",
            "type": "u8"
          },
          {
            "name": "openTp",
            "type": "u8"
          },
          {
            "name": "inactiveSl",
            "type": "u8"
          },
          {
            "name": "inactiveTp",
            "type": "u8"
          },
          {
            "name": "activeOrders",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
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
            "name": "defaultRebate",
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
          },
          {
            "name": "tradeLimit",
            "type": "u16"
          },
          {
            "name": "rebateLimitUsd",
            "type": "u32"
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
            "name": "lpMint",
            "type": "publicKey"
          },
          {
            "name": "oracleAuthority",
            "type": "publicKey"
          },
          {
            "name": "stakedLpVault",
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
            "name": "lpMintBump",
            "type": "u8"
          },
          {
            "name": "stakedLpVaultBump",
            "type": "u8"
          },
          {
            "name": "vpVolumeFactor",
            "type": "u8"
          },
          {
            "name": "uniqueCustodyCount",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "stakingFeeBoostBps",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "compoundingMint",
            "type": "publicKey"
          },
          {
            "name": "compoundingLpVault",
            "type": "publicKey"
          },
          {
            "name": "compoundingStats",
            "type": {
              "defined": "CompoundingStats"
            }
          },
          {
            "name": "compoundingMintBump",
            "type": "u8"
          },
          {
            "name": "compoundingLpVaultBump",
            "type": "u8"
          },
          {
            "name": "minLpPriceUsd",
            "type": "u64"
          },
          {
            "name": "maxLpPriceUsd",
            "type": "u64"
          },
          {
            "name": "lpPrice",
            "type": "u64"
          },
          {
            "name": "compoundingLpPrice",
            "type": "u64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                1
              ]
            }
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
      "name": "protocolVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenAccountBump",
            "type": "u8"
          },
          {
            "name": "feeShareBps",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
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
            "name": "refererTokenStakeAccount",
            "type": "publicKey"
          },
          {
            "name": "refererBoosterAccount",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tokenStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "withdrawRequestCount",
            "type": "u8"
          },
          {
            "name": "withdrawRequest",
            "type": {
              "array": [
                {
                  "defined": "WithdrawRequest"
                },
                5
              ]
            }
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          },
          {
            "name": "updateTimestamp",
            "type": "i64"
          },
          {
            "name": "tradeTimestamp",
            "type": "i64"
          },
          {
            "name": "tradeCounter",
            "type": "u32"
          },
          {
            "name": "lastRewardEpochCount",
            "type": "u32"
          },
          {
            "name": "rewardTokens",
            "type": "u64"
          },
          {
            "name": "unclaimedRevenueAmount",
            "type": "u64"
          },
          {
            "name": "revenueSnapshot",
            "type": "u128"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tokenVault",
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
            "name": "tokenAccountBump",
            "type": "u8"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "tokenVaultTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "tokenPermissions",
            "type": {
              "defined": "TokenPermissions"
            }
          },
          {
            "name": "withdrawTimeLimit",
            "type": "i64"
          },
          {
            "name": "withdrawInstantFee",
            "type": "u64"
          },
          {
            "name": "withdrawInstantFeeEarned",
            "type": "u64"
          },
          {
            "name": "stakeLevel",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "tokensStaked",
            "type": {
              "defined": "StakeStats"
            }
          },
          {
            "name": "rewardTokensToDistribute",
            "type": "u128"
          },
          {
            "name": "rewardTokensPaid",
            "type": "u128"
          },
          {
            "name": "tokensToDistribute",
            "type": "u128"
          },
          {
            "name": "tokensDistributed",
            "type": "u128"
          },
          {
            "name": "lastRewardEpochCount",
            "type": "u32"
          },
          {
            "name": "rewardTokensDistributed",
            "type": "u128"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u32",
                3
              ]
            }
          },
          {
            "name": "revenueTokenAccountBump",
            "type": "u8"
          },
          {
            "name": "revenuePerFafStaked",
            "type": "u64"
          },
          {
            "name": "revenueAccrued",
            "type": "u128"
          },
          {
            "name": "revenueDistributed",
            "type": "u128"
          },
          {
            "name": "revenuePaid",
            "type": "u128"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                4
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
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "counter",
            "type": "u64"
          },
          {
            "name": "tokenStakeAccount",
            "type": "publicKey"
          },
          {
            "name": "burnt",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                15
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
      "name": "AddCompoundingLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minCompoundingAmountOut",
            "type": "u64"
          }
        ]
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
            "name": "token22",
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
      "name": "AddInternalOracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expo",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "AddLiquidityAndStakeParams",
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
      "name": "BurnAndClaimParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "BurnAndStakeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CancelTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "CancelUnstakeTokenRequestParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawRequestId",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CloseAndSwapParams",
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
            "name": "minSwapAmountOut",
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
      "name": "CollectRevenueParams",
      "type": {
        "kind": "struct",
        "fields": []
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
      "name": "CollectTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "CompoundFeesParams",
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
      "name": "DepositTokenStakeParams",
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
      "name": "DistributeTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "epochCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "EditLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
          },
          {
            "name": "limitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "EditTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
          },
          {
            "name": "triggerPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "ExecuteLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "ExecuteLimitWithSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "ExecuteTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "ExecuteTriggerWithSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "orderId",
            "type": "u8"
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
      "name": "GetAddCollateralQuoteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "collateralDelta",
            "type": "u64"
          },
          {
            "name": "finalCollateralAmount",
            "type": "u64"
          },
          {
            "name": "finalCollateralUsd",
            "type": "u64"
          },
          {
            "name": "finalSizeAmount",
            "type": "u64"
          },
          {
            "name": "finalSizeUsd",
            "type": "u64"
          },
          {
            "name": "finalAvgEntryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "passesMinCollateralCheck",
            "type": "bool"
          },
          {
            "name": "passesLeverageCheck",
            "type": "bool"
          },
          {
            "name": "swapRequired",
            "type": "bool"
          },
          {
            "name": "receivingCustodyId",
            "type": "u64"
          },
          {
            "name": "swapPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeUsd",
            "type": "u64"
          },
          {
            "name": "swapPossible",
            "type": "bool"
          },
          {
            "name": "increaseSizeEntryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "increaseSizeFeeUsd",
            "type": "u64"
          },
          {
            "name": "increaseSizeFeeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetAddCollateralQuoteParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "isIncreaseSize",
            "type": "bool"
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
          },
          {
            "name": "discountIndex",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "GetAddCompoundingLiquidityAmountAndFeeParams",
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
      "name": "CloseQuoteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "exitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "collateralReturn",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "pnlAmount",
            "type": "u64"
          },
          {
            "name": "pnlUsd",
            "type": "u64"
          },
          {
            "name": "isProfitable",
            "type": "bool"
          },
          {
            "name": "remainingCollateral",
            "type": "u64"
          },
          {
            "name": "remainingSize",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "GetClosePositionQuoteParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "closeAmount",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          },
          {
            "name": "discountIndex",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "GetCompoundingTokenDataParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "GetCompoundingTokenPriceParams",
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
      "name": "GetPositionQuoteParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "leverage",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": "Privilege"
            }
          },
          {
            "name": "discountIndex",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "GetRemoveCompoundingLiquidityAmountAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "compoundingAmountIn",
            "type": "u64"
          }
        ]
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
      "name": "InitCompoundingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feeShareBps",
            "type": "u64"
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
          }
        ]
      }
    },
    {
      "name": "InitRevenueTokenAccountParams",
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
      "name": "InitTokenVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPermissions",
            "type": {
              "defined": "TokenPermissions"
            }
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "withdrawTimeLimit",
            "type": "i64"
          },
          {
            "name": "withdrawInstantFee",
            "type": "u64"
          },
          {
            "name": "stakeLevel",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
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
            "name": "defaultRebate",
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
      "name": "MigrateFlpParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "compoundingTokenAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MigrateStakeParams",
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
      "name": "PlaceLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "limitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "PlaceTriggerOrderParams",
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
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
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
      "name": "ReimburseParams",
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
      "name": "RemoveCollateralAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDelta",
            "type": "u64"
          },
          {
            "name": "minSwapAmountOut",
            "type": "u64"
          }
        ]
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
      "name": "RemoveCompoundingLiquidityParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "compoundingAmountIn",
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
      "name": "RenameFlpParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "flag",
            "type": "u64"
          },
          {
            "name": "lpTokenName",
            "type": "string"
          },
          {
            "name": "lpTokenSymbol",
            "type": "string"
          },
          {
            "name": "lpTokenUri",
            "type": "string"
          }
        ]
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
          },
          {
            "name": "minReserveUsd",
            "type": "u64"
          },
          {
            "name": "limitPriceBufferBps",
            "type": "u64"
          },
          {
            "name": "token22",
            "type": "bool"
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
      "name": "SetFeeShareParams",
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
      "name": "SetInternalCurrentPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": "InternalPrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "SetInternalEmaPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": "InternalEmaPrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "SetInternalOraclePriceParams",
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
      "name": "SetLpTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
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
          },
          {
            "name": "correlation",
            "type": "bool"
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
            "name": "defaultRebate",
            "type": "u64"
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": "VoltageMultiplier"
            }
          },
          {
            "name": "tradeLimit",
            "type": "u16"
          },
          {
            "name": "rebateLimitUsd",
            "type": "u32"
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
          },
          {
            "name": "stakingFeeBoostBps",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          },
          {
            "name": "minLpPriceUsd",
            "type": "u64"
          },
          {
            "name": "maxLpPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SetProtocolFeeShareParams",
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
      "name": "SetTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "epochCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "SetTokenStakeLevelParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "level",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "SetTokenVaultConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPermissions",
            "type": {
              "defined": "TokenPermissions"
            }
          },
          {
            "name": "withdrawTimeLimit",
            "type": "i64"
          },
          {
            "name": "withdrawInstantFee",
            "type": "u64"
          },
          {
            "name": "stakeLevel",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
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
      "name": "SwapAndAddCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minCollateralAmountOut",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "SwapAndOpenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "minCollateralAmountOut",
            "type": "u64"
          },
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": "OraclePrice"
            }
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
      "name": "SwapFeeInternalParams",
      "type": {
        "kind": "struct",
        "fields": []
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
      "name": "UnstakeTokenInstantParams",
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
      "name": "UnstakeTokenRequestParams",
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
      "name": "UpdateCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minReserveUsd",
            "type": "u64"
          },
          {
            "name": "limitPriceBufferBps",
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
        "fields": [
          {
            "name": "updateReferer",
            "type": "bool"
          },
          {
            "name": "updateBooster",
            "type": "bool"
          }
        ]
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
      "name": "WithdrawInstantFeesParams",
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
      "name": "WithdrawTokenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawRequestId",
            "type": "u8"
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
            "name": "volatility",
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
            "name": "tradeSpreadMin",
            "type": "u64"
          },
          {
            "name": "tradeSpreadMax",
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
            "name": "intOracleAccount",
            "type": "publicKey"
          },
          {
            "name": "extOracleAccount",
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
            "type": "u32"
          },
          {
            "name": "maxBackupAgeSec",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "InternalPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "conf",
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
      "name": "InternalEmaPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "emaPrice",
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
      "name": "LimitOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "limitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "reserveCustodyUid",
            "type": "u8"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": "OraclePrice"
            }
          }
        ]
      }
    },
    {
      "name": "TriggerOrder",
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
            "name": "triggerSize",
            "type": "u64"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
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
      "name": "QuoteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountIn",
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
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "entryPrice",
            "type": {
              "defined": "OraclePrice"
            }
          },
          {
            "name": "totalFeeAmount",
            "type": "u64"
          },
          {
            "name": "totalFeeUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "volatilityFeeAmount",
            "type": "u64"
          },
          {
            "name": "volatilityFeeUsd",
            "type": "u64"
          },
          {
            "name": "swapRequired",
            "type": "bool"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeUsd",
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
            "name": "allowLpStaking",
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
      "name": "CompoundingStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "activeAmount",
            "type": "u64"
          },
          {
            "name": "totalSupply",
            "type": "u64"
          },
          {
            "name": "rewardSnapshot",
            "type": "u128"
          },
          {
            "name": "feeShareBps",
            "type": "u64"
          },
          {
            "name": "lastCompoundTime",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "CompoundingTokenData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lpPrice",
            "type": "u64"
          },
          {
            "name": "compoundingPrice",
            "type": "u64"
          },
          {
            "name": "ratios",
            "type": {
              "vec": "u64"
            }
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
            "name": "tradeSpreadMin",
            "type": "u64"
          },
          {
            "name": "tradeSpreadMax",
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
      "name": "WithdrawRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingDeactivation",
            "type": "u64"
          },
          {
            "name": "withdrawRequestTimestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "TokenPermissions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowDeposits",
            "type": "bool"
          },
          {
            "name": "allowWithdrawal",
            "type": "bool"
          },
          {
            "name": "allowRewardWithdrawal",
            "type": "bool"
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
            "name": "Reimburse"
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
            "name": "UpdateCustody"
          },
          {
            "name": "UpdateTokenRatios"
          },
          {
            "name": "AddInternalOracle"
          },
          {
            "name": "RenameFlp"
          },
          {
            "name": "SetFeeShare"
          },
          {
            "name": "InitCompounding"
          },
          {
            "name": "InitTokenVault"
          },
          {
            "name": "SetTokenVaultConfig"
          },
          {
            "name": "WithdrawInstantFees"
          },
          {
            "name": "DistributeTokenReward"
          },
          {
            "name": "SetTokenReward"
          },
          {
            "name": "SetTokenStakeLevel"
          },
          {
            "name": "InitRevenueTokenAccount"
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
      "name": "OracleAccountType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Internal"
          },
          {
            "name": "External"
          },
          {
            "name": "Backup"
          },
          {
            "name": "Custom"
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
            "name": "Stake"
          },
          {
            "name": "Referral"
          }
        ]
      }
    },
    {
      "name": "VoltagePointsType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "OpenPosition"
          },
          {
            "name": "SwapAndOpen"
          },
          {
            "name": "IncreaseSize"
          },
          {
            "name": "DecreaseSize"
          },
          {
            "name": "CloseAndSwap"
          },
          {
            "name": "ClosePosition"
          },
          {
            "name": "ExecuteLimitOrder"
          },
          {
            "name": "ExecuteLimitWithSwap"
          },
          {
            "name": "ExecuteTriggerOrder"
          },
          {
            "name": "ExecuteTriggerWithSwap"
          },
          {
            "name": "CollectStakeReward"
          },
          {
            "name": "DecreaseAndRemoveCollateral"
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
      "name": "AddCollateralLogV3",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "AddCompoundingLiquidityLog",
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
          "name": "custodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "AddLiquidityAndStakeLog",
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
          "name": "custodyUid",
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
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPriceExponent",
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
          "name": "custodyUid",
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
      "name": "AddLiquidityLogV2",
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
          "name": "custodyUid",
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
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenInPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "BurnAndClaimLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "claimAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "BurnAndStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "nftMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CancelTriggerOrderLog",
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
          "name": "receiveCustodyUid",
          "type": "u8",
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
      "name": "CancelUnstakeTokenRequestLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CloseAndSwapLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
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
      "name": "ClosePositionLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "CollectRevenueLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "revenueAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lastEpochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
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
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "CollectStakeRewardLogV2",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardShare",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "CollectTokenRewardLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lastEpochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "CompoundingFeesLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardLpAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
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
      "name": "DecreaseSizeLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
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
        },
        {
          "name": "deltaCollateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "DepositStakeLog",
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
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DepositTokenStakeLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "depositAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DistributeTokenRewardLog",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "epochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "EditLimitOrderLog",
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
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
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
          "name": "reservePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "reservePriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "takeProfitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "takeProfitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "CancelLimitOrderLog",
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
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
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
          "name": "reservePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "reservePriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "takeProfitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "takeProfitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "EditTriggerOrderLog",
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
          "name": "receiveCustodyUid",
          "type": "u8",
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
      "name": "ExecuteLimitOrderLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteLimitOrderLogV2",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteLimitWithSwapLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "reserveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteLimitWithSwapLogV2",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              3
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteTriggerOrderLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "triggerPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "triggerPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "ExecuteTriggerWithSwapLog",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "triggerPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "triggerPriceExponent",
          "type": "i32",
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
      "name": "ForceClosePositionLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "isStopLoss",
          "type": "bool",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
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
      "name": "IncreaseSizeLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "IncreaseSizeLogV4",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "deltaSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
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
      "name": "LiquidateLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "duration",
          "type": "i64",
          "index": false
        },
        {
          "name": "exitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralAmount",
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
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "exitFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "MigrateFlpLog",
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
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardLpAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "MigrateStakeLog",
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
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "poolLpAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "MoveProtocolFeesLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "revenueAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "protocolFee",
          "type": "u64",
          "index": false
        },
        {
          "name": "revenueFeeShare",
          "type": "u64",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
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
      "name": "OpenPositionLogV3",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "OpenPositionLogV4",
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
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "PlaceLimitOrderLog",
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
          "name": "limitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "limitPriceExponent",
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
          "name": "reservePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "reservePriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "reserveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "reserveUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "stopLossPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "takeProfitPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "takeProfitPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "PlaceTriggerOrderLog",
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
          "name": "receiveCustodyUid",
          "type": "u8",
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
      "name": "RefreshStakeLog",
      "fields": [
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RefreshStakeUserLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "poolName",
          "type": "string",
          "index": false
        },
        {
          "name": "rewardAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardShare",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCollateralAndSwapLog",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
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
      "name": "RemoveCollateralLogV3",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "RemoveCompoundingLiquidityLog",
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
          "name": "custodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingAmountIn",
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
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        },
        {
          "name": "compoundingPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPriceExponent",
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
          "name": "custodyUid",
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
      "name": "RemoveLiquidityLogV2",
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
          "name": "custodyUid",
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
        },
        {
          "name": "lpPriceUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "tokenOutPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "SetTokenRewardLog",
      "fields": [
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "epochCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              2
            ]
          },
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
      "name": "SwapAndAddCollateralLog",
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
          "name": "receivingCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "receiveAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
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
        },
        {
          "name": "deltaCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalCollateralUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finalSizeUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "oracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "oracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "oracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "SwapAndOpenLog",
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
          "name": "receivingCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
          "name": "positionFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "receivingOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "receivingOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "collateralOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "collateralOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "targetOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "targetOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "targetOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "SwapAndOpenLogV2",
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
          "name": "receivingCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetCustodyUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "amountIn",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmountOut",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "market",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entryPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryPriceExponent",
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
          "name": "collateralPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralPriceExponent",
          "type": "i32",
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
          "name": "positionFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "feeRebateAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "entryFeeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "receivingOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "receivingOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "receivingOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "collateralOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "collateralOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "collateralOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "collateralOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "targetOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "targetOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "targetOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "targetOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
          "index": false
        }
      ]
    },
    {
      "name": "SwapFeeInternalLog",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardCustodyAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "SwapFeeInternalLogV2",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "swapAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardCustodyAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "inOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "inOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "inOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "inOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "outOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "outOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "outOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "outOracleAccountPriceExponent",
          "type": "i32",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
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
      "name": "SwapLogV2",
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
          "name": "custodyInUid",
          "type": "u64",
          "index": false
        },
        {
          "name": "custodyOutUid",
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
        },
        {
          "name": "inOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "inOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "inOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "inOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        },
        {
          "name": "outOracleAccountTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "outOracleAccountType",
          "type": "u8",
          "index": false
        },
        {
          "name": "outOracleAccountPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "outOracleAccountPriceExponent",
          "type": "i32",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeInstantLog",
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
          "name": "unstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "rewardPerLpStaked",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeRequestLog",
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
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeTokenInstantLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "withdrawAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UnstakeTokenRequestLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "unstakeAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawStakeLog",
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
          "name": "lpTokens",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "WithdrawTokenLog",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "withdrawAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "currentTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "lastUpdatedTimestamp",
          "type": "i64",
          "index": false
        },
        {
          "name": "level",
          "type": "u8",
          "index": false
        },
        {
          "name": "activeStakeAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "VoltagePointsLog",
      "fields": [
        {
          "name": "tokenStake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "voltagePoints",
          "type": "u64",
          "index": false
        },
        {
          "name": "rebateUsd",
          "type": "u64",
          "index": false
        },
        {
          "name": "voltagePointsType",
          "type": "u8",
          "index": false
        },
        {
          "name": "padding",
          "type": {
            "array": [
              "u64",
              4
            ]
          },
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
      "msg": "Invalid Market state"
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
      "msg": "Custody is not supported"
    },
    {
      "code": 6029,
      "name": "UnsupportedPool",
      "msg": "Pool is not supported"
    },
    {
      "code": 6030,
      "name": "UnsupportedMarket",
      "msg": "Market is not supported"
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
      "msg": "Insufficient LP tokens staked"
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
      "name": "TokenStakeAccountMismatch",
      "msg": "Token Stake account doesnot match referral account"
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
    },
    {
      "code": 6052,
      "name": "MaxStopLossOrders",
      "msg": "Stop Loss limit exhausted"
    },
    {
      "code": 6053,
      "name": "MaxTakeProfitOrders",
      "msg": "Take Profit limit exhausted"
    },
    {
      "code": 6054,
      "name": "MaxOpenOrder",
      "msg": "Open order limit exhausted"
    },
    {
      "code": 6055,
      "name": "InvalidOrder",
      "msg": "Invalid Order"
    },
    {
      "code": 6056,
      "name": "InvalidLimitPrice",
      "msg": "Invalid Limit price"
    },
    {
      "code": 6057,
      "name": "MinReserve",
      "msg": "Minimum reserve limit breached"
    },
    {
      "code": 6058,
      "name": "MaxWithdrawTokenRequest",
      "msg": "Withdraw Token Request limit exhausted"
    },
    {
      "code": 6059,
      "name": "InvalidRewardDistribution",
      "msg": "Invalid Reward Distribution"
    },
    {
      "code": 6060,
      "name": "LpPriceOutOfBounds",
      "msg": "Liquidity Token price is out of bounds"
    }
  ]
};
