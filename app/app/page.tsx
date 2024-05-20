'use client'

import { useForm, getFormProps, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'

import { MetaData } from '@/app/utils/schemas'
import { useAsync } from '@/app/hooks/use_async'
import { useState } from 'react'
import { ImageChooser } from '@/app/comps/image_chooser'
import { PreviewImage } from '@/app/comps/preview_image'
import { Field } from '@/app/comps/field'
import { MintButton } from './comps/mint_button'
import { useRef, useCallback } from 'react'
import { useSendAndConfirmTx } from './hooks/use_send_and_confirm_tx'
import { getEnv } from './utils/env'
import { SubmitButton } from './comps/submit_button'

import { uploadMetadata } from '@/app/utils/actions'
import { useFormState } from 'react-dom'
import { useEffect } from 'react'
import { useCreateSplToken } from '@/app/hooks/use_create_spl_token'
import { AnchorTag } from './comps/anchor_tag'

const { CLUSTER } = getEnv()

const initialState = {
	data: undefined,
}

export default function Page() {
	const [lastResult, action] = useFormState(uploadMetadata, initialState)

	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: MetaData })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onSubmit',

		lastResult,
	})

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

	const { data } = lastResult
	const { tx, mintKeypair } = useCreateSplToken({ data })
	const { sendAndConfirmTx } = useSendAndConfirmTx()
	const { run, isLoading, isSuccess, data: txSig } = useAsync()

	useEffect(() => {
		if (tx) run(sendAndConfirmTx(tx, [mintKeypair]))
	}, [run, sendAndConfirmTx, tx, mintKeypair])

	const href = txSig
		? `https://explorer.solana.com/tx/${txSig}?cluster=${CLUSTER}`
		: undefined

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
					action={action}
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

			<div className="z-10 m-auto flex w-full flex-col gap-3 overflow-hidden sm:max-w-xl">
				{href ? (
					<AnchorTag href={href} className="ml-auto">
						view transaction
					</AnchorTag>
				) : null}
				{isSuccess ? (
					<MintButton mintKeypair={mintKeypair} symbol={data?.symbol} />
				) : null}
			</div>
		</>
	)
}
