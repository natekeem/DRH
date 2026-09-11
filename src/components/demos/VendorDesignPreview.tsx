import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import type { VendorEntry } from '../../data/awesomeDesignMd'
import type { BrandDesignSpec } from '../../brandDesignSpec'
import { buildBrandCatalog, componentStyle } from '../../lib/brandCatalog'
import { BrandCatalog, catalogStyle } from './BrandCatalog'
import './vendorDesignPreview.css'

function JumpMenu({ sections }: { sections: ReturnType<typeof buildBrandCatalog>['sections'] }) {
  const menu = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) menu.current?.removeAttribute('open') }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])
  return <details className="bc-jump-menu" ref={menu} onKeyDown={e=>{if(e.key==='Escape'){menu.current?.removeAttribute('open');menu.current?.querySelector('summary')?.focus()}}}>
    <summary className="bc-control bc-jump" aria-label="카탈로그 섹션 이동"><span>섹션 이동</span><ChevronDown size={14}/></summary>
    <div className="bc-jump-options" role="group" aria-label="섹션 선택">
      {sections.map(s=><button type="button" key={s.id} onClick={(e)=>{
        const target=e.currentTarget.closest('.bc-root')?.querySelector('[data-section="'+s.id+'"]');
        if (target) {
          const container = target.closest('.bc-root') as HTMLElement;
          const offset = target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 110;
          container.scrollTo({ top: offset, behavior: 'auto' });
        }
        menu.current?.removeAttribute('open');
        menu.current?.querySelector('summary')?.focus();
      }}>{s.label}{s.count?' · '+s.count:''}</button>)}
    </div>
  </details>
}

export function VendorDesignPreview({entry,detail=false}:{entry:VendorEntry;detail?:boolean}){
 const [loaded,setLoaded]=useState<{slug:string;spec:BrandDesignSpec}|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0)
 const [themeId,setThemeId]=useState(''),[expanded,setExpanded]=useState(false)
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),close=useRef<HTMLButtonElement>(null)
 useEffect(()=>{if(!detail)return;setError(false);const controller=new AbortController();fetch(import.meta.env.BASE_URL+'brand-design-specs/'+entry.slug+'.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Spec unavailable');return r.json()}).then(spec=>setLoaded({slug:entry.slug,spec})).catch(e=>{if(e.name!=='AbortError')setError(true)});return()=>controller.abort()},[entry.slug,detail,retry])
 const ready=loaded?.slug===entry.slug
 const catalog=useMemo(()=>buildBrandCatalog(entry,ready&&detail?loaded.spec:entry.spec),[entry,loaded,ready,detail])
 const theme=catalog.themes.find(t=>t.id===themeId)||catalog.themes[0]
 useEffect(()=>{if(!expanded)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.showModal();close.current?.focus();return()=>{document.body.style.overflow=previous;trigger.current?.focus()}},[expanded])
 useEffect(()=>{setExpanded(false);setThemeId('')},[entry.slug])
 const trapFocus=(event:KeyboardEvent<HTMLDialogElement>)=>{
  if(event.key!=='Tab'||(event.target as HTMLElement).closest('dialog')!==event.currentTarget)return
  const elements=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),select,input:not(:disabled),a[href],summary')).filter(el=>el.getClientRects().length&&el.tabIndex>=0)
  const first=elements[0],last=elements[elements.length-1]
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
 }
 const identifier=<span className="bc-identifier">{catalog.spec.brandAsset.type!=='text-wordmark'&&<img src={catalog.spec.brandAsset.src} alt=""/>}<b>{catalog.spec.brandAsset.label}</b><small>{entry.category}</small></span>
 const controls=<div className="bc-themes" aria-label="Source themes">{catalog.themes.length>1?catalog.themes.map(t=><button key={t.id} className="bc-control" aria-pressed={theme.id===t.id} onClick={()=>setThemeId(t.id)}>{t.label}</button>):<span>{theme.label} · source</span>}</div>
 if(!detail){const micro=[catalog.components.find(c=>c.kind==='buttons'),catalog.components.find(c=>['inputs','badges','cards'].includes(c.kind))].filter((c):c is NonNullable<typeof c>=>!!c);const colors=[...new Map([['primary',entry.tokens.colors.primary],...catalog.colors].map(([k,v])=>[v,[k,v]])).values()].slice(0,6)
 return <div className="bc-root bc-card" style={catalogStyle(theme)} data-brand={entry.slug} data-layout={catalog.spec.layout}>{identifier}<div className="bc-dna">{catalog.dna.map(d=><span key={d.label} title={d.evidence}>{d.label}</span>)}</div><div className="bc-micro" aria-hidden="true">{micro.map(c=><span key={c.key} style={componentStyle(c.values,catalog,theme)}>{c.kind==='inputs'?'Search…':c.kind==='badges'?'Label':c.kind==='cards'?'Card':/secondary/.test(c.key)?'Secondary':'Continue →'}</span>)}</div><div className="bc-mini-palette">{colors.map(([key,value])=><i key={key} style={{background:value}} title={key+': '+value}/>)}</div></div>}
 return <div className="bc-root bc-detail" style={catalogStyle(theme)} data-brand={entry.slug} data-theme={theme.id} data-full-spec={ready}>
  <header className="bc-header">{identifier}<div className="bc-header-actions">{controls}<JumpMenu sections={catalog.sections} /><button ref={trigger} className="bc-control" onClick={()=>setExpanded(true)} disabled={!ready}>크게 보기 ↗</button></div></header>
  {error?<p role="alert" className="bc-note">전체 원본을 불러오지 못했습니다. <button className="bc-control" onClick={()=>setRetry(retry+1)}>다시 시도</button></p>:!ready?<p role="status" className="bc-note">전체 디자인 시스템을 불러오는 중…</p>:<BrandCatalog catalog={catalog} theme={theme}/>}
  {expanded&&createPortal(<dialog ref={dialog} className="bc-root bc-expanded" style={catalogStyle(theme)} data-brand={entry.slug} data-theme={theme.id} aria-label={entry.name+' design system catalog'} onKeyDown={trapFocus} onCancel={e=>{if(e.target===e.currentTarget)setExpanded(false)}} onClose={e=>{if(e.target===e.currentTarget)setExpanded(false)}}><header className="bc-header">{identifier}<div className="bc-header-actions">{controls}<JumpMenu sections={catalog.sections} /><button ref={close} className="bc-control" onClick={()=>setExpanded(false)}>닫기 ✕</button></div></header><BrandCatalog catalog={catalog} theme={theme} expanded/></dialog>,document.body)}
 </div>
}
