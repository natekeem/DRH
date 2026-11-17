import { useMemo, useState, useEffect } from 'react'
import { ArrowLeft, ArrowUpRight, ExternalLink, RotateCcw, Monitor, Tablet, Smartphone, Maximize2, X } from 'lucide-react'
import { Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { shaderPresets } from '../data/shaderPresets'
import { DemoRenderer } from '../components/demos/DemoRenderer'
import { DesignSystemPreview } from '../components/demos/DesignSystemPreview'
import { ArtifactWorkspace } from '../components/ArtifactWorkspace'
import { ReferenceCard } from '../components/ReferenceCard'
import { BrandIdentityMark } from '../components/BrandIdentityMark'
import { aboutBodyKo, categoryDisplayName, categoryKo, descriptionKo } from '../data/ko'
import { publicCollections as collections, publicReferences as references, vendorSlugFromId } from '../data/references'
import { demoMaturity, provenanceFor } from '../lib/referencePackage'
import { relatedReferencesFor } from '../lib/relatedReferences'
import { artifactViews } from '../lib/artifacts'
import { fetchVendorDesignMd } from '../lib/vendorDesignMd'
import type { ArtifactView } from '../lib/artifacts'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export function ReferencePage(){
  const location=useLocation(),navigate=useNavigate()
  const [params]=useSearchParams(), [replay,setReplay]=useState(0)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [isExpanded, setIsExpanded] = useState(false)

  const preset=shaderPresets.find(p=>p.id===params.get('preset'))??shaderPresets[0]
  const {id}=useParams(), item=references.find(r=>r.id===id)
  const vendorSlug=item?vendorSlugFromId(item.id):null
  const [vendorRawMd,setVendorRawMd]=useState<string|null>(null)
  const [vendorMdLoading,setVendorMdLoading]=useState(false)

  // Lazy-fetch the raw DESIGN.md for vendor entries when the page loads
  useEffect(()=>{
    let active=true
    setVendorRawMd(null)
    if(!vendorSlug){setVendorMdLoading(false);return}
    setVendorMdLoading(true)
    fetchVendorDesignMd(vendorSlug)
      .then(raw=>{if(active)setVendorRawMd(raw)})
      .catch(()=>{if(active)setVendorRawMd(null)})
      .finally(()=>{if(active)setVendorMdLoading(false)})
    return()=>{active=false}
  },[vendorSlug])

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) setIsExpanded(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const baseArtifacts=useMemo(()=>item?artifactViews(item,preset):[],[item,preset])
  // Patch the DESIGN.md tab with real content once loaded
  const artifacts=useMemo(():ArtifactView[]=>{
    if(!vendorSlug||!vendorRawMd)return baseArtifacts
    return baseArtifacts.map(a=>a.id==='designMd'?{...a,text:vendorRawMd}:a)
  },[baseArtifacts,vendorSlug,vendorRawMd])

  if(!item)return <main className="not-found"><h1>Reference를 찾을 수 없습니다.</h1><Link to="/explore">탐색으로 돌아가기</Link></main>
  const related=relatedReferencesFor(item,references,collections)
  const maturity=demoMaturity(item)
  const isVendor=!!vendorSlug

  return <main className={"reference-workspace-page"+(isVendor?" brand-experience-page":"")}>
    <header className="workspace-title">
      <div>
        {(location.state as {fromExplore?:boolean}|null)?.fromExplore?<button className="detail-back" onClick={()=>navigate(-1)}><ArrowLeft size={16}/> 탐색</button>:<Link to="/explore"><ArrowLeft size={16}/> 탐색</Link>}
        <span className="workspace-divider"/>
        {vendorSlug?<div className="workspace-brand-heading"><BrandIdentityMark slug={vendorSlug}/><h1>{item.name}</h1></div>:<h1>{item.name}</h1>}
      </div>
      <div className="detail-badges">
        <span className={`demo-status-pill maturity-${maturity.kind}`}>● {maturity.label}</span>
        <span className={`license-pill ${item.license.status}`}>{item.license.status==='copy-ok'?'● Copy OK':item.license.status==='reference'?'● Reference only':'● Restricted'}</span>
        {isVendor&&<span className="license-pill copy-ok">● Source document · MIT</span>}
      </div>
    </header>

    <div className="reference-workspace">
      <div className="reference-workspace-meta">
        <div>
          <span>{categoryDisplayName(item.category)} · {categoryKo[item.category]} / {item.subcategory}</span>
          <span>01 / SEE</span>
        </div>
        <div>
          <span>AGENT PACKAGE</span>
          <span>02 / USE</span>
        </div>
      </div>

      <section className="workspace-preview" aria-label="Live preview">
        <div className="workspace-demo-shell">
          <div className="demo-toolbar">
            <div className="demo-toolbar-left">
              <span><i/>{isVendor?'BRAND DESIGN PREVIEW':item.designSystem?'DESIGN SYSTEM PREVIEW':maturity.kind==='external'?'SOURCE REFERENCE':'LIVE PREVIEW'}</span>

              {/* Viewport Device Switcher */}
              <div className="viewport-device-switcher" role="group" aria-label="디바이스 뷰포트 전환">
                <button
                  type="button"
                  className={deviceMode==='desktop'?'active':''}
                  onClick={()=>setDeviceMode('desktop')}
                  title="데스크톱 (100%)"
                >
                  <Monitor size={12}/>
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  className={deviceMode==='tablet'?'active':''}
                  onClick={()=>setDeviceMode('tablet')}
                  title="태블릿 (768px)"
                >
                  <Tablet size={12}/>
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  className={deviceMode==='mobile'?'active':''}
                  onClick={()=>setDeviceMode('mobile')}
                  title="모바일 (390px)"
                >
                  <Smartphone size={12}/>
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            <div className="demo-toolbar-right">
              {!isVendor&&maturity.kind!=='external'&&<button type="button" onClick={()=>setReplay(v=>v+1)} title="새로고침"><RotateCcw size={12}/> Replay</button>}
              <button
                type="button"
                onClick={()=>setIsExpanded(true)}
                title="크게 보기"
                className="expand-preview-btn"
              >
                <Maximize2 size={12}/> 크게 보기
              </button>
            </div>
          </div>

          <div className={`detail-demo-stage device-stage-${deviceMode}`}>
            <div className={`device-frame-shell device-frame-${deviceMode}`}>
              <div className={`detail-demo workspace-demo ${['Pages','Sections','Background'].includes(item.category)?'wide-preview':''}${item.category==='Sections'?' section-preview':''}`} key={item.id+replay}>
                {item.designSystem?<DesignSystemPreview tokens={item.designSystem}/>:maturity.kind==='external'?<div className="source-only-preview"><h2>원본에서 확인하는 Reference</h2><p>이 항목은 코드와 이미지를 재배포하지 않습니다.</p><a href={item.source.url} target="_blank" rel="noreferrer">Source 열기 ↗</a></div>:<DemoRenderer kind={item.demo} detail preset={preset}/>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArtifactWorkspace key={item.id+(vendorRawMd?'loaded':'pending')} artifacts={artifacts} item={item}/>
    </div>

    <section className="workspace-context">
      <div className="context-about">
        <span className="eyebrow">ABOUT THIS REFERENCE</span>
        {vendorSlug?<div className="about-brand-heading"><BrandIdentityMark slug={vendorSlug} context="about"/><h2>{descriptionKo(item)}</h2></div>:<h2>{descriptionKo(item)}</h2>}
        <p>{aboutBodyKo(item)}</p>
        {item.demo==='shader-gradient'&&<p>공식 프리셋 · {preset.title}</p>}
        {isVendor&&vendorMdLoading&&<p style={{opacity:0.5,fontSize:'0.8em'}}>DESIGN.md 로딩 중…</p>}
        <div className="tag-list">{item.tags.filter(t=>!['vendor','awesome-design-md'].includes(t)).slice(0,6).map(t=><span key={t}>#{t}</span>)}</div>
      </div>
      <div className="context-where">
        <span className="eyebrow">WHERE IT FITS</span>
        <h2>이런 화면에 사용하세요.</h2>
        <div className="tag-list">{item.useCases.map(x=><span key={x}>{x}</span>)}</div>
        <p>구현: {item.implementation.framework} · {item.implementation.dependencies.join(', ')||'추가 의존성 없음'}</p>
      </div>
    </section>

    {item.source.name !== 'Design Reference Hub' && <section className="workspace-source">
      <span className="eyebrow">SOURCE / PROVENANCE</span>
      <h2>{item.source.name}</h2>
      <p>{provenanceFor(item)}</p>
      <p>{item.license.notes}</p>
      <div className="workspace-source-links">
        {item.source.url && <a href={item.source.url} target="_blank" rel="noreferrer">원본 출처 <ExternalLink size={14}/></a>}
        {item.source.repository&&<a href={item.source.repository} target="_blank" rel="noreferrer">Repository ↗</a>}
        {item.license.evidenceUrl&&<a href={item.license.evidenceUrl} target="_blank" rel="noreferrer">License evidence ↗</a>}
      </div>
    </section>}

    <section className="related workspace-related">
      <div className="section-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>비슷한 Reference</h2></div>
      <div className="reference-grid compact-grid">{related.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>
      <Link className="text-link" to={`/explore?category=${encodeURIComponent(item.category)}`}>{categoryDisplayName(item.category)} 전체 보기 <ArrowUpRight size={16}/></Link>
    </section>

    {/* Fullscreen Expanded Modal */}
    {isExpanded && (
      <div className="fullscreen-preview-modal" role="dialog" aria-modal="true" aria-label={`${item.name} 전체화면 미리보기`}>
        <div className="fullscreen-backdrop" onClick={() => setIsExpanded(false)} />
        <div className="fullscreen-container">
          <header className="fullscreen-header">
            <div className="fullscreen-title">
              <strong>{item.name}</strong>
              <span>{categoryDisplayName(item.category)} · {item.subcategory}</span>
            </div>

            <div className="viewport-device-switcher">
              <button className={deviceMode==='desktop'?'active':''} onClick={()=>setDeviceMode('desktop')}><Monitor size={12}/> Desktop</button>
              <button className={deviceMode==='tablet'?'active':''} onClick={()=>setDeviceMode('tablet')}><Tablet size={12}/> Tablet</button>
              <button className={deviceMode==='mobile'?'active':''} onClick={()=>setDeviceMode('mobile')}><Smartphone size={12}/> Mobile</button>
            </div>

            <div className="fullscreen-actions">
              <button type="button" onClick={()=>setReplay(v=>v+1)} title="새로고침">
                <RotateCcw size={12}/> Replay
              </button>
              <button type="button" className="close-btn" onClick={() => setIsExpanded(false)} aria-label="닫기">
                <X size={18} />
              </button>
            </div>
          </header>

          <div className={`fullscreen-body device-stage-${deviceMode}`}>
            <div className={`device-frame-shell device-frame-${deviceMode}`}>
              <div className="fullscreen-demo-wrap" key={item.id+replay}>
                {item.designSystem?<DesignSystemPreview tokens={item.designSystem}/>:maturity.kind==='external'?<div className="source-only-preview"><h2>원본 Reference</h2><a href={item.source.url} target="_blank" rel="noreferrer">Source 열기 ↗</a></div>:<DemoRenderer kind={item.demo} detail preset={preset}/>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </main>
}
