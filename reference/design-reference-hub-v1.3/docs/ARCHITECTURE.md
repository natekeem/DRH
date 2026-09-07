# Architecture

## Goal

Keep the Web Hub and future agent integration on one source of truth. The browser experience is a visual renderer over reference metadata; future SKILL/MCP/registry outputs should consume the same records rather than maintain a second catalog.

## Main data flow

```text
references.ts ─┬─> Home featured sets
               ├─> Explore filters/search
               ├─> Reference detail
               ├─> Collections
               └─> future agent exporter

reference.demo ───> DemoRenderer ───> card + detail live preview

source-map.json ──> Sources page / license evidence index
```

## Routing

HashRouter is intentional. GitHub Pages does not provide arbitrary SPA route rewrites on project Pages. URLs therefore look like:

```text
/#/explore
/#/reference/shader-gradient
/#/collections
/#/sources
```

If the site later moves behind an internal Nginx SPA fallback, BrowserRouter can be considered, but it is not required.

## Rendering strategy

- Static client application; no server or database in V1.
- Reference data is bundled with the app.
- ShaderGradient is the heaviest dependency and should remain limited to the hero and dedicated shader preview.
- Most demos are Hub-original React/CSS so the catalog is not forced to ship dozens of third-party runtimes.
- Interaction demos share a stage system and are safe to render in both cards and full detail views.

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
