import { Program } from '@coral-xyz/anchor'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'

import type { SplTokenMinter } from '@/app/types/spl_token_minter'
import IDL from '@/app/idl/spl_token_minter.json'

export const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.

export const program = new Program<SplTokenMinter>(IDL as SplTokenMinter, {
	connection,
})

export const [createTokenPDA] = PublicKey.findProgramAddressSync(
	[Buffer.from('createToken')],
	program.programId,
)
