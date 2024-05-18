import { useAnchorProgram } from './use_anchor_program'
import { Keypair, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import * as anchor from '@coral-xyz/anchor'
import { useAsync } from '@/app/hooks/use_async'
import { useEffect } from 'react'

export function useMintSomeTokens({ mintKeypair }: { mintKeypair: Keypair }) {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const { run, data, isLoading, error } = useAsync<Transaction>()

	console.log(error)

	useEffect(() => {
		if (!payer || !program) return
		// Derive the associated token address account for the mint and payer.
		const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
			mintKeypair.publicKey,
			payer.publicKey,
		)

		// Amount of tokens to mint.
		const amount = new anchor.BN(1000000000)

		const tx = program.methods
			.mintToken(amount)
			.accounts({
				mintAuthority: payer.publicKey,
				recipient: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
				associatedTokenAccount: associatedTokenAccountAddress,
			})
			.transaction()

		run(tx)
	}, [run, program, payer, mintKeypair])

	return {
		tx: data,
		isLoading,
	}
}
