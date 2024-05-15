'use client'

import { Button } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { MetaData } from '@/app/utils/schemas'
import { useAsync } from '@/app/hooks/use_async'
import { useSplTokenMinter } from '@/app/hooks/use_spl_token_minter'
import { AnchorTag } from '@/app/comps/anchor_tag'
import { useState } from 'react'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { imageUpload } from './utils/image_upload'
import { MintButton } from './comps/mint_button'

export default function Page() {
	const {
		run,
		data: transactionSignature,
		isLoading,
	} = useAsync<string | undefined>()

	const { createSplToken, mintSomeTokens } = useSplTokenMinter()

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			console.log(formData)
			return parseWithZod(formData, { schema: MetaData })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',

		async onSubmit(e, { formData }) {
			e.preventDefault()

			const submission = parseWithZod(formData, {
				schema: MetaData,
			})

			if (submission.status !== 'success') {
				return submission.reply()
			}

			const { symbol, name, image } = submission.value

			const data = await imageUpload(image, name, symbol, 'test description')

			const uri = `${window.location.origin}/api/metadata/${data.id}`
			console.log(uri)
			run(createSplToken({ name, symbol, uri }))
		},
	})

	const href = transactionSignature
		? `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
		: undefined

	const [previewImage, setPreviewImage] = useState<string | undefined>(
		undefined,
	)

	return (
		<>
			<div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<PreviewImage src={previewImage} setPreviewImage={setPreviewImage} />

				<form
					className="relative z-10 h-full w-full min-w-0 bg-gray-900 py-3 md:py-4"
					{...getFormProps(form)}
				>
					<div className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
						<div className="relative grid grid-cols-1 sm:grid-cols-3 w-full">
							<Field
								inputProps={{
									...getInputProps(fields.name, {
										type: 'text',
									}),
									placeholder: 'Name',
								}}
							/>

							<Field
								inputProps={{
									...getInputProps(fields.symbol, {
										type: 'text',
									}),
									placeholder: 'Symbol',
								}}
							/>

							<Field
								inputProps={{
									...getInputProps(fields.decimals, {
										type: 'number',
									}),
									placeholder: 'Decimals',
								}}
							/>
						</div>

						<div className="flex w-full gap-2 px-3 md:px-4">
							<div className="flex flex-1 gap-1 sm:gap-2">
								<ImageChooser
									name={fields.image.name}
									setPreviewImage={setPreviewImage}
								/>
							</div>

							<Button
								disabled={isLoading ? true : false}
								className="ml-auto"
								type="submit"
							>
								<Icon name="arrow-up" className="w-6 h-6" />
							</Button>
						</div>
					</div>
				</form>
			</div>

			<div className="z-10 m-auto flex w-full flex-col overflow-hidden sm:max-w-xl">
				{href ? (
					<>
						<AnchorTag className="ml-auto" href={href}>
							view transaction
						</AnchorTag>

						<MintButton mintSomeTokens={mintSomeTokens} />
					</>
				) : null}
			</div>
		</>
	)
}
