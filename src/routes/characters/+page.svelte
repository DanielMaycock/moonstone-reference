<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CharacterAvatar from '$lib/components/characterAvatar.svelte';

	const { data } = $props();

	let searchValue = $state('');
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		searchValue = data.filters.search;
	});

	function updateFilters(params: Record<string, string>) {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value) searchParams.set(key, value);
		}
		const query = searchParams.toString();
		goto(`?${query}`, { keepFocus: true, noScroll: true });
	}

	function currentParams(): Record<string, string> {
		return {
			search: searchValue,
			faction: data.filters.faction,
			keyword: data.filters.keyword
		};
	}

	function handleSearchInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			updateFilters(currentParams());
		}, 300);
	}

	function handleSelectChange(e: Event) {
		clearTimeout(debounceTimer);
		const target = e.currentTarget as HTMLSelectElement;
		updateFilters({ ...currentParams(), [target.name]: target.value });
	}

	onDestroy(() => clearTimeout(debounceTimer));
</script>

<svelte:head>
	<title>Characters - Moonstone Reference</title>
</svelte:head>

<h1>Characters</h1>

<form method="GET" class="filters">
	<input
		type="text"
		name="search"
		placeholder="Search by name..."
		value={searchValue}
		oninput={(e) => {
			searchValue = (e.currentTarget as HTMLInputElement).value;
			handleSearchInput();
		}}
	/>
	<select name="faction" value={data.filters.faction} onchange={handleSelectChange}>
		<option value="">All Factions</option>
		{#each data.factions as faction}
			<option value={faction}>{faction}</option>
		{/each}
	</select>
	<select name="keyword" value={data.filters.keyword} onchange={handleSelectChange}>
		<option value="">All Keywords</option>
		{#each data.keywords as keyword}
			<option value={keyword}>{keyword}</option>
		{/each}
	</select>
	<noscript><button type="submit">Filter</button></noscript>
</form>

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
	.filters {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
	}

	@media (min-width: 768px) {
		.filters {
			flex-direction: row;
		}
	}

	.filters input,
	.filters select {
		padding: 8px 12px;
		border: 2px solid var(--text-color);
		background-color: var(--button-bg-color);
		color: var(--text-color);
		font-family: inherit;
		font-size: inherit;
		border-radius: 4px;
	}

	.filters input {
		flex: 2;
	}

	.filters select {
		flex: 1;
	}

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
