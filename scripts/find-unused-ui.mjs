import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const uiDir = path.join(root, 'components', 'ui')

if (!fs.existsSync(uiDir)) {
  console.error(`Missing directory: ${uiDir}`)
  process.exit(1)
}

const uiFiles = fs
  .readdirSync(uiDir)
  .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))

const uiBase = new Set(uiFiles.map((f) => f.replace(/\.(ts|tsx)$/, '')))

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (['node_modules', '.next', '.turbo', 'dist'].includes(ent.name)) continue
      if (p.includes(path.join(root, 'server', 'dist'))) continue
      walk(p, out)
    } else if (ent.isFile() && /\.(ts|tsx)$/.test(ent.name)) {
      if (p.includes(path.join(root, 'server', 'dist'))) continue
      out.push(p)
    }
  }
  return out
}

const files = walk(root)
const used = new Set()

const importFromRe = /from\s+['"]([^'"\n]+)['"]/g

function markUsedByImport(fromFile, spec) {
  const cleaned = spec.replace(/\.(ts|tsx)$/, '')

  // Alias imports: @/components/ui/<name>
  const aliasPrefix = '@/components/ui/'
  if (cleaned.startsWith(aliasPrefix)) {
    const base = path.posix.basename(cleaned.slice(aliasPrefix.length))
    if (uiBase.has(base)) used.add(base)
    return
  }

  // Absolute-ish path string containing components/ui/
  const idx = cleaned.replaceAll('\\', '/').indexOf('components/ui/')
  if (idx !== -1) {
    const base = path.posix.basename(cleaned.slice(idx + 'components/ui/'.length))
    if (uiBase.has(base)) used.add(base)
    return
  }

  // Relative imports: resolve and see if it points into components/ui
  if (cleaned.startsWith('.')) {
    const fromDir = path.dirname(fromFile)
    const resolved = path.resolve(fromDir, cleaned)
    if (resolved.startsWith(uiDir + path.sep)) {
      const base = path.basename(resolved)
      if (uiBase.has(base)) used.add(base)
    }
  }
}

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8')
  let m
  while ((m = importFromRe.exec(txt))) {
    markUsedByImport(f, m[1])
  }
}

const unused = [...uiBase].filter((b) => !used.has(b)).sort()
const unusedPaths = unused
  .map((b) => {
    const ts = path.join(uiDir, `${b}.ts`)
    const tsx = path.join(uiDir, `${b}.tsx`)
    if (fs.existsSync(ts)) return path.relative(root, ts)
    if (fs.existsSync(tsx)) return path.relative(root, tsx)
    return `components/ui/${b} (missing?)`
  })

console.log(`UI files: ${uiFiles.length}`)
console.log(`Used: ${used.size}`)
console.log(`Unused: ${unused.length}`)
console.log(unusedPaths.join('\n'))

