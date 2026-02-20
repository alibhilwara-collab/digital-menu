import { rmSync } from 'fs'
import { join } from 'path'

const nextDir = join(process.cwd(), '.next')
try {
  rmSync(nextDir, { recursive: true, force: true })
  console.log('Successfully cleared .next cache directory')
} catch (e) {
  console.log('Error clearing cache:', e.message)
}
