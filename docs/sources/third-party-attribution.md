# Third-Party Attribution

Design Reference Hub is MIT licensed, but it contains dependencies and adapted patterns that retain their own upstream attribution.

## ShaderGradient

- https://github.com/ruucm/shadergradient
- License: MIT
- Used through `@shadergradient/react`
- V1.2 also ports the upstream official preset configuration values into `src/data/shaderPresets.ts`.

## shadergradient-vue

- https://github.com/siavava/shadergradient-vue
- License: MIT
- Its demo application's landing composition was used as a structural reference for the V1.2 React landing implementation.
- The React components in this repository are reimplemented for Design Reference Hub rather than copied line-for-line.

## Important asset rule

An implementation license does not automatically license screenshots, logos, fonts, product images, trademarks or brand assets. Every Design Reference Hub reference retains explicit source/license metadata and should continue to be reviewed at the asset level before internal redistribution.

## Simple Icons

The catalog uses brand identifiers from the pinned Simple Icons 16.37.0 package. The published SVG geometry was checked against the package and the catalog records the upstream and local hashes. The light and dark variants use local fill colors. Each brand directory includes a notice and the app uses the marks to identify the referenced brand.

The package's [CC0 license](../../third_party/simple-icons/LICENSE.md) and [trademark and per-icon disclaimer](../../third_party/simple-icons/DISCLAIMER.md) are preserved alongside the source. The import script checks per-icon license overrides. Candidates with unresolved source or usage evidence stay in local review, while the catalog displays its text identifier.
