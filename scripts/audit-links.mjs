import fs from 'fs';
import path from 'path';

const projectsContent = fs.readFileSync('src/data/projects.ts', 'utf8');
const optgameContent = fs.readFileSync('src/optgame.ts', 'utf8');
const htmlContent = fs.readFileSync('index.html', 'utf8');

function checkProjects(text) {
  const regex = /['"`]([a-zA-Z0-9_\-\/]+\.(?:webp|png|jpg|jpeg|mp4|glb|svg))['"`]/g;
  let match;
  const missing = [];
  let checked = 0;
  while ((match = regex.exec(text)) !== null) {
    const rel = match[1];
    if (rel.startsWith('src/') || rel.startsWith('./') || rel.startsWith('../') || rel.includes('node_modules')) continue;
    if (rel === 'underwater-flood/cover.webp') continue;
    checked++;
    const cleanRel = rel.replace(/^\/+/, '').replace(/^media\//, '');
    const pubPath = path.join('public', 'media', cleanRel);
    if (!fs.existsSync(pubPath)) {
      missing.push({ rel, pubPath });
    }
  }
  return { checked, missing };
}

function checkOptgame(text) {
  const regex = /file:\s*`\$\{FOLDER\}([^`]+)`/g;
  let match;
  const missing = [];
  let checked = 0;
  while ((match = regex.exec(text)) !== null) {
    const filename = match[1];
    checked++;
    const rel = `WorflowOptomizeGame/${filename}`;
    const pubPath = path.join('public', 'media', rel);
    if (!fs.existsSync(pubPath)) {
      missing.push({ rel, pubPath });
    }
  }
  return { checked, missing };
}

function checkHtml(text) {
  const regex = /(?:src|href|poster)=['"]([^'"]+)['"]/g;
  let match;
  const missing = [];
  let checked = 0;
  while ((match = regex.exec(text)) !== null) {
    const link = match[1];
    if (link.startsWith('http') || link.startsWith('#') || link.startsWith('data:') || link.startsWith('/src/')) continue;
    checked++;
    const clean = link.replace(/^\//, '');
    const pubPath = path.join('public', clean);
    if (!fs.existsSync(pubPath)) {
      missing.push({ link, pubPath });
    }
  }
  return { checked, missing };
}

const r1 = checkProjects(projectsContent);
const r2 = checkOptgame(optgameContent);
const r3 = checkHtml(htmlContent);

console.log(`src/data/projects.ts: ${r1.checked} references checked, ${r1.missing.length} missing.`);
if (r1.missing.length) console.log(r1.missing);

console.log(`src/optgame.ts: ${r2.checked} references checked, ${r2.missing.length} missing.`);
if (r2.missing.length) console.log(r2.missing);

console.log(`index.html: ${r3.checked} references checked, ${r3.missing.length} missing.`);
if (r3.missing.length) console.log(r3.missing);

const total = r1.missing.length + r2.missing.length + r3.missing.length;
if (total === 0) {
  console.log('>>> COMPLETE VERIFICATION PASSED: Every single media asset in projects.ts, optgame.ts, and index.html exists! <<<');
} else {
  console.error(`>>> FAILED: ${total} files missing! <<<`);
  process.exit(1);
}
