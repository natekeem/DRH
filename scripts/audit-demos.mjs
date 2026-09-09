import assert from 'node:assert/strict'
import {demoModule} from './demo-module.mjs'
import {build} from 'esbuild'
import {readFile} from 'node:fs/promises'
const {references,recipes,recipeHtml,densityPolicy,starterCodeFor,buildAgentPackage,demoMaturity}=await demoModule()
const allow=[['glass-card','style-glass'],['liquid-lens','liquid-lens-effect','style-liquid'],['spotlight','spotlight-background']]
const entries=Object.entries(recipes)
for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
 const [a,x]=entries[i],[b,y]=entries[j]
 if(x===y||(x.html===y.html&&x.css===y.css&&x.js===y.js))assert(allow.some(group=>group.includes(a)&&group.includes(b)),`Unintentional alias: ${a} / ${b}`)
}
for(const [key,recipe] of entries){
 assert(['density-sensitive','scale-sensitive','fixed-object'].includes(densityPolicy(key)),key+' policy')
 assert(recipe.logic&&recipe.acceptance,key+' contract')
 for(const variant of ['card','detail']){
  const html=recipeHtml(key,{variant});assert(html.includes('data-variant="'+variant+'"'))
  for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(script[1])
 }
 for(const ref of references.filter(r=>r.demo===key&&r.license.status==='copy-ok'&&!r.designMd&&!r.artifacts)){
  assert.equal(starterCodeFor(ref),recipeHtml(key),key+' export drift')
  assert(buildAgentPackage(ref).includes(recipe.logic),key+' package logic drift')
  assert.equal(demoMaturity(ref).kind,'working')
 }
}
assert(!recipes['fluid-cursor'],'Advanced fluid must not retain shadow recipe')
for(const key of ['parallax','tilt-card','magnetic-button','hover-lift','cursor-follow'])assert(!allow.some(a=>a.includes(key)))
console.log(`PASS: ${entries.length} recipes, identity/content aliases, card/detail policies, script syntax, export/package/maturity consistency`)
const headingBundle=await build({entryPoints:['src/lib/guideHeadings.ts'],bundle:true,write:false,platform:'node',format:'esm'})
const {guideHeadings}=await import('data:text/javascript;base64,'+Buffer.from(headingBundle.outputFiles[0].text).toString('base64'))
const markdown='## **한글** `Tokens`\n## Same\n## Same\n## Same-2\n```md\n## Excluded\n```\nSetext\n------\n### [Link](https://example.com)'
const headings=guideHeadings(markdown)
assert.deepEqual(headings.map(h=>h.id),['한글-tokens','same','same-2','same-2-2','setext','link'])
assert.deepEqual(guideHeadings(markdown),headings)
console.log('PASS: Markdown AST TOC, Korean slugs, duplicate/suffix collisions, fenced code, setext headings and inline labels')
const batch1=JSON.parse(await readFile('src/data/batch1Catalog.json','utf8'))
const sources=JSON.parse(await readFile('docs/licenses/batch1/sources.json','utf8'))
assert.equal(batch1.length,10)
assert.equal(new Set(batch1.map(r=>r.demo)).size,10)
assert.equal(batch1.filter(r=>r.category==='UI Patterns').length,5)
for(const item of batch1){
 const ref=references.find(r=>r.id===item.id),recipe=recipes[item.demo],html=recipeHtml(item.demo)
 assert(ref&&recipe,item.id)
 assert.equal(starterCodeFor(ref),html,item.id+' explicit HTML export parity')
 assert.equal(ref.artifacts.html.provenance.origin,'hub-original')
 assert.equal(demoMaturity(ref).kind,'working')
 assert(buildAgentPackage(ref).includes(recipe.logic)&&buildAgentPackage(ref).includes(recipe.sourceNotes))
 assert(recipe.acceptance.includes(item.canonicalAcceptance))
 assert(html.includes(recipe.notices.replaceAll('*/','* /')))
 assert(!/(?:src|href)=["']https?:|@import|url\(["']?https?:|\bfetch\(/i.test(html),item.id+' must be offline')
 if(item.repository){
  const source=sources.find(s=>s.repository===item.repository)
  assert(source&&/^[a-f0-9]{40}$/.test(source.commit))
  assert(source.reviewedFiles.every(f=>f.url.includes(source.commit)&&/^[a-f0-9]{64}$/.test(f.sha256)))
  const license=await readFile('docs/licenses/batch1/'+source.localLicense,'utf8')
  assert(license.includes('Permission is hereby granted')&&html.includes(license))
 }else assert(recipe.sourceNotes.includes(item.source.scope))
}
console.log('PASS: Batch 1 exact scope, canonical contracts, offline HTML, explicit export parity, package provenance and seven pinned MIT notices')
