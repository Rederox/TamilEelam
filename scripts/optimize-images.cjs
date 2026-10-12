// Rebuild the lightweight delivery assets while preserving the original artwork.
const sharp = require('sharp')
const path = require('node:path')

async function main() {
  for (const [file, width] of [
    ['images/prologue/empty-home-landscape', 1672],
    ['images/kanji-bowl-realistic', 640],
  ]) {
    const source = path.join(__dirname, '../public', file)
    const result = await sharp(`${source}.png`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(`${source}.webp`)
    console.log(`${file}.webp: ${Math.round(result.size / 1024)} KiB`)
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
