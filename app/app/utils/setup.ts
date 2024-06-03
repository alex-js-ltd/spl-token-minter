import { Program } from '@coral-xyz/anchor'
import { Connection } from '@solana/web3.js'

import type { SplTokenMinter } from '@/app/types/spl_token_minter'
import IDL from '@/app/idl/spl_token_minter.json'
import { clusterApiUrl } from '@solana/web3.js'
import { getEnv } from './env'

const { CLUSTER } = getEnv()

export const connection = new Connection(clusterApiUrl(CLUSTER), 'confirmed')

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.

export const program = new Program<SplTokenMinter>(IDL as SplTokenMinter, {
	connection,
})
