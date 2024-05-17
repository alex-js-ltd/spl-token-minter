'use client'

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
import { useRef, useCallback } from 'react'
import { useSendAndConfirmTransaction } from './hooks/use_send_and_confirm_tx'
import { getEnv } from './utils/env'
import { SubmitButton } from './comps/submit_button'

const { CLUSTER } = getEnv()

export default function Page() {
	const { run, data: transactionSignature, isLoading } = useAsync()

	const { createSplToken, mintSomeTokens, mintKeypair } = useSplTokenMinter()

	const { sendAndConfirmTx } = useSendAndConfirmTransaction()

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			console.log(formData)
			return parseWithZod(formData, { schema: MetaData })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onSubmit',

		async onSubmit(e, { formData }) {
			e.preventDefault()

			const submission = parseWithZod(formData, {
				schema: MetaData,
			})

			if (submission.status !== 'success') {
				return submission.reply()
			}

			const { image, name, symbol, description, decimals } = submission.value

			const { id } = await imageUpload(image, name, symbol, description)

			const uri = `${window.location.origin}/api/metadata/${id}`

			const tx = await createSplToken(decimals, name, symbol, uri)

			if (!tx) return

			run(sendAndConfirmTx(tx, [mintKeypair]))
		},
	})

	const href = transactionSignature
		? `https://explorer.solana.com/tx/${transactionSignature}?cluster=${CLUSTER}`
		: undefined

	const [previewImage, setPreviewImage] = useState<string | undefined>(
		undefined,
	)

	const fileRef = useRef<HTMLInputElement>(null)

	const clearPreviewImage = useCallback(() => {
		if (fileRef.current) {
			fileRef.current.value = ''
			setPreviewImage(undefined)
		}
	}, [])

	return (
		<>
			<div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<PreviewImage
					src={previewImage}
					clearPreviewImage={clearPreviewImage}
					errors={fields.image.errors}
				/>

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
								errors={fields.name.errors}
							/>

							<Field
								inputProps={{
									...getInputProps(fields.symbol, {
										type: 'text',
									}),
									placeholder: 'Symbol',
								}}
								errors={fields.symbol.errors}
							/>

							<Field
								inputProps={{
									...getInputProps(fields.decimals, {
										type: 'number',
									}),
									placeholder: 'Decimals',
								}}
								errors={fields.decimals.errors}
							/>

							<Field
								inputProps={{
									...getInputProps(fields.description, {
										type: 'text',
									}),
									placeholder: 'Description',
									className: 'sm:col-span-3 w-full',
								}}
								errors={fields.description.errors}
							/>
						</div>

						<div className="flex w-full gap-2 px-3 md:px-4">
							<div className="flex flex-1 gap-1 sm:gap-2">
								<ImageChooser
									name={fields.image.name}
									setPreviewImage={setPreviewImage}
									fileRef={fileRef}
								/>
							</div>

							<SubmitButton isLoading={isLoading} />
						</div>
					</div>
				</form>
			</div>

			<div className="z-10 m-auto flex w-full flex-col overflow-hidden sm:max-w-xl">
				{isLoading ? (
					<AnchorTag className="ml-auto">...loading</AnchorTag>
				) : null}
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
