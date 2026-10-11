import db from '$db';
import type { Question, Test } from '$types/test';
import { redirect, error, fail } from '@sveltejs/kit';
import { scoreAnswers } from '$server/validation';
export const load = async ({ params }) => {
	const test = await db.prepare<unknown[], Test>('SELECT * FROM tests WHERE id = ?').get(params.id);
	if (!test) error(404, 'Тест не найден');
	const questions = await db
		.prepare<
			unknown[],
			Omit<Question, 'answer'>
		>('SELECT id, test_id, question_text, image_url FROM questions WHERE test_id = ? ORDER BY id')
		.all(params.id);
	return { test, questions };
};
export const actions = {
	save: async ({ request, params, locals }) => {
		if (!locals.user) redirect(303, '/login');
		const questions = await db
			.prepare<unknown[], Question>('SELECT * FROM questions WHERE test_id = ? ORDER BY id')
			.all(params.id);
		const score = scoreAnswers(questions, await request.formData());
		if (score === null) return fail(400, { error: 'Ответьте на все вопросы перед сохранением.' });
		await db
			.prepare('INSERT INTO test_results (user_id, test_id, score) VALUES (?, ?, ?)')
			.run(locals.user.id, params.id, score);
		redirect(303, '/dashboard');
	}
};
