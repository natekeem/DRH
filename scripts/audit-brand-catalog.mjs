import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { build } from 'esbuild'
const bundle=await build({stdin:{contents:"export {buildBrandCatalog} from './src/lib/brandCatalog';export {vendorEntries} from './src/data/awesomeDesignMd'",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm'})
const {buildBrandCatalog,vendorEntries}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'))
const verification=JSON.parse(await readFile('artifacts/brand-v2/official-resource-checks.json','utf8'))
const report=[]
for(const entry of vendorEntries){
 const spec=JSON.parse(await readFile('public/brand-design-specs/'+entry.slug+'.json','utf8')),c=buildBrandCatalog(entry,spec)
 assert.equal(c.components.length,Object.keys(spec.components).length)
 assert.equal(c.roles.length,Object.keys(spec.typography).length)
 assert.equal(c.colors.length,Object.keys(spec.colors).length)
 assert(c.dna.length>=2&&c.dna.length<=4)
 for(const component of c.components){assert(c.sections.some(s=>s.kind===component.kind&&s.count>0));for(const key of ['backgroundColor','boxShadow','shadow','border'])assert(!/url\s*\(/i.test(String(component.values[key]||'')),'No external CSS assets')}
 for(const theme of c.themes.slice(1))assert(theme.evidence.every(e=>e.startsWith('colors.')&&e.slice(7) in spec.colors))
 for(const r of c.officialResources){assert.equal(r.source,'official');assert.equal(r.checkedAt,'2026-09-12');assert(r.description&&r.evidence.method);assert.equal(new URL(r.url).protocol,'https:');assert.equal(r.evidence.url,r.url);const check=verification.find(v=>v.slug===entry.slug&&v.url===r.url);assert(check&&check.status===200&&check.heading.length&&check.title===r.evidence.title,'Official resource requires reviewed page evidence')}
 report.push({slug:entry.slug,components:c.components.length,roles:c.roles.length,sections:c.sections,themes:c.themes,officialResources:c.officialResources})
}
const renderer=await readFile('src/components/demos/VendorDesignPreview.tsx','utf8'),catalog=await readFile('src/components/demos/BrandCatalog.tsx','utf8')
assert(!renderer.includes('IMAGE AREA'));assert(renderer.includes('loaded.spec:entry.spec'));assert.equal((renderer.match(/<BrandCatalog catalog={catalog} theme={theme}/g)||[]).length,2)
assert(renderer.includes('showModal()')&&renderer.includes("document.body.style.overflow='hidden'"))
assert(catalog.includes('catalog.components.filter')&&catalog.includes('roles.map'))
assert(!/getdesign\.md|oh-my-design/.test(renderer+catalog))
const history=JSON.parse(await readFile('artifacts/brand-v2/upstream-research.json','utf8'))
assert.equal(history.pinnedPreviewCount,0);assert.equal(history.historicalPreviewCount,116);assert.equal(history.matchingDesigns,0);assert(history.license.includes('MIT License')&&history.license.includes('Copyright (c) 2026 VoltAgent'));assert(history.previewPaths.every(p=>/^[0-9a-f]{40}$/.test(p.sha)))
const links=report.flatMap(e=>e.officialResources),coverage={totalBrands:report.length,brandsWithResources:report.filter(e=>e.officialResources.length).length,totalLinks:links.length,types:Object.fromEntries(['brand-guidelines','design-system','developer-design-guide','typography','components','assets','other'].map(type=>[type,links.filter(r=>r.type===type).length]))}
await writeFile('artifacts/brand-v2/catalog-data-audit.json',JSON.stringify({coverage,entries:report},null,2)+'\n')
console.log('PASS: full source catalog coverage and explicit theme/resource metadata',coverage)
