'use client'

import { Input } from '@/app/comps/input'
import { Button } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'

import { useForm, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { MetaData } from '@/app/utils/schemas'
import { useSteps } from '@/app/hooks/use_steps'
import { useAsync } from '@/app/hooks/use_async'
import { useSplTokenMinter } from '@/app/hooks/use_spl_token_minter'
import { AnchorTag } from '@/app/comps/anchor_tag'
import { UploadButton } from '@/app/comps/upload_button'

export default function Page() {
	const [form, fields] = useForm({
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			console.log(formData)
			return parseWithZod(formData, { schema: MetaData })
		},

		// Validate the form on blur event triggered
		shouldValidate: 'onBlur',
	})

	const currentValue = true

	const { step, next } = useSteps()

	const {
		run,
		data: transactionSignature,
		isLoading,
	} = useAsync<string | undefined>()

	const { createSplToken } = useSplTokenMinter()

	const href = transactionSignature
		? `https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
		: undefined

	return (
		<>
			<div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
				<form
					id={form.id}
					onSubmit={form.onSubmit}
					noValidate
					className="relative z-10 h-full w-full min-w-0 bg-gray-900 p-3 md:pl-4"
					action={(formData: FormData) => {
						const submission = parseWithZod(formData, {
							schema: MetaData,
						})

						if (submission.status !== 'success') {
							return submission.reply()
						}

						const metadata = submission.value

						run(createSplToken(metadata))
					}}
				>
					<div className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
						<div className="relative flex w-full min-w-0 flex-1 justify-between self-start min-h-[1.5rem]">
							<Input
								{...getInputProps(fields.name, {
									type: 'text',
								})}
								placeholder="Name"
								variant={step === 0 ? 'default' : 'hidden'}
							/>

							<Input
								{...getInputProps(fields.symbol, {
									type: 'text',
								})}
								placeholder="Symbol"
								variant={step === 1 ? 'default' : 'hidden'}
							/>

							<Input
								{...getInputProps(fields.decimals, {
									type: 'text',
								})}
								placeholder="Decimals"
								variant={step === 2 ? 'default' : 'hidden'}
							/>
						</div>

						<div className="relative flex justify-between items-end w-full">
							<UploadButton />
							<Button
								onClick={next}
								disabled={isLoading ? true : false}
								className="ml-auto"
							>
								<Icon name="arrow-up" className="w-6 h-6" />
							</Button>
						</div>
					</div>
				</form>
			</div>

			<div className="z-10 m-auto flex w-full flex-col overflow-hidden sm:max-w-xl">
				{href ? (
					<AnchorTag className="ml-auto" href={href}>
						view transaction
					</AnchorTag>
				) : null}
			</div>
		</>
	)
}
