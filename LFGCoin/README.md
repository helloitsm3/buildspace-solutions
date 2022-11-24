## [Shipping Challenge] Mint your own tokens on Solana from scratch 🚀

We will be reimplementing our own token from scratch on solana using the SPL token standard. And we'll add metadata to it using metaplex. We'll try to build each instruction and then add all of them to a single transaction. 



### Install dependencies

```bash
npm install
```

### Running the client

To run the client, run ```npm start```

On-running the client, it should generate a new keypair and airdrop devnet SOL if needed. It will then creates metadata for our token and uploads it to arweave. You can view the your token on solana explorer by using the token mint address.

In this program, I've named my token as LFGCoin. You can change the name of the token  and other metadata in the ```client/src/index.js``` file.



Transaction address - https://explorer.solana.com/tx/4ETF9vDz5e4R2mTtKQBRXZ5K9X5XvULFTp9KgMNXizEieq4v4nz5DMJFSE4rcjM5WRh6nEx9D1BXzv62HeXSP85Y?cluster=devnet

Token Mint address - https://explorer.solana.com/address/BEfQHj3vvhhQsE1iq35fDnPzBUvUFWfDK2LrUGjKjH9?cluster=devnet