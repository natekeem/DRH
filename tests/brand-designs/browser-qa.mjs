import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdir,writeFile} from 'node:fs/promises'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5174',out='artifacts/v1.7.1'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({channel:'msedge',headless:true})
const report={screens:[],cards:[],geometry:[],errors:[],externalBrandRequests:[]}
try {
 for(const [width,height] of [[1920,1080],[1440,1000],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390})
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message))
  const shot=async name=>{const path=`${out}/${name}-${width}.png`;await page.screenshot({path});report.screens.push(path)}
  const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page horizontal overflow')
  await page.goto(base+'/tests/brand-designs/index.html')
  await page.locator('.brand-card').first().waitFor()
  for(let i=0;i<10;i++){
   const card=page.locator('.reference-card').nth(i);await card.scrollIntoViewIfNeeded()
   const metrics=await card.locator('.brand-card').evaluate(el=>({brand:el.dataset.brand,height:el.clientHeight,contentHeight:el.firstElementChild.scrollHeight,layout:el.dataset.layout}))
   assert(metrics.contentHeight<=metrics.height+2,`${metrics.brand}: card clipping at ${width}`);report.cards.push({width,...metrics})
   if(width===390)await shot(`canary-${metrics.brand}`)
  }
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/canaries-${width}.png`,fullPage:true});await noOverflow()
  if(width===1920){await page.addStyleTag({content:'.brand-composition h3{color:transparent!important}.card-meta h3{visibility:hidden}'});await shot('canaries-masked')}
  for(const slug of ['apple','ferrari','airbnb','binance','nintendo-2001']){
   const network=[];const listener=r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))network.push(r.url())};page.on('request',listener)
   await page.goto(`${base}/#/reference/admd-${slug}`)
   await page.locator('.brand-detail-modules .brand-hierarchy').waitFor()
   await page.waitForFunction(()=>document.querySelectorAll('.brand-hierarchy>div').length>2)
   await page.locator('.workspace-demo').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-120));await shot(`detail-${slug}`)
   await page.getByRole('button',{name:'Primary →',exact:true}).click();assert.equal(await page.getByRole('button',{name:'선택됨 ✓',exact:true}).getAttribute('aria-pressed'),'true')
   await page.getByRole('button',{name:'Secondary',exact:true}).click()
   assert(await page.locator('.brand-type-provenance').innerText().then(t=>t.includes('Rendered with:')&&t.includes('Declared:')))
   await page.locator('.brand-type-provenance').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-120));await shot(`detail-${slug}-tokens`)
   assert.equal(await page.locator('.workspace-demo').evaluate(e=>getComputedStyle(e).overflowY),'visible')
   await noOverflow();page.off('request',listener);report.externalBrandRequests.push(...network)
  }
  await page.goto(base+'/#/guides');await page.locator('.guide-library').waitFor();await shot('guide-index');await noOverflow()
  const articleHash=await page.locator('.guide-card').first().getAttribute('href');
  const shell=await page.locator('.guides-page').boundingBox();assert(shell.width<=1281)
  if(width===1920)for(const count of [2,3,4]){await page.evaluate(n=>{const g=document.querySelector('.guide-library');while(g.children.length>n)g.lastElementChild.remove();while(g.children.length<n)g.append(g.firstElementChild.cloneNode(true))},count);await shot(`guide-count-${count}`)}
  await page.goto(base+'/'+articleHash);await page.locator('.guide-markdown h2').first().waitFor();await shot('guide-article');await noOverflow()
  const rail=await page.locator('.guide-rail').evaluate(e=>({width:e.getBoundingClientRect().width,overflow:getComputedStyle(e).overflowY,position:getComputedStyle(e).position}))
  if(width>=1200)assert.equal(rail.width,280);assert.equal(rail.overflow,'visible');report.geometry.push({width,rail})
  await page.locator('.guide-rail nav a').first().click();await page.waitForTimeout(100)
  await page.goto(base+'/#/explore');await page.locator('.reference-grid .reference-card').first().scrollIntoViewIfNeeded();await shot('explore-grouping');await noOverflow()
  assert.equal(await page.locator('.reference-grid').evaluate(e=>getComputedStyle(e).rowGap),'40px')
  await page.goto(base+'/#/collections');await page.locator('.collection-strip').first().scrollIntoViewIfNeeded();await shot('collections');await noOverflow()
  await page.goto(base+'/#/');
  for(const id of ['shader-gradient','liquid-lens-effect']){
   const card=page.locator('.spotlight-grid .reference-card').filter({has:page.locator(`a[href="#/reference/${id}"]`)})
   await card.scrollIntoViewIfNeeded();await page.waitForTimeout(600);await shot(`home-${id}`)
   if(id==='liquid-lens-effect'){
    const preview=await card.locator('.card-demo').boundingBox(),demo=await card.locator('.drh-advanced').boundingBox()
    assert(preview.height>100&&demo.height>100,'large preview must not collapse');assert(Math.abs(preview.height-demo.height)<=2,'large liquid lens must fill parent');report.geometry.push({width,homeLens:{parent:preview.height,child:demo.height}})
   }
  }
  await page.goto(base+'/#/explore?search=Liquid%20Lens');const lens=page.locator('.reference-card').filter({has:page.locator('a[href="#/reference/liquid-lens-effect"]')});await lens.scrollIntoViewIfNeeded();await shot('explore-lens')
  const p=await lens.locator('.card-demo').boundingBox(),d=await lens.locator('.drh-advanced').boundingBox();assert(Math.abs(p.height-d.height)<=2)
  assert(Math.abs(p.width/p.height-5/3)<.02)
  await page.goto(base+'/#/reference/liquid-lens-effect');await page.locator('.workspace-demo').scrollIntoViewIfNeeded();await shot('detail-lens')
  const wp=await page.locator('.workspace-demo').boundingBox(),wd=await page.locator('.workspace-demo .drh-advanced').boundingBox();assert(Math.abs(wp.height-wd.height)<=2)
  await page.locator('.workspace-related').scrollIntoViewIfNeeded();await shot('related');const related=await page.locator('.workspace-related .card-demo').first().boundingBox();assert(Math.abs(related.width/related.height-5/3)<.02)
  await context.close()
 }
 const page=await browser.newPage({viewport:{width:1920,height:1080}})
 await page.goto(base+'/tests/brand-designs/index.html?all')
 assert.equal(await page.locator('.reference-card').count(),74)
 for(let i=0;i<74;i++){
  const card=page.locator('.reference-card').nth(i);await card.scrollIntoViewIfNeeded()
  const metrics=await card.locator('.brand-card').evaluate(e=>({brand:e.dataset.brand,height:e.clientHeight,contentHeight:e.firstElementChild.scrollHeight}))
  assert(metrics.contentHeight<=metrics.height+2,`${metrics.brand}: all-brand clipping`)
  report.cards.push({width:1920,all:true,...metrics})
  if(i%10===0||i===73)await page.screenshot({path:`${out}/all-brands-${i}.png`})
 }
 assert.equal(report.externalBrandRequests.length,0,'Brand specimens must be offline')
 assert.deepEqual(report.errors,[])
 console.log(`PASS: ${report.cards.length} card checks, 15 detail interactions, all requested viewports and layouts`)
} finally {await writeFile(out+'/browser-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
