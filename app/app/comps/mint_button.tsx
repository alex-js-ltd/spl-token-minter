import { type Transaction } from '@solana/web3.js'
import { useAsync } from '@/app/hooks/use_async'
import { useSendAndConfirmTransaction } from '@/app/hooks/use_send_and_confirm_tx'

export function MintButton({
	mintSomeTokens,
}: {
	mintSomeTokens: () => Promise<Transaction | undefined>
}) {
	const { run, data, isLoading, error } = useAsync()

	const { sendAndConfirmTx } = useSendAndConfirmTransaction()

	async function onClick() {
		const tx = await mintSomeTokens()
		if (tx) run(sendAndConfirmTx(tx))
	}

	console.log('mint', data)
	console.log(error)

	return (
		<button
			onClick={() => onClick()}
			className="ml-auto text-teal-300 text-sm text-decoration-line: underline"
		>
			mint tokens
		</button>
	)
}
