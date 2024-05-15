type Data = { id: string }

export async function imageUpload(image: File, name: string, symbol: string) {
	const res = await fetch(
		`/api/upload?filename=${image.name}&name=${name}&symbol=${symbol}`,
		{
			method: 'POST',
			body: image,
		},
	)

	const data: Data = await res.json()

	return data
}
