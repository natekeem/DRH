import assert from 'node:assert/strict'
import {mkdtemp,mkdir,readFile,writeFile,readdir,copyFile,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {pathToFileURL} from 'node:url'
import {join,resolve} from 'node:path'
import {execFileSync} from 'node:child_process'
import {build} from 'esbuild'
const root=process.cwd(),sandbox=await mkdtemp(join(tmpdir(),'drh-brand-sync-'))
const slugs=(await readdir('public/vendor/awesome-design-md',{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>e.name).sort()
const result={vendors:slugs.length,offline:false,onlinePinned:false,idempotent:false,partialImportRejected:false}
try{
 await mkdir(join(sandbox,'scripts'),{recursive:true});await mkdir(join(sandbox,'src/data'),{recursive:true})
 for(const slug of slugs){await mkdir(join(sandbox,'public/vendor/awesome-design-md',slug),{recursive:true});await copyFile(join(root,'public/vendor/awesome-design-md',slug,'DESIGN.md'),join(sandbox,'public/vendor/awesome-design-md',slug,'DESIGN.md'))}
 await build({entryPoints:['scripts/sync-awesome-design-md.mjs'],outfile:join(sandbox,'scripts/sync.mjs'),bundle:true,platform:'node',format:'esm',banner:{js:"import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);"}})
 const mock=`import {readFile,readdir} from 'node:fs/promises';import {join} from 'node:path';globalThis.fetch=async(url,options={})=>{if(options.method==='HEAD')return new Response('',{status:404});if(url.includes('api.github.com')){if(!url.endsWith('?ref=8147538b4226ae41e2487a9179e3bcc1f68e8554'))throw new Error('Unpinned discovery');return Response.json((await readdir(join(process.env.FIXTURE_ROOT,'public/vendor/awesome-design-md'),{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>({name:e.name,type:'dir'})))}const slug=url.match(/design-md\\/([^/]+)\\/DESIGN.md$/)?.[1];if(!slug)throw new Error('Unexpected network '+url);if(process.env.FAIL_SLUG===slug)return new Response('',{status:500});return new Response(await readFile(join(process.env.FIXTURE_ROOT,'public/vendor/awesome-design-md',slug,'DESIGN.md'),'utf8'));};`
 await writeFile(join(sandbox,'mock.mjs'),mock)
 const run=(args=[],extra={})=>execFileSync(process.execPath,['--import',pathToFileURL(join(sandbox,'mock.mjs')).href,join(sandbox,'scripts/sync.mjs'),...args],{cwd:sandbox,env:{...process.env,FIXTURE_ROOT:root,...extra},stdio:'pipe'})
 const generated=()=>readFile(join(sandbox,'src/data/awesomeDesignMd.ts'),'utf8')
 run(['--offline']);const first=await generated();result.offline=true
 assert.equal(first,(await readFile('src/data/awesomeDesignMd.ts','utf8')).replace(/\r\n/g,'\n'))
 run(['--offline']);assert.equal(await generated(),first);result.idempotent=true
 run();assert.equal(await generated(),first);result.onlinePinned=true
 for(const slug of slugs)assert.deepEqual(JSON.parse(await readFile(join(sandbox,'public/brand-design-specs',slug+'.json'),'utf8')),JSON.parse(await readFile('public/brand-design-specs/'+slug+'.json','utf8')))
 assert.throws(()=>run([],{FAIL_SLUG:'apple'}));assert.equal(await generated(),first);result.partialImportRejected=true
 console.log('PASS: offline/online generation parity; pinned discovery; repeat stability; partial import rejects catalog replacement')
}finally{
 await mkdir('artifacts/brand-fidelity',{recursive:true});await writeFile('artifacts/brand-fidelity/sync-qa.json',JSON.stringify(result,null,2)+'\n')
 assert(resolve(sandbox).startsWith(resolve(tmpdir())+requireSeparator()) && sandbox.includes('drh-brand-sync-'))
 await rm(sandbox,{recursive:true,force:true})
}
function requireSeparator(){return process.platform==='win32'?'\\':'/'}
