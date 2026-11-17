import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const npm = process.env.npm_execpath
if (!npm) throw new Error('Run npm run check to use the project npm commands')

const manifest = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'))
const audits = Object.keys(manifest.scripts).filter(name => name.startsWith('audit:'))
for (const name of ['typecheck', 'build', ...audits]) {
  const result = spawnSync(process.execPath, [npm, 'run', name], { stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
