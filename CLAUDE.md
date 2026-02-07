# Moonstone Reference

SvelteKit 2 / Svelte 5 app for browsing Moonstone tabletop game characters and abilities.

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run check` — svelte-check type checking
- `bun run lint` — biome lint + format check
- `bun run lint:fix` — biome auto-fix
- `bun run format` — biome format
- `bun run test` — run all tests once
- `bun run test:unit` — run vitest in watch mode

## Stack

- **Framework:** SvelteKit 2 with Svelte 5 (runes mode — `$props()`, `$derived()`, `$state()`)
- **Language:** TypeScript (strict mode)
- **Validation:** Valibot — define schemas, derive types with `v.InferInput<typeof Schema>`
- **Tooling:** Biome for formatting and linting, svelte-check for type checking
- **Testing:** Vitest with Playwright browser provider for component tests
- **Package manager:** Bun

## Code Style

- Tabs, 100 char line width, single quotes, no trailing commas (enforced by Biome)
- Svelte components use `const { prop } = $props()` (not `let`)
- Types live in `src/lib/types/` as Valibot schemas with co-located type exports
- Components live in `src/lib/components/` with camelCase filenames
- Data fetching in `+page.server.ts` load functions; validate API responses with Valibot
- `API_BASE_URL` env var configures the external API endpoint (`$env/static/private`)

## Biome Caveats

Biome's Svelte support is experimental. `noUnusedVariables` and `noUnusedImports` are turned off because Biome cannot see variables/imports used in Svelte template markup.

## Git commit guidelines

All commits should start with a summary, this should be prefix with one of the below depending on the changes in the commit
- feat - the commit is a new feature
- fix - the commit fixes a bug or issue

Below this should be a list of more details of the changes made.

Do not add co-authored text to commit messages