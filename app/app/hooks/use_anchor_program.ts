import { useMemo } from 'react'
import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor'
import { useAnchorWallet, useConnection } from '@jup-ag/wallet-adapter'
import type { SplTokenMinter } from '@/app/types/spl_token_minter'
import idlFile from '@/app/idl/spl_token_minter.json'

export function useAnchorProgram() {
	const { connection } = useConnection()
	const wallet = useAnchorWallet()
	return useMemo(() => {
		if (!wallet) return
		const idl = idlFile as Idl
		const provider = new AnchorProvider(connection, wallet, {})
		const programInstance = new Program(
			idl,
			provider,
		) as unknown as Program<SplTokenMinter>
		return programInstance
	}, [wallet, connection])
}
