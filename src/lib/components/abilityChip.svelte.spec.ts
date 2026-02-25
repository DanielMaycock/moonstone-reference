import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import AbilityChip from './abilityChip.svelte';

const ability = {
	id: 'efb6024d-b8a0-4893-82dc-636e9b520bd7',
	name: 'Ghastly Scream',
	type: 'Arcane',
	energyCost: 4,
	oncePerTurn: false,
	oncePerGame: false,
	range: 6,
	pulse: false,
	description: [{ type: 'text' as const, value: 'Move target enemy away.' }],
	arcaneOutcomes: []
};

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

async function hoverAndWait(container: HTMLElement) {
	const link = container.querySelector('a');
	expect(link).not.toBeNull();
	link?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
	await vi.waitFor(() => {
		expect(container.querySelector('[role="tooltip"]')).not.toBeNull();
	});
}

describe('abilityChip.svelte', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse(ability)))
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders chip label inside an anchor link', () => {
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		const link = container.querySelector(`a[href="/abilities/${ability.id}"]`);
		expect(link).not.toBeNull();
		const chip = link?.querySelector('.chip.ability');
		expect(chip).not.toBeNull();
		expect(chip?.textContent).toBe(ability.name);
	});

	it('does not render tooltip before hover', () => {
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		expect(container.querySelector('[role="tooltip"]')).toBeNull();
	});

	it('shows tooltip with energy, range, and description after mouseenter', async () => {
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		await hoverAndWait(container);
		const tooltip = container.querySelector('[role="tooltip"]');
		expect(tooltip?.textContent).toContain('4 Energy');
		expect(tooltip?.textContent).toContain('6" Range');
		expect(tooltip?.textContent).toContain('Move target enemy away.');
	});

	it('omits description section when description is null', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ ...ability, description: null })))
		);
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		await hoverAndWait(container);
		expect(container.querySelector('.tooltip-description')).toBeNull();
	});

	it('shows "Pulse" label when pulse is true', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ ...ability, pulse: true })))
		);
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		await hoverAndWait(container);
		expect(container.querySelector('[role="tooltip"]')?.textContent).toContain('Pulse');
		expect(container.querySelector('[role="tooltip"]')?.textContent).not.toContain('Range');
	});

	it('omits energy section when energyCost is null', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ ...ability, energyCost: null })))
		);
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		await hoverAndWait(container);
		expect(container.querySelector('[role="tooltip"]')?.textContent).not.toContain('Energy');
	});

	it('omits range section when range is null', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ ...ability, range: null })))
		);
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		await hoverAndWait(container);
		expect(container.querySelector('[role="tooltip"]')?.textContent).not.toContain('Range');
		expect(container.querySelector('[role="tooltip"]')?.textContent).not.toContain('Pulse');
	});

	it('does not re-fetch on second mouseenter', async () => {
		const { container } = render(AbilityChip, { id: ability.id, name: ability.name });
		const link = container.querySelector('a');
		expect(link).not.toBeNull();
		link?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
		await vi.waitFor(() => {
			expect(container.querySelector('[role="tooltip"]')).not.toBeNull();
		});
		link?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
		expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
	});
});
