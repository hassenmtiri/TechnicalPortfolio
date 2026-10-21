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
server.listen(4191, async () => {
  try {
    const browser = await chromium.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto('http://localhost:4191/#/work', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('.rv').forEach((e) => e.classList.add('in')));
    await page.evaluate(() => document.querySelector('.vrlist').scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => [...document.querySelectorAll('.vrlist li')].map((li) => {
      const r = li.getBoundingClientRect(); const im = li.querySelector('img');
      return { w: Math.round(r.width), h: Math.round(r.height), imgLoaded: !!im && im.complete && im.naturalWidth > 0, src: im?.currentSrc?.split('/').pop() };
    }));
    console.log(JSON.stringify(info));
    await page.screenshot({ path: 'scratch-shots/v2-vr-home2.png' });
    await page.evaluate(() => window.scrollBy(0, 700));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scratch-shots/v2-vr-home3.png' });
    await browser.close();
  } catch (e) { console.error(e); } finally { server.close(); }
});
