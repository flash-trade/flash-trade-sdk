export type PerpComposability = {
  "version": "0.1.0",
  "name": "perp_composability",
  "instructions": [
    {
      "name": "swapAndOpen",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
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
      "name": "swapAndAddCollateral",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapsParams"
          }
        }
      ]
    },
    {
      "name": "closeAndSwap",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
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
      "name": "removeCollateralAndSwap",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
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
    }
  ],
  "types": [
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
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "openPriceWithSlippage",
            "type": {
              "defined": "OraclesPrice"
            }
          },
          {
            "name": "openSizeAmount",
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
      "name": "SwapsParams",
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
          }
        ]
      }
    },
    {
      "name": "OraclesPrice",
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
      "name": "CloseAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "closePriceWithSlippage",
            "type": {
              "defined": "OraclesPrice"
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
      "name": "RemoveCollateralAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "collateralDelta",
            "type": "u64"
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
  ]
};

export const IDL: PerpComposability = {
  "version": "0.1.0",
  "name": "perp_composability",
  "instructions": [
    {
      "name": "swapAndOpen",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
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
      "name": "swapAndAddCollateral",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "SwapsParams"
          }
        }
      ]
    },
    {
      "name": "closeAndSwap",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
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
      "name": "removeCollateralAndSwap",
      "accounts": [
        {
          "name": "perpProgram",
          "isMut": false,
          "isSigner": false
        },
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
          "name": "swapPool",
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
          "name": "positionPool",
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
          "name": "ixSysvar",
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
    }
  ],
  "types": [
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
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "openPriceWithSlippage",
            "type": {
              "defined": "OraclesPrice"
            }
          },
          {
            "name": "openSizeAmount",
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
      "name": "SwapsParams",
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
          }
        ]
      }
    },
    {
      "name": "OraclesPrice",
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
      "name": "CloseAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "closePriceWithSlippage",
            "type": {
              "defined": "OraclesPrice"
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
      "name": "RemoveCollateralAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minAmountOut",
            "type": "u64"
          },
          {
            "name": "collateralDelta",
            "type": "u64"
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
  ]
};