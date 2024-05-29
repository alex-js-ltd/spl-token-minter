import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import * as anchor from '@coral-xyz/anchor'

import { useEffect } from 'react'
import { useAsync } from '@/app/hooks/use_async'
import type { Transaction } from '@solana/web3.js'

import { program } from '@/app/utils/setup'

export function useMintSomeTokens({
	mintKeypair,
	supply,
	isSuccess,
}: {
	mintKeypair: Keypair
	supply?: number
	isSuccess: boolean
}) {
	const payer = useAnchorWallet()

	const { run, data: tx } = useAsync<Transaction>()

	useEffect(() => {
		if (!payer || !program || !supply || !isSuccess) return

		// Derive the associated token address account for the mint and payer.
		const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
			mintKeypair.publicKey,
			payer.publicKey,
		)

		// Amount of tokens to mint.
		const amount = new anchor.BN(supply)

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
	}, [payer, program, supply, run, isSuccess])

	return { tx }
}
