'use server'

import { parseWithZod } from '@conform-to/zod'
import { MetaData } from './schemas'
import { put } from '@vercel/blob'
import { prisma } from '@/app/utils/db'

export async function uploadMetadata(prevState: unknown, formData: FormData) {
	const submission = parseWithZod(formData, {
		schema: MetaData,
	})

	if (submission.status !== 'success') {
		return { ...submission.reply(), data: undefined }
	}

	const { image, name, symbol, description, decimals } = submission.value

	const blob = await put(image.name, image, { access: 'public' })

	const metadata = await prisma.tokenMetaData.create({
		data: {
			name,
			symbol,
			image: blob.url,
			description,
		},
	})

	console.log(metadata)
	return {
		...submission.reply(),
		data: { decimals, name, symbol, id: metadata.id },
	}
}
