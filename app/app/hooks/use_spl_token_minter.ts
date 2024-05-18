import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useMemo, useCallback } from 'react'
import * as anchor from '@coral-xyz/anchor'

const metadata = {
	name: 'Solana Gold',
	symbol: 'GOLDSOL',
	uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
}

export function useSplTokenMinter() {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const mintKeypair = useMemo(() => new Keypair(), [])

	const createSplToken = useCallback(
		(
			tokenDecimals: number,
			tokenName: string,
			tokenSymbol: string,
			tokenUri: string,
		) => {
			if (!program || !payer) return
			return program.methods
				.createToken(tokenDecimals, tokenName, tokenSymbol, tokenUri)
				.accounts({
					payer: payer.publicKey,
					mintAccount: mintKeypair.publicKey,
				})
				.transaction()
		},
		[program, payer],
	)

	async function mintSomeTokens() {
		if (!payer || !program) return
		// Derive the associated token address account for the mint and payer.
		const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
			mintKeypair.publicKey,
			payer.publicKey,
		)

		// Amount of tokens to mint.
		const amount = new anchor.BN(100)

		// Mint the tokens to the associated token account.
		return program.methods
			.mintToken(amount)
			.accounts({
				mintAuthority: payer.publicKey,
				recipient: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
				associatedTokenAccount: associatedTokenAccountAddress,
			})
			.transaction()
	}

	return {
		createSplToken,
		mintSomeTokens,
		mintKeypair,
	}
}
