import { Input, type InputProps } from './input'
import { cn } from '../utils/misc'

export function Field({ inputProps }: { inputProps: InputProps }) {
	return (
		<div className={cn('w-full h-[69px]', inputProps.className)}>
			<div className="flex w-full gap-2 border-b border-white border-opacity-[0.125] p-3">
				<Input {...inputProps} />
			</div>
		</div>
	)
}
