import raw from './source-map.json'
import type { SourceRecord } from '../types'

export const sourceMap = (raw as { sources: SourceRecord[] }).sources
export const sourceStats = {
  count: (raw as { source_count: number }).source_count,
  statusCounts: (raw as { status_counts: Record<string, number> }).status_counts,
  categoryCounts: (raw as { category_counts: Record<string, number> }).category_counts,
}
