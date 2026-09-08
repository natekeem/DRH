export type GuideMeta = { slug:string; title:string; description:string; category:string; updatedAt:string; readingTime:string; tags:string[]; sources:{label:string;url:string}[] }
export const guides: GuideMeta[] = [{
  slug:'using-design-md',title:'디자인 시스템을 Coding Agent에 전달하는 법',description:'DESIGN.md, CSS, Tokens를 고르고 구체적인 구현 계약으로 전달하세요. 새 페이지부터 기존 UI 수정까지.',category:'Agent workflow',updatedAt:'2026-09-08',readingTime:'7분',tags:['DESIGN.md','Coding Agent','Workflow'],
  sources:[{label:'Refero Styles — discovery',url:'https://styles.refero.design/'},{label:'VoltAgent awesome-design-md — public MIT repository',url:'https://github.com/VoltAgent/awesome-design-md'},{label:'MIT license evidence',url:'https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE'}]
}, {
  slug:'writing-brand-design-md',title:'브랜드 DESIGN.md를 작성하고 Coding Agent에 적용하는 법',description:'AI Coding Agent에게 브랜드의 시각적 정체성을 정확히 전달하기 위한 DESIGN.md 작성 및 활용 가이드입니다.',category:'Agent workflow',updatedAt:'2026-09-08',readingTime:'5분',tags:['DESIGN.md','Coding Agent','Cursor','Windsurf'],
  sources:[]
}]
export const guideSources=import.meta.glob('./*.md',{query:'?raw',import:'default'}) as Record<string,()=>Promise<string>>
