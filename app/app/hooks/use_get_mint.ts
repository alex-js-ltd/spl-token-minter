import { getMint as mint } from '@solana/spl-token'
import { useCallback } from 'react'
import { useConnection } from '@jup-ag/wallet-adapter'
import { Keypair } from '@solana/web3.js'

export function useGetMint({ mintKeypair }: { mintKeypair: Keypair }) {
	const { connection } = useConnection()

	return useCallback(async () => {
		const res = await mint(connection, mintKeypair.publicKey)
		console.log(res)
	}, [connection])
}
