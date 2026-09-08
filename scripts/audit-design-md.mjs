#!/usr/bin/env node
/**
 * audit-design-md.mjs
 * Audits the awesome-design-md ingestion for completeness and correctness.
 *
 * Run: node scripts/audit-design-md.mjs
 * Or:  npm run audit:design-md
 */

import { readdirSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dir, '..')
const VENDOR_DIR = join(ROOT, 'public', 'vendor', 'awesome-design-md')
const UPSTREAM_COMMIT = '8147538b4226ae41e2487a9179e3bcc1f68e8554'
const UPSTREAM_REPO = 'https://github.com/VoltAgent/awesome-design-md'

const BOLD = '\x1b[1m'
const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'
const ok = s => `${GREEN}✓${RESET} ${s}`
const fail = s => `${RED}✗${RESET} ${s}`
const warn = s => `${YELLOW}⚠${RESET} ${s}`

const issues = []
const warnings = []

console.log(`\n${BOLD}═══ DRH awesome-design-md Audit ═══${RESET}\n`)

// 1. Vendor directory exists
if (!existsSync(VENDOR_DIR)) {
  console.log(fail('public/vendor/awesome-design-md/ does NOT exist'))
  console.log('     Run: npm run sync:awesome-design-md')
  process.exit(1)
}

// 2. Count DESIGN.md entries
const slugs = readdirSync(VENDOR_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
console.log(ok(`vendor entries discovered: ${slugs.length}`))

// 3. Check each slug
let designMdOk = 0, designMdMissing = 0, previewHtmlOk = 0
const slugReport = []
for (const slug of slugs) {
  const dir = join(VENDOR_DIR, slug)
  const hasDesignMd = existsSync(join(dir, 'DESIGN.md'))
  const hasPreviewHtml = existsSync(join(dir, 'preview.html'))
  if (hasDesignMd) {
    designMdOk++
    // Check for external deps in DESIGN.md
    const raw = readFileSync(join(dir, 'DESIGN.md'), 'utf8')
    const extDeps = []
    if (/fonts\.googleapis\.com/.test(raw)) extDeps.push('google-fonts')
    if (/cdn\.|jsdelivr|unpkg\.com/.test(raw)) extDeps.push('cdn-js')
    if (/src=["']https?:\/\//.test(raw)) extDeps.push('external-img')
    if (extDeps.length) {
      warnings.push(`${slug}: external dep in DESIGN.md — ${extDeps.join(',')}`)
    }
    slugReport.push({ slug, hasDesignMd, hasPreviewHtml, extDeps })
  } else {
    designMdMissing++
    issues.push(`${slug}: DESIGN.md missing`)
    slugReport.push({ slug, hasDesignMd: false, hasPreviewHtml, extDeps: [] })
  }
  if (hasPreviewHtml) previewHtmlOk++
}
console.log(ok(`  DESIGN.md present:     ${designMdOk} / ${slugs.length}`))
if (designMdMissing) console.log(fail(`  DESIGN.md missing:     ${designMdMissing}`))
console.log(`    preview.html present:  ${previewHtmlOk} / ${slugs.length}`)

// 4. Check generated awesomeDesignMd.ts
const tsPath = join(ROOT, 'src', 'data', 'awesomeDesignMd.ts')
if (existsSync(tsPath)) {
  const tsContent = readFileSync(tsPath, 'utf8')
  console.log(ok(`src/data/awesomeDesignMd.ts exists (${(readFileSync(tsPath).length / 1024).toFixed(1)} KB)`))
  if (tsContent.includes(UPSTREAM_COMMIT)) {
    console.log(ok(`  upstream commit SHA embedded: ${UPSTREAM_COMMIT.slice(0, 12)}…`))
  } else {
    issues.push('awesomeDesignMd.ts: upstream commit SHA mismatch')
    console.log(fail(`  upstream commit SHA missing`))
  }
} else {
  issues.push('src/data/awesomeDesignMd.ts not found — run sync:awesome-design-md')
  console.log(fail('src/data/awesomeDesignMd.ts MISSING'))
}

// 5. Check third_party attribution
const thirdPartyLicense = join(ROOT, 'third_party', 'awesome-design-md', 'LICENSE')
const thirdPartyUpstream = join(ROOT, 'third_party', 'awesome-design-md', 'UPSTREAM.md')
if (existsSync(thirdPartyLicense)) {
  console.log(ok('third_party/awesome-design-md/LICENSE exists'))
} else {
  issues.push('third_party/awesome-design-md/LICENSE missing')
  console.log(fail('third_party/awesome-design-md/LICENSE MISSING'))
}
if (existsSync(thirdPartyUpstream)) {
  console.log(ok('third_party/awesome-design-md/UPSTREAM.md exists'))
} else {
  issues.push('third_party/awesome-design-md/UPSTREAM.md missing')
  console.log(fail('third_party/awesome-design-md/UPSTREAM.md MISSING'))
}

// 6. Check unique slugs (no duplicates)
const uniqueSlugs = new Set(slugs)
if (uniqueSlugs.size === slugs.length) {
  console.log(ok(`unique slugs: ${slugs.length} (no duplicates)`))
} else {
  issues.push(`Duplicate slugs detected: ${slugs.length - uniqueSlugs.size}`)
  console.log(fail(`Duplicate slugs: ${slugs.length - uniqueSlugs.size}`))
}

// 7. Check docs
const docsPath = join(ROOT, 'docs', 'AWESOME_DESIGN_MD_INGESTION.md')
if (existsSync(docsPath)) {
  console.log(ok('docs/AWESOME_DESIGN_MD_INGESTION.md exists'))
} else {
  warnings.push('docs/AWESOME_DESIGN_MD_INGESTION.md missing')
  console.log(warn('docs/AWESOME_DESIGN_MD_INGESTION.md missing (optional)'))
}

// 8. Check sync script
const syncScript = join(ROOT, 'scripts', 'sync-awesome-design-md.mjs')
if (existsSync(syncScript)) {
  console.log(ok('scripts/sync-awesome-design-md.mjs exists'))
} else {
  issues.push('scripts/sync-awesome-design-md.mjs missing')
  console.log(fail('scripts/sync-awesome-design-md.mjs MISSING'))
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}── Summary ──────────────────────────────${RESET}`)
console.log(`  Upstream commit:    ${UPSTREAM_COMMIT}`)
console.log(`  Upstream repo:      ${UPSTREAM_REPO}`)
console.log(`  Entries discovered: ${slugs.length}`)
console.log(`  DESIGN.md OK:       ${designMdOk}`)
console.log(`  DESIGN.md missing:  ${designMdMissing}`)
console.log(`  preview.html:       ${previewHtmlOk}`)
console.log(`  External deps:      ${slugReport.filter(r=>r.extDeps.length).length} entries`)

if (warnings.length) {
  console.log(`\n${YELLOW}Warnings (${warnings.length}):${RESET}`)
  warnings.forEach(w => console.log(`  ${warn(w)}`))
}

if (issues.length) {
  console.log(`\n${RED}Issues (${issues.length}):${RESET}`)
  issues.forEach(i => console.log(`  ${fail(i)}`))
  console.log(`\n${BOLD}Audit FAILED — ${issues.length} issue(s) to resolve.${RESET}\n`)
  process.exit(1)
} else {
  console.log(`\n${GREEN}${BOLD}Audit PASSED ✓${RESET}\n`)
}
