import type { Category, ReferenceItem } from '../types'
import catalog from './batch1Catalog.json'
import { recipes, recipeHtml } from '../lib/demos/recipes'

const hub='https://github.com/natekeem/DRH'
export const batch1References: ReferenceItem[] = catalog.map(item=>({
 id:item.id,name:item.name,category:item.category as Category,
 subcategory:item.category==='Styles'?'Foundational':item.category==='Pages'?'Creative':'Interaction',
 description:item.description,tags:[item.category==='UI Patterns'?'accessible':'design',item.id,'offline'],
 useCases:item.category==='UI Patterns'?['제품 UI','모바일 인터페이스']:item.category==='Styles'?['디자인 방향','브랜드 스타일']:['스튜디오','포트폴리오'],
 demo:item.demo,implementation:{type:'hub-original',framework:'HTML / CSS / JavaScript',dependencies:[]},
 source:{name:item.source.title+' · '+item.source.scope,url:item.source.url,...(item.repository?{repository:'https://github.com/'+item.repository}:{})},
 license:{name:'MIT (DRH Hub Original)',status:'copy-ok',evidenceUrl:hub+'/blob/main/LICENSE',attributionRequired:true,notes:recipes[item.demo].sourceNotes},
 artifacts:{html:{filename:item.id+'.html',code:recipeHtml(item.demo)!,provenance:{origin:'hub-original',sourceUrl:hub,repository:hub,license:'MIT',evidenceUrl:hub+'/blob/main/LICENSE',notices:recipes[item.demo].notices,reviewedAt:'2026-09-10'}}},
}))
