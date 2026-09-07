import { useNavigate } from 'react-router-dom'
import { ShaderBackdrop } from '../ShaderBackdrop'
import { shaderPresets } from '../../data/shaderPresets'
import { Reveal } from './Reveal'

export function PresetGallery(){
  const navigate=useNavigate()
  const presets=shaderPresets.slice(1)
  return <section className="sg-gallery" aria-label="ShaderGradient 프리셋 Live Gallery">
    <div className="sg-gallery-head"><small>LIVE BACKGROUND / OFFICIAL PRESETS · 01–09</small><p>00 Halo는 Hero에서 이미 실행 중입니다. 나머지 9개 공식 preset을 한 화면에서 비교하세요.</p></div>
    <div className="sg-preset-grid sg-preset-grid-nine">
      {presets.map((preset,i)=><Reveal key={preset.id} delay={(i%3)*.06}>
        <button type="button" className="sg-preset-tile" onClick={()=>navigate('/reference/shader-gradient')}>
          <ShaderBackdrop preset={preset} compact/>
          <span className="sg-preset-caption"><span>{String(i+1).padStart(2,'0')}</span>{preset.title}</span>
        </button>
      </Reveal>)}
    </div>
  </section>
}
