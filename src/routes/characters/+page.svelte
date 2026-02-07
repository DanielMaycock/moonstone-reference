<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<h1>Characters</h1>

{#if data.characters.length === 0}
	<p>No characters found.</p>
{:else}
	<div class="container">
		{#each data.characters as character (character.id)}
			<a href={resolve(`/characters/${character.id}`)}>
				<h3>{character.name}</h3>
				<p>{character.factions.join(', ')}</p>
				<p>{character.keywords.join(', ')}</p>
			</a>
		{/each}
	</div>
{/if}

<style>
	.container {
		gap: 10px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	}

	a {
		display: flex;
		color: inherit;
		text-decoration: none;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		gap: 4px;
		padding: 10px;
		border: 2px solid var(--text-color);
	}

	h3 {
		font-size: 18px;
		font-weight: 600;
		margin: 0;
	}

	p {
		margin: 0;
		font-weight: 300;
	}
</style>
