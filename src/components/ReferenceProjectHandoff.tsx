import { Link } from 'react-router-dom'
import type { ReferenceItem } from '../types'
import { buildReferenceHandoff } from '../lib/referenceHandoff'
import { CopyButton } from './CopyBlock'
import './demos/vendorDesignPreview.css'
import './demos/brandExperience.css'
export function ReferenceProjectHandoff({item}:{item:ReferenceItem}) {
 const handoff=buildReferenceHandoff(item)
 const text=handoff.designMd?.text||handoff.agent.extended||handoff.agent.compact
 const href=handoff.designMd?.path?import.meta.env.BASE_URL+handoff.designMd.path:text?'data:text/markdown;charset=utf-8,'+encodeURIComponent(text):undefined
 return <section className="bc-handoff reference-handoff" data-section="handoff" aria-label="Continue in your project"><h2>Continue in your project</h2><div className="bc-handoff-grid">
  <div><small>01</small>{href?<a className="bc-control" download={handoff.designMd?'DESIGN.md':'AGENT.md'} href={href}>Download {handoff.designMd?'DESIGN.md':'Agent Package'}</a>:<span>원본 출처에서 확인</span>}</div>
  <div><small>02</small><CopyButton text={handoff.agent.applyPrompt} label="Copy apply prompt"/></div>
  <div><small>03</small><Link className="bc-control" to="/guides/apply-demo-code">Implementation guide ↗</Link></div>
 </div></section>
}
