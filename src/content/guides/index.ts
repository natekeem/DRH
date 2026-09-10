export type GuideMeta = { slug:string; title:string; description:string; category:string; updatedAt:string; readingTime:string; tags:string[]; sources:{label:string;url:string}[] }
export const guides: GuideMeta[] = [{
  slug:'quickstart',title:'DRH 5분 시작하기',description:'Reference 하나를 골라 Coding Agent에 전달하고 화면 하나를 만드는 가장 짧은 방법. DRH를 처음 열었다면 여기부터.',category:'시작하기',updatedAt:'2026-09-10',readingTime:'5분',tags:['Quickstart','Coding Agent','Reference'],
  sources:[{label:'Refero Styles — discovery',url:'https://styles.refero.design/'},{label:'VoltAgent awesome-design-md — public MIT repository',url:'https://github.com/VoltAgent/awesome-design-md'},{label:'MIT license evidence',url:'https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE'}]
}, {
  slug:'create-design-md',title:'내 프로젝트 DESIGN.md 만들기',description:'색상·글자·간격·모서리·버튼 5가지만 정해서 AI에게 주는 디자인 약속장을 만드세요. 이미 DRH 사용법을 안다면 여기.',category:'DESIGN.md 작성',updatedAt:'2026-09-10',readingTime:'6분',tags:['DESIGN.md','Template','디자인 규칙'],
  sources:[{label:'VoltAgent awesome-design-md — public MIT repository',url:'https://github.com/VoltAgent/awesome-design-md'},{label:'MIT license evidence',url:'https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE'}]
}, {
  slug:'apply-demo-code',title:'Demo와 Code를 내 프로젝트에 붙이는 법',description:'DRH의 효과·코드를 실제 앱에 안전하게 옮기는 10단계. Effect나 UI Pattern을 적용하고 싶다면 여기.',category:'Code 적용',updatedAt:'2026-09-10',readingTime:'7분',tags:['Demo','Code','Dependencies','License'],
  sources:[{label:'Refero Styles — discovery',url:'https://styles.refero.design/'}]
}, {
  slug:'license-basics',title:'라이선스, 어디까지 써도 될까요?',description:'MIT부터 Creative Commons, 폰트와 유료 에셋까지. 상업적 사용·수정·재배포 조건을 읽고 내 프로젝트에 사용할 수 있는지 확인하는 방법.',category:'라이선스',updatedAt:'2026-09-10',readingTime:'8분',tags:['License','상업적 사용','저작권'],
  sources:[{label:'MIT license',url:'https://choosealicense.com/licenses/mit/'},{label:'Apache 2.0 official text',url:'https://www.apache.org/licenses/LICENSE-2.0'},{label:'Creative Commons licenses',url:'https://creativecommons.org/cc-licenses/'},{label:'SIL Open Font License',url:'https://openfontlicense.org/'},{label:'Mozilla MPL FAQ',url:'https://www.mozilla.org/en-US/MPL/2.0/FAQ/'}]
}]
export const guideSources=import.meta.glob('./*.md',{query:'?raw',import:'default'}) as Record<string,()=>Promise<string>>
