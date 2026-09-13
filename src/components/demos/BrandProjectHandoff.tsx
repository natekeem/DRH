import { Link } from 'react-router-dom'
import { references } from '../../data/references'
import { buildReferenceHandoff } from '../../lib/referenceHandoff'
import { CopyButton } from '../CopyBlock'

export default function BrandProjectHandoff({slug}:{slug:string}) {
 const item=references.find(r=>r.demo==='vendor-design-md:'+slug)
 if(!item)return null
 const handoff=buildReferenceHandoff(item)
 return <section className="bc-handoff" data-section="handoff" aria-label="Continue in your project"><h4>Continue in your project</h4><div className="bc-handoff-grid">
  <div><small>01 · DESIGN.md 저장</small><p>프로젝트 루트에 원본 문서를 저장하세요.</p><a className="bc-control" download="DESIGN.md" href={import.meta.env.BASE_URL+handoff.designMd?.path}>Download DESIGN.md</a></div>
  <div><small>02 · Coding Agent에 적용</small><p>기존 프로젝트를 확인하는 짧은 요청입니다.</p><CopyButton text={handoff.agent.applyPrompt} label="Copy apply prompt"/></div>
  <div><small>03 · 더 자세히</small><p>코드 적용과 검수 방법을 확인하세요.</p><Link className="bc-control" to="/guides/apply-demo-code">적용 가이드 ↗</Link></div>
 </div><details className="bc-evidence"><summary>적용 prompt 보기</summary><pre>{handoff.agent.applyPrompt}</pre></details></section>
}
