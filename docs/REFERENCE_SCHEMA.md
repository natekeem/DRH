# Reference Schema

The canonical V1 type is `ReferenceItem` in `src/types.ts`.

```ts
type ReferenceItem = {
  id: string
  name: string
  category: 'Styles' | 'Pages' | 'Sections' | 'Background' | 'Motion' | 'Text' | 'Effects' | 'DESIGN.md'
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
    status: 'copy-ok' | 'reference' | 'restricted'
    evidenceUrl?: string
    attributionRequired?: boolean
    notes?: string
  }
}
```

## Fields to add before automated large-scale ingestion

The research found repeated cases where README claims, repository LICENSE, web-site terms and individual assets differ. Add these when the dataset moves out of hand-curated V1:

```yaml
license_scope: [code, demo, screenshot, image, font, icon, brand]
license_evidence_url:
license_evidence_commit:
license_checked_at:
license_conflict: false
redistribution_mode: source_copy | runtime_dependency | hub_reimplementation | link_only | attribution_required
preview_rights:
source_version:
source_commit:
review_status: verified | partial | unknown
```

## Naming rule

`id` is permanent once published. Changing the display name must not break saved URLs.

## Prompt rule

Prompts should name the pattern and describe behavior. They should not tell an agent to reproduce another company's site pixel-for-pixel.
