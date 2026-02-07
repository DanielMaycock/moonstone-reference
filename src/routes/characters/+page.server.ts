import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { API_BASE_URL } from '$env/static/private';
import { CharacterSchema } from '$lib/types/character';

const CharacterListSchema = v.array(
	v.pick(CharacterSchema, ['id', 'name', 'factions', 'keywords', 'headFilename'])
);

export const load = async () => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/characters?fields=factions&fields=keywords&fields=headFilename`
		);
		if (!response.ok) {
			throw new Error(`Failed to fetch characters with status ${response.status}`);
		}
		const characters = v.parse(CharacterListSchema, await response.json());

		return { characters, apiBaseUrl: API_BASE_URL };
	} catch (err) {
		console.error('Error fetching characters:', err);
		throw error(500, 'Failed to fetch characters');
	}
};
