/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			// Basic redirect
			{
				source: '/',
				destination: '/spl_token_minter',
				permanent: true,
			},
		]
	},
}

export default nextConfig
