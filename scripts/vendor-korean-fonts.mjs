import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const commit='7aeb0698819be2b4097dae8ec8fe6a795e5cf3ae'
const base=`https://raw.githubusercontent.com/orioncactus/pretendard/${commit}/`
const sourceUrl=base+'packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',evidenceUrl=base+'LICENSE'
const get=async url=>{const r=await fetch(url);if(!r.ok)throw Error(url+': '+r.status);return Buffer.from(await r.arrayBuffer())}
const license=await get(evidenceUrl)
if(!license.toString().includes('SIL OPEN FONT LICENSE Version 1.1'))throw Error('License not verified')
const bytes=await get(sourceUrl),dir='public/fonts/brand/pretendard'
await mkdir(dir,{recursive:true});await writeFile(dir+'/font.woff2',bytes);await writeFile(dir+'/OFL.txt',license)
const registry=JSON.parse(await readFile('src/data/brandFontAssets.json','utf8')).filter(f=>f.family!=='Pretendard')
registry.push({family:'Pretendard',kind:'open-font',localFamily:'Pretendard',src:'fonts/brand/pretendard/font.woff2',sourceUrl,evidenceUrl,license:'SIL OFL 1.1',licensePath:'fonts/brand/pretendard/OFL.txt',commit,sha256:createHash('sha256').update(bytes).digest('hex'),variable:true})
await writeFile('src/data/brandFontAssets.json',JSON.stringify(registry,null,2)+'\n')
await writeFile('src/components/demos/brandFonts.css',registry.map(f=>`@font-face{font-family:"${f.localFamily}";src:url("/${f.src}") format("${f.src.endsWith('.woff2')?'woff2':'truetype'}");font-style:normal;font-weight:${f.variable?'100 900':'400'};font-display:swap;}`).join('\n')+'\n')
console.log('Verified Pretendard variable:',bytes.length,'bytes')
