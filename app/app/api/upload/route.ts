import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'

export async function POST(request: Request) {
	const { searchParams } = new URL(request.url)
	const filename = searchParams.get('filename')
	const name = searchParams.get('name')
	const symbol = searchParams.get('symbol')
	const description = searchParams.get('description')

	if (!filename || !name || !symbol || !description || !request.body) {
		return NextResponse.json(
			{ error: 'Missing search params' },
			{ status: 500 },
		)
	}

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
