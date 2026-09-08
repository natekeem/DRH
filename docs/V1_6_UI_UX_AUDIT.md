# V1.6 UI/UX Precision & Demo Fidelity Audit

## 목표
Reference Hub의 기준 화면을 고도화하고, UI/UX 완성도를 높이며, Detail Demo의 Fidelity를 개선합니다.
이후 데이터 확장의 튼튼한 기반을 마련합니다.

## 변경 사항

### 1. Global Layout & Header
- **Full-width Header**: 데스크톱에서 Header를 화면 전체 폭에 가깝게 확장 (`width: calc(100% - 32px)`)하고 불필요한 검색 UI 제거.
- **Section Alignment**: 페이지 영웅 영역과 본문 콘텐츠 좌측 정렬선 완벽 일치 (Page Gutter 도입).
- **Navigation**: Footer 링크 계층 구조 최적화 및 IA 정리 (Explore, Guides, Sources, GitHub).

### 2. Typography & Markdown
- **한국어 타이포그래피**: `word-break: keep-all; text-wrap: balance/pretty` 전역 적용.
- **Markdown Engine**: `react-markdown` + `remark-gfm` 플러그인 교체로 복잡한 마크다운 규칙(표, 텍스트 효과 등) 완벽 지원.

### 3. Reference Detail Workspace
- **Header Line-up**: 좌측(Live Preview)과 우측(Artifact)의 상단 메타 영역 시작선을 픽셀 수준으로 정렬.
- **Height Sync**: 데스크톱에서 두 패널의 하단 높이 동기화 (`clamp(560px, 64vh, 820px)`), 내부 콘텐츠만 독립적으로 스크롤되도록 구조 개선.
- **Context Clarity**: 허브 창작 데모의 경우 의미 없는 출처 표기를 생략하고 콘텐츠에 집중할 수 있도록 개선.

### 4. Code Theme Unification
- **통일된 시각 언어**: Artifact 패널과 가이드라인 코드 블록 테마를 다크 모드(`background: #151515`, 명시적 가시성) 기반으로 통일.
- **구독성 보장**: 코드 스니펫은 가로 스크롤을, 마크다운 본문은 자동 줄바꿈을 지원하도록 적용.

### 5. Adaptive Demo Density
- **Variant 지원**: `DemoRenderer`가 `detail` 플래그를 넘겨받아 Card View와 Detail View에서 별도의 입자 밀도나 컴포넌트 렌더링 수를 가지도록 개선 (Meteors, Grid, Metaballs, Image Trail 등).

### 6. Guide 확장
- `writing-brand-design-md.md` 신규 가이드 작성. 브랜드용 DESIGN.md를 만들어 AI 코딩 에이전트에 주입하고 활용하는 구체적인 워크플로우 추가.
