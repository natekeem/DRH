import { useEffect, useState, type CSSProperties } from 'react'
import type { VendorEntry } from '../../data/awesomeDesignMd'
import type { BrandDesignSpec, BrandTypeRole } from '../../brandDesignSpec'
import './vendorDesignPreview.css'

const numeric = (value: unknown, fallback: number) => {
  const n = parseFloat(String(value))
  return Number.isFinite(n) ? n : fallback
}
const cssValue = (value: unknown, fallback: string) =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : fallback
const roleStyle = (role: BrandTypeRole | undefined): CSSProperties => ({
  fontFamily: role?.renderFallback,
  fontWeight: numeric(role?.fontWeight, 400),
  letterSpacing: cssValue(role?.letterSpacing, 'normal'),
  lineHeight: cssValue(role?.lineHeight, 'normal'),
})

/** An original specimen composition, driven by the vendored analysis, not a site replica. */
export function VendorDesignPreview({ entry, detail = false }: { entry: VendorEntry; detail?: boolean }) {
  const [fullSpec, setFullSpec] = useState<BrandDesignSpec | null>(null)
  const [selected, setSelected] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  useEffect(() => {
    setFullSpec(null)
    setLoadFailed(false)
    if (!detail) return
    const controller = new AbortController()
    fetch(`${import.meta.env.BASE_URL}brand-design-specs/${encodeURIComponent(entry.slug)}.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Spec unavailable'); return response.json() })
      .then(setFullSpec)
      .catch(error => { if (error.name !== 'AbortError') setLoadFailed(true) })
    return () => controller.abort()
  }, [entry.slug, detail])

  const spec = fullSpec ?? entry.spec
  const tokens = entry.tokens
  const roles = Object.entries(spec.typography)
  const display = roles.find(([key]) => /hero-display|display-mega|^display$|hero-title|section-title/.test(key))
    ?? roles.find(([key]) => /display|headline/.test(key)) ?? roles[0]
  const components = Object.entries(spec.components)
  const primary = spec.components['button-primary'] ?? spec.components['primary-cta']
    ?? components.find(([key]) => /primary|dark-pill/.test(key))?.[1] ?? {}
  const surface = components.find(([key]) => /feature-card-photo|property-card|card-base|promo-card|pricing-card/.test(key))
    ?? components.find(([key]) => /card/.test(key))
  const search = components.find(([key]) => /search-bar|search-pill/.test(key))?.[1]
  const radius = cssValue(surface?.[1].rounded, `${Math.min(tokens.radius, 24)}px`)
  const buttonType = (primary.typography ?? {}) as BrandTypeRole
  const buttonRadius = cssValue(primary.rounded, `${tokens.radius}px`)
  const space = Object.values(spec.spacing).map(value => numeric(value, 0)).filter(n => n > 0)
  const density = numeric(spec.spacing.md, space.find(n => n >= 12) ?? 16)
  const headline = display?.[1]
  const vars = {
    '--brand-canvas': tokens.colors.canvas,
    '--brand-surface': cssValue(surface?.[1].backgroundColor, tokens.colors.surface),
    '--brand-ink': tokens.colors.text,
    '--brand-accent': tokens.colors.primary,
    '--brand-border': tokens.colors.border,
    '--brand-action': cssValue(primary.backgroundColor, tokens.colors.primary),
    '--brand-action-text': cssValue(primary.textColor, tokens.colors.onPrimary),
    '--brand-radius': radius,
    '--brand-button-radius': buttonRadius,
    '--brand-button-weight': numeric(buttonType.fontWeight, 500),
    '--brand-button-tracking': cssValue(buttonType.letterSpacing, 'normal'),
    '--brand-space': `${Math.min(32, Math.max(12, density))}px`,
    '--brand-headline': `${numeric(headline?.fontSize, tokens.typography.displaySize)}px`,
    '--brand-weight': numeric(headline?.fontWeight, 600),
    '--brand-tracking': cssValue(headline?.letterSpacing, 'normal'),
    '--brand-family': headline?.renderFallback ?? tokens.typography.display,
    '--brand-surface-border': cssValue(surface?.[1].border, '1px solid var(--brand-border)'),
    '--brand-shadow': cssValue(surface?.[1].boxShadow, 'none'),
  } as CSSProperties
  const palette = Object.entries(spec.colors).filter(([key]) => !/focus|active|disabled|pressed/.test(key)).slice(0, 8)
  const controls = <div className="brand-controls">
    {detail ? <><button type="button" aria-pressed={selected} onClick={() => setSelected(v => !v)}>{selected ? '선택됨 ✓' : 'Primary →'}</button><button type="button" className="brand-secondary" onClick={() => setSelected(false)}>Secondary</button></>
      : <><span className="brand-cta">Explore ↗</span><span className="brand-mini-swatches" aria-hidden="true">{palette.slice(0, 4).map(([key, color]) => <i key={key} style={{ background: color }}/>)}</span></>}
  </div>

  return <div className={`brand-specimen brand-layout-${spec.layout} ${detail ? 'brand-detail' : 'brand-card'}`} style={vars} data-brand={entry.slug} data-layout={spec.layout}>
    <section className="brand-composition" aria-label={`${entry.name} brand specimen`}>
      <div className="brand-identifier"><span><i/>{entry.category}</span><small>DESIGN.md</small></div>
      <h3>{entry.name}</h3>
      {spec.layout === 'marketplace' ? <div className="brand-search" style={{ borderRadius: cssValue(search?.rounded, '9999px') }}><span>Discover a place</span><i>↗</i></div>
        : spec.layout === 'gallery' || spec.layout === 'cinematic' ? <div className="brand-image-space"><span>IMAGE / SPACE</span><i/><small>사진 영역 구성</small></div>
        : spec.layout === 'utility' ? <div className="brand-utility">{['Asset', 'Activity', 'Overview'].map((label, i) => <div key={label}><small>{label}</small><b>{['01', '24', '08'][i]}</b><i style={{ width: `${40 + i * 20}%` }}/></div>)}</div>
        : spec.layout === 'editorial' ? <div className="brand-editorial"><small>01 / DESIGN NOTES</small><b>Ideas take shape.</b><span>Type. Space. Perspective.</span></div>
        : spec.layout === 'retro' ? <div className="brand-retro-panel"><span>● SYSTEM / READY</span><b>PRESS START ↗</b><div><i/><i/><i/><i/></div></div>
        : <div className="brand-product"><div><i/><span>Workspace</span><small>01</small></div><div><i/><span>Library</span><small>02</small></div></div>}
      {controls}
    </section>
    {detail && <div className="brand-detail-modules">
      <p className="brand-disclosure">DESIGN.md로 구성한 DRH specimen · 공식 사이트나 로고가 아닙니다.</p>
      <section className="brand-type-provenance"><h4>Typography</h4><p>Declared: <strong>{headline?.declaredFamily || 'unknown'}</strong><br/>Rendered with: {headline?.renderFallback || 'system-ui'} (system fallback)</p><small>화면 크기에 맞춰 specimen 글자 크기를 조정합니다. 아래 수치는 원문 선언값입니다.</small></section>
      <section><h4>Color roles</h4><div className="brand-palette">{Object.entries(spec.colors).map(([key, color]) => <div key={key}><i style={{ background: color }}/><span>{key}<code>{color}</code></span></div>)}</div></section>
      <section><h4>Spacing & radius</h4><div className="brand-scales">{[['Spacing', spec.spacing], ['Radius', spec.radius]].map(([label, scale]) => <div key={String(label)}><small>{String(label)}</small>{Object.keys(scale).length ? Object.entries(scale).map(([key, value]) => <span key={key}><i style={label === 'Radius' ? { width: 28, height: 22, borderRadius: String(value) } : { width: Math.min(96, numeric(value, 0)), height: 5 }}/>{key} <code>{String(value)}</code></span>) : <p>unknown</p>}</div>)}</div></section>
      <section><h4>Typography hierarchy</h4><div className="brand-hierarchy">{roles.map(([key, role]) => <div key={key}><span style={{ ...roleStyle(role), fontSize: Math.min(32, numeric(role.fontSize, 16)) }}>Aa <small>{key}</small></span><code>{role.fontSize ?? 'unknown'} / {role.fontWeight ?? 'unknown'} / {role.lineHeight ?? 'unknown'} / {role.letterSpacing ?? 'unknown'}</code><small>Declared: {role.declaredFamily ?? 'unknown'} · Rendered: {role.renderFallback}</small></div>)}</div></section>
      <section><h4>Component signatures</h4>{components.length ? <div className="brand-signatures">{components.slice(0, 8).map(([key, values]) => <details key={key}><summary>{key}</summary><pre>{JSON.stringify(values, null, 2)}</pre></details>)}</div> : <p>구조화된 component 값: unknown · 원문 규칙을 참고하세요.</p>}</section>
      <section><h4>Design traits</h4><p>{spec.traits}</p>{detail && !fullSpec && <p>{loadFailed ? '상세 규칙을 불러오지 못했습니다. DESIGN.md 탭에서 원문을 확인하세요.' : '상세 규칙을 불러오는 중…'}</p>}{Object.entries(spec.sections ?? {}).filter(([key]) => /layout|depth|elevation|motion|do.s and don|shapes/i.test(key)).map(([key, value]) => <details key={key}><summary>{key}</summary><pre>{value}</pre></details>)}</section>
      <p className="brand-disclosure">Text wordmark · Analysis: VoltAgent awesome-design-md · MIT<br/>로고·폰트·사진의 권리는 문서 라이선스와 별개입니다.</p>
    </div>}
  </div>
}
