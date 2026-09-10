import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { PresetGallery } from '../components/landing/PresetGallery'
import { LandingHero } from '../components/landing/LandingHero'
import { MarketingSection } from '../components/landing/MarketingSection'
import { BrowserMockup } from '../components/landing/BrowserMockup'
import { InteractionCards } from '../components/landing/InteractionCards'
import { AgentExportPanel } from '../components/landing/AgentExportPanel'
import { categories, collections, references } from '../data/references'
import { categoryDescriptionKo, categoryKo } from '../data/ko'

export function HomePage(){
  const spotlight=['liquid-lens-effect','image-trail','neo-brutalism','bento-section','text-reveal'].map(id=>references.find(r=>r.id===id)!).filter(Boolean)
  return <>
    <LandingHero/>
    <PresetGallery/>

    <div className="sg-experience">
      <MarketingSection
        kicker="01 / LIVE"
        titleTop="Make live references"
        titleBottom="not screenshots"
        subtitle="정적인 캡처만 보는 대신 실제 배경과 인터랙션을 먼저 경험합니다. 움직임의 속도와 깊이까지 보고 선택하세요."
        primaryTo="/explore?category=Background"
        primaryLabel="Background 둘러보기"
        secondaryTo="/reference/shader-gradient"
        secondaryLabel="Shader Gradient"
      ><BrowserMockup/></MarketingSection>

      <MarketingSection
        kicker="02 / INTERACTION"
        titleTop="Feel the motion"
        titleBottom="before you copy"
        subtitle="Cursor, Hover, Scroll, Text Motion을 직접 조작해 보고 내 화면에 필요한 인터랙션인지 판단합니다."
        primaryTo="/explore?category=Motion"
        primaryLabel="Motion 둘러보기"
        secondaryTo="/collections#wow"
        secondaryLabel="WOW Collection"
      ><InteractionCards/></MarketingSection>

      <MarketingSection
        kicker="03 / AGENT"
        titleTop="Hand it to"
        titleBottom="your Coding Agent"
        subtitle="마음에 든 Reference를 찾았으면 정확한 이름, Prompt, 구현 힌트와 DESIGN.md를 한 번에 가져갑니다."
        accent
        primaryTo="/explore?category=DESIGN.md"
        primaryLabel="DESIGN.md 둘러보기"
        secondaryTo="/sources"
        secondaryLabel="Source & License"
      ><AgentExportPanel/></MarketingSection>
    </div>

    <main className="hub-home-after">
      <section className="home-intro section-pad"><div className="section-heading split"><div><span className="eyebrow">04 / EXPLORE THE HUB</span><h2>이름을 몰라도<br/>눈으로 먼저 찾습니다.</h2></div><p>긴 설명을 읽기 전에 Preview를 직접 보고 고릅니다. 마음에 드는 Reference를 찾은 다음 이름, Prompt, Code, DESIGN.md를 가져가면 됩니다.</p></div>
        <div className="category-grid">{categories.map((cat,i)=><Link key={cat} to={`/explore?category=${encodeURIComponent(cat)}`}><small>{String(i+1).padStart(2,'0')}</small><h3>{cat}<em>{categoryKo[cat]}</em></h3><p>{categoryDescriptionKo[cat]}</p><ArrowUpRight size={18}/></Link>)}</div>
      </section>

      <section className="dark-section section-pad"><div className="section-heading split"><div><span className="eyebrow light">05 / FEATURED LIVE DEMOS</span><h2>움직여 보고.<br/>만져 보고. 고릅니다.</h2></div><p>핵심 Reference는 정적 Screenshot보다 Live Demo를 우선합니다. Cursor를 움직이고, Hover하고, 클릭하면서 실제 느낌을 확인하세요.</p></div>
        <div className="spotlight-grid">{spotlight.map((r,i)=><ReferenceCard key={r.id} item={r} large={i===0}/>)}</div>
      </section>

      <section className="section-pad collections-preview"><div className="section-heading"><span className="eyebrow">06 / CURATED PATHS</span><h2>카테고리보다<br/>목적으로 시작해도 됩니다.</h2></div><div className="collection-grid">{collections.slice(0,4).map((c,i)=><Link to={`/collections#${c.id}`} className={`collection-card c${i}`} key={c.id}><small>{String(i+1).padStart(2,'0')} / {c.ids.length} refs</small><h3>{c.title}</h3><p>{c.description}</p><div>{c.ids.slice(0,4).map(id=><span key={id}>{references.find(r=>r.id===id)?.name}</span>)}</div><ArrowUpRight/></Link>)}</div><Link className="text-link" to="/collections">모든 Collection 보기 <ArrowUpRight size={16}/></Link></section>
    </main>
  </>
}
