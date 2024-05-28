use anchor_lang::prelude::*;
use anchor_spl::token::spl_token::instruction::AuthorityType;
use anchor_spl::token::{self, Mint, Token};



pub fn revoke(ctx: Context<Revoke>) -> Result<()> {
    let cpi_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::SetAuthority {
            current_authority: ctx.accounts.mint_authority.to_account_info(),
            account_or_mint: ctx.accounts.mint_account.to_account_info(),
        },
    );
    token::set_authority(
        cpi_context,
        AuthorityType::MintTokens,
      None,
    )?;
    Ok(())
}

#[derive(Accounts)]
pub struct Revoke<'info> {
    #[account(mut, signer)]
    pub mint_authority: Signer<'info>,
    #[account(mut)]
    pub mint_account: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}



