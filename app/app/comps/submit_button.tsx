'use client'

import { Button, type ButtonProps } from '@/app/comps/button'
import { Icon } from '@/app/comps/_icon'
import { Spinner } from './spinner'
import { useAnchorWallet } from '@jup-ag/wallet-adapter'

type SubmitButtonProps = ButtonProps & { isLoading: boolean }

export function SubmitButton({ isLoading, ...rest }: SubmitButtonProps) {
	const wallet = useAnchorWallet()
	const { publicKey } = wallet || {}

	const disabled = isLoading || !publicKey ? true : false

	return (
		<Button type="submit" disabled={disabled} {...rest}>
			{isLoading ? <Spinner /> : <Icon name="arrow-up" className="w-6 h-6" />}
		</Button>
	)
}
