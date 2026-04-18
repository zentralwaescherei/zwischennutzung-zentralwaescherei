# Zwischennutzung Zentralwaescherei

German-language public website (Next.js) with Strapi CMS. This repository is a **pnpm** monorepo with `frontend` and `cms` packages.

## Prerequisites

- **Node.js 20 LTS** (recommended for Strapi and native SQLite bindings in local dev)
- **Corepack** enabled (ships with Node) so `pnpm` is available via `corepack pnpm`

```bash
corepack enable
```

The repo pins `packageManager` to **pnpm@9.12.0** in the root `package.json`.

## Setup

From the repository root:

```bash
corepack pnpm install
```

Install Playwright browsers once (for end-to-end tests):

```bash
corepack pnpm --filter frontend exec playwright install chromium
```

## Development

Start Next.js and Strapi together:

```bash
corepack pnpm dev
```

- Frontend: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Strapi admin: [http://127.0.0.1:1337/admin](http://127.0.0.1:1337/admin)

Set `FRONTEND_URL` in `cms/.env` if the public UI runs on another origin (CORS).

## Scripts (root)

| Command | Description |
|--------|-------------|
| `corepack pnpm dev` | Next + Strapi dev in parallel |
| `corepack pnpm test` | Frontend Vitest + Playwright smoke (`frontend` only) |

Per-package:

```bash
corepack pnpm --filter frontend test
corepack pnpm --filter frontend test:e2e
corepack pnpm --filter frontend build
corepack pnpm --filter cms develop
```

## Launch checklist

Editorial and QA steps before go-live: [docs/content-entry-checklist.md](docs/content-entry-checklist.md).

## Deployment flags

- `NEXT_PUBLIC_VOTE_MODE=1` enables a persistent top strap on `/` with the vote date and a link to the most recent published blog post. Off by default.
- `NEXT_PUBLIC_SITE_URL` sets the canonical base URL used in the sitemap (default `https://zentralwaescherei.example`).

## Tests

- Unit + component: `corepack pnpm --filter frontend test`
- End-to-end (smoke + redirects + a11y): `corepack pnpm --filter frontend test:e2e`
- Full suite: `corepack pnpm test`

## Repository layout

- `frontend/` — Next.js App Router site
- `cms/` — Strapi v5 API and admin
- `docs/superpowers/` — design spec and implementation plan
