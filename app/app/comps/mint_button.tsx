import { useAsync } from '../hooks/use_async'

export function MintButton({
	mintSomeTokens,
}: {
	mintSomeTokens: () => Promise<string | undefined>
}) {
	const { run, data } = useAsync()

	function onClick() {
		run(mintSomeTokens())
	}

	console.log('mint', data)

	return (
		<button
			onClick={() => onClick()}
			className="ml-auto text-teal-300 text-sm text-decoration-line: underline"
		>
			mint tokens
		</button>
	)
}
