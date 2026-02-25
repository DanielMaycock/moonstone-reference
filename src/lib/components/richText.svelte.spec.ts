import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { RichTextNode } from '$lib/types/character';
import RichText from './richText.svelte';

describe('richText.svelte', () => {
	it('renders a text node as plain text', async () => {
		const nodes: RichTextNode[] = [{ type: 'text', value: 'hello world' }];
		render(RichText, { nodes });
		await expect.element(page.getByText('hello world')).toBeInTheDocument();
	});

	it('renders an ability node as a chip', async () => {
		const nodes: RichTextNode[] = [{ type: 'ability', id: 'abc-123', name: 'Ghastly Scream' }];
		const { container } = render(RichText, { nodes });
		const chip = container.querySelector('.chip.ability');
		expect(chip).not.toBeNull();
		expect(chip?.textContent).toBe('Ghastly Scream');
	});

	it('renders a keyword node using value when present', async () => {
		const nodes: RichTextNode[] = [{ type: 'keyword', name: 'Bleed', value: 'Bleed (1)' }];
		const { container } = render(RichText, { nodes });
		const chip = container.querySelector('.chip.keyword');
		expect(chip).not.toBeNull();
		expect(chip?.textContent).toBe('Bleed (1)');
	});

	it('renders a keyword node using name when value is absent', async () => {
		const nodes: RichTextNode[] = [{ type: 'keyword', name: 'Faerie' }];
		const { container } = render(RichText, { nodes });
		const chip = container.querySelector('.chip.keyword');
		expect(chip).not.toBeNull();
		expect(chip?.textContent).toBe('Faerie');
	});

	it('renders a damageType node as a chip', async () => {
		const nodes: RichTextNode[] = [{ type: 'damageType', name: 'Slicing' }];
		const { container } = render(RichText, { nodes });
		const chip = container.querySelector('.chip.damageType');
		expect(chip).not.toBeNull();
		expect(chip?.textContent).toBe('Slicing');
	});

	it('renders an arcaneCard node as a styled span', async () => {
		const nodes: RichTextNode[] = [{ type: 'arcaneCard', color: 'Green', value: '2' }];
		const { container } = render(RichText, { nodes });
		const card = container.querySelector('.arcaneCard.Green');
		expect(card).not.toBeNull();
		expect(card?.textContent).toBe('2');
	});

	it('renders a catastrophe node as a styled span', async () => {
		const nodes: RichTextNode[] = [{ type: 'catastrophe' }];
		const { container } = render(RichText, { nodes });
		const span = container.querySelector('.catastrophe');
		expect(span).not.toBeNull();
		expect(span?.textContent).toBe('Catastrophe');
	});

	it('renders a character node as a chip', async () => {
		const nodes: RichTextNode[] = [{ type: 'character', id: 'abc-123', name: 'Young Jack' }];
		const { container } = render(RichText, { nodes });
		const chip = container.querySelector('.chip');
		expect(chip).not.toBeNull();
		expect(chip?.textContent).toBe('Young Jack');
	});

	it('renders multiple mixed nodes in order', async () => {
		const nodes: RichTextNode[] = [
			{ type: 'text', value: 'Deals ' },
			{ type: 'damageType', name: 'Slicing' },
			{ type: 'text', value: ' damage to ' },
			{ type: 'keyword', name: 'Faerie' }
		];
		const { container } = render(RichText, { nodes });
		await expect.element(page.getByText(/Deals/)).toBeInTheDocument();
		expect(container.querySelectorAll('.chip').length).toBe(2);
		expect(container.querySelector('.chip.damageType')?.textContent).toBe('Slicing');
		expect(container.querySelector('.chip.keyword')?.textContent).toBe('Faerie');
	});
});
