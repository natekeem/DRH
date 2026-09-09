# Demo와 Code를 내 프로젝트에 붙이는 법

> DRH에서 가져온 효과와 코드를 실제 앱에 안전하게 옮기는 과정

이 Guide는 DRH의 Demo나 코드를 내 프로젝트에 실제로 옮기고 싶을 때 읽습니다. Reference를 고르고 Agent Package를 복사하는 기본 과정은 [DRH 5분 시작하기](#/guides/quickstart)를, 디자인 규칙을 직접 만드는 방법은 [내 프로젝트 DESIGN.md 만들기](#/guides/create-design-md)를 먼저 읽어 주세요.

이 Guide에서는 "Command Palette(키보드 단축키로 여는 명령 목록) 추가하기"를 예제로 처음부터 끝까지 진행합니다.

---

## DRH Artifact 유형 한눈에 보기

DRH의 Reference 상세 페이지에는 여러 탭이 있습니다. 각 탭의 역할은 다릅니다:

| 탭 | 한 줄 설명 | 용도 |
|---|---|---|
| **HTML** | 혼자 실행해 보는 완성 예제 | 브라우저에서 바로 열어서 동작 확인 |
| **React** | 앱에 옮길 때 참고할 코드 | TSX 코드. 일부는 HTML Demo를 iframe으로 감싼 wrapper |
| **CSS** | 모양을 정하는 스타일 규칙 | 변수와 스타일. 효과별로 HTML의 DOM/JS가 함께 필요할 수 있음 |
| **Agent** | AI에게 일을 시키는 설명서 | 목표, 동작 규칙, 코드 예시, 검수 조건 |
| **DESIGN.md** | 계속 지킬 디자인 규칙 | 색상, 간격, 모서리 등 반복 사용할 값 |
| **Tailwind** | Tailwind v4 테마 | 프로젝트의 Tailwind 버전을 먼저 확인 |
| **Tokens** | 기계가 읽을 JSON 값 | DRH의 정규화 구조. 모든 디자인 도구의 공통 표준은 아님 |
| **Source** | 출처와 라이선스 | 원본 출처, 구현 출처, License 정보 |

Reference마다 준비된 탭이 다릅니다. 탭이 없으면 해당 형식이 제공되지 않는 것입니다.

---

## Step 1. Copy OK 확인

**지금 할 일:** Reference 상세 페이지에서 Copy 표시를 확인하세요.

- **Copy OK**: DRH가 준비한 코드를 가져가기 쉬운 항목입니다.
- **Reference only**: 화면 아이디어만 참고하세요. 코드를 그대로 가져가기 어려울 수 있습니다.

**왜:** 모든 Reference가 코드를 바로 복사할 수 있는 상태는 아닙니다. 먼저 확인하면 시간을 아낍니다.

**완료 확인:** Copy 표시를 확인했습니다.

---

## Step 2. Working Demo 확인

**지금 할 일:** Demo 영역의 상태를 확인하세요.

- **WORKING DEMO**: 실제 동작하는 코드입니다.
- **PROTOTYPE**: 구도와 개념 예시입니다. 일부 동작이 빠져 있을 수 있습니다. production-ready가 아닙니다.
- **OFFICIAL LIVE**: 원본 사이트로 연결됩니다.

예제에서: Command Palette Reference가 WORKING DEMO인지 확인합니다. PROTOTYPE이라면 키보드 단축키 동작이나 검색 기능이 빠져 있을 수 있으므로, 직접 구현할 부분을 미리 파악하세요.

**완료 확인:** Demo 상태를 알고 있고, PROTOTYPE이라면 빠진 동작을 메모했습니다.

---

## Step 3. HTML이 있으면 먼저 독립 실행

**지금 할 일:** HTML 탭이 있으면, 내용을 복사해서 `test.html`로 저장하고 브라우저에서 열어 보세요.

```text
1. HTML 탭의 내용을 전체 복사
2. 빈 파일에 붙여넣고 test.html로 저장
3. 브라우저에서 파일 열기 (더블클릭 또는 드래그)
4. 동작 확인: 키보드 단축키(Cmd+K / Ctrl+K)로 Command Palette가 열리는지
```

**왜:** 내 프로젝트에 넣기 전에, 코드 자체가 제대로 동작하는지 먼저 확인합니다. 여기서 안 되면 프로젝트 문제가 아니라 코드 자체의 문제입니다.

HTML 탭이 없으면 이 단계를 건너뛰세요.

**완료 확인:** HTML이 브라우저에서 독립적으로 동작했거나, HTML 탭이 없어서 건너뛰었습니다.

---

## Step 4. Agent Package 읽기

**지금 할 일:** Agent 탭에서 Extended 버전을 복사하거나 다운로드하세요. 파일로 저장한다면 `docs/reference-agent.md`를 추천합니다.

내용을 훑어보면서 확인할 것:
- **목표**: 이 코드가 무엇을 하는지
- **의존성(Dependencies)**: 추가 패키지가 필요한지
- **제약 사항**: 하지 말아야 할 것
- **검수 조건**: 완성 기준

자세한 Agent Package 복사 과정은 [DRH 5분 시작하기 — Step 5](#/guides/quickstart)를 참고하세요.

**완료 확인:** Agent Package를 저장했고, 의존성과 제약 사항을 파악했습니다.

---

## Step 5. Dependencies 확인

**지금 할 일:** Agent Package에 적힌 의존성(Dependencies) 목록을 확인하세요. 추가 패키지가 필요하면 먼저 설치하세요.

예제에서: Command Palette가 `cmdk` 패키지를 요구한다면:

```text
npm install cmdk
```

확인할 것:
- 내 프로젝트의 프레임워크 버전과 호환되는지
- 사내망에서 패키지를 받을 수 있는지 (외부망이 차단된 환경)
- 이미 비슷한 기능의 패키지가 설치되어 있는지

의존성이 없다면(순수 CSS/HTML만 사용) 이 단계를 건너뛰세요.

**완료 확인:** 필요한 패키지를 설치했거나, 의존성이 없어서 건너뛰었습니다.

---

## Step 6. 기존 앱 구조 확인

**지금 할 일:** 내 프로젝트의 구조를 확인하세요.

```text
Agent에게: 현재 프로젝트의 프레임워크, 스타일 방식, 기존 컴포넌트 목록을 확인해 줘.
```

예제에서 확인할 것:
- React / Vue / Svelte 중 어느 것을 쓰는지
- CSS Modules / Tailwind / styled-components 중 어느 것을 쓰는지
- 키보드 단축키를 처리하는 기존 방식이 있는지
- Modal이나 Dialog 컴포넌트가 이미 있는지

**왜:** DRH의 코드를 그대로 붙이면 기존 스타일과 충돌할 수 있습니다. 기존 구조를 먼저 파악하면 어떤 부분을 바꿔야 하는지 알 수 있습니다.

**완료 확인:** 프로젝트의 프레임워크와 스타일 방식을 파악했습니다.

---

## Step 7. 작은 component 하나에 적용

**지금 할 일:** Agent에게 아래 prompt를 보내세요.

예제 — Command Palette 추가:

```text
먼저 ./docs/reference-agent.md를 읽어 줘.
현재 프로젝트 구조를 확인하고, Command Palette 컴포넌트 하나만 만들어 줘.
Ctrl+K (Mac은 Cmd+K)로 열리고, ESC로 닫히게 해.
기존 라우터의 페이지 목록을 검색 결과로 보여 줘.
기존 Dialog/Modal 컴포넌트가 있으면 재사용해.
새 패키지가 필요하면 먼저 알려 주고 확인을 기다려.
390px에서도 정상 동작하는지 확인해.
끝나면 변경 파일 목록과 실행 방법을 알려 줘.
```

**왜:** 한 번에 여러 컴포넌트를 만들지 마세요. 하나만 먼저 만들어서 기존 프로젝트와 잘 어울리는지 확인합니다.

**완료 확인:** Agent가 컴포넌트 코드를 생성했고, 실행 방법을 알려 줬습니다.

---

## Step 8. Card/Detail과 실제 결과 비교

**지금 할 일:** 만들어진 결과를 DRH의 Demo와 비교하세요.

| 비교 항목 | DRH Demo | 내 프로젝트 |
|---|---|---|
| 열기 단축키 | Cmd+K / Ctrl+K | 동일한가? |
| 검색 동작 | 실시간 필터 | 동작하는가? |
| 닫기 | ESC + 바깥 클릭 | 둘 다 되는가? |
| 애니메이션 | 열릴 때 fade/scale | 비슷한가? |
| 빈 결과 | "결과 없음" 표시 | 있는가? |

완벽히 같을 필요는 없습니다. 핵심 동작이 동일하면 됩니다. DESIGN.md가 있다면 색상과 간격이 그 규칙을 따르는지도 확인하세요.

**완료 확인:** 핵심 동작이 Demo와 일치합니다.

---

## Step 9. Mobile / Reduced-Motion 확인

**지금 할 일:** 두 가지를 추가로 확인하세요.

### 모바일 (390px 너비)
- 브라우저 개발자 도구(F12)에서 모바일 뷰를 열어 보세요.
- Command Palette가 화면 밖으로 넘치지 않는지 확인하세요.
- 터치로 항목을 선택할 수 있는지 확인하세요.

### Reduced-motion (애니메이션 최소화)
- 운영체제 설정에서 "동작 줄이기"를 켜거나, 개발자 도구에서 `prefers-reduced-motion: reduce`를 시뮬레이션하세요.
- 애니메이션 없이도 열기/닫기가 정상 동작하는지 확인하세요.

**왜:** 실제 사용자 중 모바일 비율이 높고, 일부 사용자는 애니메이션을 끄고 사용합니다. 여기서 확인하지 않으면 나중에 버그 리포트를 받습니다.

**완료 확인:** 모바일 뷰와 reduced-motion 상태에서 정상 동작합니다.

---

## Step 10. Source / License 보존

**지금 할 일:** DRH의 Source 탭을 확인하세요.

- 원본 출처(어디서 영감을 받았는지)
- License 정보(MIT, Apache 등)

코드를 가져왔다면 프로젝트에 출처를 기록하세요:

```text
my-project/
  docs/reference-source.md    ← 출처와 라이선스 기록
```

파일 안에 간단히:

```markdown
## Command Palette
- 참고: DRH [Reference 이름]
- 원본: [출처 URL]
- License: [MIT / Apache / 등]
- 가져온 날짜: [날짜]
```

**왜:** 외부 브랜드 이미지·로고·폰트의 권리는 코드 라이선스와 별도입니다. Reference의 브랜드 자산을 자유롭게 쓸 수 있다고 가정하지 마세요. 코드와 디자인 규칙만 참고하세요.

**완료 확인:** Source 탭을 확인했고, 필요한 출처를 기록했습니다.

---

## Copy-ready prompts

### Demo를 프로젝트에 옮기기

```text
먼저 ./docs/reference-agent.md를 읽어 줘.
[컴포넌트 이름]을 현재 프로젝트에 추가해 줘.
기존 스타일 방식([CSS Modules / Tailwind / etc.])에 맞춰 줘.
기존 컴포넌트([Dialog, Button 등])를 재사용해.
새 패키지가 필요하면 먼저 알려 주고 확인을 기다려.
390px, 1440px에서 레이아웃을 확인해.
reduced-motion 설정을 존중해.
변경 파일, 실행 방법, 검수 결과를 알려 줘.
```

### 기존 UI에 효과 적용하기

```text
먼저 ./docs/reference-agent.md를 읽어 줘.
기존 [페이지/컴포넌트 이름]에 [효과 이름] 효과를 적용해 줘.
기존 기능(API, 상태 관리, 라우팅, 접근성)은 보존해.
CSS만 바꾸고 구조는 유지해.
prefers-reduced-motion: reduce일 때 대체 동작을 만들어.
변경 전후를 같은 viewport(390px, 1440px)에서 비교해.
변경 파일과 검수 결과를 알려 줘.
```

---

## 잘 안 될 때

| 증상 | 해결 방법 |
|---|---|
| HTML은 되는데 프로젝트에서 안 된다 | 프로젝트의 CSS 초기화(reset)가 Demo 스타일을 덮는지 확인 |
| 효과가 멈추거나 깨진다 | reduced-motion 설정, WebGL 지원 여부, 화면 밖 정지 정책 확인 |
| Agent가 잘린 코드를 만든다 | Extended를 파일로 저장하고 경로 명시. 컴포넌트 하나씩 요청 |
| 외부 패키지를 못 받는다 | 사내 승인된 방법으로 먼저 확보. 외부 폰트 대신 시스템 폰트 fallback |
| PROTOTYPE에서 완성을 기대했다 | PROTOTYPE은 구도 예시임. 부족한 동작을 별도로 구현 |
| 기존 스타일과 충돌한다 | CSS 우선순위 확인(F12). 필요하면 scope를 좁혀서 적용 |

---

## ✅ 여기까지 됐으면 성공

- [ ] Copy OK를 확인했다
- [ ] Working Demo 상태를 확인했다
- [ ] HTML을 독립 실행해 봤다 (있을 때)
- [ ] Agent Package를 저장했다
- [ ] Dependencies를 확인하고 설치했다 (필요할 때)
- [ ] 기존 앱 구조를 확인했다
- [ ] 컴포넌트 하나를 만들었다
- [ ] Demo와 실제 결과를 비교했다
- [ ] 모바일과 reduced-motion을 확인했다
- [ ] Source/License를 기록했다

---

## 다음 단계

- DRH 기본 사용법을 다시 보고 싶다면 → [DRH 5분 시작하기](#/guides/quickstart)
- 내 프로젝트만의 디자인 규칙을 만들고 싶다면 → [내 프로젝트 DESIGN.md 만들기](#/guides/create-design-md)

---

## 출처

이 가이드와 템플릿은 DRH가 독립 작성했습니다. 디자인 규칙 전달 방식의 사례로 [Refero Styles](https://styles.refero.design/)를 참고합니다. 외부 브랜드 이미지·로고·폰트의 권리는 코드 라이선스와 별도로 확인해야 합니다.
