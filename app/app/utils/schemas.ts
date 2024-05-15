import { z } from 'zod'

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const MetaData = z.object({
	name: z.string(),
	symbol: z.string(),
	description: z.string(),
	image: z.instanceof(File).refine(file => {
		return !file || file.size <= MAX_UPLOAD_SIZE
	}, 'File size must be less than 3MB'),
	decimals: z.number(),
})
