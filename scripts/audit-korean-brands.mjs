import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {build} from 'esbuild'
import {parseYamlFrontmatter,brandSpec,compactBrandSpec} from './brand-design-spec.mjs'
const bundle=await build({entryPoints:['src/data/ohMyDesign.ts'],bundle:true,write:false,platform:'node',format:'esm'})
const {ohMyDesignEntries:entries}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'))
const inventory=JSON.parse(await readFile('artifacts/brand-v22/korean-source-inventory.json','utf8'))
assert((await readFile('third_party/oh-my-design/LICENSE','utf8')).includes('Copyright (c) 2026 oh-my-design'))
assert.equal(new Set(entries.map(e=>e.slug)).size,entries.length)
for(const e of entries){
 const bytes=await readFile(`public/vendor/oh-my-design/${e.slug}/DESIGN.md`),raw=bytes.toString(),p=parseYamlFrontmatter(raw)
 assert.equal(p.country,'KR');assert.equal(e.upstreamCommit,inventory.commit);assert.equal(e.upstreamRepo,inventory.repo)
 assert.equal(createHash('sha256').update(bytes).digest('hex'),e.rawSha256)
 assert.equal(inventory.entries.find(v=>v.slug===e.slug).quality.status,'verified_v2')
 const full=JSON.parse(await readFile(`public/brand-design-specs/${e.slug}.json`,'utf8'))
 assert.deepEqual(full,JSON.parse(JSON.stringify(brandSpec(p,raw,e.slug))))
 assert.deepEqual(e.spec,compactBrandSpec(full))
 assert(Object.keys(full.colors).length>=2&&Object.keys(full.typography).length&&Object.keys(full.components).length)
 assert(e.aliases.length&&e.aliases.every(a=>e.tags.includes(a)))
 assert.equal(full.brandAsset.type,'text-wordmark','Parser must not treat upstream favicon as licensed logo')
 for(const role of Object.values(full.typography))assert.equal(role.script,'ko')
}
// Units and multiple-surface ambiguity must survive adapter changes.
const p=parseYamlFrontmatter('---\nomd: "0.1"\ncountry: KR\ntokens:\n  typography:\n    family: {display: Proprietary, body: Pretendard}\n    caption: {size: 14, tracking: -0.3}\n---\n')
assert.equal(p.typography.caption.fontFamily,null);assert.equal(p.typography.caption.fontSize,'14px');assert.equal(p.typography.caption.letterSpacing,'-0.3px')
console.log(`PASS: ${entries.length} Korean raw/projection/provenance/alias/rights contracts`)
