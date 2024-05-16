'use client'

import type { ListOfErrors } from './field'
import { cn } from '../utils/misc'

type PreviewImageProps = {
	src: string | undefined
	clearPreviewImage: () => void
	errors: ListOfErrors
}

export function PreviewImage({
	src,
	clearPreviewImage,
	errors,
}: PreviewImageProps) {
	const error = errors?.length ? true : false
	const border = error && !src ? 'border-red-400' : 'border-white/10'

	return (
		<div className="w-full h-[69px]">
			<div
				className={
					'flex w-full gap-2 border-b border-white border-opacity-[0.125] p-3'
				}
			>
				<div
					className={cn(
						'group relative h-[44px] w-[48px] shrink-0 rounded-lg border transition-all duration-500 ease-in-out',
						border,
					)}
				>
					{src ? (
						<>
							<button
								className="inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm absolute -right-1.5 -top-1.5 z-10 h-4 w-4 rounded-full border border-gray-900 bg-gray-100 text-gray-900 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100"
								data-id="prompt-form-image-remove-button"
								data-state="closed"
								onClick={() => clearPreviewImage()}
							>
								<span className="sr-only">Remove image</span>
								<svg
									className="h-2.5 w-2.5"
									fill="currentColor"
									viewBox="0 0 256 256"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"></path>
								</svg>
							</button>
							<div className="overflow-hidden rounded-lg group-hover:opacity-80">
								<img
									alt="your uploaded image"
									className="relative aspect-[48/44] object-cover object-center"
									data-id="prompt-form-image-preview-image"
									src={src}
								/>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	)
}
