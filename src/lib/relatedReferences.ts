import type { ReferenceItem } from '../types'

type ReferenceCollection = { id: string; ids: string[] }

const genericTerms = new Set([
  'agent', 'brand', 'copy', 'design', 'design.md', 'hub', 'original', 'reference',
  'system', 'tokens', 'ui', 'vendor', 'web',
])

const normalize = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9가-힣.]+/g, ' ')
  .trim()

const terms = (values: string[]) => new Set(values
  .flatMap(value => normalize(value).split(/\s+/))
  .filter(value => value.length > 1 && !genericTerms.has(value)))

const overlapCount = (left: Set<string>, right: Set<string>) =>
  [...left].filter(value => right.has(value)).length

const demoFamily = (demo: string) => {
  if (demo.startsWith('vendor-design-md:')) return 'vendor-design-md'
  return demo.split('-').slice(0, 2).join('-')
}

const pairTiebreaker = (left: string, right: string) => {
  let value = 0
  for (const char of `${left}:${right}`) value = (value * 31 + char.charCodeAt(0)) >>> 0
  return value
}

export function relatedReferenceScore(
  anchor: ReferenceItem,
  candidate: ReferenceItem,
  collections: ReferenceCollection[],
) {
  if (anchor.id === candidate.id) return Number.NEGATIVE_INFINITY

  let score = 0
  if (anchor.category === candidate.category) score += 32
  if (anchor.subcategory === candidate.subcategory) score += 46
  if (demoFamily(anchor.demo) === demoFamily(candidate.demo)) score += 16
  if (Boolean(anchor.designSystem) === Boolean(candidate.designSystem)) score += 3

  const anchorCollections = collections.filter(collection => collection.ids.includes(anchor.id))
  const sharedCollections = anchorCollections.filter(collection => collection.ids.includes(candidate.id)).length
  score += Math.min(sharedCollections, 2) * 18

  score += overlapCount(terms(anchor.tags), terms(candidate.tags)) * 14
  score += overlapCount(terms(anchor.useCases), terms(candidate.useCases)) * 8
  score += overlapCount(
    terms([anchor.name, anchor.description]),
    terms([candidate.name, candidate.description]),
  ) * 3

  return score
}

export function relatedReferencesFor(
  anchor: ReferenceItem,
  allReferences: ReferenceItem[],
  collections: ReferenceCollection[],
  limit = 4,
) {
  return allReferences
    .filter(candidate => candidate.id !== anchor.id)
    .map(candidate => ({
      candidate,
      score: relatedReferenceScore(anchor, candidate, collections),
      tiebreaker: pairTiebreaker(anchor.id, candidate.id),
    }))
    .sort((left, right) =>
      right.score - left.score
      || left.tiebreaker - right.tiebreaker
      || left.candidate.name.localeCompare(right.candidate.name),
    )
    .slice(0, limit)
    .map(result => result.candidate)
}
