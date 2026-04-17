# Zwischennutzung Zentralwaescherei

German-language public website (Next.js) with Strapi CMS. This repository is a pnpm monorepo with `frontend` and `cms` packages.

## Prerequisites

- Node.js (LTS recommended)
- pnpm 9.12.0 (see `packageManager` in root `package.json`)

## Setup

From the repository root:

```bash
pnpm install
```

After `frontend/` and `cms/` exist as workspace packages (created in later tasks), run:

```bash
pnpm dev
```

Runs the Next.js app and Strapi admin in parallel.

## Scripts (root)

These scripts become usable after Task 2+ creates workspace packages:

- `pnpm dev`: Start frontend and CMS dev servers in parallel
- `pnpm test`: Run frontend unit tests and end-to-end tests

## Repository layout

- `frontend/` - public Next.js site (added in later tasks)
- `cms/` - Strapi v5 project (added in later tasks)
