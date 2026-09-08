// Development-only fixture; not imported by the application or production build.
import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { FluidCursorDemo, MetaballsDemo, LiquidRefractionDemo } from '../../src/components/demos/advanced'
import { mountAdvancedDemo, type AdvancedDemoKind, type AdvancedDemoController } from '../../src/components/demos/advanced/engine.js'
import { fluidCursorHtml } from '../../src/lib/demo-exports/fluidCursorHtml'
import { metaballsHtml } from '../../src/lib/demo-exports/metaballsHtml'
import { liquidRefractionHtml } from '../../src/lib/demo-exports/liquidRefractionHtml'
import './fixture.css'

// A deterministic media-query double tests live changes without changing OS settings.
const nativeMatchMedia = window.matchMedia.bind(window)
const reducedQuery = nativeMatchMedia('(prefers-reduced-motion: reduce)')
let forcedReduced: boolean | null = null
const changeTarget = new EventTarget()
window.matchMedia = ((query: string) => query === '(prefers-reduced-motion: reduce)' ? {
  get matches() { return forcedReduced ?? reducedQuery.matches }, media: query,
  addEventListener: changeTarget.addEventListener.bind(changeTarget),
  removeEventListener: changeTarget.removeEventListener.bind(changeTarget),
} as MediaQueryList : nativeMatchMedia(query)) as typeof window.matchMedia
const relayReduced = () => changeTarget.dispatchEvent(new Event('change'))
reducedQuery.addEventListener('change', relayReduced)

function Fixture() {
  const [kind, setKind] = useState<AdvancedDemoKind>('fluid')
  const [variant, setVariant] = useState<'card' | 'detail'>('detail')
  const [mounted, setMounted] = useState(true)
  const [active, setActive] = useState(true)
  const [fallback, setFallback] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [intensity, setIntensity] = useState(1)
  const [radius, setRadius] = useState(155)
  const [snapshot, setSnapshot] = useState('')
  const [report, setReport] = useState('Not run')
  const [exported, setExported] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const engine = useRef<AdvancedDemoController | null>(null)
  const retired = useRef<AdvancedDemoController[]>([])
  useEffect(() => {
    if (!mounted || !host.current) return
    const proto = HTMLCanvasElement.prototype
    const original = proto.getContext
    if (fallback) proto.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (args[0] === 'webgl2') return null
      return original.apply(this, args)
    } as typeof original
    engine.current = mountAdvancedDemo(host.current, { kind, variant, active, intensity, radius, diagnostics: true })
    const current = engine.current!
    return () => { proto.getContext = original; current.destroy(); retired.current.push(current); engine.current = null }
  }, [kind, variant, mounted, fallback, intensity, radius])
  useEffect(() => { engine.current?.setActive(active) }, [active])
  useEffect(() => {
    const timer = setInterval(() => setSnapshot(JSON.stringify({ current: engine.current?.inspect() ?? null, retired: retired.current.map(c => c.inspect()), canvasCount: host.current?.querySelectorAll('canvas').length ?? 0 }, null, 2)), 300)
    return () => clearInterval(timer)
  }, [])
  const Component = kind === 'fluid' ? FluidCursorDemo : kind === 'metaballs' ? MetaballsDemo : LiquidRefractionDemo
  const html = kind === 'fluid' ? fluidCursorHtml({ variant }) : kind === 'metaballs' ? metaballsHtml({ variant }) : liquidRefractionHtml({ variant, intensity, radius })
  async function lifecycle() {
    if (!host.current) return
    const rows: unknown[] = []
    for (let i = 0; i < 6; i++) {
      const target = document.createElement('div')
      target.style.cssText = 'width:320px;height:220px'
      host.current.append(target)
      const c = mountAdvancedDemo(target, { kind: (['fluid','metaballs','refraction'] as const)[i % 3], variant: 'card' })
      const before = c.inspect()
      c.destroy(); c.destroy()
      target.dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 50 }))
      rows.push({ before, after: c.inspect(), remainingChildren: target.childElementCount })
      target.remove()
    }
    setReport(JSON.stringify(rows, null, 2))
  }
  return <main>
    <h1>Advanced Demo Engines · QA</h1>
    <p>Test-only entry. Main application UI and registry are not connected.</p>
    <nav aria-label="Engine selection">{(['fluid','metaballs','refraction'] as const).map(k => <button key={k} aria-pressed={kind === k} onClick={() => { setKind(k); setExported(false) }}>{k}</button>)}</nav>
    <div className="controls">
      <button onClick={() => setVariant(v => v === 'card' ? 'detail' : 'card')}>Variant: {variant}</button>
      <button onClick={() => setActive(v => !v)}>{active ? 'Pause' : 'Resume'}</button>
      <button onClick={() => engine.current?.reset()}>Reset engine</button>
      <button onClick={() => setMounted(v => !v)}>{mounted ? 'Unmount' : 'Mount'}</button>
      <button onClick={() => { forcedReduced = !reduced; setReduced(!reduced); changeTarget.dispatchEvent(new Event('change')) }}>Reduced motion: {String(reduced)}</button>
      <button onClick={() => setFallback(v => !v)}>Force fallback: {String(fallback)}</button>
      <button onClick={() => { const gl = host.current?.querySelector('canvas')?.getContext('webgl2'); const ext = gl?.getExtension('WEBGL_lose_context'); ext?.loseContext(); setTimeout(() => ext?.restoreContext(), 1500) }}>Lose and restore context</button>
      <button onClick={lifecycle}>Run disposal checks</button>
      <button onClick={() => setExported(v => !v)}>{exported ? 'Close HTML export' : 'Open HTML export'}</button>
      <label>Intensity <input aria-label="Intensity" type="number" min="0" max="2" step=".25" value={intensity} onChange={e => setIntensity(Number(e.target.value))}/></label>
      <label>Radius <input aria-label="Radius" type="number" min="12" max="600" value={radius} onChange={e => setRadius(Number(e.target.value))}/></label>
    </div>
    <h2>Direct renderer · {kind} · {variant}</h2>
    {mounted && <div ref={host} className={`drh-advanced drh-advanced--${variant}`} tabIndex={0} role="group" aria-label="QA interactive surface" />}
    {exported && <iframe title="Standalone HTML export" srcDoc={html} sandbox="allow-scripts" />}
    <details><summary>Live diagnostics</summary><pre id="diagnostics">{snapshot}</pre></details>
    <details><summary>Disposal report</summary><pre id="disposal-report">{report}</pre></details>
    <div className="spacer">Scroll down to verify the first renderer pauses when offscreen.</div>
    <h2>React StrictMode wrapper · {variant}</h2>
    {mounted && <Component variant={variant} active={active} intensity={intensity} radius={radius} />}
  </main>
}
const reactRoot = createRoot(document.getElementById('root')!)
reactRoot.render(<StrictMode><Fixture /></StrictMode>)
if (import.meta.hot) import.meta.hot.dispose(() => {
  reactRoot.unmount()
  reducedQuery.removeEventListener('change', relayReduced)
  window.matchMedia = nativeMatchMedia
})
