import Database from 'better-sqlite3';
const username = process.argv[2];
if (!username) throw new Error('Usage: node scripts/promote-admin.mjs <registered-username>');
const db = new Database(process.env.DATABASE_PATH || 'data/vision.db', { fileMustExist: true });
const result = db.prepare("UPDATE users SET role = 'admin' WHERE username = ?").run(username);
if (result.changes !== 1) throw new Error('Registered user not found');
console.log('Administrator role assigned.');
db.close();
