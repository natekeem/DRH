import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, Github, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { CopyBlock } from '../components/CopyBlock'
import { DownloadButton } from '../components/DownloadButton'
import { DemoRenderer } from '../components/demos/DemoRenderer'
import { ReferenceCard } from '../components/ReferenceCard'
import { categoryKo, descriptionKo } from '../data/ko'
import { references } from '../data/references'
import { buildAgentPackage, buildStandaloneHtml, demoMaturity, starterCodeFor } from '../lib/referencePackage'

export function ReferencePage(){
  const {id}=useParams(); const item=references.find(r=>r.id===id)
  if(!item)return <main className="not-found"><h1>Reference를 찾을 수 없습니다.</h1><Link to="/explore">탐색으로 돌아가기</Link></main>
  const related=references.filter(r=>r.id!==item.id&&(r.category===item.category||r.tags.some(t=>item.tags.includes(t)))).slice(0,4)
  const externalSource=item.source.name!=='Design Reference Hub' && /^https?:\/\//.test(item.source.url)
  const maturity=demoMaturity(item)
  const starter=starterCodeFor(item)
  const agentPackage=buildAgentPackage(item)
  const standalone=buildStandaloneHtml(item)
  const sourceSummary=externalSource
    ? `이 Reference의 명칭·구현 방향은 ${item.source.name}의 공개 자료를 근거로 정리했습니다. 현재 Hub Preview가 ${maturity.kind==='official'?'공식 구현을 직접 실행하는지':'개념을 재현한 별도 Demo인지'} 상태 배지를 함께 확인하세요.`
    : '이 항목의 Preview는 Design Reference Hub가 직접 만든 학습용/구현용 Demo입니다. 특정 외부 사이트의 화면을 원본 코드라고 주장하지 않습니다.'

  return <main className="detail-page">
    <div className="detail-top"><Link to="/explore"><ArrowLeft size={16}/> 탐색으로</Link><span>{item.category} · {categoryKo[item.category]} / {item.subcategory}</span></div>
    <section className="detail-head"><div><div className="detail-badges"><span className={`demo-status-pill maturity-${maturity.kind}`}>● {maturity.label}</span><span className={`license-pill ${item.license.status}`}>{item.license.status==='copy-ok'?'● Copy OK':item.license.status==='reference'?'● Reference only':'● Restricted'}</span></div><h1>{item.name}</h1><p>{descriptionKo(item)}</p><div className="tag-list">{item.tags.map(t=><span key={t}>#{t}</span>)}</div></div><div className="detail-number">{String(references.indexOf(item)+1).padStart(3,'0')}</div></section>

    <section className="detail-demo-shell"><div className="demo-toolbar"><span><i/> INTERACTIVE PREVIEW</span><span>{maturity.description}</span></div><div className="detail-demo"><DemoRenderer kind={item.demo} detail/></div></section>

    <section className="detail-grid"><div className="detail-main">
      <section className="detail-copy"><span className="eyebrow">WHAT IT IS · 무엇인가요?</span><h2>{descriptionKo(item)}</h2><div className="usecase-row"><div><small>잘 어울리는 용도</small>{item.useCases.map(x=><span key={x}>{x}</span>)}</div><div><small>구현 방식</small><span>{item.implementation.framework}</span>{item.implementation.dependencies.map(x=><span key={x}>{x}</span>)}</div></div></section>

      <section className="agent-package-intro"><span className="eyebrow">FOR WEAKER CODE AGENTS</span><h2>그대로 구현시키려면<br/>설명보다 구현 계약을 같이 주세요.</h2><p>아래 Agent Package에는 목표, 실제 동작 규칙, 의존성, Source/GitHub, 라이선스, Starter Code와 검수 조건을 한 번에 넣었습니다. 사내 LLM처럼 모델 성능이 낮을수록 일반 Prompt보다 이 묶음을 통째로 붙여 넣는 편이 유리합니다.</p><div className="agent-download-row"><DownloadButton filename={`${item.id}-agent-package.md`} text={agentPackage} label="Agent Package .md"/>{standalone&&<DownloadButton filename="index.html" text={standalone} label="Starter index.html"/>}</div></section>

      <CopyBlock label="AGENT PACKAGE 전체 복사 · 권장" text={agentPackage} code/>
      <CopyBlock label="간단 PROMPT 복사" text={item.prompt}/>
      {item.designMd&&<CopyBlock label="DESIGN.md 복사" text={item.designMd} code/>}
      {item.license.status==='copy-ok'&&<CopyBlock label="STARTER CODE / LOGIC 복사" text={starter} code/>}
    </div>

    <aside className="source-panel"><span className="eyebrow">SOURCE / LICENSE</span><h3>{item.source.name}</h3><p>{sourceSummary}</p><dl><div><dt>Demo 상태</dt><dd>{maturity.label}</dd></div><div><dt>License</dt><dd><ShieldCheck size={15}/>{item.license.name}</dd></div><div><dt>Demo 방식</dt><dd>{item.implementation.type}</dd></div><div><dt>Attribution</dt><dd>{item.license.attributionRequired?'Source credit 유지':'Hub original / 별도 표기 불필요'}</dd></div></dl>{externalSource&&<a href={item.source.url} target="_blank" rel="noreferrer">Original source <ExternalLink size={15}/></a>}{item.source.repository&&<a href={item.source.repository} target="_blank" rel="noreferrer"><Github size={15}/> Repository</a>}{item.license.evidenceUrl&&item.license.evidenceUrl!==item.source.repository&&<a href={item.license.evidenceUrl} target="_blank" rel="noreferrer"><CheckCircle2 size={15}/> License evidence</a>}{item.license.notes&&<small>{item.license.notes}</small>}</aside></section>

    <section className="related section-pad"><div className="section-heading"><span className="eyebrow">KEEP EXPLORING</span><h2>비슷한 Reference</h2></div><div className="reference-grid compact-grid">{related.map(r=><ReferenceCard key={r.id} item={r}/>)}</div><Link className="text-link" to={`/explore?category=${encodeURIComponent(item.category)}`}>{item.category} 전체 보기 <ArrowUpRight size={16}/></Link></section>
  </main>
}
