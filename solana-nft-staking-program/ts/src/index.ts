import { initializeKeypair } from "./utils/initializeKeypair";
import * as web3 from "@solana/web3.js";
import {
  bundlrStorage,
  CreateNftOutput,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";
import {
  createInitializeStakeAccountInstruction,
  createRedeemInstruction,
  createStakingInstruction,
  createUnstakeInstruction,
} from "./utils/instructions";
import { createNft } from "./utils/setup";
import { PROGRAM_ID } from "./utils/constants";
import { getStakeAccount } from "./utils/accounts";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

async function testInitializeStakeAccount(
  connection: web3.Connection,
  keypair: web3.Keypair,
  nft: CreateNftOutput
) {
  console.log("nft created");
  const createStakeAccount = createInitializeStakeAccountInstruction(
    keypair.publicKey,
    nft.tokenAddress,
    PROGRAM_ID
  );

  const transaction = new web3.Transaction();
  transaction.add(createStakeAccount);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
  );
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  const stakeAccount = await getStakeAccount(
    connection,
    keypair.publicKey,
    nft.tokenAddress
  );
  console.log("stake account after initialization:", stakeAccount);
}

async function testStaking(
  connection: web3.Connection,
  keypair: web3.Keypair,
  nft: CreateNftOutput
) {
  const stakeInstruction = createStakingInstruction(
    keypair.publicKey,
    nft.tokenAddress,
    nft.mintAddress,
    nft.masterEditionAddress,
    TOKEN_PROGRAM_ID,
    METADATA_PROGRAM_ID,
    PROGRAM_ID
  );

  const transaction = new web3.Transaction();
  transaction.add(stakeInstruction);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
  );
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  const stakeAccount = await getStakeAccount(
    connection,
    keypair.publicKey,
    nft.tokenAddress
  );
  console.log("stake account after staking:", stakeAccount);
}

async function testRedeem(
  connection: web3.Connection,
  keypair: web3.Keypair,
  nft: CreateNftOutput,
  stakeMint: web3.PublicKey,
  userStakeATA: web3.PublicKey
) {
  const redeemInstruction = createRedeemInstruction(
    keypair.publicKey,
    nft.tokenAddress,
    stakeMint,
    userStakeATA,
    TOKEN_PROGRAM_ID,
    PROGRAM_ID
  );

  const transaction = new web3.Transaction();
  transaction.add(redeemInstruction);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
  );
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  const stakeAccount = await getStakeAccount(
    connection,
    keypair.publicKey,
    nft.tokenAddress
  );
  console.log("stake account after redeeming:", stakeAccount);
}

async function testUnstaking(
  connection: web3.Connection,
  keypair: web3.Keypair,
  nft: CreateNftOutput,
  stakeMint: web3.PublicKey,
  userStakeATA: web3.PublicKey
) {
  const unstakeInstruction = createUnstakeInstruction(
    keypair.publicKey,
    nft.tokenAddress,
    nft.mintAddress,
    nft.masterEditionAddress,
    stakeMint,
    userStakeATA,
    TOKEN_PROGRAM_ID,
    METADATA_PROGRAM_ID,
    PROGRAM_ID
  );

  const transaction = new web3.Transaction();
  transaction.add(unstakeInstruction);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
  );
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);

  const stakeAccount = await getStakeAccount(
    connection,
    keypair.publicKey,
    nft.tokenAddress
  );
  console.log("stake account after unstaking:", stakeAccount);
}

async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const user = await initializeKeypair(connection);

  console.log("PublicKey:", user.publicKey.toBase58());

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(user))
    .use(bundlrStorage());
  const nft = await createNft(metaplex);

  const stakeMint = new web3.PublicKey(
    "F6TWnKEuY2J1BvSzCesJx2j3LZ9YXn5DUBx8kGGZSyRu"
  );

  const userStakeATA = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    stakeMint,
    user.publicKey
  );

  await testInitializeStakeAccount(connection, user, nft);
  await testStaking(connection, user, nft);
  await testRedeem(connection, user, nft, stakeMint, userStakeATA.address);
  await testUnstaking(connection, user, nft, stakeMint, userStakeATA.address);
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
