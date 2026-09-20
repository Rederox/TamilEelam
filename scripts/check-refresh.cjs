/* Requires Playwright with Chromium and WebKit installed.
 * Run against the dev server: BASE_URL=http://localhost:3000 node scripts/check-refresh.cjs
 * DOM visibility alone misses opaque WebGL layers, so inspect painted pixels too.
 */
const assert = require('node:assert/strict')
const { chromium, webkit } = require('playwright')

async function checkPaint(page) {
  const png = await page.screenshot()
  const lit = await page.evaluate(async (base64) => {
    const image = new Image()
    image.src = `data:image/png;base64,${base64}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let count = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 110 && data[i + 1] > 110 && data[i + 2] > 110) count++
    }
    return count / (canvas.width * canvas.height)
  }, png.toString('base64'))
  assert(lit > 0.01, `Page is obscured: only ${(lit * 100).toFixed(2)}% light pixels`)
}

;(async () => {
  for (const engine of [webkit, chromium]) {
    const browser = await engine.launch(engine === chromium ? { channel: 'chrome' } : {})
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto(process.env.BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' })
      for (const width of [1440, 1440, 390]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.reload({ waitUntil: 'networkidle' })
        await page.waitForTimeout(1800)
        assert(await page.locator('#prologue h1').isVisible())
        await checkPaint(page)
        console.log(`${engine.name()} refresh ${width}px: painted content visible`)
      }
      assert.deepEqual(errors, [])
    } finally { await browser.close() }
  }
})().catch((error) => { console.error(error); process.exitCode = 1 })
