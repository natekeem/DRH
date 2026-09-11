# Brand DESIGN.md Fidelity Audit

Date: 2026-09-11. Delivery branch: codex/brand-design-fidelity. Baseline: local main at 21be263a06a1314f0e50746bd3d41e1de6827439, clean worktree. Fetched origin/main was 5eaaefe0cbd470d5ac85b0d89236fec6e1ac27e1; local main contained six additional existing commits. Those commits are preserved. This pass changes only Vendor preview/generation, its artifact contract, quality documentation and validation evidence. 181 references / 74 vendors remain; no routes, general Explore/Guide/Header/Footer design, maturity or raw vendor source changes.

## Root cause

The running tree contradicted the older V1.7.1 report. A rich parser, full public specs, schema, seven-composition CSS and browser fixtures survived, but the generated catalog had no spec field. The upstream generator still used its original shallow parser: nested typography/components were lost, colors stopped after twelve values, type defaulted to 48/16, and radius/spacing were generic. Typography font-family parsing was consequently ineffective.

DemoRenderer passed only tokens, name, category and colors. VendorDesignPreview rendered the same ds-preview markup for every vendor and never imported vendorDesignPreview.css. Thus the brand-layout-gallery/cinematic/retro and brand-product/editorial/search/utility selectors had no matching runtime elements. Full JSON files were never fetched; border, depth, components, traits, spacing and typography evidence stopped before the renderer.

Git full history includes the richer implementation in 50f9ad2, followed by merge history leading to the current mixed snapshot. The surviving CSS was dormant because its consumer, generated spec projection, sync command and package script/dependency wiring were absent from the resulting tree, not because browsers ignored its styles. The original upstream sync could overwrite improvements again. Existing PASS prose was not accepted as evidence of the current UI.

## Architecture

DESIGN.md → canonical YAML/Markdown parser → full BrandDesignSpec + compact Browse projection → source-trait composition → VendorDesignPreview.

The existing CSS is reconnected and extended. No per-brand React component map or copied site code was added. Browse contains selected typography/components plus source palette/scales/border/depth. Composition always uses that projection; Detail lazily fetches complete typography/components/source evidence, with abort handling and an explicit failure state. This prevents component choice from changing after Detail loads.

Body/heading roles retain source family/size/weight/line-height/tracking. Proprietary fonts render with system fallbacks. Source px line heights are normalized to ratios when headings adapt. Card headline sizes and spacing are bounded for a small container; Detail hierarchy labels retain original values, with proportional mobile sample sizing. The immutable source remains separately accessible in DESIGN.md.

Tokens now include brandSpec. Both Agent forms include the same spec plus renderer, interaction, responsive, offline and acceptance contracts. Vendor source/license URLs are pinned. No HTML/CSS/native React artifact is advertised because this pass supplies no standalone exporter.

## Composition archetypes

| Archetype | Source evidence | Actual composition |
|---|---|---|
| gallery | Photography / photo-first descriptions | Centered heading, reserved image field, centered actions; paired fields in Detail |
| marketplace | Marketplace / booking / search-bar | Modest heading and pill search; Detail input and image fields |
| product | Product/software traits or neutral fallback | Surface rows; explicit card-tint palettes introduce feature tiles |
| developer | Developer-platform/tool, terminal or command-line | Monospaced build-status panel and heading |
| editorial | Editorial/news/magazine traits | Asymmetric heading and story block; source block palette or source-described gradient palette |
| cinematic | Cinematic editorial / luxury automotive | Sparse full-width image reservation, restrained headline, sharp controls |
| utility | Trading / financial-platform / crypto exchange | Three metric surfaces and directional accent rules |
| retro | Bevel / Y2K / console chrome | Ridge-framed panel, segmented palette bar, raised button |
| media | Music player / playlists / podcasts | Three content-cover surfaces and play specimen |

Photo areas deliberately remain labeled empty: no car/product/album photos were invented. Gradient placement, example copy, numerical data and layout packing are DRH presentation decisions based on source traits, not extracted website markup. Exact source scalar colors and component geometry remain visible in the full spec. Notion's purple CTA and pastel card palette are retained. Source names ending in inspired use the upstream directory identifier for scanning (for example stripe → Stripe), while original names/descriptions remain in the full source evidence.

## Canary results

Display column: source role, size / weight / tracking. All fonts use declared fallback metadata; no font downloads.

| Brand | Source-derived traits | Composition | Typography | Identifier | Visual result |
|---|---|---|---|---|---|
| Apple | A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF… | gallery | hero-display: 56px / 600 / -0.28px | text-wordmark | Card + Detail, three viewports |
| Airbnb | A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries every… | marketplace | display-xl: 28px / 700 / 0 | text-wordmark | Card + Detail, three viewports |
| Notion | Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice — anchored by a deep navy hero band… | product | hero-display: 80px / 600 / -2px | text-wordmark | Card + Detail, three viewports |
| Linear | A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text… | product | display-xl: 80px / 600 / -3.0px | text-wordmark | Card + Detail, three viewports |
| Stripe | An inspired interpretation of Stripi's design language — a financial-infrastructure brand built on a deep navy ink, an electric indigo primary, and a… | editorial | display-xxl: 56px / 300 / -1.4px | text-wordmark | Card + Detail, three viewports |
| Vercel | An inspired interpretation of Vercel's design language — a developer-platform brand whose surface is a stark black-and-ink duet on near-white canvas,… | developer | display-xl: 48px / 600 / -2.4px | text-wordmark | Card + Detail, three viewports |
| Spotify | Spotify's web interface is a dark, immersive music player that wraps listeners in a near-black cocoon (#121212, #181818, #1f1f1f) where album art and… | media | section-title: 24px / 700 / normal | text-wordmark | Card + Detail, three viewports |
| Ferrari | A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is near-black (#181818) holding pure white display… | cinematic | display-mega: 80px / 500 / -1.6px | text-wordmark | Card + Detail, three viewports |
| Nintendo.com (2001) | An analysis of Nintendo.com's 2001 design language — a brushed-periwinkle "console chrome" interface where every panel is a beveled metal plate,… | retro | display: 44px / 900 / 0 | text-wordmark | Card + Detail, three viewports |
| Binance | A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary CTA,… | utility | hero-display: 64px / 700 / -1px | text-wordmark | Card + Detail, three viewports |
| Tesla | Tesla's website is an exercise in radical subtraction — a digital showroom where the product is everything and the interface is almost nothing. The… | gallery | hero-title: 40px / 500 / normal | text-wordmark | Card + Detail, three viewports |
| Figma | A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome —… | editorial | display-xl: 86px / 340 / -1.72px | text-wordmark | Card + Detail, three viewports |

Source traits in the corresponding full spec substantiate every choice. Apple/Tesla share a photo-oriented archetype but differ in display scale/weight, surface and button geometry. Stripe/Figma share an editorial archetype but differ in typography, gradient versus lime block, and corner geometry. Notion/Linear differ in pastel tile versus charcoal row composition. Exact blind brand recognition is not claimed; removal of the repeated generic specimen is the acceptance target.

## Logo coverage

- Verified SVG: 0.
- Verified image: 0.
- Text wordmark: 74.

No brand assets/fonts downloaded, scraped, hotlinked or newly licensed. Identifiers are a small header cue. Brand identity is demonstrated by composition, geometry, hierarchy and surfaces; wordmarks are hidden in the blind sheets.

## Pipeline changes

Removed the competing shallow parser and wired both sync modes to brand-design-spec.mjs. Added the explicit yaml dependency and sync:brand-designs / audit:brand-designs scripts. Offline regeneration reads pinned local sources without rewriting them or import provenance. Online discovery includes the pinned commit ref; a failed import rejects generated catalog publication. Repeated generation skips unchanged writes, also avoiding unnecessary OneDrive locks.

The isolated pipeline test runs the real bundled generator against local source fixtures: offline generation equals checked-in metadata; second generation is identical; mocked pinned upstream HTTP yields the same catalog and all 74 full specs; an injected failed source cannot replace the complete catalog. No live upstream reimport was performed during this pass. This verifies transformation behavior without changing the pinned source set.

The static audit checks inventory/slugs, source-to-spec exact regeneration, required fields, declared values, component projection, known source canaries, source hashes, palette contrast, renderer wiring, allowed composition/asset types, asset provenance/local file presence and composition diversity. It discovers the inventory rather than requiring exactly 74 for future vendors. Current source totals: 1035 typography roles, 1768 color roles, 1818 component signatures. No duplicate complete token/type/layout signatures.

## Tests

Passed: typecheck; build; audit:references (181); audit:demos (65 recipes plus existing content/package contracts); audit:design-md (74 sources); audit:brand-designs (source comparison + pipeline QA); audit:v1.4 (existing catalogs/artifacts/guides). git diff --check and raw-source diff checks are part of final commit validation. Existing generated V1.4 status reports are restored after audit to keep this commit scoped.

## Browser QA

Microsoft Edge / Playwright, real rendered pages at 1920×1080, 1440×1000 and 390×844. 36 Canary Card checks + 36 Canary Detail checks, with screenshots; keyboard activation/reset, marketplace input, touch-enabled mobile contexts, reduced-motion contexts, loaded offline interaction, zero external preview requests and offscreen unmount. Automatic geometry checks cover all 74 at 1920; this is not manual visual QA of all 74.

Initial browser QA caught heading/component overlap, Figma Card clipping and crowded media content. These were fixed through responsive typography and proper flex sizing. A later Detail review caught mid-word editorial heading wrapping; the two-column type scale was reduced while source sizes remain documented.

Evidence:

- [Canary Card comparison, 1920](../artifacts/brand-fidelity/canaries-1920.png), [1440](../artifacts/brand-fidelity/canaries-1440.png), [390](../artifacts/brand-fidelity/canaries-390.png).
- [Blind comparison, 1920](../artifacts/brand-fidelity/blind-1920.png), [1440](../artifacts/brand-fidelity/blind-1440.png), [390](../artifacts/brand-fidelity/blind-390.png).
- [Detail comparison, 1920](../artifacts/brand-fidelity/details-1920.png), [1440](../artifacts/brand-fidelity/details-1440.png), [390](../artifacts/brand-fidelity/details-390.png).
- [Mobile Figma page](../artifacts/brand-fidelity/page-figma-390.png), [mobile Apple typography](../artifacts/brand-fidelity/typography-apple-390.png). Per-brand Card/Detail screenshots are alongside them.
- [Browser results](../artifacts/brand-fidelity/browser-qa.json), [source audit](../artifacts/brand-fidelity/brand-data-audit.json), [sync QA](../artifacts/brand-fidelity/sync-qa.json).

## Remaining debt and limits

- Photo-led brands cannot reproduce photographic identity without separately cleared assets; their source composition and tokens are demonstrated through labeled reserved areas.
- Proprietary font shapes are approximated with system fallbacks. Missing Markdown values and first-value range interpretation remain parser limits; sourceCells and raw source preserve the evidence.
- Trait inference is heuristic. New prose formats require parser/archetype review and browser acceptance; a unique static signature alone is insufficient.
- Full Detail evidence is lazy but the compact catalog remains eager. Vite reports its existing large-entry warning: final bundle approximately 2.16 MB minified / 551 KB gzip. No canvas, filters, animation loops or external brand resources were introduced.
- Offline verification covers loaded previews and controls, not a service-worker installation or cold offline page load. Touch checks use browser emulation, not physical-device testing.
