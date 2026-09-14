# DRH V2.4 — Brand Experience Layer

Date: 2026-09-14
Branch: `codex/brand-experience-layer-v24`
Base: V2.3 `358edf8` (the V2.3 branch, not a separate main integration).

## Delivered experience

Brand Detail now uses the page as its scroll owner, with Overview → Design DNA → Component Library → Applied Canvas → Resources. Full technical inventory remains in the separate native “전체 카탈로그” dialog. Artifact workspace is disclosed under Resources. Every reference page ends with Continue in your project: download the available DESIGN.md or Agent Package, copy the apply prompt, and open the implementation guide.

Component Library groups Actions, Forms, Surfaces, Navigation, Data and Composition, with compact / medium / wide spans. Original metrics and source values are in Evidence disclosures. Typography compares Display, Heading, Body and Caption using source roles and bounded sizes; role mapping and original metrics remain visible in Evidence. Missing roles and Accent values remain explicitly absent. Local Korean fallbacks are labeled.

Applied Canvas always displays “DRH Applied Preview” and “공식 제품 화면이 아닌 디자인 시스템 적용 예시입니다.” Layout, copy, example balances, abstract shapes and interactions are DRH compositions; available buttons/cards/inputs use the same source-style normalizer as the library. No source document, font or branded image was added or rewritten.

| Reference | Applied composition |
|---|---|
| Apple | Editorial product hero, typography object, design/details selector, CTA |
| Baemin | Commerce heading, category selection, abstract menu cards, add action |
| Toss | Finance summary, account surface, transaction list, blue source action |
| KakaoBank | Source-yellow summary, account surface, transactions, black source action |
| Linear | Sidebar, issue search/filter, selectable issue cards |
| Coinbase | Finance summary, account surface, transactions, source blue accent |
| Spotify | Category selection, abstract album grid, preview action (no audio) |
| Ferrari | Typography, red motion-inspired abstract composition, source CTA |
| Nintendo 2001 | Snapshot palette, playful abstract forms, source action |
| Vercel | Developer editorial hero, geometric composition, source CTA |

Baemin has seven source buttons and no source cards or forms. Its menu cards are DRH structural composition, not newly claimed source components. Full source definitions remain unchanged. The style normalizer retains exact source button values; no arbitrary CSS or remote images are accepted.

## Root-cause fixes

- Brand Detail previously passed through DemoViewport's intersection observer. A long page could unmount the entire catalog when scrolling to the bottom. Static brand Detail now renders directly; animated/non-brand demos retain their existing lifecycle.
- Missing normalized border roles became `currentColor`. Source `divider` / `corporate-border` mappings now take precedence over that fallback; truly missing borders are transparent. Neutral DRH wrappers use separate fixed chrome variables.
- Reference Markdown fetches now ignore obsolete results after route changes.
- Provenance labels now use the actual canonical source instead of always naming VoltAgent for the Korean source.

## Shared architecture

Canonical ReferenceItem + pinned DESIGN.md + BrandDesignSpec feed the website and existing artifact resolver. `src/lib/brandExperience.ts` centralizes scene selection and semantic groups. `ReferenceHandoff.experience` adds the same versioned scene/groups/disclaimer to the portable contract. The common bottom action consumes `buildReferenceHandoff`; it does not maintain a second prompt or data pipeline. Installable Skill/Plugin packages remain a future consumer, not a claimed delivery.

## Validation

- Typecheck and production build: PASS. Existing large-chunk advisory remains (approximately 2.36 MB main reference bundle before gzip); no new dependency was installed.
- `audit:references`, `audit:demos`, `audit:design-md`, `audit:v1.4`, `audit:brand-designs`, `audit:brand-resources`, `audit:korean-brands`, `audit:brand-fidelity`: PASS.
- 198 artifact handoff parity checks; 91 original document paths/hashes; six unsafe/unresolved CSS input cases rejected.
- Production Edge browser: all ten canaries at 1920×1080, 1440×1000 and 390×844. 30 cases, zero measured horizontal overflow, zero page errors and zero external runtime requests.
- Every case checks section order, single bottom handoff, source-button CSS parity where rendered, source inventory in Expanded, disclosure behavior, action feedback, touch selection, Escape/focus restoration, original download byte equality and copied prompt.
- Linear search and issue selection; Vercel keyboard tabs and nested dialog Escape; section jump position; explicit Linear Light theme; two non-brand Agent downloads and one built-in DESIGN.md download; five-step Quickstart.
- Apple, Baemin and Linear: warmed offline interaction and full catalog, reduced-motion inspection. This is warm-cache coverage, not a claim that an uncached first load works offline.
- Runtime link attributes and handoff paths contain no localhost URLs. Developer test server addresses remain confined to test configuration.

Evidence: `artifacts/brand-v24/browser-qa.json`, `interaction-qa.json`, `fidelity-audit.json`, and 90 DNA / library / canvas PNGs. Screenshots isolate the reference by hiding the fixed global navigation and its backdrop rail only; specimen styling is unchanged.

Reproduce browser checks with `PLAYWRIGHT_PATH` pointing to an existing Playwright installation and `DRH_URL` pointing to a running build, then run `node tests/brand-designs/experience-v24-qa.mjs` and `node tests/brand-designs/experience-v24-interactions.mjs`.

No new source imports, proprietary fonts, external runtime assets, maturity promotions, main merge or remote push are part of this commit.
