import hubLicense from '../../LICENSE?raw'
import meteorLicense from '../../docs/licenses/Magic-UI-MIT.txt?raw'
import type { ArtifactProvenance, ReferenceArtifacts, ReferenceItem } from '../types'
import type { OfficialShaderPreset } from '../data/shaderPresets'
import { buildAgentPackage, buildStandaloneHtml, provenanceFor, starterCodeFor } from './referencePackage'
import { recipes } from './demos/recipes'
import { designCss, designMarkdown, designTailwind } from './designSystem'
import { vendorEntryBySlug, UPSTREAM_COMMIT, UPSTREAM_REPO } from '../data/references'

const hub = 'https://github.com/natekeem/DRH'
export const hubProvenance: ArtifactProvenance = { origin:'hub-original', sourceUrl:hub, repository:hub, license:'MIT', evidenceUrl:hub+'/blob/main/LICENSE', notices:hubLicense }
export type ArtifactView = { id: string; label: string; filename: string; text: string; compact?: string; provenance: ArtifactProvenance; hint?: string }

// Provenance for upstream awesome-design-md entries
const vendorProvenance = (slug: string): ArtifactProvenance => ({
  origin: 'upstream-oss',
  sourceUrl: `${UPSTREAM_REPO}/tree/main/design-md/${slug}/DESIGN.md`,
  repository: UPSTREAM_REPO,
  license: 'MIT',
  evidenceUrl: `${UPSTREAM_REPO}/blob/main/LICENSE`,
  notices: `MIT License — Copyright (c) 2026 VoltAgent\nUpstream commit: ${UPSTREAM_COMMIT}\nSource: ${UPSTREAM_REPO}`,
  reviewedAt: '2026-09-08',
  sourceRevision: UPSTREAM_COMMIT,
})
const vendorDerivedProvenance = (slug: string): ArtifactProvenance => ({
  ...vendorProvenance(slug),
  origin: 'derived',
  notices: `Derived from VoltAgent/awesome-design-md (MIT)\nUpstream commit: ${UPSTREAM_COMMIT}\nDRH wrapper: MIT — ${hub}/blob/main/LICENSE`,
})


/** Legacy values are adapted on demand, never written back. Explicit artifacts take precedence. */
export function resolveArtifacts(item: ReferenceItem, preset?: OfficialShaderPreset): ReferenceArtifacts {
  // ── Vendor awesome-design-md entries ──────────────────────────────────────
  if(item.demo?.startsWith('vendor-design-md:')){
    const slug=item.demo.slice('vendor-design-md:'.length)
    const entry=vendorEntryBySlug[slug]
    const vProv=vendorProvenance(slug)
    const dProv=vendorDerivedProvenance(slug)
    const t=entry?.tokens
    const upstreamPath=`/vendor/awesome-design-md/${encodeURIComponent(slug)}/DESIGN.md`
    // DESIGN.md placeholder — lazy content is fetched client-side in ReferencePage
    const designMdPlaceholder=`<!-- DESIGN.md raw content is loaded lazily from ${upstreamPath} -->\n# ${item.name}\n\nLoading raw DESIGN.md from upstream snapshot…\nIf content does not appear, the file may not be available offline.`
    // Compact agent artifact
    const compact=`# ${item.name} — Design System\n\n## Use this design system\nDesign analysis derived from publicly visible ${item.name} web design, distributed through VoltAgent awesome-design-md.\n\n## Provenance\nSource: ${UPSTREAM_REPO}/tree/main/design-md/${slug}/DESIGN.md\nUpstream commit: ${UPSTREAM_COMMIT}\nLicense: MIT (VoltAgent)\nImported by: Design Reference Hub\n\n## Critical rules\n${item.description}\n\n## Tokens (normalised)\n${t?`\`\`\`json\n${JSON.stringify(t,null,2)}\n\`\`\``:'Tokens not available.'}\n\n## Colors\n${entry?Object.entries(entry.colors).map(([k,v])=>`- ${k}: ${v}`).join('\n'):'N/A'}\n\n## Implementation\n1. Copy the raw DESIGN.md into your project root.\n2. Point your AI agent (Cursor, Windsurf, GitHub Copilot) to it.\n3. Use the tokens above as CSS variables or Tailwind theme entries.\n4. Do not use proprietary brand fonts — use the system fallbacks listed in the DESIGN.md.\n\n## Do\n- Follow the color, spacing, and typography rules in the DESIGN.md.\n- Use system fonts as fallbacks for any proprietary font families.\n- Preserve the offline-safe nature of this reference.\n\n## Don't\n- Download or embed brand logos, trademarks, or proprietary fonts.\n- Claim this is an official ${item.name} design system.\n- Present derived output as the original source.\n\n## Validation\n- Tokens and preview match each other.\n- No external network request in the preview.\n- License and attribution visible to the user.\n\n## Source / License\n${item.source.name}: ${item.source.url||''}\nMIT — ${UPSTREAM_REPO}/blob/main/LICENSE\nUpstream commit: ${UPSTREAM_COMMIT}\n`
    // Extended agent artifact
    const extended=`# ${item.name} — Agent Design Package\n\n> Design analysis derived from publicly visible ${item.name} web design, distributed through VoltAgent awesome-design-md. This is NOT an official ${item.name} design system.\n\n## Source\n- Repository: ${UPSTREAM_REPO}\n- Path: design-md/${slug}/DESIGN.md\n- Upstream commit: ${UPSTREAM_COMMIT}\n- License: MIT (Copyright 2026 VoltAgent)\n- Imported by Design Reference Hub: 2026-09-08\n\n## Description\n${item.description}\n\n## Normalised DRH Tokens\n${t?`\`\`\`json\n${JSON.stringify(t,null,2)}\n\`\`\``:'Tokens not available.'}\n\n## Upstream Colors\n${entry?Object.entries(entry.colors).map(([k,v])=>`- \`${k}\`: ${v}`).join('\n'):'N/A'}\n\n## Implementation Guide\n\n### Step 1: Download DESIGN.md\nCopy the full raw DESIGN.md from the DESIGN.md tab in DRH, or download it directly.\nThis file is the upstream snapshot and is the authoritative design reference.\n\n### Step 2: Point your agent to it\nPlace DESIGN.md in your project root. Agents that respect DESIGN.md (Google Stitch, Cursor, etc.) will read it automatically.\n\n### Step 3: Use the tokens\nApply the normalised tokens above as CSS custom properties or Tailwind theme variables.\nFor any proprietary font families, use the system-ui fallbacks already provided.\n\n## Do\n- Follow the visual rules in the raw DESIGN.md.\n- Use system font fallbacks for proprietary fonts.\n- Reference this document's MIT license when distributing.\n\n## Don't\n- Claim this as an official ${item.name} design resource.\n- Download proprietary brand fonts or logos.\n- Use this to reproduce a brand's exact copyrighted UI.\n\n## License\nUpstream DESIGN.md: MIT — VoltAgent/awesome-design-md\nDRH preview and derived artifacts: MIT — natekeem/DRH\nUpstream commit: ${UPSTREAM_COMMIT}\n`
    // Tokens artifact
    const tokensJson=t?JSON.stringify({format:'drh-design-tokens-v1',source:'VoltAgent/awesome-design-md',slug,upstreamCommit:UPSTREAM_COMMIT,...t,allColors:entry?.colors,provenance:dProv},null,2):'{}'
    return {
      // designMd: no compact field — text = upstream raw (lazy-fetched in ReferencePage); compact undefined → UI shows no compact/extended toggle
      designMd:{extended:designMdPlaceholder,filename:'DESIGN.md',provenance:vProv},
      tokens:{json:tokensJson,filename:'tokens.json',provenance:dProv},
      agent:{extended,compact,filename:`${item.id}-agent-package.md`,provenance:dProv},
    }
  }

  // ── Standard artifact resolution ──────────────────────────────────────────
  const allowed=item.license.status==='copy-ok' && item.implementation.type!=='external'
  const out: ReferenceArtifacts = {}
  const p: ArtifactProvenance = item.demo==='meteors'
    ? {...hubProvenance,origin:'derived',sourceUrl:item.source.url,repository:item.source.repository,evidenceUrl:item.license.evidenceUrl!,notices:meteorLicense+'\n'+hubLicense}
    : item.demo==='shader-gradient'
    ? {...hubProvenance,origin:'derived',sourceUrl:item.source.url,repository:item.source.repository,evidenceUrl:item.license.evidenceUrl!,notices:'DRH wrapper MIT; @shadergradient/react MIT. Retain installed dependency notices.\n'+hubLicense}
    : hubProvenance
  const standalone=allowed?buildStandaloneHtml(item):null
  const starter=allowed?starterCodeFor(item,preset):''
  const recipe=recipes[item.demo]
  if(allowed){
    if(standalone){
      out.html={code:standalone,filename:'index.html',provenance:p}
      const css=standalone.match(/<style>([\s\S]*?)<\/style>/)?.[1]
      if(css)out.css={code:`/* ${p.notices??hubLicense}\nCompanion stylesheet: use the HTML artifact for DOM and behavior. */\n${css}`,filename:'styles.css',provenance:p}
      out.react={code:`/* ${hubLicense} */\n// Isolated browser demo wrapper. HTML, styles, logic and notices are embedded.\n// Removing the iframe on unmount releases its document and animation resources.\nexport default function Component() {\n  return <iframe title={${JSON.stringify(item.name)}} sandbox="allow-scripts" style={{width:'100%',height:'min(70vh,720px)',minHeight:320,border:0}} srcDoc={${JSON.stringify(standalone)}} />\n}\n`,filename:'Component.tsx',dependencies:['React 18+'],provenance:p}
    }else if(item.demo==='shader-gradient')out.react={code:starter,filename:'HeroShader.tsx',dependencies:['react@18','@shadergradient/react@2.4.20'],provenance:p}
    else if(starter&&!item.designMd){
      if(/^\s*<!doctype html/i.test(starter))out.html={code:starter,filename:'index.html',provenance:p}
    }
    if(item.designMd)out.designMd={extended:item.designMd,filename:'DESIGN.md',provenance:hubProvenance}
    if(item.designSystem&&item.artifacts?.designMd?.provenance.origin!=='reference-only'){
      const t=item.designSystem
      const original=item.artifacts?.designMd?.provenance
      const systemProvenance: ArtifactProvenance=original&&original.origin!=='hub-original'?{...original,origin:'derived',notices:[original.notices,hubLicense].filter(Boolean).join('\n\n')}:hubProvenance
      const notice=original&&original.origin!=='hub-original'?`/* Derived from ${original.sourceUrl}\nLicense: ${original.license}\n${original.notices??'Retain the upstream license notice supplied with the source document.'} */\n`:''
      out.designMd={extended:designMarkdown(item.name,item.description,t),compact:designMarkdown(item.name,item.description,t,true),filename:'DESIGN.md',provenance:systemProvenance}
      out.css={code:notice+designCss(t),filename:'styles.css',provenance:systemProvenance}
      out.tailwind={code:notice+designTailwind(t),version:'4',filename:'theme.css',provenance:systemProvenance}
      out.tokens={json:JSON.stringify({format:'drh-design-tokens-v1',...t,provenance:systemProvenance},null,2),filename:'tokens.json',provenance:systemProvenance}
    }
  }
  const extended=buildAgentPackage(item,preset)
  const compact=`# ${item.name}\n\n${item.prompt??item.description}\n\n## Behavior\n${recipe?.logic??(item.designSystem?'Apply the normalized design tokens and component rules.':'Prototype/reference: consult Extended for missing implementation details.')}\n\n## Dependencies\n${item.demo==='shader-gradient'?'React 18 + @shadergradient/react@2.4.20':standalone?'None for HTML; React 18+ for the iframe wrapper.':item.implementation.dependencies.join(', ')||'None required.'}\n\n## Must / Must Not\nPreserve exact CSS values, keyboard focus and reduced-motion. Do not claim prototype code is complete. Do not copy upstream assets without permission.\n\n## Tokens / Starter\n${out.designMd?.compact??(standalone?'Save the HTML artifact as index.html. Core CSS:\n```css\n'+(recipe?.css??'')+'\n```\nStarter structure (full behavior is in HTML / Extended):\n```html\n'+(recipe?.html??'')+'\n```':starter?'```tsx\n'+starter+'\n```':'No executable starter available. Use Source for discovery only.')}\n\n## Source / License\n${provenanceFor(item)}\n${item.source.url||hub}\n${item.license.name}: ${item.license.evidenceUrl||hub+'/blob/main/LICENSE'}\n`
  out.agent={extended,compact,filename:`${item.id}-agent-package.md`,provenance:hubProvenance}
  if(!allowed)return {agent:item.artifacts?.agent?.provenance.origin==='hub-original'?item.artifacts.agent:out.agent}
  const merged={...out,...item.artifacts}
  for(const key of Object.keys(merged) as (keyof ReferenceArtifacts)[]){
    if(merged[key]?.provenance.origin==='reference-only')delete merged[key]
  }
  return merged
}


export function artifactViews(item: ReferenceItem, preset?: OfficialShaderPreset): ArtifactView[] {
  const a=resolveArtifacts(item,preset), views: ArtifactView[]=[]
  for(const [id,label,filename] of [['agent','Agent',`${item.id}-agent-package.md`],['designMd','DESIGN.md','DESIGN.md'],['tailwind','Tailwind','theme.css'],['css','CSS','styles.css'],['tokens','Tokens','tokens.json'],['react','React','Component.tsx'],['html','HTML','index.html']] as const){
    const entry=a[id]
    if(!entry)continue
    const text='extended' in entry?entry.extended:'code' in entry?entry.code:entry.json
    if(!text.trim())continue
    views.push({id,label,filename:entry.filename??filename,text,compact:'compact' in entry?entry.compact:undefined,provenance:entry.provenance,hint:id==='react'&&a.react?.code.includes('srcDoc=')?'React iframe wrapper · HTML/CSS/JS를 격리해 실행합니다.':id==='tailwind'?`Tailwind CSS v${a.tailwind?.version??'4'}용 테마입니다.`:id==='css'&&a.html?'HTML의 구조·동작과 함께 사용하는 스타일입니다.':undefined})
  }
  if (item.source.name !== 'Design Reference Hub') {
    views.push({id:'source',label:'Source',filename:`${item.id}-source.md`,provenance:hubProvenance,text:`# ${item.name} — Source / License\n\n${provenanceFor(item)}\n\nDiscovery source: ${item.source.name}\n${item.source.url||hub}\nRepository: ${item.source.repository||hub}\nReference license: ${item.license.name}\nEvidence: ${item.license.evidenceUrl||hub+'/blob/main/LICENSE'}\n${item.license.notes??''}\n\n## Artifact provenance\n${views.map(v=>`### ${v.label}\nOrigin: ${v.provenance.origin}\nSource: ${v.provenance.sourceUrl}\nRepository: ${v.provenance.repository??'—'}\nLicense: ${v.provenance.license}\nEvidence: ${v.provenance.evidenceUrl}\n${v.provenance.notices??''}`).join('\n\n')}`})
  }
  return views
}
