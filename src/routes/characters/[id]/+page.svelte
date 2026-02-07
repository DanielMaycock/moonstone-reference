<script lang="ts">
	import Ability from '$lib/components/ability.svelte';
	import MeleeMove from '$lib/components/meleeMove.svelte';

	const { data } = $props();

	const passives = $derived(data.character.abilities.filter((a) => a.type === 'Passive'));
	const actives = $derived(data.character.abilities.filter((a) => a.type === 'Active'));
	const arcane = $derived(data.character.abilities.filter((a) => a.type === 'Arcane'));
</script>

<div class="container">
	<div class="column">
		<section>
			<h1>{data.character.name}</h1>
			<p>{data.character.factions.join(', ')}</p>
			<p>{data.character.keywords.join(', ')}</p>
		</section>
		<section>
			<div class="stats">
				<div class="stat-block">
					<h3>Melee</h3>
					<p>{data.character.melee}</p>
				</div>
				<div class="stat-block">
					<h3>Range</h3>
					<p>{data.character.range}"</p>
				</div>
				<div class="stat-block">
					<h3>Arcane</h3>
					<p>{data.character.arcane}</p>
				</div>
				<div class="stat-block">
					<h3>Evade</h3>
					<p>{data.character.evade}</p>
				</div>
			</div>
		</section>
		<section>
			<h2>Health</h2>
			<div>
				{#each { length: data.character.health } as _, i}
					<div class={['health-pip', data.character.energy.includes(i) ? 'energy' : '']}></div>
				{/each}
			</div>
		</section>
		<section>
			<h2>Signature Move</h2>
			{#if data.character.signatureMove}
				<MeleeMove meleeMove={data.character.signatureMove} />
			{:else}
				<p>None</p>
			{/if}
		</section>
	</div>
	<div class="column">
		<section>
			<h2>Passive Abilities</h2>
			{#each passives as ability (ability.id)}
				<Ability {ability} />
			{:else}
				<p>None</p>
			{/each}
		</section>
		<section>
			<h2>Active Abilities</h2>
			{#each actives as ability (ability.id)}
				<Ability {ability} />
			{:else}
				<p>None</p>
			{/each}
		</section>
		<section>
			<h2>Arcane Abilities</h2>
			{#each arcane as ability (ability.id)}
				<Ability {ability} />
			{:else}
				<p>None</p>
			{/each}
		</section>
	</div>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr;
	}
	@media (min-width: 768px) {
		.container {
			grid-template-columns: 1fr 1fr;
		}
	}

	.column {
		display: flex;
		flex-direction: column;
		padding: 0px 2px;
	}

	@media (min-width: 768px) {
		.column {
			padding: 0px 8px;
		}
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px 0px;
		border-bottom: 1px solid var(--text-color);
	}

	section:last-child {
		border-bottom: none;
	}

	.stats {
		display: flex;
		flex-direction: row;
		gap: 12px;
		justify-content: center;
	}

	.stat-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 8px;
		flex: 1;
	}

	.stat-block > p {
		font-size: 20px;
		font-weight: 300;
		margin: 0;
	}

	.health-pip {
		width: 24px;
		height: 24px;
		border: 2px solid var(--text-color);
		border-radius: 50%;
		display: inline-block;
		margin-right: 4px;
	}
	.health-pip.energy {
		background-color: var(--blue-card-color);
	}
</style>
