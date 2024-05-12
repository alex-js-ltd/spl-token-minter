'use client'

import type { ReactNode } from 'react'
import { NetworkProvider } from './network-context'
import { WalletProvider } from './wallet-context'

export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<NetworkProvider>
			<WalletProvider>{children}</WalletProvider>
		</NetworkProvider>
	)
}
