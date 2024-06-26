# Flash SDK
Client SDK for interacting with FLASH.TRADE's smart-contracts

autogenerated docs : https://flash-trade.github.io/flash-sdk-docs/ 

npm : https://www.npmjs.com/package/flash-sdk 

## Install
```
npm i flash-sdk / yarn add flash-sdk 
```

## Using the SDK

### connect sdk locally 
```
  import { AnchorProvider } from "@coral-xyz/anchor";
  import { ComputeBudgetProgram } from '@solana/web3.js'

  const provider : AnchorProvider = AnchorProvider.local(clusterUrl, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
    skipPreflight: true
  });
  const perpClient = new PerpetualsClient(provider, programId);

  const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1','mainnet-beta')

   <!-- load ALT -->
   await perpClient.loadAddressLookupTable(POOL_CONFIG) 

   <!-- Add Liquidity  -->
    const payTokenSymbol = 'USDC'; // 'SOL' , 'BTC', 'ETH'  
    const { instructions : addLiqInstructions, additionalSigners : addLiqAdditionalSigners } = await perpClient.addLiquidity(
              payTokenSymbol,
              tokenAmountIn,
              minLpAmountOut, // new BN(0)
              POOL_CONFIG
          )
        const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 })

    const txid =  perpClient.sendTransaction([setCULimitIx, ...addLiqInstructions ], {
            addLiqAdditionalSigners,
            alts: perpClient.addressLookupTables,
      })



  <!-- remove Liquidity  -->
    const recieveTokenSymbol = 'USDC'; // 'SOL' , 'BTC', 'ETH'  
    const { instructions : removeLiqInstructions, additionalSigners : removeLiqAdditionalSigners } = await  await perpClient.removeLiquidity(
            recieveTokenSymbol,
            lpAmountIn,
            minTokenAmountOut, // new BN(0)
            POOL_CONFIG
       )
      const setCULimitIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 600_000 })
    const txid =  perpClient.sendTransaction([setCULimitIx, ...removeLiqInstructions ], {
            removeLiqAdditionalSigners,
            alts: perpClient.addressLookupTables,
      })



    <!-- to STAKE FLP.1 -->
    const { instructions: depositStakeInstructions, additionalSigners: depositStakeAdditionalSigners } =
              await perpClient.depositStake(.provider.wallet.publicKey, provider.wallet.publicKey, flpDepositAmount, POOL_CONFIG)

    const txid =  perpClient.sendTransaction([...depositStakeInstructions ], {
            depositStakeAdditionalSigners,
            alts: perpClient.addressLookupTables,
      })




  <!-- to STAKE FLP.1 -->
  const { instructions: depositStakeInstructions, additionalSigners: depositStakeAdditionalSigners } =
              await perpClient.depositStake(.provider.wallet.publicKey, provider.wallet.publicKey, flpDepositAmount, POOL_CONFIG)

    const txid =  perpClient.sendTransaction([...depositStakeInstructions ], {
            depositStakeAdditionalSigners,
            alts: perpClient.addressLookupTables,
      })



  <!-- to UN-STAKE FLP.1 -->

   const { instructions: unstakeInstantInstructions, additionalSigners : unstakeInstantAdditionalSigners } = await perpClient.unstakeInstant('USDC',flpUnstakeAmount,POOL_CONFIG)

  const { instructions: withdrawStakeInstructions } = await perpClient.withdrawStake(POOL_CONFIG, false)

  const txid =  perpClient.sendTransaction([...unstakeInstantInstructions, ...withdrawStakeInstructions ], {
          unstakeInstantAdditionalSigners,
          alts: perpClient.addressLookupTables,
    })



  <!-- collect fees -->

    const { instructions, additionalSigners } = await perpClient.collectStakeFees('USDC',POOL_CONFIG)

    const txid =  perpClient.sendTransaction([...instructions ], {
              additionalSigners,
              alts: perpClient.addressLookupTables,
        })
  
  
```
#### For generating docs run ```yarn run doc ```
