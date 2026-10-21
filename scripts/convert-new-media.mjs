// Converts any new PNG/JPG in public/media into an optimized 1600px WebP + a 480px ".sm.webp" thumbnail,
// then moves the original into media-originals/ (git-ignored) so the site never ships heavy files.
// Run after dropping new pictures in: node scripts/convert-new-media.mjs && node scripts/make-thumbs.mjs
// Special rule: "II5.jpg" -> replaces "I5.webp" (the double-I naming means "new version of I5").
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
let n = 0;
for (const f of walk('public/media')) {
  if (!/\.(png|jpe?g)$/i.test(f)) continue;
  let base = path.basename(f).replace(/\.[^.]+$/, '');
  base = base.replace(/&/g, 'and');
  if (/^II\d+$/.test(base)) base = base.slice(1); // II5 -> I5
  const out = path.join(path.dirname(f), base + '.webp');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', f, '-vf', "scale='min(1600,iw)':-2", '-c:v', 'libwebp', '-quality', '82', out]);
  const sm = out.replace(/\.webp$/, '.sm.webp');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', out, '-vf', "scale='min(480,iw)':-2", '-c:v', 'libwebp', '-quality', '78', sm]);
  const dest = path.join('media-originals', path.relative('public/media', f));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(f, dest);
  console.log(`${path.relative('public/media', f)} -> ${path.relative('public/media', out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
  n++;
}
console.log(`converted: ${n}`);
