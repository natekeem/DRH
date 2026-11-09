import fs from 'node:fs';
import path from 'node:path';

function fatal(msg) {
  console.error(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
  process.exit(1);
}

function pass(msg) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}

async function audit() {
  console.log('\n=======================================');
  console.log(' AUDIT: V2.8 Canonical Brand (Binance)');
  console.log('=======================================\n');

  // 1 & 2: Themes
  const admdPath = path.resolve('src/data/awesomeDesignMd.ts');
  const admd = fs.readFileSync(admdPath, 'utf-8');
  if (!admd.includes('"canvas-light"') || !admd.includes('"body-on-light"')) {
    fatal("Binance light theme tokens not found in awesomeDesignMd.ts");
  }
  pass("Binance source data has explicit Light & Dark themes");

  // 3: Canonical sections
  const brandCatalogTs = fs.readFileSync(path.resolve('src/lib/brandCatalog.ts'), 'utf-8');
  if (!brandCatalogTs.includes('type CanonicalBrandSection')) fatal("CanonicalBrandSection type missing");
  pass("Canonical section model implemented");

  // 4: No localhost URLs
  const handoffTsx = fs.readFileSync(path.resolve('src/components/ReferenceProjectHandoff.tsx'), 'utf-8');
  if (handoffTsx.includes('localhost') || handoffTsx.includes('127.0.0.1')) {
    fatal("Localhost URL found in ReferenceProjectHandoff");
  }
  pass("No localhost URLs in handoff");

  // 5: No stale routes
  if (handoffTsx.includes('using-design-md')) {
    fatal("Stale route 'using-design-md' found");
  }
  pass("No stale guide routes in handoff");

  // 6: Size contract
  const expTs = fs.readFileSync(path.resolve('src/lib/brandExperience.ts'), 'utf-8');
  if (!expTs.includes('ComponentSizeContract')) fatal("ComponentSizeContract type missing");
  if (!expTs.includes("'full'")) fatal("'full' size contract missing");
  pass("Component size contract ('full') implemented");

  // 7: CSS Scoping
  const css = fs.readFileSync(path.resolve('src/components/demos/vendorDesignPreview.css'), 'utf-8');
  const lines = css.split('\n');
  const unscoped = lines.filter(l => /^button\s*\{|^input\s*\{|^table\s*\{/i.test(l.trim()));
  if (unscoped.length > 0) {
    fatal(`Unscoped CSS found in vendorDesignPreview.css: ${unscoped.join(' ')}`);
  }
  pass("No global bare CSS element selectors in brand CSS");

  // 8: Handoff
  const expCatalog = fs.readFileSync(path.resolve('src/components/demos/BrandExperienceCatalog.tsx'), 'utf-8');
  if (expCatalog.includes('ReferenceProjectHandoff')) {
    fatal("Handoff should not be inside BrandExperienceCatalog");
  }
  pass("Handoff correctly separated from brand visual sections");

  // 9: Resources
  const resPath = path.resolve('src/data/brandOfficialResources.json');
  const resources = JSON.parse(fs.readFileSync(resPath, 'utf-8'));
  const verification = [
    ...JSON.parse(fs.readFileSync(path.resolve('artifacts/brand-v22/official-resource-checks.json'), 'utf-8')),
    ...JSON.parse(fs.readFileSync(path.resolve('artifacts/brand-v2/official-resource-checks.json'), 'utf-8')),
  ];
  for (const [slug, entries] of Object.entries(resources)) {
    for (const entry of entries) {
      const check = verification.find(item => item.slug === slug && item.url === entry.url);
      if (!check || check.status !== 200 || !check.heading?.length || check.title !== entry.evidence?.title) {
        fatal(`Unreviewed official resource promoted for ${slug}`);
      }
    }
  }
  pass("Official resource registry contains reviewed evidence only");

  // 10: Verified Assets
  const assetsPath = path.resolve('src/data/brandVerifiedAssets.json');
  const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));
  if (assets.binance) {
    fatal("Binance has a verified asset, which violates the requirement since it doesn't have an official one.");
  }
  pass("Verified asset registry correctly preserved (Binance uses text-wordmark)");

  // 11: Source provenance
  const brandCatalogTsx = fs.readFileSync(path.resolve('src/components/demos/BrandCatalog.tsx'), 'utf-8');
  if (!brandCatalogTsx.includes('section.type===\'source\'')) {
    fatal("Source section missing from BrandCatalog");
  }
  pass("Source provenance section preserved");

  console.log('\n\x1b[32mAll 11 V2.8 Canonical Brand requirements satisfied.\x1b[0m\n');
}

audit().catch(e => {
  console.error(e);
  process.exit(1);
});
