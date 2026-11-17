/**
 * Shared visual language for every UI Pattern reference.
 *
 * Keep this as the single source for preview and exported artifact styling so
 * patterns read as states of one product rather than unrelated mini-sites.
 */
export const uiPatternVisualSystem = `Northstar Workspace UI system (required for this reference):
- Product identity: calm, precise workspace software. Do not introduce a second brand palette for an individual pattern.
- Color roles: canvas #F3F5FB, surface #FFFFFF, ink #172033, muted #667085, border #D8DEEA.
- Brand action: indigo #4F46E5 with hover #4338CA and tint #EEF2FF. Indigo is the only decorative/action accent.
- Semantic colors: green #167C5A only for confirmed success; red #B4233C only for errors. Never use semantic green as navigation chrome or a generic highlight.
- Shape and depth: 10-20px radii, quiet 1px borders and one soft indigo-tinted shadow. Avoid glass, neon and unrelated gradients.
- Type: local system sans, compact 10-13px utility text and strong, tightly tracked headings.
- Interaction: 180-240ms state transitions, 3px indigo focus ring, 40px minimum controls in Detail (44px where the pattern requires a touch target). Controls in Card preview use the same states and respond directly to input.
- Responsive: preserve the same tokens and information hierarchy in Card and Detail. Fit navigation samples to the full Card surface with compact spacing, and keep their actions reachable at short heights.
- Reduced motion: remove decorative animation and transition while preserving every state, status message and control.`

const foundation = `main{--ui-canvas:#f3f5fb;--ui-surface:#fff;--ui-surface-subtle:#f8f9fc;--ui-ink:#172033;--ui-muted:#667085;--ui-border:#d8deea;--ui-primary:#4f46e5;--ui-primary-hover:#4338ca;--ui-primary-soft:#eef2ff;--ui-on-primary:#fff;--ui-success:#167c5a;--ui-success-soft:#eaf8f2;--ui-danger:#b4233c;--ui-danger-soft:#fff0f2;--ui-shadow:0 24px 70px #1b255018;--ui-focus:#4f46e5;background:var(--ui-canvas);color:var(--ui-ink);container-type:inline-size;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.01em}button,input{font:inherit}button:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:3px solid var(--ui-focus);outline-offset:2px}`

export const uiPatternWorkspaceBase = foundation + `main{display:block}.workspace{height:100%;overflow:auto;padding:clamp(16px,4cqw,40px)}.eyebrow{font:750 10px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.15em;color:var(--ui-primary)}.workspace h1{font-size:clamp(26px,5cqw,46px);line-height:1.02;letter-spacing:-.055em;margin:12px 0}.workspace p{font-size:13px;line-height:1.7;color:var(--ui-muted)}.workspace button,dialog button{min-height:40px;padding:10px 14px;border:1px solid var(--ui-border);border-radius:10px;background:var(--ui-surface);color:var(--ui-ink);font-size:12px;transition:background-color 180ms,border-color 180ms,color 180ms,transform 180ms}.workspace button:hover,dialog button:hover{border-color:#b9c1d2;background:var(--ui-surface-subtle)}.workspace .primary,.workspace button.primary{border-color:var(--ui-primary);background:var(--ui-primary);color:var(--ui-on-primary);box-shadow:0 8px 20px #4f46e526}.workspace .primary:hover,.workspace button.primary:hover{border-color:var(--ui-primary-hover);background:var(--ui-primary-hover)}.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}.workspace h2,dialog h2{font-size:18px;letter-spacing:-.025em;margin:10px 0}dialog{z-index:10;color:var(--ui-ink);background:var(--ui-surface);border:1px solid var(--ui-border);border-radius:18px;box-shadow:0 24px 70px #1b255038;padding:18px;max-height:94%;overflow:auto}dialog::backdrop{background:#17203366;backdrop-filter:blur(2px)}dialog p{font-size:12px;line-height:1.6;color:var(--ui-muted)}.close{float:right}dialog:not([open]){display:none}@container(max-width:440px){.workspace{padding:16px}.workspace h1{font-size:26px}.supporting{display:none}.toolbar{margin:12px 0}.workspace p{font-size:11px}}`

export const uiPatternNavigationBase = foundation + `main{padding:clamp(12px,3vw,28px)}.pattern-shell{position:relative;width:min(94%,720px);height:min(90%,520px);min-height:240px;overflow:hidden;border:1px solid var(--ui-border);border-radius:20px;background:var(--ui-surface);box-shadow:var(--ui-shadow)}.pattern-top{display:flex;align-items:center;justify-content:space-between;gap:12px;height:56px;padding:0 18px;border-bottom:1px solid var(--ui-border);background:var(--ui-surface)}.pattern-top b{font-size:13px;letter-spacing:-.02em}.pattern-top button,.pattern-button{min-height:38px;border:1px solid var(--ui-border);border-radius:10px;padding:8px 12px;background:var(--ui-surface);color:var(--ui-ink)}.pattern-top button:hover,.pattern-button:hover{border-color:#b9c1d2;background:var(--ui-surface-subtle)}.pattern-content{padding:18px}.pattern-content>small,.step-panel>small{color:var(--ui-primary);font-weight:750}.pattern-lines{display:grid;gap:10px}.pattern-lines i{display:block;height:9px;border-radius:99px;background:#e3e7ef}.pattern-lines i:nth-child(2){width:72%}.pattern-lines i:nth-child(3){width:54%}.pattern-status{font-size:11px;color:var(--ui-muted)}
main[data-variant=card]{padding:0}
main[data-variant=card] .pattern-shell{width:100%;height:100%;min-height:0;border:0;border-radius:0;box-shadow:none}
main[data-variant=card] .pattern-top{height:36px;padding:0 12px}
main[data-variant=card] .pattern-top b{font-size:11px}
main[data-variant=card] .pattern-top button,main[data-variant=card] .pattern-button{min-height:30px;padding:5px 8px;font-size:10px}
main[data-variant=card] .pattern-content{padding:9px 12px}
main[data-variant=card] .pattern-content h1{margin:4px 0;font-size:clamp(16px,7cqw,24px)}
main[data-variant=card] .pattern-lines{gap:5px}
main[data-variant=card] .pattern-lines i{height:5px}
main[data-variant=card] .pattern-status{font-size:10px}`
