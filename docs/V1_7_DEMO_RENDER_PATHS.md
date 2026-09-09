# V1.7 Rendering paths

## Pre-change audit (completed before implementation)

The original table was generated before editing application code. Parallax, Magnetic Button and Hover Lift already had distinct final recipe objects despite sharing initialization. Tilt combined rotation and translation. Spotlight, Spotlight Background, Fluid Cursor and Cursor Follow shared an object; Fluid Cursor actually dispatched to advanced React, but Agent Package selected the shadow recipe. Legacy Particles, MagneticButton and ImageTrail were unreachable. TiltCard remains reachable through style-clay.

## Final dispatch

Priority: vendor specimen → advanced React → official ShaderBackdrop preset → recipe iframe → Legacy JSX. Exports and Agent Package select advanced implementations before recipes. Recipe HTML defaults to detail and both variants use the same responsive implementation. DemoViewport mounts visible surfaces only. The metadata function densityPolicy and the acceptance contracts in recipes describe scaling; advanced engines keep their V1.6.2 variant policies.

| Key | Reference names | Renderer | Recipe | React component | Advanced component | Card | Detail | Export |
|---|---|---|---|---|---|---|---|---|
| style-minimal | Minimalism | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-brutal | Neo-Brutalism | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-glass | Glassmorphism | RecipeDemo iframe | recipes[style-glass] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| liquid-lens | Liquid Glass | RecipeDemo iframe | recipes[liquid-lens] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| style-bento | Bento Grid | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-editorial | Editorial | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-swiss | Swiss / International | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-y2k | Y2K | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-frutiger | Frutiger Aero | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-terminal | Terminal Aesthetic | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-clay | Claymorphism | LegacyDemoRenderer | — | TiltCard | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-cyber | Cyberpunk | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-luxury | Luxury | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| style-dark | Dark UI | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| shader-gradient | Shader Gradient | ShaderBackdrop | — | ShaderBackdrop | — | visible-only lightweight card variant | visible-only detail variant | Official TSX |
| aurora | Aurora Background | RecipeDemo iframe | recipes[aurora] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| gradient-mesh | Animated Gradient Mesh | RecipeDemo iframe | recipes[gradient-mesh] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| particles | Interactive Particles | RecipeDemo iframe | recipes[particles] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| meteors | Meteors | RecipeDemo iframe | recipes[meteors] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| dot-grid | Interactive Dot Grid | RecipeDemo iframe | recipes[dot-grid] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| retro-grid | Retro Perspective Grid | RecipeDemo iframe | recipes[retro-grid] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| spotlight | Pointer Spotlight | RecipeDemo iframe | recipes[spotlight] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| beams | Light Beams | RecipeDemo iframe | recipes[beams] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| waves | Wave Lines | RecipeDemo iframe | recipes[waves] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| noise-blobs | Noise Blobs | RecipeDemo iframe | recipes[noise-blobs] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| fluid-cursor | Fluid Cursor Field | Advanced React | — | Advanced React | FluidCursorDemo | visible-only lightweight card variant | visible-only detail variant | Standalone HTML |
| metaballs | Interactive Metaballs | Advanced React | — | Advanced React | MetaballsDemo | visible-only lightweight card variant | visible-only detail variant | Standalone HTML |
| starfield | Starfield | RecipeDemo iframe | recipes[starfield] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| scroll-reveal | Scroll Reveal | RecipeDemo iframe | recipes[scroll-reveal] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| parallax | Mouse Parallax | RecipeDemo iframe | recipes[parallax] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| hover-lift | Hover Lift | RecipeDemo iframe | recipes[hover-lift] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| magnetic-button | Magnetic Button | RecipeDemo iframe | recipes[magnetic-button] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| tilt-card | Card Tilt | RecipeDemo iframe | recipes[tilt-card] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| image-trail | Cursor Image Trail | RecipeDemo iframe | recipes[image-trail] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| marquee | Infinite Marquee | RecipeDemo iframe | recipes[marquee] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| sticky-story | Sticky Scroll Story | RecipeDemo iframe | recipes[sticky-story] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| horizontal-scroll | Horizontal Scroll | RecipeDemo iframe | recipes[horizontal-scroll] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| cursor-follow | Cursor Follower | RecipeDemo iframe | recipes[cursor-follow] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| ripple | Ripple Interaction | RecipeDemo iframe | recipes[ripple] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| morph | Shape Morph | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| accordion | Accordion Motion | RecipeDemo iframe | recipes[accordion] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| typewriter | Typewriter | RecipeDemo iframe | recipes[typewriter] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| text-reveal | Text Reveal | RecipeDemo iframe | recipes[text-reveal] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| blur-reveal | Blur Reveal | RecipeDemo iframe | recipes[blur-reveal] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| split-text | Split Text | RecipeDemo iframe | recipes[split-text] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| gradient-text | Gradient Text | RecipeDemo iframe | recipes[gradient-text] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| shimmer-text | Shimmer Text | RecipeDemo iframe | recipes[shimmer-text] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| scramble-text | Scramble Text | RecipeDemo iframe | recipes[scramble-text] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| rotating-words | Rotating Words | RecipeDemo iframe | recipes[rotating-words] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| number-ticker | Number Ticker | RecipeDemo iframe | recipes[number-ticker] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| rough-highlight | Hand-drawn Highlight | LegacyDemoRenderer | — | Legacy inline JSX | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| glass-card | Glass Card | RecipeDemo iframe | recipes[glass-card] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| glow-card | Glow Card | RecipeDemo iframe | recipes[glow-card] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| spotlight-card | Spotlight Card | RecipeDemo iframe | recipes[spotlight-card] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| animated-border | Animated Border | RecipeDemo iframe | recipes[animated-border] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| shimmer-button | Shimmer Button | RecipeDemo iframe | recipes[shimmer-button] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| liquid-refraction | Liquid Lens | Advanced React | — | Advanced React | LiquidRefractionDemo | visible-only lightweight card variant | visible-only detail variant | Standalone HTML |
| rgb-lens | RGB Lens Reveal | RecipeDemo iframe | recipes[rgb-lens] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| image-reveal | Image Reveal | RecipeDemo iframe | recipes[image-reveal] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| comparison-slider | Image Comparison | RecipeDemo iframe | recipes[comparison-slider] | RecipeDemo | — | visible-only lightweight scale-sensitive | visible-only scale-sensitive | Standalone HTML |
| confetti | Confetti Burst | RecipeDemo iframe | recipes[confetti] | RecipeDemo | — | visible-only lightweight density-sensitive | visible-only density-sensitive | Standalone HTML |
| section-hero | Hero Section | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-navbar | Floating Navbar | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-bento | Bento Feature Grid | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-logos | Logo Cloud | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-stats | Statistics | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-timeline | Timeline | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-pricing | Pricing Cards | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-testimonials | Testimonials | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-comparison | Feature Comparison | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-faq | FAQ | RecipeDemo iframe | recipes[section-faq] | RecipeDemo | — | visible-only lightweight fixed-object | visible-only fixed-object | Standalone HTML |
| section-cta | CTA Banner | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-footer | Footer | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| section-contact | Contact Split | LegacyDemoRenderer | — | SectionDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-saas | SaaS Landing | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-devtool | Developer Tool | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-dashboard | Dashboard | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-docs | Documentation | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-portfolio | Portfolio | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-education | Explainer / Education | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-admin | Internal Admin | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-login | Login / Signup | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| page-event | Event Landing | LegacyDemoRenderer | — | PageDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-minimal-saas | Minimal SaaS | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-playful-brutal | Playful Neo-Brutalism | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-editorial-system | Editorial | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-developer-tool-system | Developer Tool | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-corporate-dashboard | Corporate Dashboard | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-luxury-system | Luxury | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-docs-system | Documentation | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-dark-futuristic | Dark Futuristic | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-educational-system | ELI5 / Educational | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| designmd-bento-saas-system | Bento SaaS | LegacyDemoRenderer | — | DesignMdDemo | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:airbnb | AIrbnb | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:airtable | AIrtable | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:apple | Apple | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:binance | Binance | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:bmw-m | BMW M | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:bmw | BMW | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:bugatti | Bugatti | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:cal | Cal | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:claude | Claude | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:clay | Clay | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:clickhouse | Clickhouse | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:cohere | Cohere | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:coinbase | Coinbase | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:composio | Composio | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:cursor | Cursor | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:dell-1996 | Dell 1996 | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:elevenlabs | Elevenlabs | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:expo | Expo | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:ferrari | Ferrari | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:figma | Figma | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:framer | Framer | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:hashicorp | Hashicorp | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:hp | HP | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:ibm | IBM | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:intercom | Intercom | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:kraken | Kraken | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:lamborghini | Lamborghini | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:linear.app | Linear App | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:lovable | Lovable | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:mastercard | Mastercard | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:meta | Meta | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:minimax | Minimax | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:mintlify | Mintlify | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:miro | Miro | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:mistral.ai | Mistral AI | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:mongodb | Mongodb | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:nike | Nike | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:nintendo-2001 | Nintendo 2001 | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:notion | Notion | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:nvidia | Nvidia | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:ollama | Ollama | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:opencode.ai | Opencode AI | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:pinterest | Pinterest | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:playstation | Playstation | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:posthog | Posthog | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:raycast | Raycast | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:renault | Renault | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:replicate | Replicate | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:resend | Resend | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:revolut | Revolut | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:runwayml | Runwayml | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:sanity | Sanity | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:sentry | Sentry | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:shopify | Shopify | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:slack | Slack | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:spacex | Spacex | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:spotify | Spotify | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:starbucks | Starbucks | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:stripe | Stripe | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:supabase | Supabase | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:superhuman | Superhuman | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:tesla | Tesla | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:theverge | Theverge | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:together.ai | Together AI | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:uber | Uber | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:vercel | Vercel | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:vodafone | Vodafone | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:voltagent | Voltagent | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:warp | Warp | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:webflow | Webflow | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:wired | Wired | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:wise | Wise | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:x.ai | X AI | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |
| vendor-design-md:zapier | Zapier | VendorDesignPreview | — | VendorDesignPreview | — | visible-only lightweight card variant | visible-only detail variant | Partial / document |

## Final shared object identity

- glass-card ↔ style-glass
- liquid-lens ↔ liquid-lens-effect
- liquid-lens ↔ style-liquid
- liquid-lens-effect ↔ style-liquid
- spotlight ↔ spotlight-background

Intentional alias rationale and visual evidence: V1_7_DEMO_FIDELITY_AUDIT.md. Reproduce this current table with node scripts/document-demo-paths.mjs.
