import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReferenceItem } from '../types'
import { DemoRenderer } from './demos/DemoRenderer'

const statusLabel = { 'copy-ok':'Copy OK', 'reference':'Reference', 'restricted':'Restricted' } as const

export function ReferenceCard({ item, large=false }:{item:ReferenceItem;large?:boolean}) {
  return <Link className={`reference-card ${large?'large':''}`} to={`/reference/${item.id}`}>
    <div className="card-demo"><DemoRenderer kind={item.demo}/><div className="live-chip"><i/> LIVE</div></div>
    <div className="card-meta">
      <div><span className="eyebrow">{item.category} / {item.subcategory}</span><h3>{item.name}</h3></div>
      <ArrowUpRight size={18}/>
    </div>
    <p>{item.description}</p>
    <div className="card-tags"><span className={`license-dot ${item.license.status}`}>{statusLabel[item.license.status]}</span>{item.tags.slice(0,3).map(t=><span key={t}>#{t}</span>)}</div>
  </Link>
}
