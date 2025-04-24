use anchor_lang::solana_program::pubkey::Pubkey;
use anchor_lang::prelude::*;

#[account]
pub struct CipherText {
    pub key: [u8; 32],
    pub owner: Pubkey,
    pub bit_length: u16,
}

impl CipherText {
    pub const Space: usize = 8 + 32 + 32 + 2;
}

#[derive(Accounts)]
#[instruction(key: [u8; 32])]
pub struct CreateStorage<'info>{
    #[account(
        init,
        payer = signer,
        space = CipherText::Space,
        seeds = [b"fhe_storage"],
        bump
    )]
    pub storage: Account<'info, CipherText>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}



