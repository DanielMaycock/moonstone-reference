<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error - Moonstone Reference</title>
</svelte:head>

<h1>{page.status}</h1>
<p>{page.error?.message}</p>
