import type { AnchorHTMLAttributes } from 'react'

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>

export function ExternaLink(props: ExternalLinkProps) {
	return (
		<a
			{...props}
			className="text-teal-300 text-sm"
			target="_blank"
			rel="noopener noreferrer"
		/>
	)
}
