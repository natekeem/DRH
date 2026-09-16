import type { CSSProperties } from 'react'
import { resolveComponentStyle } from './brandComponentStyle'
import type { BrandDesignSpec, BrandTypeRole, OfficialBrandResource } from '../brandDesignSpec'
import type { VendorEntry } from '../data/awesomeDesignMd'
import resourceRegistry from '../data/brandOfficialResources.json'
import { motionEvidence, responsiveEvidence, resolveBrandFont, sourceLines } from './brandPresentation'

export type ComponentKind = 'buttons'|'inputs'|'cards'|'badges'|'tabs'|'dialogs'|'tables'|'navigation'|'hero'|'section'|'cta-band'|'pricing'|'media'|'code'|'status'|'icon'|'footer'|'legal'|'content-surface'|'other'
export type CatalogComponent = { key:string; kind:ComponentKind; values:Record<string,unknown> }
export type BrandCatalogSection = { type:'overview'|'official-resources'|'colors'|'typography'|'components'|'geometry'|'elevation'|'motion'|'responsive'|'layout'|'source'; id:string; label:string; count?:number; kind?:ComponentKind }
export type BrandTheme = {id:'light'|'dark';label:string;colors:{canvas:string;surface:string;text:string;muted:string;border:string};evidence:string[]}
export type BrandCatalog = {entry:VendorEntry;spec:BrandDesignSpec;dna:{label:string;evidence:string}[];colors:[string,string][];roles:[string,BrandTypeRole][];components:CatalogComponent[];sections:BrandCatalogSection[];themes:BrandTheme[];officialResources:OfficialBrandResource[]}
export const componentLabels:Record<ComponentKind,string>={buttons:'Buttons · 버튼',cards:'Cards · 카드',inputs:'Forms · 입력',badges:'Badges · 배지',tabs:'Tabs · 탭',dialogs:'Dialogs · 대화상자',tables:'Tables · 표',navigation:'Navigation · 탐색',hero:'Hero · 주요 메시지',section:'Sections · 콘텐츠 영역','cta-band':'CTA · 다음 행동',pricing:'Pricing · 요금',media:'Media · 미디어',code:'Code · 코드',status:'Status · 상태',icon:'Assets · 형태',footer:'Footer · 하단',legal:'Legal · 안내','content-surface':'Content · 목록과 표면',other:'분류되지 않은 원본 정의'}
export const scalar=(v:unknown,fallback='')=>typeof v==='string'||typeof v==='number'?String(v):fallback
export const numeric=(v:unknown,fallback=0)=>Number.isFinite(parseFloat(String(v)))?parseFloat(String(v)):fallback
export const length=(v:unknown)=>typeof v==='number'?v+'px':scalar(v)||undefined
export function isDark(color:string){const c=color.replace('#','');return c.length===6&&parseInt(c.slice(0,2),16)*.299+parseInt(c.slice(2,4),16)*.587+parseInt(c.slice(4,6),16)*.114<128}
export function componentKind(key:string,values:Record<string,unknown>={}):ComponentKind{
 const explicit:Record<string,ComponentKind>={button:'buttons',input:'inputs',toggle:'inputs',card:'cards',badge:'badges',tab:'tabs',tabs:'tabs',dialog:'dialogs',table:'tables',navigation:'navigation',hero:'hero',section:'section',pricing:'pricing',media:'media',code:'code',status:'status',icon:'icon',footer:'footer',legal:'legal','cta-band':'cta-band','content-surface':'content-surface'}
 if(explicit[String(values.type)])return explicit[String(values.type)]
 if(values.type==='listItem')return /header|menu|nav/.test(key)?'navigation':'content-surface'
 const semantic=String(values.semantic??values.role??values.use??'').toLowerCase()
 if(explicit[semantic])return explicit[semantic]
 // A component noun takes precedence over its placement (e.g. button-store-hero).
 if(/^button(?:-|$)/.test(key))return 'buttons'
 if(/hero/.test(key))return 'hero'
 if(/pricing|tier/.test(key))return 'pricing'
 if(/cta-band/.test(key))return 'cta-band'
 if(/legal/.test(key))return 'legal'
 if(/footer/.test(key))return 'footer'
 if(/asset-icon|logo-strip|^icon$/.test(key))return 'icon'
 if(/code-editor|terminal|code-block/.test(key))return 'code'
 if(/toast|status/.test(key))return 'status'
 if(/media|cover|player|image|video/.test(key)&&!/button|control/.test(key))return 'media'
 if(/section|band|mesh/.test(key))return 'section'
 if(/app-shell-row/.test(key))return 'navigation'
 if(/auth-form-card|form-panel/.test(key))return 'cards'

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
 const colors=Object.entries(spec.colors),roles=Object.entries(spec.typography),components=Object.entries(spec.components).map(([key,values])=>({key,values,kind:componentKind(key,values)}))
 const dna:{label:string;evidence:string}[]=[]
 for(const [pattern,label]of [[/photography|photograph|photo-first/i,'Photography-led'],[/dense|technical|compact/i,'Dense'],[/generous|spacious|whitespace|white space/i,'Spacious'],[/minimal|subtraction|recedes|restraint/i,'Minimal'],[/bevel|Y2K|retro/i,'Retro'],[/editorial/i,'Editorial'],[/pastel/i,'Pastel surfaces'],[/dark|near-black/i,'Dark surfaces'],[/marketplace/i,'Marketplace'],[/product|workspace/i,'Product-first']] as [RegExp,string][]){const found=spec.traits.match(pattern);if(found)dna.push({label,evidence:found[0]})}
 if(dna.length<2){if(!dna.some(d=>d.label.toLowerCase()===spec.layout))dna.push({label:spec.layout.charAt(0).toUpperCase()+spec.layout.slice(1),evidence:'Source-trait composition'});const radius=Object.values(spec.radius).find(v=>numeric(v)>0);if(radius)dna.push({label:'Rounded geometry',evidence:'radius: '+radius})}
 const c=spec.colors,base=entry.tokens.colors,id=isDark(base.canvas)?'dark':'light'
 const themes:BrandTheme[]=[{id,label:id==='dark'?'Dark':'Light',colors:{canvas:base.canvas,surface:base.surface,text:base.text,muted:c['ink-muted']||c.muted||c['corporate-muted']||base.text,border:base.border==='currentColor'?(c.divider||c['corporate-border']||'transparent'):base.border},evidence:['normalized source palette']}]
 // Only explicit complementary canvas AND readable ink roles establish another theme.
 const alternate=id==='dark'?'light':'dark'
 const canvas=c['canvas-'+alternate]||c['inverse-canvas']
 const ink=c[alternate==='light'?'body-on-light':'body-on-dark']||c['inverse-ink']||c['on-'+alternate]
 if(canvas&&ink&&canvas!==base.canvas&&isDark(canvas)===(alternate==='dark')&&isDark(ink)!==isDark(canvas))themes.push({id:alternate,label:alternate==='dark'?'Dark':'Light',colors:{canvas,surface:c[alternate==='light'?'surface-soft-light':'surface-card-dark']||c['inverse-surface-1']||canvas,text:ink,muted:ink,border:c['hairline-on-'+alternate]||c['hairline-'+alternate]||c['inverse-hairline']||ink},evidence:Object.entries(c).filter(([,v])=>v===canvas||v===ink).map(([k])=>'colors.'+k)})
 const officialResources=(resourceRegistry as Record<string,OfficialBrandResource[]>)[entry.slug]||[]
 const sections:BrandCatalogSection[]=[]
 if(officialResources.length)sections.push({type:'official-resources',id:'official',label:'Official Resources · 공식 가이드',count:officialResources.length})
 sections.push({type:'overview',id:'overview',label:'Overview · 브랜드 특징'})
 if(colors.length)sections.push({type:'colors',id:'colors',label:'Colors',count:colors.length})
 if(roles.length)sections.push({type:'typography',id:'typography',label:'Typography',count:roles.length})
 for(const kind of Object.keys(componentLabels) as ComponentKind[]){const count=components.filter(c=>c.kind===kind).length;if(count)sections.push({type:'components',id:kind,label:componentLabels[kind],kind,count})}
 if(Object.keys(spec.spacing).length||Object.keys(spec.radius).length)sections.push({type:'geometry',id:'geometry',label:'Spacing & Radius · 간격과 모서리'})
 if(sourceLines(spec.depth).length||sourceLines(spec.border).length)sections.push({type:'elevation',id:'elevation',label:'Elevation · 깊이와 경계'})
 if(motionEvidence(spec).state!=='not-specified')sections.push({type:'motion',id:'motion',label:'Motion · 움직임'})
 if(sourceLines(responsiveEvidence(spec)).length)sections.push({type:'responsive',id:'responsive',label:'Responsive · 반응형'})
 sections.push({type:'layout',id:'layout',label:'Layout DNA'},{type:'source',id:'source',label:'Source notes'})
 return {entry,spec,dna:dna.slice(0,4),colors,roles,components,sections,themes,officialResources}
}
export function typeStyle(role:Partial<BrandTypeRole>):CSSProperties{
 const size=numeric(role.fontSize,16),leading=scalar(role.lineHeight)
 return {fontFamily:resolveBrandFont(role).stack,fontSize:length(role.fontSize),fontWeight:role.fontWeight as CSSProperties['fontWeight'],lineHeight:leading.endsWith('px')?numeric(leading)/size:leading||undefined,letterSpacing:length(role.letterSpacing),textTransform:role.textTransform as CSSProperties['textTransform']}
}
export function componentStyle(values:Record<string,unknown>,catalog:BrandCatalog,theme:BrandTheme):CSSProperties{
 return resolveComponentStyle(values,catalog,theme)
}
