import { build } from 'esbuild'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import assert from 'node:assert/strict'
const root = resolve(import.meta.dirname, '../..')
const result = await build({ stdin: { contents: `export { fluidCursorHtml } from './src/lib/demo-exports/fluidCursorHtml'; export { metaballsHtml } from './src/lib/demo-exports/metaballsHtml'; export { liquidRefractionHtml } from './src/lib/demo-exports/liquidRefractionHtml'`, resolveDir: root }, bundle: true, write: false, format: 'esm', platform: 'node', plugins: [{ name: 'raw', setup(b) {
  b.onResolve({ filter: /\?raw$/ }, args => ({ path: resolve(args.resolveDir, args.path.slice(0, -4)), namespace: 'raw' }))
  b.onLoad({ filter: /.*/, namespace: 'raw' }, async args => ({ contents: `export default ${JSON.stringify(await readFile(args.path, 'utf8'))}`, loader: 'js' }))
} }] })
const exports = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`)
const runtime = await readFile(resolve(root, 'src/components/demos/advanced/engine.js'), 'utf8')
new Function(runtime.replace('export function mountAdvancedDemo', 'function mountAdvancedDemo'))
for (const name of ['fluidCursorHtml', 'metaballsHtml', 'liquidRefractionHtml']) {
  for (const variant of ['card', 'detail']) {
    const html = exports[name]({ variant, intensity: 1.5, radius: 130 })
    assert(html.includes('Permission is hereby granted'))
    assert(html.includes('prefers-reduced-motion'))
    assert(!/<(?:script|link|img)[^>]+(?:src|href)=/i.test(html), 'Export must have no external runtime/assets')
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    assert.equal(scripts.length, 1)
    new Function(scripts[0][1])
    assert(scripts[0][1].includes(runtime.replace('export function mountAdvancedDemo', 'function mountAdvancedDemo')), 'Export must contain exact shared runtime')
    const path = resolve(root, `tests/advanced-demos/generated/${name}-${variant}.html`)
    await mkdir(dirname(path), { recursive: true }); await writeFile(path, html)
    console.log(`PASS ${name} ${variant}: self-contained, identical runtime, license, valid JS (${Buffer.byteLength(html)} bytes)`)
  }
}
console.log('Open /tests/advanced-demos/index.html in Vite for GPU, visual, lifecycle and React verification.')
