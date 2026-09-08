# 브랜드 DESIGN.md를 작성하고 Coding Agent에 적용하는 법

AI Coding Agent(Cursor, Windsurf, GitHub Copilot 등)에게 브랜드의 시각적 정체성을 정확히 전달하려면, 방대한 디자인 가이드라인이나 Figma 링크보다 **명확하고 토큰화된 마크다운 문서**가 훨씬 효과적입니다.

이 가이드에서는 조직이나 프로젝트를 위한 `DESIGN.md`를 작성하고, 이를 에이전트의 작업 맥락(Context)에 주입하는 방법을 설명합니다.

---

## 1. DESIGN.md란 무엇인가?

`DESIGN.md`는 프로젝트의 Root 디렉토리에 위치하며, AI 에이전트가 코드를 작성할 때 참조해야 할 **시각적·구조적 계약(Contract)**입니다.

에이전트는 이 파일을 읽고 다음을 결정합니다.
*   **어떤 색상과 여백을 사용할 것인가?** (하드코딩 대신 CSS 변수/Tailwind 클래스 사용)
*   **컴포넌트의 모서리(Border radius)는 얼마나 둥글게 할 것인가?**
*   **애니메이션의 속도와 전환(Transition) 곡선은 어떻게 할 것인가?**

## 2. 효과적인 DESIGN.md의 구조

AI는 자연어 처리 능력이 뛰어나지만, **토큰(Tokens)**과 **명확한 규칙(Rules)**으로 정리된 문서를 가장 잘 이해합니다.

### A. 핵심 규칙 (Must / Must Not)
가장 중요한 규칙을 상단에 배치합니다.

```markdown
## Critical Rules
- **Do NOT** use hex colors in components. Always use `var(--color-*)`.
- **Must** respect `prefers-reduced-motion`. Disable all continuous animations if true.
- **Must** use 8px grid system for margins and paddings.
```

### B. 디자인 토큰 (Design Tokens)
에이전트가 복사해서 쓸 수 있는 형태의 토큰을 제공합니다. JSON 형태나 명확한 목록 형태가 좋습니다.

```markdown
## Tokens
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 16px (Card, Modal)
- `--color-surface`: #ffffff
- `--color-surface-dim`: #f3f4f6
```

### C. 컴포넌트 레시피 (Component Recipes)
자주 사용되는 패턴을 코드 조각(Snippet)으로 제공하면 환각(Hallucination)을 줄일 수 있습니다.

```markdown
## Button Recipe
Primary button should always have `border-radius: var(--radius-md)` and a subtle hover lift.
```css
.btn-primary {
  background: var(--color-brand);
  color: white;
  border-radius: var(--radius-md);
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```
```

> [!TIP]
> `DESIGN.md`에 담긴 내용이 너무 길어지면 에이전트의 컨텍스트 창(Context window)을 낭비하게 됩니다. **실제로 개발에 필요한 핵심 규칙**만 남기세요.

---

## 3. Coding Agent에 DESIGN.md 적용하기

문서를 작성했다면 이제 에이전트에게 이를 인식시켜야 합니다.

### Cursor를 사용하는 경우
1.  프로젝트 루트에 `DESIGN.md`를 저장합니다.
2.  Cursor의 **Rules for AI** (설정 > General > Rules for AI)에 다음 문구를 추가합니다.
    > "Before generating any UI code, always read and strictly follow the rules defined in DESIGN.md in the root directory."
3.  Chat 창에서 `@DESIGN.md`를 명시적으로 멘션하여 새로운 UI 컴포넌트를 만들어 달라고 요청합니다.

### Windsurf를 사용하는 경우
1.  프로젝트 루트에 `.windsurfrules` 파일이나 `DESIGN.md`를 둡니다.
2.  Cascade에 지시를 내릴 때, "Use the design tokens from DESIGN.md" 라고 덧붙입니다.

---

## 4. Design Reference Hub 활용하기

처음부터 `DESIGN.md`를 작성하기 막막하다면, Design Reference Hub의 **Agent Package**를 활용하세요.

1.  원하는 디자인 시스템이나 Reference를 찾습니다.
2.  우측의 **Artifact Workspace**에서 **Agent Package** 탭을 엽니다.
3.  **Extended (권장)** 버전을 복사하거나 `DESIGN.md` 파일로 다운로드합니다.
4.  필요한 부분만 브랜드에 맞게 수정하여 사용합니다.

> [!IMPORTANT]
> Agent Package는 단순히 코드를 던져주는 것이 아닙니다. 에이전트가 코드를 짤 때 '왜 이렇게 짜야 하는가'를 알려주는 **명세서** 역할을 합니다.
