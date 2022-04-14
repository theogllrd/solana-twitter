use anchor_lang::prelude::*;

declare_id!("7H16s7FNXJhZDtSC8GmgHMqBdmks1ZmkGHerMkhcKQbQ");

#[program]
pub mod solana_twitter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
