import { ExternalLink, Github, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sourceMap, sourceStats } from '../data/sourceMap'

const safe=(url?:string)=>Boolean(url && /^https?:\/\//.test(url))

export function SourcesPage(){
  const [query,setQuery]=useState(''); const [status,setStatus]=useState('All')
  const rows=useMemo(()=>sourceMap.filter(s=>{if(status!=='All'&&s.recommendation!==status)return false;if(query){const q=query.toLowerCase();return [s.source,s.category,s.what_it_provides,s.stack,s.license].join(' ').toLowerCase().includes(q)}return true}),[query,status])
  return <main className="sources-page"><section className="listing-hero sources-hero"><span className="eyebrow">SOURCE MAP / REVIEWED 2026-09-06</span><h1>예쁘다고 해서<br/><i>복사 가능한 건 아닙니다.</i></h1><p>Code, Screenshot, Image, Font, Icon과 Brand Asset의 권리는 서로 다를 수 있습니다. Hub는 Source와 License 판단을 숨기지 않고 함께 보여줍니다.</p><div className="source-stats"><div><b>{sourceStats.count}</b><span>후보 Source</span></div><div><b>{sourceStats.statusCounts['🟢']}</b><span>Import 후보</span></div><div><b>{sourceStats.statusCounts['🟡']}</b><span>Reference only</span></div><div><b>{sourceStats.statusCounts['🔴']}</b><span>Restricted</span></div></div></section>
    <section className="sources-table-wrap"><div className="sources-tools"><label><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Source, Stack, License 검색…"/></label><div>{['All','🟢','🟡','🔴'].map(x=><button key={x} className={status===x?'active':''} onClick={()=>setStatus(x)}>{x==='All'?'전체':x}</button>)}</div></div><div className="sources-table"><div className="source-row header"><span>Source</span><span>Category / Stack</span><span>License</span><span>판정</span></div>{rows.map(s=><div className="source-row" key={s.source}><div><b>{s.source}</b><p>{s.what_it_provides}</p><div className="source-links">{safe(s.url)&&<a href={s.url} target="_blank" rel="noreferrer">Original <ExternalLink size={13}/></a>}{safe(s.github)&&<a href={s.github} target="_blank" rel="noreferrer"><Github size={13}/> GitHub</a>}</div></div><div><span>{s.category}</span><small>{s.stack}</small></div><div><b>{s.license}</b><small>{s.redistribution}</small></div><div><span className={`source-status s-${s.recommendation}`}>{s.recommendation}</span><small>{s.caveat||s.attribution}</small></div></div>)}</div></section>
  </main>
}
