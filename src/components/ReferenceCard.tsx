import { ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { ReferenceItem } from '../types'
import { categoryKo, descriptionKo } from '../data/ko'
import { demoMaturity } from '../lib/referencePackage'
import { DemoRenderer } from './demos/DemoRenderer'
import { DesignSystemPreview } from './demos/DesignSystemPreview'
import { recipes } from '../lib/demos/recipes'

const statusLabel = { 'copy-ok':'Copy OK', 'reference':'Reference', 'restricted':'Restricted' } as const

export function ReferenceCard({ item, large=false }:{item:ReferenceItem;large?:boolean}) {
  const location=useLocation()
  const maturity=demoMaturity(item)
  const statusBelowPreview=Boolean(recipes[item.demo]?.sourceNotes)
  return <article className={`reference-card ${large?'large':''}`}>
    <div className="card-demo">{item.designSystem?<DesignSystemPreview tokens={item.designSystem} compact/>:<DemoRenderer kind={item.demo}/>}<div className={`live-chip maturity-${maturity.kind}`} hidden={statusBelowPreview}><i/> {maturity.label}</div></div>
    <Link className="reference-card-link" state={{fromExplore:location.pathname==='/explore'}} to={`/reference/${item.id}`} aria-label={`${item.name} 상세 보기`}>
      <div className="card-meta">
        <div><span className="eyebrow">{item.category} · {categoryKo[item.category]} / {item.subcategory}</span><h3>{item.name}</h3></div>
        <ArrowUpRight size={18}/>
      </div>
      {statusBelowPreview&&<span className={`preview-status maturity-${maturity.kind}`}>● {maturity.label}</span>}
      <p>{descriptionKo(item)}</p>
      <div className="card-tags"><span className={`license-dot ${item.license.status}`}>{statusLabel[item.license.status]}</span>{item.tags.slice(0,3).map(t=><span key={t}>#{t}</span>)}</div>
    </Link>
  </article>
}
