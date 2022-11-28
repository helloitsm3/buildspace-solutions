use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::{IsInitialized, Sealed};

#[derive(BorshSerialize, BorshDeserialize)]
pub struct StudentIntroState {
    pub is_initialized: bool,
    pub name: String,
    pub message: String,
}

impl Sealed for StudentIntroState {}

impl IsInitialized for StudentIntroState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
