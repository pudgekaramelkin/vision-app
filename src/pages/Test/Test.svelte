<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Question, Test } from '$types/test';
	let { questions, test }: { questions: Omit<Question, 'answer'>[]; test?: Test } = $props();
	let current = $state(0);
	let answers = $state<Record<string, string>>({});
	let sending = $state(false);
	let message = $state('');
</script>

<article class="test-card">
	<p class="eyebrow">Небольшой шаг к осознанности</p>
	<h1>{test?.title}</h1>
	<p>{test?.description}</p>
	<p class="notice">
		Учебный тест не измеряет остроту зрения и не заменяет обследование у офтальмолога.
	</p>
	{#if questions.length === 0}
		<p>В этом тесте пока нет вопросов.</p>
		<a href="/test">Вернуться к тестам</a>
	{:else}
		<progress value={current + 1} max={questions.length} aria-label="Прогресс теста"></progress>
		<p>Вопрос {current + 1} из {questions.length}</p>
		<form
			method="POST"
			action="?/save"
			use:enhance={() => {
				sending = true;
				message = '';
				return async ({ result, update }) => {
					sending = false;
					if (result.type === 'failure') message = 'Не удалось сохранить. Проверьте ответы.';
					await update({ reset: false });
				};
			}}
		>
			{#each questions as question, index (question.id)}
				<section hidden={current !== index}>
					<h2>{question.question_text}</h2>
					{#if question.image_url}<img
							src={question.image_url}
							alt="Иллюстрация к вопросу"
							width="260"
						/>{/if}
					<label
						>Ваш ответ<input
							name="answer_{question.id}"
							bind:value={answers[question.id]}
							maxlength="200"
							autocomplete="off"
							required={current === index}
						/></label
					>
				</section>
			{/each}
			{#if message}<p role="alert">{message}</p>{/if}
			<div class="actions">
				{#if current > 0}<button type="button" class="outline" onclick={() => current--}
						>Назад</button
					>{/if}
				{#if current < questions.length - 1}<button
						type="button"
						disabled={!answers[questions[current].id]?.trim()}
						onclick={() => current++}>Дальше →</button
					>
				{:else}<button
						type="submit"
						disabled={sending || questions.some((q) => !answers[q.id]?.trim())}
						>{sending ? 'Сохраняем…' : 'Завершить и сохранить'}</button
					>{/if}
			</div>
		</form>
	{/if}
</article>

<style>
	.test-card {
		max-width: 760px;
		margin: 24px auto;
	}
	.test-card img {
		display: block;
		margin: 24px auto;
		max-width: 100%;
	}
	.actions {
		display: flex;
		gap: 12px;
	}
</style>
