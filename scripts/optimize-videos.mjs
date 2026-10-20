import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PUB = 'public/media';
const BAK = 'media-originals'; // outside /public → never shipped, never in dist

// [relative path, max width, crf, keepAudio]
const jobs = [
  ['films-eevee/Film1/Film1.mp4', 1280, 26, true],
  ['films-eevee/Film2/Film2.mp4', 1280, 26, true],
  ['films-eevee/Film3/Film3.mp4', 1280, 26, true],
  ['unity-cinematic/HannibalProject/Film.mp4', 1280, 26, true],
  ['vr-applications/DentalHygiene/Video.mp4', 720, 26, true],
  ['vr-applications/GameJAm/Video.mp4', 1000, 27, true],
  ['underwater-flood/WaterUnity/WaterVideo.mp4', 1280, 25, true],
  ['UnityScifiGun/UnityGun.mp4', 1280, 24, true],
  ['UnityFireSimulation/FireVideo.mp4', 1280, 24, true],
  // muted hover previews: small + silent
  ['films-eevee/Film1/Film1Preview.mp4', 640, 30, false],
  ['films-eevee/Film2/Film2Preview.mp4', 640, 30, false],
  ['films-eevee/Film3/Film3Preview.mp4', 640, 30, false],
  ['unity-cinematic/HannibalProject/Preview.mp4', 640, 30, false],
];

let before = 0, after = 0;
for (const [rel, w, crf, audio] of jobs) {
  const out = path.join(PUB, rel);
  const bak = path.join(BAK, rel);
  if (!fs.existsSync(bak)) {
    fs.mkdirSync(path.dirname(bak), { recursive: true });
    fs.copyFileSync(out, bak);
  }
  // already optimized on a previous run → skip
  if (fs.statSync(out).size < fs.statSync(bak).size * 0.9) {
    before += fs.statSync(bak).size; after += fs.statSync(out).size;
    console.log(`${rel}: already optimized, skipped`);
    continue;
  }
  const tmp = out + '.tmp.mp4';
  const args = [
    '-y', '-v', 'error', '-i', bak,
    '-vf', `scale='min(${w},iw)':-2,fps=fps='min(30,source_fps)'`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', // moov atom first → playback starts before the full download
  ];
  if (audio) args.push('-c:a', 'aac', '-b:a', '96k', '-ac', '2'); else args.push('-an');
  args.push(tmp);
  execFileSync('ffmpeg', args, { stdio: 'inherit' });
  const b = fs.statSync(bak).size, a = fs.statSync(tmp).size;
  const replace = (from) => {
    // Windows can briefly lock files (dev server / antivirus): retry, then fall back to copy
    for (let i = 0; i < 10; i++) {
      try { fs.copyFileSync(from, out); return; } catch { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500); }
    }
    throw new Error('Could not write ' + out + ' (file locked — stop the dev server and re-run)');
  };
  replace(a < b ? tmp : bak);
  fs.unlinkSync(tmp);
  const final = fs.statSync(out).size;
  before += b; after += final;
  console.log(`${rel}: ${(b / 1048576).toFixed(1)} MB -> ${(final / 1048576).toFixed(1)} MB`);
}
console.log(`VIDEOS TOTAL: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
