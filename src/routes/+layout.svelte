<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<nav>
	<a href={resolve('/')} aria-current={page.url.pathname === '/'}>Home</a>
	<a href={resolve('/characters')} aria-current={page.url.pathname === '/characters'}>Characters</a>
</nav>

<div>
	{@render children()}
</div>

<style>
	nav {
		position: sticky;
		top: 0;
		background-color: var(--bg-color);
		width: 100%;
		height: 60px;
		display: flex;
		align-items: center;
		font-size: 16px;
		border-bottom: var(--text-color) 2px solid;
		padding: 0px 20px;
	}

	@media (min-width: 768px) {
		nav {
			padding: 0px 80px;
		}
	}

	nav a {
		margin-right: 40px;
		text-decoration: none;
		color: var(--text-color);
	}

	nav a:hover {
		text-decoration: underline;
	}

	nav a:visited {
		color: var(--text-color);
	}

	nav a[aria-current='true'] {
		font-weight: bold;
		text-decoration: underline;
	}

	@media (min-width: 768px) {
		div {
			padding: 10px 80px;
		}
	}
</style>
