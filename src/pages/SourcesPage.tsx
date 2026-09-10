import { ExternalLink, Github, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sourceMap, sourceStats } from '../data/sourceMap'

const safe=(url?:string)=>Boolean(url && /^https?:\/\//.test(url))

const statusOptions = [
  { value: 'All', label: '전체' },
  { value: 'IMPORT / COPY CANDIDATE', label: '가져오기 가능' },
  { value: 'REFERENCE', label: '참고 전용' },
  { value: 'RESTRICTED', label: '제한' },
] as const

const categories = Array.from(new Set(sourceMap.map(s => s.category))).sort()

export function SourcesPage(){
  const [query,setQuery]=useState('')
  const [status,setStatus]=useState('All')
  const [category,setCategory]=useState('All')

  const rows=useMemo(()=>sourceMap.filter(s=>{
    if(status!=='All'&&s.recommendation!==status)return false
    if(category!=='All'&&s.category!==category)return false
    if(query){const q=query.toLowerCase();return [s.source,s.category,s.what_it_provides,s.stack,s.license].join(' ').toLowerCase().includes(q)}
    return true
  }),[query,status,category])

  const hasFilters = query || status !== 'All' || category !== 'All'
  const clearAll = () => { setQuery(''); setStatus('All'); setCategory('All') }

  return <main className="sources-page"><section className="listing-hero sources-hero"><span className="eyebrow">SOURCE MAP / REVIEWED 2026-09-08</span><h1>더 예쁘고 더 빨라서<br/><i>복사 가능한 것만 남깁니다.</i></h1><p>Code, Screenshot, Image, Font, Icon등 Brand Asset의 권리에서 자유로운 것만 모았습니다. Hub는 Source를 License 판단과 숨기지 않고 함께 보여줍니다.</p><div className="source-stats"><div><b>{sourceStats.count}</b><span>전체 Source</span></div><div><b>{sourceStats.statusCounts['IMPORT / COPY CANDIDATE']}</b><span>가져오기 가능</span></div><div><b>{sourceStats.statusCounts['REFERENCE']}</b><span>참고 전용</span></div><div><b>{sourceStats.statusCounts['RESTRICTED']}</b><span>제한</span></div></div></section>
    <section className="listing-toolbar sources-tools" aria-label="출처 검색 및 필터"><label><Search size={17}/><input aria-label="출처 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Source, Stack, License 검색"/>{query&&<button className="sources-clear-input" aria-label="검색어 지우기" onClick={()=>setQuery('')} type="button"><X size={14}/></button>}</label>
      <div className="sources-filters">
        <select aria-label="Category 필터" value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="All">Category 전체</option>
          {categories.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="판정 필터" value={status} onChange={e=>setStatus(e.target.value)}>
          {statusOptions.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {hasFilters&&<button className="sources-reset" onClick={clearAll} type="button">초기화</button>}
      </div>
    </section>
    <section className="sources-table-wrap"><div className="sources-result-count"><b>{rows.length}</b>개{hasFilters?' (필터 적용)':''}</div>
    {rows.length === 0 ? (
      <div className="sources-empty"><h2>조건에 맞는 Source가 없습니다.</h2><p>검색어를 넓히거나 필터를 초기화해 보세요.</p><button type="button" onClick={clearAll}>필터 초기화</button></div>
    ) : (
    <div className="sources-table"><div className="source-row header"><span>Source</span><span>Category / Stack</span><span>License</span><span>판정</span></div>{rows.map(s=><div className="source-row" key={s.source}><div><b>{s.source}</b><p>{s.what_it_provides}</p><div className="source-links">{safe(s.url)&&<a href={s.url} target="_blank" rel="noreferrer">Original <ExternalLink size={13}/></a>}{safe(s.github)&&<a href={s.github} target="_blank" rel="noreferrer"><Github size={13}/> GitHub</a>}</div></div><div><span>{s.category}</span><small>{s.stack}</small></div><div><b>{s.license}</b><small>{s.redistribution}</small>{safe(s.license_evidence)&&<a href={s.license_evidence} target="_blank" rel="noreferrer">License evidence ↗</a>}</div><div><span className={`source-status s-${s.recommendation.replace(/ /g, '-').replace(/\//g, '').toLowerCase()}`}>{s.recommendation === 'IMPORT / COPY CANDIDATE' ? '가져오기 가능' : s.recommendation === 'REFERENCE' ? '참고 전용' : '제한'}</span>{s.classification&&<small><b>{s.classification}</b></small>}<small>{s.caveat||s.attribution}</small></div></div>)}</div>
    )}
    </section>
  </main>
}
