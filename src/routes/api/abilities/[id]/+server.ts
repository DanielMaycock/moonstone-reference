import { error, json } from '@sveltejs/kit';
import * as v from 'valibot';
import { env } from '$env/dynamic/private';
import { AbilitySchema } from '$lib/types/character';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const API_BASE_URL = env.API_BASE_URL;
	try {
		const response = await fetch(`${API_BASE_URL}/abilities/${params.id}?format=rich`);
		if (!response.ok) {
			if (response.status === 404) throw error(404);
			throw new Error(`Upstream error: ${response.status}`);
		}
		const data = await response.json();
		return json(v.parse(AbilitySchema, data));
	} catch (err) {
		if (typeof err === 'object' && err !== null && 'status' in err) throw err;
		console.error('Error fetching ability:', err);
		throw error(500);
	}
};
