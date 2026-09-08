# Advanced Demo Engines — integration handoff

Status: three independent engines implemented and fixture-tested; **not integrated into DRH UI, routes, recipes, references, or artifact resolution**.

Branch: `codex/advanced-demos`, started from `origin/main` at `ffcacbc` in a separate worktree. All changes are new files. Existing maturity labels remain unchanged until a later integration.

## Shared architecture and ownership

`src/components/demos/advanced/engine.js` is the single, import-free runtime containing all original JavaScript and GLSL. React imports it normally; HTML builders embed the same source, removing only its ESM export keyword. Do not maintain a second shader implementation inside an exporter. `engine.d.ts` describes its public contract. The runtime is plain JavaScript intentionally, so the export audit checks its syntax and the browser fixture checks compiled shaders; TypeScript checks the wrappers and public declarations.

`AdvancedDemoSurface.tsx` owns the empty host element and mounts/disposes the renderer with a React effect. Each named component imports its own scoped fallback CSS plus the shared `advanced.css`. No global selector or shared application style is changed. Changing `variant`, lens props, or `diagnostics` rebuilds the renderer; changing `active` pauses/resumes without rebuilding. Actual container resize rebuilds bounded GPU buffers and resets the simulation.

All engines use one WebGL 2 fullscreen triangle and their own context. All textures, framebuffers, programs, shaders, and the vertex array belong to one renderer. Partial construction failures also delete allocated resources. `destroy()` is idempotent and cancels RAF, disconnects both observers, removes all registered listeners and owned DOM, deletes GPU resources, and releases the context through `WEBGL_lose_context` when supported. Context loss stops drawing and shows a fallback; restoration rebuilds the renderer. Persisted pagehide/pageshow supports the browser back/forward cache; non-persisted pagehide disposes it.

Visibility gates: `active`, IntersectionObserver, `document.hidden`, positive host size, reduced motion, and context state. Offscreen pause retains allocations for resumption; the existing outer `DemoViewport` can additionally unmount offscreen cards to release them. An initially mounted offscreen engine may allocate buffers before its first observer callback, but does not continue animating offscreen. Avoid mounting an entire large catalog simultaneously.

Keyboard on the focusable host: arrow keys move the interaction point, Space injects/attracts/presses the lens, R resets. Pointer Events handle mouse, pen, and touch. `touch-action: pan-y` preserves vertical page scrolling; horizontal strokes manipulate the demo and vertical scrolling can issue pointercancel. This is a visual reference, not a canvas containing required readable content. Mode notices identify static/fallback output honestly.

### Common props and direct API

| Prop | Default | Behavior |
| --- | --- | --- |
| `variant` | `detail` | `card` or `detail`; height 220 or 480 CSS px (detail 400 below 600 px viewport) |
| `active` | `true` | External pause gate; no replay of queued pointer input on resume |
| `className` | empty | Scoped host sizing/placement; host must have positive dimensions |
| `diagnostics` | `false` | Fluid GPU readback every 90 frames for QA; keep false in production |

For non-React consumers, import `mountAdvancedDemo` from `engine.js` and pass an empty, sized, focusable host plus `{kind: 'fluid' | 'metaballs' | 'refraction', ...options}`. Retain the returned controller: `destroy()`, `reset()`, `setActive(boolean)`, `inspect()`. Import shared CSS and the selected fallback CSS. Do not append React-managed children to that host. `inspect()` exposes bounded allocation counts and simulation metrics, not browser-wide GPU memory usage.

### Shared render budgets

| Budget | Card | Detail, narrow/coarse | Detail, desktop |
| --- | --- | --- | --- |
| DPR maximum | 1 | 1 | 1.5 |
| Output pixel budget | 160,000 | 360,000 | 1,000,000 |
| Fluid velocity short edge | 80 narrow/coarse; 96 otherwise | 80 | 160 |
| Fluid dye short edge | 192 | 192 | 384 |
| Pressure Jacobi iterations | 12 narrow/coarse; 16 otherwise | 12 | 32 |
| Metaballs | 6 | 8 | 10 |

Narrow means host width below 600 CSS px; coarse means `(pointer: coarse)`. Fluid grid long edges cap at 512; at very wide aspect ratios the cap trades cell aspect fidelity for a bounded cost. Output raster scaling preserves the host aspect ratio. Frame dt caps at 1/30 second, and spring integration uses smaller substeps where needed. These are configured budgets, not a guarantee of any device's frame rate.

# Fluid Cursor

## Goal

Replace the later-integrated opacity/light trail with a genuine, pressure-based, interactive 2D fluid reference.

## Visual Target

Colored smoke strokes roll into vortices, advect into neighboring cells, diffuse, and fade on a dark field. Five finite startup impulses reveal the solver; there is no perpetual automatic pointer trail. After inactivity, dye eventually disappears. Move the pointer or press R to create new flow.

## Interaction

Normalized pointer displacement splats velocity (cells/second) and RGB dye. Input queues cap at 12 samples. Entering a new stroke cannot connect to a stale pointer location. Press/tap adds an upward impulse; keyboard input uses the same injection path. No CSS transform or opacity trail simulates the main effect.

## Rendering Pipeline

1. Velocity and dye Gaussian splats into ping-pong RGBA16F targets.
2. Semi-Lagrangian velocity advection with manually bilinear source sampling and exponential dissipation.
3. Explicit velocity diffusion with Laplacian weight capped below the stability limit.
4. Centered curl and curl-gradient vorticity confinement.
5. Forward divergence, zero-start pressure, 12/16/32 Jacobi iterations.
6. Backward pressure-gradient subtraction and boundary normal-velocity clamp.
7. Dye advection by the projected velocity, then dye diffusion/dissipation.
8. Tone-mapped dye display with a local density-gradient highlight.

Velocity advection deliberately precedes pressure projection so the velocity used for dye transport has just been projected. The forward divergence and backward gradient compose the same one-cell Laplacian used by Jacobi. This is a bounded visual solver with approximate boundary treatment, not a converged scientific CFD solution. Vorticity is an artistic detail-restoration force. Optional RMS readback compares divergence immediately before/after projection; it does not claim exact incompressibility.

## Dependencies

Browser WebGL 2 and `EXT_color_buffer_float`; manual bilinear sampling avoids a float-linear texture filtering dependency. React is needed only by the React wrapper. No new npm dependency, network asset, physics library, or CDN.

## Source / License

Original DRH implementation under the repository's MIT License, copyright 2026 Design Reference Hub contributors. Numerical background: Mark J. Harris, [GPU Gems Chapter 38](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu). This is a conceptual citation only. No NVIDIA text, code, shader, or asset is copied, and its publication is not treated as a permissive code license. Upstream repository adapted: **none**. Exact adapted portions: **none**.

## Files

- `src/components/demos/advanced/FluidCursorDemo.tsx`
- `src/components/demos/advanced/fluidCursor.css`
- Shared `engine.js` (`fluid()`), `engine.d.ts`, `AdvancedDemoSurface.tsx`, `advanced.css`, `index.ts`
- `src/lib/demo-exports/fluidCursorHtml.ts` and shared `advancedHtml.ts`

## Props

`FluidCursorDemoProps`: `variant`, `active`, `className`, `diagnostics`, as described above. No public solver tuning knobs; quality derives from host/device and variant.

## Performance

Eight textures/framebuffers (velocity pair, dye pair, pressure pair, divergence, curl) and nine programs, independent of input duration. Input adds two passes per queued splat; pressure dominates steady work. See the shared table for mobile resolution/iteration reductions. Diagnostics readback can stall the GPU and is opt-in only. The paused engine retains the current image without RAF.

## Reduced Motion

Static multicolor gradient; no GPU renderer or animation loop. WebGL/float-target failure uses a lightweight gradient whose center can update directly with input, with a visible fallback notice. It is not labeled a fluid simulation in this state.

## HTML Export

`fluidCursorHtml({ variant: 'detail' })` returns a complete UTF-8 HTML document with inline CSS/runtime, controls guidance, conceptual source link and full MIT notice. No fetches or external script tags. Write its return value directly to a `.html` file; it can run without a dev server. The audit generates card/detail files in the ignored fixture output folder.

## Integration Instructions

Map existing demo key `fluid-cursor` to `<FluidCursorDemo variant={detail ? 'detail' : 'card'} />` **before** the existing `recipes[kind]` choice in `DemoRenderer`. Keep `DemoViewport`. The current recipe is a spotlight approximation and otherwise wins precedence. Route standalone exports to `fluidCursorHtml`, then update maturity/readiness only after the newly connected detail/card and exported artifact pass the integration checks below.

## Acceptance Criteria

- Pointer strokes visibly curl, spread, persist briefly after input, and dissipate.
- Diagnostic `divergenceAfter` is below `divergenceBefore` on representative injected strokes, with finite dye energy.
- Mobile resolution and iteration reductions are visible in `inspect()`.
- Pause/offscreen stops frames; reduced motion releases renderer allocations; repeated dispose leaves zero owned GPU objects and zero owned DOM children.
- Real WebGL failure and recovery show the correct mode; export uses the identical solver.

# Metaballs

## Goal

Provide organic, deformable, interacting blobs with a genuine continuous merged surface.

## Visual Target

Six card blobs or eight/ten detail blobs combine into rounded membranes with smooth necks and specular highlights. The equilibrium arrangement can have a central opening; interaction closes or deforms it. Cards use closer anchors and larger relative radii so the effect remains visibly merged at 220 px height.

## Interaction

Pointer proximity repels; pressing attracts. Pointer speed strengthens forces and ellipse stretch. Damped anchor springs and mild pair separation prevent numerical collapse. Influence decays after stationary input, returning blobs to a gently drifting equilibrium. Keyboard arrows and Space expose the same field forces.

## Rendering Pipeline

CPU spring integration → rotated velocity-deformed ellipses → upload up to 12 packed uniform entries → evaluate the sum of softened inverse-quadratic fields per pixel → anti-aliased isosurface at 1.18 → analytical field-gradient normals → colored lighting/specular/rim shading. Each ellipse uses reciprocal axis scales to avoid simply growing with velocity. The continuous field, not CSS circles, creates the merging. Interior normal strength is bounded by field density and the rim power base is clamped to avoid far-field floating-point NaNs.

## Dependencies

WebGL 2, browser events/observers; React only for the wrapper. No float framebuffer extension needed, no textures or external assets, no additional npm dependency.

## Source / License

Original DRH JavaScript and GLSL, MIT. Upstream repository adapted: **none**. Exact adapted portions: **none**. Field evaluation, spring logic, lighting and artwork were written for this task. Redistribute with the root MIT notice.

## Files

- `src/components/demos/advanced/MetaballsDemo.tsx`
- `src/components/demos/advanced/metaballs.css`
- Shared `engine.js` (`metaballs()`), declarations, surface, shared CSS and barrel
- `src/lib/demo-exports/metaballsHtml.ts` and shared `advancedHtml.ts`

## Props

`MetaballsDemoProps`: `variant`, `active`, `className`, `diagnostics`. Blob count is 6 for card, 8 for narrow/coarse detail, 10 for desktop detail. Diagnostics reports blob count and current maximum deformation; it requires no GPU readback for this engine.

## Performance

One draw pass and one program, zero textures/framebuffers. Up to ten live blobs in this implementation; shader supports twelve slots. Spring CPU work includes at most 100 pair comparisons/frame. Shared DPR/pixel limits and visibility/cleanup apply. No DOM node per animated blob.

## Reduced Motion

Static gradient composition with an explicit static-preview label. No spring integration, shader resources or RAF. WebGL-unavailable fallback uses the same lightweight composition.

## HTML Export

`metaballsHtml({ variant: 'card' })` returns complete self-contained HTML with the same CPU springs, field shader, CSS, input/lifecycle behavior and full MIT notice.

## Integration Instructions

Map `metaballs` to `<MetaballsDemo variant={detail ? 'detail' : 'card'} />` before recipe/legacy dispatch, inside the existing `DemoViewport`. Route HTML download and agent starter code to `metaballsHtml`. Preserve canonical reference identity; update only its implementation/provenance/artifacts and verified maturity during integration.

## Acceptance Criteria

- Blobs share smooth necks, merge/separate under input, and recover toward their equilibrium.
- Velocity changes ellipse deformation; the response is clear at desktop detail size.
- Card renders 6 blobs and remains visibly merged; desktop detail renders 10 and narrow detail 8.
- No black/NaN regions at wide card aspect ratios; no horizontal page overflow at 390 px viewport.
- Shared lifecycle, fallback and standalone parity checks pass.

# Liquid Refraction

## Goal

Provide a pointer-following optical lens with actual background texture distortion.

## Visual Target

Mint/lilac/peach grid and large LIQUID / OPTICS text bend and magnify through an elastic lens, with RGB fringes, rim reflection, shadow and a bright specular response. It refracts its own generated texture; it does **not** capture arbitrary page DOM or act as a general backdrop-filter replacement.

## Interaction

A damped second-order spring follows the pointer, using substeps at most 1/120 second. Velocity sets orientation and reciprocal-axis squash/stretch. Pressing eases into a 12% radius increase, 18% distortion increase, and highlight shift. Release/leave returns toward equilibrium/center. Keyboard arrows/Space also work.

## Rendering Pipeline

Generate one local Canvas 2D grid/text texture → upload RGBA8 → compute moving elliptical sphere normal → GLSL `refract` with index ratio 1/1.46 → displace scene UV → sample RGB at 1.07/1.00/0.93 offsets → Fresnel/rim/specular blend and edge anti-aliasing. The background text uses system fonts and is generated locally once per rebuild.

## Dependencies

WebGL 2 and Canvas 2D; React only for the wrapper. No image, web font, DOM screenshot library, or CDN. No float-target extension is required.

## Source / License

Original DRH JavaScript, GLSL and generated artwork, MIT. Upstream repository adapted: **none**. Exact adapted portions: **none**. No external textures or font files redistributed. Full root MIT notice is included in HTML.

## Files

- `src/components/demos/advanced/LiquidRefractionDemo.tsx`
- `src/components/demos/advanced/liquidRefraction.css`
- Shared `engine.js` (`refraction()`), declarations, surface, shared CSS and barrel
- `src/lib/demo-exports/liquidRefractionHtml.ts` and shared `advancedHtml.ts`

## Props

Common props plus `intensity?: number` (default 1, finite values clamped to 0–2) and `radius?: number` (CSS pixels, default 62 card/155 detail, finite values clamped to 12–600 and to fit the base container). Press/stretch can extend the lens beyond that base fit and it clips at the host edge. Non-finite values use defaults. `intensity={0}` removes UV bending; reflective lighting/rim remains.

## Performance

One texture, one program, one pass/frame; no framebuffer allocation. Generated source texture caps at 1400 × 1000. At extreme aspect ratios the source-size cap may alter texture proportions; normal card/detail sizes are the target. Spring/deformation state is constant-size; shared budgets and pause/disposal apply.

## Reduced Motion

Static grid/gradient/ring, no GPU drawing or pointer-follow animation. Unsupported WebGL similarly uses a labeled gradient/ring fallback whose center may update directly with input.

## HTML Export

`liquidRefractionHtml({ variant: 'detail', intensity: 1, radius: 155 })`. The generated background, optical shader and complete license are inline; no external runtime dependency. `radius` has the same CSS-pixel meaning as in React.

## Integration Instructions

Existing `liquid-lens-effect` reference uses demo key **`liquid-lens`**, also used by `liquid-glass`. Map that key to `<LiquidRefractionDemo variant={detail ? 'detail' : 'card'} />` before recipe dispatch only if both references should use this generated-scene lens. If only one should change, assign it a distinct key during the separate integration task. Do not silently redirect `rgb-lens` or `style-liquid`. Route the selected key's HTML artifact to `liquidRefractionHtml` with matching parameters.

## Acceptance Criteria

- Grid/text bends visibly through the lens, with color fringes and a moving highlight.
- Pointer motion produces smooth spring follow and velocity deformation; pressing changes radius/distortion.
- Radius and intensity changes affect React and exported output equivalently.
- Reduced motion/failure clearly renders the static/lightweight substitute.
- Shared mobile, cleanup and standalone checks pass.

# Exact later integration sequence (not performed here)

1. Merge/cherry-pick this branch after the concurrent UI work is ready; resolve integration on that combined state. Import named components from `src/components/demos/advanced` in `src/components/demos/DemoRenderer.tsx` (or lazy-load their default-export modules). Put the explicit key branches before `recipes[kind]`, retaining `<DemoViewport detail={detail}>…</DemoViewport>` around each component.
2. Ensure the existing viewport/card container does not clip the 220 px card or 480/400 px detail host. Use a narrowly scoped integration class if the current shared container requires another height; do not copy global demo-stage styles into the engines. Observe actual host size and positive height. Keep diagnostics off.
3. In `src/data/references.ts`, preserve the fluid/metaballs IDs. For the lens resolve the shared `liquid-lens` key choice above. Set implementation to hub-original, React/WebGL 2 (with browser feature requirements, no new npm package), MIT/copy-ok, and explicit `hub-original` provenance. Point source/license evidence at the DRH repository and committed LICENSE; the NVIDIA chapter is only numerical background, never an upstream-code provenance label.
4. In `src/lib/referencePackage.ts`, add an explicit engine-key-to-builder mapping ahead of `recipeHtml` for `starterCodeFor` and `buildStandaloneHtml`, preserving existing copy/license gates. Connect matching generated HTML through the current artifact resolver in `src/lib/artifacts.ts` or `ReferenceArtifacts.html` so Copy/Download/Agent Package agree. Do not return the old spotlight recipe as a fluid artifact. React code artifacts must include the shared engine/CSS/types or a clear complete multi-file package; a wrapper alone is not a runnable starter.
5. Update `demoMaturity`, `packageReadiness`, and `provenanceFor` only for the keys actually connected and tested. Use **Working Demo / Hub Original / MIT**, never Official OSS. Existing fluid special-case Prototype exclusions must be addressed explicitly after integration. Update corresponding agent instructions/acceptance text from this document rather than retaining old recipe logic. Remove obsolete recipe dispatch only for those keys; other aliases share the old recipe objects.
6. Run typecheck/build/export audit and the integration browser checks: Explore card → detail → input → viewport/theme resize → Back → Copy/Download → reopen exported HTML. Verify desktop/mobile, viewport gating, reduced motion, fallback, and source/license text in the actual artifact UI. Until that passes, do not claim the main application now uses these engines.

# Validation and reproduction

Run from the repository root (no package.json change required):

```sh
npm ci
npm run typecheck
npx tsc --noEmit -p tests/advanced-demos/tsconfig.json
node tests/advanced-demos/audit.mjs
npm run build
git diff --check
npm run dev -- --host 127.0.0.1 --port 5183 --strictPort
```

Open `/tests/advanced-demos/index.html`. The retained test-only fixture provides direct-engine diagnostics, React StrictMode wrappers, card/detail controls, mount/unmount, pause, reduced-motion media-query double, WebGL-unavailable double, actual context loss/restoration, six repeated disposal cycles, and sandboxed standalone previews. Test doubles exist only in this entry and are cleaned up during HMR. The fixture is not imported by the application. The export audit creates six ignored HTML files under `tests/advanced-demos/generated/`; it checks exact shared runtime parity, parseable inline JavaScript, no external script/link/image assets, reduced-motion handling and full MIT notice.

## Observed checks — 2026-09-09, Windows in-app Chromium

- Desktop fixture 1440 × 1000 and narrow fixture 390 × 844: all three engines rendered and responded to pointer drag. React StrictMode mount/unmount produced one owned canvas per host. No horizontal layout overflow was visible on the narrow fixture.
- Fluid detail host 1100 × 480: 367 × 160 velocity, 512 × 384 dye, 32 pressure iterations. Representative post-restoration RMS divergence decreased **0.378329 → 0.062357**. Narrow host 343 × 400 used 80 × 93 velocity, 192 × 224 dye, 12 iterations, with **2.407156 → 1.059094**. These are observed transient samples, not universal tolerances or scientific accuracy claims.
- Pointer Fluid strokes formed rolled, persistent smoke; Metaballs merged and deformed under drag. Card 6 / desktop detail 10 / narrow detail 8 counts were confirmed. A wide-card far-field shading issue found during QA was corrected by bounding the rim power base; the corrected wide card and narrow card were rechecked.
- Liquid grid/text distortion, RGB fringes, spring stretch and smaller radius/zero-intensity configuration were visually checked. Narrow drag reported lens stretch about 1.19.
- Pause and offscreen intersection both reported `running: false`; scrolling to the React wrapper rendered that wrapper while the first engine remained paused. Actual `WEBGL_lose_context` reported context-lost with zero owned renderer resources, then restored to webgl2 and resumed.
- Reduced-motion double reported static mode, no RAF, and zero renderer resources. Forced WebGL failure reported fallback and zero resources. Six disposal cycles across all three engines left zero textures/framebuffers/programs, zero owned DOM children, and no input-count changes after dispatching to a disposed host. Destroy was called twice in each cycle.
- Fluid and Metaballs generated HTML files executed as independent pages; Liquid Refraction executed both as a generated file and in a sandbox with only `allow-scripts`. All three selected WebGL 2; export pages emitted no browser errors during these checks.
- TypeScript application/fixture checks, six-export audit, production build and whitespace diff check pass. The application build continues to warn about its existing large bundle; these engines are intentionally not imported into that bundle yet. The fixture had a development-only duplicate React root warning during HMR; its root/query-double disposal was corrected before final validation.

Limits: responsive viewport QA is not physical iOS/Android touch or GPU testing. Pointer Events and coarse-pointer budgets are implemented, but native touch scrolling, low-memory mobile GPU behavior, and Safari/Firefox still need device validation. Document-hidden and persisted back/forward cache handlers are implemented; this run directly exercised offscreen pause and context restore, not every browser lifecycle transition. These engines do not establish main-UI integration readiness by themselves.
