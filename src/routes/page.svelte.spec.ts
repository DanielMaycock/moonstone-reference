import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('home page', () => {
	it('renders the heading', async () => {
		render(Page);
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Moonstone Reference' }))
			.toBeInTheDocument();
	});

	it('renders the description', async () => {
		render(Page);
		await expect
			.element(page.getByText('A quick-reference app for the Moonstone tabletop game.'))
			.toBeInTheDocument();
	});

	it('has a link to the characters page', async () => {
		render(Page);
		const link = page.getByRole('link', { name: 'characters' });
		await expect.element(link).toBeInTheDocument();
		await expect.element(link).toHaveAttribute('href', '/characters');
	});
});
