#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

mod instructions;

declare_id!("GaPC2f7pRHLE8AUpvAYXKP9QrRwpAuW3thuJpEYvJERg");

#[program]
pub mod spl_token_minter {
    pub use super::instructions::*;
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        _token_decimals: u8,
        token_name: String,
        token_symbol: String,
        token_uri: String,
    ) -> Result<()> {
        instructions::create_token(ctx, _token_decimals, token_name,  token_symbol, token_uri)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        instructions::mint_token(ctx, amount)
    }

    pub fn revoke(ctx: Context<Revoke>) -> Result<()> {
        instructions::revoke(ctx)
    }
}
