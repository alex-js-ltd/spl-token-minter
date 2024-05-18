import { parseWithZod } from '@conform-to/zod'
import { ImageUpload } from '@/app/utils/schemas'
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'
import { invariantResponse } from '@/app/utils/misc'

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url)

	const submission = parseWithZod(searchParams, {
		schema: ImageUpload,
	})

	invariantResponse(submission.status === 'success', 'Missing search params', {
		status: 404,
	})

	invariantResponse(request.body, 'Missing image file', { status: 404 })

	const { filename, name, symbol, description } = submission.value

	const blob = await put(filename, request.body, {
		access: 'public',
	})

	invariantResponse(blob, 'Failed to upload image', { status: 500 })

	const metadata = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
			description,
		},
	})

	invariantResponse(metadata, 'Failed to store token metadata', { status: 500 })

	return NextResponse.json({ id: metadata.id })
}
