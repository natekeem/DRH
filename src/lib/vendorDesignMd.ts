import { vendorEntryBySlug } from '../data/references'
/**
 * vendorDesignMd.ts
 * Runtime helpers for vendor-ingested DESIGN.md files from awesome-design-md.
 * Raw files live under public/vendor and are served relative to the app base URL.
 */

export function vendorSnapshotPath(slug: string) {
  const source = vendorEntryBySlug[slug]?.vendorSource || 'awesome-design-md'
  return `vendor/${source}/${encodeURIComponent(slug)}`
}

/** Lazy-fetch a raw DESIGN.md from the public static directory. */
export async function fetchVendorDesignMd(slug: string): Promise<string> {
  const url = `${import.meta.env.BASE_URL}${vendorSnapshotPath(slug)}/DESIGN.md`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load DESIGN.md for "${slug}" (${res.status})`)
  return res.text()
}

/** True if a vendor preview.html is available for this slug. */
export async function checkVendorPreviewHtml(slug: string): Promise<boolean> {
  try {
    const url = `${import.meta.env.BASE_URL}${vendorSnapshotPath(slug)}/preview.html`
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}
