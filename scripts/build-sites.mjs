import { spawnSync } from 'node:child_process';
import { mkdir, cp, rm, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const run = (args, env = {}) => {
	const r = spawnSync(process.execPath, args, {
		stdio: 'inherit',
		env: { ...process.env, ...env }
	});
	if (r.status !== 0) process.exit(r.status || 1);
};
await rm('dist', { recursive: true, force: true });
run(['node_modules/vite/bin/vite.js', 'build'], { BUILD_TARGET: 'sites' });
await mkdir('dist/client', { recursive: true });
for (const entry of await readdir('.svelte-kit/cloudflare')) {
	if (['_worker.js', '_routes.json', '_headers', '_redirects'].includes(entry)) continue;
	await cp(resolve('.svelte-kit/cloudflare', entry), resolve('dist/client', entry), {
		recursive: true
	});
}
run(['node_modules/wrangler/bin/wrangler.js', 'deploy', 'hosting/worker.ts', '--dry-run', '--outdir', 'dist/server']);
await cp('dist/server/worker.js', 'dist/server/index.js');
await rm('dist/server/worker.js');
await writeFile(
	'dist/server/wrangler.json',
	JSON.stringify({
		main: 'index.js',
		compatibility_date: '2026-05-15',
		compatibility_flags: ['nodejs_compat'],
		assets: { directory: '../client', binding: 'ASSETS' },
		d1_databases: [
			{
				binding: 'DB',
				database_name: 'vision-local',
				database_id: '00000000-0000-4000-8000-000000000000',
				migrations_dir: '../../drizzle'
			}
		]
	})
);
