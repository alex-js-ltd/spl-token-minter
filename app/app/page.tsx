'use client'
import Image from 'next/image'
import { useAnchorProgram } from '@/app/utils/useAnchorProgram'
import { Keypair } from '@solana/web3.js'
import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from '@jup-ag/wallet-adapter'

import { ConnectWallet } from '@/app/comps/connect-wallet'

const metadata = {
	name: 'Solana Gold',
	symbol: 'GOLDSOL',
	uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
}

export default function Home() {
	const program = useAnchorProgram()

	const payer = useAnchorWallet()

	console.log('payer', payer)

	async function createSplToken() {
		if (!payer) return
		console.log('payer', payer)
		const mintKeypair = new Keypair()

		// SPL Token default = 9 decimals
		const transactionSignature = await program.methods
			.createToken(metadata.name, metadata.symbol, metadata.uri)
			.accounts({
				payer: payer.publicKey,
				mintAccount: mintKeypair.publicKey,
			})
			.signers([mintKeypair])
			.rpc()

		console.log('Success!')
		console.log(`   Mint Address: ${mintKeypair.publicKey}`)
		console.log(`   Transaction Signature: ${transactionSignature}`)
	}
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<button
				onClick={() => createSplToken()}
				className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
			>
				Get started by editing&nbsp;
				<code className="font-mono font-bold">app/page.tsx</code>
			</button>

			<ConnectWallet />
		</main>
	)
}
