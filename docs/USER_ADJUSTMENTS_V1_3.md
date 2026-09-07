# V1.3 User Adjustments

Reviewed: 2026-09-07

## Requested changes and status

1. **Demo 상태를 구분할 수 있어야 함** — DONE in V1.3 infrastructure
   - `OFFICIAL LIVE`: official/open-source implementation is actually executed in the Hub.
   - `WORKING DEMO`: Hub implementation is interactive and usable.
   - `PROTOTYPE`: visual concept demo; not guaranteed 1:1 with an upstream implementation.
   - `LINK ONLY`: source/reference only.
   - Cards and detail pages now expose the status.

2. **약한 사내 Code Agent를 위한 상세 Prompt + 실제 로직/코드/Source 묶음** — DONE in V1.3 infrastructure, CONTENT ENRICHMENT CONTINUES
   - Every detail page exposes an `AGENT PACKAGE` containing goal, visual behavior, constraints, dependencies, source/repository/license, starter logic, acceptance criteria.
   - Package can be copied or downloaded as `.md`.
   - Page/Section references can also download a starter `index.html`.
   - Important demos have hand-written starter code/logic. Generic prototype entries still need Codex/Gemini enrichment over time.

3. **ShaderGradient official presets 00–09** — DONE
   - 00 Halo stays in the hero.
   - 01–09 appear as a compact 3×3 desktop live grid.

4. **Footer cleanup** — DONE
   - Brand / description+provenance / navigation are aligned in three logical groups.

5. **Sticky header/content overlap** — DONE
   - Header and sticky listing/search surfaces use stronger translucent background, blur and a subtle fade/shadow to separate scrolled content.

6. **Reference detail provenance** — DONE
   - Each detail page explains whether it is Hub-original or based on an external source and exposes original/repository/license-evidence links when known.

7. **Framer Marketplace free templates/assets** — REVIEWED
   - Added to Source Map as 🟡 Reference candidates.
   - Framer Free Content may be used/modified in projects but may not be redistributed/reposted as standalone assets or offered on competing repositories/platforms under the current Community terms.
   - Therefore: link/index them; do not mirror template/remix content into DRH downloads unless a specific creator grants a separate permissive license.

8. **Remaining major work** — ACTIVE BACKLOG
   - visually faithful live demos
   - per-reference implementation packages
   - source-faithful code adapters where license permits
   - standalone samples for selected pages/sections/effects
   - browser QA / visual regression / accessibility / mobile fallbacks
