// Rebuild the lightweight delivery assets while preserving the original artwork.
const sharp = require('sharp')
const path = require('node:path')

async function main() {
  for (const [file, width] of [
    ['images/prologue/empty-home-landscape.png', 1672],
    ['images/kanji-bowl-realistic.png', 640],
    // widths: twice the widest frame each picture is ever set in
    ['archive/jaffna-library-2003.jpg', 1100],
    ['symbols/flag.png', 1400],
    ['symbols/leopard.jpg', 927],
    ['symbols/coucal.jpg', 1400],
    ['symbols/gloriosa.jpg', 1400],
  ]) {
    const source = path.join(__dirname, '../public', file)
    const target = source.replace(/\.\w+$/, '.webp')
    const result = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(target)
    console.log(`${path.relative(path.join(__dirname, '../public'), target)}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KiB`)
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
