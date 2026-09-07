import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, Github, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CopyBlock } from '../components/CopyBlock'
import { DemoRenderer } from '../components/demos/DemoRenderer'
import { ReferenceCard } from '../components/ReferenceCard'
import { references } from '../data/references'

const codeFor=(id:string,name:string)=>`// ${name}\n// Demo key: ${id}\n// See src/components/demos/DemoRenderer.tsx\n\n<DemoRenderer kind="${id}" />`

export function ReferencePage(){
  const {id}=useParams(); const item=references.find(r=>r.id===id)
  if(!item)return <main className="not-found"><h1>Reference not found.</h1><Link to="/explore">Back to Explore</Link></main>
  const related=references.filter(r=>r.id!==item.id&&(r.category===item.category||r.tags.some(t=>item.tags.includes(t)))).slice(0,4)
  return <main className="detail-page">
    <div className="detail-top"><Link to="/explore"><ArrowLeft size={16}/> Explore</Link><span>{item.category} / {item.subcategory}</span></div>
    <section className="detail-head"><div><div className="detail-badges"><span className={`license-pill ${item.license.status}`}>{item.license.status==='copy-ok'?'● Copy OK':item.license.status==='reference'?'● Reference only':'● Restricted'}</span><span>LIVE DEMO</span></div><h1>{item.name}</h1><p>{item.description}</p><div className="tag-list">{item.tags.map(t=><span key={t}>#{t}</span>)}</div></div><div className="detail-number">{String(references.indexOf(item)+1).padStart(3,'0')}</div></section>
    <section className="detail-demo-shell"><div className="demo-toolbar"><span><i/> INTERACTIVE PREVIEW</span><span>Move / hover / click where it makes sense</span></div><div className="detail-demo"><DemoRenderer kind={item.demo} detail/></div></section>

    <section className="detail-grid"><div className="detail-main"><section className="detail-copy"><span className="eyebrow">WHAT IT IS</span><h2>{item.description}</h2><div className="usecase-row"><div><small>Best for</small>{item.useCases.map(x=><span key={x}>{x}</span>)}</div><div><small>Implementation</small><span>{item.implementation.framework}</span>{item.implementation.dependencies.map(x=><span key={x}>{x}</span>)}</div></div></section>
      <CopyBlock label="COPY PROMPT" text={item.prompt}/>
      {item.designMd&&<CopyBlock label="COPY DESIGN.md" text={item.designMd} code/>}
      {item.license.status==='copy-ok'&&<CopyBlock label="IMPLEMENTATION STARTER" text={item.code??codeFor(item.demo,item.name)} code/>}
    </div>
    <aside className="source-panel"><span className="eyebrow">SOURCE / PROVENANCE</span><h3>{item.source.name}</h3><p>Every reference keeps a source and license decision. The Hub never treats “free to view” as permission to redistribute code.</p><dl><div><dt>Status</dt><dd><ShieldCheck size={15}/>{item.license.name}</dd></div><div><dt>Implementation</dt><dd>{item.implementation.type}</dd></div><div><dt>Attribution</dt><dd>{item.license.attributionRequired?'Keep source credit':'Not required for Hub original'}</dd></div></dl><a href={item.source.url} target="_blank" rel="noreferrer">Original source <ExternalLink size={15}/></a>{item.source.repository&&<a href={item.source.repository} target="_blank" rel="noreferrer"><Github size={15}/> Repository</a>}{item.license.evidenceUrl&&<a href={item.license.evidenceUrl} target="_blank" rel="noreferrer"><CheckCircle2 size={15}/> License evidence</a>}{item.license.notes&&<small>{item.license.notes}</small>}</aside></section>

    <section className="related section-pad"><div className="section-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>Related references</h2></div><div className="reference-grid compact-grid">{related.map(r=><ReferenceCard key={r.id} item={r}/>)}</div><Link className="text-link" to={`/explore?category=${encodeURIComponent(item.category)}`}>See all {item.category} <ArrowUpRight size={16}/></Link></section>
  </main>
}
