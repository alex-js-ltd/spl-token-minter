import type { Transaction } from '@solana/web3.js'
import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { useAsync } from './use_async'
import { useSendAndConfirmTx } from './use_send_and_confirm_tx'
import { use } from 'react'

type TokenData = {
	id: string
	decimals: number
	name: string
	symbol: string
}
export function useSplToken({ data }: { data?: TokenData }) {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const mintKeypair = useMemo(() => new Keypair(), [])

	const createSplToken = useCallback(
		async (decimals: number, name: string, symbol: string, uri: string) => {
			if (!program || !payer) return
			try {
				const transaction = program.methods
					.createToken(decimals, name, symbol, uri)
					.accounts({
						payer: payer.publicKey,
						mintAccount: mintKeypair.publicKey,
					})
					.transaction()
				return transaction
			} catch (error) {
				console.error('Error creating SPL token:', error)
				throw error
			}
		},
		[program, payer, mintKeypair],
	)

	const { run, data: tx, isLoading } = useAsync()

	const { decimals, name, symbol, id } = data ?? {}

	const { sendAndConfirmTx } = useSendAndConfirmTx()

	useEffect(() => {
		if (!decimals || !name || !symbol || !id) return
		const uri = `${window.location.origin}/api/metadata/${id}`
		createSplToken(decimals, name, symbol, uri).then(tx => {
			if (tx) run(sendAndConfirmTx(tx, [mintKeypair]))
			return tx
		})
	}, [
		run,
		createSplToken,
		decimals,
		name,
		symbol,
		id,
		mintKeypair,
		sendAndConfirmTx,
	])

	return { tx, isLoading }
}
