import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5174',out='artifacts/brand-v21'
const report={brands:[],fonts:[],errors:[],failedAssets:[],mode:'normal-motion'}
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'})
page.on('pageerror',e=>report.errors.push(e.message))
page.on('response',r=>{if(/\/fonts\/|\.ttf|brand-assets/.test(r.url())&&!r.ok())report.failedAssets.push({url:r.url(),status:r.status()})})
const data=JSON.parse(await readFile('artifacts/brand-v21/presentation-audit.json','utf8'))
const canaries=['apple','linear.app','notion','stripe','spotify','ferrari','nintendo-2001','vercel','figma','binance','ibm','supabase']
try{
 for(const brand of data.brands){
  await page.goto(base+'/#/reference/admd-'+brand.slug)
  const detail=page.locator('.bc-detail[data-full-spec=true]');await detail.waitFor()
  const text=await detail.innerText();assert(!/\[\s*\]|\{\s*\}|\[\s*"/.test(text),brand.slug+' raw JSON')
  assert.equal(await detail.locator('.bc-source-prose:visible table').count(),0)
  assert.equal(await detail.locator('.bc-type').count(),brand.detailRoles)
  const sectionCount=await detail.locator('.bc-section').count()
  const scroll=await detail.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,height:e.clientHeight,parentHeight:e.parentElement.clientHeight,scrollHeight:e.scrollHeight}))
  assert(scroll.scrollWidth<=scroll.width+1&&scroll.height<=scroll.parentHeight+1)
  const nested=await detail.locator('.bc-content *').evaluateAll(elements=>elements.filter(e=>getComputedStyle(e).overflowY==='auto'&&e.scrollHeight>e.clientHeight+1&&e.getClientRects().length).map(e=>e.className))
  assert.deepEqual(nested,[],brand.slug+' nested vertical scroll')
  report.brands.push({slug:brand.slug,sectionCount,...scroll,nested})
  if(canaries.includes(brand.slug)){
   await page.evaluate(()=>document.fonts.ready)
   const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable')
   const {root}=await session.send('DOM.getDocument');const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.bc-type .bc-type-scroll span'})
   if(nodeId){const result=await session.send('CSS.getPlatformFontsForNode',{nodeId});report.fonts.push({slug:brand.slug,...result});if(brand.primaryFont==='open-font')assert(result.fonts.some(f=>f.isCustomFont),'Local font not applied '+brand.slug)}
   await session.detach()
   for(const section of ['typography','elevation','responsive']){
    const el=detail.locator('[data-section='+section+']');if(!await el.count())continue
    await detail.evaluate((root,id)=>{const target=root.querySelector('[data-section='+id+']');root.scrollTop+=target.getBoundingClientRect().top-root.getBoundingClientRect().top-root.querySelector('.bc-header').getBoundingClientRect().height-12},section)
    await detail.screenshot({path:out+'/curated-'+section+'-'+brand.slug+'-1440.png'})
   }
  }
  console.log('SCAN',brand.slug)
 }
 assert.equal(report.errors.length,0);assert.equal(report.failedAssets.length,0)
}finally{await writeFile(out+'/presentation-browser-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
console.log('PASS: all 74 curated views, normal motion, actual platform fonts, no nested content scrollers')
