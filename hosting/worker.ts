// Sites isolates do not expose Cloudflare's default cache. Keep all personal
// responses on SvelteKit's request path; the host serves immutable client assets.
import { Server } from '../.svelte-kit/output/server/index.js';
import { manifest } from '../.svelte-kit/cloudflare-tmp/manifest.js';
import type { D1Database, ExecutionContext, Fetcher } from '@cloudflare/workers-types';
const server = new Server(manifest);
let initialized: Promise<void> | undefined;
export default {
 async fetch(request: Request, env: { DB: D1Database; ASSETS?: Fetcher }, ctx: ExecutionContext) {
  initialized ??= server.init({ env });
  await initialized;
  const path = new URL(request.url).pathname.slice(1);
  if (env.ASSETS && (path.startsWith('_app/') || manifest.assets.has(path))) return env.ASSETS.fetch(request);
  return server.respond(request, {
   platform: { env, ctx },
   getClientAddress: () => request.headers.get('cf-connecting-ip') || 'unknown'
  });
 }
};
