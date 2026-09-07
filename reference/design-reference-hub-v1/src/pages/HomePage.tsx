import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { ReferenceCard } from '../components/ReferenceCard'
import { categories, collections, references } from '../data/references'

const categoryDescriptions:Record<string,string> = {
  Styles:'Visual language for the whole interface.', Pages:'Complete page references and product shells.', Sections:'Heroes, pricing, proof, CTA and page building blocks.', Background:'Aurora, shaders, grids, particles and atmosphere.', Motion:'Scroll, hover, cursor and spatial interaction.', Text:'Kinetic typography, reveal and data motion.', Effects:'Glass, glow, lens, border and media treatments.', 'DESIGN.md':'Agent-ready design direction you can copy into a project.'
}

export function HomePage(){
  const spotlight=['shader-gradient','liquid-lens-effect','image-trail','neo-brutalism','bento-section','text-reveal'].map(id=>references.find(r=>r.id===id)!).filter(Boolean)
  return <>
    <Hero/>
    <main>
      <section className="home-intro section-pad"><div className="section-heading split"><div><span className="eyebrow">01 / START BY LOOKING</span><h2>The menu is visual.<br/>The vocabulary comes second.</h2></div><p>Inspired by visual vocabulary libraries and curated DESIGN.md collections, but optimized for a shorter workflow: preview → identify → copy → build.</p></div>
        <div className="category-grid">{categories.map((cat,i)=><Link key={cat} to={`/explore?category=${encodeURIComponent(cat)}`}><small>0{i+1}</small><h3>{cat}</h3><p>{categoryDescriptions[cat]}</p><ArrowUpRight size={18}/></Link>)}</div>
      </section>

      <section className="dark-section section-pad"><div className="section-heading split"><div><span className="eyebrow light">02 / LIVE, NOT SCREENSHOTS</span><h2>Move it.<br/>Hover it. Break it.</h2></div><p>Every high-value reference should eventually be interactive. The first build starts with representative native demos and a backlog designed for systematic expansion.</p></div>
        <div className="spotlight-grid">{spotlight.map((r,i)=><ReferenceCard key={r.id} item={r} large={i<2}/>)}</div>
      </section>

      <section className="section-pad collections-preview"><div className="section-heading"><span className="eyebrow">03 / CURATED PATHS</span><h2>Collections for people who<br/>don’t want to browse forever.</h2></div><div className="collection-grid">{collections.slice(0,4).map((c,i)=><Link to={`/collections#${c.id}`} className={`collection-card c${i}`} key={c.id}><small>{String(i+1).padStart(2,'0')} / {c.ids.length} refs</small><h3>{c.title}</h3><p>{c.description}</p><div>{c.ids.slice(0,4).map(id=><span key={id}>{references.find(r=>r.id===id)?.name}</span>)}</div><ArrowUpRight/></Link>)}</div><Link className="text-link" to="/collections">View all collections <ArrowUpRight size={16}/></Link></section>

      <section className="agent-section"><div><span className="eyebrow light">04 / HAND IT TO YOUR AGENT</span><h2>One reference library.<br/>Two readers.</h2><p>Humans browse the live gallery. Coding agents receive prompts, implementation notes and DESIGN.md from the same dataset.</p><Link to="/explore?category=DESIGN.md">Browse DESIGN.md <ArrowUpRight size={17}/></Link></div><pre><code>{`reference.dataset\n├─ web → browse / preview / copy\n└─ agent → prompt / design.md / source\n\nstatus: source_of_truth ✓`}</code></pre></section>
    </main>
  </>
}
