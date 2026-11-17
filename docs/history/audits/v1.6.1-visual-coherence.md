# V1.6.1 Visual Coherence Pass

## 목적
DRH V1.6에서 시도된 전면 Dark Theme(Artifact Workspace) 구성을 되돌리고, 사이트 전반의 시각적 일관성(Visual Coherence)을 확보합니다.
Light Base Theme와 읽기 편한 Dark Code Viewer를 조합하고, 주요 페이지와 컴포넌트의 가독성 및 계층을 정리했습니다.

## 변경 사항

### 1. Artifact Workspace (Light Shell + Dark Viewer)
- **Light Shell 복원**: `ArtifactWorkspace`의 외부 패널, 탭, 컴팩트/확장 토글, 다운로드/복사 버튼, 출처 표기는 V1.5의 밝고 부드러운 스타일로 복구했습니다.
- **Dark Viewer 분리**: 실제 코드, DESIGN.md 본문이 표시되는 `<pre>` 뷰어만 어두운 테마(배경 `#161616`, 테두리 `#2b2b2b`)로 분리해 시인성을 높이고 코드 가독성을 보장했습니다.
- **Segmented Control 개선**: Compact / Extended 토글이 CTA 버튼처럼 보이지 않고 단순한 View Switcher로 보이도록(회색 배경, 선택 시 흰색 카드) 수정했습니다.

### 2. Reference Workspace Context 2-Column
- 기존의 불규칙한 Preview Description과 Context 영역을 두 열(2-Column) 레이아웃으로 완벽히 병합했습니다.
  - **Left (ABOUT THIS REFERENCE)**: 설명, Maturity, 태그
  - **Right (WHERE IT FITS)**: 사용처, 프레임워크, 의존성
- **Source 분리**: Hub Original이 아닌 외부 출처가 있을 때만 `SOURCE / PROVENANCE` 섹션을 컨텍스트 아래에 별도로 노출합니다.

### 3. Sources UI 정리
- **신호등 이모지 제거**: 직관적이지 않은 🟢 🟡 🔴 이모지를 제거하고, 의미가 명확한 텍스트 배지(`가져오기 가능`, `참고 전용`, `제한`)로 교체했습니다.
- **Table 가독성 강화**: `.source-row`의 타이포그래피 계층을 재조정해 스캔이 빠르도록 수정했습니다.
- **Schema 확장**: 향후 실제 프리뷰 이미지를 연동할 수 있도록 `SourceRecord` 타입에 `previewSchema` 속성을 안전하게 추가했습니다.

### 4. Guides Page Layout
- 가이드 Article 본문의 강제 `max-width: 980px` 페이지 래퍼를 해제했습니다.
- 사이트 전체가 공유하는 좌우 여백(`--page-gutter`)을 동일하게 사용하며, 실제 읽기 폭(Reading Column)만 `max-width: 920px`로 제한하여 일관성을 맞췄습니다.

### 5. Footer 재구성
- 화면 양쪽 끝에 흩어져 있던 요소를 모아 콤팩트한 2-Row 구조로 재구성했습니다.
- 좌측에는 브랜드명과 짧은 슬로건, 우측 상단에는 내비게이션, 하단에는 짧은 `MIT · Source Policy` 표기를 배치했습니다.
