import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import * as anchor from '@coral-xyz/anchor'
import { useAsync } from '@/app/hooks/use_async'
import { useCallback } from 'react'
import { useSendAndConfirmTx } from './use_send_and_confirm_tx'

export function useMintSomeTokens({ mintKeypair }: { mintKeypair: Keypair }) {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const { sendAndConfirmTx } = useSendAndConfirmTx()

	const { run, data, isLoading, error } = useAsync()

	const mintSomeTokens = useCallback(
		async (supply: number) => {
			if (!payer || !program) return

			// Derive the associated token address account for the mint and payer.
			const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
				mintKeypair.publicKey,
				payer.publicKey,
			)

			// Amount of tokens to mint.
			const amount = new anchor.BN(supply)

			const tx = await program.methods
				.mintToken(amount)
				.accounts({
					mintAuthority: payer.publicKey,
					recipient: payer.publicKey,
					mintAccount: mintKeypair.publicKey,
					associatedTokenAccount: associatedTokenAccountAddress,
				})
				.transaction()

			const txSig = await sendAndConfirmTx(tx)
			return txSig
		},
		[program, payer, sendAndConfirmTx, mintKeypair],
	)

	return {
		run,
		mintSomeTokens,
		data,
		isLoading,
		error,
	}
}
