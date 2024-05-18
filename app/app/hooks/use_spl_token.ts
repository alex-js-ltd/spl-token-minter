import type { Transaction } from '@solana/web3.js'
import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useMemo } from 'react'
import { useEffect } from 'react'
import { useAsync } from './use_async'
import invariant from 'tiny-invariant'

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

	const { run, data: tx, isLoading, error } = useAsync<Transaction>()

	console.log('create spl token err', error)

	useEffect(() => {
		if (!data) return
		invariant(program)
		invariant(payer)
		invariant(mintKeypair)

		const uri = `${window.location.origin}/api/metadata/${data?.id}`
		const tx = program.methods
			.createToken(data.decimals, data.name, data.symbol, uri)
			.accounts({
				payer: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.transaction()

		run(tx)
	}, [run, data, program, payer, mintKeypair])

	return { tx, isLoading, mintKeypair }
}
