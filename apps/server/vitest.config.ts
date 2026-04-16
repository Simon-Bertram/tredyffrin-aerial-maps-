import { defineConfig } from 'vitest/config'
import { cloudflareTest } from '@cloudflare/vitest-pool-workers'

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: {
				configPath: './wrangler.toml',
			},
			miniflare: {
				d1Databases: ['DB'],
				bindings: {
					CORS_ORIGIN: 'http://localhost:4321',
				},
			},
		}),
	],
	test: {
		include: ['src/**/*.spec.ts'],
		setupFiles: ['./test/setup.ts'],
	},
})
