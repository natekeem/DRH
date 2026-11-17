# Scripts

저장소 루트에서 `package.json`의 명령으로 실행합니다.

| 위치 | 역할 |
| --- | --- |
| [audits](audits/) | 카탈로그, 데모, 브랜드, 문서의 검증 |
| [sync](sync/) | 원본 DESIGN.md, 브랜드 이미지, 로컬 폰트 가져오기 |
| [verify](verify/) | 외부 출처 및 리소스의 라이브 확인 |
| [reports](reports/) | 데모 렌더링 경로 요약 생성 |
| [lib](lib/) | 감사와 동기화가 공유하는 변환 및 보고서 코드 |

일반 변경 검증에는 `npm run check`를 사용하세요. 동기화 명령은 카탈로그 데이터와 에셋을 갱신하므로 원본을 갱신할 때 실행합니다. 한 번 쓰는 조사 스크립트나 다운로드 중인 샘플은 `.local/`에 보관합니다.

[검증 방법](../docs/development/validation.md)과 [생성물 위치](../artifacts/README.md)를 함께 참고하세요.
