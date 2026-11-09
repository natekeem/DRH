import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { ArtifactView } from '../lib/artifacts'
import type { ReferenceItem } from '../types'
import { buildReferenceHandoff } from '../lib/referenceHandoff'
import { CopyButton } from './CopyBlock'
import { DownloadButton } from './DownloadButton'

export function ArtifactWorkspace({artifacts,item}:{artifacts:ArtifactView[];item?:ReferenceItem}) {
  const [tab,setTab]=useState(artifacts[0].id)
  const [mode,setMode]=useState<'compact'|'extended'>('extended')
  const current=artifacts.find(a=>a.id===tab)??artifacts[0]
  const vendorBrand=Boolean(item?.demo.startsWith('vendor-design-md:'))
  const handoff=item&&vendorBrand?buildReferenceHandoff(item):null
  const text=mode==='compact'&&current.compact?current.compact:current.text
  const label=current.id==='agent'?'Agent Package 전체 복사':`Copy ${current.id==='tokens'?'JSON':current.id==='react'?'TSX':current.label}`
  const onKey=(e:KeyboardEvent<HTMLButtonElement>,index:number)=>{
    let next=index
    if(e.key==='ArrowRight')next=(index+1)%artifacts.length
    else if(e.key==='ArrowLeft')next=(index-1+artifacts.length)%artifacts.length
    else if(e.key==='Home')next=0
    else if(e.key==='End')next=artifacts.length-1
    else return
    e.preventDefault();setTab(artifacts[next].id)
    document.getElementById(`artifact-tab-${artifacts[next].id}`)?.focus()
  }
  return <section className={`artifact-workspace-wrapper${vendorBrand?' brand-agent-workspace':''}`} aria-label="Artifact workspace">
    {handoff&&<div className="brand-agent-heading">
      <div className="brand-agent-heading-copy"><span className="eyebrow">TAKE IT TO YOUR AGENT</span><h2>{item?.name}의 규칙을 Agent로 가져가세요.</h2><p>아래에서 원문과 구현 계약을 먼저 확인한 뒤, 필요한 파일을 그대로 복사하거나 저장할 수 있습니다.</p></div>
      <div className="brand-agent-heading-actions"><CopyButton text={handoff.agent.applyPrompt} label="Copy start prompt"/><Link to="/guides/apply-demo-code">사용 가이드 ↗</Link></div>
      <div className="brand-agent-proof"><span>Source-bound</span><span>Copy + Download</span><span>Responsive contract</span><span>{handoff.source.revision?.slice(0,12)||'Pinned snapshot'}</span></div>
    </div>}
    <div className="artifact-workspace">
      <div className="artifact-tabs" role="tablist" aria-label="Artifacts">{artifacts.map((a,i)=><button key={a.id} id={`artifact-tab-${a.id}`} role="tab" aria-selected={current.id===a.id} aria-controls="artifact-panel" tabIndex={current.id===a.id?0:-1} onKeyDown={e=>onKey(e,i)} onClick={()=>setTab(a.id)}>{a.label}</button>)}</div>
      <div className="artifact-options">{current.compact?<><div className="artifact-mode" role="group" aria-label="문서 길이"><button aria-pressed={mode==='compact'} onClick={()=>setMode('compact')}>Compact</button><button aria-pressed={mode==='extended'} onClick={()=>setMode('extended')}>Extended</button></div><span>{mode==='extended'?'권장 · 구체적인 구현 계약':'핵심 규칙 · 적은 토큰'}</span></>:<span>{current.hint??'바로 저장할 수 있는 원문입니다.'}</span>}</div>
      <div className="artifact-actions" key={current.id+mode}><CopyButton text={text} label={label}/><DownloadButton text={text} filename={current.filename} label={`Download ${current.filename}`}/></div>
      <div id="artifact-panel" className="artifact-panel" role="tabpanel" aria-labelledby={`artifact-tab-${current.id}`} tabIndex={0} data-type={current.id}><div className="artifact-file"><span>{current.filename}</span><span>{text.length.toLocaleString()} chars</span></div><pre key={current.id+mode}>{text}</pre></div>
      <div className="artifact-provenance"><b>{current.provenance.origin} · {current.provenance.license}</b><a href={current.provenance.evidenceUrl} target="_blank" rel="noreferrer">License evidence ↗</a></div>
    </div>
  </section>
}
