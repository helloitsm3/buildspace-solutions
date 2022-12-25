## 💲 Build a token minter

We'll be building a NFT staking app that allows users to stake their NFTs and earn rewards in the form of a custom token. We'll be using the token program to mint our custom token and the candy machine to mint our NFTs. We'll also be using the staking program to allow users to stake their NFTs and earn rewards.

### Instructions

1. Set-up your local Solana development environment (you can also use devnet) using the instructions mentioned in the buildspace module.
2. Navigate to `src/` directory and run `cargo build-bpf` to build the program.
3. Run command `solana program deploy ./target/deploy/solana_nft_staking.so` to deploy the program.
4. Now, navigate to `ts/src/` directory and run `npm run start` to test the program.