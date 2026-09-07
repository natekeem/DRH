import { Search, SlidersHorizontal, X, ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { categories, references, collections } from '../data/references'
import { categoryKo } from '../data/ko'
import { demoMaturity } from '../lib/referencePackage'
import type { Category } from '../types'

const collectionKo: Record<string,string> = {
  wow:'첫 10초 안에 시선을 잡는 강한 Motion과 Interaction 모음입니다.',
  glass:'투명도, 굴절, 부드러운 빛과 유동적인 재질 표현을 모았습니다.',
  developer:'Internal Tool, AI Agent, Developer Product에 잘 맞는 기술적 UI 모음입니다.',
  'vibe-styles':'이름은 몰라도 한 번쯤 봤을 대표적인 웹 디자인 스타일을 모았습니다.',
  internal:'Dashboard, 운영화면, Citizen Developer 도구에 쓰기 좋은 실용적인 Reference입니다.',
  motion:'위계, Feedback과 공간 이해를 돕는 목적 있는 Motion 패턴을 모았습니다.',
}

export function ExplorePage(){
  const [params,setParams]=useSearchParams()
  const location = useLocation()
  const searchRef = useRef<HTMLInputElement>(null)
  
  const currentView = params.get('view') === 'collections' ? 'collections' : 'references'
  const initialCategory=params.get('category') as Category|null
  const [category,setCategory]=useState<Category|'All'>(initialCategory&&categories.includes(initialCategory)?initialCategory:'All')
  const [query,setQuery]=useState(params.get('search')??'')
  const [liveOnly,setLiveOnly]=useState(false)
  const [copyOnly,setCopyOnly]=useState(false)
  const [sub,setSub]=useState('All')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(()=>{
    if ((location.state as any)?.focusSearch) {
      searchRef.current?.focus()
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  useEffect(()=>{
    const nextSearch=params.get('search')??''
    setQuery(nextSearch)
    const nextCategory=params.get('category') as Category|null
    if(nextCategory&&categories.includes(nextCategory)) { setCategory(nextCategory); setSub('All') }
    else if(!nextCategory) setCategory('All')
  },[params])

  const subcategories=useMemo(()=>Array.from(new Set(references.filter(r=>category==='All'||r.category===category).map(r=>r.subcategory))).sort(),[category])
  
  const filteredReferences=useMemo(()=>references.filter(r=>{
    if(category!=='All'&&r.category!==category)return false
    if(sub!=='All'&&r.subcategory!==sub)return false
    if(copyOnly&&r.license.status!=='copy-ok')return false
    if(liveOnly&&demoMaturity(r).kind==='external')return false
    if(query.trim()){const q=query.toLowerCase();return [r.name,r.description,r.category,r.subcategory,...r.tags,...r.useCases].join(' ').toLowerCase().includes(q)}
    return true
  }),[category,sub,copyOnly,liveOnly,query])

  const filteredCollections = useMemo(()=>collections.filter(c => {
    if(query.trim()) {
      const q = query.toLowerCase()
      const desc = collectionKo[c.id] ?? c.description
      return c.title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)
    }
    return true
  }), [query])

  const choose=(cat:Category|'All')=>{setCategory(cat);setSub('All');const next=new URLSearchParams(params); if(cat==='All')next.delete('category');else next.set('category',cat);setParams(next,{replace:true})}
  
  const clearQuery=()=>{setQuery('');const next=new URLSearchParams(params);next.delete('search');setParams(next,{replace:true})}
  
  const setView = (view: 'references' | 'collections') => {
    const next = new URLSearchParams(params)
    if(view === 'references') next.delete('view')
    else next.set('view', view)
    setParams(next, {replace:true})
  }

  return <main className="listing-page">
    <section className="listing-hero">
      {currentView === 'references' ? (
        <>
          <span className="eyebrow">EXPLORE / {references.length} REFERENCES</span>
          <h1>마음에 걸리는 걸<br/><i>먼저 고르세요.</i></h1>
          <p>용어를 먼저 알 필요는 없습니다. Card의 Demo를 움직여 보고, 열어 본 뒤 필요한 이름과 Prompt를 가져가세요.</p>
        </>
      ) : (
        <>
          <span className="eyebrow">CURATED PATHS</span>
          <h1>카테고리가 아니라<br/><i>목적으로 시작하세요.</i></h1>
          <p>서로 잘 어울리는 Reference를 한 묶음으로 정리했습니다. 원하는 분위기나 제품 유형이 이미 있다면 여기서 시작하는 편이 빠릅니다.</p>
        </>
      )}
    </section>
    
    <section className="listing-toolbar">
      <div className="toolbar-top-row">
        <div className="view-switcher">
          <button className={currentView==='references'?'active':''} onClick={()=>setView('references')}>레퍼런스</button>
          <button className={currentView==='collections'?'active':''} onClick={()=>setView('collections')}>컬렉션</button>
        </div>
        <label className="big-search">
          <Search size={18}/>
          <input ref={searchRef} placeholder={currentView==='collections' ? "컬렉션 검색..." : "glass, cursor, hero…"} value={query} onChange={e=>{
            setQuery(e.target.value)
            const next = new URLSearchParams(params)
            if(e.target.value) next.set('search', e.target.value)
            else next.delete('search')
            setParams(next, {replace:true})
          }}/>
          {query&&<button aria-label="검색어 지우기" onClick={clearQuery}><X size={15}/></button>}
        </label>
        {currentView === 'references' && (
          <button className={`filter-trigger ${filterOpen?'active':''}`} onClick={()=>setFilterOpen(!filterOpen)}>
            <SlidersHorizontal size={15}/> 필터
          </button>
        )}
      </div>

      {currentView === 'references' && (
        <div className="category-tabs">
          <button className={category==='All'?'active':''} onClick={()=>choose('All')}>전체</button>
          {categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>choose(c)}>{c}<small>{categoryKo[c]}</small></button>)}
        </div>
      )}

      {currentView === 'references' && filterOpen && (
        <div className="compact-filter-panel">
          <div className="filter-group">
            <span>Demo</span>
            <div className="subfilter-chips">
              <button className={liveOnly?'toggle active':'toggle'} onClick={()=>setLiveOnly(v=>!v)}><i/> Live Demo</button>
            </div>
          </div>
          <div className="filter-group">
            <span>License</span>
            <div className="subfilter-chips">
              <button className={copyOnly?'toggle active':'toggle'} onClick={()=>setCopyOnly(v=>!v)}><i/> Copy OK</button>
            </div>
          </div>
          <div className="filter-group">
            <span>유형</span>
            <div className="subfilter-chips">
              <button className={sub==='All'?'active':''} onClick={()=>setSub('All')}>전체 유형</button>
              {subcategories.map(s=><button key={s} className={sub===s?'active':''} onClick={()=>setSub(s)}>{s}</button>)}
            </div>
          </div>
        </div>
      )}
    </section>

    {currentView === 'references' ? (
      <section className="listing-results">
        <div className="result-count"><b>{filteredReferences.length}</b>개 <span>{category==='All'?'전체 카테고리':`${category} · ${categoryKo[category]}`}</span></div>
        {filteredReferences.length ? (
          <div className="reference-grid">{filteredReferences.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>
        ) : (
          <div className="empty-state"><h2>조건에 맞는 Reference가 없습니다.</h2><p>검색어를 넓히거나 Filter를 하나 해제해 보세요.</p></div>
        )}
      </section>
    ) : (
      <div className="collections-list">
        {filteredCollections.length ? filteredCollections.map((c,index)=>(
          <section key={c.id} id={c.id} className="collection-section">
            <header>
              <div>
                <small>{String(index+1).padStart(2,'0')} / COLLECTION</small>
                <h2>{c.title}</h2>
                <p>{collectionKo[c.id] ?? c.description}</p>
              </div>
              <Link to={`/explore?search=${encodeURIComponent(c.title.split(' ')[0])}`}>관련 Reference 찾기 <ArrowUpRight size={16}/></Link>
            </header>
            <div className="collection-strip">
              {c.ids.map(id=>{const r=references.find(x=>x.id===id);return r?<ReferenceCard key={id} item={r}/>:null})}
            </div>
          </section>
        )) : (
          <div className="empty-state"><h2>조건에 맞는 컬렉션이 없습니다.</h2><p>검색어를 넓혀 보세요.</p></div>
        )}
      </div>
    )}
  </main>
}
