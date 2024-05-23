import type { Transaction, Signer } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'

export function useSendAndConfirmTx() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	const sendAndConfirmTx = useCallback(
		async (tx: Transaction, signers?: Signer[]) => {
			const txSig = await sendTransaction(tx, connection, {
				signers: signers ? [...signers] : undefined,
			})

			const { blockhash, lastValidBlockHeight } =
				await connection.getLatestBlockhash()

			await connection.confirmTransaction({
				blockhash,
				lastValidBlockHeight,
				signature: txSig,
			})

			return txSig
		},
		[connection, sendTransaction],
	)

	return { sendAndConfirmTx }
}
