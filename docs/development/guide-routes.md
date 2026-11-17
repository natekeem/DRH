# Guide Routes

GitHub Pages는 Vite가 만든 정적 파일을 제공하고 React Router의 HashRouter가 `#/` 뒤에 있는 경로를 해석합니다.

| 브라우저 경로 | 콘텐츠 |
| --- | --- |
| `#/guides` | 가이드 목록 |
| `#/guides/quickstart` | [5분 시작하기](../../src/content/guides/quickstart.md) |
| `#/guides/create-design-md` | [프로젝트 DESIGN.md 작성](../../src/content/guides/create-design-md.md) |
| `#/guides/apply-demo-code` | [Demo와 Code 적용](../../src/content/guides/apply-demo-code.md) |
| `#/guides/license-basics` | [라이선스 안내](../../src/content/guides/license-basics.md) |

`#/guides/<slug>#<heading-id>`는 문서 로드 후 해당 제목으로 이동합니다. 목차도 이 URL을 사용하므로 특정 절을 공유하거나 북마크할 수 있습니다.

가이드를 추가할 때는 [가이드 목록](../../src/content/guides/manifest.json)에 메타데이터를 넣고 같은 디렉터리에 `<slug>.md`를 추가하세요. URL을 공유한 뒤에는 slug를 유지하세요. `npm run audit:docs`는 가이드 등록과 Markdown 파일이 일치하는지, 상대 경로 링크와 가이드 링크가 유효한지 확인합니다.
