import * as web3 from "@solana/web3.js";
import * as borsh from "@project-serum/borsh";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

function initializeSignerKeypair(): web3.Keypair {
  if (!process.env.PRIVATE_KEY) {
    console.log("Creating .env file");
    const signer = web3.Keypair.generate();
    fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`);
    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  return keypairFromSecretKey;
}

async function airdropSolIfNeeded(
  signer: web3.Keypair,
  connection: web3.Connection
) {
  const balance = await connection.getBalance(signer.publicKey);
  console.log("Current balance is", balance / web3.LAMPORTS_PER_SOL);
  if (balance < web3.LAMPORTS_PER_SOL) {
    console.log("Airdropping 1 SOL...");
    await connection.requestAirdrop(signer.publicKey, web3.LAMPORTS_PER_SOL);
  }
}

const movieInstructionLayout = borsh.struct([
  borsh.u8("variant"),
  borsh.str("title"),
  borsh.u8("rating"),
  borsh.str("description"),
]);

async function sendTestMovieReview(
  signer: web3.Keypair,
  programId: web3.PublicKey,
  connection: web3.Connection
) {
  let buffer = Buffer.alloc(1000);
  const movieTitle = `Inception${Math.random() * 1000000}`;
  movieInstructionLayout.encode(
    {
      variant: 0,
      title: movieTitle,
      rating: 5,
      description: "A mind-blowing movie",
    },
    buffer
  );

  buffer = buffer.slice(0, movieInstructionLayout.getSpan(buffer));

  const [pda] = await web3.PublicKey.findProgramAddress(
    [signer.publicKey.toBuffer(), Buffer.from(movieTitle)],
    programId
  );

  console.log("PDA is:", pda.toBase58());

  const transaction = new web3.Transaction();

  const instruction = new web3.TransactionInstruction({
    programId: programId,
    data: buffer,
    keys: [
      {
        pubkey: signer.publicKey,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
    ],
  });

  transaction.add(instruction);
  const tx = await web3.sendAndConfirmTransaction(connection, transaction, [
    signer,
  ]);
  console.log(`https://explorer.solana.com/tx/${tx}?cluster=devnet`);
}

async function main() {
  const signer = initializeSignerKeypair();

  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  await airdropSolIfNeeded(signer, connection);

  const movieProgramId = new web3.PublicKey(
    "8bqGNqGrrbpEAG1XrGBGnnvcD9F6BLbqEqbuCvy7vF6k"
  );
  await sendTestMovieReview(signer, movieProgramId, connection);
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
