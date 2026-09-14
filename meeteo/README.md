# Meeteo

A weather forecast application built with Next.js, React and TypeScript.

## Architecture

The project follows Feature-Sliced Design (FSD) adapted for Next.js App Router:

```text
app/            Next.js entrypoints (layout, page), providers and global styles
views/          Page-level components (FSD "pages" layer, renamed to avoid Next.js reserved "pages" directory)
widgets/        Large composed UI blocks (e.g. weather overview)
features/       User actions and interactions (e.g. search, navigation)
entities/       Domain models and data access (city, location, weather, environment)
shared/         Reusable infrastructure, config, utilities and UI primitives
tests/          Unit, component and E2E tests (separated from production code)
```

## Getting Started

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- **`pnpm dev`** — Start development server
- **`pnpm build`** — Production build
- **`pnpm typecheck`** — TypeScript type checking
- **`pnpm lint`** — ESLint
- **`pnpm test`** — Jest unit and component tests
- **`pnpm test:e2e`** — Playwright E2E tests
