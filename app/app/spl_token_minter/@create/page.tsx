'use client'

import { Input } from '@/app/comps/input'
import { Button } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'

import { useForm, getInputProps } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { MetaData } from '@/app/utils/schemas'

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

	return (
		<div className="z-10 m-auto flex w-full flex-col divide-zinc-600 overflow-hidden rounded-xl bg-gray-900 shadow-lg shadow-black/40 sm:max-w-xl">
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				noValidate
				className="relative z-10 h-full w-full min-w-0 bg-gray-900 p-3 md:pl-4"
			>
				<div className="relative flex w-full flex-1 items-center transition-all duration-300 flex-col gap-6">
					<div className="relative flex w-full min-w-0 flex-1 justify-between self-start">
						<Input
							{...getInputProps(fields.name, {
								type: 'text',
							})}
							placeholder="Name"
						/>
					</div>

					<div className="relative flex justify-end items-end w-full">
						<Button
							onClick={() => console.log('click')}
							disabled={currentValue ? false : true}
						>
							<Icon
								name="arrow-up"
								variant={currentValue ? 'white' : 'default'}
							/>
						</Button>
					</div>
				</div>
			</form>
		</div>
	)
}
