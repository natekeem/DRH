import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright')
const guides = JSON.parse(await readFile(new URL('../../src/content/guides/manifest.json', import.meta.url), 'utf8'))
const base = (process.env.DRH_URL || 'http://127.0.0.1:5173').replace(/\/$/, '')
const browser = await chromium.launch({ channel: 'msedge', executablePath: process.env.EDGE_PATH })
const errors = []

try {
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(base + '/#/guides')
    const cards = page.locator('.guide-library .guide-card')
    await cards.last().waitFor()
    assert.equal(await cards.count(), guides.length)
    for (const guide of guides) {
      await page.goto(base + '/#/guides/' + guide.slug)
      await page.getByRole('heading', { name: guide.title, exact: true }).waitFor()
      await page.locator('.guide-markdown h2[id]').first().waitFor()
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), guide.slug + ' overflows at ' + width)
    }

    await page.goto(base + '/#/guides/create-design-md')
    const toc = page.getByRole('navigation', { name: 'On this page' })
    const link = toc.getByRole('link').last()
    await link.waitFor()
    const href = await link.getAttribute('href')
    const hash = href.slice(href.indexOf('#', 1))
    const id = decodeURIComponent(hash.slice(1))
    assert(href.startsWith('#/guides/create-design-md#'))
    await link.press('Enter')
    await page.waitForFunction(id => document.activeElement?.id === id, id)
    assert(page.url().endsWith(href))
    await page.goBack()
    await page.waitForURL('**/#/guides/create-design-md')

    const direct = await context.newPage()
    direct.on('pageerror', error => errors.push(error.message))
    await direct.goto(base + '/' + href)
    await direct.waitForFunction(id => document.activeElement?.id === id, id)
    assert(await direct.locator('.guide-markdown').evaluate((body, id) => {
      const heading = document.getElementById(id)
      return body.contains(heading) && heading.getBoundingClientRect().top < innerHeight
    }, id))
    await direct.goto(base + '/#/guides/missing-guide')
    await direct.getByRole('heading', { name: '가이드를 찾을 수 없습니다.' }).waitFor()
    await direct.getByRole('link', { name: '가이드 목록' }).click()
    await direct.waitForURL('**/#/guides')
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('PASS: guide list, ' + guides.length + ' article routes, keyboard TOC, cold deep links, back and missing guides at both viewport sizes')
} finally {
  await browser.close()
}
