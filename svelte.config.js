import node from '@sveltejs/adapter-node';
import cloudflare from '@sveltejs/adapter-cloudflare';
const hosted = process.env.BUILD_TARGET === 'sites';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: hosted ? cloudflare({ config: 'wrangler.jsonc' }) : node(),
		alias: {
			$components: 'src/components',
			$server: 'src/server',
			$db: hosted ? 'src/server/db/cloudflare.ts' : 'src/server/db/index.ts',
			$helpers: 'src/helpers',
			$types: 'src/types',
			$constants: 'src/constants',
			$pages: 'src/pages'
		}
	}
};

export default config;
