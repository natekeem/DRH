export type BrandTypeRole = {
  declaredFamily: string | null
  renderFallback: string
  fontFamily?: string | null
  fontSize?: string | number | null
  fontWeight?: string | number | null
  lineHeight?: string | number | null
  letterSpacing?: string | number | null
  [property: string]: unknown
}

export type BrandDesignSpec = {
  colors: Record<string, string>
  typography: Record<string, BrandTypeRole>
  spacing: Record<string, string | number>
  radius: Record<string, string | number>
  border: unknown
  motion: unknown
  depth: unknown
  components: Record<string, Record<string, unknown>>
  layout: string
  traits: string
  sections?: Record<string, string>
  frontmatter?: Record<string, unknown>
  brandAsset: {
    type: 'text-wordmark' | 'verified-svg' | 'verified-image'
    label: string
    src?: string
    sourceUrl?: string
    license?: string
    evidenceUrl?: string
  }
}

export type OfficialBrandResource = {
 type: 'brand-guidelines' | 'design-system' | 'developer-design-guide' | 'typography' | 'components' | 'assets' | 'other'
 label: string
 url: string
 source: 'official'
 checkedAt: string
 description: string
 evidence: { url: string; title: string; method: string }
}
