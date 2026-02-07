<script lang="ts">
	import type { Ability } from '$lib/types/character';

	const { ability }: { ability: Ability } = $props();
</script>

<div>
	<div class="header">
		<h4>{ability.name}</h4>
		{#if ability.range}
			<p class="meta">
				{ability.range}" {ability.pulse ? 'Pulse' : 'Range'}
			</p>
		{/if}
		{#if ability.energyCost !== null}
			<p class="meta">{ability.energyCost} Energy</p>
		{/if}
	</div>
	{#if ability.oncePerTurn}
		<p><i>Once per turn</i></p>
	{/if}
	{#if ability.oncePerGame}
		<p><i>Once per game</i></p>
	{/if}
	{#if ability.description}
		<p class="description">{ability.description}</p>
	{/if}
	{#each ability.arcaneOutcomes as outcome}
		<div class="outcome-row">
			{#each outcome.outcomeCards as card}
				{#if card.isCatastrophe}
					<span class="cardValue Catastrophe">Catastrophe</span>
				{:else}
					<span class="cardValue {card.color}">{card.value}</span>
				{/if}
			{/each}
			<p class="description">{outcome.outcomeText}</p>
		</div>
	{/each}
</div>

<style>
	.header {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 8px;
	}

	.header h4 {
		margin-right: auto;
	}

	.meta {
		font-size: 16px;
	}

	.description {
		text-align: justify;
	}

	.outcome-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.cardValue {
		text-wrap: nowrap;
		font-weight: 400;
		margin: 0px 0px 4px 0px;
		border-width: 0.5px;
		padding: 3px 3px 0px 3px;
		border-style: solid;
	}

	.cardValue.Pink {
		border-color: var(--text-color);
		background-color: var(--pink-card-color);
	}
	.cardValue.Green {
		border-color: var(--text-color);
		background-color: var(--green-card-color);
	}
	.cardValue.Blue {
		border-color: var(--text-color);
		background-color: var(--blue-card-color);
	}
	.cardValue.Catastrophe {
		border-color: var(--text-color);
		background-color: var(--catastrophe-card-color);
	}
</style>
