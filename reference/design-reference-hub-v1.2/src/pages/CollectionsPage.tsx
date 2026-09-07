import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { collections, references } from '../data/references'

const collectionKo: Record<string,string> = {
  wow:'첫 10초 안에 시선을 잡는 강한 Motion과 Interaction 모음입니다.',
  glass:'투명도, 굴절, 부드러운 빛과 유동적인 재질 표현을 모았습니다.',
  developer:'Internal Tool, AI Agent, Developer Product에 잘 맞는 기술적 UI 모음입니다.',
  'vibe-styles':'이름은 몰라도 한 번쯤 봤을 대표적인 웹 디자인 스타일을 모았습니다.',
  internal:'Dashboard, 운영화면, Citizen Developer 도구에 쓰기 좋은 실용적인 Reference입니다.',
  motion:'위계, Feedback과 공간 이해를 돕는 목적 있는 Motion 패턴을 모았습니다.',
}

export function CollectionsPage(){return <main className="collections-page"><section className="listing-hero"><span className="eyebrow">CURATED PATHS</span><h1>카테고리가 아니라<br/><i>목적으로 시작하세요.</i></h1><p>서로 잘 어울리는 Reference를 한 묶음으로 정리했습니다. 원하는 분위기나 제품 유형이 이미 있다면 여기서 시작하는 편이 빠릅니다.</p></section><div className="collections-list">{collections.map((c,index)=><section key={c.id} id={c.id} className="collection-section"><header><div><small>{String(index+1).padStart(2,'0')} / COLLECTION</small><h2>{c.title}</h2><p>{collectionKo[c.id] ?? c.description}</p></div><Link to={`/explore?search=${encodeURIComponent(c.title.split(' ')[0])}`}>관련 Reference 찾기 <ArrowUpRight size={16}/></Link></header><div className="collection-strip">{c.ids.map(id=>{const r=references.find(x=>x.id===id);return r?<ReferenceCard key={id} item={r}/>:null})}</div></section>)}</div></main>}
