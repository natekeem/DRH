import { useNavigate } from 'react-router-dom'
import { ShaderBackdrop } from '../ShaderBackdrop'
import { shaderPresets } from '../../data/shaderPresets'
import { Reveal } from './Reveal'

export function PresetGallery(){
  const navigate=useNavigate()
  return <section className="sg-gallery" aria-label="ShaderGradient 프리셋 Live Gallery">
    <div className="sg-gallery-head"><small>LIVE BACKGROUND / OFFICIAL PRESETS</small><p>스크롤해 각 프리셋을 직접 보고, 마음에 들면 Shader Gradient 레퍼런스로 이동하세요.</p></div>
    <div className="sg-preset-grid">
      {shaderPresets.map((preset,i)=><Reveal key={preset.id} delay={(i%3)*.08}>
        <button type="button" className="sg-preset-tile" onClick={()=>navigate('/reference/shader-gradient')}>
          <ShaderBackdrop preset={preset} compact/>
          <span className="sg-preset-caption"><span>{String(i).padStart(2,'0')}</span>{preset.title}</span>
        </button>
      </Reveal>)}
    </div>
  </section>
}
