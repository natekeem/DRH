# Demo와 Code를 내 프로젝트에 붙이는 법

Reference를 이미 골랐다면 필요한 파일을 저장하고 기존 앱에 연결하세요. 처음이라면 [5분 시작하기](#/guides/quickstart)로 충분합니다.

## 1. 제공 범위 확인

**Working Demo**는 동작하는 예시, **Prototype**은 미완성 범위가 있는 예시입니다. Source의 라이선스와 각 Artifact의 출처를 확인하세요. 문서 MIT가 로고·폰트·이미지 사용까지 허용하는 것은 아닙니다.

| Artifact | 사용할 때 |
|---|---|
| DESIGN.md | 색·타입·간격 등 원본 규칙을 참고할 때 |
| Agent | 구현 동작·제약·검수 기준을 전달할 때. 깊은 구현에는 Extended 사용 |
| HTML | 파일 하나로 예시를 실행할 때 |
| React | native TSX인지 React Wrapper인지 표시를 확인한 뒤 앱에 연결할 때 |
| CSS | 함께 제공된 DOM·동작 코드에 스타일을 적용할 때 |
| Tokens / Tailwind | 프로젝트의 토큰 구조와 Tailwind 버전에 맞춰 연결할 때 |

탭이 없으면 해당 형식은 제공하지 않습니다. Brand Catalog의 In Context는 DRH의 적용 예시이며, 공식 제품 코드 export가 아닙니다.

## 2. 파일을 저장하고 실행

Brand Detail 마지막에서 **Download DESIGN.md**와 **Copy apply prompt**를 바로 사용할 수 있습니다. DESIGN.md는 프로젝트 루트에, Extended Agent는 `docs/reference-agent.md` 등에 저장하세요. HTML이 있으면 먼저 독립 실행하여 동작을 확인합니다.

의존성은 실제 Artifact에 적힌 것만 확인하고 프로젝트 버전과 대조합니다. 존재하지 않는 React 구현을 HTML wrapper로 대체하여 native 구현이라고 부르지 마세요.

## 3. 기존 프로젝트에 연결

```text
기존 라우터, 컴포넌트, 상태 관리와 스타일 방식을 먼저 확인하세요.
./DESIGN.md와 ./docs/reference-agent.md 중 제공된 파일을 읽고,
요청한 화면 하나에 디자인과 동작을 적용하세요.
기존 기능을 유지하고 새로운 패키지가 필요한 이유를 설명하세요.
원본이 정의하지 않은 브랜드 상태나 에셋을 만들지 마세요.
프로젝트 규칙과 충돌하면 구현 전에 알려주세요.
```

실제 서비스 데이터·인증·저장은 프로젝트의 기존 로직을 연결합니다. 샘플 버튼의 피드백이나 가상의 요금은 제품 동작·정책을 뜻하지 않습니다. 전용 폰트가 제공되지 않으면 기록된 fallback을 유지하세요.

## 4. 화면과 동작 검수

390×844와 1440×1000에서 가로 넘침, 텍스트 잘림, 간격과 글자 위계를 확인하세요. 키보드 Tab·Enter·Escape, 입력, 빈 결과, 모달 focus 복귀를 실제로 조작합니다. Reduced motion과 화면 재진입도 확인하세요.

색이나 테두리가 다르면 브라우저의 computed style에서 전역 CSS가 source 규칙을 덮는지 확인합니다. 글꼴은 선언뿐 아니라 실제 로딩과 표시 폰트를 확인하세요. DRH의 축소 미리보기와 원본 DESIGN.md 수치는 구분해야 합니다.

## 5. 출처와 결과 보존

변경 파일, 실행 방법, 검수 결과와 남은 한계를 기록합니다. 원본 revision·라이선스 전문·에셋 고지를 함께 보존하세요. 자세한 권리 조건은 [라이선스 안내](#/guides/license-basics), 새 디자인 규칙 작성은 [DESIGN.md 만들기](#/guides/create-design-md)를 참고하세요.
