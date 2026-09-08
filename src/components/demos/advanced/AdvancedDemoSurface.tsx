import { useEffect, useRef } from 'react'
import { mountAdvancedDemo, type AdvancedDemoKind, type AdvancedDemoOptions } from './engine.js'
import './advanced.css'

export interface AdvancedDemoProps extends Omit<AdvancedDemoOptions, 'kind'> {
  className?: string
}

export function AdvancedDemoSurface({ kind, variant = 'detail', intensity, radius, active = true, diagnostics = false, className = '' }: AdvancedDemoProps & { kind: AdvancedDemoKind }) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<ReturnType<typeof mountAdvancedDemo> | null>(null)
  const initialActive = useRef(active)
  initialActive.current = active
  useEffect(() => {
    if (!host.current) return
    const engine = mountAdvancedDemo(host.current, { kind, variant, intensity, radius, active: initialActive.current, diagnostics })
    controller.current = engine
    return () => { engine.destroy(); controller.current = null }
  }, [kind, variant, intensity, radius, diagnostics])
  useEffect(() => { controller.current?.setActive(active) }, [active])
  const label = kind === 'fluid' ? 'Fluid Cursor' : kind === 'metaballs' ? 'Metaballs' : 'Liquid Refraction'
  return <div ref={host} className={`drh-advanced drh-advanced--${variant} ${className}`} role="group" aria-label={`${label} interactive demo`} tabIndex={0} />
}
