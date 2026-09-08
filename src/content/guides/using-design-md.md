# 디자인 시스템을 Coding Agent에 전달하는 법

좋은 화면을 골랐다면 다음 단계는 그 화면의 규칙을 전달하는 일입니다. DRH에서는 Browse → See → Pick → Copy → Coding Agent 순서로 작업합니다. 외부 사이트에 접속할 수 없는 환경에서도 미리보기와 준비된 Artifact를 확인하고 저장할 수 있습니다.

## 1. DESIGN.md란?

DESIGN.md는 화면의 색상, 글자, 간격, 모서리, 컴포넌트와 동작 규칙을 Markdown으로 정리한 문서입니다. 실행 파일이 아니며, 파일을 두었다고 모든 도구가 자동으로 읽는다고 가정하면 안 됩니다. 작업을 요청할 때 파일 경로를 명시하고 먼저 읽도록 지시하세요.

DRH의 현재 DESIGN.md 프리셋은 자체 제작한 디자인 규칙입니다. 외부 브랜드의 실제 사이트나 이미지, 폰트를 소유하거나 배포한다는 의미가 아닙니다.

## 2. 모호한 Prompt보다 안정적인 이유

“고급스럽고 깔끔하게”에는 글자 크기나 카드 간격이 없습니다. Agent마다 다른 화면을 만들 수 있습니다. “본문 16px, 줄높이 1.6, 카드 패딩 24px, 지정된 primary 색상만 사용”은 결과를 비교하고 수정할 기준이 됩니다. 문서가 일관성을 돕지만 완벽한 재현을 보장하지는 않습니다. 실제 화면에서 검수해야 합니다.

## 3. 디자인 선택

탐색에서 목적에 맞는 Reference를 열고 미리보기를 조작해 보세요. 실제 동작이 필요한 경우 WORKING DEMO와 OFFICIAL LIVE를 우선 확인하고, PROTOTYPE은 구도와 개념 예시로 사용하세요. Source와 License도 함께 읽습니다.

한 화면에 여러 시스템을 섞기 전에 기본 시스템 하나를 정하세요. DRH의 [Minimal SaaS](#/reference/minimal-saas)는 중립적인 표면과 한 가지 강조색으로 시작할 수 있습니다. [Liquid Glass](#/reference/liquid-glass)는 특정 시각 효과를 추가하는 Reference입니다. 전체 페이지의 디자인 규칙과 장식 효과는 역할이 다릅니다.

## 4. Compact와 Extended

Compact는 핵심 값, 동작, 의존성, 금지 사항과 작은 시작 예시를 전달합니다. 토큰 한도가 작거나 이미 디자인 규칙을 읽힌 작업에 적합합니다. 생략된 동작이 필요한 경우 HTML이나 다른 코드 Artifact도 같이 전달하세요.

Extended는 목표, 구현 순서, 전체 시작 코드와 검수 조건까지 포함합니다. 재현력이 낮은 사내 LLM이나 첫 구현에는 Extended를 권장합니다. DRH에서 Agent와 DESIGN.md의 기본값입니다. 매우 긴 코드는 파일로 저장한 뒤 경로를 지정하면 대화창에 모두 붙여 넣을 필요가 없습니다.

## 5. Artifact마다 다른 역할

- Agent: 목표, 동작, 제약, 의존성, 코드와 검수 조건을 묶은 작업 지시서입니다.
- DESIGN.md: 디자인 의도와 반복해서 지켜야 할 규칙입니다. 실행 코드가 아닙니다.
- Tailwind: Tailwind v4 빌드에 추가할 테마입니다. 프로젝트 버전을 먼저 확인하세요.
- CSS: 변수와 스타일 규칙입니다. 효과별 CSS는 HTML의 DOM과 JavaScript가 함께 필요할 수 있습니다.
- Tokens: 기계가 읽을 JSON 값입니다. DRH의 정규화 구조이며 모든 디자인 도구의 공통 표준 포맷은 아닙니다.
- React: TSX 코드입니다. 일부 효과는 HTML 데모를 sandbox iframe으로 감싼 React wrapper이며 탭에 표시됩니다.
- HTML: 브라우저에서 실행할 수 있는 독립 데모입니다. 제품의 인증·저장·라우팅까지 구현한 것은 아닙니다.
- Source: 발견한 출처와 실제 Artifact의 구현 출처, License evidence입니다.

Reference마다 준비된 Artifact가 다릅니다. 탭이 없으면 해당 형식이 제공되지 않는 것입니다. DESIGN.md만 있다고 React 전체 페이지가 완성된 것으로 취급하지 마세요.

## 6. 프로젝트에 배치

다음은 배치 예시입니다. 기존 폴더 규칙이 있으면 그 규칙을 우선합니다. 같은 CSS나 Tailwind 테마를 중복 로드하지 마세요.

```text
project/
  DESIGN.md
  docs/reference-agent.md
  docs/reference-source.md
  src/styles/theme.css
  src/design/tokens.json
```

Download로 받은 문서를 넣고, CSS는 실제 앱 진입점에서 한 번 import합니다. Tokens JSON은 저장만으로 UI에 적용되지 않습니다. 기존 테마 매핑 또는 CSS 변수 생성에 사용하도록 지시하세요. 외부망이 차단됐다면 의존성 패키지를 사내 승인된 방법으로 먼저 확보하고, 외부 폰트 대신 문서의 시스템 폰트 fallback을 사용합니다.

## 7. Claude Code / Codex / Cursor 등에 전달

도구의 자동 파일 탐색을 기대하기보다 동일한 요청문에 파일 경로와 작업 범위를 명시하세요. 다음은 특정 도구의 설정 문법이 아닌 공통 작업 요청입니다.

```text
먼저 DESIGN.md와 docs/reference-agent.md를 읽고 핵심 토큰과 제약을 요약해 주세요.
현재 프로젝트의 프레임워크, 스타일 방식, 기존 컴포넌트를 확인하세요.
기존 규칙과 충돌하는 값이 있으면 구현 전에 충돌 지점을 설명하세요.
아래 작업 범위에만 적용하고, 실제 화면 검수 결과까지 알려 주세요.
```

문서가 길면 첫 단계에서 규칙을 정리하고, 다음 단계에서 화면 하나를 만들고, 마지막으로 데스크톱·모바일 검수를 요청하세요. 한 번에 사이트 전체를 다시 만들게 하는 것보다 수정 원인을 파악하기 쉽습니다.

## 8. 새 페이지 제작 예시 Prompt

```text
DESIGN.md와 docs/reference-agent.md를 먼저 읽으세요.
기존 앱 안에 팀 프로젝트 목록 페이지를 구현하세요.
제목, 검색 입력, 상태 필터, 프로젝트 카드 6개를 포함하세요.
CSS의 canvas/surface/text/primary 토큰을 그대로 사용하세요.
본문 16px, 줄높이 1.6, 카드 패딩 24px, 버튼 최소 높이 44px을 유지하세요.
390px에서는 1열, 1440px에서는 3열로 카드가 배치되게 하세요.
기존 라우터와 컴포넌트를 재사용하고 새 패키지는 추가하지 마세요.
검색과 필터는 실제로 동작하게 하고 빈 결과 상태를 제공하세요.
Tab 조작, focus 표시, reduced-motion, 가로 overflow를 검수하세요.
```

예시의 수치는 선택한 시스템의 값으로 바꿉니다. 이름만 다른 색상이나 임의의 그림자를 만들지 않도록 명시하세요.

## 9. 기존 UI 수정 예시 Prompt

```text
DESIGN.md를 읽고 기존 설정 페이지의 시각적 일관성을 개선하세요.
저장 API, 필드 이름, 유효성 검사, 라우트와 상태 관리는 보존하세요.
색상, 타이포, 간격, 모서리만 문서의 토큰으로 맞추세요.
기존 Button과 Input 컴포넌트를 재사용하세요.
변경 전후 스크린샷을 같은 viewport로 비교하세요.
390×844와 1440×1000에서 오류 문구, 키보드 focus, 저장 동작을 확인하세요.
변경 파일과 검수 결과를 보고하세요.
```

## 10. 잘 안 될 때

- 색상이 달라지면 CSS가 실제로 로드됐는지, 기존 전역 규칙이 덮는지 확인합니다. 먼저 계산된 색상 값을 비교하세요.
- 간격이 매번 바뀌면 토큰 이름과 사용 위치를 한 쌍으로 지정합니다. “카드 패딩은 space-4”처럼 요청하세요.
- 버튼이 그림으로만 나오면 클릭 후 상태, 종료 조건, 키보드 동작을 지시합니다.
- 효과가 멈추면 reduced-motion 설정, WebGL 지원 여부, 화면 밖에서의 정지 정책을 확인합니다.
- Agent가 잘린 코드를 만들면 Extended를 파일로 저장하고 읽을 경로를 명시합니다. 하나의 컴포넌트부터 구현하세요.
- 외부 폰트·패키지 요청이 실패하면 내부망에서 사용 가능한 의존성과 fallback을 먼저 정합니다.
- PROTOTYPE에서 완성 페이지를 기대했다면 작업 범위를 줄이거나 부족한 동작을 별도로 구현하고 검수합니다.

## 11. Copy-ready template

대괄호를 채워서 작업 요청으로 사용하세요.

```text
작업: [새 페이지 / 기존 UI 수정]
대상: [파일 또는 라우트]
먼저 읽을 자료: DESIGN.md, docs/reference-agent.md, docs/reference-source.md
프로젝트 스택: [현재 프레임워크와 버전]
목표: [사용자가 완료할 행동 한 가지]
필수 요소: [제목, 입력, 목록, CTA 등]
보존할 기능: [API, 상태, 라우팅, 접근성]
적용할 토큰: [색상, 글자 크기, 패딩, radius의 정확한 값]
상호작용: [trigger → state → 완료/실패 상태]
금지: 임의 색상, 불필요한 의존성, 허가 없는 브랜드 자산 복제
반응형: 390×844 및 1440×1000, 가로 overflow 없음
검수: 키보드, focus, reduced-motion, 실제 클릭 동작, 콘솔 오류
결과: 변경 파일, 실행 방법, 검수 증거와 남은 제한
```

## 출처와 이용 범위

[Refero Styles](https://styles.refero.design/)는 2026-09-08 확인 시 2,000+ AI-readable design systems를 안내하며, 개별 Style 화면에 DESIGN.md, Tailwind v4, CSS Variables, Design Tokens와 Compact/Extended를 제공합니다. 디자인 규칙을 전달하는 방식의 사례로 소개합니다. 무료 browse/copy 안내를 DRH의 대량 재배포 허가로 해석하지 않습니다. 이 가이드와 템플릿은 DRH가 독립 작성했으며 Refero의 Prompt 원문은 포함하지 않습니다.

[VoltAgent awesome-design-md](https://github.com/VoltAgent/awesome-design-md)의 공개 저장소는 [MIT License](https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE)를 제공합니다. 향후 공개 design-md dataset을 가져올 때 해당 revision과 고지를 보존합니다. getdesign.md의 유료 Starter Kit은 별도 범위이며 이 Hub로 재배포하지 않습니다. 외부 브랜드 이미지·로고·폰트의 권리는 문서의 코드 라이선스와 별도로 확인해야 합니다.
