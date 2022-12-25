import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js"
import { MOVIE_REVIEW_PROGRAM_ID } from "../utils/constants"
import BN from "bn.js"

export class Comment {
    review: PublicKey
    commenter: PublicKey
    comment: string
    count: number

    constructor(
        review: PublicKey,
        commenter: PublicKey,
        comment: string,
        count: number
    ) {
        this.review = review
        this.commenter = commenter
        this.comment = comment
        this.count = count
    }

    async publicKey(): Promise<PublicKey> {
        return (
            await PublicKey.findProgramAddress(
                [
                    this.review.toBuffer(),
                    new BN(this.count).toArrayLike(Buffer, "be", 8),
                ],
                new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
            )
        )[0]
    }

    private static commentLayout = borsh.struct([
        borsh.str("discriminator"),
        borsh.u8("isInitialized"),
        borsh.publicKey("review"),
        borsh.publicKey("commenter"),
        borsh.str("comment"),
        borsh.u64("count"),
    ])

    private instructionLayout = borsh.struct([
        borsh.u8("variant"),
        borsh.str("comment"),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.instructionLayout.encode({ ...this, variant: 2 }, buffer)
        return buffer.slice(0, this.instructionLayout.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): Comment | null {
        if (!buffer) {
            return null
        }

        try {
            const { review, commenter, comment, count } =
                this.commentLayout.decode(buffer)
            return new Comment(review, commenter, comment, count)
        } catch (e) {
            console.log("Deserialization error:", e)
            console.log(buffer)
            return null
        }
    }
}
