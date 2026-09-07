# Build Verification

## Completed in the generation environment

- 17 TS/TSX implementation files were parsed with the TypeScript compiler API.
- Result: **0 syntax diagnostics**.
- Every literal reference demo key was checked against `DemoRenderer`.
- Result: **0 missing demo handlers** (Sections/Pages/DESIGN.md use intentional prefix dispatch).
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
- [ ] `npm run dev` and visually inspect Home / Explore / 5 representative details / Sources
- [ ] Chrome + Edge at desktop width
- [ ] one mobile viewport
- [ ] `prefers-reduced-motion: reduce`
- [ ] verify ShaderGradient WebGL render and fallback
- [ ] verify clipboard copy on HTTPS Pages URL
- [ ] confirm GitHub Pages access model is appropriate for internal content
