import { useState, useEffect, type CSSProperties } from 'react'
import type { DesignSystemTokens } from '../../types'

/**
 * VendorDesignPreview
 * Offline token-based preview renderer for vendor-ingested DESIGN.md entries.
 * Accepts normalised DesignSystemTokens (produced by sync script) and renders
 * a self-contained specimen with Typography / Color / Button / Surface — no
 * external network request of any kind.
 */
export function VendorDesignPreview({
  tokens: t,
  name,
  category,
}: {
  tokens: DesignSystemTokens
  name: string
  category: string
}) {
  const [selected, setSelected] = useState(false)
  const [rawMd, setRawMd] = useState<string | null>(null)
  const vars = {
    '--ds-canvas': t.colors.canvas,
    '--ds-surface': t.colors.surface,
    '--ds-text': t.colors.text,
    '--ds-primary': t.colors.primary,
    '--ds-on-primary': t.colors.onPrimary,
    '--ds-border': t.colors.border,
    '--ds-radius': `${t.radius}px`,
    '--ds-border-width': `${t.borderWidth}px`,
    '--ds-display': t.typography.display,
    '--ds-body': t.typography.body,
    '--ds-size': `${t.typography.displaySize}px`,
    '--ds-body-size': `${t.typography.bodySize}px`,
    '--ds-line-height': String(t.typography.lineHeight),
    '--ds-duration': `${t.duration}ms`,
    '--ds-padding': `${t.spacing[3]}px`,
  } as CSSProperties

  // Extract the first 6 colour swatches for display
  const swatches = Object.entries(t.colors).slice(0, 6)

  return (
    <div className="ds-preview vendor-ds-preview" style={vars}>
      <div className="ds-kicker">
        BRAND DESIGN SYSTEM / {category.toUpperCase()} / TOKEN PREVIEW
      </div>
      <h3>
        {name}
        <br />
        <span style={{ fontWeight: 400, fontSize: '0.55em', opacity: 0.65 }}>
          Design analysis via VoltAgent awesome-design-md · MIT
        </span>
      </h3>
      <p className="ds-type-label">
        {t.typography.display.split(',')[0]} · {t.typography.displaySize}px display /
        body {t.typography.bodySize}px
      </p>
      <div className="ds-swatches">
        {swatches.map(([name, value]) => (
          <div key={name}>
            <i style={{ background: value }} />
            <span>
              {name}
              <code>{value}</code>
            </span>
          </div>
        ))}
      </div>
      <div className="ds-surface">
        <small>SURFACE / {t.radius}px radius</small>
        <h4>Design token specimen.</h4>
        <p>
          DRH-generated offline preview. Raw DESIGN.md available in the DESIGN.md
          tab below.
        </p>
        <div className="ds-actions">
          <button
            aria-pressed={selected}
            onClick={() => setSelected((v) => !v)}
          >
            {selected ? 'Selected ✓' : 'Primary button'}
          </button>
          <button className="ds-secondary" onClick={() => setSelected(false)}>
            Reset
          </button>
        </div>
      </div>
      <div className="ds-spacing">
        <small>SPACING / px</small>
        {t.spacing.map((n) => (
          <span key={n}>
            <i style={{ width: n }} />
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}
