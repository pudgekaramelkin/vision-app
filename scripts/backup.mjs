import Database from 'better-sqlite3';
const output = process.argv[2];
if (!output) throw new Error('Usage: node scripts/backup.mjs <backup-path>');
const db = new Database(process.env.DATABASE_PATH || 'data/vision.db', { fileMustExist: true });
await db.backup(output);
db.close();
console.log('Consistent SQLite backup completed. Keep backups outside the service volume.');
