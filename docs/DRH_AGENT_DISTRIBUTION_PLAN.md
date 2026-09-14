# DRH Agent Distribution Plan

갱신: 2026-09-14 · V2.4 범위는 공통 contract, 검증과 설계 문서입니다. Skill·Plugin·CLI 설치물은 이번에 배포하지 않습니다.

## Canonical data and consumers

```text
Pinned raw DESIGN.md + BrandDesignSpec + canonical ReferenceItem
        ├── Website: Overview → Design DNA → Component Library → Applied Canvas → Resources
        └── resolveArtifacts → buildReferenceHandoff
                                   ├── Portable artifact bundle
                                   ├── future Claude Code Skill
                                   ├── future Codex Skill
                                   └── future OpenCode / Plugin / CLI
```

Website를 새 데이터 원본으로 스크래핑하지 않습니다. Website와 배포 도구가 같은 canonical reference 및 artifact resolver를 소비합니다. 특정 agent의 지시문 형식을 canonical data로 삼지 않습니다.

## Implemented contract

`src/lib/referenceHandoff.ts`의 `ReferenceHandoff`와 `buildReferenceHandoff(item, artifacts?)`가 공통 진입점입니다. 입력 artifact를 주지 않으면 기존 `resolveArtifacts(item)`를 사용합니다.

| 필드 | 계약 |
|---|---|
| schemaVersion | 현재 `1`; breaking change는 버전을 올립니다. |
| id / name / kind / aliases | canonical reference 식별자와 기존 brand aliases. 이름으로 새 ID를 만들지 않습니다. |
| designMd.path | catalog root 기준 상대 경로. Website에서만 BASE_URL을 붙입니다. vendor 원본을 다시 쓰지 않습니다. |
| designMd.sha256 | canonical entry에 해시가 있을 때만 제공합니다. 없는 값을 만들어 넣지 않습니다. |
| designMd.text | 파일 경로가 없는 일반 reference의 이미 resolve된 문서. vendor lazy-loading placeholder는 넣지 않습니다. |
| agent.compact / extended | 기존 artifact resolver와 정확히 같은 문자열. 두 번째 Agent 생성 파이프라인을 두지 않습니다. |
| agent.applyPrompt | 프로젝트를 먼저 확인하고 원본 근거·충돌·화면 검수를 지시하는 1,000자 미만의 짧은 요청. |
| source | 출처 이름, repository, pinned revision, 문서 license와 notices. |
| experience | V2.4 additive contract: version, deterministic scene, semantic componentGroups and applied-preview disclaimer; same src/lib/brandExperience.ts consumed by Website. Layout and example content are DRH compositions. |
| officialResources | Website와 같은 검증 registry. official link가 에셋 재배포 허가는 아닙니다. |

현재 TypeScript runtime module은 Website 및 저장소 내 build 도구의 입력입니다. 공개 HTTP 검색 API, 설치 가능한 package 또는 독립 Node SDK를 이미 제공한다는 뜻은 아닙니다. `scripts/audit-brand-fidelity.mjs`가 esbuild의 raw-file loader로 shared module을 로드하는 재현 가능한 예시입니다.

## Portable bundle — next stage

배포 build 단계에서 canonical references를 열거하고 같은 함수로 versioned manifest를 생성합니다. 이것은 **파생 산출물**이며 수동 편집하지 않습니다. manifest, raw DESIGN.md, 기존 Agent, 제공 가능한 code, provenance 및 LICENSE 전문을 묶습니다.

배포 전에 모든 path가 bundle root 안에 있는지 검사하고 실제 파일의 SHA-256을 계산합니다. canonical hash가 있으면 반드시 대조합니다. SHA-256은 바이트 동일성 확인이며 저작권 허가나 출처 인증을 대신하지 않습니다. 번들 버전, catalog revision과 manifest schemaVersion을 별도로 기록합니다. 런타임 네트워크 접근 없이 검색·선택할 수 있어야 합니다.

코드가 없는 브랜드에 HTML/CSS/React export를 만들어 채우지 않습니다. 문서와 source evidence만 있는 경우 그 제공 범위를 그대로 드러냅니다.

## Agent workflows

각 agent integration은 같은 검색 index와 ReferenceHandoff를 읽습니다.

1. 사용자 목적·이름·alias로 reference 검색.
2. 정확한 reference ID, preview와 source 조건 확인.
3. 대상 프로젝트의 framework, 화면, 기존 기능과 규칙 확인.
4. 사용자가 요청한 범위에서 DESIGN.md 및 기존 artifact를 적용.
5. 390px / 1440px, 입력·키보드·reduced motion 확인 후 변경과 한계 보고.

Claude Code, Codex, OpenCode 각각의 Skill은 이 workflow에 필요한 얇은 진입점만 갖습니다. 브랜드 토큰이나 resource registry를 Skill별로 복사하지 않습니다. Project adoption은 reference 다운로드와 구분합니다. 원본 문서가 프로젝트 명령이나 최상위 권한으로 자동 승격되지 않게 합니다.

## Plugin / CLI responsibilities

필요해질 때 installer가 versioned catalog bundle과 agent별 진입점만 설치합니다. 기존 DESIGN.md를 조용히 덮어쓰지 않고 명시한 프로젝트 경로에 적용합니다. 설치 후 offline 검색, hash 대조, 제거 범위가 분명해야 합니다. 네트워크 검색·자동 업데이트·account integration은 이번 범위 밖입니다.

## oh-my-design comparison

2026-09-13에 [oh-my-design repository](https://github.com/kwakseongjae/oh-my-design)와 [Builder](https://oh-my-design.kr/builder)를 확인했습니다. 로컬 문서·재사용 가능한 agent workflow·여러 agent에 대한 배포 경로는 향후 구조의 참고점입니다. DRH는 시각적 탐색, 실제 demo, copy 가능한 artifact와 source 근거의 연결을 유지합니다.

이번 V2.3에서는 OmD의 code/CSS/layout/skill/CLI를 가져오지 않았습니다. 따라서 추가 source-code adaptation 목록은 없습니다. 기존 V2.2의 pinned 문서와 `third_party/oh-my-design/LICENSE` 및 권리 구분을 유지합니다. 향후 MIT 구현을 재사용한다면 exact file, pinned revision, LICENSE 전문, copyright notice와 adaptation 범위를 먼저 기록합니다. repository MIT를 브랜드 에셋 권리로 확대하지 않습니다.

## Release gates

- 모든 reference의 Agent Compact/Extended와 Website artifact parity.
- vendor path의 실제 파일 존재 및 hash 대조; lazy placeholder 배포 금지.
- aliases·revision·Official Resources drift 없음.
- 원본 component coverage와 source/DRH scaffolding 구분.
- 실제 browser QA 및 라이선스 전문 보존.
- 지원하지 않는 renderer·asset·state는 미지원으로 남김.

현재 검증: `npm run audit:brand-fidelity`. 전체 renderer 및 browser 검증은 [V2.3 audit](BRAND_CATALOG_V23_FIDELITY_HANDOFF_AUDIT.md)에 기록합니다.
