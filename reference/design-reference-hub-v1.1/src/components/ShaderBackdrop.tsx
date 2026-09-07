import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import { useReducedMotion } from '../lib/hooks'

export type ShaderPreset = {
  id: string
  name: string
  url: string
  fallback: string
  ink?: 'light' | 'dark'
}

const q = (value: string) => `https://www.shadergradient.co/customize?${value}`

// The renderer is MIT-licensed @shadergradient/react. These presets are Hub-owned
// configurations expressed with ShaderGradient's public URL-query interface.
export const heroShaderPresets: ShaderPreset[] = [
  {
    id: 'halo', name: 'Halo', ink: 'light',
    fallback: 'linear-gradient(132deg,#ff6b25 0%,#f4a9c7 38%,#d8d0f2 62%,#ff4d2e 100%)',
    url: q('animate=on&brightness=1.1&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&envPreset=city&grain=on&grainBlending=0.12&lightType=3d&reflection=0.1&shader=defaults&type=plane&uDensity=1.3&uFrequency=5.5&uSpeed=0.22&uStrength=4'),
  },
  {
    id: 'universe', name: 'Universe', ink: 'light',
    fallback: 'radial-gradient(circle at 20% 15%,#8a1cff,transparent 42%),radial-gradient(circle at 76% 75%,#ff72d2,transparent 42%),#28134d',
    url: q('animate=on&brightness=1.05&cAzimuthAngle=180&cDistance=3.4&cPolarAngle=90&color1=%237117ff&color2=%23ff67d4&color3=%23131746&envPreset=city&grain=on&grainBlending=0.11&lightType=3d&reflection=0.12&shader=defaults&type=plane&uDensity=1.2&uFrequency=5.2&uSpeed=0.18&uStrength=3.2'),
  },
  {
    id: 'mint', name: 'Mint', ink: 'dark',
    fallback: 'linear-gradient(145deg,#d8ff9e,#5ce0cf 46%,#6a8bff 100%)',
    url: q('animate=on&brightness=1.15&cAzimuthAngle=220&cDistance=3.7&cPolarAngle=88&color1=%23d7ff8f&color2=%2358dfc7&color3=%236786ff&envPreset=dawn&grain=on&grainBlending=0.08&lightType=env&reflection=0.18&shader=defaults&type=plane&uDensity=1.1&uFrequency=4.8&uSpeed=0.16&uStrength=3.3'),
  },
  {
    id: 'peach', name: 'Peach', ink: 'dark',
    fallback: 'linear-gradient(135deg,#fff0b8,#ff9f94 48%,#b8a6ff)',
    url: q('animate=on&brightness=1.2&cAzimuthAngle=155&cDistance=3.5&cPolarAngle=92&color1=%23fff0a6&color2=%23ff8c82&color3=%23b7a2ff&envPreset=dawn&grain=on&grainBlending=0.08&lightType=3d&reflection=0.1&shader=defaults&type=plane&uDensity=1.25&uFrequency=5&uSpeed=0.2&uStrength=3.6'),
  },
  {
    id: 'ocean', name: 'Ocean', ink: 'light',
    fallback: 'linear-gradient(145deg,#082a68,#10bfd1 50%,#77e7ff)',
    url: q('animate=on&brightness=0.95&cAzimuthAngle=250&cDistance=3.5&cPolarAngle=90&color1=%23092768&color2=%2310b9cc&color3=%2377e7ff&envPreset=city&grain=on&grainBlending=0.1&lightType=env&reflection=0.22&shader=defaults&type=plane&uDensity=1.2&uFrequency=4.7&uSpeed=0.15&uStrength=3.5'),
  },
]

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
      setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')))
    } catch { setSupported(false) }
  }, [])
  return supported
}

export function ShaderBackdrop({ compact = false, preset = heroShaderPresets[0] }: { compact?: boolean; preset?: ShaderPreset }) {
  const reduced = useReducedMotion()
  const webgl = useWebGLSupport()
  if (reduced || webgl !== true) {
    return <div className="shader-fallback" style={{ background: preset.fallback }} aria-hidden="true" />
  }

  return (
    <ShaderErrorBoundary fallback={preset.fallback}>
      <div className={compact ? 'shader-backdrop compact' : 'shader-backdrop'} aria-hidden="true">
        <ShaderGradientCanvas
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          pixelDensity={compact ? 1 : 1.25}
          fov={45}
          lazyLoad={compact}
          threshold={0.05}
          powerPreference="high-performance"
        >
          <ShaderGradient control="query" urlString={preset.url} />
        </ShaderGradientCanvas>
      </div>
    </ShaderErrorBoundary>
  )
}
