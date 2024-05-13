import { useState, useCallback } from 'react'

export function useSteps() {
	const [step, setStep] = useState(0)

	const next = useCallback(() => {
		setStep(prev => {
			if (prev === 3) {
				return prev
			}
			return prev + 1
		})
	}, [])

	return { step, next }
}
