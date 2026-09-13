import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright')
const base=process.env.DRH_URL||'http://127.0.0.1:5174',out='artifacts/brand-v23'
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']})
const page=await context.newPage(),report={cases:[],errors:[],external:[],hero:[],interactions:[],offline:[],reducedMotion:[]}
page.on('pageerror',e=>report.errors.push(e.message))
page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:')&&!r.url().startsWith('blob:'))report.external.push(r.url())})
const canaries=['baemin','kakaobank','toss','linear.app','coinbase','spotify','ferrari','nintendo-2001','vercel','apple']
const props=['backgroundColor','color','borderRadius','fontSize','fontWeight','padding','borderColor','borderWidth']
const readStyle=el=>el.evaluate((e,props)=>Object.fromEntries(props.map(p=>[p,getComputedStyle(e)[p]])),props)
async function checkRoot(root){const m=await root.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,parentWidth:e.parentElement.clientWidth,parentScroll:e.parentElement.scrollWidth,overflow:[...e.querySelectorAll('.bc-sample,.bc-composition')].filter(x=>x.scrollWidth>x.clientWidth+2).map(x=>x.closest('[data-component]')?.dataset.component)}));assert(m.scrollWidth<=m.width+1,JSON.stringify(m));assert.deepEqual(m.overflow,[]);return m}
async function jump(root,section){await root.locator('.bc-jump-menu summary').click();await root.locator('.bc-jump-options button').filter({hasText:section}).click()}
try{
 for(const [width,height]of [[1920,1080],[1440,1000],[390,844]]){
  await page.setViewportSize({width,height})
  for(const slug of canaries){
   await page.goto(base+'/#/reference/admd-'+slug)
   const root=page.locator('.bc-detail[data-full-spec=true]');await root.locator('.bc-handoff').waitFor()
   const catalog=await checkRoot(root)
   if(slug==='apple')assert.equal(await root.locator('[data-component=button-dark-utility] .bc-sample').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(255, 255, 255)','button-dark is not on-dark')
   assert.equal(await root.locator('[data-kind=other]').count(),0)
   const key=await root.locator('.bc-component[data-kind=buttons]').first().getAttribute('data-component')
   const catalogStyle=await readStyle(root.locator(`[data-component="${key}"] .bc-sample>button`))
   await jump(root,'Buttons');await root.screenshot({path:`${out}/${slug}-catalog-${width}.png`})
   await root.getByRole('button',{name:'In Context',exact:true}).click()
   const applied=await checkRoot(root)
   assert((await root.innerText()).includes('DRH 적용 예시 · 공식 제품 화면이 아닙니다.'))
   const appliedStyle=await readStyle(root.locator(`[data-component="${key}"] .bc-sample>button`))
   assert.deepEqual(appliedStyle,catalogStyle,slug+' Catalog / In Context parity')
   await root.screenshot({path:`${out}/${slug}-context-${width}.png`})
   await root.getByRole('button',{name:'크게 보기 ↗'}).click()
   const expanded=page.locator('.bc-expanded');await expanded.waitFor()
   await expanded.getByRole('button',{name:'Catalog',exact:true}).click()
   const full=await checkRoot(expanded),spec=JSON.parse(await readFile('public/brand-design-specs/'+slug+'.json','utf8'))
   assert.equal(await expanded.locator('.bc-component').count(),Object.keys(spec.components).length)
   if(slug==='coinbase'){
    await jump(expanded,'Hero')
    for(const key of ['hero-band-dark','hero-band-light']){
     const el=expanded.locator(`[data-component="${key}"]`),m=await el.locator('.bc-composition').evaluate(e=>({fontSize:getComputedStyle(e).fontSize,padding:getComputedStyle(e).padding,width:e.clientWidth,scrollWidth:e.scrollWidth,titleHeight:e.querySelector('strong').getBoundingClientRect().height,lineHeight:getComputedStyle(e.querySelector('strong')).lineHeight}))
     assert(parseFloat(m.fontSize)<=40&&parseFloat(m.padding)<=32);assert(m.scrollWidth<=m.width+1);assert(m.titleHeight/parseFloat(m.lineHeight)<=3,'Abnormal hero wrapping');assert((await el.locator('.bc-metrics').innerText()).includes('80px'));assert((await el.locator('.bc-metrics').innerText()).includes('96px'));report.hero.push({width,key,...m})
    }
    await expanded.screenshot({path:`${out}/coinbase-hero-expanded-${width}.png`})
   }
   if(width===1440){await jump(expanded,'Buttons');await expanded.screenshot({path:`${out}/${slug}-expanded-${width}.png`})}
   await page.keyboard.press('Escape');await expanded.waitFor({state:'hidden'});assert(await root.getByRole('button',{name:'크게 보기 ↗'}).evaluate(e=>e===document.activeElement))
   await root.getByRole('button',{name:'Catalog',exact:true}).click()
   const handoff=root.locator('.bc-handoff');await handoff.scrollIntoViewIfNeeded()
   const download=page.waitForEvent('download');await handoff.getByRole('link',{name:'Download DESIGN.md',exact:true}).click();const file=await download
   assert.equal(file.suggestedFilename(),'DESIGN.md');const received=await readFile(await file.path()),href=await handoff.getByRole('link',{name:'Download DESIGN.md',exact:true}).getAttribute('href'),raw=await readFile('public'+href)
   assert.equal(createHash('sha256').update(received).digest('hex'),createHash('sha256').update(raw).digest('hex'))
   await handoff.getByRole('button',{name:'Copy apply prompt'}).click();const copied=await page.evaluate(()=>navigator.clipboard.readText());assert(copied.includes('./DESIGN.md')&&copied.includes('390px / 1440px')&&copied.length<1000)
   if(slug==='baemin'||slug==='coinbase')await root.screenshot({path:`${out}/${slug}-handoff-${width}.png`})
   report.cases.push({slug,width,height,catalog,applied,full,buttonParity:catalogStyle,downloadSha256:createHash('sha256').update(received).digest('hex'),copyLength:copied.length})
   console.log('PASS',slug,width)
  }
 }
 // Keyboard states, source-specific borders, dialog focus return and theme parity.
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/#/reference/admd-vercel');let root=page.locator('.bc-detail[data-full-spec=true]');await root.locator('.bc-handoff').waitFor()
 await root.getByRole('button',{name:'크게 보기 ↗'}).click();let full=page.locator('.bc-expanded')
 const input=full.locator('[data-component=form-input] input');await input.fill('name@example.com');assert.equal(await input.inputValue(),'name@example.com');assert.equal((await readStyle(input)).borderColor,'rgb(235, 235, 235)')
 const tabs=full.locator('[role=tablist]').first();await tabs.getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');assert.equal(await tabs.getByRole('tab').nth(1).getAttribute('aria-selected'),'true')
 const table=full.locator('[data-component=ex-data-table-cell]');assert.equal(await table.locator('td').first().evaluate(e=>getComputedStyle(e).borderBottomColor),'rgb(235, 235, 235)')
 const modal=full.locator('[data-kind=dialogs]').first();await modal.getByRole('button',{name:'대화상자 열기'}).click();assert(await modal.locator('dialog').evaluate(e=>e.open));await page.keyboard.press('Escape');assert(await full.evaluate(e=>e.open));report.interactions.push('Input source border, ArrowRight tabs, table divider, nested dialog Escape')
 await page.keyboard.press('Escape')
 await root.getByRole('button',{name:'In Context',exact:true}).click();const btn=root.locator('[data-kind=buttons] button').first();await btn.focus();await page.keyboard.press('Enter');assert((await root.innerText()).includes('클릭했습니다'))
 await root.getByRole('link',{name:'적용 가이드 ↗'}).click();assert(page.url().endsWith('/guides/apply-demo-code'));await page.getByRole('heading',{name:'Demo와 Code를 내 프로젝트에 붙이는 법',exact:true}).first().waitFor()
 report.interactions.push('Keyboard button feedback and real Guide route')
 for(const slug of ['baemin','coinbase','linear.app']){
  await page.goto(base+'/#/reference/admd-'+slug);root=page.locator('.bc-detail[data-full-spec=true]');await root.locator('.bc-handoff').waitFor();await page.evaluate(()=>document.fonts.ready)
  await page.emulateMedia({reducedMotion:'reduce'});await root.getByRole('button',{name:'In Context',exact:true}).click();assert(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches));const motion=await root.locator('*').evaluateAll(es=>es.filter(e=>getComputedStyle(e).animationName!=='none'||parseFloat(getComputedStyle(e).transitionDuration)>0).map(e=>e.className));assert.deepEqual(motion,[]);report.reducedMotion.push(slug)
  await context.setOffline(true);await root.getByRole('button',{name:'Catalog',exact:true}).click();await root.getByRole('button',{name:'크게 보기 ↗'}).click();full=page.locator('.bc-expanded');await checkRoot(full);await page.keyboard.press('Escape');report.offline.push({slug,scope:'already loaded catalog and spec; switch/expand offline'});await context.setOffline(false)
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[])
}finally{await writeFile(out+'/browser-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
console.log('PASS V2.3 Browser QA:',report.cases.length,'responsive cases, downloads, clipboard, semantic inventory, keyboard, reduced motion and warm offline')
