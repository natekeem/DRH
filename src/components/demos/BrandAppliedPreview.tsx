import { useState, type CSSProperties } from 'react'
import { projectComponentStyle, resolveComponentStyle } from '../../lib/brandComponentStyle'
import type { BrandCatalog, BrandTheme, ComponentKind } from '../../lib/brandCatalog'
import { resolveBrandFont } from '../../lib/brandPresentation'
import { experienceScene } from '../../lib/brandExperience'

export const appliedScene=experienceScene
export function BrandAppliedPreview({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const scene=experienceScene(catalog)
 const [selection,setSelection]=useState(0),[query,setQuery]=useState(''),[message,setMessage]=useState('')
 const component=(kind:ComponentKind)=>{const matches=catalog.components.filter(c=>c.kind===kind&&!/disabled|hover|pressed|focus|selected|active|overlay|on-dark/.test(c.key));return (kind==='buttons'?matches.find(c=>/button-primary$|tds-button|black-action|woowa-more-light/.test(c.key)):undefined)||matches[0]}
 const sourceStyle=(kind:ComponentKind)=>projectComponentStyle(resolveComponentStyle(component(kind)?.values||{},catalog,theme),kind!=='buttons'&&kind!=='inputs')
 const heading=catalog.roles.find(([k])=>/display|hero|heading|title/.test(k))?.[1]||catalog.roles[0]?.[1]||{}
 const body=catalog.roles.find(([k])=>k==='body')?.[1]||catalog.roles.find(([k])=>/body|paragraph/.test(k))?.[1]||heading
 const primary=resolveComponentStyle({color:catalog.spec.colors.primary},catalog,theme).color||theme.colors.text
 const rootStyle={background:theme.colors.canvas,color:theme.colors.text,fontFamily:resolveBrandFont({...body,script:'ko'}).stack,'--ap-surface':theme.colors.surface,'--ap-border':theme.colors.border,'--ap-accent':primary} as CSSProperties
 const titleStyle={fontFamily:resolveBrandFont({...heading,script:'ko'}).stack,fontWeight:resolveComponentStyle({typography:heading},catalog,theme).fontWeight}
 const action=(label:string)=><button className="ap-action" style={sourceStyle('buttons')} data-source-component={component('buttons')?.key} onClick={()=>setMessage(label+' 선택 · DRH 화면 예시입니다.')}>{label}</button>
 const choices=(labels:string[])=><div className="ap-choices" aria-label="화면 선택">{labels.map((label,i)=><button key={label} aria-pressed={selection===i} onClick={()=>{setSelection(i);setMessage(label+' 보기')}}>{label}</button>)}</div>
 const cardStyle=sourceStyle('cards')
 return <section className="bc-applied" data-scene={scene}>
  <div className="ap-disclaimer"><b>DRH Applied Preview</b><p>공식 제품 화면이 아닌 디자인 시스템 적용 예시입니다.</p></div>
  <div className={'ap-canvas ap-scene-'+scene} style={rootStyle} data-evidence="drh-scaffolding">
   <header className="ap-masthead"><b>{catalog.entry.name}</b><span>DESIGN STUDY / 01</span></header>
   {scene==='product'&&<div className="ap-product-hero"><small>일상을 위한 디자인</small><h3 style={titleStyle}>{selection===0?'가볍게. 더 선명하게.':'작은 디테일. 큰 차이.'}</h3><p>필요한 것에 집중할 때, 경험은 더 단순해집니다.</p>{choices(['Design','Details'])}<div className="ap-object" aria-label="DRH 추상 제품 형태"><span>Aa</span></div>{action('디자인 살펴보기')}</div>}
   {scene==='commerce'&&<><div className="ap-commerce-heading" style={{color:catalog.spec.colors.foreground||theme.colors.text}}><h3 style={titleStyle}>오늘은 뭐 먹지?</h3><p>발견하는 즐거움부터 맛있는 한 끼까지.</p></div>{choices(['추천','든든한 한 끼','가벼운 간식'])}<div className="ap-products">{['오늘의 한 그릇','갓 만든 한 입','산뜻한 한 접시'].slice(selection===2?1:0).map((name,i)=><article key={name} style={cardStyle}><div className={'ap-food ap-food-'+i} aria-label="DRH 추상 음식 형태"/><small>메뉴 예시</small><h4>{name}</h4><p>{(8900+i*2000).toLocaleString()}원</p>{action('담기')}</article>)}</div></>}
   {scene==='finance'&&<><div className="ap-finance-summary"><small>나의 자산 · 예시 데이터</small><h3 style={titleStyle}>{selection===0?'2,480,000':'840,000'}<small> 원</small></h3>{choices(['전체','생활 계좌'])}</div><article className="ap-account" style={cardStyle}><div><small>생활 계좌</small><h4>일상의 여유를 모으세요</h4></div>{action('내역 확인')}</article><div className="ap-transactions"><h4>최근 내역</h4>{[['급여','+ 2,500,000원'],['오늘의 커피','− 4,500원'],['정기 구독','− 15,500원']].map(([name,amount])=><div key={name}><span>{name}</span><b>{amount}</b></div>)}</div></>}
   {scene==='workspace'&&<div className="ap-workspace"><aside><small>WORKSPACE</small>{choices(['전체 이슈','내 작업','완료'])}<p>제품 디자인<br/>개발<br/>릴리스</p></aside><div><header><h3 style={titleStyle}>이번 주의 이슈</h3><input aria-label="이슈 검색" placeholder="이슈 검색…" value={query} onChange={e=>setQuery(e.target.value)} style={sourceStyle('inputs')}/></header>{['탐색 경험 다듬기','컴포넌트 검토','다음 릴리스 준비'].filter((name,i)=>name.includes(query)&&(selection!==2||i===2)&&(selection!==1||i===0)).map((name,i)=><button className="ap-issue" key={name} onClick={()=>setMessage(name+' · 상세 선택')} style={cardStyle}><span>○</span><small>DES-{101+i}</small><b>{name}</b><span>↗</span></button>)}</div></div>}
   {scene==='media'&&<><div className="ap-media-heading"><small>MADE FOR YOUR MOMENT</small><h3 style={titleStyle}>오늘의 리듬을 찾아요.</h3>{choices(['집중','산책','휴식'])}</div><div className="ap-albums">{['고요한 아침','도시의 저녁','느린 주말'].map((name,i)=><article key={name} style={cardStyle}><div className={'ap-art ap-art-'+((i+selection)%3)} aria-label="DRH 추상 앨범 표지"/><h4>{name}</h4><p>플레이리스트 예시 · 실제 음원 없음</p>{action('재생 상태 보기')}</article>)}</div></>}
   {(scene==='automotive'||scene==='play'||scene==='developer'||scene==='editorial')&&<div className="ap-editorial"><small>{scene==='automotive'?'FORM / PERFORMANCE':scene==='play'?'LET’S PLAY':scene==='developer'?'IDEA → RELEASE':'A NEW PERSPECTIVE'}</small><h3 style={titleStyle}>{scene==='automotive'?'속도를 그리는 선.':scene==='play'?'새로운 모험이 시작돼요.':scene==='developer'?'아이디어를 세상으로.':'일상을 보는 새로운 관점.'}</h3><p>{scene==='automotive'?'움직임과 비례를 탐구하는 디자인 스터디.':scene==='play'?'색과 형태로 만나는 즐거운 발견.':scene==='developer'?'만들고, 확인하고, 다음 가능성을 펼치세요.':'타이포그래피와 여백으로 전하는 이야기.'}</p><div className="ap-graphic" aria-label="DRH 추상 조합"><i/><i/><i/></div>{action(scene==='developer'?'프로젝트 시작':'더 알아보기')}</div>}
   <p className="ap-feedback" role="status">{message}</p>
  </div>
  <details className="bc-evidence"><summary>Evidence</summary><p>source · {catalog.entry.upstreamPath}</p><p>confidence · 원본 선언 토큰과 컴포넌트 속성 적용. 배치·문구·추상 형태·데이터·동작은 DRH composition이며 공식 화면 근거가 아닙니다.</p><p>원본 카드가 없으면 카드 속성을 만들지 않고 DRH 배치만 사용합니다. original value는 Component Library와 Design DNA에서 확인하세요.</p><p>한글 표시 · {resolveBrandFont({...body,script:'ko'}).family}{resolveBrandFont({...body,script:'ko'}).scriptFallback?' / Pretendard fallback':''}. 원본 지정 글꼴: {resolveBrandFont(body).declared||'미지정'}</p><p>적용 컴포넌트 · {(['buttons','cards','inputs'] as ComponentKind[]).map(kind=>component(kind)?.key).filter(Boolean).join(', ')||'없음'}</p></details>
 </section>
}
