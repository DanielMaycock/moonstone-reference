import type { ServerLoadEvent } from '@sveltejs/kit';
import { isHttpError } from '@sveltejs/kit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: { API_BASE_URL: 'https://test-api.example.com' }
}));

const banshee = {
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
	},
	abilities: [
		{
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
		}
	]
};

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

function loadEvent(id: string) {
	return { params: { id } } as unknown as ServerLoadEvent<
		{ id: string },
		object,
		'/characters/[id]'
	>;
}

describe('character detail load', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse(banshee)))
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('fetches and returns a parsed character', async () => {
		const { load } = await import('./+page.server');
		const result = await load(loadEvent(banshee.id));

		expect(result.character).toEqual(banshee);
		expect(result.apiBaseUrl).toBe('https://test-api.example.com');
	});

	it('constructs the correct API URL from params.id', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent(banshee.id));

		expect(fetch).toHaveBeenCalledWith(`https://test-api.example.com/characters/${banshee.id}`);
	});

	it('throws 404 when the API returns 404', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ error: 'Not found' }, 404)))
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent('nonexistent-id'));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(404);
		}
	});

	it('throws 500 when the API returns a non-404 error', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ error: 'Server error' }, 503)))
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent(banshee.id));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});

	it('throws 500 when fetch rejects (network error)', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.reject(new TypeError('Failed to fetch')))
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent(banshee.id));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});

	it('throws 500 when response fails schema validation', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ id: banshee.id, name: 'Banshee' })))
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent(banshee.id));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});
});
