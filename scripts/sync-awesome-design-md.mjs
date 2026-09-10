#!/usr/bin/env node
/**
 * sync-awesome-design-md.mjs
 * Downloads all DESIGN.md files from VoltAgent/awesome-design-md (MIT)
 * and generates src/data/awesomeDesignMd.ts.
 *
 * Run: node scripts/sync-awesome-design-md.mjs
 * Or:  npm run sync:awesome-design-md
 *
 * Requirements: Node 18+ (uses built-in fetch)
 */

import { parseYamlFrontmatter, extractColors, normalisedTokens, brandSpec, compactBrandSpec, brandName, summary } from './brand-design-spec.mjs'
import { readdirSync, writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')

const UPSTREAM_REPO = 'VoltAgent/awesome-design-md'
const UPSTREAM_COMMIT = '8147538b4226ae41e2487a9179e3bcc1f68e8554'
const RAW_BASE = `https://raw.githubusercontent.com/${UPSTREAM_REPO}/${UPSTREAM_COMMIT}`
const API_BASE = `https://api.github.com/repos/${UPSTREAM_REPO}`

// ─── README category mapping ─────────────────────────────────────────────────
const CATEGORY_MAP = {
  claude:'AI & LLM', cohere:'AI & LLM', elevenlabs:'AI & LLM', minimax:'AI & LLM',
  'mistral.ai':'AI & LLM', ollama:'AI & LLM', 'opencode.ai':'AI & LLM', replicate:'AI & LLM',
  runwayml:'AI & LLM', 'together.ai':'AI & LLM', voltagent:'AI & LLM', 'x.ai':'AI & LLM',
  cursor:'Developer Tools', expo:'Developer Tools', lovable:'Developer Tools',
  raycast:'Developer Tools', superhuman:'Developer Tools', vercel:'Developer Tools',
  warp:'Developer Tools',
  clickhouse:'Backend & DevOps', composio:'Backend & DevOps', hashicorp:'Backend & DevOps',
  mongodb:'Backend & DevOps', sanity:'Backend & DevOps', sentry:'Backend & DevOps',
  supabase:'Backend & DevOps',
  airtable:'SaaS & Productivity', cal:'SaaS & Productivity', figma:'SaaS & Productivity',
  framer:'SaaS & Productivity', intercom:'SaaS & Productivity', 'linear.app':'SaaS & Productivity',
  miro:'SaaS & Productivity', mintlify:'SaaS & Productivity', notion:'SaaS & Productivity',
  posthog:'SaaS & Productivity', resend:'SaaS & Productivity', slack:'SaaS & Productivity',
  binance:'Fintech & Crypto', coinbase:'Fintech & Crypto', kraken:'Fintech & Crypto',
  mastercard:'Fintech & Crypto', revolut:'Fintech & Crypto',
  airbnb:'E-commerce & Consumer', nike:'E-commerce & Consumer', pinterest:'E-commerce & Consumer',
  shopify:'E-commerce & Consumer', spotify:'E-commerce & Consumer', starbucks:'E-commerce & Consumer',
  apple:'Big Tech', ibm:'Big Tech', meta:'Big Tech', nvidia:'Big Tech', hp:'Big Tech',
  bmw:'Automotive', 'bmw-m':'Automotive', bugatti:'Automotive', ferrari:'Automotive',
  lamborghini:'Automotive', renault:'Automotive', spacex:'Automotive & Space', tesla:'Automotive',
  'dell-1996':'Retro Web', 'nintendo-2001':'Retro Web', playstation:'Retro Web',
  clay:'Design Tools', figma_:'Design Tools',
  stripe:'Fintech & Crypto', ibm_:'Big Tech',
}

// ─── Tags derived from description + category ─────────────────────────────────
function deriveTags(slug, desc, category) {
  const base = [slug.replace(/[-_.]/g, ' ').split(' ')[0].toLowerCase()]
  if (category) base.push(category.toLowerCase().split(' ')[0])
  if (desc) {
    const words = desc.toLowerCase().match(/\b(dark|light|minimal|bold|clean|editorial|terminal|neon|gradient|monospace|fintech|ai|saas|e-commerce|automotive|luxury|retro|developer)\b/g)
    if (words) base.push(...new Set(words))
  }
  return [...new Set(base)].slice(0, 6)
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'DRH-Sync/1.0', Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  return res.json()
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'DRH-Sync/1.0' } })
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  return res.text()
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(process.argv.includes('--local') ? 'Regenerating from unchanged local DESIGN.md files…' : 'Fetching pinned upstream DESIGN.md files…')
  const local = process.argv.includes('--local')
  const importDate = local
    ? readFileSync(join(ROOT, 'third_party/awesome-design-md/UPSTREAM.md'), 'utf8').match(/Imported at: (\d{4}-\d{2}-\d{2})/)?.[1] ?? 'unknown'
    : new Date().toISOString().slice(0, 10)
  const entries = local ? readdirSync(join(ROOT,'public/vendor/awesome-design-md'),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>({type:'dir',name:e.name})) : await fetchJson(`${API_BASE}/contents/design-md?ref=${UPSTREAM_COMMIT}`)
  const dirs = entries.filter(e => e.type === 'dir').map(e => e.name)
  console.log(`    Discovered ${dirs.length} entries: ${dirs.join(', ')}`)

  const vendorBase = join(ROOT, 'public', 'vendor', 'awesome-design-md')
  mkdirSync(vendorBase, { recursive: true })

  const metaList = []
  const report = { discovered: dirs.length, imported: 0, skipped: 0, externalDeps: 0 }

  for (const slug of dirs) {
    process.stdout.write(`  ↓ ${slug.padEnd(24)} `)
    try {
      const rawUrl = `${RAW_BASE}/design-md/${slug}/DESIGN.md`
      const raw = local ? readFileSync(join(vendorBase,slug,'DESIGN.md'),'utf8') : await fetchText(rawUrl)

      // Save raw DESIGN.md verbatim
      const destDir = join(vendorBase, slug)
      mkdirSync(destDir, { recursive: true })
      if (!local) writeFileSync(join(destDir, 'DESIGN.md'), raw, 'utf8')

      const parsed = parseYamlFrontmatter(raw)
      const colors = extractColors(parsed)
      const tokens = normalisedTokens(parsed, raw)
      const category = CATEGORY_MAP[slug] || 'Brand Design'
      const name = brandName(parsed,slug)
      const description = summary(String(parsed.description || ''))
      const tags = deriveTags(slug, description, category)

      // Check for external deps in raw content (report only)
      const extDeps = []
      if (/fonts\.googleapis\.com/.test(raw)) extDeps.push('google-fonts')
      if (/cdn\.|jsdelivr|unpkg\.com/.test(raw)) extDeps.push('cdn-js')
      if (/src=["']https?:\/\//.test(raw)) extDeps.push('external-img')
      if (extDeps.length) report.externalDeps++

      // Check for preview.html availability
      let hasPreviewHtml = existsSync(join(destDir, 'preview.html'))
      if (!local) try {
        const previewUrl = `${RAW_BASE}/design-md/${slug}/preview.html`
        const previewRes = await fetch(previewUrl, { method: 'HEAD', headers: { 'User-Agent': 'DRH-Sync/1.0' } })
        hasPreviewHtml = previewRes.ok
        if (hasPreviewHtml) {
          const previewRaw = await fetchText(previewUrl)
          // Sanitise: check external deps
          let sanitised = previewRaw
          const hasExtFont = /fonts\.googleapis\.com/.test(previewRaw)
          if (hasExtFont) {
            // Replace Google Fonts link with system font CSS comment
            sanitised = sanitised
              .replace(/<link[^>]*fonts\.googleapis\.com[^>]*>/gi, '<!-- external font removed for offline use -->')
              .replace(/<link[^>]*fonts\.gstatic\.com[^>]*>/gi, '')
              .replace(/(font-family\s*:\s*)['"]?[A-Z][^'";}]+['"]?(\s*[,;])/g, '$1system-ui, sans-serif$2')
          }
          writeFileSync(join(destDir, 'preview.html'), sanitised, 'utf8')
        }
      } catch {}

      const meta = {
        slug,
        name,
        description,
        category,
        subcategory: 'Brand Design',
        tags,
        upstreamPath: `design-md/${slug}/DESIGN.md`,
        upstreamCommit: UPSTREAM_COMMIT,
        importedAt: importDate,
        colors,
        tokens,
        spec: (() => {
          const full = brandSpec(parsed, raw)
          const specDir = join(ROOT, 'public', 'brand-design-specs')
          mkdirSync(specDir, { recursive: true })
          writeFileSync(join(specDir, `${slug}.json`), JSON.stringify(full, null, 2) + '\n')
          // Browse carries visual values; full source evidence is loaded on detail only.
          return compactBrandSpec(full)
        })(),
        rawDescription: String(parsed.description || ''),
        hasPreviewHtml,
        externalDeps: extDeps,
      }
      metaList.push(meta)
      report.imported++
      console.log(`✓ ${extDeps.length ? `[ext:${extDeps.join(',')}]` : 'offline-safe'}`)
    } catch (err) {
      console.log(`✗ SKIP — ${err.message}`)
      report.skipped++
    }
  }

  if (report.skipped) throw new Error('Incomplete sync; catalog not written')
  // ─── Generate src/data/awesomeDesignMd.ts ────────────────────────────────
  const tsPath = join(ROOT, 'src', 'data', 'awesomeDesignMd.ts')
  const generated = `// AUTO-GENERATED by scripts/sync-awesome-design-md.mjs — DO NOT EDIT MANUALLY
// Upstream: https://github.com/VoltAgent/awesome-design-md
// Commit: ${UPSTREAM_COMMIT}
// License: MIT (Copyright 2026 VoltAgent)
// Run \`npm run sync:awesome-design-md\` to update.

import type { DesignSystemTokens } from '../types'
import type { BrandDesignSpec } from '../brandDesignSpec'

export const UPSTREAM_COMMIT = '${UPSTREAM_COMMIT}' as const
export const UPSTREAM_REPO = 'https://github.com/VoltAgent/awesome-design-md' as const
export const IMPORT_DATE = '${importDate}' as const

export type VendorEntry = {
  slug: string
  name: string
  description: string
  category: string
  subcategory: string
  tags: string[]
  upstreamPath: string
  upstreamCommit: string
  importedAt: string
  colors: Record<string, string>
  tokens: DesignSystemTokens
  spec: BrandDesignSpec
  rawDescription: string
  hasPreviewHtml: boolean
  externalDeps: string[]
}

export const vendorEntries: VendorEntry[] = ${JSON.stringify(metaList, null, 2)}
`
  writeFileSync(tsPath, generated, 'utf8')
  console.log(`\n✅  Generated ${tsPath}`)

  // ─── Update UPSTREAM.md with fresh commit SHA ────────────────────────────
  const upstreamMd = join(ROOT, 'third_party', 'awesome-design-md', 'UPSTREAM.md')
  if (!local && existsSync(upstreamMd)) {
    let content = readFileSync(upstreamMd, 'utf8')
    content = content.replace(/Upstream commit:.*/, `Upstream commit: ${UPSTREAM_COMMIT}`)
    content = content.replace(/Imported at:.*/, `Imported at: ${new Date().toISOString().slice(0, 10)}`)
    writeFileSync(upstreamMd, content, 'utf8')
  }

  // ─── Print report ─────────────────────────────────────────────────────────
  console.log('\n📊  Sync Report')
  console.log(`    Discovered:            ${report.discovered}`)
  console.log(`    Imported:              ${report.imported}`)
  console.log(`    Skipped:               ${report.skipped}`)
  console.log(`    With external deps:    ${report.externalDeps} (sanitised)`)
  console.log(`    With preview.html:     ${metaList.filter(m => m.hasPreviewHtml).length}`)
}

main().catch(err => { console.error(err); process.exit(1) })
