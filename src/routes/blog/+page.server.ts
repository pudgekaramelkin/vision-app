import db from '$db';
export const load = async () => {
	return { posts: (await db.prepare('SELECT id, title FROM posts').all()) as any[] };
};
