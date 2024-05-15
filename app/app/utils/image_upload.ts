import { MetaData } from './schemas'
import { z } from 'zod'

export async function imageUpload(metadata: z.infer<typeof MetaData>) {
	const res = await fetch(
		`/api/upload?filename=${metadata.image.name}&name=${metadata.name}&symbol=${metadata.symbol}`,
		{
			method: 'POST',
			body: metadata.image,
		},
	)

	console.log(res)

	return res
}
