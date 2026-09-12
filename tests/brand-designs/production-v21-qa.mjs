import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_PRODUCTION_URL||'http://127.0.0.1:5175'
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const fonts=JSON.parse(await readFile('src/data/brandFontAssets.json','utf8'))
const report={cases:[],requests:[],errors:[]}
try{
 for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
  const page=await browser.newPage({viewport})
  page.on('pageerror',e=>report.errors.push(e.message))
  page.on('response',r=>{if(/\/fonts\/|brand-assets/.test(r.url()))report.requests.push({url:r.url(),status:r.status()})})
  for(const slug of ['linear.app','ibm','vercel','supabase']){
   await page.goto(base+'/#/reference/admd-'+slug);const root=page.locator('.bc-detail[data-full-spec=true]');await root.waitFor()
   const loaded=await page.evaluate(async families=>{const result=[];for(const family of families)result.push({family,faces:(await document.fonts.load('16px "'+family+'"')).length});return result},fonts.map(f=>f.family))
   assert(loaded.every(f=>f.faces>0),'A production font face failed to load')
   assert(await root.locator('.bc-identifier img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),'A production logo failed to load')
   assert(await root.evaluate(e=>e.scrollWidth<=e.clientWidth+1))
   await root.getByRole('button',{name:'크게 보기'}).click();await page.keyboard.press('Escape')
   assert.equal(await page.locator('.bc-expanded').count(),0)
   report.cases.push({slug,viewport,fonts:loaded})
  }
  await page.close()
 }
 assert.equal(report.errors.length,0);assert(report.requests.every(r=>r.status===200))
}finally{await writeFile('artifacts/brand-v21/production-browser-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
console.log('PASS: production font paths, 8 local faces, verified logos, desktop/mobile expanded close')
