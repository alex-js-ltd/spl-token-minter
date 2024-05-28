import { useAnchorProgram } from './use_anchor_program'
import { Keypair } from '@solana/web3.js'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'
import { useAsync } from '@/app/hooks/use_async'
import { useCallback } from 'react'
import { useSendAndConfirmTx } from './use_send_and_confirm_tx'

export function useRevokeMintAuth({ mintKeypair }: { mintKeypair: Keypair }) {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	const { sendAndConfirmTx } = useSendAndConfirmTx()

	const { run, data, isLoading, error } = useAsync()

	const revokeMintAuth = useCallback(async () => {
		if (!program || !payer) return

		const tx = await program.methods
			.revoke()
			.accounts({
				mintAuthority: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.transaction()

		return await sendAndConfirmTx(tx)
	}, [program, payer, sendAndConfirmTx])

	return { run, data, isLoading, error, revokeMintAuth }
}
