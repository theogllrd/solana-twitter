# Solana-twitter

## Live Demo: [Solana Twitter](https://remarkable-lebkuchen-ef8fa9.netlify.app/#/)

## Run the app on the localnet 💻

**Make sure you’re on the localnet.**
```sh
solana config set --url localhost
```
**And check your Anchor.toml file.**
```code
17: cluster = "localnet"
```

**Code…**\
Build, deploy and start a local ledger.
```sh
anchor localnet
```
Or
```sh
solana-test-validator
anchor build
anchor deploy
```

**Run the tests.**
```sh
anchor run test
```

**Copy the new IDL to the frontend.**
```sh
anchor run copy-idl
```

**Serve your frontend application locally.**
```sh
npm run serve
```

## Switch to the devnet cluster 📡
```sh
solana config set --url devnet
```

**And update your Anchor.toml file.**
```sh
17: cluster = "devnet"
```
**Airdrop yourself some money if necessary.**
```sh
solana airdrop 5
```

**Build and deploy to devnet.**
```sh
anchor build
anchor deploy
```

**Push your code to the main branch to auto-deploy on Netlify.**
```sh
git push
```
## Source : https://github.com/lorisleiva/solana-twitter
