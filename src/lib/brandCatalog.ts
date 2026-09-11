import type { CSSProperties } from 'react'
import type { BrandDesignSpec, BrandTypeRole, OfficialBrandResource } from '../brandDesignSpec'
import type { VendorEntry } from '../data/awesomeDesignMd'
import resourceRegistry from '../data/brandOfficialResources.json'

export type ComponentKind = 'buttons'|'inputs'|'cards'|'badges'|'tabs'|'dialogs'|'tables'|'navigation'|'other'
export type CatalogComponent = { key:string; kind:ComponentKind; values:Record<string,unknown> }
export type BrandCatalogSection = { type:'overview'|'official-resources'|'colors'|'typography'|'components'|'geometry'|'layout'|'source'; id:string; label:string; count?:number; kind?:ComponentKind }
export type BrandTheme = {id:'light'|'dark';label:string;colors:{canvas:string;surface:string;text:string;muted:string;border:string};evidence:string[]}
export type BrandCatalog = {entry:VendorEntry;spec:BrandDesignSpec;dna:{label:string;evidence:string}[];colors:[string,string][];roles:[string,BrandTypeRole][];components:CatalogComponent[];sections:BrandCatalogSection[];themes:BrandTheme[];officialResources:OfficialBrandResource[]}
export const componentLabels:Record<ComponentKind,string>={buttons:'Buttons',inputs:'Inputs & Forms',cards:'Cards & Surfaces',badges:'Badges',tabs:'Tabs',dialogs:'Dialogs',tables:'Tables & Rows',navigation:'Navigation',other:'Additional definitions'}
export const scalar=(v:unknown,fallback='')=>typeof v==='string'||typeof v==='number'?String(v):fallback
export const numeric=(v:unknown,fallback=0)=>Number.isFinite(parseFloat(String(v)))?parseFloat(String(v)):fallback
export const length=(v:unknown)=>typeof v==='number'?v+'px':scalar(v)||undefined
export function isDark(color:string){const c=color.replace('#','');return c.length===6&&parseInt(c.slice(0,2),16)*.299+parseInt(c.slice(2,4),16)*.587+parseInt(c.slice(4,6),16)*.114<128}
export function componentKind(key:string):ComponentKind{
 if(/modal|dialog|drawer/.test(key))return 'dialogs'
 if(/table|(?:^|-)row|(?:^|-)cell/.test(key))return 'tables'
 if(/tab/.test(key))return 'tabs'
 if(/input|search|select-dropdown|radio|checkbox|form-panel|auth-form/.test(key))return 'inputs'
 if(/badge|tag|chip|toast/.test(key))return 'badges'
 if(/button|(?:^|-)cta$|^(dark|light|outlined).*pill$|circular-play/.test(key))return 'buttons'
 if(/card|tile|panel|info-box/.test(key))return 'cards'
 if(/nav|footer|link/.test(key))return 'navigation'
 return 'other'
}
export function buildBrandCatalog(entry:VendorEntry,spec:BrandDesignSpec=entry.spec):BrandCatalog{
 const colors=Object.entries(spec.colors),roles=Object.entries(spec.typography),components=Object.entries(spec.components).map(([key,values])=>({key,values,kind:componentKind(key)}))
 const dna:{label:string;evidence:string}[]=[]
 for(const [pattern,label]of [[/photography|photograph|photo-first/i,'Photography-led'],[/dense|technical|compact/i,'Dense'],[/generous|spacious|whitespace|white space/i,'Spacious'],[/minimal|subtraction|recedes|restraint/i,'Minimal'],[/bevel|Y2K|retro/i,'Retro'],[/editorial/i,'Editorial'],[/pastel/i,'Pastel surfaces'],[/dark|near-black/i,'Dark surfaces'],[/marketplace/i,'Marketplace'],[/product|workspace/i,'Product-first']] as [RegExp,string][]){const found=spec.traits.match(pattern);if(found)dna.push({label,evidence:found[0]})}
 if(dna.length<2){if(!dna.some(d=>d.label.toLowerCase()===spec.layout))dna.push({label:spec.layout.charAt(0).toUpperCase()+spec.layout.slice(1),evidence:'Source-trait composition'});const radius=Object.values(spec.radius).find(v=>numeric(v)>0);if(radius)dna.push({label:'Rounded geometry',evidence:'radius: '+radius})}
 const c=spec.colors,base=entry.tokens.colors,id=isDark(base.canvas)?'dark':'light'
 const themes:BrandTheme[]=[{id,label:id==='dark'?'Dark':'Light',colors:{canvas:base.canvas,surface:base.surface,text:base.text,muted:c['ink-muted']||c.muted||base.text,border:base.border},evidence:['normalized source palette']}]
 // Only explicit complementary canvas AND readable ink roles establish another theme.
 const alternate=id==='dark'?'light':'dark'
 const canvas=c['canvas-'+alternate]||c['inverse-canvas']
 const ink=c[alternate==='light'?'body-on-light':'body-on-dark']||c['inverse-ink']||c['on-'+alternate]
 if(canvas&&ink&&canvas!==base.canvas&&isDark(canvas)===(alternate==='dark')&&isDark(ink)!==isDark(canvas))themes.push({id:alternate,label:alternate==='dark'?'Dark':'Light',colors:{canvas,surface:c[alternate==='light'?'surface-soft-light':'surface-card-dark']||c['inverse-surface-1']||canvas,text:ink,muted:ink,border:c['hairline-on-'+alternate]||c['hairline-'+alternate]||c['inverse-hairline']||ink},evidence:Object.entries(c).filter(([,v])=>v===canvas||v===ink).map(([k])=>'colors.'+k)})
 const officialResources=(resourceRegistry as Record<string,OfficialBrandResource[]>)[entry.slug]||[]
 const sections:BrandCatalogSection[]=[{type:'overview',id:'overview',label:'Overview'},{type:'official-resources',id:'official',label:'Official Resources',count:officialResources.length}]
 if(colors.length)sections.push({type:'colors',id:'colors',label:'Colors',count:colors.length})
 if(roles.length)sections.push({type:'typography',id:'typography',label:'Typography',count:roles.length})
 for(const kind of Object.keys(componentLabels) as ComponentKind[]){const count=components.filter(c=>c.kind===kind).length;if(count)sections.push({type:'components',id:kind,label:componentLabels[kind],kind,count})}
 if(Object.keys(spec.spacing).length||Object.keys(spec.radius).length||spec.border||spec.depth)sections.push({type:'geometry',id:'geometry',label:'Spacing / Radius / Depth'})
 sections.push({type:'layout',id:'layout',label:'Layout DNA'},{type:'source',id:'source',label:'Source notes'})
 return {entry,spec,dna:dna.slice(0,4),colors,roles,components,sections,themes,officialResources}
}
export function typeStyle(role:Partial<BrandTypeRole>):CSSProperties{
 const size=numeric(role.fontSize,16),leading=scalar(role.lineHeight)
 return {fontFamily:role.renderFallback||(/mono/i.test(scalar(role.fontFamily))?'monospace':/serif/i.test(scalar(role.fontFamily))&&!/sans/i.test(scalar(role.fontFamily))?'serif':'system-ui, sans-serif'),fontSize:length(role.fontSize),fontWeight:role.fontWeight as CSSProperties['fontWeight'],lineHeight:leading.endsWith('px')?numeric(leading)/size:leading||undefined,letterSpacing:length(role.letterSpacing),textTransform:role.textTransform as CSSProperties['textTransform']}
}
export function componentStyle(values:Record<string,unknown>,catalog:BrandCatalog,theme:BrandTheme):CSSProperties{
 const base=catalog.themes[0].colors
 const color=(value:unknown)=>{const s=scalar(value);if(!s)return undefined;for(const key of ['canvas','surface','text','border'] as const){if(s.toLowerCase()===base[key].toLowerCase())return theme.colors[key]}return s}
 const typography:Partial<BrandTypeRole>=typeof values.typography==='object'&&values.typography?values.typography as BrandTypeRole:{}
 // Explicit source CSS properties only; layout bounds belong to the catalog stylesheet.
 return {...typeStyle(typography),background:color(values.backgroundColor),color:color(values.textColor),borderRadius:length(values.rounded??values.borderRadius),border:scalar(values.border)||undefined,boxShadow:scalar(values.boxShadow??values.shadow)||undefined,padding:length(values.padding),height:length(values.height),fontSize:length(typography.fontSize),opacity:values.opacity===undefined?undefined:numeric(values.opacity,1)}
}
