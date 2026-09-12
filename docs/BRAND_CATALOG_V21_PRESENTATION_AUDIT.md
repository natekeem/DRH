# Brand Catalog V2.1 — Curated Presentation Audit

검증일: 2026-09-12 · 브랜치: `codex/brand-catalog-v21-presentation`

## 범위와 보존 확인

최신 `main`과 `origin/main`의 일치를 확인하고 깨끗한 작업 트리에서 시작했다. 신규 Reference·vendor·route를 추가하지 않았다. BrandDesignSpec, BrandCatalog, parser, raw DESIGN.md, full spec JSON, source hash, upstream commit, sync safeguards, official resource/brandAsset schema, Detail/Expanded 구조를 보존했다. 원본 74개 및 생성 spec의 변경은 없다.

Presentation overlay는 parser가 소유한 데이터와 분리했다. `brandCuratedCopy.json`의 한국어 요약은 원문 행이 정확히 일치할 때만 표시한다. `brandVerifiedAssets.json`도 source spec을 덮어쓰지 않는다. Tokens와 Agent contract는 폰트·에셋 registry 및 사용 조건을 함께 참조한다.

## Problems Fixed

| 영역 | 변경과 근거 |
|---|---|
| Typography | 8종 OFL 폰트를 로컬 배포하고 타입·컴포넌트·브랜드 식별자에 공통 resolver를 적용했다. 원본 지정 글꼴과 표시 글꼴을 구분한다. Detail은 최대 5개 대표 역할, 전체는 Expanded에 남긴다. 크기·굵기·행간·자간은 원본 값으로 표시하고 샘플 글자만 화면에 맞게 제한한다. |
| Logo | Vercel 공식 배포 키트의 원본 logotype과 Supabase 공식 키트의 원본 symbol을 사용한다. 로컬 파일·SHA-256·배포 URL·사용 조건·attribution을 기록했다. Vercel은 밝은/어두운 배경용 원본을 선택하며 색상을 임의 변경하지 않는다. |
| Official Resources | 7개 브랜드 / 8개 링크에서 13개 / 18개로 확대했다. Detail 상단에 유형·이름·한국어 설명을 표시하고 Expanded가 같은 registry를 사용한다. Card에는 링크를 추가하지 않았다. |
| Colors | 대표 role 8개를 우선 선택해 swatch·역할·값으로 비교한다. 전체 palette는 Expanded에서 제공한다. 명시된 source role 명칭을 유지했다. |
| Components | Detail은 버튼 3개, 다른 주요 그룹 2개를 우선 표시한다. 일반 변형을 먼저 고르고 상태 변형은 남는 자리에 배치한다. 기타 정의는 Expanded에 둔다. 모든 원본 component와 동작은 전체 카탈로그에서 유지한다. |
| Spacing / Radius | 간격은 실제 CSS 단위의 막대, radius는 실제 box로 비교한다. 긴 간격은 최대 240px로 제한하되 원본 수치는 함께 표시한다. |
| Depth | 독립 Elevation 섹션으로 분리했다. 원문 표를 기본 노출하지 않고 단계별 요약 카드로 정리했다. 주요 10개 브랜드는 원문에 대응하는 한국어 설명을 제공한다. Ferrari의 photographic 단계, Nintendo의 bevel, Vercel의 stacked shadow 의미를 보존했다. |
| Motion | 배열·객체의 JSON 직렬화 출력을 제거했다. 명시적 transition/duration/easing 등의 속성형 근거만 표시한다. 레이아웃 전환·글꼴 교체 역사·추출하지 못한 추천값을 실제 모션 규칙으로 취급하지 않는다. 범위 밖인 경우 짧은 한국어 안내만 표시한다. |
| Responsive | source section/frontmatter에 근거가 있는 61개 브랜드에서 독립 섹션을 제공한다. breakpoint 숫자는 원문에서만 가져온다. Detail은 최대 6개 조건을 양 끝 범위를 포함해 선택하고, 전체 조건은 Expanded에 보존한다. |
| Korean-first | UI·도움말·타입 메타데이터·리소스 유형을 한국어로 정리했다. 주요 10개 브랜드의 Elevation과 표 형식 Responsive를 검토한 한국어 요약으로 보강했다. 원본 토큰명과 canonical 디자인 명칭은 유지한다. |
| Raw evidence | 원문은 명시적인 disclosure와 Source 영역에서 확인한다. 배열/중첩 객체는 읽을 수 있는 Markdown으로 풀고 원본 JSON은 별도 링크로 제공한다. |
| Scroll / clipping | 카탈로그가 하나의 세로 스크롤을 소유하도록 유지했다. raw prose와 pre의 추가 세로 스크롤을 없앴다. 데스크톱 부모 패널과 카탈로그 높이를 일치시켰다. Nintendo nav specimen의 낮은 원본 높이로 발생하던 내부 스크롤도 제거했다. 섹션 이동은 실제 sticky header 높이를 계산한다. |
| CSS duplication | 같은 cascade context의 중복 selector 선언을 통합했다. 세 번 반복되던 jump-menu 블록을 한 번으로 정리했다. 활성 responsive 변형은 유지하며 scope별 중복 검사를 추가했다. |

## Font Strategy / Coverage

총 **74개 브랜드**. 아래 대표 글꼴 기준은 각 브랜드의 첫 원본 타입 역할로 집계하며 서로 중복되지 않는다.

| 대표 글꼴 분류 | 브랜드 수 |
|---|---:|
| Open font applied | 10 |
| System / OS font stack | 4 |
| Proprietary / redistribution unverified fallback | 57 |
| 원본 family 미지정 | 3 |

한 개 이상의 **명시된 원본 타입 역할에 공개 폰트를 실제 적용한 브랜드는 27개**다. 전용 폰트의 대체재로 Inter/Geist Mono를 쓰는 경우는 이 수치에 중복 가산하지 않았다.

로컬 폰트: Inter, Geist, Geist Mono, IBM Plex Sans, IBM Plex Mono, JetBrains Mono, DM Sans, Instrument Serif. 총 약 2.39 MB(TTF), 사용된 글꼴만 브라우저가 요청한다. `public/fonts/brand/*/OFL.txt`에 원본 라이선스 전문을 보존한다. Google Fonts 공식 배포 저장소의 commit `809e4d8b8d7e9364a914909bb777679606c178b8`에 고정했고 파일별 URL·SHA-256은 [font registry](../src/data/brandFontAssets.json)에 기록했다. `scripts/vendor-brand-fonts.mjs`는 명시적으로 실행하는 재현 도구이며 앱 실행·source sync는 네트워크 폰트 다운로드를 수행하지 않는다.

- **A / Open:** 검증된 로컬 파일을 적용한다. IBM Plex Mono와 Instrument Serif는 이번 배포의 Regular 파일이며 다른 굵기는 브라우저 합성일 수 있다.
- **B / System:** Apple SF Pro는 OS stack으로 렌더링한다. Windows에서는 Segoe UI 등으로 대체된다. SF Pro 파일을 번들하지 않았다. Helvetica·Arial·Times·mono 계열도 적절한 generic fallback을 둔다.
- **C / Proprietary or unverified:** 다운로드하지 않는다. source가 명시한 공개 fallback을 우선 사용하고, 없으면 sans/serif/mono 계열을 보존한 대체 글꼴을 쓴다. 이는 원본 전용 서체의 재현이라는 주장이 아니다.

브라우저 CDP의 실제 platform-font 정보도 [추가 QA 결과](../artifacts/brand-v21/presentation-browser-qa.json)에 저장했다. CSS `font-family` 선언만 확인한 결과가 아니다.

## Brand Asset Strategy / Coverage

| 형식 | 수 |
|---|---:|
| Verified SVG | 2 |
| Verified image | 0 |
| Text wordmark | 72 |

- **Vercel:** [공식 사용 지침](https://vercel.com/geist/brands)에서 제공하는 다운로드 키트를 사용했다. 제품·기술을 사실대로 식별하는 용도에 한정하고 attribution을 표시한다. 전체 logotype의 비율·색과 clear space를 보존한다. 소프트웨어의 MIT 라이선스로 에셋 사용을 허용한다고 해석하지 않았다.
- **Supabase:** [공식 Brand assets](https://supabase.com/brand-assets)에서 배포하는 키트를 사용했다. 변형 없이 Supabase를 식별하는 용도에 한정한다.
- 나머지는 검증되지 않은 로고를 채워 넣지 않았다. Spotify의 developer assets는 partner integration 조건을 일반 카탈로그에 그대로 확대 적용하지 않았다.

[검증 asset registry](../src/data/brandVerifiedAssets.json)와 `public/brand-assets/*/NOTICE.txt`에 조건·출처·해시를 남겼다. Card·Detail·Expanded는 동일 resolver를 사용한다. 로고는 별도 재사용 허가를 뜻하지 않는다.

## Official Resources

**13 / 74개 브랜드, 18개 링크.** 링크 유형별 수:

| 유형 | 링크 수 |
|---|---:|
| Brand guideline | 4 |
| Design system | 4 |
| Developer design guide | 1 |
| Typography | 2 |
| Components | 0 |
| Assets | 7 |
| Other | 0 |

추가 브랜드는 IBM, Shopify, Supabase, MongoDB, Raycast, Sentry다. IBM의 Carbon·Plex·Design Language, Shopify의 현재 Polaris 문서와 브랜드 자료 등을 확인했다. Vercel에도 공식 에셋 페이지를 추가했다. 모든 추가 링크는 공식 소유와 실제 페이지 내용을 확인하고 HTTP 응답을 별도로 기록했다. [검증 기록](../artifacts/brand-v21/official-resource-checks.json).

HashiCorp의 공식 가이드는 확인했지만 이번 직접 HTTP 검증에서 429를 받아 registry에 추가하지 않았다. 현재 vendor가 없는 GitHub/Microsoft/Adobe/Atlassian/Salesforce/Google/Kakao/Woowahan은 추가하지 않았다. Kakao developer design guide와 Woowahan fonts는 향후 별도 Brand Reference 후보로 남긴다.

## Detail / Expanded / Source

| 화면 | 역할 |
|---|---|
| Card | 브랜드 식별자, source 기반 DNA, 소형 컴포넌트와 palette. 공식 링크 없음. |
| Detail | 공식 가이드 → 특징 → 대표 색·타입·컴포넌트 → 간격/모서리 → Elevation → Motion(근거 있을 때) → Responsive(근거 있을 때) → 작은 Layout DNA → 출처. 기본 raw dump 없음. |
| Expanded | 전체 palette·typography·component inventory·geometry와 source evidence. 같은 모델/renderer를 사용한다. |
| Source | 변경하지 않은 DESIGN.md와 전체 spec JSON. Raw 정보는 명시적 근거 영역에서 접근한다. |

섹션이 없다는 이유로 값을 만들지 않는다. Motion은 실제 규칙 4개 브랜드, 명시적 범위 밖 9개, 별도 명시 없음 61개다. 미지정은 섹션을 숨기고, 전체 근거는 Expanded Source에 남긴다. 네트워크로 full spec을 읽지 못하는 상태는 별도의 오류/재시도 UI를 유지한다.

## getdesign Comparison — Linear

[Linear preview](https://getdesign.md/design-md/linear.app/preview), [DESIGN.md 설명](https://getdesign.md/linear.app/design-md), [Starter Kit](https://starterkit.getdesign.md/), [oh-my-design builder](https://oh-my-design.kr/builder)를 정보구조 기준으로 검토했다. 코드·에셋·스크린샷을 복사하지 않았다. 아래는 픽셀 유사도 평가가 아니라 같은 종류의 정보를 찾고 비교할 수 있는지에 대한 평가다.

| 질문 | DRH V2.1 결과 |
|---|---|
| Colors가 더 보기 어려운가? | Detail은 primary/canvas/surface/ink/muted/hairline을 우선 보여줘 핵심 역할 비교가 빠르다. 전체 palette 범위는 Expanded에 있다. source role 이름은 영어를 유지한다. |
| Typography hierarchy를 바로 이해할 수 있는가? | Display·headline·body·caption·mono 대표 역할을 샘플과 수치로 비교한다. Linear Display/Text는 Inter 대체임을 명시하므로 전용 서체와의 정확한 glyph 일치까지 주장하지 않는다. |
| Buttons variation을 비교할 수 있는가? | 대표 3개를 나란히 표시하고 클릭 상태를 시험할 수 있다. 전체 상태 변형은 Expanded에 있다. |
| Cards / Forms 실제 스타일을 확인할 수 있는가? | source 정의의 색·경계·radius·타입을 적용한 카드와 실제 입력 specimen을 제공한다. |
| Spacing / Radius를 시각적으로 느낄 수 있는가? | 거리 막대와 실제 둥근 box로 비교하며 source 값을 함께 표시한다. |
| Elevation을 빠르게 이해할 수 있는가? | 5단계 한국어 요약 카드로 flat → surface ladder → focus ring을 설명한다. 긴 영어 Markdown 표는 기본 화면에서 제거했다. |
| Responsive를 독립적으로 확인할 수 있는가? | 실제 source의 1440/1280/1024/768/480px 조건과 변화 설명을 독립 섹션에서 보여준다. 다른 사이트에서 숫자를 가져오지 않았다. |

대표 화면: [Linear Typography](../artifacts/brand-v21/curated-typography-linear.app-1440.png), [Linear Elevation](../artifacts/brand-v21/curated-elevation-linear.app-1440.png), [Linear Responsive](../artifacts/brand-v21/curated-responsive-linear.app-1440.png).

## Canary Browser QA

- **14개 canary × 3 viewport = 42개 Card/Detail/Expanded 시나리오**: Apple, Airbnb, Notion, Linear, Stripe, Vercel, Spotify, Ferrari, Nintendo 2001, Binance, Tesla, Figma, IBM, Supabase.
- **1920×1080 / 1440×1000 / 390×844**. 모바일 touch, reduced motion, 카드 넘침·micro specimen 높이, 원문 기본 숨김, 전체 타입/컴포넌트 개수, theme 동기화, 입력/버튼/탭, nested dialog, ESC·닫기 버튼, 양방향 focus trap·trigger 복원, body scroll lock, 로드된 상태의 offline interaction을 검증했다.
- **74개 전체 Detail**: normal-motion 설정에서 raw JSON/빈 객체 노출, 기본 원문 표, 대표 개수, 부모 clipping, 내부 세로 스크롤을 추가 검사했다. 주요 canary는 실제 사용된 platform font까지 기록했다.
- 화면을 직접 검토했다. Apple/Linear의 hierarchy, Notion/Stripe의 카드·입력, Spotify/Ferrari의 media/cinematic 색상과 구성, Nintendo/Vercel의 geometry 차이, 검증 로고와 워드마크 fallback을 확인했다. 자동 74개 검사와 수동 canary 화면 검토는 구분한다.

Production build에서도 1440/390 화면의 Linear·IBM·Vercel·Supabase와 8종 로컬 font face, 로고 로드 및 모달 닫기를 확인했다. [Production 검사](../artifacts/brand-v21/production-browser-qa.json).

결과: [42개 시나리오](../artifacts/brand-v21/browser-qa.json), [74개 추가 검사](../artifacts/brand-v21/presentation-browser-qa.json).

스크린샷:

- [Card 비교 1920](../artifacts/brand-v21/cards-1920.png) · [1440](../artifacts/brand-v21/cards-1440.png) · [390](../artifacts/brand-v21/cards-390.png)
- [Apple Responsive](../artifacts/brand-v21/curated-responsive-apple-1440.png) · [Apple Detail mobile](../artifacts/brand-v21/detail-apple-390.png)
- [Spotify](../artifacts/brand-v21/expanded-spotify-1440.png) · [Ferrari](../artifacts/brand-v21/expanded-ferrari-1440.png)
- [Nintendo geometry](../artifacts/brand-v21/geometry-nintendo-2001-1440.png) · [Vercel geometry](../artifacts/brand-v21/geometry-vercel-1440.png)

## Audit / Tests

통과: `npm run typecheck`, `npm run build`, `npm run audit:references`, `npm run audit:design-md`, `npm run audit:brand-designs`, `npm run audit:demos`, `npm run audit:v1.4`, `git diff --check`.

`audit:brand-designs`에 `audit-brand-presentation.mjs`를 연결했다. source-backed section/selection, 정확한 원문에 대응하는 한국어 요약, font license/commit/hash, asset provenance/hash, Motion의 오탐과 빈 배열, Expanded 전체 inventory, CSS context별 selector 중복을 검사한다. 기존 source/sync/resource audit도 유지한다.

브라우저 재실행은 `tests/brand-designs/catalog-v2-qa.mjs`와 `presentation-v21-qa.mjs`를 사용한다. QA의 Playwright/Sharp는 별도 도구 폴더에서 실행했고 앱 의존성을 추가하지 않았다. production build에는 기존 대형 JS chunk 경고가 남아 있으나 빌드 오류는 없다.

## Remaining Debt

- 72개 브랜드는 text wordmark, 61개는 등록된 공식 리소스가 없다. 검증되지 않은 수량을 채우지 않았다.
- 57개 브랜드의 대표 전용/재배포 미확인 폰트는 대체 표시한다. 3개는 원본 family 미지정이다. 모든 공개 폰트 family를 이번 pass에 번들한 것은 아니다.
- 수동으로 검토한 한국어 행 요약은 주요 10개 브랜드에 한정한다. 다른 브랜드의 source prose에는 짧은 영어 설명이 남으며 원문은 disclosure로 보존한다. 자동 번역으로 의미를 추정하지 않았다.
- 추출기가 수집한 넓은 의미의 motion 문자열은 원본 spec에 그대로 남아 있다. 이번 작업은 presentation에서 오탐을 제외했으며 parser 전면 개편은 하지 않았다.
- 로컬 폰트의 italic 및 일부 static family의 모든 weight 파일은 포함하지 않았다. 표현에 필요하면 라이선스 근거와 함께 후속 확장한다.
- 앱의 기존 대형 JS chunk 경고와 전용 제품 UI의 완전한 복제는 이번 presentation pass 범위에 포함하지 않는다.
