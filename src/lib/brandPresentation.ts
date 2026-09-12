import type { BrandDesignSpec, BrandTypeRole } from '../brandDesignSpec'
import fonts from '../data/brandFontAssets.json'
import assets from '../data/brandVerifiedAssets.json'
import curatedCopy from '../data/brandCuratedCopy.json'

export { fonts as brandFontAssets }
export type VerifiedBrandAsset = BrandDesignSpec['brandAsset'] & {darkSrc?:string;format?:string;attribution?:string;checkedAt?:string;sha256?:string;darkSha256?:string}
export function brandIdentifier(slug:string,spec:BrandDesignSpec):VerifiedBrandAsset {return (assets as Record<string,VerifiedBrandAsset>)[slug]||spec.brandAsset}
export function curatedRule(slug:string,kind:string,row:string[]) {
 const group=(curatedCopy as Record<string,Record<string,{source:string;summary:string}[]>>)[slug]?.[kind]
 // Exact source matching makes an upstream edit fall back safely rather than reuse a stale translation.
 return group?.find(r=>r.source===row.join(' | '))?.summary
}
export function representativeRows<T>(rows:T[],limit:number):T[] {
 return rows.length<=limit?rows:Array.from({length:limit},(_,i)=>rows[Math.round(i*(rows.length-1)/(limit-1))])
}
export function resolveBrandFont(role:Partial<BrandTypeRole>) {
 const declared=role.declaredFamily||role.fontFamily||''
 const family=declared.split(',')[0].replace(/["']/g,'').trim()
 const normalized=family.toLowerCase().replace(/[- ]|variable|display/g,'')
 const font=fonts.find(f=>f.family.toLowerCase().replace(/ /g,'')===normalized)
 if(font)return {kind:'open-font' as const,declared,family:font.family,stack:`"${font.localFamily}", ${/mono/i.test(font.family)?'monospace':/serif/i.test(font.family)?'serif':'sans-serif'}`,asset:font}
 if(/^(SF Pro|SFMono|SF Mono|-apple-system|BlinkMacSystemFont|system-ui|ui-|Arial|Helvetica|Times New Roman|Georgia|Menlo|Monaco|Consolas)/i.test(family)) {
  const stack=/^SF Pro/i.test(family)?'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif':/^SFMono|^SF Mono/i.test(family)?'ui-monospace, "Cascadia Code", Consolas, monospace':declared+', '+(/Times|Georgia/i.test(family)?'serif':/Mono|Consolas|Menlo/i.test(family)?'monospace':'sans-serif')
  return {kind:'system-font' as const,declared,family:stack,stack}
 }
 // Use an explicitly declared open fallback when available. Otherwise honor the source's generic family.
 const alternate=fonts.find(f=>declared.split(',').slice(1).some(s=>s.replace(/["']/g,'').trim()===f.family))
 const mono=/mono/i.test(declared)||/mono/i.test(role.renderFallback||'')
 const serif=/\bserif\b/i.test(declared)&&!/sans-serif/i.test(declared)
 const fallback=alternate?.family||(mono?'Geist Mono':serif?'Georgia':'Inter')
 const stack=`"${fallback}", ${mono?'monospace':serif?'serif':'sans-serif'}`
 return {kind:declared?'proprietary' as const:'unspecified' as const,declared,family:fallback,stack}
}

export function sourceLines(value:unknown):string[] {
 if(typeof value==='string'){
  // A few upstream properties contain serialized arrays. Never display their JSON syntax.
  if(/^\s*[\[{]/.test(value)){try{return sourceLines(JSON.parse(value))}catch{/* Markdown/token reference */}}
  return value.split('\n').map(s=>s.trim()).filter(Boolean)
 }
 if(Array.isArray(value))return value.flatMap(sourceLines)
 if(value&&typeof value==='object')return Object.values(value).flatMap(sourceLines)
 return typeof value==='number'?[String(value)]:[]
}
export const cleanSource=(s:string)=>s.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[`*]/g,'').replace(/^\s*(?:#+\s*|[-+]\s+)/,'').replace(/\{([^{}]+)\}/g,'$1').trim()
export function sourceTable(value:unknown):string[][] {
 const rows=sourceLines(value).filter(s=>/^\|/.test(s)).map(s=>s.replace(/^\||\|$/g,'').split(/(?<!\\)\|/).map(cleanSource))
 return rows.filter((r,i)=>!r.every(c=>/^[-: ]+$/.test(c))&&!(rows[i+1]?.every(c=>/^[-: ]+$/.test(c))))
}
export function responsiveEvidence(spec:BrandDesignSpec):Record<string,unknown> {
 const evidence:Record<string,unknown>=Object.fromEntries(Object.entries(spec.sections||{}).filter(([k,v])=>/responsive|breakpoint/i.test(k)&&sourceLines(v).length))
 for(const [k,v] of Object.entries(spec.frontmatter||{}))if(/responsive|breakpoint/i.test(k)&&sourceLines(v).length)evidence[k]=v
 return evidence
}
export function motionEvidence(spec:BrandDesignSpec) {
 const lines=sourceLines(spec.motion).filter(s=>!/^\|/.test(s))
 const excluded=lines.filter(s=>/not in scope|out of scope|not specified|not defined|not documented|not extracted|not captured/i.test(s))
 const rules=lines.filter(s=>{
  if(excluded.includes(s)||!/^[-+]/.test(s))return false
  const text=cleanSource(s)
  // The parser's broad keyword inventory also contains typography history, layout
  // transitions and Do/Don't prose. Only explicit property-style evidence belongs here.
  return (/^(transition|duration|timing curve|image fade-in|lazy loading|background|hover|focus)\s*:/i.test(text)&&/transition|fade|animation|\d+(?:\.\d+)?(?:ms|s)\b|cubic-bezier/i.test(text))||/^\d+(?:\.\d+)?s\s+cubic-bezier/i.test(text)
 })
 const outOfScope=excluded.some(s=>/not in scope|out of scope/i.test(s))
 return {state:rules.length?'defined':outOfScope?'not-in-scope':'not-specified',lines:[...new Set(rules.map(cleanSource))],raw:spec.motion}
}
const replacements:[RegExp,string][]=[[/no shadow,? no border/gi,'그림자·테두리 없음'],[/no (?:drop[- ]?)?shadow/gi,'그림자 없음'],[/no border/gi,'테두리 없음'],[/background/gi,'배경'],[/focus(?:ed)? (?:ring|outline)/gi,'포커스 링'],[/border/gi,'테두리'],[/outline/gi,'외곽선'],[/shadow/gi,'그림자'],[/single[- ]column/gi,'1열'],[/two[- ]column/gi,'2열'],[/three[- ]column/gi,'3열'],[/default desktop layout/gi,'기본 데스크톱 구성'],[/card grid/gi,'카드 그리드'],[/maintained/gi,'유지'],[/nav hamburger/gi,'메뉴 버튼으로 전환'],[/pricing comparison becomes accordion/gi,'요금 비교를 아코디언으로 전환'],[/on canvas/gi,'캔버스 위'],[/at (\d+)% opacity/gi,'불투명도 $1%'],[/surface/gi,'표면'],[/inset/gi,'안쪽'],[/flat/gi,'평면']]
export function shortRule(text:string){const tokens:string[]=[];let s=cleanSource(text).replace(/(?:colors|typography|components?)\.[\w-]+/g,t=>{tokens.push(t);return `§${tokens.length-1}§`});for(const [pattern,translation]of replacements)s=s.replace(pattern,translation);return s.replace(/§(\d+)§/g,(_,i)=>tokens[Number(i)])}
export function curatedColors<T>(colors:[string,T][]):[string,T][] {
 const priorities=[/^primary$/, /^canvas$/, /^surface(?:-1)?$/, /^(ink|text|body)$/, /^(ink-muted|muted)$/, /^(hairline|border)$/, /primary-hover/, /semantic-success/]
 const chosen=priorities.map(p=>colors.find(([k])=>p.test(k))).filter((v):v is [string,T]=>!!v)
 return [...new Map([...chosen,...colors].map(v=>[v[0],v])).values()].slice(0,8)
}
export function curatedRoles(roles:[string,BrandTypeRole][]) {
 const priorities=[/display|hero/,/heading|headline|title/,/body|paragraph/,/caption|small|label/,/mono/]
 const chosen:[string,BrandTypeRole][]=[]
 for(const pattern of priorities){const role=roles.find(([key])=>pattern.test(key)&&!chosen.some(([k])=>k===key));if(role)chosen.push(role)}
 return [...new Map([...chosen,...roles].map(v=>[v[0],v])).values()].slice(0,5)
}
