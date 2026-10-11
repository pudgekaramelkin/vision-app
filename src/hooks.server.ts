import { error, type Handle } from '@sveltejs/kit';
import { initializeDatabase } from '$db';
import { getSession } from '$server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	await initializeDatabase();
	event.locals.user = await getSession(event.cookies.get('session'));
	if (
		(event.url.pathname === '/admin' || event.url.pathname.startsWith('/admin/')) &&
		event.locals.user?.role !== 'admin'
	)
		error(403, 'Доступ только для администратора');
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	if (event.locals.user) response.headers.set('Cache-Control', 'private, no-store');
	return response;
};
