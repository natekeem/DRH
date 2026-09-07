import hubLicense from '../../LICENSE?raw'
import type { ReferenceItem } from '../types'
import officialStarter from './demos/HeroShader.tsx?raw'
import { shaderPresets, type OfficialShaderPreset } from '../data/shaderPresets'
import { recipes, recipeHtml } from './demos/recipes'
export type DemoMaturity = 'official' | 'working' | 'prototype' | 'external'
const legacy = new Set(['particles','accordion','rough-highlight','style-brutal','style-bento'])
export function demoMaturity(item:ReferenceItem):{kind:DemoMaturity;label:string;description:string}{
 if(item.implementation.type==='external')return{kind:'external',label:'LINK ONLY',description:'원본에서 확인하며 코드는 재배포하지 않습니다.'}
 if(item.demo==='shader-gradient')return{kind:'official',label:'OFFICIAL LIVE',description:'공식 renderer를 실행합니다. WebGL 미지원·동작 줄이기 환경은 정적 fallback입니다.'}
 if((recipes[item.demo]&&item.demo!=='fluid-cursor')||legacy.has(item.demo))return{kind:'working',label:'WORKING DEMO',description:'핵심 시각 효과와 입력 동작을 구현한 Hub 데모입니다.'}
 return{kind:'prototype',label:'PROTOTYPE',description:'구도 또는 개념 예시입니다. 효과의 완전한 구현은 아직 제공하지 않습니다.'}
}
const hub='https://github.com/natekeem/DRH'
export function provenanceFor(item:ReferenceItem){
 if(item.implementation.type==='external')return 'Reference Only — 소스 코드를 재배포하지 않습니다. 원본 Reference를 확인하세요.'
 if(item.demo==='shader-gradient')return 'Original OSS — 공식 @shadergradient/react 2.4.20 패키지를 직접 실행합니다.'
 if(item.demo==='meteors')return 'Adapted OSS — Magic UI의 MIT Meteor head/tail 구조를 참고하여 CSS 데모로 재구현했습니다. 원문 라이선스를 다운로드에 포함합니다.'
 return 'Hub Original — Design Reference Hub에서 일반적인 시각 패턴을 학습/구현 목적으로 독립 구현한 데모입니다.'
}
export function starterCodeFor(item:ReferenceItem,preset:OfficialShaderPreset=shaderPresets[0]):string{
 if(item.implementation.type==='external'||item.license.status!=='copy-ok')return ''
 if(item.designMd)return item.designMd
 if(item.demo==='shader-gradient'){
  const props=Object.entries(preset.props).map(([key,value])=>`${key}={${JSON.stringify(value)}}`).join('\n     ')
  return '/* '+hubLicense+' */\n'+officialStarter.replace(/<ShaderGradient animate[\s\S]*?\/>/,`<ShaderGradient\n     ${props}\n   />`).replace("background:'linear-gradient(120deg,#ff5005,#dbba95,#d0bce1)'",`background:${JSON.stringify(preset.fallback)}`)
 }
 return recipeHtml(item.demo)??item.code??''
}
export function packageReadiness(item:ReferenceItem):'Ready'|'Partial'|'Missing'{return (recipes[item.demo]&&item.demo!=='fluid-cursor')||item.demo==='shader-gradient'?'Ready':'Partial'}
export function buildAgentPackage(item:ReferenceItem,preset:OfficialShaderPreset=shaderPresets[0]):string{
 const official=item.demo==='shader-gradient'
 const r=recipes[item.demo]??(official?{html:'<HeroShader />',logic:`공식 ShaderGradientCanvas 안에 ShaderGradient를 배치한다. ${preset.title} preset의 색상·카메라·rotation·amplitude를 아래 TSX대로 적용한다. IntersectionObserver, visibilitychange, reduced-motion으로 renderer를 mount/unmount한다. WebGL 미지원 또는 오류 시 gradient fallback을 유지한다.`,acceptance:`공식 ${preset.title} 색상과 mesh가 움직인다. offscreen/reduced-motion에서 renderer가 정지하고 fallback을 표시한다.`}:undefined),starter=starterCodeFor(item,preset),m=demoMaturity(item)
 return `# ${item.name}${official?' / '+preset.title:''}

## Goal
${item.name}의 시각적 동작을 기존 프로젝트에서 재현한다. ${item.description}
제공 수준: ${m.label} / Agent Package ${packageReadiness(item)}.

## Prompt
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
${starter?'```'+(item.designMd?'markdown':official?'tsx':'html')+'\n'+starter+'\n```':'실행 가능한 Starter Code는 아직 제공하지 않는다. 주석 blueprint를 실행 코드로 취급하지 않는다.'}

## Usage
${official?'HeroShader.tsx로 저장하고 <HeroShader />로 사용한다. 의존성 설치 명령은 코드 상단에 있다.':r?'의존성 설치 없이 index.html로 저장해 연다. iframe 삽입 시 title과 sandbox="allow-scripts"를 사용한다. viewport 진입 시 mount하고 화면 밖에서 unmount한다.':item.designMd?'DESIGN.md로 저장한다.':'원본의 설치·사용 지침을 확인한다.'}

## Responsive
${r?'main은 부모 너비/높이에 맞추며 최소 높이는 190px이다. typography는 clamp를 사용한다. coarse pointer에서는 중앙/정적 구도를 유지한다. Scroll demo는 native touch scroll을 사용한다.':'390px 너비에서 레이아웃과 텍스트 overflow를 별도 검증한다.'}

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
export function buildStandaloneHtml(item:ReferenceItem):string|null{return item.license.status==='copy-ok'&&item.implementation.type!=='external'?recipeHtml(item.demo):null}
