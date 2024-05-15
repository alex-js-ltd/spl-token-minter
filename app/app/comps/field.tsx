import { Input, type InputProps } from './input'
import { cn } from '../utils/misc'

export type ListOfErrors = Array<string | null | undefined> | null | undefined

export function Field({
	inputProps,
	errors,
}: {
	inputProps: InputProps
	errors: ListOfErrors
}) {
	const id = inputProps.id
	const errorId = errors?.length ? `${id}-error` : undefined

	const border = errorId ? 'border-red-400 border-opacity-1' : 'border-white'

	return (
		<div className={cn('w-full h-[69px]', inputProps.className)}>
			<div
				className={cn(
					'flex w-full gap-2 border-b border-opacity-[0.125] p-3 transition duration-500 ease-in-out',
					border,
				)}
			>
				<Input
					id={id}
					aria-invalid={errorId ? true : undefined}
					aria-describedby={errorId}
					{...inputProps}
				/>
			</div>
		</div>
	)
}
