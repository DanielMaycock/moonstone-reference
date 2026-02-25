<script lang="ts">
	import Ability from '$lib/components/ability.svelte'

	const { data } = $props()
</script>

<svelte:head>
	<title>{data.ability.name} - Moonstone Reference</title>
</svelte:head>

<div class="container">
	{#if data.from}
		<a href="/characters/{data.from}" class="back">← Back</a>
	{/if}
	<Ability ability={data.ability} />
</div>

<style>
	.container {
		padding: var(--space-sm);
	}

	.back {
		display: block;
		margin-bottom: var(--space-sm);
		text-decoration: none;
		color: var(--text-color);
	}

	.back:visited {
		color: var(--text-color);
	}

	.back:hover {
		text-decoration: underline;
	}
</style>
