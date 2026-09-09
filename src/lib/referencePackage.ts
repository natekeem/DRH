import hubLicense from '../../LICENSE?raw'
import type { ReferenceItem } from '../types'
import officialStarter from './demos/HeroShader.tsx?raw'
import { shaderPresets, type OfficialShaderPreset } from '../data/shaderPresets'
import { recipes, recipeHtml } from './demos/recipes'
import { fluidCursorHtml } from './demo-exports/fluidCursorHtml'
import { metaballsHtml } from './demo-exports/metaballsHtml'
import { liquidRefractionHtml } from './demo-exports/liquidRefractionHtml'
export type DemoMaturity = 'official' | 'working' | 'prototype' | 'external'
const legacy = new Set(['particles','accordion','rough-highlight','style-brutal','style-bento'])
const advancedDemos = new Set(['fluid-cursor', 'metaballs', 'liquid-refraction'])
export function demoMaturity(item:ReferenceItem):{kind:DemoMaturity;label:string;description:string}{
 if(item.implementation.type==='external')return{kind:'external',label:'LINK ONLY',description:'원본에서 확인하며 코드는 재배포하지 않습니다.'}
 if(item.demo?.startsWith('vendor-design-md:'))return{kind:'working',label:'WORKING DEMO',description:'awesome-design-md (MIT)에서 가져온 토큰으로 타이포, 색상, 버튼과 표면을 오프라인으로 렌더링합니다.'}
 if(item.designSystem)return{kind:'working',label:'WORKING DEMO',description:'정규화된 토큰으로 타이포, 색상, 버튼과 표면을 렌더링한 DRH 자체 specimen입니다.'}
 if(item.demo==='shader-gradient')return{kind:'official',label:'OFFICIAL LIVE',description:'공식 renderer를 실행합니다. WebGL 미지원·동작 줄이기 환경은 정적 fallback입니다.'}
 if(recipes[item.demo]||legacy.has(item.demo)||advancedDemos.has(item.demo))return{kind:'working',label:'WORKING DEMO',description:'핵심 시각 효과와 입력 동작을 구현한 Hub 데모입니다.'}
 return{kind:'prototype',label:'PROTOTYPE',description:'구도 또는 개념 예시입니다. 효과의 완전한 구현은 아직 제공하지 않습니다.'}
}
const hub='https://github.com/natekeem/DRH'
export function provenanceFor(item:ReferenceItem){
 if(recipes[item.demo]?.sourceNotes)return recipes[item.demo].sourceNotes!
 if(item.implementation.type==='external')return 'Reference Only — 소스 코드를 재배포하지 않습니다. 원본 Reference를 확인하세요.'
 if(item.demo?.startsWith('vendor-design-md:'))return `Derived / MIT — Design analysis from VoltAgent/awesome-design-md (MIT). Raw DESIGN.md는 upstream 원문 그대로 저장됩니다. DRH Preview, Compact, Agent는 파생 산출물입니다. Source: https://github.com/VoltAgent/awesome-design-md`
 if(item.artifacts?.designMd&&item.artifacts.designMd.provenance.origin!=='hub-original')return `DESIGN.md: ${item.artifacts.designMd.provenance.origin} / ${item.artifacts.designMd.provenance.license}. 토큰 미리보기는 DRH의 공통 renderer이며, 문서와 파생 Artifact의 출처를 Source 탭에서 확인하세요.`
 if(item.demo==='shader-gradient')return 'Original OSS — 공식 @shadergradient/react 2.4.20 패키지를 직접 실행합니다.'
 if(item.demo==='meteors')return 'Adapted OSS — Magic UI의 MIT Meteor head/tail 구조를 참고하여 CSS 데모로 재구현했습니다. 원문 라이선스를 다운로드에 포함합니다.'
 return 'Hub Original — Design Reference Hub에서 일반적인 시각 패턴을 학습/구현 목적으로 독립 구현한 데모입니다.'
}

export function starterCodeFor(item:ReferenceItem,preset:OfficialShaderPreset=shaderPresets[0]):string{
 if(item.implementation.type==='external'||item.license.status!=='copy-ok')return ''
 const candidates=[item.artifacts?.react,item.artifacts?.html,item.artifacts?.designMd].filter(x=>x!==undefined)
 const explicit=candidates.find(x=>x.provenance.origin!=='reference-only')
 if(explicit)return 'code' in explicit?explicit.code:explicit.extended
 if(candidates.length)return ''
 if(item.designMd)return item.designMd
 if(item.demo==='shader-gradient'){
  const props=Object.entries(preset.props).map(([key,value])=>`${key}={${JSON.stringify(value)}}`).join('\n     ')
  return '/* '+hubLicense+' */\n'+officialStarter.replace(/<ShaderGradient animate[\s\S]*?\/>/,`<ShaderGradient\n     ${props}\n   />`).replace("background:'linear-gradient(120deg,#ff5005,#dbba95,#d0bce1)'",`background:${JSON.stringify(preset.fallback)}`)
 }
 if (item.demo === 'fluid-cursor') return fluidCursorHtml({ variant: 'detail' })
 if (item.demo === 'metaballs') return metaballsHtml({ variant: 'detail' })
 if (item.demo === 'liquid-refraction') return liquidRefractionHtml({ variant: 'detail', intensity: 1, radius: 155 })
 return recipeHtml(item.demo)??item.code??''
}
export function packageReadiness(item:ReferenceItem):'Ready'|'Partial'|'Missing'{return recipes[item.demo]||advancedDemos.has(item.demo)||item.demo==='shader-gradient'?'Ready':'Partial'}
export function buildAgentPackage(item:ReferenceItem,preset:OfficialShaderPreset=shaderPresets[0]):string{
 if(item.artifacts?.agent&&item.artifacts.agent.provenance.origin!=='reference-only'&&((item.license.status==='copy-ok'&&item.implementation.type!=='external')||item.artifacts.agent.provenance.origin==='hub-original'))return item.artifacts.agent.extended
 if(item.designSystem&&item.license.status==='copy-ok'&&item.implementation.type!=='external'&&item.artifacts?.designMd?.provenance.origin!=='reference-only')return `# ${item.name}

## Goal
${item.description}
디자인 시스템 specimen은 동작합니다. Agent Package Partial은 완성된 제품 페이지가 포함되지 않았다는 뜻입니다.

## Prompt
아래 DESIGN.md와 CSS의 정확한 값을 사용하여 요청한 화면을 구현한다. 기존 라우터, 상태와 컴포넌트를 보존한다.

## Visual Target
Canvas / surface / text / primary 토큰을 각 역할대로 사용한다. 외부 브랜드 화면을 복제하지 않는다.

## Interaction Behavior
버튼은 최소 높이 44px, hover brightness(.94), ${item.designSystem.duration}ms transition. 실제 서비스 행동은 기존 handler에 연결한다. 미리보기의 Primary button은 선택 상태를 토글하고 Reset은 해제한다.

## Component Structure
.design-system > h1 + .surface > p + button. 기존 Button, Card primitive에 동일한 토큰을 적용할 수 있다.

## Dependencies
없음. 시스템 폰트를 사용한다. Tailwind Artifact는 v4 프로젝트에서만 선택적으로 사용한다.

## Implementation Logic
1. CSS 변수를 한 번 로드한다.
2. 기존 테마 값을 정규화 토큰에 매핑한다.
3. 아래 시작 구조에 제품 데이터를 연결한다.
4. 기본/hover/focus/disabled와 모바일 상태를 확인한다.

## Starter Code
아래 Design System Contract에 전체 HTML 구조와 CSS가 포함되어 있다. 인증, 데이터 저장, 라우팅은 포함하지 않는다.

## Responsive
390px 1열 / 16px 외부 여백; 1200px 이상 12-column / 24px gap. 화면별 그리드 구성은 제품 요구에 맞춘다.

## Reduced Motion
prefers-reduced-motion에서 비필수 transition을 제거한다.

## Source
${hub}
${provenanceFor(item)}
${item.artifacts?.designMd?`Document: ${item.artifacts.designMd.provenance.sourceUrl}\n${item.artifacts.designMd.provenance.notices??''}`:'DRH 자체 specimen. 외부 브랜드 자산을 포함하지 않는다.'}

## GitHub
${hub}

## License
MIT — ${hub}/blob/main/LICENSE

## Acceptance Criteria
- preview와 Artifact의 토큰 값 일치
- 390×844 / 1440×1000 가로 overflow 없음
- 키보드 focus와 실제 동작 확인
- 외부 폰트 요청 없음

## Design System Contract
${item.artifacts?.designMd?.extended??item.designMd??''}
`
 const official=item.demo==='shader-gradient'
 const advancedFakeRecipes: Record<string, {html:string,logic:string,acceptance:string}> = {
  'fluid-cursor': {
    html: '<canvas></canvas>',
    logic: 'pressure solver, velocity / dye splat, advection, diffusion, vorticity, divergence, pressure Jacobi, gradient subtraction, mobile budgets, reduced motion, cleanup. DO NOT replace this with: - opacity trail - blur-only glass - CSS circles',
    acceptance: 'pointer strokes visibly curl, spread, persist briefly, and dissipate. reduced motion releases resources.'
  },
  'metaballs': {
    html: '<canvas></canvas>',
    logic: 'continuous field, smooth merge, pointer repel / attraction, spring equilibrium, ellipse deformation, field shader, card/detail blob counts. DO NOT replace this with: - opacity trail - blur-only glass - CSS circles',
    acceptance: 'blobs share smooth necks, merge/separate under input. velocity changes ellipse deformation.'
  },
  'liquid-refraction': {
    html: '<canvas></canvas>',
    logic: 'generated texture, UV refraction, RGB channel offset, Fresnel / rim, pointer spring, velocity squash/stretch, press response. DO NOT replace this with: - opacity trail - blur-only glass - CSS circles',
    acceptance: 'grid/text bends visibly through the lens, with color fringes and moving highlight. pointer motion produces smooth spring follow and deformation.'
  }
 }
 const r=advancedFakeRecipes[item.demo]??recipes[item.demo]??(official?{html:'<HeroShader />',logic:`공식 ShaderGradientCanvas 안에 ShaderGradient를 배치한다. ${preset.title} preset의 색상·카메라·rotation·amplitude를 아래 TSX대로 적용한다. IntersectionObserver, visibilitychange, reduced-motion으로 renderer를 mount/unmount한다. WebGL 미지원 또는 오류 시 gradient fallback을 유지한다.`,acceptance:`공식 ${preset.title} 색상과 mesh가 움직인다. offscreen/reduced-motion에서 renderer가 정지하고 fallback을 표시한다.`}:undefined),starter=starterCodeFor(item,preset),m=demoMaturity(item)
 return `# ${item.name}${official?' / '+preset.title:''}

## Goal
${item.name}의 시각적 동작을 기존 프로젝트에서 재현한다. ${item.description}
제공 수준: ${m.label} / Agent Package ${packageReadiness(item)}.

## Prompt
${item.prompt??''}
아래 코드와 구현 순서를 기준으로 구현한다. ${r?r.acceptance:'미완성 항목이다. 원본과 비교하며 부족한 동작을 먼저 확인한다.'}

## Visual Target
${item.description}
${official?`아래 TSX는 공식 ${preset.title} preset과 renderer를 사용한다.`:r?'Starter Code는 Hub 미리보기와 동일한 HTML/CSS/JavaScript다. 색상·크기·blur·timing 값을 유지한 후 제품 내용을 교체한다.':'현재 미리보기는 구성 참고용이며 완성된 전체 페이지 코드가 아니다.'}

## Interaction Behavior
${r?.logic??'구체적인 interaction 로직은 아직 미완성이다. 원본을 확인하고 trigger, 상태 전이, 시간, 종료 조건을 명시해야 한다.'}

## Component Structure
${official?'HeroShader > ShaderBoundary > ShaderGradientCanvas > ShaderGradient. 스타일과 lifecycle은 TSX에 포함한다.':r?'index.html > main (relative, isolation:isolate, overflow:hidden) > 아래 HTML. CSS는 style에, lifecycle과 이벤트는 script에 포함한다. React로 옮길 때 main ref를 만들고 useEffect에서 초기화/정리한다.':item.designMd?'DESIGN.md를 프로젝트의 디자인 규칙으로 사용한다. 화면 구현은 별도로 필요하다.':'완성된 export DOM 구조는 아직 제공하지 않는다.'}
${r?'```html\n'+r.html+'\n```':''}

## Dependencies
${official?'React 18 + @shadergradient/react@2.4.20. npm install react react-dom @shadergradient/react@2.4.20':r?'외부 패키지 없음. 브라우저 DOM/CSS/Canvas/WebGL API만 사용한다.':item.implementation.dependencies.join(', ')||'새 패키지는 필수가 아니다.'}

## Implementation Logic
${r?.logic??'미완성: 원본 구현을 검토해 효과별 알고리즘을 구체화한다.'}
${official?'1. 의존성을 설치한다.\n2. HeroShader.tsx를 추가한다.\n3. 부모 컨테이너에서 렌더하고 필요하면 높이를 변경한다.\n4. 정적 fallback과 viewport 재진입을 확인한다.':r?'1. index.html로 저장하고 브라우저에서 실행한다.\n2. main을 원하는 크기의 컨테이너로 옮긴다.\n3. 색상·크기·시간은 CSS/상수에서 조정한다.\n4. React 전환 시 document query를 컨테이너 ref query로 제한한다.\n5. unmount에서 RAF, observer, event listener 및 GPU resource를 정리한다.':''}

## Starter Code
${starter?'```'+(item.designMd||item.artifacts?.designMd?'markdown':official||item.artifacts?.react?'tsx':'html')+'\n'+starter+'\n```':'실행 가능한 Starter Code는 아직 제공하지 않는다. 주석 blueprint를 실행 코드로 취급하지 않는다.'}

## Usage
${official?'HeroShader.tsx로 저장하고 <HeroShader />로 사용한다. 의존성 설치 명령은 코드 상단에 있다.':r?'의존성 설치 없이 index.html로 저장해 연다. iframe 삽입 시 title과 sandbox="allow-scripts"를 사용한다. viewport 진입 시 mount하고 화면 밖에서 unmount한다.':item.designMd?'DESIGN.md로 저장한다.':'원본의 설치·사용 지침을 확인한다.'}

## Responsive
${recipes[item.demo]?.responsive??(r?'main은 부모 너비/높이에 맞추며 최소 높이는 190px이다. typography는 clamp를 사용한다. coarse pointer에서는 중앙/정적 구도를 유지한다. Scroll demo는 native touch scroll을 사용한다.':'390px 너비에서 레이아웃과 텍스트 overflow를 별도 검증한다.')}

## Reduced Motion
prefers-reduced-motion: reduce에서 장식 CSS animation/transition을 제거한다. RAF는 한 프레임만 렌더한다. 시스템 설정 변경도 반영한다. 읽기 순서와 핵심 정보는 유지한다.

## Source
${item.source.name}: ${item.source.url||hub}
Hub implementation: ${hub}/blob/main/src/${official?'lib/demos/HeroShader.tsx':r?'lib/demos/recipes.ts':'components/demos/DemoRenderer.tsx'}
${provenanceFor(item)}

## GitHub
${item.source.repository??hub}

## License
Hub original implementation: MIT — ${hub}/blob/main/LICENSE
참고 upstream: ${item.license.name}
Evidence: ${item.license.evidenceUrl||hub+'/blob/main/LICENSE'}
Upstream 링크는 코드가 그 프로젝트에서 복사됐다는 뜻이 아니다. 외부 이미지·폰트는 별도 허가가 필요하다.

## Acceptance Criteria
- ${r?.acceptance??'현재 Prototype/Partial이다. 원본과 비교한 구체적인 visual acceptance가 추가되어야 완료할 수 있다.'}
- 1440×1000 및 390×844에서 가로 overflow가 없다.
- 키보드 조작과 visible focus를 확인한다.
- reduced-motion에서 비필수 움직임이 멈춘다.
- 화면 밖에서 RAF/observer/GPU 작업이 지속되지 않는다.
- 콘솔 오류 없이 mount/unmount 및 재진입이 가능하다.
- Source와 코드 출처의 구분 및 라이선스 고지를 유지한다.
`
}
export function buildStandaloneHtml(item:ReferenceItem):string|null{
 if (item.license.status!=='copy-ok'||item.implementation.type==='external') return null
 if (item.demo === 'fluid-cursor') return fluidCursorHtml({ variant: 'detail' })
 if (item.demo === 'metaballs') return metaballsHtml({ variant: 'detail' })
 if (item.demo === 'liquid-refraction') return liquidRefractionHtml({ variant: 'detail', intensity: 1, radius: 155 })
 return recipeHtml(item.demo)
}
