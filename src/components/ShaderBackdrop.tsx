import { Component, type ErrorInfo, type ReactNode, useEffect, useRef, useState } from 'react'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import { useReducedMotion } from '../lib/hooks'
import { shaderPresets, type OfficialShaderPreset } from '../data/shaderPresets'

export type ShaderPreset = OfficialShaderPreset
export const heroShaderPresets = shaderPresets

class ShaderErrorBoundary extends Component<{ children: ReactNode; fallback?: string }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.warn('ShaderGradient fallback activated', error, info)
  }
  render() {
    return this.state.failed
      ? <div className="shader-fallback" style={{ background: this.props.fallback }} aria-hidden="true" />
      : this.props.children
  }
}

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const context=canvas.getContext('webgl2') || canvas.getContext('webgl')
      setSupported(Boolean(context))
      context?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch { setSupported(false) }
  }, [])
  return supported
}

function useNearViewport(enabled:boolean){
  const ref=useRef<HTMLDivElement>(null)
  const [near,setNear]=useState(!enabled)
  useEffect(()=>{
    const el=ref.current
    if(!enabled||!el||typeof IntersectionObserver==='undefined'){setNear(true);return}
    const observer=new IntersectionObserver(([entry])=>setNear(Boolean(entry?.isIntersecting)),{rootMargin:'220px 0px',threshold:0})
    observer.observe(el)
    return()=>observer.disconnect()
  },[enabled])
  return {ref,near}
}

export function ShaderBackdrop({
  compact = false,
  preset = shaderPresets[0],
  lazyLoad,
  className = '',
}:{
  compact?: boolean
  preset?: OfficialShaderPreset
  lazyLoad?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  const webgl = useWebGLSupport()
  const virtualize = lazyLoad ?? true
  const {ref,near}=useNearViewport(virtualize)
  const live=!reduced && webgl===true && near

  return <div ref={ref} className={`${compact ? 'shader-backdrop compact' : 'shader-backdrop'} ${className}`} aria-hidden="true">
    {!live && <div className="shader-fallback" style={{ background: preset.fallback }} />}
    {live && <ShaderErrorBoundary fallback={preset.fallback}>
      <ShaderGradientCanvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        pixelDensity={compact ? 1 : 1.25}
        fov={45}
        lazyLoad={false}
        powerPreference="high-performance"
      >
        <ShaderGradient {...(preset.props as any)} />
      </ShaderGradientCanvas>
    </ShaderErrorBoundary>}
  </div>
}
