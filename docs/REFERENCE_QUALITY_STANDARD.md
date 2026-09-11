# Reference Quality Standard

This document is the **canonical quality contract** for all Reference implementations in the Design Reference Hub (DRH). All future references must adhere to this standard.

## 1. Reference Maturity

### WORKING DEMO

To be marked as a `WORKING` demo, a reference must pass all of the following criteria:

* **Visual Identity:** The canonical feature must be immediately visible. It should be identifiable without its name. Do not reuse generic placeholders.
* **Card (Preview):** The core effect must be visible even in a small ~230px preview card.
* **Detail (Preview):** The effect must not break or diminish in a larger 440~720px detail view. Density-sensitive and scale-sensitive effects must respond to the container size.
* **Interaction:** If interaction is essential to the reference (e.g., hover, click, drag, scroll), it must work. Do not use fake or purely decorative interactions.
* **Touch/Mobile:** Effects must not break on mobile devices. Provide an intentional static/mobile state if a pointer-centric effect cannot work on touch.
* **Reduced Motion:** Must respect `prefers-reduced-motion`. Information must not be lost; transitions should be instantaneous or gracefully degraded.
* **Lifecycle:** Must handle offscreen, unmount, remount, and pagehide events without resource leaks (e.g., clear intervals, cancel RAF, clean up WebGL contexts and observers).
* **Responsive:** Must render without horizontal overflow at minimum resolutions of 390x844 and 1440x1000.
* **Offline:** Must work without external network requests unless absolutely necessary (e.g., avoid remote fonts, external images).
* **Source/License:** Must have clear provenance. `copy-ok` means the exact artifact can be safely copied and redistributed according to its license evidence.

### PROTOTYPE

If a demo fails any of the above (e.g., lacks canonical behavior, has incomplete interaction, is just a static mock, lacks a standalone implementation, fails responsive/motion checks, has unclear source/license, or lacks a concrete Agent package), it must remain a `PROTOTYPE`. Do not artificially promote Prototypes to Working status just to increase the count.

## 2. Artifact Quality Contract

Only expose meaningful artifacts. Do not generate artifacts just to fill out the tabs.

### Agent Package
The Agent artifact is an **Implementation Contract** for Coding Agents. It is not just a summary.
It must include:
* Goal and Visual Target
* Interaction Behavior
* Component Structure and Dependencies
* Implementation Logic
* Responsive and Reduced Motion behavior
* Source/License constraints
* Clear Acceptance Criteria
Do not hallucinate behaviors that are not implemented. Be explicit if something is missing (e.g., "This is a prototype and does not yet handle X").

### HTML Artifact
Must be an independently runnable, canonical demo. Saving it as `index.html` and opening it in a browser must work perfectly. It must contain the necessary structure, styles, and behavior.

### CSS Artifact
Provide standalone CSS only if it is genuinely useful on its own (e.g., reusable styles that can be applied to an existing DOM/React structure). If the CSS alone does not make the demo work, clarify what companion artifact is required.

### React Artifact
Must be a **native React implementation**.
* Do not wrap a standalone HTML string in an iframe (`<iframe srcDoc={...} />`) and call it "React". If doing so, explicitly label it as a `React Wrapper`.
* A native React artifact must use proper React paradigms: components, hooks, state, lifecycle management, and event handling.

## 3. Artifact Source of Truth

Avoid manual divergence between artifacts. The flow should be:
**Canonical Demo Definition** -> **Preview** -> **Standalone HTML** -> **CSS** (if meaningful) -> **Native React** (if implemented) -> **Agent Package**.
If the duration, behavior, or dependencies in the Agent Package differ from the actual code artifact, the reference fails the quality check.

## 4. Source & License Validation

* **`copy-ok`**: Requires verified permissive exact source (e.g., MIT, Apache-2.0, Hub Original).
* **`reference` / `restricted`**: If redistribution is unclear or restricted, do not copy the source. Use Hub Original for generic concepts or only provide links.
* Publicly visible on GitHub does not automatically mean `copy-ok`.

## 5. Vendor DESIGN.md previews

Vendor previews additionally follow [Brand DESIGN.md Preview Standard](BRAND_DESIGN_PREVIEW_STANDARD.md) for source-driven compositions, identifiers, sync preservation and Card/Detail browser acceptance. The maturity, provenance and artifact rules above continue to apply.
