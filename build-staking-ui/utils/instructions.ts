import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js"

export function createInitializeStakeAccountInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: SystemProgram.programId,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([0]),
  })
}

export function createStakingInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  nftMint: PublicKey,
  nftEdition: PublicKey,
  tokenProgram: PublicKey,
  metadataProgram: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )

  const [delegateAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  )

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: delegateAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: metadataProgram,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([1]),
  })
}

export function createRedeemInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  mint: PublicKey,
  userStakeATA: PublicKey,
  tokenProgram: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )

  const [mintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  )

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: mint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: mintAuth,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: userStakeATA,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.from([2]),
  })
}

export function createUnstakeInstruction(
  nftHolder: PublicKey,
  nftTokenAccount: PublicKey,
  nftMint: PublicKey,
  nftEdition: PublicKey,
  stakeMint: PublicKey,
  userStakeATA: PublicKey,
  tokenProgram: PublicKey,
  metadataProgram: PublicKey,
  programId: PublicKey
): TransactionInstruction {
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [nftHolder.toBuffer(), nftTokenAccount.toBuffer()],
    programId
  )

  const [delegateAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("authority")],
    programId
  )

  const [mintAuth] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    programId
  )

  return new TransactionInstruction({
    programId: programId,
    keys: [
      {
        pubkey: nftHolder,
        isWritable: false,
        isSigner: true,
      },
      {
        pubkey: nftTokenAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: nftMint,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: nftEdition,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: stakeAccount,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: delegateAuthority,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: stakeMint,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: mintAuth,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: userStakeATA,
        isWritable: true,
        isSigner: false,
      },
      {
        pubkey: tokenProgram,
        isWritable: false,
        isSigner: false,
      },
      {
        pubkey: metadataProgram,
        isWritable: false,
        isSigner: false,
      },
    ],
    data: Buffer.from([3]),
  })
}
