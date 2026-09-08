import type { OfficialShaderPreset } from '../../data/shaderPresets'
import { recipes } from '../../lib/demos/recipes'
import { DemoViewport, RecipeDemo } from './DemoViewport'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, Command, Sparkles } from 'lucide-react'
import { ShaderBackdrop } from '../ShaderBackdrop'
import { usePointerFine, useReducedMotion } from '../../lib/hooks'
import { VendorDesignPreview } from './VendorDesignPreview'
import { vendorEntryBySlug } from '../../data/references'

const labels = ['Bento', 'Glass', 'Motion', 'Y2K', 'Editorial', 'Aurora']

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

function Particles() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el=canvas.current; if(!el) return
    const ctx=el.getContext('2d'); if(!ctx) return
    let raf=0, pointer={x:-999,y:-999}
    const dots=Array.from({length:38},(_,i)=>({x:(i*73)%320,y:(i*47)%190,vx:(i%3-1)*.13,vy:((i+1)%3-1)*.1}))
    const resize=()=>{const r=el.getBoundingClientRect(); el.width=r.width*devicePixelRatio; el.height=r.height*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
    const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect(); pointer={x:e.clientX-r.left,y:e.clientY-r.top}}
    resize(); window.addEventListener('resize',resize); el.addEventListener('pointermove',move)
    const draw=()=>{const r=el.getBoundingClientRect(); ctx.clearRect(0,0,r.width,r.height); dots.forEach((d,idx)=>{if(!reduced){d.x=(d.x+d.vx+r.width)%r.width; d.y=(d.y+d.vy+r.height)%r.height} const dist=Math.hypot(d.x-pointer.x,d.y-pointer.y); const rad=dist<80?3.5:2; ctx.beginPath();ctx.arc(d.x,d.y,rad,0,Math.PI*2);ctx.fillStyle=dist<80?'rgba(17,17,17,.9)':'rgba(17,17,17,.35)';ctx.fill(); for(let j=idx+1;j<dots.length;j++){const q=dots[j],dd=Math.hypot(d.x-q.x,d.y-q.y);if(dd<55){ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(17,17,17,${(1-dd/55)*.16})`;ctx.stroke()}}}); raf=requestAnimationFrame(draw)}
    draw(); return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);el.removeEventListener('pointermove',move)}
  },[reduced])
  return <canvas className="particle-canvas" ref={canvas}/>
}

function ImageTrail() {
  const [items,setItems]=useState<{id:number;x:number;y:number;n:number}[]>([])
  const last=useRef({x:0,y:0,t:0}); const seq=useRef(0)
  const fine=usePointerFine(); const reduced=useReducedMotion()
  const move=(e:React.PointerEvent<HTMLDivElement>)=>{if(!fine||reduced)return; const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top; if(Math.hypot(x-last.current.x,y-last.current.y)<38)return;last.current={x,y,t:Date.now()};const id=Date.now()+seq.current++;setItems(v=>[...v.slice(-7),{id,x,y,n:seq.current%6}]);setTimeout(()=>setItems(v=>v.filter(i=>i.id!==id)),760)}
  return <div className="image-trail-stage" onPointerMove={move}><span className="demo-hint">move cursor</span>{items.map(i=><div key={i.id} className={`trail-tile trail-${i.n}`} style={{left:i.x,top:i.y}}><span>{labels[i.n]}</span></div>)}<div className="trail-center">DESIGN<br/>TRAIL</div></div>
}

function MagneticButton() {
  const ref=useRef<HTMLButtonElement>(null); const reduced=useReducedMotion()
  const move=(e:React.PointerEvent)=>{if(reduced)return;const r=ref.current?.getBoundingClientRect();if(!r)return;ref.current!.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px, ${(e.clientY-r.top-r.height/2)*.18}px)`}
  const reset=()=>{if(ref.current)ref.current.style.transform=''}
  return <div className="center-demo"><button ref={ref} onPointerMove={move} onPointerLeave={reset} className="magnetic-demo">Explore <ArrowUpRight size={15}/></button></div>
}

function TiltCard() {
  const ref=useRef<HTMLDivElement>(null); const reduced=useReducedMotion()
  const move=(e:React.PointerEvent)=>{if(reduced)return;const r=ref.current?.getBoundingClientRect();if(!r)return;const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ref.current!.style.transform=`perspective(600px) rotateX(${-y*13}deg) rotateY(${x*15}deg) translateZ(8px)`}
  const reset=()=>{if(ref.current)ref.current.style.transform=''}
  return <div className="center-demo"><div ref={ref} onPointerMove={move} onPointerLeave={reset} className="tilt-demo"><small>INTERACTION</small><strong>03</strong><span>Pointer-driven depth</span></div></div>
}

function Comparison() {const [v,setV]=useState(56);return <div className="compare-demo"><div className="compare-after">AFTER</div><div className="compare-before" style={{width:`${v}%`}}>BEFORE</div><div className="compare-line" style={{left:`${v}%`}}/><input aria-label="comparison position" type="range" min="0" max="100" value={v} onChange={e=>setV(+e.target.value)}/></div>}

function Typewriter(){const text='Design, named clearly.';const [n,setN]=useState(0);const reduced=useReducedMotion();useEffect(()=>{if(reduced){setN(text.length);return}const t=setInterval(()=>setN(v=>v>=text.length?0:v+1),95);return()=>clearInterval(t)},[reduced]);return <div className="center-demo typewriter-demo"><span>{text.slice(0,n)}</span><i/></div>}
function Scramble(){const target='INTERACTION';const chars='<>/{}[]01#&%';const [s,setS]=useState(target);useEffect(()=>{let f=0;const t=setInterval(()=>{f++;setS(target.split('').map((c,i)=>i<f/2?c:chars[Math.floor(Math.random()*chars.length)]).join(''));if(f>target.length*2){f=0}},85);return()=>clearInterval(t)},[]);return <div className="center-demo scramble-demo">{s}</div>}
function NumberTicker(){const [n,setN]=useState(0);useEffect(()=>{let v=0;const t=setInterval(()=>{v=(v+37)%1285;setN(v)},35);return()=>clearInterval(t)},[]);return <div className="center-demo ticker-demo"><b>{n.toLocaleString()}</b><span>references viewed</span></div>}
function Accordion(){const [open,setOpen]=useState(true);return <div className="accordion-demo"><button onClick={()=>setOpen(v=>!v)}>What is this pattern?<ChevronDown size={16} className={open?'rot':''}/></button><div className={open?'acc-body open':'acc-body'}><p>A compact disclosure with coordinated height, opacity and icon state.</p></div></div>}
function Confetti(){const [burst,setBurst]=useState(0);return <div className="center-demo confetti-demo"><button onClick={()=>setBurst(v=>v+1)}>Celebrate <Sparkles size={15}/></button><div key={burst} className="confetti-burst">{Array.from({length:16},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div></div>}

function SectionDemo({kind}:{kind:string}) {
  if(kind==='section-navbar') return <div className="mini-page nav-page"><div className="mini-nav"><b>Index</b><span>Explore</span><span>Collections</span><button>Search</button></div><div className="mini-ghost">design / reference</div></div>
  if(kind==='section-bento') return <div className="mini-bento"><div className="wide"><small>01 / VISUAL</small><b>See it first.</b></div><div className="tone">A</div><div><small>92</small><b>LIVE</b></div><div className="dark"><b>Copy →</b></div></div>
  if(kind==='section-logos') return <div className="logo-cloud-demo">{['MAGIC','MOTION','SHADCN','THREE','PIXEL'].map(x=><b key={x}>{x}</b>)}</div>
  if(kind==='section-stats') return <div className="stats-demo"><div><b>182</b><span>sources</span></div><div><b>90+</b><span>references</span></div><div><b>8</b><span>categories</span></div></div>
  if(kind==='section-timeline') return <div className="timeline-demo">{['Discover','Name','Copy','Build'].map((x,i)=><div key={x}><i>{i+1}</i><b>{x}</b></div>)}</div>
  if(kind==='section-pricing') return <div className="pricing-demo"><div><span>Basic</span><b>Free</b></div><div className="featured"><span>Studio</span><b>Pro</b><button>Choose</button></div><div><span>Team</span><b>Custom</b></div></div>
  if(kind==='section-testimonials') return <div className="quote-demo"><p>“I knew the look. I just didn’t know what to call it.”</p><span>— Vibe coder</span></div>
  if(kind==='section-comparison') return <div className="matrix-demo"><span></span><b>Native</b><b>Reference</b><span>Live preview</span><i>✓</i><i>↗</i><span>Copy code</span><i>✓</i><i>—</i></div>
  if(kind==='section-faq') return <Accordion/>
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
  const [ripples,setRipples]=useState<{id:number,x:number,y:number}[]>([])
  if(kind==='shader-gradient') return <div className={`demo-stage shader-demo ${detail?'detail':''}`}><ShaderBackdrop compact={!detail}/><span className="shader-label">WebGL / LIVE</span></div>
  if(kind==='particles') return <div className="demo-stage light-demo"><Particles/><span className="demo-hint">pointer reactive</span></div>
  if(kind==='image-trail') return <div className="demo-stage"><ImageTrail/></div>
  if(kind==='magnetic-button') return <div className="demo-stage warm-demo"><MagneticButton/></div>
  if(kind==='tilt-card'||kind==='style-clay') return <div className={`demo-stage ${kind==='style-clay'?'clay-stage':'dark-demo'}`}><TiltCard/></div>
  if(kind==='comparison-slider') return <div className="demo-stage"><Comparison/></div>
  if(kind==='typewriter') return <div className="demo-stage terminal-stage"><Typewriter/></div>
  if(kind==='scramble-text') return <div className="demo-stage terminal-stage"><Scramble/></div>
  if(kind==='number-ticker') return <div className="demo-stage acid-demo"><NumberTicker/></div>
  if(kind==='accordion'||kind==='accordion-motion') return <div className="demo-stage warm-demo"><Accordion/></div>
  if(kind==='confetti') return <div className="demo-stage warm-demo"><Confetti/></div>
  if(kind.startsWith('section-')) return <div className="demo-stage section-stage"><SectionDemo kind={kind}/></div>
  if(kind.startsWith('page-')) return <div className="demo-stage page-stage"><PageDemo kind={kind}/></div>
  if(kind.startsWith('designmd-')) return <div className="demo-stage designmd-stage"><DesignMdDemo kind={kind}/></div>

  if(kind==='ripple') return <div className="demo-stage ripple-stage" onPointerDown={e=>{const r=e.currentTarget.getBoundingClientRect(),id=Date.now();setRipples(v=>[...v,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);setTimeout(()=>setRipples(v=>v.filter(x=>x.id!==id)),700)}}><button>Click anywhere</button>{ripples.map(r=><i key={r.id} className="ripple-wave" style={{left:r.x,top:r.y}}/>)}</div>

  return <PointerSurface className={`demo-stage demo-${kind}`}>
    {kind==='aurora' && <><div className="aurora-ribbon a1"/><div className="aurora-ribbon a2"/><div className="aurora-ribbon a3"/><b className="center-label">AURORA</b></>}
    {kind==='gradient-mesh' && <><i className="mesh m1"/><i className="mesh m2"/><i className="mesh m3"/><b className="center-label dark-label">MESH</b></>}
    {kind==='meteors' && <><span className="center-label">NIGHT SIGNAL</span>{Array.from({length:9},(_,i)=><i className="meteor" key={i} style={{'--i':i} as React.CSSProperties}/>)}</>}
    {kind==='dot-grid' && <><div className="dot-field"/><span className="demo-hint">move cursor</span></>}
    {kind==='retro-grid' && <><div className="retro-sun"/><div className="retro-plane"/><b className="center-label">GRID / 1999</b></>}
    {kind==='spotlight'||kind==='spotlight-background' ? <><div className="spotlight-beam"/><b className="center-label">FOLLOW THE LIGHT</b></> : null}
    {kind==='beams' && <><i className="beam b1"/><i className="beam b2"/><i className="beam b3"/><b className="center-label">BEAMS</b></>}
    {kind==='waves' && <><div className="wave-lines">{Array.from({length:8},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</div><b className="center-label dark-label">SIGNAL</b></>}
    {kind==='noise-blobs' && <><i className="noise-blob n1"/><i className="noise-blob n2"/><i className="noise-blob n3"/><div className="grain"/></>}
    {kind==='fluid-cursor' && <><div className="fluid-field"/><b className="center-label">MOVE / MIX</b></>}
    {kind==='metaballs' && <><div className="metaballs">{Array.from({length:7},(_,i)=><i key={i} className={`ball ball-${i}`}/>)}</div><span className="demo-hint">living cells</span></>}
    {kind==='starfield' && <><div className="stars s1"/><div className="stars s2"/><b className="center-label">DEEP SPACE</b></>}
    {kind==='scroll-reveal' && <div className="scroll-reveal-sim"><small>SCROLL / REVEAL</small><div><b>01</b><span>Discover</span></div><div><b>02</b><span>Recognize</span></div><div><b>03</b><span>Build</span></div></div>}
    {kind==='parallax' && <><div className="parallax-card pc1">STYLE</div><div className="parallax-card pc2">MOTION</div><div className="parallax-card pc3">TYPE</div><b className="center-label dark-label">PARALLAX</b></>}
    {kind==='hover-lift' && <div className="lift-row">{['01','02','03'].map(x=><div key={x}><small>{x}</small><b>Hover me</b></div>)}</div>}
    {kind==='marquee' && <div className="marquee-track">{[...labels,...labels].map((x,i)=><b key={i}>{x}<i>✦</i></b>)}</div>}
    {kind==='sticky-story' && <div className="sticky-demo"><aside><small>PROCESS</small><b>One idea,<br/>four steps.</b></aside><div>{['SEE','NAME','COPY','BUILD'].map((x,i)=><span key={x}>{i+1} / {x}</span>)}</div></div>}
    {kind==='horizontal-scroll' && <div className="horizontal-demo">{['STYLE','PAGE','MOTION','EFFECT'].map((x,i)=><div key={x}><small>0{i+1}</small><b>{x}</b></div>)}</div>}
    {kind==='cursor-follow' && <><div className="cursor-orb"/><b className="center-label dark-label">FOLLOW</b></>}
    {kind==='morph' && <div className="morph-shape"/>}
    {kind==='text-reveal' && <div className="text-reveal-demo"><span><b>SEE IT.</b></span><span><b>NAME IT.</b></span><span><b>BUILD IT.</b></span></div>}
    {kind==='blur-reveal' && <div className="blur-reveal-demo">FOCUS</div>}
    {kind==='split-text' && <div className="split-demo">{'MOTION'.split('').map((x,i)=><i key={i} style={{'--i':i} as React.CSSProperties}>{x}</i>)}</div>}
    {kind==='gradient-text' && <div className="gradient-text-demo">COLOR<br/>IS TYPE</div>}
    {kind==='shimmer-text' && <div className="shimmer-text-demo">SHIMMER</div>}
    {kind==='rotating-words' && <div className="rotating-demo"><span>Make it</span><div><b>clear</b><b>playful</b><b>alive</b><b>useful</b></div></div>}
    {kind==='rough-highlight' && <div className="rough-demo">Build the <mark>idea</mark>,<br/>not the jargon.</div>}
    {kind==='glass-card'||kind==='style-glass' ? <div className="glass-card-demo"><small>GLASS / 04</small><b>Translucent<br/>depth</b><span>blur · edge · light</span></div> : null}
    {kind==='glow-card' && <div className="glow-card-demo"><Command size={23}/><b>Command</b><span>Hover to charge</span></div>}
    {kind==='spotlight-card' && <div className="spotlight-card-demo"><small>03 / POINTER</small><b>Local light</b><span>move across the surface</span></div>}
    {kind==='animated-border' && <div className="animated-border-demo"><div><Sparkles/><b>Live component</b></div></div>}
    {kind==='shimmer-button' && <button className="shimmer-button-demo">Copy prompt <Sparkles size={15}/></button>}
    {kind==='liquid-lens'||kind==='liquid-lens-effect'||kind==='style-liquid' ? <><div className="lens-copy"><b>DISCOVER</b><span>Move the lens</span></div><div className="liquid-lens"/></> : null}
    {kind==='rgb-lens' && <><div className="rgb-bg">DESIGN</div><div className="rgb-lens">DESIGN</div></>}
    {kind==='image-reveal' && <div className="image-reveal-demo"><div/><b>STUDIO / 24</b></div>}
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
    if(entry)return <DemoViewport detail={detail}><VendorDesignPreview tokens={entry.tokens} name={entry.name} category={entry.category}/></DemoViewport>
    return <DemoViewport detail={detail}><div className="ds-preview"><p>Preview loading…</p></div></DemoViewport>
  }
  return <DemoViewport detail={detail}>{kind==='shader-gradient'&&preset?<div className="demo-stage shader-demo"><ShaderBackdrop preset={preset} compact={!detail}/></div>:recipes[kind]?<RecipeDemo kind={kind}/>:<LegacyDemoRenderer kind={kind} detail={detail}/>}</DemoViewport>
}
