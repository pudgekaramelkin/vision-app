import { redirect, fail } from '@sveltejs/kit';
import db from '$db';
import bcrypt from 'bcryptjs';
import { allowAuth, createSession } from '$server/auth';
import type { User } from '$types/user';
import type { Actions } from './$types';
const dummyHash = bcrypt.hashSync('timing-only-not-an-account', 10);
export const actions: Actions = {
	default: async ({ request, cookies, url, getClientAddress }) => {
		if (!(await allowAuth(getClientAddress())))
			return fail(429, { error: 'Слишком много попыток. Попробуйте через 15 минут.' });
		const data = await request.formData();
		const username = String(data.get('username') || '').trim();
		const password = String(data.get('password') || '');
		if (
			!username ||
			username.length > 40 ||
			!password ||
			new TextEncoder().encode(password).length > 72
		)
			return fail(400, { error: 'Проверьте логин и пароль' });
		const user = await db
			.prepare<unknown[], User & { password: string }>('SELECT * FROM users WHERE username = ?')
			.get(username);
		const matches = await bcrypt.compare(password, user?.password || dummyHash);
		if (!user || !matches) return fail(400, { error: 'Неверный логин или пароль' });
		await createSession(cookies, user.id, url.protocol === 'https:');
		redirect(303, '/dashboard');
	}
};
