import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import { useReducedMotion } from '../lib/hooks'

class ShaderErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.warn('ShaderGradient fallback activated', error, info)
  }
  render() { return this.state.failed ? <div className="shader-fallback" aria-hidden="true" /> : this.props.children }
}

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    } catch { setSupported(false) }
  }, [])
  return supported
}

export function ShaderBackdrop({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion()
  const webgl = useWebGLSupport()
  if (reduced || webgl !== true) return <div className="shader-fallback" aria-hidden="true" />

  return (
    <ShaderErrorBoundary>
      <div className={compact ? 'shader-backdrop compact' : 'shader-backdrop'} aria-hidden="true">
        <ShaderGradientCanvas
          style={{ position: 'absolute', inset: 0 }}
          pixelDensity={compact ? 1 : 1.25}
          fov={45}
          lazyLoad={compact}
          threshold={0.05}
          powerPreference="high-performance"
        >
          <ShaderGradient
            animate="on"
            type="waterPlane"
            color1="#f6ff82"
            color2="#7ee8ff"
            color3="#ff8ad8"
            uSpeed={compact ? 0.16 : 0.22}
            uStrength={2.6}
            uDensity={1.2}
            uFrequency={4.3}
            uAmplitude={1.8}
            cDistance={4.2}
            cPolarAngle={88}
            cAzimuthAngle={compact ? 168 : 154}
            brightness={1.15}
            grain="on"
            grainBlending={0.1}
            reflection={0.15}
          />
        </ShaderGradientCanvas>
        <div className="shader-vignette" />
      </div>
    </ShaderErrorBoundary>
  )
}
