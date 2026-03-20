<script lang="ts">
	const { label, variant }: { label: string; variant: 'ability' | 'keyword' | 'damageType' } =
		$props();
</script>

<span class="chip {variant}">{label}</span>

<style>
	.chip {
		display: inline;
		font-size: 0.875em;
		font-weight: 500;
		padding: 0.2em 0.35em 0.1em;
		border-radius: 3px;
		border: 1px solid currentColor;
		white-space: nowrap;
		line-height: 1;
		vertical-align: middle;
	}

	.ability {
		color: var(--chip-ability-color);
	}

	.keyword {
		color: var(--chip-keyword-color);
	}

	.damageType {
		color: var(--chip-damage-color);
	}
</style>
