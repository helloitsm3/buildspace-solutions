use solana_program::program_error::ProgramError;

pub enum StakeInstruction {
    InitializeStakeAccount,
    Stake,
    Redeem,
    UnStake,
}

impl StakeInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, _rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        Ok(match variant {
            0 => Self::InitializeStakeAccount,
            1 => Self::Stake,
            2 => Self::Redeem,
            3 => Self::UnStake,
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
