import { redirect } from '@sveltejs/kit';
import db from '$db';
import { csvCell } from '$server/validation';
export const GET = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	const rows = await db
		.prepare<
			unknown[],
			{ created_at: string; left_eye: number; right_eye: number; astigmatism: string }
		>('SELECT created_at, left_eye, right_eye, astigmatism FROM vision_logs WHERE user_id = ? ORDER BY created_at DESC')
		.all(locals.user.id);
	const csv = [
		['Дата (UTC)', 'Левый глаз', 'Правый глаз', 'Заметки'],
		...rows.map((r) => [r.created_at, r.left_eye, r.right_eye, r.astigmatism])
	]
		.map((row) => row.map(csvCell).join(','))
		.join('\r\n');
	return new Response('\uFEFF' + csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="vision-history.csv"',
			'Cache-Control': 'private, no-store'
		}
	});
};
