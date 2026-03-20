import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { Ability } from '$lib/types/character';
import Page from './+page.svelte';

const ability: Ability = {
	id: 'efb6024d-b8a0-4893-82dc-636e9b520bd7',
	name: 'Ghastly Scream',
	type: 'Arcane',
	energyCost: 4,
	oncePerTurn: false,
	oncePerGame: false,
	range: 6,
	pulse: false,
	description: null,
	reloadsAbility: null,
	arcaneOutcomes: []
};

function renderPage(from?: string | null) {
	return render(Page, { data: { ability, from: from ?? null } });
}

describe('ability detail page', () => {
	it('renders the ability name as a heading', async () => {
		renderPage();
		await expect.element(page.getByRole('heading', { name: 'Ghastly Scream' })).toBeInTheDocument();
	});

	it('renders energy cost', async () => {
		renderPage();
		await expect.element(page.getByText('4 Energy')).toBeInTheDocument();
	});

	it('renders range', async () => {
		renderPage();
		await expect.element(page.getByText('6" Range')).toBeInTheDocument();
	});

	it('renders back link when from is present', async () => {
		const { container } = renderPage('character-abc');
		const link = container.querySelector('a[href="/characters/character-abc"]');
		expect(link).not.toBeNull();
		expect(link?.textContent).toContain('Back');
	});

	it('does not render back link when from is absent', async () => {
		const { container } = renderPage();
		const link = container.querySelector('a[href^="/characters/"]');
		expect(link).toBeNull();
	});
});
