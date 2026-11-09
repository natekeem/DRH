import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')
const base = process.env.DRH_URL || 'http://127.0.0.1:5174'
const out = 'artifacts/navigation-motion'
const browser = await chromium.launch({ executablePath: process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true })
const context = await browser.newContext()
const page = await context.newPage()
const report = { cases: [], errors: [], external: [], alignment: [] }

page.on('pageerror', error => report.errors.push(error.message))
page.on('request', request => {
  const url = request.url()
  if (!url.startsWith(base) && !url.startsWith('data:') && !url.startsWith('blob:')) report.external.push(url)
})

const motionReferences = [
  ['pixel-run-cycle', 'motion-pixel-loop'],
  ['chalk-path-draw', 'motion-chalk-draw'],
  ['neon-light-trace', 'motion-neon-trace'],
  ['polygon-glide', 'motion-low-poly'],
  ['comic-impact-beat', 'motion-comic-impact'],
  ['flat-orbit-system', 'motion-flat-vector'],
  ['paper-layer-parallax', 'motion-paper-cutout'],
  ['kinetic-chrome-form', 'motion-cgi-kinetic'],
  ['brick-build-loop', 'motion-brick-build'],
  ['clay-character-bounce', 'motion-clay-bounce'],
  ['risograph-offset-jitter', 'motion-risograph'],
  ['blueprint-assembly', 'motion-blueprint'],
  ['ink-wash-reveal', 'motion-ink-wash'],
  ['holographic-scan-field', 'motion-holographic'],
]

const expectedCollection = [
  ...motionReferences.map(([id]) => id),
  'retro-grid', 'aurora-background', 'gradient-mesh', 'morph',
  'particles', 'metaballs', 'image-trail', 'liquid-lens-effect',
]

const assertNoOverflow = async (label, frame) => {
  const pageMetrics = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }))
  const frameMetrics = await frame.locator('html').evaluate(element => ({ width: element.clientWidth, scrollWidth: element.scrollWidth }))
  assert(pageMetrics.scrollWidth <= pageMetrics.width + 1, `${label} page overflow: ${JSON.stringify(pageMetrics)}`)
  assert(frameMetrics.scrollWidth <= frameMetrics.width + 1, `${label} frame overflow: ${JSON.stringify(frameMetrics)}`)
  return { pageMetrics, frameMetrics }
}

const openReference = async (id, demo, width, height) => {
  await page.setViewportSize({ width, height })
  await page.goto(`${base}/#/reference/${id}`)
  const frame = page.frameLocator(`iframe[title="${demo} 실행 데모"]`)
  await frame.locator('body').waitFor()
  const metrics = await assertNoOverflow(`${id}@${width}`, frame)
  report.cases.push({ id, demo, width, ...metrics })
  return frame
}

const panelAlignment = async (id, rightSelector) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`${base}/#/reference/${id}`)
  await page.locator('.reference-workspace-meta').waitFor()
  const boxes = await page.locator(`.workspace-demo-shell,${rightSelector}`).evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect()
    return { top: rect.top, bottom: rect.bottom, height: rect.height }
  }))
  assert.equal(boxes.length, 2)
  assert(Math.abs(boxes[0].top - boxes[1].top) < 1, `${id} panel tops: ${JSON.stringify(boxes)}`)
  assert(Math.abs(boxes[0].height - boxes[1].height) < 1, `${id} panel heights: ${JSON.stringify(boxes)}`)
  const metaBottom = await page.locator('.reference-workspace-meta').evaluate(element => element.getBoundingClientRect().bottom)
  assert(boxes[0].top > metaBottom, `${id} panels must start below the shared metadata row`)
  report.alignment.push({ id, boxes, metaBottom })
}

try {
  const sceneSignatures = new Set()
  for (const [id, demo] of motionReferences) {
    for (const [width, height] of [[1440, 1000], [390, 844]]) {
      const frame = await openReference(id, demo, width, height)
      const study = frame.locator('.motion-study')
      await study.waitFor()
      assert.equal(await frame.locator('.motion-toggle').count(), 1)
      if (width === 1440) sceneSignatures.add(await frame.locator('.motion-scene').evaluate(element => element.innerHTML))
    }
  }
  assert.equal(sceneSignatures.size, motionReferences.length, 'Every motion style must have a distinct scene structure')

  let frame = await openReference('kinetic-chrome-form', 'motion-cgi-kinetic', 1440, 1000)
  const toggle = frame.locator('.motion-toggle')
  await toggle.click()
  assert.equal(await toggle.getAttribute('aria-pressed'), 'true')
  const paused = await frame.locator('.motion-study').evaluate(root =>
    [root, ...root.querySelectorAll('*')].filter(element => getComputedStyle(element).animationName !== 'none').every(element => getComputedStyle(element).animationPlayState === 'paused'),
  )
  assert(paused)

  await context.setOffline(true)
  await toggle.click()
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false')
  await context.setOffline(false)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  frame = await openReference('paper-layer-parallax', 'motion-paper-cutout', 1440, 1000)
  assert.equal(await frame.locator('.motion-toggle').isDisabled(), true)
  assert.equal(await frame.locator('.motion-study').evaluate(root => [root, ...root.querySelectorAll('*')].filter(element => getComputedStyle(element).animationName !== 'none').length), 0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(`${base}/#/explore?view=collections`)
  const heading = page.getByText('Animation Style Library', { exact: true })
  await heading.waitFor()
  const collectionIds = await heading.evaluate(element => [...element.closest('section').querySelectorAll('a[href*="#/reference/"]')].map(link => link.getAttribute('href').split('/').pop()))
  assert.deepEqual(collectionIds, expectedCollection)

  await page.goto(`${base}/#/reference/animation-style-reel`)
  assert.match(await page.locator('main').innerText(), /찾을 수 없습니다/)

  await panelAlignment('admd-apple', '.brand-agent-workspace')
  await panelAlignment('pixel-run-cycle', '.artifact-workspace')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/#/reference/admd-apple`)
  await page.locator('.reference-workspace-meta').waitFor()
  assert.equal(await page.locator('.reference-workspace-meta').count(), 1)
  const mobileMetrics = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }))
  assert(mobileMetrics.scrollWidth <= mobileMetrics.width + 1)

  assert.deepEqual(report.errors, [])
  assert.deepEqual([...new Set(report.external)], [])
  await mkdir(out, { recursive: true })
  await writeFile(`${out}/browser-qa.json`, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`PASS navigation + motion browser QA: ${report.cases.length} responsive cases`)
} catch (error) {
  console.error(JSON.stringify(report))
  throw error
} finally {
  await browser.close()
}
