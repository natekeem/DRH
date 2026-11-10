# V1.8 Composition completion audit

검수일: 2026-11-10

`docs/REFERENCE_QUALITY_STANDARD.md`를 기준으로 남아 있던 19개 Page/Section `PROTOTYPE`과 Hand-drawn Highlight의 canonical artifact 경로를 완성했다. 현재 inventory는 223 references, 222 `WORKING DEMO`, 1 `OFFICIAL LIVE`, 0 `PROTOTYPE`이다.

## Completed references

- Text: Hand-drawn Highlight
- Sections: Hero, Floating Navbar, Logo Cloud, Statistics, Timeline, Pricing Cards, Testimonials, Feature Comparison, CTA Banner, Footer
- Pages: SaaS Landing, Developer Tool, Dashboard, Documentation, Portfolio, Explainer / Education, Internal Admin, Login / Signup, Event Landing

각 reference는 하나의 `DemoRecipe`에서 Card preview, Detail preview, HTML, CSS, React wrapper, Agent package를 생성한다. Card는 작은 컨테이너에서 핵심 화면과 상태 변화를 유지하고, Detail은 전체 구성과 수동 상호작용을 제공한다.

## Browser QA evidence

Chrome에서 로컬 Vite build를 실제 렌더링해 확인했다.

- Desktop: 1440×1000. Explore Pages 카드 4열의 폭·높이·간격이 동일하고 Detail의 메타 행 아래에서 Preview/Agent 패널이 같은 높이의 2열로 시작한다.
- Mobile: 390×844. 20개 완료 대상 전체의 document와 iframe `scrollWidth - clientWidth`가 모두 0이었다. Explore 카드는 1열 319px 폭으로 정렬되고 Detail은 Preview 다음 Agent 패널 순으로 쌓인다.
- Render sweep: 20개 iframe 모두 visible `body > main`을 가졌고 빈 frame이 없었다.
- Interaction: SaaS product tabs, Dashboard range/search dialog, Documentation code tabs/search dialog, Portfolio filter/case dialog, Education lesson tabs, Admin search, Login mode/password visibility, Event track filter/registration dialog, Pricing billing toggle, Testimonials next control, Floating Navbar mobile menu를 실행해 상태 변화를 확인했다.
- Reduced motion: `?motion=reduce` QA path에서 document가 `reduced-motion` 상태를 받고 computed animation/transition count가 0이 되는 것을 확인했다. Event countdown은 1.25초 동안 정지했고 일반 경로에서는 감소했다.
- Console: 새 브라우저 탭의 최종 Event page 검사에서 warning/error 0건이었다.

## Defects found and fixed during QA

1. Login의 hidden Full name field가 form label display 규칙에 덮여 Sign in에서도 보이던 문제를 공통 `[hidden]` 규칙으로 수정했다. Sign in에서는 숨고 Create account에서만 나타나는 것을 다시 확인했다.
2. HashRouter가 같은 history key를 재사용할 때 긴 Explore 목록의 scroll position이 새 Detail에 남던 문제를 수정했다. 새 route는 top 0에서 시작하고 distinct browser POP만 저장 위치를 복원한다.
3. Reduced-motion을 브라우저에서 반복 검증할 수 있도록 `?motion=reduce` opt-in QA 경로를 추가했다. 기본 URL의 모션 동작에는 영향이 없다.

## Completion gate

다음 명령이 모두 통과해야 이 문서의 상태를 유지한다.

```text
npm run typecheck
npm run audit:references
npm run audit:demos
npm run audit:v1.4
npm run audit:design-md
npm run audit:brand-canonical
npm run audit:brand-designs
npm run audit:brand-resources
npm run audit:korean-brands
npm run audit:brand-fidelity
npm run build
```
