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
		<p class="description">
			{#each outcome.outcomeCards as card, i (i)}{#if i > 0 && i === outcome.outcomeCards.length - 1}<span> or </span>{:else if i > 0}<span>, </span>{/if}{#if card.isCatastrophe}
					<span class="cardValue Catastrophe">Catastrophe</span>
				{:else}
					<span class="cardValue {card.color}">{card.value}</span>
				{/if}
			{/each}<span class="colon"> :</span>
			<RichText nodes={outcome.outcomeText} />
		</p>
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

	p.description + p.description {
		margin-top: var(--space-xs);
	}

	.colon {
		font-size: 1em;
	}

	.cardValue {
		text-wrap: nowrap;
		font-size: 0.875em;
		font-weight: 500;
		border: 1px solid var(--text-color);
		border-radius: 3px;
		padding: 0.15em 0.25em;
		margin-inline: 0.2em;
		vertical-align: middle;
	}

	.cardValue.Pink {
		background-color: var(--pink-card-color);
	}
	.cardValue.Green {
		background-color: var(--green-card-color);
	}
	.cardValue.Blue {
		background-color: var(--blue-card-color);
	}
	.cardValue.Catastrophe {
		background-color: var(--catastrophe-card-color);
	}
</style>
