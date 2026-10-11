import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const users = sqliteTable('users', {
	id: integer().primaryKey({ autoIncrement: true }),
	username: text().unique(),
	password: text(),
	role: text().default('user')
});
export const visionLogs = sqliteTable('vision_logs', {
	id: integer().primaryKey({ autoIncrement: true }),
	user_id: integer(),
	left_eye: real(),
	right_eye: real(),
	astigmatism: text(),
	created_at: text().default(sql`CURRENT_TIMESTAMP`)
});
export const posts = sqliteTable('posts', {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text(),
	content: text(),
	created_at: text().default(sql`CURRENT_TIMESTAMP`)
});
export const tests = sqliteTable('tests', {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text(),
	description: text()
});
export const testResults = sqliteTable('test_results', {
	id: integer().primaryKey({ autoIncrement: true }),
	user_id: integer(),
	test_id: integer(),
	score: integer(),
	created_at: text().default(sql`CURRENT_TIMESTAMP`)
});
export const questions = sqliteTable('questions', {
	id: integer().primaryKey({ autoIncrement: true }),
	test_id: integer(),
	question_text: text(),
	image_url: text(),
	answer: text()
});
export const sessions = sqliteTable(
	'sessions',
	{
		token_hash: text().primaryKey(),
		user_id: integer().notNull(),
		expires_at: integer().notNull()
	},
	(table) => [index('sessions_user').on(table.user_id)]
);
export const authAttempts = sqliteTable('auth_attempts', {
	key: text().primaryKey(),
	count: integer().notNull(),
	expires_at: integer().notNull()
});

export const appState = sqliteTable('app_state', { key: text().primaryKey() });
