import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'

export async function POST(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url)
	const filename = searchParams.get('filename')
	const name = searchParams.get('name')
	const symbol = searchParams.get('symbol')

	if (!filename || !name || !symbol || !request.body)
		return NextResponse.json({})

	const blob = await put(filename, request.body, {
		access: 'public',
	})

	const newToken = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
		},
	})

	return NextResponse.json(blob)
}
