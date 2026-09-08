# V1.5 Reference workspace and guides

## Delivered behavior

Reference detail now uses the available viewport width. At 1200px and above it places a 55% Preview next to a 45% Artifact workspace (after the gap). The preview alone can stick below the global header. Below 1200px it stacks; at 390px controls wrap, artifact tabs can scroll horizontally and code wraps inside its own bounded reading area. There is no nested sticky toolbar. The existing Home renderer, Explore/Collections URL state, scroll restoration, backdrop rail, demo lifecycle and HashRouter are preserved.

Available tabs are Agent, DESIGN.md, Tailwind, CSS, Tokens, React, HTML and Source. Missing artifacts are omitted. Agent and generated DESIGN.md start in Extended; Compact includes core values, behavior, dependencies, constraints and a starter. Switching tabs changes Copy and Download to the exact currently displayed content and filename. Copy announces success or failure; Blob URLs are revoked when changed/unmounted. CSS and JSON receive appropriate MIME types.

HTML-backed effects retain the exact shared recipe export. CSS is extracted with notices and clearly requires the HTML structure/behavior. Their React export is an explicitly labeled sandbox iframe wrapper, not a claim of native React component parity. ShaderGradient retains its official-preset TSX export. Existing Page prototypes without complete code remain Agent/Source only; no fabricated HTML/React tabs are added.

## Data and migration

`src/types.ts` defines optional typed artifacts, text variants and per-artifact provenance. `src/lib/artifacts.ts` resolves legacy values on demand; explicit artifacts override compatible generated values. Legacy IDs and all 93 records remain. Artifact-only records are covered by the audit fixture. `starterCodeFor` and `buildAgentPackage` accept explicit artifacts, so old consumers still work.

`src/lib/designSystem.ts` defines 10 DRH-owned normalized token presets. One set of values drives DESIGN.md, CSS, Tailwind v4, Tokens JSON, and `DesignSystemPreview`. The specimen renders typography, color swatches, surfaces, radius, spacing and working primary/reset buttons. Grid cards use a compact version with controls outside the tab order. No external brand image or font is used. Future imports pass normalized metadata and original document artifacts; they do not need a brand-specific React component.

These 10 specimens now qualify as WORKING DEMO. Complete page exports are still not claimed: Agent Ready remains 43, Partial remains 50. Current totals: 93 references, 55 Working, 37 Prototype, 1 Official Live; 43 independent HTML exports. The workspace exposes 356 available views including Source metadata.

## Guide library

- HashRouter routes: `/guides` and `/guides/:slug` (published as `#/guides/...`).
- First article: 디자인 시스템을 Coding Agent에 전달하는 법.
- Body source: `src/content/guides/using-design-md.md`.
- Metadata and lazy Markdown registry: `src/content/guides/index.ts`.
- Lightweight React renderer supports headings, paragraphs, unordered lists, fenced code, inline code, emphasis and safe HTTPS/hash links. Raw HTML is escaped. It is a documented subset, not a general Markdown editor.
- The guide route and individual Markdown payload are separate lazy chunks. No Markdown/editor dependency was added.
- The supplied request contained the 11-part outline rather than a separate full draft; the article expands that outline with original copy-ready examples and source attribution.

Source decisions and ingestion limits are recorded in `CONTENT_INGESTION_POLICY.md` and the Source Map. There are six reviewed source decisions, implemented as five new entries and one update to the existing VoltAgent entry.

## Verification

Baseline main: `git pull origin main`, `npm install`, build and V1.4 audit passed before edits. Final verification uses:

```sh
npm run typecheck
npm run build
npm run audit:v1.4
git diff --check
```

The existing V1.4 assertions remain, including required Agent sections, all recipe JavaScript syntax, Ready export requirements, motion fallbacks and all ten official preset identities. Additional assertions cover all 93 migrated records, explicit artifacts, restricted artifact/Agent exclusion, JSX compilation of React exports, token parity, Compact length, source registry counts/classification and the Markdown guide's 11 sections. No existing check was weakened.

### Browser QA — 2026-09-08

Real Chromium in the Codex in-app browser, using 1440×1000 and 390×844 viewport overrides:

| Page / flow | Result |
| --- | --- |
| Home | Official Halo renderer and mobile hero layout visible; landing preserved |
| Explore | Search/filter UI and mobile horizontal category rail visible; no page overflow |
| Explore / Collections | Shared route and view switch preserved |
| Query change | Actual focused typing `glas` → `glass`: scrollY 128 → 128 |
| Detail / Back | Visible Liquid Glass card click: saved 628; detail starts at 0; Back restores 628 |
| Liquid Glass | Desktop panes approximately 731px / 598px; interactive lens, 5 artifact tabs, mobile stacking |
| Shader Gradient | Official renderer, correct Agent/React/Source tabs; isolated reduced-motion fixture renders static fallback with zero preview canvases |
| Minimal SaaS DESIGN.md | 6 tabs; token swatches, type, spacing, primary toggle/reset; JSON Copy equals displayed text |
| SaaS Landing | Large Page preview; still honestly Prototype with Agent/Source only |
| Minimalism | Source-oriented style with no fabricated implementation tabs |
| External/source-only fixture | Same detail component at both sizes: LINK ONLY, source link, no embedded preview, Agent/Source only |
| Guide list / article | Both viewports; 12 section headings including attribution, 5 copy-ready code blocks, no horizontal overflow |
| Copy / keyboard | HTML, JSON and DESIGN.md copied exactly; mobile CSS Copy matches; tab ArrowRight selects CSS |
| Download | HTML, Tokens and DESIGN.md saved to Downloads. HTML SHA-256 matches displayed/copied source: `32b35c1e8dc35e4d02ee4e08837c0d3bc719a97060680eb8c0cb726f68ea1ca4` |

Browser automation's download-event wait did not fire for the Blob link, but the downloaded file was verified independently on disk. Source-only and reduced-motion branches were exercised with an isolated temporary local entry using the real App/ReferencePage and a matchMedia test double; that entry is removed before commit and adds no production data or route. Native OS preference changes were not required.

The production build at port 4173 was also checked for Source Map classification, the lazy guide article and DESIGN.md Copy/Download with no captured console errors.

The pre-existing WebGL bundle size warning remains; the guide route is lazy and does not add an editor framework. Installation also reports pre-existing dependency advisories; no unrelated dependency upgrade is included.

## Next ingestion

No workspace/schema blocker remains for a small, rights-checked MIT ingestion batch. Pin source revisions, retain notices and normalize the first sample before increasing volume. Missing product-page implementations in old prototypes are content backlog, not a license to fabricate artifacts or a requirement to import an entire external catalog.
