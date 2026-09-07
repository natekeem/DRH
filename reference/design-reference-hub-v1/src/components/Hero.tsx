import { ArrowDown, ArrowUpRight, MousePointer2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ShaderBackdrop } from './ShaderBackdrop'
import { usePointerFine, useReducedMotion } from '../lib/hooks'

export function Hero() {
  const fine=usePointerFine(); const reduced=useReducedMotion()
  const move=(e:React.PointerEvent<HTMLElement>)=>{if(!fine||reduced)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--hx',`${((e.clientX-r.left)/r.width-.5).toFixed(3)}`);e.currentTarget.style.setProperty('--hy',`${((e.clientY-r.top)/r.height-.5).toFixed(3)}`)}
  return <section className="hero" onPointerMove={move}>
    <ShaderBackdrop/>
    <div className="hero-noise"/>
    <div className="hero-topline"><span>VISUAL REFERENCE LIBRARY</span><span>FOR VIBE CODING / 2026</span></div>
    <div className="hero-copy">
      <div className="hero-kicker"><i/> 90+ live references · 182 verified source candidates</div>
      <h1><span>SEE IT.</span><span>NAME IT.</span><span className="outline">BUILD IT.</span></h1>
      <p>Don’t know what the design is called? Start with what catches your eye. Explore live styles, motion, effects and sections — then hand the exact language to your coding agent.</p>
      <div className="hero-actions"><Link className="primary-cta" to="/explore">Explore live references <ArrowUpRight size={18}/></Link><Link className="quiet-cta" to="/collections">Browse collections</Link></div>
    </div>
    <div className="hero-float f1">AURORA <i>01</i></div><div className="hero-float f2">LIQUID GLASS <i>02</i></div><div className="hero-float f3">IMAGE TRAIL <i>03</i></div><div className="hero-float f4">BENTO GRID <i>04</i></div>
    <div className="hero-cursor"><MousePointer2 size={17}/> move to explore</div>
    <Link to="/explore" className="scroll-cue"><ArrowDown size={17}/><span>Explore</span></Link>
  </section>
}
