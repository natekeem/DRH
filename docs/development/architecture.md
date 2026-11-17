# Architecture

## Goal

Keep the Web Hub and future agent integration on one source of truth. The browser experience is a visual renderer over reference metadata; future SKILL/MCP/registry outputs should consume the same records rather than maintain a second catalog.

## Main data flow

```text
references.ts ─┬─> Home featured sets
               ├─> Explore filters/search
               ├─> Reference detail
               ├─> Collections
               └─> Agent Package and copy/download artifacts

reference.demo ───> DemoRenderer ───> card + detail live preview

source-map.json ──> Sources page / license evidence index
```

The [demo renderer](../../src/components/demos/DemoRenderer.tsx) selects the preview for a demo key. [Recipes](../../src/lib/demos/recipes.ts) serve the same HTML, CSS and behavior to preview iframes and standalone HTML exports. Native WebGL demos share an engine with their standalone exports. [The artifact resolver](../../src/lib/artifacts.ts) exposes only the export formats available for each reference.

Vendor DESIGN.md files are under [public/vendor](../../public/vendor/), with generated full specs under [public/brand-design-specs](../../public/brand-design-specs/). The [ingestion instructions](../sources/awesome-design-md-ingestion.md) describe the pinned sync. Brand identifiers use separate [asset provenance](../../src/data/brandVerifiedAssets.json).

## Routing

HashRouter is intentional. GitHub Pages does not provide arbitrary SPA route rewrites on project Pages. URLs therefore look like:

```text
/#/explore
/#/reference/shader-gradient
/#/explore?view=collections
/#/guides
/#/sources
```

The earlier `#/collections` path redirects to the collection view. [Guide Routes](guide-routes.md) lists guide sources and heading URLs.

## Rendering strategy

- Vite builds a static client application. GitHub Pages serves its output.
- Reference data is bundled with the app.
- ShaderGradient is the heaviest dependency and should remain limited to the hero and dedicated shader preview.
- Original demos use shared recipe definitions or native React components. Offscreen previews unmount to release their resources.

## Performance rules

1. Avoid importing a unique animation library for a single card unless the technique cannot be reproduced responsibly.
2. Prefer CSS transforms/opacity over layout properties.
3. Canvas/WebGL should respect `prefers-reduced-motion`.
4. Pointer-specific interactions need a coarse-pointer fallback.
5. Do not autoplay large videos on the gallery grid.
6. If reference count passes ~300, split data by category and lazy-load category chunks.
7. If WebGL demos grow substantially, isolate them with dynamic imports.

## Future extension

```text
dataset
 ├── web renderer
 ├── static JSON export
 ├── SKILL.md generator
 ├── shadcn-style registry metadata
 └── MCP search/read tools
```
