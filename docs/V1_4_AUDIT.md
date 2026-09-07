# V1.4 Production Quality Audit

검수일: 2026-09-08. 대상: 93 references, HashRouter 기반 Explore와 상세 화면. 기존 ShaderGradient 랜딩의 시각 정체성을 유지했다.

## 결과

- Official Live 1 / Working Demo 45 / Prototype 47 / Link Only 0.
- Agent Package Ready 43 / Partial 50 / Missing 0.
- 실행 HTML 43개 중 Fluid Cursor는 Partial이다. Ready는 HTML 42개와 공식 ShaderGradient TSX 1개다. 공식 TSX는 선택한 10개 preset 각각의 값을 내보낸다.
- 전체 항목별 판정: [Demo Status](V1_4_DEMO_STATUS.md), [Agent Package Status](V1_4_AGENT_PACKAGE_STATUS.md).

## UX와 근본 원인

기존 route effect가 query 변경까지 새 페이지처럼 취급해 Explore의 필터 변경에 scroll reset이 발생했다. pathname 전환과 query 변경을 구분하고 history entry별 위치를 저장한다. POP은 저장 위치를 복원하며 상세 화면의 탐색으로 버튼도 기존 Explore history로 돌아간다. 브라우저 scroll anchoring에 의한 카드 높이 변경 이동을 차단했다.

검색, 카테고리, 하위 필터, Live/Copy, 필터 열림 상태와 view를 URL query로 관리한다. 헤더 검색은 기존 query를 유지하고 preventScroll로 입력을 포커스한다. Collections의 기존 anchor URL도 보존한다. Live 필터에서 Prototype은 제외한다.

## 실제 구현 및 개선

- Liquid Glass, Liquid Lens, RGB Lens: WebGL texture의 굴절 UV, RGB 분리, rim/specular, pointer 보간 및 제한된 velocity stretch. 생성한 격자/텍스트 texture를 굴절하며 임의의 DOM 전체를 굴절하는 기능은 아니다.
- Glassmorphism, Glass Card: 실제 backdrop blur/saturation과 독립 레이어. Glow Card와 Spotlight Card는 각각 hover/focus halo와 pointer 주변 조명으로 구분했다.
- Aurora, Gradient Mesh, Noise Blobs, Meteors, Dot Grid, Retro Grid, Pointer Spotlight, Cursor Follower, Particles: 효과별 렌더링과 일치하는 독립 실행 HTML 제공. Fluid Cursor는 잔상 예시이며 유체 solver가 없어 Prototype을 유지한다.
- Magnetic Button, Card Tilt, Mouse Parallax, Hover Lift, Scroll Reveal, Sticky Scroll, Horizontal Scroll, Marquee: 효과별 입력/스크롤 동작과 경계를 구현했다.
- Text Reveal, Blur Reveal, Split Text, Gradient Text, Shimmer Text, Typewriter, Scramble Text, Number Ticker, Rotating Words: 단어/문자, 정적 gradient/이동 shimmer, 카운터 종료를 구분했다.
- Image Trail, Comparison Slider, Image Reveal, Ripple, Confetti: 실제 생성 SVG 이미지와 range/keyboard/click 동작, 제한된 노드 및 종료 정리.
- Accordion/FAQ: aria-expanded, inert, 실제 높이 전환과 chevron. 공식 ShaderGradient는 선택 preset과 복사/다운로드 값을 일치시켰다.

## Agent Package 및 출처

모든 패키지에 Goal, Prompt, Visual Target, Interaction Behavior, Component Structure, Dependencies, Implementation Logic, Starter Code, Responsive, Reduced Motion, Source, GitHub, License, Acceptance Criteria를 포함한다. Ready의 HTML은 iframe 미리보기와 동일한 생성 함수를 사용한다. Partial을 명시하고 관련 없는 범용 HTML 다운로드를 제거했다. 전체 복사 CTA는 demo 직후에 배치했다.

Hub Original 독립 구현, 공식 라이브러리 실행, Magic UI Meteors 참고 재구현을 구분했다. 실행 HTML에 Hub MIT notice를 포함하고 Meteors에는 Magic UI 원문 MIT도 포함했다. upstream 확인 기록은 [license review](licenses/upstream-review.json)에 있다. ShaderGradient의 MIT는 설치된 2.4.20 package metadata 및 upstream package.json을 근거로 하며 root LICENSE 확인으로 표현하지 않는다.

## 성능과 접근성

IntersectionObserver로 화면 밖 demo iframe을 unmount하여 animation/listener/renderer를 함께 정리한다. ShaderGradient도 viewport와 visibility/reduced-motion을 사용한다. 임시 WebGL probe context를 해제한다. Canvas DPR과 particle/image 노드 수를 제한하고 resize 및 종료 정리를 포함했다. 다운로드 Blob URL과 복사 feedback timer를 해제한다.

화면 검수 후 mobile 제목 줄바꿈, CTA 폭 정렬, badge 대비, preset caption 대비, code block 높이/가로 넘침, focus ring을 수정했다. 비교 slider와 Accordion은 키보드로 확인했다.

## 실제 브라우저 검수

Production preview를 Codex In-app Browser에서 검수했다.

| 범위 | Viewport | 방법 및 결과 |
|---|---|---|
| Home, preset gallery, Explore references/collections, Sources | 1440×1000, 390×844 | screenshot 확인, mobile 줄바꿈/정렬 수정 후 재확인 |
| 93개 상세 화면 | 1440×1000, 390×844 | 제목, preview, copy CTA와 document overflow 구조 검사 통과; 모든 동작을 수동 시험했다는 의미는 아님 |
| Explore 전체 카테고리 | 1440×1000 | Styles, Pages, Sections, Background, Motion, Text, Effects, DESIGN.md 대표 화면 screenshot 확인 |
| Liquid Glass 상세 | desktop/mobile | 실제 canvas texture 굴절 및 copy 영역 확인 |
| Glow Card, Spotlight Card, 공식 Mint | 1440×1000 | 서로 다른 화면과 preset 적용 확인 |

- scrollY 1000에서 category, collections/references, Pointer subcategory, Live, cursor 검색 변경 후 1000 유지.
- 상세 및 Sources 전환은 top으로 이동. Browser Back으로 query와 약 1000 위치 복원. 상세 탐색으로 버튼도 Effects query와 기존 스크롤 위치를 복원.
- Comparison range의 Home/End 입력으로 0%/100% 확인. Accordion Enter/Space로 expanded/inert 상태 확인.
- Liquid Glass 전체 복사와 공식 Mint 패키지 clipboard 내용을 확인했다. Mint export의 color/geometry와 이름이 선택값과 일치한다.
- 화면 밖 demo unmount와 재진입 렌더링 확인. 전체 상세 검사 중 예상치 못한 browser error 없음.

## 자동 검증 및 한계

- npm run build: TypeScript와 production build 통과.
- npm run audit:v1.4: 93 unique IDs, 14개 필수 package section, inline JavaScript 구문, 실행 가능한 Ready export, reduced-motion 분기 존재를 검사한다. 공식 10개 preset의 TSX 구문과 identity/color/geometry/fallback 일치도 검사한다.
- git diff --check: 최종 변경의 whitespace 검사.
- 다운로드 anchor의 Blob URL/filename 및 클릭까지 확인했다. In-app Browser의 download event가 완료를 전달하지 않아 OS에 저장된 파일 확인은 하지 못했다.
- 실제 OS reduced-motion 전환, 모바일 실기기, 정량 FPS/장시간 GPU memory 측정은 수행하지 않았다. 코드 분기 검사를 실제 기기 성능 측정으로 해석하면 안 된다.
- production JS는 약 1.51 MB (gzip 400 KB)로 chunk 경고가 남는다. 기존 Three/ShaderGradient 의존성을 포함한다. viewport 렌더링 절약은 다운로드 크기 축소와 별개다.
- 초기 npm install에서 기존 dependency vulnerability 5개가 보고되었다. 호환성 검증 없는 강제 major upgrade는 적용하지 않았다.

## 남은 작업 우선순위

1. Fluid Cursor의 실제 유체 solver, Metaballs의 pointer 반발/병합을 구현하고 다시 판정.
2. Pages와 일부 Sections를 실제 다중 영역/입력 동작 및 동일한 export까지 완성.
3. DESIGN.md별 독립 token/typography/예시와 남은 style prototype의 구현을 구체화.
4. Working이지만 Partial인 기존 데모의 실행 export 보강. 초기 bundle 분리와 실기기 reduced-motion/GPU 성능 및 다운로드 저장 검증.
