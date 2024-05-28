'use client'

import { Keypair } from '@solana/web3.js'
import { useMintSomeTokens } from '@/app/hooks/use_mint_some_tokens'
import { useRevokeMintAuth } from '@/app/hooks/use_revoke_mint_auth'
import { useGetMint } from '../hooks/use_get_mint'
import { Icon } from './_icon'

type MintButtonProps = {
	mintKeypair: Keypair
	supply: number
	symbol?: string
}

export function MintButton({ mintKeypair, symbol, supply }: MintButtonProps) {
	const { mintSomeTokens, run, isLoading } = useMintSomeTokens({ mintKeypair })

	const { revokeMintAuth } = useRevokeMintAuth({ mintKeypair })

	const getMint = useGetMint({ mintKeypair })

	return (
		<>
			<button
				disabled={isLoading}
				onClick={async () => {
					await run(mintSomeTokens(supply))
					await run(revokeMintAuth())

					const res = await run(getMint())
					console.log(res)
				}}
				className="ml-auto inline-flex select-none items-center gap-1 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-2 py-0.5 transition-colors hover:border-zinc-800"
			>
				Mint {symbol}
				<Icon name="mint" className="ml-1 w-[15px] h-[15px]" />
			</button>
		</>
	)
}
