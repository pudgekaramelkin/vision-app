import { test, expect } from '@playwright/test';
const origin = 'http://127.0.0.1:4173';
test('registration, diary, export, server scoring, session revocation', async ({
	page,
	request
}) => {
	const username = `user${Date.now()}`;
	await page.goto('/register');
	await page.getByLabel('Придумайте логин').fill(username);
	await page.getByLabel('Пароль (от 10 символов)').fill('a-long-test-password');
	await page.getByRole('button', { name: 'Создать аккаунт' }).click();
	await expect(page).toHaveURL(/dashboard$/);
	await page.getByLabel('Левый глаз', { exact: true }).fill('-1.5');
	await page.getByLabel('Правый глаз', { exact: true }).fill('-2');
	await page.getByLabel('Астигматизм / Заметки').fill('My private note');
	await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
	await expect(page.getByRole('cell', { name: 'My private note' })).toBeVisible();
	const csv = await page.request.get('/dashboard/export');
	expect(await csv.text()).toContain('My private note');
	const invalid = await page.request.post('/dashboard?/add_log', {
		headers: { origin },
		form: { left_eye: 'NaN', right_eye: '1' }
	});
	expect((await invalid.json()).status).toBe(400);
	const anonymous = await request.get('/dashboard/export', { maxRedirects: 0 });
	expect(anonymous.status()).toBe(303);
	await page.goto('/test/1');
	await expect(page.locator('progress')).toBeVisible();
	await page.getByLabel('Ваш ответ').first().fill('0');
	await page.getByRole('button', { name: 'Дальше' }).click();
	await page.getByLabel('Ваш ответ').nth(1).fill('2');
	await page.getByRole('button', { name: 'Завершить и сохранить' }).click();
	await expect(page).toHaveURL(/dashboard$/);
	await page.getByRole('button', { name: 'Результаты тестов' }).click();
	await expect(page.getByRole('cell', { name: '50%' })).toBeVisible();
	const session = (await page.context().cookies()).find((c) => c.name === 'session')!;
	expect(session.value).toMatch(/^[a-f0-9]{64}$/);
	await page.getByRole('button', { name: 'Выйти' }).click();
	await expect(page).toHaveURL(/login$/);
	const revoked = await request.get('/dashboard', {
		headers: { cookie: `session=${session.value}` },
		maxRedirects: 0
	});
	expect(revoked.status()).toBe(302);
});
test('forged cookies and anonymous admin writes are denied', async ({ request }) => {
	const result = await request.post('/admin?/add_post', {
		headers: { cookie: 'session=1', origin },
		form: { title: 'bad', content: 'bad' }
	});
	expect(result.status()).toBe(403);
	expect(
		(
			await request.get('/dashboard', { headers: { cookie: 'session=1' }, maxRedirects: 0 })
		).status()
	).toBe(302);
	expect((await request.get('/blog/999999')).status()).toBe(404);
	expect((await request.get('/test/999999')).status()).toBe(404);
});
test('responsive home and break timer', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.goto('/break');
	await page.clock.install();
	await page.locator('main').getByRole('button', { name: 'Начать', exact: true }).click();
	await page.clock.fastForward(20 * 60 * 1000);
	await expect(page.getByRole('button', { name: 'Начать отдых' })).toBeVisible();
	await page.getByRole('button', { name: 'Начать отдых' }).click();
	await page.clock.fastForward(20 * 1000);
	await expect(page.getByText('Завершено перерывов за эту сессию: 1')).toBeVisible();
});
