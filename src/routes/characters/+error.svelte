<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error {page.status} - Moonstone Reference</title>
</svelte:head>

<div class="error">
	<h1>{page.status === 404 ? 'Character not found' : 'Something went wrong'}</h1>
	<p>{page.error?.message}</p>
	<a href={resolve('/characters')}>Back to characters</a>
</div>

<style>
	.error {
		text-align: center;
		padding: 40px 20px;
	}

	p {
		margin: 16px 0;
	}

	a {
		color: var(--text-color);
		font-weight: 500;
	}
</style>
