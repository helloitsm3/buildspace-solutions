## 🍭 Candy Machine & the Sugar CLI

Now that we've minted a single NFT, we'll learn how to mint a collection of NFTs. We'll do this using Candy Machine - a Solana program that lets creators bring their assets on chain.

### 🍬 What is a Candy Machine?

Candy Machine is a program that allows you to mint NFTs in batches. It's a great way to mint a collection of NFTs, and it's what we'll be using to mint our collection of dogs.

- Firstly install the Solana CLI  and then install the Candy Machine CLI
- Set up your collection of NFTs in the `assets` folder. The folder structure should look like this:
```
...
|
|── assets
|   |── 0.png
|   |── 0.json
|   |...
|   |── 5.png
|   |── 5.json
|
|── node_modules
|── src
|── package.json
....
```
- I've named my collection of NFTs as `FaithfulDogs`. Each NFT is a dog, and each dog has a unique image and metadata. The metadata is stored in a JSON file, and the image is stored in a JPG file. The name of the image and metadata file should be the same. For example, the metadata for the first NFT is stored in `0.json`, and the image is stored in `0.jpg`. You can change your NFTs as you like, but make sure that the name of the image and metadata file are the same.
  

- Launch your collection using ```sugar launch```

Now that we've launched our collection, let's build a frontend for it to mint NFTs.

### 🍬 Building a frontend for our collection

- Navigate to the `candy-machine-ui` folder and install the dependencies using ```npm install```

- Rename .env.example to .env and replace your Candy Machine ID with yours.

- Run ```npm run start``` to start the frontend.

- Open http://localhost:3000/ in your browser to see the frontend.

- Once you've minted, check out the NFT in your wallet in the collectibles section.

