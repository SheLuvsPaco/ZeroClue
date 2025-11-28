const fs = require("fs");
const path = require("path");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const st = fs.statSync(s);
    if (st.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

const src = path.resolve(__dirname, "../zerochat-desktop/dist");
const dest = path.resolve(
  __dirname,
  "../zerochat-android/app/src/main/assets/www"
);

if (!fs.existsSync(src)) {
  console.error("dist not found. Run `npm run build:web` first.");
  process.exit(1);
}

copyDir(src, dest);
console.log("✅ Copied web dist to Android assets.");


