import type { DesignSystemTokens } from '../types'
import hubLicense from '../../LICENSE?raw'

// DRH-authored presets, not extracted brand identities. One source for preview and exports.
const directions: Record<string, [string, string, string, string, string, string, number, number, string]> = {
  'minimal-saas': ['#F5F4F0','#FFFFFF','#111111','#5145CD','#FFFFFF','#D9D8D2',12,1,'Arial, sans-serif'],
  'playful-brutal': ['#FFF8DD','#FFFFFF','#171717','#FFE144','#171717','#171717',0,3,'Arial Black, sans-serif'],
  'editorial-system': ['#F3EFE6','#FFFCF6','#26221D','#9A3412','#FFFFFF','#C8BFB1',2,1,'Georgia, serif'],
  'developer-tool-system': ['#101318','#1B2028','#E7EDF5','#75E2B5','#101318','#465261',8,1,'monospace'],
  'corporate-dashboard': ['#EEF2F6','#FFFFFF','#15263C','#2458B3','#FFFFFF','#BAC6D4',6,1,'Arial, sans-serif'],
  'luxury-system': ['#F8F5EE','#FFFFFF','#211E19','#66502B','#FFFFFF','#CFC5B3',0,1,'Georgia, serif'],
  'docs-system': ['#FFFFFF','#F2F4F7','#202936','#3458B0','#FFFFFF','#C8CED9',6,1,'Arial, sans-serif'],
  'dark-futuristic': ['#100D23','#221C3B','#F4F0FF','#BAA0FF','#100D23','#665889',18,1,'Arial, sans-serif'],
  'educational-system': ['#F1F7EE','#FFFFFF','#18372B','#287A56','#FFFFFF','#AFCCB8',20,2,'Arial, sans-serif'],
  'bento-saas-system': ['#EEEFF4','#FFFFFF','#202339','#5A48B8','#FFFFFF','#C7C7D5',24,1,'Arial, sans-serif'],
}
export function designSystemFor(id: string): DesignSystemTokens | undefined {
  const d = directions[id]
  if (!d) return undefined
  return { colors: {canvas:d[0],surface:d[1],text:d[2],primary:d[3],onPrimary:d[4],border:d[5]}, typography:{display:d[8],body:'Arial, sans-serif',displaySize:48,bodySize:16,lineHeight:1.6},spacing:[4,8,16,24,40,64],radius:d[6],borderWidth:d[7],duration:180 }
}
export function designCss(t: DesignSystemTokens) {
  return `/* DRH original design tokens. ${hubLicense} */
:root {
${Object.entries(t.colors).map(([k,v])=>`  --color-${k.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())}: ${v};`).join('\n')}
  --font-display: ${t.typography.display};
  --font-body: ${t.typography.body};
  --text-display: ${t.typography.displaySize}px;
  --text-body: ${t.typography.bodySize}px;
  --line-height: ${t.typography.lineHeight};
${t.spacing.map((v,i)=>`  --space-${i+1}: ${v}px;`).join('\n')}
  --radius: ${t.radius}px;
  --border-width: ${t.borderWidth}px;
  --duration: ${t.duration}ms;
}
.design-system { background:var(--color-canvas); color:var(--color-text); font:var(--text-body)/var(--line-height) var(--font-body); padding:var(--space-4); }
.design-system h1 { font:700 clamp(32px,5vw,var(--text-display))/1.1 var(--font-display); }
.design-system .surface { background:var(--color-surface); border:var(--border-width) solid var(--color-border); border-radius:var(--radius); padding:var(--space-4); }
.design-system button { font:inherit; min-height:44px; padding:8px 16px; border:var(--border-width) solid var(--color-primary); border-radius:var(--radius); background:var(--color-primary); color:var(--color-on-primary); cursor:pointer; transition:filter var(--duration); }
.design-system button.secondary { background:var(--color-surface); color:var(--color-text); border-color:var(--color-border); }
.design-system button:hover { filter:brightness(.94); }
.design-system button:focus-visible { outline:3px solid var(--color-primary); outline-offset:4px; }
@media(prefers-reduced-motion:reduce) { .design-system button { transition:none; } }
`
}
export function designTailwind(t: DesignSystemTokens) {
  return `/* Tailwind CSS v4. Install/configure Tailwind v4 in your build first.
DRH original. ${hubLicense} */
@import "tailwindcss";
@theme {
${Object.entries(t.colors).map(([k,v])=>`  --color-${k.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())}: ${v};`).join('\n')}
  --font-display: ${t.typography.display};
  --font-body: ${t.typography.body};
  --radius-system: ${t.radius}px;
${t.spacing.map((v,i)=>`  --spacing-system-${i+1}: ${v}px;`).join('\n')}
  --text-display: ${t.typography.displaySize}px;
  --text-body: ${t.typography.bodySize}px;
}
/* Example: <button class="bg-primary text-on-primary rounded-system px-system-3 min-h-11 font-body focus-visible:outline-2 focus-visible:outline-primary">Continue</button> */
`
}
export function designMarkdown(name: string, description: string, t: DesignSystemTokens, compact=false) {
  const core=`# ${name}\n\n## Goal\n${description}\n\n## Tokens\n\`\`\`json\n${JSON.stringify(t,null,compact?0:2)}\n\`\`\`\n\n## Rules\nUse the exact tokens above. One primary CTA per section. Reuse existing primitives; do not invent colors, fonts or extra dependencies. Buttons: minimum 44px height, 8px 16px padding. Focus: 3px primary outline with 4px offset. Hover: brightness(.94), ${t.duration}ms. Reduced motion: no transition.\n\n## Dependencies\nNone. System fonts; no external font request.\n`
  if(compact)return core+`\n## Starter\n\`\`\`html\n<section class="design-system"><h1>${name}</h1><button>Continue</button></section>\n\`\`\`\nPair with the CSS artifact.\n\n## License\nHub original MIT: https://github.com/natekeem/DRH/blob/main/LICENSE\n`
  return core+`\n## Visual Target\nCanvas and raised surface use separate color tokens. Display uses ${t.typography.display}; body uses ${t.typography.body}. Keep text readable at ${t.typography.bodySize}px with ${t.typography.lineHeight} line-height.\n\n## Component Rules\nCards: ${t.spacing[3]}px padding, ${t.radius}px radius, ${t.borderWidth}px solid border. Primary actions use primary/onPrimary; secondary actions use surface/text.\n\n## Implementation Logic\nLoad the CSS once; wrap content in .design-system. Use .surface for cards and .secondary for secondary buttons. Bind actions to existing application handlers; the starter is a visual specimen, not a complete product.\n\n## Responsive\nAt 390px, use one column, 16px outer padding; at 1200px, use a 12-column grid, 24px gap. Display size clamp(32px,5vw,48px). Allow labels to wrap.\n\n## Accessibility\nUse native buttons and headings, meaningful action names and visible keyboard focus. Check WCAG AA contrast after changing any color pair. No meaning conveyed only by color.\n\n## Acceptance Criteria\n- All preview/export token values agree.\n- No horizontal overflow at 390px or 1440px.\n- Keyboard focus visible, reduced motion respected.\n- No external network request for this specimen.\n\n## Full Starter Code\nSave CSS as styles.css; place this markup in the document body.\n\n\`\`\`html\n<section class="design-system"><h1>${name}</h1><div class="surface"><p>A clear place to start.</p><button>Continue</button> <button class="secondary">Review</button></div></section>\n\`\`\`\n\n\`\`\`css\n${designCss(t)}\n\`\`\`\n\n## Source / License\nDRH original specimen; no external brand screenshot or font reproduced.\nhttps://github.com/natekeem/DRH\nMIT: https://github.com/natekeem/DRH/blob/main/LICENSE\n`
}
