// Explicit, pinned OFL font imports. Raw DESIGN.md and parser output are never changed.
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const commit='809e4d8b8d7e9364a914909bb777679606c178b8'
const families=[['inter','Inter'],['geist','Geist'],['geistmono','Geist Mono'],['ibmplexsans','IBM Plex Sans'],['ibmplexmono','IBM Plex Mono'],['jetbrainsmono','JetBrains Mono'],['dmsans','DM Sans'],['instrumentserif','Instrument Serif']]
const registry=[]
for(const [id,family] of families){
 const root=`https://raw.githubusercontent.com/google/fonts/${commit}/ofl/${id}/`
 const listing=await fetch(`https://api.github.com/repos/google/fonts/contents/ofl/${id}?ref=${commit}`).then(r=>r.json())
 if(!Array.isArray(listing))throw Error(JSON.stringify(listing))
 const file=listing.find(f=>f.name.endsWith('.ttf')&&!/Italic/.test(f.name)&&(/\[|Regular/.test(f.name)))
 if(!file)throw Error('No upright font: '+id)
 const license=await fetch(root+'OFL.txt').then(r=>{if(!r.ok)throw Error('License missing');return r.text()})
 if(!license.includes('SIL OPEN FONT LICENSE Version 1.1'))throw Error('Unverified license')
 const bytes=Buffer.from(await fetch(root+encodeURIComponent(file.name)).then(r=>{if(!r.ok)throw Error('Font missing');return r.arrayBuffer()}))
 const dir='public/fonts/brand/'+id;await mkdir(dir,{recursive:true})
 await writeFile(dir+'/font.ttf',bytes);await writeFile(dir+'/OFL.txt',license)
 registry.push({family,kind:'open-font',localFamily:family,src:'fonts/brand/'+id+'/font.ttf',sourceUrl:root+encodeURIComponent(file.name),license:'SIL OFL 1.1',evidenceUrl:root+'OFL.txt',licensePath:'fonts/brand/'+id+'/OFL.txt',commit,sha256:createHash('sha256').update(bytes).digest('hex'),variable:file.name.includes('wght')})
 console.log(family,bytes.length)
}
await writeFile('src/data/brandFontAssets.json',JSON.stringify(registry,null,2)+'\n')
await writeFile('src/components/demos/brandFonts.css',registry.map(f=>`@font-face{font-family:"${f.family}";src:url("/${f.src}") format("truetype");font-style:normal;font-weight:${f.variable?'100 900':'400'};font-display:swap;}`).join('\n')+'\n')
