# Reference implementation roadmap

This roadmap keeps incremental visual work aligned with `REFERENCE_QUALITY_STANDARD.md`. A reference remains `PROTOTYPE` until its preview, exports, interaction, responsive behavior, reduced-motion behavior, and provenance all pass together.

## Current inventory

- 223 references
- 222 `WORKING`
- 0 `PROTOTYPE`
- 1 official live reference

Run `npm run audit:v1.4` before updating these numbers.

## Phase 0 — Shared browsing and handoff foundation (complete)

- Show category totals in the Explore tabs.
- Keep list-card typography, spacing, and preview density consistent across categories.
- Use one `TAKE IT TO YOUR AGENT` structure for every reference: purpose, start prompt, proof chips, artifact tabs, copy, and download.
- Keep the preview and Agent panel aligned at desktop widths and naturally stacked on smaller screens.

## Phase 1 — UI Pattern card previews (complete)

- Give navigation and UI-pattern cards a card-specific responsive density.
- Auto-demonstrate state changes only in the card preview; preserve full manual interaction in detail views.
- Pause previews while offscreen or hidden and disable autoplay for `prefers-reduced-motion`.
- First batch: bottom tabs, top tabs, drawer, breadcrumbs, sticky header, floating action button, pagination, infinite scroll, back navigation, mega menu, and stepper.

## Phase 2 — Legacy Style prototypes (complete)

The legacy Style set now uses canonical shared recipes with distinct visual identity, real interaction, responsive card/detail variants, and reduced-motion fallbacks:

1. Minimalism, Editorial, Swiss
2. Y2K, Frutiger Aero, Terminal
3. Cyberpunk, Luxury, Dark UI
4. Remaining Style prototypes from the audit inventory

## Phase 3 — Pages and Sections (complete)

- Implement the remaining Page prototypes as complete compositions, not isolated hero mockups.
- Implement Section prototypes with meaningful content hierarchy and at least one usable interaction where appropriate.
- Reuse shared primitives only when the resulting references remain visually and behaviorally distinct.

Completion evidence is recorded in `V1_8_COMPOSITION_COMPLETION_AUDIT.md`. The 2026-11-10 browser pass covered the final composition references at 1440×1000 and 390×844, representative keyboard/pointer interactions, card-to-detail scroll reset, and the forced `?motion=reduce` QA path.

## Quality gate for every batch

1. Preview, HTML, CSS, React, and Agent package describe the same implementation.
2. Keyboard, pointer, touch, responsive, and reduced-motion paths are defined.
3. No source code or visual asset is imported without verified license evidence.
4. Run `npm run typecheck`, `npm run audit:references`, all existing audit scripts, and `npm run build`.
5. Browser-QA desktop, mobile, interaction, and reduced-motion behavior before marking visual work as passing.
