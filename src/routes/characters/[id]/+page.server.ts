import { error } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';
import * as v from 'valibot';
import { CharacterSchema } from '$lib/types/character';

export const load = async ({ params }) => {
	try {
		const response = await fetch(`${API_BASE_URL}/characters/${params.id}`);
		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Character not found');
			}
			throw new Error('Failed to fetch character with status ' + response.status);
		}
		const character = v.parse(CharacterSchema, await response.json());

		return { character };
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) {
			throw err;
		}
		console.error('Error fetching character:', err);
		throw error(500, 'Failed to fetch character');
	}
};
