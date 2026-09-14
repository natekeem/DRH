import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5174',out='artifacts/brand-v24'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write'],hasTouch:true})
const page=await context.newPage(),report={cases:[],errors:[],external:[],interactions:[],offline:[]}
page.on('pageerror',e=>report.errors.push(e.message))
page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))report.external.push(r.url())})
const canaries=['apple','baemin','toss','kakaobank','linear.app','coinbase','spotify','ferrari','nintendo-2001','vercel']
const scenes=['product','commerce','finance','finance','workspace','finance','media','automotive','play','developer']
try{
 for(const [width,height]of [[1920,1080],[1440,1000],[390,844]]){
  await page.setViewportSize({width,height})
  for(const [i,slug]of canaries.entries()){
   await page.goto(base+'/#/reference/admd-'+slug)
   const root=page.locator(`.bc-detail[data-full-spec=true][data-brand="${slug}"]`);await root.locator('[data-section=resources]').waitFor()
   assert.deepEqual(await root.locator('.bc-experience>.bc-section').evaluateAll(els=>els.map(e=>e.dataset.section)),['overview','dna','library','applied','resources'])
   assert.equal(await root.locator('[data-kind=other]').count(),0)
   assert.equal(await page.locator('.reference-handoff').count(),1)
   assert(await page.locator('main').evaluate(e=>e.lastElementChild.classList.contains('reference-handoff')))
   const canvas=root.locator('.ap-canvas'),applied=root.locator('.bc-applied')
   assert.equal(await applied.getAttribute('data-scene'),scenes[i])
   assert((await applied.innerText()).includes('공식 제품 화면이 아닌 디자인 시스템 적용 예시입니다.'))
   const metrics=await root.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,pageWidth:document.documentElement.clientWidth,pageScroll:document.documentElement.scrollWidth,overflow:[...e.querySelectorAll('.ap-canvas,.bc-sample,.bc-composition,.ex-type-hierarchy>div')].filter(x=>x.scrollWidth>x.clientWidth+2).map(x=>({class:x.className,key:x.closest('[data-component]')?.dataset.component,width:x.clientWidth,scroll:x.scrollWidth}))}))
   assert(metrics.scrollWidth<=metrics.width+1,JSON.stringify(metrics));assert(metrics.pageScroll<=metrics.pageWidth+1,JSON.stringify(metrics));assert.deepEqual(metrics.overflow,[],slug+' '+width+' '+JSON.stringify(metrics.overflow))
   await root.locator('[data-section=dna]').screenshot({style:".site-header,.header-backdrop-rail{visibility:hidden}",path:`${out}/${slug}-dna-${width}.png`})
   await root.locator('[data-section=library]').screenshot({style:".site-header,.header-backdrop-rail{visibility:hidden}",path:`${out}/${slug}-library-${width}.png`})
   await applied.screenshot({style:".site-header,.header-backdrop-rail{visibility:hidden}",path:`${out}/${slug}-applied-${width}.png`})
   assert.equal(await page.locator('main a[href]').evaluateAll(els=>els.filter(e=>/^https?:\/\/(?:localhost|127\.0\.0\.1)/.test(e.getAttribute('href'))).length),0)
   const action=canvas.locator('.ap-action').first()
   if(await action.count()){
    const key=await action.getAttribute('data-source-component')
    if(key){const source=root.locator(`[data-component="${key}"] .bc-sample>button`).first();if(await source.count()){
     const props=['backgroundColor','color','borderRadius','borderWidth','fontSize','padding']
     const style=el=>el.evaluate((e,ps)=>Object.fromEntries(ps.map(p=>[p,getComputedStyle(e)[p]])),props)
     assert.deepEqual(await style(action),await style(source),slug+' source button parity')
    }}
    await action.click();assert((await canvas.locator('[role=status]').innerText()).includes('선택'))
   }
   if(await canvas.locator('.ap-choices button').count()){await canvas.locator('.ap-choices button').nth(1).tap();assert.equal(await canvas.locator('.ap-choices button').nth(1).getAttribute('aria-pressed'),'true')}
   if(slug==='linear.app'){await canvas.getByRole('textbox',{name:'이슈 검색'}).fill('탐색');assert.equal(await canvas.locator('.ap-issue').count(),1);await canvas.locator('.ap-issue').click();assert((await canvas.locator('[role=status]').innerText()).includes('상세'))}
   const evidence=root.locator('.bc-component .bc-evidence').first();assert.equal(await evidence.getAttribute('open'),null);await evidence.locator('summary').click();assert((await evidence.innerText()).includes('original value'))
   const trigger=root.getByRole('button',{name:'전체 카탈로그 ↗'});await trigger.click();const expanded=page.locator('.bc-expanded');await expanded.waitFor()
   const spec=JSON.parse(await readFile('public/brand-design-specs/'+slug+'.json','utf8'));assert.equal(await expanded.locator('.bc-component').count(),Object.keys(spec.components).length)
   await page.keyboard.press('Escape');await expanded.waitFor({state:'detached'});assert(await trigger.evaluate(e=>document.activeElement===e))
   const download=page.locator('.reference-handoff a[download]'),pending=page.waitForEvent('download');await download.click();const file=await pending,bytes=await readFile(await file.path()),href=await download.getAttribute('href');const original=await readFile('public/'+href.replace(/^\//,''));assert.equal(createHash('sha256').update(bytes).digest('hex'),createHash('sha256').update(original).digest('hex'))
   await page.locator('.reference-handoff').getByRole('button',{name:'Copy apply prompt'}).click();assert((await page.evaluate(()=>navigator.clipboard.readText())).includes('./DESIGN.md'))
   report.cases.push({slug,viewport:width,scene:scenes[i],...metrics,sourceCount:Object.keys(spec.components).length,downloadBytes:bytes.length})
   console.log('PASS',slug,width)
  }
 }
 await page.emulateMedia({reducedMotion:'reduce'})
 for(const slug of ['apple','baemin','linear.app']){
  await page.goto(base+'/#/reference/admd-'+slug);await page.locator(`.bc-detail[data-full-spec=true][data-brand="${slug}"] [data-section=resources]`).waitFor();await context.setOffline(true)
  const canvas=page.locator('.ap-canvas');await canvas.locator('.ap-choices button').nth(1).tap();assert.equal(await canvas.locator('.ap-choices button').nth(1).getAttribute('aria-pressed'),'true')
  const motion=await canvas.evaluate(e=>[e,...e.querySelectorAll('*')].filter(x=>getComputedStyle(x).animationName!=='none'||parseFloat(getComputedStyle(x).transitionDuration)>0).length);assert.equal(motion,0)
  await page.getByRole('button',{name:'전체 카탈로그 ↗'}).click();await page.locator('.bc-expanded').waitFor();await page.keyboard.press('Escape');await context.setOffline(false);report.offline.push({slug,warmCache:true,reducedMotion:true})
 }
 await page.locator('.reference-handoff').getByRole('link',{name:'Implementation guide'}).click();await page.locator('.guide-markdown').waitFor();assert((await page.locator('.guide-markdown').innerText()).includes('DESIGN.md'))
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[])
 await writeFile(out+'/browser-qa.json',JSON.stringify(report,null,2)+'\n')
 console.log('PASS V2.4 browser:',report.cases.length,'responsive cases')
}catch(e){console.error(JSON.stringify(report));await page.screenshot({path:out+'/failure.png'});console.error((await page.locator('body').innerText()).slice(0,1600));throw e}finally{await browser.close()}
