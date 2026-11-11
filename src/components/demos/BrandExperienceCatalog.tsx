import { type CSSProperties } from 'react'
import { canonicalSections, componentStyle, isDark, type BrandCatalog, type BrandTheme } from '../../lib/brandCatalog'
import { componentGroups, componentSize, experienceScene, experienceVariant } from '../../lib/brandExperience'
import { brandIdentifier, resolveBrandFont, curatedColors, curatedRoles, motionEvidence, responsiveEvidence } from '../../lib/brandPresentation'
import { BrandComponentSample } from './BrandComponentSample'
import { BrandAppliedPreview } from './BrandAppliedPreview'
import { BrandIdentityMark } from '../BrandIdentityMark'

function SectionNav({catalog}:{catalog:BrandCatalog}) {
 const hasResources=catalog.officialResources.length>0
 const jump=(targetId:string,current:HTMLElement)=>{
  const root=current.closest('.bc-root') as HTMLElement|null
  const target=root?.querySelector<HTMLElement>('#ex-'+targetId)
  if(!root||!target)return
  const headerHeight=root.querySelector<HTMLElement>(':scope > .bc-header')?.getBoundingClientRect().height||0
  const offset=target.getBoundingClientRect().top-root.getBoundingClientRect().top+root.scrollTop-headerHeight-12
  root.scrollTo({top:Math.max(0,offset),behavior:'auto'})
 }
 return <nav className="ex-section-nav" aria-label="Section navigation">{canonicalSections.filter(s=>s.id!=='resources'||hasResources).map(s=><button type="button" key={s.id} onClick={e=>jump(s.id,e.currentTarget)}>{s.label}</button>)}</nav>
}

function OverviewSection({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const asset=brandIdentifier(catalog.entry.slug,catalog.spec)
 const heading=catalog.roles.find(([k])=>/heading|headline|title|display/.test(k))?.[1]||catalog.roles[0]?.[1]||{}
 const headingFont=resolveBrandFont(heading)
 const btn=catalog.components.find(c=>c.kind==='buttons'&&!/disabled|hover|focus/.test(c.key))
 const btnStyle=btn?componentStyle(btn.values,catalog,theme):undefined
 return <section id="ex-overview" className="bc-section ex-overview" data-section="overview">
  <h4>Overview</h4>
  <div className="bc-dna">{catalog.dna.map(d=><span key={d.label} title={d.evidence}>{d.label}</span>)}</div>
  <div className="ex-overview-lockup"><BrandIdentityMark slug={catalog.entry.slug} dark={isDark(theme.colors.canvas)} context="preview"/><h3 style={{fontFamily:headingFont.stack,fontWeight:700}}>{catalog.entry.name}</h3></div>
  <p>{catalog.entry.description}</p>
  {asset.attribution&&<p className="bc-note bc-attribution">{asset.attribution}</p>}
  <div className="bc-overview-samples">
   <div className="bc-type-scroll"><span style={{fontFamily:headingFont.stack,fontSize:'clamp(24px,3vw,40px)',fontWeight:heading.fontWeight||700}}>Aa — Design</span></div>
   {btnStyle&&<span className="bc-overview-button" style={btnStyle}>Continue →</span>}
  </div>
 </section>
}

function CoverageStrip({catalog}:{catalog:BrandCatalog}) {
 const responsive=Object.keys(responsiveEvidence(catalog.spec)).length>0
 const motion=motionEvidence(catalog.spec).state
 const items=[
  ['COLOR',`${catalog.colors.length} roles`],
  ['TYPE',`${catalog.roles.length} roles`],
  ['COMPONENT',catalog.components.length?`${catalog.components.length} definitions`:'foundation only'],
  ['BEHAVIOR',`${responsive?'responsive evidence':'responsive not specified'} · ${motion==='defined'?'motion defined':motion==='not-in-scope'?'motion out of scope':'motion not specified'}`],
 ]
 return <section className="ex-coverage" aria-label="원본 디자인 규칙 범위" data-evidence="source-coverage">{items.map(([label,value])=><div key={label}><small>{label}</small><b>{value}</b></div>)}</section>
}

function FoundationSpecimen({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const heading=catalog.roles.find(([key])=>/display|hero|heading|headline|title/.test(key))?.[1]||catalog.roles[0]?.[1]||{}
 const body=catalog.roles.find(([key])=>/body|paragraph/.test(key))?.[1]||catalog.roles[1]?.[1]||heading
 const primary=resolveComponentStyleColor(catalog.spec.colors.primary,theme.colors.text)
 const radius=Object.values(catalog.spec.radius||{}).find(value=>typeof value==='string')||'12px'
 const style={
  '--foundation-canvas':theme.colors.canvas,
  '--foundation-surface':theme.colors.surface,
  '--foundation-ink':theme.colors.text,
  '--foundation-rule':theme.colors.border,
  '--foundation-accent':primary,
  '--foundation-radius':radius,
  '--foundation-heading':resolveBrandFont(heading).stack,
  '--foundation-body':resolveBrandFont({...body,script:'ko'}).stack,
 } as CSSProperties
 return <div className="ex-foundation" style={style} data-evidence="source-foundations">
  <div className="ex-foundation-copy"><small>FOUNDATION COMPOSITION</small><h5>원문에 독립 컴포넌트 정의가 없어 파운데이션으로 구성했습니다.</h5><p>색상, 글꼴, 모서리와 레이아웃 성격만 적용한 DRH 예시입니다. 공식 컴포넌트로 해석하지 않습니다.</p></div>
  <div className="ex-foundation-stage">
   <header><span>{catalog.entry.name}</span><small>{catalog.spec.layout.toUpperCase()}</small></header>
   <div><p>TYPE / COLOR / SPACE</p><strong>Aa</strong><i/><i/><i/></div>
  </div>
 </div>
}

function resolveComponentStyleColor(value:unknown,fallback:string) {
 return typeof value==='string'&&value.trim()?value:fallback
}

function DesignDnaSection({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const colors=curatedColors(catalog.colors)
 const roles=curatedRoles(catalog.roles)
 const allThemes=catalog.themes
 return <section id="ex-design-dna" className="bc-section ex-design-dna" data-section="design-dna">
  <h4>Design DNA</h4>

  {/* Semantic Palette */}
  <h5>Palette</h5>
  {allThemes.length>1&&<p className="bc-note">{allThemes.map(t=>t.label).join(' / ')} 테마가 감지되었습니다.</p>}
  <div className="ex-palette">
   {colors.map(([key,value])=><div key={key}><i style={{background:value}}/><span>{key}</span><code>{value}</code></div>)}
  </div>
  {colors.length<catalog.colors.length&&<p className="bc-note bc-catalog-count">대표 {colors.length}개 / 전체 {catalog.colors.length}개 · 크게 보기에서 확인</p>}

  {/* Typography Hierarchy */}
  <h5 className="ex-type-heading">Typography</h5>
  <div className="ex-type-hierarchy">
   {roles.map(([key,role])=>{
    const font=resolveBrandFont(role)
    const size=typeof role.fontSize==='number'?role.fontSize+'px':role.fontSize||'16px'
    return <div key={key} data-font-kind={font.kind}>
     <small>{key} · {size} · {typeof role.fontWeight==='number'||typeof role.fontWeight==='string'?role.fontWeight:'400'} · {font.declared||'미지정'}</small>
     <p style={{fontFamily:font.stack,fontSize:`clamp(12px, ${size}, 48px)`,fontWeight:role.fontWeight as number,lineHeight:role.lineHeight||1.4,letterSpacing:role.letterSpacing||'normal'} as CSSProperties}>
      {/body|paragraph/.test(key)?'Good design makes the everyday feel simple.':/mono/.test(key)?'const design = 2026;':'Aa — Design'}
     </p>
     <small className="bc-note">표시: {font.family} · {font.kind==='open-font'?'로컬 공개 폰트':font.kind==='system-font'?'OS 글꼴':'대체 글꼴'}</small>
    </div>
   })}
  </div>
  {roles.length<catalog.roles.length&&<p className="bc-note bc-catalog-count">대표 {roles.length}개 / 전체 {catalog.roles.length}개</p>}
 </section>
}

function ComponentLibrarySection({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 const scene=experienceScene(catalog)
 const variant=experienceVariant(catalog)
 const groups=componentGroups.map(g=>({...g,components:catalog.components.filter(c=>g.kinds.includes(c.kind)&&!/hover|pressed|focus|disabled|selected|active/.test(c.key))})).filter(g=>g.components.length)
 return <section id="ex-components" className="bc-section ex-components" data-section="components">
  <h4>Component Library</h4>
  <p className="bc-note">원문에서 감지한 컴포넌트 정의 {catalog.components.length}개를 상태 변형과 기본 형태로 나누어 보여줍니다.</p>
  {groups.map(group=><div key={group.label} className="ex-group">
   <h5>{group.label}</h5>
   <div className="ex-component-grid">
    {group.components.map(c=><div key={c.key} className={'ex-size-'+componentSize(c.kind)}>
     <BrandComponentSample component={c} catalog={catalog} theme={theme} scene={scene} variant={variant}/>
    </div>)}
   </div>
  </div>)}
  {!groups.length&&<FoundationSpecimen catalog={catalog} theme={theme}/>}
 </section>
}

function AppliedCanvasSection({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 return <section id="ex-applied-canvas" className="bc-section ex-applied-primary" data-section="applied-canvas">
  <span className="ex-preview-kicker">01 / BRAND PREVIEW</span>
  <h4>규칙이 화면이 되는 순간</h4>
  <p className="bc-note">색, 글꼴, 컴포넌트 속성은 원본 DESIGN.md에서 가져오고 배치와 예시 내용은 DRH가 구성했습니다. 직접 눌러 보며 화면의 성격을 확인하세요.</p>
  <BrandAppliedPreview catalog={catalog} theme={theme}/>
 </section>
}

function ResourcesSection({catalog}:{catalog:BrandCatalog}) {
 const resourceLabels:Record<string,string>={'brand-guidelines':'브랜드 가이드','design-system':'디자인 시스템','developer-design-guide':'개발자 디자인 가이드',typography:'타이포그래피',components:'컴포넌트',assets:'브랜드 에셋',other:'공식 자료'}
 if(!catalog.officialResources.length)return null
 return <section id="ex-resources" className="bc-section" data-section="resources">
  <h4>Resources</h4>
  <div className="bc-resources">{catalog.officialResources.map(r=><a key={r.url} href={r.url} target="_blank" rel="noreferrer" title={r.description}><small>{resourceLabels[r.type]||r.type}</small><b>{r.label} ↗</b><span>{r.description}</span></a>)}</div>
 </section>
}

export function BrandExperienceCatalog({catalog,theme}:{catalog:BrandCatalog;theme:BrandTheme}) {
 return <div className="bc-experience" data-catalog-mode="experience">
  <p className="bc-note bc-experience-intro">DESIGN.md → source-driven preview<br/>공식 제품 화면이 아닌, 검증된 규칙을 적용한 DRH 예시입니다.</p>
  <SectionNav catalog={catalog}/>
  <CoverageStrip catalog={catalog}/>
  <ResourcesSection catalog={catalog}/>
  <AppliedCanvasSection catalog={catalog} theme={theme}/>
  <OverviewSection catalog={catalog} theme={theme}/>
  <DesignDnaSection catalog={catalog} theme={theme}/>
  <ComponentLibrarySection catalog={catalog} theme={theme}/>
 </div>
}
