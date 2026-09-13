# Brand Catalog V2.3 — Fidelity & Handoff Audit

검증: 2026-09-13–14 · 브랜치: `codex/brand-catalog-v23-fidelity-handoff`.

## Baseline and scope

시작 시 `main`과 fetch한 `origin/main`의 차이는 `0 / 0`, 작업 트리는 깨끗했다. 요청한 새 브랜치에서 구현했다. 신규 브랜드·route·font·logo·외부 리소스는 추가하지 않았다. V2.2의 91개 브랜드, 198개 reference, parser/OmD adapter, 원본 DESIGN.md, full spec, alias와 source evidence는 보존했다.

## Confirmed root causes

| 기존 문제 | 원인과 수정 |
|---|---|
| 서로 다른 component가 같은 Sample surface | 단순 regex 분류와 최종 공통 div가 hero·pricing·asset·legal을 같은 마크업으로 렌더링했다. explicit type → semantic/use → naming pattern → unknown 순서로 분류하고 역할별 renderer를 연결했다. |
| source 일부만 적용 | 기존 componentStyle은 bg/fg alias, borderColor, font shorthand, size, table header/body, divider, active indicator 등을 빠뜨렸다. 닫힌 정규화 계약을 추가했다. |
| 검은 외곽 테두리 | chrome의 border가 `--bc-border`를 참조했다. shell의 rule/surface/ink를 `--catalog-*`로 분리했다. source border는 specimen의 inline normalized style에만 적용한다. |
| 입력·표·탭의 DRH 취향 | 기본 입력 border, table currentColor separator와 탭 outline이 source 없는 곳에도 적용됐다. source 정의가 있으면 inline style로 우선 적용하고, 표 divider는 명시적 rowBorder에만 연결한다. 미지정 입력에는 중립색 접근성 fallback이 있다. |
| Coinbase 글자 단위 줄바꿈 | 80px 글자·96px 패딩을 작은 surface에 그대로 적용했다. composition 전용 40px 최대 글자와 32px 최대 패딩으로 시각 projection하고 원본 80px/96px는 metadata·JSON에 남긴다. 모바일 제목은 최대 30px다. |
| 잘못된 sample backdrop | `on-dark` regex가 `button-dark`에도 일치했다. 이름 경계를 명시하고 투명/반투명 컴포넌트에만 중립 대비 배경을 사용한다. Apple의 파란 backing과 Ferrari의 빨간 backing이 스크린샷 검수에서 발견되어 수정됐다. |
| 끊어진 Guide | ArtifactWorkspace의 `/guides/using-design-md`는 실제 slug에 없었다. `/guides/apply-demo-code`로 연결하고 모든 정적 Guide 경로를 검사한다. |

## Normalized component contract

`src/lib/brandComponentStyle.ts`의 `ResolvedComponentStyle`은 허용한 CSS 속성만 반환한다. 색은 hex/rgb/hsl 및 제한된 keyword, 길이는 수치와 단위, border와 shadow는 별도 grammar로 검사한다. CSS 문자열을 style 속성 전체로 주입하거나 URL을 렌더링하지 않는다.

- bg/backgroundColor, fg/textColor, radius/rounded/borderRadius, padding/axis padding, height/size/width/min/max를 해석한다.
- 1px solid #hex와 OmD의 edge-width 표기, 명시적인 border 없음과 borderColor를 구분한다.
- `16px / 700 / 24px` 및 제한된 CSS font shorthand, nested typography와 typography role reference를 해석한다.
- family는 기존 local/system/fallback resolver를 사용한다. source에 없는 font family를 브랜드 전용 폰트로 주장하지 않는다.
- letter spacing, line height, weight, text transform과 color-first/length-first shadow를 보존한다.
- 현재 spec에 있는 color/spacing/radius/type role reference만 resolve한다. 미해결 값과 prose는 적용하지 않고 원문 근거에 남긴다.
- active/error의 실제 객체와 table header/body/cellPadding/rowBorder를 연결한다. 상태 이름을 설명한 문장만으로 hover/pressed 수치를 창작하지 않는다.
- 원본과 배경·문자 색이 같으면 기존 경고를 유지한다. source 값 자체를 수정하지 않는다.

## Semantic coverage and board

91개 브랜드의 **1,889개 component**를 전부 보존한다. 1,700개는 지원 family, **189개 unknown**은 Expanded의 작은 signature와 원문 근거로 제공한다. Curated에는 unknown specimen이 없다. 브랜드별 분류와 unknown 이름은 [fidelity-audit.json](../artifacts/brand-v23/fidelity-audit.json)에 있다.

지원 family: button, input/toggle, card, badge, tabs, dialog, table, navigation, hero, section, CTA band, pricing, media, code, status, icon shape, footer, legal, content surface. 사용처가 불명확한 모든 값을 억지로 분류하지 않는다.

버튼/배지는 compact 3열, 카드/입력/요금은 2열, 탐색/표/hero/section은 1열 wide board다. 모바일에서는 1열로 재배치한다. 이름, 원본 metric, evidence를 specimen에서 분리했다. 색상은 대표 semantic role을 우선한 일정한 높이의 palette board이며 Expanded에 전체 값이 남는다.

## In Context

`BrandDesignSpec → buildBrandCatalog → resolveComponentStyle → BrandComponentSample`을 Catalog와 적용 화면이 함께 사용한다. source category/layout으로 product, commerce, editorial, media scene을 결정하고 실제 component inventory에서 구성한다. 별도의 token pipeline은 없다.

제목·배치·기능성 문구는 DRH의 독립 예시다. source component에는 원본 이름과 `data-evidence="source-component"`, 중립 구조에는 `drh-scaffolding`을 표시한다. primary token 경계와 타입 역할도 공통 resolver를 사용한다. 항상 **“DRH 적용 예시 · 공식 제품 화면이 아닙니다.”**를 표시한다.

Media의 추상 cover와 재생 상태는 실제 음원/브랜드 에셋이 아니다. source의 play button이 있을 때만 재생 상태 예시를 연결하고 음원이 없음을 알린다. source에 없는 공식 화면·카드·폼·state를 만들지 않는다.

**Baemin boundary:** pinned source에는 버튼 7종이 있고 카드·폼 정의는 없다. mint와 public-web/corporate 버튼·타입은 보존하지만 배민 주문 앱이나 WORK 전용 서체를 재현했다고 주장하지 않는다. 적용 화면의 빈 영역은 DRH 목록으로 구분한다. 사용자가 관찰한 카드·폼 구분은 있는 source에서만 개선한다.

## Handoff and Guides

Detail/Expanded의 두 보기 마지막에서 DESIGN.md를 다운로드하고 short apply prompt를 복사할 수 있다. 같은 source 파일을 `download="DESIGN.md"`로 제공한다. 30개 browser case에서 내려받은 바이트의 SHA-256이 원본과 일치했다.

`ReferenceHandoff`는 기존 `resolveArtifacts` 위에서 만든다. 198개 reference의 Compact/Extended 문자열 parity, 91개 raw path와 존재하는 canonical hash, source revision과 짧은 prompt를 검사한다. vendor placeholder 문서를 실제 handoff로 내보내지 않는다.

Quickstart와 Demo/Code Guide는 각각 5단계로 축소했다. 상세한 문서 작성·license 설명은 기존 Guide에 남겼다. 전체 정적 Guide 경로는 실제 slug와 일치하며 브라우저에서 handoff의 Guide 링크를 직접 열었다.

향후 Claude Code/Codex/OpenCode 공통 contract, portable manifest와 installer의 경계는 [DRH_AGENT_DISTRIBUTION_PLAN.md](DRH_AGENT_DISTRIBUTION_PLAN.md)에 기록했다. 이번에 Skill/Plugin을 설치하거나 배포하지 않았다.

## Browser QA and screenshots

`tests/brand-designs/fidelity-v23-qa.mjs`로 1920×1080, 1440×1000, 390×844에서 10개 canary, 총 30개 case를 검사한다. 각 case는 Catalog, In Context, Expanded inventory, no overflow, 같은 버튼의 computed style parity, DESIGN.md download/hash, clipboard와 Escape/focus 복귀를 포함한다. in-app browser에서도 Coinbase Hero와 적용 화면, Baemin benchmark를 직접 확인했다.

| Canary | Catalog (1440) | In Context (1440) |
|---|---|---|
| Baemin | [보드](../artifacts/brand-v23/baemin-catalog-1440.png) | [적용](../artifacts/brand-v23/baemin-context-1440.png) |
| KakaoBank | [보드](../artifacts/brand-v23/kakaobank-catalog-1440.png) | [적용](../artifacts/brand-v23/kakaobank-context-1440.png) |
| Toss | [보드](../artifacts/brand-v23/toss-catalog-1440.png) | [적용](../artifacts/brand-v23/toss-context-1440.png) |
| Linear | [보드](../artifacts/brand-v23/linear.app-catalog-1440.png) | [적용](../artifacts/brand-v23/linear.app-context-1440.png) |
| Coinbase | [보드](../artifacts/brand-v23/coinbase-catalog-1440.png) | [적용](../artifacts/brand-v23/coinbase-context-1440.png) |
| Spotify | [보드](../artifacts/brand-v23/spotify-catalog-1440.png) | [적용](../artifacts/brand-v23/spotify-context-1440.png) |
| Ferrari | [보드](../artifacts/brand-v23/ferrari-catalog-1440.png) | [적용](../artifacts/brand-v23/ferrari-context-1440.png) |
| Nintendo 2001 | [보드](../artifacts/brand-v23/nintendo-2001-catalog-1440.png) | [적용](../artifacts/brand-v23/nintendo-2001-context-1440.png) |
| Vercel | [보드](../artifacts/brand-v23/vercel-catalog-1440.png) | [적용](../artifacts/brand-v23/vercel-context-1440.png) |
| Apple | [보드](../artifacts/brand-v23/apple-catalog-1440.png) | [적용](../artifacts/brand-v23/apple-context-1440.png) |

[Coinbase mobile hero](../artifacts/brand-v23/coinbase-hero-expanded-390.png) · [Baemin mobile handoff](../artifacts/brand-v23/baemin-handoff-390.png) · [browser results](../artifacts/brand-v23/browser-qa.json).

Vercel의 input border와 table divider computed style, ArrowRight tabs, nested modal Escape, keyboard button feedback를 검사한다. Baemin/Coinbase/Linear는 actual reduced-motion media와 이미 로드된 spec의 offline 보기 전환/확대를 검사한다. page error와 외부 runtime 요청은 0건이다. 추가로 실제 touch context의 tap/Expanded/피드백과 Linear Light theme의 Catalog/In Context parity를 [touch-theme-qa.json](../artifacts/brand-v23/touch-theme-qa.json)에 검증했다.

## Benchmark boundary

[oh-my-design Builder](https://oh-my-design.kr/builder)의 Baemin을 직접 열어 일정한 specimen 크기, palette scanability, 역할 그룹, source 근거와 handoff 위치를 비교했다. 구조적 비교이며 pixel match 점수나 브랜드 공식 제품 fidelity를 주장하지 않는다. code/CSS/layout/brand asset은 복사하지 않았다. 기존 OmD 문서 MIT와 asset 권리는 그대로 분리했다.

## Validation

- `npm run typecheck`
- `npm run build`
- `npm run audit:references`
- `npm run audit:design-md`
- `npm run audit:brand-designs` (source/sync/catalog/presentation 포함)
- `npm run audit:demos`
- `npm run audit:brand-resources`
- `npm run audit:korean-brands`
- `npm run audit:v1.4`
- `npm run audit:brand-fidelity`
- `node tests/brand-designs/fidelity-v23-qa.mjs`
- `node tests/brand-designs/interaction-v23-qa.mjs`
- `git diff --check`

로그와 실행 결과는 [validation.json](../artifacts/brand-v23/validation.json) 및 같은 디렉터리에 보존한다. 정적 PASS는 시각적 PASS를 대신하지 않는다.

## Remaining debt / precise limits

- 189개 unknown 정의에는 전용 renderer가 없다. 원본을 Expanded에서 확인할 수 있고 promotion하지 않았다.
- 전용 폰트, native-app geometry와 source에 없는 상태값은 재현하지 않는다. fallback과 DRH scaffold는 공식 component 근거가 아니다.
- parser가 prose에만 남긴 복잡한 상태·layout은 이번에 arbitrary CSS로 추정하지 않았다. 닫힌 contract 밖 값은 원문에 남는다.
- offline 검증은 페이지와 spec이 로드된 뒤의 전환/조작이다. 처음부터 네트워크가 없는 cold navigation/PWA 캐시를 새로 제공한 것은 아니다.
- 실제 source가 동일한 background/text 값을 선언한 경우 경고를 유지한다. source 데이터 수정은 별도 근거가 필요하다.
- Skill/Plugin-ready는 typed contract와 테스트·문서를 뜻한다. 독립 CLI/API/installer 배포는 다음 단계다.
