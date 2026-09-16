import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const context=await browser.newContext({viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write']})
const page=await context.newPage(),base=process.env.DRH_URL||'http://127.0.0.1:5176',report=[]
try{
 for(const id of ['glassmorphism','card-tilt','minimal-saas']){
  await page.goto(base+'/#/reference/'+id);const handoff=page.locator('.reference-handoff');await handoff.waitFor()
  assert(await page.locator('main').evaluate(e=>e.lastElementChild.classList.contains('reference-handoff')))
  const download=handoff.locator('a[download]');assert.equal(await download.getAttribute('download'),id==='minimal-saas'?'DESIGN.md':'AGENT.md')
  const pending=page.waitForEvent('download');await download.click();const file=await pending;assert((await readFile(await file.path(),'utf8')).length>100)
  await handoff.getByRole('button',{name:'Copy apply prompt'}).click();assert((await page.evaluate(()=>navigator.clipboard.readText())).includes(id==='minimal-saas'?'./DESIGN.md':'Agent Package'))
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));report.push({id,bottomHandoff:true,artifactDownload:true,clipboard:true})
 }
 await page.goto(base+'/#/reference/admd-vercel');const root=page.locator('.bc-detail[data-brand=vercel][data-full-spec=true]');await root.locator('[data-section=resources]').waitFor()
 await root.locator('.bc-jump-menu summary').click();await root.locator('.bc-jump-options button').filter({hasText:'Applied Canvas'}).click()
 assert(await root.evaluate(e=>e.scrollTop>0 && Math.abs(e.querySelector('[data-section=applied]').getBoundingClientRect().top-e.getBoundingClientRect().top-e.querySelector('.bc-header').getBoundingClientRect().height-12)<5))
 await root.getByRole('button',{name:'크게 보기 ↗'}).click();const expanded=page.locator('.bc-expanded');await expanded.waitFor()
 const tab=expanded.locator('[role=tab]').first();await tab.focus();await page.keyboard.press('ArrowRight');assert.equal(await expanded.locator('[role=tab]').nth(1).getAttribute('aria-selected'),'true')
 const open=expanded.getByRole('button',{name:'대화상자 열기'}).first();await open.click();await expanded.locator('.bc-sample-dialog[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await expanded.locator('.bc-sample-dialog[open]').count(),0);assert.equal(await expanded.count(),1);await page.keyboard.press('Escape');assert.equal(await page.locator('.bc-expanded').count(),0)
 report.push({id:'admd-vercel',jump:true,keyboardTabs:true,nestedDialogEscape:true})
 await page.goto(base+'/#/reference/admd-linear.app');const linear=page.locator('.bc-detail[data-brand="linear.app"][data-full-spec=true]');await linear.locator('[data-section=resources]').waitFor();await linear.getByRole('button',{name:'Light',exact:true}).click();assert.equal(await linear.getAttribute('data-theme'),'light');assert.equal(await linear.locator('.ap-canvas').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)');report.push({id:'admd-linear.app',sourceLightTheme:true})
 await page.goto(base+'/#/guides/quickstart');await page.locator('.guide-markdown').waitFor();assert.equal(await page.locator('.guide-markdown h2').count(),5);assert(!(await page.locator('.guide-markdown').innerText()).includes('In Context'))
 await writeFile('artifacts/brand-v24/interaction-qa.json',JSON.stringify(report,null,2)+'\n');console.log('PASS V2.4 supplemental interactions',report.length)
}finally{await browser.close()}
