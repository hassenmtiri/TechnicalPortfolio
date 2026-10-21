import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm', '.woff2': 'font/woff2' };
const dist = path.resolve('dist');
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(dist, p);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

server.listen(4190, async () => {
  const out = 'scratch-shots/';
  fs.mkdirSync(out, { recursive: true });
  try {
    const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const reveal = () => page.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in')));
    const jump = (sel, block = 'start') => page.evaluate(([s, b]) => document.querySelector(s)?.scrollIntoView({ block: b }), [sel, block]);

    await page.goto('http://localhost:4190/#/work', { waitUntil: 'networkidle' });
    await reveal();

    await jump('#sci-fi-doors .doorgrid', 'center');
    await page.waitForTimeout(2500);
    await page.screenshot({ path: out + 'v2-doors-home.png' });

    // drag-rotate door 1
    const c = await page.$('.doorcard canvas');
    const b = await c.boundingBox();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2 - 90, b.y + b.height / 2 - 20, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    await page.screenshot({ path: out + 'v2-doors-rotated.png' });

    // enlarge door 2
    await page.evaluate(() => document.querySelectorAll('[data-door-expand]')[1].click());
    await page.waitForTimeout(800);
    await page.screenshot({ path: out + 'v2-door-enlarged.png' });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    console.log('expanded after Esc:', await page.evaluate(() => document.body.classList.contains('door-expanded')));

    await jump('#vr-applications', 'start');
    await page.waitForTimeout(600);
    await page.screenshot({ path: out + 'v2-vr-home.png' });

    await jump('#scifi-gun', 'start');
    await page.waitForTimeout(600);
    await page.screenshot({ path: out + 'v2-gun-home.png' });

    await jump('#unity-cinematic', 'start');
    await page.waitForTimeout(600);
    await page.screenshot({ path: out + 'v2-unity-home.png' });

    await page.goto('http://localhost:4190/#/project/environments-vfx', { waitUntil: 'networkidle' });
    await reveal();
    await page.waitForTimeout(500);
    const envInfo = await page.evaluate(() => [...document.querySelectorAll('.denv')].map((e, i) => {
      const imgs = [...e.querySelectorAll('.denv__thumb img')];
      return { env: i + 1, thumbs: imgs.length, broken: imgs.filter((im) => im.complete && im.naturalWidth === 0).length };
    }));
    console.log('env thumbs:', JSON.stringify(envInfo));
    await jump('.denv', 'start');
    await page.waitForTimeout(500);
    await page.screenshot({ path: out + 'v2-env1.png', fullPage: false });
    console.log('errors:', JSON.stringify(errors));
    await browser.close();
  } catch (e) { console.error(e); } finally { server.close(); }
});
