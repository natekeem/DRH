import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { categories, references } from '../data/references'
import { categoryKo } from '../data/ko'
import type { Category } from '../types'

export function ExplorePage(){
  const [params,setParams]=useSearchParams()
  const initialCategory=params.get('category') as Category|null
  const [category,setCategory]=useState<Category|'All'>(initialCategory&&categories.includes(initialCategory)?initialCategory:'All')
  const [query,setQuery]=useState(params.get('search')??'')
  const [liveOnly,setLiveOnly]=useState(false)
  const [copyOnly,setCopyOnly]=useState(false)
  const [sub,setSub]=useState('All')
  useEffect(()=>{
    const nextSearch=params.get('search')??''
    setQuery(nextSearch)
    const nextCategory=params.get('category') as Category|null
    if(nextCategory&&categories.includes(nextCategory)) { setCategory(nextCategory); setSub('All') }
    else if(!nextCategory) setCategory('All')
  },[params])
  const subcategories=useMemo(()=>Array.from(new Set(references.filter(r=>category==='All'||r.category===category).map(r=>r.subcategory))).sort(),[category])
  const filtered=useMemo(()=>references.filter(r=>{
    if(category!=='All'&&r.category!==category)return false
    if(sub!=='All'&&r.subcategory!==sub)return false
    if(copyOnly&&r.license.status!=='copy-ok')return false
    if(liveOnly&&r.implementation.type==='external')return false
    if(query.trim()){const q=query.toLowerCase();return [r.name,r.description,r.category,r.subcategory,...r.tags,...r.useCases].join(' ').toLowerCase().includes(q)}
    return true
  }),[category,sub,copyOnly,liveOnly,query])
  const choose=(cat:Category|'All')=>{setCategory(cat);setSub('All');const next=new URLSearchParams(params); if(cat==='All')next.delete('category');else next.set('category',cat);setParams(next,{replace:true})}
  const clearQuery=()=>{setQuery('');const next=new URLSearchParams(params);next.delete('search');setParams(next,{replace:true})}
  return <main className="listing-page">
    <section className="listing-hero"><span className="eyebrow">EXPLORE / {references.length} REFERENCES</span><h1>마음에 걸리는 걸<br/><i>먼저 고르세요.</i></h1><p>용어를 먼저 알 필요는 없습니다. Card의 Demo를 움직여 보고, 열어 본 뒤 필요한 이름과 Prompt를 가져가세요.</p></section>
    <section className="listing-toolbar">
      <div className="category-tabs"><button className={category==='All'?'active':''} onClick={()=>choose('All')}>전체</button>{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>choose(c)}>{c}<small>{categoryKo[c]}</small></button>)}</div>
      <div className="filter-row"><label className="big-search"><Search size={18}/><input placeholder="glass, cursor, hero…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button aria-label="검색어 지우기" onClick={clearQuery}><X size={15}/></button>}</label><button className={liveOnly?'toggle active':'toggle'} onClick={()=>setLiveOnly(v=>!v)}><i/> Live Demo</button><button className={copyOnly?'toggle active':'toggle'} onClick={()=>setCopyOnly(v=>!v)}><i/> Copy OK</button></div>
      <div className="subfilter"><SlidersHorizontal size={15}/><button className={sub==='All'?'active':''} onClick={()=>setSub('All')}>전체 유형</button>{subcategories.map(s=><button key={s} className={sub===s?'active':''} onClick={()=>setSub(s)}>{s}</button>)}</div>
    </section>
    <section className="listing-results"><div className="result-count"><b>{filtered.length}</b>개 <span>{category==='All'?'전체 카테고리':`${category} · ${categoryKo[category]}`}</span></div>{filtered.length?<div className="reference-grid">{filtered.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>:<div className="empty-state"><h2>조건에 맞는 Reference가 없습니다.</h2><p>검색어를 넓히거나 Filter를 하나 해제해 보세요.</p></div>}</section>
  </main>
}
