<script lang="ts">
	import { getContext, tick } from 'svelte'
	import AbilityPanel from '$lib/components/ability.svelte'
	import Chip from '$lib/components/chip.svelte'
	import type { Ability } from '$lib/types/character'

	const { id, name }: { id: string; name: string } = $props()

	const characterId = getContext<string | undefined>('characterId')

	let ability = $state<Ability | null>(null)
	let loading = $state(false)
	// biome-ignore lint/style/useConst: bind:this requires let
	let tooltipEl = $state<HTMLSpanElement | null>(null)

	async function loadAbility() {
		if (ability === null && !loading) {
			loading = true
			try {
				const res = await fetch(`/api/abilities/${id}`)
				if (res.ok) ability = await res.json()
			} finally {
				loading = false
			}
			await tick() // wait for {#if ability} to mount tooltipEl
		}
		correctTooltipPosition()
	}

	function correctTooltipPosition() {
		if (!tooltipEl) return
		tooltipEl.style.transform = 'translateX(-50%)'
		const rect = tooltipEl.getBoundingClientRect()
		const margin = 8
		let offset = 0
		if (rect.right > window.innerWidth - margin) {
			offset = window.innerWidth - margin - rect.right
		} else if (rect.left < margin) {
			offset = margin - rect.left
		}
		tooltipEl.style.transform = `translateX(calc(-50% + ${offset}px))`
	}
</script>

<span class="chip-wrapper">
	<a
		href="/abilities/{id}{characterId ? `?from=${characterId}` : ''}"
		onmouseenter={loadAbility}
		onfocus={loadAbility}
	>
		<Chip label={name} variant="ability" />
	</a>
	{#if ability}
		<span class="tooltip" role="tooltip" bind:this={tooltipEl}>
			<AbilityPanel {ability} />
		</span>
	{/if}
</span>

<style>
	.chip-wrapper {
		position: relative;
		display: inline;
	}

	a {
		text-decoration: none;
		color: inherit;
	}

	.tooltip {
		visibility: hidden;
		position: absolute;
		bottom: calc(100% + var(--space-xs));
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		background-color: var(--bg-color);
		color: var(--text-color);
		border: 1px solid var(--text-color);
		border-radius: 3px;
		padding: var(--space-sm) var(--space-md);
		width: max-content;
		max-width: 36rem;
		font-size: 0.85rem;
		pointer-events: none;
	}

	.chip-wrapper:hover .tooltip,
	.chip-wrapper:focus-within .tooltip {
		visibility: visible;
	}
</style>
