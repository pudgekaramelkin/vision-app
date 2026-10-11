import { parseVisionLog } from '$server/validation';
import { redirect, fail } from '@sveltejs/kit';
import db from '$db';
import type { Test, TestResult } from '$types/test';
import type { VisionLog } from '$types/vision';

export const load = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login');

	const tests = await db.prepare<unknown[], Test>('SELECT * FROM tests').all();
	// Добавили id в выборку, чтобы понимать, что удалять/редактировать
	const testResults = await db
		.prepare<
			unknown[],
			TestResult
		>('SELECT id, test_id, score, created_at FROM test_results WHERE user_id = ? ORDER BY created_at ASC')
		.all(locals.user.id);
	const visionLogs = await db
		.prepare<
			unknown[],
			VisionLog
		>('SELECT id, left_eye, right_eye, astigmatism, created_at FROM vision_logs WHERE user_id = ? ORDER BY created_at ASC')
		.all(locals.user.id);

	return { tests, testResults, visionLogs };
};

export const actions = {
	add_log: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const data = await request.formData();
		const log = parseVisionLog(data);
		if (!log)
			return fail(400, {
				error: 'Укажите числовые значения от −40 до 40 и заметку до 1000 символов.'
			});
		await db
			.prepare(
				'INSERT INTO vision_logs (user_id, left_eye, right_eye, astigmatism) VALUES (?, ?, ?, ?)'
			)
			.run(locals.user.id, log.leftEye, log.rightEye, log.notes);
		return { success: true };
	},
	delete_log: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const data = await request.formData();
		await db
			.prepare('DELETE FROM vision_logs WHERE id = ? AND user_id = ?')
			.run(data.get('id'), locals.user?.id);
		return { success: true };
	},
	edit_log: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const data = await request.formData();
		const log = parseVisionLog(data);
		if (!log)
			return fail(400, {
				error: 'Укажите числовые значения от −40 до 40 и заметку до 1000 символов.'
			});
		await db
			.prepare(
				'UPDATE vision_logs SET left_eye = ?, right_eye = ?, astigmatism = ? WHERE id = ? AND user_id = ?'
			)
			.run(log.leftEye, log.rightEye, log.notes, data.get('id'), locals.user?.id);
		return { success: true };
	},
	delete_test: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const data = await request.formData();
		await db
			.prepare('DELETE FROM test_results WHERE id = ? AND user_id = ?')
			.run(data.get('id'), locals.user?.id);
		return { success: true };
	}
};
