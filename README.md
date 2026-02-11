# Moonstone Reference

A quick-reference web app for the [Moonstone](https://moonstonethegame.com/) tabletop game. Browse characters, view stats, abilities and signature moves.

## Tech Stack

- **Framework:** SvelteKit 2 / Svelte 5
- **Language:** TypeScript (strict mode)
- **Validation:** Valibot
- **Tooling:** Biome, svelte-check
- **Testing:** Vitest with Playwright browser provider
- **Package manager:** Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- An API endpoint serving character data

### Install dependencies

```sh
bun install
```

### Environment variables

| Variable | Description |
|---|---|
| `API_BASE_URL` | Base URL of the external character data API |

### Run the dev server

```sh
bun run dev
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run check` | Type checking via svelte-check |
| `bun run lint` | Lint and format check via Biome |
| `bun run lint:fix` | Auto-fix lint and format issues |
| `bun run format` | Format code via Biome |
| `bun run test` | Run all tests once |
| `bun run test:unit` | Run Vitest in watch mode |

## Deployment

Docker support is included. See `Dockerfile`, `docker-compose.yml` and `docker-compose.prod.yml` for container configuration.
