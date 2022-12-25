use crate::error::StakeError;
use crate::instruction::StakeInstruction;
use crate::state::{StakeState, UserStakeInfo};
use borsh::BorshSerialize;
use mpl_token_metadata::ID as mpl_metadata_program_id;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    borsh::try_from_slice_unchecked,
    clock::Clock,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::IsInitialized,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};
use spl_token::ID as spl_token_program_id;

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = StakeInstruction::unpack(instruction_data)?;

    match instruction {
        StakeInstruction::InitializeStakeAccount => {
            process_initialize_stake_account(program_id, accounts)
        }
        StakeInstruction::Stake => process_stake(program_id, accounts),
        StakeInstruction::Redeem => process_redeem(program_id, accounts),
        StakeInstruction::Unstake => process_unstake(program_id, accounts),
    }
}

fn process_initialize_stake_account(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (stake_state_pda, bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );
    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(UserStakeInfo::SIZE);

    msg!("Creating state account at {:?}", stake_state_pda);
    invoke_signed(
        &system_instruction::create_account(
            user.key,
            stake_state.key,
            rent_lamports,
            UserStakeInfo::SIZE.try_into().unwrap(),
            program_id,
        ),
        &[user.clone(), stake_state.clone(), system_program.clone()],
        &[&[
            user.key.as_ref(),
            nft_token_account.key.as_ref(),
            &[bump_seed],
        ]],
    )?;

    let mut account_data =
        try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();
    if account_data.is_initialized() {
        msg!("Account already initialized");
        return Err(ProgramError::AccountAlreadyInitialized);
    }

    account_data.token_account = *nft_token_account.key;
    account_data.user_pubkey = *user.key;
    account_data.stake_state = StakeState::Unstaked;
    account_data.is_initialized = true;

    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;
    Ok(())
}

fn process_stake(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let nft_mint = next_account_info(account_info_iter)?;
    let nft_edition = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let program_authority = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;

    let (delegated_auth_pda, delegate_bump) =
        Pubkey::find_program_address(&[b"authority"], program_id);
    if delegated_auth_pda != *program_authority.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    let (stake_state_pda, _bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );
    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    msg!("Approving delegation");
    invoke(
        &spl_token::instruction::approve(
            &spl_token_program_id,
            nft_token_account.key,
            program_authority.key,
            user.key,
            &[user.key],
            1,
        )?,
        &[
            nft_token_account.clone(),
            program_authority.clone(),
            user.clone(),
            token_program.clone(),
        ],
    )?;

    msg!("freezing NFT token account");
    invoke_signed(
        &mpl_token_metadata::instruction::freeze_delegated_account(
            mpl_metadata_program_id,
            *program_authority.key,
            *nft_token_account.key,
            *nft_edition.key,
            *nft_mint.key,
        ),
        &[
            program_authority.clone(),
            nft_token_account.clone(),
            nft_edition.clone(),
            nft_mint.clone(),
            metadata_program.clone(),
        ],
        &[&[b"authority", &[delegate_bump]]],
    )?;

    let mut account_data =
        try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();
    if !account_data.is_initialized() {
        msg!("Account not initialized");
        return Err(StakeError::UninitializedAccount.into());
    }

    let clock = Clock::get()?;

    account_data.token_account = *nft_token_account.key;
    account_data.user_pubkey = *user.key;
    account_data.stake_state = StakeState::Staked;
    account_data.stake_start_time = clock.unix_timestamp;
    account_data.last_stake_redeem = clock.unix_timestamp;
    account_data.is_initialized = true;

    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;
    Ok(())
}

fn process_redeem(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let stake_mint = next_account_info(account_info_iter)?;
    let stake_authority = next_account_info(account_info_iter)?;
    let user_stake_ata = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;

    let (stake_state_pda, _bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );
    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    if !user.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut account_data =
        try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();
    if !account_data.is_initialized() {
        msg!("Account not initialized");
        return Err(StakeError::UninitializedAccount.into());
    }

    if account_data.stake_state != StakeState::Staked {
        msg!("Stake account is not staking anything");
        return Err(ProgramError::InvalidArgument);
    }
    if *user.key != account_data.user_pubkey {
        msg!("Incorrect stake account for user");
        return Err(StakeError::InvalidStakeAccount.into());
    }
    if *nft_token_account.key != account_data.token_account {
        msg!("NFT Token accounts do not match");
        return Err(StakeError::InvalidTokenAccount.into());
    }

    let (stake_auth_pda, auth_bump) = Pubkey::find_program_address(&[b"mint"], program_id);
    if *stake_authority.key != stake_auth_pda {
        msg!("Invalid stake mint authority!");
        return Err(StakeError::InvalidPda.into());
    }

    let clock = Clock::get()?;

    let unix_time = clock.unix_timestamp - account_data.last_stake_redeem;
    let redeem_amount = 100 * unix_time;
    msg!("Redeeming {} tokens", redeem_amount);

    invoke_signed(
        &spl_token::instruction::mint_to(
            token_program.key,
            stake_mint.key,
            user_stake_ata.key,
            stake_authority.key,
            &[stake_authority.key],
            redeem_amount.try_into().unwrap(),
        )?,
        &[
            stake_mint.clone(),
            user_stake_ata.clone(),
            stake_authority.clone(),
            token_program.clone(),
        ],
        &[&[b"mint", &[auth_bump]]],
    )?;

    account_data.last_stake_redeem = clock.unix_timestamp;
    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;
    Ok(())
}

fn process_unstake(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let user = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let nft_mint = next_account_info(account_info_iter)?;
    let nft_edition = next_account_info(account_info_iter)?;
    let stake_state = next_account_info(account_info_iter)?;
    let program_authority = next_account_info(account_info_iter)?;
    let stake_mint = next_account_info(account_info_iter)?;
    let stake_authority = next_account_info(account_info_iter)?;
    let user_stake_ata = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;

    let (stake_state_pda, _bump_seed) = Pubkey::find_program_address(
        &[user.key.as_ref(), nft_token_account.key.as_ref()],
        program_id,
    );
    if stake_state_pda != *stake_state.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    if !user.is_signer {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut account_data =
        try_from_slice_unchecked::<UserStakeInfo>(&stake_state.data.borrow()).unwrap();
    if !account_data.is_initialized() {
        msg!("Account not initialized");
        return Err(StakeError::UninitializedAccount.into());
    }

    if account_data.stake_state != StakeState::Staked {
        msg!("Stake account is not staking anything");
        return Err(ProgramError::InvalidArgument);
    }

    let (delegated_auth_pda, delegate_bump) =
        Pubkey::find_program_address(&[b"authority"], program_id);
    if delegated_auth_pda != *program_authority.key {
        msg!("Invalid seeds for PDA");
        return Err(StakeError::InvalidPda.into());
    }

    let (stake_auth_pda, auth_bump) = Pubkey::find_program_address(&[b"mint"], program_id);
    if *stake_authority.key != stake_auth_pda {
        msg!("Invalid stake mint authority!");
        return Err(StakeError::InvalidPda.into());
    }

    msg!("thawing NFT token account");
    invoke_signed(
        &mpl_token_metadata::instruction::thaw_delegated_account(
            mpl_metadata_program_id,
            *program_authority.key,
            *nft_token_account.key,
            *nft_edition.key,
            *nft_mint.key,
        ),
        &[
            program_authority.clone(),
            nft_token_account.clone(),
            nft_edition.clone(),
            nft_mint.clone(),
            metadata_program.clone(),
        ],
        &[&[b"authority", &[delegate_bump]]],
    )?;

    msg!("Revoke delegation");
    invoke(
        &spl_token::instruction::revoke(
            &spl_token_program_id,
            nft_token_account.key,
            user.key,
            &[user.key],
        )?,
        &[
            nft_token_account.clone(),
            user.clone(),
            token_program.clone(),
        ],
    )?;

    let clock = Clock::get()?;

    let unix_time = clock.unix_timestamp - account_data.last_stake_redeem;
    let redeem_amount = 100 * unix_time;
    msg!("Redeeming {} tokens", redeem_amount);

    invoke_signed(
        &spl_token::instruction::mint_to(
            token_program.key,
            stake_mint.key,
            user_stake_ata.key,
            stake_authority.key,
            &[stake_authority.key],
            redeem_amount.try_into().unwrap(),
        )?,
        &[
            stake_mint.clone(),
            user_stake_ata.clone(),
            stake_authority.clone(),
            token_program.clone(),
        ],
        &[&[b"mint", &[auth_bump]]],
    )?;

    msg!("Setting stake state to unstaked");
    account_data.stake_state = StakeState::Unstaked;

    account_data.serialize(&mut &mut stake_state.data.borrow_mut()[..])?;
    Ok(())
}
