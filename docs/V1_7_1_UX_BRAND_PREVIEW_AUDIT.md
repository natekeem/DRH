# DRH V1.7.1 — UX coherence & brand DESIGN.md fidelity

Validated: 2026-09-10. Release baseline: `bb4df01` (main). The independently rewritten guides on `sonnet/guide-eli5` are excluded.

## Scope and preserved contracts

- **177 references**, including the same **74 vendor brands**. No reference IDs, routes, maturity classifications or renderer priorities were added or changed.
- `public/vendor/awesome-design-md/**/DESIGN.md` and `src/content/guides/*.md` remain byte-for-byte unchanged in the git diff.
- Pinned upstream remains `8147538b4226ae41e2487a9179e3bcc1f68e8554`; original import date remains 2026-09-08. MIT attribution is unchanged.
- Raw artifact loading, Reference Workspace, UI Patterns and 5:3 normal/Related previews are preserved.

## Preview sizing ownership

The embedded advanced root now uses `width:100%; height:100%`. Card/detail variants still select GPU budgets in the shared engine; they no longer impose layout height. Fluid Cursor, Metaballs and Liquid Refraction share this rule.

Home large previews explicitly fill the grid-column width at 360px height. Their mobile rule restores the normal 5:3 aspect ratio with automatic height, avoiding a zero-height percentage chain. The standalone export has an explicit wrapper at 220px/card or 480px/detail. The development fixture owns equivalent dimensions separately.

Browser assertions check nonzero height and parent/child equality in Home, Explore and Detail, in addition to screenshots. GPU tests exercise both variants, pointer input, standalone sizing, reduced motion, forced fallback and idempotent disposal.

## Browsing rhythm and guide geometry

Reference/Spotlight grids use **40px row gaps / 18px column gaps**. Collection grids use **40px row gaps / 14px column gaps**; mobile horizontal collection browsing remains unchanged. Existing 15px preview-to-metadata, 9px description and 12px tag spacing remain. No new card enclosure was introduced. Vendor summaries use a visual three-line clamp while the stored summary remains a complete sentence.

Guide index: 1280px outer shell including 32px side padding, giving **1216px content** at wide viewports. `auto-fit` with a 340px minimum supports 2, 3 and 4 entries. All three counts were rendered at 1920px.

Article: 1320px outer shell, **928px body + 48px gap + 280px rail** at wide viewports. The rail is sticky without max-height or an internal overflow container. At <=1199px it stacks; mobile has one page scroll. Guide Markdown content was not edited.

The existing `audit:v1.4` hardcoded `using-design-md.md` and its old eleven-section structure; the parallel guide branch removes that file. It now validates the currently registered guide files, unique slugs, headings and balanced code fences; all other assertions remain.

## Parsing and preserved information

Before: shallow YAML parsing lost nested typography and components; the first twelve colors could exclude canvas/text roles. Shared spacing, radius, body size and motion defaults masked brand differences; slug capitalization produced `AIrbnb`/`AIrtable`.

After:

- Explicit `yaml` devDependency parses **64 YAML documents**. Three upstream unquoted prose scalars contain colons; only the `description` / `属于` prose scalar is quoted in memory when needed. Quoted strings and block scalars are preserved. The raw file is never repaired on disk.
- **10 Markdown-only documents** are read through their explicit role tables, palette bullets, component declarations and spacing/radius sections. Original table cells, source lines and complete sections remain in the full spec. This is separate from YAML parsing.
- All **1,768 color roles**, **1,035 typography roles**, **491 radius entries**, **668 spacing entries** and **1,818 component signatures** are preserved. Counts include named aliases and component-specific values, not unique visual values.
- Hex, RGB/RGBA and HSL/HSLA colors are retained. Reference values resolve to their actual scalar or nested object; nested typography no longer turns into `[object Object]`.
- Frontmatter names are used with the analysis suffix removed. Full descriptions remain in `rawDescription`; card summaries use the first complete sentence, with display-only Markdown marks removed.
- Light/dark semantic text roles are selected from the declared palette. A contrast assertion caught Kraken's text color being mistaken for a canvas and Revolut's light-theme text on its dark canvas. Source palette values remain unchanged.

Regenerate without fetching or rewriting vendor sources:

```sh
npm run sync:brand-designs
npm run audit:brand-designs
```

The upstream sync also uses the pinned commit for directory discovery, and fails instead of silently publishing a partial catalog.

## Brand specimen architecture

`BrandDesignSpec` keeps palette, typography roles (including declared family, size, weight, line height and tracking), spacing/radius scales, border, motion, depth, resolved components, layout traits, source sections and original parsed frontmatter.

`awesomeDesignMd.ts` carries a compact Browse projection: selected typography/component signatures plus palette and scales. Complete data lives in `public/brand-design-specs/<slug>.json` and loads only when that brand's detail opens. Abort handling prevents stale results after navigation. This avoids eagerly bundling complete source narratives; the raw DESIGN.md artifact remains separately lazy-loaded.

Seven original compositions are selected by source traits: gallery, cinematic, marketplace, utility, editorial, retro and product. No slug-specific layouts or scraped website images are used. Card differences include palette, type scale/weight/tracking, component radius, control shape, spacing density, surface contrast and border/depth treatment. Photography-oriented compositions use explicitly labeled empty image areas, not invented product imagery.

Detail adds color roles, both scales, the complete typography hierarchy, expandable component signatures and layout/depth/do-and-don't source sections. Primary/Secondary controls are interactive. Detail grows in page flow and has no nested specimen scrollbar.

**Source fidelity takes precedence over examples of a brand's public identity:** this pinned Notion analysis declares purple primary controls and a product-workspace composition; it is not forcibly converted into an invented monochrome design. Airbnb's source display is 28px rather than a generic large hero. Those distinctions are intentional.

## Extracted values versus rendering fallbacks

| Area | Preserved source data | Presentation behavior when missing |
|---|---|---|
| Typography | Every role/property and original Markdown cells | System serif/sans/mono fallback; missing numeric values use neutral display defaults |
| Color | Every declared role, including alpha colors | Missing compatibility role uses neutral canvas/ink or contrast-derived action text; not inserted into the source palette |
| Radius | Named scale and component-specific radius | Component first, then scale, then zero; CSS preview scale is bounded for small cards |
| Spacing | Actual scale/observed values | Compact viewport padding is bounded to 12–32px; source scale remains unchanged |
| Border/depth | Component rules and complete source sections | No invented shadow; compatibility border width defaults to 1 only if unavailable |
| Motion | Declared motion and matching source lines | Compatibility duration comes from explicit timing, otherwise zero; unknown is not replaced with a universal 200ms token |
| Markdown ranges | Original table cells preserve the range/notes | A numeric specimen uses the first explicit value; the full source remains available |

The [per-brand audit report](../artifacts/v1.7.1/brand-data-audit.json) lists actual coverage, raw SHA-256 values and compatibility color fallbacks. For example, Runway has no extracted primary role and uses a neutral compatibility accent; its actual palette remains intact. Fallback reporting compares source values literally, so case-different hex or contrast-derived black/white can be listed even when visually equivalent.

Fonts are not downloaded. Detail explicitly says **Declared** and **Rendered with: ... (system fallback)**. Exact proprietary-font fidelity is not claimed. Specimen headline sizes adapt to their viewport; the hierarchy lists original declared values.

## Logo and asset policy

All 74 identifiers are text wordmarks. No official logos, fonts or images were scraped or vendored. The optional schema permits verified SVG/image assets with source URL, license and evidence; the audit requires those fields for any non-text asset. The MIT license of the analysis does not establish rights to brand assets.

## Visual evidence

All requested viewports: **1920×1080**, **1440×1000**, **390×844**.

- [10 canary cards, 1920](../artifacts/v1.7.1/canaries-1920.png), [1440](../artifacts/v1.7.1/canaries-1440.png), [390](../artifacts/v1.7.1/canaries-390.png), [identifiers masked](../artifacts/v1.7.1/canaries-masked-1920.png).
- [Home Liquid Lens, desktop](../artifacts/v1.7.1/home-liquid-lens-effect-1920.png), [mobile](../artifacts/v1.7.1/home-liquid-lens-effect-390.png); [Home Shader](../artifacts/v1.7.1/home-shader-gradient-1440.png).
- [Explore grouping](../artifacts/v1.7.1/explore-grouping-1440.png), [normal Lens](../artifacts/v1.7.1/explore-lens-1440.png), [Related](../artifacts/v1.7.1/related-1440.png), [Collections](../artifacts/v1.7.1/collections-1440.png).
- [Guide index](../artifacts/v1.7.1/guide-index-1920.png), [2 entries](../artifacts/v1.7.1/guide-count-2-1920.png), [3](../artifacts/v1.7.1/guide-count-3-1920.png), [4](../artifacts/v1.7.1/guide-count-4-1920.png), [article/rail](../artifacts/v1.7.1/guide-article-1920.png).
- Detail: [Apple](../artifacts/v1.7.1/detail-apple-1920.png), [Ferrari](../artifacts/v1.7.1/detail-ferrari-1920.png), [Airbnb](../artifacts/v1.7.1/detail-airbnb-1920.png), [Binance](../artifacts/v1.7.1/detail-binance-1920.png), [Nintendo 2001](../artifacts/v1.7.1/detail-nintendo-2001-1920.png). Matching 1440/mobile and token-panel screenshots are alongside them.
- All 74 were scrolled into view and checked for clipping; `all-brands-*.png` records successive viewport groups. The canary differences remain visible with names hidden: white gallery, pink search, dark utility, sparse cinematic, compact dark product, beveled retro and mint editorial treatments.

[Browser results](../artifacts/v1.7.1/browser-qa.json): 104 card checks (10 × 3 viewports + 74), 15 detail interaction checks, no page errors, no external brand-resource requests. Geometry checks include noncollapsed Home large previews, parent fill, 5:3 Explore/Related, 40px row gap and rail width/overflow.

## Regression results

Passed:

- `npm run typecheck`, `npm run build`
- `npm run audit:v1.4`, `npm run audit:design-md`, `npm run audit:demos`, `npm run audit:brand-designs`
- `node tests/advanced-demos/audit.mjs` (six self-contained exports, runtime parity/license/syntax)
- Advanced and Batch 1 fixture TypeScript checks
- [Advanced GPU checks](../artifacts/v1.7.1/advanced-qa.json): all three engines, both quality variants, input, wrapper sizing, reduced motion, fallback and disposal
- [Batch 1 browser tests](../artifacts/v1.7.1/batch1-browser-report.json): 100 viewport checks, 30 interaction/offline checks
- [Batch 1 app tests](../artifacts/v1.7.1/batch1-app-report.json): 20 detail pages, download/clipboard/Agent/Source, UI Patterns, modal focus containment and touch drag
- `git diff --check`; protected guide/vendor paths have no diff

Vite still reports its large entry-chunk warning (about 2.00 MB minified / 509 KB gzip); build succeeds. Full brand evidence stays outside that entry bundle and is requested per detail.

During work the shared checkout switched to the parallel guide branch. The UX-only commit was transferred onto main in the isolated `drh-v171-release` worktree; guide changes were not cherry-picked. Screenshot QA was rerun against main, and its two existing Guide bodies remain unchanged. The browser test resolves the active guide from its catalog, so it also supports the three-guide branch.

The original worktree initially contained a deleted root `advancedRecipes.js`, modified legacy V1.4 generated reports and an untracked content-expansion reference pack. Those paths are excluded from this commit. Existing Batch 1 screenshots altered by nondeterministic re-runs were restored; fresh machine-readable test evidence is stored in this release's artifact directory.
