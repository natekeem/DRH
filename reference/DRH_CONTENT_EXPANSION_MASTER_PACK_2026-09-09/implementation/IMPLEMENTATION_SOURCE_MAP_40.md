# DRH Next 40 — Implementation Source Map

조사일: 2026-09-09

목표: 각 후보를 실제 구현자가 추가 조사 없이 시작할 수 있도록 `Source → License → Copy/Adapt 여부 → Canonical acceptance`까지 연결한다.

중요: 이 문서는 제3자 코드를 포함하지 않는다. URL/라이선스/독립 요약/구현 판단만 담는다.

## 01. Neumorphism / Soft UI
- Category: **Styles**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Raised and inset surfaces must be visibly driven by paired shadow geometry on a near-background surface; not just a gray card with one drop shadow.

### Primary implementation/reference source
- ui-neumorphism
- URL: https://github.com/AKAspanion/ui-neumorphism
- Demo: https://akaspanion.github.io/ui-neumorphism/
- License: **MIT**
- Scope: **CODE_OK**
- Note: 50+ React neumorphic components; strong canonical implementation reference.

### Secondary sources
- **Neumorphism.io** — BSD-3-Clause / `CODE_OK`
  - https://github.com/adamgiebl/neumorphism
  - Very strong reference for soft-shadow geometry and parameterization.

### DRH implementation target
- Card: Style board using typography, surface, buttons and one illustration/content sample.
- Detail: Expanded design-system specimen showing type, palette, surfaces, components and layout rhythm.
- Interaction: Subtle; the style itself should remain the main reference.

## 02. Skeuomorphism
- Category: **Styles**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Use physical material cues (gloss, bevel, inset, texture/lighting) and at least one tactile control state.

### Primary implementation/reference source
- Tactile UI
- URL: https://github.com/KzqKzq/tactile-ui
- Demo: https://kzqkzq.github.io/tactile-ui/
- License: **MIT**
- Scope: **CODE_OK_WITH_CAUTION**
- Note: 30+ tactile/skeuomorphic React components. README says learning/testing only; treat as reference/adaptation with explicit provenance, not production endorsement.

### Secondary sources
- **skeuomorph/ui** — VERIFY LICENSE FILE BEFORE COPY / `REFERENCE_UNTIL_VERIFIED`
  - https://github.com/krzysztoff1/ui-skeuomorph
  - 2000s glossy/brushed-metal/tactile shadcn-inspired system. Useful visual benchmark.

### DRH implementation target
- Card: Style board using typography, surface, buttons and one illustration/content sample.
- Detail: Expanded design-system specimen showing type, palette, surfaces, components and layout rhythm.
- Interaction: Subtle; the style itself should remain the main reference.

## 03. Bauhaus
- Category: **Styles**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Primary geometry, asymmetric/function-led grid, strong display type and restrained primary-color accents; avoid turning it into generic geometric minimalism.

### Primary implementation/reference source
- design-isms
- URL: https://lidge-jun.github.io/design-isms/
- Demo: https://lidge-jun.github.io/design-isms/
- License: **Unknown/no root license verified**
- Scope: **DISCOVERY_ONLY**
- Note: Taxonomy benchmark only; no code/text/image copying.

### Secondary sources
- **Framer Marketplace** — Per-item / marketplace terms / `DISCOVERY_ONLY`
  - https://www.framer.com/marketplace/templates/
  - Use layout/style trend discovery only.

### DRH implementation target
- Card: Style board using typography, surface, buttons and one illustration/content sample.
- Detail: Expanded design-system specimen showing type, palette, surfaces, components and layout rhythm.
- Interaction: Subtle; the style itself should remain the main reference.

## 04. Japandi
- Category: **Styles**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Warm natural neutrals, restrained serif/sans pairing, natural-material impression and generous rhythm; avoid generic beige SaaS.

### Primary implementation/reference source
- Framer Marketplace
- URL: https://www.framer.com/marketplace/templates/
- Demo: https://www.framer.com/marketplace/templates/
- License: **Per-item / marketplace terms**
- Scope: **DISCOVERY_ONLY**
- Note: Use layout/style trend discovery only.

### Secondary sources
- **design-isms** — Unknown/no root license verified / `DISCOVERY_ONLY`
  - https://lidge-jun.github.io/design-isms/
  - Taxonomy benchmark only; no code/text/image copying.

### DRH implementation target
- Card: Style board using typography, surface, buttons and one illustration/content sample.
- Detail: Expanded design-system specimen showing type, palette, surfaces, components and layout rhythm.
- Interaction: Subtle; the style itself should remain the main reference.

## 05. Boids Ecosystem
- Category: **Background**
- Recommended model: **Codex**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Must visibly show separation + alignment + cohesion, with coherent flock turning; random particles are not boids.

### Primary implementation/reference source
- boids-js
- URL: https://github.com/ercang/boids-js
- Demo: https://ercang.github.io/boids-js/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Separation/alignment/cohesion + spatial grid + worker variants.

### Secondary sources
- **Ben Eater Boids** — MIT / `CODE_OK`
  - https://github.com/beneater/boids
  - Small, easy-to-understand boids algorithm demonstration.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 06. Ferrofluid Surface
- Category: **Background**
- Recommended model: **Codex**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Coherent magnetic field should create spikes/lobes and attraction behavior; ordinary metaballs are insufficient.

### Primary implementation/reference source
- React Bits
- URL: https://www.reactbits.dev/
- Demo: https://www.reactbits.dev/
- License: **MIT + Commons Clause**
- Scope: **DISCOVERY_ONLY_FOR_DRH_CATALOG**
- Note: Do not redistribute components as catalog items. Use concept discovery only.

### Secondary sources
- **design-isms** — Unknown/no root license verified / `DISCOVERY_ONLY`
  - https://lidge-jun.github.io/design-isms/
  - Taxonomy benchmark only; no code/text/image copying.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 07. Liquid Chrome
- Category: **Background**
- Recommended model: **Codex**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Reflective/chromatic moving metal bands must read as a material surface; not just a silver gradient.

### Primary implementation/reference source
- metal-fx
- URL: https://github.com/Jakubantalik/metal-fx
- Demo: https://metal.jakubantalik.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct canonical animated WebGL liquid-metal border for real semantic controls.

### Secondary sources
- **React Bits** — MIT + Commons Clause / `DISCOVERY_ONLY_FOR_DRH_CATALOG`
  - https://www.reactbits.dev/
  - Do not redistribute components as catalog items. Use concept discovery only.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 08. Topography Contours
- Category: **Background**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Multiple contour isolines with evolving elevation field; the lines themselves must form topographic bands.

### Primary implementation/reference source
- topolines
- URL: https://github.com/idleCyrex/topolines
- Demo: https://topolines.idlee.xyz
- License: **MIT**
- Scope: **CODE_OK**
- Note: Excellent direct match: GPU topographic contours, pointer bump, offscreen pause, reduced-motion and context recovery.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 09. Voronoi Field
- Category: **Background**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Cells must derive from nearest-site partitions and visibly react to seed movement/pointer field.

### Primary implementation/reference source
- Port80 WebGL Gallery
- URL: https://github.com/kongaravinay/port80-webgl-gallery
- Demo: -
- License: **MIT**
- Scope: **CODE_OK**
- Note: Interactive WebGL Voronoi with OGL/GLSL + workers; adapt only generic field logic, not remote image assets.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 10. Caustics
- Category: **Background**
- Recommended model: **Codex**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW-MEDIUM — usable with explicit license/dependency/provenance checks.
- Canonical acceptance: Moving focused light filaments must read as refracted water-light patterns, not random noise.

### Primary implementation/reference source
- webgl-water lineage / water-demo caustics
- URL: https://github.com/shanecelis/water-demo
- Demo: -
- License: **MIT lineage**
- Scope: **CODE_OK_WITH_NOTICE**
- Note: Caustics shader carries explicit Evan Wallace + Shane Celis MIT provenance. Preserve both notices if adapting.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 11. Dither Field
- Category: **Background**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Visible ordered/error-diffusion-like pixel threshold structure, not ordinary noise/grain.

### Primary implementation/reference source
- React Bits
- URL: https://www.reactbits.dev/
- Demo: https://www.reactbits.dev/
- License: **MIT + Commons Clause**
- Scope: **DISCOVERY_ONLY_FOR_DRH_CATALOG**
- Note: Do not redistribute components as catalog items. Use concept discovery only.

### Secondary sources
- **design-isms** — Unknown/no root license verified / `DISCOVERY_ONLY`
  - https://lidge-jun.github.io/design-isms/
  - Taxonomy benchmark only; no code/text/image copying.

### DRH implementation target
- Card: Compact, immediately recognizable loop with reduced element count and low DPR.
- Detail: Area-aware high-density version that fills the larger preview without looking sparse.
- Interaction: Pointer or ambient motion where canonical; deterministic seeded randomness for stable QA.

## 12. Morphing Dialog
- Category: **Motion**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Trigger and dialog share geometry/visual continuity; it must feel like the trigger becomes the dialog.

### Primary implementation/reference source
- Motion Primitives
- URL: https://github.com/ibelick/motion-primitives
- Demo: https://motion-primitives.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### DRH implementation target
- Card: One focused control/surface showing the canonical motion in 2–4 seconds.
- Detail: Larger interactive composition with full enter/exit/reverse behavior and visible state changes.
- Interaction: Pointer/keyboard/touch where meaningful; spring/easing values must be explicit.

## 13. Dynamic Island
- Category: **Motion**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: One pill shell changes dimensions/content across multiple live activity states with springy continuity.

### Primary implementation/reference source
- beUI Dynamic Island
- URL: https://beui.dev/components/blocks/dynamic-island
- Demo: https://beui.dev/components/blocks/dynamic-island
- License: **MIT via repository**
- Scope: **CODE_OK**
- Note: Direct canonical match with reduced-motion usage.

### Secondary sources
- **beUI** — MIT / `CODE_OK`
  - https://github.com/starc007/ui-components
  - Copy-own-code registry; very strong source for Dynamic Island, command palette, notification stack, masonry, etc.

### DRH implementation target
- Card: One focused control/surface showing the canonical motion in 2–4 seconds.
- Detail: Larger interactive composition with full enter/exit/reverse behavior and visible state changes.
- Interaction: Pointer/keyboard/touch where meaningful; spring/easing values must be explicit.

## 14. Morphing Search
- Category: **Motion**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: A compact trigger transforms into a search surface and back, preserving spatial identity.

### Primary implementation/reference source
- goey-toast
- URL: https://github.com/anl331/goey-toast
- Demo: https://goey-toast.vercel.app
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct match; includes Agent Skill, keyboard dismiss, swipe, reduced-ish motion presets and promise states.

### Secondary sources
- **Motion Primitives** — MIT / `CODE_OK`
  - https://github.com/ibelick/motion-primitives
  - Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### DRH implementation target
- Card: One focused control/surface showing the canonical motion in 2–4 seconds.
- Detail: Larger interactive composition with full enter/exit/reverse behavior and visible state changes.
- Interaction: Pointer/keyboard/touch where meaningful; spring/easing values must be explicit.

## 15. Dock Magnification
- Category: **Motion**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Pointer distance affects neighboring items continuously, not only the hovered item.

### Primary implementation/reference source
- Motion Primitives Dock
- URL: https://github.com/ibelick/motion-primitives/blob/main/app/docs/dock/page.mdx
- Demo: https://motion-primitives.com/docs/dock
- License: **MIT**
- Scope: **CODE_OK**
- Note: Documents magnification/distance/spring values.

### Secondary sources
- **Motion Primitives** — MIT / `CODE_OK`
  - https://github.com/ibelick/motion-primitives
  - Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### DRH implementation target
- Card: One focused control/surface showing the canonical motion in 2–4 seconds.
- Detail: Larger interactive composition with full enter/exit/reverse behavior and visible state changes.
- Interaction: Pointer/keyboard/touch where meaningful; spring/easing values must be explicit.

## 16. Card Stack
- Category: **Motion**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Cards must have visible depth order and swipe/cycle/stack behavior.

### Primary implementation/reference source
- Motion Primitives
- URL: https://github.com/ibelick/motion-primitives
- Demo: https://motion-primitives.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### Secondary sources
- **beUI** — MIT / `CODE_OK`
  - https://github.com/starc007/ui-components
  - Copy-own-code registry; very strong source for Dynamic Island, command palette, notification stack, masonry, etc.

### DRH implementation target
- Card: One focused control/surface showing the canonical motion in 2–4 seconds.
- Detail: Larger interactive composition with full enter/exit/reverse behavior and visible state changes.
- Interaction: Pointer/keyboard/touch where meaningful; spring/easing values must be explicit.

## 17. Stacked Sections
- Category: **Motion**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Sections pin/overlap/scale as scroll progresses; ordinary reveal-on-scroll is insufficient.

### Primary implementation/reference source
- Motion Primitives
- URL: https://github.com/ibelick/motion-primitives
- Demo: https://motion-primitives.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### Secondary sources
- **svelte-gsap-template** — MIT / `CODE_OK`
  - https://github.com/YusufCeng1z/svelte-gsap-template
  - Awwwards-style agency structure; Svelte so use concept/animation logic, not React-specific copying.

### DRH implementation target
- Card: One focused control/surface showing the canonical motion in 2–4 seconds.
- Detail: Larger interactive composition with full enter/exit/reverse behavior and visible state changes.
- Interaction: Pointer/keyboard/touch where meaningful; spring/easing values must be explicit.

## 18. Text Morph
- Category: **Text**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Glyph/word transition should preserve visual continuity, not just crossfade two strings.

### Primary implementation/reference source
- Torph
- URL: https://github.com/lochie/torph
- Demo: https://torph.lochie.me
- License: **MIT**
- Scope: **CODE_OK**
- Note: Dependency-free text morph for React/Vue/Svelte/vanilla.

### Secondary sources
- **Motion Primitives** — MIT / `CODE_OK`
  - https://github.com/ibelick/motion-primitives
  - Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### DRH implementation target
- Card: Short 1–3 word specimen demonstrating the typography motion at a glance.
- Detail: Multiple words/sizes plus controls or pointer area so deformation remains obvious at large scale.
- Interaction: Respect text selection/readability; preserve final accessible text.

## 19. Text Pressure
- Category: **Text**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Per-character width/weight/scale deformation responds to pointer distance or pressure-like field.

### Primary implementation/reference source
- ReactOmega
- URL: https://github.com/Edwson/ReactOmega
- Demo: https://edwson.github.io/ReactOmega/
- License: **VERIFY LICENSE BEFORE COPY**
- Scope: **REFERENCE_UNTIL_VERIFIED**
- Note: Useful discovery for variable-proximity and text-motion concepts; verify exact LICENSE before importing.

### Secondary sources
- **React Bits** — MIT + Commons Clause / `DISCOVERY_ONLY_FOR_DRH_CATALOG`
  - https://www.reactbits.dev/
  - Do not redistribute components as catalog items. Use concept discovery only.

### DRH implementation target
- Card: Short 1–3 word specimen demonstrating the typography motion at a glance.
- Detail: Multiple words/sizes plus controls or pointer area so deformation remains obvious at large scale.
- Interaction: Respect text selection/readability; preserve final accessible text.

## 20. Variable Proximity
- Category: **Text**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Actual variable-font axes change by character as pointer distance changes.

### Primary implementation/reference source
- ReactOmega
- URL: https://github.com/Edwson/ReactOmega
- Demo: https://edwson.github.io/ReactOmega/
- License: **VERIFY LICENSE BEFORE COPY**
- Scope: **REFERENCE_UNTIL_VERIFIED**
- Note: Useful discovery for variable-proximity and text-motion concepts; verify exact LICENSE before importing.

### Secondary sources
- **React Bits** — MIT + Commons Clause / `DISCOVERY_ONLY_FOR_DRH_CATALOG`
  - https://www.reactbits.dev/
  - Do not redistribute components as catalog items. Use concept discovery only.

### DRH implementation target
- Card: Short 1–3 word specimen demonstrating the typography motion at a glance.
- Detail: Multiple words/sizes plus controls or pointer area so deformation remains obvious at large scale.
- Interaction: Respect text selection/readability; preserve final accessible text.

## 21. Split Flap
- Category: **Text**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Each slot must show top/bottom 3D flap mechanics; generic vertical text roll is insufficient.

### Primary implementation/reference source
- splitflap by Cody Shanley
- URL: https://github.com/codemanshan/splitflap
- Demo: https://codyshanley.com/playground/split-flap
- License: **MIT**
- Scope: **CODE_OK**
- Note: Copy-paste-oriented, CSS 3D, reduced-motion, aria-live.

### Secondary sources
- **@daformat/react-split-flap-display** — 0BSD / `CODE_OK`
  - https://github.com/daformat/react-split-flap-display
  - Zero-dependency, headless compound React split-flap with Safari notes.

### DRH implementation target
- Card: Short 1–3 word specimen demonstrating the typography motion at a glance.
- Detail: Multiple words/sizes plus controls or pointer area so deformation remains obvious at large scale.
- Interaction: Respect text selection/readability; preserve final accessible text.

## 22. Vertical Cut Reveal
- Category: **Text**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Text is segmented into visible vertical bands/slices with offset reveal timing.

### Primary implementation/reference source
- design-isms
- URL: https://lidge-jun.github.io/design-isms/
- Demo: https://lidge-jun.github.io/design-isms/
- License: **Unknown/no root license verified**
- Scope: **DISCOVERY_ONLY**
- Note: Taxonomy benchmark only; no code/text/image copying.

### Secondary sources
- **Motion Primitives** — MIT / `CODE_OK`
  - https://github.com/ibelick/motion-primitives
  - Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### DRH implementation target
- Card: Short 1–3 word specimen demonstrating the typography motion at a glance.
- Detail: Multiple words/sizes plus controls or pointer area so deformation remains obvious at large scale.
- Interaction: Respect text selection/readability; preserve final accessible text.

## 23. Progressive Blur
- Category: **Effects**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Blur strength must change spatially through a gradient, not use one constant backdrop-filter.

### Primary implementation/reference source
- progressive-blur
- URL: https://github.com/AndrewPrifer/progressive-blur
- Demo: https://progressive-blur.vercel.app
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct match with radial/linear progressive backdrop blur.

### DRH implementation target
- Card: Single object with strong, cropped effect visibility.
- Detail: Larger surface with enough material/context for the effect to read clearly.
- Interaction: Pointer interaction when it defines the effect; otherwise replayable deterministic loop.

## 24. Gooey Toast
- Category: **Effects**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Toast shell visibly morphs pill↔blob/content while preserving notification semantics.

### Primary implementation/reference source
- goey-toast
- URL: https://github.com/anl331/goey-toast
- Demo: https://goey-toast.vercel.app
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct match; includes Agent Skill, keyboard dismiss, swipe, reduced-ish motion presets and promise states.

### Secondary sources
- **gooey-react** — MIT / `CODE_OK`
  - https://github.com/luukdv/gooey-react
  - Small crisp SVG gooey/metaball primitive; useful for clean-room compositions.

### DRH implementation target
- Card: Single object with strong, cropped effect visibility.
- Detail: Larger surface with enough material/context for the effect to read clearly.
- Interaction: Pointer interaction when it defines the effect; otherwise replayable deterministic loop.

## 25. Cursor Reveal Mask
- Category: **Effects**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **CLEAN_ROOM**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Pointer controls a mask revealing a genuine second visual layer/content state.

### Primary implementation/reference source
- Motion Primitives
- URL: https://github.com/ibelick/motion-primitives
- Demo: https://motion-primitives.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.

### Secondary sources
- **React Bits** — MIT + Commons Clause / `DISCOVERY_ONLY_FOR_DRH_CATALOG`
  - https://www.reactbits.dev/
  - Do not redistribute components as catalog items. Use concept discovery only.

### DRH implementation target
- Card: Single object with strong, cropped effect visibility.
- Detail: Larger surface with enough material/context for the effect to read clearly.
- Interaction: Pointer interaction when it defines the effect; otherwise replayable deterministic loop.

## 26. Sticker Peel
- Category: **Effects**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW-MEDIUM — usable with explicit license/dependency/provenance checks.
- Canonical acceptance: A corner/edge must physically peel with front/back surfaces; simple rotate/scale is insufficient.

### Primary implementation/reference source
- React Peel
- URL: https://github.com/iqbal-rashed/react-peel
- Demo: https://iqbal-rashed.github.io/react-peel/
- License: **MIT wrapper; built on peel.js**
- Scope: **CODE_OK_AFTER_PEELJS_LICENSE_VERIFY**
- Note: Excellent functional reference for peel/reveal/scratch presets; verify underlying peel.js license chain before copying internals.

### Secondary sources
- **React Bits** — MIT + Commons Clause / `DISCOVERY_ONLY_FOR_DRH_CATALOG`
  - https://www.reactbits.dev/
  - Do not redistribute components as catalog items. Use concept discovery only.

### DRH implementation target
- Card: Single object with strong, cropped effect visibility.
- Detail: Larger surface with enough material/context for the effect to read clearly.
- Interaction: Pointer interaction when it defines the effect; otherwise replayable deterministic loop.

## 27. Scratch to Reveal
- Category: **Effects**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW-MEDIUM — usable with explicit license/dependency/provenance checks.
- Canonical acceptance: Pointer erases a cover mask with cumulative progress, not a one-click reveal.

### Primary implementation/reference source
- react-scratchcard-v2
- URL: https://github.com/dopey2/react-scratchcard-v2
- Demo: https://dopey2.github.io/react-scratchcard-v2
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct scratch reveal with regions, reset, revealAll and completion threshold.

### Secondary sources
- **React Peel** — MIT wrapper; built on peel.js / `CODE_OK_AFTER_PEELJS_LICENSE_VERIFY`
  - https://github.com/iqbal-rashed/react-peel
  - Excellent functional reference for peel/reveal/scratch presets; verify underlying peel.js license chain before copying internals.

### DRH implementation target
- Card: Single object with strong, cropped effect visibility.
- Detail: Larger surface with enough material/context for the effect to read clearly.
- Interaction: Pointer interaction when it defines the effect; otherwise replayable deterministic loop.

## 28. Liquid Metal Border
- Category: **Effects**
- Recommended model: **Codex**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Real animated/reflection-like metal rim around a semantic control; not a moving CSS gradient border.

### Primary implementation/reference source
- metal-fx
- URL: https://github.com/Jakubantalik/metal-fx
- Demo: https://metal.jakubantalik.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct canonical animated WebGL liquid-metal border for real semantic controls.

### DRH implementation target
- Card: Single object with strong, cropped effect visibility.
- Detail: Larger surface with enough material/context for the effect to read clearly.
- Interaction: Pointer interaction when it defines the effect; otherwise replayable deterministic loop.

## 29. Bottom Sheet
- Category: **UI Patterns**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Touch drag/snap heights + modal semantics; simple bottom-aligned dialog is insufficient.

### Primary implementation/reference source
- pure-web-bottom-sheet
- URL: https://github.com/viliket/pure-web-bottom-sheet
- Demo: https://viliket.github.io/pure-web-bottom-sheet/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Accessible, scroll-snap based, framework-agnostic, React wrapper, multiple snap points.

### Secondary sources
- **react-modal-sheet** — MIT / `CODE_OK`
  - https://github.com/Temzasse/react-modal-sheet
  - Motion-based flexible bottom sheet; accessibility requires composition with dialog/overlay primitives.

### DRH implementation target
- Card: Mini app mock demonstrating trigger + active state, not a decorative placeholder.
- Detail: Full interaction path with keyboard/touch semantics, error/close state and responsive behavior.
- Interaction: Accessible semantic controls, focus management and reduced motion.

## 30. Command Palette
- Category: **UI Patterns**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW-MEDIUM — usable with explicit license/dependency/provenance checks.
- Canonical acceptance: Keyboard-first searchable action surface with groups, shortcuts and active-row behavior.

### Primary implementation/reference source
- beUI Command Palette
- URL: https://github.com/starc007/ui-components/blob/main/AGENTS.md
- Demo: https://beui.dev/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Repository explicitly lists a ⌘K palette with fuzzy filter and animated active row.

### Secondary sources
- **shadcn Command** — MIT ecosystem; check cmdk package license / `CODE_OK_WITH_DEP_LICENSE`
  - https://ui.shadcn.com/docs/components/base/command
  - Strong canonical command palette composition.

### DRH implementation target
- Card: Mini app mock demonstrating trigger + active state, not a decorative placeholder.
- Detail: Full interaction path with keyboard/touch semantics, error/close state and responsive behavior.
- Interaction: Accessible semantic controls, focus management and reduced motion.

## 31. Toast Notification
- Category: **UI Patterns**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Non-blocking live-region notification with lifecycle/stacking/dismiss behavior.

### Primary implementation/reference source
- react-hot-toast
- URL: https://github.com/timolins/react-hot-toast
- Demo: https://react-hot-toast.com/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Accessible headless/customizable toast reference.

### Secondary sources
- **beUI** — MIT / `CODE_OK`
  - https://github.com/starc007/ui-components
  - Copy-own-code registry; very strong source for Dynamic Island, command palette, notification stack, masonry, etc.

### DRH implementation target
- Card: Mini app mock demonstrating trigger + active state, not a decorative placeholder.
- Detail: Full interaction path with keyboard/touch semantics, error/close state and responsive behavior.
- Interaction: Accessible semantic controls, focus management and reduced motion.

## 32. Skeleton Loading
- Category: **UI Patterns**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Placeholders preserve target layout and communicate loading; spinner-only is insufficient.

### Primary implementation/reference source
- react-loading-skeleton
- URL: https://github.com/dvtng/react-loading-skeleton
- Demo: https://www.npmjs.com/package/react-loading-skeleton
- License: **MIT**
- Scope: **CODE_OK**
- Note: Canonical adaptive skeleton loading implementation.

### Secondary sources
- **auto-skeleton-react** — MIT / `CODE_OK`
  - https://github.com/ShanukJ/auto-skeleton
  - DOM-inspection approach; useful as contrast, not necessarily desired DRH canonical implementation.

### DRH implementation target
- Card: Mini app mock demonstrating trigger + active state, not a decorative placeholder.
- Detail: Full interaction path with keyboard/touch semantics, error/close state and responsive behavior.
- Interaction: Accessible semantic controls, focus management and reduced motion.

## 33. Segmented Control
- Category: **UI Patterns**
- Recommended model: **Claude Sonnet 4.6**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Mutually exclusive compact options with a clear active indicator and keyboard behavior.

### Primary implementation/reference source
- @rc-component/segmented
- URL: https://github.com/react-component/segmented
- Demo: https://react-component.github.io/segmented
- License: **MIT**
- Scope: **CODE_OK**
- Note: Canonical accessible segmented control with keyboard/RTL/vertical support.

### Secondary sources
- **beUI** — MIT / `CODE_OK`
  - https://github.com/starc007/ui-components
  - Copy-own-code registry; very strong source for Dynamic Island, command palette, notification stack, masonry, etc.

### DRH implementation target
- Card: Mini app mock demonstrating trigger + active state, not a decorative placeholder.
- Detail: Full interaction path with keyboard/touch semantics, error/close state and responsive behavior.
- Interaction: Accessible semantic controls, focus management and reduced motion.

## 34. Interactive Hero
- Category: **Sections**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **COMPOSE_FROM_PERMISSIVE_PATTERNS**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Hero's main proof responds to pointer/scroll/input; decorative autoplay alone is insufficient.

### Primary implementation/reference source
- modern-agency
- URL: https://github.com/FavourAkpasi/modern-agency
- Demo: https://modern-agency-phi.vercel.app
- License: **MIT**
- Scope: **CODE_OK**
- Note: Neo-brutalist agency landing with GSAP hero + Motion project grid.

### Secondary sources
- **Agency Website v2** — No license verified / `REFERENCE_ONLY`
  - https://github.com/Shatlyk1011/agency-website
  - Use only as visual/fidelity benchmark: GSAP, Motion, Lenis, WebGL smoke cursor.
- **Framer Marketplace** — Per-item / marketplace terms / `DISCOVERY_ONLY`
  - https://www.framer.com/marketplace/templates/
  - Use layout/style trend discovery only.

### DRH implementation target
- Card: Scaled section composition with enough hierarchy to recognize the pattern.
- Detail: Near-real landing section with realistic content density and responsive layout.
- Interaction: Use meaningful section interaction rather than generic hover everywhere.

## 35. Masonry Showcase
- Category: **Sections**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **PERMISSIVE_ADAPT_OR_HUB_ORIGINAL**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: True variable-height packing/lanes; equal-height CSS grid is not masonry.

### Primary implementation/reference source
- beUI Infinite Masonry
- URL: https://github.com/starc007/ui-components/blob/main/AGENTS.md
- Demo: https://beui.dev/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Repository documents measured variable-height cards, automatic lanes and virtualized infinite loading.

### Secondary sources
- **Framer Marketplace** — Per-item / marketplace terms / `DISCOVERY_ONLY`
  - https://www.framer.com/marketplace/templates/
  - Use layout/style trend discovery only.

### DRH implementation target
- Card: Scaled section composition with enough hierarchy to recognize the pattern.
- Detail: Near-real landing section with realistic content density and responsive layout.
- Interaction: Use meaningful section interaction rather than generic hover everywhere.

## 36. Animated Feature Showcase
- Category: **Sections**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **COMPOSE_FROM_PERMISSIVE_PATTERNS**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Feature copy and product visual stay synchronized as selected/scroll state changes.

### Primary implementation/reference source
- beUI
- URL: https://github.com/starc007/ui-components
- Demo: https://beui.dev/
- License: **MIT**
- Scope: **CODE_OK**
- Note: Copy-own-code registry; very strong source for Dynamic Island, command palette, notification stack, masonry, etc.

### Secondary sources
- **Motion Primitives** — MIT / `CODE_OK`
  - https://github.com/ibelick/motion-primitives
  - Strong canonical source for Morphing Dialog, Dock, Text Morph and related motion primitives.
- **Framer Marketplace** — Per-item / marketplace terms / `DISCOVERY_ONLY`
  - https://www.framer.com/marketplace/templates/
  - Use layout/style trend discovery only.

### DRH implementation target
- Card: Scaled section composition with enough hierarchy to recognize the pattern.
- Detail: Near-real landing section with realistic content density and responsive layout.
- Interaction: Use meaningful section interaction rather than generic hover everywhere.

## 37. Interactive Product Demo
- Category: **Sections**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **ADAPT_ARCHITECTURE_NOT_BRAND_ASSETS**
- Legal risk: LOW — primary implementation source is permissive, subject to normal asset/dependency checks.
- Canonical acceptance: Clickable walkthrough with states/hotspots/progression, not a video or static screenshot.

### Primary implementation/reference source
- Spotlane
- URL: https://github.com/headlessButSmart/spotlane
- Demo: https://spotlane.dev
- License: **MIT**
- Scope: **CODE_OK**
- Note: Direct open-source interactive product walkthrough/editor/player reference.

### DRH implementation target
- Card: Scaled section composition with enough hierarchy to recognize the pattern.
- Detail: Near-real landing section with realistic content density and responsive layout.
- Interaction: Use meaningful section interaction rather than generic hover everywhere.

## 38. AI Chat / Agent Workspace
- Category: **Pages**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **ADAPT_ARCHITECTURE_NOT_BRAND_ASSETS**
- Legal risk: LOW-MEDIUM — usable with explicit license/dependency/provenance checks.
- Canonical acceptance: Thread + composer + streaming + tool/reasoning/artifact/approval states in a coherent workspace.

### Primary implementation/reference source
- Vercel AI Elements
- URL: https://github.com/vercel/ai-elements
- Demo: https://elements.ai-sdk.dev/
- License: **MIT (verify current LICENSE at import)**
- Scope: **CODE_OK_AFTER_CURRENT_LICENSE_CHECK**
- Note: Excellent AI-native UI catalog: messages, conversation, code, reasoning, tool calls.

### Secondary sources
- **assistant-ui** — Open source; verify current repo LICENSE before copy / `CODE_OK_AFTER_CURRENT_LICENSE_CHECK`
  - https://github.com/assistant-ui/assistant-ui
  - Production-grade chat thread/composer/streaming/accessibility benchmark.
- **assistant-ui Tool UI** — MIT / `CODE_OK`
  - https://github.com/assistant-ui/tool-ui
  - Copy/paste UI for tool calls in agent chat.
- **shadcn chatbot-template** — MIT / `CODE_OK`
  - https://github.com/shadcn-ui/chatbot-template
  - Strong concrete page architecture for typed streaming parts, tools, sources and question cards.

### DRH implementation target
- Card: Mini full-page composition showing the page's distinctive structure.
- Detail: Scrollable, multi-section working page preview with realistic hierarchy.
- Interaction: Representative navigation/filter/CTA interaction; not every app behavior is required.

## 39. Agency Landing
- Category: **Pages**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **COMPOSE_FROM_PERMISSIVE_PATTERNS**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Case-study-led creative composition with strong motion language and project storytelling.

### Primary implementation/reference source
- Agency Website v2
- URL: https://github.com/Shatlyk1011/agency-website
- Demo: https://agency-website-v2.vercel.app/
- License: **No license verified**
- Scope: **REFERENCE_ONLY**
- Note: Use only as visual/fidelity benchmark: GSAP, Motion, Lenis, WebGL smoke cursor.

### Secondary sources
- **modern-agency** — MIT / `CODE_OK`
  - https://github.com/FavourAkpasi/modern-agency
  - Neo-brutalist agency landing with GSAP hero + Motion project grid.
- **svelte-gsap-template** — MIT / `CODE_OK`
  - https://github.com/YusufCeng1z/svelte-gsap-template
  - Awwwards-style agency structure; Svelte so use concept/animation logic, not React-specific copying.
- **Framer Marketplace — Agency/Templates** — Per item / `DISCOVERY_ONLY`
  - https://www.framer.com/marketplace/templates/
  - Use current trend/section taxonomy, not assets/templates.

### DRH implementation target
- Card: Mini full-page composition showing the page's distinctive structure.
- Detail: Scrollable, multi-section working page preview with realistic hierarchy.
- Interaction: Representative navigation/filter/CTA interaction; not every app behavior is required.

## 40. Ecommerce Product Landing
- Category: **Pages**
- Recommended model: **Gemini 3.1 Pro High**
- Implementation decision: **COMPOSE_FROM_PERMISSIVE_PATTERNS**
- Legal risk: MEDIUM — at least one discovery/reference-only source; only use verified permissive source or clean-room implementation.
- Canonical acceptance: Gallery/variants/buy controls/proof/product information must form a believable conversion path.

### Primary implementation/reference source
- E-Commerce Template
- URL: https://github.com/bhaumikpatel/E-Commerce-Template
- Demo: https://e-commerce-template.surge.sh/
- License: **MIT code; docs CC**
- Scope: **CODE_OK**
- Note: Broad ecommerce flow coverage including product detail/cart/checkout.

### Secondary sources
- **Ecommerce Tailwind React template** — MIT / `CODE_OK`
  - https://github.com/WindingSnow/Ecommerce-Tailwind-template
  - Simple single-page ecommerce landing with add-to-cart; useful structure source.
- **Framer Marketplace** — Per-item / marketplace terms / `DISCOVERY_ONLY`
  - https://www.framer.com/marketplace/templates/
  - Use layout/style trend discovery only.

### DRH implementation target
- Card: Mini full-page composition showing the page's distinctive structure.
- Detail: Scrollable, multi-section working page preview with realistic hierarchy.
- Interaction: Representative navigation/filter/CTA interaction; not every app behavior is required.
