import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
// Add the spl-token import at the top
import * as token from "@solana/spl-token"
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  findMetadataPda,
 
} from "@metaplex-foundation/js"
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata"
import * as fs from "fs"
import { createInitializeMintInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint,MINT_SIZE,TOKEN_PROGRAM_ID,Account, getAccount, TokenInvalidAccountOwnerError, TokenAccountNotFoundError, createMintToInstruction, createTransferInstruction } from "@solana/spl-token"
import { publicKey } from "@project-serum/borsh"

const tokenName = "LFGCoin"
const tokenSymbol = "LFG"
const description = "Lets F*cking go and build some cool shit on solana!"
const decimals = 4
const amount = 1000

async function main ()
{
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const user = await initializeKeypair(connection)

  console.log("PublicKey : ", user.publicKey.toString())
  const lamports = await getMinimumBalanceForRentExemptMint(connection)
  console.log("Lamports required to create a mint: ", lamports)

  const mintKeyPair = web3.Keypair.generate()
  console.log("PublicKey of the mint: ", mintKeyPair.publicKey.toString())

  const metadataPDA = await findMetadataPda(mintKeyPair.publicKey)
  console.log("Metadata PDA: ", metadataPDA.toString())

  const tokenATA = await getAssociatedTokenAddress(
    mintKeyPair.publicKey,
    user.publicKey
  )
  console.log("Token ATA: ", tokenATA.toString())

  //Metaplex

  const metaplex  =  Metaplex.make(connection).use(keypairIdentity(user)).use(bundlrStorage(
    {
      address : "https://devnet.bundlr.network",
      providerUrl : "https://api.devnet.solana.com",
      timeout : 10000,
    }
  ))
    //file to buffer

    const buffer  = fs.readFileSync("./assets/LFG.png")
    const file  = toMetaplexFile(buffer, "LFG.png")

    //UPLOAD IMAGE AND GET URI

    const imageuri  = await metaplex.storage().upload(file)
    console.log("Metaplex Image URI: ", imageuri)
     
    //UPLOAD METADATA DATA AND GET URI
    const {uri} = await metaplex.nfts().uploadMetadata({
      name : tokenName,
      description : description,
      image : imageuri,
    })
    console.log("Metaplex Metadata URI: ", uri)

    //ONCHAIN METADATA FORMAT
    const tokenMetadata = {
      name : tokenName,
      symbol : tokenSymbol,
      uri : uri,
      sellerFeeBasisPoints : 0,
      creators : null,
      collection : null,
      uses : null,
    } as DataV2

    //TRANSACTION TO CREATE METADATA ACCOUNT
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.createAccount({
        fromPubkey : user.publicKey,
        newAccountPubkey: mintKeyPair.publicKey,
        lamports : lamports,
        space : MINT_SIZE,
        programId : token.TOKEN_PROGRAM_ID,
      }),

     createInitializeMintInstruction(
        mintKeyPair.publicKey,
        decimals,
        user.publicKey,
        user.publicKey,
        TOKEN_PROGRAM_ID
     ),

     createCreateMetadataAccountV2Instruction(
        {
          metadata : metadataPDA,
          mint : mintKeyPair.publicKey,
          mintAuthority : user.publicKey,
          payer : user.publicKey,
          updateAuthority : user.publicKey,
        },
        {
          createMetadataAccountArgsV2 :{
            data : tokenMetadata,
            isMutable : true,
          },
        }
     )
    )
    const createTokenAccountInstruction = token.createAssociatedTokenAccountInstruction(
      user.publicKey,
      tokenATA,
      user.publicKey,
      mintKeyPair.publicKey
    )
    let tokenAccount: Account
    try {
      tokenAccount = await getAccount(connection, tokenATA)
    } catch (error: unknown) {
      if (
        error instanceof TokenAccountNotFoundError ||
        error instanceof TokenInvalidAccountOwnerError
      ) {
        try {
          // add instruction to create token account if one does not exist
          transaction.add(createTokenAccountInstruction)
        } catch (error: unknown) {}
      } else {
        throw error
      }
    }

    transaction.add(
      createMintToInstruction(
        mintKeyPair.publicKey,
        tokenATA,
        user.publicKey,
        amount*10**decimals
      ),
    )
    
    
    const transactionSignature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [user, mintKeyPair],
    )
    console.log(`Transaction signature: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`)
  }

  main().then(() => console.log("Success")).catch((err) => console.error(err))
