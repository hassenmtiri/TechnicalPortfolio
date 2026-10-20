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

server.listen(4179, async () => {
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

    // 1. VR applications: scroll down to APP 01 grid and step pills
    await page.goto('http://localhost:4179/#/project/vr-applications', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const el = document.querySelector('#detail .dfilm');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/vr-app-grid.png' });

    // 2. Environments: scroll down to ENV 01 and ENV 02
    await page.goto('http://localhost:4179/#/project/environments-vfx', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const el = document.querySelector('#detail .denv');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/env-full-view.png' });

    // Click next arrow on ENV 01
    await page.evaluate(() => {
      const nextBtn = document.querySelector('#detail .denv .dfilm__wfarrow--next');
      if (nextBtn) nextBtn.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/env-step2.png' });

    await browser.close();
    console.log('Galleries captured!');
  } finally {
    server.close();
  }
});
