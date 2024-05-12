'use client'

import { useSplTokenMinter } from '@/app/hooks/useSplTokenMinter'

export default function Home() {
	const { createSplToken, mintSomeTokens } = useSplTokenMinter()

	return (
		<div className="flex items-center justify-between p-24">
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => createSplToken()}
			>
				Create Token
			</button>

			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => mintSomeTokens()}
			>
				Mint Token
			</button>
		</div>
	)
}
