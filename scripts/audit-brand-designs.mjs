import assert from 'node:assert/strict'
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import { parseYamlFrontmatter, brandSpec, compactBrandSpec, normalisedTokens, contrastRatio } from './brand-design-spec.mjs'
import { demoModule } from './demo-module.mjs'

const bundle = await build({ entryPoints: ['src/data/awesomeDesignMd.ts'], bundle: true, write: false, platform: 'node', format: 'esm' })
const { vendorEntries } = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'))
const { references } = await demoModule()
assert.equal(new Set(references.map(r=>r.id)).size,references.length)
assert(vendorEntries.length > 0)
const directories = (await readdir('public/vendor/awesome-design-md', { withFileTypes: true })).filter(d => d.isDirectory()).map(d => d.name).sort()
assert.deepEqual(vendorEntries.map(e => e.slug).sort(), directories)
const signatures = new Map(), report = []
for (const entry of vendorEntries) {
  const raw = await readFile(`public/vendor/awesome-design-md/${entry.slug}/DESIGN.md`, 'utf8')
  const parsed = parseYamlFrontmatter(raw)
  const full = JSON.parse(await readFile(`public/brand-design-specs/${entry.slug}.json`, 'utf8'))
  assert.deepEqual(full, JSON.parse(JSON.stringify(brandSpec(parsed, raw, entry.slug))), `${entry.slug}: full evidence drift`)
  for(const field of ['layout','traits','typography','colors','spacing','radius','border','depth','components','brandAsset']) assert(field in full, entry.slug+': missing '+field)
  assert(['gallery','marketplace','cinematic','utility','product','editorial','retro','developer','media'].includes(full.layout))
  assert.equal(entry.upstreamPath, 'design-md/'+entry.slug+'/DESIGN.md')
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
  assert(['text-wordmark','verified-svg','verified-image'].includes(entry.spec.brandAsset.type), 'Unknown asset type')
  assert(entry.spec.brandAsset.label)
  if (entry.spec.brandAsset.type !== 'text-wordmark') {
    for (const field of ['src', 'sourceUrl', 'license', 'evidenceUrl']) assert(entry.spec.brandAsset[field], `${entry.slug}: asset ${field} required`)
    assert(/^\/(?!\/)/.test(entry.spec.brandAsset.src), 'Assets must be local absolute paths')
    await readFile('public'+entry.spec.brandAsset.src)
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
assert(renderer.includes('entry.spec') && renderer.includes('buildBrandCatalog') && renderer.includes('loaded.spec'))
assert((await readFile('src/components/demos/DemoRenderer.tsx','utf8')).includes('entry={entry} detail={detail}'))
const canaries = ["apple","airbnb","notion","linear.app","stripe","vercel","spotify","ferrari","nintendo-2001","binance","tesla","figma"]
assert(new Set(canaries.map(slug=>bySlug[slug].spec.layout)).size >= 8, 'Canary composition collapse')
const sync=await readFile('scripts/sync-awesome-design-md.mjs','utf8')
assert(sync.includes("from './brand-design-spec.mjs'") && !sync.includes('function parseYamlFrontmatter'), 'One canonical parser required')
assert(sync.includes('?ref=') && sync.includes('compactBrandSpec(full)') && sync.includes('brand-design-specs'))
const duplicates = [...signatures.values()].filter(slugs => slugs.length > 1)
await mkdir('artifacts/brand-fidelity', { recursive: true })
await writeFile('artifacts/brand-fidelity/brand-data-audit.json', JSON.stringify({ references: references.length, vendors: vendorEntries.length, duplicates, entries: report }, null, 2) + '\n')
console.log(`PASS: ${references.length} references; ${vendorEntries.length} unchanged-source brand specs; ${report.filter(r => r.format === 'yaml').length} YAML / ${report.filter(r => r.format === 'markdown').length} Markdown; ${duplicates.length} duplicate signatures`)
console.log('Compatibility defaults remain presentation fallbacks; absent fields stay absent in BrandDesignSpec. Full evidence report: artifacts/brand-fidelity/brand-data-audit.json')

const artifactBundle=await build({stdin:{contents:"export {resolveArtifacts} from './src/lib/artifacts'",resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'raw',setup(b){b.onResolve({filter:/\?raw$/},a=>({path:resolve(a.resolveDir,a.path.replace('?raw','')),namespace:'raw'}));b.onLoad({filter:/.*/,namespace:'raw'},async a=>({contents:await readFile(a.path,'utf8'),loader:'text'}))}}]})
const {resolveArtifacts}=await import('data:text/javascript;base64,'+Buffer.from(artifactBundle.outputFiles[0].text).toString('base64'))
for(const entry of vendorEntries){
 const output=resolveArtifacts(references.find(r=>r.id==='admd-'+entry.slug))
 assert.deepEqual(JSON.parse(output.tokens.json).brandSpec,entry.spec,entry.slug+': token spec parity')
 for(const form of ['extended','compact'])assert(output.agent[form].includes(JSON.stringify(entry.spec,null,2))&&output.agent[form].includes('VendorDesignPreview.tsx'))
 assert(!output.react&&!output.html&&!output.css,'Do not invent standalone brand exports')
}
console.log('PASS: Vendor Tokens and both Agent forms preserve the rendered BrandDesignSpec; no fake standalone artifacts')
