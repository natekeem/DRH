import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { heroShaderPresets, ShaderBackdrop } from './ShaderBackdrop'
import { useReducedMotion } from '../lib/hooks'

export function Hero() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const preset = heroShaderPresets[index]
  const step = (delta: number) => setIndex((index + delta + heroShaderPresets.length) % heroShaderPresets.length)

  return (
    <section className={`hero shader-home ${preset.ink === 'dark' ? 'dark-ink' : 'light-ink'}`} aria-label="Design Reference Hub 소개">
      <ShaderBackdrop preset={preset} />
      <div className="shader-home-grain" aria-hidden="true" />

      <div className="shader-home-brand">Design Reference Hub</div>

      <div className="shader-home-center">
        <div className="shader-preset-title">
          <span>{String(index).padStart(2, '0')}</span>
          <strong>{preset.name}</strong>
          <div className="shader-preset-arrows" aria-label="배경 프리셋 변경">
            <button type="button" onClick={() => step(-1)} aria-label="이전 프리셋"><ArrowLeft size={18}/></button>
            <button type="button" onClick={() => step(1)} aria-label="다음 프리셋"><ArrowRight size={18}/></button>
          </div>
        </div>
        <p><b>좋은 디자인을 먼저 눈으로 찾으세요.</b><br/>정확한 이름을 알고, Prompt·Code·DESIGN.md를 Coding Agent에게 바로 전달합니다.</p>
      </div>

      <div className="shader-home-bottom">
        <small>{reduced ? 'Reduced motion mode' : '마음에 드는 것부터 둘러보세요'}</small>
        <div className="shader-home-dock">
          <Link to="/explore?category=Styles">Styles</Link>
          <Link to="/explore?category=Motion">Motion</Link>
          <Link to="/explore?category=Effects">Effects</Link>
          <Link className="dock-primary" to="/explore">전체 탐색 <ArrowRight size={15}/></Link>
        </div>
      </div>

      <Link to="/explore" className="shader-scroll-cue" aria-label="레퍼런스 탐색으로 이동"><ArrowDown size={17}/></Link>
    </section>
  )
}
