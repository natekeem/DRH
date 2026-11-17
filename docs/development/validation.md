# Validation

GitHub Pages 워크플로와 동일한 Node.js 22 이상에서 실행하세요.

```sh
npm ci
npm run check
```

`check`는 타입 검사, 프로덕션 빌드, `package.json`에 등록된 모든 `audit:*` 명령을 순서대로 실행합니다. 특정 부분만 작업할 때는 `npm run audit:docs`, `npm run audit:demos`, `npm run audit:references`처럼 개별 명령을 실행할 수 있습니다. 생성된 카탈로그 상태와 감사 결과는 `artifacts/local/audits/`에 기록됩니다.

시각적 변경은 Playwright가 연결된 Edge에서 확인하세요. Playwright가 없다면 `npm install --no-save --package-lock=false playwright`로 로컬에 설치하거나 `PLAYWRIGHT_PATH`에 기존 모듈 경로를 지정합니다. 개발 서버를 실행한 뒤 실제 서버 주소를 `DRH_URL`에 지정하세요.

| 확인할 동작 | 실행 파일 |
| --- | --- |
| 가이드 URL, 목차, 바로가기 | [guides/browser-qa.mjs](../../tests/guides/browser-qa.mjs) |
| 탐색 카드의 마우스·터치 입력과 제목 링크 | [catalog-preview-qa.mjs](../../tests/reference-additions/catalog-preview-qa.mjs) |
| 모션 상세, 동작 줄이기, 패널 정렬 | [navigation-motion-qa.mjs](../../tests/reference-additions/navigation-motion-qa.mjs) |
| 신경망과 Matrix 배경을 내보낸 HTML | [generative-backgrounds-qa.mjs](../../tests/reference-additions/generative-backgrounds-qa.mjs) |
| WebGL 가속 데모의 내보내기와 독립 실행성 | [advanced-demos/audit.mjs](../../tests/advanced-demos/audit.mjs) |
| 브랜드 상세와 전체 화면 | [브랜드 미리보기 기준](../standards/brand-design-preview.md) |

최소 1440×1000과 390×844에서 핵심 조작과 오버플로를 보고, 동작 줄이기 설정을 확인합니다. 시각적 결과를 기록할 때는 [품질 기준](../REFERENCE_QUALITY_STANDARD.md)에 따라 실제 브라우저에서 확인한 범위를 명시하세요.
