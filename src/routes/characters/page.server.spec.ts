import type { ServerLoadEvent } from '@sveltejs/kit';
import { isHttpError } from '@sveltejs/kit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/static/private', () => ({
	API_BASE_URL: 'https://test-api.example.com'
}));

const bansheeListItem = {
	id: '28562575-5965-4ffc-a249-276b4ce0bddd',
	name: 'Banshee',
	factions: ['Dominion', 'Shades'],
	keywords: ['Faerie', 'Spirit'],
	headFilename: 'Banshee.webp'
};

const dougListItem = {
	id: 'd26da9de-80aa-4944-a4d9-9c58a20a3fab',
	name: 'Doug, the Flatulent',
	factions: ['Dominion'],
	keywords: ['Animal', 'Goblin', 'Soldier'],
	headFilename: 'Head-Doug-The-Flatulent.webp'
};

const factionsResponse = [
	{ name: 'Commonwealth' },
	{ name: 'Dominion' },
	{ name: 'Leshavult' },
	{ name: 'Shades' }
];

const keywordsResponse = [
	{ keyword: 'Animal' },
	{ keyword: 'Faerie' },
	{ keyword: 'Goblin' },
	{ keyword: 'Spirit' }
];

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

function makeUrl(params: Record<string, string> = {}) {
	const url = new URL('http://localhost/characters');
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	return url;
}

function loadEvent(params: Record<string, string> = {}) {
	return { url: makeUrl(params) } as unknown as ServerLoadEvent;
}

describe('characters list load', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) => {
				const url = typeof input === 'string' ? input : input.toString();
				if (url.includes('/factions')) return Promise.resolve(jsonResponse(factionsResponse));
				if (url.includes('/keywords')) return Promise.resolve(jsonResponse(keywordsResponse));
				return Promise.resolve(jsonResponse([bansheeListItem, dougListItem]));
			})
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns characters, factions, keywords, and filters', async () => {
		const { load } = await import('./+page.server');
		const result = await load(loadEvent());

		expect(result.characters).toEqual([bansheeListItem, dougListItem]);
		expect(result.factions).toEqual(['Commonwealth', 'Dominion', 'Leshavult', 'Shades']);
		expect(result.keywords).toEqual(['Animal', 'Faerie', 'Goblin', 'Spirit']);
		expect(result.filters).toEqual({ search: '', faction: '', keyword: '' });
		expect(result.apiBaseUrl).toBe('https://test-api.example.com');
	});

	it('fetches all three endpoints in parallel', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent());

		expect(fetch).toHaveBeenCalledTimes(3);
		const urls = vi.mocked(fetch).mock.calls.map((c) => c[0] as string);
		expect(urls.some((u) => u.includes('/characters?'))).toBe(true);
		expect(urls.some((u) => u.includes('/factions'))).toBe(true);
		expect(urls.some((u) => u.includes('/keywords'))).toBe(true);
	});

	it('builds the character URL with default field params', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent());

		const characterCall = vi
			.mocked(fetch)
			.mock.calls.find((c) => (c[0] as string).includes('/characters?'));
		const url = new URL(characterCall?.[0] as string);
		expect(url.searchParams.getAll('fields')).toEqual(['factions', 'keywords', 'headFilename']);
	});

	it('adds search param as name filter', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent({ search: 'ban' }));

		const characterCall = vi
			.mocked(fetch)
			.mock.calls.find((c) => (c[0] as string).includes('/characters?'));
		const url = new URL(characterCall?.[0] as string);
		expect(url.searchParams.get('name')).toBe('ban');
	});

	it('adds faction filter param', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent({ faction: 'Dominion' }));

		const characterCall = vi
			.mocked(fetch)
			.mock.calls.find((c) => (c[0] as string).includes('/characters?'));
		const url = new URL(characterCall?.[0] as string);
		expect(url.searchParams.get('faction')).toBe('Dominion');
	});

	it('adds keyword filter param', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent({ keyword: 'Faerie' }));

		const characterCall = vi
			.mocked(fetch)
			.mock.calls.find((c) => (c[0] as string).includes('/characters?'));
		const url = new URL(characterCall?.[0] as string);
		expect(url.searchParams.get('keyword')).toBe('Faerie');
	});

	it('omits empty filter params from the URL', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent());

		const characterCall = vi
			.mocked(fetch)
			.mock.calls.find((c) => (c[0] as string).includes('/characters?'));
		const url = new URL(characterCall?.[0] as string);
		expect(url.searchParams.has('name')).toBe(false);
		expect(url.searchParams.has('faction')).toBe(false);
		expect(url.searchParams.has('keyword')).toBe(false);
	});

	it('returns filter state from query params', async () => {
		const { load } = await import('./+page.server');
		const result = await load(loadEvent({ search: 'ban', faction: 'Dominion', keyword: 'Faerie' }));

		expect(result.filters).toEqual({
			search: 'ban',
			faction: 'Dominion',
			keyword: 'Faerie'
		});
	});

	it('throws 500 when characters endpoint returns non-ok', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) => {
				const url = typeof input === 'string' ? input : input.toString();
				if (url.includes('/factions')) return Promise.resolve(jsonResponse(factionsResponse));
				if (url.includes('/keywords')) return Promise.resolve(jsonResponse(keywordsResponse));
				return Promise.resolve(jsonResponse({ error: 'Server error' }, 503));
			})
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent());
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});

	it('throws 500 when factions endpoint returns non-ok', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) => {
				const url = typeof input === 'string' ? input : input.toString();
				if (url.includes('/factions')) return Promise.resolve(jsonResponse('Not found', 404));
				if (url.includes('/keywords')) return Promise.resolve(jsonResponse(keywordsResponse));
				return Promise.resolve(jsonResponse([bansheeListItem, dougListItem]));
			})
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent());
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
			await load(loadEvent());
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});

	it('throws 500 when API returns data that fails schema validation', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn((input: string | URL | Request) => {
				const url = typeof input === 'string' ? input : input.toString();
				if (url.includes('/factions')) return Promise.resolve(jsonResponse(factionsResponse));
				if (url.includes('/keywords')) return Promise.resolve(jsonResponse(keywordsResponse));
				// Missing required fields
				return Promise.resolve(jsonResponse([{ id: 'abc', name: 'Bad' }]));
			})
		);

		const { load } = await import('./+page.server');
		try {
			await load(loadEvent());
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});
});
