# Content ingestion policy

Reviewed: 2026-09-08. V1.5 adds metadata and the workspace infrastructure, not a bulk content import.

## Decision rules

| Content path | Requirement | DRH behavior |
| --- | --- | --- |
| OSS import | Explicit license covering the exact file and revision; retain copyright/license/NOTICE | `upstream-oss`; import only covered files |
| Derived implementation | Compatible license for any reused substantial code, with original notice | `derived`; describe what was adapted and preserve notices in every independently downloadable derivative |
| Independent Hub implementation | General concept independently implemented; no copied protected source, prose or assets | `hub-original`; discovery links are separate from implementation provenance |
| Reference only | Discovery/taxonomy source without catalog redistribution rights | `reference-only`; links and original metadata only; no source/prompt/image copying |
| Unknown license | Public access, “free”, GitHub hosting or missing LICENSE is not affirmative redistribution permission | Keep reference only until specific evidence establishes an allowed import scope |

Reference-level `copy-ok` is an eligibility gate, not a claim that every linked website can be copied. Per-artifact provenance identifies the actual distributed work. Restricted/external records cannot export implementation artifacts through the compatibility helper. `reference-only` artifact bodies are hidden, including through the Agent fallback. Hub-authored discovery instructions and Source metadata can still be copied.

## Per-artifact record

Each artifact must carry `origin`, `sourceUrl`, `license`, and `evidenceUrl`; add `repository`, full `notices`, `reviewedAt`, and `sourceRevision` where applicable. Imports must record a pinned upstream revision and preserve the exact required notice. If source terms and repository terms differ, document the scope instead of choosing the broader permission. An upstream reference URL is not automatically the implementation source URL.

The current native ShaderGradient package remains MIT; the DRH wrapper and adapted Magic UI Meteor export are identified as `derived`. The Meteor standalone HTML, CSS and embedded React wrapper retain the relevant notice. DRH originals point to the Hub repository and MIT evidence. Brand names, logos, screenshots, fonts and other assets require separate rights checks; a repository's code license does not resolve all asset rights.

## Six source decisions

| Source | Classification | Allowed next step / prohibited scope |
| --- | --- | --- |
| [Refero Styles](https://styles.refero.design/) | REFERENCE / DISCOVERY | Browse and information architecture reference. No verified permission for wholesale DRH catalog redistribution; do not import its prompt/design library. |
| [getdesign.md / VoltAgent awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | IMPORT CANDIDATE | Public `design-md/` dataset only under the [repository MIT license](https://github.com/VoltAgent/awesome-design-md/blob/main/LICENSE). Pin revision and retain notice. Exclude paid Starter Kit and separately licensed assets. |
| [design-isms](https://github.com/lidge-jun/design-isms) | REFERENCE / TAXONOMY | No root LICENSE verified during review. Do not copy code/images/prose. Independently implement generic concepts. The requested 49 ISMs / 94 effects / 25 Color / 20 Typography / 25 Layout / 20 Motion counts are a request snapshot, not a verified import inventory. |
| [MotionSites](https://motionsites.ai/) | REFERENCE ONLY | Footer states all rights reserved. No prompt scraping or prompt copying; generic motion discovery only. |
| [PromptSites](https://promptsitess.lovable.app/) | REFERENCE ONLY | Request review reports all rights reserved; public text extraction did not independently expose footer evidence. No redistribution license established. No prompt copying; retain the conservative classification. |
| [GetLayers](https://www.getlayers.ai/terms-of-use) | REFERENCE ONLY | Terms sections Prohibited use, Fair use and Intellectual property exclude library duplication, bulk extraction and standalone prompt-template redistribution/competing products. Do not import prompts/templates. |

getdesign.md was already in Source Map: update that record rather than duplicate it. Five new records plus that update bring the registry from 184 to 189 sources. Classification is visible separately from the existing green/yellow/red filter; GetLayers remains red because of explicit restrictions.

## Import preparation

1. Select a small sample from the public MIT dataset and pin its source revision. Store required notices alongside the imported document.
2. Keep the original DESIGN.md as an explicit artifact. Normalize verified colors, typography, spacing, radius and motion into `designSystem`; do not infer brand tokens from a screenshot or silently use DRH defaults as upstream data.
3. Use approved local/system font fallbacks. Accept valid color values and bounded numeric dimensions; do not ingest remote CSS/HTML or execute arbitrary imported Markdown.
4. If tokens are missing, omit the normalized preview metadata and describe what is unavailable. A working token specimen does not imply complete product-page code.
5. Verify preview/export parity, filenames, origin, notice retention and mobile rendering before scaling the sample. Keep permanent IDs and do not ship empty/disabled artifact tabs.

The current renderer accepts normalized metadata; it intentionally does not guess arbitrary DESIGN.md dialects. Future ingestion adapters normalize a document once and preserve the original separately. No network request to an external design source is required to view the bundled artifact or preview.
