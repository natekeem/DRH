import {createRequire} from 'node:module'
import {mkdir,writeFile} from 'node:fs/promises'
const require=createRequire(import.meta.url)
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({channel:'msedge',headless:true})
const page=await browser.newPage()
const errors=[];page.on('pageerror',e=>errors.push(e.message))
const output='artifacts/v1.7';await mkdir(output,{recursive:true})
const results=[]
const keys=(process.env.QA_KEYS||'particles,meteors,dot-grid,aurora,gradient-mesh,noise-blobs,parallax,tilt-card,magnetic-button,hover-lift,spotlight,cursor-follow,image-trail,fluid-cursor,metaballs,liquid-refraction,starfield,retro-grid,beams,waves,confetti,ripple,image-reveal,comparison-slider,animated-border,shimmer-button').split(',')
for(const [width,height] of [[1920,1080],[1440,1000],[1366,768],[1024,768],[390,844]]){
 await page.setViewportSize({width,height})
 for(const kind of keys){
  await page.goto(`http://127.0.0.1:5173/tests/demo-scale/?kind=${kind}`)
  await page.waitForTimeout(350)
  const surfaces=[]
  for(const selector of ['.qa-card','.qa-detail']){
   const loc=page.locator(selector);await loc.scrollIntoViewIfNeeded();await page.waitForTimeout(150)
   const box=await loc.boundingBox();
   for(let i=0;i<8;i++)await page.mouse.move(box.x+box.width*(.15+i*.09),box.y+box.height*(.3+(i%3)*.12))
   const iframe=loc.locator('iframe');let metrics={}
   if(await iframe.count()){
    const f=await (await iframe.elementHandle()).contentFrame()
    metrics=await f.evaluate(()=>({count:document.querySelector('[data-count]')?.getAttribute('data-count'),policy:document.querySelector('main')?.dataset.density,overflow:document.documentElement.scrollWidth>innerWidth,images:document.querySelectorAll('img.trail').length}))
   }
   surfaces.push({selector,width:box.width,height:box.height,...metrics})
  }
  if(['particles','meteors','dot-grid','image-trail','aurora'].includes(kind)||width===1440)await page.screenshot({path:`${output}/${kind}-${width}.png`,fullPage:true})
  results.push({kind,width,height,surfaces})
 }
 for(const route of ['guides','guides/using-design-md','guides/writing-brand-design-md','reference/particles']){
  await page.goto('http://127.0.0.1:5173/#/'+route);await page.waitForTimeout(600)
  if(route.includes('guides/')){
   const links=page.locator('.guide-rail nav a');if(await links.count()){await links.last().click();const active=await page.evaluate(()=>({tag:document.activeElement?.tagName,top:document.activeElement?.getBoundingClientRect().top}));results.push({route,width,toc:active});await page.evaluate(()=>scrollTo(0,0))}
  }
  if(route.startsWith('reference/')){await page.locator('.workspace-related').scrollIntoViewIfNeeded();const ratios=await page.locator('.workspace-related .card-demo').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return r.width/r.height}));results.push({route,width,ratios})}
  results.push({route,width,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)})
  await page.screenshot({path:`${output}/${route.replaceAll('/','-')}-${width}.png`,fullPage:true})
 }
 await writeFile(`${output}/${process.env.QA_REPORT||'results.json'}`,JSON.stringify({results,errors},null,2))
 console.log('Completed viewport',width, 'errors',errors.length)
}
await browser.close()
if(errors.length)process.exitCode=1
