import { useEffect, useState, useMemo } from 'react'
import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor'
import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from '@jup-ag/wallet-adapter'
import type { SplTokenMinter } from '@/app/types/spl_token_minter'
import idlFile from '@/app/idl/spl_token_minter.json'

export function useAnchorProgram(): Program<SplTokenMinter> {
	const { connection } = useConnection()
	const wallet = useAnchorWallet()
	const [program, setProgram] = useState<Program<SplTokenMinter> | null>(null)

	const idl = idlFile as Idl

	useEffect(() => {
		if (wallet) {
			const provider = new AnchorProvider(connection, wallet, {})
			const programInstance = new Program(idl, provider)
			setProgram(programInstance as unknown as Program<SplTokenMinter>)
		}
	}, [wallet, connection, idl])

	return program as Program<SplTokenMinter>
}
