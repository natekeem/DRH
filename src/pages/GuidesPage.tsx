import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { guides, guideSources } from '../content/guides'
import { GuideMarkdown } from '../components/GuideMarkdown'
import { guideHeadings } from '../lib/guideHeadings'

export function GuidesPage(){return <main className="guides-page"><section className="guide-intro"><span className="eyebrow">FIELD GUIDE / 01</span><h1>좋은 Reference를<br/><i>작동하는 화면으로.</i></h1><p>보고 고른 디자인을 구체적인 규칙으로 전달하세요.<br/>Coding Agent와 함께 만드는 과정을 정리했습니다.</p></section><section className="guide-library" aria-label="Guide library">{guides.map(g=><Link className="guide-card" to={`/guides/${g.slug}`} key={g.slug}><span className="eyebrow">{g.category} · {g.readingTime}</span><h2>{g.title} ↗</h2><p>{g.description}</p><div className="tag-list">{g.tags.map(t=><span key={t}>{t}</span>)}</div><small>Updated {g.updatedAt}</small></Link>)}</section></main>}
export function GuideArticle(){
  const {slug}=useParams(),guide=guides.find(g=>g.slug===slug)
  const [content,setContent]=useState<{slug:string;text:string;error?:boolean}>()
  useEffect(()=>{let active=true;const loader=guideSources[`./${slug}.md`];if(loader)loader().then(text=>{if(active)setContent({slug:slug!,text})}).catch(()=>{if(active)setContent({slug:slug!,text:'',error:true})});return()=>{active=false}},[slug])
  if(!guide)return <main className="not-found"><h1>가이드를 찾을 수 없습니다.</h1><Link to="/guides">가이드 목록</Link></main>
  const text = content && content.slug===slug ? content.text : ''
  const headings = guideHeadings(text)
  return <main className="guide-article">
    <Link className="text-link" to="/guides">← 가이드 목록</Link>
    <header><span className="eyebrow">{guide.category} · {guide.readingTime}</span><h1>{guide.title}</h1><p>{guide.description}</p></header>
    <div className="guide-editorial">
      <div className="guide-body">{!content||content.slug!==slug?<p role="status">가이드를 불러오는 중입니다…</p>:content.error?<p role="alert">가이드를 불러오지 못했습니다. 페이지를 새로고침해 주세요.</p>:<GuideMarkdown text={text}/>}</div>
      <aside className="guide-rail">
        <nav aria-label="On this page"><h2>ON THIS PAGE</h2>{headings.map(h=><a className={h.depth===3?'toc-subheading':''} href={`#/guides/${slug}#${h.id}`} key={h.id} onClick={e=>{e.preventDefault();const target=document.getElementById(h.id);target?.scrollIntoView({block:'start',behavior:'instant'});target?.focus({preventScroll:true})}}>{h.text}</a>)}</nav>
        <p className="guide-updated">Updated {guide.updatedAt} · {guide.readingTime}</p>
        {guide.sources.length>0&&<section className="guide-sources"><h2>Source attribution</h2>{guide.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>)}</section>}
        <Link className="text-link" to="/explore?category=DESIGN.md">DESIGN.md 둘러보기 →</Link>
        <section className="guide-related"><h2>함께 읽기</h2>{guides.filter(g=>g.slug!==slug).map(g=><Link key={g.slug} to={`/guides/${g.slug}`}>{g.title} →</Link>)}</section>
      </aside>
    </div>
  </main>
}
