import assert from 'node:assert/strict'
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { build } from 'esbuild'
import { parseYamlFrontmatter, brandSpec, compactBrandSpec, normalisedTokens, contrastRatio } from './brand-design-spec.mjs'
import { demoModule } from './demo-module.mjs'

const bundle = await build({ entryPoints: ['src/data/awesomeDesignMd.ts'], bundle: true, write: false, platform: 'node', format: 'esm' })
const { vendorEntries } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'))
const { references } = await demoModule()
assert.equal(references.length, 177, 'Reference count must remain 177')
assert.equal(vendorEntries.length, 74)
const directories = (await readdir('public/vendor/awesome-design-md', { withFileTypes: true })).filter(d => d.isDirectory()).map(d => d.name).sort()
assert.deepEqual(vendorEntries.map(e => e.slug).sort(), directories)
const signatures = new Map(), report = []
for (const entry of vendorEntries) {
  const raw = await readFile(`public/vendor/awesome-design-md/${entry.slug}/DESIGN.md`, 'utf8')
  const parsed = parseYamlFrontmatter(raw)
  const full = JSON.parse(await readFile(`public/brand-design-specs/${entry.slug}.json`, 'utf8'))
  assert.deepEqual(full, JSON.parse(JSON.stringify(brandSpec(parsed, raw))), `${entry.slug}: full evidence drift`)
  assert.deepEqual(entry.spec, compactBrandSpec(full), `${entry.slug}: browse projection drift`)
  assert.deepEqual(entry.tokens, normalisedTokens(parsed, raw), `${entry.slug}: compatibility token drift`)
  assert(!/AIrbnb|AIrtable|design-analysis/.test(entry.name))
  assert.equal(entry.rawDescription, parsed.description)
  assert(!JSON.stringify(entry.spec).includes('[object Object]'))
  for (const [key, role] of Object.entries(parsed.typography || {})) {
    for (const field of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']) {
      if (role[field] !== undefined) assert.deepEqual(full.typography[key][field], role[field], `${entry.slug}: typography.${key}.${field}`)
    }
  }
  assert.deepEqual(entry.spec.radius, parsed.rounded || {})
  assert.deepEqual(entry.spec.spacing, parsed.spacing || {})
  for (const [role, value] of Object.entries(parsed.colors || {})) if (typeof value === 'string' && /^(?:#[\da-f]{3,8}|(?:rgba?|hsla?)\([^)]*\))$/i.test(value)) assert.equal(entry.spec.colors[role], value)
  for (const role of ['primary', 'canvas', 'text']) assert(/^(?:#[\da-f]{3,8}|(?:rgba?|hsla?)\([^)]*\))$/i.test(entry.tokens.colors[role]), `${entry.slug}: invalid ${role}`)
  if (entry.spec.brandAsset.type !== 'text-wordmark') {
    for (const field of ['src', 'sourceUrl', 'license', 'evidenceUrl']) assert(entry.spec.brandAsset[field], `${entry.slug}: asset ${field} required`)
    assert(!/^https?:/.test(entry.spec.brandAsset.src), 'Assets must be local')
  }
  assert((contrastRatio(entry.tokens.colors.text, entry.tokens.colors.canvas) ?? 3)>=3, `${entry.slug}: unreadable headline theme roles`)
  const signature = JSON.stringify([entry.tokens, entry.spec.layout, Object.values(entry.spec.typography).map(({fontSize,fontWeight,lineHeight,letterSpacing,renderFallback})=>({fontSize,fontWeight,lineHeight,letterSpacing,renderFallback}))])
  const hash = createHash('sha256').update(signature).digest('hex')
  signatures.set(hash, [...(signatures.get(hash) || []), entry.slug])
  report.push({ slug: entry.slug, format: parsed.format || 'yaml', rawSha256: createHash('sha256').update(raw).digest('hex'), typographyRoles: Object.keys(full.typography).length, radiusValues: Object.keys(entry.spec.radius).length, spacingValues: Object.keys(entry.spec.spacing).length, colorRoles: Object.keys(entry.spec.colors).length, componentSignatures: Object.keys(full.components).length, layout: entry.spec.layout, fallbackFields: Object.entries(entry.tokens.colors).filter(([, value]) => !Object.values(entry.spec.colors).includes(value)).map(([role]) => 'colors.'+role), signature: hash })
}
const bySlug = Object.fromEntries(vendorEntries.map(e => [e.slug, e]))
// Independent known-source canaries catch semantic/units mistakes beyond regeneration parity.
assert.equal(bySlug.apple.spec.typography['hero-display'].fontWeight, 600)
assert.equal(bySlug.apple.spec.typography['hero-display'].letterSpacing, '-0.28px')
assert.equal(bySlug.airbnb.name, 'Airbnb')
assert.equal(bySlug.airtable.name, 'Airtable')
assert.equal(bySlug.binance.tokens.colors.canvas, '#0b0e11')
assert.equal(bySlug.binance.tokens.colors.text, '#eaecef')
assert.equal(bySlug.ferrari.spec.components['button-primary'].rounded, '0px')
assert.equal(bySlug.tesla.spec.typography['hero-title'].fontSize, '40px')
assert.equal(bySlug.tesla.spec.components['primary-cta'].rounded, '4px')
assert.equal(bySlug.tesla.tokens.typography.lineHeight, 20 / 14)
assert.equal(bySlug.spotify.tokens.colors.canvas, '#121212')
assert.equal(bySlug.theverge.tokens.colors.canvas, '#131313')
assert.equal(bySlug['nintendo-2001'].spec.typography.display.fontWeight, 900)
const renderer = await readFile('src/components/demos/VendorDesignPreview.tsx', 'utf8')
assert(!/https?:\/\//.test(renderer), 'Brand renderer must not fetch external resources')
assert(!/fonts\.googleapis|@import\s+url/.test(await readFile('src/components/demos/vendorDesignPreview.css', 'utf8')))
const duplicates = [...signatures.values()].filter(slugs => slugs.length > 1)
await mkdir('artifacts/v1.7.1', { recursive: true })
await writeFile('artifacts/v1.7.1/brand-data-audit.json', JSON.stringify({ references: references.length, vendors: vendorEntries.length, duplicates, entries: report }, null, 2) + '\n')
console.log(`PASS: 177 references; 74 unchanged-source brand specs; ${report.filter(r => r.format === 'yaml').length} YAML / ${report.filter(r => r.format === 'markdown').length} Markdown; ${duplicates.length} duplicate signatures`)
console.log('Compatibility defaults remain presentation fallbacks; absent fields stay absent in BrandDesignSpec. Full evidence report: artifacts/v1.7.1/brand-data-audit.json')
