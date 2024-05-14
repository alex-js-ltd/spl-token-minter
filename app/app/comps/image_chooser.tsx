'use client'

import { Icon } from '@/app/comps/_icon'
import { type FieldName } from '@conform-to/react'
import { useState } from 'react'
import { cn } from '../utils/misc'

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
		<label
			className="shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex w-fit select-none gap-2 px-2 text-white/70 hover:text-white sm:w-24 sm:px-3"
			data-id="prompt-form-image-upload"
			htmlFor="fileUpload"
		>
			<input
				className="absolute z-0 opacity-0 border border-red-400 w-full h-full"
				id="fileUpload"
				type="file"
			/>

			<Icon name="upload" className="h-4 w-4" />
			<span className="hidden sm:block">Image</span>
		</label>
	)
}
