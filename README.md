# Design Reference Hub

> Current package: **V1.3** — demo maturity + Agent Package + provenance polish

> **See it. Name it. Build it.**

A visual reference library for people who build web interfaces with coding agents but may not know the design vocabulary yet.

The product deliberately optimizes for this workflow:

**Browse → See → Pick → Copy → Vibe Coding**

## Current V1.3

- ShaderGradient-powered full-screen Hero using the 10 official upstream presets
- ShaderGradient-style landing sequence: live preset gallery → marketing demos → Agent handoff
- 93 curated reference entries
- 8 content categories: Styles, Pages, Sections, Background, Motion, Text, Effects, DESIGN.md
- Live/interactive preview renderer shared by gallery cards and detail pages
- Search, category and subcategory filters
- Demo maturity labels: OFFICIAL LIVE / WORKING DEMO / PROTOTYPE / LINK ONLY
- Detailed Agent Package copy/download for weaker coding agents
- Copy Prompt / Copy DESIGN.md / implementation starter
- Starter `index.html` download for Pages/Sections
- Curated Collections
- 184-source research index with license triage (182 researched sources + Framer Marketplace Templates/Assets review)
- Hash-based routing for GitHub Pages compatibility
- Reduced-motion, coarse-pointer and WebGL-context virtualization fallbacks
- GitHub Actions Pages deployment
- Korean-first product UI with English canonical design/effect names
- Routing/interaction polish pass documented under `/docs`
- Detailed Codex handoff and live-demo backlog under `/docs`

## Stack

- React 18 + TypeScript + Vite
- `@shadergradient/react` + Three.js for the hero and Shader Gradient reference
- CSS/React Hub-original demos for most reference previews
- Lucide icons
- React Router HashRouter

ShaderGradient v2 supports React 18/19; for Vite with React 18 the project uses the R3F 8.x line. See the upstream repository before changing this version matrix.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

> **Internal-use note:** GitHub Pages hosting is not a privacy boundary by itself. Keep the repository/site on an access-controlled company GitHub/Pages setup or internal static host before adding internal-only DESIGN.md, screenshots, prompts, project names, or company assets. The V1 public-source dataset is also marked `noindex`, but `noindex` is not access control.

1. Create a GitHub repository and push this project to `main`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` or run the `Deploy to GitHub Pages` workflow manually.
4. The app uses `HashRouter` and Vite `base: './'`, so project Pages URLs work without SPA rewrite rules.

Example:

```text
https://<org-or-user>.github.io/design-reference-hub/
```

## Content architecture

```text
src/data/references.ts
        │
        ├── Gallery cards
        ├── Search / filters
        ├── Detail pages
        ├── Collections
        └── Agent copy blocks

reference.demo
        ↓
src/components/demos/DemoRenderer.tsx
        ↓
shared live preview in card + detail
```

A new reference should normally require:

1. One metadata entry in `src/data/references.ts`
2. One `demo` key implemented in `DemoRenderer.tsx` if a new behavior is needed
3. Source/license evidence

Do **not** create a new route/page per reference.

## License policy

The Hub repository itself is MIT. That does **not** make every linked external source, screenshot, font, image, icon or brand asset MIT.

Reference decisions are intentionally separated:

- **Copy OK** — permissive implementation or Hub-original demo
- **Reference** — useful to discover, but source redistribution is custom/mixed/unclear
- **Restricted** — do not ingest source code into this catalog

The source research snapshot lives in `src/data/source-map.json` and is exposed through `/sources`.

## Important docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [`docs/REFERENCE_SCHEMA.md`](docs/REFERENCE_SCHEMA.md)
- [`docs/DEMO_IMPLEMENTATION_GUIDE.md`](docs/DEMO_IMPLEMENTATION_GUIDE.md)
- [`docs/LIVE_DEMO_BACKLOG.md`](docs/LIVE_DEMO_BACKLOG.md)
- [`docs/SOURCE_LICENSE_POLICY.md`](docs/SOURCE_LICENSE_POLICY.md)
- [`docs/CODEX_HANDOFF.md`](docs/CODEX_HANDOFF.md)
- [`docs/SHADERGRADIENT_PORT.md`](docs/SHADERGRADIENT_PORT.md)
- [`docs/THIRD_PARTY_ATTRIBUTION.md`](docs/THIRD_PARTY_ATTRIBUTION.md)
- [`docs/V1_3_CHANGELOG.md`](docs/V1_3_CHANGELOG.md)
- [`docs/USER_ADJUSTMENTS_V1_3.md`](docs/USER_ADJUSTMENTS_V1_3.md)
- [`docs/ANTIGRAVITY_PROMPT.md`](docs/ANTIGRAVITY_PROMPT.md)
- [`docs/CODEX_PRIORITY_PROMPT.md`](docs/CODEX_PRIORITY_PROMPT.md)
- [`docs/BUILD_VERIFICATION_V1_3.md`](docs/BUILD_VERIFICATION_V1_3.md)
- [`docs/V1_2_CHANGELOG.md`](docs/V1_2_CHANGELOG.md)
- [`docs/POLISH_PASS_2026-09-06.md`](docs/POLISH_PASS_2026-09-06.md)

## Product principle

This is not an AI generator, chatbot, or design-system administration product.

The experience should remain visually led:

> **Example first → name second → copy third.**
