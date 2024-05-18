import type { Transaction } from '@solana/web3.js'
import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { useAsync } from './use_async'

type TokenData = {
	id?: string
	decimals?: number
	name?: string
	symbol?: string
}
export function useSplToken({ id, decimals, name, symbol }: TokenData) {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const mintKeypair = useMemo(() => new Keypair(), [])

	const createSplToken = useCallback(
		(decimals: number, name: string, symbol: string, uri: string) => {
			if (!program || !payer) return
			return program.methods
				.createToken(decimals, name, symbol, uri)
				.accounts({
					payer: payer.publicKey,
					mintAccount: mintKeypair.publicKey,
				})
				.transaction()
		},
		[program, payer, mintKeypair],
	)

	const { run, data } = useAsync<Transaction>()

	useEffect(() => {
		if (!decimals || !name || !symbol || !id) return
		const uri = `${window.location.origin}/api/metadata/${id}`
		const p = createSplToken(decimals, name, symbol, uri)
		if (p) run(p)
	}, [run, createSplToken, decimals, name, symbol, id])

	return { tx: data }
}
