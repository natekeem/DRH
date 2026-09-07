# Build Verification — V1.2

## Completed in the generation environment

- **27** TS/TSX source files parsed with the TypeScript compiler API.
- Syntax diagnostics: **0**.
- CSS brace balance: **890 opening / 890 closing**.
- `src/data/source-map.json`:
  - declared `source_count`: **182**
  - actual `sources.length`: **182**
- Official ShaderGradient preset count: **10**.
- Hard-coded V1.2 Reference destination `shader-gradient` exists in `src/data/references.ts`.
- Collection routes still target `id={collection.id}` sections.
- GitHub Pages workflow, `HashRouter`, and Vite relative `base` remain included.

## V1.2 structural verification

Landing now follows this path:

```text
LandingHero
→ PresetGallery
→ MarketingSection / BrowserMockup
→ MarketingSection / InteractionCards
→ MarketingSection / AgentExportPanel
→ native Design Reference Hub categories
```

The previous V1.1 custom five-preset hero is no longer the active Home implementation.

## WebGL protection

Compact ShaderGradient previews only mount their WebGL canvas when near the viewport. Off-screen previews fall back to CSS gradients and release the context.

This prevents the 10-preset gallery + marketing previews + Hub cards from needlessly keeping too many WebGL contexts alive.

## Environment limitation

The generation container cannot resolve `registry.npmjs.org`, so dependencies could not be installed and the actual Vite production bundle could not be produced here.

The first check on a normal workstation or GitHub Actions runner remains:

```bash
npm install
npm run build
npm run dev
```

The current upstream ShaderGradient README documents React 18/19 support and a matching React Three Fiber major; this repository intentionally stays on React 18 + R3F 8.x.

## Visual QA checklist

- [ ] Hero resembles the ShaderGradient landing rhythm: full-viewport moving gradient, centered preset cycler, concise tagline, bottom dock.
- [ ] Hero starts on official `00 Halo`.
- [ ] Hero preset arrows cycle all 10 official presets.
- [ ] Scrolling immediately reaches a black 3-column live preset gallery.
- [ ] Gallery rows reveal with staggered fade/lift/blur motion.
- [ ] Only near-viewport shader tiles keep live WebGL contexts.
- [ ] Browser mockup uses a live Mandarin gradient.
- [ ] Randomize button visibly changes the interaction ShaderGradient colors.
- [ ] Agent panel Copy Prompt works on HTTPS/localhost clipboard contexts.
- [ ] Site header appears after leaving most of the hero.
- [ ] Gallery card Demo controls work without triggering Detail navigation.
- [ ] Detail metadata/title links navigate and scroll to top.
- [ ] Collection hash links scroll to the requested collection.
- [ ] Chrome + Edge desktop.
- [ ] One mobile viewport.
- [ ] `prefers-reduced-motion: reduce`.
- [ ] WebGL-disabled fallback.
