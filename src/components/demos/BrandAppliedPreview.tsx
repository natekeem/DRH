import { lazy, Suspense } from 'react'
import { projectComponentStyle, resolveComponentStyle } from '../../lib/brandComponentStyle'
import type { BrandCatalog, BrandTheme, ComponentKind } from '../../lib/brandCatalog'
import { BrandComponentSample } from './BrandComponentSample'

const BrandProjectHandoff=lazy(()=>import('./BrandProjectHandoff'))
export function appliedScene(catalog:BrandCatalog):'product'|'commerce'|'editorial'|'media' {
 const source=[catalog.spec.layout,catalog.entry.category].join(' ').toLowerCase()
 if(/media|music|stream/.test(source))return 'media'
 if(/marketplace|commerce|delivery|shopping/.test(source))return 'commerce'
 if(/fintech|crypto|saas|developer|software|consumer-tech/.test(source))return 'product'
 if(/editorial|cinematic|automotive|retro/.test(source))return 'editorial'
 return 'product'
}
const sceneKinds:Record<ReturnType<typeof appliedScene>,ComponentKind[]>={
 product:['navigation','tabs','cards','inputs','tables','buttons'],
 commerce:['navigation','inputs','badges','cards','pricing','buttons'],
 editorial:['navigation','hero','section','cards','buttons','footer'],
 media:['navigation','tabs','media','cards','buttons']
}
export function BrandAppliedPreview({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const scene=appliedScene(catalog)
 const headingRole=catalog.roles.find(([k])=>/heading|title/.test(k))?.[1]||catalog.roles[0]?.[1]
 const headingStyle=projectComponentStyle(resolveComponentStyle({typography:headingRole},catalog,theme),true)
 const accent=resolveComponentStyle({borderColor:catalog.spec.colors.primary},catalog,theme).borderColor
 const selected=sceneKinds[scene].flatMap(kind=>{
  const matches=catalog.components.filter(c=>c.kind===kind&&!/disabled|hover|pressed|focus|selected|active/.test(c.key))
  if(scene==='media'&&kind==='buttons')matches.sort((a,b)=>Number(/play/.test(b.key))-Number(/play/.test(a.key)))
  return matches.slice(0,kind==='buttons'?2:1)
 })
 return <section className="bc-applied" data-scene={scene}>
  <p className="bc-note">DRH 적용 예시 · 공식 제품 화면이 아닙니다.</p>
  <p className="bc-note">원본에 있는 구성요소를 사용합니다. 제목·배치·콘텐츠는 DRH 예시입니다.</p>
  <div className="bc-scene" style={{background:theme.colors.canvas,color:theme.colors.text,borderTop:accent?`3px solid ${accent}`:undefined}}>
   <header className="bc-scene-intro" data-evidence="drh-scaffolding"><small>{scene==='product'?'MY WORKSPACE':scene==='commerce'?'MY COLLECTION':scene==='media'?'MY LIBRARY':'JOURNAL'}</small><h3 style={{...headingStyle,fontSize:headingStyle.fontSize?`min(${headingStyle.fontSize}, 28px)`:undefined}}>{scene==='product'?'오늘의 작업 공간':scene==='commerce'?'취향을 담은 컬렉션':scene==='media'?'나의 콘텐츠 보관함':'새로운 관점의 기록'}</h3><p>지금 필요한 정보를 한 화면에서 확인하세요.</p><small>DRH 화면 구성</small></header>
   <div className="bc-scene-grid">{selected.map(c=><BrandComponentSample key={c.key} component={c} catalog={catalog} theme={theme} context content={scene}/>)}</div>
   {selected.length<4&&<div className="bc-scene-scaffolding" data-evidence="drh-scaffolding"><p>저장한 항목</p><ul><li>첫 번째 프로젝트 · 오늘</li><li>두 번째 프로젝트 · 어제</li></ul><small>DRH 목록 예시 · 원본에 없는 카드·폼 스타일을 보완하지 않았습니다.</small></div>}
  </div>
  <p className="bc-note bc-coverage">원본 컴포넌트 {selected.length}개 적용 · 각 예시 위에 원본 이름 표시</p>
 <Suspense fallback={null}><BrandProjectHandoff slug={catalog.entry.slug}/></Suspense>
 </section>
}
