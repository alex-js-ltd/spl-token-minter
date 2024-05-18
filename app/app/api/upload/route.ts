import { parseWithZod } from '@conform-to/zod'
import { ImageUpload } from '@/app/utils/schemas'

import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url)

	const submission = parseWithZod(searchParams, {
		schema: ImageUpload,
	})

	if (submission.status !== 'success' || !request.body) {
		return NextResponse.json(
			{ error: submission.reply().error },
			{ status: 500 },
		)
	}

	const { filename, name, symbol, description } = submission.value

	const blob = await put(filename, request.body, {
		access: 'public',
	})

	const metadata = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
			description,
		},
	})

	return NextResponse.json({ id: metadata.id })
}
