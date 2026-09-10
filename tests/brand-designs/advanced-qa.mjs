import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFile} from 'node:fs/promises'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5174'
const browser=await chromium.launch({channel:'msedge',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}}),results=[]
const diagnostics=async()=>JSON.parse(await page.locator('#diagnostics').textContent()).current
try{
 for(const kind of ['fluid','metaballs','refraction']){
  await page.goto(base+'/tests/advanced-demos/')
  await page.getByRole('button',{name:kind,exact:true}).click()
  const host=page.getByRole('group',{name:'QA interactive surface',exact:true})
  for(const variant of ['detail','card']){
   if(variant==='card')await page.getByRole('button',{name:'Variant: detail',exact:true}).click()
   await host.scrollIntoViewIfNeeded();await page.waitForTimeout(500)
   assert.equal(Math.round((await host.boundingBox()).height),variant==='card'?220:480)
   const box=await host.boundingBox();await page.mouse.move(box.x+box.width*.4,box.y+box.height*.4);await page.mouse.move(box.x+box.width*.7,box.y+box.height*.6,{steps:10});await page.waitForTimeout(400)
   let d=await diagnostics();assert.equal(d.mode,'webgl2');assert(d.frames>0);assert(d.inputs>0)
   await host.screenshot({path:`artifacts/v1.7.1/advanced-${kind}-${variant}.png`})
   await page.getByRole('button',{name:'Open HTML export',exact:true}).click();const frame=page.frameLocator('iframe');await frame.locator('#demo canvas').waitFor()
   assert.equal(await frame.locator('#demo').evaluate(e=>e.clientHeight),variant==='card'?220:480)
   await page.getByRole('button',{name:'Close HTML export',exact:true}).click();results.push({kind,variant,...d})
  }
  await page.getByRole('button',{name:'Reduced motion: false',exact:true}).click();await host.scrollIntoViewIfNeeded();await page.waitForTimeout(500);assert.equal((await diagnostics()).running,false)
  await page.getByRole('button',{name:'Reduced motion: true',exact:true}).click()
  await page.getByRole('button',{name:'Force fallback: false',exact:true}).click();await page.waitForTimeout(400);assert.notEqual((await diagnostics()).mode,'webgl2')
  await page.getByRole('button',{name:'Force fallback: true',exact:true}).click()
  await page.getByRole('button',{name:'Run disposal checks',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#disposal-report').textContent.includes('remainingChildren'))
  const rows=JSON.parse(await page.locator('#disposal-report').textContent());for(const row of rows){assert.equal(row.remainingChildren,0);assert.equal(row.after.disposed,true);assert.equal(row.after.running,false);assert(Object.values(row.after.resources).every(n=>n===0))}
 }
 console.log('PASS: Fluid / Metaballs / Refraction card + detail GPU input, standalone sizing, reduced motion, fallback and idempotent disposal')
}finally{await writeFile('artifacts/v1.7.1/advanced-qa.json',JSON.stringify(results,null,2)+'\n');await browser.close()}
