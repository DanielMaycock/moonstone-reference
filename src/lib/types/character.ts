import * as v from 'valibot';

export const AbilitySchema = v.object({
	id: v.string(),
	name: v.string(),
	type: v.union([v.literal('Active'), v.literal('Passive'), v.literal('Arcane')]),
	energyCost: v.nullable(v.number()),
	oncePerTurn: v.boolean(),
	oncePerGame: v.boolean(),
	range: v.nullable(v.number()),
	pulse: v.boolean(),
	description: v.nullable(v.string()),
	arcaneOutcomes: v.array(
		v.object({
			id: v.string(),
			outcomeCards: v.array(
				v.object({
					color: v.nullable(v.string()),
					value: v.nullable(v.string()),
					isCatastrophe: v.boolean()
				})
			),
			outcomeText: v.string()
		})
	)
});

export type Ability = v.InferInput<typeof AbilitySchema>;

export const MeleeMoveSchema = v.object({
	id: v.string(),
	name: v.string(),
	additionalEffects: v.nullable(v.string()),
	endStep: v.string(),
	upgrades: v.string(),
	damageTypes: v.nullable(v.array(v.string())),
	meleeOutcomes: v.array(
		v.object({
			opposingMove: v.string(),
			damage: v.nullable(v.number()),
			isCounter: v.boolean()
		})
	)
});

export type MeleeMove = v.InferInput<typeof MeleeMoveSchema>;

export const CharacterSchema = v.object({
	id: v.string(),
	name: v.string(),
	factions: v.array(v.string()),
	keywords: v.array(v.string()),
	melee: v.number(),
	range: v.number(),
	arcane: v.number(),
	evade: v.number(),
	health: v.number(),
	energy: v.array(v.number()),
	baseSize: v.string(),
	headFilename: v.string(),
	abilities: v.array(AbilitySchema),
	signatureMove: v.optional(MeleeMoveSchema)
});

export type Character = v.InferInput<typeof CharacterSchema>;
