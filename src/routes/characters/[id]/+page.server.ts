import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { env } from '$env/dynamic/private';
import { CharacterSchema } from '$lib/types/character';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const API_BASE_URL = env.API_BASE_URL;
	if (!API_BASE_URL) {
		throw new Error('API_BASE_URL environment variable is not set');
	}

	try {
		const response = await fetch(`${API_BASE_URL}/characters/${params.id}`);
		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Character not found');
			}
			throw new Error(`Failed to fetch character with status ${response.status}`);
		}
		const character = v.parse(CharacterSchema, await response.json());

		return { character, apiBaseUrl: API_BASE_URL };
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) {
			throw err;
		}
		console.error('Error fetching character:', err);
		throw error(500, 'Failed to fetch character');
	}
}) satisfies PageServerLoad;
