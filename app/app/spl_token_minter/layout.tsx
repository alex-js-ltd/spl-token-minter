import type { ReactNode } from 'react'

type LayoutProps = {
	create: ReactNode
	mint: ReactNode
}

export default function Layout({ create, mint }: LayoutProps) {
	return (
		<>
			{create}
			{mint}
		</>
	)
}
