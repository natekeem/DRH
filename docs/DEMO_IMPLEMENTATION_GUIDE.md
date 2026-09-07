# Live Demo Implementation Guide

## Why the demo registry matters

A reference card and its detail page must render the same behavior. Avoid duplicating demo markup between pages.

```text
reference.demo = "image-trail"
        ↓
DemoRenderer(kind="image-trail")
        ├── gallery card
        └── detail stage
```

## Add a demo

1. Add metadata in `src/data/references.ts`.
2. Reuse an existing demo key if the visual behavior is genuinely the same.
3. Otherwise add a new branch/component in `src/components/demos/DemoRenderer.tsx`.
4. Add styles in `src/styles.css` or split into a dedicated CSS module once the renderer exceeds comfortable size.
5. Test card size ~230 px and detail size 440–720 px.
6. Test keyboard/touch/reduced motion as applicable.
7. Record source/license evidence before marking `copy-ok`.

## Demo classes

### Tier A — Native OSS
Use the upstream runtime because the live behavior itself is the point and the license is permissive.

Current example: ShaderGradient.

### Tier B — Hub-original implementation
Recreate a generic technique from first principles without copying restricted source. This is preferred for common visual concepts such as hover lift, spotlight, RGB reveal and cursor trail.

### Tier C — External reference
If the experience is inseparable from restricted source/assets, do not embed or mirror it. Show a neutral Hub preview and link to the original. Mark the reference as `reference`.

## Mobile behavior

- Cursor trails: static composition or disabled
- Magnetic buttons: normal button
- Hover-only states: make the card meaningful without hover
- Comparison sliders: touch input remains supported
- Large WebGL: lower pixel density

## Reduced motion

The global CSS collapses animation duration, while high-cost components should also check `useReducedMotion()` and render an intentional static state.

## Performance budget guidance

For the gallery:
- Prefer < 1 ms/frame CSS work per visible card
- Avoid one canvas loop per card if many are visible; consolidate or only activate on intersection
- WebGL canvases should be rare in the grid
- Consider `IntersectionObserver` activation for future complex demos
