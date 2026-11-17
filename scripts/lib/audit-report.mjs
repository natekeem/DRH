import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const output = 'artifacts/local/audits'

export async function writeAuditReport(filename, content) {
  await mkdir(output, { recursive: true })
  await writeFile(join(output, filename), content)
}
