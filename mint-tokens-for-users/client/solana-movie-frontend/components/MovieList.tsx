import { Card } from "./Card"
import { FC, useEffect, useMemo, useState } from "react"
import { Movie } from "../models/Movie"
import { MovieCoordinator } from "../coordinators/MovieCoordinator"
import {
    Button,
    Center,
    HStack,
    Input,
    Spacer,
    Heading,
} from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { ReviewDetail } from "./ReviewDetail"
import { useConnection } from "@solana/wallet-adapter-react"

export const MovieList: FC = () => {
    const { connection } = useConnection()
    const [movies, setMovies] = useState<Movie[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedMovie, setSelectedMovie] = useState<Movie>(Movie.mocks[0])

    useEffect(() => {
        MovieCoordinator.fetchPage(
            connection,
            page,
            5,
            search,
            search !== ""
        ).then(setMovies)
    }, [page, search])

    const handleReviewSelected = (movie: Movie) => {
        setSelectedMovie(movie)
        onOpen()
    }

    return (
        <div>
            <Center>
                <Input
                    id="search"
                    color="gray.400"
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Search"
                    w="97%"
                    mt={2}
                    mb={2}
                />
            </Center>
            <Heading as="h1" size="l" color="white" ml={4} mt={8}>
                Select Review To Comment
            </Heading>
            <ReviewDetail
                isOpen={isOpen}
                onClose={onClose}
                movie={selectedMovie ?? movies[0]}
            />
            {movies.map((movie, i) => (
                <Card
                    key={i}
                    movie={movie}
                    onClick={() => {
                        handleReviewSelected(movie)
                    }}
                />
            ))}
            <Center>
                <HStack w="full" mt={2} mb={8} ml={4} mr={4}>
                    {page > 1 && (
                        <Button onClick={() => setPage(page - 1)}>
                            Previous
                        </Button>
                    )}
                    <Spacer />
                    {MovieCoordinator.accounts.length > page * 5 && (
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    )}
                </HStack>
            </Center>
        </div>
    )
}
