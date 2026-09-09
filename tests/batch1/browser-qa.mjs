import {createRequire} from 'node:module'
import {mkdir,readFile,writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
import {demoModule} from '../../scripts/demo-module.mjs'
const require=createRequire(import.meta.url)
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5173'
const catalog=JSON.parse(await readFile('src/data/batch1Catalog.json','utf8')).filter(r=>!process.env.QA_ID||r.id===process.env.QA_ID)
const output='artifacts/post-v17-batch1'
await mkdir(output,{recursive:true})
const browser=await chromium.launch({channel:'msedge',headless:true})
const report={viewports:[],interactions:[],errors:[],network:[]}
const context=await browser.newContext({viewport:{width:1440,height:1000}})
const page=await context.newPage()
page.on('pageerror',e=>report.errors.push(e.message))
page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('about:'))report.network.push(r.url())})
async function fixture(item,variant='detail'){
 await page.goto(base+'/tests/batch1/?id='+item.id)
 const element=page.locator('[data-qa='+variant+'] iframe')
 await element.scrollIntoViewIfNeeded();await element.waitFor()
 const frame=page.frameLocator('[data-qa='+variant+'] iframe');await frame.locator('main[data-ready=true]').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);return frame
}
async function state(frame,selector,expected){await frame.locator(selector).waitFor();await page.waitForFunction(()=>true);assert.equal(await frame.locator(selector).getAttribute(expected[0]),expected[1])}
try{
 for(const [width,height] of (process.env.QA_PHASE==='interactions'?[]:[[1920,1080],[1440,1000],[1366,768],[1024,768],[390,844]])){
  await page.setViewportSize({width,height})
  for(const item of catalog){
   await fixture(item,'card');await page.waitForTimeout(160)
   for(const variant of ['card','detail']){
    const element=page.locator('[data-qa='+variant+'] iframe');await element.scrollIntoViewIfNeeded()
    const frame=page.frameLocator('[data-qa='+variant+'] iframe');await frame.locator('main').waitFor()
    const geometry=await frame.locator('main').evaluate(el=>({width:el.clientWidth,height:el.clientHeight,bodyOverflow:document.documentElement.scrollWidth>innerWidth+1,variant:el.dataset.variant,scrollable:[...el.querySelectorAll('*')].filter(x=>getComputedStyle(x).overflowY==='auto').map(x=>({class:x.className,width:x.clientWidth,overflow:x.scrollWidth>x.clientWidth+2}))}))
    assert.equal(geometry.variant,variant);assert(!geometry.bodyOverflow,item.id+' '+variant+' body overflow')
    assert(geometry.width>200&&geometry.height>=190,item.id+' visible dimensions')
    assert(!geometry.scrollable.some(x=>x.overflow),item.id+' '+variant+' internal horizontal overflow '+JSON.stringify(geometry))
    report.viewports.push({id:item.id,viewportWidth:width,viewportHeight:height,variant,...geometry})
    if(width===1440||width===390){await page.waitForTimeout(item.id==='agency-landing'?1100:200);await page.locator('[data-qa='+variant+']').screenshot({path:output+'/'+item.id+'-'+width+'-'+variant+'.png'})}
   }
  }
 }
 await page.setViewportSize({width:1440,height:1000})
 for(const variant of ['card','detail']){
  for(const item of catalog){
   const f=await fixture(item,variant)
   if(item.id==='neumorphism'){await f.locator('.soft').click();assert.equal(await f.locator('.soft').getAttribute('aria-pressed'),'true')}
   if(item.id==='skeuomorphism'){await f.locator('.power').click();assert.equal(await f.locator('.power').getAttribute('aria-pressed'),'true')}
   if(item.id==='bauhaus'){await f.locator('button').click();assert(await f.locator('.alternate').count())}
   if(item.id==='japandi'){await f.locator('.tone').click();assert.equal(await f.locator('.tone').getAttribute('aria-pressed'),'true')}
   if(item.id==='bottom-sheet'){
    await f.locator('.close').click();await f.locator('.open-dialog').click();assert(await f.locator('dialog').evaluate(d=>d.matches(':modal')))
    await f.locator('[data-size="90"]').click();assert.equal(await f.locator('dialog').getAttribute('data-snap'),'90')
    await f.locator('.handle').focus();await page.keyboard.press('Home');assert.equal(await f.locator('dialog').getAttribute('data-snap'),'40')
    await page.keyboard.press('ArrowUp');assert.equal(await f.locator('dialog').getAttribute('data-snap'),'65')
    await page.waitForTimeout(300);const h=await f.locator('.handle').boundingBox();await page.mouse.move(h.x+h.width/2,h.y+h.height/2);await page.mouse.down();await page.mouse.move(h.x+h.width/2,h.y-(await f.locator('main').evaluate(e=>e.clientHeight))*.3,{steps:8});await page.mouse.up();assert.equal(await f.locator('dialog').getAttribute('data-snap'),'90')
    await f.locator('.reserve').click();assert((await f.locator('.selection').textContent()).includes('10:00'))
    await page.keyboard.press('Escape');assert(!(await f.locator('dialog').evaluate(d=>d.open)));assert(await f.locator('.open-dialog').evaluate(e=>e===document.activeElement))
   }
   if(item.id==='command-palette'){
    await f.locator('.close').click();await f.locator('.open-dialog').click();await f.locator('.search').fill('nprj');assert.equal(await f.locator('.command').count(),1)
    await page.keyboard.press('Enter');assert((await f.locator('.result').textContent()).includes('프로젝트 초안'))
    await page.keyboard.press('Control+k');await f.locator('.search').fill('zzzzz');assert.equal(await f.locator('.command').count(),0);assert.equal(await f.locator('.search').getAttribute('aria-activedescendant'),null)
    await f.locator('.search').fill('');await page.keyboard.press('ArrowDown');assert.equal(await f.locator('.search').getAttribute('aria-activedescendant'),'cmd-note')
    await page.keyboard.press('End');assert.equal(await f.locator('.search').getAttribute('aria-activedescendant'),'cmd-theme');await page.keyboard.press('Escape')
   }
   if(item.id==='toast-notification'){
    await f.locator('.toast button').click();await f.locator('[data-toast=error]').click();await page.waitForTimeout(250);await f.locator('.toast').hover();assert(await f.locator('.toast').evaluate(e=>e.matches(':hover')));await page.waitForTimeout(5200);assert.equal(await f.locator('.toast').count(),1)
    await f.locator('.toast button').focus();await page.mouse.move(0,0);await page.waitForTimeout(500);assert.equal(await f.locator('.toast').count(),1)
    await f.locator('.toast button').click();await f.locator('[data-toast=success]').click();await page.mouse.move(0,0);await page.waitForTimeout(5200);assert.equal(await f.locator('.toast').count(),0)
    // Trigger from the same real controls without pointer interception by the growing stack.
    for(let i=0;i<5;i++)await f.locator('[data-toast=info]').evaluate(b=>b.click())
    assert.equal(await f.locator('.toast').count(),3)
   }
   if(item.id==='skeleton-loading'){
    await f.locator('.reload').click();const before=await f.locator('.project-row').evaluateAll(rows=>rows.map(r=>({height:r.clientHeight,width:r.clientWidth})))
    await f.locator('[data-state=loaded]').waitFor();const after=await f.locator('.project-row').evaluateAll(rows=>rows.map(r=>({height:r.clientHeight,width:r.clientWidth})));assert.deepEqual(before,after)
    await f.locator('.fail').click();await f.locator('[data-state=error]').waitFor();await f.locator('.retry').click();await f.locator('[data-state=loaded]').waitFor();assert.equal(await f.locator('.project-list').getAttribute('aria-busy'),'false')
   }
   if(item.id==='segmented-control'){
    await f.locator('input[value="0"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await f.locator('.chart').getAttribute('data-period'),'1');assert.equal(await f.locator('.bar').count(),4)
    await page.keyboard.press('End');assert.equal(await f.locator('.bar').count(),12);assert.equal(await f.locator('input:checked').count(),1)
    await page.waitForTimeout(250);const geometry=await f.locator('.segments').evaluate(el=>{const a=el.querySelector('input:checked').parentElement.getBoundingClientRect(),b=el.querySelector('.indicator').getBoundingClientRect();return{a:a.x,b:b.x,aw:a.width,bw:b.width}})
    assert(Math.abs(geometry.aw-geometry.bw)<2&&Math.abs(geometry.a-geometry.b)<2)
   }
   if(item.id==='agency-landing'){
    await f.locator('[data-filter=brand]').click();assert.equal(await f.locator('.project:visible').count(),2)
    await f.locator('.project:visible').first().click();assert.equal(await f.locator('#case-title').textContent(),'Morrow');await page.keyboard.press('Escape')
    await f.locator('a[href="#contact"]').click();await f.locator('input[type=email]').fill('studio@example.com');await f.locator('.contact-submit').click();assert((await f.locator('.contact-status').textContent()).includes('전송하지 않았습니다'))
   }
   report.interactions.push({id:item.id,variant,passed:true})
  }
 }
 // Standalone artifacts execute with all networking disabled and motion reduced.
 const offline=await browser.newContext({offline:true,reducedMotion:'reduce',viewport:{width:390,height:600}})
 const {recipeHtml}=await demoModule()
 for(const item of catalog){const standalone=await offline.newPage();standalone.on('pageerror',e=>report.errors.push(e.message));await standalone.setContent(recipeHtml(item.demo));await standalone.locator('main[data-ready=true]').waitFor();assert.equal(await standalone.locator('main').getAttribute('data-variant'),'detail');assert.equal(await standalone.locator('main').evaluate(el=>[...el.querySelectorAll('*')].filter(x=>getComputedStyle(x).animationName!=='none').length),0);report.interactions.push({id:item.id,offline:true,reducedMotion:true,passed:true});await standalone.close()}
 await offline.close()
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.network,[])
 console.log('PASS',report.viewports.length,'Card/Detail viewport checks;',report.interactions.length,'interaction/offline checks')
}finally{await writeFile(output+'/browser-report'+(process.env.QA_ID?'-'+process.env.QA_ID:'')+'.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
