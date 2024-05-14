'use client'

import { Icon } from '@/app/comps/_icon'
import { type FieldName } from '@conform-to/react'
import { useState } from 'react'

type Name = FieldName<
	File | undefined,
	{
		symbol: string
		name: string
		decimals: number
		file?: File | undefined
	},
	string[]
>

export function ImageChooser({ name }: { name: Name }) {
	const [previewImage, setPreviewImage] = useState<string | null>(null)

	console.log(name)

	return (
		<button className="cursor-default" type="button">
			<label
				className="shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex select-none gap-2 px-2 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3 relative"
				htmlFor="fileUpload"
			>
				<input
					className="absolute left-0 top-0 z-0 h-full w-full opacity-0"
					onChange={event => {
						const file = event.target.files?.[0]

						if (file) {
							const reader = new FileReader()
							reader.onloadend = () => {
								setPreviewImage(reader.result as string)
							}
							reader.readAsDataURL(file)
						} else {
							setPreviewImage(null)
						}
					}}
					accept="image/*"
					name={name}
					type="file"
				/>

				<Icon name="upload" className="h-4 w-4" />

				<span className="hidden sm:block">Image</span>
			</label>
		</button>
	)
}
