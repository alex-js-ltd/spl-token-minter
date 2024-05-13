'use client' // Error components must be Client Components

import ErrorBoundary from '@/app/comps/error_boundary'

export default function Error(
	props: React.ComponentProps<typeof ErrorBoundary>,
) {
	return <ErrorBoundary {...props} />
}
