// Core-v2-style token envelope adapter. Raw documents and verification claims stay intact.
export function adaptOhMyDesign(p,raw='') {
 if (!p.omd || !p.tokens) return p
 const t=p.tokens, families=t.typography?.family||{}
 const px=v=>typeof v==='number'?v+'px':v
 const typography={}
 for(const [key,v] of Object.entries(t.typography||{})) {
  if(key==='family'||!v||typeof v!=='object')continue
  // Multiple surface families are not interchangeable. Only a single declared
  // family, an explicit role prefix, or explicit role-use evidence resolves one.
  const candidates=Object.entries(families).filter(([scope,family])=>key.startsWith(scope+'-')||key===scope||String(v.use||'').includes(family))
  const values=[...new Set(Object.values(families))]
  const family=v.fontFamily||(candidates.length===1?candidates[0][1]:values.length===1?values[0]:null)
  typography[key]={...v,script:p.country==='KR'?'ko':undefined,fontFamily:family==='System'?'system-ui':family,fontSize:px(v.size),fontWeight:v.weight,lineHeight:v.lineHeight,letterSpacing:px(v.tracking)}
 }
 const components=Object.fromEntries(Object.entries(t.components||{}).map(([key,v])=>[key,{...v,backgroundColor:v.bg,textColor:v.fg,rounded:px(v.radius)}]))
 return {...p,description:p.description||raw.match(/##[^\n]*Visual Theme[^\n]*\n([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim()||t.note||'',colors:t.colors||{},typography,components,spacing:Object.fromEntries(Object.entries(t.spacing||{}).map(([k,v])=>[k,px(v)])),rounded:Object.fromEntries(Object.entries(t.rounded||{}).map(([k,v])=>[k,px(v)]))}
}
