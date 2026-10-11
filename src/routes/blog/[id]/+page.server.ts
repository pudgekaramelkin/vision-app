import db from '$db';
import type { Post } from '$types/post';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
export const load = async ({ params }) => {
	const post = await db.prepare<unknown[], Post>('SELECT * FROM posts WHERE id = ?').get(params.id);
	if (!post) error(404, 'Статья не найдена');
	return { post: { ...post, content: sanitizeHtml(await marked(post.content)) } };
};
