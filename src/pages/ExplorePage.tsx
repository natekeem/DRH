import { Search, SlidersHorizontal, X, ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { categories, references, collections } from '../data/references'
import { categoryKo } from '../data/ko'
import { demoMaturity } from '../lib/referencePackage'
import type { Category, ReferenceItem } from '../types'

const isVendorBrand=(item:ReferenceItem)=>item.demo.startsWith('vendor-design-md:')

const collectionKo: Record<string,string> = {
  wow:'첫 10초 안에 시선을 잡는 강한 Motion과 Interaction 모음입니다.',
  glass:'투명도, 굴절, 부드러운 빛과 유동적인 재질 표현을 모았습니다.',
  developer:'Internal Tool, AI Agent, Developer Product에 잘 맞는 기술적 UI 모음입니다.',
  'vibe-styles':'이름은 몰라도 한 번쯤 봤을 대표적인 웹 디자인 스타일을 모았습니다.',
  internal:'Dashboard, 운영화면, Citizen Developer 도구에 쓰기 좋은 실용적인 Reference입니다.',
  motion:'위계, Feedback과 공간 이해를 돕는 목적 있는 Motion 패턴을 모았습니다.',
  'animation-style-library':'그리기, 인쇄, 종이, 클레이, 저폴리, CGI, 빛과 인터랙션을 각각 독립적으로 꺼내 쓸 수 있는 애니메이션 스타일 모음입니다.',
  'screen-navigation':'하단 탭부터 Stepper까지, 화면과 계층 사이를 이동하는 12가지 대표 Navigation 패턴입니다.',
}

export function ExplorePage(){
  const [params,setParams]=useSearchParams()
  const location = useLocation()
  const searchRef = useRef<HTMLInputElement>(null)

  const currentView = params.get('view') === 'collections' ? 'collections' : 'references'
  const initialCategory=params.get('category') as Category|null
  const [category,setCategory]=useState<Category|'All'>(initialCategory&&categories.includes(initialCategory)?initialCategory:'All')
  const [query,setQuery]=useState(params.get('search')??'')
  const liveOnly=params.get('live')==='1'
  const copyOnly=params.get('copy')==='1'
  const sub=params.get('sub')??'All'
  const setOption=(key:string,value:string)=>{const next=new URLSearchParams(params);if(value)next.set(key,value);else next.delete(key);setParams(next,{replace:true})}
  const setSub=(value:string)=>setOption('sub',value==='All'?'':value)
  const filterOpen=params.get('filters')==='1'
  const setFilterOpen=(value:boolean)=>setOption('filters',value?'1':'')

  useEffect(()=>{
    if ((location.state as any)?.focusSearch) {
      searchRef.current?.focus({preventScroll:true})

    }
  }, [location.state])

  useEffect(()=>{
    const nextSearch=params.get('search')??''
    setQuery(nextSearch)
    const nextCategory=params.get('category') as Category|null
    if(nextCategory&&categories.includes(nextCategory)) { setCategory(nextCategory) }
    else if(!nextCategory) setCategory('All')
  },[params])

  const subcategories=useMemo(()=>Array.from(new Set(references.filter(r=>category==='All'||r.category===category).map(r=>r.subcategory))).sort(),[category])

  const filteredReferences=useMemo(()=>references.filter(r=>{
    if(category!=='All'&&r.category!==category)return false
    if(sub!=='All'&&r.subcategory!==sub)return false
    if(copyOnly&&r.license.status!=='copy-ok')return false
    if(liveOnly&&!['official','working'].includes(demoMaturity(r).kind))return false
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
  const brandReferences=useMemo(()=>filteredReferences.filter(isVendorBrand),[filteredReferences])
  const designSystemPatterns=useMemo(()=>filteredReferences.filter(r=>!isVendorBrand(r)),[filteredReferences])
  const groupedBrandBrowse=category==='DESIGN.md'&&sub==='All'&&!query.trim()&&brandReferences.length>0
  const brandOnly=filteredReferences.length>0&&filteredReferences.every(isVendorBrand)

  const choose=(cat:Category|'All')=>{setCategory(cat);const next=new URLSearchParams(params);next.delete('sub'); if(cat==='All')next.delete('category');else next.set('category',cat);setParams(next,{replace:true})}

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
          <p>용어를 먼저 알 필요는 없습니다. Demo를 직접 움직여 보고, 마음에 들면 이름과 Prompt를 가져가세요.</p>
        </>
      ) : (
        <>
          <span className="eyebrow">CURATED PATHS</span>
          <h1>카테고리가 아니라<br/><i>목적으로 시작하세요.</i></h1>
          <p>서로 잘 어울리는 Reference를 묶었습니다. 원하는 분위기나 제품 유형이 있다면 여기서 시작하는 편이 빠릅니다.</p>
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
          <input aria-label="레퍼런스 검색" ref={searchRef} placeholder={currentView==='collections' ? "컬렉션 검색..." : "glass, cursor, hero…"} value={query} onChange={e=>{
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
              <button className={liveOnly?'toggle active':'toggle'} onClick={()=>setOption('live',liveOnly?'':'1')}><i/> Live Demo</button>
            </div>
          </div>
          <div className="filter-group">
            <span>License</span>
            <div className="subfilter-chips">
              <button className={copyOnly?'toggle active':'toggle'} onClick={()=>setOption('copy',copyOnly?'':'1')}><i/> Copy OK</button>
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
        {filteredReferences.length ? groupedBrandBrowse ? (
          <div className="brand-browse-groups">
            <section className="brand-listing-group" aria-labelledby="brand-systems-heading">
              <header className="brand-listing-intro">
                <div><span className="eyebrow">BRAND DESIGN SYSTEMS / {brandReferences.length}</span><h2 id="brand-systems-heading">화면을 보고,<br/>규칙까지 가져가세요.</h2></div>
                <p>각 카드는 같은 DESIGN.md에서 만든 미리보기입니다. 상세에서 적용 화면과 근거를 확인하고, 원본 문서와 Agent 구현 계약을 바로 확인·복사·저장할 수 있습니다.</p>
              </header>
              <div className="reference-grid brand-reference-grid">{brandReferences.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>
            </section>
            {designSystemPatterns.length>0&&<section className="design-system-patterns" aria-labelledby="system-patterns-heading">
              <header><span className="eyebrow">FOUNDATIONS / {designSystemPatterns.length}</span><h2 id="system-patterns-heading">범용 Design System 패턴</h2><p>특정 브랜드가 아닌, 제품 유형별 토큰과 구성 규칙입니다.</p></header>
              <div className="reference-grid">{designSystemPatterns.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>
            </section>}
          </div>
        ) : (
          <div className={`reference-grid ${brandOnly?'brand-reference-grid':''}`}>{filteredReferences.map(r=><ReferenceCard key={r.id} item={r}/>)}</div>
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
