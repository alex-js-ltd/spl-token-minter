import { type SVGProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/misc'

const iconVariants = cva('inline self-center', {
	variants: {
		variant: {
			default: 'text-zinc-400',
			white: 'text-white',
		},
		size: {
			default: 'w-6 h-6',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

export interface IconProps
	extends SVGProps<SVGSVGElement>,
		VariantProps<typeof iconVariants> {
	name: string
}

export function Icon({
	className,
	variant,
	size,
	name = 'arrow-up',
	...props
}: IconProps) {
	return (
		<svg {...props} className={cn(iconVariants({ variant, size, className }))}>
			<use href={`/icons.svg#${name}`} />
		</svg>
	)
}

Icon.displayName = 'Icon'
