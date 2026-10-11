import db from '$db';
import type { Test } from '$types/test';

export const load = async () => {
	return { tests: await db.prepare<unknown[], Test>('SELECT * FROM tests').all() };
};
