import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CharacterAvatar from './characterAvatar.svelte';

describe('characterAvatar.svelte', () => {
	it('renders an image with the correct src and alt', async () => {
		render(CharacterAvatar, {
			src: 'https://test-api.example.com/images/Banshee.webp',
			alt: 'Banshee',
			size: 72
		});
		const img = page.getByRole('img', { name: 'Banshee' });
		await expect.element(img).toBeInTheDocument();
		await expect
			.element(img)
			.toHaveAttribute('src', 'https://test-api.example.com/images/Banshee.webp');
	});

	it('sets image width and height attributes from size prop', async () => {
		render(CharacterAvatar, {
			src: 'https://test-api.example.com/images/Banshee.webp',
			alt: 'Banshee',
			size: 64
		});
		const img = page.getByRole('img', { name: 'Banshee' });
		await expect.element(img).toHaveAttribute('width', '64');
		await expect.element(img).toHaveAttribute('height', '64');
	});

	it('sets container dimensions from size prop', async () => {
		const { container } = render(CharacterAvatar, {
			src: 'https://test-api.example.com/images/Banshee.webp',
			alt: 'Banshee',
			size: 72
		});
		const avatar = container.querySelector('.avatar') as HTMLElement;
		expect(avatar).not.toBeNull();
		expect(avatar.style.width).toBe('72px');
		expect(avatar.style.height).toBe('72px');
	});
});
