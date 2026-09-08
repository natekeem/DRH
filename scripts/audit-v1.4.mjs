import { build } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const result=await build({stdin:{contents:`export {references} from './src/data/references'; export {resolveArtifacts,artifactViews,hubProvenance} from './src/lib/artifacts'; export {demoMaturity,starterCodeFor,buildAgentPackage,packageReadiness,provenanceFor} from './src/lib/referencePackage'; export {recipes} from './src/lib/demos/recipes'; export {shaderPresets} from './src/data/shaderPresets'`,resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'raw',setup(b){b.onResolve({filter:/\?raw$/},args=>({path:new URL(args.path.replace('?raw',''), 'file:///'+args.resolveDir.replaceAll('\\','/')+'/').pathname.replace(/^\/([A-Z]:)/,'$1'),namespace:'raw'}));b.onLoad({filter:/.*/,namespace:'raw'},async args=>({contents:await readFile(decodeURIComponent(args.path),'utf8'),loader:'text'}))}}]})
const {references,recipes,demoMaturity,starterCodeFor,buildAgentPackage,packageReadiness,provenanceFor,shaderPresets,resolveArtifacts,artifactViews,hubProvenance}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'))
const previous=new Set(['particles','image-trail','magnetic-button','tilt-card','comparison-slider','typewriter','scramble-text','number-ticker','accordion','accordion-motion','confetti','ripple','hover-lift','marquee','text-reveal','blur-reveal','split-text','gradient-text','shimmer-text','rotating-words','rough-highlight','animated-border','shimmer-button','image-reveal','style-brutal','style-bento'])
const headings=['Goal','Prompt','Visual Target','Interaction Behavior','Component Structure','Dependencies','Implementation Logic','Starter Code','Responsive','Reduced Motion','Source','GitHub','License','Acceptance Criteria']
assert.equal(new Set(references.map(r=>r.id)).size,references.length)
const counts={},packages={},rows=[],packageRows=[]
for(const item of references){const status=demoMaturity(item),ready=packageReadiness(item),code=starterCodeFor(item),pkg=buildAgentPackage(item);counts[status.label]=(counts[status.label]??0)+1;packages[ready]=(packages[ready]??0)+1;for(const h of headings)assert(pkg.includes('## '+h),item.id+' missing '+h);if(code.startsWith('<!doctype')){assert(code.includes('viewport'));for(const script of code.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(script[1]);assert(code.includes('prefers-reduced-motion'));}if(ready==='Ready'){assert(code.startsWith('<!doctype')||item.demo==='shader-gradient');if(item.demo!=='shader-gradient'){assert(recipes[item.demo]?.logic);assert(recipes[item.demo]?.acceptance)}}const old=item.demo==='shader-gradient'?'OFFICIAL LIVE':previous.has(item.demo)?'WORKING DEMO':'PROTOTYPE';const needs=status.kind==='prototype'?item.category==='Pages'?'실제 다중 section/화면 동작 및 일치하는 export 필요':item.category==='DESIGN.md'?'방향별 구체적 token/타이포/예시 구현 필요':item.demo==='fluid-cursor'?'유체 solver와 잔류 흐름 미구현':item.demo==='metaballs'?'pointer 반발/병합 검증 필요':'canonical 세부 동작과 완성 export 필요':ready==='Partial'?'실행 가능한 export 보강':'제품 적용 시 크기/내용 조정';rows.push(`| ${item.name} (${item.id}) | ${item.category} | ${old} | ${status.label} | ${item.designSystem?'Normalized tokens / generic specimen':recipes[item.demo]?'HTML/CSS/JS shared preview/export':'기존 React/CSS demo'} | ${item.source.name} | ${needs} |`);packageRows.push(`| ${item.name} (${item.id}) | ${ready==='Ready'?'구체적':'기본/부분'} | ${recipes[item.demo]||item.demo==='shader-gradient'?'효과별':'미완성'} | ${code?item.designMd?'DESIGN.md':item.demo==='shader-gradient'?'실행 TSX':'실행 HTML':'없음'} | ${item.source.url||'Hub Original'} | ${item.license.evidenceUrl} | ${ready} |`)}
const header='# V1.4 Demo Status\n\n93개 항목을 renderer, CSS/JS 동작, source, export 기준으로 재분류했다. Working은 canonical 핵심 효과를 보여주는 데모이며 실제 제품 통합 완료를 의미하지 않는다. Prototype은 수량을 맞추기 위해 승격하지 않았다. V1.5에서 정규화 토큰을 갖춘 DESIGN.md specimen 10개를 Working으로 검증했다. Browser 증거와 검수 범위는 V1_4_AUDIT.md 및 V1_5_REFERENCE_WORKSPACE.md 참조.\n\n'+Object.entries(counts).map(([k,v])=>`- ${k}: ${v}`).join('\n')+'\n\n| Reference | Category | Previous Status | New Status | Implementation | Source | Needs More Work |\n|---|---|---|---|---|---|---|\n'
await writeFile('docs/V1_4_DEMO_STATUS.md',header+rows.join('\n')+'\n')
await writeFile('docs/V1_4_AGENT_PACKAGE_STATUS.md','# V1.4 Agent Package Status\n\nReady: 효과별 로직·DOM·동일한 실행 HTML·출처·검수 조건 제공. Partial: 구조는 제공하지만 완성된 재현 코드/효과별 계약이 부족함. DESIGN.md는 문서이며 실행 코드로 집계하지 않는다.\n\n'+JSON.stringify(packages)+'\n\n| Reference | Prompt | Logic | Starter Code | Source | License | Ready |\n|---|---|---|---|---|---|---|\n'+packageRows.join('\n')+'\n')
console.log(JSON.stringify({references:references.length,demos:counts,packages,standalone:references.filter(r=>starterCodeFor(r).startsWith('<!doctype')).length,checks:'Unique IDs; required package sections; JavaScript syntax; Ready has executable HTML/TSX; motion fallback'},null,2))



for(const preset of shaderPresets){
 const item=references.find(r=>r.demo==='shader-gradient')
 const code=starterCodeFor(item,preset)
 assert(code.includes('color1={'+JSON.stringify(preset.props.color1)+'}'),preset.id+' export color mismatch')
 assert(code.includes('type={'+JSON.stringify(preset.props.type)+'}'),preset.id+' export geometry mismatch')
 assert(code.includes(JSON.stringify(preset.fallback)),preset.id+' fallback mismatch')
 assert(buildAgentPackage(item,preset).startsWith('# Shader Gradient / '+preset.title))
 await build({stdin:{contents:code,loader:'tsx'},write:false,format:'esm'})
}
console.log('10 official preset exports: syntax, identity, geometry, color and fallback passed.')


// V1.5 compatibility and ingestion contracts, in addition to all V1.4 checks above.
assert.equal(references.length,93,'V1.5 must not bulk-import references');
let artifactCount=0;
for(const item of references){
 const resolved=resolveArtifacts(item), views=artifactViews(item);
 assert(views.some(v=>v.id==='agent'));assert(views.some(v=>v.id==='source'));
 assert.equal(new Set(views.map(v=>v.id)).size,views.length);
 for(const v of views){
  assert(v.text.trim(),`${item.id}/${v.id} empty artifact`);
  assert(v.filename&&!/[\\/]/.test(v.filename),`${item.id}/${v.id} unsafe filename`);
  assert(v.provenance.origin&&v.provenance.license&&/^https:\/\//.test(v.provenance.evidenceUrl));
  if(v.compact)assert(v.compact.length<v.text.length,`${item.id}/${v.id} Compact must be shorter`);
  if(v.id==='react')await build({stdin:{contents:v.text,loader:'tsx'},write:false,format:'esm'});
  if(v.id==='tokens')JSON.parse(v.text);
  artifactCount++;
 }
 if(resolved.html&&recipes[item.demo])assert.equal(resolved.html.code,starterCodeFor(item),'HTML must equal live recipe export');
 if(item.designSystem){
  assert.deepEqual(views.map(v=>v.id),['agent','designMd','tailwind','css','tokens','source']);
  const json=JSON.parse(resolved.tokens.json);assert.deepEqual(json.colors,item.designSystem.colors);
  for(const value of Object.values(item.designSystem.colors)){
   assert(resolved.css.code.includes(value));assert(resolved.tailwind.code.includes(value));assert(resolved.designMd.extended.includes(value));
  }
 }
}
const seed=references.find(r=>r.id==='liquid-glass');
const external={...seed,implementation:{...seed.implementation,type:'external'},license:{...seed.license,status:'reference'},artifacts:{html:{code:'DO NOT REDISTRIBUTE',provenance:{...hubProvenance,origin:'reference-only'}}}};
assert.deepEqual(artifactViews(external).map(v=>v.id),['agent','source']);
assert(!artifactViews(external).some(v=>v.text.includes('DO NOT REDISTRIBUTE')));
const native={...seed,demo:'future-demo',prompt:undefined,code:undefined,designMd:undefined,artifacts:{react:{code:'export default function Widget(){return <button>Ready</button>}',filename:'Widget.tsx',provenance:hubProvenance}}};
assert.equal(resolveArtifacts(native).react.code,native.artifacts.react.code);
assert(buildAgentPackage(native).includes(native.artifacts.react.code),'artifacts-only starter must reach Agent');
const custom={...seed,artifacts:{agent:{extended:'Custom extended handoff',compact:'Custom',provenance:hubProvenance}}};
assert.equal(resolveArtifacts(custom).agent.extended,'Custom extended handoff');
const registry=JSON.parse(await readFile('src/data/source-map.json','utf8'));
assert.equal(registry.source_count,registry.sources.length);
assert.equal(new Set(registry.sources.map(s=>s.source)).size,registry.sources.length);
for(const [status,count] of Object.entries(registry.status_counts))assert.equal(count,registry.sources.filter(s=>s.recommendation===status).length);
for(const name of ['Refero Styles','VoltAgent Awesome DESIGN.md / getdesign.md','design-isms','MotionSites','PromptSites','GetLayers'])assert(registry.sources.find(s=>s.source===name)?.classification,name+' missing classification');
const guide=await readFile('src/content/guides/using-design-md.md','utf8');
for(let n=1;n<=11;n++)assert(guide.includes('## '+n+'.'),'guide section '+n);
assert.equal((guide.match(/^```/gm)||[]).length%2,0,'unclosed guide code fence');
console.log(`V1.5: ${artifactCount} artifacts; 93 legacy records; 10 normalized previews; TSX syntax; token parity; Compact length; provenance; restricted/native schema fixtures; six source policies; guide content passed.`);
const blockedAgent={...external,artifacts:{agent:{extended:'RESTRICTED AGENT BODY',provenance:{...hubProvenance,origin:'reference-only'}}}};
assert(!artifactViews(blockedAgent).some(v=>v.text.includes('RESTRICTED AGENT BODY')),'restricted agent must not leak through compatibility fallback');
const meteor=resolveArtifacts(references.find(r=>r.demo==='meteors'));
assert(meteor.css.code.includes('Copyright')&&meteor.css.code.includes('Magic UI'),'standalone CSS must retain upstream notice');
const imported={...references.find(r=>r.id==='minimal-saas'),artifacts:{designMd:{extended:'# Preserved original',provenance:{...hubProvenance,origin:'upstream-oss',sourceUrl:'https://example.org/design.md',notices:'EXAMPLE UPSTREAM NOTICE'}}}};
assert.equal(resolveArtifacts(imported).designMd.extended,'# Preserved original');
assert.equal(resolveArtifacts(imported).css.provenance.origin,'derived');
assert(resolveArtifacts(imported).css.code.includes('EXAMPLE UPSTREAM NOTICE'));
const blockedDesign={...imported,implementation:{...imported.implementation,type:'external'},license:{...imported.license,status:'reference'},artifacts:{designMd:{extended:'FORBIDDEN DOCUMENT',provenance:{...hubProvenance,origin:'reference-only'}}}};
assert(!artifactViews(blockedDesign).some(v=>v.text.includes('FORBIDDEN DOCUMENT')),'external normalized preview must not leak document via Agent');
