<script lang="ts">
	import Chip from '$lib/components/chip.svelte';
	import type { RichTextNode } from '$lib/types/character';

	const { nodes }: { nodes: RichTextNode[] } = $props();
</script>

{#each nodes as node}
	{#if node.type === 'text'}
		{node.value}
	{:else if node.type === 'ability'}
		<Chip label={node.name} variant="ability" />
	{:else if node.type === 'keyword'}
		<Chip label={node.value ?? node.name} variant="keyword" />
	{:else if node.type === 'damageType'}
		<Chip label={node.name} variant="damageType" />
	{:else if node.type === 'arcaneCard'}
		<span class="arcaneCard {node.color}">{node.value}</span>
	{:else if node.type === 'catastrophe'}
		<span class="catastrophe">Catastrophe</span>
	{:else if node.type === 'character'}
		<Chip label={node.name} variant="keyword" />
	{/if}
{/each}

<style>
	.arcaneCard {
		font-weight: 400;
		border-width: 1px;
		border-style: solid;
		border-color: var(--text-color);
		padding: var(--space-xs);
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
		font-weight: 400;
		border-width: 1px;
		border-style: solid;
		border-color: var(--text-color);
		padding: var(--space-xs);
		background-color: var(--catastrophe-card-color);
	}
</style>
