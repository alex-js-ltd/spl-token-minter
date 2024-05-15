import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
	const { searchParams } = new URL(request.url)
	const filename = searchParams.get('filename')

	console.log('filename', filename)
	if (!filename || !request.body) return NextResponse.json({})

	const blob = await put(filename, request.body, {
		access: 'public',
	})

	console.log('blob', blob)

	return NextResponse.json(blob)
}
