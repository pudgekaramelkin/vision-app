import { redirect, fail } from '@sveltejs/kit';
import db from '$db';
import bcrypt from 'bcryptjs';
import { allowAuth, createSession } from '$server/auth';
import type { Actions } from './$types';
export const actions: Actions = {
	default: async ({ request, cookies, url, getClientAddress }) => {
		if (!(await allowAuth(getClientAddress())))
			return fail(429, { error: 'Слишком много попыток. Попробуйте через 15 минут.' });
		const data = await request.formData();
		const username = String(data.get('username') || '').trim();
		const password = String(data.get('password') || '');
		if (!/^[a-zA-Z0-9_а-яА-ЯёЁ-]{3,40}$/.test(username))
			return fail(400, { error: 'Логин: 3–40 букв, цифр, дефисов или подчёркиваний.' });
		if (password.length < 10 || new TextEncoder().encode(password).length > 72)
			return fail(400, { error: 'Пароль: от 10 символов, не более 72 байт.' });
		const hash = await bcrypt.hash(password, 12);
		let id: number | bigint;
		try {
			id = (
				await db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hash)
			).lastInsertRowid;
		} catch (e) {
			if (
				(e as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE' ||
				String(e).includes('UNIQUE constraint failed: users.username')
			)
				return fail(400, { error: 'Этот логин уже занят' });
			throw e;
		}
		await createSession(cookies, id, url.protocol === 'https:');
		redirect(303, '/dashboard');
	}
};
