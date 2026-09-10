# Codex — DRH Post-V1.7 High-Fidelity Batch

Run after V1.7 is merged.

Read:
- IMPLEMENTATION_SOURCE_MAP_40.json
- LICENSE_MATRIX_40.md

Work in small groups. Do NOT attempt all shader engines in one token window.

Group A:
- Boids Ecosystem
- Topography Contours
- Voronoi Field

Group B:
- Ferrofluid Surface
- Liquid Chrome
- Caustics
- Dither Field
- Liquid Metal Border

For Topography/Voronoi/Boids/Caustics/Liquid Metal Border, mapped permissive sources exist.
If adapting:
- pin commit
- preserve notices
- document exact adapted portions

For Ferrofluid/Dither:
clean-room implementation is preferred because discovery sources may restrict catalog redistribution.

All engines:
- dedicated key
- card/detail budgets
- deterministic QA
- offscreen pause
- DPR cap
- reduced motion
- context-loss fallback if WebGL
- cleanup
- offline standalone HTML parity
- engine tests
- no generic recipe alias

Only mark Working after real Card + Detail browser QA.

Commit per group rather than one giant commit.
