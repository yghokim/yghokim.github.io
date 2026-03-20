# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with HTTPS + Turbopack
npm run build    # Production build (static export)
npm run lint     # ESLint
```

No test suite exists in this project.

## Architecture

This is a **Next.js 15 static-export personal academic portfolio** for an HCI researcher, deployed to GitHub Pages. All content is data-driven from YAML/Markdown files in `private/data/`.

### Key Config

- `next.config.ts`: `output: "export"` — generates static HTML, no server-side runtime
- `basePath` is set via `PAGES_BASE_PATH` env var
- Path alias: `@/*` → `src/*`

### Data Flow

All site content originates in `private/data/` (YAML/Markdown). Files are loaded at **build time** using `src/app/_lib/utils.ts`:

```
private/data/publication.yml  →  loadYAML()  →  page.tsx (server component)  →  client components
```

The main data files:
- `publication.yml` — all publications, organized by section under `store:`, plus `affiliation_years` for the timeline
- `bio.yml`, `news.yml`, `interns.yml`, `press.yml`, `research.yml`, `areas.yml` — other site content

### Publication System

Publications in `publication.yml` follow this key naming convention: `[ShortTitle]-[Venue][YY]` (e.g., `Autiverse-CHI26`).

Required fields per entry: `key`, `year`, `month`, `type`, `title`, `authors`, `venue`

Notable optional fields:
- `selected: true` — appears on the home page
- `primary: true` — treated as first-author paper in the timeline visualization
- `award` — triggers award badge display
- `thumbnail` — image or `.mp4` path for the paper card
- `featured.video` — YouTube URL; appears in the home page video reel

**Publication pipeline** (`publication/page.tsx` → `_libs/common.ts` → `PublicationPageContent.tsx`):
1. `page.tsx` loads YAML, stamps each entry with its `section`, and calls `createPublicationTimelineData()`
2. `_libs/common.ts` parses venue names via regex (CHI, CSCW, DIS, UbiComp, TVCG), groups papers by year, and separates primary vs. coauthor papers for the timeline
3. `PublicationPageContent.tsx` (client component) renders two view modes — "By Year" and "By Type" — using `PublicationView` for individual cards

### Component Structure

```
src/app/
├── _lib/          # types.ts, utils.ts (loadYAML/loadText), fonts.ts
├── _components/   # Shared UI: PublicationView, BibtexPopover, VideoReel, layouts, ...
├── publication/   # Publication listing page + timeline
├── internship/    # Internship page
└── resources/     # Resources page
```

Pages are **React Server Components** that load data and pass it to `'use client'` components for interactivity.

### Tailwind Custom Tokens

Defined in `tailwind.config.ts`: `pointed`, `ink`, `badge`, `award`, `tag` colors; award variants `recognition`, `honorable`, `best`; sidebar width `322px`.
