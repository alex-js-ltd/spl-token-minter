import { z } from 'zod'

export const MetaData = z.object({
	name: z.string(),
	symbol: z.string(),
	decimals: z.number(),
	uri: z.string(),
})

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine(file => {
			return !file || file.size <= MAX_UPLOAD_SIZE
		}, 'File size must be less than 3MB'),
	altText: z.string().optional(),
})
