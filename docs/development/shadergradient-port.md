# ShaderGradient Landing Port Notes — V1.2

## Why this file exists

The V1.1 landing drifted too far from the visual rhythm that originally motivated the project. V1.2 intentionally stops "designing something inspired by ShaderGradient" and instead ports the recognizable landing composition into the Design Reference Hub while keeping the Hub's own product content.

## Upstream sources

### Renderer + official presets

- Project: ShaderGradient
- Repository: https://github.com/ruucm/shadergradient
- Package: `@shadergradient/react`
- License: MIT
- Upstream preset file: `packages/shadergradient/src/presets.ts`

V1.2 stores the 10 upstream preset configurations in:

```text
src/data/shaderPresets.ts
```

The preset names are:

```text
Halo
Pensive
Mint
Interstella
Nighty night
Viola
Universe
Sunset
Mandarin
Cotton Candy
```

Do not replace these with visually similar hand-authored configurations unless the product owner explicitly asks for a custom preset set.

### Landing composition reference

- Project: `siavava/shadergradient-vue`
- Repository: https://github.com/siavava/shadergradient-vue
- License: MIT
- README states that `apps/web` reproduces the `shadergradient.co` experience.

The following upstream Vue components were used as structural references and reimplemented in React rather than copied verbatim:

```text
HeroSection.vue
GallerySection.vue
MarketingSection.vue
BrowserMockup.vue
InteractionCards.vue
ExportPanelMockup.vue
reveal.ts
LandingPage.vue
```

## React mapping in this repository

```text
src/components/landing/LandingHero.tsx
src/components/landing/PresetGallery.tsx
src/components/landing/MarketingSection.tsx
src/components/landing/BrowserMockup.tsx
src/components/landing/InteractionCards.tsx
src/components/landing/AgentExportPanel.tsx
src/components/landing/Reveal.tsx
```

## Current landing order

```text
1. 100svh ShaderGradient Hero
   - official preset cycler
   - short product explanation
   - bottom glass tool dock

2. Black 3-column live preset gallery
   - all 10 official presets
   - IntersectionObserver stagger reveal
   - gallery shaders virtualized near viewport

3. Marketing section: live references
   - browser mockup
   - Mandarin ShaderGradient

4. Marketing section: interaction
   - randomizable Universe colors
   - hover card
   - phone motion card

5. Marketing section: Coding Agent handoff
   - Mint ShaderGradient
   - Prompt / Code / DESIGN.md metaphor

6. Design Reference Hub native browsing sections
   - categories
   - featured live demos
   - collections
```

## Important implementation rule

The landing page is allowed to visually echo ShaderGradient because the renderer and the reference port are MIT licensed, but the Design Reference Hub must remain a distinct product:

- Hub-specific wording and navigation
- Hub-specific collections and reference dataset
- source/license visibility
- Korean-first explanatory UI
- no claim that Design Reference Hub is ShaderGradient or its official fork

## WebGL context protection

The live gallery contains many ShaderGradient canvases. Browsers enforce a finite number of simultaneous WebGL contexts.

`ShaderBackdrop` therefore uses viewport virtualization:

```text
near viewport  -> mount actual WebGL canvas
off viewport   -> unmount WebGL and show CSS fallback
```

Hero rendering is not virtualized. Compact previews are virtualized by default.

This behavior is intentional. Do not remove it merely because `ShaderGradientCanvas` supports lazy initialization: lazy initialization alone may still leave many contexts alive after the user scrolls through the full page.
