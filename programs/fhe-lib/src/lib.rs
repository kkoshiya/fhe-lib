use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;
mod utils;
use crate::utils::fhe_types::*;
pub use crate::utils::fhe_types::CipherText;

declare_id!("Fuj5qpvT66C7pz4fvyLDV6d8YCUS9idJH2i66Qj5vedh");

#[program]
pub mod fhe_lib {
    use super::*;

    pub fn as_fhe8(ctx: Context<CreateStorage>, key: [u8; 32]) -> Result<CipherText> {
        let storage = &mut ctx.accounts.storage;
        storage.key = key;
        storage.owner = ctx.accounts.signer.key();
        storage.bit_length = 8;
        Ok(CipherText {
            key: storage.key,
            owner: storage.owner,
            bit_length: storage.bit_length,
        })
    }

    pub fn fhe_add(ctx: Context<FheOp>, lhs: CipherText, rhs: CipherText) -> Result<()> {
        msg!("Add lhs bit_length: {}", lhs.bit_length);
        msg!("Add lhs: {:?}", lhs.key);
        msg!("Add rhs: {:?}", rhs.key);
        Ok(())
    }

}

#[derive(Accounts)]
pub struct FheOp<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

