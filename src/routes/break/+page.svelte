<script lang="ts">
	import { onMount } from 'svelte';
	let minutes = $state(20);
	let remaining = $state(20 * 60);
	let running = $state(false);
	let resting = $state(false);
	let deadline = 0;
	let sessions = $state(0);
	const display = $derived(
		`${Math.floor(remaining / 60)
			.toString()
			.padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`
	);
	function start() {
		deadline = Date.now() + remaining * 1000;
		running = true;
	}
	function reset() {
		running = false;
		resting = false;
		remaining = minutes * 60;
	}
	onMount(() => {
		const timer = setInterval(() => {
			if (!running) return;
			remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
			if (remaining === 0) {
				running = false;
				if (!resting) {
					resting = true;
					remaining = 20;
				} else {
					sessions++;
					resting = false;
					remaining = minutes * 60;
				}
			}
		}, 250);
		return () => clearInterval(timer);
	});
</script>

<svelte:head
	><title>{running ? `${display} · ` : ''}Время для паузы — Чистый взгляд</title></svelte:head
>
<div class="timer-page">
	<p class="eyebrow">Немного пространства для себя</p>
	<h1>Сделайте паузу.</h1>
	<p>Выберите свой ритм. Когда время закончится, отвлекитесь от экрана.</p>
	<article class="timer-card">
		<span class="status"
			>{resting ? 'Время отдыха' : running ? 'Таймер работает' : 'Ваш спокойный ритм'}</span
		>
		<div class="timer" aria-label="Оставшееся время">{display}</div>
		<p role="status">
			{resting
				? 'Посмотрите вдаль. Начните короткую паузу, когда будете готовы.'
				: 'Таймер работает, пока эта страница открыта.'}
		</p>
		<div class="controls">
			<button onclick={() => (running ? (running = false) : start())}
				>{running ? 'Пауза' : resting ? 'Начать отдых' : 'Начать'}</button
			><button class="outline" onclick={reset}>Сбросить</button>
		</div>
		<label class="duration"
			>Период между перерывами<select
				bind:value={minutes}
				onchange={reset}
				disabled={running || resting}
				><option value={20}>20 минут</option><option value={30}>30 минут</option><option value={45}
					>45 минут</option
				></select
			></label
		><small>Завершено перерывов за эту сессию: {sessions}</small>
	</article>
	<a href="/dashboard">← Вернуться к дневнику</a>
</div>

<style>
	.timer-page {
		max-width: 760px;
		margin: 30px auto;
		text-align: center;
	}
	.timer-card {
		margin-top: 32px;
		padding: 40px;
		background: #edf2e9;
	}
	.status {
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-size: 11px;
		color: #52725c;
	}
	.timer {
		font-size: clamp(70px, 15vw, 120px);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.06em;
		font-weight: 800;
		color: #315b43;
		margin: 16px 0;
	}
	.controls {
		display: flex;
		justify-content: center;
		gap: 12px;
	}
	.duration {
		max-width: 300px;
		text-align: left;
		margin: 30px auto 15px;
		font-size: 13px;
	}
</style>
