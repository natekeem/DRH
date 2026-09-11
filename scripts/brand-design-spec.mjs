import {parse} from 'yaml'
const number=v=>Number.isFinite(parseFloat(v))?parseFloat(v):null

// Theme-role selection uses the source palette, without rewriting source colors.
export function contrastRatio(foreground, background) {
 const rgb=value=>{
  if(!value)return null
  if(/^#[\da-f]{3}$/i.test(value))value='#'+[...value.slice(1)].map(c=>c+c).join('')
  if(/^#[\da-f]{6}$/i.test(value))return [1,3,5].map(i=>parseInt(value.slice(i,i+2),16))
  if(/^rgba?\(/i.test(value))return value.match(/[\d.]+/g).map(Number)
  return null
 }
 const bg=rgb(background),fg=rgb(foreground)
 if(!bg||!fg)return null
 const luminance=channels=>channels.slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0)
 const alpha=fg[3]??1,l1=luminance(fg.map((n,i)=>n*alpha+bg[i]*(1-alpha))),l2=luminance(bg)
 return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)
}
export function parseYamlFrontmatter(raw){
 raw=raw.replace(/\r\n/g,'\n')
 const m=raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
 if(m){const p=parse(m[1].replace(/^(description|属于): (.+)$/gm,(_,k,v)=>k+': '+(v.includes(': ')&&!/^[\"']/.test(v)?JSON.stringify(v):v)));p.description ||= p['属于'];return p}
 return parseMarkdown(raw)
}

// Markdown-only vendors use prose, role tables and component descriptions.
// Keep the original cells and evidence; only promote explicit CSS values.
function parseMarkdown(raw) {
 const lines=raw.split(/\r?\n/)
 const p={name:raw.match(/^# (?:Design System Inspired by )?(.+)/)?.[1]||'Unknown',description:lines.find(l=>l&&!/^[#|*-]/.test(l))||'',colors:{},typography:{},rounded:{},spacing:{},components:{},format:'markdown',evidence:{}}
 const clean=v=>v.replace(/[*`]/g,'').trim()
 const key=v=>clean(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
 const colorLines=[...raw.matchAll(/^- \*\*([^*]+)\*\*[^\n]*?(#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?)\([^\n)]+\))[^\n]*/gm)]
 for(const m of colorLines)p.colors[key(m[1])]=m[2]
 const roles={primary:[/primary (?:brand|CTA)|brand accent|signature.*accent|main brand signal|dark button backgrounds/i],canvas:[/page background|dominant background|deepest background|default dark surface|primary background|primary page background|page canvas|default body background|primary surface/i],ink:[/primary (?:heading|text)|headlines and display text|headline text/i],body:[/body text.*default|default paragraph/i,/primary text/i],surface:[/alternate surface|secondary card background|cards, containers/i],hairline:[/light borders|button borders/i]}
 for(const [role,patterns] of Object.entries(roles))for(const re of patterns){const m=colorLines.find(m=>re.test(m[0]));if(m){p.colors[role]=m[2];p.evidence['colors.'+role]=m[0];break}}
 let headers=[],section='',component=null
 const typographySection=raw.match(/##[^\n]*Typography[^\n]*\n([\s\S]*?)(?=\n## |$)/i)?.[1]||''
 const displayFamily=typographySection.match(/\*\*(?:Display|Title)\*\*: `([^`]+)`/)?.[1]
 const bodyFamily=typographySection.match(/\*\*(?:Text\/UI|UI \/ Body|Body)\*\*: `([^`]+)`/)?.[1]
 for(const line of lines){
  if(/^#{2,3} /.test(line)){section=line;headers=[];component=/^### (?:Cards|Inputs)/i.test(line)?key(line.replace(/^### /,'')):null;if(component)p.components[component]={}}
  if(line.startsWith('|')){
   const cells=line.split('|').slice(1,-1).map(clean)
   if(cells.some(c=>/^(Role|Size|Value|Context|Token)$/.test(c))){headers=cells;continue}
   if(cells.every(c=>/^[-:]+$/.test(c)))continue
   const get=h=>cells[headers.findIndex(x=>x.toLowerCase()===h.toLowerCase())]
   if(headers.includes('Role')&&get('Size')?.match(/\d+(?:\.\d+)?px/)){
    const role=key(cells[0]),size=get('Size'),notes=get('Notes')||''
    const family=get('Font')||notes.match(/^([^,]+(?:Display|Text)),/)?.[1]||(/body|button|nav|caption|label/.test(role)?bodyFamily:displayFamily)||null
    p.typography[role]={fontFamily:family,fontSize:size.match(/[\d.]+px/)?.[0],fontWeight:get('Weight')?.match(/\d+/)?.[0]||null,lineHeight:get('Line Height')?.match(/^(?:[\d.]+(?:px)?|normal)/)?.[0]||null,letterSpacing:get('Letter Spacing')?.match(/^(?:-?[\d.]+(?:px|em)?|normal)/)?.[0]||null,sourceCells:cells}
   }
   if(/radius|rounded/i.test(section)&&cells[0]?.match(/^[~≈]?[\d.]+(?:px|%)/))p.rounded[key(cells[1]||cells[0])]=cells[0].replace(/^[~≈]/,'')
   if(/spacing/i.test(section)&&cells.some(c=>/^[\d.]+px$/.test(c))){const value=cells.find(c=>/^[\d.]+px$/.test(c));p.spacing[key(cells[0])]=value}
  }
  if(/spacing/i.test(section)&&/^[-*]/.test(line)&&/base unit|common values|scale|gap|padding/i.test(line))for(const m of line.matchAll(/([\d.]+)px/g))p.spacing['observed-'+m[1]]=m[1]+'px'
  if(/component|button|card/i.test(section)&&/^\*\*[^*]+\*\*/.test(line)){component=key(line.match(/^\*\*([^*]+)\*\*/)[1]);p.components[component]={}}
  if(/radius|rounded/i.test(section)&&/^[-*]/.test(line)){const values=[...line.matchAll(/([\d.]+)px/g)];for(const m of values)p.rounded['observed-'+m[1]]=m[1]+'px'}
  if(component){
   const c=p.components[component]
   const patterns={backgroundColor:/(?:background|bg):?\s*`?(#[\da-f]{6})/i,textColor:/(?:text|color):?\s*`?(#[\da-f]{6})/i,rounded:/(?:radius|borderRadius):?\s*`?([\d.]+(?:px|%))/i,padding:/padding:?\s*`?([\d.]+px(?: [\d.]+px)*)/i,height:/(?:minHeight|height):?\s*`?([\d.]+px)/i}
   for(const [field,re] of Object.entries(patterns)){const m=line.match(re);if(m&&!c[field])c[field]=m[1]}
   for(const [field,re] of Object.entries({border:/^- Border: `([^`]+)`/i,boxShadow:/^- (?:Box Shadow|Shadow): `([^`]+)`/i})){const m=line.match(re);if(m)c[field]=m[1]}
   if(c.rounded&&!Object.values(p.rounded).includes(c.rounded))p.rounded[component]=c.rounded
  }
 }
 const primaryComponent=Object.entries(p.components).find(([name,values])=>/primary/.test(name)&&values.backgroundColor)
 if(!p.colors.primary&&primaryComponent){p.colors.primary=primaryComponent[1].backgroundColor;p.evidence['colors.primary']='Explicit background from component '+primaryComponent[0]}
 return p
}

export const extractColors=p=>Object.fromEntries(Object.entries(p.colors||{}).filter(([,v])=>typeof v==='string'&&/^(?:#[\da-f]{3,8}|(?:rgba?|hsla?)\([^)]*\))$/i.test(v)))
export function brandSpec(p,raw,slug='Unknown'){
 // Normalize derived evidence line endings; never rewrite the source file.
 raw=raw.replace(/\r\n/g,'\n')
 const resolve=v=>{
  if(typeof v!=='string')return v
  const exact=v.match(/^\{([^}]+)\}$/)
  if(exact)return exact[1].split('.').reduce((o,k)=>o?.[k],p)??null
  return v.replace(/\{([^}]+)\}/g,(_,path)=>{const value=path.split('.').reduce((o,k)=>o?.[k],p);return typeof value==='object'?'unknown':value??'unknown'})
 }
 const typography=Object.fromEntries(Object.entries(p.typography||{}).filter(([,v])=>v&&typeof v==='object').map(([k,v])=>[k,{...v,declaredFamily:v.fontFamily??null,renderFallback:/mono|courier/i.test(v.fontFamily||'')?'monospace':(/georgia|times|garamond/i.test(v.fontFamily||'')||/serif/i.test(v.fontFamily||'')&&!/sans-serif/i.test(v.fontFamily||''))?'serif':'system-ui, sans-serif'}]))
 const sections=Object.fromEntries([...raw.matchAll(/^##\s+(.+)\r?\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/gm)].map(m=>[m[1],m[2].trim()]))
 const components=Object.fromEntries(Object.entries(p.components||{}).map(([k,v])=>[k,Object.fromEntries(Object.entries(v||{}).map(([a,b])=>[a,resolve(b)]))]))
 const traits=String(p.description||'')
 const layout=/music player|playlists|podcasts/i.test(traits)?'media':/developer-platform|developer tool|terminal|command.line/i.test(traits)?'developer':/bevel|Y2K|retro|console chrome/i.test(traits)?'retro':/trading|financial-platform|crypto exchange/i.test(traits)?'utility':/marketplace|booking|search-bar|search bar/i.test(traits)?'marketplace':/cinematic editorial|luxury-automotive/i.test(traits)?'cinematic':/photograph|photo-first/i.test(traits)?'gallery':/editorial|news|magazine|productivity/i.test(traits)?'editorial':'product'
 return {colors:extractColors(p),typography,spacing:p.spacing||{},radius:p.rounded||{},border:p.border||p.borders||Object.fromEntries(Object.entries(components).filter(([,v])=>v.border).map(([k,v])=>[k,v.border])),motion:p.motion||{rules:raw.split(/\r?\n/).filter(line=>/transition|duration|easing|cubic-bezier/i.test(line))},depth:p.shadows||p.elevation||Object.fromEntries(Object.entries(sections).filter(([k])=>/depth|elevation/i.test(k))),components,layout,traits,sections,frontmatter:p,brandAsset:{type:'text-wordmark',label:brandName(p,slug)}}
}
export function normalisedTokens(p,raw=''){
 const s=brandSpec(p,''),c=s.colors,dark=!c.canvas&&/dark theme|near-black|dark-first|dark canvas/i.test(s.traits),canvas=c.canvas||(dark?c['canvas-dark']:c['canvas-light'])||'#ffffff',isDark=parseInt(canvas.slice(1,3),16)<100
 const textRoles=(isDark?[c['body-on-dark'],c.ink,c.body,c['on-dark']]:[c.ink,c.body,c.text,c['on-light']]).filter(Boolean)
 const text=textRoles.find(value=>(contrastRatio(value,canvas)??0)>=3)||textRoles[0]||(isDark?'#ffffff':'#111111')
 const roles=Object.entries(s.typography),display=roles.find(([k])=>/hero-display|display-mega|^display$|hero-title|section-title/.test(k))?.[1]||roles.find(([k])=>/display|headline/.test(k))?.[1]||{},body=s.typography.body||roles.find(([k])=>/^body/.test(k))?.[1]||{}
 const spacing=[...new Set(Object.values(s.spacing).map(number).filter(v=>v!==null))].sort((a,b)=>a-b)
 const card=Object.entries(s.components).find(([k])=>/feature-card-photo|property-card|card-base|promo-card|pricing-card/.test(k))?.[1]||Object.entries(s.components).find(([k])=>/card/.test(k))?.[1]||{}
 const border=card.border??p.border?.width??p.borders?.width
 const duration=raw.match(/(?:transition|duration)[^\n]{0,80}?([\d.]+)(ms|s)\b/i)
 const borderWidth=border==='none'?0:number(border)??1
 const durationMs=duration?Number(duration[1])*(duration[2]==='s'?1000:1):0
 return {colors:{canvas,surface:c[isDark?'surface-card-dark':'canvas-soft']||c['canvas-parchment']||c['canvas-elevated']||c['surface-raised']||c.surface||canvas,text,primary:c.primary||'#333333',onPrimary:c['on-primary']||((parseInt((c.primary||'#333333').slice(1,3),16)*.299+parseInt((c.primary||'#333333').slice(3,5),16)*.587+parseInt((c.primary||'#333333').slice(5,7),16)*.114)>150?'#111111':'#ffffff'),border:c[isDark?'hairline-on-dark':'hairline']||c[isDark?'hairline-dark':'hairline-light']||c.hairline||c.border||'currentColor'},typography:{display:display.renderFallback||'system-ui, sans-serif',body:body.renderFallback||'system-ui, sans-serif',displaySize:number(display.fontSize)??48,bodySize:number(body.fontSize)??16,lineHeight:typeof body.lineHeight==='string'&&body.lineHeight.endsWith('px')?(number(body.lineHeight)/(number(body.fontSize)||16)):(number(body.lineHeight)??1.5)},spacing:spacing.length?spacing:[16],radius:number(card.rounded)??number(s.radius.md)??number(s.radius.sm)??number(Object.values(s.radius)[0])??0,borderWidth,duration:durationMs}
}
export function brandName(p,slug){return String(/inspired/i.test(p.name||'')&&slug!=='Unknown'?slug.replace(/(^|[-.])([a-z])/g,(_,sep,c)=>(sep?' ':'')+c.toUpperCase()):(p.name||slug)).replace(/-design-analysis$/i,'').replace(/\s+Analysis$/i,'')}
export function summary(text){text=text.replace(/\*\*|`/g,'');return new Intl.Segmenter('en',{granularity:'sentence'}).segment(text)[Symbol.iterator]().next().value?.segment.trim()||text}

export function compactBrandSpec(full) {
 const {frontmatter, sections, depth, motion, ...compact}=full
 const roles=Object.entries(full.typography), components=Object.entries(full.components)
 const display=roles.find(([key])=>/hero-display|display-mega|^display$|hero-title|section-title/.test(key))??roles.find(([key])=>/display|headline/.test(key))??roles[0]
 const body=roles.find(([key])=>key==='body')??roles.find(([key])=>/^body/.test(key))
 const primary=components.find(([key])=>key==='button-primary')??components.find(([key])=>key==='primary-cta')??components.find(([key])=>/primary|dark-pill/.test(key))
 const surface=components.find(([key])=>/feature-card-photo|property-card|card-base|promo-card|pricing-card/.test(key))??components.find(([key])=>/card/.test(key))
 const search=components.find(([key])=>/search-bar|search-pill/.test(key))
 return {...compact, typography:Object.fromEntries([display,body].filter(Boolean)), components:Object.fromEntries([...new Map([primary,surface,search,...components.filter(([key])=>/nav-bar|top-nav|global-nav|hero-band|card-feature|circular-play|text-input/.test(key)).slice(0,5)].filter(Boolean)).entries()]), depth, motion}
}
