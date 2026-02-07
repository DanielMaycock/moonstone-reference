<script lang="ts">
	import type { MeleeMove } from '$lib/types/character';

	const { meleeMove }: { meleeMove: MeleeMove } = $props();
</script>

<div>
	<h4>{meleeMove.name}</h4>
	<p>Upgrade for {meleeMove.upgrades}</p>
	{#if meleeMove.damageTypes}
		<p><b>Damage types:</b> {meleeMove.damageTypes.join(', ')}</p>
	{/if}
	<table>
		<thead>
			<tr>
				<th></th>
				<th>Damage dealt</th>
				<th>Follow up?</th>
			</tr>
		</thead>
		<tbody>
			{#each meleeMove.meleeOutcomes as outcome}
				<tr>
					<td style="text-align: start;">{outcome.opposingMove}</td>
					<td>{outcome.damage ?? '∅'}</td>
					<td>{outcome.isCounter ? 'Yes' : 'No'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if meleeMove.additionalEffects}
		<p>{meleeMove.additionalEffects}</p>
	{/if}
	<p><b>End Step:</b> {meleeMove.endStep}</p>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
	}

	table {
		border-collapse: collapse;
		margin-top: 8px;
		margin-bottom: 16px;
	}

	th,
	td {
		padding-left: 0px;
		padding-bottom: 4px;
		padding-right: 12px;
		padding-top: 4px;
		text-align: center;
	}

	th {
		font-weight: 500;
		font-size: 16px;
	}

	td {
		font-weight: 300;
		font-size: 16px;
	}
</style>
