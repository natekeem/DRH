# V1.1 Polish Pass — 2026-09-06

This pass was performed after first local visual review.

## Why this pass existed

The first V1 had four issues that should be fixed before handing routine expansion work to Codex:

1. The Hero used a `waterPlane` configuration with high displacement, which could read as a crumpled sheet rather than the broad moving-gradient feeling of shadergradient.co.
2. `ReferenceCard` wrapped the entire card, including nested buttons/range inputs, in a React Router `<Link>`. That is invalid interactive nesting and can create confusing click behavior.
3. Route changes did not restore scroll position. On a long page, a successful navigation could therefore look like “nothing happened.”
4. Product UI copy was almost entirely English even though the primary internal audience is Korean.

## Hero decision

The home Hero now intentionally follows the composition language of ShaderGradient's public landing visual:

- one full-viewport moving shader gradient
- small centered product mark at the top
- large serif `00 Preset` title
- previous/next preset controls
- concise explanatory copy
- compact tool-like dock near the bottom

The implementation uses the MIT-licensed `@shadergradient/react` renderer and its documented `control="query"` / `urlString` interface.

The public `shadergradient.co` website shell itself was **not** verified as part of the package's open-source repository, so this repository does not claim to contain copied proprietary landing-page source. The composition is recreated locally while the actual shader renderer comes from the MIT package.

## Routing / interaction fixes

- Added `RouteEffects` to scroll to the top after route changes.
- Collection hash links now scroll to their corresponding collection section.
- Reference cards are now `<article>` elements.
- Live Demo surfaces remain directly interactive.
- Only the metadata/detail area is a route link.
- Hub-original references no longer create meaningless `https://github.com/` “Original source” links.
- External links render only when they are valid HTTP(S) links.
- NavLink active-state styling is now explicit.
- `Cmd/Ctrl + K` actually focuses the header search field.

## Localization rule

Keep these in English:

- official style/effect/component names (`Glassmorphism`, `Image Trail`, `Shader Gradient`)
- category canonical keys (`Styles`, `Motion`, `Effects`, etc.)
- code, package names, tags, licenses
- Copy Prompt contents intended for coding agents
- DESIGN.md technical tokens and snippets

Prefer Korean for:

- navigation and action labels
- explanatory paragraphs
- reference descriptions
- filters and result counts
- license/source explanations
- onboarding and empty states

The Korean description layer lives in `src/data/ko.ts`, keeping canonical source metadata unchanged.

## Before next Codex expansion

The user should first visually review:

1. Home Hero preset 00 Halo and the other preset arrows
2. Explore card interaction (buttons should work; title area opens detail)
3. Detail route + back navigation
4. Collection anchor links
5. Source links
6. Korean/English balance

After this review, Codex can focus on expanding LIVE_DEMO_BACKLOG rather than redesigning the foundation.
