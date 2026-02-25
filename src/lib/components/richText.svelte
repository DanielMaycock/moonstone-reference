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
	{/if}
{/each}
