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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=31536000, immutable'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(4176, async () => {
  console.log('Capture server running on port 4176');
  if (!fs.existsSync('scratch-shots')) fs.mkdirSync('scratch-shots');

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    // 1. Asset Optimization detail page
    console.log('1. Testing Asset Optimization detail page...');
    await page.goto('http://localhost:4176/#/project/asset-optimization', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const g = document.querySelector('[data-ogame]');
      if (g) g.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/detail-optgame-step1.png' });

    // Click step 28 (last pill)
    await page.evaluate(() => {
      const pills = document.querySelectorAll('[data-og-idx]');
      if (pills.length) (pills[pills.length - 1]).click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/detail-optgame-step28.png' });

    // Trigger victory modal via action click
    await page.evaluate(() => {
      const btn = document.querySelector('[data-og-action]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/detail-optgame-victory.png' });

    // 2. Environments VFX detail page
    console.log('2. Testing Environments VFX detail page...');
    await page.goto('http://localhost:4176/#/project/environments-vfx', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const env = document.querySelector('.denv');
      if (env) env.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/detail-env-vfx.png' });

    // 3. VR Applications detail page
    console.log('3. Testing VR Applications detail page...');
    await page.goto('http://localhost:4176/#/project/vr-applications', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const vr = document.querySelector('.dvrapps');
      if (vr) vr.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/detail-vr-apps.png' });

    // 4. Sci-Fi Doors detail page
    console.log('4. Testing Sci-Fi Doors detail page...');
    await page.goto('http://localhost:4176/#/project/sci-fi-doors', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // 3D Three.js loading
    await page.evaluate(() => {
      const d = document.querySelector('.ddoors');
      if (d) d.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/detail-doors-3d.png' });

    await browser.close();
    console.log('All detailed screenshots captured!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    server.close();
  }
});
