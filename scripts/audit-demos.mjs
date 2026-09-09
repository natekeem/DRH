import assert from 'node:assert/strict'
import {demoModule} from './demo-module.mjs'
import {build} from 'esbuild'
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
