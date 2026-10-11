import db from '$db';
export const GET = async () => {
	await db.prepare('SELECT 1').get();
	return new Response('ok', { headers: { 'Cache-Control': 'no-store' } });
};
