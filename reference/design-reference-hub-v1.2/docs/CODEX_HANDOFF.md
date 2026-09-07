# CODEX HANDOFF — Design Reference Hub

## Read this first

You are continuing an existing product, **not redesigning it from scratch**.

The product is a visual design vocabulary/reference hub for coding-agent users. The core workflow is:

> **Browse → See → Pick → Copy → Vibe Coding**

The strongest product requirement is **live preview coverage**. Long explanation pages are secondary.

## Current state

V1.2 contains:

- Full-screen ShaderGradient hero using the 10 official upstream presets
- ShaderGradient-style black preset gallery and three marketing/demo sections
- 93 reference metadata entries
- Shared Live Demo registry
- Home / Explore / Reference Detail / Collections / Sources
- Search + category + subcategory + Copy OK filters
- Copy Prompt / Copy DESIGN.md / starter snippet
- 182-source license/research map
- GitHub Pages workflow
- Responsive and reduced-motion rules

### Current reference category counts

- Styles: 14
- Background: 14
- Motion: 13
- Text: 10
- Effects: 10
- Sections: 13
- Pages: 9
- DESIGN.md: 10
- **Total: 93**

## Files that matter most

```text
src/data/references.ts
  Canonical user-facing reference metadata and collections.

src/components/demos/DemoRenderer.tsx
  Live demo registry. A `demo` key from reference metadata resolves here.

src/components/ShaderBackdrop.tsx
  Actual @shadergradient/react renderer used by Hero, official preset gallery and Shader Gradient detail/card. Compact canvases are viewport-virtualized.

src/data/shaderPresets.ts
  The 10 official upstream ShaderGradient preset configurations. Do not replace these with invented lookalikes without explicit direction.

src/components/landing/
  V1.2 ShaderGradient-style landing experience. Read docs/SHADERGRADIENT_PORT.md before changing it.

src/styles.css
  Hub chrome + current demo CSS. Large intentionally for V1; split only when a focused refactor is useful.

src/pages/ExplorePage.tsx
src/pages/ReferencePage.tsx
src/pages/CollectionsPage.tsx
src/pages/SourcesPage.tsx
  Product surfaces. Do not create one page file per reference.

docs/LIVE_DEMO_BACKLOG.md
  Ordered expansion queue.
```

## Do not do these things

1. Do not replace the visual-first gallery with a dashboard/table UI.
2. Do not remove the live card previews in favor of screenshots.
3. Do not add an AI chatbot/generator to the site.
4. Do not copy Aceternity/React Bits/Animate UI/marketplace component source just because it is viewable.
5. Do not duplicate reference metadata in component files.
6. Do not create routes manually for each reference.
7. Do not add heavy dependencies for one tiny effect without a strong reason.
8. Do not stack multiple hero effects. ShaderGradient remains the hero lead unless explicitly requested otherwise.
9. Do not "reinterpret" the V1.2 Hero into a generic gradient landing. Preserve the recognizable ShaderGradient composition unless the product owner requests a new direction.

## Preferred task loop — token efficient

When asked to expand demos, work **5–8 references per task**.

For each batch:

1. Read only the relevant rows in `LIVE_DEMO_BACKLOG.md`.
2. Inspect existing demo patterns in `DemoRenderer.tsx` before adding a new component.
3. Add reference metadata.
4. Add/reuse demo rendering.
5. Add styles.
6. Run typecheck/build.
7. Report exact IDs completed and any licensing blocks.

Avoid broad architecture discussion unless a real blocker appears.

## Adding one reference

Example goal: `Matrix Rain`.

### 1. Metadata

Add to `src/data/references.ts`:

```ts
mk({
  id: 'matrix-rain',
  name: 'Matrix Rain',
  category: 'Background',
  subcategory: 'Particles',
  demo: 'matrix-rain',
  description: 'Falling glyph columns create a dense terminal atmosphere.',
  tags: ['matrix', 'glyph', 'canvas'],
  useCases: ['cyberpunk', 'developer tool', 'experimental'],
})
```

If referencing external implementation, fill source/repo/license fields and verify the actual license.

### 2. Demo

Prefer a small dedicated helper component if it has state/Canvas lifecycle:

```tsx
function MatrixRain() {
  // canvas setup, resize, RAF cleanup, reduced motion
}
```

Then register:

```tsx
if (kind === 'matrix-rain') {
  return <div className="demo-stage matrix-stage"><MatrixRain /></div>
}
```

### 3. Card + detail

No additional page changes. The same demo automatically renders in both contexts.

## Interaction quality bar

Every demo should answer “what does this term mean?” in 1–3 seconds.

Good:
- pointer spotlight visibly follows pointer
- magnetic button actually pulls toward cursor
- image trail spawns along cursor movement
- text reveal clearly uses a mask

Weak:
- generic animated gradient used for five unrelated terms
- a static label saying “Parallax” without depth movement
- animation so subtle that the pattern cannot be recognized

## Performance rules

### Gallery

The gallery may render dozens of live cards. Optimize for the grid first.

- CSS loops: okay, but keep them simple
- Canvas: activate only when visible if the catalog grows
- WebGL: avoid many simultaneous contexts; prefer one-off detail previews
- Videos: no autoplay grid wall
- Large libraries: dynamic import

### ShaderGradient

Current version choice:

```text
React 18.x
@react-three/fiber 8.x
@shadergradient/react 2.4.x
three >= 0.158
```

Upstream documents React 18/19 compatibility and matching R3F major versions. Do not upgrade React/R3F independently without verifying the matrix.

## Accessibility / fallback checklist

Every new interactive demo:

- Works or degrades cleanly on touch/coarse pointer
- Has no critical information available only on hover
- Respects `prefers-reduced-motion`
- Does not steal keyboard focus unexpectedly
- Interactive controls use actual button/input semantics
- Decorative canvas/WebGL is `aria-hidden` where appropriate

## Licensing workflow

Before `copy-ok`:

1. Open upstream repository LICENSE or official terms.
2. Confirm the license applies to the code actually referenced.
3. Check images/fonts/icons separately.
4. Record `source`, `repository`, `license.name`, `license.evidenceUrl`.
5. If unsure, mark `reference` and use a generic Hub-original implementation instead of copied code.

Special known cases from research:

- **ShaderGradient** — MIT; current native dependency.
- **Magic UI** — MIT repository; still audit external assets.
- **Motion Primitives** — MIT.
- **React Bits** — MIT + Commons Clause; reference, not wholesale mirror.
- **Animate UI** — actual LICENSE includes Commons Clause.
- **Aceternity UI** — custom license; component-source redistribution restrictions.
- **21st.dev** — marketplace/directory; resolve item-level original license.

## Suggested next 4 Codex batches

### Batch A — P0 backgrounds
Implement:
- `mouse-following-gradient`
- `interactive-grid`
- `matrix-rain`
- `animated-lines`
- `water-ripple`

### Batch B — P0 text/effects
Implement:
- `flip-words`
- `character-reveal`
- `word-reveal`
- `moving-border`
- `glow-cursor`
- `hover-border`

### Batch C — P0 sections
Implement:
- Process
- Team
- Gallery
- Login panel
- Signup panel
- Feature tabs

### Batch D — style breadth
Implement:
- Material Design
- Flat Design
- Playful
- Hand-drawn / Doodle
- Pixel
- Corporate
- Gradient-led UI

Do these before advanced WebGPU text destruction.

## Refactor trigger

`DemoRenderer.tsx` is intentionally centralized for the first implementation. Split it only when adding more demos becomes uncomfortable. When splitting, preserve one registry:

```text
components/demos/
  registry.tsx
  backgrounds/
  motion/
  text/
  effects/
  sections/
  pages/
```

Reference metadata should still resolve by one `demo` string.

## GitHub Pages

Vite uses `base: './'` and the app uses HashRouter. Do not switch to normal browser paths unless the host supplies SPA fallback rewrites.

Deployment workflow:

```text
.github/workflows/deploy-pages.yml
```

## Current validation note

The generation environment did not have reliable npm-registry access, so dependency installation timed out there. Source files were syntax-parsed separately. On a normal networked environment, the first continuation action should be:

```bash
npm install
npm run build
```

If package resolution has moved since this handoff, keep the documented React / R3F compatibility matrix in mind and make the smallest version adjustment needed.
