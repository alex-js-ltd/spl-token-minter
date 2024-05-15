import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/db'

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
): Promise<NextResponse> {
	if (!params.id) return NextResponse.json({ status: 500 })

	const token = await prisma.tokenMetaData.findUnique({
		where: {
			id: params.id,
		},
	})

	if (!token) return NextResponse.json({})

	const { id, ...rest } = token

	return NextResponse.json({ ...rest })
}
