# Agent Instructions for Design Reference Hub (DRH)

When working in this repository, follow these core rules:

1. **Read `docs/REFERENCE_QUALITY_STANDARD.md` first.** This is the canonical quality contract for all references.
2. **New References must pass the Quality Contract.** Ensure visual identity, responsive/motion support, and interaction completeness.
3. **Do not arbitrarily promote Prototypes.** A `PROTOTYPE` must only be upgraded to `WORKING` if it fully satisfies the quality criteria.
4. **No unauthorized code imports.** Do not import source code without clear, verified permissive license evidence.
5. **No fake React artifacts.** Do not present a React `iframe` wrapper around HTML as a native React artifact.
6. **Maintain Artifact parity.** Preview, HTML, CSS, React, and Agent packages must reflect the exact same implementation details and behavior.
7. **Run audits before completion.** Run `npm run audit:references` and all existing audits (`npm run build`, `npm run typecheck`, etc.).
8. **No visual PASS without Browser QA.** Do not declare a demo as passing visual tests without actually validating responsive behavior, interaction, and reduced motion in a browser.
