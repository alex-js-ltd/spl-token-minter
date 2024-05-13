/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			// Basic redirect
			{
				source: '/',
				destination: '/spl-token-minter',
				permanent: true,
			},
		]
	},
}

export default nextConfig
