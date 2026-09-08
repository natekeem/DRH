import engine from '../../components/demos/advanced/engine.js?raw'
import commonCss from '../../components/demos/advanced/advanced.css?raw'
import fluidCss from '../../components/demos/advanced/fluidCursor.css?raw'
import metaballsCss from '../../components/demos/advanced/metaballs.css?raw'
import refractionCss from '../../components/demos/advanced/liquidRefraction.css?raw'
import license from '../../../LICENSE?raw'
import type { AdvancedDemoKind, AdvancedDemoOptions } from '../../components/demos/advanced/engine.js'

export type AdvancedHtmlOptions = Pick<AdvancedDemoOptions, 'variant' | 'intensity' | 'radius'>
export function advancedHtml(kind: AdvancedDemoKind, options: AdvancedHtmlOptions = {}): string {
  const title = { fluid: 'Fluid Cursor', metaballs: 'Metaballs', refraction: 'Liquid Refraction' }[kind]
  const css = { fluid: fluidCss, metaballs: metaballsCss, refraction: refractionCss }[kind]
  const config = JSON.stringify({ kind, variant: options.variant === 'card' ? 'card' : 'detail', intensity: options.intensity, radius: options.radius }).replace(/</g, '\\u003c')
  const source = engine.replace('export function mountAdvancedDemo', 'function mountAdvancedDemo').replace(/<\/script/gi, '<\\/script')
  const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · DRH</title>
<style>${commonCss}\n${css}
body{margin:0;padding:24px;background:#080b16;color:#eef4ff;font:14px/1.6 system-ui,sans-serif}main{max-width:1000px;margin:auto}h1{font-size:24px}details{margin-top:24px;color:#aab9ce}pre{white-space:pre-wrap;font:12px/1.6 monospace}a{color:#9eeade}@media(max-width:599px){body{padding:16px}}</style></head>
<body><main><h1>${title}</h1><div id="demo" class="drh-advanced drh-advanced--${options.variant === 'card' ? 'card' : 'detail'}" tabindex="0" role="group" aria-label="${title} interactive demo"></div>
<p>포인터와 터치로 조작하세요. 키보드: 방향키 · Space · R 초기화. 동작 줄이기 설정에서는 정적 미리보기를 표시합니다.</p>
<details><summary>Source / MIT License</summary><p>Original DRH JavaScript, GLSL and generated artwork. No adapted upstream code or external runtime dependencies.</p>${kind === 'fluid' ? '<p>Numerical background only: Mark J. Harris, <a href="https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu">GPU Gems, Chapter 38</a>. No NVIDIA code included.</p>' : ''}<pre>${escape(license)}</pre></details></main>
<script>${source}\nmountAdvancedDemo(document.getElementById('demo'),${config});</script></body></html>`
}
