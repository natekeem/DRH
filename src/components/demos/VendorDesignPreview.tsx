import { useState, type CSSProperties } from 'react'
import type { DesignSystemTokens } from '../../types'

/**
 * VendorDesignPreview
 * Offline token-based preview renderer for vendor-ingested DESIGN.md entries.
 * Uses both the normalised tokens AND the richer brand-specific colors palette
 * to maximise visual differentiation between brands.
 */

function luminance(hex: string): number {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b)
}

export function VendorDesignPreview({
  tokens: t,
  name,
  category,
  brandColors,
}: {
  tokens: DesignSystemTokens
  name: string
  category: string
  brandColors?: Record<string, string>
}) {
  const [selected, setSelected] = useState(false)

  // Determine if brand uses a dark canvas from the richer palette
  const rawCanvas = brandColors?.canvas ?? t.colors.canvas
  const isDark = luminance(rawCanvas) < 40

  // Use brand-specific canvas/surface/text when available from richer palette
  const canvas = rawCanvas !== '#ffffff' ? rawCanvas : t.colors.canvas
  const surface = isDark
    ? (brandColors?.['surface-1'] ?? brandColors?.['surface-dark'] ?? '#1a1a1a')
    : t.colors.surface
  const text = isDark
    ? (brandColors?.ink ?? brandColors?.['body-strong'] ?? '#f0f0f0')
    : (brandColors?.ink ?? t.colors.text)
  const border = isDark
    ? (brandColors?.hairline ?? '#333333')
    : (brandColors?.hairline ?? t.colors.border)

  const vars = {
    '--ds-canvas': canvas,
    '--ds-surface': surface,
    '--ds-text': text,
    '--ds-primary': t.colors.primary,
    '--ds-on-primary': t.colors.onPrimary,
    '--ds-border': border,
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

  // Use the richer brand palette for swatches (more distinctive per brand)
  const swatchSource = brandColors && Object.keys(brandColors).length > 2
    ? brandColors
    : t.colors
  const swatches = Object.entries(swatchSource).slice(0, 6)

  return (
    <div className={`ds-preview vendor-ds-preview ${isDark ? 'ds-dark' : ''}`} style={vars}>
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
