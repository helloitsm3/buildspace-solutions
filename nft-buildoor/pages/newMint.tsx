import type { NextPage } from "next"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import MainLayout from "../components/MainLayout"
import {
  Container,
  Heading,
  VStack,
  Text,
  Image,
  Button,
  HStack,
} from "@chakra-ui/react"
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { PublicKey } from "@solana/web3.js"
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js"

const NewMint: NextPage<NewMintProps> = ({ mint }) => {
  const [metadata, setMetadata] = useState<any>()
  const { connection } = useConnection()
  const walletAdapter = useWallet()
  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
  }, [connection, walletAdapter])

  useEffect(() => {
    metaplex
      .nfts()
      .findByMint({ mintAddress: mint })
      .then((nft) => {
        fetch(nft.uri)
          .then((res) => res.json())
          .then((metadata) => {
            setMetadata(metadata)
          })
      })
  }, [mint, metaplex, walletAdapter])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {},
    []
  )

  return (
    <MainLayout>
      <VStack spacing={20}>
        <Container>
          <VStack spacing={8}>
            <Heading color="white" as="h1" size="2xl" textAlign="center">
              😮 A new buildoor has appeared!
            </Heading>

            <Text color="bodyText" fontSize="xl" textAlign="center">
              Congratulations, you minted a lvl 1 buildoor! <br />
              Time to stake your character to earn rewards and level up.
            </Text>
          </VStack>
        </Container>

        <Image src={metadata?.image ?? ""} alt="" />

        <Button
          bgColor="accent"
          color="white"
          maxW="380px"
          onClick={handleClick}
        >
          <HStack>
            <Text>stake my buildoor</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </MainLayout>
  )
}

interface NewMintProps {
  mint: PublicKey
}

NewMint.getInitialProps = async ({ query }) => {
  const { mint } = query

  if (!mint) throw { error: "no mint" }

  try {
    const mintPubkey = new PublicKey(mint)
    return { mint: mintPubkey }
  } catch {
    throw { error: "invalid mint" }
  }
}

export default NewMint