'use server'

import { parseWithZod } from '@conform-to/zod'
import { MetaData } from './schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'
import invariant from 'tiny-invariant'
import { program, connection } from '@/app/utils/setup'
import {
	Keypair,
	Transaction,
	Connection,
	TransactionMessage,
	PublicKey,
	VersionedTransaction,
} from '@solana/web3.js'

import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import * as anchor from '@coral-xyz/anchor'

export async function uploadMetadata(_prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: MetaData,
	})

	if (submission.status !== 'success') {
		return { ...submission.reply(), data: undefined }
	}

	const { image, name, symbol, description, decimals, supply, payer } =
		submission.value

	const blob = await put(image.name, image, { access: 'public' })

	invariant(blob, 'Failed to upload image')

	const metadata = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
			description,
		},
	})

	invariant(metadata, 'Failed to upload metadata')

	const mintKeypair = new Keypair()
	const uri = `https://spl-token-minter-theta.vercel.app/api/metadata/${metadata.id}`

	const createTx = await program.methods
		.createToken(decimals, name, symbol, uri)
		.accounts({
			payer: payer,
			mintAccount: mintKeypair.publicKey,
		})

		.instruction()

	const payerKey = new PublicKey(payer)

	const amount = new anchor.BN(supply)

	const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
		mintKeypair.publicKey,
		payerKey,
	)

	const mintTx = await program.methods
		.mintToken(amount)
		.accounts({
			mintAuthority: payer,
			recipient: payer,
			mintAccount: mintKeypair.publicKey,
			associatedTokenAccount: associatedTokenAccountAddress,
		})
		.instruction()

	let blockhash = await connection
		.getLatestBlockhash()
		.then(res => res.blockhash)

	const instructions = [createTx, mintTx]

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
		data: { transaction: serializedTransaction },
	}
}
