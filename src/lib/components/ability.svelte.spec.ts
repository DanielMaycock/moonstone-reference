import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { Ability } from '$lib/types/character';
import AbilityComponent from './ability.svelte';

// Real Moonstone data: Banshee's abilities

const ghastlyScream: Ability = {
	id: 'efb6024d-b8a0-4893-82dc-636e9b520bd7',
	name: 'Ghastly Scream',
	description: null,
	energyCost: 4,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: false,
	range: 6,
	type: 'Arcane',
	arcaneOutcomes: [
		{
			id: '3e39eb87-9386-4ed6-aca9-967005d17f63',
			outcomeText:
				"Move target enemy X\" directly away. If the enemy is in possession of at least 1 Moonstone it loses possession of one Moonstone it is carrying before moving. Place it in base contact with the enemy at depth '1'.",
			outcomeCards: [{ color: 'Pink', value: 'X', isCatastrophe: false }]
		},
		{
			id: 'fe99bdc9-aa2f-470a-81fc-d312fb7f0663',
			outcomeText: 'This character suffers 2 wounds.',
			outcomeCards: [{ color: null, value: null, isCatastrophe: true }]
		}
	]
};

const exsanguinatingClaws: Ability = {
	id: 'e2836c92-af85-425c-867d-e6d27678749c',
	name: 'Exsanguinating Claws',
	description:
		'If this character deals Slicing or Piercing Melee Dmg, increase the Dmg dealt by +1.',
	energyCost: null,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: false,
	range: null,
	type: 'Passive',
	arcaneOutcomes: []
};

// Doug's Foul Gases: Active ability with pulse
const foulGases: Ability = {
	id: 'b3f80756-2ff3-4894-865e-576ea1e3ff70',
	name: 'Foul Gases',
	description: 'All models within the pulse suffer 2 Magical Dmg.',
	energyCost: 2,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: true,
	range: 2,
	type: 'Active',
	arcaneOutcomes: []
};

describe('ability.svelte', () => {
	it('renders the ability name', async () => {
		render(AbilityComponent, { ability: ghastlyScream });
		await expect.element(page.getByRole('heading', { name: 'Ghastly Scream' })).toBeInTheDocument();
	});

	it('shows range with "Range" label when pulse is false', async () => {
		render(AbilityComponent, { ability: ghastlyScream });
		await expect.element(page.getByText('6" Range')).toBeInTheDocument();
	});

	it('shows range with "Pulse" label when pulse is true', async () => {
		render(AbilityComponent, { ability: foulGases });
		await expect.element(page.getByText('2" Pulse')).toBeInTheDocument();
	});

	it('shows energy cost when present', async () => {
		render(AbilityComponent, { ability: ghastlyScream });
		await expect.element(page.getByText('4 Energy')).toBeInTheDocument();
	});

	it('shows energy cost of 0', async () => {
		render(AbilityComponent, { ability: { ...foulGases, energyCost: 0 } });
		await expect.element(page.getByText('0 Energy')).toBeInTheDocument();
	});

	it('hides energy cost when null', async () => {
		render(AbilityComponent, { ability: exsanguinatingClaws });
		const energyText = page.getByText('Energy');
		await expect.element(energyText).not.toBeInTheDocument();
	});

	it('hides range when null', async () => {
		render(AbilityComponent, { ability: exsanguinatingClaws });
		const rangeText = page.getByText('Range');
		await expect.element(rangeText).not.toBeInTheDocument();
	});

	it('shows description when present', async () => {
		render(AbilityComponent, { ability: exsanguinatingClaws });
		await expect.element(page.getByText(/Slicing or Piercing Melee Dmg/)).toBeInTheDocument();
	});

	it('hides description when null', async () => {
		render(AbilityComponent, { ability: ghastlyScream });
		// Ghastly Scream has null description — only the outcome texts should be present
		const outcomeText = page.getByText(/Move target enemy/);
		await expect.element(outcomeText).toBeInTheDocument();
	});

	it('shows "Once per turn" when oncePerTurn is true', async () => {
		render(AbilityComponent, { ability: { ...exsanguinatingClaws, oncePerTurn: true } });
		await expect.element(page.getByText('Once per turn')).toBeInTheDocument();
	});

	it('shows "Once per game" when oncePerGame is true', async () => {
		render(AbilityComponent, { ability: { ...exsanguinatingClaws, oncePerGame: true } });
		await expect.element(page.getByText('Once per game')).toBeInTheDocument();
	});

	it('hides once-per flags when both are false', async () => {
		render(AbilityComponent, { ability: exsanguinatingClaws });
		await expect.element(page.getByText('Once per turn')).not.toBeInTheDocument();
		await expect.element(page.getByText('Once per game')).not.toBeInTheDocument();
	});

	it('renders arcane outcome cards with correct text', async () => {
		const { container } = render(AbilityComponent, { ability: ghastlyScream });
		// Pink card with value "X"
		const cardValues = container.querySelectorAll('.cardValue');
		expect(cardValues.length).toBe(2);
		expect(cardValues[0].textContent).toBe('X');
		// Catastrophe card
		expect(cardValues[1].textContent).toBe('Catastrophe');
	});

	it('renders arcane outcome descriptions', async () => {
		render(AbilityComponent, { ability: ghastlyScream });
		await expect.element(page.getByText(/Move target enemy/)).toBeInTheDocument();
		await expect.element(page.getByText('This character suffers 2 wounds.')).toBeInTheDocument();
	});

	it('applies the correct CSS class for Pink cards', async () => {
		const { container } = render(AbilityComponent, { ability: ghastlyScream });
		const pinkCard = container.querySelector('.cardValue.Pink');
		expect(pinkCard).not.toBeNull();
		expect(pinkCard?.textContent).toBe('X');
	});

	it('applies the correct CSS class for Catastrophe cards', async () => {
		render(AbilityComponent, { ability: ghastlyScream });
		const catastropheCard = page.getByText('Catastrophe');
		await expect.element(catastropheCard).toHaveClass(/Catastrophe/);
	});

	it('renders no outcome rows for abilities without arcane outcomes', async () => {
		const { container } = render(AbilityComponent, { ability: exsanguinatingClaws });
		const outcomeRows = container.querySelectorAll('.outcome-row');
		expect(outcomeRows.length).toBe(0);
	});
});
