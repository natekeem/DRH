import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
const registry=JSON.parse(await readFile('src/data/brandOfficialResources.json','utf8'))
const domains=JSON.parse(await readFile('src/data/brandOfficialResourceDomains.json','utf8'))
const types=['brand-guidelines','design-system','typography','developer-design-guide','components','assets','other']
const seen=new Set()
for(const [brand,links]of Object.entries(registry))for(const r of links){
 const url=new URL(r.url)
 assert(domains[brand]?.includes(url.hostname),brand+': unreviewed official host');assert.equal(url.protocol,'https:');assert(!url.username&&!url.password)
 assert(!seen.has(r.url),brand+': duplicate URL');seen.add(r.url)
 assert(types.includes(r.type)&&r.source==='official'&&r.label&&r.description)
 assert(/^\d{4}-\d{2}-\d{2}$/.test(r.checkedAt)&&!Number.isNaN(Date.parse(r.checkedAt)))
 assert(r.evidence.url===r.url&&r.evidence.title&&r.evidence.method)
}
console.log(`PASS: ${Object.keys(registry).length} brands, ${seen.size} curated official URLs; network verification is separate`)
