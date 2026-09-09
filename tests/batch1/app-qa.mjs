import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
import assert from 'node:assert/strict'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const catalog=JSON.parse(await readFile('src/data/batch1Catalog.json','utf8'))
const base=process.env.DRH_URL||'http://127.0.0.1:5173',out='artifacts/post-v17-batch1'
const browser=await chromium.launch({channel:'msedge',headless:true})
const results=[],errors=[]
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},hasTouch:mobile,isMobile:mobile,permissions:['clipboard-read','clipboard-write']})
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
  for(const item of catalog){
   await page.goto(base+'/#/reference/'+item.id)
   await page.locator('.workspace-title h1').filter({hasText:item.name}).waitFor()
   await page.locator('.workspace-demo').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}))
   const f=page.frameLocator('.workspace-demo iframe');await f.locator('main[data-ready=true]').waitFor()
   assert.equal(await f.locator('main').getAttribute('data-variant'),'detail')
   assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)))
   await page.locator('#artifact-tab-html').click()
   const text=await page.locator('#artifact-panel pre').textContent();assert(text.startsWith('<!doctype'));assert(text.includes('Hub Original'))
   const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('link',{name:'Download '+item.id+'.html',exact:true}).click()])
   assert.equal((await readFile(await download.path(),'utf8')).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'))
   await page.getByRole('button',{name:'Copy HTML',exact:true}).click();assert.equal((await page.evaluate(()=>navigator.clipboard.readText())).replaceAll('\r\n','\n'),text.replaceAll('\r\n','\n'))
   await page.locator('#artifact-tab-agent').click();assert((await page.locator('#artifact-panel pre').textContent()).includes(item.canonicalAcceptance))
   await page.locator('#artifact-tab-source').click();assert((await page.locator('#artifact-panel pre').textContent()).includes(item.source.scope==='DISCOVERY_ONLY'?'DISCOVERY_ONLY':item.source.scope==='REFERENCE_ONLY'?'REFERENCE_ONLY':'Hub Original'))
   await page.locator('.workspace-preview').scrollIntoViewIfNeeded();await page.locator('.workspace-preview').screenshot({path:out+'/'+item.id+'-app-'+(mobile?'mobile':'desktop')+'.png'})
   results.push({id:item.id,mobile,detail:true,download:true,clipboard:true,agent:true,source:true})
  }
  await page.goto(base+'/#/explore?category=UI%20Patterns')
  await page.locator('.reference-card').first().waitFor();assert.equal(await page.locator('.reference-card').count(),5)
  for(const item of catalog.filter(r=>r.category==='UI Patterns'))assert.equal(await page.getByRole('link',{name:item.name+' 상세 보기',exact:true}).count(),1)
  await page.locator('.listing-results').screenshot({path:out+'/ui-patterns-'+(mobile?'mobile':'desktop')+'.png'})
  await page.getByRole('link',{name:'Bottom Sheet 상세 보기',exact:true}).click()
  await page.locator('.workspace-demo').scrollIntoViewIfNeeded()
  const frame=page.frameLocator('.workspace-demo iframe');await frame.locator('.close').click();await frame.locator('.open-dialog').click();assert(await frame.locator('dialog').evaluate(d=>d.matches(':modal')))
  for(let i=0;i<14;i++){await page.keyboard.press('Tab');assert(await frame.locator('dialog').evaluate(d=>d.contains(document.activeElement)))}
  if(mobile){
   await frame.locator('[data-size="65"]').tap();await page.waitForTimeout(300)
   const handle=await frame.locator('.handle').boundingBox(),main=await frame.locator('main').boundingBox(),x=handle.x+handle.width/2,y=handle.y+handle.height/2
   const cdp=await context.newCDPSession(page)
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]})
   for(let i=1;i<=8;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-main.height*.3*i/8}]})
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
   assert.equal(await frame.locator('dialog').getAttribute('data-snap'),'90')
   await frame.locator('input[value="14:00"]').tap();await frame.locator('.reserve').tap();assert((await frame.locator('.selection').textContent()).includes('14:00'))
  }
  await page.keyboard.press('Escape');assert(await frame.locator('.open-dialog').evaluate(e=>e===document.activeElement))
  results.push({uiPatternsFilter:true,mobile,focusTrap:true,touchSnap:mobile})
  await context.close()
 }
 assert.deepEqual(errors,[])
 console.log('PASS: 20 actual Detail pages with HTML download/clipboard, Agent/Source; UI Patterns filter; native modal focus containment and real CDP touch drag')
}finally{await writeFile(out+'/app-report.json',JSON.stringify({results,errors},null,2)+'\n');await browser.close()}
