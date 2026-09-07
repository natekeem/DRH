import type { ReferenceItem } from '../types'

export type DemoMaturity = 'official' | 'working' | 'prototype' | 'external'

const workingDemoKeys = new Set([
  'particles','image-trail','magnetic-button','tilt-card','comparison-slider','typewriter',
  'scramble-text','number-ticker','accordion','accordion-motion','confetti','ripple','hover-lift',
  'marquee','text-reveal','blur-reveal','split-text','gradient-text','shimmer-text','rotating-words',
  'rough-highlight','animated-border','shimmer-button','image-reveal','style-brutal','style-bento',
])

export function demoMaturity(item: ReferenceItem): { kind: DemoMaturity; label: string; description: string } {
  if (item.implementation.type === 'external') return {
    kind: 'external', label: 'LINK ONLY', description: 'Hub 내부 재현보다 원본 Source 확인이 우선인 Reference입니다.',
  }
  if (item.demo === 'shader-gradient') return {
    kind: 'official', label: 'OFFICIAL LIVE', description: '공식 오픈소스 renderer/preset을 실제로 실행합니다.',
  }
  if (workingDemoKeys.has(item.demo)) return {
    kind: 'working', label: 'WORKING DEMO', description: 'Hub에서 실제 동작을 확인할 수 있도록 구현된 Demo입니다.',
  }
  return {
    kind: 'prototype', label: 'PROTOTYPE', description: '개념을 빠르게 알아보기 위한 Hub 재현 Demo입니다. 원본과 1:1 동일 구현은 아닙니다.',
  }
}

const sourceLine = (item: ReferenceItem) => {
  if (item.source.name === 'Design Reference Hub') {
    return 'Source: Design Reference Hub original demo. No third-party implementation code is claimed as the source.'
  }
  const bits = [`Source: ${item.source.name}`, item.source.url && `Original: ${item.source.url}`, item.source.repository && `Repository: ${item.source.repository}`].filter(Boolean)
  return bits.join('\n')
}

export function starterCodeFor(item: ReferenceItem): string {
  if (item.code) return item.code

  switch (item.demo) {
    case 'shader-gradient':
      return `// React + @shadergradient/react\nimport { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'\n\nexport function HeroShader() {\n  return (\n    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>\n      <ShaderGradientCanvas\n        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}\n        pixelDensity={1.25}\n        fov={45}\n      >\n        <ShaderGradient\n          animate="on" type="plane"\n          color1="#ff5005" color2="#dbba95" color3="#d0bce1"\n          uAmplitude={1} uDensity={1.3} uSpeed={0.4} uStrength={4}\n          brightness={1.2} cAzimuthAngle={180} cDistance={3.6} cPolarAngle={90}\n          cameraZoom={1} grain="on" lightType="3d"\n          positionX={-1.4} positionY={0} positionZ={0}\n          rotationX={0} rotationY={10} rotationZ={50}\n        />\n      </ShaderGradientCanvas>\n      <div style={{ position: 'relative', zIndex: 1 }}>Your hero content</div>\n    </div>\n  )\n}`
    case 'magnetic-button':
      return `// Pointer magnetic button – no dependency\nconst button = document.querySelector('[data-magnetic]')\nbutton?.addEventListener('pointermove', (event) => {\n  const r = button.getBoundingClientRect()\n  const x = (event.clientX - r.left - r.width / 2) * 0.18\n  const y = (event.clientY - r.top - r.height / 2) * 0.18\n  button.style.transform = \`translate(\${x}px, \${y}px)\`\n})\nbutton?.addEventListener('pointerleave', () => { button.style.transform = '' })\n\n/* CSS */\n[data-magnetic] { transition: transform 180ms cubic-bezier(.2,.8,.2,1); }\n@media (prefers-reduced-motion: reduce) { [data-magnetic] { transition: none; transform: none !important; } }`
    case 'tilt-card':
    case 'style-clay':
      return `// 3D tilt card – pointer position -> rotateX/rotateY\nconst card = document.querySelector('[data-tilt]')\ncard?.addEventListener('pointermove', (event) => {\n  const r = card.getBoundingClientRect()\n  const x = (event.clientX - r.left) / r.width - 0.5\n  const y = (event.clientY - r.top) / r.height - 0.5\n  card.style.transform = \`perspective(700px) rotateX(\${-y * 12}deg) rotateY(\${x * 14}deg) translateZ(8px)\`\n})\ncard?.addEventListener('pointerleave', () => { card.style.transform = '' })\n\n/* CSS */\n[data-tilt] { transform-style: preserve-3d; transition: transform 180ms ease-out; }`
    case 'image-trail':
      return `// Image trail core logic\nlet last = { x: 0, y: 0 }\nconst stage = document.querySelector('[data-image-trail]')\nconst images = ['./01.webp','./02.webp','./03.webp','./04.webp']\nlet index = 0\n\nstage?.addEventListener('pointermove', (event) => {\n  const r = stage.getBoundingClientRect()\n  const x = event.clientX - r.left\n  const y = event.clientY - r.top\n  if (Math.hypot(x - last.x, y - last.y) < 42) return\n  last = { x, y }\n\n  const img = document.createElement('img')\n  img.src = images[index++ % images.length]\n  img.className = 'trail-image'\n  img.style.left = x + 'px'\n  img.style.top = y + 'px'\n  stage.appendChild(img)\n  requestAnimationFrame(() => img.classList.add('show'))\n  setTimeout(() => img.remove(), 750)\n})\n\n/* CSS */\n[data-image-trail] { position: relative; overflow: hidden; }\n.trail-image { position:absolute; width:120px; transform:translate(-50%,-50%) scale(.72) rotate(-4deg); opacity:0; transition:.6s cubic-bezier(.2,.8,.2,1); pointer-events:none; }\n.trail-image.show { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(0); }`
    case 'particles':
      return `// Pointer-reactive particles: implementation blueprint\n// 1. Use a <canvas> sized with devicePixelRatio.\n// 2. Keep ~40 particles with x/y/vx/vy.\n// 3. requestAnimationFrame: move particles, draw points, then connect neighbors under ~55px.\n// 4. On pointermove, brighten/enlarge points within ~80px.\n// 5. Pause movement when prefers-reduced-motion is enabled.\n// Recommended production library when you need presets: https://github.com/tsparticles/tsparticles`
    case 'text-reveal':
      return `<!-- Masked text reveal -->\n<h2 class="reveal-lines"><span><b>SEE IT.</b></span><span><b>NAME IT.</b></span><span><b>BUILD IT.</b></span></h2>\n<style>\n.reveal-lines span{display:block;overflow:hidden}\n.reveal-lines b{display:block;transform:translateY(105%);animation:reveal .75s cubic-bezier(.2,.8,.2,1) forwards}\n.reveal-lines span:nth-child(2) b{animation-delay:.08s}.reveal-lines span:nth-child(3) b{animation-delay:.16s}\n@keyframes reveal{to{transform:none}}\n@media(prefers-reduced-motion:reduce){.reveal-lines b{animation:none;transform:none}}\n</style>`
    case 'marquee':
      return `<!-- Infinite marquee: duplicate the track once for a seamless loop -->\n<div class="marquee"><div class="marquee__track"><span>STYLE ✦ MOTION ✦ GLASS ✦ BENTO ✦</span><span aria-hidden="true">STYLE ✦ MOTION ✦ GLASS ✦ BENTO ✦</span></div></div>\n<style>\n.marquee{overflow:hidden}.marquee__track{display:flex;width:max-content;animation:marquee 18s linear infinite}.marquee__track span{white-space:nowrap;padding-right:2rem}\n@keyframes marquee{to{transform:translateX(-50%)}}\n@media(prefers-reduced-motion:reduce){.marquee__track{animation-play-state:paused}}\n</style>`
    case 'hover-lift':
      return `.card { transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease; }\n.card:hover { transform: translateY(-8px); box-shadow: 0 18px 45px rgba(0,0,0,.14); }\n@media (prefers-reduced-motion: reduce) { .card { transition: none; } .card:hover { transform: none; } }`
    case 'ripple':
      return `// Create a ripple at pointer coordinates, then remove it after the CSS animation.\nbutton.addEventListener('pointerdown', (e) => {\n  const r = button.getBoundingClientRect()\n  const wave = document.createElement('i')\n  wave.className = 'ripple'\n  wave.style.left = (e.clientX - r.left) + 'px'\n  wave.style.top = (e.clientY - r.top) + 'px'\n  button.appendChild(wave)\n  setTimeout(() => wave.remove(), 700)\n})\n/* .ripple { position:absolute; border-radius:50%; animation:ripple .7s ease-out; } */`
    case 'typewriter':
      return `// Typewriter loop\nconst target = 'Design, named clearly.'\nlet n = 0\nsetInterval(() => {\n  output.textContent = target.slice(0, n)\n  n = n >= target.length ? 0 : n + 1\n}, 95)`
    case 'liquid-lens':
    case 'liquid-lens-effect':
    case 'style-liquid':
      return `/* Lightweight CSS lens starter. For true refraction use WebGL/WebGL2. */\n.lens {\n  position:absolute; width:180px; aspect-ratio:1; border-radius:50%;\n  left:var(--x); top:var(--y); transform:translate(-50%,-50%);\n  backdrop-filter: blur(2px) saturate(1.35);\n  background: radial-gradient(circle at 35% 28%,rgba(255,255,255,.7),rgba(255,255,255,.08) 42%,rgba(255,255,255,.18));\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,.55), inset -18px -18px 38px rgba(70,120,255,.12), 0 18px 55px rgba(0,0,0,.16);\n  pointer-events:none;\n}\n// pointermove -> update --x / --y on the surface.\n// For physically convincing refraction, use a fragment shader and render the scene texture through a normal/distortion field.`
    case 'rgb-lens':
      return `// RGB lens recipe\n// Render the same scene twice: base layer + clipped lens layer.\n// On the lens layer apply slight RGB channel offsets and optional scale/distortion.\n// Move the clip/mask center with pointer coordinates.\n\n.rgb-lens {\n  clip-path: circle(90px at var(--x) var(--y));\n  filter: saturate(1.3) contrast(1.05);\n  text-shadow: -3px 0 rgba(255,0,80,.65), 3px 0 rgba(0,180,255,.65);\n}`
    default:
      return `// ${item.name}\n// Hub demo key: ${item.demo}\n// This V1.3 entry is a visual reference/prototype.\n// Use the Agent Package below as the implementation contract.\n// When an upstream repository exists, inspect and adapt that source instead of inventing a lookalike.`
  }
}

export function buildAgentPackage(item: ReferenceItem): string {
  const maturity = demoMaturity(item)
  const starter = starterCodeFor(item)
  const deps = item.implementation.dependencies.length ? item.implementation.dependencies.join(', ') : 'No mandatory dependency; prefer the existing project stack.'
  const source = sourceLine(item)
  const attribution = item.license.attributionRequired ? 'Preserve the original source/license attribution required by the upstream project.' : 'No extra attribution required by the Hub-original starter; keep third-party dependency notices.'

  return `# IMPLEMENTATION PACKAGE — ${item.name}\n\n## Goal\nReproduce the visual behavior of “${item.name}” as closely as possible in the existing project. Do not redesign it into a merely similar effect.\n\n## Visual / behavior target\n${item.description}\n\nUse cases: ${item.useCases.join(', ')}\nKeywords: ${item.tags.join(', ')}\nDemo status in Design Reference Hub: ${maturity.label} — ${maturity.description}\n\n## Implementation constraints\n- Existing framework context: ${item.implementation.framework}\n- Dependencies: ${deps}\n- Keep the effect responsive on desktop/tablet/mobile.\n- Add a prefers-reduced-motion fallback.\n- Do not block keyboard navigation or pointer interactions of real controls.\n- Keep content readable; decorative layers should normally use pointer-events:none.\n- If an upstream repository/source is listed below, inspect that implementation first and adapt it within its license instead of guessing from the screenshot.\n- Do not silently copy image/font/brand assets unless their separate license is known.\n\n## Source / provenance\n${source}\nLicense: ${item.license.name}\nLicense status: ${item.license.status}\n${item.license.evidenceUrl ? `License evidence: ${item.license.evidenceUrl}` : 'License evidence: Hub original demo'}\n${attribution}\n${item.license.notes ? `Notes: ${item.license.notes}` : ''}\n\n## Starter implementation / logic\n\`\`\`\n${starter}\n\`\`\`\n\n## Acceptance criteria\n1. The first visible frame matches the reference composition and hierarchy, not just its color palette.\n2. Hover/pointer/scroll behavior matches the described interaction and does not jitter.\n3. Animation timing feels deliberate; avoid arbitrary extra animation.\n4. Mobile has a usable fallback rather than a broken desktop interaction.\n5. prefers-reduced-motion disables non-essential movement.\n6. No console errors, invalid nested interactive elements, broken links, or layout overflow.\n7. Preserve source/license comments when upstream code is adapted.\n\n## Final response expected from the coding agent\n- Files changed\n- Dependencies added/removed\n- What was implemented\n- Any intentional difference from the reference and why\n- How to verify the interaction manually\n`
}

export function buildStandaloneHtml(item: ReferenceItem): string | null {
  if (item.category !== 'Pages' && item.category !== 'Sections') return null
  const title = item.name.replace(/[<>]/g, '')
  const description = item.description.replace(/[<>]/g, '')
  return `<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1"/>\n<title>${title} starter</title>\n<style>\n:root{--bg:#f4f3ef;--ink:#111;--line:rgba(17,17,17,.14);--accent:#d9ff63}\n*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--ink)}\n.wrap{width:min(1120px,calc(100% - 40px));margin:auto}.nav{height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}\n.nav div{display:flex;gap:20px;font-size:13px}.hero{min-height:72vh;display:grid;align-content:center;border-bottom:1px solid var(--line)}\n.eyebrow{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.55}.hero h1{font-size:clamp(54px,9vw,118px);line-height:.86;letter-spacing:-.075em;margin:22px 0}.hero p{max-width:640px;line-height:1.65;opacity:.64}.cta{display:inline-block;margin-top:22px;background:#111;color:#fff;padding:13px 18px;border-radius:999px}\n.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:70px 0}.card{min-height:220px;border:1px solid var(--line);border-radius:18px;padding:22px;background:#fff}.card:nth-child(2){background:var(--accent)}\n@media(max-width:720px){.grid{grid-template-columns:1fr}.hero{min-height:64vh}}\n</style>\n</head>\n<body>\n<nav class="wrap nav"><b>${title}</b><div><span>Overview</span><span>Details</span><span>Contact</span></div></nav>\n<main>\n<section class="wrap hero"><span class="eyebrow">REFERENCE STARTER</span><h1>${title}</h1><p>${description}</p><a class="cta" href="#content">Explore →</a></section>\n<section id="content" class="wrap grid"><article class="card"><span class="eyebrow">01</span><h2>Primary story</h2><p>Replace this block with the main content and hierarchy from the chosen reference.</p></article><article class="card"><span class="eyebrow">02</span><h2>Visual proof</h2><p>Add the visual material, metric, preview or interaction that makes the section specific.</p></article><article class="card"><span class="eyebrow">03</span><h2>Next action</h2><p>Keep one clear action and remove decorative UI that does not support the flow.</p></article></section>\n</main>\n<!-- Generated by Design Reference Hub as a starter, not an exact upstream clone. -->\n</body>\n</html>`
}
