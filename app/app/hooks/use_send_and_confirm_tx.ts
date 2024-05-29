import type { Transaction, Signer } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback } from 'react'
import { tryCatch } from 'ramda'

export function useSendAndConfirmTx() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	const sendAndConfirmTx = useCallback(
		async (tx: Transaction, signers?: Signer[]) => {
			try {
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
			} catch (error) {
				console.log(error)
			}
		},
		[connection, sendTransaction],
	)

	return { sendAndConfirmTx }
}
