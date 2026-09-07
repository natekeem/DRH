export type Category = 'Styles' | 'Pages' | 'Sections' | 'Background' | 'Motion' | 'Text' | 'Effects' | 'DESIGN.md'
export type LicenseStatus = 'copy-ok' | 'reference' | 'restricted'

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
  prompt: string
  code?: string
  designMd?: string
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
