import type { Transaction, Signer } from '@solana/web3.js'
import { useConnection, useWallet } from '@jup-ag/wallet-adapter'

export function useSendAndConfirmTransaction() {
	const { connection } = useConnection()

	const { sendTransaction } = useWallet()

	async function sendAndConfirmTx(tx: Transaction, signers?: Signer[]) {
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
	}

	return { sendAndConfirmTx }
}
