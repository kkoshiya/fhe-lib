use anchor_lang::prelude::*;
use fhe_lib::cpi::*;
use fhe_lib::program::FheLib;

declare_id!("AaYfvcZY1iUVFM33KAKUNh8g4JPsStcgp88admDTTMVH");

#[program]
pub mod app {
    use super::*;

    pub fn test_first_add(ctx: Context<UseFhe>, a: [u8;32], b: [u8;32]) -> Result<()> {
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UseFhe<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub fhe_lib: Program<'info, FheLib>,
}