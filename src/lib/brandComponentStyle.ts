import type { CSSProperties } from 'react'
import type { BrandTypeRole } from '../brandDesignSpec'
import type { BrandCatalog, BrandTheme } from './brandCatalog'
import { resolveBrandFont } from './brandPresentation'

/** A deliberately closed CSS projection. Source prose is never assigned to style. */
export type ResolvedComponentStyle = Pick<CSSProperties,
 'backgroundColor'|'color'|'borderColor'|'borderWidth'|'borderStyle'|'borderRadius'|'boxShadow'|
 'padding'|'paddingBlock'|'paddingInline'|'height'|'minHeight'|'maxHeight'|'width'|'minWidth'|'maxWidth'|
 'fontFamily'|'fontSize'|'fontWeight'|'lineHeight'|'letterSpacing'|'textTransform'|'opacity'>
const object=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{}
export const safeLength=(v:unknown):string|undefined=>typeof v==='number'&&Number.isFinite(v)?`${v}px`:typeof v==='string'&&/^-?(?:\d*\.)?\d+(?:px|rem|em|%|vh|vw)?$/.test(v.trim())?(/^-?[\d.]+$/.test(v.trim())?`${v.trim()}px`:v.trim()):undefined
export const safeColor=(v:unknown):string|undefined=>typeof v==='string'&&/^(?:#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|(?:rgb|hsl)a?\([\d.%,\s/+\-]+\)|transparent|currentColor|white|black)$/i.test(v.trim())?v.trim():undefined
const lengths=(v:unknown)=>{const a=typeof v==='number'?[String(v)]:typeof v==='string'?v.trim().split(/\s+/):[];return a.length>0&&a.length<=4&&a.every(s=>safeLength(s))?a.map(s=>safeLength(s)).join(' '):undefined}
function safeShadow(value:unknown):string|undefined {
 if(value==='none')return value
 if(typeof value!=='string')return undefined
 const layers=value.split(/,(?![^()]*\))/).map(layer=>{
  const color=layer.match(/#[\da-f]{3,8}\b|rgba?\([\d.,%\s]+\)/i)?.[0]
  if(!color||!safeColor(color))return undefined
  const remainder=layer.replace(color,'').trim(),inset=/\binset\b/.test(remainder)
  const metrics=remainder.replace(/\binset\b/,'').trim().split(/\s+/)
  if(metrics.length<2||metrics.length>4||!metrics.every(v=>safeLength(v)))return undefined
  return `${inset?'inset ':''}${metrics.map(v=>safeLength(v)).join(' ')} ${color}`
 })
 return layers.every(Boolean)?layers.join(', '):undefined
}

export function resolveComponentStyle(values:Record<string,unknown>,catalog:BrandCatalog,theme:BrandTheme):ResolvedComponentStyle {
 const resolve=(value:unknown):unknown=>{
  let v=value
  for(let i=0;i<6&&typeof v==='string';i++){
   const key=v.replace(/^\{(.+)\}$/, '$1').replace(/^var\(--([\w.-]+)\)$/, '$1')
   const match=key.match(/^(?:tokens\.)?(colors|spacing|radius|rounded|typography)[.-](.+)$/)
   const next=match?object(catalog.spec[match[1]==='rounded'?'radius':match[1] as keyof typeof catalog.spec])[match[2]]:catalog.spec.colors[key]
   if(next===undefined||next===v)break
   v=next
  }
  return v
 }
 const color=(v:unknown)=>{
  const s=safeColor(resolve(v));if(!s)return undefined
  for(const k of ['canvas','surface','text','border'] as const)if(s.toLowerCase()===catalog.themes[0].colors[k].toLowerCase())return safeColor(theme.colors[k])
  return s
 }
 const len=(v:unknown)=>safeLength(resolve(v))
 const typography=object(resolve(values.typography??values.typographyRole))
 const t={...typography} as Partial<BrandTypeRole>
 const shorthand=typeof values.font==='string'?values.font.match(/^(\d+(?:\.\d+)?(?:px|rem|em))\s*\/\s*(\d{3})(?:\s*\/\s*([\d.]+(?:px|rem|em)?))?$/):null
 if(shorthand){t.fontSize??=shorthand[1];t.fontWeight??=Number(shorthand[2]);t.lineHeight??=shorthand[3]}
 // Standard CSS font shorthand is parsed, never assigned wholesale.
 const cssFont=typeof values.font==='string'?values.font.match(/^(?:(normal|bold|[1-9]00)\s+)?([\d.]+(?:px|rem|em))(?:\/([\d.]+(?:px|rem|em)?))?\s+([\w\s,'"-]+)$/):null
 if(cssFont){t.fontWeight??=cssFont[1];t.fontSize??=cssFont[2];t.lineHeight??=cssFont[3];t.fontFamily??=cssFont[4]}
 t.fontSize??=values.fontSize as string;t.fontWeight??=values.fontWeight as string;t.lineHeight??=values.lineHeight as string;t.letterSpacing??=values.letterSpacing as string;t.fontFamily??=values.fontFamily as string
 const s:ResolvedComponentStyle={backgroundColor:color(values.backgroundColor??values.bg),color:color(values.textColor??values.fg??values.color),borderRadius:lengths(resolve(values.rounded??values.borderRadius??values.radius)),padding:lengths(resolve(values.padding)),paddingBlock:lengths(resolve(values.paddingBlock)),paddingInline:lengths(resolve(values.paddingInline)),height:len(values.height??values.size),width:len(values.width??values.size),minHeight:len(values.minHeight),maxHeight:len(values.maxHeight),minWidth:len(values.minWidth),maxWidth:len(values.maxWidth),fontSize:len(t.fontSize??typography.size),letterSpacing:len(t.letterSpacing??typography.tracking)}
 if(typeof (t.fontFamily??t.declaredFamily)==='string'&&/^[\w\s,'"-]+$/.test(String(t.fontFamily??t.declaredFamily)))s.fontFamily=resolveBrandFont(t).stack
 if(/^(none|uppercase|lowercase|capitalize)$/.test(String(t.textTransform)))s.textTransform=t.textTransform as CSSProperties['textTransform']
 const weight=t.fontWeight??typography.weight
 if(/^(?:[1-9]\d{0,2}|1000|normal|bold)$/.test(String(weight)))s.fontWeight=weight as CSSProperties['fontWeight']
 const leading=String(resolve(t.lineHeight)??'')
 if(/^\d+(?:\.\d+)?$/.test(leading))s.lineHeight=Number(leading)
 else if(safeLength(leading))s.lineHeight=s.fontSize?.toString().endsWith('px')&&leading.endsWith('px')?parseFloat(leading)/parseFloat(String(s.fontSize)):safeLength(leading)
 const border=typeof values.border==='string'?values.border.trim():''
 const b=border.match(/^(\d+(?:\.\d+)?(?:px|rem|em)?)[ ]+(solid|dashed|dotted|double|ridge|groove|inset|outset)[ ]+(.+)$/)
 // OmD edge-width notation, e.g. "0 0 1px #e6e6e6".
 const edges=border.match(/^([\d.pxrem\s]+)\s+(#[\da-f]{3,8})$/i)
 if(b&&color(b[3])){s.borderWidth=len(b[1]);s.borderStyle=b[2] as CSSProperties['borderStyle'];s.borderColor=color(b[3])}
 else if(edges&&lengths(edges[1])){s.borderWidth=lengths(edges[1]);s.borderStyle='solid';s.borderColor=color(edges[2])}
 else if(/^(none|0|0px)$/.test(border)){s.borderWidth=0;s.borderStyle='none'}
 if(color(values.borderColor)){s.borderColor=color(values.borderColor);s.borderWidth??='1px';s.borderStyle??='solid'}
 if(len(values.borderWidth))s.borderWidth=len(values.borderWidth)
 if(/^(none|solid|dashed|dotted|double|ridge|groove|inset|outset)$/.test(String(values.borderStyle)))s.borderStyle=values.borderStyle as CSSProperties['borderStyle']
 s.boxShadow=safeShadow(resolve(values.boxShadow??values.shadow))
 if(typeof values.opacity==='number'&&Number.isFinite(values.opacity))s.opacity=Math.max(0,Math.min(1,values.opacity))
 return Object.fromEntries(Object.entries(s).filter(([,v])=>v!==undefined)) as ResolvedComponentStyle
}

/** Display projection only: original metrics remain in the source/evidence. */
export function projectComponentStyle(source:ResolvedComponentStyle,composition=false):CSSProperties {
 const cap=(v:unknown,max:number)=>typeof v==='string'&&safeLength(v)?`min(${v}, ${max}px)`:v
 const out:CSSProperties={...source,maxWidth:'100%'}
 for(const key of ['padding','paddingBlock','paddingInline'] as const)if(typeof source[key]==='string')out[key]=String(source[key]).split(' ').map(v=>cap(v,composition?32:24)).join(' ')
 if(source.fontSize)out.fontSize=composition?`clamp(12px, ${source.fontSize}, 40px)`:`min(${source.fontSize}, 24px)`
 if(source.height){out.height=undefined;out.minHeight=cap(source.height,composition?180:64) as string}
 if(source.width)out.width=cap(source.width,composition?640:240) as string
 return out
}
