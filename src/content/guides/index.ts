export { default as guides } from './manifest.json'
const guideSources = import.meta.glob<string>('./*.md', { query: '?raw', import: 'default' })

export async function loadGuide(slug: string) {
  const load = guideSources[`./${slug}.md`]
  if (!load) throw new Error(`Missing guide source: ${slug}`)
  return load()
}
