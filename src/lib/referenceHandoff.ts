import type { ReferenceItem, ReferenceArtifacts } from '../types'
import type { OfficialBrandResource } from '../brandDesignSpec'
import { resolveArtifacts } from './artifacts'
import { vendorEntryBySlug } from '../data/references'
import resources from '../data/brandOfficialResources.json'

export type ReferenceHandoff = {
 schemaVersion: 1
 id: string
 name: string
 kind: 'brand'|'reference'
 aliases: string[]
 designMd?: {path?:string;sha256?:string;text?:string}
 agent: {compact?:string;extended?:string;applyPrompt:string}
 source: {name:string;repo?:string;revision?:string;license?:string;notices?:string}
 officialResources: OfficialBrandResource[]
}

/** Portable paths are relative to a catalog root, never an agent-specific install. */
export function buildReferenceHandoff(item:ReferenceItem,artifacts:ReferenceArtifacts=resolveArtifacts(item)):ReferenceHandoff {
 const slug=item.demo.startsWith('vendor-design-md:')?item.demo.slice('vendor-design-md:'.length):undefined
 const entry=slug?vendorEntryBySlug[slug]:undefined
 const designMd=entry?{path:`vendor/${entry.vendorSource||'awesome-design-md'}/${entry.slug}/DESIGN.md`,sha256:entry.rawSha256}:artifacts.designMd?{text:artifacts.designMd.extended}:undefined
 const p=artifacts.designMd?.provenance??artifacts.agent?.provenance
 const applyPrompt=[
  '이 프로젝트의 기존 기능, 구조와 프로젝트 규칙을 먼저 확인하세요.',
  `${designMd?'./DESIGN.md':'첨부한 Agent Package'}를 ${item.name} 디자인 reference로 사용해 요청한 화면을 수정하세요.`,
  '확인되지 않은 브랜드 규칙이나 에셋을 새로 만들지 마세요. 공식 제품 화면으로 취급하지 마세요.',
  '프로젝트 규칙과 충돌하면 구현 전에 알려주세요. 원본 출처와 라이선스 고지를 보존하세요.',
  '완료 후 390px / 1440px에서 화면, 키보드 조작과 reduced motion을 확인하세요.',
  entry?`원본 snapshot: ${entry.sourceName||'VoltAgent awesome-design-md'} · ${entry.upstreamCommit.slice(0,12)}`:''
 ].filter(Boolean).join('\n')
 return {schemaVersion:1,id:item.id,name:item.name,kind:entry||item.designSystem?'brand':'reference',aliases:entry?.aliases||[],designMd,agent:{compact:artifacts.agent?.compact,extended:artifacts.agent?.extended,applyPrompt},source:{name:entry?.sourceName||item.source.name,repo:entry?.upstreamRepo||p?.repository||item.source.repository,revision:entry?.upstreamCommit||p?.sourceRevision,license:p?.license||item.license.name,notices:p?.notices},officialResources:slug?(resources as Record<string,OfficialBrandResource[]>)[slug]||[]:[]}
}
