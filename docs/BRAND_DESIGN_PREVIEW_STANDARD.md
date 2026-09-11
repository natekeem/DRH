# Brand DESIGN.md Preview Standard — V2

This extends [Reference Quality Standard](REFERENCE_QUALITY_STANDARD.md) and [Content Authoring Playbook](CONTENT_AUTHORING_PLAYBOOK.md). No maturity, provenance or artifact-parity exceptions are granted.

## Source contract

- Preserve raw DESIGN.md, pinned commit, full BrandDesignSpec, compact projection, canonical parser, source hashes and MIT notices. Missing source information stays missing.
- Generate full and compact specs together. Upstream discovery and downloads use one pinned commit; partial imports cannot replace the catalog. Offline regeneration must remain stable.
- Keep source-driven composition inference and brandAsset. A text wordmark is the default; actual images require verified local assets, sourceUrl, license and evidenceUrl. Analysis licensing does not license logos, photography or fonts.
- Declared font family, size, weight, leading and tracking remain visible. Render system fallbacks. Never download proprietary fonts.

## Information architecture

DESIGN.md → BrandDesignSpec → buildBrandCatalog → BrandCatalogSection[] → Detail / Expanded. Card uses a compact projection of the same source.

- **Card:** legible identifier/category, 2–4 evidenced DNA traits, 1–2 micro specimens and 4–6 palette swatches. No giant hero, image placeholder, advertising copy, documentation or official outbound links. Validate micro-specimen height as well as outer overflow.
- **Detail:** compact sticky header, source themes, section navigation and Expand. Overview has a type/button sample; official resources stay near the top. Colors have names/values. Typography prioritizes display/heading/body/caption; every remaining role is available. Component groups expose representative samples plus “모두 보기”.
- **Expanded:** the same catalog and renderer, with every source definition rendered. Full viewport native dialog, independent vertical scroll, sticky close, accessible name, initial focus, forward/backward boundary focus trap, Escape, trigger focus restoration and body scroll lock. Nested sample-dialog close events must not close the workspace.
- Detail has an explicit bounded internal scrollbar (680px desktop / 620px mobile, at most 80dvh); Expanded is 100dvh. Parent workspace must not crop the content. Section navigation makes the full inventory reachable.
- Mobile at 390px uses one catalog column and bounded typography (12–36px, source sizes still annotated), never scale(). Long source text and property evidence may scroll locally; no horizontal page/overlay overflow.

## Catalog fidelity

- All source component definitions belong to a normalized group. Buttons, inputs/forms, cards, badges, tabs, dialogs, tables/rows and navigation render actual local specimens when definitions exist. Unknown surface definitions retain their source styles and properties; they are not invented product features.
- States explicitly present in source remain separate specimens. Buttons toggle a local sample state, fields accept input, tabs support arrows/Home/End, navigation selects one item and dialogs open/close. These are illustrative interactions, not a claim of reproducing upstream application behavior.
- Do not invent dialog/table/badge inventories for brands without those definitions. Do not hide known components solely behind JSON.
- Show spacing/radius geometry, defined border/shadow samples and readable depth prose/tables. Preserve source text when no executable depth token exists; do not invent shadows.
- Keep all nine inferred layout archetypes as small Layout DNA schematics, not landing pages.
- Offer a second theme only when explicit complementary canvas and readable ink roles exist in the source. Record the exact evidence keys. Catalog chrome and semantic component colors follow the selection; fixed source accents and explicitly light/dark component variants retain their declared colors. Do not infer a full theme from one dark card.
- No remote fonts, hotlinked imagery, benchmark product code, screenshots-as-demos, shaders or unnecessary animation. Offscreen Cards unmount; stale full-spec fetches abort. Failed full-spec loading exposes retry and does not pretend the compact spec is complete.

## Official Resources

Use the typed, curated src/data/brandOfficialResources.json registry, separate from parser-owned source provenance. The catalog, Tokens and Agent contract share this registry. Sync must not overwrite it.

Each record has type, label, HTTPS URL, source=official, checkedAt, purpose and evidence (URL/title/method). Verify official ownership and actual page content; a redirect or status code alone is insufficient. Record page evidence in artifacts/brand-v2/official-resource-checks.json. Missing links are allowed. Link permissions are separate from asset redistribution rights.

Report total brands, brands with links and counts by brand-guidelines, design-system, typography, developer-design-guide, components and assets. Do not create links to complete a quota. Domestic resource examples only become catalog entries when a corresponding vendor actually exists.

## Artifacts and acceptance

Tokens and both Agent forms preserve the compact source spec, official registry and full-spec path. The full JSON is mandatory for reconstructing Detail/Expanded. No fake HTML/CSS/React exports or iframe wrappers. Name the canonical catalog files in the implementation contract.

Run typecheck, build, audit:references, audit:demos, audit:design-md, audit:brand-designs and audit:v1.4. Brand audits cover raw/full/compact parity, pipeline safeguards, source-derived sections, full component coverage, theme evidence and verified resource metadata.

Browser QA: 1920×1080, 1440×1000 and 390×844 for Apple, Airbnb, Notion, Linear, Stripe, Vercel, Spotify, Ferrari, Nintendo 2001, Binance, Tesla and Figma. Check Card scanning/clipping, Detail density/scroll, Expanded full access, keyboard/touch, theme propagation, nested dialogs, both closing methods, focus boundaries/restoration, reduced motion and loaded offline behavior. Inspect screenshots; geometry assertions alone miss clipped children.

Use tests/brand-designs/catalog-v2-qa.mjs with installed Playwright/Sharp (PLAYWRIGHT_PATH / SHARP_PATH), DRH_URL and optional EDGE_PATH. V1 fidelity-qa.mjs and its report are historical, not the V2 acceptance test. Compare Apple/Linear, Notion/Stripe, Spotify/Ferrari and Nintendo/Vercel side by side. Automated coverage of 74 vendors is not manual visual review of 74 vendors.
