##🥇 Mint tokens for users

Our movie review program is decent, but it's not very web3. Let's add some token minting to it. We'll use the token program to mint tokens for users who review movies and comment on the reviews. We'll also add a UI to allow users to mint tokens for themselves.

### Instructions

1. Set-up your local Solana development environment (you can also use devnet) using the instructions mentioned in the buildspace module.
2. Run `cargo build-bpf` in the root directory to build the BPF programs.
3. Run command `solana program deploy ./target/deploy/movie_review_comments.so` to deploy the program.
4. You will get a Program Id that can be used to communicate with the onchain program.
   
### Setting up client to test the program

1. Navigate to the `client/solana-movie-token-client/` directory and run `npm install` to install the dependencies.
2. Replace the Program Id in the `client/solana-movie-token-client/index.ts` file with the Program Id you got after deploying the program.
3. Run `npm run start` to start the client to initialize the token.
4. Now, navigate to `client/solana-movie-front-end/` directory and run `npm install` to install the dependencies.
5. Replace the Program Id in the `client/solana-movie-front-end/utils/constants.ts` file with the Program Id you got after deploying the program.
6. Run `npm run dev` to start the front-end and Interact with the program to create reviews and add comments to them.