import Database from 'better-sqlite3';

import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const databasePath = process.env.DATABASE_PATH || 'data/vision.db';
mkdirSync(dirname(databasePath), { recursive: true });
const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user');
  CREATE TABLE IF NOT EXISTS vision_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, left_eye REAL, right_eye REAL, astigmatism TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS tests (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT);
  CREATE TABLE IF NOT EXISTS test_results (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, test_id INTEGER, score INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  CREATE TABLE IF NOT EXISTS questions (id INTEGER PRIMARY KEY AUTOINCREMENT, test_id INTEGER, question_text TEXT, image_url TEXT, answer TEXT);
`);

db.exec(`
 CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
 CREATE TABLE IF NOT EXISTS auth_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
`);

const testCount = db.prepare('SELECT COUNT(*) as count FROM tests').get() as { count: number };
if (testCount.count === 0) {
	const info = db
		.prepare(
			"INSERT INTO tests (title, description) VALUES ('Смешанный тест', 'Проверка на дальтонизм и теорию')"
		)
		.run();
	const testId = info.lastInsertRowid;
	db.prepare(
		"INSERT INTO questions (test_id, question_text, image_url, answer) VALUES (?, 'Какое число вы видите?', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Ishihara_9.png', '74')"
	).run(testId);
	db.prepare(
		"INSERT INTO questions (test_id, question_text, image_url, answer) VALUES (?, 'Сколько глаз у обычного человека?', '', '2')"
	).run(testId);
}

export default db;

export async function initializeDatabase() {}
