import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import { env } from '$env/dynamic/private';
import { CharacterSchema } from '$lib/types/character';

const CharacterListSchema = v.array(
	v.pick(CharacterSchema, ['id', 'name', 'factions', 'keywords', 'headFilename'])
);

const FactionsSchema = v.array(v.object({ name: v.string() }));
const KeywordsSchema = v.array(v.object({ keyword: v.string() }));

export const load = async ({ url }) => {
	const API_BASE_URL = env.API_BASE_URL;
	if (!API_BASE_URL) {
		throw new Error('API_BASE_URL environment variable is not set');
	}

	const search = url.searchParams.get('search') ?? '';
	const faction = url.searchParams.get('faction') ?? '';
	const keyword = url.searchParams.get('keyword') ?? '';

	try {
		const characterParams = new URLSearchParams([
			['fields', 'factions'],
			['fields', 'keywords'],
			['fields', 'headFilename']
		]);
		if (search) characterParams.set('name', search);
		if (faction) characterParams.set('faction', faction);
		if (keyword) characterParams.set('keyword', keyword);

		const [charactersResponse, factionsResponse, keywordsResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/characters?${characterParams}`),
			fetch(`${API_BASE_URL}/factions`),
			fetch(`${API_BASE_URL}/keywords`)
		]);

		if (!charactersResponse.ok) {
			throw new Error(`Failed to fetch characters with status ${charactersResponse.status}`);
		}
		if (!factionsResponse.ok) {
			throw new Error(`Failed to fetch factions with status ${factionsResponse.status}`);
		}
		if (!keywordsResponse.ok) {
			throw new Error(`Failed to fetch keywords with status ${keywordsResponse.status}`);
		}

		const characters = v.parse(CharacterListSchema, await charactersResponse.json());
		const factions = v.parse(FactionsSchema, await factionsResponse.json());
		const keywords = v.parse(KeywordsSchema, await keywordsResponse.json());

		return {
			characters,
			factions: factions.map((f) => f.name),
			keywords: keywords.map((k) => k.keyword),
			filters: { search, faction, keyword },
			apiBaseUrl: API_BASE_URL
		};
	} catch (err) {
		console.error('Error fetching characters:', err);
		throw error(500, 'Failed to fetch characters');
	}
};
