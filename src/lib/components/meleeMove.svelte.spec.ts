import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { MeleeMove } from '$lib/types/character';
import MeleeMoveComponent from './meleeMove.svelte';

// Banshee's Lacerate: all fields populated
const lacerate: MeleeMove = {
	id: '51916402-3cbc-45ad-86aa-700c3b0d7e86',
	name: 'Lacerate',
	additionalEffects: 'Reduce Dmg suffered by -2 if the enemy has at least one Bleed.',
	endStep:
		'If the enemy suffered 1 or more wounds during this round of melee, the enemy model gains [Bleed: During the Discard Step, this character suffers 1 wound then loses this ability].',
	upgrades: 'Rising attack',
	damageTypes: ['Magical', 'Slicing'],
	meleeOutcomes: [
		{ opposingMove: 'High guard', damage: 2, isCounter: false },
		{ opposingMove: 'Falling swing', damage: 1, isCounter: false },
		{ opposingMove: 'Sweeping cut', damage: 2, isCounter: false },
		{ opposingMove: 'Thrust', damage: 2, isCounter: false },
		{ opposingMove: 'Low guard', damage: null, isCounter: false },
		{ opposingMove: 'Rising attack', damage: 1, isCounter: false }
	]
};

// Doug's Ankle Biter: null endStep, single damage type
const ankleBiter: MeleeMove = {
	id: '492a69a0-715b-4838-8c3d-f7e851c33ea5',
	name: 'Ankle Biter',
	additionalEffects:
		'This attack deals \u2205 damage against models which are further than 1" away.',
	endStep: null,
	upgrades: 'Rising attack',
	damageTypes: ['Impact'],
	meleeOutcomes: [
		{ opposingMove: 'High guard', damage: 3, isCounter: false },
		{ opposingMove: 'Falling swing', damage: 3, isCounter: false },
		{ opposingMove: 'Sweeping cut', damage: 3, isCounter: false },
		{ opposingMove: 'Thrust', damage: 3, isCounter: false },
		{ opposingMove: 'Low guard', damage: null, isCounter: false },
		{ opposingMove: 'Rising attack', damage: 2, isCounter: false }
	]
};

// Minimal move: null additionalEffects, null endStep, null damageTypes
const minimalMove: MeleeMove = {
	id: 'minimal-1',
	name: 'Basic Strike',
	additionalEffects: null,
	endStep: null,
	upgrades: 'Falling swing',
	damageTypes: null,
	meleeOutcomes: [
		{ opposingMove: 'High guard', damage: 1, isCounter: true },
		{ opposingMove: 'Low guard', damage: null, isCounter: false }
	]
};

describe('meleeMove.svelte', () => {
	it('renders the move name', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByRole('heading', { name: 'Lacerate' })).toBeInTheDocument();
	});

	it('shows the upgrade text', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByText('Upgrade for Rising attack')).toBeInTheDocument();
	});

	it('shows damage types when present', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByText('Magical, Slicing')).toBeInTheDocument();
	});

	it('shows single damage type', async () => {
		render(MeleeMoveComponent, { meleeMove: ankleBiter });
		await expect.element(page.getByText('Impact')).toBeInTheDocument();
	});

	it('hides damage types when null', async () => {
		render(MeleeMoveComponent, { meleeMove: minimalMove });
		await expect.element(page.getByText('Damage types:')).not.toBeInTheDocument();
	});

	it('renders all outcome rows in the table', async () => {
		const { container } = render(MeleeMoveComponent, { meleeMove: lacerate });
		const rows = container.querySelectorAll('tbody tr');
		expect(rows.length).toBe(6);
	});

	it('renders opposing move names in the table', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByText('High guard')).toBeInTheDocument();
		await expect.element(page.getByText('Low guard')).toBeInTheDocument();
		await expect.element(page.getByText('Thrust')).toBeInTheDocument();
	});

	it('displays numeric damage values', async () => {
		const { container } = render(MeleeMoveComponent, { meleeMove: lacerate });
		const rows = container.querySelectorAll('tbody tr');
		// High guard row: damage = 2
		const highGuardCells = rows[0].querySelectorAll('td');
		expect(highGuardCells[1].textContent).toBe('2');
	});

	it('displays null damage as empty set symbol', async () => {
		const { container } = render(MeleeMoveComponent, { meleeMove: lacerate });
		const rows = container.querySelectorAll('tbody tr');
		// Low guard row (index 4): damage = null → ∅
		const lowGuardCells = rows[4].querySelectorAll('td');
		expect(lowGuardCells[1].textContent).toBe('\u2205');
	});

	it('displays "Yes" for counter and "No" for non-counter', async () => {
		const { container } = render(MeleeMoveComponent, { meleeMove: minimalMove });
		const rows = container.querySelectorAll('tbody tr');
		// First row: isCounter = true
		expect(rows[0].querySelectorAll('td')[2].textContent).toBe('Yes');
		// Second row: isCounter = false
		expect(rows[1].querySelectorAll('td')[2].textContent).toBe('No');
	});

	it('shows additional effects when present', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByText(/Reduce Dmg suffered by -2/)).toBeInTheDocument();
	});

	it('hides additional effects when null', async () => {
		render(MeleeMoveComponent, { meleeMove: minimalMove });
		await expect.element(page.getByText('Reduce Dmg')).not.toBeInTheDocument();
	});

	it('shows end step when present', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByText(/End Step:/)).toBeInTheDocument();
		await expect.element(page.getByText(/the enemy model gains \[Bleed/)).toBeInTheDocument();
	});

	it('hides end step when null', async () => {
		render(MeleeMoveComponent, { meleeMove: ankleBiter });
		await expect.element(page.getByText('End Step:')).not.toBeInTheDocument();
	});

	it('renders table headers', async () => {
		render(MeleeMoveComponent, { meleeMove: lacerate });
		await expect.element(page.getByText('Damage dealt')).toBeInTheDocument();
		await expect.element(page.getByText('Follow up?')).toBeInTheDocument();
	});
});
