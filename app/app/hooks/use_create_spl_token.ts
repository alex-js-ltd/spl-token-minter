import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { useAsync } from './use_async'
import { useSendAndConfirmTx } from './use_send_and_confirm_tx'

type TokenData = {
	id: string
	decimals: number
	name: string
	symbol: string
	supply: number
}

export function useCreateSplToken({ data }: { data?: TokenData }) {
	const program = useAnchorProgram()
	const payer = useAnchorWallet()

	const mintKeypair = useMemo(() => new Keypair(), [])

	const { sendAndConfirmTx } = useSendAndConfirmTx()

	const getTxProps = useCallback(() => {
		if (!data) return null

		const { id, ...rest } = data

		const localhost = window.location.hostname === 'localhost'

		const uri = localhost
			? `https://spl-token-minter-theta.vercel.app/api/metadata/${data?.id}`
			: `${window.location.origin}/api/metadata/${data?.id}`

		return { uri, ...rest }
	}, [data])

	const createSplToken = useCallback(async () => {
		const data = getTxProps()

		if (!data || !program || !payer) return

		const tx = await program.methods
			.createToken(data.decimals, data.name, data.symbol, data.uri)
			.accounts({
				payer: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.transaction()

		const txSig = sendAndConfirmTx(tx, [mintKeypair])

		return txSig
	}, [getTxProps, program, payer, sendAndConfirmTx, mintKeypair])

	const { run, data: txSig, isLoading, error, isSuccess } = useAsync()

	useEffect(() => {
		run(createSplToken())
	}, [run, createSplToken])

	return { txSig, isLoading, isSuccess, mintKeypair }
}
