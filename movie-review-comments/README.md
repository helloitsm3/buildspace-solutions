## 🎥 On-chain Movie Review Program with comments 💬 

This program demonstrates a simple movie review program that allows users to post movie reviews and other users to comment on them. The program stores all the data on chain and is implemented using a set of Rust BPF programs.

### Instructions

1. Set-up your local Solana development environment (you can also use devnet) using the instructions mentioned in the buildspace module.
2. Run `cargo build-bpf` in the root directory to build the BPF programs.
3. Run command `solana program deploy ./target/deploy/movie_review_comments.so` to deploy the program.
4. You will get a Program Id that can be used to communicate with the onchain program.
   
<i style="color:red">*</i> You can use either devnet or local cluster to deploy your program. (I've used devnet to deploy my program)

##### Setting up client to test the program

1. Run `npm install` in the `client` directory to install the dependencies.
2. Replace the Program Id in the `client/utils/constants.ts` file with the Program Id you got after deploying the program.
3. Run `npm run start` to start the client. Open `http://localhost:3000` in your browser to interact with the program.