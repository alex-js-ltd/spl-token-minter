#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod instructions;
use instructions::*;

declare_id!("GJ82nHsPWrqgciqXbNvL22oSw76jiPrNCkYuqgYgPHpC");

#[program]
pub mod spl_token_minter {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        _token_decimals: u8,
        token_name: String,
        token_symbol: String,
        token_uri: String,
    ) -> Result<()> {
        create::create_token(ctx, _token_decimals, token_name,  token_symbol, token_uri)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        mint::mint_token(ctx, amount)
    }
}
