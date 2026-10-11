<script lang="ts">
	import { enhance } from '$app/forms';

	type Props = {
		form:
			| {
					successPwd?: undefined;
					errorPwd: string;
			  }
			| {
					errorPwd?: undefined;
					successPwd: boolean;
			  }
			| null;
	};

	let { form }: Props = $props();

	// Функция для подтверждения удаления (чтобы юзер не удалил аккаунт случайно)
	function confirmDelete(e: Event) {
		if (
			!confirm(
				'Вы уверены, что хотите навсегда удалить аккаунт? Вся история вашего зрения будет удалена. Это действие необратимо.'
			)
		) {
			e.preventDefault(); // Останавливает отправку формы, если нажата "Отмена"
		}
	}
</script>

<h1>Настройки профиля</h1>

<div class="grid">
	<!-- Блок смены пароля -->
	<article>
		<h3>Смена пароля</h3>

		{#if form?.successPwd}
			<p style="color: green; font-weight: bold;">Пароль успешно изменен!</p>
		{/if}
		{#if form?.errorPwd}
			<p style="color: red;">{form.errorPwd}</p>
		{/if}

		<form method="POST" action="?/change_password" use:enhance>
			<label>
				Текущий пароль
				<input name="old_password" type="password" required />
			</label>
			<label>
				Новый пароль
				<input name="new_password" type="password" minlength="10" required />
			</label>
			<button type="submit">Обновить пароль</button>
		</form>
	</article>

	<!-- Блок удаления аккаунта -->
	<article style="border: 2px solid #e53935;">
		<h3 style="color: #e53935;">Опасная зона</h3>
		<p>
			Удаление аккаунта приведет к безвозвратной потере всей вашей истории проверок зрения и
			результатов тестов.
		</p>

		<form method="POST" action="?/delete_account" onsubmit={confirmDelete}>
			<button type="submit" style="background-color: #e53935; border-color: #e53935; color: white;">
				Удалить аккаунт навсегда
			</button>
		</form>
	</article>
</div>
