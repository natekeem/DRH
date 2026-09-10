import { ExternalLink, Github, Search, X, ChevronDown, Check } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  const categoryMenu = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!categoryMenu.current?.contains(event.target as Node)) categoryMenu.current?.removeAttribute('open') }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
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
    <section className="listing-toolbar sources-tools" aria-label="출처 검색 및 필터">
      <div className="view-switcher source-status-tabs" role="group" aria-label="판정 필터">
        {statusOptions.map(o=><button type="button" key={o.value} className={status===o.value?'active':''} aria-pressed={status===o.value} onClick={()=>setStatus(o.value)}>{o.label}</button>)}
      </div>
      <details className="source-category-menu" ref={categoryMenu} onKeyDown={e=>{if(e.key==='Escape'){categoryMenu.current?.removeAttribute('open');categoryMenu.current?.querySelector('summary')?.focus()}}}>
        <summary aria-label={'카테고리 필터: '+(category==='All'?'전체':category)}><span>{category==='All'?'카테고리 전체':category}</span><ChevronDown size={15}/></summary>
        <div className="source-category-options" role="group" aria-label="카테고리 선택">
          {['All',...categories].map(c=><button type="button" key={c} aria-pressed={category===c} onClick={()=>{setCategory(c);categoryMenu.current?.removeAttribute('open');categoryMenu.current?.querySelector('summary')?.focus()}}><span>{c==='All'?'카테고리 전체':c}</span>{category===c&&<Check size={14}/>}</button>)}
        </div>
      </details>
      <label className="big-search"><Search size={17}/><input aria-label="출처 검색" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Source, Stack, License 검색"/>{query&&<button className="sources-clear-input" aria-label="검색어 지우기" onClick={()=>setQuery('')} type="button"><X size={14}/></button>}</label>
      <button className="sources-reset" onClick={clearAll} type="button">초기화</button>
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
