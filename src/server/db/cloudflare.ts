import { getRequestEvent } from '$app/server';
import type { D1Database } from '@cloudflare/workers-types';
const database = () =>
	(getRequestEvent().platform as unknown as { env: { DB: D1Database } }).env.DB;
const db = {
	prepare<_Params = unknown[], Row = Record<string, unknown>>(sql: string) {
		return {
			async get(...params: unknown[]): Promise<Row | undefined> {
				return (
					(await database()
						.prepare(sql)
						.bind(...params)
						.first<Row>()) ?? undefined
				);
			},
			async all(...params: unknown[]): Promise<Row[]> {
				return (
					await database()
						.prepare(sql)
						.bind(...params)
						.all<Row>()
				).results;
			},
			async run(...params: unknown[]) {
				const result = await database()
					.prepare(sql)
					.bind(...params)
					.run();
				return { lastInsertRowid: result.meta.last_row_id, changes: result.meta.changes };
			}
		};
	}
};
export default db;

let initialized = false;
export async function initializeDatabase() {
	if (initialized) return;
	const d1 = database();
	await d1.batch([
		d1.prepare(
			"INSERT INTO tests (id, title, description) SELECT 1, 'Внимание к зрению', 'Учебный тест: зрительное восприятие и базовые знания' WHERE NOT EXISTS (SELECT 1 FROM app_state WHERE key = 'initial_content') ON CONFLICT(id) DO NOTHING"
		),
		d1.prepare(
			"INSERT INTO questions (id, test_id, question_text, image_url, answer) SELECT 1, 1, 'Какое число вы видите?', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ishihara_9.png', '74' WHERE NOT EXISTS (SELECT 1 FROM app_state WHERE key = 'initial_content') ON CONFLICT(id) DO NOTHING"
		),
		d1.prepare(
			"INSERT INTO questions (id, test_id, question_text, image_url, answer) SELECT 2, 1, 'Сколько глаз у обычного человека?', '', '2' WHERE NOT EXISTS (SELECT 1 FROM app_state WHERE key = 'initial_content') ON CONFLICT(id) DO NOTHING"
		),
		d1.prepare("INSERT OR IGNORE INTO app_state (key) VALUES ('initial_content')")
	]);
	initialized = true;
}
