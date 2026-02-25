import type { RequestEvent } from '@sveltejs/kit';
import { isHttpError } from '@sveltejs/kit';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({
	env: { API_BASE_URL: 'https://test-api.example.com' }
}));

const ability = {
	id: 'efb6024d-b8a0-4893-82dc-636e9b520bd7',
	name: 'Ghastly Scream',
	type: 'Arcane',
	energyCost: 4,
	oncePerTurn: false,
	oncePerGame: false,
	range: 6,
	pulse: false,
	description: null,
	arcaneOutcomes: []
};

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

function makeEvent(id: string, fetchFn: () => Promise<Response>) {
	return {
		params: { id },
		fetch: fetchFn
	} as unknown as RequestEvent<{ id: string }, '/api/abilities/[id]'>;
}

describe('GET /api/abilities/[id]', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns 200 with parsed ability JSON on success', async () => {
		const { GET } = await import('./+server');
		const fetchFn = vi.fn(() => Promise.resolve(jsonResponse(ability)));
		const event = makeEvent(ability.id, fetchFn);
		const response = await GET(event);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data).toEqual(ability);
	});

	it('calls the upstream API with format=rich', async () => {
		const { GET } = await import('./+server');
		const fetchFn = vi.fn(() => Promise.resolve(jsonResponse(ability)));
		const event = makeEvent(ability.id, fetchFn);
		await GET(event);
		expect(fetchFn).toHaveBeenCalledWith(
			`https://test-api.example.com/abilities/${ability.id}?format=rich`
		);
	});

	it('returns 404 when upstream returns 404', async () => {
		const { GET } = await import('./+server');
		const event = makeEvent('nonexistent', () =>
			Promise.resolve(jsonResponse({ error: 'Not found' }, 404))
		);
		try {
			await GET(event);
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(404);
		}
	});

	it('returns 500 when upstream errors', async () => {
		const { GET } = await import('./+server');
		const event = makeEvent(ability.id, () =>
			Promise.resolve(jsonResponse({ error: 'Server error' }, 503))
		);
		try {
			await GET(event);
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});

	it('returns 500 when response fails schema validation', async () => {
		const { GET } = await import('./+server');
		const event = makeEvent(ability.id, () =>
			Promise.resolve(jsonResponse({ id: ability.id, name: 'Partial' }))
		);
		try {
			await GET(event);
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});
});
