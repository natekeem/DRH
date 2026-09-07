import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, Github, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CopyBlock } from '../components/CopyBlock'
import { DemoRenderer } from '../components/demos/DemoRenderer'
import { ReferenceCard } from '../components/ReferenceCard'
import { categoryKo, descriptionKo } from '../data/ko'
import { references } from '../data/references'

const codeFor=(id:string,name:string)=>`// ${name}\n// Demo key: ${id}\n// See src/components/demos/DemoRenderer.tsx\n\n<DemoRenderer kind="${id}" />`

export function ReferencePage(){
  const {id}=useParams(); const item=references.find(r=>r.id===id)
  if(!item)return <main className="not-found"><h1>Reference를 찾을 수 없습니다.</h1><Link to="/explore">탐색으로 돌아가기</Link></main>
  const related=references.filter(r=>r.id!==item.id&&(r.category===item.category||r.tags.some(t=>item.tags.includes(t)))).slice(0,4)
  const externalSource=item.source.name!=='Design Reference Hub' && /^https?:\/\//.test(item.source.url)
  return <main className="detail-page">
    <div className="detail-top"><Link to="/explore"><ArrowLeft size={16}/> 탐색으로</Link><span>{item.category} · {categoryKo[item.category]} / {item.subcategory}</span></div>
    <section className="detail-head"><div><div className="detail-badges"><span className={`license-pill ${item.license.status}`}>{item.license.status==='copy-ok'?'● Copy OK':item.license.status==='reference'?'● Reference only':'● Restricted'}</span><span>LIVE DEMO</span></div><h1>{item.name}</h1><p>{descriptionKo(item)}</p><div className="tag-list">{item.tags.map(t=><span key={t}>#{t}</span>)}</div></div><div className="detail-number">{String(references.indexOf(item)+1).padStart(3,'0')}</div></section>
    <section className="detail-demo-shell"><div className="demo-toolbar"><span><i/> INTERACTIVE PREVIEW</span><span>가능한 Demo는 직접 Move / Hover / Click 해보세요.</span></div><div className="detail-demo"><DemoRenderer kind={item.demo} detail/></div></section>

    <section className="detail-grid"><div className="detail-main"><section className="detail-copy"><span className="eyebrow">WHAT IT IS · 무엇인가요?</span><h2>{descriptionKo(item)}</h2><div className="usecase-row"><div><small>잘 어울리는 용도</small>{item.useCases.map(x=><span key={x}>{x}</span>)}</div><div><small>구현 방식</small><span>{item.implementation.framework}</span>{item.implementation.dependencies.map(x=><span key={x}>{x}</span>)}</div></div></section>
      <CopyBlock label="PROMPT 복사" text={item.prompt}/>
      {item.designMd&&<CopyBlock label="DESIGN.md 복사" text={item.designMd} code/>}
      {item.license.status==='copy-ok'&&<CopyBlock label="IMPLEMENTATION STARTER 복사" text={item.code??codeFor(item.demo,item.name)} code/>}
    </div>
    <aside className="source-panel"><span className="eyebrow">SOURCE / LICENSE</span><h3>{item.source.name}</h3><p>{externalSource?'원본 Source와 License 판단 근거를 함께 표시합니다. “무료로 볼 수 있음”과 “코드를 재배포할 수 있음”은 구분합니다.':'이 Demo는 Design Reference Hub 내부 구현입니다. 외부 원본 링크가 없는 경우 의미 없는 링크를 만들지 않습니다.'}</p><dl><div><dt>License</dt><dd><ShieldCheck size={15}/>{item.license.name}</dd></div><div><dt>Demo</dt><dd>{item.implementation.type}</dd></div><div><dt>Attribution</dt><dd>{item.license.attributionRequired?'Source credit 유지':'Hub original / 별도 표기 불필요'}</dd></div></dl>{externalSource&&<a href={item.source.url} target="_blank" rel="noreferrer">Original source <ExternalLink size={15}/></a>}{item.source.repository&&<a href={item.source.repository} target="_blank" rel="noreferrer"><Github size={15}/> Repository</a>}{item.license.evidenceUrl&&item.license.evidenceUrl!==item.source.repository&&<a href={item.license.evidenceUrl} target="_blank" rel="noreferrer"><CheckCircle2 size={15}/> License evidence</a>}{item.license.notes&&<small>{item.license.notes}</small>}</aside></section>

    <section className="related section-pad"><div className="section-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>비슷한 Reference</h2></div><div className="reference-grid compact-grid">{related.map(r=><ReferenceCard key={r.id} item={r}/>)}</div><Link className="text-link" to={`/explore?category=${encodeURIComponent(item.category)}`}>{item.category} 전체 보기 <ArrowUpRight size={16}/></Link></section>
  </main>
}
