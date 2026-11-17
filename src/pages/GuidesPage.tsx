import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { guides, loadGuide } from '../content/guides'
import { GuideMarkdown } from '../components/GuideMarkdown'
import { guideHeadings } from '../lib/guideHeadings'

export function GuidesPage() {
  return (
    <main className="guides-page">
      <section className="listing-hero">
        <span className="eyebrow">FIELD GUIDE / {guides.length} GUIDES</span>
        <h1>좋은 Reference를<br/><i>작동하는 화면으로.</i></h1>
        <p>보고 고른 디자인을 구체적인 규칙으로 전달하세요.<br/>Coding Agent와 함께 만드는 과정을 정리했습니다.</p>
      </section>
      <section className="guide-library" aria-label="Guide library">
        {guides.map(guide => (
          <Link className="guide-card" to={`/guides/${guide.slug}`} key={guide.slug}>
            <span className="eyebrow">{guide.category} · {guide.readingTime}</span>
            <h2>{guide.title} ↗</h2>
            <p>{guide.description}</p>
            <div className="tag-list">{guide.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <small>Updated {guide.updatedAt}</small>
          </Link>
        ))}
      </section>
    </main>
  )
}

type GuideContent = { slug: string; text: string } | { slug: string; error: true }

export function GuideArticle() {
  const { slug } = useParams()
  const { pathname, search, hash, key } = useLocation()
  const guide = guides.find(item => item.slug === slug)
  const [content, setContent] = useState<GuideContent>()
  const body = useRef<HTMLDivElement>(null)
  const current = content?.slug === slug ? content : undefined
  const text = current && 'text' in current ? current.text : ''
  const headings = useMemo(() => guideHeadings(text), [text])

  useEffect(() => {
    if (!guide) return
    let active = true
    loadGuide(guide.slug).then(
      markdown => { if (active) setContent({ slug: guide.slug, text: markdown }) },
      () => { if (active) setContent({ slug: guide.slug, error: true }) },
    )
    return () => { active = false }
  }, [guide])

  useEffect(() => {
    if (!text || !hash) return
    let id: string
    try {
      id = decodeURIComponent(hash.slice(1))
    } catch {
      return
    }
    const heading = document.getElementById(id)
    if (!heading || !body.current?.contains(heading)) return
    heading.scrollIntoView({ block: 'start', behavior: 'instant' })
    heading.focus({ preventScroll: true })
  }, [hash, key, text])

  if (!guide) {
    return <main className="not-found"><h1>가이드를 찾을 수 없습니다.</h1><Link to="/guides">가이드 목록</Link></main>
  }

  return (
    <main className="guide-article">
      <Link className="text-link" to="/guides">← 가이드 목록</Link>
      <header>
        <span className="eyebrow">{guide.category} · {guide.readingTime}</span>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </header>
      <div className="guide-editorial">
        <div className="guide-body" ref={body}>
          {!current && <p role="status">가이드를 불러오는 중입니다…</p>}
          {current && ('error' in current
            ? <p role="alert">가이드를 불러오지 못했습니다. 페이지를 새로고침해 주세요.</p>
            : <GuideMarkdown text={text}/>)}
        </div>
        <aside className="guide-rail">
          <nav aria-label="On this page">
            <h2>ON THIS PAGE</h2>
            {headings.map(heading => (
              <Link
                className={heading.depth === 3 ? 'toc-subheading' : undefined}
                to={{ pathname, search, hash: '#' + encodeURIComponent(heading.id) }}
                key={heading.id}
              >
                {heading.text}
              </Link>
            ))}
          </nav>
          <p className="guide-updated">Updated {guide.updatedAt} · {guide.readingTime}</p>
          {guide.sources.length > 0 && (
            <section className="guide-sources">
              <h2>Source attribution</h2>
              {guide.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
            </section>
          )}
          <Link className="text-link" to="/explore?category=DESIGN.md">브랜드 디자인 둘러보기 →</Link>
          <section className="guide-related">
            <h2>함께 읽기</h2>
            {guides.filter(item => item.slug !== slug).map(item => <Link key={item.slug} to={`/guides/${item.slug}`}>{item.title} →</Link>)}
          </section>
        </aside>
      </div>
    </main>
  )
}
