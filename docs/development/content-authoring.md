# Content Authoring Playbook

Follow this exact procedure to add a new Reference to the Design Reference Hub.

## 1. Research & Definition
* **Identify the Pattern:** Choose a pattern to add. Understand its core visual and interactive characteristics.
* **License Decision:** Verify the source license. 
  * If permissive exact source is verified -> use it (`upstream-oss` or `derived`).
  * If it's a general design concept -> build a `hub-original` independent implementation.
  * If redistribution is unclear -> create a `reference` entry with a link, no copied code.
* **Canonical Behavior Definition:** Define what makes this pattern recognizable (e.g., specific interactions, geometry, timing).

## 2. Implementation
* **Demo Implementation:** Write the component code in `src/components/demos/DemoRenderer.tsx` and styles in `src/styles.css`.
* **Card & Detail Verification:** Ensure the effect is clearly visible in a ~230px Card and doesn't break or feel empty in a 440~720px Detail view. Adjust scaling and density as needed.
* **Responsive & Motion:** Implement container-query or responsive logic. Implement `prefers-reduced-motion` fallbacks.
* **Browser QA:** Test in Desktop (1440x1000) and Mobile (390x844). Verify interactions, keyboard accessibility, and reduced motion in the browser.

## 3. Artifact Generation
* **HTML Artifact:** Create a standalone, executable `index.html` equivalent of the demo.
* **React Artifact:** (Optional) If it makes sense, create a native React implementation. Do not use iframe wrappers and call them React.
* **CSS Artifact:** (Optional) Extract reusable CSS if it provides standalone value.
* **Agent Package:** Write the Agent artifact detailing Goal, Visual Target, Interaction Behavior, Component Structure, Responsive/Motion rules, and Source/License constraints. The text must perfectly match the code artifacts.

## 4. Metadata & Registration
* Add the reference metadata to `src/data/references.ts` (or the relevant catalog).
* Ensure `id`, `name`, `category`, `subcategory`, `description`, `tags`, `useCases`, `demo`, `implementation`, `source`, `license`, and `artifacts` are populated correctly according to the schema.
* Do not confuse reference/discovery source with actual implementation provenance.

## 5. Audit & Finalization
* **Run Audits:** Execute `npm run audit:references` and existing audits (`typecheck`, `build`, etc.).
* **Maturity Decision:** Evaluate against `REFERENCE_QUALITY_STANDARD.md`. If it passes all criteria, mark as `WORKING`. If it fails any (e.g., static mock only), mark as `PROTOTYPE`.
