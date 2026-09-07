import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { ReferenceCard } from '../components/ReferenceCard'
import { categories, collections, references } from '../data/references'
import { categoryDescriptionKo, categoryKo } from '../data/ko'

export function HomePage(){
  const spotlight=['shader-gradient','liquid-lens-effect','image-trail','neo-brutalism','bento-section','text-reveal'].map(id=>references.find(r=>r.id===id)!).filter(Boolean)
  return <>
    <Hero/>
    <main>
      <section className="home-intro section-pad"><div className="section-heading split"><div><span className="eyebrow">01 / SEE FIRST</span><h2>이름을 몰라도<br/>눈으로 먼저 찾습니다.</h2></div><p>긴 설명을 읽기 전에 Preview를 직접 보고 고릅니다. 마음에 드는 Reference를 찾은 다음 이름, Prompt, Code, DESIGN.md를 가져가면 됩니다.</p></div>
        <div className="category-grid">{categories.map((cat,i)=><Link key={cat} to={`/explore?category=${encodeURIComponent(cat)}`}><small>0{i+1}</small><h3>{cat}<em>{categoryKo[cat]}</em></h3><p>{categoryDescriptionKo[cat]}</p><ArrowUpRight size={18}/></Link>)}</div>
      </section>

      <section className="dark-section section-pad"><div className="section-heading split"><div><span className="eyebrow light">02 / LIVE, NOT SCREENSHOTS</span><h2>움직여 보고.<br/>만져 보고. 고릅니다.</h2></div><p>핵심 Reference는 정적 Screenshot보다 Live Demo를 우선합니다. Cursor를 움직이고, Hover하고, 클릭하면서 실제 느낌을 확인하세요.</p></div>
        <div className="spotlight-grid">{spotlight.map((r,i)=><ReferenceCard key={r.id} item={r} large={i<2}/>)}</div>
      </section>

      <section className="section-pad collections-preview"><div className="section-heading"><span className="eyebrow">03 / CURATED PATHS</span><h2>카테고리보다<br/>목적으로 시작해도 됩니다.</h2></div><div className="collection-grid">{collections.slice(0,4).map((c,i)=><Link to={`/collections#${c.id}`} className={`collection-card c${i}`} key={c.id}><small>{String(i+1).padStart(2,'0')} / {c.ids.length} refs</small><h3>{c.title}</h3><p>{c.description}</p><div>{c.ids.slice(0,4).map(id=><span key={id}>{references.find(r=>r.id===id)?.name}</span>)}</div><ArrowUpRight/></Link>)}</div><Link className="text-link" to="/collections">모든 Collection 보기 <ArrowUpRight size={16}/></Link></section>

      <section className="agent-section"><div><span className="eyebrow light">04 / HAND IT TO YOUR AGENT</span><h2>사람은 보고,<br/>Agent는 읽습니다.</h2><p>사람은 Live Gallery를 탐색하고, Coding Agent는 같은 Dataset에서 Prompt, 구현 정보와 DESIGN.md를 읽습니다.</p><Link to="/explore?category=DESIGN.md">DESIGN.md 둘러보기 <ArrowUpRight size={17}/></Link></div><pre><code>{`reference.dataset\n├─ web → browse / preview / copy\n└─ agent → prompt / design.md / source\n\nstatus: source_of_truth ✓`}</code></pre></section>
    </main>
  </>
}
