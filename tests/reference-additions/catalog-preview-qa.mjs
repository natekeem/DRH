import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')
const base = process.env.DRH_URL || 'http://127.0.0.1:5174'
const browser = await chromium.launch({
  channel: 'msedge',
  args: ['--enable-unsafe-swiftshader'],
})
const errors = []
const navigate = (page, category) => page.goto(base + '/#/explore?category=' + encodeURIComponent(category))
const newPage = async (options = {}) => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, ...options })
  page.setDefaultTimeout(7000)
  page.on('pageerror', e => errors.push(e.message))
  return page
}
const openCard = async (page, id) => {
  const card = page.locator('.listing-results .reference-card')
    .filter({ has: page.locator('a[href="#/reference/' + id + '"]') })
  const preview = card.locator('.card-demo')
  await preview.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
  await preview.locator('.demo-viewport > :not(.demo-placeholder)').waitFor()
  const frame = preview.frameLocator('iframe')
  if (await preview.locator('iframe').count()) {
    // Wait for the freshly mounted iframe to paint before sending input across its boundary.
    await frame.locator('main').evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    }))
  }
  return { card, preview, frame }
}
const move = async (page, preview, x = .8, y = .35) => {
  const rect = await preview.boundingBox()
  await page.mouse.move(rect.x + x * rect.width, rect.y + y * rect.height)
}
const assertText = async (locator, text) => {
  await locator.filter({ hasText: text }).waitFor()
  assert.equal((await locator.textContent()).trim(), text)
}
const click = async control => {
  await control.hover()
  await control.click({ delay: 32 })
}
const assertNoOverflow = async (root, label) => {
  const dimensions = await root.evaluate(el => [el.clientWidth, el.scrollWidth])
  assert(dimensions[1] <= dimensions[0] + 1, label + ' overflows: ' + dimensions.join('/'))
}

const navigation = {
  'tab-bar-navigation': async (page, frame) => {
    await click(frame.locator('[data-view=Search]'))
    await assertText(frame.locator('.view-title'), 'Search')
    assert.equal(await frame.locator('.tab-bar [aria-current=page]').getAttribute('data-view'), 'Search')
  },
  'top-tabs-navigation': async (page, frame) => {
    await click(frame.getByRole('tab', { name: 'Activity' }))
    await page.keyboard.press('ArrowRight')
    await assertText(frame.locator('.tab-title'), 'Files')
    await assertText(frame.locator('[aria-selected=true]'), 'Files')
  },
  'navigation-drawer': async (page, frame) => {
    const trigger = frame.locator('.menu-trigger')
    await click(trigger)
    await frame.locator('.drawer.open').waitFor()
    await page.keyboard.press('Escape')
    await frame.locator('.menu-trigger[aria-expanded=false]').waitFor()
    assert(await trigger.evaluate(el => el === document.activeElement))
    await click(trigger)
    await click(frame.getByRole('button', { name: 'Projects', exact: true }))
    await assertText(frame.locator('h1'), 'Projects')
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false')
  },
  'breadcrumb-navigation': async (page, frame) => {
    await click(frame.locator('[data-level="1"]'))
    await assertText(frame.locator('.crumb-title'), 'Guides')
    await click(frame.locator('[data-child=Timing]'))
    await assertText(frame.locator('.breadcrumbs [aria-current=page]'), 'Timing')
  },
  'sticky-header-navigation': async (page, frame) => {
    await frame.locator('.sticky-scroller').hover()
    await page.mouse.wheel(0, 150)
    const header = frame.locator('.sticky-head.compact')
    await header.waitFor()
    assert(Math.abs(await header.evaluate(el => el.getBoundingClientRect().top)) <= 1)
  },
  'floating-action-button': async (page, frame) => {
    const fab = frame.locator('.fab')
    assert(await frame.locator('.fab-menu').evaluate(el => el.inert))
    await click(fab)
    await click(frame.getByRole('button', { name: '사진', exact: true }))
    await assertText(frame.locator('.action-status'), '사진 선택')
    assert.equal(await fab.getAttribute('aria-expanded'), 'false')
  },
  'pagination-navigation': async (page, frame) => {
    await click(frame.getByRole('button', { name: '5', exact: true }))
    await assertText(frame.locator('.page-status'), 'Page 5 of 5')
    await assertText(frame.locator('.page-title'), 'Delivery')
  },
  'infinite-scroll-navigation': async (page, frame) => {
    assert.equal(await frame.locator('.infinite-item').count(), 8)
    await frame.locator('.infinite-shell').hover()
    await page.mouse.wheel(0, 300)
    await frame.locator('.infinite-item').nth(11).waitFor({ state: 'attached' })
  },
  'back-navigation': async (page, frame) => {
    await click(frame.locator('[data-screen=Projects]'))
    await assertText(frame.locator('.stack-title'), 'Projects')
    await click(frame.locator('.back-button'))
    await assertText(frame.locator('.stack-title'), 'Home')
  },
  'mega-menu-navigation': async (page, frame) => {
    const panel = frame.locator('.mega-panel')
    assert(!(await panel.isVisible()), 'Closed mega menu should not cover the preview')
    await click(frame.locator('.mega-trigger'))
    await click(panel.locator('[data-item=Canvas]'))
    await assertText(frame.locator('.mega-status'), 'Canvas selected')
    assert(!(await panel.isVisible()))
  },
  'bottom-sheet': async (page, frame) => {
    const sheet = frame.locator('dialog')
    await click(frame.getByRole('button', { name: '크게', exact: true }))
    await frame.locator('dialog[data-snap="90"]').waitFor()
    await click(frame.getByRole('button', { name: '닫기', exact: true }))
    await click(frame.locator('.open-dialog'))
    await page.keyboard.press('Escape')
    await sheet.waitFor({ state: 'hidden' })
  },
  'stepper-navigation': async (page, frame) => {
    const next = frame.locator('.step-next')
    await click(next)
    // A prior timer advanced the card every 1.75s, overwriting the user's choice.
    await page.waitForTimeout(1950)
    assert.equal(await frame.locator('.step-title').textContent(), 'Complete profile')
    await click(next)
    await frame.locator('.step-panel input').waitFor({ state: 'hidden' })
    await click(next)
    await assertText(next, 'Complete ✓')
    await click(frame.locator('.step-back'))
    await assertText(next, 'Next →')
    assert(await next.isEnabled())
  },
}

try {
  const page = await newPage()
  await navigate(page, 'UI Patterns')
  const listUrl = page.url()
  for (const [id, check] of Object.entries(navigation)) {
    const { frame } = await openCard(page, id)
    await frame.locator('main[data-variant=card]').waitFor()
    await assertNoOverflow(frame.locator('html'), id)
    if (id !== 'bottom-sheet') {
      const inset = await frame.locator('main').evaluate(main => {
        const viewport = main.getBoundingClientRect()
        const shell = main.querySelector('.pattern-shell').getBoundingClientRect()
        return ['top', 'right', 'bottom', 'left'].map(edge => Math.abs(viewport[edge] - shell[edge]))
      })
      assert(inset.every(value => value <= 1), id + ' has an inset preview surface')
    }
    try {
      await check(page, frame)
    } catch (cause) {
      throw new Error(id + ' failed in the list', { cause })
    }
    assert.equal(page.url(), listUrl, id + ' navigated outside the preview')
  }
  console.log('PASS desktop: all 12 navigation previews respond without leaving the list')

  await navigate(page, 'Background')
  for (const id of ['neural-network-field', 'ascending-matrix-rain']) {
    const { preview, frame } = await openCard(page, id)
    const field = '[data-generative-background][data-ready=true]'
    await frame.locator(field).waitFor()
    await move(page, preview)
    await frame.locator(field + '[data-pointer-active=true]').waitFor()
    await page.mouse.move(3, 3)
    await frame.locator(field + '[data-pointer-active=false]').waitFor()
  }

  for (const id of ['metaballs', 'fluid-cursor', 'liquid-lens-effect']) {
    if (id === 'liquid-lens-effect') await navigate(page, 'Effects')
    const { preview } = await openCard(page, id)
    const surface = preview.locator('.drh-advanced')
    await surface.locator('canvas').waitFor({ state: 'attached' })
    const height = await preview.evaluate(el => el.clientHeight)
    assert(Math.abs(height - await surface.evaluate(el => el.clientHeight)) <= 1, id + ' does not fit its preview')
    const url = page.url()
    await click(surface)
    assert.equal(page.url(), url, id + ' navigated from the preview')
  }

  await navigate(page, 'Motion')
  const { preview, frame } = await openCard(page, 'magnetic-button')
  await frame.locator('.object').waitFor()
  await move(page, preview)
  await frame.locator('main[style*="--nx:"]').waitFor()
  assert(Number(await frame.locator('main').evaluate(el => el.style.getPropertyValue('--nx'))) > .15)
  await page.mouse.move(3, 3)
  await frame.locator('main[style*="--nx: 0;"]').waitFor()
  const trail = await openCard(page, 'image-trail')
  await trail.frame.locator('main').waitFor()
  await move(page, trail.preview, .25, .5)
  await move(page, trail.preview, .75, .5)
  await trail.frame.locator('img.trail').last().waitFor()
  const motionStyle = await openCard(page, 'pixel-run-cycle')
  await click(motionStyle.frame.locator('.motion-toggle'))
  await motionStyle.frame.locator('.motion-toggle[aria-pressed=true]').waitFor()
  const motionUrl = page.url()
  await click(motionStyle.card.locator('.card-summary > p'))
  assert.equal(page.url(), motionUrl, 'Description should be selectable without navigation')
  assert.equal(await motionStyle.card.locator('a[href^="#/reference/"]').count(), 1)
  await motionStyle.card.locator('.reference-card-link').press('Enter')
  await page.waitForURL('**/#/reference/pixel-run-cycle')
  console.log('PASS pointer effects, native canvas size, and title navigation')

  const mobile = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await navigate(mobile, 'UI Patterns')
  for (const id of Object.keys(navigation)) {
    const { frame } = await openCard(mobile, id)
    await frame.locator('main[data-variant=card]').waitFor()
    await assertNoOverflow(frame.locator('html'), id + ' mobile')
    if (id === 'tab-bar-navigation') {
      await frame.locator('[data-view=Saved]').tap()
      await assertText(frame.locator('.view-title'), 'Saved')
    }
  }
  await assertNoOverflow(mobile.locator('html'), 'Mobile catalog')
  await mobile.close()

  const reduced = await newPage({ reducedMotion: 'reduce' })
  await navigate(reduced, 'Background')
  const neural = await openCard(reduced, 'neural-network-field')
  await neural.frame.locator('[data-generative-background][data-motion=reduced]').waitFor()
  const canvas = neural.frame.locator('canvas')
  const still = await canvas.evaluate(el => el.toDataURL())
  await move(reduced, neural.preview)
  assert.equal(await canvas.evaluate(el => el.toDataURL()), still, 'Reduced neural field responds to pointer motion')
  const metaballs = await openCard(reduced, 'metaballs')
  const staticMetaballs = metaballs.preview.locator('.drh-advanced[data-engine-mode=reduced-motion]')
  await staticMetaballs.waitFor()
  await reduced.emulateMedia({ reducedMotion: 'no-preference' })
  await staticMetaballs.waitFor({ state: 'hidden' })
  await reduced.emulateMedia({ reducedMotion: 'reduce' })
  await staticMetaballs.waitFor()
  await navigate(reduced, 'Motion')
  const pixel = await openCard(reduced, 'pixel-run-cycle')
  assert(await pixel.frame.locator('.motion-toggle').isDisabled())
  await reduced.emulateMedia({ reducedMotion: 'no-preference' })
  await pixel.frame.locator('.motion-toggle:enabled').waitFor()
  assert(await pixel.frame.locator('.motion-study').evaluate(el => el.getAnimations({ subtree: true }).length > 0))
  await assertNoOverflow(reduced.locator('html'), 'Desktop catalog')
  assert.deepEqual(errors, [])
  console.log('PASS mobile navigation, reduced motion, and live motion preference changes')
} catch (error) {
  if (errors.length) console.error('Browser errors:', errors)
  throw error
} finally {
  await browser.close()
}
