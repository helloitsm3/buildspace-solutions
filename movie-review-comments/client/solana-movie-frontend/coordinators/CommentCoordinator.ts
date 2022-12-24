import bs58 from "bs58"
import * as web3 from "@solana/web3.js"
import { Comment } from "../models/Comment"
import * as borsh from "@project-serum/borsh"
import { MOVIE_REVIEW_PROGRAM_ID } from "../utils/constants"
import BN from "bn.js"

export class CommentCoordinator {
    static commentCount: number = 0

    private static counterLayout = borsh.struct([
        borsh.str("discriminator"),
        borsh.u8("isInitialized"),
        borsh.u8("count"),
    ])

    static async commentCounterPubkey(
        review: web3.PublicKey
    ): Promise<web3.PublicKey> {
        return (
            await web3.PublicKey.findProgramAddress(
                [review.toBuffer(), Buffer.from("comment")],
                new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
            )
        )[0]
    }

    static async syncCommentCount(
        connection: web3.Connection,
        review: web3.PublicKey
    ) {
        const counterPda = await this.commentCounterPubkey(review)

        try {
            const account = await connection.getAccountInfo(counterPda)
            this.commentCount = this.counterLayout.decode(account?.data).count
        } catch (error) {
            console.log(error)
        }
    }

    static async fetchPage(
        connection: web3.Connection,
        review: web3.PublicKey,
        page: number,
        perPage: number
    ): Promise<Comment[]> {
        await this.syncCommentCount(connection, review)

        console.log("count", this.commentCount)
        const start = this.commentCount - perPage * (page - 1)
        const end = Math.max(start - perPage, 0)

        let paginatedPublicKeys: web3.PublicKey[] = []

        for (let i = start; i > end; i--) {
            const [pda] = await web3.PublicKey.findProgramAddress(
                [
                    review.toBuffer(),
                    new BN([i - 1]).toArrayLike(Buffer, "be", 8),
                ],
                new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
            )
            paginatedPublicKeys.push(pda)
        }

        const accounts = await connection.getMultipleAccountsInfo(
            paginatedPublicKeys
        )

        const comments = accounts.reduce((accum: Comment[], account) => {
            const comment = Comment.deserialize(account?.data)
            if (!comment) {
                return accum
            }

            return [...accum, comment]
        }, [])

        return comments
    }
}
