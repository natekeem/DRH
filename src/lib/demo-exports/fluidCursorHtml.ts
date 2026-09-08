import { advancedHtml, type AdvancedHtmlOptions } from './advancedHtml'
export function fluidCursorHtml(options: Pick<AdvancedHtmlOptions, 'variant'> = {}): string { return advancedHtml('fluid', options) }
