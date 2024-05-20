'use client'

import { Keypair } from '@solana/web3.js'
import { useAsync } from '@/app/hooks/use_async'
import { useSendAndConfirmTx } from '@/app/hooks/use_send_and_confirm_tx'
import { useMintSomeTokens } from '../hooks/use_mint_some_tokens'
import { useCallback } from 'react'
import { Icon } from './_icon'

type MintButtonProps = {
	mintKeypair: Keypair
	supply: number
	symbol?: string
}

export function MintButton({ mintKeypair, symbol, supply }: MintButtonProps) {
	const { tx } = useMintSomeTokens({ mintKeypair, supply })
	const { run, data, isLoading, error } = useAsync()

	const { sendAndConfirmTx } = useSendAndConfirmTx()

	const handleClick = useCallback(() => {
		if (tx) run(sendAndConfirmTx(tx))
	}, [run, tx])

	console.log('mint', data)
	console.log('tx error for min program', error)

	return (
		<>
			<button
				disabled={isLoading}
				onClick={handleClick}
				className="ml-auto inline-flex select-none items-center gap-1 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-2 py-0.5 transition-colors hover:border-zinc-800"
			>
				Mint {symbol}
				<Icon name="mint" className="ml-1 w-[15px] h-[15px]" />
			</button>
		</>
	)
}
