## 🏧 Mint your own tokens on Solana

We will be creating our own token on solana using the SPL token standard. And we'll add metadata to it using metaplex.

### Install dependencies

```bash
npm install
```

### Running the client

To run the client, run ```npm start```

On-running the client, it should generate a new keypair and airdrop devnet SOL if needed. It will then creates metadata for our token and uploads it to arweave. You can view the your token  on solana explorer by using the token mint address.

In this program, I've named my token as MADCoin. You can change the name of the token  and other metadata in the ```client/src/index.js``` file.


