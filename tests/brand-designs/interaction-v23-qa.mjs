import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFile} from 'node:fs/promises'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),page=await context.newPage(),out=[]
const base=process.env.DRH_URL||'http://127.0.0.1:5174'
try{
 for(const slug of ['baemin','linear.app','spotify']){
  await page.goto(base+'/#/reference/admd-'+slug);const root=page.locator('.bc-detail[data-full-spec=true]');await root.locator('.bc-handoff').waitFor()
  await root.getByRole('button',{name:'In Context',exact:true}).tap();assert.equal(await root.locator('.bc-applied').count(),1)
  await root.getByRole('button',{name:'크게 보기 ↗'}).tap();const full=page.locator('.bc-expanded');await full.waitFor()
  const button=full.locator('.bc-context-component[data-kind=buttons] button').first();await button.tap();assert((await full.locator('.bc-feedback[role=status]').innerText()).length>0)
  await full.getByRole('button',{name:'닫기 ✕'}).tap();await full.waitFor({state:'hidden'})
  if(slug==='linear.app'){
   await root.getByRole('button',{name:'Light',exact:true}).tap();assert.equal(await root.getAttribute('data-theme'),'light')
   const key=await root.locator('[data-kind=buttons]').first().getAttribute('data-component'),read=async()=>root.locator(`[data-component="${key}"] .bc-sample>button`).evaluate(e=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color}))
   const applied=await read();await root.getByRole('button',{name:'Catalog',exact:true}).tap();assert.deepEqual(await read(),applied)
  }
  out.push({slug,touch:true,expanded:true,feedback:true,themeParity:slug==='linear.app'})
 }
}finally{await writeFile('artifacts/brand-v23/touch-theme-qa.json',JSON.stringify(out,null,2)+'\n');await browser.close()}
console.log('PASS: mobile touch, Expanded, feedback, Light theme Catalog/In Context parity')
