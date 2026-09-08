# Reference Schema

The canonical V1.5 type is `ReferenceItem` in `src/types.ts`. Legacy fields remain optional compatibility inputs; new content uses typed artifacts.

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
  prompt?: string // legacy
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
    status: 'copy-ok' | 'reference' | 'restricted'
    evidenceUrl?: string
    attributionRequired?: boolean
    notes?: string
  }
}
```

## Artifact contract (V1.5)

```ts
type ArtifactProvenance = {
  origin: 'upstream-oss' | 'hub-original' | 'derived' | 'reference-only'
  sourceUrl: string
  repository?: string
  license: string
  evidenceUrl: string
  notices?: string
  reviewedAt?: string
  sourceRevision?: string
}
type ReferenceArtifacts = {
  agent?: { extended: string; compact?: string; provenance: ArtifactProvenance; filename?: string }
  designMd?: { extended: string; compact?: string; provenance: ArtifactProvenance; filename?: string }
  tailwind?: { code: string; version?: string; provenance: ArtifactProvenance; filename?: string }
  css?: { code: string; provenance: ArtifactProvenance; filename?: string }
  tokens?: { json: string; provenance: ArtifactProvenance; filename?: string }
  react?: { code: string; dependencies?: string[]; provenance: ArtifactProvenance; filename?: string }
  html?: { code: string; provenance: ArtifactProvenance; filename?: string }
}
```

`resolveArtifacts(item, preset)` adapts the 93 legacy records without rewriting each record, then applies explicit artifacts. Only non-empty allowed content becomes a tab. `reference-only` artifact bodies are never exported. An external/restricted reference only exposes Hub-authored discovery instructions and Source metadata. Do not put restricted body text inside a Hub-authored Agent artifact.

Source is a generated view combining discovery metadata and every available artifact's individual provenance. It does not treat all linked upstream work as MIT. Code and document fields render as escaped text; arbitrary imported HTML is not executed in the artifact panel.

`DesignSystemTokens` normalizes six color roles (`canvas`, `surface`, `text`, `primary`, `onPrimary`, `border`), display/body font families and sizes, line height, spacing array, radius, border width and duration. Numeric sizes are in pixels, duration is in milliseconds. Tokens downloads use `format: "drh-design-tokens-v1"`; this is a DRH format, not a claim of DTCG compatibility. Preview and generated CSS/DESIGN.md/Tailwind use the same values.

For imported DESIGN.md, set `artifacts.designMd` to the preserved original, with upstream provenance, and supply normalized `designSystem` metadata separately. This avoids one custom demo per brand. If derived exports need different provenance, supply those artifacts explicitly too. The generator inherits upstream document provenance and notices as `derived` for generated CSS/Tailwind/Tokens; DRH originals keep `hub-original`. Reviewers must confirm the rights and supply full upstream notices before importing. Unknown tokens stay unavailable instead of being guessed.

## Additional ingestion review metadata

README claims, repository LICENSE, website terms and individual asset rights can differ. Per-artifact evidence, revision and review date are now supported. Track additional asset-specific scope and conflicts in the ingestion review when needed:

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
