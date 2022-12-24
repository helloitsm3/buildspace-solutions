import {
    Button,
    Center,
    HStack,
    Spacer,
    Stack,
    Box,
    Heading,
} from "@chakra-ui/react"
import { FC, useState, useEffect } from "react"
import { CommentCoordinator } from "../coordinators/CommentCoordinator"
import { Movie } from "../models/Movie"
import { Comment } from "../models/Comment"
import * as web3 from "@solana/web3.js"
import { useConnection } from "@solana/wallet-adapter-react"

interface CommentListProps {
    movie: Movie
}

export const CommentList: FC<CommentListProps> = ({
    movie,
}: CommentListProps) => {
    const { connection } = useConnection()
    const [page, setPage] = useState(1)
    const [comments, setComments] = useState<Comment[]>([])

    useEffect(() => {
        const fetch = async () => {
            movie.publicKey().then(async (review) => {
                const comments = await CommentCoordinator.fetchPage(
                    connection,
                    review,
                    page,
                    3
                )
                setComments(comments)
            })
        }
        fetch()
    }, [page])

    return (
        <div>
            <Heading as="h1" size="l" ml={4} mt={2}>
                Existing Comments
            </Heading>
            {comments.map((comment, i) => (
                <Box
                    p={4}
                    textAlign={{ base: "left", md: "left" }}
                    display={{ md: "flex" }}
                    maxWidth="32rem"
                    borderWidth={1}
                    margin={2}
                >
                    <div key={i}>{comment.comment}</div>
                </Box>
            ))}
            <Stack>
                <Center>
                    <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
                        {page > 1 && (
                            <Button onClick={() => setPage(page - 1)}>
                                Previous
                            </Button>
                        )}
                        <Spacer />
                        {CommentCoordinator.commentCount > page * 3 && (
                            <Button onClick={() => setPage(page + 1)}>
                                Next
                            </Button>
                        )}
                    </HStack>
                </Center>
            </Stack>
        </div>
    )
}
