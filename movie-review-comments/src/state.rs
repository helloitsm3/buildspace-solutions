use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::{IsInitialized, Sealed};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieAccountState {
    // Two new fields added - discriminator and reviewer
    pub discriminator: String,
    pub is_initialized: bool,
    pub reviewer: Pubkey,
    pub rating: u8,
    pub title: String,
    pub description: String,
}

// New struct for recording how many comments total
#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieCommentCounter {
    pub discriminator: String,
    pub is_initialized: bool,
    pub counter: u64,
}

// New struct for storing individual comments
#[derive(BorshSerialize, BorshDeserialize)]
pub struct MovieComment {
    pub discriminator: String,
    pub is_initialized: bool,
    pub review: Pubkey,
    pub commenter: Pubkey,
    pub comment: String,
    pub count: u64,
}

impl Sealed for MovieAccountState {}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for MovieCommentCounter {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl IsInitialized for MovieComment {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl MovieAccountState {
    pub const DISCRIMINATOR: &'static str = "review";

    pub fn get_account_size(title: String, description: String) -> usize {
                // 4 bytes to store the size of the subsequent dynamic data (string)
        return (4 + MovieAccountState::DISCRIMINATOR.len())  
            + 1 // 1 byte for is_initialized (boolean)
            + 1 // 1 byte for rating 
            + (4 + title.len()) // 4 bytes to store the size of the subsequent dynamic data (string)
            + (4 + description.len()); // Same as above
    }
}

impl MovieComment {
    pub const DISCRIMINATOR: &'static str = "comment";

    pub fn get_account_size(comment: String) -> usize {
        return (4 + MovieComment::DISCRIMINATOR.len()) 
        + 1  // 1 byte for is_initialized (boolean)
        + 32 // 32 bytes for the movie review account key 
        + 32 // 32 bytes for the commenter key size
        + (4 + comment.len()) // 4 bytes to store the size of the subsequent dynamic data (string)
        + 8; // 8 bytes for the count (u64)
    }
}

impl MovieCommentCounter {
    pub const DISCRIMINATOR: &'static str = "counter";
    pub const SIZE: usize = (4 + MovieCommentCounter::DISCRIMINATOR.len()) + 1 + 8;
}

impl Sealed for MovieCommentCounter{}

