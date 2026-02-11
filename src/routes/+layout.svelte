<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';

	const { children } = $props();

	let theme = $state<'light' | 'dark'>('light');

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
	}

	onMount(() => {
		const saved = localStorage.getItem('theme');
		const mql = window.matchMedia('(prefers-color-scheme: dark)');

		if (saved === 'light' || saved === 'dark') {
			theme = saved;
		} else {
			theme = mql.matches ? 'dark' : 'light';
		}
		document.documentElement.dataset.theme = theme;

		function handleChange(e: MediaQueryListEvent) {
			if (!localStorage.getItem('theme')) {
				theme = e.matches ? 'dark' : 'light';
				document.documentElement.dataset.theme = theme;
			}
		}

		mql.addEventListener('change', handleChange);
		return () => mql.removeEventListener('change', handleChange);
	});
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

<a href="#main-content" class="skip-link">Skip to content</a>

<nav>
	<a href={resolve('/')} aria-current={page.url.pathname === '/' ? 'page' : undefined}>Home</a>
	<a href={resolve('/characters')} aria-current={page.url.pathname === '/characters' ? 'page' : undefined}>Characters</a>
	<div class="theme-switch">
		<img src="/images/Commonwealth.webp" alt="Light mode" />
		<button
			class:dark={theme === 'dark'}
			onclick={toggleTheme}
			aria-label="Toggle theme"
			role="switch"
			aria-checked={theme === 'dark'}
		>
			<span class="thumb"></span>
		</button>
		<img src="/images/Dominion.webp" alt="Dark mode" />
	</div>
</nav>

<div class="content" id="main-content">
	{@render children()}
</div>

<style>
	.skip-link {
		position: absolute;
		left: -9999px;
		z-index: 20;
		padding: var(--space-sm) var(--space-md);
		background-color: var(--bg-color);
		color: var(--text-color);
		border: 2px solid var(--text-color);
		border-radius: 4px;
		text-decoration: none;
	}

	.skip-link:focus {
		left: var(--space-sm);
		top: var(--space-sm);
	}

	nav {
		position: sticky;
		top: 0;
		z-index: 10;
		background-color: var(--bg-color);
		width: 100%;
		box-sizing: border-box;
		height: 60px;
		display: flex;
		align-items: center;
		font-size: 1rem;
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

	nav a[aria-current='page'] {
		font-weight: bold;
		text-decoration: underline;
	}

	.theme-switch {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.theme-switch img {
		width: 28px;
		height: 28px;
		object-fit: contain;
	}

	.theme-switch button {
		background: var(--button-bg-color);
		border: 2px solid var(--text-color);
		border-radius: 14px;
		cursor: pointer;
		padding: 2px;
		position: relative;
		width: 48px;
		height: 28px;
		box-sizing: border-box;
	}

	.theme-switch button:hover {
		background: var(--button-hover-color);
	}

	.theme-switch .thumb {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--bg-color);
		top: 2px;
		left: 2px;
		transition: left 0.2s ease;
	}

	.theme-switch button.dark .thumb {
		left: calc(100% - 22px);
	}

	.content {
		padding: var(--space-md) 20px;
	}

	@media (min-width: 768px) {
		.content {
			padding: var(--space-md) 80px;
		}
	}
</style>
