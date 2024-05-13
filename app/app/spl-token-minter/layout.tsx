import type { ReactNode } from 'react'

type LayoutProps = {
	createSplToken: ReactNode
	mintSomeTokens: ReactNode
}

export default function Layout({
	createSplToken,
	mintSomeTokens,
}: LayoutProps) {
	return (
		<>
			{createSplToken}
			{mintSomeTokens}
		</>
	)
}
