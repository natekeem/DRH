import type { CSSProperties } from 'react'
import { vendorEntryBySlug } from '../data/references'
import { isDark } from '../lib/brandCatalog'
import { brandIdentifier, resolveBrandFont } from '../lib/brandPresentation'

type IdentityMarkStyle = CSSProperties & {
  '--brand-mark-bg'?: string
  '--brand-mark-ink'?: string
  '--brand-mark-border'?: string
  '--brand-mark-font'?: string
}

function initials(name:string) {
  const words=name.trim().split(/[\s._-]+/).filter(Boolean)
  if(words.length>1)return words.slice(0,2).map(word=>word[0]).join('').toUpperCase()
  const word=words[0]||name
  const air=word.match(/^air(.?)/i)
  if(air?.[1])return ('A'+air[1]).toUpperCase()
  return Array.from(word).slice(0,2).join('').toUpperCase()
}

export function BrandIdentityMark({slug,dark=false,context='card'}:{slug:string;dark?:boolean;context?:'card'|'preview'}) {
  const entry=vendorEntryBySlug[slug]
  if(!entry)return null
  const asset=brandIdentifier(slug,entry.spec)
  const role=Object.values(entry.spec.typography)[0]||{}
  const primary=entry.tokens.colors.primary
  const canvas=entry.tokens.colors.canvas
  const border=entry.tokens.colors.border
  const markStyle:IdentityMarkStyle={
    '--brand-mark-bg':asset.type==='text-wordmark'?primary:dark?'#ffffff':'#ffffff',
    '--brand-mark-ink':asset.type==='text-wordmark'?(isDark(primary)?'#ffffff':'#111111'):dark?'#ffffff':'#111111',
    '--brand-mark-border':border==='currentColor'?(dark?'#ffffff33':'#11111122'):border,
    '--brand-mark-font':resolveBrandFont(role).stack,
    backgroundColor:asset.type==='text-wordmark'?primary:dark?'#ffffff0a':canvas,
  }
  const verified=asset.type!=='text-wordmark'
  const src=(dark&&asset.darkSrc?asset.darkSrc:asset.src)?.replace(/^\/+/, '')
  const note=verified?'공식 제공 식별 자산 · 참고 표시':'DRH 텍스트 식별 마크 · 공식 로고 아님'
  return <span className={`brand-identity-mark ${verified?'is-verified':'is-text'} is-${asset.format||'mark'} context-${context}`} style={markStyle} role="img" aria-label={`${entry.name} · ${note}`} title={note} data-asset-kind={asset.type}>
    {verified&&src?<img src={import.meta.env.BASE_URL+src} alt=""/>:<span aria-hidden="true">{initials(asset.label||entry.name)}</span>}
    <span className="sr-only">{note}</span>
  </span>
}
