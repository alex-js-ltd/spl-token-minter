'use client'

import { useMemo, type ReactNode } from 'react'
import {
	ConnectionProvider,
	UnifiedWalletProvider,
	WalletAdapterNetwork,
} from '@jup-ag/wallet-adapter'
import { useNetworkConfiguration } from './network_context'
import { clusterApiUrl } from '@solana/web3.js'
import { getEnv } from '@/app/utils/env'

const { CLUSTER } = getEnv()

export function WalletProvider({ children }: { children: ReactNode }) {
	const { networkConfiguration } = useNetworkConfiguration()

	const network = networkConfiguration as WalletAdapterNetwork

	const selectedEndpoint: string = useMemo(
		() => 'https://api.devnet.solana.com' ?? clusterApiUrl(network),
		[network],
	)

	return (
		<ConnectionProvider endpoint={selectedEndpoint}>
			<UnifiedWalletProvider
				wallets={[]}
				config={{
					autoConnect: true,
					env: CLUSTER,
					metadata: {
						name: 'UnifiedWallet',
						description: 'UnifiedWallet',
						url: 'https://jup.ag',
						iconUrls: ['https://jup.ag/favicon.ico'],
					},

					walletlistExplanation: {
						href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
					},
					theme: 'light',
					lang: 'en',
				}}
			>
				{children}
			</UnifiedWalletProvider>
		</ConnectionProvider>
	)
}
