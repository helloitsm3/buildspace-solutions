use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    clock::UnixTimestamp,
    program_pack::{IsInitialized, Sealed},
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UserStakeInfo {
    pub is_initialized: bool,
    pub token_account: Pubkey,
    pub stake_start_time: UnixTimestamp,
    pub last_stake_redeem: UnixTimestamp,
    pub user_pubkey: Pubkey,
    pub stake_state: StakeState,
}

// state.rs
impl UserStakeInfo {
    /**
        Here's how we determine the size of the data. In your UserStakeInfo in struct in state.rs, we have the following data.

        pub is_initialized: bool,                 // 1 bit
        pub token_account: Pubkey,                // 32 bits
        pub stake_start_time: UnixTimestamp,      // 64 bits
        pub last_stake_redeem: UnixTimestamp,     // 64 bits
        pub user_pubkey: Pubkey,                  // 32 bits
        pub stake_state: StakeState,              // 1 bit
    **/
    pub const SIZE: usize = 1 + 32 + 64 + 64 + 32 + 1;
}

impl Sealed for UserStakeInfo {}

impl IsInitialized for UserStakeInfo {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq)]
pub enum StakeState {
    Staked,
    UnStaked,
}
