# Brand DESIGN.md Preview Standard

This extends [Reference Quality Standard](REFERENCE_QUALITY_STANDARD.md) and [Content Authoring Playbook](CONTENT_AUTHORING_PLAYBOOK.md). It grants no maturity, provenance or artifact-parity exceptions.

## Source and generation

1. Keep the upstream DESIGN.md verbatim, its pinned revision and MIT notice. Source analysis is not an official brand design system or a license for its assets.
2. Parse with scripts/brand-design-spec.mjs. YAML and Markdown-only sources preserve explicit values and evidence. Missing information stays missing; presentation defaults must not be written into the source spec.
3. Generate the full public/brand-design-specs/<slug>.json and compact Browse projection together. Both upstream sync and offline regeneration use the same parser and generator. Directory discovery must use the same pinned commit as file downloads. A failed import must not publish a partial metadata catalog.
4. Select a composition from source traits, never a brand-name switch. A new source can use existing compositions; extend the inference and composition only when evidence calls for a materially different arrangement.
5. Preserve declared families, sizes, weights, tracking and line height. Render system fallbacks without downloading proprietary fonts. Expose declared versus rendered families in Detail. Bound small-viewport sizes while keeping the source values visible in the hierarchy.

## Preview contract

- Browse prioritizes a small identifier, composition, typography, principal component and palette. Scales and source prose belong in Detail.
- Layouts must differ structurally: gallery, marketplace, product, developer, editorial, cinematic, utility, retro or media. Source geometry, surface treatment and palette must remain visible within an archetype.
- Card and Detail select composition values from the same compact spec. Detail loads full evidence on demand and includes typography hierarchy, palette, spacing/radius and component disclosures. Do not silently substitute another component after the fetch completes.
- Text, numbers and image placeholders are illustrative specimen content. Label missing photography. Do not claim to reproduce a website or fabricate source brand copy.
- Use the existing brandAsset schema. text-wordmark is the default. verified-svg/image requires a local src, sourceUrl, license/usage basis and evidenceUrl; check the actual file. No hotlinks or unknown asset types. MIT analysis rights do not establish logo rights.
- Keep components responsive without scaling a desktop page. Detail flows in the page, without a nested specimen scrollbar. Controls must work with keyboard and touch; search only demonstrates local text input unless a real search is implemented.
- No unnecessary animation, shaders, large filters or remote resources. Unmount offscreen previews and abort stale Detail fetches. Reduced motion and loaded offline interaction must preserve the information.
- Agent and Tokens must carry the same compact BrandDesignSpec and identify the canonical renderer and full evidence location. Do not expose nonexistent HTML/CSS/React exports or an iframe as native React.

## New Vendor acceptance

Record each item: source parsed; full spec generated; composition selected with source evidence; typography hierarchy rendered; palette and components represented; identifier provenance checked; Card QA; Detail QA; mobile QA; audit:brand-designs passed.

Run the actual repository scripts: typecheck, build, audit:references, audit:demos, audit:design-md, audit:brand-designs and the existing audit:v1.4. audit:brand-designs includes an isolated upstream/offline pipeline parity test with mocked pinned HTTP responses, repeat-generation checks and partial-import rejection. The vendor count follows the source inventory, not a hardcoded limit of 74.

Browser acceptance uses 1920×1080, 1440×1000 and 390×844. Compare at least Apple, Airbnb, Notion, Linear, Stripe, Vercel, Spotify, Ferrari, Nintendo 2001, Binance, Tesla and Figma. Check Card/Detail composition, text and identifiers, clipping, overflow, readability, inputs, keyboard, touch, reduced motion and offscreen behavior. Capture an identifier-masked comparison. A static token/signature audit is not visual acceptance, and automated checks on all vendors are not a claim of manual review of every vendor.

Use tests/brand-designs/fidelity-qa.mjs with installed Playwright and Sharp (PLAYWRIGHT_PATH / SHARP_PATH may point to a bundled runtime). DRH_URL and EDGE_PATH can select the local server and browser. Save evidence and record source limitations honestly.
