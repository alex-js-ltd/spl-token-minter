import { Icon } from './_icon'
import Image from 'next/image'

export function UploadButton() {
	return (
		<button data-state="closed" className="cursor-default" type="button">
			<label
				className="shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 items-center justify-center bg-transparent hover:bg-gray-800 focus-visible:bg-gray-800 focus-visible:ring-0 h-8 py-2 flex select-none gap-2 px-2 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3 cursor-pointer"
				data-id="prompt-form-image-upload"
				htmlFor="fileUpload"
			>
				<input className="sr-only" id="fileUpload" type="file" />

				<Icon name="upload" className="h-4 w-4" />

				<span className="hidden sm:block">Image</span>
			</label>
		</button>
	)
}
