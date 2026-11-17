import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { demoModule } from '../../scripts/lib/demo-module.mjs'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')
const { recipeHtml, recipes, references, buildAgentPackage } = await demoModule()

const demos = ['neural-network-field', 'ascending-matrix-rain']
const retired = ['morphing-particle-stage', 'hero-stage-think', 'hero-stage-make', 'hero-stage-share']
const views = [
  ['card', 320, 192],
  ['detail', 1440, 900],
  ['detail-mobile', 390, 844],
]
const outDir = 'artifacts/local/browser/generative-backgrounds'
await mkdir(outDir, { recursive: true })

for (const id of retired) {
  assert(!recipes[id], `${id}: retired recipe still exists`)
  assert(!references.some(reference => reference.id === id), `${id}: retired catalog reference still exists`)
}

for (const id of demos) {
  const recipe = recipes[id]
  const item = references.find(reference => reference.id === id)
  assert(recipe, `${id}: recipe missing`)
  assert(item, `${id}: catalog reference missing`)
  assert(item.prompt.includes('no headline, labels, HUD, or buttons'), `${id}: prompt must require a background-only result`)
  assert(buildAgentPackage(item).includes(recipe.logic), `${id}: Agent package and recipe logic drifted`)
  assert(!/(?:src|href)=["']https?:|@import|url\(["']?https?:|\bfetch\(/i.test(recipeHtml(id)), `${id}: demo must stay offline`)
  assert(!/<(?:h1|p|button|small|strong|span)\b/i.test(recipe.html), `${id}: visible copy/control leaked into background DOM`)
  assert(/fillRect\(0,0,width,height\)/.test(recipe.js), `${id}: opaque frame reset is missing`)
}
assert(!/\b(?:spring|spawn|morph|vx|vy)\b/i.test(recipes['neural-network-field'].js), 'neural field reintroduced persistent spring/spawn/morph state')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext()
const report = { errors: [], screenshots: [], checks: [] }

for (const id of demos) {
  for (const [view, width, height] of views) {
    const variant = view === 'card' ? 'card' : 'detail'
    const page = await context.newPage()
    await page.setViewportSize({ width, height })
    page.on('pageerror', error => report.errors.push(`[${id} ${view}] ${error.message}`))
    page.on('console', message => {
      if (message.type() === 'error') report.errors.push(`[${id} ${view}] ${message.text()}`)
    })
    await page.setContent(recipeHtml(id, { variant }), { waitUntil: 'load' })
    await page.waitForFunction(() => document.querySelector('[data-generative-background]')?.dataset.ready === 'true')

    const state = await page.evaluate(() => {
      const root = document.querySelector('[data-generative-background]')
      const canvas = document.querySelector('canvas')
      return {
        text: document.body.innerText.trim(),
        buttonCount: document.querySelectorAll('button').length,
        kind: root?.dataset.generativeBackground,
        motion: root?.dataset.motion,
        nodeCount: Number(root?.dataset.nodeCount || 0),
        edgeCount: Number(root?.dataset.edgeCount || 0),
        columnCount: Number(root?.dataset.columnCount || 0),
        direction: root?.dataset.direction,
        canvasWidth: canvas?.width || 0,
        canvasHeight: canvas?.height || 0,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }
    })
    assert.equal(state.text, '', `${id} ${view}: background must not render copy`)
    assert.equal(state.buttonCount, 0, `${id} ${view}: background must not render controls`)
    assert(state.canvasWidth > 0 && state.canvasHeight > 0, `${id} ${view}: canvas was not initialized`)
    assert(state.scrollWidth <= state.clientWidth + 1, `${id} ${view}: horizontal overflow`)
    if (id === 'neural-network-field') {
      assert.equal(state.kind, 'neural')
      assert.equal(state.nodeCount, variant === 'card' ? 78 : 148, `${id} ${view}: density budget drifted`)
      assert(state.edgeCount > state.nodeCount * .65, `${id} ${view}: network is too disconnected`)
    } else {
      assert.equal(state.kind, 'matrix')
      assert.equal(state.direction, 'up', `${id} ${view}: stream direction drifted`)
      assert(state.columnCount >= Math.floor(width / (variant === 'card' ? 15 : 19)), `${id} ${view}: column coverage is incomplete (${state.columnCount} columns for ${width}px)`)
    }

    const firstFrame = `${outDir}/${id}-${view}-${width}x${height}-first.png`
    await page.screenshot({ path: firstFrame })
    await page.mouse.move(width * .5, height * .5)
    await page.waitForTimeout(120)
    assert.equal(await page.locator('[data-generative-background]').getAttribute('data-pointer-active'), 'true', `${id} ${view}: pointer interaction did not activate`)
    const interactive = `${outDir}/${id}-${view}-${width}x${height}-pointer.png`
    await page.screenshot({ path: interactive })
    report.screenshots.push({ id, view, width, height, firstFrame, interactive })
    report.checks.push({ id, view, ...state, passed: true })
    await page.close()
  }
}

for (const id of demos) {
  const reducedContext = await browser.newContext({ viewport: { width: 900, height: 560 }, reducedMotion: 'reduce' })
  const page = await reducedContext.newPage()
  await page.setContent(recipeHtml(id, { variant: 'detail', forceReduced: true }), { waitUntil: 'load' })
  await page.waitForFunction(() => document.querySelector('[data-generative-background]')?.dataset.ready === 'true')
  assert.equal(await page.locator('[data-generative-background]').getAttribute('data-motion'), 'reduced', `${id}: reduced motion state missing`)
  const before = await page.locator('canvas').screenshot()
  await page.waitForTimeout(240)
  const after = await page.locator('canvas').screenshot()
  assert(before.equals(after), `${id}: reduced-motion canvas continued animating`)
  await page.close()
  await reducedContext.close()
}

assert.deepEqual(report.errors, [], `Browser errors: ${JSON.stringify(report.errors, null, 2)}`)
await writeFile(`${outDir}/browser-qa-report.json`, JSON.stringify(report, null, 2))
await browser.close()
console.log('PASS: two clean full-bleed backgrounds; retired four-stage set absent; desktop/mobile/card; pointer; reduced motion; zero browser errors')
