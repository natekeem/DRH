import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
export async function demoModule() {
  const result = await build({ stdin: { contents: `export {references} from './src/data/references'; export * from './src/lib/demos/recipes'; export {demoMaturity,starterCodeFor,buildAgentPackage} from './src/lib/referencePackage'`, resolveDir: process.cwd() }, bundle: true, write: false, format: 'esm', platform: 'node', plugins: [{ name: 'raw', setup(b) {
    b.onResolve({filter:/\?raw$/}, a => ({path:resolve(a.resolveDir,a.path.replace('?raw','')),namespace:'raw'}))
    b.onLoad({filter:/.*/,namespace:'raw'}, async a => ({contents:await readFile(a.path,'utf8'),loader:'text'}))
  }}] })
  return import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'))
}
