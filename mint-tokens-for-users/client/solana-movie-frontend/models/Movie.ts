import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js"
import { MOVIE_REVIEW_PROGRAM_ID } from "../utils/constants"

export class Movie {
    title: string
    rating: number
    description: string
    reviewer: PublicKey

    constructor(
        title: string,
        rating: number,
        description: string,
        reviewer: PublicKey
    ) {
        this.title = title
        this.rating = rating
        this.description = description
        this.reviewer = reviewer
    }

    async publicKey(): Promise<PublicKey> {
        return (
            await PublicKey.findProgramAddress(
                [this.reviewer.toBuffer(), Buffer.from(this.title)],
                new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
            )
        )[0]
    }

    static mocks: Movie[] = [
        new Movie(
            "The Shawshank Redemption",
            5,
            `For a movie shot entirely in prison where there is no hope at all, shawshank redemption's main massage and purpose is to remind us of hope, that even in the darkest places hope exists, and only needs someone to find it. Combine this message with a brilliant screenplay, lovely characters and Martin freeman, and you get a movie that can teach you a lesson everytime you watch it. An all time Classic!!!`,
            new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
        ),
        new Movie(
            "The Godfather",
            5,
            `One of Hollywood's greatest critical and commercial successes, The Godfather gets everything right; not only did the movie transcend expectations, it established new benchmarks for American cinema.`,
            new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
        ),
        new Movie(
            "The Godfather: Part II",
            4,
            `The Godfather: Part II is a continuation of the saga of the late Italian-American crime boss, Francis Ford Coppola, and his son, Vito Corleone. The story follows the continuing saga of the Corleone family as they attempt to successfully start a new life for themselves after years of crime and corruption.`,
            new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
        ),
        new Movie(
            "The Dark Knight",
            5,
            `The Dark Knight is a 2008 superhero film directed, produced, and co-written by Christopher Nolan. Batman, in his darkest hour, faces his greatest challenge yet: he must become the symbol of the opposite of the Batmanian order, the League of Shadows.`,
            new PublicKey("EurMFhvwKScjv469XQoUm1Qj6PFJQoVwXYmdgeXCqg5m")
        ),
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8("variant"),
        borsh.str("title"),
        borsh.u8("rating"),
        borsh.str("description"),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.str("discriminator"),
        borsh.bool("initialized"),
        borsh.publicKey("reviewer"),
        borsh.u8("rating"),
        borsh.str("title"),
        borsh.str("description"),
    ])

    serialize(instruction: number): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode(
            { ...this, variant: instruction },
            buffer
        )
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Movie | null {
        if (!buffer) {
            return null
        }

        try {
            const { title, rating, description, reviewer } =
                this.borshAccountSchema.decode(buffer)
            return new Movie(title, rating, description, reviewer)
        } catch (e) {
            console.log("Deserialization error:", e)
            console.log(buffer)
            return null
        }
    }
}
