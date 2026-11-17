// Optional network verification of the pinned review; never repins to HEAD.
import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import assert from 'node:assert/strict'
const sources=JSON.parse(await readFile('docs/licenses/batch1/sources.json','utf8'))
async function get(url){const r=await fetch(url,{headers:{'User-Agent':'DRH-source-review'}});assert(r.ok,r.status+' '+url);return r.text()}
const results=await Promise.allSettled(sources.map(async source=>{
 const raw=`https://raw.githubusercontent.com/${source.repository}/${source.commit}/`
 assert.equal(await get(raw+source.licensePath),await readFile('docs/licenses/batch1/'+source.localLicense,'utf8'))
 for(const file of source.reviewedFiles)assert.equal(createHash('sha256').update(await get(file.url)).digest('hex'),file.sha256)
 const tree=JSON.parse(await get(`https://api.github.com/repos/${source.repository}/git/trees/${source.commit}?recursive=1`))
 assert(!tree.truncated,'Complete source tree required')
 const notices=tree.tree.filter(n=>n.type==='blob'&&/^(?:notice|copyright)(?:\.[^/]*)?$/i.test(n.path))
 assert.equal(notices.length,0,source.repository+' has a root NOTICE/COPYRIGHT requiring preservation: '+notices.map(n=>n.path).join(', '))
 return source.repository+'@'+source.commit+': exact LICENSE, reviewed file hashes; no separate root NOTICE/COPYRIGHT'
}))
for(const result of results){if(result.status==='fulfilled')console.log('PASS '+result.value);else{console.error(result.reason);process.exitCode=1}}
