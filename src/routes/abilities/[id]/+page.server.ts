import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { env } from '$env/dynamic/private';
import { AbilitySchema } from '$lib/types/character';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, url }) => {
	const API_BASE_URL = env.API_BASE_URL;
	if (!API_BASE_URL) {
		throw new Error('API_BASE_URL environment variable is not set');
	}

	try {
		const response = await fetch(`${API_BASE_URL}/abilities/${params.id}?format=rich`);
		if (!response.ok) {
			if (response.status === 404) throw error(404, 'Ability not found');
			throw new Error(`Failed to fetch ability with status ${response.status}`);
		}
		const ability = v.parse(AbilitySchema, await response.json());
		return { ability, from: url.searchParams.get('from') };
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) throw err;
		console.error('Error fetching ability:', err);
		throw error(500, 'Failed to fetch ability');
	}
}) satisfies PageServerLoad;
