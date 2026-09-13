// Explicit live evidence refresh; never runs as part of build or static audits.
import {readFile,writeFile,mkdir} from 'node:fs/promises'
const registry=JSON.parse(await readFile('src/data/brandOfficialResources.json','utf8'))
const queue=Object.entries(registry).flatMap(([brand,links])=>links.map(link=>({brand,...link}))),results=[]
const attr=(tag,name)=>tag.match(new RegExp('\\b'+name+'=["\']([^"\']+)["\']','i'))?.[1]
async function check(item){
 const chain=[];let url=item.url
 try{
  for(let i=0;i<10;i++){
   const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(18000),headers:{'User-Agent':'DRH-Official-Resource-Verification/2.2'}})
   chain.push({url,status:r.status,location:r.headers.get('location')})
   if(r.status>=300&&r.status<400&&r.headers.get('location')){url=new URL(r.headers.get('location'),url).href;continue}
   const html=await r.text(),canonicalTag=[...html.matchAll(/<link\b[^>]*>/gi)].map(m=>m[0]).find(t=>attr(t,'rel')?.toLowerCase()==='canonical')
   return {brand:item.brand,requestedUrl:item.url,status:r.status,redirectChain:chain,finalUrl:url,canonical:canonicalTag?new URL(attr(canonicalTag,'href'),url).href:null,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g,' ').trim()||null,headings:[...html.matchAll(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi)].slice(0,12).map(m=>m[1].replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()),officialDomain:new URL(url).hostname,checkedAt:new Date().toISOString(),reviewRequired:!r.ok||!html.match(/<title/i)}
  }throw Error('Redirect limit')
 }catch(e){return {brand:item.brand,requestedUrl:item.url,redirectChain:chain,finalUrl:url,error:e.message,checkedAt:new Date().toISOString(),reviewRequired:true}}
}
await Promise.all(Array.from({length:6},async()=>{while(queue.length){const item=queue.shift(),result=await check(item);results.push(result);console.log(item.brand,result.status||result.error)}}))
await mkdir('artifacts/brand-v22',{recursive:true})
await writeFile('artifacts/brand-v22/official-resource-live.json',JSON.stringify(results.sort((a,b)=>a.brand.localeCompare(b.brand)||a.requestedUrl.localeCompare(b.requestedUrl)),null,2)+'\n')
