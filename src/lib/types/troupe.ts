import * as v from 'valibot';

export const TroupeSchema = v.object({
	id: v.string(),
	name: v.string(),
	faction: v.string(),
	characterIds: v.array(v.string())
});

export type Troupe = v.InferInput<typeof TroupeSchema>;
