<script lang="ts">
	import { route } from '$constants/routes';
	import type { Post } from '$types/post';

	type Props = {
		post: Post;
	};

	let { post }: Props = $props();
</script>

<article>
	<h1>{post.title}</h1>
	<div>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html post.content}
	</div>
	<a href={route('/blog')}>← Назад к статьям</a>
</article>
