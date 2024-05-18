export async function imageUpload(
	image: File,
	name: string,
	symbol: string,
	description: string,
) {
	const res = await fetch(
		`/api/upload?filename=${image.name}&name=${name}&symbol=${symbol}&description=${description}`,
		{
			method: 'POST',
			body: image,
		},
	)

	const data: { id: string } = await res.json()

	if (res.ok) {
		return data
	} else {
		return Promise.reject(data)
	}
}
