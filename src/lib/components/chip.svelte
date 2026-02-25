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
		padding: 0.1em 0.35em;
		border-radius: 3px;
		border: 1px solid currentColor;
		white-space: nowrap;
	}

	.ability {
		color: var(--pink-card-color);
	}

	.keyword {
		color: var(--green-card-color);
	}

	.damageType {
		color: var(--blue-card-color);
	}
</style>
