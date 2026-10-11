<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/state';
	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const links = [
		{ href: '/dashboard', label: 'Мой дневник' },
		{ href: '/test', label: 'Тесты' },
		{ href: '/break', label: 'Перерыв' },
		{ href: '/blog', label: 'Статьи' }
	];
</script>

<svelte:head
	><title>Чистый взгляд — дневник зрения</title><meta
		name="description"
		content="Сохраняйте показатели зрения, следите за историей и делайте перерывы в работе. Ваш личный дневник заботы о себе."
	/><meta name="theme-color" content="#196c5d" /></svelte:head
>
<a class="skip" href="#content">Перейти к содержимому</a>
<header>
	<nav class="container" aria-label="Основная навигация">
		<a href="/" class="brand"
			><span class="brand-icon" aria-hidden="true">◉</span><span
				>чистый взгляд<span class="brand-caption">забота начинается с внимания</span></span
			></a
		>
		<div class="nav-links">
			{#each links as link}<a
					href={link.href}
					class:active={page.url.pathname.startsWith(link.href)}
					aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}
					>{link.label}</a
				>{/each}
		</div>
		<div class="account">
			{#if data.user}{#if data.user.role === 'admin'}<a href="/admin">Админка</a>{/if}<a
					href="/settings"
					aria-label="Настройки профиля">Профиль</a
				>
				<form method="POST" action="/logout">
					<button class="outline" type="submit">Выйти</button>
				</form>{:else}<a href="/login">Войти</a><a href="/register" role="button">Начать</a>{/if}
		</div>
	</nav>
</header>
<main id="content" class="container">{@render children()}</main>
<footer class="container">
	<strong>Чистый взгляд</strong>
	<p>
		Личный дневник, а не медицинская диагностика.<br />Результаты учебных тестов не заменяют
		консультацию специалиста.
	</p>
	<a href="/dashboard">Внимание к себе — каждый день ↗</a>
</footer>

<style>
	header {
		border-bottom: 1px solid #e2eae5;
		background: #f6f8f7;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 26px;
		min-height: 100px;
		flex-wrap: wrap;
		padding-top: 18px !important;
		padding-bottom: 18px !important;
	}
	.brand {
		display: flex;
		gap: 12px;
		align-items: center;
		color: #183d35;
		text-decoration: none;
		font-size: 19px;
		font-weight: 800;
		letter-spacing: -0.04em;
	}
	.brand-icon {
		font-size: 34px;
		font-weight: 400;
	}
	.brand-caption {
		display: block;
		font-size: 9px;
		letter-spacing: 0.04em;
		color: #648074;
		font-weight: 500;
	}
	.nav-links,
	.account {
		display: flex;
		align-items: center;
		gap: 22px;
		font-size: 13px;
		font-weight: 700;
	}
	.nav-links a,
	.account > a:not([role]) {
		color: #59716a;
		text-decoration: none;
	}
	.nav-links a.active {
		color: #17665b;
		border-bottom: 2px solid #17665b;
	}
	.account button,
	.account [role='button'] {
		padding: 8px 16px;
		font-size: 13px;
	}
	footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 30px;
		border-top: 1px solid #dce7e1;
		padding-top: 30px !important;
		padding-bottom: 35px !important;
		font-size: 12px;
	}
	footer p {
		font-size: 11px;
		max-width: 360px;
	}
	.skip {
		position: absolute;
		top: -100px;
		left: 16px;
		background: white;
		z-index: 10;
		padding: 12px;
	}
	.skip:focus {
		top: 10px;
	}
	@media (max-width: 900px) {
		nav {
			gap: 18px;
		}
		.nav-links {
			order: 3;
			width: 100%;
			justify-content: space-between;
			gap: 10px;
		}
		.account {
			margin-left: auto;
			gap: 12px;
		}
	}
	@media (max-width: 600px) {
		footer {
			flex-direction: column;
			gap: 10px;
		}
		.brand {
			font-size: 16px;
		}
		.account {
			font-size: 12px;
		}
		.account [role='button'] {
			padding: 8px 10px;
		}
	}
</style>
