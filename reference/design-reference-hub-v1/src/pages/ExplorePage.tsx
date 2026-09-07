import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { categories, references } from '../data/references'
import type { Category } from '../types'

export function ExplorePage(){
  const [params,setParams]=useSearchParams()
  const initialCategory=params.get('category') as Category|null
  const [category,setCategory]=useState<Category|'All'>(initialCategory&&categories.includes(initialCategory)?initialCategory:'All')
  const [query,setQuery]=useState(params.get('search')??'')
  const [liveOnly,setLiveOnly]=useState(false)
  const [copyOnly,setCopyOnly]=useState(false)
  useEffect(()=>{
    const nextSearch=params.get('search')??''
    setQuery(nextSearch)
    const nextCategory=params.get('category') as Category|null
    if(nextCategory&&categories.includes(nextCategory)) { setCategory(nextCategory); setSub('All') }
  },[params])
  const subcategories=useMemo(()=>Array.from(new Set(references.filter(r=>category==='All'||r.category===category).map(r=>r.subcategory))).sort(),[category])
  const [sub,setSub]=useState('All')
  const filtered=useMemo(()=>references.filter(r=>{
    if(category!=='All'&&r.category!==category)return false
    if(sub!=='All'&&r.subcategory!==sub)return false
    if(copyOnly&&r.license.status!=='copy-ok')return false
    if(liveOnly&&r.implementation.type==='external')return false
    if(query.trim()){const q=query.toLowerCase();return [r.name,r.description,r.category,r.subcategory,...r.tags,...r.useCases].join(' ').toLowerCase().includes(q)}
    return true
  }),[category,sub,copyOnly,liveOnly,query])
  const choose=(cat:Category|'All')=>{setCategory(cat);setSub('All');const next=new URLSearchParams(params); if(cat==='All')next.delete('category');else next.set('category',cat);setParams(next,{replace:true})}
  return <main className="listing-page">
    <section className="listing-hero"><span className="eyebrow">EXPLORE / {references.length} REFERENCES</span><h1>Browse until something<br/><i>feels right.</i></h1><p>You don’t need the vocabulary first. Every card is a working clue: move it, hover it, open it, then copy the language you need.</p></section>
    <section className="listing-toolbar">
      <div className="category-tabs"><button className={category==='All'?'active':''} onClick={()=>choose('All')}>All</button>{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>choose(c)}>{c}</button>)}</div>
      <div className="filter-row"><label className="big-search"><Search size={18}/><input placeholder="Search ‘glass’, ‘cursor’, ‘hero’…" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery('')}><X size={15}/></button>}</label><button className={liveOnly?'toggle active':'toggle'} onClick={()=>setLiveOnly(v=>!v)}><i/> Live demo</button><button className={copyOnly?'toggle active':'toggle'} onClick={()=>setCopyOnly(v=>!v)}><i/> Copy OK</button></div>
      <div className="subfilter"><SlidersHorizontal size={15}/><button className={sub==='All'?'active':''} onClick={()=>setSub('All')}>All types</button>{subcategories.map(s=><button key={s} className={sub===s?'active':''} onClick={()=>setSub(s)}>{s}</button>)}</div>
    </section>
    <section className="listing-results"><div className="result-count"><b>{filtered.length}</b> results <span>{category==='All'?'All categories':category}</span></div>{filtered.length?<div className="reference-grid">{filtered.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>:<div className="empty-state"><h2>No references found.</h2><p>Try a broader term or remove a filter.</p></div>}</section>
  </main>
}
