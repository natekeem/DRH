# DRH 5분 시작하기

Reference 하나를 골라 프로젝트의 화면 하나에 적용하는 과정입니다.

## 1. Reference 선택

Explore에서 원하는 디자인을 고르세요. Source와 복사 가능 범위를 확인합니다.

## 2. Demo 확인

버튼·입력·탭을 직접 조작하고 모바일 크기도 확인하세요. Brand Reference는 **Catalog**에서 구성요소를 비교하고 **In Context**에서 적용 느낌을 봅니다. 적용 예시는 공식 제품 화면이 아닙니다. Prototype은 미완성 범위를 확인하세요.

## 3. DESIGN.md / Agent 가져오기

Brand Detail 마지막의 **Download DESIGN.md**로 원본을 저장하세요. 프로젝트 루트의 `DESIGN.md`로 둡니다. DESIGN.md가 없는 Reference는 Artifact workspace에서 Agent Package를 저장합니다.

## 4. 적용 prompt 전달

**Copy apply prompt**를 눌러 Coding Agent에게 전달하고, 수정할 화면을 한 문장으로 덧붙이세요. 다른 Reference에는 아래처럼 요청할 수 있습니다.

```text
기존 프로젝트 구조와 기능을 먼저 확인하세요.
첨부한 DESIGN.md 또는 Agent Package를 참고해 요청한 화면을 수정하세요.
근거 없는 규칙이나 에셋을 만들지 말고, 프로젝트 규칙과 충돌하면 알려주세요.
완료 후 390px / 1440px에서 화면과 키보드 동작을 확인하세요.
```

## 5. 결과 비교

DRH 예시와 실제 화면의 색·글자·간격·모서리를 비교하세요. 입력과 클릭이 작동하는지, 모바일에서 잘리지 않는지도 확인합니다. 브랜드 전용 폰트의 대체 표시와 에셋 권리 조건은 그대로 유지합니다.

더 필요한 내용만 이어서 읽으세요: [코드 적용과 검수](#/guides/apply-demo-code) · [내 프로젝트 DESIGN.md 만들기](#/guides/create-design-md) · [라이선스 안내](#/guides/license-basics).
