/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/perpetuals.json`.
 */
export type Perpetuals = {
  "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4",
  "metadata": {
    "name": "perpetuals",
    "version": "1.1.0",
    "spec": "0.1.0",
    "description": "Flash Trade Perpetuals Exchange",
    "repository": "https://github.com/flash-trade/"
  },
  "instructions": [
    {
      "name": "addCollateral",
      "discriminator": [
        127,
        82,
        121,
        42,
        161,
        176,
        249,
        206
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "fundingAccount",
            "position"
          ]
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "fundingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addCollateralParams"
            }
          }
        }
      ]
    },
    {
      "name": "addCompoundingLiquidity",
      "discriminator": [
        244,
        231,
        42,
        192,
        190,
        134,
        3,
        52
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "fundingAccount",
            "compoundingTokenAccount"
          ]
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "compoundingTokenAccount",
          "writable": true
        },
        {
          "name": "poolCompoundingLpVault",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "inCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "in_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "inCustodyOracleAccount"
        },
        {
          "name": "inCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "compoundingTokenMint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        },
        {
          "name": "fundingTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addCompoundingLiquidityParams"
            }
          }
        }
      ]
    },
    {
      "name": "addCustody",
      "discriminator": [
        247,
        254,
        126,
        17,
        26,
        6,
        215,
        117
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custodyTokenMint"
              }
            ]
          }
        },
        {
          "name": "custodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custodyTokenMint"
              }
            ]
          }
        },
        {
          "name": "custodyTokenMint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addCustodyParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addCustodyToken22Account",
      "discriminator": [
        229,
        93,
        10,
        241,
        190,
        214,
        251,
        121
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custodyTokenAccount",
          "docs": [
            "This account is initialized with the CPI to the token program"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custodyTokenMint"
              }
            ]
          }
        },
        {
          "name": "custodyTokenMint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addCustodyToken22AccountParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addInternalOracle",
      "discriminator": [
        228,
        234,
        14,
        190,
        206,
        249,
        115,
        167
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "custodyTokenMint"
        },
        {
          "name": "intOracleAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "custodyTokenMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addInternalOracleParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addLiquidity",
      "discriminator": [
        181,
        157,
        89,
        67,
        143,
        182,
        52,
        72
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "fundingAccount",
            "lpTokenAccount"
          ]
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "lpTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "custodyTokenAccount",
          "writable": true
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        },
        {
          "name": "fundingTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addLiquidityParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "addLiquidityAndStake",
      "discriminator": [
        147,
        224,
        159,
        3,
        162,
        147,
        199,
        244
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "fundingAccount"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "custodyTokenAccount",
          "writable": true
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "poolStakedLpVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "pool.lp_mint",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        },
        {
          "name": "fundingTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addLiquidityAndStakeParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "addMarket",
      "discriminator": [
        41,
        137,
        185,
        126,
        69,
        139,
        254,
        55
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addMarketParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "addPool",
      "discriminator": [
        115,
        230,
        212,
        211,
        175,
        49,
        39,
        169
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "oracleAuthority"
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "params.name"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "metadataAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "addPoolParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "cancelAllTriggerOrders",
      "discriminator": [
        130,
        108,
        33,
        153,
        228,
        31,
        216,
        219
      ],
      "accounts": [
        {
          "name": "position"
        },
        {
          "name": "order",
          "writable": true
        },
        {
          "name": "eventAuthority"
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": []
    },
    {
      "name": "cancelTriggerOrder",
      "discriminator": [
        144,
        84,
        67,
        39,
        27,
        25,
        202,
        141
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "order"
          ]
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "order.market",
                "account": "order"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "cancelTriggerOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "cancelUnstakeTokenRequest",
      "discriminator": [
        145,
        133,
        31,
        216,
        203,
        198,
        96,
        8
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "cancelUnstakeTokenRequestParams"
            }
          }
        }
      ]
    },
    {
      "name": "closeAndSwap",
      "discriminator": [
        147,
        164,
        185,
        240,
        155,
        33,
        165,
        125
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "collateralAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingOracleAccount"
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        },
        {
          "name": "collateralMint"
        },
        {
          "name": "collateralTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "closeAndSwapParams"
            }
          }
        }
      ]
    },
    {
      "name": "closePosition",
      "discriminator": [
        123,
        134,
        81,
        0,
        49,
        68,
        98,
        98
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "receivingAccount",
            "position"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "collateralMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "closePositionParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "collectRebate",
      "discriminator": [
        211,
        159,
        122,
        61,
        195,
        246,
        132,
        15
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingTokenAccount"
          ]
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "rebateVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  98,
                  97,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "rebateTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  98,
                  97,
                  116,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "receivingTokenMint"
        }
      ],
      "args": []
    },
    {
      "name": "collectRevenue",
      "discriminator": [
        87,
        96,
        211,
        36,
        240,
        43,
        246,
        87
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingRevenueAccount"
          ]
        },
        {
          "name": "receivingRevenueAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "revenueTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "receivingTokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "collectRevenueParams"
            }
          }
        }
      ]
    },
    {
      "name": "collectStakeFees",
      "discriminator": [
        61,
        174,
        225,
        165,
        103,
        145,
        250,
        181
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingTokenAccount"
          ]
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "feeCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "fee_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "feeCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "fee_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "collectStakeRewardParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "collectTokenReward",
      "discriminator": [
        115,
        9,
        132,
        251,
        3,
        78,
        40,
        40
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingTokenAccount"
          ]
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "tokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "collectTokenRewardParams"
            }
          }
        }
      ]
    },
    {
      "name": "compoundFees",
      "discriminator": [
        133,
        54,
        141,
        29,
        83,
        112,
        130,
        197
      ],
      "accounts": [
        {
          "name": "poolCompoundingLpVault",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "compoundFeesParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "createReferral",
      "discriminator": [
        61,
        17,
        240,
        245,
        172,
        66,
        159,
        232
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenStakeAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "token_stake_account.owner",
                "account": "tokenStake"
              }
            ]
          }
        },
        {
          "name": "referralAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  102,
                  101,
                  114,
                  114,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createReferralParams"
            }
          }
        }
      ]
    },
    {
      "name": "createWhitelist",
      "discriminator": [
        89,
        182,
        231,
        206,
        68,
        173,
        60,
        6
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "owner"
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createWhitelistParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "decreaseSize",
      "discriminator": [
        171,
        28,
        203,
        29,
        118,
        16,
        214,
        169
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "collateralMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "decreaseSizeParams"
            }
          }
        }
      ]
    },
    {
      "name": "depositStake",
      "discriminator": [
        160,
        167,
        9,
        220,
        74,
        243,
        228,
        43
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "fundingLpTokenAccount"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingLpTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "poolStakedLpVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "pool.lp_mint",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "lpTokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "depositStakeParams"
            }
          }
        }
      ]
    },
    {
      "name": "depositTokenStake",
      "discriminator": [
        105,
        77,
        29,
        66,
        28,
        35,
        183,
        10
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "fundingTokenAccount"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingTokenAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "tokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "depositTokenStakeParams"
            }
          }
        }
      ]
    },
    {
      "name": "distributeTokenReward",
      "discriminator": [
        150,
        187,
        53,
        202,
        188,
        238,
        252,
        32
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "fundingTokenAccount",
          "writable": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "tokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "distributeTokenRewardParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "editLimitOrder",
      "discriminator": [
        42,
        114,
        3,
        11,
        137,
        245,
        206,
        50
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingAccount",
            "order"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "reserveCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reserve_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "reserveOracleAccount"
        },
        {
          "name": "reserveCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reserve_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receiveCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receive_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "editLimitOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "editTriggerOrder",
      "discriminator": [
        180,
        43,
        215,
        112,
        254,
        116,
        20,
        133
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "position",
            "order"
          ]
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "receiveCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receive_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "editTriggerOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "executeLimitOrder",
      "discriminator": [
        52,
        33,
        60,
        30,
        47,
        100,
        40,
        22
      ],
      "accounts": [
        {
          "name": "positionOwner",
          "writable": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "collateralMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "executeLimitOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "executeLimitWithSwap",
      "discriminator": [
        253,
        77,
        100,
        122,
        194,
        179,
        54,
        45
      ],
      "accounts": [
        {
          "name": "positionOwner",
          "writable": true
        },
        {
          "name": "feePayer",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "reserveCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reserve_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "reserveCustodyOracleAccount"
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "collateralMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "executeLimitWithSwapParams"
            }
          }
        }
      ]
    },
    {
      "name": "executeTriggerOrder",
      "discriminator": [
        105,
        10,
        104,
        136,
        215,
        134,
        84,
        171
      ],
      "accounts": [
        {
          "name": "positionOwner",
          "writable": true
        },
        {
          "name": "feePayer",
          "writable": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "executeTriggerOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "executeTriggerWithSwap",
      "discriminator": [
        198,
        68,
        87,
        43,
        203,
        171,
        123,
        82
      ],
      "accounts": [
        {
          "name": "positionOwner",
          "writable": true
        },
        {
          "name": "feePayer",
          "writable": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "collateralAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "order.owner",
                "account": "order"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingOracleAccount"
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        },
        {
          "name": "receivingTokenProgram"
        },
        {
          "name": "collateralMint"
        },
        {
          "name": "collateralTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "executeTriggerWithSwapParams"
            }
          }
        }
      ]
    },
    {
      "name": "getAddCompoundingLiquidityAmountAndFee",
      "discriminator": [
        29,
        1,
        144,
        58,
        190,
        228,
        125,
        229
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "inCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "in_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "inCustodyOracleAccount"
        },
        {
          "name": "rewardCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "lpTokenMint"
        },
        {
          "name": "compoundingTokenMint"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "GetAddCompoundingLiquidityAmountAndFeeParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "amountAndFee"
        }
      }
    },
    {
      "name": "getAddLiquidityAmountAndFee",
      "discriminator": [
        172,
        150,
        249,
        181,
        233,
        241,
        78,
        139
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "lpTokenMint"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getAddLiquidityAmountAndFeeParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "amountAndFee"
        }
      }
    },
    {
      "name": "getAssetsUnderManagement",
      "discriminator": [
        44,
        3,
        161,
        69,
        174,
        75,
        137,
        162
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getAssetsUnderManagementParams"
            }
          }
        }
      ]
    },
    {
      "name": "getCompoundingTokenData",
      "discriminator": [
        108,
        158,
        186,
        227,
        231,
        199,
        25,
        110
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getCompoundingTokenDataParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "compoundingTokenData"
        }
      }
    },
    {
      "name": "getCompoundingTokenPrice",
      "discriminator": [
        129,
        82,
        182,
        136,
        95,
        171,
        44,
        63
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getCompoundingTokenPriceParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "getEntryPriceAndFee",
      "discriminator": [
        134,
        30,
        231,
        199,
        83,
        72,
        27,
        99
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getEntryPriceAndFeeParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "newPositionPricesAndFee"
        }
      }
    },
    {
      "name": "getExitPriceAndFee",
      "discriminator": [
        73,
        77,
        94,
        31,
        8,
        9,
        92,
        32
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getExitPriceAndFeeParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "priceAndFee"
        }
      }
    },
    {
      "name": "getLiquidationPrice",
      "discriminator": [
        73,
        174,
        119,
        65,
        149,
        5,
        73,
        239
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getLiquidationPriceParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "oraclePrice"
        }
      }
    },
    {
      "name": "getLiquidationState",
      "discriminator": [
        127,
        126,
        199,
        117,
        90,
        89,
        29,
        50
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getLiquidationStateParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "getLpTokenPrice",
      "discriminator": [
        71,
        172,
        21,
        25,
        176,
        168,
        60,
        10
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getLpTokenPriceParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "getOraclePrice",
      "discriminator": [
        200,
        20,
        0,
        106,
        56,
        210,
        230,
        140
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getOraclePriceParams"
            }
          }
        }
      ]
    },
    {
      "name": "getPnl",
      "discriminator": [
        106,
        212,
        3,
        250,
        195,
        224,
        64,
        160
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getPnlParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "profitAndLoss"
        }
      }
    },
    {
      "name": "getPositionData",
      "discriminator": [
        58,
        14,
        217,
        248,
        114,
        44,
        212,
        140
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getPositionDataParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "positionData"
        }
      }
    },
    {
      "name": "getRemoveCompoundingLiquidityAmountAndFee",
      "discriminator": [
        90,
        9,
        144,
        220,
        42,
        82,
        41,
        95
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "outCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "out_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "outCustodyOracleAccount"
        },
        {
          "name": "rewardCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "lpTokenMint"
        },
        {
          "name": "compoundingTokenMint"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getRemoveCompoundingLiquidityAmountAndFeeParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "amountAndFee"
        }
      }
    },
    {
      "name": "getRemoveLiquidityAmountAndFee",
      "discriminator": [
        194,
        226,
        233,
        102,
        14,
        21,
        196,
        7
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getRemoveLiquidityAmountAndFeeParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "amountAndFee"
        }
      }
    },
    {
      "name": "getSwapAmountAndFees",
      "discriminator": [
        247,
        121,
        40,
        99,
        35,
        82,
        100,
        32
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "receivingCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receiving_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingCustodyOracleAccount"
        },
        {
          "name": "dispensingCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingCustodyOracleAccount"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "getSwapAmountAndFeesParams"
            }
          }
        }
      ],
      "returns": {
        "defined": {
          "name": "swapAmountAndFees"
        }
      }
    },
    {
      "name": "increaseSize",
      "discriminator": [
        107,
        13,
        141,
        238,
        152,
        165,
        96,
        87
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "collateralMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "increaseSizeParams"
            }
          }
        }
      ]
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "upgradeAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "perpetualsProgram",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "perpetualsProgramData"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initParams"
            }
          }
        }
      ]
    },
    {
      "name": "initCompounding",
      "discriminator": [
        69,
        90,
        204,
        111,
        156,
        140,
        138,
        184
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "compoundingVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  111,
                  117,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "lpTokenMint"
              }
            ]
          }
        },
        {
          "name": "compoundingTokenMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  109,
                  112,
                  111,
                  117,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "metadataAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initCompoundingParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initRebateVault",
      "discriminator": [
        250,
        123,
        188,
        186,
        176,
        127,
        253,
        61
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "rebateMint"
        },
        {
          "name": "rebateTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  98,
                  97,
                  116,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "rebateVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  98,
                  97,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initRebateVaultParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initRevenueTokenAccount",
      "discriminator": [
        235,
        126,
        219,
        143,
        29,
        74,
        149,
        161
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "rewardMint"
        },
        {
          "name": "revenueTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "protocolVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "protocolTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initRevenueTokenAccountParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initStaking",
      "discriminator": [
        42,
        18,
        242,
        224,
        66,
        32,
        122,
        8
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "stakedLpTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101,
                  100,
                  95,
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "lpTokenMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initStakingParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "initTokenVault",
      "discriminator": [
        203,
        26,
        194,
        169,
        252,
        226,
        179,
        180
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "fundingTokenAccount",
          "writable": true
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initTokenVaultParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "liquidate",
      "discriminator": [
        223,
        179,
        226,
        125,
        48,
        46,
        39,
        74
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "liquidateParams"
            }
          }
        }
      ]
    },
    {
      "name": "migrateFlp",
      "discriminator": [
        44,
        141,
        31,
        32,
        240,
        175,
        17,
        193
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "compoundingTokenAccount"
          ]
        },
        {
          "name": "compoundingTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "poolStakedLpVault",
          "writable": true
        },
        {
          "name": "poolCompoundingLpVault",
          "writable": true
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "compoundingTokenMint",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "migrateFlpParams"
            }
          }
        }
      ]
    },
    {
      "name": "migrateStake",
      "discriminator": [
        178,
        5,
        26,
        85,
        56,
        20,
        153,
        160
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "compoundingTokenAccount"
          ]
        },
        {
          "name": "compoundingTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "poolStakedLpVault",
          "writable": true
        },
        {
          "name": "poolCompoundingLpVault",
          "writable": true
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "compoundingTokenMint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "migrateStakeParams"
            }
          }
        }
      ]
    },
    {
      "name": "moveProtocolFees",
      "discriminator": [
        129,
        151,
        181,
        212,
        47,
        232,
        58,
        98
      ],
      "accounts": [
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "revenueTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  118,
                  101,
                  110,
                  117,
                  101,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "protocolVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "protocolTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "tokenMint"
        }
      ],
      "args": []
    },
    {
      "name": "openPosition",
      "discriminator": [
        135,
        128,
        47,
        77,
        15,
        152,
        240,
        49
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "fundingAccount"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "fundingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "openPositionParams"
            }
          }
        }
      ]
    },
    {
      "name": "placeLimitOrder",
      "discriminator": [
        108,
        176,
        33,
        186,
        146,
        229,
        1,
        197
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "fundingAccount"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "reserveCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reserve_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "reserveOracleAccount"
        },
        {
          "name": "reserveCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reserve_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receiveCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receive_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "fundingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "placeLimitOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "placeTriggerOrder",
      "discriminator": [
        32,
        156,
        50,
        188,
        232,
        159,
        112,
        236
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "order",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market"
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "receiveCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receive_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "placeTriggerOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "refreshStake",
      "discriminator": [
        194,
        123,
        40,
        247,
        37,
        237,
        119,
        119
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "feeDistributionTokenAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "refreshStakeParams"
            }
          }
        }
      ]
    },
    {
      "name": "refreshTokenStake",
      "discriminator": [
        55,
        39,
        150,
        54,
        174,
        139,
        76,
        69
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "refreshTokenStakeParams"
            }
          }
        }
      ]
    },
    {
      "name": "reimburse",
      "discriminator": [
        160,
        92,
        125,
        187,
        32,
        179,
        114,
        88
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "custodyTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "reimburseParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removeCollateral",
      "discriminator": [
        86,
        222,
        130,
        86,
        92,
        20,
        72,
        65
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "receivingAccount",
            "position"
          ]
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removeCollateralParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "removeCollateralAndSwap",
      "discriminator": [
        197,
        216,
        82,
        134,
        173,
        128,
        23,
        62
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "collateralAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "position.owner",
                "account": "position"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingOracleAccount"
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        },
        {
          "name": "collateralMint"
        },
        {
          "name": "collateralTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removeCollateralAndSwapParams"
            }
          }
        }
      ]
    },
    {
      "name": "removeCompoundingLiquidity",
      "discriminator": [
        5,
        133,
        39,
        178,
        54,
        58,
        37,
        140
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingAccount",
            "compoundingTokenAccount"
          ]
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "compoundingTokenAccount",
          "writable": true
        },
        {
          "name": "poolCompoundingLpVault",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "outCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "out_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "outCustodyOracleAccount"
        },
        {
          "name": "outCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "compoundingTokenMint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        },
        {
          "name": "receivingTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removeCompoundingLiquidityParams"
            }
          }
        }
      ]
    },
    {
      "name": "removeCustody",
      "discriminator": [
        143,
        229,
        131,
        48,
        248,
        212,
        167,
        185
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "custodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingTokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removeCustodyParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removeLiquidity",
      "discriminator": [
        80,
        85,
        209,
        72,
        24,
        206,
        177,
        108
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingAccount",
            "lpTokenAccount"
          ]
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "lpTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "custodyOracleAccount"
        },
        {
          "name": "custodyTokenAccount",
          "writable": true
        },
        {
          "name": "lpTokenMint",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "receivingMint"
        },
        {
          "name": "receivingTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removeLiquidityParams"
            }
          }
        }
      ]
    },
    {
      "name": "removeMarket",
      "discriminator": [
        138,
        35,
        250,
        163,
        200,
        202,
        40,
        110
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removeMarketParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "removePool",
      "discriminator": [
        132,
        42,
        53,
        138,
        28,
        220,
        170,
        55
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "removePoolParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "renameFlp",
      "discriminator": [
        175,
        28,
        157,
        91,
        44,
        165,
        11,
        165
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "lpMetadataAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "renameFlpParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "resizeInternalOracle",
      "discriminator": [
        111,
        166,
        24,
        12,
        251,
        82,
        69,
        230
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "custodyTokenMint"
        },
        {
          "name": "intOracleAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "custodyTokenMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "resizeInternalOracleParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setAdminSigners",
      "discriminator": [
        240,
        171,
        141,
        105,
        124,
        2,
        225,
        188
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setAdminSignersParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setCustodyConfig",
      "discriminator": [
        133,
        97,
        130,
        143,
        215,
        229,
        36,
        176
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setCustodyConfigParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setCustomOraclePrice",
      "discriminator": [
        180,
        194,
        182,
        63,
        48,
        125,
        116,
        136
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "custody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "oracleAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setCustomOraclePriceParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setFeeShare",
      "discriminator": [
        244,
        200,
        2,
        250,
        254,
        123,
        78,
        93
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setFeeShareParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalCurrentPrice",
      "discriminator": [
        187,
        242,
        45,
        203,
        214,
        7,
        211,
        213
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setInternalCurrentPriceParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalEmaPrice",
      "discriminator": [
        46,
        30,
        57,
        7,
        225,
        198,
        92,
        164
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setInternalEmaPriceParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setInternalLazerPrice",
      "discriminator": [
        56,
        112,
        153,
        62,
        193,
        123,
        193,
        115
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "pythStorage"
        },
        {
          "name": "pythTreasury",
          "writable": true
        },
        {
          "name": "pythLazerProgram",
          "address": "pytd2yyk641x7ak7mkaasSJVXh6YYZnC7wTmtgAyxPt"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setInternalLazerPriceParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setLpTokenPrice",
      "discriminator": [
        216,
        188,
        199,
        41,
        70,
        236,
        202,
        226
      ],
      "accounts": [
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "lpTokenMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  112,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setLpTokenPriceParams"
            }
          }
        }
      ]
    },
    {
      "name": "setMarketConfig",
      "discriminator": [
        128,
        237,
        216,
        59,
        122,
        62,
        156,
        30
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody"
        },
        {
          "name": "collateralCustody"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setMarketConfigParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPermissions",
      "discriminator": [
        214,
        165,
        105,
        182,
        213,
        162,
        212,
        34
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setPermissionsParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPerpetualsConfig",
      "discriminator": [
        80,
        72,
        21,
        191,
        29,
        121,
        45,
        111
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setPerpetualsConfigParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPoolConfig",
      "discriminator": [
        216,
        87,
        65,
        125,
        113,
        110,
        185,
        120
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setPoolConfigParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setPositionPriceImpact",
      "discriminator": [
        52,
        190,
        214,
        219,
        115,
        224,
        56,
        228
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "position",
          "writable": true
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setPositionPriceImpactParams"
            }
          }
        }
      ]
    },
    {
      "name": "setProtocolFeeShare",
      "discriminator": [
        6,
        155,
        103,
        17,
        228,
        172,
        14,
        160
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "protocolVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setProtocolFeeShareParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTestTime",
      "discriminator": [
        242,
        231,
        177,
        251,
        126,
        145,
        159,
        104
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setTestTimeParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenReward",
      "discriminator": [
        97,
        209,
        220,
        95,
        114,
        167,
        225,
        103
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "token_stake_account.owner",
                "account": "tokenStake"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setTokenRewardParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenStakeLevel",
      "discriminator": [
        74,
        184,
        65,
        143,
        136,
        165,
        178,
        6
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "token_stake_account.owner",
                "account": "tokenStake"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setTokenStakeLevelParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setTokenVaultConfig",
      "discriminator": [
        106,
        228,
        78,
        88,
        112,
        139,
        185,
        119
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setTokenVaultConfigParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "setWhitelistConfig",
      "discriminator": [
        73,
        64,
        17,
        134,
        219,
        71,
        103,
        83
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "owner"
        },
        {
          "name": "whitelist",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  104,
                  105,
                  116,
                  101,
                  108,
                  105,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "setWhitelistConfigParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "settleRebates",
      "discriminator": [
        12,
        192,
        237,
        255,
        81,
        68,
        17,
        193
      ],
      "accounts": [
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "rewardCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "rebateVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  98,
                  97,
                  116,
                  101,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "rebateTokenAccount",
          "writable": true
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "swap",
      "discriminator": [
        248,
        198,
        158,
        145,
        225,
        117,
        135,
        200
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "fundingAccount",
            "receivingAccount"
          ]
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "receivingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "receivingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receiving_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingCustodyOracleAccount"
        },
        {
          "name": "receivingCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receiving_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "dispensingCustodyOracleAccount"
        },
        {
          "name": "dispensingCustodyTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "dispensing_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        },
        {
          "name": "fundingTokenProgram"
        },
        {
          "name": "receivingMint"
        },
        {
          "name": "receivingTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "swapParams"
            }
          }
        }
      ],
      "returns": "u64"
    },
    {
      "name": "swapAndAddCollateral",
      "discriminator": [
        135,
        207,
        228,
        112,
        247,
        15,
        29,
        150
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "receivingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receiving_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingCustodyOracleAccount"
        },
        {
          "name": "receivingCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "fundingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "swapAndAddCollateralParams"
            }
          }
        }
      ]
    },
    {
      "name": "swapAndOpen",
      "discriminator": [
        26,
        209,
        42,
        0,
        169,
        62,
        30,
        118
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "fundingAccount"
          ]
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "fundingAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "receivingCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "receiving_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "receivingCustodyOracleAccount"
        },
        {
          "name": "receivingCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "market"
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "targetCustody",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "target_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "targetOracleAccount"
        },
        {
          "name": "collateralCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "collateral_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "collateralOracleAccount"
        },
        {
          "name": "collateralCustodyTokenAccount",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "fundingTokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "fundingMint"
        },
        {
          "name": "collateralMint"
        },
        {
          "name": "collateralTokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "swapAndOpenParams"
            }
          }
        }
      ]
    },
    {
      "name": "swapFeeInternal",
      "discriminator": [
        16,
        2,
        202,
        40,
        46,
        57,
        4,
        63
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "rewardCustodyOracleAccount"
        },
        {
          "name": "rewardCustodyTokenAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "ixSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "swapFeeInternalParams"
            }
          }
        }
      ]
    },
    {
      "name": "testInit",
      "discriminator": [
        48,
        51,
        92,
        122,
        81,
        19,
        112,
        41
      ],
      "accounts": [
        {
          "name": "upgradeAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "testInitParams"
            }
          }
        }
      ]
    },
    {
      "name": "unstakeInstant",
      "discriminator": [
        119,
        27,
        161,
        139,
        21,
        78,
        130,
        66
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "rewardCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "pool"
              },
              {
                "kind": "account",
                "path": "reward_custody.mint",
                "account": "custody"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "unstakeInstantParams"
            }
          }
        }
      ]
    },
    {
      "name": "unstakeRequest",
      "discriminator": [
        50,
        86,
        156,
        73,
        149,
        78,
        163,
        134
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "unstakeRequestParams"
            }
          }
        }
      ]
    },
    {
      "name": "unstakeTokenRequest",
      "discriminator": [
        128,
        231,
        170,
        197,
        177,
        246,
        134,
        238
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "unstakeTokenRequestParams"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawFees",
      "discriminator": [
        198,
        212,
        171,
        109,
        144,
        215,
        174,
        89
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "protocolVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "protocolTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "receivingMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "withdrawFeesParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawInstantFees",
      "discriminator": [
        210,
        236,
        193,
        124,
        205,
        149,
        255,
        203
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "receivingTokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "withdrawInstantFeesParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawSolFees",
      "discriminator": [
        191,
        53,
        166,
        97,
        124,
        212,
        228,
        219
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "receivingAccount",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "withdrawSolFeesParams"
            }
          }
        }
      ],
      "returns": "u8"
    },
    {
      "name": "withdrawStake",
      "discriminator": [
        153,
        8,
        22,
        138,
        105,
        176,
        87,
        66
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingLpTokenAccount"
          ]
        },
        {
          "name": "receivingLpTokenAccount",
          "writable": true
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "pool.name",
                "account": "pool"
              }
            ]
          }
        },
        {
          "name": "flpStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "pool"
              }
            ]
          }
        },
        {
          "name": "poolStakedLpVault",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "lpMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "withdrawStakeParams"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawToken",
      "discriminator": [
        136,
        235,
        181,
        5,
        101,
        109,
        57,
        81
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "receivingTokenAccount"
          ]
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenStakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "eventAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  95,
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "program",
          "address": "FTPP4jEWW1n8s2FEccwVfS9KCPjpndaswg7Nkkuz4ER4"
        },
        {
          "name": "tokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "withdrawTokenParams"
            }
          }
        }
      ]
    },
    {
      "name": "withdrawUnclaimedTokens",
      "discriminator": [
        43,
        239,
        40,
        75,
        164,
        156,
        231,
        139
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "perpetuals",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  101,
                  114,
                  112,
                  101,
                  116,
                  117,
                  97,
                  108,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "transferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenVaultTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "receivingTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "receivingTokenMint"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "withdrawUnclaimedTokensParams"
            }
          }
        }
      ],
      "returns": "u8"
    }
  ],
  "accounts": [
    {
      "name": "custody",
      "discriminator": [
        1,
        184,
        48,
        81,
        93,
        131,
        63,
        145
      ]
    },
    {
      "name": "customOracle",
      "discriminator": [
        227,
        170,
        164,
        218,
        127,
        16,
        35,
        223
      ]
    },
    {
      "name": "flpStake",
      "discriminator": [
        175,
        178,
        171,
        30,
        187,
        253,
        13,
        118
      ]
    },
    {
      "name": "market",
      "discriminator": [
        219,
        190,
        213,
        55,
        0,
        227,
        198,
        154
      ]
    },
    {
      "name": "multisig",
      "discriminator": [
        224,
        116,
        121,
        186,
        68,
        161,
        79,
        236
      ]
    },
    {
      "name": "order",
      "discriminator": [
        134,
        173,
        223,
        185,
        77,
        86,
        28,
        51
      ]
    },
    {
      "name": "perpetuals",
      "discriminator": [
        28,
        167,
        98,
        191,
        104,
        82,
        108,
        196
      ]
    },
    {
      "name": "pool",
      "discriminator": [
        241,
        154,
        109,
        4,
        17,
        177,
        109,
        188
      ]
    },
    {
      "name": "position",
      "discriminator": [
        170,
        188,
        143,
        228,
        122,
        64,
        247,
        208
      ]
    },
    {
      "name": "protocolVault",
      "discriminator": [
        200,
        167,
        197,
        238,
        32,
        139,
        26,
        69
      ]
    },
    {
      "name": "rebateVault",
      "discriminator": [
        207,
        58,
        186,
        112,
        64,
        20,
        188,
        212
      ]
    },
    {
      "name": "referral",
      "discriminator": [
        30,
        235,
        136,
        224,
        106,
        107,
        49,
        64
      ]
    },
    {
      "name": "tokenStake",
      "discriminator": [
        229,
        123,
        21,
        243,
        246,
        164,
        57,
        239
      ]
    },
    {
      "name": "tokenVault",
      "discriminator": [
        121,
        7,
        84,
        254,
        151,
        228,
        43,
        144
      ]
    },
    {
      "name": "whitelist",
      "discriminator": [
        204,
        176,
        52,
        79,
        146,
        121,
        54,
        247
      ]
    }
  ],
  "events": [
    {
      "name": "addCollateralLog",
      "discriminator": [
        250,
        80,
        8,
        85,
        212,
        148,
        93,
        189
      ]
    },
    {
      "name": "addCollateralLogUsDv1",
      "discriminator": [
        208,
        254,
        58,
        223,
        46,
        169,
        109,
        20
      ]
    },
    {
      "name": "addCollateralLogV2",
      "discriminator": [
        38,
        112,
        191,
        36,
        86,
        85,
        56,
        130
      ]
    },
    {
      "name": "addCollateralLogV3",
      "discriminator": [
        175,
        245,
        91,
        237,
        142,
        81,
        179,
        72
      ]
    },
    {
      "name": "addCompoundingLiquidityLog",
      "discriminator": [
        149,
        197,
        30,
        77,
        47,
        199,
        118,
        121
      ]
    },
    {
      "name": "addLiquidityAndStakeLog",
      "discriminator": [
        174,
        206,
        97,
        67,
        145,
        186,
        208,
        146
      ]
    },
    {
      "name": "addLiquidityLog",
      "discriminator": [
        114,
        59,
        143,
        173,
        186,
        139,
        21,
        124
      ]
    },
    {
      "name": "addLiquidityLogV2",
      "discriminator": [
        243,
        86,
        201,
        255,
        161,
        254,
        32,
        103
      ]
    },
    {
      "name": "burnAndClaimLog",
      "discriminator": [
        31,
        202,
        163,
        228,
        156,
        84,
        62,
        195
      ]
    },
    {
      "name": "burnAndStakeLog",
      "discriminator": [
        56,
        0,
        133,
        199,
        93,
        2,
        193,
        89
      ]
    },
    {
      "name": "cancelLimitOrderLog",
      "discriminator": [
        103,
        102,
        181,
        28,
        109,
        173,
        138,
        187
      ]
    },
    {
      "name": "cancelTriggerOrderLog",
      "discriminator": [
        210,
        142,
        214,
        49,
        213,
        105,
        198,
        82
      ]
    },
    {
      "name": "cancelUnstakeTokenRequestLog",
      "discriminator": [
        175,
        88,
        47,
        153,
        222,
        43,
        242,
        106
      ]
    },
    {
      "name": "closeAndSwapLog",
      "discriminator": [
        45,
        116,
        23,
        211,
        45,
        232,
        190,
        29
      ]
    },
    {
      "name": "closeAndSwapLogUsDv1",
      "discriminator": [
        139,
        57,
        75,
        40,
        212,
        107,
        110,
        19
      ]
    },
    {
      "name": "closePositionLog",
      "discriminator": [
        113,
        101,
        11,
        97,
        138,
        46,
        113,
        211
      ]
    },
    {
      "name": "closePositionLogUsDv1",
      "discriminator": [
        44,
        100,
        67,
        33,
        255,
        1,
        117,
        100
      ]
    },
    {
      "name": "closePositionLogV2",
      "discriminator": [
        90,
        109,
        181,
        243,
        141,
        194,
        217,
        169
      ]
    },
    {
      "name": "closePositionLogV3",
      "discriminator": [
        67,
        63,
        63,
        13,
        180,
        22,
        82,
        202
      ]
    },
    {
      "name": "collectRebateLog",
      "discriminator": [
        15,
        135,
        219,
        64,
        131,
        128,
        116,
        46
      ]
    },
    {
      "name": "collectRevenueLog",
      "discriminator": [
        73,
        175,
        8,
        200,
        124,
        185,
        139,
        238
      ]
    },
    {
      "name": "collectStakeRewardLog",
      "discriminator": [
        28,
        123,
        101,
        0,
        157,
        175,
        189,
        235
      ]
    },
    {
      "name": "collectStakeRewardLogV2",
      "discriminator": [
        144,
        33,
        60,
        77,
        26,
        23,
        155,
        202
      ]
    },
    {
      "name": "collectTokenRewardLog",
      "discriminator": [
        30,
        194,
        243,
        166,
        162,
        139,
        204,
        167
      ]
    },
    {
      "name": "compoundingFeesLog",
      "discriminator": [
        208,
        193,
        166,
        56,
        156,
        9,
        146,
        134
      ]
    },
    {
      "name": "decreaseSizeLog",
      "discriminator": [
        178,
        148,
        11,
        241,
        33,
        51,
        85,
        153
      ]
    },
    {
      "name": "decreaseSizeLogUsDv1",
      "discriminator": [
        153,
        62,
        193,
        112,
        127,
        49,
        97,
        186
      ]
    },
    {
      "name": "decreaseSizeLogV2",
      "discriminator": [
        57,
        25,
        61,
        35,
        94,
        151,
        151,
        19
      ]
    },
    {
      "name": "decreaseSizeLogV3",
      "discriminator": [
        217,
        82,
        1,
        138,
        33,
        131,
        35,
        70
      ]
    },
    {
      "name": "depositStakeLog",
      "discriminator": [
        167,
        37,
        237,
        7,
        89,
        30,
        232,
        252
      ]
    },
    {
      "name": "depositTokenStakeLog",
      "discriminator": [
        186,
        214,
        215,
        132,
        49,
        100,
        21,
        226
      ]
    },
    {
      "name": "distributeTokenRewardLog",
      "discriminator": [
        245,
        36,
        94,
        131,
        251,
        212,
        127,
        250
      ]
    },
    {
      "name": "editLimitOrderLog",
      "discriminator": [
        253,
        67,
        224,
        184,
        212,
        129,
        80,
        202
      ]
    },
    {
      "name": "editTriggerOrderLog",
      "discriminator": [
        85,
        36,
        70,
        160,
        127,
        247,
        206,
        13
      ]
    },
    {
      "name": "executeLimitOrderLog",
      "discriminator": [
        56,
        203,
        215,
        82,
        174,
        201,
        4,
        59
      ]
    },
    {
      "name": "executeLimitOrderLogUsDv1",
      "discriminator": [
        157,
        253,
        170,
        213,
        56,
        114,
        0,
        231
      ]
    },
    {
      "name": "executeLimitOrderLogV2",
      "discriminator": [
        165,
        90,
        14,
        189,
        146,
        204,
        58,
        10
      ]
    },
    {
      "name": "executeLimitWithSwapLog",
      "discriminator": [
        229,
        50,
        105,
        173,
        130,
        115,
        142,
        77
      ]
    },
    {
      "name": "executeLimitWithSwapLogUsDv1",
      "discriminator": [
        136,
        112,
        109,
        134,
        18,
        20,
        144,
        240
      ]
    },
    {
      "name": "executeLimitWithSwapLogV2",
      "discriminator": [
        164,
        130,
        158,
        95,
        142,
        77,
        238,
        250
      ]
    },
    {
      "name": "executeTriggerOrderLog",
      "discriminator": [
        145,
        148,
        23,
        158,
        211,
        183,
        171,
        227
      ]
    },
    {
      "name": "executeTriggerOrderLogUsDv1",
      "discriminator": [
        29,
        242,
        159,
        21,
        110,
        131,
        133,
        251
      ]
    },
    {
      "name": "executeTriggerWithSwapLog",
      "discriminator": [
        63,
        205,
        64,
        135,
        62,
        252,
        44,
        38
      ]
    },
    {
      "name": "executeTriggerWithSwapLogUsDv1",
      "discriminator": [
        142,
        41,
        162,
        146,
        126,
        153,
        143,
        199
      ]
    },
    {
      "name": "increaseSizeLog",
      "discriminator": [
        186,
        190,
        64,
        113,
        120,
        194,
        84,
        179
      ]
    },
    {
      "name": "increaseSizeLogUsDv1",
      "discriminator": [
        146,
        141,
        52,
        5,
        176,
        183,
        52,
        116
      ]
    },
    {
      "name": "increaseSizeLogV2",
      "discriminator": [
        34,
        185,
        17,
        69,
        7,
        87,
        98,
        214
      ]
    },
    {
      "name": "increaseSizeLogV3",
      "discriminator": [
        181,
        126,
        138,
        28,
        252,
        210,
        238,
        65
      ]
    },
    {
      "name": "increaseSizeLogV4",
      "discriminator": [
        93,
        79,
        22,
        133,
        29,
        140,
        92,
        157
      ]
    },
    {
      "name": "liquidateLog",
      "discriminator": [
        127,
        98,
        159,
        131,
        170,
        88,
        59,
        80
      ]
    },
    {
      "name": "liquidateLogUsDv1",
      "discriminator": [
        58,
        111,
        108,
        15,
        244,
        203,
        107,
        70
      ]
    },
    {
      "name": "liquidateLogV2",
      "discriminator": [
        133,
        114,
        231,
        231,
        2,
        30,
        148,
        240
      ]
    },
    {
      "name": "liquidateLogV3",
      "discriminator": [
        193,
        180,
        21,
        172,
        48,
        171,
        179,
        139
      ]
    },
    {
      "name": "migrateFlpLog",
      "discriminator": [
        107,
        52,
        120,
        181,
        112,
        83,
        178,
        243
      ]
    },
    {
      "name": "migratePositionLog",
      "discriminator": [
        10,
        172,
        35,
        245,
        48,
        90,
        131,
        206
      ]
    },
    {
      "name": "migrateStakeLog",
      "discriminator": [
        54,
        98,
        239,
        210,
        54,
        90,
        19,
        168
      ]
    },
    {
      "name": "moveProtocolFeesLog",
      "discriminator": [
        174,
        213,
        219,
        87,
        187,
        176,
        5,
        99
      ]
    },
    {
      "name": "openPositionLog",
      "discriminator": [
        228,
        131,
        16,
        201,
        132,
        249,
        248,
        151
      ]
    },
    {
      "name": "openPositionLogUsDv1",
      "discriminator": [
        103,
        209,
        189,
        124,
        186,
        196,
        11,
        195
      ]
    },
    {
      "name": "openPositionLogV2",
      "discriminator": [
        87,
        9,
        35,
        100,
        127,
        162,
        168,
        24
      ]
    },
    {
      "name": "openPositionLogV3",
      "discriminator": [
        240,
        236,
        169,
        189,
        73,
        232,
        131,
        144
      ]
    },
    {
      "name": "openPositionLogV4",
      "discriminator": [
        233,
        192,
        213,
        152,
        42,
        81,
        109,
        182
      ]
    },
    {
      "name": "placeLimitOrderLog",
      "discriminator": [
        36,
        71,
        20,
        70,
        138,
        237,
        173,
        179
      ]
    },
    {
      "name": "placeTriggerOrderLog",
      "discriminator": [
        156,
        167,
        167,
        118,
        66,
        184,
        115,
        66
      ]
    },
    {
      "name": "referralRebateLog",
      "discriminator": [
        249,
        110,
        226,
        78,
        45,
        120,
        110,
        15
      ]
    },
    {
      "name": "refreshStakeLog",
      "discriminator": [
        120,
        218,
        48,
        91,
        206,
        5,
        128,
        112
      ]
    },
    {
      "name": "refreshStakeUserLog",
      "discriminator": [
        175,
        239,
        119,
        123,
        254,
        57,
        129,
        245
      ]
    },
    {
      "name": "refreshTokenStakeLog",
      "discriminator": [
        72,
        155,
        111,
        101,
        228,
        125,
        255,
        95
      ]
    },
    {
      "name": "refreshTokenStakeUserLog",
      "discriminator": [
        100,
        14,
        17,
        101,
        26,
        231,
        147,
        98
      ]
    },
    {
      "name": "removeCollateralAndSwapLog",
      "discriminator": [
        19,
        106,
        182,
        174,
        13,
        116,
        176,
        71
      ]
    },
    {
      "name": "removeCollateralAndSwapLogUsDv1",
      "discriminator": [
        57,
        198,
        154,
        210,
        91,
        90,
        58,
        48
      ]
    },
    {
      "name": "removeCollateralLog",
      "discriminator": [
        43,
        111,
        136,
        87,
        50,
        25,
        78,
        169
      ]
    },
    {
      "name": "removeCollateralLogUsDv1",
      "discriminator": [
        186,
        178,
        166,
        45,
        204,
        1,
        41,
        55
      ]
    },
    {
      "name": "removeCollateralLogV2",
      "discriminator": [
        32,
        127,
        111,
        212,
        2,
        19,
        13,
        212
      ]
    },
    {
      "name": "removeCollateralLogV3",
      "discriminator": [
        37,
        51,
        211,
        151,
        242,
        15,
        45,
        196
      ]
    },
    {
      "name": "removeCompoundingLiquidityLog",
      "discriminator": [
        194,
        33,
        50,
        13,
        74,
        29,
        153,
        170
      ]
    },
    {
      "name": "removeLiquidityLog",
      "discriminator": [
        250,
        48,
        139,
        147,
        47,
        0,
        141,
        238
      ]
    },
    {
      "name": "removeLiquidityLogV2",
      "discriminator": [
        63,
        134,
        50,
        16,
        0,
        38,
        55,
        115
      ]
    },
    {
      "name": "setPositionPriceImpactLog",
      "discriminator": [
        193,
        248,
        89,
        21,
        91,
        130,
        254,
        170
      ]
    },
    {
      "name": "setTokenRewardLog",
      "discriminator": [
        175,
        108,
        145,
        18,
        31,
        51,
        136,
        67
      ]
    },
    {
      "name": "settleRebatesLog",
      "discriminator": [
        106,
        34,
        206,
        212,
        60,
        7,
        106,
        87
      ]
    },
    {
      "name": "swapAndAddCollateralLog",
      "discriminator": [
        30,
        181,
        15,
        57,
        79,
        255,
        171,
        108
      ]
    },
    {
      "name": "swapAndAddCollateralLogUsDv1",
      "discriminator": [
        60,
        199,
        127,
        190,
        2,
        94,
        69,
        62
      ]
    },
    {
      "name": "swapAndOpenLog",
      "discriminator": [
        137,
        100,
        126,
        197,
        194,
        89,
        63,
        192
      ]
    },
    {
      "name": "swapAndOpenLogUsDv1",
      "discriminator": [
        193,
        120,
        82,
        15,
        111,
        120,
        72,
        114
      ]
    },
    {
      "name": "swapAndOpenLogV2",
      "discriminator": [
        184,
        7,
        31,
        86,
        30,
        165,
        246,
        214
      ]
    },
    {
      "name": "swapFeeInternalLog",
      "discriminator": [
        144,
        203,
        250,
        47,
        65,
        104,
        9,
        27
      ]
    },
    {
      "name": "swapFeeInternalLogV2",
      "discriminator": [
        148,
        127,
        83,
        99,
        18,
        175,
        81,
        36
      ]
    },
    {
      "name": "swapFeeInternalLogV3",
      "discriminator": [
        1,
        214,
        217,
        111,
        7,
        3,
        165,
        244
      ]
    },
    {
      "name": "swapLog",
      "discriminator": [
        200,
        151,
        62,
        49,
        224,
        50,
        16,
        222
      ]
    },
    {
      "name": "swapLogV2",
      "discriminator": [
        102,
        202,
        211,
        38,
        135,
        65,
        39,
        223
      ]
    },
    {
      "name": "unstakeInstantLog",
      "discriminator": [
        90,
        247,
        157,
        57,
        255,
        73,
        212,
        240
      ]
    },
    {
      "name": "unstakeRequestLog",
      "discriminator": [
        160,
        43,
        111,
        217,
        41,
        24,
        11,
        238
      ]
    },
    {
      "name": "unstakeTokenRequestLog",
      "discriminator": [
        166,
        145,
        163,
        61,
        239,
        58,
        181,
        242
      ]
    },
    {
      "name": "voltagePointsLog",
      "discriminator": [
        40,
        154,
        4,
        169,
        61,
        213,
        164,
        37
      ]
    },
    {
      "name": "withdrawStakeLog",
      "discriminator": [
        67,
        13,
        186,
        221,
        39,
        131,
        140,
        69
      ]
    },
    {
      "name": "withdrawTokenLog",
      "discriminator": [
        100,
        187,
        28,
        21,
        254,
        13,
        160,
        187
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "multisigAccountNotAuthorized",
      "msg": "Account is not authorized to sign this instruction"
    },
    {
      "code": 6001,
      "name": "multisigAlreadySigned",
      "msg": "Account has already signed this instruction"
    },
    {
      "code": 6002,
      "name": "multisigAlreadyExecuted",
      "msg": "This instruction has already been executed"
    },
    {
      "code": 6003,
      "name": "mathOverflow",
      "msg": "Overflow in arithmetic operation"
    },
    {
      "code": 6004,
      "name": "unsupportedOracle",
      "msg": "Unsupported price oracle"
    },
    {
      "code": 6005,
      "name": "invalidOracleAccount",
      "msg": "Invalid oracle account"
    },
    {
      "code": 6006,
      "name": "invalidOracleState",
      "msg": "Invalid oracle state"
    },
    {
      "code": 6007,
      "name": "staleOraclePrice",
      "msg": "Stale oracle price"
    },
    {
      "code": 6008,
      "name": "invalidOraclePrice",
      "msg": "Invalid oracle price"
    },
    {
      "code": 6009,
      "name": "invalidEnvironment",
      "msg": "Instruction is not allowed in production"
    },
    {
      "code": 6010,
      "name": "invalidPoolState",
      "msg": "Invalid pool state"
    },
    {
      "code": 6011,
      "name": "invalidCustodyState",
      "msg": "Invalid custody state"
    },
    {
      "code": 6012,
      "name": "invalidMarketState",
      "msg": "Invalid Market state"
    },
    {
      "code": 6013,
      "name": "invalidCollateralCustody",
      "msg": "Invalid collateral custody"
    },
    {
      "code": 6014,
      "name": "invalidPositionState",
      "msg": "Invalid position state"
    },
    {
      "code": 6015,
      "name": "invalidDispensingCustody",
      "msg": "Invalid Dispensing Custody"
    },
    {
      "code": 6016,
      "name": "invalidPerpetualsConfig",
      "msg": "Invalid perpetuals config"
    },
    {
      "code": 6017,
      "name": "invalidPoolConfig",
      "msg": "Invalid pool config"
    },
    {
      "code": 6018,
      "name": "invalidCustodyConfig",
      "msg": "Invalid custody config"
    },
    {
      "code": 6019,
      "name": "insufficientAmountReturned",
      "msg": "Insufficient token amount returned"
    },
    {
      "code": 6020,
      "name": "maxPriceSlippage",
      "msg": "Price slippage limit exceeded"
    },
    {
      "code": 6021,
      "name": "maxLeverage",
      "msg": "Position leverage limit exceeded"
    },
    {
      "code": 6022,
      "name": "maxInitLeverage",
      "msg": "Position initial leverage limit exceeded"
    },
    {
      "code": 6023,
      "name": "minLeverage",
      "msg": "Position leverage less than minimum"
    },
    {
      "code": 6024,
      "name": "custodyAmountLimit",
      "msg": "Custody amount limit exceeded"
    },
    {
      "code": 6025,
      "name": "positionAmountLimit",
      "msg": "Position amount limit exceeded"
    },
    {
      "code": 6026,
      "name": "tokenRatioOutOfRange",
      "msg": "Token ratio out of range"
    },
    {
      "code": 6027,
      "name": "unsupportedToken",
      "msg": "Token is not supported"
    },
    {
      "code": 6028,
      "name": "unsupportedCustody",
      "msg": "Custody is not supported"
    },
    {
      "code": 6029,
      "name": "unsupportedPool",
      "msg": "Pool is not supported"
    },
    {
      "code": 6030,
      "name": "unsupportedMarket",
      "msg": "Market is not supported"
    },
    {
      "code": 6031,
      "name": "instructionNotAllowed",
      "msg": "Instruction is not allowed at this time"
    },
    {
      "code": 6032,
      "name": "maxUtilization",
      "msg": "Token utilization limit exceeded"
    },
    {
      "code": 6033,
      "name": "closeOnlyMode",
      "msg": "Close-only mode activated"
    },
    {
      "code": 6034,
      "name": "minCollateral",
      "msg": "Minimum collateral limit breached"
    },
    {
      "code": 6035,
      "name": "permissionlessOracleMissingSignature",
      "msg": "Permissionless oracle update must be preceded by Ed25519 signature verification instruction"
    },
    {
      "code": 6036,
      "name": "permissionlessOracleMalformedEd25519Data",
      "msg": "Ed25519 signature verification data does not match expected format"
    },
    {
      "code": 6037,
      "name": "permissionlessOracleSignerMismatch",
      "msg": "Ed25519 signature was not signed by the oracle authority"
    },
    {
      "code": 6038,
      "name": "permissionlessOracleMessageMismatch",
      "msg": "Signed message does not match instruction params"
    },
    {
      "code": 6039,
      "name": "exponentMismatch",
      "msg": "Exponent Mismatch betweeen operands"
    },
    {
      "code": 6040,
      "name": "closeRatio",
      "msg": "Invalid Close Ratio"
    },
    {
      "code": 6041,
      "name": "insufficientStakeAmount",
      "msg": "Insufficient LP tokens staked"
    },
    {
      "code": 6042,
      "name": "invalidFeeDeltas",
      "msg": "Invalid Fee Deltas"
    },
    {
      "code": 6043,
      "name": "invalidFeeDistributionCustody",
      "msg": "Invalid Fee Distrivution Custody"
    },
    {
      "code": 6044,
      "name": "invalidCollection",
      "msg": "Invalid Collection"
    },
    {
      "code": 6045,
      "name": "invalidOwner",
      "msg": "Owner of Token Account does not match"
    },
    {
      "code": 6046,
      "name": "invalidAccess",
      "msg": "Only nft holders or referred users can trade"
    },
    {
      "code": 6047,
      "name": "tokenStakeAccountMismatch",
      "msg": "Token Stake account doesnot match referral account"
    },
    {
      "code": 6048,
      "name": "maxDepostsReached",
      "msg": "Max deposits reached"
    },
    {
      "code": 6049,
      "name": "invalidStopLossPrice",
      "msg": "Invalid Stop Loss price"
    },
    {
      "code": 6050,
      "name": "invalidTakeProfitPrice",
      "msg": "Invalid Take Profit price"
    },
    {
      "code": 6051,
      "name": "exposureLimitExceeded",
      "msg": "Max exposure limit exceeded for the market"
    },
    {
      "code": 6052,
      "name": "maxStopLossOrders",
      "msg": "Stop Loss limit exhausted"
    },
    {
      "code": 6053,
      "name": "maxTakeProfitOrders",
      "msg": "Take Profit limit exhausted"
    },
    {
      "code": 6054,
      "name": "maxOpenOrder",
      "msg": "Open order limit exhausted"
    },
    {
      "code": 6055,
      "name": "invalidOrder",
      "msg": "Invalid Order"
    },
    {
      "code": 6056,
      "name": "invalidLimitPrice",
      "msg": "Invalid Limit price"
    },
    {
      "code": 6057,
      "name": "minReserve",
      "msg": "Minimum reserve limit breached"
    },
    {
      "code": 6058,
      "name": "maxWithdrawTokenRequest",
      "msg": "Withdraw Token Request limit exhausted"
    },
    {
      "code": 6059,
      "name": "invalidRewardDistribution",
      "msg": "Invalid Reward Distribution"
    },
    {
      "code": 6060,
      "name": "lpPriceOutOfBounds",
      "msg": "Liquidity Token price is out of bounds"
    },
    {
      "code": 6061,
      "name": "insufficientRebateReserves",
      "msg": "Insufficient rebate reserves"
    },
    {
      "code": 6062,
      "name": "oraclePenaltyAlreadySet",
      "msg": "Oracle penalty already set on this position"
    },
    {
      "code": 6063,
      "name": "invalidLazerMessage",
      "msg": "Invalid Lazer message"
    },
    {
      "code": 6064,
      "name": "invalidLazerPayload",
      "msg": "Invalid Lazer payload"
    },
    {
      "code": 6065,
      "name": "invalidLazerChannel",
      "msg": "Invalid Lazer channel"
    },
    {
      "code": 6066,
      "name": "invalidLazerTimestamp",
      "msg": "Invalid Lazer timestamp"
    },
    {
      "code": 6067,
      "name": "invalidWithdrawal",
      "msg": "Invalid amount for withdrawal"
    },
    {
      "code": 6068,
      "name": "invalidWithdrawRequestId",
      "msg": "Invalid withdraw request ID"
    }
  ],
  "types": [
    {
      "name": "addCollateralLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "addCollateralLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
            "type": "u64"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "addCollateralLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "addCollateralLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
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
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "addCollateralParams",
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
      "name": "addCompoundingLiquidityLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "compoundingAmountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "compoundingPriceUsd",
            "type": "u64"
          },
          {
            "name": "tokenInPrice",
            "type": "u64"
          },
          {
            "name": "tokenInPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "addCompoundingLiquidityParams",
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
      "name": "addCustodyParams",
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
            "name": "inversePrice",
            "type": "bool"
          },
          {
            "name": "token22",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": {
                "name": "oracleParams"
              }
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": {
                "name": "pricingParams"
              }
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": {
                "name": "borrowRateParams"
              }
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": {
                  "name": "tokenRatios"
                }
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
          }
        ]
      }
    },
    {
      "name": "addCustodyToken22AccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenAccountSpace",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "addInternalOracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expo",
            "type": "i32"
          },
          {
            "name": "lazerFeedId",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "addLiquidityAndStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "lpAmountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "lpPriceUsd",
            "type": "u64"
          },
          {
            "name": "tokenInPrice",
            "type": "u64"
          },
          {
            "name": "tokenInPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "addLiquidityAndStakeParams",
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
      "name": "addLiquidityLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "lpAmountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "addLiquidityLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "lpAmountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "lpPriceUsd",
            "type": "u64"
          },
          {
            "name": "tokenInPrice",
            "type": "u64"
          },
          {
            "name": "tokenInPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "addLiquidityParams",
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
      "name": "addMarketParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "side"
              }
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
              "defined": {
                "name": "marketPermissions"
              }
            }
          }
        ]
      }
    },
    {
      "name": "addPoolParams",
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
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "maxAumUsd",
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
          },
          {
            "name": "thresholdUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "amountAndFee",
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
      "name": "assets",
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
      "name": "borrowRateParams",
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
      "name": "borrowRateState",
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
      "name": "burnAndClaimLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "burnAndStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "nftMint",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "cancelLimitOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
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
            "name": "reservePrice",
            "type": "u64"
          },
          {
            "name": "reservePriceExponent",
            "type": "i32"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "reserveUsd",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": "u64"
          },
          {
            "name": "stopLossPriceExponent",
            "type": "i32"
          },
          {
            "name": "takeProfitPrice",
            "type": "u64"
          },
          {
            "name": "takeProfitPriceExponent",
            "type": "i32"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "cancelTriggerOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "receiveCustodyUid",
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
      "name": "cancelTriggerOrderParams",
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
      "name": "cancelUnstakeTokenRequestLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "cancelUnstakeTokenRequestParams",
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
      "name": "closeAndSwapLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralAmount",
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "exitFeeAmount",
            "type": "u64"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u64"
          },
          {
            "name": "receiveAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "closeAndSwapLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
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
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "exitFeeUsd",
            "type": "u64"
          },
          {
            "name": "outputCustodyUid",
            "type": "u8"
          },
          {
            "name": "outputAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "priceImpactUsd",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "closeAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "privilege",
            "type": {
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "closePositionLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "priceUsd",
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
            "name": "profitUsd",
            "type": "u64"
          },
          {
            "name": "lossUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "closePositionLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
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
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "exitFeeUsd",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "priceImpactUsd",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "closePositionLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
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
            "name": "profitUsd",
            "type": "u64"
          },
          {
            "name": "lossUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "closePositionLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralAmount",
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "exitFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "closePositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "privilege",
            "type": {
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "collectRebateLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "rebateAmount",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "collectRevenueLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "revenueAmount",
            "type": "u64"
          },
          {
            "name": "lastEpochCount",
            "type": "u32"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "collectRevenueParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "collectStakeRewardLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "rewardMint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "collectStakeRewardLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "rewardMint",
            "type": "pubkey"
          },
          {
            "name": "rewardShare",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "collectStakeRewardParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "collectTokenRewardLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lastEpochCount",
            "type": "u32"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "collectTokenRewardParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "compoundFeesParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "compoundingFeesLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "rewardLpAmount",
            "type": "u64"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "lpPriceUsd",
            "type": "u64"
          },
          {
            "name": "compoundingPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "compoundingStats",
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
      "name": "compoundingTokenData",
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
      "name": "createReferralParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "createWhitelistParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isSwapFeeExempt",
            "type": "bool"
          },
          {
            "name": "isDepositFeeExempt",
            "type": "bool"
          },
          {
            "name": "isWithdrawalFeeExempt",
            "type": "bool"
          },
          {
            "name": "poolAddress",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "custody",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "tokenAccount",
            "type": "pubkey"
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
            "name": "inversePrice",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": {
                "name": "oracleParams"
              }
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": {
                "name": "pricingParams"
              }
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": {
                "name": "borrowRateParams"
              }
            }
          },
          {
            "name": "rewardThreshold",
            "type": "u64"
          },
          {
            "name": "assets",
            "type": {
              "defined": {
                "name": "assets"
              }
            }
          },
          {
            "name": "feesStats",
            "type": {
              "defined": {
                "name": "feesStats"
              }
            }
          },
          {
            "name": "borrowRateState",
            "type": {
              "defined": {
                "name": "borrowRateState"
              }
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
          },
          {
            "name": "lazerFeedId",
            "type": "u32"
          },
          {
            "name": "lazerPrice",
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "decreaseSizeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "priceUsd",
            "type": "u64"
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "sizeDeltaUsd",
            "type": "u64"
          },
          {
            "name": "settledReturns",
            "type": "u64"
          },
          {
            "name": "deltaProfitUsd",
            "type": "u64"
          },
          {
            "name": "deltaLossUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "decreaseSizeLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "exitFeeUsd",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "priceImpactUsd",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "decreaseSizeLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "sizeDeltaUsd",
            "type": "u64"
          },
          {
            "name": "settledReturns",
            "type": "u64"
          },
          {
            "name": "deltaProfitUsd",
            "type": "u64"
          },
          {
            "name": "deltaLossUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "decreaseSizeLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "exitFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "decreaseSizeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "depositStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "lpTokens",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "depositStakeParams",
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
      "name": "depositTokenStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "depositTokenStakeParams",
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
      "name": "distributeTokenRewardLog",
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
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "distributeTokenRewardParams",
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
      "name": "editLimitOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
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
            "name": "reservePrice",
            "type": "u64"
          },
          {
            "name": "reservePriceExponent",
            "type": "i32"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "reserveUsd",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": "u64"
          },
          {
            "name": "stopLossPriceExponent",
            "type": "i32"
          },
          {
            "name": "takeProfitPrice",
            "type": "u64"
          },
          {
            "name": "takeProfitPriceExponent",
            "type": "i32"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "editLimitOrderParams",
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
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "editTriggerOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
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
            "name": "receiveCustodyUid",
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
      "name": "editTriggerOrderParams",
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
              "defined": {
                "name": "oraclePrice"
              }
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
      "name": "executeLimitOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "executeLimitOrderLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
            "type": "u64"
          },
          {
            "name": "deltaCollateralUsd",
            "type": "u64"
          },
          {
            "name": "finalCollateralUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
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
      "name": "executeLimitOrderLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
          },
          {
            "name": "feeRebateUsdAmount",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "executeLimitOrderParams",
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
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "executeLimitWithSwapLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "reserveCustodyUid",
            "type": "u64"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "executeLimitWithSwapLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
            "type": "u64"
          },
          {
            "name": "reserveCustodyUid",
            "type": "u8"
          },
          {
            "name": "reservePrice",
            "type": "u64"
          },
          {
            "name": "reservePriceExponent",
            "type": "i32"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "deltaCollateralUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
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
      "name": "executeLimitWithSwapLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "reserveCustodyUid",
            "type": "u64"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "executeLimitWithSwapParams",
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
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "executeTriggerOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralAmount",
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "exitFeeAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "triggerPrice",
            "type": "u64"
          },
          {
            "name": "triggerPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "executeTriggerOrderLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "exitFeeUsd",
            "type": "u64"
          },
          {
            "name": "outAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "triggerPrice",
            "type": "u64"
          },
          {
            "name": "triggerPriceExponent",
            "type": "i32"
          },
          {
            "name": "priceImpactUsd",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "executeTriggerOrderParams",
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
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "executeTriggerWithSwapLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralAmount",
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "exitFeeAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u64"
          },
          {
            "name": "receiveAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "triggerPrice",
            "type": "u64"
          },
          {
            "name": "triggerPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "executeTriggerWithSwapLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "exitFeeUsd",
            "type": "u64"
          },
          {
            "name": "outCustodyUid",
            "type": "u8"
          },
          {
            "name": "outAmount",
            "type": "u64"
          },
          {
            "name": "isStopLoss",
            "type": "bool"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "triggerPrice",
            "type": "u64"
          },
          {
            "name": "triggerPriceExponent",
            "type": "i32"
          },
          {
            "name": "priceImpactUsd",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "executeTriggerWithSwapParams",
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
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "fees",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mode",
            "type": {
              "defined": {
                "name": "feesMode"
              }
            }
          },
          {
            "name": "swapIn",
            "type": {
              "defined": {
                "name": "ratioFees"
              }
            }
          },
          {
            "name": "swapOut",
            "type": {
              "defined": {
                "name": "ratioFees"
              }
            }
          },
          {
            "name": "stableSwapIn",
            "type": {
              "defined": {
                "name": "ratioFees"
              }
            }
          },
          {
            "name": "stableSwapOut",
            "type": {
              "defined": {
                "name": "ratioFees"
              }
            }
          },
          {
            "name": "addLiquidity",
            "type": {
              "defined": {
                "name": "ratioFees"
              }
            }
          },
          {
            "name": "removeLiquidity",
            "type": {
              "defined": {
                "name": "ratioFees"
              }
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
      "name": "feesMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "fixed"
          },
          {
            "name": "linear"
          }
        ]
      }
    },
    {
      "name": "feesStats",
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
      "name": "flpStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "stakeStats",
            "type": {
              "defined": {
                "name": "stakeStats"
              }
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
      "name": "getAddLiquidityAmountAndFeeParams",
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
      "name": "getAssetsUnderManagementParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getCompoundingTokenDataParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getCompoundingTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getEntryPriceAndFeeParams",
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
              "defined": {
                "name": "side"
              }
            }
          }
        ]
      }
    },
    {
      "name": "getExitPriceAndFeeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getLiquidationPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getLiquidationStateParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getLpTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getOraclePriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getPnlParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getPositionDataParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "getRemoveCompoundingLiquidityAmountAndFeeParams",
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
      "name": "getRemoveLiquidityAmountAndFeeParams",
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
      "name": "getSwapAmountAndFeesParams",
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
      "name": "increaseSizeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "priceUsd",
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
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "increaseSizeLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "finalCollateralUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "isDegen",
            "type": "bool"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "increaseSizeLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
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
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "increaseSizeLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "finalCollateralAmount",
            "type": "u64"
          },
          {
            "name": "finalCollateralUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "increaseSizeLogV4",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaSizeAmount",
            "type": "u64"
          },
          {
            "name": "deltaSizeUsd",
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
            "name": "finalCollateralAmount",
            "type": "u64"
          },
          {
            "name": "finalCollateralUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "isDegen",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                31
              ]
            }
          }
        ]
      }
    },
    {
      "name": "increaseSizeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "sizeDelta",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "initCompoundingParams",
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
      "name": "initParams",
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
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": {
                "name": "voltageMultiplier"
              }
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
      "name": "initRebateVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "allowRebatePayout",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "initRevenueTokenAccountParams",
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
      "name": "initStakingParams",
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
      "name": "initTokenVaultParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPermissions",
            "type": {
              "defined": {
                "name": "tokenPermissions"
              }
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
      "name": "internalEmaPrice",
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
      "name": "internalPrice",
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
      "name": "limitOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "limitPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
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
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "liquidateLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "priceUsd",
            "type": "u64"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidateLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
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
            "name": "penaltyUsd",
            "type": "u64"
          },
          {
            "name": "exitFeeUsd",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "liquidateLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
          },
          {
            "name": "sizeUsd",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidateLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "exitPrice",
            "type": "u64"
          },
          {
            "name": "exitPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralAmount",
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "exitFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "liquidateParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool",
            "type": "pubkey"
          },
          {
            "name": "targetCustody",
            "type": "pubkey"
          },
          {
            "name": "collateralCustody",
            "type": "pubkey"
          },
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "side"
              }
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
              "defined": {
                "name": "marketPermissions"
              }
            }
          },
          {
            "name": "degenExposureUsd",
            "type": "u64"
          },
          {
            "name": "collectivePosition",
            "type": {
              "defined": {
                "name": "positionStats"
              }
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
      "name": "marketPermissions",
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
      "name": "migrateFlpLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lpAmountOut",
            "type": "u64"
          },
          {
            "name": "rewardLpAmount",
            "type": "u64"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "lpPriceUsd",
            "type": "u64"
          },
          {
            "name": "compoundingPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "migrateFlpParams",
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
      "name": "migratePositionLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "position",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "migrateStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "compoundingAmountOut",
            "type": "u64"
          },
          {
            "name": "poolLpAmount",
            "type": "u64"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "lpPriceUsd",
            "type": "u64"
          },
          {
            "name": "compoundingPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "migrateStakeParams",
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
      "name": "moveProtocolFeesLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "revenueAmount",
            "type": "u64"
          },
          {
            "name": "protocolFee",
            "type": "u64"
          },
          {
            "name": "revenueFeeShare",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "multisig",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c",
        "packed": true
      },
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
                "pubkey",
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
      "name": "newPositionPricesAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entryPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "feeUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "openPositionLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "priceUsd",
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
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "openPositionLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "inputAmount",
            "type": "u64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "isDegen",
            "type": "bool"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "openPositionLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
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
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "openPositionLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "openPositionLogV4",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "isDegen",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                31
              ]
            }
          }
        ]
      }
    },
    {
      "name": "openPositionParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
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
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "oracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "intOracleAccount",
            "type": "pubkey"
          },
          {
            "name": "extOracleAccount",
            "type": "pubkey"
          },
          {
            "name": "oracleType",
            "type": {
              "defined": {
                "name": "oracleType"
              }
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
      "name": "oraclePrice",
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
      "name": "oracleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "custom"
          },
          {
            "name": "pyth"
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
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "limitOrders",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "limitOrder"
                  }
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
                  "defined": {
                    "name": "triggerOrder"
                  }
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
                  "defined": {
                    "name": "triggerOrder"
                  }
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
            "name": "referenceTimestamp",
            "type": "i64"
          },
          {
            "name": "executionCount",
            "type": "u64"
          },
          {
            "name": "padding",
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
      "name": "permissions",
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
      "name": "perpetuals",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "pools",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "collections",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "voltageMultiplier",
            "type": {
              "defined": {
                "name": "voltageMultiplier"
              }
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
            "type": "u8"
          },
          {
            "name": "triggerOrderLimit",
            "type": "u8"
          },
          {
            "name": "rebateLimitUsd",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "placeLimitOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "limitPrice",
            "type": "u64"
          },
          {
            "name": "limitPriceExponent",
            "type": "i32"
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
            "name": "reservePrice",
            "type": "u64"
          },
          {
            "name": "reservePriceExponent",
            "type": "i32"
          },
          {
            "name": "reserveAmount",
            "type": "u64"
          },
          {
            "name": "reserveUsd",
            "type": "u64"
          },
          {
            "name": "stopLossPrice",
            "type": "u64"
          },
          {
            "name": "stopLossPriceExponent",
            "type": "i32"
          },
          {
            "name": "takeProfitPrice",
            "type": "u64"
          },
          {
            "name": "takeProfitPriceExponent",
            "type": "i32"
          },
          {
            "name": "receiveCustodyUid",
            "type": "u8"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "placeLimitOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "limitPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
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
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "takeProfitPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "placeTriggerOrderLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "priceExponent",
            "type": "i32"
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
            "name": "receiveCustodyUid",
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
      "name": "placeTriggerOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "triggerPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
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
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "inceptionTime",
            "type": "i64"
          },
          {
            "name": "lpMint",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "stakedLpVault",
            "type": "pubkey"
          },
          {
            "name": "rewardCustody",
            "type": "pubkey"
          },
          {
            "name": "custodies",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": {
                  "name": "tokenRatios"
                }
              }
            }
          },
          {
            "name": "markets",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "maxAumUsd",
            "type": "u64"
          },
          {
            "name": "buffer",
            "type": "u64"
          },
          {
            "name": "rawAumUsd",
            "type": "u64"
          },
          {
            "name": "equityUsd",
            "type": "u64"
          },
          {
            "name": "totalStaked",
            "type": {
              "defined": {
                "name": "stakeStats"
              }
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
            "type": "pubkey"
          },
          {
            "name": "compoundingLpVault",
            "type": "pubkey"
          },
          {
            "name": "compoundingStats",
            "type": {
              "defined": {
                "name": "compoundingStats"
              }
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
            "name": "feesObligationUsd",
            "type": "u64"
          },
          {
            "name": "rebateObligationUsd",
            "type": "u64"
          },
          {
            "name": "thresholdUsd",
            "type": "u64"
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
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "delegate",
            "type": "pubkey"
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
              "defined": {
                "name": "oraclePrice"
              }
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
            "name": "priceImpactUsd",
            "type": "u64"
          },
          {
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "unsettledValueUsd",
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
            "name": "degenSizeUsd",
            "type": "u64"
          },
          {
            "name": "referencePrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "priceImpactSet",
            "type": "u8"
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
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "positionData",
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
              "defined": {
                "name": "oraclePrice"
              }
            }
          }
        ]
      }
    },
    {
      "name": "positionStats",
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
              "defined": {
                "name": "oraclePrice"
              }
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
            "name": "collateralLiabilityUsd",
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
      "name": "priceAndFee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "price",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "feeUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pricingParams",
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
            "name": "minInitLeverage",
            "type": "u32"
          },
          {
            "name": "minInitDegenLeverage",
            "type": "u32"
          },
          {
            "name": "maxInitLeverage",
            "type": "u32"
          },
          {
            "name": "maxInitDegenLeverage",
            "type": "u32"
          },
          {
            "name": "maxLeverage",
            "type": "u32"
          },
          {
            "name": "maxDegenLeverage",
            "type": "u32"
          },
          {
            "name": "minCollateralUsd",
            "type": "u32"
          },
          {
            "name": "minDegenCollateralUsd",
            "type": "u32"
          },
          {
            "name": "delaySeconds",
            "type": "i64"
          },
          {
            "name": "maxUtilization",
            "type": "u32"
          },
          {
            "name": "degenPositionFactor",
            "type": "u16"
          },
          {
            "name": "degenExposureFactor",
            "type": "u16"
          },
          {
            "name": "maxPositionSizeUsd",
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
      "name": "privilege",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "stake"
          },
          {
            "name": "referral"
          }
        ]
      }
    },
    {
      "name": "profitAndLoss",
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
      "name": "protocolVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "pubkey"
          },
          {
            "name": "tokenAccount",
            "type": "pubkey"
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
      "name": "ratioFees",
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
      "name": "rebateVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "pubkey"
          },
          {
            "name": "tokenAccount",
            "type": "pubkey"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "allowPayout",
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
            "name": "availableUsd",
            "type": "u64"
          },
          {
            "name": "availableAmount",
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
            "type": "pubkey"
          },
          {
            "name": "refererBoosterAccount",
            "type": "pubkey"
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
      "name": "referralRebateLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "volumeUsd",
            "type": "u64"
          },
          {
            "name": "voltagePointsType",
            "type": "u8"
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
      "name": "refreshStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "refreshStakeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "refreshStakeUserLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "rewardMint",
            "type": "pubkey"
          },
          {
            "name": "rewardShare",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "refreshTokenStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "revenuePerFafStaked",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "refreshTokenStakeParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "refreshTokenStakeUserLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "revenueAmount",
            "type": "u64"
          },
          {
            "name": "newlyUnlockedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "reimburseParams",
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
      "name": "removeCollateralAndSwapLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
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
            "name": "receiveCustodyUid",
            "type": "u64"
          },
          {
            "name": "receiveAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "removeCollateralAndSwapLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "receiveCustodyUid",
            "type": "u8"
          },
          {
            "name": "receiveAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "removeCollateralAndSwapParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDeltaUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "removeCollateralLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralPriceUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "removeCollateralLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "receiveAmount",
            "type": "u64"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "removeCollateralLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "removeCollateralLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
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
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "removeCollateralParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralDeltaUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "removeCompoundingLiquidityLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "compoundingAmountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          },
          {
            "name": "compoundingPriceUsd",
            "type": "u64"
          },
          {
            "name": "tokenOutPrice",
            "type": "u64"
          },
          {
            "name": "tokenOutPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "removeCompoundingLiquidityParams",
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
      "name": "removeCustodyParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": {
                  "name": "tokenRatios"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "removeLiquidityLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "lpAmountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "removeLiquidityLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyUid",
            "type": "u64"
          },
          {
            "name": "lpAmountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "lpPriceUsd",
            "type": "u64"
          },
          {
            "name": "tokenOutPrice",
            "type": "u64"
          },
          {
            "name": "tokenOutPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "removeLiquidityParams",
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
      "name": "removeMarketParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "removePoolParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "renameFlpParams",
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
      "name": "resizeInternalOracleParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lazerFeedId",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "setAdminSignersParams",
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
      "name": "setCustodyConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depegAdjustment",
            "type": "bool"
          },
          {
            "name": "inversePrice",
            "type": "bool"
          },
          {
            "name": "oracle",
            "type": {
              "defined": {
                "name": "oracleParams"
              }
            }
          },
          {
            "name": "pricing",
            "type": {
              "defined": {
                "name": "pricingParams"
              }
            }
          },
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "fees",
            "type": {
              "defined": {
                "name": "fees"
              }
            }
          },
          {
            "name": "borrowRate",
            "type": {
              "defined": {
                "name": "borrowRateParams"
              }
            }
          },
          {
            "name": "ratios",
            "type": {
              "vec": {
                "defined": {
                  "name": "tokenRatios"
                }
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
      "name": "setCustomOraclePriceParams",
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
      "name": "setFeeShareParams",
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
      "name": "setInternalCurrentPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "useCurrentTime",
            "type": "u8"
          },
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": {
                  "name": "internalPrice"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "setInternalEmaPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": {
                  "name": "internalEmaPrice"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "setInternalLazerPriceParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "messageData",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "setLpTokenPriceParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "setMarketConfigParams",
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
              "defined": {
                "name": "marketPermissions"
              }
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
      "name": "setPermissionsParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          }
        ]
      }
    },
    {
      "name": "setPerpetualsConfigParams",
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
              "defined": {
                "name": "voltageMultiplier"
              }
            }
          },
          {
            "name": "tradeLimit",
            "type": "u8"
          },
          {
            "name": "triggerOrderLimit",
            "type": "u8"
          },
          {
            "name": "rebateLimitUsd",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "setPoolConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "maxAumUsd",
            "type": "u64"
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
          },
          {
            "name": "thresholdUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "setPositionPriceImpactLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "position",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "priceImpactUsd",
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
      "name": "setPositionPriceImpactParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceImpactUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "setProtocolFeeShareParams",
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
      "name": "setTestTimeParams",
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
      "name": "setTokenRewardLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "epochCount",
            "type": "u32"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "setTokenRewardParams",
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
      "name": "setTokenStakeLevelParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "init",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "setTokenVaultConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenPermissions",
            "type": {
              "defined": {
                "name": "tokenPermissions"
              }
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
          },
          {
            "name": "unlockPeriod",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "setWhitelistConfigParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isSwapFeeExempt",
            "type": "bool"
          },
          {
            "name": "isDepositFeeExempt",
            "type": "bool"
          },
          {
            "name": "isWithdrawalFeeExempt",
            "type": "bool"
          },
          {
            "name": "poolAddress",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "settleRebatesLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "rebateAmount",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "long"
          },
          {
            "name": "short"
          }
        ]
      }
    },
    {
      "name": "stakeStats",
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
      "name": "swapAmountAndFees",
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
      "name": "swapAndAddCollateralLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "receivingCustodyUid",
            "type": "u64"
          },
          {
            "name": "receiveAmount",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaCollateralAmount",
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
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "swapAndAddCollateralLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "inputCustodyUid",
            "type": "u8"
          },
          {
            "name": "inputPrice",
            "type": "u64"
          },
          {
            "name": "inputPriceExponent",
            "type": "i32"
          },
          {
            "name": "deltaInputAmount",
            "type": "u64"
          },
          {
            "name": "deltaCollateralUsd",
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
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "swapAndAddCollateralParams",
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
      "name": "swapAndOpenLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "receivingCustodyUid",
            "type": "u64"
          },
          {
            "name": "collateralCustodyUid",
            "type": "u64"
          },
          {
            "name": "targetCustodyUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "swapAmountOut",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
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
            "name": "positionFeeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "receivingOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "receivingOracleAccountType",
            "type": "u8"
          },
          {
            "name": "receivingOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "receivingOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "collateralOracleAccountType",
            "type": "u8"
          },
          {
            "name": "collateralOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "collateralOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "targetOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "targetOracleAccountType",
            "type": "u8"
          },
          {
            "name": "targetOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "targetOracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "swapAndOpenLogUsDv1",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "tradeId",
            "type": "i64"
          },
          {
            "name": "inputCustodyUid",
            "type": "u8"
          },
          {
            "name": "inputPrice",
            "type": "u64"
          },
          {
            "name": "inputPriceExponent",
            "type": "i32"
          },
          {
            "name": "inputAmount",
            "type": "u64"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralUsd",
            "type": "u64"
          },
          {
            "name": "feeUsd",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "discountUsd",
            "type": "u64"
          },
          {
            "name": "entryFeeUsd",
            "type": "u64"
          },
          {
            "name": "isDegen",
            "type": "bool"
          },
          {
            "name": "oracleAccountTime",
            "type": "i64"
          },
          {
            "name": "oracleAccountType",
            "type": "u8"
          },
          {
            "name": "oracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "oracleAccountPriceExponent",
            "type": "i32"
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
      "name": "swapAndOpenLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "receivingCustodyUid",
            "type": "u64"
          },
          {
            "name": "collateralCustodyUid",
            "type": "u64"
          },
          {
            "name": "targetCustodyUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "swapAmountOut",
            "type": "u64"
          },
          {
            "name": "swapFeeAmount",
            "type": "u64"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "entryPrice",
            "type": "u64"
          },
          {
            "name": "entryPriceExponent",
            "type": "i32"
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
            "name": "collateralPrice",
            "type": "u64"
          },
          {
            "name": "collateralPriceExponent",
            "type": "i32"
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
            "name": "positionFeeAmount",
            "type": "u64"
          },
          {
            "name": "feeRebateAmount",
            "type": "u64"
          },
          {
            "name": "entryFeeAmount",
            "type": "u64"
          },
          {
            "name": "receivingOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "receivingOracleAccountType",
            "type": "u8"
          },
          {
            "name": "receivingOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "receivingOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "collateralOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "collateralOracleAccountType",
            "type": "u8"
          },
          {
            "name": "collateralOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "collateralOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "targetOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "targetOracleAccountType",
            "type": "u8"
          },
          {
            "name": "targetOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "targetOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "isDegen",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                31
              ]
            }
          }
        ]
      }
    },
    {
      "name": "swapAndOpenParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "priceWithSlippage",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
            }
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "sizeAmount",
            "type": "u64"
          },
          {
            "name": "privilege",
            "type": {
              "defined": {
                "name": "privilege"
              }
            }
          }
        ]
      }
    },
    {
      "name": "swapFeeInternalLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyInUid",
            "type": "u64"
          },
          {
            "name": "custodyOutUid",
            "type": "u64"
          },
          {
            "name": "swapAmount",
            "type": "u64"
          },
          {
            "name": "rewardCustodyAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "swapFeeInternalLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyInUid",
            "type": "u64"
          },
          {
            "name": "custodyOutUid",
            "type": "u64"
          },
          {
            "name": "swapAmount",
            "type": "u64"
          },
          {
            "name": "rewardCustodyAmount",
            "type": "u64"
          },
          {
            "name": "inOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "inOracleAccountType",
            "type": "u8"
          },
          {
            "name": "inOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "inOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "outOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "outOracleAccountType",
            "type": "u8"
          },
          {
            "name": "outOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "outOracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "swapFeeInternalLogV3",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
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
      "name": "swapFeeInternalParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "swapLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyInUid",
            "type": "u64"
          },
          {
            "name": "custodyOutUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeInAmount",
            "type": "u64"
          },
          {
            "name": "feeOutAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "swapLogV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "custodyInUid",
            "type": "u64"
          },
          {
            "name": "custodyOutUid",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          },
          {
            "name": "amountOut",
            "type": "u64"
          },
          {
            "name": "feeInAmount",
            "type": "u64"
          },
          {
            "name": "feeOutAmount",
            "type": "u64"
          },
          {
            "name": "inOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "inOracleAccountType",
            "type": "u8"
          },
          {
            "name": "inOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "inOracleAccountPriceExponent",
            "type": "i32"
          },
          {
            "name": "outOracleAccountTime",
            "type": "i64"
          },
          {
            "name": "outOracleAccountType",
            "type": "u8"
          },
          {
            "name": "outOracleAccountPrice",
            "type": "u64"
          },
          {
            "name": "outOracleAccountPriceExponent",
            "type": "i32"
          }
        ]
      }
    },
    {
      "name": "swapParams",
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
      "name": "testInitParams",
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
              "defined": {
                "name": "permissions"
              }
            }
          }
        ]
      }
    },
    {
      "name": "tokenPermissions",
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
      "name": "tokenRatios",
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
      "name": "tokenStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
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
                  "defined": {
                    "name": "withdrawRequest"
                  }
                },
                3
              ]
            }
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                "u8",
                8
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
            "name": "claimableRebateUsd",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenStakeStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "activeAmount",
            "type": "u64"
          },
          {
            "name": "withdrawableAmount",
            "type": "u64"
          },
          {
            "name": "buffer",
            "type": "u64"
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
            "type": "pubkey"
          },
          {
            "name": "tokenVaultTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "tokenPermissions",
            "type": {
              "defined": {
                "name": "tokenPermissions"
              }
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
              "defined": {
                "name": "tokenStakeStats"
              }
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
            "name": "unlockPeriod",
            "type": "i64"
          },
          {
            "name": "padding2",
            "type": {
              "array": [
                "u64",
                3
              ]
            }
          }
        ]
      }
    },
    {
      "name": "triggerOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "triggerPrice",
            "type": {
              "defined": {
                "name": "oraclePrice"
              }
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
      "name": "unstakeInstantLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "unstakeAmount",
            "type": "u64"
          },
          {
            "name": "rewardPerLpStaked",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "unstakeInstantParams",
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
      "name": "unstakeRequestLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "unstakeRequestParams",
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
      "name": "unstakeTokenRequestLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "unstakeAmount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "unstakeTokenRequestParams",
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
      "name": "voltageMultiplier",
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
      "name": "voltagePointsLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "voltagePoints",
            "type": "u64"
          },
          {
            "name": "rebateUsd",
            "type": "u64"
          },
          {
            "name": "voltagePointsType",
            "type": "u8"
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
      "name": "whitelist",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
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
            "name": "isSwapFeeExempt",
            "type": "bool"
          },
          {
            "name": "isDepositFeeExempt",
            "type": "bool"
          },
          {
            "name": "isWithdrawalFeeExempt",
            "type": "bool"
          },
          {
            "name": "buffer",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "pool",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "withdrawFeesParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "withdrawInstantFeesParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "withdrawRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawableAmount",
            "type": "u64"
          },
          {
            "name": "lockedAmount",
            "type": "u64"
          },
          {
            "name": "timeRemaining",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "withdrawSolFeesParams",
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
      "name": "withdrawStakeLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "poolName",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "lpTokens",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "withdrawStakeParams",
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
      "name": "withdrawTokenLog",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenStake",
            "type": "pubkey"
          },
          {
            "name": "withdrawAmount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          },
          {
            "name": "lastUpdatedTimestamp",
            "type": "i64"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "activeStakeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "withdrawTokenParams",
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
      "name": "withdrawUnclaimedTokensParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ]
};
