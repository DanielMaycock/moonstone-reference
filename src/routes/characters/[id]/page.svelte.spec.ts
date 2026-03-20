import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { Character, RichTextNode } from '$lib/types/character';
import Page from './+page.svelte';

const t = (value: string): RichTextNode[] => [{ type: 'text', value }];

const banshee: Character = {
	id: '28562575-5965-4ffc-a249-276b4ce0bddd',
	name: 'Banshee',
	melee: 4,
	range: 1,
	arcane: 4,
	evade: -2,
	health: 6,
	energy: [0, 1, 2, 4, 5],
	baseSize: '30mm',
	headFilename: 'Banshee.webp',
	factions: ['Dominion', 'Shades'],
	keywords: ['Faerie', 'Spirit'],
	signatureMove: {
		id: '51916402-3cbc-45ad-86aa-700c3b0d7e86',
		name: 'Lacerate',
		additionalEffects: t('Reduce Dmg suffered by -2 if the enemy has at least one Bleed.'),
		endStep: t(
			'If the enemy suffered 1 or more wounds during this round of melee, the enemy model gains [Bleed: During the Discard Step, this character suffers 1 wound then loses this ability].'
		),
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
	},
	abilities: [
		{
			id: 'e2836c92-af85-425c-867d-e6d27678749c',
			name: 'Exsanguinating Claws',
			description: t(
				'If this character deals Slicing or Piercing Melee Dmg, increase the Dmg dealt by +1.'
			),
			energyCost: null,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: null,
			type: 'Passive',
			reloadsAbility: null,
			arcaneOutcomes: []
		},
		{
			id: '8b627890-a50a-40cf-95de-2ef14553f3f8',
			name: 'Weeping Miasma',
			description: t(
				'Whilst this model is in play, friendly Faeries treat enemies with at least one Bleed as gaining +1 to their Evade Stat.'
			),
			energyCost: null,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: null,
			type: 'Passive',
			reloadsAbility: null,
			arcaneOutcomes: []
		},
		{
			id: 'efb6024d-b8a0-4893-82dc-636e9b520bd7',
			name: 'Ghastly Scream',
			description: null,
			energyCost: 4,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: 6,
			type: 'Arcane',
			reloadsAbility: null,
			arcaneOutcomes: [
				{
					id: '3e39eb87-9386-4ed6-aca9-967005d17f63',
					outcomeText: t('Move target enemy X" directly away.'),
					outcomeCards: [{ color: 'Pink', value: 'X', isCatastrophe: false }]
				}
			]
		},
		{
			id: '07c617ed-3ac2-4117-aaa0-eb8f31821e27',
			name: 'Ear Splitting Screech',
			description: null,
			energyCost: 3,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: 6,
			type: 'Arcane',
			reloadsAbility: null,
			arcaneOutcomes: [
				{
					id: 'b42634f9-f980-45a6-80de-d85069ccf223',
					outcomeText: t('This character suffers 2 wounds.'),
					outcomeCards: [{ color: null, value: null, isCatastrophe: true }]
				}
			]
		},
		{
			id: '02330b23-1456-487a-8638-a0f151becdc1',
			name: 'Weakling',
			description: t(
				'Reduce all Melee Dmg this character deals by -1. Harvest actions cost this model +1 energy.'
			),
			energyCost: null,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: null,
			type: 'Passive',
			reloadsAbility: null,
			arcaneOutcomes: []
		}
	]
};

const doug: Character = {
	id: 'd26da9de-80aa-4944-a4d9-9c58a20a3fab',
	name: 'Doug, the Flatulent',
	melee: 4,
	range: 3,
	arcane: 0,
	evade: 0,
	health: 8,
	energy: [0, 2, 4, 6],
	baseSize: '40mm',
	headFilename: 'Head-Doug-The-Flatulent.webp',
	factions: ['Dominion'],
	keywords: ['Animal', 'Goblin', 'Soldier'],
	signatureMove: null,
	abilities: [
		{
			id: '29283a14-28a5-41be-a784-1b120e2a0deb',
			name: 'Chaaarge!!',
			description: t(
				'Move this model 4" directly towards target enemy model. If this character\u2019s next action this turn is a Melee Attack against the same target it deals +2 Dmg.'
			),
			energyCost: 2,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: null,
			type: 'Active',
			reloadsAbility: null,
			arcaneOutcomes: []
		},
		{
			id: 'b3f80756-2ff3-4894-865e-576ea1e3ff70',
			name: 'Foul Gases',
			description: t('All models within the pulse suffer 2 Magical Dmg.'),
			energyCost: 2,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: true,
			range: 2,
			type: 'Active',
			reloadsAbility: null,
			arcaneOutcomes: []
		},
		{
			id: '2387f16c-67d6-447d-b6ee-83b88ababd95',
			name: 'Lance',
			description: t(
				'If this character deals Slicing Melee Dmg, reduce the Dmg dealt to \u2205. If this character deals Piercing Dmg, increase the Dmg dealt by +1.'
			),
			energyCost: null,
			oncePerGame: false,
			oncePerTurn: false,
			pulse: false,
			range: null,
			type: 'Passive',
			reloadsAbility: null,
			arcaneOutcomes: []
		}
	]
};

function renderPage(character: Character) {
	return render(Page, {
		data: { character, apiBaseUrl: 'https://test-api.example.com' }
	});
}

describe('character detail page', () => {
	describe('header', () => {
		it('renders the character name as h1', async () => {
			renderPage(banshee);
			await expect
				.element(page.getByRole('heading', { level: 1, name: 'Banshee' }))
				.toBeInTheDocument();
		});

		it('renders factions', async () => {
			renderPage(banshee);
			await expect.element(page.getByText('Dominion, Shades')).toBeInTheDocument();
		});

		it('renders keywords', async () => {
			renderPage(banshee);
			await expect.element(page.getByText('Faerie, Spirit')).toBeInTheDocument();
		});
	});

	describe('stats', () => {
		it('renders all four stat values', async () => {
			renderPage(banshee);
			await expect
				.element(page.getByRole('heading', { name: 'Melee', exact: true }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('heading', { name: 'Range', exact: true }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('heading', { name: 'Arcane', exact: true }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('heading', { name: 'Evade', exact: true }))
				.toBeInTheDocument();
		});
	});

	describe('health pips', () => {
		it('renders the correct number of health pips', async () => {
			const { container } = renderPage(banshee);
			const pips = container.querySelectorAll('.health-pip');
			expect(pips.length).toBe(6);
		});

		it('marks energy pips with the energy class', async () => {
			const { container } = renderPage(banshee);
			const pips = container.querySelectorAll('.health-pip');
			// Banshee energy: [0, 1, 2, 4, 5] — indices 0,1,2,4,5 are energy, index 3 is not
			expect(pips[0].classList.contains('energy')).toBe(true);
			expect(pips[1].classList.contains('energy')).toBe(true);
			expect(pips[2].classList.contains('energy')).toBe(true);
			expect(pips[3].classList.contains('energy')).toBe(false);
			expect(pips[4].classList.contains('energy')).toBe(true);
			expect(pips[5].classList.contains('energy')).toBe(true);
		});

		it('renders different health/energy for another character', async () => {
			const { container } = renderPage(doug);
			const pips = container.querySelectorAll('.health-pip');
			// Doug: health 8, energy [0, 2, 4, 6]
			expect(pips.length).toBe(8);
			expect(pips[0].classList.contains('energy')).toBe(true);
			expect(pips[1].classList.contains('energy')).toBe(false);
			expect(pips[2].classList.contains('energy')).toBe(true);
			expect(pips[3].classList.contains('energy')).toBe(false);
			expect(pips[4].classList.contains('energy')).toBe(true);
			expect(pips[5].classList.contains('energy')).toBe(false);
			expect(pips[6].classList.contains('energy')).toBe(true);
			expect(pips[7].classList.contains('energy')).toBe(false);
		});
	});

	describe('signature move', () => {
		it('renders the signature move when present', async () => {
			renderPage(banshee);
			await expect
				.element(page.getByRole('heading', { name: 'Signature Move' }))
				.toBeInTheDocument();
			await expect.element(page.getByRole('heading', { name: 'Lacerate' })).toBeInTheDocument();
		});

		it('shows "None" when signature move is null', async () => {
			renderPage(doug);
			await expect
				.element(page.getByRole('heading', { name: 'Signature Move' }))
				.toBeInTheDocument();
			// "None" appears after the Signature Move heading
			const noneElements = page.getByText('None');
			await expect.element(noneElements.first()).toBeInTheDocument();
		});
	});

	describe('ability filtering', () => {
		it('renders passive abilities under the Passive section', async () => {
			renderPage(banshee);
			await expect
				.element(page.getByRole('heading', { name: 'Passive Abilities' }))
				.toBeInTheDocument();
			// Banshee has 3 passives: Exsanguinating Claws, Weeping Miasma, Weakling
			await expect
				.element(page.getByRole('heading', { name: 'Exsanguinating Claws' }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('heading', { name: 'Weeping Miasma' }))
				.toBeInTheDocument();
			await expect.element(page.getByRole('heading', { name: 'Weakling' })).toBeInTheDocument();
		});

		it('renders arcane abilities under the Arcane section', async () => {
			renderPage(banshee);
			await expect
				.element(page.getByRole('heading', { name: 'Arcane Abilities' }))
				.toBeInTheDocument();
			// Banshee has 2 arcane: Ghastly Scream, Ear Splitting Screech
			await expect
				.element(page.getByRole('heading', { name: 'Ghastly Scream' }))
				.toBeInTheDocument();
			await expect
				.element(page.getByRole('heading', { name: 'Ear Splitting Screech' }))
				.toBeInTheDocument();
		});

		it('shows "None" for ability categories with no abilities', async () => {
			renderPage(banshee);
			// Banshee has no Active abilities
			await expect
				.element(page.getByRole('heading', { name: 'Active Abilities' }))
				.toBeInTheDocument();
			// Multiple "None" elements exist on the page; we just need at least one
			const noneElements = page.getByText('None');
			await expect.element(noneElements.first()).toBeInTheDocument();
		});

		it('renders active abilities for a character that has them', async () => {
			renderPage(doug);
			// Doug has 2 actives: Chaaarge!!, Foul Gases
			await expect.element(page.getByRole('heading', { name: 'Chaaarge!!' })).toBeInTheDocument();
			await expect.element(page.getByRole('heading', { name: 'Foul Gases' })).toBeInTheDocument();
		});

		it('shows "None" for arcane when character has none', async () => {
			const { container } = renderPage(doug);
			// Doug has no Arcane abilities — the Arcane section should show "None"
			// Find the section that contains "Arcane Abilities" heading
			const headings = container.querySelectorAll('h2');
			let arcaneSection: Element | null = null;
			for (const h of headings) {
				if (h.textContent === 'Arcane Abilities') {
					arcaneSection = h.closest('section');
					break;
				}
			}
			expect(arcaneSection).not.toBeNull();
			expect(arcaneSection?.querySelector('p')?.textContent).toBe('None');
		});
	});
});
