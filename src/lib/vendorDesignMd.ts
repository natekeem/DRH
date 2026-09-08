/**
 * vendorDesignMd.ts
 * Runtime helpers for vendor-ingested DESIGN.md files from awesome-design-md.
 * Raw files are served from /vendor/awesome-design-md/<slug>/DESIGN.md (public/).
 */

/** Lazy-fetch a raw DESIGN.md from the public static directory. */
export async function fetchVendorDesignMd(slug: string): Promise<string> {
  const url = `/vendor/awesome-design-md/${encodeURIComponent(slug)}/DESIGN.md`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load DESIGN.md for "${slug}" (${res.status})`)
  return res.text()
}

/** True if a vendor preview.html is available for this slug. */
export async function checkVendorPreviewHtml(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`/vendor/awesome-design-md/${encodeURIComponent(slug)}/preview.html`, { method: 'HEAD' })
    return res.ok
  } catch {
    return false
  }
}
