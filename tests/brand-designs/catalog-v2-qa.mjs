import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright'),sharp=require(process.env.SHARP_PATH||'sharp')
const base=process.env.DRH_URL||'http://127.0.0.1:5174',out=process.env.DRH_QA_OUT||'artifacts/brand-v21'
const canaries=['apple','airbnb','notion','linear.app','stripe','vercel','spotify','ferrari','nintendo-2001','binance','tesla','figma','ibm','supabase']
await mkdir(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true})
const report={cards:[],details:[],expanded:[],errors:[],external:[],offline:false,focusTrap:false,reducedMotion:true}
async function jump(root,id){await root.locator('.bc-jump-menu summary').click();const name=await root.locator('[data-section="'+id+'"] h4').innerText();await root.locator('.bc-jump-options button').filter({hasText:name.replace(/\n/g,'').replace(/\d+$/,'').trim()}).first().click()}
async function geometry(el){return el.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,height:e.clientHeight,scrollHeight:e.scrollHeight}))}
try{
 for(const [width,height]of [[1920,1080],[1440,1000],[390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce'}),page=await context.newPage()
  page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base)&&!r.url().startsWith('data:'))report.external.push(r.url())})
  await page.goto(base+'/tests/brand-designs/index.html')
  const tiles=[]
  for(const slug of canaries){
   const card=page.locator('.reference-card').filter({has:page.locator('a[href="/reference/admd-'+slug+'"]')});await card.scrollIntoViewIfNeeded();const el=card.locator('.bc-card');await el.waitFor();await page.evaluate(()=>document.fonts.ready)
   const g=await geometry(el);assert(g.scrollWidth<=g.width+1&&g.scrollHeight<=g.height+1,slug+' card overflow '+width)
   assert(await el.locator('.bc-micro').evaluate(e=>e.clientHeight)>=32,slug+' clipped micro specimen');assert.equal(await el.locator('.bc-identifier b').count(),1);assert(await el.locator('.bc-dna span').count()>=2);assert.equal(await el.locator('a').count(),0)
   const path=out+'/card-'+slug+'-'+width+'.png';await el.screenshot({path});tiles.push(path);report.cards.push({slug,viewportWidth:width,...g})
  }
  const thumbs=await Promise.all(tiles.map(p=>sharp(p).resize(320,230,{fit:'contain',background:'#eee'}).toBuffer()))
  await sharp({create:{width:1280,height:Math.ceil(canaries.length/4)*230,channels:3,background:'#eee'}}).composite(thumbs.map((input,i)=>({input,left:(i%4)*320,top:Math.floor(i/4)*230}))).png().toFile(out+'/cards-'+width+'.png')
  for(const slug of canaries){
   await page.goto(base+'/#/reference/admd-'+slug);const detail=page.locator('.bc-detail[data-full-spec=true]');await detail.waitFor()
   const full=JSON.parse(await readFile('public/brand-design-specs/'+slug+'.json','utf8')),g=await geometry(detail)
   assert(await detail.evaluate(e=>e.getBoundingClientRect().bottom<=e.parentElement.getBoundingClientRect().bottom+1),slug+' catalog clipped by workspace')
   assert(g.scrollWidth<=g.width+1,slug+' detail overflow '+width);assert(g.scrollHeight>g.height)
   assert.equal(await page.getByRole('button',{name:'Replay',exact:true}).count(),0)
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await detail.locator('.bc-source-prose:visible table').count(),0,'No raw tables in default Detail');
   assert(await detail.locator('.bc-type').count()<=5);assert(await detail.locator('.bc-color').count()<=8);
   const responsive=Object.keys(full.sections||{}).some(k=>/responsive|breakpoint/i.test(k));assert.equal(await detail.locator('[data-section=responsive]').count(),responsive?1:0);
   const visible=await detail.innerText();assert(!/\[\s*\]|\{\s*\}|\[\s*"/.test(visible),'No JSON syntax in curated Detail');
   await detail.screenshot({path:out+'/detail-'+slug+'-'+width+'.png'})
   report.details.push({slug,viewportWidth:width,...g,officialLinks:await detail.locator('.bc-resources a').count()})
   await detail.getByRole('button',{name:'크게 보기'}).click();const expanded=page.locator('.bc-expanded');await expanded.waitFor()
   assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'닫기 ✕')
   const eg=await geometry(expanded);assert(eg.scrollWidth<=eg.width+1,slug+' expanded overflow '+width)
   assert.equal(await expanded.locator('[data-component]').count(),Object.keys(full.components).length)
   assert.equal(await expanded.locator('.bc-type').count(),Object.keys(full.typography).length)
   assert.equal(await expanded.locator('.bc-resources a').count(),await detail.locator('.bc-resources a').count())
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:out+'/expanded-'+slug+'-'+width+'.png'})
   const themeButtons=expanded.locator('.bc-themes button');if(await themeButtons.count()>1){const before=await expanded.getAttribute('data-theme');await themeButtons.filter({hasText:before==='dark'?'Light':'Dark'}).click();assert.notEqual(await expanded.getAttribute('data-theme'),before);assert.equal(await detail.getAttribute('data-theme'),await expanded.getAttribute('data-theme'));await themeButtons.filter({hasText:before==='dark'?'Dark':'Light'}).click()}
   if(width===1440||width===390){await jump(expanded,'buttons');await page.screenshot({path:out+'/components-'+slug+'-'+width+'.png'})}
   const button=expanded.locator('[data-kind=buttons] .bc-sample>button:not(:disabled)').first();if(await button.count()){await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true')}
   const input=expanded.locator('.bc-field input:not([type=radio]):not([type=checkbox]):not(:disabled)').first();if(await input.count()){await input.fill('Catalog QA');assert.equal(await input.inputValue(),'Catalog QA')}
   const tabs=expanded.locator('[role=tablist]').first();if(await tabs.count()){await tabs.getByRole('tab').last().click();assert.equal(await tabs.getByRole('tab').last().getAttribute('aria-selected'),'true');await page.keyboard.press('ArrowLeft');assert.equal(await tabs.getByRole('tab').first().getAttribute('aria-selected'),'true')}
   const open=expanded.getByRole('button',{name:/Open (dialog|drawer)/}).first();if(await open.count()){await open.click();assert.equal(await expanded.locator('.bc-sample-dialog[open]').count(),1);await page.keyboard.press('Escape');assert.equal(await expanded.locator('.bc-sample-dialog[open]').count(),0);assert.equal(await expanded.count(),1)}
   if(width===1440){await jump(expanded,'geometry');await page.screenshot({path:out+'/geometry-'+slug+'-'+width+'.png'})}
   if(await expanded.locator('[data-section=elevation]').count()){await jump(expanded,'elevation');await page.screenshot({path:out+'/elevation-'+slug+'-'+width+'.png'})}
   if(await expanded.locator('[data-section=responsive]').count()){await jump(expanded,'responsive');await page.screenshot({path:out+'/responsive-'+slug+'-'+width+'.png'})}
   await jump(expanded,'source');assert(await expanded.evaluate(e=>e.scrollTop)>0)
   const close=expanded.getByRole('button',{name:'닫기 ✕',exact:true});await close.focus();const rect=await close.boundingBox();assert(rect.y>=0&&rect.y+rect.height<=height)
   await expanded.evaluate(e=>{const els=[...e.querySelectorAll('button:not(:disabled),select,input:not(:disabled),a[href],summary')].filter(x=>x.getClientRects().length&&x.tabIndex>=0);els.at(-1)?.focus()});await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement?.closest('.bc-expanded')));await page.keyboard.press('Shift+Tab');assert(await page.evaluate(()=>!!document.activeElement?.closest('.bc-expanded')));report.focusTrap=true
   await page.keyboard.press('Escape');assert.equal(await expanded.count(),0);assert.equal(await page.evaluate(()=>document.body.style.overflow),'');assert.equal(await detail.getByRole('button',{name:'크게 보기'}).evaluate(e=>e===document.activeElement),true)
   await detail.getByRole('button',{name:'크게 보기'}).click();await page.locator('.bc-expanded').getByRole('button',{name:'닫기 ✕',exact:true}).click();assert.equal(await page.locator('.bc-expanded').count(),0)
   report.expanded.push({slug,viewportWidth:width,...eg,components:Object.keys(full.components).length,escape:true,close:true,restore:true,themes:await detail.locator('.bc-themes button').count()})
   console.log('PASS',slug,width)
  }
  if(width===390){await context.setOffline(true);await page.locator('.bc-detail').getByRole('button',{name:'크게 보기'}).click();await page.locator('.bc-expanded [data-kind=buttons] .bc-sample>button:not(:disabled)').first().click();await page.keyboard.press('Escape');report.offline=true;await context.setOffline(false)}
  await context.close()
 }
 assert.equal(report.errors.length,0,report.errors.join('\n'));assert.equal(report.external.length,0,report.external.join('\n'))
}finally{await writeFile(out+'/browser-qa.json',JSON.stringify(report,null,2)+'\n');await browser.close()}
console.log('PASS: 42 Card/Detail/Expanded cases, keyboard, touch, source coverage, offline, no external requests')
