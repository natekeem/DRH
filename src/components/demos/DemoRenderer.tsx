import type { OfficialShaderPreset } from '../../data/shaderPresets'
import { recipes } from '../../lib/demos/recipes'
import { DemoViewport, RecipeDemo } from './DemoViewport'
import { FluidCursorDemo } from './advanced/FluidCursorDemo'
import { MetaballsDemo } from './advanced/MetaballsDemo'
import { LiquidRefractionDemo } from './advanced/LiquidRefractionDemo'
import { useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ShaderBackdrop } from '../ShaderBackdrop'
import { useReducedMotion } from '../../lib/hooks'
import { VendorDesignPreview } from './VendorDesignPreview'
import { vendorEntryBySlug } from '../../data/references'

function PointerSurface({ className='', children }:{className?:string;children?:React.ReactNode}) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return
    ref.current?.style.setProperty('--x', `${e.clientX-r.left}px`)
    ref.current?.style.setProperty('--y', `${e.clientY-r.top}px`)
    ref.current?.style.setProperty('--nx', `${((e.clientX-r.left)/r.width-.5).toFixed(3)}`)
    ref.current?.style.setProperty('--ny', `${((e.clientY-r.top)/r.height-.5).toFixed(3)}`)
  }
  return <div ref={ref} onPointerMove={move} className={`pointer-surface ${className}`}>{children}</div>
}

function TiltCard() {
  const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion()
  const move=(e:React.PointerEvent)=>{if(reduced)return;const r=ref.current?.getBoundingClientRect();if(!r)return;const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ref.current!.style.transform=`perspective(600px) rotateX(${-y*13}deg) rotateY(${x*15}deg) translateZ(8px)`}
  const reset=()=>{if(ref.current)ref.current.style.transform=''}
  return <div className="center-demo"><div ref={ref} onPointerMove={move} onPointerLeave={reset} className="tilt-demo"><small>INTERACTION</small><strong>03</strong><span>Pointer-driven depth</span></div></div>
}


function Accordion(){const [open,setOpen]=useState(true);return <div className="accordion-demo"><button onClick={()=>setOpen(v=>!v)}>What is this pattern?<ChevronDown size={16} className={open?'rot':''}/></button><div className={open?'acc-body open':'acc-body'}><p>A compact disclosure with coordinated height, opacity and icon state.</p></div></div>}

function SectionDemo({kind}:{kind:string}) {
  if(kind==='section-navbar') return <div className="mini-page nav-page"><div className="mini-nav"><b>Index</b><span>Explore</span><span>Collections</span><button>Search</button></div><div className="mini-ghost">design / reference</div></div>
  if(kind==='section-bento') return <div className="mini-bento"><div className="wide"><small>01 / VISUAL</small><b>See it first.</b></div><div className="tone">A</div><div><small>92</small><b>LIVE</b></div><div className="dark"><b>Copy →</b></div></div>
  if(kind==='section-logos') return <div className="logo-cloud-demo">{['MAGIC','MOTION','SHADCN','THREE','PIXEL'].map(x=><b key={x}>{x}</b>)}</div>
  if(kind==='section-stats') return <div className="stats-demo"><div><b>182</b><span>sources</span></div><div><b>90+</b><span>references</span></div><div><b>8</b><span>categories</span></div></div>
  if(kind==='section-timeline') return <div className="timeline-demo">{['Discover','Name','Copy','Build'].map((x,i)=><div key={x}><i>{i+1}</i><b>{x}</b></div>)}</div>
  if(kind==='section-pricing') return <div className="pricing-demo"><div><span>Basic</span><b>Free</b></div><div className="featured"><span>Studio</span><b>Pro</b><button>Choose</button></div><div><span>Team</span><b>Custom</b></div></div>
  if(kind==='section-testimonials') return <div className="quote-demo"><p>“I knew the look. I just didn’t know what to call it.”</p><span>— Vibe coder</span></div>
  if(kind==='section-comparison') return <div className="matrix-demo"><span></span><b>Native</b><b>Reference</b><span>Live preview</span><i>✓</i><i>↗</i><span>Copy code</span><i>✓</i><i>—</i></div>
  if(kind==='section-cta') return <div className="cta-demo"><small>READY TO BUILD?</small><b>Pick a reference.<br/>Give it to your agent.</b><button>Explore →</button></div>
  if(kind==='section-footer') return <div className="footer-demo"><b>DRH.</b><div><span>Explore</span><span>Sources</span><span>GitHub</span></div><small>Curated with provenance.</small></div>
  if(kind==='section-contact') return <div className="contact-demo"><div><small>CONTACT</small><b>Build better<br/>interfaces.</b></div><form><input placeholder="Name"/><input placeholder="Email"/><button type="button">Send</button></form></div>
  return <div className="section-hero-demo"><small>DESIGN / REFERENCE</small><h3>See it.<br/>Name it.<br/>Build it.</h3><button>Explore live demos</button></div>
}

function PageDemo({kind}:{kind:string}) {
  if(kind==='page-dashboard'||kind==='page-admin') return <div className="page-thumb app-thumb"><aside><b>DRH</b>{['Overview','Library','Sources','Settings'].map(x=><span key={x}>{x}</span>)}</aside><main><header><b>{kind==='page-admin'?'Operations':'Overview'}</b><i/></header><section>{[78,52,91].map((n,i)=><div key={i}><small>KPI {i+1}</small><b>{n}%</b><em style={{height:`${22+n/3}px`}}/></div>)}</section><div className="fake-table">{[1,2,3,4].map(i=><p key={i}><i/><span/><span/><b/></p>)}</div></main></div>
  if(kind==='page-docs') return <div className="page-thumb docs-thumb"><aside><b>Docs</b>{['Introduction','Installation','Patterns','Motion','License'].map(x=><span key={x}>{x}</span>)}</aside><main><small>GUIDE</small><h3>Reference schema</h3><p>Structure visual references so people and coding agents can use the same source of truth.</p><pre>{'{ category, demo, source, license }'}</pre></main></div>
  if(kind==='page-login') return <div className="page-thumb login-thumb"><section><small>WELCOME BACK</small><h3>Sign in</h3><input placeholder="name@company.com"/><input placeholder="••••••••"/><button>Continue</button></section><aside><span>DESIGN<br/>REFERENCE</span></aside></div>
  if(kind==='page-portfolio') return <div className="page-thumb portfolio-thumb"><header><b>Studio 04</b><span>Selected work ↓</span></header><div className="portfolio-media"><i/><strong>FORM / MOTION</strong></div></div>
  if(kind==='page-education') return <div className="page-thumb edu-thumb"><small>ELI5 / 04</small><h3>What is a <mark>Bento Grid?</mark></h3><div><span>1</span><p>Modular cards</p><span>2</span><p>Different sizes</p><span>3</span><p>One visual system</p></div></div>
  if(kind==='page-event') return <div className="page-thumb event-thumb"><small>SEP 24 · SEOUL</small><h3>DESIGN<br/>SYSTEMS<br/>LIVE</h3><button>Save a seat →</button></div>
  if(kind==='page-devtool') return <div className="page-thumb dev-thumb"><small>DRH / CLI</small><h3>Find the pattern.<br/><em>Ship the interface.</em></h3><pre><span>$</span> npx design-ref add aurora</pre></div>
  return <div className="page-thumb saas-thumb"><nav><b>Orbit</b><span>Product</span><span>Customers</span><button>Start free</button></nav><main><small>NEW / AI WORKSPACE</small><h3>Turn ideas into<br/><em>working systems.</em></h3><p>One workspace. Clear context. Faster shipping.</p><button>Try Orbit →</button></main></div>
}

function DesignMdDemo({kind}:{kind:string}) {
  const tone = useMemo(()=>kind.replace('designmd-',''),[kind])
  return <div className={`designmd-demo ${tone}`}><header><span>DESIGN.md</span><i>● ● ●</i></header><div><small># direction</small><b>{tone.replaceAll('-',' ')}</b><p>tokens → typography → layout → motion → agent rules</p><code>accent: var(--signal)</code></div></div>
}

function LegacyDemoRenderer({ kind, detail=false }:{kind:string;detail?:boolean}) {
  if(kind==='shader-gradient') return <div className={`demo-stage shader-demo ${detail?'detail':''}`}><ShaderBackdrop compact={!detail}/><span className="shader-label">WebGL / LIVE</span></div>
  if(kind==='style-clay') return <div className={`demo-stage ${kind==='style-clay'?'clay-stage':'dark-demo'}`}><TiltCard/></div>
  if(kind==='accordion'||kind==='accordion-motion') return <div className="demo-stage warm-demo"><Accordion/></div>
  if(kind.startsWith('section-')) return <div className="demo-stage section-stage"><SectionDemo kind={kind}/></div>
  if(kind.startsWith('page-')) return <div className="demo-stage page-stage"><PageDemo kind={kind}/></div>
  if(kind.startsWith('designmd-')) return <div className="demo-stage designmd-stage"><DesignMdDemo kind={kind}/></div>


  return <PointerSurface className={`demo-stage demo-${kind}`}>
    {kind==='morph' && <div className="morph-shape"/>}
    {kind==='rough-highlight' && <div className="rough-demo">Build the <mark>idea</mark>,<br/>not the jargon.</div>}
    {kind==='style-minimal' && <div className="style-mini minimal-card"><small>01 / SYSTEM</small><h3>Less,<br/>but clear.</h3><span>One action at a time →</span></div>}
    {kind==='style-brutal' && <div className="brutal-demo"><span>NEW</span><b>LOUD<br/>BY<br/>DESIGN</b><button>CLICK →</button></div>}
    {kind==='style-bento' && <div className="bento-style"><div className="big">BENTO</div><div>01</div><div className="acid">MODULAR</div><div>GRID</div></div>}
    {kind==='style-editorial' && <div className="editorial-demo"><small>ISSUE 04 / 2026</small><h3>The interface<br/><i>has a voice.</i></h3><p>Design notes, systems, motion.</p></div>}
    {kind==='style-swiss' && <div className="swiss-demo"><strong>GRID</strong><span>01</span><span>02</span><b>ORDER<br/>CREATES<br/>FREEDOM</b></div>}
    {kind==='style-y2k' && <div className="y2k-demo"><i/><b>FUTURE<br/>MEMORY</b><button>ENTER</button></div>}
    {kind==='style-frutiger' && <div className="frutiger-demo"><i className="bubble one"/><i className="bubble two"/><b>HELLO<br/>TOMORROW</b><span>internet optimism ✦</span></div>}
    {kind==='style-terminal' && <div className="terminal-demo"><span>design-ref --search "glass"</span><b>&gt; 18 matches</b><em>01 liquid-glass<br/>02 glassmorphism<br/>03 glass-card</em></div>}
    {kind==='style-cyber' && <div className="cyber-demo"><small>SYS://DESIGN</small><b>NEON<br/>SIGNAL</b><span>ONLINE_</span></div>}
    {kind==='style-luxury' && <div className="luxury-demo"><small>MAISON / 04</small><b>Form<br/><i>with restraint.</i></b><span>View collection</span></div>}
    {kind==='style-dark' && <div className="dark-ui-demo"><div><i/><span>Design Index</span><b>93 live</b></div><section><small>ACTIVE</small><b>Motion library</b><span>Curated & verified</span></section></div>}
  </PointerSurface>
}

export function DemoRenderer({kind,detail=false,preset}:{kind:string;detail?:boolean;preset?:OfficialShaderPreset}){
  if(kind.startsWith('vendor-design-md:')){
    const slug=kind.slice('vendor-design-md:'.length)
    const entry=vendorEntryBySlug[slug]
    if(entry)return <DemoViewport detail={detail}><VendorDesignPreview entry={entry} detail={detail}/></DemoViewport>
    return <DemoViewport detail={detail}><div className="ds-preview"><p>Preview loading…</p></div></DemoViewport>
  }

  if (kind === 'fluid-cursor') return <DemoViewport detail={detail}><FluidCursorDemo variant={detail ? 'detail' : 'card'} /></DemoViewport>
  if (kind === 'metaballs') return <DemoViewport detail={detail}><MetaballsDemo variant={detail ? 'detail' : 'card'} /></DemoViewport>
  if (kind === 'liquid-refraction') return <DemoViewport detail={detail}><LiquidRefractionDemo variant={detail ? 'detail' : 'card'} /></DemoViewport>

  return <DemoViewport detail={detail}>{kind==='shader-gradient'&&preset?<div className="demo-stage shader-demo"><ShaderBackdrop preset={preset} compact={!detail}/></div>:recipes[kind]?<RecipeDemo kind={kind} detail={detail}/>:<LegacyDemoRenderer kind={kind} detail={detail}/>}</DemoViewport>
}
