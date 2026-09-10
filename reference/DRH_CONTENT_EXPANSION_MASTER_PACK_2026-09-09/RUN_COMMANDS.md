# RUN COMMANDS

아래 문장만 복사해서 해당 Agent에게 보내면 된다.
압축 파일을 Agent가 접근 가능한 위치에 두고 실행한다.

---

## 현재 Codex V1.7 Resume

> 기존에 진행하던 DRH V1.7 작업을 resume해서 끝까지 완료해줘. 현재 작업 범위를 바꾸지 말고, typecheck/build/audit/browser QA까지 완료한 뒤 main에 push하고 최종 보고해줘.

Master Pack은 이 작업에서는 아직 사용하지 않아도 된다.

---

## V1.7 완료 후 — Gemini 3.1 Pro High / Batch 1

> 첨부한 `DRH_CONTENT_EXPANSION_MASTER_PACK_2026-09-09.zip`을 풀고 `00_START_HERE.md`, `implementation/IMPLEMENTATION_SOURCE_MAP_40.json`, `implementation/LICENSE_MATRIX_40.md`, `prompts/01_GEMINI_POST_V17_BATCH1.md`를 순서대로 읽은 뒤, **최신 DRH main을 기준으로 프롬프트의 작업을 그대로 수행해줘.** Master Pack과 최신 코드가 충돌하면 최신 코드 구조를 우선하고, 라이선스/출처 판단은 Master Pack을 우선 참고해. 완료 후 모든 현재 audit와 browser QA를 통과시키고 main에 push해줘.

---

## Sonnet 4.6 / Batch 2

> 첨부한 `DRH_CONTENT_EXPANSION_MASTER_PACK_2026-09-09.zip`을 풀고 `00_START_HERE.md`, `implementation/IMPLEMENTATION_SOURCE_MAP_40.json`, `implementation/LICENSE_MATRIX_40.md`, `prompts/02_SONNET_POST_V17_BATCH2.md`를 순서대로 읽은 뒤, **최신 DRH main에서 작업해줘.** 기존 canonical demo를 generic recipe로 재사용하지 말고, 각 Reference의 `canonicalAcceptance`를 만족시켜. 완료 후 현재 전체 audit와 browser QA를 통과시키고 main에 push해줘.

---

## Codex / High Fidelity Group A

> 첨부한 `DRH_CONTENT_EXPANSION_MASTER_PACK_2026-09-09.zip`을 풀고 `00_START_HERE.md`, `implementation/IMPLEMENTATION_SOURCE_MAP_40.json`, `implementation/LICENSE_MATRIX_40.md`, `prompts/03_CODEX_POST_V17_HIGH_FIDELITY.md`를 읽어줘. **이번에는 Group A만 구현해.** 최신 main 기준으로 Boids Ecosystem, Topography Contours, Voronoi Field를 high-fidelity로 구현하고 Card/Detail/export/Agent Package/test까지 맞춘 뒤 검증하고 main에 push해줘.

---

## Codex / High Fidelity Group B

> 같은 Master Pack의 `prompts/03_CODEX_POST_V17_HIGH_FIDELITY.md`를 기준으로 **이번에는 Group B만 구현해.** Ferrofluid Surface, Liquid Chrome, Caustics, Dither Field, Liquid Metal Border를 최신 main에 추가해. 라이선스가 애매한 discovery source는 clean-room으로 구현하고, WebGL/Canvas lifecycle·reduced-motion·offline HTML parity·Card/Detail density·tests까지 모두 검증한 뒤 main에 push해줘.

---

## Gemini 3.1 Pro High / Pages

> 첨부한 Master Pack을 풀고 `00_START_HERE.md`, `implementation/IMPLEMENTATION_SOURCE_MAP_40.json`, `implementation/LICENSE_MATRIX_40.md`, `prompts/04_GEMINI_POST_V17_PAGES.md`를 순서대로 읽은 뒤 최신 main에서 작업해줘. 외부 사이트를 그대로 복제하지 말고 permissive pattern을 사용해 중립적인 DRH Demo로 재구성해. 완료 후 audit/browser QA까지 통과시키고 main에 push해줘.

---

# 가장 짧은 공통형

모델과 prompt 파일명만 바꿔서 아래처럼 사용해도 된다.

> 첨부한 `DRH_CONTENT_EXPANSION_MASTER_PACK_2026-09-09.zip`을 풀고 `00_START_HERE.md`와 `[PROMPT_FILE]`을 읽어. 필요한 경우 `implementation/IMPLEMENTATION_SOURCE_MAP_40.json`과 `implementation/LICENSE_MATRIX_40.md`를 근거로 사용하고, 최신 DRH main에서 해당 작업을 끝까지 수행해줘. 기존 audit/browser QA를 모두 통과시키고 완료 후 main에 push해줘.
