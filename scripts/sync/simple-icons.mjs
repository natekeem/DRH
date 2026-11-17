// Imports CC0 brand icons from a pinned Simple Icons release for brands that have no
// official verified asset yet. Official assets already in the registry are never replaced.
// Usage: node scripts/sync/simple-icons.mjs
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const VERSION = '16.37.0'
const CDN = `https://cdn.jsdelivr.net/npm/simple-icons@${VERSION}`
const DISCLAIMER = `https://github.com/simple-icons/simple-icons/blob/${VERSION}/DISCLAIMER.md`
const LICENSE = `https://github.com/simple-icons/simple-icons/blob/${VERSION}/LICENSE.md`
const CHECKED_AT = '2026-11-11'
const REGISTRY = 'src/data/brandVerifiedAssets.json'

// DRH slug -> Simple Icons slug. Brands absent from Simple Icons stay text wordmarks.
const MAP = {
  airbnb: 'airbnb', airtable: 'airtable', apple: 'apple', 'bmw-m': 'bmw', bmw: 'bmw', bugatti: 'bugatti',
  cal: 'caldotcom', claude: 'claude', clickhouse: 'clickhouse', coinbase: 'coinbase', cursor: 'cursor',
  'dell-1996': 'dell', elevenlabs: 'elevenlabs', expo: 'expo', ferrari: 'ferrari', figma: 'figma',
  framer: 'framer', hashicorp: 'hashicorp', hp: 'hp', hyundai: 'hyundai', intercom: 'intercom', kakao: 'kakao',
  lamborghini: 'lamborghini', mastercard: 'mastercard', meta: 'meta', minimax: 'minimax', mintlify: 'mintlify',
  miro: 'miro', 'mistral.ai': 'mistralai', mongodb: 'mongodb', naver: 'naver', nike: 'nike', notion: 'notion',
  nvidia: 'nvidia', ollama: 'ollama', 'opencode.ai': 'opencode', pinterest: 'pinterest', playstation: 'playstation',
  posthog: 'posthog', raycast: 'raycast', renault: 'renault', replicate: 'replicate', resend: 'resend',
  revolut: 'revolut', samsung: 'samsung', sanity: 'sanity', sentry: 'sentry', shopify: 'shopify',
  spacex: 'spacex', spotify: 'spotify', starbucks: 'starbucks', stripe: 'stripe', tesla: 'tesla', uber: 'uber',
  vodafone: 'vodafone', warp: 'warp', webflow: 'webflow', wise: 'wise', zapier: 'zapier',
}
// Project policy: Binance must stay a text wordmark (see audit-brand-canonical.mjs).
const EXCLUDED = new Set(['binance'])

const lum = hex => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
const sha = bytes => createHash('sha256').update(bytes).digest('hex')
const get = async url => { const res = await fetch(url); if (!res.ok) throw new Error(`${res.status} ${url}`); return res.text() }

const registry = JSON.parse(await readFile(REGISTRY, 'utf8'))
const data = JSON.parse(await get(`${CDN}/data/simple-icons.json`))
const icons = Array.isArray(data) ? data : data.icons
const bySlug = Object.fromEntries(icons.map(i => [i.slug, i]))

let added = 0
for (const [slug, iconSlug] of Object.entries(MAP)) {
  if (EXCLUDED.has(slug)) continue
  if (registry[slug] && registry[slug].provider !== 'simple-icons') continue // keep official assets
  const icon = bySlug[iconSlug]
  if (!icon) throw new Error(`Simple Icons ${VERSION} has no icon "${iconSlug}" for ${slug}`)
  if (icon.license && icon.license.type !== 'CC0-1.0') {
    console.log(`Skipping ${slug}: review ${icon.license.type} terms before importing`)
    continue
  }
  const sourceUrl = `${CDN}/icons/${iconSlug}.svg`
  const raw = await get(sourceUrl)
  if (/<script|\son\w+=|(?:href|src)=["']https?:/i.test(raw)) throw new Error(`Unsafe SVG: ${iconSlug}`)
  const hex = icon.hex.toUpperCase()
  // Brand hex on light surfaces; fall back to near-black/white only when the hex would be illegible.
  const light = contrast(hex, 'FFFFFF') >= 1.6 ? hex : '111111'
  const dark = contrast(hex, '111111') >= 3 ? hex : 'FFFFFF'
  const paint = color => raw.replace('<svg ', `<svg fill="#${color}" `).replace(/<title>[^<]*<\/title>/, `<title>${icon.title}</title>`)
  const dir = `public/brand-assets/${slug}`
  await mkdir(dir, { recursive: true })
  const lightSvg = paint(light), darkSvg = paint(dark)
  await writeFile(`${dir}/logo.svg`, lightSvg)
  await writeFile(`${dir}/logo-dark.svg`, darkSvg)
  const entry = {
    type: 'verified-svg',
    format: 'svg',
    provider: 'simple-icons',
    label: icon.title,
    src: `brand-assets/${slug}/logo.svg`,
    darkSrc: `brand-assets/${slug}/logo-dark.svg`,
    sourceUrl,
    evidenceUrl: icon.guidelines?.startsWith('https:') ? icon.guidelines : LICENSE,
    license: `Simple Icons ${VERSION} icon data, CC0-1.0; recolored with the Simple Icons brand hex #${hex}. Trademark rights remain with the owner; identification only, not MIT.`,
    sourceDisclaimer: DISCLAIMER,
    attribution: `${icon.title} 상표·로고는 해당 소유자의 자산입니다. Simple Icons 아이콘을 브랜드 식별 목적으로만 표시하며 제휴·보증을 뜻하지 않습니다.`,
    usageTerms: 'Unmodified shape; aspect ratio preserved. Only fill color set (brand hex, or neutral black/white when illegible). No affiliation or endorsement claim.',
    checkedAt: CHECKED_AT,
    sha256: sha(lightSvg),
    darkSha256: sha(darkSvg),
    originalSha256: sha(raw),
  }
  await writeFile(`${dir}/NOTICE.txt`, JSON.stringify(entry, null, 2) + '\n')
  registry[slug] = entry
  added++
}
await writeFile(REGISTRY, JSON.stringify(registry, null, 2) + '\n')
console.log(`Simple Icons ${VERSION}: ${added} brand icons written; registry now has ${Object.keys(registry).length} assets.`)
