import { useAnchorProgram } from './use_anchor_program'
import { Keypair, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from '@jup-ag/wallet-adapter'
import { useMemo } from 'react'
import * as anchor from '@coral-xyz/anchor'

const metadata = {
	name: 'Solana Gold',
	symbol: 'GOLDSOL',
	uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
}

export function useSplTokenMinter() {
	const { connection } = useConnection()
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const mintKeypair = useMemo(() => new Keypair(), [])

	async function createSplToken(metadata: {
		name: string
		symbol: string
		uri: string
	}) {
		if (!payer || !program) return

		// SPL Token default = 9 decimals
		return program.methods
			.createToken(metadata.name, metadata.symbol, metadata.uri)
			.accounts({
				payer: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.transaction()
	}

	const { sendTransaction } = useWallet()

	async function sendAndConfirmTransaction(
		transactionBuilder: () => Promise<Transaction | undefined>,
	) {
		try {
			const tx = await transactionBuilder()

			if (!tx) return
			const txSig = await sendTransaction(tx, connection, {
				signers: [mintKeypair],
			})

			const { blockhash, lastValidBlockHeight } =
				await connection.getLatestBlockhash()

			const res = await connection.confirmTransaction({
				blockhash,
				lastValidBlockHeight,
				signature: txSig,
			})

			return res
		} catch (error) {
			console.error('Error processing transaction:', error)
		}
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
		return program.methods
			.mintToken(amount)
			.accounts({
				mintAuthority: payer.publicKey,
				recipient: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
				associatedTokenAccount: associatedTokenAccountAddress,
			})
			.rpc()
	}

	return { createSplToken, mintSomeTokens, sendAndConfirmTransaction }
}
