import { redirect } from '@sveltejs/kit';
import { revokeSession } from '$server/auth';
export const POST = async ({ cookies, locals }) => {
	await revokeSession(cookies);
	locals.user = undefined;
	redirect(303, '/login');
};
