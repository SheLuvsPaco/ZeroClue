// non-interactive, fails loudly

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check both possible locations (project root target/ and src-tauri/target/)
const outDir1 = path.resolve(__dirname, '..', 'src-tauri', 'target', 'release', 'bundle', 'dmg');
const outDir2 = path.resolve(__dirname, '..', '..', 'target', 'release', 'bundle', 'macos');
const outDir3 = path.resolve(__dirname, '..', '..', 'target', 'release', 'bundle', 'dmg');
const serverDest = path.resolve(__dirname, '..', '..', 'server', 'static', 'downloads', 'macos');

let dmgPath = null;
let dmgName = null;

// Try all possible locations
for (const outDir of [outDir1, outDir2, outDir3]) {
  if (fs.existsSync(outDir)) {
    const files = fs.readdirSync(outDir);
    const dmg = files.find(f => f.toLowerCase().endsWith('.dmg'));
    if (dmg) {
      dmgPath = path.join(outDir, dmg);
      dmgName = dmg;
      break;
    }
  }
}

if (!dmgPath) {
  throw new Error(`No DMG found. Checked: ${outDir1}, ${outDir2}, ${outDir3}`);
}

fs.mkdirSync(serverDest, { recursive: true });
fs.copyFileSync(dmgPath, path.join(serverDest, 'ZeroChat-latest.dmg'));

console.log(`✅ Copied ${dmgName} -> ${serverDest}/ZeroChat-latest.dmg`);

