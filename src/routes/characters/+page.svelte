<script lang="ts">
	import { resolve } from '$app/paths';
	import CharacterAvatar from '$lib/components/characterAvatar.svelte';

	const { data } = $props();
</script>

<h1>Characters</h1>

{#if data.characters.length === 0}
	<p>No characters found.</p>
{:else}
	<div class="container">
		{#each data.characters as character (character.id)}
			<a href={resolve(`/characters/${character.id}`)}>
				<div class="info">
					<h3>{character.name}</h3>
					<p>{character.factions.join(', ')}</p>
					<p>{character.keywords.join(', ')}</p>
				</div>
				<CharacterAvatar
					src={`${data.apiBaseUrl}/images/${character.headFilename}`}
					alt={character.name}
					size={64}
				/>
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
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 10px;
		border: 2px solid var(--text-color);
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 4px;
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
