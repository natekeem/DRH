# Brand Catalog V2.2 — Korean Brand / Asset Audit

작업·검증: 2026-09-12–13. 브랜치: `codex/brand-catalog-v22-korean-assets`.

## Baseline and scope

- 시작 `main`, `origin/main`: `453dca9246ce4b98c3adddecf2d628974aef3d00`. 시작 작업 트리는 깨끗했고 `git fetch origin` 후 일치를 확인했다.
- 기존 Card / Detail / Expanded의 레이아웃, 섹션 계층, 스크롤 소유권, 확대 동작, Elevation / Motion / Responsive 구성을 유지했다.
- 새 route 종류·카테고리·UI 모델을 만들지 않았다. 기존 `admd-*` 및 `vendor-design-md:*` 파이프라인을 확장했다.
- 기존 74개 원문·full spec의 브랜드 토큰을 덮어쓰지 않았다. 기존 ID를 모두 유지하고 신규 17개 ID를 별도 허용 목록으로 고정했다.
- 기준 수치는 [baseline.json](../artifacts/brand-v22/baseline.json)에 보존했다. V2.1 presentation evidence는 갱신 대상으로 사용하지 않는다.

| 항목 | V2.1 | V2.2 |
|---|---:|---:|
| 브랜드 | 74 | 91 |
| 전체 Reference | 181 | 198 |
| 로컬 공개 폰트 종류 | 8 | 9 |
| 하나 이상의 원본 역할에 공개 폰트를 적용한 브랜드 | 27 | 34 |
| 첫 타입 역할이 공개 폰트인 브랜드 | 10 | 16 |
| 첫 타입 역할이 OS/system인 브랜드 | 4 | 6 |
| 첫 타입 역할이 전용/재배포 미검증 fallback인 브랜드 | 57 | 63 |
| 첫 타입 역할의 family 미지정 | 3 | 6 |
| 검증 로고 | 2 | 4 |
| Text wordmark | 72 | 87 |
| 공식 리소스가 있는 브랜드 | 13 | 22 |
| 공식 링크 | 18 | 27 |

Fallback에 공개 폰트를 사용한 경우를 원본 브랜드 폰트 적용 수에 가산하지 않았다. 집계는 [presentation-audit.json](../artifacts/brand-v22/presentation-audit.json)에서 재현한다.

## oh-my-design provenance and rights

저장소: [kwakseongjae/oh-my-design](https://github.com/kwakseongjae/oh-my-design/tree/15ff013933b37d1800e05c75e7680ed17e56f94b).

고정 커밋: `15ff013933b37d1800e05c75e7680ed17e56f94b`.

- MIT 전문과 `Copyright (c) 2026 oh-my-design`: [third_party/oh-my-design/LICENSE](../third_party/oh-my-design/LICENSE).
- 원본 README와 다음 고지를 함께 보존했다: “References belong to their respective companies; reproduced for educational reference.”
- [UPSTREAM.md](../third_party/oh-my-design/UPSTREAM.md)와 [README.upstream.md](../third_party/oh-my-design/README.upstream.md)에 원본 repository·commit·path·권리 경계를 기록했다.
- 문서 MIT는 브랜드 상표, 로고, 전용 폰트, 스크린샷, 제3자 에셋에 대한 재배포 허가가 아니다. Source 표시와 Agent provenance에도 이 구분을 전달한다.
- 원본 `design-md/<slug>/DESIGN.md`와 `.verification.md`만 vendor했다. CLI·skill·agent package·favicon·스크린샷·웹사이트 코드·브랜드 폰트/로고 파일을 OmD에서 가져오지 않았다.
- 원문은 `git show <pin>:<path>`의 원본 바이트다. `.gitattributes`로 Windows 줄바꿈 변환을 막고 SHA-256을 기록한다. DRH metadata를 원문에 넣지 않는다.

## Korean discovery and imports

전체 catalog의 frontmatter에서 `country: KR`인 **203개 후보**를 자동 발견했다. 이 중 upstream `verified_v2`이며 색상·타입·컴포넌트 근거가 있는 다음 17개를 첫 배치로 선택했다.

Toss, Karrot, Kakao, KakaoPay, KakaoBank, NAVER, Baemin, Coupang, Musinsa, Kurly, Olive Young, SOCAR, Banksalad, Hyundai, Samsung, 29CM, 여기어때.

전체 후보의 상태·근거·보류 이유는 [KOREAN_BRAND_SOURCE_CANDIDATES.md](KOREAN_BRAND_SOURCE_CANDIDATES.md), 기계 판독 inventory는 [korean-source-inventory.json](../artifacts/brand-v22/korean-source-inventory.json)에 있다.

- Watcha / RIDI는 `legacy_snapshot`으로 보류했다. 충분한 후보를 찾았으므로 낮은 근거 수준을 수량 때문에 승격하지 않았다.
- LINE은 upstream JP, Sendbird는 US 분류이므로 국내 수치에 넣지 않았다. Genesis는 해당 pin에서 exact reference 디렉터리를 발견하지 못했다.
- Baemin ↔ 배달의민족 / 배민 / Woowahan / 우아한형제들, Karrot ↔ 당근 / Daangn 등 한국어·영어 alias를 기존 검색 tags에 연결했다. 같은 브랜드를 중복 reference로 만들지 않았다.
- 기존 canonical 브랜드와 충돌하는 값을 자동 병합하지 않았다. 기존 VoltAgent source의 ID와 토큰은 유지했다.
- OmD가 검증한 표면은 corporate / marketing / product / design-system 등으로 한정된다. DRH가 해당 회사 전체 제품을 독립적으로 재검증하거나 재현했다는 주장이 아니다.

## Parser and artifact parity

`raw DESIGN.md → adapter → BrandDesignSpec → compact projection / full JSON → buildBrandCatalog → Card / Detail / Expanded` 경로를 사용한다.

- 기존 parser 앞에 `tokens` envelope 어댑터를 추가했다. 명시된 `bg/fg/radius`, 타입 `size/weight/tracking`을 기존 속성으로 옮기고 숫자 길이에만 px를 붙인다.
- 여러 표면의 font family가 있으면 역할 prefix/use 근거가 일치하거나 단일 family일 때만 연결한다. 연결이 모호하면 family를 비워 원문을 보존한다.
- 원본 Experience / Typography / Components / Layout / Content / Governance 관련 문장은 full sections/frontmatter에 남는다. 별도 UI를 만들거나 없는 규칙을 채우지 않는다.
- 명시적 button/input/tab/component 유형을 catalog 및 Card projection에서 사용한다. Coupang처럼 header list item만 확인된 경우 그 근거의 메뉴 예시를 보여주며 존재하지 않는 버튼을 만들지 않는다.
- Token / Compact Agent / Extended Agent가 동일한 font·asset·official resource registry 및 full-spec path를 참조한다. Compact의 중복 안내를 줄여 Extended보다 짧게 유지한다.
- raw source loader, Source UI, Reference license evidence, Sources registry를 소스별 repository와 pinned revision에 연결했다.
- HTML / CSS / React 가짜 export나 iframe wrapper를 추가하지 않았다.
- 모든 신규 항목 검사가 끝난 뒤에만 새 raw/generated 배치를 기록한다. 불완전한 source batch가 기존 generated catalog를 부분 교체하지 않는다.

## Fonts

새 배포: **Pretendard Variable**, 제작자 공식 [orioncactus/pretendard](https://github.com/orioncactus/pretendard/tree/7aeb0698819be2b4097dae8ec8fe6a795e5cf3ae), commit `7aeb0698819be2b4097dae8ec8fe6a795e5cf3ae`.

- SIL OFL 1.1 전문, 원본 URL, commit, checksum, 로컬 license path를 registry에 기록했다. WOFF2 2,057,688 bytes, 변경 없이 로컬 배포한다.
- Pretendard가 원본 역할에 연결된 신규 브랜드: **29CM, KakaoBank, Musinsa, Kurly, Banksalad, 여기어때**. NAVER는 일부 역할의 원본 Inter를 적용한다. SOCAR는 역할별 family 연결 근거가 불충분하여 대체 글꼴로 표시한다.
- Toss Product Sans, KakaoBig/Small, BAEMINWORK, Hyundai/Samsung 전용 서체는 다운로드하지 않았다. Declared와 Rendered를 따로 표시한다.
- `verified-brand-font`, `verified-open-fallback`, `system-font`, `proprietary-unavailable`, `unknown` 상태와 기존 UI kind를 구분한다. 미해결 family는 unknown으로 남는다.
- 한국어 역할에서 적합한 공개 fallback으로 Pretendard를 사용한다. 원본 전용 서체를 재현했다는 뜻이 아니다.
- Baemin / NAVER / LINE의 공개 글꼴도 조사했지만, 회사가 공개했다는 이유로 원본 primary face에 자동 대입하지 않았다.
- 표본 문구 `브랜드의 목소리를 화면으로 · Aa Bb 0123`를 사용했다. 브랜드 광고 카피를 만들지 않았다.

CDP `CSS.getPlatformFontsForNode`와 실제 로컬 font load를 확인했다. 공개 폰트 역할의 한글은 로컬 Pretendard로 렌더링된다. NAVER의 Inter 역할은 영문 Inter와 한글 Pretendard를 사용하며 UI에 한글 대체 글꼴을 명시한다. 시스템 폰트 역할은 환경 의존 결과를 그대로 기록했다. [assets-browser-qa.json](../artifacts/brand-v22/assets-browser-qa.json).

## Logos

기존 Vercel / Supabase에 **Linear / KakaoBank**를 추가했다.

- Linear: 공식 Brand Assets ZIP의 검정/흰색 원본 wordmark. 가이드의 브랜드 언급 용도·여백·변형 금지·제휴 오인 금지 조건을 보존한다. 기존 logotype 표시 형식을 사용한다.
- KakaoBank: 공식 BrandAsset V2.0 ZIP의 Digital Symbol black/white SVG. 원본 비율·색·여백과 최소 크기를 유지한다.
- 두 파일의 ZIP URL, 원본 archive path, archive/file SHA-256, 확인일, 사용 조건, attribution은 [brandVerifiedAssets.json](../src/data/brandVerifiedAssets.json)과 각 `public/brand-assets/*/NOTICE.txt`에 있다.
- 로고는 문서의 브랜드 식별용이다. 회사와 DRH의 제휴·보증을 뜻하지 않으며 Agent export가 로고의 포괄적 재사용 허가를 주지 않는다.
- 이미지 `alt=""`와 인접/접근성용 브랜드 이름으로 중복 발화를 피한다. 로컬 load·natural dimensions·object-fit·filter 없음·light/dark 원본을 검증했다. [logo-variants.png](../artifacts/brand-v22/logo-variants.png).
- 나머지 87개는 text wordmark다. favicon 공개 또는 MIT repository라는 이유로 로고를 복제하지 않았다.

## Official Resources

기존 18개 URL을 live HTTP와 브라우저로 전수 재검증했다. 새로 검증한 국내 링크 9개를 더해 **22개 브랜드 / 27개 링크**다.

신규: Kakao login guide, KakaoBank brand resources, NAVER brand resources, 여기어때 Design Library, Samsung One UI, KakaoPay accessibility article, Toss TDS Mobile, current SEED Design, SOCAR brand center.

| 유형 | 링크 수 |
|---|---:|
| Design system | 7 |
| Brand guidelines | 6 |
| Assets | 8 |
| Typography | 2 |
| Developer design guide | 3 |
| Other | 1 |

- Apple HIG는 문서의 explicit canonical에 맞춰 trailing slash를 제거했다.
- OmD의 Kakao `/docs/latest/ko/…`는 현재 `/docs/ko/…`로 redirect된다. 원문은 그대로 두고 curated URL만 현재 주소로 등록했다.
- Karrot의 `v2.seed-design.io`는 여전히 열리지만 현재 공식 `seed-design.io`를 확인해 선택했다. 이를 redirect라고 기록하지 않았다.
- KakaoBank 페이지는 HTML canonical이 회사 홈으로 설정되어 있다. 관련 없는 홈으로 자동 치환하지 않고 실제 브랜드 리소스 페이지를 유지했다.
- KakaoPay 글은 design-system 대신 `other`로 등록했다. Banksalad GitHub 조직 홈을 design-system으로 등록하지 않았다.
- IBM Carbon은 200 응답이지만 이번 HTTP/브라우저 본문이 비어 있었다. 기존에 검증한 링크를 유지하되 **새로운 본문 검증은 보류**다.
- Baemin fonts는 공식 검색/자료에서 확인했으나 로컬 브라우저는 403 접근 제한이었다. 신규 링크 등록과 BAEMINWORK 배포를 보류했다.

정적 `audit:brand-resources`는 schema·공식 host allowlist·중복·근거·checkedAt을 검사한다. 네트워크는 명시적 `verify:brand-resources`로만 실행하며 HTTP status, redirect chain, final URL, canonical, title, headings, checkedAt을 JSON에 저장한다. HTTP 성공만으로 content relevance를 승인하지 않는다. build는 네트워크 상태에 의존하지 않는다.

증거: [live](../artifacts/brand-v22/official-resource-live.json), [browser](../artifacts/brand-v22/official-resource-browser.json), [reviewed content](../artifacts/brand-v22/official-resource-checks.json), [URL decisions](../artifacts/brand-v22/resource-url-decisions.json).

## Browser QA

Edge/Chromium의 실제 local Vite UI에서 검증했다.

- 기존 6개: Apple, Linear, Spotify, Ferrari, Nintendo 2001, Vercel.
- 신규 17개 전부: 총 **23 brands × 3 viewports = 69 cases**, 각 Card / Detail / Expanded 확인.
- 화면 크기: 1920×1080, 1440×1000, 390×844. reduced motion, mobile touch, section navigation, source access, local example controls, modal focus trap/Escape/close/focus restoration, offline 검증.
- page error 0, 외부 runtime asset request 0. 한국어/영어 alias 검색과 17개 raw URL의 원본 bytes/hash도 확인했다.
- Font/asset 전용 검사는 신규 17개와 기존 asset canary를 1440/390에서 확인했다. computed 선언만으로 판정하지 않았다.
- 스크린샷 contact sheets 및 개별 Detail/Expanded/typography/asset 화면을 검토했다. Card 캡처 fixture의 스크롤 이동 문제를 고쳐 지정 canary만 렌더링한다.
- Coupang의 새 source component projection을 보정한 뒤 3개 크기를 별도로 재검증했다. 최종 contact sheets에 반영했다.

증거: [69-case report](../artifacts/brand-v22/browser-qa.json), [focused final report](../artifacts/brand-v22-final/browser-qa.json), [font/asset report](../artifacts/brand-v22/assets-browser-qa.json), [search/raw report](../artifacts/brand-v22/search-raw-browser-qa.json), [desktop contact sheet](../artifacts/brand-v22/cards-1440.png), [mobile contact sheet](../artifacts/brand-v22/cards-390.png).

## Automated validation and reproducibility

통과: `typecheck`, `build`, `audit:references`, `audit:design-md`, `audit:brand-designs`, `audit:demos`, `audit:v1.4`, `audit:korean-brands`, `audit:brand-resources`.

원본 sync와 정적 감사를 반복 실행해 generated spec·catalog·정적 evidence·상태 문서 **98개 파일의 SHA-256이 동일**함을 확인했다. timestamp가 필요한 live evidence는 별도 명시적 갱신이다. [determinism.json](../artifacts/brand-v22/determinism.json).

## Remaining debt

1. IBM Carbon의 현재 본문 재검증, Baemin fonts의 브라우저 접근 제한 해소가 필요하다.
2. 전용/미확인 폰트는 원본 face로 제공하지 않는다. 표면별 family 연결이 모호한 역할은 미지정과 fallback으로 남아 있다.
3. 87개 브랜드의 로고는 text wordmark이며, 나머지 국내 후보는 문서의 근거 수준과 scope에 따라 보류했다.
4. 일부 reference는 확인된 공개 표면의 컴포넌트가 1–2개뿐이다. 존재하지 않는 앱 화면·상태를 보충하지 않았으며 원본 범위를 넘어선 fidelity를 주장하지 않는다.

이번 작업은 전용 브랜치에 한정한다. `main` 병합·원격 push·배포는 이 보고서의 완료 주장에 포함하지 않는다.
