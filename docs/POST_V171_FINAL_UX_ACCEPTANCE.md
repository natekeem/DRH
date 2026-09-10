# POST V1.7.1 Final UX Acceptance

This document records the acceptance criteria and resolution of the Final UX Polish pass, executed to finalize the DRH UX baseline.

**Date:** 2026-09-10
**Status:** ALL ISSUES RESOLVED
**Build:** Passing (Typecheck, Vite, Audit scripts)

## 1. P0 — Critical UX Defects

### 1.1. Hero ShaderBackdrop flash on scroll
* **Observation:** The transition from the flat fallback div to the Three.js WebGL canvas caused a harsh black flash during shader compilation, and repeatedly remounted when scrolling.
* **Resolution:** Removed the `ShaderBackdrop` from `LandingHero.tsx`. Replaced with a static, visually rich CSS linear-gradient matching the Halo preset. WebGL context pressure is significantly reduced, and the scroll flash is eliminated. `PresetGallery` still successfully showcases the WebGL capabilities below the fold.

### 1.2. Hero Advanced Demo canvas too flat
* **Observation:** Advanced demos (Fluid Cursor, Liquid Refraction) in the Hero spotlight grid were capped at `220px` height due to defaulting to the `card` variant.
* **Resolution:** Modified `ReferenceCard.tsx` to pass the `large` prop to `DemoRenderer` as `detail={large}`. Spotlight cards now correctly render the `480px` detail variant, giving interactions enough vertical space.

### 1.3. Demo foreground/background contrast broken
* **Observation:** Light-background demo components (e.g., `mini-bento`) suffered from white text due to CSS inheritance when placed on light parent containers.
* **Resolution:** Audited and explicitly declared `color: #111` for light demo components (`.mini-bento`, `.pricing-demo`, `.stats-demo`, `.contact-demo`, `.cta-demo`, `.footer-demo`, `.matrix-demo`) in `styles.css`.

### 1.4. DESIGN.md brand previews look too similar
* **Observation:** All 74 vendor DESIGN.md entries shared identical layout tokens (`system-ui`, `48px` headings, `16px` body, `6px` radius). Previews were largely indistinguishable aside from a primary button color.
* **Resolution:** Upgraded `VendorDesignPreview.tsx` to read the richer per-brand `colors` palette. Added dynamic detection of dark-canvas brands (`luminance < 40`) to apply a `.ds-dark` inverse theme. Specimen layout now accurately reflects diverse brand canvases (e.g., Ferrari `#181818`, Linear `#010102`), text inks, and distinctive 6-swatch palettes.

## 2. P1 — Layout & Content Usability

### 2.1. Guide Home too wide
* **Observation:** `.guides-page` forced `max-width: none` and `width: 100%`, ignoring the global layout constraints.
* **Resolution:** Removed overrides from `styles.css`. Guide Home now strictly adheres to the standard `1180px` centered `--page-gutter` system.

### 2.2. Guide Detail TOC ratio wrong
* **Observation:** `grid-template-columns: minmax(0,940px) minmax(240px,1fr)` resulted in excessively wide right rails on large screens.
* **Resolution:** Adjusted grid to `minmax(0,1fr) 260px` with a tighter gap `clamp(40px,4vw,64px)`. The TOC rail is now locked to a standard width, expanding the editorial body column gracefully.

### 2.3. Guide lead paragraph indentation
* **Observation:** Raw markdown `<blockquote>` lacked CSS, applying browser default `margin: 1em 40px` indents.
* **Resolution:** Styled `.guide-markdown blockquote` as a proper article dek (subtitle) with `18px` font size, muted colors, zero side margins, and a bottom border.

### 2.4. Guide table readability
* **Observation:** Tables used `display: block` with no borders, padding, or headers.
* **Resolution:** Added comprehensive table CSS to `.guide-markdown table`, including `border-collapse`, padded headers with `background: #f5f4f1`, row separator borders, and aligned `td` elements.

### 2.5. Guide content/component QA
* **Observation:** Need to ensure guide content aligns with UI.
* **Resolution:** Verified `quickstart.md`, `create-design-md.md`, and `apply-demo-code.md`. Fixed a file path reference in `scripts/audit-v1.4.mjs` that still pointed to the deprecated `using-design-md.md`. All audits pass.

### 2.6. Guide/Explore/Sources hero design language mismatch
* **Observation:** Guide hero used non-standard padding, width, and sans-serif typography for italic accents.
* **Resolution:** Swapped `<section className="guide-intro">` for `<section className="listing-hero">` in `GuidesPage.tsx`. All main listing pages now share the exact same hero container logic, padding, eyebrow opacity, and Georgia serif italics.

## 3. P2 — Sources Discoverability

### 3.1. Sources filter UX & status badges
* **Observation:** Filtering was limited to 4 hardcoded status buttons. Badges were unstyled text.
* **Resolution:** 
  * Rebuilt `SourcesPage.tsx` filtering UI. Added `<select>` dropdowns for both Category and Status.
  * Added active filter tracking, a "초기화" (Reset) button, and dynamic result counts.
  * Added empty state UI.
  * Styled `.source-status` with visual badges (`.s-import--copy-candidate` [green], `.s-reference` [amber], `.s-restricted` [red]) to communicate hierarchy instantly.

---

**Commit:** `fix: finalize drh ux baseline` (to be created)
