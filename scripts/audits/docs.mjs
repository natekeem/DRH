import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { unified } from 'unified'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'

const root = resolve(import.meta.dirname, '../..')
const guidesDir = join(root, 'src/content/guides')
const manifest = JSON.parse(readFileSync(join(guidesDir, 'manifest.json'), 'utf8'))
const slugs = new Set()
for (const { slug } of manifest) {
  assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Guide slug must be kebab case')
  assert(!slugs.has(slug), 'Duplicate guide slug: ' + slug)
  slugs.add(slug)
}
const guideFiles = readdirSync(guidesDir).filter(name => name.endsWith('.md'))
assert.deepEqual(
  guideFiles.sort(),
  [...slugs].map(slug => slug + '.md').sort(),
  'Each public guide needs exactly one Markdown file and one manifest entry',
)

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = join(dir, entry.name)
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : []
  })
}

const documents = [
  ...['README.md', 'AGENTS.md', 'scripts/README.md', 'artifacts/README.md', 'reference/README.md'].map(path => join(root, path)),
  ...markdownFiles(join(root, 'docs')),
  ...guideFiles.map(name => join(guidesDir, name)),
]
const parser = unified().use(remarkParse).use(remarkGfm)
const invalid = []
let checked = 0
for (const document of documents) {
  function check(node) {
    if (node.url && ['link', 'image', 'definition'].includes(node.type)) {
      const url = node.url
      const location = relative(root, document) + ':' + node.position.start.line
      if (url.startsWith('#/guides/')) {
        checked++
        const slug = url.slice('#/guides/'.length).split(/[?#]/, 1)[0]
        if (!slugs.has(slug)) invalid.push(location + ' unknown guide ' + url)
      } else if (!/^(?:#|\/|[a-z][a-z0-9+.-]*:)/i.test(url)) {
        checked++
        const target = resolve(dirname(document), decodeURIComponent(url.split(/[?#]/, 1)[0]))
        const path = relative(root, target)
        if (isAbsolute(path) || path === '..' || path.startsWith('../') || path.startsWith('..\\') || !existsSync(target)) {
          invalid.push(location + ' missing repository target ' + url)
        }
      }
    }
    for (const child of node.children ?? []) check(child)
  }
  check(parser.parse(readFileSync(document, 'utf8')))
}

assert.equal(invalid.length, 0, invalid.join('\n'))
console.log('PASS: ' + documents.length + ' Markdown files, ' + checked + ' local links, ' + slugs.size + ' public guide routes')
