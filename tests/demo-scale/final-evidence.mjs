import {createRequire} from 'node:module'
import assert from 'node:assert/strict'
import {writeFile} from 'node:fs/promises'
import {demoModule} from '../../scripts/demo-module.mjs'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage()
const evidence=[]
for(const [width,height] of [[1920,1080],[1440,1000],[1366,768],[1024,768],[390,844]]){
 await page.setViewportSize({width,height})
 for(const route of ['guides','guides/using-design-md','guides/writing-brand-design-md']){
  await page.goto('http://127.0.0.1:5173/#/'+route);await page.locator(route==='guides'?'.guide-library':'.guide-markdown').waitFor();await page.waitForTimeout(250)
  await page.screenshot({path:`artifacts/v1.7/final-${route.replaceAll('/','-')}-${width}.png`})
  if(route!=='guides')evidence.push(await page.locator('.guide-markdown').evaluate((e,width)=>({width,article:e.clientWidth,wrapping:getComputedStyle(e.querySelector('p')).overflowWrap,h1:document.querySelectorAll('h1').length}),width))
 }
 await page.goto('http://127.0.0.1:5173/#/reference/particles');const related=page.locator('.workspace-related .reference-card').first();await related.scrollIntoViewIfNeeded();await page.waitForTimeout(900)
 const ratios=await page.locator('.workspace-related .card-demo').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect();return r.width/r.height}));assert(ratios.every(n=>Math.abs(n-5/3)<.01))
 await page.screenshot({path:`artifacts/v1.7/final-related-${width}.png`})
 await page.goto('http://127.0.0.1:5173/#/explore');const explore=page.locator('.listing-page .reference-grid .card-demo').first();await explore.scrollIntoViewIfNeeded();await page.waitForTimeout(400);const ratio=await explore.evaluate(e=>{const r=e.getBoundingClientRect();return r.width/r.height});assert(Math.abs(ratio-5/3)<.01,String(ratio));evidence.push({width,relatedRatios:ratios,exploreRatio:ratio})
}
const {references,starterCodeFor}=await demoModule();await page.setViewportSize({width:1024,height:600});await page.goto('about:blank');await page.setContent(starterCodeFor(references.find(r=>r.demo==='particles')))
const timing=await page.evaluate(()=>new Promise(resolve=>{const times=[];let previous=performance.now();function step(now){times.push(now-previous);previous=now;if(times.length<121)requestAnimationFrame(step);else{times.shift();times.sort((a,b)=>a-b);resolve({frames:times.length,median:times[60],p95:times[114],max:times[119],count:document.querySelector('canvas').dataset.count})}}requestAnimationFrame(step)}));evidence.push({particleFrameIntervals:timing})
await writeFile('artifacts/v1.7/final-evidence.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));await browser.close()
