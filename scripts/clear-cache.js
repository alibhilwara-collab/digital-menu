import { rmSync } from 'fs';
import { join } from 'path';

const nextDir = join(process.cwd(), '.next');
try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log('Deleted .next directory successfully');
} catch (e) {
  console.log('No .next directory found or already deleted:', e.message);
}
