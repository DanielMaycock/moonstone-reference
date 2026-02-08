import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { AbilitySchema, CharacterSchema, MeleeMoveSchema } from './character';

// Real data from the Moonstone API

const ghastlyScream = {
	id: 'efb6024d-b8a0-4893-82dc-636e9b520bd7',
	name: 'Ghastly Scream',
	description: null,
	energyCost: 4,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: false,
	range: 6,
	type: 'Arcane' as const,
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

const exsanguinatingClaws = {
	id: 'e2836c92-af85-425c-867d-e6d27678749c',
	name: 'Exsanguinating Claws',
	description:
		'If this character deals Slicing or Piercing Melee Dmg, increase the Dmg dealt by +1.',
	energyCost: null,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: false,
	range: null,
	type: 'Passive' as const,
	arcaneOutcomes: []
};

const chaaarge = {
	id: '29283a14-28a5-41be-a784-1b120e2a0deb',
	name: 'Chaaarge!!',
	description:
		'Move this model 4" directly towards target enemy model. If this character\u2019s next action this turn is a Melee Attack against the same target it deals +2 Dmg.',
	energyCost: 2,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: false,
	range: null,
	type: 'Active' as const,
	arcaneOutcomes: []
};

const foulGases = {
	id: 'b3f80756-2ff3-4894-865e-576ea1e3ff70',
	name: 'Foul Gases',
	description: 'All models within the pulse suffer 2 Magical Dmg.',
	energyCost: 2,
	oncePerGame: false,
	oncePerTurn: false,
	pulse: true,
	range: 2,
	type: 'Active' as const,
	arcaneOutcomes: []
};

const lacerate = {
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

const ankleBiter = {
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
	signatureMove: lacerate,
	abilities: [exsanguinatingClaws, ghastlyScream]
};

const doug = {
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
	signatureMove: ankleBiter,
	abilities: [chaaarge, foulGases]
};

describe('AbilitySchema', () => {
	it('parses a Passive ability with null energyCost and range', () => {
		const result = v.parse(AbilitySchema, exsanguinatingClaws);
		expect(result).toEqual(exsanguinatingClaws);
	});

	it('parses an Arcane ability with outcomes and catastrophe cards', () => {
		const result = v.parse(AbilitySchema, ghastlyScream);
		expect(result.arcaneOutcomes).toHaveLength(2);
		expect(result.arcaneOutcomes[0].outcomeCards[0]).toEqual({
			color: 'Pink',
			value: 'X',
			isCatastrophe: false
		});
		expect(result.arcaneOutcomes[1].outcomeCards[0]).toEqual({
			color: null,
			value: null,
			isCatastrophe: true
		});
	});

	it('parses an Active ability with energyCost and no arcaneOutcomes', () => {
		const result = v.parse(AbilitySchema, chaaarge);
		expect(result.type).toBe('Active');
		expect(result.energyCost).toBe(2);
		expect(result.arcaneOutcomes).toEqual([]);
	});

	it('parses an Active ability with pulse and range', () => {
		const result = v.parse(AbilitySchema, foulGases);
		expect(result.pulse).toBe(true);
		expect(result.range).toBe(2);
	});

	it('accepts all three ability types', () => {
		for (const type of ['Active', 'Passive', 'Arcane']) {
			const result = v.parse(AbilitySchema, { ...exsanguinatingClaws, type });
			expect(result.type).toBe(type);
		}
	});

	it('rejects an invalid ability type', () => {
		expect(() => v.parse(AbilitySchema, { ...exsanguinatingClaws, type: 'Magic' })).toThrow();
	});

	it('accepts energyCost of 0', () => {
		const result = v.parse(AbilitySchema, { ...chaaarge, energyCost: 0 });
		expect(result.energyCost).toBe(0);
	});

	it('rejects missing required fields', () => {
		const { name, ...rest } = exsanguinatingClaws;
		expect(() => v.parse(AbilitySchema, rest)).toThrow();
	});

	it('rejects wrong field types', () => {
		expect(() => v.parse(AbilitySchema, { ...exsanguinatingClaws, oncePerTurn: 'yes' })).toThrow();
		expect(() => v.parse(AbilitySchema, { ...ghastlyScream, range: '6' })).toThrow();
	});
});

describe('MeleeMoveSchema', () => {
	it('parses Lacerate with all fields populated', () => {
		const result = v.parse(MeleeMoveSchema, lacerate);
		expect(result).toEqual(lacerate);
		expect(result.damageTypes).toEqual(['Magical', 'Slicing']);
		expect(result.additionalEffects).toBeTruthy();
		expect(result.endStep).toBeTruthy();
	});

	it('parses Ankle Biter with null endStep', () => {
		const result = v.parse(MeleeMoveSchema, ankleBiter);
		expect(result.endStep).toBeNull();
		expect(result.additionalEffects).toBeTruthy();
	});

	it('accepts all nullable fields as null', () => {
		const move = {
			...lacerate,
			additionalEffects: null,
			endStep: null,
			damageTypes: null
		};
		const result = v.parse(MeleeMoveSchema, move);
		expect(result.additionalEffects).toBeNull();
		expect(result.endStep).toBeNull();
		expect(result.damageTypes).toBeNull();
	});

	it('handles null damage in outcomes (Low guard)', () => {
		const lowGuard = lacerate.meleeOutcomes.find((o) => o.opposingMove === 'Low guard');
		expect(lowGuard).toBeDefined();
		expect(lowGuard?.damage).toBeNull();

		const result = v.parse(MeleeMoveSchema, lacerate);
		const parsed = result.meleeOutcomes.find((o) => o.opposingMove === 'Low guard');
		expect(parsed?.damage).toBeNull();
	});

	it('rejects missing required fields', () => {
		const { name, ...rest } = lacerate;
		expect(() => v.parse(MeleeMoveSchema, rest)).toThrow();
	});

	it('rejects wrong types in outcomes', () => {
		const badOutcome = { opposingMove: 'Slash', damage: 'three', isCounter: false };
		expect(() => v.parse(MeleeMoveSchema, { ...lacerate, meleeOutcomes: [badOutcome] })).toThrow();
	});
});

describe('CharacterSchema', () => {
	it('parses Banshee with full data', () => {
		const result = v.parse(CharacterSchema, banshee);
		expect(result.name).toBe('Banshee');
		expect(result.factions).toEqual(['Dominion', 'Shades']);
		expect(result.keywords).toEqual(['Faerie', 'Spirit']);
		expect(result.signatureMove?.name).toBe('Lacerate');
		expect(result.abilities).toHaveLength(2);
	});

	it('parses Doug with negative-free stats and single faction', () => {
		const result = v.parse(CharacterSchema, doug);
		expect(result.name).toBe('Doug, the Flatulent');
		expect(result.arcane).toBe(0);
		expect(result.evade).toBe(0);
		expect(result.factions).toEqual(['Dominion']);
		expect(result.keywords).toEqual(['Animal', 'Goblin', 'Soldier']);
	});

	it('accepts negative stat values', () => {
		const result = v.parse(CharacterSchema, banshee);
		expect(result.evade).toBe(-2);
	});

	it('accepts null signatureMove', () => {
		const result = v.parse(CharacterSchema, { ...banshee, signatureMove: null });
		expect(result.signatureMove).toBeNull();
	});

	it('accepts empty arrays for factions, keywords, abilities, and energy', () => {
		const char = {
			...banshee,
			factions: [],
			keywords: [],
			abilities: [],
			energy: []
		};
		const result = v.parse(CharacterSchema, char);
		expect(result.factions).toEqual([]);
		expect(result.keywords).toEqual([]);
		expect(result.abilities).toEqual([]);
		expect(result.energy).toEqual([]);
	});

	it('rejects missing required fields', () => {
		const { name, ...rest } = banshee;
		expect(() => v.parse(CharacterSchema, rest)).toThrow();
	});

	it('rejects wrong stat types', () => {
		expect(() => v.parse(CharacterSchema, { ...banshee, melee: '4' })).toThrow();
		expect(() => v.parse(CharacterSchema, { ...banshee, health: null })).toThrow();
	});

	it('rejects invalid nested ability data', () => {
		const badAbility = { ...exsanguinatingClaws, type: 'Invalid' };
		expect(() => v.parse(CharacterSchema, { ...banshee, abilities: [badAbility] })).toThrow();
	});

	it('rejects invalid nested signatureMove data', () => {
		const badMove = { ...lacerate, name: 123 };
		expect(() => v.parse(CharacterSchema, { ...banshee, signatureMove: badMove })).toThrow();
	});
});
