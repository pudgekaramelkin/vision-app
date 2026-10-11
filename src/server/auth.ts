import { randomBytes, createHash } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import db from '$db';
import type { User } from '$types/user';

const lifetime = 60 * 60 * 24 * 7;
const digest = (token: string) => createHash('sha256').update(token).digest('hex');
export async function createSession(
	cookies: Cookies,
	userId: number | bigint | string,
	secure: boolean
) {
	const token = randomBytes(32).toString('hex');
	await db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
	await db
		.prepare('INSERT INTO sessions VALUES (?, ?, ?)')
		.run(digest(token), userId, Date.now() + lifetime * 1000);
	cookies.set('session', token, {
		path: '/',
		httpOnly: true,
		secure,
		sameSite: 'lax',
		maxAge: lifetime
	});
}
export async function getSession(token?: string) {
	if (!token || !/^[a-f0-9]{64}$/.test(token)) return undefined;
	return await db
		.prepare<
			unknown[],
			User
		>('SELECT users.id, users.role FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?')
		.get(digest(token), Date.now());
}
export async function revokeSession(cookies: Cookies) {
	const token = cookies.get('session');
	if (token) await db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(digest(token));
	cookies.delete('session', { path: '/' });
}
export async function allowAuth(key: string) {
	const now = Date.now();
	await db.prepare('DELETE FROM auth_attempts WHERE expires_at <= ?').run(now);
	const result = await db
		.prepare(
			'INSERT INTO auth_attempts VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 15'
		)
		.run(key, now + 15 * 60 * 1000);
	return result.changes > 0;
}
