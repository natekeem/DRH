import { useState, type CSSProperties } from 'react'
import type { DesignSystemTokens } from '../../types'

export function DesignSystemPreview({tokens:t,compact=false}:{tokens:DesignSystemTokens;compact?:boolean}) {
  const [selected,setSelected]=useState(false)
  const vars={'--ds-canvas':t.colors.canvas,'--ds-surface':t.colors.surface,'--ds-text':t.colors.text,'--ds-primary':t.colors.primary,'--ds-on-primary':t.colors.onPrimary,'--ds-border':t.colors.border,'--ds-radius':`${t.radius}px`,'--ds-border-width':`${t.borderWidth}px`,'--ds-display':t.typography.display,'--ds-body':t.typography.body,'--ds-size':`${t.typography.displaySize}px`,'--ds-body-size':`${t.typography.bodySize}px`,'--ds-line-height':t.typography.lineHeight,'--ds-duration':`${t.duration}ms`,'--ds-padding':`${t.spacing[3]}px`} as CSSProperties
  return <div className={`ds-preview ${compact?'ds-compact':''}`} style={vars}>
    <div className="ds-kicker">DESIGN SYSTEM / TOKEN PREVIEW</div>
    <h3>Aa. A clear<br/>place to start.</h3>
    <p className="ds-type-label">{t.typography.display} · {t.typography.displaySize}px / body {t.typography.bodySize}px</p>
    <div className="ds-swatches">{Object.entries(t.colors).slice(0,4).map(([name,value])=><div key={name}><i style={{background:value}}/><span>{name}<code>{value}</code></span></div>)}</div>
    <div className="ds-surface"><small>SURFACE / {t.radius}px radius</small><h4>Made for the next idea.</h4><p>같은 토큰으로 버튼, 표면, 타이포를 구성합니다.</p><div className="ds-actions"><button tabIndex={compact?-1:0} aria-pressed={selected} onClick={()=>setSelected(v=>!v)}>{selected?'Selected ✓':'Primary button'}</button><button tabIndex={compact?-1:0} className="ds-secondary" onClick={()=>setSelected(false)}>Reset</button></div></div>
    {!compact&&<div className="ds-spacing"><small>SPACING / px</small>{t.spacing.map(n=><span key={n}><i style={{width:n}}/>{n}</span>)}</div>}
  </div>
}
