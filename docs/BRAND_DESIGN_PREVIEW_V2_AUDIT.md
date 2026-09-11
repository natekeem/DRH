# Brand DESIGN.md Preview V2 Audit

Date: 2026-09-12. Scope: 74 existing vendors; 181 references overall. No new vendor, asset import or maturity promotion.

## Before and outcome

V1 preserved source values but used landing-page compositions in small cards and large Detail heroes. Empty photography regions consumed comparison space, while many known component definitions were available only as JSON. Passing source audits did not establish useful comparison UX.

V2 separates Identify → Compare → Research: concise identity cards, source-based component catalogs and a full-viewport catalog. Official design resources are reachable near the catalog header.

## Baseline and architecture

The fetched origin/main was 5eaaefe0cbd470d5ac85b0d89236fec6e1ac27e1. Local main 21be263 already contained additional work; V1 300a839d08d38b9df3af50c5ef219fa9a6272544 descended from it. V2 starts from that preserved V1 on codex/brand-catalog-v2. This report does not claim integration into main.

DESIGN.md → canonical parser → full BrandDesignSpec + compact Browse projection → buildBrandCatalog / BrandCatalogSection[] → Card / shared BrandCatalog in Detail and Expanded.

- src/lib/brandCatalog.ts normalizes sections, component families, DNA evidence, themes and official resources without coupling the raw parser to UI.
- VendorDesignPreview owns lazy full-spec loading, compact cards, theme selection, section navigation and modal lifecycle.
- BrandCatalog renders the same data in Detail and Expanded. Detail progressively discloses extra specimens; Expanded renders all definitions.
- BrandComponentSample provides local button/input/tab/navigation/dialog behavior and actual styled cards, badges and tables. Source properties remain inspectable.
- BrandSourceNotes lazily renders depth tables/prose. Remote images and raw HTML are excluded.
- Tokens and both Agent forms retain the compact spec and explicitly identify the full JSON required for catalog reconstruction. Official-resource metadata is shared. No standalone exports are fabricated.

## Catalog inventory

Every vendor has a projection. All parsed typography roles, colors and component definitions are retained. Component sections are emitted only for source definitions; Spotify has no invented dialog/table/badge sections. Vercel and Nintendo have actual dialog/drawer definitions and interactive specimens. Additional source surfaces are shown under Additional definitions.

| Canary | Type roles | Components | Themes | Component sections |
|---|---:|---:|---|---|
| apple | 16 | 24 | Light | Buttons 8, Inputs & Forms 1, Cards & Surfaces 7, Badges 2, Navigation 5, Additional definitions 1 |
| airbnb | 18 | 33 | Light | Buttons 8, Inputs & Forms 4, Cards & Surfaces 7, Badges 2, Tabs 3, Tables & Rows 1, Navigation 4, Additional definitions 4 |
| notion | 17 | 50 | Light | Buttons 9, Inputs & Forms 3, Cards & Surfaces 17, Badges 7, Tabs 4, Tables & Rows 3, Navigation 2, Additional definitions 5 |
| linear.app | 13 | 21 | Dark / Light | Buttons 6, Inputs & Forms 2, Cards & Surfaces 6, Badges 1, Tabs 2, Tables & Rows 1, Navigation 2, Additional definitions 1 |
| stripe | 15 | 15 | Light | Buttons 4, Inputs & Forms 2, Cards & Surfaces 5, Badges 1, Navigation 3 |
| vercel | 14 | 40 | Light | Buttons 5, Inputs & Forms 4, Cards & Surfaces 7, Badges 2, Tabs 1, Dialogs 2, Tables & Rows 2, Navigation 7, Additional definitions 10 |
| spotify | 14 | 7 | Dark | Buttons 5, Inputs & Forms 1, Cards & Surfaces 1 |
| ferrari | 13 | 24 | Dark / Light | Buttons 5, Inputs & Forms 3, Cards & Surfaces 4, Badges 1, Tables & Rows 3, Navigation 4, Additional definitions 4 |
| nintendo-2001 | 7 | 41 | Light | Buttons 5, Inputs & Forms 6, Cards & Surfaces 7, Badges 3, Tabs 1, Dialogs 2, Tables & Rows 4, Navigation 3, Additional definitions 10 |
| binance | 15 | 35 | Dark / Light | Buttons 10, Inputs & Forms 2, Cards & Surfaces 7, Badges 1, Tables & Rows 7, Navigation 4, Additional definitions 4 |
| tesla | 8 | 8 | Light | Buttons 3, Inputs & Forms 1, Cards & Surfaces 3, Navigation 1 |
| figma | 12 | 23 | Light / Dark | Buttons 7, Inputs & Forms 2, Cards & Surfaces 3, Tabs 2, Tables & Rows 1, Navigation 3, Additional definitions 5 |

Colors include role/value labels. Detail prioritizes display, heading, body and caption specimens; Expanded exposes every role. Geometry shows source spacing/radii and defined border/shadows; unstructured depth remains readable source guidance, not invented CSS. Nine V1 archetypes survive as small schematics.

## Upstream artifact research

Repository: [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md).

- [Pinned tree 8147538b4226ae41e2487a9179e3bcc1f68e8554](https://github.com/VoltAgent/awesome-design-md/tree/8147538b4226ae41e2487a9179e3bcc1f68e8554): no preview.html or preview-dark.html files.
- [Historical tree 1ebace0eeadc6428435cca1608f1dc4a8396e9cd](https://github.com/VoltAgent/awesome-design-md/tree/1ebace0eeadc6428435cca1608f1dc4a8396e9cd): 116 preview files, light/dark for 58 brands. Corresponding DESIGN.md files existed beside them.
- Path history also identifies [3cf7176897d69a415fb305d31b882281ccca8779](https://github.com/VoltAgent/awesome-design-md/commit/3cf7176897d69a415fb305d31b882281ccca8779), where those preview paths were removed/updated.
- [License at the exact historical revision](https://github.com/VoltAgent/awesome-design-md/blob/1ebace0eeadc6428435cca1608f1dc4a8396e9cd/LICENSE): MIT, Copyright 2026 VoltAgent. Notice preservation is required when redistributing that code. The complete notice and exact preview blob SHAs are retained in the research evidence.
- None of the 58 historical DESIGN.md blob hashes matches the currently pinned corresponding file. The sampled Linear HTML starts from a light canvas and includes external Google Fonts/GitHub avatar dependencies, unlike the currently pinned default dark specification.

Decision: do not port the historical HTML as the canonical implementation for a different DESIGN.md revision. Render the current full specs instead. No historical HTML, external fonts or avatars were imported; no Original Preview HTML artifact is advertised. Historical third-party preview availability is not proof of official brand authorship or asset rights.

Evidence: [upstream-research.json](../artifacts/brand-v2/upstream-research.json).

## Benchmark research

Only information architecture and rendered pages were studied; no product source, paid assets or screenshots were used in demos.

- [getdesign Linear](https://getdesign.md/linear.app/design-md): useful grouping of palette, typography, components and theme/document actions.
- [Website Starter Kit](https://starterkit.getdesign.md/): real application surfaces such as forms, billing cards and tables provide more comparison context than a marketing hero. Its product code/assets were not imported.
- [oh-my-design builder](https://oh-my-design.kr/builder): compact scanning, identity and filter organization informed the Card's role.

Rendered research captures and heading observations are in artifacts/brand-v2/benchmark-*.png and benchmark-research.json. They are audit evidence only.

## Official resource registry

The existing source/provenance schema describes where DRH data/code came from. A separate typed, curated registry records where users can read official brand guidance. It is not a second provenance system and is not generated from the upstream parser; sync cannot overwrite curation.

Verification: official domain ownership, actual rendered page heading/content and resource purpose, then checkedAt/evidence title/URL. All eight registered pages returned their expected content in browser review. Redirects or HTTP status alone are not acceptance. See [official-resource-checks.json](../artifacts/brand-v2/official-resource-checks.json).

| Coverage | Count |
|---|---:|
| Total brands | 74 |
| Brands with at least one resource | 7 |
| Total resource links | 8 |
| Brand guidelines | 2 |
| Design systems | 2 |
| Typography/fonts | 1 |
| Developer design guide | 1 |
| Component guidelines | 0 |
| Asset guidelines/resources | 2 |
| Other | 0 |

Registered: Apple HIG, Linear Brand Guidelines, Vercel Geist + Typography, Airbnb media assets, Stripe newsroom assets, Spotify developer design/branding and Figma brand guidelines (verified Spanish locale). Resource purpose and source types are stored; links open separately with noreferrer. Cards have no official links. Detail and Expanded use identical records, with provenance separately at Source notes.

The [Kakao Login Design Guide](https://developers.kakao.com/docs/ko/kakaologin/design-guide) was verified as an official button-design resource. The user-provided [Woowahan Fonts](https://www.woowahan.com/fonts) URL was reviewed, but this browser session received an access restriction, so content validation is not claimed. Neither Kakao nor Woowahan exists in the current 74-vendor inventory; no unrelated links or canaries were added. Missing registry entries mean unverified/not curated here, not proof that official resources do not exist.

## Expanded and height behavior

The former composition was constrained by workspace sizing and overflow. Detail now has explicit internal scrolling, a sticky header, source section navigation and a visible Expand action. Brand Replay is removed. Expanded is a native modal portal at 100vw × 100dvh with its own scroll; the background retains its position and is scroll-locked.

Opening focuses Close; Escape and Close restore the trigger. Tab/Shift+Tab wrap at visible enabled control boundaries. Nested specimen dialogs stop affecting the outer modal on close. At 390px, sections use one column; typography is clamped with original values annotated. There is no scale() or fullscreen permission dependency.

## Browser QA

Test: tests/brand-designs/catalog-v2-qa.mjs, Chromium/Edge, real local Vite app, 1920×1080 / 1440×1000 / 390×844, mobile touch emulation and reduced motion. 12 canaries × 3 sizes × Card/Detail/Expanded = 108 mode/viewport cases.

Automated checks cover readable identity/DNA and micro-specimen height, no outer horizontal overflow, full component/type counts, scroll access, official-link parity, source theme propagation, button/input/tab interactions, nested dialogs, Escape, Close, sticky close visibility, focus boundary cycling/restoration, body scroll lock, loaded offline interaction, no page errors and no external preview requests. Report: [browser-qa.json](../artifacts/brand-v2/browser-qa.json).

Visual findings fixed during QA: Card micro specimens were squeezed despite the outer box passing overflow checks; spacing and minimum specimen height were corrected. Nested dialog close events initially closed the workspace; target checks fixed the propagation. Native dialog alone permitted a browser focus boundary; explicit cyclic focus handling was added.

### Comparison evidence

- [Card scanning, 1920](../artifacts/brand-v2/cards-1920.png), [1440](../artifacts/brand-v2/cards-1440.png), [390](../artifacts/brand-v2/cards-390.png).
- [Apple vs Linear](../artifacts/brand-v2/pair-apple-vs-linear.app.png): pill geometry and light gallery palette versus compact purple/dark product controls and denser spacing.
- [Notion vs Stripe](../artifacts/brand-v2/pair-notion-vs-stripe.png): Notion's broad pastel/card inventory versus Stripe's editorial palette and smaller component inventory.
- [Spotify vs Ferrari](../artifacts/brand-v2/pair-spotify-vs-ferrari.png): rounded media surfaces/shadows versus square red controls and spacious dark/light surfaces.
- [Nintendo vs Vercel](../artifacts/brand-v2/pair-nintendo-2001-vs-vercel.png): small retro typography/chrome palette versus neutral developer geometry and monochrome controls.

Production-build mobile smoke also passed (Vercel: 40 components, lazy depth table, no overflow/errors, restored focus): [production-smoke.json](../artifacts/brand-v2/production-smoke.json). Actual touch tap open/button/close passed for all 12 canaries: [touch-qa.json](../artifacts/brand-v2/touch-qa.json).

Individual card/detail/expanded/component/geometry PNGs accompany the report. Pair sheets are assembled from real rendered screenshots; they are not runtime content.

## Validation

- typecheck and build: pass; existing large main-bundle warning remains.
- audit:references, audit:demos, audit:design-md, audit:brand-designs, audit:v1.4: pass.
- Brand audit: 74 unchanged-source specs, 64 YAML / 10 Markdown, no duplicate signatures; raw/full/compact equality; isolated offline/online generation parity and partial-import safeguards.
- V2 audit: 74 complete catalog projections, source-derived groups/themes and official page evidence.
- Browser acceptance: results and limits above. Source/parser/generated vendor files and all license notices remain unchanged.

## Remaining debt and limits

- All 74 identifiers remain text wordmarks; no new verified logos or cleared photography. Proprietary fonts use system fallbacks.
- Only 7 brands have curated official links. Expand coverage through actual verification, not guesses. Figma currently links to a verified Spanish locale.
- Transparent on-dark/on-light variants use a contrasting backdrop from the source palette. The Figma inverse circular button explicitly declares identical white background/text; values are preserved and a visible source warning explains the conflict.
- Catalog interactions and sample data are DRH illustrations. Field/table structures and surface samples do not reproduce a brand's production application.
- Some source sections contain prose rather than executable tokens. They remain readable evidence; motion is intentionally static/reduced-motion safe.
- A second theme requires explicit complementary canvas/ink evidence. A dark surface alone is not treated as a full dark theme.
- Full source typography may scroll locally on desktop; mobile clamps the displayed size while retaining exact annotations. Source properties and wide prose tables can scroll locally.
- Loaded offline behavior is supported; a first uncached visit still needs local spec/chunk files. Fetch failure exposes retry.
- Manual comparison targets 12 canaries, not every vendor. Static full-source coverage is checked for all 74.
