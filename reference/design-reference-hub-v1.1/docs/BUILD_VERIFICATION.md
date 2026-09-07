# Build Verification

## Completed in the generation environment

- 20 TS/TSX implementation files were parsed with the TypeScript compiler API after the V1.1 polish pass.
- Result: **0 syntax diagnostics**.
- Existing demo-registry coverage from V1 is retained; the polish pass changed routing, localization and Hero composition rather than removing demo handlers.
- Internal route-root audit found no unexpected hard-coded route roots.
- Collection reference IDs were checked for missing targets.
- CSS brace balance checked.
- Result: **balanced**.
- GitHub Pages workflow, `HashRouter`, and Vite relative `base` are included.

## Environment limitation

The generation container could not resolve `registry.npmjs.org` (DNS failure), so third-party npm dependencies could not be installed and a full Vite production build could not be executed in that environment.

This is not being hidden: the first command on any normal networked workstation or GitHub Actions runner should be:

```bash
npm install
npm run build
```

If a third-party package has changed its peer constraints, preserve the smallest compatible version matrix. In particular, ShaderGradient upstream currently documents React 18/19 support with a matching React Three Fiber major.

## Before internal launch

- [ ] `npm install`
- [ ] `npm run build`
- [ ] `npm run dev` and visually inspect Home / Explore / 5 representative details / Collections / Sources
- [ ] verify Hero shows broad moving gradients rather than a displaced “crumpled sheet” look
- [ ] verify card Demo buttons/range inputs work without forcing navigation
- [ ] verify card metadata/title opens the Detail route and route change scrolls to top
- [ ] verify Collection links scroll to the requested collection section
- [ ] Chrome + Edge at desktop width
- [ ] one mobile viewport
- [ ] `prefers-reduced-motion: reduce`
- [ ] verify ShaderGradient WebGL render and fallback
- [ ] verify clipboard copy on HTTPS Pages URL
- [ ] confirm GitHub Pages access model is appropriate for internal content
