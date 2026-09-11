import { useEffect, useState, type CSSProperties } from 'react'
import type { VendorEntry } from '../../data/awesomeDesignMd'
import type { BrandDesignSpec, BrandTypeRole } from '../../brandDesignSpec'
import './vendorDesignPreview.css'

const scalar = (v: unknown, fallback: string) => typeof v === 'string' || typeof v === 'number' ? String(v) : fallback
const px = (v: unknown, fallback: number) => Number.isFinite(parseFloat(String(v))) ? parseFloat(String(v)) : fallback
const cssLength = (v: unknown, fallback: string) => typeof v === 'number' ? v + 'px' : scalar(v, fallback)
const typeStyle = (r: BrandTypeRole): CSSProperties => ({fontFamily:r.renderFallback,fontSize:cssLength(r.fontSize,'16px'),fontWeight:scalar(r.fontWeight,'400') as CSSProperties['fontWeight'],lineHeight:scalar(r.lineHeight,'1.4'),letterSpacing:cssLength(r.letterSpacing,'normal'),textTransform:scalar(r.textTransform,'none') as CSSProperties['textTransform']})
const labels: Record<string,string> = {gallery:'Space for possibility.',cinematic:'Beyond the ordinary.',marketplace:'Find your next place.',utility:'Your daily overview.',editorial:'A fresh perspective.',retro:'PLAY / EXPLORE',product:'Ideas into action.',developer:'Build. Preview. Ship.',media:'Made for your day.'}

export function VendorDesignPreview({entry, detail=false}:{entry:VendorEntry;detail?:boolean}) {
 const [loaded,setLoaded]=useState<{slug:string;spec:BrandDesignSpec}|null>(null)
 const [loadError,setLoadError]=useState(false)
 const [selected,setSelected]=useState(false)
 const [query,setQuery]=useState('')
 useEffect(()=>{
  setSelected(false);setQuery('');setLoadError(false)
  if(!detail)return
  const controller=new AbortController()
  fetch(import.meta.env.BASE_URL+'brand-design-specs/'+entry.slug+'.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Spec unavailable');return r.json()}).then(spec=>setLoaded({slug:entry.slug,spec})).catch(e=>{if(e.name!=='AbortError')setLoadError(true)})
  return ()=>controller.abort()
 },[entry.slug,detail])
 // Keep composition selection identical in Card and Detail; full evidence is lazy.
 const s=entry.spec,t=entry.tokens
 const full=loaded?.slug===entry.slug&&detail?loaded.spec:s
 const roles=Object.entries(s.typography),display=roles.find(([k])=>/hero-display|display-mega|^display$|hero-title|section-title/.test(k))?.[1]||roles.find(([k])=>/display|headline/.test(k))?.[1]||roles[0]?.[1]
 const components=Object.entries(s.components)
 const primary=components.find(([k])=>k==='button-primary'||k==='primary-cta')?.[1]||components.find(([k])=>/primary|dark-pill/.test(k))?.[1]||{}
 const card=components.find(([k])=>/feature-card-photo|property-card|card-base|promo-card|pricing-card/.test(k))?.[1]||components.find(([k])=>/card/.test(k))?.[1]||{}
 const search=components.find(([k])=>/search-bar|search-pill/.test(k))?.[1]||{}
 const action=scalar(primary.backgroundColor,t.colors.primary)
 const actionText=scalar(primary.textColor,action===t.colors.primary?t.colors.onPrimary:t.colors.text)
 const buttonType=primary.typography as BrandTypeRole|undefined
 const colorEntries=Object.entries(s.colors)
 const blocks=colorEntries.filter(([k])=>/^block-|^card-tint-/.test(k))
 const panels=components.filter(([k,v])=>/card/.test(k)&&v.backgroundColor&&v.backgroundColor!==t.colors.canvas).slice(0,detail?4:2)
 const gradientColors=colorEntries.filter(([k])=>/ruby|magenta|lemon|cyan|gradient/.test(k)).slice(0,3)
 const gradient=/gradient mesh|mesh gradient/i.test(s.traits)&&gradientColors.length>1?'linear-gradient(120deg,'+gradientColors.map(([,v])=>v).join(',')+')':undefined
 const vars={
  '--brand-canvas':t.colors.canvas,'--brand-ink':t.colors.text,'--brand-surface':scalar(card.backgroundColor,t.colors.surface),
  '--brand-border':t.colors.border,'--brand-accent':t.colors.primary,'--brand-action':action,'--brand-action-text':actionText,
  '--brand-family':display?.renderFallback||t.typography.display,'--brand-headline':cssLength(display?.fontSize,t.typography.displaySize+'px'),
  '--brand-weight':scalar(display?.fontWeight,'500'),'--brand-tracking':cssLength(display?.letterSpacing,'normal'),
  '--brand-leading':typeof display?.lineHeight==='string'&&display.lineHeight.endsWith('px')?String(px(display.lineHeight,0)/px(display.fontSize,16)):scalar(display?.lineHeight,'1.1'),'--brand-case':scalar(display?.textTransform,'none'),
  '--brand-radius':cssLength(card.rounded,t.radius+'px'),'--brand-button-radius':cssLength(primary.rounded,t.radius+'px'),
  '--brand-button-weight':scalar(buttonType?.fontWeight,'500'),'--brand-button-tracking':cssLength(buttonType?.letterSpacing,'normal'),
  '--brand-button-height':cssLength(primary.height,'44px'),'--brand-space':Math.max(14,Math.min(32,t.spacing.find(n=>n>=24)||t.spacing[t.spacing.length-1]||16))+'px',
  '--brand-shadow':scalar(card.boxShadow,'none'),'--brand-surface-border':scalar(card.border,t.borderWidth+'px solid '+t.colors.border),
 } as CSSProperties
 const swatches=<div className="brand-mini-swatches" aria-label="Source palette">{colorEntries.slice(0,6).map(([k,v])=><i key={k} title={k+': '+v} style={{background:v}}/>)}</div>
 const mediaSpace=(key:string)=><div className="brand-image-space" key={key}><span>IMAGE AREA</span><i/><small>이미지 미포함</small></div>
 const surfaceLabels=components.filter(([k])=>/card|panel|tile/.test(k)).slice(0,detail?4:2).map(([k])=>k)
 if(!surfaceLabels.length)surfaceLabels.push('Surface','Content')
 const layout=s.layout
 return <div className={'brand-specimen brand-'+(detail?'detail':'card')+' brand-layout-'+layout} style={vars} data-brand={entry.slug} data-layout={layout}>
  <div className="brand-composition">
   <div className="brand-identifier"><span>{s.brandAsset.type==='text-wordmark'?<b>{s.brandAsset.label}</b>:<><img src={s.brandAsset.src} alt="" loading="lazy"/><b>{s.brandAsset.label}</b></>}</span><small>{entry.category}</small></div>
   <h3>{labels[layout]||labels.product}</h3>
   {layout==='gallery'&&<div className="brand-gallery">{mediaSpace('hero')}{detail&&mediaSpace('secondary')}</div>}
   {layout==='cinematic'&&mediaSpace('cinema')}
   {layout==='marketplace'&&<><div className="brand-search" style={{borderRadius:cssLength(search.rounded,'999px')}}>{detail?<input aria-label="스페시먼 검색" placeholder="어디를 둘러볼까요?" value={query} onChange={e=>setQuery(e.target.value)}/>:<span>어디를 둘러볼까요?</span>}<i>⌕</i></div>{detail&&<div className="brand-gallery">{mediaSpace('one')}{mediaSpace('two')}</div>}{query&&<p role="status">“{query}” · 검색 입력 예시</p>}</>}
   {layout==='utility'&&<div className="brand-utility">{['Overview','Activity','Balance'].map((v,i)=><div key={v}><small>{v}</small><b>{['12.80','+4.2%','1,280'][i]}</b><i/></div>)}</div>}
   {layout==='product'&&<div className={'brand-product '+(blocks.length?'brand-product-tiles':'')}>{(blocks.length?blocks.slice(0,detail?4:2).map(([k])=>k):surfaceLabels).map((v,i)=><div key={v} style={blocks.length?{background:blocks[i][1],color:t.colors.text}:undefined}><i/><span title={v}>{['Plan your next step','Bring ideas together','Shape the details','Ready to share'][i]}</span><small>↗</small></div>)}</div>}
   {layout==='developer'&&<div className="brand-developer"><span>$ preview --local</span><b>✓ Build ready</b><span>index → preview → deploy</span></div>}
   {layout==='editorial'&&<div className="brand-editorial" style={{background:blocks[0]?.[1]||gradient||scalar(panels[0]?.[1].backgroundColor,t.colors.surface),color:blocks.length||gradient?t.colors.text:scalar(panels[0]?.[1].textColor,t.colors.text)}}><small>DESIGN NOTES / 01</small><b>Form meets story.</b>{detail&&<span>색상과 여백으로 만드는 새로운 관점.</span>}</div>}
   {layout==='retro'&&<div className="brand-retro-panel"><span>START / SELECT</span><b>NEW WORLDS</b><div>{colorEntries.slice(0,5).map(([k,v])=><i key={k} style={{background:v}}/>)}</div></div>}
   {layout==='media'&&<div className="brand-media">{['01','02','03'].map(v=><div key={v}>{mediaSpace(v)}<span>Collection {v}</span></div>)}</div>}
   <div className="brand-controls">{detail?<><button aria-pressed={selected} onClick={()=>setSelected(v=>!v)}>{selected?'선택됨 ✓':'Primary →'}</button><button className="brand-secondary" onClick={()=>setSelected(false)}>Secondary</button></>:<span className="brand-cta">{layout==='media'?'▶ Play':'자세히 보기 →'}</span>}{swatches}</div>
  </div>
  {detail&&<div className="brand-detail-modules">
   <p className="brand-disclosure">DESIGN.md 분석 기반 DRH 스페시먼 · 예시 문구와 데이터 · 공식 사이트가 아닙니다. 사진과 전용 폰트는 포함하지 않습니다.</p>
   {loadError&&<p role="status">상세 spec을 불러오지 못했습니다. Browse 요약을 표시합니다.</p>}
   <section className="brand-type-provenance"><h4>Typography</h4><p>Declared: {display?.declaredFamily||'미지정'}<br/>Rendered with: {display?.renderFallback||'system-ui'} (system fallback)</p><div className="brand-hierarchy">{Object.entries(full.typography).map(([k,r])=><div key={k}><small>{k} · {scalar(r.fontSize,'—')} / {scalar(r.fontWeight,'—')} / {scalar(r.letterSpacing,'normal')}</small><span style={{...typeStyle(r),'--role-size':cssLength(r.fontSize,'16px')} as CSSProperties}>Aa — Design</span></div>)}</div></section>
   <section><h4>Palette</h4><div className="brand-palette">{colorEntries.map(([k,v])=><div key={k}><i style={{background:v}}/><span>{k}<code>{v}</code></span></div>)}</div></section>
   <section><h4>Spacing / Radius</h4><div className="brand-scales">{[s.spacing,s.radius].map((scale,i)=><div key={i}>{Object.entries(scale).map(([k,v])=><span key={k}><i style={i?{width:28,height:28,borderRadius:cssLength(v,'0px')}:{height:6,width:Math.min(px(v,0),240)}}/>{k}<code>{v}</code></span>)}</div>)}</div></section>
   <section><h4>Components / Source evidence</h4>{Object.entries(full.components).map(([k,v])=><details key={k}><summary>{k}</summary><pre>{JSON.stringify(v,null,2)}</pre></details>)}<details><summary>Layout / depth / source traits</summary><p>{s.traits}</p><pre>{JSON.stringify(full.depth,null,2)}</pre></details></section>
  </div>}
 </div>
}
