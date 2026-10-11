import { redirect } from '@sveltejs/kit';
import db from '$db';
import type { Post } from '$types/post';
import type { Question, Test } from '$types/test';

export const load = async ({ locals }) => {
	if (!locals.user || locals.user.role !== 'admin') throw redirect(302, '/');
	return {
		posts: await db.prepare<unknown[], Post>('SELECT * FROM posts').all(),
		tests: await db.prepare<unknown[], Test>('SELECT * FROM tests').all(),
		questions: await db.prepare<unknown[], Question>('SELECT * FROM questions').all() // Загружаем все вопросы
	};
};

export const actions = {
	// --- БЛОГ ---
	add_post: async ({ request }) => {
		const data = await request.formData();
		await db
			.prepare('INSERT INTO posts (title, content) VALUES (?, ?)')
			.run(data.get('title'), data.get('content'));
		return { success: 'Статья добавлена' };
	},
	edit_post: async ({ request }) => {
		const data = await request.formData();
		await db
			.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?')
			.run(data.get('title'), data.get('content'), data.get('id'));
		return { success: 'Статья обновлена' };
	},
	delete_post: async ({ request }) => {
		const data = await request.formData();
		await db.prepare('DELETE FROM posts WHERE id = ?').run(data.get('id'));
		return { success: 'Статья удалена' };
	},

	// --- ТЕСТЫ И ВОПРОСЫ ---
	add_test: async ({ request }) => {
		const data = await request.formData();
		await db
			.prepare('INSERT INTO tests (title, description) VALUES (?, ?)')
			.run(data.get('title'), data.get('description'));
		return { success: 'Тест создан' };
	},
	delete_test: async ({ request }) => {
		const data = await request.formData();
		const testId = data.get('id');
		// Очищаем все связи перед удалением самого теста
		await db.prepare('DELETE FROM test_results WHERE test_id = ?').run(testId);
		await db.prepare('DELETE FROM questions WHERE test_id = ?').run(testId);
		await db.prepare('DELETE FROM tests WHERE id = ?').run(testId);
		return { success: 'Тест и все его данные удалены' };
	},
	add_question: async ({ request }) => {
		const data = await request.formData();
		await db
			.prepare(
				'INSERT INTO questions (test_id, question_text, image_url, answer) VALUES (?, ?, ?, ?)'
			)
			.run(
				data.get('test_id'),
				data.get('question_text') || '',
				data.get('image_url') || '',
				data.get('answer')
			);
		return { success: 'Вопрос добавлен' };
	},
	edit_question: async ({ request }) => {
		const data = await request.formData();
		await db
			.prepare('UPDATE questions SET question_text = ?, image_url = ?, answer = ? WHERE id = ?')
			.run(
				data.get('question_text') || '',
				data.get('image_url') || '',
				data.get('answer'),
				data.get('id')
			);
		return { success: 'Вопрос обновлен' };
	},
	delete_question: async ({ request }) => {
		const data = await request.formData();
		await db.prepare('DELETE FROM questions WHERE id = ?').run(data.get('id'));
		return { success: 'Вопрос удален' };
	}
};
