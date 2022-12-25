import { Connection, PublicKey } from "@solana/web3.js"
import { PROGRAM_ID } from "./constants"
import * as borsh from "@project-serum/borsh"

const userStakeAccountLayout = borsh.struct([
  borsh.bool("isInitialized"),
  borsh.publicKey("tokenAccount"),
  borsh.i64("stakeStartTime"),
  borsh.i64("lastRedeem"),
  borsh.publicKey("userPubkey"),
  borsh.u8("state"),
])

export async function getStakeAccount(
  connection: Connection,
  user: PublicKey,
  tokenAccount: PublicKey
): Promise<any> {
  const [accountPubkey] = PublicKey.findProgramAddressSync(
    [user.toBuffer(), tokenAccount.toBuffer()],
    PROGRAM_ID
  )
  const account = await connection.getAccountInfo(accountPubkey)
  if (!account) throw {}
  return userStakeAccountLayout.decode(account.data)
}
