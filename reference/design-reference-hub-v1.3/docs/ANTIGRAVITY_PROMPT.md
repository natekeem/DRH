# Antigravity work package — token-efficient / low-risk tasks

You are working in the `design-reference-hub` repository. Read these first:
- `docs/PROJECT_BRIEF.md`
- `docs/USER_ADJUSTMENTS_V1_3.md`
- `docs/SOURCE_LICENSE_POLICY.md`
- `docs/REFERENCE_SCHEMA.md`
- `docs/CODEX_HANDOFF.md`

## Hard rule
Do **not** redesign the hero, global visual identity, ShaderGradient landing rhythm, or complex WebGL/motion demos. Do not make subjective visual changes unless explicitly requested. Preserve existing design.

## Task A — repository QA and easy fixes (best for a fast model)
1. Run install/typecheck/build in a network-enabled environment.
2. Fix only deterministic build/type errors and clearly broken internal links.
3. Verify every `/reference/:id`, category link, collection anchor and source URL field.
4. Detect duplicate IDs, missing collection IDs, empty source/license evidence, and invalid external URLs.
5. Do not replace valid routes or visual components with placeholders.
6. Report all fixes and unresolved issues.

## Task B — Korean/English consistency (best for a fast model)
Use Korean for:
- explanatory copy
- onboarding/help text
- filter/result/empty-state copy
- provenance/license explanations
Use English for:
- canonical design/effect names (Glassmorphism, Image Trail, Shader Gradient...)
- code, package names, API names, tags, license identifiers
- technical implementation terminology where translation reduces searchability
Check all pages for awkward mixed-language strings and make only copy-level fixes.

## Task C — reference metadata enrichment (use Gemini 3.1 Pro High rather than a fast model)
For references whose Agent Package still contains a generic starter:
1. Research only the already-listed source/repository; do not invent a new source.
2. Improve the implementation contract with:
   - exact visual hierarchy
   - interaction triggers
   - timing/easing guidance
   - mobile fallback
   - reduced-motion behavior
   - dependencies
   - source/repository/license evidence
   - acceptance criteria
3. Add useful starter logic only when technically confident.
4. Never copy restricted/custom-license source into the repository.
5. For permissive MIT/Apache/BSD source, preserve attribution/comments.
6. Do not mark a demo `OFFICIAL LIVE` unless the actual official implementation is integrated.

## Task D — source table maintenance
1. Keep Framer Marketplace Templates/Assets as 🟡 Reference-only under current Framer Community terms.
2. Do not download/rehost Framer Free Content or marketplace screenshots as Hub-owned assets.
3. Flag README-vs-LICENSE conflicts rather than resolving them by guess.

## Output
- Make small focused commits/patches.
- At the end provide: files changed, checks run, broken links fixed, metadata entries enriched, items intentionally left for Codex.
