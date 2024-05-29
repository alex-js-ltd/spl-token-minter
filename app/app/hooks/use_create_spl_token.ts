import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useCallback, useEffect } from 'react'

import { useAsync } from './use_async'
import type { Transaction } from '@solana/web3.js'

import { program } from '@/app/utils/setup'

type TokenData = {
	id: string
	decimals: number
	name: string
	symbol: string
	supply: number
}

export function useCreateSplToken({
	data,
	mintKeypair,
}: {
	data?: TokenData
	mintKeypair: Keypair
}) {
	const payer = useAnchorWallet()

	const getTxProps = useCallback(() => {
		if (!data) return null

		const { id, ...rest } = data

		const localhost = window.location.hostname === 'localhost'

		const uri = localhost
			? `https://spl-token-minter-theta.vercel.app/api/metadata/${data?.id}`
			: `${window.location.origin}/api/metadata/${data?.id}`

		return { uri, ...rest }
	}, [data])

	const { run, data: tx, isSuccess } = useAsync<Transaction>()

	useEffect(() => {
		const data = getTxProps()

		if (!data || !program || !payer) return

		const tx = program.methods
			.createToken(data.decimals, data.name, data.symbol, data.uri)
			.accounts({
				payer: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})

			.transaction()

		run(tx)
	}, [getTxProps, program, payer, run])

	return { tx, isSuccess }
}
