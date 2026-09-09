# Post-V1.7 Batch 1 — foundational styles and UI patterns

Date: 2026-09-10. Baseline: main `6098034fcfb9ca72df711abe6cf235f26f6e7f31` (V1.7).

## Scope and source of truth

Implemented only the ten references authorized by the Master Pack's `01_GEMINI_POST_V17_BATCH1.md`. Read its start document, source map, license matrix and Batch 1 prompt in order, then the required deep-research conclusions. No later batch was executed. The supplied Master Pack remains a separate local input; the relevant ten source decisions and canonical acceptance statements are preserved in `src/data/batch1Catalog.json`.

V1.7 `DemoRenderer`, `recipeHtml`, artifact resolution and `audit:demos` remain the execution/export contract. UI Patterns is a first-class category with Korean labels, query-backed filtering and five entries. Every new recipe has a unique key; no unrelated alias was added. Existing 167 IDs are pinned in `tests/batch1/baseline-reference-ids.json`; the V1.4 audit requires that exact set plus these ten additions.

| Reference | Demo key | Policy | Canonical behavior |
|---|---|---|---|
| Neumorphism / Soft UI | style-neumorphism | scale-sensitive | Paired raised/inset shadow geometry; pressed toggle |
| Skeuomorphism | style-skeuomorphism | scale-sensitive | Wood/metal/LCD material cues, bevel and tactile pressed control |
| Bauhaus | style-bauhaus | scale-sensitive | Asymmetric grid, display typography, primary geometric forms |
| Japandi | style-japandi | scale-sensitive | Natural neutral materials, serif/sans pairing, lighting state |
| Bottom Sheet | pattern-bottom-sheet | fixed-object | Pointer/touch drag, 40/65/90% snap, modal semantics and keyboard controls |
| Command Palette | pattern-command-palette | fixed-object | Grouped fuzzy search, active row, Cmd/Ctrl+K, arrows and Enter |
| Toast Notification | pattern-toast | fixed-object | Three-entry cap, live announcement, dismissal and pausable timeout |
| Skeleton Loading | pattern-skeleton | fixed-object | Geometry-preserving loading/content, error/retry and cancellable load |
| Segmented Control | pattern-segmented | fixed-object | Native radio selection, measured indicator and synchronized chart data |
| Agency Landing | page-agency | scale-sensitive | Original editorial studio page, case stories, project reveals/filter and local contact interaction |

The ten new entries are Working and their Agent Packages are Ready within the demonstrated scope. Totals: **177 references; 144 Working, 32 Prototype, 1 Official Live; 58 Ready packages; 57 standalone HTML artifacts; 57 recipe keys**. Existing Prototype entries were not promoted.

## Provenance and license decisions

All ten implementations are **Hub Original / MIT**, independently authored from the canonical acceptance and reviewed behavior. No upstream component source, runtime, image, font, logo or brand copy is bundled. “Reviewed” is not presented as “upstream code imported.” The seven permissive sources are pinned to exact commits; full MIT text is retained in `docs/licenses/batch1/` and in the corresponding standalone HTML / Extended Agent code and companion CSS. `sources.json` records reviewed file paths, pinned URLs and SHA-256 hashes. There were no separate root NOTICE/COPYRIGHT files at the seven pinned revisions.

| Reviewed upstream | Commit | Exact reviewed file | Behavior studied; independently authored equivalent |
|---|---|---|---|
| AKAspanion/ui-neumorphism | b94b185ce6865c9c47469a4361fe95de88604aef | src/components/button/Button.module.css | Paired outer/inset shadows → batch1Styles.ts |
| KzqKzq/tactile-ui | b4f25939e2087490674815fffe72672f05b500b4 | src/components/Button/Button.css | Physical bevel/pressed depth → batch1Styles.ts |
| viliket/pure-web-bottom-sheet | 57156f253dd1fe5a2026fe360ae45aac1385a832 | src/web/bottom-sheet.ts | Snap points and modal interaction → independent pointer-height/snap implementation in batch1Patterns.ts |
| starc007/ui-components | 04d6f76e9e67e35cded996b1b8d08a5ddcebc13a | components/motion/command-palette.tsx | Grouped search/keyboard action order → batch1Patterns.ts |
| timolins/react-hot-toast | f339d7105c90e64bc80ee836b987f2efe235035c | src/core/use-toaster.ts | Remaining-duration pause/resume → batch1Patterns.ts |
| dvtng/react-loading-skeleton | f8b040dade9cfaad7e3e6fbc50243d79f508f1ca | src/skeleton.css | Layout placeholders/shimmer → batch1Patterns.ts |
| react-component/segmented | 8cbec0b3a0a4097b683a55b39b565ea1e249b47f | src/index.tsx | Radio selection and active indicator → batch1Patterns.ts |

Tactile UI's learning/testing-only README caution is retained in provenance; this is not a production endorsement. Bauhaus uses design-isms only as DISCOVERY_ONLY; Japandi uses marketplace discovery only; Agency Website v2 remains REFERENCE_ONLY with no verified license. Their source license status is never relabeled MIT: only DRH's new code is MIT. Agency art, studio name, project stories and text are newly authored. No React Bits / Commons Clause code was imported.

Optional network verification: `node scripts/verify-batch1-sources.mjs` validates the pinned LICENSE bytes, reviewed source hashes and root notice inventory without repinning HEAD.

## Layout and interaction contracts

- Card and Detail share each recipe's DOM, CSS and state implementation. Containers determine typography and spacing; small previews scroll internally when content exceeds their height. New maturity badges sit below the preview, because an overlaid badge intercepted a real Skeleton button during QA. Original cards retain their previous placement.
- Bottom Sheet and Command Palette begin as non-modal visible previews, avoiding automatic catalog focus theft. Explicit opening invokes native `showModal()`. Escape, close/backdrop dismissal and opener restoration are implemented. An explicit Tab loop keeps keyboard focus inside the iframe modal boundary. Agency case dialogs use the same focus helper.
- Toast uses a 5000ms remaining-time budget, pauses on pointer/focus/document-hidden state and clears timers on pagehide. Skeleton resolves a cancellable 1200ms local request; its placeholders and final rows keep the same bounds.
- Agency scroll reveals use an iframe-rooted observer, 800ms clip/translation and artwork hover scaling; reduced motion shows all projects immediately. The contact control uses native email validity with local confirmation and no form submission/network request in the sandbox. Radio/audio/booking actions are explicitly local visual examples, not backend services.
- Standalone output contains all styles, script and notices. There are no remote images, fonts, fetch calls or runtime dependencies. Reduced motion removes decorative animation while preserving state changes, keyboard and touch controls.

## Verification and evidence

Automated contracts: `npm run typecheck`, `npm run build`, `npm run audit:v1.4`, `npm run audit:design-md`, `npm run audit:demos`, the advanced-demo TypeScript/export audits, the Batch 1 fixture TypeScript check and `git diff --check`.

Browser scripts use Playwright with Microsoft Edge. Set `PLAYWRIGHT_PATH` if Playwright is supplied outside this repository and serve Vite on port 5173 (or set `DRH_URL`).

- `node tests/batch1/browser-qa.mjs`: ten recipes × Card/Detail × 1920×1080, 1440×1000, 1366×768, 1024×768, 390×844; horizontal overflow and visible dimensions; style controls, sheet drag/snaps, command filtering/keyboard, toast lifecycle, skeleton geometry/error/retry, segmented indicator/data and agency case/filter/contact behavior. Also executes all ten standalone exports with networking disabled and reduced motion enabled.
- `node tests/batch1/app-qa.mjs`: actual HashRouter Detail pages at desktop/mobile, HTML downloads, clipboard parity (normalizing Windows line endings), Agent/Source tabs, UI Patterns filter, modal Tab containment and CDP-generated real touch drag/selection.
- Machine-readable results and inspected desktop/mobile screenshots: `artifacts/post-v17-batch1/`.

The build succeeds with the existing large main-chunk warning; Batch 1 adds self-contained recipes to the existing eager registry. No dependency was added. Working/Ready describes these browser specimens and handoff artifacts, not production backend integration or an exact copy of any third-party site.
