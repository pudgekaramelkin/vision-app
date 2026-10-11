import { defineConfig } from '@playwright/test';
export default defineConfig({
	testDir: './tests',
	testMatch: '**/*.e2e.ts',
	workers: 1,
	use: { baseURL: 'http://127.0.0.1:4173', headless: true },
	webServer: {
		command: process.env.TEST_SITES
			? 'node node_modules/wrangler/bin/wrangler.js dev --config dist/server/wrangler.json --local --port 4173 --persist-to .wrangler/e2e'
			: 'node build',
		url: 'http://127.0.0.1:4173/health',
		reuseExistingServer: false,
		env: {
			PORT: '4173',
			HOST: '127.0.0.1',
			ORIGIN: 'http://127.0.0.1:4173',
			DATABASE_PATH: `data/e2e-${Date.now()}.db`
		}
	}
});
