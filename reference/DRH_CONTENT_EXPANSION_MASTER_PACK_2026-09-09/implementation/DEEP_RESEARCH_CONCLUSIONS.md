# Deep Research Conclusions

## 이번 Pass에서 한 일

기존 `Next 40`을 다시 인터넷에서 개별적으로 확인하면서:
- 실제 OSS implementation source가 있는지
- live demo가 있는지
- license가 permissive인지
- DRH catalog로 코드 재배포/적응해도 되는지
- 기존 DRH와 무엇이 달라야 하는지

를 후보별로 연결했다.

## 결론 1 — Next 40 중 상당수는 clean-room만 할 필요가 없다

특히 직접적인 permissive source가 강한 항목:
- Neumorphism → ui-neumorphism (MIT), Neumorphism.io (BSD-3-Clause)
- Boids → ercang/boids-js (MIT)
- Topography → topolines (MIT)
- Voronoi → port80-webgl-gallery (MIT)
- Caustics → water-demo / webgl-water MIT lineage
- Morphing Dialog / Dock / Text Morph → Motion Primitives (MIT)
- Dynamic Island → beUI (MIT)
- Split Flap → codemanshan/splitflap (MIT), daformat version (0BSD)
- Progressive Blur → progressive-blur (MIT)
- Gooey Toast → goey-toast (MIT)
- Scratch → react-scratchcard-v2 (MIT)
- Liquid Metal Border → metal-fx (MIT)
- Bottom Sheet → pure-web-bottom-sheet / react-modal-sheet (MIT)
- Toast → react-hot-toast (MIT)
- Skeleton → react-loading-skeleton (MIT)
- Segmented Control → rc-component/segmented (MIT)
- Interactive Product Demo → Spotlane (MIT)

즉 구현 Agent에게 "인터넷에서 비슷한 거 찾아봐"라고 시킬 필요가 없다.

## 결론 2 — clean-room이 더 안전한 항목

다음은 concept source는 많지만 DRH catalog에 그대로 vendor하기 애매하거나,
정확히 맞는 permissive implementation source보다 독립 구현 가치가 높다.

- Bauhaus
- Japandi
- Ferrofluid Surface
- Dither Field
- Text Pressure
- Variable Proximity
- Vertical Cut Reveal
- Cursor Reveal Mask

특히 React Bits는 현재 MIT + Commons Clause라
**component catalog 자체를 DRH에 재배포하는 source로 사용하면 안 된다.**
시각 concept discovery만 하고 Hub Original로 구현한다.

## 결론 3 — Page/Section은 코드 하나를 그대로 가져오면 오히려 DRH 가치가 떨어진다

Agency / Ecommerce / Interactive Hero / Animated Feature Showcase는:
- permissive OSS의 구조/애니메이션 패턴을 연구
- 이미지/브랜드/font는 neutral placeholder로 교체
- 1개의 독립된 DRH mini page로 재구성

이 가장 좋다.

사용자가 준 `agency-website-v2`는 시각 benchmark로 매우 좋지만
repo license를 확인하지 못했으므로 **REFERENCE ONLY**다.

대신 MIT 구현 source로:
- FavourAkpasi/modern-agency
- YusufCeng1z/svelte-gsap-template
등을 병행할 수 있다.

## 결론 4 — AI Chat / Agent Workspace는 중요한 신규 Page다

직접적인 open-source source가 이미 충분하다:
- Vercel AI Elements
- assistant-ui
- assistant-ui/tool-ui
- shadcn chatbot-template

DRH demo에서는 API 연결 없이도 다음을 local state로 시뮬레이션할 수 있다:
1. user message
2. streaming assistant message
3. tool call
4. approval/question card
5. artifact/file card
6. source/citation row
7. composer

이 Page는 사내 vibe-coding 사용자에게 특히 실용적이다.

## 결론 5 — `UI Patterns` 신설 판단은 더 강해졌다

직접적인 permissive implementation이 모두 존재한다:
- Bottom Sheet
- Command Palette
- Toast
- Skeleton
- Segmented Control

따라서 단순 용어 사전이 아니라:
`Live Demo + accessibility + Agent Package + standalone code`
로 차별화할 수 있다.

V1.7 이후 첫 콘텐츠 batch에서 category를 신설하는 것을 권장한다.
