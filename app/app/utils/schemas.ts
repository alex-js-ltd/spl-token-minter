import { z } from 'zod'

export const MetaData = z.object({
	name: z.string(),
	symbol: z.string(),
	decimals: z.number(),
	uri: z.string(),
})
