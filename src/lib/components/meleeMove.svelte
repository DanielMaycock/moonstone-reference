<script lang="ts">
	import Chip from '$lib/components/chip.svelte';
	import RichText from '$lib/components/richText.svelte';
	import type { MeleeMove } from '$lib/types/character';

	const { meleeMove }: { meleeMove: MeleeMove } = $props();
</script>

<div>
	<h4>{meleeMove.name}</h4>
	<p>Upgrade for {meleeMove.upgrades}</p>
	{#if meleeMove.damageTypes}
		<p class="damage-types">
			<b>Damage types:</b>
			{#each meleeMove.damageTypes as dt}
				<Chip label={dt} variant="damageType" />
			{/each}
		</p>
	{/if}
	<table>
		<thead>
			<tr>
				<th scope="col"><span class="visually-hidden">Opposing move</span></th>
				<th scope="col">Damage dealt</th>
				<th scope="col">Follow up?</th>
			</tr>
		</thead>
		<tbody>
			{#each meleeMove.meleeOutcomes as outcome (outcome.opposingMove)}
				<tr>
					<td class="move-name">{outcome.opposingMove}</td>
					<td>{outcome.damage ?? '∅'}</td>
					<td>{outcome.isCounter ? 'Yes' : 'No'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if meleeMove.additionalEffects}
		<p><RichText nodes={meleeMove.additionalEffects} /></p>
	{/if}
	{#if meleeMove.endStep}
		<p><b>End Step:</b> <RichText nodes={meleeMove.endStep} /></p>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	table {
		border-collapse: collapse;
		margin-top: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	th,
	td {
		padding-left: 0px;
		padding-bottom: var(--space-xs);
		padding-right: var(--space-md);
		padding-top: var(--space-xs);
		text-align: center;
	}

	th {
		font-weight: 500;
		font-size: 1rem;
	}

	td {
		font-weight: 300;
		font-size: 1rem;
	}

	.move-name {
		text-align: start;
	}
</style>
