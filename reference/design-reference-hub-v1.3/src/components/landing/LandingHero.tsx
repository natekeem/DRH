import { ArrowDown, ArrowUp, Github, Library, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShaderBackdrop } from '../ShaderBackdrop'
import { shaderPresets } from '../../data/shaderPresets'

export function LandingHero(){
  const [index,setIndex]=useState(0)
  const [scroll,setScroll]=useState(0)
  const preset=shaderPresets[index]
  const step=(delta:number)=>setIndex((index+delta+shaderPresets.length)%shaderPresets.length)

  useEffect(()=>{
    let raf=0
    const update=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>setScroll(Math.min(1,window.scrollY/Math.max(1,window.innerHeight*.85))))}
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)}
  },[])

  return <section className={`sg-hero ${preset.ink==='dark'?'dark-ink':'light-ink'}`} aria-label="Design Reference Hub 소개">
    <ShaderBackdrop preset={preset} lazyLoad={false}/>
    <div className="sg-hero-overlay"/>
    <Link className="sg-hero-logo" to="/">Design Reference Hub</Link>

    <div className="sg-hero-content" style={{opacity:String(1-scroll*.64),transform:`translateY(${scroll*-36}px)`}}>
      <div className="sg-cycler" aria-live="polite">
        <span className="sg-index">{String(index).padStart(2,'0')}</span>
        <span className="sg-preset-name">{preset.title}</span>
        <span className="sg-cycler-buttons">
          <button type="button" onClick={()=>step(1)} aria-label="다음 프리셋"><ArrowDown size={19}/></button>
          <button type="button" onClick={()=>step(-1)} aria-label="이전 프리셋"><ArrowUp size={19}/></button>
        </span>
      </div>
      <div className="sg-tagline">
        <p className="sg-tagline-big">Make your references alive.</p>
        <p>디자인 이름을 몰라도, 움직이는 예제를 먼저 보고 찾습니다.</p>
        <p>마음에 들면 Prompt · Code · DESIGN.md를 Coding Agent에게 전달하세요.</p>
      </div>
    </div>

    <div className="sg-hero-cta" style={{opacity:String(1-scroll*.82)}}>
      <span>Start browsing from your favorite path</span>
      <div className="sg-tools">
        <Link className="sg-tool" to="/explore?category=Styles" aria-label="스타일 탐색"><Sparkles size={17}/></Link>
        <Link className="sg-tool" to="/collections" aria-label="컬렉션"><Library size={17}/></Link>
        <a className="sg-tool" href="https://github.com/ruucm/shadergradient" target="_blank" rel="noreferrer" aria-label="ShaderGradient GitHub"><Github size={17}/></a>
        <Link className="sg-try" to="/explore">전체 레퍼런스 보기 →</Link>
      </div>
    </div>
  </section>
}
