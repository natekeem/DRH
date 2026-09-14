import assert from 'node:assert/strict'
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises'
import {resolve} from 'node:path'
import {createHash} from 'node:crypto'
import {build} from 'esbuild'
const bundle=await build({stdin:{contents:`export * from './src/lib/brandCatalog';export * from './src/lib/brandComponentStyle';export * from './src/lib/referenceHandoff';export {resolveArtifacts} from './src/lib/artifacts';export {references,vendorEntryBySlug} from './src/data/references'`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'raw',setup(b){b.onResolve({filter:/\?raw$/},a=>({path:resolve(a.resolveDir,a.path.replace('?raw','')),namespace:'raw'}));b.onLoad({filter:/.*/,namespace:'raw'},async a=>({contents:await readFile(a.path,'utf8'),loader:'text'}))}}]})
const p=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'))
const report={brands:[],handoffs:[],guideLinks:[],negativeCases:0}
for(const item of p.references){
 const artifacts=p.resolveArtifacts(item),h=p.buildReferenceHandoff(item,artifacts)
 assert.equal(h.agent.extended,artifacts.agent?.extended);assert.equal(h.agent.compact,artifacts.agent?.compact)
 assert(h.agent.applyPrompt.length<1000);assert(h.agent.applyPrompt.includes('390px / 1440px'))
 assert.equal(h.schemaVersion,1);assert.equal(JSON.parse(JSON.stringify(h)).id,item.id)
 if(h.designMd?.path){const raw=await readFile('public/'+h.designMd.path);const sha=createHash('sha256').update(raw).digest('hex');if(h.designMd.sha256)assert.equal(sha,h.designMd.sha256);assert(!h.designMd.text,'No loading placeholder in portable contract');assert(h.experience?.scene);assert.equal(h.experience.componentGroups.length,6);assert(h.experience.disclaimer.includes('공식 제품 화면이 아닌'));report.handoffs.push({id:h.id,scene:h.experience.scene,path:h.designMd.path,sha256:sha,revision:h.source.revision,promptLength:h.agent.applyPrompt.length})}
 if(!item.demo.startsWith('vendor-design-md:'))continue
 const entry=p.vendorEntryBySlug[item.demo.slice('vendor-design-md:'.length)],spec=JSON.parse(await readFile('public/brand-design-specs/'+entry.slug+'.json','utf8')),before=JSON.stringify(spec),c=p.buildBrandCatalog(entry,spec)
 const roles={},unknown=[]
 for(const component of c.components){roles[component.kind]=(roles[component.kind]||0)+1;if(component.kind==='other')unknown.push(component.key);const css=p.resolveComponentStyle(component.values,c,c.themes[0]);assert(!/url\(|expression\(|javascript:|<script/i.test(JSON.stringify(css)));assert(Object.values(css).every(v=>typeof v==='string'||typeof v==='number'))}
 assert.equal(JSON.stringify(spec),before)
 report.brands.push({slug:entry.slug,roles,unknown,total:c.components.length})
}
const c=p.buildBrandCatalog(p.vendorEntryBySlug.coinbase,JSON.parse(await readFile('public/brand-design-specs/coinbase.json','utf8'))),theme=c.themes[0]
for(const [key,kind]of [['hero-band-dark','hero'],['hero-band-light','hero'],['pricing-tier-featured','pricing'],['cta-band-dark','cta-band'],['asset-icon-circular','icon'],['legal-band','legal']])assert.equal(c.components.find(v=>v.key===key).kind,kind)
const hero=p.resolveComponentStyle(c.spec.components['hero-band-dark'],c,theme),preview=p.projectComponentStyle(hero,true)
assert.equal(hero.fontSize,'80px');assert.equal(hero.padding,'96px');assert.equal(hero.lineHeight,1);assert.equal(preview.fontSize,'clamp(12px, 80px, 40px)');assert.equal(preview.padding,'min(96px, 32px)')
assert.equal(p.resolveComponentStyle({boxShadow:'rgba(0,0,0,0.3) 0px 8px 8px'},c,theme).boxShadow,'0px 8px 8px rgba(0,0,0,0.3)')
assert.equal(p.resolveComponentStyle({typography:{textTransform:'uppercase'}},c,theme).textTransform,'uppercase')
const result=p.resolveComponentStyle({bg:'{colors.primary}',fg:'white',radius:12,padding:'0 22px',font:'16px / 700 / 24px',border:'0 0 1px #e6e6e6'},c,theme)
assert.equal(result.backgroundColor,'#0052ff');assert.equal(result.fontSize,'16px');assert.equal(result.fontWeight,700);assert.equal(result.lineHeight,1.5);assert.equal(result.borderWidth,'0px 0px 1px');assert.equal(result.borderStyle,'solid')
assert.equal(p.resolveComponentStyle({typography:'{typography.display-mega}'},c,theme).fontSize,'80px')
assert.equal(p.resolveComponentStyle({border:'none'},c,theme).borderStyle,'none')
assert.equal(p.resolveComponentStyle({borderColor:'#eeeeee'},c,theme).borderWidth,'1px')
for(const malicious of ['url(https://example.com/a)','red; background:url(x)','expression(alert(1))','{colors.missing}','var(--missing)','calc(1px + url(x))']){const css=p.resolveComponentStyle({bg:malicious,fg:malicious,padding:malicious,border:malicious,boxShadow:malicious,font:malicious},c,theme);assert.deepEqual(css,{});report.negativeCases++}
const baemin=p.buildBrandCatalog(p.vendorEntryBySlug.baemin,JSON.parse(await readFile('public/brand-design-specs/baemin.json','utf8')))
assert(baemin.components.every(v=>v.kind==='buttons'));assert.equal(p.resolveComponentStyle(baemin.spec.components['app-download-card'],baemin,baemin.themes[0]).fontSize,'13.3333px')
const guides=await readdir('src/content/guides'),slugs=new Set(guides.filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)))
async function scan(dir){for(const item of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+item.name;if(item.isDirectory()){if(item.name!=='data')await scan(path)}else if(/\.(tsx?|md)$/.test(path)){for(const match of (await readFile(path,'utf8')).matchAll(/\/guides\/([a-z][\w-]*)/g)){assert(slugs.has(match[1]),'Stale guide: '+path+' '+match[1]);report.guideLinks.push({path,slug:match[1]})}}}}
await scan('src')
const css=await readFile('src/components/demos/vendorDesignPreview.css','utf8'),sample=await readFile('src/components/demos/BrandComponentSample.tsx','utf8'),applied=await readFile('src/components/demos/BrandAppliedPreview.tsx','utf8')
assert(!css.includes('var(--bc-border)'));assert(!css.includes('border-bottom:1px solid currentColor'));assert(!/Sample surface|Design in the details\.|Sample field/.test(sample));assert(applied.includes('resolveComponentStyle')&&applied.includes('experienceScene')&&applied.includes('data-evidence="drh-scaffolding"'));assert(!/<img|https:\/\//.test(applied))
await mkdir('artifacts/brand-v24',{recursive:true});await writeFile('artifacts/brand-v24/fidelity-audit.json',JSON.stringify(report,null,2)+'\n')
console.log('PASS brand fidelity:',report.brands.length,'brands,',report.handoffs.length,'raw handoffs,',p.references.length,'artifact parity checks,',report.negativeCases,'unsafe/unresolved inputs rejected')
