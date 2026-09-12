import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { build } from 'esbuild'
import postcss from 'postcss'
const bundle=await build({stdin:{contents:"export * from './src/lib/brandPresentation';export {buildBrandCatalog} from './src/lib/brandCatalog';export {vendorEntries} from './src/data/awesomeDesignMd'",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm'})
const p=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'))
const hash=b=>createHash('sha256').update(b).digest('hex')
const coverage={totalBrands:p.vendorEntries.length,primaryFont:{'open-font':0,'system-font':0,proprietary:0,unspecified:0},brandsWithDeclaredOpenFont:0,brandAsset:{'verified-svg':0,'verified-image':0,'text-wordmark':0},brandsWithResources:0,resourceTypes:{},responsive:0,motion:{defined:0,'not-in-scope':0,'not-specified':0}}
for(const font of p.brandFontAssets){
 assert.equal(font.kind,'open-font');assert.equal(font.license,'SIL OFL 1.1');assert(/^[a-f0-9]{40}$/.test(font.commit));assert(font.sourceUrl.includes(font.commit));assert(font.evidenceUrl.includes(font.commit))
 assert.equal(hash(await readFile('public/'+font.src)),font.sha256)
 assert((await readFile('public/'+font.licensePath,'utf8')).includes('SIL OPEN FONT LICENSE Version 1.1'))
}
const rows=[]
const curatedCopy=JSON.parse(await readFile('src/data/brandCuratedCopy.json','utf8'))
for(const entry of p.vendorEntries){
 const spec=JSON.parse(await readFile('public/brand-design-specs/'+entry.slug+'.json','utf8'))
 const catalog=p.buildBrandCatalog(entry,spec),fonts=catalog.roles.map(([,r])=>p.resolveBrandFont(r)),primary=fonts[0]||p.resolveBrandFont({})
 for(const [kind,translations]of Object.entries(curatedCopy[entry.slug]||{})){
  const originals=p.sourceTable(kind==='elevation'?spec.depth:p.responsiveEvidence(spec)).map(row=>row.join(' | '))
  for(const t of translations){assert(originals.includes(t.source),'Stale Korean summary: '+entry.slug);assert(t.summary&&!/[\[\]{}]/.test(t.summary))}
 }
 coverage.primaryFont[primary.kind]++
 if(fonts.some(f=>f.kind==='open-font'))coverage.brandsWithDeclaredOpenFont++
 const asset=p.brandIdentifier(entry.slug,spec);coverage.brandAsset[asset.type]++
 if(asset.type!=='text-wordmark'){
  assert(asset.sourceUrl?.startsWith('https:')&&asset.evidenceUrl?.startsWith('https:')&&asset.license&&asset.attribution)
  assert(!asset.src.startsWith('http'));const bytes=await readFile('public/'+asset.src);assert.equal(hash(bytes),asset.sha256)
  assert(!/<script|\son\w+=|(?:href|src)=["']https?:/i.test(bytes.toString()))
  if(asset.darkSrc)assert.equal(hash(await readFile('public/'+asset.darkSrc)),asset.darkSha256)
 }
 const responsive=p.sourceLines(p.responsiveEvidence(spec)).length>0
 assert.equal(catalog.sections.some(s=>s.type==='responsive'),responsive)
 coverage.responsive+=Number(responsive)
 const motion=p.motionEvidence(spec);coverage.motion[motion.state]++
 assert.equal(catalog.sections.some(s=>s.type==='motion'),motion.state!=='not-specified')
 assert(motion.lines.every(s=>!/^\||^\[\s*"/.test(s)))
 assert(p.curatedRoles(catalog.roles).length<=5&&p.curatedColors(catalog.colors).length<=8)
 assert(p.curatedRoles(catalog.roles).every(([k])=>k in spec.typography))
 if(catalog.roles.some(([k])=>/body|paragraph/.test(k)))assert(p.curatedRoles(catalog.roles).some(([k])=>/body|paragraph/.test(k)),'Body role omitted: '+entry.slug)
 assert(p.curatedColors(catalog.colors).every(([k])=>k in spec.colors))
 assert.equal(catalog.roles.length,Object.keys(spec.typography).length);assert.equal(catalog.components.length,Object.keys(spec.components).length)
 if(catalog.officialResources.length)coverage.brandsWithResources++
 for(const r of catalog.officialResources)coverage.resourceTypes[r.type]=(coverage.resourceTypes[r.type]||0)+1
 rows.push({slug:entry.slug,primaryFont:primary.kind,rendered:primary.family,fontKinds:[...new Set(fonts.map(f=>f.kind))],brandAsset:asset.type,responsive,motion:motion.state,detailColors:p.curatedColors(catalog.colors).length,fullColors:catalog.colors.length,detailRoles:p.curatedRoles(catalog.roles).length,fullRoles:catalog.roles.length})
}
// Regression fixtures: arrays, nested values, no-data and parser false positives.
assert.deepEqual(p.sourceLines({rules:[]}),[])
assert.deepEqual(p.sourceLines({rules:['- Fade 120ms']}),['- Fade 120ms'])
assert.deepEqual(p.sourceLines('["hello"]'),['hello'])
assert.equal(p.motionEvidence({motion:{rules:['- Animation timings are not in scope.']}}).state,'not-in-scope')
assert.equal(p.motionEvidence({motion:{rules:['| Large phone | 641–735px | Tiles transition to tighter padding |']}}).state,'not-specified')
assert.equal(p.motionEvidence({motion:{rules:['- Animation/transition timings not extracted; recommend 150–200ms ease']}}).state,'not-specified')
assert.equal(p.motionEvidence({motion:{rules:['- End every page with the dark footer. The light-to-dark transition is part of the editorial rhythm.','- Animation timings are not in scope.']}}).state,'not-in-scope')
assert.deepEqual(p.motionEvidence({motion:{rules:['- Transition: 0.2s ease','Typography transitioned to a custom family.']}}).lines,['Transition: 0.2s ease'])
assert.equal(p.shortRule('`{colors.surface-1}` background'),'colors.surface-1 배경')
assert.deepEqual(p.representativeRows([0,1,2,3,4,5,6,7],6),[0,1,3,4,6,7])
assert.equal(p.curatedRule('linear.app','elevation',['edited source']),undefined)
assert.deepEqual(p.sourceTable('| Level | Treatment | Use |\n|---|---|---|\n| Flat | No shadow | Body |'),[['Flat','No shadow','Body']])
const css=postcss.parse(await readFile('src/components/demos/vendorDesignPreview.css','utf8'))
function check(parent){const seen=new Set();for(const node of parent.nodes||[]){if(node.type==='rule'){assert(!seen.has(node.selector),'Duplicate selector block: '+node.selector);seen.add(node.selector)}else if(node.nodes)check(node)}}check(css)
const component=await readFile('src/components/demos/BrandCatalog.tsx','utf8')
assert(!component.includes('JSON.stringify'));assert(component.includes('expanded&&')&&component.includes('spec.sections||{}'))
const source=await readFile('src/components/demos/BrandSourceNotes.tsx','utf8');assert(!source.includes('JSON.stringify'))
await mkdir('artifacts/brand-v21',{recursive:true})
await writeFile('artifacts/brand-v21/presentation-audit.json',JSON.stringify({coverage,fontAssets:p.brandFontAssets,brands:rows},null,2)+'\n')
console.log('PASS: source-backed presentation, font/license/asset integrity, CSS uniqueness',coverage)
