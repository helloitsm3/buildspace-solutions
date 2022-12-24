import {
  Heading,
  VStack,
  Text,
  HStack,
  Flex,
  Image,
  Center,
} from "@chakra-ui/react"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { NextPage } from "next"
import { useEffect, useState } from "react"
import { ItemBox } from "../components/ItemBox"
import MainLayout from "../components/MainLayout"
import { StakeOptionsDisplay } from "../components/StakeOptionsDisplay"

const Stake: NextPage<StakeProps> = ({ mint, imageSrc }) => {
  const [isStaking, setIsStaking] = useState(false)
  const [level, setLevel] = useState(1)
  const [nftData, setNftData] = useState<any>()

  const { connection } = useConnection()
  const walletAdapter = useWallet()

  useEffect(() => {
    const metaplex = Metaplex.make(connection).use(
      walletAdapterIdentity(walletAdapter)
    )

    try {
      metaplex
        .nfts()
        .findByMint({ mintAddress: mint })
        .run()
        .then((nft) => {
          console.log("nft data on stake page:", nft)
          setNftData(nft)
        })
    } catch (e) {
      console.log("error getting nft:", e)
    }
  }, [connection, walletAdapter])

  return (
    <MainLayout>
      <VStack spacing={7} justify="flex-start" align="flex-start">
        <Heading color="white" as="h1" size="2xl">
          Level up your buildoor
        </Heading>
        <Text color="bodyText" fontSize="xl" textAlign="start" maxWidth="600px">
          Stake your buildoor to earn 10 $BLD per day to get access to a
          randomized loot box full of upgrades for your buildoor
        </Text>
        <HStack spacing={20} alignItems="flex-start">
          <VStack align="flex-start" minWidth="200px">
            <Flex direction="column">
              <Image boxSize='200px' objectFit='cover' src={imageSrc ?? ""} alt="buildoor nft" zIndex="1" />
              <Center
                bgColor="secondaryPurple"
                borderRadius="0 0 8px 8px"
                marginTop="-8px"
                zIndex="2"
                height="32px"
              >
                <Text
                  color="white"
                  as="b"
                  fontSize="md"
                  width="100%"
                  textAlign="center"
                >
                  {isStaking ? "STAKING" : "UNSTAKED"}
                </Text>
              </Center>
            </Flex>
            <Text fontSize="2xl" as="b" color="white">
              LEVEL {level}
            </Text>
          </VStack>
          <VStack alignItems="flex-start" spacing={10}>
            <StakeOptionsDisplay
              nftData={nftData}
              isStaked={false}
              daysStaked={4}
              totalEarned={60}
              claimable={20}
            />
            <HStack spacing={10}>
              <VStack alignItems="flex-start">
                <Text color="white" as="b" fontSize="2xl">
                  Gear
                </Text>
                <HStack>
                  <ItemBox>mock</ItemBox>
                  <ItemBox>mock</ItemBox>
                </HStack>
              </VStack>
              <VStack alignItems="flex-start">
                <Text color="white" as="b" fontSize="2xl">
                  Loot Boxes
                </Text>
                <HStack>
                  <ItemBox>mock</ItemBox>
                  <ItemBox>mock</ItemBox>
                  <ItemBox>mock</ItemBox>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </MainLayout>
  )
}

interface StakeProps {
  mint: PublicKey
  imageSrc: string
}

Stake.getInitialProps = async ({ query }: any) => {
  const { mint, imageSrc } = query

  if (!mint || !imageSrc) throw { error: "no mint" }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey, imageSrc: imageSrc }
  } catch {
    throw { error: "invalid mint" }
  }
}

export default Stake