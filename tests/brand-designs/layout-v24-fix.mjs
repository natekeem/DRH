import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdir,writeFile} from 'node:fs/promises'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const page=await browser.newPage(),out='artifacts/brand-v24-layout-fix',results=[]
await mkdir(out,{recursive:true})
try{
 for(const width of [1920,1440,390])for(const slug of ['apple','baemin','linear.app']){
  await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:5176/#/reference/admd-'+slug)
  const root=page.locator(`.bc-detail[data-brand="${slug}"][data-full-spec=true]`);await root.locator('[data-section=resources]').waitFor({state:'attached'})
  const metrics=await page.evaluate(()=>{const p=document.querySelector('.workspace-preview').getBoundingClientRect(),a=document.querySelector('.artifact-workspace').getBoundingClientRect(),r=document.querySelector('.bc-detail'),shell=document.querySelector('.workspace-demo');return {previewRight:p.right,artifactLeft:a.left,previewTop:p.top,artifactTop:a.top,rootHeight:r.clientHeight,rootScroll:r.scrollHeight,shellHeight:shell.clientHeight,shellScroll:shell.scrollHeight,pageWidth:innerWidth,pageScroll:document.documentElement.scrollWidth}})
  if(width>=1200)assert(metrics.artifactLeft>metrics.previewRight,'desktop side by side');else assert(metrics.artifactTop>metrics.previewTop,'mobile stacked')
  assert(metrics.rootHeight<metrics.rootScroll);assert(metrics.shellScroll<=metrics.shellHeight+1);assert(metrics.pageScroll<=width)
  await page.locator('.reference-workspace').screenshot({path:`${out}/${slug}-${width}.png`,style:'.site-header,.header-backdrop-rail{visibility:hidden}'})
  await root.locator('.bc-jump-menu summary').click();await root.locator('.bc-jump-options button').filter({hasText:'Applied Canvas'}).click();assert(await root.evaluate(e=>e.scrollTop>0))
  await root.getByRole('button',{name:'크게 보기 ↗'}).click();const dialog=page.locator('.bc-expanded');await dialog.waitFor()
  if(slug==='apple'){const specimen=dialog.locator('[data-component=button-store-hero]');assert.equal(await specimen.getAttribute('data-kind'),'buttons');const button=specimen.locator('.bc-sample>button');await button.scrollIntoViewIfNeeded();const bounds=await button.boundingBox();assert(bounds.height<100&&bounds.width<300);assert.equal(await specimen.locator('.bc-composition').count(),0);await specimen.screenshot({path:`${out}/apple-button-${width}.png`})}
  await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert(await root.getByRole('button',{name:'크게 보기 ↗'}).evaluate(e=>e===document.activeElement))
  results.push({slug,width,...metrics});console.log('PASS',slug,width)
 }
 await page.emulateMedia({reducedMotion:'reduce'});assert(await page.locator('.bc-detail').evaluate(e=>getComputedStyle(e).animationName==='none'))
 await writeFile(out+'/qa.json',JSON.stringify(results,null,2)+'\n')
}finally{await browser.close()}
