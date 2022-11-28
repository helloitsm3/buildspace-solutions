## 👋 🌍 Hello World Program
 
In this section, we will be building a simple hello world on-chain program that logs Hello world in Solana Explorer. We will be using the [Solana Playground](https://beta.solpg.io) to develop and deploy our program.

<b>Link to the code on Solpg</b>: https://beta.solpg.io/6384510677ea7f12846aef4a

### 📝 Instructions

1. Create a new project in Solana Playground
2. Create a new file called `program/src/lib.rs`
3. Copy the following code in ```src/lib.rs``` into `program/src/lib.rs`:
```rust
use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey,
};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!("Hello World!");
    Ok(())
}
```

4. Click on the Build & Depoloy Menu on the top right corner of the screen and click  `Build` button to build the program.
5. Now, Click on the `Deploy` button to deploy the program.

### Testing the program
1. Create a file `client.ts` in the `client` folder.
2. Copy and paste the code in `client.ts` to it.
3. Now click on the `Run` button on the top right corner of the screen to run the program.
4. You should see Solana Explorer url of your deployed program in the console.