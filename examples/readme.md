# Examples 

## Follow these steps to run the examples script:
1. Create a new account
```
solana-keygen new --outfile localPublicKey.json
```
2. Get the public of the newly created account
```
solana-keygen pubkey localPublicKey.json
```
3. Fund the account with some sol
```
solana airdrop 0.2 $(solana-keygen pubkey ./localPublicKey.json)
```
4. duplicate the .env.example to .env
```
cp .env.example .env
```

5. install deps
```
yarn
```
6. Run the script
```
npx ts-node src/index.ts
```