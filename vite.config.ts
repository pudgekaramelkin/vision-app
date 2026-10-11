import { sites } from './hosting/sites-vite-plugin';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { kitRoutes } from 'vite-plugin-kit-routes';
import type { KIT_ROUTES } from './src/constants/routes.ts';

export default defineConfig({
	plugins: [
		...(process.env.BUILD_TARGET === 'sites' ? [sites({ mockAuth: false })] : []),
		sveltekit(),
		kitRoutes<KIT_ROUTES>({
			generated_file_path: './src/constants/routes.ts',

			routes_path: './src/routes',
			default_type: 'string',
			format_short: true
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
