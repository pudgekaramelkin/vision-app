<script lang="ts">
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { Line } from 'svelte-chartjs';
	import {
		Chart,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';
	import type { Test, TestResult } from '$types/test';
	import type { VisionLog } from '$types/vision';

	Chart.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	type Props = {
		tests: Test[];
		testResults: TestResult[];
		visionLogs: VisionLog[];
	};

	let { tests, testResults, visionLogs }: Props = $props();

	let activeTab = $state<'logs' | 'tests'>('logs');
	// Состояние для редактирования
	let editLogId = $state<null | string>(null);

	let selectedTestId = $derived<number | null>(tests.length > 0 ? tests[0].id : null);
	let chartDataLogs = $derived({
		labels: visionLogs.map((r) => new Date(r.created_at).toLocaleDateString()),
		datasets: [
			{
				label: 'Левый',
				data: visionLogs.map((r) => r.left_eye),
				borderColor: '#e11d48',
				tension: 0.2
			},
			{
				label: 'Правый',
				data: visionLogs.map((r) => r.right_eye),
				borderColor: '#2563eb',
				tension: 0.2
			}
		]
	});
	let filteredTestResults = $derived(
		testResults.filter((r) => r.test_id === Number(selectedTestId))
	);
	let chartDataTests = $derived({
		labels: filteredTestResults.map((r) => new Date(r.created_at).toLocaleDateString()),
		datasets: [
			{
				label: 'Точность (%)',
				data: filteredTestResults.map((r) => r.score),
				borderColor: '#10b981',
				tension: 0.2
			}
		]
	});
</script>

<div class="page-heading">
	<div>
		<p class="eyebrow">Ваше зрение в деталях</p>
		<h1>Мой дневник</h1>
		<p>Показатели, заметки и история — в одном месте.</p>
	</div>
	<a href="/dashboard/export" class="outline" role="button" download>↓ Экспорт CSV</a>
</div>
{#if page.form?.error}<p class="notice" role="alert">{page.form.error}</p>{/if}
<div class="summary-grid">
	<article><small>Записей в дневнике</small><strong>{visionLogs.length}</strong></article>
	<article><small>Пройдено тестов</small><strong>{testResults.length}</strong></article>
	<article>
		<small>Последняя запись</small><strong
			>{visionLogs.length
				? new Date(visionLogs[visionLogs.length - 1].created_at).toLocaleDateString('ru-RU')
				: 'Пока нет'}</strong
		>
	</article>
</div>
<nav style="margin-bottom: 20px;">
	<ul>
		<li>
			<button class={activeTab === 'logs' ? '' : 'outline'} onclick={() => (activeTab = 'logs')}
				>Данные от врача</button
			>
		</li>
		<li>
			<button class={activeTab === 'tests' ? '' : 'outline'} onclick={() => (activeTab = 'tests')}
				>Результаты тестов</button
			>
		</li>
	</ul>
</nav>

{#if activeTab === 'logs'}
	<div class="grid">
		<article>
			<h3>Динамика диоптрий</h3>
			{#if visionLogs.length > 0}
				<div style="height: 250px; min-width: 0;">
					<Line data={chartDataLogs} options={{ maintainAspectRatio: false }} />
				</div>

				<hr />
				<h4>История записей</h4>
				<div class="overflow-auto">
					<table>
						<thead
							><tr
								><th>Дата</th><th>Левый</th><th>Правый</th><th>Астигматизм</th><th>Действия</th></tr
							></thead
						>
						<tbody>
							{#each visionLogs as log (log.id)}
								{#if editLogId === log.id}
									<!-- Режим редактирования -->
									<tr>
										<td colspan="5">
											<form
												method="POST"
												action="?/edit_log"
												use:enhance
												style="margin: 0; display: flex; gap: 10px;"
											>
												<input type="hidden" name="id" value={log.id} />
												<input
													type="number"
													step="0.25"
													min="-40"
													max="40"
													name="left_eye"
													value={log.left_eye}
													required
													style="width: 80px;"
												/>
												<input
													type="number"
													step="0.25"
													min="-40"
													max="40"
													name="right_eye"
													value={log.right_eye}
													required
													style="width: 80px;"
												/>
												<input
													type="text"
													name="astigmatism"
													maxlength="1000"
													value={log.astigmatism}
												/>
												<button type="submit" style="width: auto; padding: 5px;">💾</button>
												<button
													type="button"
													class="secondary outline"
													onclick={() => (editLogId = null)}
													style="width: auto; padding: 5px;">❌</button
												>
											</form>
										</td>
									</tr>
								{:else}
									<!-- Режим просмотра -->
									<tr>
										<td>{new Date(log.created_at).toLocaleDateString()}</td>
										<td>{log.left_eye}</td>
										<td>{log.right_eye}</td>
										<td>{log.astigmatism || '-'}</td>
										<td style="display: flex; gap: 5px;">
											<button
												class="secondary outline"
												style="padding: 2px 10px; width: auto;"
												onclick={() => (editLogId = log.id)}>✏️</button
											>
											<form method="POST" action="?/delete_log" use:enhance style="margin: 0;">
												<input type="hidden" name="id" value={log.id} />
												<button
													style="padding: 2px 10px; width: auto; background-color: #e53935; border: none;"
													type="submit">🗑</button
												>
											</form>
										</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			{:else}<p>
					Здесь появится история ваших показателей. Добавьте первую запись из рецепта или заключения
					врача.
				</p>{/if}
		</article>

		<article>
			<h3>Добавить показатели</h3>
			<form method="POST" action="?/add_log" use:enhance>
				<div class="grid">
					<label
						>Левый глаз<input
							type="number"
							step="0.25"
							min="-40"
							max="40"
							name="left_eye"
							placeholder="-1.5"
							required
						/></label
					>
					<label
						>Правый глаз<input
							type="number"
							step="0.25"
							min="-40"
							max="40"
							name="right_eye"
							placeholder="-1.5"
							required
						/></label
					>
				</div>
				<label
					>Астигматизм / Заметки<input
						type="text"
						name="astigmatism"
						maxlength="1000"
						placeholder="cyl -0.5 ax 180"
					/></label
				>
				<button type="submit">Сохранить</button>
			</form>
		</article>
	</div>
{:else}
	<article>
		<div
			style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;"
		>
			<h3 style="margin: 0;">Прохождение тестов</h3>
			<select bind:value={selectedTestId} style="width: auto; margin: 0;">
				{#each tests as test (test.id)}
					<option value={test.id}>{test.title}</option>
				{/each}
			</select>
		</div>

		{#if filteredTestResults.length > 0}
			<div style="height: 300px;">
				<Line data={chartDataTests} options={{ maintainAspectRatio: false }} />
			</div>

			<hr />
			<h4>История прохождений</h4>
			<table>
				<thead><tr><th>Дата</th><th>Результат</th><th>Действие</th></tr></thead>
				<tbody>
					{#each filteredTestResults as result (result.id)}
						<tr>
							<td>{new Date(result.created_at).toLocaleDateString()}</td>
							<td>{result.score}%</td>
							<td>
								<form method="POST" action="?/delete_test" use:enhance style="margin: 0;">
									<input type="hidden" name="id" value={result.id} />
									<button
										style="padding: 2px 10px; width: auto; background-color: #e53935; border: none;"
										type="submit">Удалить</button
									>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>Вы еще не проходили этот тест.</p>
			<a href="/test/{selectedTestId}" role="button">Пройти сейчас</a>
		{/if}
	</article>
{/if}
