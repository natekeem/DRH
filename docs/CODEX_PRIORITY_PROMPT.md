# Codex priority package — design fidelity / hard implementation work

You are the senior frontend engineer responsible for visual fidelity and complex Live Demos in `design-reference-hub`.

Read first:
- `docs/PROJECT_BRIEF.md`
- `docs/USER_ADJUSTMENTS_V1_3.md`
- `docs/SHADERGRADIENT_PORT.md`
- `docs/SOURCE_LICENSE_POLICY.md`
- `docs/LIVE_DEMO_BACKLOG.md`
- `docs/DEMO_IMPLEMENTATION_GUIDE.md`

## Product principle
Browse → See → Pick → Copy → Vibe Coding.
The user must be able to visually recognize an effect without knowing its name, open it, then copy enough implementation context that even a weaker coding agent can reproduce it.

## Preserve before changing
- V1.3 ShaderGradient landing structure.
- 00 Halo hero + compact 01–09 official preset 3×3 grid.
- Korean explanatory UI + English canonical design/effect names.
- Source/license provenance.
- Reference detail `Agent Package` workflow.

## P0 — visual QA and demo truthfulness
Run the app in a real browser and inspect every V1.3 reference card/detail.
For each reference:
1. Confirm the visible effect actually communicates the named pattern.
2. Confirm pointer/hover/click/scroll interaction works.
3. Confirm card and detail preview do not clip or look blank.
4. Confirm reduced-motion/mobile fallback.
5. Update demo maturity only after verification:
   - OFFICIAL LIVE = actual official/upstream permissively licensed implementation integrated.
   - WORKING DEMO = strong Hub implementation that demonstrates the behavior.
   - PROTOTYPE = simplified approximation.
   - LINK ONLY = external reference only.
Never label a weak approximation as Working/Official just because it renders.

## P0 — Liquid & Glass collection
The user specifically reports that some current Liquid & Glass effects are visually too weak or unclear.
Polish these first:
- Liquid Glass
- Glassmorphism
- Glass Card
- Liquid Lens Effect
- Spotlight Card
- Shader Gradient
Requirements:
- make blur/refraction/highlight/depth obvious at card size
- avoid merely placing a translucent rectangle on a flat background
- include pointer/light response where the pattern requires it
- keep text readable
- use actual upstream permissive implementation when available and appropriate

## P1 — high-impact Live Demo fidelity
Prioritize complex effects that benefit most from Codex engineering:
- fluid/smoke cursor or flowmap distortion
- RGB lens reveal
- true WebGL liquid/refraction lens
- metaballs
- interactive dot/grid/particles
- 3D wave/grid when added
- image trail
- parallax / sticky story / horizontal scroll
- text reveal / split / scramble / dissolve/destruction when added

For upstream OSS:
- inspect repository/LICENSE first
- adapt real logic where license allows
- preserve attribution and license comments
- do not copy Custom/Commons-Clause/restricted marketplace source

## P1 — Agent Package fidelity
For each demo Codex upgrades:
also upgrade the corresponding implementation package so a weaker internal LLM can reproduce it.
Include:
- exact DOM/component structure
- dependencies and install commands
- key CSS/JS/React code
- pointer/scroll math where relevant
- animation timing/easing
- responsive/reduced-motion handling
- original source/repository/license
- acceptance tests
If useful, provide a standalone `index.html` sample or downloadable source package.

## P2 — architecture after visual correctness
Only after P0/P1:
- split the large DemoRenderer into maintainable per-demo modules/registry if this can be done without changing appearance
- add automated route/data integrity checks
- add Playwright smoke tests and screenshot/visual checks for selected priority references
- optimize WebGL context/resource lifecycle

## Do not
- redesign the site into a generic dashboard
- replace live demos with screenshots
- remove attribution/license evidence
- introduce new animation just for decoration
- spend time rewriting already-working simple metadata that Antigravity can handle

## Completion report
Return:
1. visual issues found/fixed
2. demos promoted/demoted by maturity
3. upstream sources actually integrated
4. Agent Packages upgraded
5. remaining prototypes in priority order
6. build/test results
