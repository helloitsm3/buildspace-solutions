use solana_program::sysvar::Sysvar;
use solana_program::{
    account_info::AccountInfo, clock::Clock, entrypoint, entrypoint::ProgramResult, msg,
    pubkey::Pubkey,
};

entrypoint!(process_instruction);
pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let clock = Clock::get()?;
    let s = String::from("Hello");
    let arr = [
        "Hello!",
        "Welcome!",
        "Greetings!",
        "Salutatons!",
        "Good day!",
        "Yo!",
        "Hola!",
        "What's up?",
    ];
    //convert blockhash to random seed string
    let random = (&clock.unix_timestamp % 5) as usize;
    msg!(arr[random]);
    Ok(())
}
