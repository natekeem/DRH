import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdir,writeFile} from 'node:fs/promises'
const require=createRequire(import.meta.url)
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const sharp=require(process.env.SHARP_PATH||'sharp')
const base=process.env.DRH_URL||'http://127.0.0.1:5174',out='artifacts/brand-fidelity'
const canaries=["apple","airbnb","notion","linear.app","stripe","vercel","spotify","ferrari","nintendo-2001","binance","tesla","figma"]
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const report={cards:[],details:[],errors:[],external:[],allBrandGeometry:[],offscreen:false,offline:false,reducedMotion:false}
try {
 for(const [width,height] of [[1920,1080],[1440,1000],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce'})
  const page=await context.newPage()
  page.on('pageerror',e=>report.errors.push(e.message))
  page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))report.external.push(r.url())})
  await page.goto(base+'/tests/brand-designs/index.html')
  const tiles=[],blind=[]
  for(const slug of canaries){
   const card=page.locator('.reference-card').filter({has:page.locator('a[href="/reference/admd-'+slug+'"]')})
   await card.scrollIntoViewIfNeeded()
   const el=card.locator('.brand-card');await el.waitFor()
   const metrics=await el.evaluate(e=>{const box=e.getBoundingClientRect(),children=[...e.firstElementChild.children].map(x=>({tag:x.className,rect:x.getBoundingClientRect().toJSON()}));return {brand:e.dataset.brand,layout:e.dataset.layout,height:e.clientHeight,content:e.firstElementChild.scrollHeight,width:e.clientWidth,scrollWidth:e.scrollWidth,children,box:box.toJSON()}})
   assert(metrics.content<=metrics.height+2,slug+' vertical clipping '+width)
   assert(metrics.scrollWidth<=metrics.width+2,slug+' horizontal clipping '+width)
   for(const child of metrics.children)assert(child.rect.bottom<=metrics.box.bottom+2,slug+' child outside '+child.tag)
   report.cards.push({viewportWidth:width,...metrics})
   const path=out+'/card-'+slug+'-'+width+'.png';await el.screenshot({path});tiles.push(path)
   await el.locator('.brand-identifier').evaluate(e=>e.style.visibility='hidden')
   const masked=out+'/blind-'+slug+'-'+width+'.png';await el.screenshot({path:masked});blind.push(masked)
   await el.locator('.brand-identifier').evaluate(e=>e.style.visibility='')
  }
  for(const [name,paths] of [['canaries',tiles],['blind',blind]]){
   const meta=await sharp(paths[0]).metadata(),w=meta.width,h=meta.height
   await sharp({create:{width:w*4,height:h*3,channels:3,background:'#dddddd'}}).composite(await Promise.all(paths.map(async(path,i)=>({input:await sharp(path).resize(w,h).toBuffer(),left:(i%4)*w,top:Math.floor(i/4)*h})))).png().toFile(out+'/'+name+'-'+width+'.png')
  }
  assert(new Set(report.cards.filter(r=>r.viewportWidth===width).map(r=>r.children.map(c=>c.tag).join('|'))).size>=8,'Rendered DOM composition collapse')
  await page.goto(base+'/tests/brand-designs/index.html?all');await page.locator('.brand-card').first().waitFor()
  await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(100)
  assert.equal(await page.locator('.reference-card').first().locator('.brand-card').count(),0,'Offscreen unmount');report.offscreen=true
  for(const slug of canaries){
   await page.goto(base+'/#/reference/admd-'+slug)
   await page.locator('.brand-detail-modules .brand-hierarchy').waitFor()
   await page.waitForFunction(()=>document.querySelectorAll('.brand-detail-modules details').length>4)
   const el=page.locator('.brand-detail');await el.locator('.brand-composition').scrollIntoViewIfNeeded()
   await el.locator('.brand-composition').screenshot({path:out+'/detail-'+slug+'-'+width+'.png'})
   if(width===390)await page.screenshot({path:out+'/page-'+slug+'-390.png'});
   await page.getByRole('button',{name:'Primary →',exact:true}).focus();await page.keyboard.press('Enter')
   assert.equal(await page.getByRole('button',{name:'선택됨 ✓',exact:true}).getAttribute('aria-pressed'),'true')
   await page.getByRole('button',{name:'Secondary',exact:true}).click()
   if(slug==='airbnb'){await page.getByRole('textbox',{name:'스페시먼 검색'}).fill('Seoul');assert((await page.getByRole('status').innerText()).includes('Seoul'))}
   assert((await page.locator('.brand-type-provenance').innerText()).includes('Declared:'))
   if(slug==='apple'||slug==='stripe'){await page.locator('.brand-type-provenance').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/typography-'+slug+'-'+width+'.png'})}
   const over=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)
   assert(over<=1,slug+' detail page overflow '+width+': '+over)
   const geometry=await el.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,height:e.clientHeight}))
   assert(geometry.scrollWidth<=geometry.width+1,slug+' detail internal overflow '+width)
   assert.equal(await page.locator('.workspace-demo').evaluate(e=>getComputedStyle(e).overflowY),'visible')
   report.details.push({slug,viewportWidth:width,...geometry,keyboard:true})
  }
  const thumbs=await Promise.all(canaries.map(async(slug,i)=>({input:await sharp(out+'/detail-'+slug+'-'+width+'.png').resize(360,300,{fit:'contain',background:'#ddd'}).toBuffer(),left:(i%4)*360,top:Math.floor(i/4)*300})))
  await sharp({create:{width:1440,height:900,channels:3,background:'#ddd'}}).composite(thumbs).png().toFile(out+'/details-'+width+'.png')
  report.reducedMotion=await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)
  await context.setOffline(true)
  await page.getByRole('button',{name:'Primary →',exact:true}).click();assert.equal(await page.getByRole('button',{name:'선택됨 ✓',exact:true}).getAttribute('aria-pressed'),'true');report.offline=true
  await context.close()
 }
 const page=await browser.newPage({viewport:{width:1920,height:1080}})
 await page.goto(base+'/tests/brand-designs/index.html?all')
 await page.locator('.reference-card').first().waitFor()
 assert.equal(await page.locator('.reference-card').count(),74)
 for(let i=0;i<74;i++){
  const el=page.locator('.reference-card').nth(i);await el.scrollIntoViewIfNeeded();await el.locator('.brand-card').waitFor()
  const metric=await el.locator('.brand-card').evaluate(e=>({slug:e.dataset.brand,height:e.clientHeight,content:e.firstElementChild.scrollHeight,width:e.clientWidth,scrollWidth:e.scrollWidth}))
  assert(metric.content<=metric.height+2,metric.slug+' all-brand vertical clipping');assert(metric.scrollWidth<=metric.width+1,metric.slug+' all-brand horizontal clipping');report.allBrandGeometry.push(metric)
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[])
 console.log('PASS: 36 Canary Card + 36 Detail checks; 74 automated geometry checks; masked sheets; reduced motion, keyboard, touch, offline, offscreen')
}finally{await writeFile(out+'/browser-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
