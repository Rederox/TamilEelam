// Requires Playwright with Chromium and WebKit. Run against a production build:
// BASE_URL=http://localhost:3100 node scripts/check-loading.cjs
const assert = require('node:assert/strict')
const { chromium, webkit } = require('playwright')
const base = process.env.BASE_URL || 'http://localhost:3100'

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.loading !== 'true')
  await page.locator('#prologue h1').waitFor({ state: 'visible' })
  assert(await page.locator('#prologue h1').isVisible())
  assert(!(await page.locator('.vigil-loading').isVisible()))
}

;(async () => {
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch()
    try {
      for (const mobile of [false, true]) {
        const context = await browser.newContext({
          viewport: { width: mobile ? 390 : 1440, height: 900 },
          deviceScaleFactor: mobile ? 3 : 1,
          isMobile: mobile, hasTouch: mobile,
        })
        const page = await context.newPage()
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        await page.addInitScript(() => {
          window.__glCanvases = new Set()
          const getContext = HTMLCanvasElement.prototype.getContext
          HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
            const result = getContext.call(this, kind, ...args)
            if (kind === 'webgl2' && result) window.__glCanvases.add(this)
            return result
          }
        })
        let releaseImage
        const gate = new Promise((resolve) => { releaseImage = resolve })
        await page.route('**/empty-home-landscape.webp', async (route) => {
          await gate
          await route.continue()
        })
        await page.goto(base, { waitUntil: 'domcontentloaded' })
        await page.locator('.vigil-loading').waitFor({ state: 'visible' })
        assert(!(await page.locator('#prologue h1').isVisible()))
        assert.equal(await page.evaluate(() => window.__glCanvases.size), 0)
        releaseImage()
        await ready(page)
        await page.waitForTimeout(1200)
        const initial = await page.evaluate(() => window.__glCanvases.size)
        assert(initial <= 3, `Too many initial contexts: ${initial}`)
        if (mobile) {
          assert(await page.evaluate(() => [...window.__glCanvases].every((c) => c.width <= c.clientWidth + 1)))
        }
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        for (const id of ['feu', 'juillet', 'mullivaikkal', 'prologue']) {
          await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ behavior: 'instant' }))
          await page.waitForTimeout(400)
        }
        assert(await page.evaluate(() => [...window.__glCanvases].filter((c) => c.isConnected).every((c) => c.width <= 4096 && c.height <= 4096 && c.width * c.height <= 4_000_000)))
        await page.getByRole('button', { name: 'Lire sur papier ancien' }).click()
        await page.getByRole('button', { name: 'Revenir à la veillée' }).click()
        assert.deepEqual(errors, [])
        console.log(`${engine.name()} ${mobile ? 'mobile' : 'desktop'}: loader, deferred GL (${initial}), layout, chapters, themes OK`)
        await context.close()
      }

      const reduced = await browser.newPage({ reducedMotion: 'reduce' })
      await reduced.route('**/empty-home-landscape.webp', (route) => route.abort())
      await reduced.goto(base)
      await ready(reduced)
      assert.equal(await reduced.locator('.vigil-loading-line').evaluate((el) => getComputedStyle(el).animationName), 'none')
      await reduced.close()

      const noJs = await browser.newPage({ javaScriptEnabled: false })
      await noJs.goto(base)
      assert(await noJs.locator('#prologue h1').isVisible())
      assert(!(await noJs.locator('.vigil-loading').isVisible()))
      await noJs.close()

      const brokenJs = await browser.newPage()
      await brokenJs.route('**/_next/static/**/*.js', (route) => route.abort())
      await brokenJs.goto(base, { waitUntil: 'domcontentloaded' })
      await ready(brokenJs)
      await brokenJs.close()
      console.log(`${engine.name()}: missing image, reduced motion, no JS, failed hydration deadline OK`)
    } finally { await browser.close() }
  }
})().catch((error) => { console.error(error); process.exitCode = 1 })
