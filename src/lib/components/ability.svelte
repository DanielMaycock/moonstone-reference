<script lang="ts">
	import RichText from '$lib/components/richText.svelte';
	import type { Ability } from '$lib/types/character';

	const { ability }: { ability: Ability } = $props();

	const colorOrder: Record<string, number> = { Blue: 0, Green: 1, Pink: 2 };

	const sortedOutcomes = $derived(
		[...ability.arcaneOutcomes].sort((a, b) => {
			const aCat = a.outcomeCards.some((c) => c.isCatastrophe);
			const bCat = b.outcomeCards.some((c) => c.isCatastrophe);
			if (aCat !== bCat) return aCat ? 1 : -1;

			const aVal = Number(a.outcomeCards[0]?.value) || 0;
			const bVal = Number(b.outcomeCards[0]?.value) || 0;
			if (aVal !== bVal) return aVal - bVal;

			const aColor = colorOrder[a.outcomeCards[0]?.color ?? ''] ?? 99;
			const bColor = colorOrder[b.outcomeCards[0]?.color ?? ''] ?? 99;
			return aColor - bColor;
		})
	);
</script>

<div class="ability">
	<div class="header">
		<h4>{ability.name}{#if ability.reloadsAbility}&nbsp;[{ability.reloadsAbility.name}]{/if}</h4>
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
		<p><em>Once per turn</em></p>
	{/if}
	{#if ability.oncePerGame}
		<p><em>Once per game</em></p>
	{/if}
	{#if ability.description}
		<p class="description"><RichText nodes={ability.description} /></p>
	{/if}
	{#each sortedOutcomes as outcome (outcome.id)}
		<div class="outcome-row">
			{#each outcome.outcomeCards as card, i (i)}
				{#if card.isCatastrophe}
					<span class="cardValue Catastrophe">Catastrophe</span>
				{:else}
					<span class="cardValue {card.color}">{card.value}</span>
				{/if}
			{/each}
			<p class="description"><RichText nodes={outcome.outcomeText} /></p>
		</div>
	{/each}
</div>

<style>
	.ability {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.header {
		display: flex;
		width: 100%;
		align-items: center;
		gap: var(--space-sm);
	}

	.header h4 {
		margin-right: auto;
	}

	.meta {
		font-size: 1rem;
	}

	.description {
		text-align: left;
	}

	.outcome-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.cardValue {
		text-wrap: nowrap;
		font-weight: 400;
		border-width: 1px;
		padding: var(--space-xs);
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
