import type { ServerLoadEvent } from '@sveltejs/kit';
import { isHttpError } from '@sveltejs/kit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
	reloadsAbility: null,
	arcaneOutcomes: []
};

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

function loadEvent(id: string, from?: string) {
	const url = new URL(`http://localhost/abilities/${id}`);
	if (from) url.searchParams.set('from', from);
	return { params: { id }, url } as unknown as ServerLoadEvent<
		{ id: string },
		object,
		'/abilities/[id]'
	>;
}

describe('ability detail load', () => {
	beforeEach(() => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse(ability)))
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('loads ability and returns it parsed', async () => {
		const { load } = await import('./+page.server');
		const result = await load(loadEvent(ability.id));
		expect(result.ability).toEqual(ability);
		expect(result.from).toBeNull();
	});

	it('returns from param when present', async () => {
		const { load } = await import('./+page.server');
		const result = await load(loadEvent(ability.id, 'character-123'));
		expect(result.from).toBe('character-123');
	});

	it('constructs the correct API URL from params.id', async () => {
		const { load } = await import('./+page.server');
		await load(loadEvent(ability.id));
		expect(fetch).toHaveBeenCalledWith(
			`https://test-api.example.com/abilities/${ability.id}?format=rich`
		);
	});

	it('throws 404 when upstream returns 404', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ error: 'Not found' }, 404)))
		);
		const { load } = await import('./+page.server');
		try {
			await load(loadEvent('nonexistent'));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(404);
		}
	});

	it('throws 500 on upstream error', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ error: 'Server error' }, 503)))
		);
		const { load } = await import('./+page.server');
		try {
			await load(loadEvent(ability.id));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});

	it('throws 500 on schema validation failure', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(jsonResponse({ id: ability.id, name: 'Partial' })))
		);
		const { load } = await import('./+page.server');
		try {
			await load(loadEvent(ability.id));
			expect.unreachable('Should have thrown');
		} catch (err) {
			expect(isHttpError(err)).toBe(true);
			if (isHttpError(err)) expect(err.status).toBe(500);
		}
	});
});
