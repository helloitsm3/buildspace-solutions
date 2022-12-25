import { Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";

const string = fs.readFileSync(
  "../target/deploy/solana_nft_staking_program-keypair.json",
  "utf8"
);
const secret = Uint8Array.from(JSON.parse(string) as number[]);
const secretKey = Uint8Array.from(secret);

export const PROGRAM_ID = Keypair.fromSecretKey(secretKey).publicKey;
