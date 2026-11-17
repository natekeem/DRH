# Live Demo Backlog

## North-star

The target is **not** “a screenshot for every item.” The target is that every useful visual/motion reference can be understood by interacting with it inside the Hub whenever licensing and performance allow.

V1 already ships 93 reference entries with a shared live-demo system. The backlog below is the next expansion queue. Work in small batches and keep every item attached to source/license metadata.

### Priority meanings

- **P0** — completes the core promise or fills an obvious missing vocabulary gap
- **P1** — high-value / high-WOW reference with common vibe-coding demand
- **P2** — useful breadth after the core catalog is healthy

---

## P0 — complete the essential visual vocabulary

| ID | Category | Reference | Target behavior | Suggested implementation / source direction |
|---|---|---|---|---|
| style-material | Styles | Material Design | Elevation layers, purposeful shared-axis motion, FAB/button state | Hub-original demo; Material guidance as vocabulary reference |
| style-flat | Styles | Flat Design | Solid-color panels, no fake depth, crisp iconography | Hub-original |
| style-modern | Styles | Modern Product UI | Neutral product shell, compact radius, quiet gradients | Hub-original collection pattern |
| style-playful | Styles | Playful | Off-grid shapes, bouncy microinteraction, bright accents | Hub-original |
| style-handdrawn | Styles | Hand-drawn / Doodle | Rough borders, marker annotations, sketch icon | RoughJS / Rough Notation (MIT) |
| style-pixel | Styles | Pixel UI | Pixel border/button/window states | 8bitcn vocabulary/reference + Hub-original code |
| style-corporate | Styles | Corporate | Enterprise hierarchy, trust blocks, calm blue/neutral tokens | Hub-original |
| style-gradient | Styles | Gradient-led UI | Product card system driven by gradient surfaces | Hub-original |
| page-product | Pages | Product Landing | Media-led product showcase with sticky purchase CTA | Hub-original |
| page-blog | Pages | Blog / Publication | Editorial index + article preview | Hub-original |
| page-resume | Pages | Resume / CV | Timeline, skill rail, compact project cards | Hub-original |
| page-internal-tool | Pages | Internal Tool | Search/filter/table/action layout | Extend current admin demo |
| section-process | Sections | Process / Steps | 3–5 step flow with active connector motion | Hub-original |
| section-team | Sections | Team | Portrait-free avatar fallback + role hover state | Hub-original assets only |
| section-gallery | Sections | Gallery | Mixed-ratio masonry with hover metadata | Hub-original gradients/patterns |
| section-login | Sections | Login Panel | Focus/input/success states | Hub-original |
| section-signup | Sections | Signup Panel | Progressive form / password requirements | Hub-original |
| background-mouse-gradient | Background | Mouse-following Gradient | Soft radial gradients drift toward pointer | Hub-original CSS |
| background-interactive-grid | Background | Interactive Grid | Grid cells illuminate/raise around pointer | Hub-original CSS/Canvas |
| background-matrix | Background | Matrix Rain | Canvas glyph rain with reduced-motion static state | Hub-original Canvas |
| background-animated-lines | Background | Animated Lines | Curved SVG/Canvas tracks move behind content | Hub-original SVG |
| text-flip-words | Text | Flip Words | Vertical 3D word flip | Hub-original CSS |
| text-variable-font | Text | Variable Font Motion | Weight/width axis responds to pointer or scroll | Use system-variable fallback or permissive OFL font only after font-rights check |
| text-character-reveal | Text | Character Reveal | Stagger chars from mask, replay on demo click | Hub-original |
| text-word-reveal | Text | Word Reveal | Word groups resolve by blur/translate | Hub-original |
| effect-3d-card | Effects | 3D Card | Perspective + layered inner media | Hub-original / Vanilla Tilt concepts |
| effect-moving-border | Effects | Moving Border | Traveling light segment, not full conic spin | Hub-original |
| effect-cursor-trail | Effects | Cursor Trail | Dot/spark trail with decay | Canvas, Hub-original |
| effect-glow-cursor | Effects | Glow Cursor | Cursor glow reveals texture / mask | Hub-original CSS |
| effect-hover-border | Effects | Hover Border | Local border illumination follows pointer | Hub-original |

---

## P1 — high-WOW landing and motion expansion

| ID | Category | Reference | Target behavior | Suggested implementation / source direction |
|---|---|---|---|---|
| bg-water-ripple | Background | Water Ripple | Pointer creates refractive ripple waves | OGL / Three.js technique; Hub-original shader preferred |
| bg-flowmap | Background | Mouse Flowmap Distortion | Image/gradient bends based on pointer velocity | OGL (Unlicense) or Three.js Hub implementation |
| bg-cube-wave | Background | 3D Wave Grid | Pointer hit propagates wave across instanced cubes | Three.js (MIT); dynamic import |
| bg-webgl-noise | Background | WebGL Noise Field | Organic displacement with color ramp | Three.js/OGL Hub shader |
| bg-shader-swirl | Background | Shader Swirl | Animated swirl/noise shader | Paper Shaders / Hub shader after license review |
| bg-dot-orbit | Background | Dot Orbit Shader | Dot field bends around focal point | Hub shader |
| bg-caustics | Background | Caustics | Light caustic field sweeps surface | Three.js shader; keep simplified for performance |
| bg-topographic | Background | Topographic Lines | Animated contour field | Canvas/SVG Hub-original |
| motion-page-transition | Motion | Page Transition | Shared overlay/wipe between demo states | Hub-original, demo-internal only |
| motion-section-transition | Motion | Section Transition | Clip/mask transition between two panels | Hub-original |
| motion-smooth-scroll | Motion | Smooth Scroll | Compare native vs eased scrolling in bounded demo | Lenis (MIT) optional dependency only if justified |
| motion-drag | Motion | Drag Interaction | Draggable card with snap-back / constraints | Pointer events Hub-original |
| motion-mouse-parallax-media | Motion | Image Mouse Parallax | Media translates/crops inside fixed frame | Hub-original |
| motion-cursor-label | Motion | Context Cursor | Cursor label changes by hover target | Hub-original |
| motion-spring-switch | Motion | Spring Toggle | Physical overshoot on state change | CSS spring-like easing or Motion runtime later |
| motion-scroll-scrub | Motion | Scroll Scrub | Animation progress tied directly to scroll | Native scroll timeline where supported + fallback |
| motion-stagger-grid | Motion | Staggered Grid Reveal | Cards reveal by row/sequence | IntersectionObserver + CSS |
| motion-infinite-cards | Motion | Infinite Card Loop | Vertical/3D card conveyor | Hub-original |
| text-dissolve | Text | Text Dissolve | Headline dissolves into particles then reforms | Canvas/WebGL; dynamic-load on detail only |
| text-destruction | Text | Text Destruction | Pointer erodes/rebuilds glyph surface | Three.js/WebGPU later; high-cost demo |
| text-mask-image | Text | Text Mask | Moving image/gradient visible through text | CSS mask/background-clip |
| text-outline-fill | Text | Outline → Fill | Scroll/hover fills outlined display type | CSS |
| text-wave | Text | Character Wave | Character baseline forms traveling wave | CSS transform stagger |
| text-counter-group | Text | Stat Count-up Group | Multiple counters with synchronized entrance | Hub-original |
| effect-chromatic | Effects | Chromatic Aberration | RGB separation responds to pointer velocity | CSS filters or shader |
| effect-magnetic-field | Effects | Magnetic Cluster | Several chips repel/attract around pointer | Pointer math Hub-original |
| effect-blob-cursor | Effects | Blob Cursor | Elastic blob cursor stretches by velocity | CSS/Canvas Hub-original |
| effect-card-stack | Effects | Card Stack | Hover/drag fans stacked cards | Pointer events Hub-original |
| effect-spotlight-list | Effects | Spotlight List | Shared light tracks across adjacent rows | CSS custom properties |
| effect-image-distortion | Effects | Image Distortion | Hover bends media texture | WebGL detail-only |
| effect-liquid-button | Effects | Liquid Button | Blob/lens response inside CTA | Hub-original CSS/SVG |
| effect-glass-refraction | Effects | Glass Refraction | Lens with displacement/refraction beyond blur | WebGL; permissive source or original shader |
| effect-pixel-reveal | Effects | Pixel Reveal | Image/text resolves by pixel blocks | CSS masks/Canvas |
| effect-noise-reveal | Effects | Noise Reveal | Noisy mask reveals media | SVG filter/Canvas |

---

## P1 — section variants users actually need

| ID | Category | Reference | Target behavior |
|---|---|---|---|
| hero-centered | Sections | Centered Hero | Product title + CTA + proof under live ambient background |
| hero-split | Sections | Split Hero | Copy left / interactive media right |
| hero-product-shot | Sections | Product Screenshot Hero | Screenshot enters with perspective/scroll depth |
| hero-editorial | Sections | Editorial Hero | Large serif/sans tension + issue metadata |
| nav-mega | Sections | Mega Menu | Hover/focus panel with grouped navigation |
| features-tabs | Sections | Feature Tabs | Tab switch animates shared media stage |
| bento-interactive | Sections | Interactive Bento | Pointer spotlight shared across bento cells |
| logos-marquee | Sections | Infinite Logo Cloud | Dual-direction loop with edge fade |
| stats-ticker | Sections | Animated Stats | Number tickers triggered once |
| timeline-scroll | Sections | Scroll Timeline | Current milestone highlights by scroll position |
| process-sticky | Sections | Sticky Process | Sticky media changes with process step |
| testimonials-marquee | Sections | Testimonial Marquee | Multi-row moving cards with pause on hover |
| pricing-toggle | Sections | Monthly / Annual Pricing | Toggle interpolates price state |
| faq-search | Sections | Searchable FAQ | Search + accordion state |
| cta-shader | Sections | Shader CTA | Compact shader background, strong reduced-motion fallback |

---

## P2 — breadth / advanced vocabulary

- Skeuomorphism
- Aqua
- Windows Aero
- Memphis
- Organic Design
- Maximalism
- Retro 70s / 80s variants
- Futuristic HUD
- Monochrome editorial
- Data-viz landing
- E-commerce product detail
- Documentation home
- Changelog
- Event schedule
- Resume timeline variants
- Command palette section
- Logo wall with hover metadata
- Image carousel / Swiper
- Embla drag carousel
- SVG path drawing / Vivus
- Lottie player example with **Hub-owned** JSON only
- RoughJS sketch illustration
- Canvas confetti variants
- Clip-path menu transition
- Cursor-driven typography warp
- Scroll progress typography
- Image hover variants
- Spotlight navigation row
- Hover preview link
- Animated icon state change
- Shared-element card expansion
- Morphing modal trigger
- Bento card expansion
- Drag-to-dismiss panel
- Ripple navigation indicator
- Mouse-follow tooltip
- Lens comparison between blur / magnify / RGB / refract

---

## Source-oriented harvesting queue

These permissive/mixed sources deserve a dedicated pass to turn source libraries into individual Reference records. Do **not** bulk-copy blindly; inspect each item and its assets.

### First pass
- Magic UI — backgrounds, text animation, special effects, landing sections
- Motion Primitives — text, transitions, layout and interaction primitives
- UI Layouts — liquid glass, scroll, marquee and utility demos
- SmoothUI — registry-friendly motion components
- Eldora UI — components/backgrounds/effects + MCP patterns
- Kokonut UI — polished shadcn/Motion references
- Uiverse — CSS microcomponents; verify contributor assets
- HyperUI / Tailblocks / Mamba UI / Tailark / Blocks.so — section/page blocks
- tsParticles / Vanta / Granim — background presets
- RoughJS / Rough Notation — hand-drawn style/effects

### Reference-only harvesting
- React Bits — MIT + Commons Clause; do not turn into a mirrored component catalog
- Animate UI — LICENSE is MIT + Commons Clause despite README language
- Aceternity UI — custom license; link/reference or independently implement generic technique
- 21st.dev — discovery marketplace; trace every item to its original license
- Vibulary — vocabulary/reference inspiration, not content to mirror
- oh-my-design — collection/quality UX precedent and link/reference model

## Definition of done for every backlog item

- [ ] Name is industry-meaningful and searchable
- [ ] Card demo works at 230 px
- [ ] Detail demo works at 440–720 px
- [ ] Pointer/touch behavior is intentional
- [ ] Reduced-motion behavior checked
- [ ] Prompt describes behavior, not a proprietary site's exact pixels
- [ ] Source URL present
- [ ] License status and evidence present
- [ ] External assets are Hub-owned or separately licensed
- [ ] No uncited copied component source under custom/restrictive terms
