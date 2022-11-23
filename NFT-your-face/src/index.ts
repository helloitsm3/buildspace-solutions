import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js"
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  NftWithToken,
} from "@metaplex-foundation/js"
import * as fs from "fs"

const tokenName = "Marvellous Coder"
const description = "A coder that can code in any language you want"
const symbol = "CODER"
const sellerFeeBasisPoints = 100
const imageFile = "coder.jpg"


// create NFT
async function createNft(
  metaplex: Metaplex,
  uri: string
): Promise<NftWithToken> {
  const { nft } = await metaplex
    .nfts()
    .create({
      uri: uri,
      name: tokenName,
      sellerFeeBasisPoints: sellerFeeBasisPoints,
      symbol: symbol,
    })

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )

  return nft
}

async function updateNft(
  metaplex: Metaplex,
  uri: string,
  mintAddress: PublicKey
) {
  // get "NftWithToken" type from mint address
  const nft = await metaplex.nfts().findByMint({ mintAddress })

  // omit any fields to keep unchanged
  await metaplex
    .nfts()
    .update({
      nftOrSft: nft,
      name: tokenName,
      symbol: symbol,
      uri: uri,
      sellerFeeBasisPoints: sellerFeeBasisPoints,
    })

  console.log(
    `Token Mint: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
  )
}


async function main() {
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
  const user = await initializeKeypair(connection)
  console.log("PublicKey:", user.publicKey.toBase58())
  const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(user))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    })
  )
  const buffer = fs.readFileSync('./assets/'+imageFile)
  const file = toMetaplexFile(buffer, imageFile)
  const imageUri = await metaplex.storage().upload(file)
  console.log("Image URI: ", imageUri)

  const {uri} = await metaplex.nfts().uploadMetadata({
    name: tokenName,
    description : description,
    image: imageUri
  })
  console.log("Metadata URI: ", uri)  

  //await createNft(metaplex, uri)
  const mintAddress = new PublicKey("8AnFPMCfj8HsMYXktP28Bu6ra5RFL8GdyYdMvTgxyXrm")
  await updateNft(metaplex, uri, mintAddress)
}
main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
