import { advancedHtml, type AdvancedHtmlOptions } from './advancedHtml'
export function metaballsHtml(options: Pick<AdvancedHtmlOptions, 'variant'> = {}): string { return advancedHtml('metaballs', options) }
