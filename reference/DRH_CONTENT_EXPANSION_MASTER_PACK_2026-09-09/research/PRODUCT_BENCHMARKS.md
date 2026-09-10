# DRH Reference Research — Product Benchmarks

조사일: 2026-09-09

이 문서는 사이트의 문구/코드/이미지를 복제하지 않고 **제품 구조와 탐색 방식에서 배울 점만** 정리한 것이다.

## 1. Vibulary / How to Vibe UI
- 현재 한국어 페이지는 559개 가이드, 128개 라이브 데모를 노출한다.
- 가장 중요한 점은 사용자가 먼저 용어를 알아야 검색할 수 있게 하지 않는다는 것이다.
- 자연어로 "옆에서 나오는 패널" 같은 묘사를 입력 → 정확한 용어 → 예시 → 개발 요청으로 연결한다.
- 표준/공식 가이드/업계 실무 등 **근거 수준을 UI에서 구분**한다.

DRH 적용:
1. 이름 검색 외에 `무엇처럼 보이는지 / 무엇을 하는지` 검색 보강.
2. `비슷하지만 다른 것` 비교 카드.
3. Reference마다 `canonical term + plain Korean explanation + visual demo`.
4. Source 품질을 `Official OSS / Permissive OSS / Reference only / Hub Original`처럼 이해 가능한 말로 표시.

Source: https://howtovibeui.com/ko/

## 2. design-isms
- 현재 프로젝트 문서는 49 ISMs, 94 effects, Color 25, Typography 20, Layout 25, Motion 20을 명시한다.
- 가장 중요한 운영 규칙: **effect id마다 전용 demo.type을 갖고, generic seed demo를 재사용하지 않는다.**

DRH 적용:
- `audit:demos`에서 다른 canonical Reference가 실수로 같은 demo 구현을 공유하는지 검출.
- "Working Demo"는 이름을 눈으로 식별할 수 있는 전용 데모가 있을 때만 허용.
- taxonomy는 Gap Checklist로 사용하되, license가 불명확하므로 코드/이미지/문구는 복제하지 않는다.

Source: https://github.com/lidge-jun/design-isms/blob/main/AGENTS.md

## 3. Refero Styles
- 현재 2,000+ AI-readable design systems를 검색/탐색하게 한다.
- visual style → DESIGN.md → coding agent의 연결이 명확하다.

DRH 적용:
- Reference Detail의 Preview + Artifact Workspace 방향은 맞다.
- Style/Design System은 raw 원문만 보여주기보다 시각 token preview와 함께 보여야 한다.
- bulk redistribution 권한은 확인되지 않았으므로 catalog 자체는 mirror하지 않는다.

Source: https://styles.refero.design/

## 4. Oh My Design
- 440+ quality-graded company references와 project-owned DESIGN.md workflow가 핵심이다.
- reference를 단순 복사하는 대신 Evidence / Quality / Unknown을 분리하려는 접근이 좋다.

DRH 적용:
- `source evidence`와 `quality/readiness`를 별도 축으로 유지.
- DESIGN.md를 프로젝트 루트에 놓고 agent가 지속적으로 읽게 하는 Guide 강화.
- 회사 레퍼런스의 trademark/font/image 권리는 코드 라이선스와 분리.

Sources:
- https://oh-my-design.kr/
- https://github.com/kwakseongjae/oh-my-design

## 5. ShaderGradient
- "설명보다 먼저 움직이는 결과를 보여주고, 프리셋을 바로 고른다"는 점이 강하다.
- DRH Landing에 이미 잘 반영된 방향이다.

DRH 적용:
- Background/Effect Detail에서도 parameter controls를 필요한 항목에 한해 노출.
- 큰 Detail에서는 Card와 같은 density가 아니라 **같은 체감 밀도/강도**를 유지.

Source: https://shadergradient.co/

## 6. Framer Marketplace
- Template taxonomy가 Portfolio / Software / Agency / Ecommerce / Services / Health / Publishing / Real Estate / Hospitality / Events로 넓다.
- style facet도 Modern / Minimal / Animated / Dark / Colorful / Grid / Large Type / Black & White 등으로 실용적이다.

DRH 적용:
- Pages가 현재 9개라 범위가 가장 좁은 축 중 하나다.
- Agency, Ecommerce, AI Workspace, Marketplace, Editorial Magazine, Mobile App, Real Estate, Healthcare, Hospitality를 우선 보강.
- Marketplace template/asset을 직접 미러링하지 말고 구조/트렌드만 발견한다.

Source: https://www.framer.com/marketplace/templates/

## 7. MotionSites / GetLayers
- MotionSites는 MCP에서 500+ premium prompts를 제공한다고 밝힌다.
- GetLayers는 Templates / 3D Scenes / Sections / Backgrounds / Gradients로 나누며 cinematic motion을 "feel" 중심으로 탐색하게 한다.

DRH 적용:
- prompt 원문을 수집하는 게 아니라 `canonical effect name + visible behavior + clean-room implementation brief`만 얻는다.
- 특히 Background/Effect 후보 탐색에 유용.
- proprietary prompt/source는 DRH에 넣지 않는다.

Sources:
- https://motionsites.ai/mcp
- https://www.getlayers.ai/

## 8. 새로 찾은 OSS에서 배울 점

### beUI
- Dynamic Island, Bloom Menu, Wheel Picker, Cylinder Carousel처럼 **상태 전환 자체가 주인공인 인터랙션**이 강하다.
- MIT.
- https://beui.dev/

### Mischief UI
- Agent UI / Code / Documents / Feedback / Controls / Wayfinding / Scenes까지 범위를 넓힌다.
- 117개, MIT.
- DRH의 가장 큰 새로운 카테고리 후보인 `UI Patterns`를 채우기에 좋다.
- https://ui.tinkererslabs.com/

### FLUX UI
- motion을 개별 효과가 아니라 named physics preset + composable primitive로 설명한다.
- Agent Package의 `stiffness/damping/mass`, reduced-motion, composition 규칙을 강화하는 기준.
- MIT.
- https://github.com/nikitph/flux-ui

### fluidkit / metal-fx
- 단순 blur/gradient가 아니라 geometry/material behavior를 명시한다.
- Liquid/Gooey/Metal 계열 Effect를 "보이는 척"이 아니라 실제 원리로 구현할 때 좋은 permissive source.
- MIT.
- https://github.com/runvendo/fluidkit
- https://github.com/Jakubantalik/metal-fx

## 가장 큰 구조적 Gap

현재 DRH는 Styles / Pages / Sections / Background / Motion / Text / Effects / DESIGN.md가 강하지만,
**실제 UI Pattern 자체를 이름으로 배우는 축이 없다.**

예:
- Bottom Sheet
- Command Palette
- Toast
- Skeleton Loading
- Segmented Control
- Drawer
- Master Detail
- Resizable Panels
- File Tree
- Approval Card

권장:
V1.7 이후 `UI Patterns` 카테고리를 새로 추가하는 방향을 우선 검토.
이 카테고리는 Vibulary/design-isms와 겹치는 목적처럼 보이지만,
DRH에서는 단순 용어 사전이 아니라 **Live Demo + Agent Package + Code/HTML**로 차별화한다.
