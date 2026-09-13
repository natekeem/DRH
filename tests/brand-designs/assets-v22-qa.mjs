import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5176',out='artifacts/brand-v22'
const inventory=JSON.parse(await readFile(out+'/korean-source-inventory.json','utf8')).entries.filter(e=>e.status==='IMPORTED')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const report={fonts:[],logos:[],external:[],errors:[],links:[]}
try{
 for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000}}),page=await context.newPage()
 page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))report.external.push(r.url())})
 for(const slug of [...inventory.map(e=>e.slug),'linear.app','vercel','supabase']){
  await page.goto(base+'/#/reference/admd-'+slug);const detail=page.locator('.bc-detail[data-full-spec=true]');await detail.waitFor();await page.evaluate(()=>document.fonts.ready)
  const g=await detail.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth}));assert(g.scrollWidth<=g.width+1,slug+' mobile width')
  const type=detail.locator('.bc-type').first();await type.scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready)
  const session=await context.newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');const {root}=await session.send('DOM.getDocument');const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.bc-type .bc-type-scroll span'})
  const fonts=await session.send('CSS.getPlatformFontsForNode',{nodeId}),text=await type.locator('.bc-type-scroll').innerText(),kind=await type.getAttribute('data-font-kind')
  if(kind==='open-font')assert(fonts.fonts.some(f=>f.isCustomFont),slug+' font not actually loaded')
  if(inventory.some(e=>e.slug===slug)){assert(text.includes('브랜드'));if(kind==='open-font')assert(fonts.fonts.every(f=>f.isCustomFont),slug+' Hangul silently fell back')}
  report.fonts.push({slug,width,kind,text,...fonts});
  for(let i=1;i<await detail.locator('.bc-type').count();i++){
   const role=detail.locator('.bc-type').nth(i),roleKind=await role.getAttribute('data-font-kind');if(roleKind!=='open-font')continue
   const found=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.bc-type:nth-child('+(i+1)+') .bc-type-scroll span'}),actual=await session.send('CSS.getPlatformFontsForNode',{nodeId:found.nodeId})
   assert(actual.fonts.some(f=>f.isCustomFont),slug+' declared open role not loaded');if(inventory.some(e=>e.slug===slug))assert(actual.fonts.every(f=>f.isCustomFont),slug+' mixed Korean fallback')
   report.fonts.push({slug,width,role:await role.locator('h5').innerText(),kind:roleKind,...actual})
  }
  await session.detach()
  if(width===390)await detail.screenshot({path:out+'/typography-'+slug+'-390.png'})
  for(const a of await detail.locator('.bc-resources a').all()){assert.equal(await a.getAttribute('target'),'_blank');assert((await a.getAttribute('rel')).includes('noreferrer'));report.links.push({slug,width,href:await a.getAttribute('href'),label:await a.innerText()})}
  const logo=detail.locator('.bc-identifier img');if(await logo.count()){
   const info=await logo.evaluate(e=>({src:e.currentSrc,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,alt:e.alt,fit:getComputedStyle(e).objectFit,filter:getComputedStyle(e).filter}));assert(info.naturalWidth>0&&info.naturalHeight>0&&info.alt===''&&info.fit==='contain'&&info.filter==='none');report.logos.push({slug,width,...info})
   await detail.evaluate(e=>e.scrollTop=0);await detail.screenshot({path:out+'/logo-'+slug+'-'+width+'.png'})
  }
 }
 await context.close()
 }
 assert.equal(report.errors.length,0);assert.equal(report.external.length,0)
}finally{await browser.close();await writeFile(out+'/assets-browser-qa.json',JSON.stringify(report,null,2)+'\n')}
console.log('PASS actual platform fonts, Hangul/Latin, local logos, links, responsive dimensions')
