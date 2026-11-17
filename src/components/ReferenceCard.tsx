import { ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { ReferenceItem } from '../types'
import { categoryDisplayName, categoryKo, descriptionKo } from '../data/ko'
import { demoMaturity } from '../lib/referencePackage'
import { DemoRenderer } from './demos/DemoRenderer'
import { DesignSystemPreview } from './demos/DesignSystemPreview'
import { BrandIdentityMark } from './BrandIdentityMark'

const statusLabel = { 'copy-ok':'Copy OK', 'reference':'Reference', 'restricted':'Restricted' } as const

export function ReferenceCard({ item, large=false }:{item:ReferenceItem;large?:boolean}) {
  const location=useLocation()
  const maturity=demoMaturity(item)
  const isPage=item.category==='Pages'
  const designSystemCard=item.category==='DESIGN.md'
  const tokenDesignSystemCard=Boolean(item.designSystem)
  const vendorBrand=item.demo.startsWith('vendor-design-md:')
  const vendorSlug=vendorBrand?item.demo.slice('vendor-design-md:'.length):null

  return <article className={`reference-card ${large?'large':''}${isPage?' page-reference-card':''}${designSystemCard?' design-system-reference-card':''}${tokenDesignSystemCard?' token-design-system-card':''}${vendorBrand?' brand-reference-card':''}`}>
    <div className="card-demo">
      {item.designSystem?<DesignSystemPreview tokens={item.designSystem} compact/>:<DemoRenderer kind={item.demo} detail={large}/>}
    </div>
    <div className="card-summary">
      <div className="card-meta">
        <span className="eyebrow">{categoryDisplayName(item.category)} · {categoryKo[item.category]} / {item.subcategory}</span>
        <h3>
          <Link className="reference-card-link" state={{fromExplore:location.pathname==='/explore'}} to={`/reference/${item.id}`} aria-label={`${item.name} 상세 보기`}>
            {vendorSlug&&<BrandIdentityMark slug={vendorSlug}/>}
            <span className="card-title">{item.name}</span>
            <ArrowUpRight size={18} aria-hidden="true"/>
          </Link>
        </h3>
      </div>
      <p>{descriptionKo(item)}</p>
      <div className="card-footer">
        <div className="card-tags">
          <div className={`live-chip maturity-${maturity.kind}`}><i aria-hidden="true"/> {maturity.label}</div>
          <span className={`license-dot ${item.license.status}`}>{statusLabel[item.license.status]}</span>
          {(vendorBrand?item.tags.filter(t=>!['vendor','awesome-design-md'].includes(t)).slice(0,2):item.tags.slice(0,3)).map(t=><span key={t}>#{t}</span>)}
        </div>
      </div>
    </div>
  </article>
}
