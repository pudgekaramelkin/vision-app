<script lang="ts">
	import { route } from '$constants/routes';
	import type { Post } from '$types/post';

	type Props = {
		posts: Post[];
	};

	let { posts }: Props = $props();
</script>

<p class="eyebrow">Библиотека</p>
<h1>Статьи и заметки</h1>
<p>Материалы для внимательного отношения к зрению.</p>

{#each posts as post (post.id)}
	<article>
		<h2>{post.title}</h2>
		<a href={route('/blog/[id]', post.id)} role="button" class="outline">Читать статью</a>
	</article>
{:else}<article>
		<h2>Здесь скоро появятся статьи</h2>
		<p>А пока можно вести дневник показателей или сделать короткий перерыв.</p>
		<a href="/break">Открыть таймер перерывов →</a>
	</article>{/each}
