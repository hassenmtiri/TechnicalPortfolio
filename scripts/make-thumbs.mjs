// Generates a 480px-wide "<name>.sm.webp" next to every full-size WebP in public/media.
// pic() in src/ui.ts uses it through srcset, so small slots (thumbnails, cards) never
// download the 1600px image. Re-run after adding new images: node scripts/make-thumbs.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
let n = 0, bytes = 0;
for (const f of walk('public/media')) {
  if (!f.endsWith('.webp') || f.endsWith('.sm.webp')) continue;
  const sm = f.replace(/\.webp$/, '.sm.webp');
  if (fs.existsSync(sm)) continue;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', f, '-vf', "scale='min(480,iw)':-2", '-c:v', 'libwebp', '-quality', '78', sm]);
  n++; bytes += fs.statSync(sm).size;
}
console.log(`thumbnails created: ${n} (${(bytes / 1048576).toFixed(2)} MB)`);
