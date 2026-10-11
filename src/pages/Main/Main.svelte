<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="home-top">
	<span>ВАШЕ ПРОСТРАНСТВО ЗАБОТЫ</span><span>Маленькие привычки. Больше внимания к себе.</span>
</div>
<section class="hero">
	<div class="hero-copy">
		<p class="eyebrow"><span class="dot"></span> Пусть важное остаётся в фокусе</p>
		<h1>Смотрите на мир.<br /><em>Мы поможем</em><br />помнить о себе.</h1>
		<p class="intro">
			Показатели зрения, история наблюдений и время для отдыха — в одном спокойном пространстве.
		</p>
		<div class="hero-actions">
			<a href={page.data.user ? '/dashboard' : '/register'} role="button"
				>{page.data.user ? 'Открыть мой дневник' : 'Создать мой дневник'} <span>↗</span></a
			><a href="/break">Сделать паузу →</a>
		</div>
		<p class="hint">Ваши записи доступны только вам</p>
	</div>
	<div class="hero-visual" aria-hidden="true">
		<div class="orb orb-one"></div>
		<div class="orb orb-two"></div>
		<div class="orbit"></div>
		<span class="visual-label">ВНИМАНИЕ К СЕБЕ</span>
		<div class="eye"><div class="iris"><div class="pupil"></div></div></div>
		<div class="visual-bottom">
			<span>Ясность начинается<br />с простых привычек.</span><span class="spark">✳</span>
		</div>
	</div>
</section>
<div class="section-heading">
	<div>
		<p class="eyebrow">Всё нужное рядом</p>
		<h2>Забота в вашем ритме</h2>
	</div>
	<span>01 — 03</span>
</div>
<section class="feature-grid">
	<a href="/dashboard" class="feature"
		><span class="feature-icon">↗</span><span class="number">01</span>
		<h3>История без пробелов</h3>
		<p>Сохраняйте показатели от врача, сравнивайте записи на графике и скачивайте историю.</p>
		<span class="feature-link">Открыть дневник →</span></a
	><a href="/test" class="feature"
		><span class="feature-icon">◉</span><span class="number">02</span>
		<h3>Узнайте чуть больше</h3>
		<p>Проходите учебные тесты и сохраняйте результаты в личном кабинете.</p>
		<span class="feature-link">Посмотреть тесты →</span></a
	><a href="/break" class="feature"
		><span class="feature-icon">◷</span><span class="number">03</span>
		<h3>Время выдохнуть</h3>
		<p>Включите таймер, отложите экран и выделите немного времени для короткой паузы.</p>
		<span class="feature-link">Настроить перерыв →</span></a
	>
</section>
<section class="closing">
	<div>
		<p class="eyebrow">Начните с малого</p>
		<h2>Одна запись сегодня.<br />Полезная история завтра.</h2>
	</div>
	<a href="/dashboard" role="button" class="outline">Добавить первую запись ↗</a>
</section>

<style>
	.home-top {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		letter-spacing: 0.1em;
		color: #6c7e75;
		padding: 2px 0 24px;
	}
	.hero {
		display: grid;
		grid-template-columns: 1.12fr 1fr;
		gap: 44px;
		align-items: center;
		margin: 16px 0 74px;
	}
	.hero h1 {
		font-size: clamp(42px, 4.4vw, 64px);
		line-height: 1.12;
		letter-spacing: -0.055em;
		margin: 24px 0;
	}
	.hero h1 em {
		font-style: normal;
		color: #608673;
	}
	.intro {
		max-width: 430px;
		font-size: 16px;
		line-height: 1.9;
	}
	.dot {
		width: 7px;
		height: 7px;
		display: inline-block;
		background: #598c70;
		border-radius: 50%;
		margin-right: 8px;
	}
	.hero-actions {
		display: flex;
		align-items: center;
		gap: 24px;
		margin-top: 28px;
		font-size: 13px;
		font-weight: 700;
	}
	.hero-actions [role] {
		padding: 16px 22px;
	}
	.hero-actions [role] span {
		margin-left: 18px;
	}
	.hint {
		font-size: 11px;
		color: #6f8379;
		margin-top: 18px;
	}
	.hero-visual {
		aspect-ratio: 1.03;
		background: #dde8d2;
		border-radius: 160px 24px 24px 24px;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(4px);
	}
	.orb-one {
		width: 370px;
		height: 370px;
		background: radial-gradient(circle, #f8edc6, transparent 70%);
		top: -170px;
		right: -80px;
	}
	.orb-two {
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, #a3bba5, transparent 70%);
		bottom: -100px;
		left: -100px;
	}
	.orbit {
		position: absolute;
		width: 82%;
		height: 82%;
		border: 1px solid #a0b59b;
		border-radius: 50%;
		transform: rotate(-30deg) scaleY(0.65);
	}
	.eye {
		width: 66%;
		height: 35%;
		border-radius: 75% 10% 75% 10%;
		transform: rotate(25deg);
		background: #f7f7e9;
		box-shadow: 0 22px 50px #48644b20;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.iris {
		width: 46%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: repeating-conic-gradient(#6b8e72 0deg 5deg, #7f9c7f 6deg 11deg);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 0 0 8px #688366;
	}
	.pupil {
		width: 48%;
		aspect-ratio: 1;
		background: #294e3c;
		border-radius: 50%;
		position: relative;
	}
	.pupil:after {
		content: '';
		position: absolute;
		width: 20%;
		height: 20%;
		background: #fffde5;
		border-radius: 50%;
		top: 14%;
		left: 20%;
	}
	.visual-label {
		position: absolute;
		top: 32px;
		right: 28px;
		font-size: 9px;
		letter-spacing: 0.2em;
	}
	.visual-bottom {
		position: absolute;
		bottom: 26px;
		left: 30px;
		right: 28px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		line-height: 1.6;
		color: #395c45;
	}
	.spark {
		font-size: 44px;
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}
	.section-heading h2 {
		font-size: 30px;
	}
	.section-heading > span {
		font-size: 12px;
		color: #748276;
	}
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}
	.feature {
		position: relative;
		border: 1px solid #dde6df;
		border-radius: 18px;
		padding: 26px;
		background: #fff;
		text-decoration: none;
		color: #213d32;
	}
	.feature:hover {
		border-color: #6a997e;
	}
	.feature-icon {
		font-size: 27px;
		display: block;
		margin-bottom: 34px;
		color: #648b73;
	}
	.number {
		position: absolute;
		right: 24px;
		top: 30px;
		font-size: 10px;
		color: #789081;
	}
	.feature h3 {
		font-size: 20px;
	}
	.feature p {
		font-size: 13px;
		line-height: 1.9;
	}
	.feature-link {
		font-size: 12px;
		font-weight: 800;
	}
	.closing {
		margin: 48px 0 0;
		padding: 34px;
		background: #eaf0e8;
		border-radius: 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
	}
	.closing h2 {
		font-size: 26px;
		margin: 0;
	}
	.closing a {
		font-size: 13px;
	}
	@media (max-width: 750px) {
		.section-heading > span {
			display: none;
		}
		.hero {
			grid-template-columns: 1fr;
			margin-bottom: 40px;
			gap: 20px;
		}
		.hero h1 {
			font-size: 44px;
		}
		.hero-visual {
			max-height: 380px;
		}
		.feature-grid {
			grid-template-columns: 1fr;
		}
		.home-top span:last-child {
			display: none;
		}
		.hero-actions {
			gap: 16px;
			flex-wrap: wrap;
		}
		.closing {
			align-items: flex-start;
			flex-direction: column;
		}
		.feature-icon {
			margin-bottom: 20px;
		}
	}
</style>
