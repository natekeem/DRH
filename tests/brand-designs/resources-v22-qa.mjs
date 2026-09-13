import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const registry=JSON.parse(await readFile('src/data/brandOfficialResources.json','utf8')),rows=[]
try{
 const queue=Object.entries(registry).flatMap(([slug,links])=>links.map(r=>({slug,...r})))
 await Promise.all(Array.from({length:3},async()=>{const page=await browser.newPage();while(queue.length){const r=queue.shift();try{const response=await page.goto(r.url,{waitUntil:'domcontentloaded',timeout:25000});await page.waitForTimeout(500);rows.push({slug:r.slug,url:r.url,status:response?.status(),title:await page.title(),heading:await page.locator('h1,h2').allTextContents(),finalUrl:page.url(),canonical:await page.locator('link[rel=canonical]').first().getAttribute('href').catch(()=>null),checkedAt:'2026-09-12'});console.log(r.slug,rows.at(-1).title)}catch(e){rows.push({slug:r.slug,url:r.url,error:e.message})}}await page.close()}))
}finally{await browser.close();await writeFile('artifacts/brand-v22/official-resource-browser.json',JSON.stringify(rows.sort((a,b)=>a.slug.localeCompare(b.slug)||a.url.localeCompare(b.url)),null,2)+'\n')}
