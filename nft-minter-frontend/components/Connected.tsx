
import { FC } from "react"
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"


const Connected: FC = () => {
    return (
      <VStack spacing={10}>
        <Container>
          <VStack spacing={8}>
            <Heading
              color="white"
              as="h1"
              size="2xl"
              noOfLines={1}
              textAlign="center"
            >
              Welcome Buildoor.
            </Heading>
  
            <Text color="bodyText" fontSize="xl" textAlign="center">
              Each buildoor is randomly generated and can be staked to receive
              <Text as="b"> $BLD</Text> Use your <Text as="b"> $BLD</Text> to
              upgrade your buildoor and receive perks within the community!
            </Text>
          </VStack>
        </Container> 
    <HStack spacing={4}>
        <Image src="images/avatar1.png" alt="" />
        <Image src="images/avatar2.png" alt="" />
        <Image src="images/avatar3.png" alt="" />
        <Image src="images/avatar4.png" alt="" />
        <Image src="images/avatar5.png" alt="" />
      </HStack>

      <Button bgColor="blue" color="white" maxW="380px">
        <HStack>
          <Text>mint buildoor</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </VStack>
  )
}

export default Connected