import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ExternalLink, RotateCcw } from 'lucide-react'
import { Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { shaderPresets } from '../data/shaderPresets'
import { DemoRenderer } from '../components/demos/DemoRenderer'
import { DesignSystemPreview } from '../components/demos/DesignSystemPreview'
import { ArtifactWorkspace } from '../components/ArtifactWorkspace'
import { ReferenceCard } from '../components/ReferenceCard'
import { categoryKo, descriptionKo } from '../data/ko'
import { references } from '../data/references'
import { demoMaturity, provenanceFor } from '../lib/referencePackage'
import { artifactViews } from '../lib/artifacts'

export function ReferencePage(){
  const location=useLocation(),navigate=useNavigate()
  const [params]=useSearchParams(), [replay,setReplay]=useState(0)
  const preset=shaderPresets.find(p=>p.id===params.get('preset'))??shaderPresets[0]
  const {id}=useParams(), item=references.find(r=>r.id===id)
  const artifacts=useMemo(()=>item?artifactViews(item,preset):[],[item,preset])
  if(!item)return <main className="not-found"><h1>Reference를 찾을 수 없습니다.</h1><Link to="/explore">탐색으로 돌아가기</Link></main>
  const related=references.filter(r=>r.id!==item.id&&(r.category===item.category||r.tags.some(t=>item.tags.includes(t)))).slice(0,4)
  const maturity=demoMaturity(item)
  return <main className="reference-workspace-page">
    <header className="workspace-title"><div>{(location.state as {fromExplore?:boolean}|null)?.fromExplore?<button className="detail-back" onClick={()=>navigate(-1)}><ArrowLeft size={16}/> 탐색</button>:<Link to="/explore"><ArrowLeft size={16}/> 탐색</Link>}<span className="workspace-divider"/><h1>{item.name}</h1></div><div className="detail-badges"><span className={`demo-status-pill maturity-${maturity.kind}`}>● {maturity.label}</span><span className={`license-pill ${item.license.status}`}>{item.license.status==='copy-ok'?'● Copy OK':item.license.status==='reference'?'● Reference only':'● Restricted'}</span></div></header>
    <div className="reference-workspace">
      <section className="workspace-preview" aria-label="Live preview"><div className="preview-meta"><span>{item.category} · {categoryKo[item.category]} / {item.subcategory}</span><span>01 / SEE</span></div><div className="workspace-demo-shell"><div className="demo-toolbar"><span><i/>{item.designSystem?'DESIGN SYSTEM PREVIEW':maturity.kind==='external'?'SOURCE REFERENCE':'LIVE PREVIEW'}</span>{maturity.kind!=='external'&&<button onClick={()=>setReplay(v=>v+1)}><RotateCcw size={13}/> Replay</button>}</div><div className={`detail-demo workspace-demo ${item.category==='Pages'||item.category==='Background'?'wide-preview':''}`} key={item.id+replay}>{item.designSystem?<DesignSystemPreview tokens={item.designSystem}/>:maturity.kind==='external'?<div className="source-only-preview"><h2>원본에서 확인하는 Reference</h2><p>이 항목은 코드와 이미지를 재배포하지 않습니다.</p><a href={item.source.url} target="_blank" rel="noreferrer">Source 열기 ↗</a></div>:<DemoRenderer kind={item.demo} detail preset={preset}/>}</div></div><div className="preview-description"><h2>{descriptionKo(item)}</h2><p>{item.designSystem?'문서에 정의된 토큰의 시각화입니다. 외부 브랜드 화면을 복제하지 않습니다.':maturity.description}</p>{item.demo==='shader-gradient'&&<p>공식 프리셋 · {preset.title}</p>}<div className="tag-list">{item.tags.map(t=><span key={t}>#{t}</span>)}</div></div></section>
      <ArtifactWorkspace key={item.id} artifacts={artifacts}/>
    </div>
    <section className="workspace-context"><div><span className="eyebrow">WHERE IT FITS</span><h2>이런 화면에 사용하세요.</h2><div className="tag-list">{item.useCases.map(x=><span key={x}>{x}</span>)}</div><p>{item.implementation.framework} · {item.implementation.dependencies.join(', ')||'추가 의존성 없음'}</p></div><aside><span className="eyebrow">SOURCE / LICENSE</span><h2>{item.source.name}</h2><p>{provenanceFor(item)}</p><p>{item.license.notes}</p><div className="workspace-source-links"><a href={item.source.url||'https://github.com/natekeem/DRH'} target="_blank" rel="noreferrer">원본 출처 <ExternalLink size={14}/></a>{item.source.repository&&<a href={item.source.repository} target="_blank" rel="noreferrer">Repository ↗</a>}{item.license.evidenceUrl&&<a href={item.license.evidenceUrl} target="_blank" rel="noreferrer">License evidence ↗</a>}</div></aside></section>
    <section className="related workspace-related"><div className="section-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>비슷한 Reference</h2></div><div className="reference-grid compact-grid">{related.map(r=><ReferenceCard key={r.id} item={r}/>)}</div><Link className="text-link" to={`/explore?category=${encodeURIComponent(item.category)}`}>{item.category} 전체 보기 <ArrowUpRight size={16}/></Link></section>
  </main>
}
