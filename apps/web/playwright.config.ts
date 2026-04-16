import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 60_000,
	use: {
		baseURL: 'http://127.0.0.1:4321',
		trace: 'on-first-retry',
	},
	webServer: [
		{
			command: 'pnpm run dev',
			cwd: '../server',
			url: 'http://localhost:3000',
			reuseExistingServer: true,
			timeout: 120_000,
		},
		{
			command: 'pnpm run build && pnpm run preview --host 127.0.0.1 --port 4321',
			cwd: '.',
			url: 'http://127.0.0.1:4321',
			reuseExistingServer: true,
			timeout: 180_000,
		},
	],
})
