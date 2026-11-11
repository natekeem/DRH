import type { BrandCatalog, ComponentKind, ComponentSizeContract } from './brandCatalog'
export const componentGroups: {label:string;kinds:ComponentKind[]}[] = [
 {label:'Actions',kinds:['buttons','badges','icon']}, {label:'Forms',kinds:['inputs']},
 {label:'Surfaces',kinds:['cards','dialogs','content-surface','status']}, {label:'Navigation',kinds:['navigation','tabs']},
 {label:'Data',kinds:['tables','code']}, {label:'Composition',kinds:['hero','section','cta-band','pricing','media','footer','legal']},
]
export type ExperienceSceneType = 'product'|'commerce'|'finance'|'workspace'|'media'|'automotive'|'play'|'developer'|'editorial'
export type ExperienceVariant = 'default'|'crypto'
export function experienceScene(catalog:Pick<BrandCatalog,'entry'|'spec'>):ExperienceSceneType {
 const slug=catalog.entry.slug.toLowerCase()
 if(/apple/.test(slug))return 'product'
 if(/baemin/.test(slug))return 'commerce'
 if(/toss|kakaobank|coinbase/.test(slug))return 'finance'
 if(/linear/.test(slug))return 'workspace'
 if(/spotify/.test(slug))return 'media'
 if(/ferrari/.test(slug))return 'automotive'
 if(/nintendo/.test(slug))return 'play'
 if(/vercel/.test(slug))return 'developer'
 const category=[catalog.entry.category,catalog.spec.layout,catalog.spec.traits,catalog.entry.description||''].join(' ').toLowerCase()
 if(/automotive|vehicle|mobility|motorsport|spaceflight/.test(category))return 'automotive'
 if(/finance|fintech|crypto|bank|payment|trading|exchange/.test(category))return 'finance'
 if(/commerce|delivery|shopping|marketplace|retail|food/.test(category))return 'commerce'
 if(/music|media|stream|playlist|audio/.test(category))return 'media'
 if(/\bretro\b|\bgaming\b|\bgame\b|\bplay\b/.test(category))return 'play'
 if(/design tools|saas|productivity|workflow|workspace/.test(category))return 'workspace'
 if(/developer|backend|devops|ai & llm|artificial intelligence|code/.test(category))return 'developer'
 if(/big tech|consumer electronics|hardware/.test(category))return 'product'
 return 'editorial'
}
/** Detect crypto/fintech variant for finance scenes — based on source data, not slug. */
export function experienceVariant(catalog:Pick<BrandCatalog,'entry'|'spec'>):ExperienceVariant {
 const text=[catalog.entry.category,catalog.spec.traits,catalog.entry.description||''].join(' ').toLowerCase()
 return /crypto|trading|exchange|defi|blockchain|token/.test(text)?'crypto':'default'
}
export function componentSize(kind:ComponentKind):ComponentSizeContract {
 return ['buttons','badges','icon'].includes(kind)?'compact':['hero','section','footer','legal','cta-band','pricing'].includes(kind)?'full':['tables','navigation','media','code'].includes(kind)?'wide':'medium'
}
/** Semantic sample labels per component kind, adapted for scene context. */
export function componentSampleContent(kind:ComponentKind,key:string,scene:ExperienceSceneType,variant:ExperienceVariant):{label:string;placeholder?:string;items?:string[];headers?:string[];rows?:string[][]} {
 const crypto=variant==='crypto'
 if(kind==='buttons'){
  if(/play/.test(key))return {label:crypto?'▶':'▶'}
  if(/secondary|more/.test(key))return {label:crypto?'View Details':'자세히 보기'}
  if(/download/.test(key))return {label:'Download'}
  return {label:crypto?'Buy Crypto':'Continue →'}
 }
 if(kind==='inputs'){
  if(/search/.test(key))return {label:crypto?'Search':'검색',placeholder:crypto?'Search markets':'이름으로 찾기'}
  return {label:'Email',placeholder:'name@example.com'}
 }
 if(kind==='cards'){
  if(crypto)return {label:'BTC',items:['$104,820','+2.14%']}
  if(scene==='media')return {label:'나의 플레이리스트',items:['집중하는 시간을 위한 보관함']}
  if(scene==='commerce')return {label:'저장한 컬렉션',items:['다시 보고 싶은 항목을 모았습니다.']}
  return {label:'계정 보안',items:['새로운 로그인 알림을 확인하세요.']}
 }
 if(kind==='navigation'){
  if(crypto)return {label:'Markets',items:['Markets','Trade','Earn']}
  return {label:'홈',items:['홈','보관함','계정']}
 }
 if(kind==='tables'){
  if(crypto)return {label:'Markets',headers:['Asset','Price','Change'],rows:[['BTC','$104,820','+2.14%'],['ETH','$3,842','+1.82%']]}
  return {label:'최근 프로젝트',headers:['이름','상태'],rows:[['프로젝트 A','진행 중'],['프로젝트 B','검토 중']]}
 }
 if(kind==='tabs'){
  if(crypto)return {label:'Overview',items:['Overview','Orders','History']}
  return {label:'개요',items:['개요','활동','설정']}
 }
 if(kind==='badges')return {label:/new/.test(key)?'New':'Active'}
 if(kind==='hero')return {label:crypto?'Trade Anywhere':'한곳에서 시작하세요'}
 if(kind==='section')return {label:crypto?'Why Binance':'일상의 새로운 발견'}
 if(kind==='cta-band')return {label:crypto?'Get Started':'다음 작업을 시작하세요'}
 return {label:'Sample'}
}
