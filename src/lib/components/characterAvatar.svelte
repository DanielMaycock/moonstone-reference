<script lang="ts">
	const { src, alt, size }: { src: string; alt: string; size: number } = $props();
</script>

<div class="avatar" style:width="{size}px" style:height="{size}px">
	<img {src} {alt} width={size} height={size} />
</div>

<style>
	.avatar {
		flex-shrink: 0;
		background-color: var(--avatar-bg-color);
		border: 2px solid var(--text-color);
		overflow: hidden;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
