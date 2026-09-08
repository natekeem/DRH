export type Category = 'Styles' | 'Pages' | 'Sections' | 'Background' | 'Motion' | 'Text' | 'Effects' | 'DESIGN.md'
export type VendorDsCategory = 'AI & LLM' | 'Developer Tools' | 'Backend & DevOps' | 'SaaS & Productivity' | 'Fintech & Crypto' | 'E-commerce & Consumer' | 'Big Tech' | 'Automotive' | 'Automotive & Space' | 'Retro Web' | 'Design Tools' | 'Brand Design'
export type LicenseStatus = 'copy-ok' | 'reference' | 'restricted'

export type ArtifactProvenance = {
  origin: 'upstream-oss' | 'hub-original' | 'derived' | 'reference-only'
  sourceUrl: string
  repository?: string
  license: string
  evidenceUrl: string
  notices?: string
  reviewedAt?: string
  sourceRevision?: string
}
export type ArtifactBase = { provenance: ArtifactProvenance; filename?: string }
export type TextArtifact = ArtifactBase & { compact?: string; extended: string }
export type CodeArtifact = ArtifactBase & { code: string; version?: string; dependencies?: string[] }
export type ReferenceArtifacts = {
  agent?: TextArtifact
  designMd?: TextArtifact
  tailwind?: CodeArtifact
  css?: CodeArtifact
  tokens?: ArtifactBase & { json: string }
  react?: CodeArtifact
  html?: CodeArtifact
}
export type DesignSystemTokens = {
  colors: { canvas: string; surface: string; text: string; primary: string; onPrimary: string; border: string }
  typography: { display: string; body: string; displaySize: number; bodySize: number; lineHeight: number }
  spacing: number[]
  radius: number
  borderWidth: number
  duration: number
}

export type ReferenceItem = {
  id: string
  name: string
  category: Category
  subcategory: string
  description: string
  tags: string[]
  useCases: string[]
  demo: string
  featured?: boolean
  wow?: boolean
  implementation: {
    type: 'native' | 'hub-original' | 'external'
    framework: string
    dependencies: string[]
  }
  /** Legacy input supported by resolveArtifacts; new records use artifacts. */
  prompt?: string
  code?: string
  designMd?: string
  artifacts?: ReferenceArtifacts
  designSystem?: DesignSystemTokens
  source: {
    name: string
    url: string
    repository?: string
    author?: string
  }
  license: {
    name: string
    status: LicenseStatus
    evidenceUrl?: string
    attributionRequired?: boolean
    notes?: string
  }
}

export type SourceRecord = {
  classification?: 'IMPORT CANDIDATE' | 'REFERENCE / DISCOVERY' | 'REFERENCE / TAXONOMY' | 'REFERENCE ONLY'
  reviewed_at?: string
  source: string
  category: string
  what_it_provides: string
  preview: string
  code: string
  stack: string
  license: string
  license_evidence: string
  redistribution: string
  attribution: string
  agent_friendly: string
  recommendation: string
  url: string
  github?: string
  caveat?: string
}
