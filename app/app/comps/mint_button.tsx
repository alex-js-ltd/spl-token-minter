import { Keypair, type Transaction } from '@solana/web3.js'
import { useAsync } from '@/app/hooks/use_async'
import { useSendAndConfirmTx } from '@/app/hooks/use_send_and_confirm_tx'
import { useMintSomeTokens } from '../hooks/use_mint_some_tokens'
import { useCallback } from 'react'

export function MintButton({ mintKeypair }: { mintKeypair: Keypair }) {
	const { tx } = useMintSomeTokens({ mintKeypair })
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
				onClick={handleClick}
				className="ml-auto text-teal-300 text-sm text-decoration-line: underline"
			>
				mint tokens
			</button>

			<p className="ml-auto text-teal-300">{error?.message}</p>

			<p className="ml-auto text-teal-300">{isLoading ? '...loading' : null}</p>
		</>
	)
}
