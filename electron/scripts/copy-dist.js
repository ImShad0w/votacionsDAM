const fs = require('node:fs')
const path = require('node:path')

const source = path.join(__dirname, '..', '..', 'frontend', 'dist')
const target = path.join(__dirname, '..', 'dist')

if (!fs.existsSync(source)) {
  console.error(`No s'ha trobat ${source}. Executa primer "npm run build" a frontend/.`)
  process.exit(1)
}

fs.rmSync(target, { recursive: true, force: true })
fs.cpSync(source, target, { recursive: true })

console.log(`Copiat ${source} -> ${target}`)
