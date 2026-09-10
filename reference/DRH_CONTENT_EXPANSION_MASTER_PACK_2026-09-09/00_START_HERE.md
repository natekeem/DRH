# 00 — START HERE

이 패키지는 DRH 콘텐츠 확장용 **단일 Master Pack**이다.

기존 두 패키지:
- `DRH_RESEARCH_PACK_2026-09-09.zip`
- `DRH_IMPLEMENTATION_SOURCE_MAP_2026-09-09.zip`

의 유효한 내용만 합쳤다.

구형 구현 프롬프트:
- `01_GEMINI_BATCH_A.md`
- `02_SONNET_BATCH_B.md`
- `03_CODEX_BATCH_C.md`

는 이 Master Pack에서 제거했다.
앞으로는 **이 압축 하나만 기준으로 사용**한다.

---

## 현재 기준

조사 당시 DRH:
- Reference 167개
- Core visual 83개
- DRH DESIGN.md preset 10개
- VoltAgent DESIGN.md vendor 74개
- Source Registry 189개

현재 별도로 진행 중인 Codex V1.7 작업이:
- Demo renderer path
- Card/Detail density
- alias/duplicate demo
- Guide layout
- Related card ratio
- CSS cascade
- demo audit

를 수정하고 있다.

### 중요
**V1.7이 main에 merge/push되고 모든 audit이 통과하기 전에는
`prompts/` 아래 구현 프롬프트를 실행하지 않는다.**

Research 문서 자체는 언제든 읽어도 된다.

---

# 패키지 구조

```text
DRH_CONTENT_EXPANSION_MASTER_PACK_2026-09-09/
├─ 00_START_HERE.md
├─ RUN_COMMANDS.md
├─ MASTER_INDEX.md
│
├─ research/
│  ├─ CURRENT_DRH_INVENTORY.json
│  ├─ REFERENCE_CANDIDATES_120.json
│  ├─ NEXT_40_REFERENCES.json
│  ├─ SOURCE_REGISTRY_ADDITIONS.json
│  ├─ SOURCE_UPDATES.json
│  ├─ PRODUCT_BENCHMARKS.md
│  ├─ LEGAL_NOTES.md
│  ├─ SOURCE_PREVIEW_STRATEGY.md
│  └─ SOURCE_LINKS.md
│
├─ implementation/
│  ├─ IMPLEMENTATION_SOURCE_MAP_40.json
│  ├─ IMPLEMENTATION_SOURCE_MAP_40.md
│  ├─ LICENSE_MATRIX_40.md
│  └─ DEEP_RESEARCH_CONCLUSIONS.md
│
└─ prompts/
   ├─ 01_GEMINI_POST_V17_BATCH1.md
   ├─ 02_SONNET_POST_V17_BATCH2.md
   ├─ 03_CODEX_POST_V17_HIGH_FIDELITY.md
   └─ 04_GEMINI_POST_V17_PAGES.md
```

---

# 무엇을 먼저 읽어야 하나

Agent에게 구현을 시킬 때 전부 읽히지 않아도 된다.

공통 필수:
1. `00_START_HERE.md`
2. `implementation/IMPLEMENTATION_SOURCE_MAP_40.json`
3. `implementation/LICENSE_MATRIX_40.md`
4. 실행할 `prompts/<해당 파일>.md`

보조:
- 디자인/제품 판단이 필요하면 `research/PRODUCT_BENCHMARKS.md`
- 법적 판단이 필요하면 `research/LEGAL_NOTES.md`
- 후보 전체가 필요하면 `research/REFERENCE_CANDIDATES_120.json`

---

# 작업 순서

## 0. 현재
Codex V1.7 완료 → main push → audits 확인.

## 1. Gemini Batch 1
`prompts/01_GEMINI_POST_V17_BATCH1.md`

Styles + UI Patterns + Agency Landing.

## 2. Sonnet Batch 2
`prompts/02_SONNET_POST_V17_BATCH2.md`

Motion + Text + tactile interaction.

## 3. Codex High Fidelity
`prompts/03_CODEX_POST_V17_HIGH_FIDELITY.md`

Boids / Topography / Voronoi / Ferrofluid / Liquid Chrome / Caustics / Dither / Liquid Metal.

Codex는 한 번에 전부 하지 말고 prompt 안의 Group 단위로 수행.

## 4. Gemini Pages
`prompts/04_GEMINI_POST_V17_PAGES.md`

Interactive Hero / Masonry / Feature Showcase / Product Demo / AI Agent Workspace / Ecommerce.

---

# 원칙

- 실제 Reference를 추가할 때는 최신 main 구조가 Source of Truth.
- Master Pack의 숫자와 경로가 최신 코드와 다르면 최신 코드를 우선.
- Reference-only 사이트의 코드/프롬프트/이미지는 복사하지 않는다.
- permissive OSS를 adapt할 때 upstream commit + LICENSE + provenance를 보존.
- 하나의 canonical Reference는 하나의 식별 가능한 Demo를 가져야 한다.
- Card와 Detail은 같은 코드를 단순 확대하지 말고 V1.7 density/scale policy를 따른다.
- Working Demo는 실제 브라우저에서 이름을 시각적으로 식별할 수 있을 때만 부여.
