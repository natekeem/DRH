# awesome-design-md Ingestion

## Overview

All DESIGN.md entries from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) have been fully ingested into the Design Reference Hub.

| Field | Value |
|-------|-------|
| Upstream repo | https://github.com/VoltAgent/awesome-design-md |
| Upstream commit | `8147538b4226ae41e2487a9179e3bcc1f68e8554` |
| License | MIT (Copyright 2026 VoltAgent) |
| Ingested entries | 74 |
| Ingestion date | 2026-09-08 |

## What was imported

All DESIGN.md files under `design-md/` at the above commit SHA. Each entry:
- Is stored verbatim in `public/vendor/awesome-design-md/<slug>/DESIGN.md`
- Has parsed metadata (colors, tokens, description) in `src/data/awesomeDesignMd.ts`
- Is registered in `src/data/references.ts` as a `DESIGN.md` category entry with ID `admd-<slug>`
- Generates 3 artifact tabs: **DESIGN.md** (lazy-fetched raw), **Tokens** (normalised JSON), **Agent** (usage guide)
- Shows an offline token-based preview (no external network requests)

## File structure

```
third_party/awesome-design-md/
  LICENSE          ← upstream MIT text (preserved verbatim)
  UPSTREAM.md      ← ingestion provenance record

public/vendor/awesome-design-md/
  <slug>/
    DESIGN.md      ← raw upstream file (NOT modified)

src/data/
  awesomeDesignMd.ts    ← AUTO-GENERATED — do not edit manually

scripts/
  sync-awesome-design-md.mjs   ← re-ingestable sync script
  audit-design-md.mjs          ← audit script
```

## Collections added

| Collection ID | Title |
|--------------|-------|
| `brand-design-systems` | Brand Design Systems |
| `brand-ai-llm` | AI & LLM Design |
| `brand-developer` | Developer Tool Design |
| `brand-automotive` | Automotive & Luxury |
| `brand-retro` | Retro Web |

## How to re-sync

```bash
npm run sync:awesome-design-md
```

This re-fetches the upstream directory listing and DESIGN.md files via GitHub API, regenerates `src/data/awesomeDesignMd.ts`, and updates `third_party/awesome-design-md/UPSTREAM.md`.

## How to audit

```bash
npm run audit:design-md
```

Checks: DESIGN.md presence for all slugs, upstream commit SHA in generated file, third_party attribution files, unique slugs, external dependency scan, documentation presence.

## Offline policy

All entries are fully offline-safe:
- Raw DESIGN.md files are served as Vite public static assets (`/vendor/awesome-design-md/<slug>/DESIGN.md`)
- Preview is generated from normalised CSS tokens (no external fonts, no CDN, no images)
- Proprietary font families (SF Pro, Sohne, Geist, etc.) are replaced with `system-ui` fallbacks in normalised tokens
- No brand logos, trademarks, or proprietary assets are included

## Entries (74 total)

Grouped by subcategory:

### AI & LLM
claude, cohere, elevenlabs, minimax, mistral.ai, ollama, opencode.ai, replicate, runwayml, together.ai, voltagent, x.ai

### Developer Tools
cursor, expo, lovable, raycast, superhuman, vercel, warp

### Backend & DevOps
clickhouse, composio, hashicorp, mongodb, sanity, sentry, supabase

### SaaS & Productivity
airtable, cal, figma, framer, intercom, linear.app, miro, mintlify, notion, posthog, resend, slack, webflow, zapier

### Fintech & Crypto
binance, coinbase, kraken, mastercard, revolut, stripe, wise

### E-commerce & Consumer
airbnb, nike, pinterest, shopify, spotify, starbucks, uber

### Big Tech
apple, ibm, meta, nvidia, hp, vodafone

### Automotive
bmw, bmw-m, bugatti, ferrari, lamborghini, renault, tesla

### Automotive & Space
spacex

### Retro Web
dell-1996, nintendo-2001, playstation, theverge, wired

### Design Tools
clay

## License

Upstream DESIGN.md files: MIT — Copyright (c) 2026 VoltAgent
DRH preview and derived artifacts: MIT — Copyright (c) Design Reference Hub contributors

MIT license text is preserved verbatim at `third_party/awesome-design-md/LICENSE`.
