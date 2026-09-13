import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5176'
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),page=await browser.newPage()
const rows=[]
try{
 for(const [query,slug]of [['배달의민족','baemin'],['Woowahan','baemin'],['Baemin','baemin'],['당근','karrot'],['Daangn','karrot'],['Karrot','karrot'],['카카오뱅크','kakaobank'],['토스','toss'],['무신사','musinsa'],['쏘카','socar']]){
  await page.goto(base+'/#/explore?search='+encodeURIComponent(query))
  await page.getByRole('textbox',{name:'레퍼런스 검색'}).waitFor()
  const target=page.locator(`.reference-card a[href$="/reference/admd-${slug}"]`)
  await target.waitFor();assert.equal(await target.count(),1)
  rows.push({query,canonical:'admd-'+slug,matchCount:await target.count()})
 }
 const inventory=JSON.parse(await readFile('artifacts/brand-v22/korean-source-inventory.json','utf8')).entries.filter(e=>e.status==='IMPORTED')
 for(const {slug}of inventory){
  const path='vendor/oh-my-design/'+slug+'/DESIGN.md',response=await page.request.get(base+'/'+path)
  assert(response.ok());const bytes=await response.body(),local=await readFile('public/'+path)
  assert(bytes.equals(local));rows.push({slug,rawRoute:path,sha256:createHash('sha256').update(bytes).digest('hex')})
 }
}finally{await browser.close();await writeFile('artifacts/brand-v22/search-raw-browser-qa.json',JSON.stringify(rows,null,2)+'\n')}
console.log('PASS Korean/English aliases and all 17 served raw documents')
