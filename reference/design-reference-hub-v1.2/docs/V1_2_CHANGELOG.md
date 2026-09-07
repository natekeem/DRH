# V1.2 Changelog

## Landing rebuilt around the actual ShaderGradient experience

- Removed the V1.1 hand-authored five-preset hero from the active Home page.
- Added all 10 official ShaderGradient presets from the MIT upstream repository.
- Rebuilt the Home opening sequence around the MIT `shadergradient-vue` experience port:
  - full viewport Hero
  - centered preset cycler
  - concise tagline
  - bottom floating tool dock
  - black 3-column live preset gallery
  - marketing/demo sections
- Added IntersectionObserver reveal/stagger motion.
- Added subtle Hero scroll fade/translation.

## Live Shader performance

- Compact ShaderGradient previews now mount only near the viewport.
- Off-screen previews release WebGL contexts and show a CSS fallback.
- The main Hero remains continuously live.

## Product-content adaptation

- Kept canonical visual/effect names in English.
- Kept user guidance and explanations primarily in Korean.
- Replaced Framer/Figma sales messaging with Design Reference Hub flows:
  - Browse Background
  - Browse Motion
  - WOW Collection
  - DESIGN.md
  - Source & License

## Validation

- 26 TS/TSX files: syntax parse errors 0
- References: 93 / unique 93
- Collection missing IDs: 0
- Source map: 182 / actual 182
- Official ShaderGradient presets: 10
- CSS braces: balanced
- Full npm/Vite build still requires a normal network environment because the generation container cannot resolve npm registry DNS.
