# Design Reference Hub

## Project Handoff / Research Brief

### 1. 프로젝트 배경

웹 개발이나 UI/UX 디자인 경험이 많지 않은 사람들이 Claude Code, Codex, Cursor, OpenCode 등 Coding Agent를 이용해 웹페이지를 만드는 경우가 늘어나고 있다.

하지만 실제 사용자들을 보면 다음과 같은 문제가 매우 자주 발생한다.

- 멋진 웹페이지를 보고도 해당 디자인을 무엇이라고 부르는지 모른다.
- "이런 디자인 만들어줘"라고 AI에게 정확하게 설명하지 못한다.
- Liquid Glass, Neo-Brutalism, Bento Grid 등의 용어 자체를 모른다.
- Hero, CTA, Marquee, Aurora Background, Text Reveal 등의 웹 UI 용어를 모른다.
- 어떤 종류의 애니메이션/인터랙션이 존재하는지도 모른다.
- 좋은 랜딩페이지를 발견해도 자신의 프로젝트에 어떻게 적용할지 모른다.
- 디자인 참고자료, Motion 예제, UI Component, DESIGN.md 등이 여러 사이트에 흩어져 있다.

목표는 이 문제를 해결하는 사내용 **Design Reference Hub**를 만드는 것이다.

---

# 2. 핵심 컨셉

Design Reference Hub는 AI 서비스를 만드는 것이 아니다.

추천 AI, 생성 AI, Chatbot 등을 사이트에 넣지 않는다.

핵심 경험은 매우 단순하다.

> Browse → See → Pick → Copy → Vibe Coding

사용자가 다양한 웹 디자인을 직접 눈으로 둘러보고,

> "어? 이거 괜찮은데?"

라고 생각한 것을 선택한 뒤 Prompt, DESIGN.md, 코드 또는 정확한 명칭을 복사하여 자신이 사용하는 Coding Agent에게 전달하는 것이 목적이다.

예:

사용자 발견:

- Playful Neo-Brutalism
- Bento Grid
- Aurora Background
- Text Reveal
- Hover Lift

Coding Agent에게:

> 이 페이지를 Playful Neo-Brutalism 스타일로 변경하고 Bento Grid를 사용해줘. Hero에는 Aurora Background, 제목에는 Text Reveal, Card에는 Hover Lift를 적용해줘.

또는 DESIGN.md를 복사해서:

> 이 DESIGN.md를 프로젝트 디자인 가이드로 사용해 랜딩페이지를 만들어줘.

이 정도의 단순한 Workflow를 목표로 한다.

---

# 3. 서비스의 가장 중요한 원칙

## "이름을 몰라도 눈으로 찾을 수 있어야 한다."

전문 디자이너를 위한 Design System 관리 도구가 아니다.

주요 대상은:

- Vibe Coding 입문자
- Frontend 경험이 적은 개발자
- Backend 개발자
- 업무 자동화 개발자
- Citizen Developer
- Coding Agent를 이용해 웹페이지를 만드는 일반 사내 구성원

따라서 긴 설명보다 **Visual Preview가 가장 중요하다.**

사이트에 들어와 움직이는 예제를 직접 보고:

> "아, 내가 봤던 게 Aurora였구나."

> "아, 이런 디자인을 Neo-Brutalism이라고 하는구나."

> "이 위쪽 영역이 Hero Section이라는 거구나."

를 알 수 있어야 한다.

---

# 4. 주요 카테고리

아래 구조를 기본안으로 생각하고 있다.

## 4.1 [🎨](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f3a8/72.png) Styles

사이트 전체의 Visual Language / Design Style.

예:

- Minimalism
- Modern
- Flat Design
- Material Design
- Neo-Brutalism
- Brutalism
- Glassmorphism
- Liquid Glass
- Neumorphism
- Claymorphism
- Bento
- Editorial
- Swiss / International
- Maximalism
- Playful
- Hand-drawn / Doodle
- Y2K
- Frutiger Aero
- Retro
- Pixel
- Cyberpunk
- Futuristic
- Luxury
- Corporate
- Gradient
- Dark UI

각 Style에는 가능하면:

- Visual Preview
- 이름
- 한 줄 설명
- 특징
- 잘 어울리는 용도
- 관련 키워드
- Prompt
- DESIGN.md
- Source
- License

를 제공한다.

---

# 4.2 [🖥](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f5a5/72.png) Pages / Templates

완성된 페이지 Reference.

예:

- Landing Page
- SaaS
- Product
- Portfolio
- Dashboard
- Documentation
- Developer Tool
- Blog
- Resume
- Event
- Education
- ELI5 / Explainer
- Internal Tool
- Admin
- Login / Signup

중요한 것은 Screenshot/Preview를 먼저 보여주는 것이다.

가능하면 Open Source Template을 중심으로 수집한다.

---

# 4.3 [🧩](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f9e9/72.png) Sections

페이지 전체가 아니라 특정 영역을 참고하고 싶은 사용자를 위한 Library.

예:

- Hero
- Navbar
- Features
- Bento Grid
- Logo Cloud
- Statistics
- Timeline
- Process
- Pricing
- Testimonials
- Comparison
- FAQ
- CTA
- Team
- Gallery
- Footer
- Contact
- Login
- Signup

예를 들어 사용자가:

> "페이지는 이미 만들었는데 첫 화면이 너무 밋밋하다."

라고 할 경우 Hero Gallery를 보고 하나를 선택할 수 있어야 한다.

---

# 4.4 [🌌](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f30c/72.png) Background

특히 시각적 만족도가 높고 Vibe Coding에서 많이 찾는 영역.

예:

- Aurora
- Animated Gradient
- Gradient Mesh
- Particles
- Meteors
- Stars
- Grid
- Dot Grid
- Retro Grid
- Spotlight
- Beams
- Waves
- Noise
- Blob
- Fluid
- Matrix
- Gradient Blob
- Animated Lines
- Interactive Grid
- Mouse-following Gradient

가능하면 반드시 Live Preview 제공.

---

# 4.5 [✨](https://fonts.gstatic.com/s/e/notoemoji/17.0/2728/72.png) Motion / Interaction

예:

- Scroll Reveal
- Parallax
- Sticky Scroll
- Horizontal Scroll
- Smooth Scroll
- Page Transition
- Section Transition
- Hover Lift
- Magnetic Button
- Card Tilt
- Marquee
- Infinite Marquee
- Cursor Follow
- Mouse Parallax
- Ripple
- Accordion Motion
- Expand / Collapse
- Morph
- Drag Interaction

각 Motion은 정적인 Screenshot보다 실제 동작 Demo가 중요하다.

---

# 4.6 [🔤](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f524/72.png) Text Motion / Typography Effects

예:

- Typewriter
- Text Reveal
- Blur Reveal
- Split Text
- Gradient Text
- Animated Gradient Text
- Shimmer Text
- Scramble Text
- Rotating Words
- Flip Words
- Counter
- Number Ticker
- Text Mask
- Highlight Animation
- Variable Font Animation
- Character Reveal
- Word Reveal

---

# 4.7 [🖱](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f5b1/72.png) Visual Effects

예:

- Glass Card
- Glow
- Spotlight Card
- 3D Card
- Tilt Card
- Animated Border
- Moving Border
- Shimmer
- Ripple
- Confetti
- Cursor Trail
- Glow Cursor
- Magnetic Effect
- Hover Border
- Image Reveal
- Image Comparison

---

# 4.8 [📐](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f4d0/72.png) DESIGN.md

Coding Agent에게 바로 전달할 수 있는 디자인 가이드 모음.

예:

- Minimal SaaS
- Playful Neo-Brutalism
- Editorial
- Developer Tool
- Corporate Dashboard
- Luxury
- Documentation
- Dark Futuristic
- ELI5 / Educational
- Bento SaaS

사용자가:

1. Preview 확인
2. DESIGN.md 열기
3. Copy
4. 프로젝트에 DESIGN.md 저장
5. Coding Agent에게 "DESIGN.md를 따라 만들어줘"

할 수 있도록 한다.

DESIGN.md는 아직 발전 중인 개념이므로 특정 포맷을 절대적인 표준으로 가정하지 않는다.

---

# 5. 각 Reference의 이상적인 정보 구조

가능하면 모든 Reference를 다음과 같은 Metadata 구조로 정규화한다.

id: name: category: subcategory: description: tags: [] use\_cases: [] preview: thumbnail: live\_demo: implementation: type: framework: dependencies: copy: prompt: code: design\_md: source: name: url: repository: author: license: type: license\_url: commercial\_use: modification: redistribution: attribution\_required: status: reviewed\_at: notes:

---

# 6. 라이선스 원칙

이 프로젝트에서 라이선스는 매우 중요하다.

"인터넷에서 무료로 볼 수 있다"와 "코드를 사내에서 복사하여 재배포할 수 있다"는 전혀 다른 문제다.

모든 Source에 가능하면 다음을 기록한다.

- Original Source
- Original URL
- GitHub Repository
- Author
- License
- License URL
- Modification 허용 여부
- Redistribution 허용 여부
- Attribution 필요 여부
- Internal use 가능 여부
- 확인 날짜

초기 분류 예:

### [🟢](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f7e2/72.png) Copy OK

라이선스를 확인했고 사내 Reference/재사용에 문제가 없다고 판단된 항목.

예:

- MIT
- Apache-2.0
- BSD
- CC0

단, Repository의 코드 라이선스와 Image / Font / Icon / Brand Asset 등의 라이선스가 다를 수 있으므로 별도 확인 필요.

### [🟡](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f7e1/72.png) Reference Only

디자인 Inspiration으로 링크와 Preview만 제공.

코드 자체를 사내에서 재배포하지 않는다.

### [🔴](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f534/72.png) Restricted / Unknown

- No License
- Custom License에서 redistribution 제한
- License 확인 불가
- Commercial/Internal 조건 불명확

이 경우 코드/파일을 가져오지 않는다.

가능하면 원본 사이트 Link만 제공하거나 제외한다.

법적 판단이 필요한 애매한 라이선스는 임의로 "사용 가능"으로 판단하지 말고 별도 표시한다.

---

# 7. Source Attribution 원칙

모든 자료의 출처를 유지한다.

Design Reference Hub가 원본 제작자인 것처럼 보이면 안 된다.

각 Reference에:

> Source: Magic UI
> License: MIT
> Original: [link]

와 같은 정보를 표시한다.

가능하면 Hub는 외부 Open Source 생태계를 대체하는 것이 아니라 **Curated Catalog / Index** 역할을 한다.

특히 라이선스가 애매한 경우 콘텐츠를 복제하기보다 원본으로 연결한다.

---

# 8. 이미 발견한 참고 Source

다음 Source들은 이미 후보로 발견했다.

이것들에 국한하지 말고 더 많이 조사해야 한다.

## Design Style / Vocabulary

### Vibulary / How to Vibe UI

[https://howtovibeui.com/](https://howtovibeui.com/)

다양한 UI Design Style을 Visual Example과 함께 설명.

조사 대상:

- Styles
- Design Guides
- Prompt Lab
- Style terminology

콘텐츠를 그대로 복제할 수 있는지는 별도로 라이선스 확인 필요.

---

# DESIGN.md Sources

## Awesome DESIGN.md

https://github.com/abhayjnayakk/awesome-design-md

AI Builder를 위한 DESIGN.md Gallery/Collection.

Repository 자체는 MIT 라이선스이며 curated reference collection과 starter examples 등을 제공하는 것으로 확인됨.

## Official DESIGN.md

https://github.com/VoltAgent/official-design-md

기업/프로젝트가 직접 공개한 first-party DESIGN.md를 추적하는 Index.

중요한 운영 방식:

원본 DESIGN.md를 자신들이 소유한다고 주장하거나 전부 복제하는 것이 아니라 원본 Source로 연결하는 curated index 방식을 사용한다.

Design Reference Hub의 라이선스 운영 방식에 좋은 Reference.

## DESIGN.md collection

https://github.com/iFurySt/DESIGN.md

실제 웹사이트에서 추출한 reusable DESIGN.md 및 Preview 자료를 제공.

라이선스와 각 Design의 사용 조건을 추가 확인할 것.

## Duply DESIGN.md

https://github.com/Duply-AI/design-md

300개 이상의 실제 Product Design System을 DESIGN.md 형태로 제공한다고 설명하는 프로젝트.

Live Preview / Token / Export UX가 Design Reference Hub와 상당히 유사하므로 반드시 조사.

단, 개별 Brand Design을 사내에서 어떻게 취급해야 하는지는 별도 검토.

## DesignMD Directory

https://github.com/dimabraven/design-md

DESIGN.md Directory와 CLI 접근 방식을 제공.

## DESIGN.md Template

https://github.com/flohcreative/design-md-template

Production-oriented DESIGN.md template.

MIT.

## Design extraction 관련 참고

https://github.com/sunil-dsb/design.md

Public website에서 colors, typography, spacing, tokens 등을 추출하여 DESIGN.md로 만드는 Open Source 프로젝트.

Hub 자체 기능에는 AI/자동 추출을 넣을 계획이 없지만 DESIGN.md 구조 연구 Reference로 활용 가능.

---

# UI / Motion Sources

## Magic UI

https://github.com/magicuidesign/magicui

Animated UI Components / Effects.

MIT License.

특히 조사:

- Background
- Text Animation
- Special Effects
- Components
- Landing Sections

## Motion Primitives

https://github.com/ibelick/motion-primitives

Motion + Tailwind 기반 animated interface components.

MIT License.

Motion/Interaction Library 후보.

## Aceternity UI

Animated UI / Background / 3D / Spotlight / Moving Border 등의 Reference 후보.

공식 Source와 정확한 라이선스를 반드시 별도 확인할 것.

TerminalSkills의 Aceternity 관련 Skill은 Apache-2.0으로 공개된 사례가 있으나 이것이 Aceternity UI 전체 콘텐츠 라이선스와 동일하다고 가정하면 안 된다.

---

# 9. 추가로 반드시 조사해야 할 Source Category

아래 영역별로 가능한 한 많은 Source를 찾아라.

### Design Style Gallery

검색 예:

- UI design styles gallery
- web design style examples
- UI style vocabulary
- web aesthetic styles
- design style reference
- brutalism glassmorphism claymorphism gallery

### Landing Page Gallery / Template

- open source landing page templates
- MIT landing page templates
- free landing page GitHub
- landing page inspiration
- SaaS landing page templates
- HTML landing templates MIT

### Section Library

- hero section gallery
- Tailwind sections
- open source UI blocks
- landing page sections
- copy paste UI blocks
- Bento component gallery

### Motion

- open source motion UI
- web animation examples
- CSS animation library
- Framer Motion components
- scroll animation examples
- interaction gallery
- microinteraction examples

### Background Effects

- animated background components
- WebGL background effects
- CSS animated backgrounds
- particle background
- aurora background
- grid background
- shader background
- gradient mesh

### Text Effects

- animated text components
- text reveal animation
- text scramble
- typography animation
- kinetic typography
- CSS text effects

### DESIGN.md

- DESIGN.md gallery
- DESIGN.md GitHub
- AI design system markdown
- design context coding agent
- design system for Claude Code
- design system Cursor
- Google Stitch DESIGN.md

### UI Component Libraries

- Magic UI
- Aceternity UI
- Motion Primitives
- shadcn ecosystem
- Tailwind component libraries
- animated UI components
- copy paste UI components

---

# 10. 조사 시 원하는 결과

지금 단계에서는 사이트를 개발하지 않는다.

**최대한 많은 좋은 Source를 발견하는 것이 최우선 목표다.**

창작하지 말고 기존 생태계를 조사한다.

최소 다음 표 형태로 결과를 정리한다.

|   |
| - |

Source

Category

What it provides

Preview

Code

License

Redistribution

Agent Friendly

URL

그리고 Source마다:

### Source Name

**URL**

**Category**

Style / Landing / Section / Motion / Background / Text / Effect / DESIGN.md 등

**무엇을 제공하는가**

간단한 설명.

**왜 Design Reference Hub에 유용한가**

구체적인 이유.

**License**

정확한 License.

가능하면 Repository의 LICENSE 파일까지 확인.

**주의사항**

예:

- Code는 MIT이나 Image assets는 별도
- Personal use only
- Redistribution 금지
- Attribution 필요
- License 불명확
- Reference link만 사용하는 것이 안전

**Hub 활용 추천**

다음 중 하나:

- [🟢](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f7e2/72.png) 직접 수록 후보
- [🟡](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f7e1/72.png) 링크/Reference 후보
- [🔴](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f534/72.png) 제외 권장

---

# 11. 특히 찾아야 할 것

단순히 유명한 사이트 10\~20개를 찾고 끝내지 말 것.

가능하면 폭넓게 조사한다.

목표 예:

- Design Style Sources: 10+
- DESIGN.md Sources: 10+
- Landing Template Sources: 20+
- UI Section/Block Sources: 20+
- Motion/Interaction Sources: 20+
- Background Effect Sources: 15+
- Text Effect Sources: 15+
- Visual Effect Sources: 15+
- Inspiration Gallery: 15+
- Icon/Illustration 등 인접 Source도 유용하면 별도 제안

중복 Source는 하나로 합친다.

---

# 12. Open Source를 우선한다

우선순위:

1. MIT
2. Apache-2.0
3. BSD
4. CC0
5. 기타 명확한 Open Source
6. Free + Custom License
7. Reference-only Commercial Site

단순히 예쁜 사이트보다:

> **Preview + Source Code + Clear License**

조합을 가장 높게 평가한다.

---

# 13. 기술 Stack은 지금 결정하지 않는다

이번 Research에서는 React / Vue / Next.js / Static HTML 등의 구현 기술을 제한하지 않는다.

좋은 Reference를 최대한 발견하는 것이 먼저다.

단 Metadata에는 기술 Stack을 기록한다.

예:

- HTML/CSS/JS
- React
- Next.js
- Tailwind
- Framer Motion / Motion
- GSAP
- Three.js
- WebGL
- shadcn/ui

나중에 필터링할 수 있도록 한다.

---

# 14. 향후 서비스 UX 방향

대략적인 UX는 다음과 같다.

Design Reference Hub [ Styles ] [ Pages ] [ Sections ] [ Background ] [ Motion ] [ Text ] [ Effects ] [ DESIGN.md ] ↓ Visual Gallery ┌──────────┐ ┌──────────┐ ┌──────────┐ │ Preview │ │ Preview │ │ Preview │ │ │ │ │ │ │ │ Aurora │ │ Meteors │ │ Grid │ └──────────┘ └──────────┘ └──────────┘ ↓ Detail LIVE PREVIEW Name Description Keywords When to use [Copy Prompt] [Copy Code] [Copy DESIGN.md] Implementation Dependencies Source Author License Original Link

검색보다 **탐색 경험**이 중요하다.

---

# 15. 향후 Claude Skill / Plugin 확장

Web Hub 이후 동일한 Reference Library를 Claude Code 등의 Coding Agent에서 직접 사용할 수 있도록 Skill/Plugin 형태로 배포하는 것도 고려한다.

예:

design-reference/ SKILL.md styles/ neo-brutalism.md liquid-glass.md editorial.md background/ aurora.md particles.md grid.md motion/ scroll-reveal.md parallax.md text/ text-reveal.md shimmer.md effects/ tilt-card.md spotlight.md

중요:

Web Hub와 Skill이 서로 다른 데이터를 관리하지 않도록 한다.

가능하면 하나의 Reference Dataset을 Source of Truth로 사용하고:

- Web → 사람이 Browse
- Skill → Coding Agent가 Reference

하도록 한다.

단, 이 부분은 향후 단계이며 지금 Research 단계에서 구현하지 않는다.

---

# 16. 이번 세션에서 당신이 해야 할 일

당신은 지금 Design Reference Hub를 설계하거나 개발하지 않는다.

**Researcher 역할을 수행한다.**

웹 검색과 GitHub 검색을 적극적으로 사용해서 Design Reference Hub에 활용할 수 있는 외부 Source를 가능한 한 폭넓게 조사하라.

특히:

1. 기존 Design Reference/Gallery 서비스
2. Design Style Collection
3. DESIGN.md Collection
4. Landing Page Template
5. UI Section/Block Library
6. Motion/Interaction Library
7. Background Effect Library
8. Text Animation Library
9. Visual Effect Library
10. Claude/Coding Agent용 Design Skill/Plugin 사례

를 조사한다.

각 Source의:

- 이름
- URL
- GitHub
- 제공 내용
- 기술 Stack
- License
- Redistribution 가능성
- Attribution 조건
- Design Reference Hub 활용 가치

를 기록한다.

**라이선스를 추측하지 말 것.**

README에 "Free"라고 쓰여 있다고 Open Source로 판단하지 말고 가능한 경우 LICENSE 파일 또는 공식 License 문서를 확인한다.

License가 불명확하면 Unknown으로 표시한다.

---

# 17. Research 결과의 최종 목표

최종적으로 다음과 같은 Source Map을 만들고 싶다.

DESIGN REFERENCE HUB │ ├── [🎨](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f3a8/72.png) STYLE │ ├── Source A │ ├── Source B │ └── ... │ ├── [🖥](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f5a5/72.png) PAGE │ ├── Landing Source │ ├── Dashboard Source │ └── ... │ ├── [🧩](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f9e9/72.png) SECTION │ ├── [🌌](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f30c/72.png) BACKGROUND │ ├── [✨](https://fonts.gstatic.com/s/e/notoemoji/17.0/2728/72.png) MOTION │ ├── [🔤](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f524/72.png) TEXT │ ├── [🖱](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f5b1/72.png) EFFECT │ └── [📐](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f4d0/72.png) DESIGN.MD

그리고 각 Source를:

[🟢](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f7e2/72.png) Import / Copy Candidate [🟡](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f7e1/72.png) Reference / Link Candidate [🔴](https://fonts.gstatic.com/s/e/notoemoji/17.0/1f534/72.png) Restricted / Exclude

로 분류한다.

가능하면 최종적으로 **100개 이상의 유효한 Source 후보**를 확보한다.

숫자를 채우기 위해 품질이 낮거나 중복되는 Source를 넣지는 않는다.

---

# 18. 프로젝트 한 문장 정의

> **Design Reference Hub는 웹 디자인 용어를 잘 모르는 Vibe Coding 사용자가 다양한 UI 스타일, 페이지, Section, Motion, Effect를 눈으로 둘러보고 마음에 드는 Reference를 골라 Coding Agent에게 바로 전달할 수 있도록 만든 사내 Visual Design Reference Library다.**

핵심은 AI 생성이 아니다.

**"좋은 것을 보여주고, 정확한 이름을 알려주고, 바로 가져다 쓸 수 있게 하는 것."**

이 원칙을 유지하며 Research를 진행하라.