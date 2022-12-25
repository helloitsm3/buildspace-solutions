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
    ],
    data: Buffer.from([1]),
  })
}

export function createRedeemInstruction(
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
    ],
    data: Buffer.from([2]),
  })
}

export function createUnstakeInstruction(
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
    ],
    data: Buffer.from([3]),
  })
}
