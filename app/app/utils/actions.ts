'use server'

import { parseWithZod } from '@conform-to/zod'
import { TokenSchema } from './schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import invariant from 'tiny-invariant'
import { program, connection } from '@/app/utils/setup'
import {
	TransactionMessage,
	PublicKey,
	VersionedTransaction,
} from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import * as anchor from '@coral-xyz/anchor'

export async function createSplToken(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: TokenSchema,
	})

	if (submission.status !== 'success') {
		return { ...submission.reply(), serializedTransaction: undefined }
	}

	const { image, name, symbol, description, decimals, supply, payer } =
		submission.value

	const blob = await put(image.name, image, { access: 'public' })

	invariant(blob, 'Failed to upload image')

	const upload = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
			description,
		},
	})

	invariant(upload, 'Failed to upload metadata')

	const metadata = {
		name,
		symbol,
		uri: `https://spl-token-minter-theta.vercel.app/api/metadata/${upload.id}`,
	}

	const mintKeypair = new anchor.web3.Keypair()

	const payerKey = new PublicKey(payer)

	const createToken = await program.methods
		.createToken(decimals, metadata.name, metadata.symbol, metadata.uri)
		.accounts({ mintAccount: mintKeypair.publicKey, payer: payerKey })
		.instruction()

	// Derive the associated token address account for the mint and payer.
	const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
		mintKeypair.publicKey,
		payerKey,
	)

	// Amount of tokens to mint.
	const amount = new anchor.BN(supply)

	// Mint the tokens to the associated token account.
	const mint = await program.methods
		.mintToken(amount)
		.accounts({
			mintAuthority: payerKey,
			recipient: payerKey,
			mintAccount: mintKeypair.publicKey,
			associatedTokenAccount: associatedTokenAccountAddress,
		})
		.instruction()

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const instructions = [createToken, mint]

	const messageV0 = new TransactionMessage({
		payerKey,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message()

	const transaction = new VersionedTransaction(messageV0)

	transaction.sign([mintKeypair])

	const serializedTransaction = transaction.serialize()

	return {
		...submission.reply(),
		serializedTransaction,
	}
}
