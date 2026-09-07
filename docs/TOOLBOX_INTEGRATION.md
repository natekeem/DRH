# Tool Box Integration

The Design Reference Hub should be deployed independently but presented as one of the Tool Box entry points.

Recommended model:

```text
Tool Box
 ├─ existing utilities
 └─ Design Reference
        ↓
    independent static site
```

## Why independent deployment

- Reference content changes more often than Tool Box utility code.
- Live previews, WebGL and future media can grow without increasing the Tool Box bundle.
- Git history and release cadence remain independent.
- The same repository can later export an agent Skill/MCP/registry.
- A static build needs no backend for V1.

## Tool Box card

Suggested copy:

**Design Reference**

> 웹 디자인 스타일, Section, Motion, Effect를 눈으로 찾아보고 Coding Agent에 전달할 Prompt와 DESIGN.md를 복사합니다.

The card should open the deployed Hub URL. Avoid iframe embedding unless a later requirement makes it necessary; iframe adds CSP, clipboard, scroll, responsive and navigation complexity.
