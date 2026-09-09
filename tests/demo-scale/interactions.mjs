import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {writeFile} from 'node:fs/promises'
import {demoModule} from '../../scripts/demo-module.mjs'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({channel:'msedge',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message))
async function demo(kind){await page.goto('http://127.0.0.1:5173/tests/demo-scale/?kind='+kind);const el=page.locator('.qa-detail iframe');await el.waitFor();const frame=await(await el.elementHandle()).contentFrame();await frame.waitForSelector('main');return frame}
for(const kind of ['parallax','tilt-card','magnetic-button','hover-lift']){
 const f=await demo(kind),selector=kind==='parallax'?'.front':kind==='hover-lift'?'.lift':'.object'
 const before=await f.locator(selector).evaluate(e=>getComputedStyle(e).transform)
 await f.locator(selector).hover({position:{x:20,y:20}});await page.waitForTimeout(350)
 const active=await f.locator(selector).evaluate(e=>getComputedStyle(e).transform)
 assert.notEqual(active,before,kind+' responds')
 if(kind==='hover-lift'){assert.match(active,/-8\)/);await f.locator(selector).focus();assert.equal(await f.locator(selector).evaluate(e=>document.activeElement===e),true)}
 if(kind==='parallax'){const transforms=await f.locator('.layer').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).transform));assert.equal(new Set(transforms).size,3)}
 await page.mouse.move(100,50,{steps:5});await f.locator(selector).evaluate(e=>e.blur());await page.waitForTimeout(800)
 const after=await f.locator(selector).evaluate(e=>getComputedStyle(e).transform);if(after!==before)console.log({kind,iframe:await page.locator('.qa-detail iframe').boundingBox(),main:await f.evaluate(()=>({w:innerWidth,h:innerHeight,nx:document.querySelector('main').style.getPropertyValue('--nx'),ny:document.querySelector('main').style.getPropertyValue('--ny')}))});assert.equal(after,before,kind+' returns')
 checks.push({kind,before,active,after})
}
for(const kind of ['confetti','ripple']){
 const f=await demo(kind);await f.locator('button').click();const count=await f.locator('.burst').count();assert(kind==='ripple'?count===1:count>=16&&count<=64)
 await page.waitForTimeout(1000);assert.equal(await f.locator('.burst').count(),0)
 await f.locator('button').focus();await page.keyboard.press('Enter');assert((await f.locator('.burst').count())>0)
 checks.push({kind,count,cleanup:true,keyboard:true})
}
const meteor=await demo('meteors')
const variation=await meteor.locator('.meteor').evaluateAll(ns=>['--angle','--length','--duration','--delay'].map(p=>new Set(ns.map(n=>n.style.getPropertyValue(p))).size))
assert(variation.every(n=>n>10));checks.push({kind:'meteors',variation})
for(const kind of ['particles','dot-grid','starfield']){
 const f=await demo(kind),initial=Number(await f.locator('canvas').getAttribute('data-count'))
 await page.setViewportSize({width:390,height:844});await page.locator('.qa-detail').scrollIntoViewIfNeeded();await page.waitForTimeout(300)
 const resized=Number(await f.locator('canvas').getAttribute('data-count'));assert(resized<initial)
 const dimensions=await f.locator('canvas').evaluate(c=>({width:c.width,css:c.clientWidth}));assert(dimensions.width<=dimensions.css*1.5+1)
 checks.push({kind,initial,resized,dprCap:true});await page.setViewportSize({width:1440,height:1000})
}
await page.emulateMedia({reducedMotion:'reduce'})
for(const kind of ['particles','meteors','dot-grid','parallax','tilt-card','magnetic-button','hover-lift','confetti','ripple','image-trail']){
 const f=await demo(kind);assert(await f.locator('main').isVisible())
 if(['confetti','ripple'].includes(kind)){await f.locator('button').click();assert.equal(await f.locator('.burst').count(),0)}
 checks.push({kind,reducedMotion:true})
}
await page.emulateMedia({reducedMotion:'no-preference'})
// Execute the actual exported source offline, not a separate mock implementation.
const {references,starterCodeFor}=await demoModule()
for(const key of ['particles','meteors','dot-grid','parallax','tilt-card','magnetic-button','hover-lift','cursor-follow','starfield','beams','waves']){
 await page.goto('about:blank');await page.setContent(starterCodeFor(references.find(r=>r.demo===key)));await page.waitForTimeout(100);assert(await page.locator('main').isVisible());checks.push({key,offlineExport:true})
}
// Keyboard TOC activation focuses a visible heading below the sticky header.
await page.goto('http://127.0.0.1:5173/#/guides/using-design-md');const toc=page.locator('.guide-rail nav a').last();await toc.waitFor();await toc.focus();await page.keyboard.press('Enter')
const heading=await page.evaluate(()=>({tag:document.activeElement.tagName,top:document.activeElement.getBoundingClientRect().top}));assert.match(heading.tag,/H[23]/);assert(heading.top>=100);checks.push({toc:heading})
assert.equal(errors.length,0,JSON.stringify(errors))
await writeFile('artifacts/v1.7/interactions.json',JSON.stringify({checks,errors},null,2));console.log('PASS',checks.length,'interaction/export/reduced-motion checks')
await browser.close()
