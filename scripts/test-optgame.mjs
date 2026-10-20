import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-core';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2'
};

const distDir = path.resolve('dist');

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4178, async () => {
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    await page.goto('http://localhost:4178/#/project/asset-optimization', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    await page.evaluate(() => {
      const g = document.querySelector('#detail [data-ogame]');
      if (g) {
        g.scrollIntoView();
        g.classList.add('in');
      }
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch-shots/optgame-scrolled.png' });

    // Click last pill inside #detail
    const pills = await page.$$('#detail [data-og-idx]');
    console.log('Found detail pills:', pills.length);
    if (pills.length) {
      await pills[pills.length - 1].click({ force: true });
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'scratch-shots/optgame-laststep.png' });

      const actionBtn = await page.$('#detail [data-og-action]');
      if (actionBtn) {
        await actionBtn.click({ force: true });
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'scratch-shots/optgame-victorymodal.png' });
      }
    }
    await browser.close();
    console.log('Optgame capture success!');
  } catch (err) {
    console.error('Error in optgame test:', err);
  } finally {
    server.close();
  }
});
