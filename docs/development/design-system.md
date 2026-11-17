# Design System — Design Reference Hub

## Product personality

**Editorial utility + experimental motion.**

The chrome should be quiet enough that live references become the visual heroes. The landing page may be expressive; gallery and detail pages must remain systematic.

## Core principles

1. **Preview dominates prose.** Users often recognize an effect before they know its name.
2. **Names are labels, not lectures.** Keep explanations short and operational.
3. **Provenance is visible.** Source/license should never be hidden in legal-only pages.
4. **One strong effect per zone.** Do not stack shader + fluid + lens + particles in the same hero.
5. **Movement needs a reason.** Motion should reveal, explain depth, provide feedback, or create a deliberate brand moment.

## Visual language

### Base
- Warm off-white `#F4F3EF`
- Near-black `#121212`
- Hairline borders `rgba(18,18,18,.14)`
- Radius: 12–22 px in the Hub chrome

### Signals
- Acid: `#E9FF70`
- Sky: `#79D8FF`
- Pink: `#FF8ACB`

Signal colors are accents, not semantic status tokens. License status uses separate green/amber/red treatment.

### Typography
- UI/body: system grotesk stack for zero external font dependency
- Editorial moments: Georgia fallback serif
- Technical snippets: ui-monospace
- Headline tracking is intentionally tight (`-0.05em` to `-0.085em`).

## Page grammar

### Home
1. ShaderGradient Hero
2. Visual categories
3. High-impact live references
4. Curated collections
5. Human ↔ agent source-of-truth story

### Explore
- Visual headline
- Sticky category/search/filter toolbar
- 3-column live reference grid desktop
- 1-column mobile

### Reference detail
- Name + tags + status
- Large interactive preview
- Plain-language explanation/use cases
- Copy Prompt
- Copy DESIGN.md or implementation starter
- Source/license side panel
- Related references

## Motion
- Default interaction: 180–300 ms
- Content reveal: 350–650 ms
- Ambient loops: 3–16 s
- Use ease-out/cubic curves; avoid bouncy motion everywhere
- `prefers-reduced-motion` collapses ambient animation to a static frame

## Anti-patterns

Do not:
- turn the Hub into a generic dashboard
- bury previews below long documentation
- use decorative animation on every navigation event
- make all cards glass just because the site contains Glassmorphism references
- copy the layout or identity of Vibulary / oh-my-design / ShaderGradient; they are reference points, not templates
