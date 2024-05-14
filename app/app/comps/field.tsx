import { Input, type InputProps } from './input'

export function Field({ inputProps }: { inputProps: InputProps }) {
	return (
		<div className="w-full h-[69px]">
			<div className="flex w-full gap-2 border-b border-white border-opacity-[0.125] p-3">
				<Input {...inputProps} />
			</div>
		</div>
	)
}
