import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useMemo } from 'react'
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

	console.log(`   Mint Address: ${mintKeypair.publicKey}`)

	async function createSplToken() {
		if (!payer || !program) return

		// SPL Token default = 9 decimals
		const transactionSignature = await program.methods
			.createToken(metadata.name, metadata.symbol, metadata.uri)
			.accounts({
				payer: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.signers([mintKeypair])
			.rpc()

		console.log('Success!')
		console.log(`   Mint Address: ${mintKeypair.publicKey}`)
		console.log(`   Transaction Signature: ${transactionSignature}`)
	}

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
		const transactionSignature = await program.methods
			.mintToken(amount)
			.accounts({
				mintAuthority: payer.publicKey,
				recipient: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
				associatedTokenAccount: associatedTokenAccountAddress,
			})
			.rpc()

		console.log('Success!')
		console.log(
			`   Associated Token Account Address: ${associatedTokenAccountAddress}`,
		)
		console.log(`   Transaction Signature: ${transactionSignature}`)
	}

	return { createSplToken, mintSomeTokens }
}
