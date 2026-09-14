import type { BrandCatalog, ComponentKind } from './brandCatalog'
export const componentGroups: {label:string;kinds:ComponentKind[]}[] = [
 {label:'Actions',kinds:['buttons','badges','icon']}, {label:'Forms',kinds:['inputs']},
 {label:'Surfaces',kinds:['cards','dialogs','content-surface','status']}, {label:'Navigation',kinds:['navigation','tabs']},
 {label:'Data',kinds:['tables','code']}, {label:'Composition',kinds:['hero','section','cta-band','pricing','media','footer','legal']},
]
export function experienceScene(catalog:Pick<BrandCatalog,'entry'|'spec'>) {
 const slug=catalog.entry.slug.toLowerCase()
 if(/apple/.test(slug))return 'product'
 if(/baemin/.test(slug))return 'commerce'
 if(/toss|kakaobank|coinbase/.test(slug))return 'finance'
 if(/linear/.test(slug))return 'workspace'
 if(/spotify/.test(slug))return 'media'
 if(/ferrari/.test(slug))return 'automotive'
 if(/nintendo/.test(slug))return 'play'
 if(/vercel/.test(slug))return 'developer'
 const category=[catalog.entry.category,catalog.spec.layout].join(' ').toLowerCase()
 if(/finance|fintech|crypto|bank/.test(category))return 'finance'
 if(/commerce|delivery|shopping|marketplace/.test(category))return 'commerce'
 if(/music|media|stream/.test(category))return 'media'
 if(/developer/.test(category))return 'developer'
 if(/saas|software/.test(category))return 'workspace'
 return 'editorial'
}
export function componentSize(kind:ComponentKind) {
 return ['buttons','badges','icon'].includes(kind)?'compact':['hero','section','cta-band','tables','pricing','navigation','footer','legal'].includes(kind)?'wide':'medium'
}
