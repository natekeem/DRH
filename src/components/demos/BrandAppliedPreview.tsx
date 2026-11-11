import { useState, type CSSProperties } from 'react'
import { projectComponentStyle, resolveComponentStyle } from '../../lib/brandComponentStyle'
import type { BrandCatalog, BrandTheme, ComponentKind } from '../../lib/brandCatalog'
import { resolveBrandFont } from '../../lib/brandPresentation'
import { isDark } from '../../lib/brandCatalog'
import { experienceScene, experienceVariant, type ExperienceSceneType } from '../../lib/brandExperience'
import { BrandIdentityMark } from '../BrandIdentityMark'

export const appliedScene=experienceScene
export function BrandAppliedPreview({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const scene=experienceScene(catalog)
 const variant=experienceVariant(catalog)
 const [selection,setSelection]=useState(0),[query,setQuery]=useState(''),[message,setMessage]=useState('')
 const darkTheme=isDark(theme.colors.canvas)
 const component=(kind:ComponentKind)=>{
  const matches=catalog.components.filter(c=>c.kind===kind&&!/disabled|hover|pressed|focus|selected|active|overlay/.test(c.key))
  const primary=kind==='buttons'?matches.find(c=>/button-primary$|tds-button|black-action|woowa-more-light/.test(c.key)):undefined
  const contextual=matches.find(c=>darkTheme?/(?:on-)?dark/.test(c.key):/(?:on-)?light/.test(c.key))
  const neutral=matches.find(c=>!/(?:on-)?dark|(?:on-)?light/.test(c.key))
  return primary||contextual||neutral||matches[0]
 }
 const sourceStyle=(kind:ComponentKind)=>projectComponentStyle(resolveComponentStyle(component(kind)?.values||{},catalog,theme),kind!=='buttons'&&kind!=='inputs')
 const heading=catalog.roles.find(([k])=>/display|hero|heading|title/.test(k))?.[1]||catalog.roles[0]?.[1]||{}
 const body=catalog.roles.find(([k])=>k==='body')?.[1]||catalog.roles.find(([k])=>/body|paragraph/.test(k))?.[1]||heading
 const primary=resolveComponentStyle({color:catalog.spec.colors.primary},catalog,theme).color||theme.colors.text
 const positive=theme.colors.positive||'#0ecb81'
 const negative=theme.colors.negative||'#f6465d'
 const rootStyle={background:theme.colors.canvas,color:theme.colors.text,fontFamily:resolveBrandFont({...body,script:'ko'}).stack,'--ap-surface':theme.colors.surface,'--ap-border':theme.colors.border,'--ap-accent':primary,'--ap-positive':positive,'--ap-negative':negative} as CSSProperties
 const titleStyle={fontFamily:resolveBrandFont({...heading,script:'ko'}).stack,fontWeight:resolveComponentStyle({typography:heading},catalog,theme).fontWeight}
 const action=(label:string)=><button className="ap-action" style={sourceStyle('buttons')} data-source-component={component('buttons')?.key} onClick={()=>setMessage(label+' 선택 · DRH 화면 예시입니다.')}>{label}</button>
 const choices=(labels:string[])=><div className="ap-choices" aria-label="화면 선택">{labels.map((label,i)=><button key={label} aria-pressed={selection===i} onClick={()=>{setSelection(i);setMessage(label+' 보기')}}>{label}</button>)}</div>
 const cardStyle=sourceStyle('cards')
 const inputStyle=sourceStyle('inputs')
 return <section className="bc-applied" data-scene={scene} data-variant={variant}>
  <div className="ap-disclaimer"><b>DRH Applied Preview</b><p>공식 제품 화면이 아닌 디자인 시스템 적용 예시입니다.</p></div>
  <div className={'ap-canvas ap-scene-'+scene+(variant!=='default'?' ap-variant-'+variant:'')} style={rootStyle} data-evidence="drh-scaffolding">
   <header className="ap-masthead"><div className="ap-brand-lockup"><BrandIdentityMark slug={catalog.entry.slug} dark={darkTheme} context="preview"/><b>{catalog.entry.name}</b></div><span>DESIGN STUDY / 01</span></header>
   {scene==='product'&&<div className="ap-product-hero"><small>일상을 위한 디자인</small><h3 style={titleStyle}>{selection===0?'가볍게. 더 선명하게.':'작은 디테일. 큰 차이.'}</h3><p>필요한 것에 집중할 때, 경험은 더 단순해집니다.</p>{choices(['Design','Details'])}<div className="ap-object" aria-label="DRH 추상 제품 형태"><span>Aa</span></div>{action('디자인 살펴보기')}</div>}
   {scene==='commerce'&&<><div className="ap-commerce-heading" style={{color:catalog.spec.colors.foreground||theme.colors.text}}><h3 style={titleStyle}>오늘은 뭐 먹지?</h3><p>발견하는 즐거움부터 맛있는 한 끼까지.</p></div>{choices(['추천','든든한 한 끼','가벼운 간식'])}<div className="ap-products">{['오늘의 한 그릇','갓 만든 한 입','산뜻한 한 접시'].slice(selection===2?1:0).map((name,i)=><article key={name} style={cardStyle}><div className={'ap-food ap-food-'+i} aria-label="DRH 추상 음식 형태"/><small>메뉴 예시</small><h4>{name}</h4><p>{(8900+i*2000).toLocaleString()}원</p>{action('담기')}</article>)}</div></>}
   {scene==='finance'&&variant==='crypto'&&<>
    <div className="ap-search-bar"><input aria-label="Search markets" placeholder="Search markets" value={query} onChange={e=>setQuery(e.target.value)} style={inputStyle}/></div>
    {choices(['Spot','Futures','Earn'])}
    <div className="ap-market-grid">
     {[{sym:'BTC',price:'$104,820',change:'+2.14%',dir:'positive'},{sym:'ETH',price:'$3,842',change:'+1.82%',dir:'positive'},{sym:'BNB',price:'$682',change:'-0.45%',dir:'negative'}].filter(m=>m.sym.toLowerCase().includes(query.toLowerCase())).map(m=><article key={m.sym} className="ap-market-card" style={cardStyle} onClick={()=>setMessage(m.sym+' 상세 · DRH 예시')}>
      <h4>{m.sym}</h4>
      <div className="ap-price" style={titleStyle}>{m.price}</div>
      <div className={'ap-change '+m.dir} style={{color:m.dir==='positive'?positive:negative}}>{m.change}</div>
     </article>)}
    </div>
    <div className="ap-activity"><h4>Recent Activity</h4>
     {[['Bought BTC','+ 0.0024 BTC'],['Received ETH','+ 1.50 ETH'],['Sold BNB','− 5.00 BNB']].map(([name,amount])=><div key={name}><span>{name}</span><b>{amount}</b></div>)}
    </div>
    {action('Buy Crypto')}
   </>}
   {scene==='finance'&&variant!=='crypto'&&<><div className="ap-finance-summary"><small>나의 자산 · 예시 데이터</small><h3 style={titleStyle}>{selection===0?'2,480,000':'840,000'}<small> 원</small></h3>{choices(['전체','생활 계좌'])}</div><article className="ap-account" style={cardStyle}><div><small>생활 계좌</small><h4>일상의 여유를 모으세요</h4></div>{action('내역 확인')}</article><div className="ap-transactions"><h4>최근 내역</h4>{[['급여','+ 2,500,000원'],['오늘의 커피','− 4,500원'],['정기 구독','− 15,500원']].map(([name,amount])=><div key={name}><span>{name}</span><b>{amount}</b></div>)}</div></>}
   {scene==='workspace'&&<div className="ap-workspace"><aside><small>WORKSPACE</small>{choices(['전체 이슈','내 작업','완료'])}<p>제품 디자인<br/>개발<br/>릴리스</p></aside><div><header><h3 style={titleStyle}>이번 주의 이슈</h3><input aria-label="이슈 검색" placeholder="이슈 검색…" value={query} onChange={e=>setQuery(e.target.value)} style={sourceStyle('inputs')}/></header>{['탐색 경험 다듬기','컴포넌트 검토','다음 릴리스 준비'].filter((name,i)=>name.includes(query)&&(selection!==2||i===2)&&(selection!==1||i===0)).map((name,i)=><button className="ap-issue" key={name} onClick={()=>setMessage(name+' · 상세 선택')} style={cardStyle}><span>○</span><small>DES-{101+i}</small><b>{name}</b><span>↗</span></button>)}</div></div>}
   {scene==='media'&&<><div className="ap-media-heading"><small>MADE FOR YOUR MOMENT</small><h3 style={titleStyle}>오늘의 리듬을 찾아요.</h3>{choices(['집중','산책','휴식'])}</div><div className="ap-albums">{['고요한 아침','도시의 저녁','느린 주말'].map((name,i)=><article key={name} style={cardStyle}><div className={'ap-art ap-art-'+((i+selection)%3)} aria-label="DRH 추상 앨범 표지"/><h4>{name}</h4><p>플레이리스트 예시 · 실제 음원 없음</p>{action('재생 상태 보기')}</article>)}</div></>}
   {scene==='automotive'&&<div className="ap-automotive">
    <div className="ap-auto-copy"><small>FORM / PERFORMANCE</small><h3 style={titleStyle}>속도를 그리는 선.</h3><p>움직임과 비례, 재료의 긴장을 하나의 시각 언어로 탐구합니다.</p>{choices(['Design','Performance','Details'])}</div>
    <div className="ap-vehicle-stage" aria-label="DRH 추상 차량 실루엣"><i/><i/><i/><span>01 — {selection===0?'FORM':selection===1?'SPEED':'CRAFT'}</span></div>
    <div className="ap-spec-grid">{[['POWER','670 PS'],['0—100','3.1 SEC'],['SYSTEM','HYBRID']].map(([label,value])=><article key={label} style={cardStyle}><small>{label}</small><strong style={titleStyle}>{value}</strong></article>)}</div>
    {action('디자인 스터디 보기')}
   </div>}
   {scene==='play'&&<div className="ap-playground">
    <div className="ap-play-copy"><small>LET’S PLAY</small><h3 style={titleStyle}>새로운 모험이 시작돼요.</h3><p>명확한 선택, 대담한 색과 즉시 이해되는 피드백으로 즐거움을 만듭니다.</p>{choices(['Discover','Together','Classics'])}</div>
    <div className="ap-game-stage" aria-label="DRH 추상 게임 장면"><i/><i/><i/><span>{selection===0?'START':selection===1?'2 PLAYERS':'LEVEL 01'}</span></div>
    <div className="ap-play-cards">{['오늘의 발견','함께하는 순간','다시 만난 클래식'].map((label,i)=><button key={label} style={cardStyle} aria-pressed={selection===i} onClick={()=>{setSelection(i);setMessage(label+' 선택')}}><small>0{i+1}</small><b>{label}</b><span>→</span></button>)}</div>
   </div>}
   {scene==='developer'&&<div className="ap-developer">
    <div className="ap-dev-hero"><small>IDEA → RELEASE</small><h3 style={titleStyle}>아이디어를 세상으로.</h3><p>명령, 상태, 결과가 한 흐름 안에서 읽히는 작업 공간 예시입니다.</p><div className="ap-dev-command"><input aria-label="프로젝트 명령" value={query} onChange={e=>setQuery(e.target.value)} placeholder="무엇을 만들까요?" style={inputStyle}/>{action('실행')}</div>{choices(['Build','Inspect','Ship'])}</div>
    <div className="ap-dev-grid">
     <article className="ap-console" style={cardStyle}><header><span>● preview</span><small>ready</small></header><pre><code>{query?`› ${query}\n✓ preview generated\n✓ checks passed`:'› deploy --preview\n✓ build complete\n✓ preview ready'}</code></pre></article>
     <div className="ap-dev-metrics">{[['EDGE','24 ms'],['BUILD','18.4 s'],['STATUS','READY']].map(([label,value])=><article key={label} style={cardStyle}><small>{label}</small><strong style={titleStyle}>{value}</strong></article>)}</div>
    </div>
   </div>}
   {scene==='editorial'&&<div className="ap-editorial-study">
    <div className="ap-editorial-lead"><small>A NEW PERSPECTIVE</small><h3 style={titleStyle}>일상을 보는 새로운 관점.</h3><p>타이포그래피와 여백, 강한 표면 대비로 하나의 이야기를 편집합니다.</p>{action('이야기 살펴보기')}</div>
    <div className="ap-editorial-grid"><div className="ap-editorial-art" aria-label="DRH 추상 편집 그래픽"><i/><i/><i/></div><article style={cardStyle}><small>01 / FEATURE</small><h4 style={titleStyle}>형태보다 먼저 읽히는 리듬</h4><p>큰 제목, 짧은 본문과 반복되는 색상 블록으로 시선을 안내합니다.</p></article><article style={cardStyle}><small>02 / NOTES</small><h4 style={titleStyle}>규칙을 재료로 사용하기</h4><p>원본에 기록된 색과 글꼴을 조합한 DRH 편집 예시입니다.</p></article></div>
   </div>}
   <p className="ap-feedback" role="status">{message}</p>
  </div>
  <details className="bc-evidence"><summary>Evidence</summary><p>source · {catalog.entry.upstreamPath}</p><p>confidence · 원본 선언 토큰과 컴포넌트 속성 적용. 배치·문구·추상 형태·데이터·동작은 DRH composition이며 공식 화면 근거가 아닙니다.</p><p>한글 표시 · {resolveBrandFont({...body,script:'ko'}).family}{resolveBrandFont({...body,script:'ko'}).scriptFallback?' / Pretendard fallback':''}. 원본 지정 글꼴: {resolveBrandFont(body).declared||'미지정'}</p><p>적용 컴포넌트 · {(['buttons','cards','inputs'] as ComponentKind[]).map(kind=>component(kind)?.key).filter(Boolean).join(', ')||'없음'}</p></details>
 </section>
}
