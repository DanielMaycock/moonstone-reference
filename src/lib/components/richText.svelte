<script lang="ts">
	import AbilityChip from '$lib/components/abilityChip.svelte';
	import Chip from '$lib/components/chip.svelte';
	import type { RichTextNode } from '$lib/types/character';

	const { nodes }: { nodes: RichTextNode[] } = $props();
</script>

{#each nodes as node}
	{#if node.type === 'text'}
		{node.value}
	{:else if node.type === 'ability'}
		<AbilityChip id={node.id} name={node.name} />
	{:else if node.type === 'keyword'}
		<Chip label={node.value ?? node.name} variant="keyword" />
	{:else if node.type === 'damageType'}
		<Chip label={node.name} variant="damageType" />
	{:else if node.type === 'arcaneCard'}
		{#if node.catastrophe}
			<span class="catastrophe">Catastrophe</span>
		{:else}
			<span class="arcaneCard {node.color}">{node.value}</span>
		{/if}
	{:else if node.type === 'character'}
		<Chip label={node.name} variant="keyword" />
	{/if}
{/each}

<style>
	.arcaneCard,
	.catastrophe {
		font-size: 0.875em;
		font-weight: 500;
		border: 1px solid var(--text-color);
		border-radius: 3px;
		padding: 0.2em 0.25em 0.1em;
		margin-inline: 0.2em;
		vertical-align: middle;
		line-height: 1;
	}

	.arcaneCard.Pink {
		background-color: var(--pink-card-color);
	}

	.arcaneCard.Green {
		background-color: var(--green-card-color);
	}

	.arcaneCard.Blue {
		background-color: var(--blue-card-color);
	}

	.catastrophe {
		background-color: var(--catastrophe-card-color);
	}
</style>
