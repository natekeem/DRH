import { shaderPresets } from '../data/shaderPresets'
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, Github, ShieldCheck } from 'lucide-react'
import { Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { CopyBlock, CopyButton } from '../components/CopyBlock'
import { DownloadButton } from '../components/DownloadButton'
import { DemoRenderer } from '../components/demos/DemoRenderer'
import { ReferenceCard } from '../components/ReferenceCard'
import { categoryKo, descriptionKo } from '../data/ko'
import { references } from '../data/references'
import { buildAgentPackage, buildStandaloneHtml, demoMaturity, starterCodeFor, provenanceFor, packageReadiness } from '../lib/referencePackage'

export function ReferencePage(){
  const location=useLocation(),navigate=useNavigate()
  const [params]=useSearchParams()
  const preset=shaderPresets.find(p=>p.id===params.get('preset'))??shaderPresets[0]
  const {id}=useParams(); const item=references.find(r=>r.id===id)
  if(!item)return <main className="not-found"><h1>Reference를 찾을 수 없습니다.</h1><Link to="/explore">탐색으로 돌아가기</Link></main>
  const related=references.filter(r=>r.id!==item.id&&(r.category===item.category||r.tags.some(t=>item.tags.includes(t)))).slice(0,4)
  const maturity=demoMaturity(item)
  const starter=starterCodeFor(item,preset)
  const agentPackage=buildAgentPackage(item,preset)
  const standalone=buildStandaloneHtml(item)
  const sourceSummary=provenanceFor(item)

  return <main className="detail-page">
    <div className="detail-top">{(location.state as {fromExplore?:boolean}|null)?.fromExplore?<button className="detail-back" onClick={()=>navigate(-1)}><ArrowLeft size={16}/> 탐색으로</button>:<Link to="/explore"><ArrowLeft size={16}/> 탐색으로</Link>}<span>{item.category} · {categoryKo[item.category]} / {item.subcategory}</span></div>
    <section className="detail-head"><div><div className="detail-badges"><span className={`demo-status-pill maturity-${maturity.kind}`}>● {maturity.label}</span><span className={`license-pill ${item.license.status}`}>{item.license.status==='copy-ok'?'● Copy OK':item.license.status==='reference'?'● Reference only':'● Restricted'}</span></div><h1>{item.name}</h1>{item.demo==='shader-gradient'&&<p>공식 프리셋 · {preset.title}</p>}<p>{descriptionKo(item)}</p><div className="tag-list">{item.tags.map(t=><span key={t}>#{t}</span>)}</div></div><div className="detail-number">{String(references.indexOf(item)+1).padStart(3,'0')}</div></section>

    <section className="detail-demo-shell"><div className="demo-toolbar"><span><i/> INTERACTIVE PREVIEW</span><span>{maturity.description}</span></div><div className="detail-demo"><DemoRenderer kind={item.demo} detail preset={preset}/></div></section>

    <section className="handoff-cta"><div><b>이 데모를 구현해 보세요</b><p>Agent Package {packageReadiness(item)} · {starter?'코드, 구현 순서, 출처를 한 번에 전달합니다.':'구현 목표와 출처를 제공합니다. 실행 코드는 아직 준비 중입니다.'}</p></div><CopyButton text={agentPackage} label="Agent Package 전체 복사"/></section><section className="detail-grid"><div className="detail-main">
      <section className="detail-copy"><span className="eyebrow">WHAT IT IS · 무엇인가요?</span><h2>{descriptionKo(item)}</h2><div className="usecase-row"><div><small>잘 어울리는 용도</small>{item.useCases.map(x=><span key={x}>{x}</span>)}</div><div><small>구현 방식</small><span>{item.implementation.framework}</span>{item.implementation.dependencies.map(x=><span key={x}>{x}</span>)}</div></div></section>

      <section className="agent-package-intro"><span className="eyebrow">CODING AGENT HANDOFF</span><h2>그대로 구현시키려면<br/>설명보다 구현 계약을 같이 주세요.</h2><p>{packageReadiness(item)==='Ready'?'목표, 동작 규칙, 의존성, Source/GitHub, 라이선스, 실행 가능한 Starter Code와 검수 조건을 함께 전달합니다.':'이 항목은 Partial입니다. 목표와 출처를 전달할 수 있지만 효과별 구현 로직 또는 완성된 실행 코드가 더 필요합니다. 문서의 미완성 항목을 먼저 확인하세요.'}</p><div className="agent-download-row"><DownloadButton filename={`${item.id}-agent-package.md`} text={agentPackage} label="Agent Package .md"/>{item.demo==='shader-gradient'&&<DownloadButton filename="HeroShader.tsx" text={starter} label="TSX 다운로드"/>}{standalone&&<DownloadButton filename="index.html" text={standalone} label="HTML 다운로드"/>}</div></section>

      <CopyBlock label="AGENT PACKAGE 전체 복사 · 권장" text={agentPackage} code/>

      {item.designMd&&<DownloadButton filename="DESIGN.md" text={item.designMd} label="DESIGN.md 다운로드"/>}
      {starter&&item.license.status==='copy-ok'&&<CopyBlock label="Starter Code 복사" text={starter} code/>}
    </div>

    <aside className="source-panel"><span className="eyebrow">SOURCE / LICENSE</span><h3>{item.source.name}</h3><p>{sourceSummary}</p><dl><div><dt>Demo 상태</dt><dd>{maturity.label}</dd></div><div><dt>참고 Source License</dt><dd><ShieldCheck size={15}/>{item.license.name}</dd></div><div><dt>구현 방식</dt><dd>{item.implementation.type}</dd></div><div><dt>Attribution</dt><dd>{item.license.attributionRequired?'Source credit 유지':'Hub original / 별도 표기 불필요'}</dd></div></dl><a href={item.source.url||'https://github.com/natekeem/DRH'} target="_blank" rel="noreferrer">원본 출처 <ExternalLink size={15}/></a><a href={item.source.repository||'https://github.com/natekeem/DRH'} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a>{item.license.evidenceUrl&&item.license.evidenceUrl!==item.source.repository&&<a href={item.license.evidenceUrl} target="_blank" rel="noreferrer"><CheckCircle2 size={15}/> License evidence</a>}{item.license.notes&&<small>{item.license.notes}</small>}</aside></section>

    <section className="related section-pad"><div className="section-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>비슷한 Reference</h2></div><div className="reference-grid compact-grid">{related.map(r=><ReferenceCard key={r.id} item={r}/>)}</div><Link className="text-link" to={`/explore?category=${encodeURIComponent(item.category)}`}>{item.category} 전체 보기 <ArrowUpRight size={16}/></Link></section>
  </main>
}
