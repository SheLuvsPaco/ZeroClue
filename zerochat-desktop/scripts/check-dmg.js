// Fast sanity check: verify DMG exists and print size
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dmgPath = path.resolve(__dirname, '..', '..', 'server', 'static', 'downloads', 'macos', 'ZeroChat-latest.dmg');

if (!fs.existsSync(dmgPath)) {
  console.error(`❌ DMG not found: ${dmgPath}`);
  process.exit(1);
}

const stats = fs.statSync(dmgPath);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`✅ DMG found: ${dmgPath}`);
console.log(`   Size: ${sizeMB} MB (${stats.size.toLocaleString()} bytes)`);
process.exit(0);


