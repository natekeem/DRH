# Design Reference Hub

웹 UI의 패턴, 모션, 배경, 페이지 구성과 브랜드 `DESIGN.md`를 살펴보는 레퍼런스 라이브러리입니다. 미리보기에서 동작을 확인하고 상세에서 Agent Package, 실행 가능한 코드 또는 원본 자료를 확인할 수 있습니다.

[웹 앱 열기](https://natekeem.github.io/DRH/) · [저장소 문서 안내](docs/README.md)

## 로컬 실행

GitHub Pages의 빌드 환경에 맞춰 Node.js 22 이상을 사용합니다.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run preview
```

`check`는 타입 검사, 프로덕션 빌드, 저장소의 감사 스크립트를 실행합니다. 미리보기와 내보내기 동작을 브라우저에서 확인하는 방법은 [Validation](docs/development/validation.md)에 있습니다.

## 앱 경로

| 경로 | 화면 |
| --- | --- |
| `#/` | 홈과 예제 |
| `#/explore` | Reference 목록과 필터 |
| `#/explore?view=collections` | 주제별 컬렉션 |
| `#/reference/<id>` | 미리보기, 출처, 구현 자료 |
| `#/guides` | 사용 가이드 |
| `#/sources` | 출처와 라이선스 조사 목록 |

가이드 본문과 제목에 대한 URL은 [Guide Routes](docs/development/guide-routes.md)에서 확인할 수 있습니다.

## 저장소 배치

| 위치 | 내용 |
| --- | --- |
| [src/](src/) | React 앱, 레퍼런스 데이터, 데모 구현, 가이드 원문 |
| [public/](public/) | 실행 시 제공하는 에셋과 원본 서드파티 문서 |
| [docs/](docs/README.md) | 유지보수 문서, 품질 및 출처 기준, 변경 이력 |
| [scripts/](scripts/README.md) | 감사, 데이터 동기화, 보고서 생성과 출처 확인 |
| [tests/](tests/) | 브라우저 QA, 재현용 샘플과 데이터 |
| [artifacts/](artifacts/README.md) | 검증 시점의 결과와 현재 로컬 리포트 |
| [reference/](reference/README.md) | 초기 버전과 조사 자료 |

새 Reference는 [데이터 목록](src/data/references.ts)에 추가합니다. 카드, 상세, 내보내기는 가능한 한 동일한 구현을 공유합니다. 수정 전에 [Reference Quality Standard](docs/REFERENCE_QUALITY_STANDARD.md)를 읽고 출처와 구현 자료를 확인하세요.

## 배포

`main`에 푸시하면 [GitHub Pages 워크플로](.github/workflows/deploy-pages.yml)가 `dist/`를 빌드해 배포합니다. Vite의 상대 base 경로와 HashRouter가 GitHub Pages의 프로젝트 하위 경로에서 동작하도록 합니다.

## 라이선스

저장소 코드는 [MIT](LICENSE)입니다. 외부 디자인 문서, 폰트, 로고 및 구현 자료는 각 항목의 출처와 고지에 따릅니다. [Source & License Policy](docs/standards/source-license.md)와 [Third-Party Attribution](docs/sources/third-party-attribution.md)을 참고하세요.
