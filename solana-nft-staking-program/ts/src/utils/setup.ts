import { CreateNftOutput, Metaplex } from "@metaplex-foundation/js";

export async function createNft(metaplex: Metaplex): Promise<CreateNftOutput> {
  const nft = await metaplex
    .nfts()
    .create({ uri: "", name: "Test NFT", sellerFeeBasisPoints: 0 })
    .run();

  return nft;
}
