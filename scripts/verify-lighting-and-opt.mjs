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

server.listen(4182, async () => {
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

    // 1. Check Doors Lighting on Home
    console.log('1. Checking new studio lighting on Doors...');
    await page.goto('http://localhost:4182/#/work', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const el = document.getElementById('sci-fi-doors');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000); // Wait for Three.js and environment map
    await page.screenshot({ path: 'scratch-shots/doors-new-lighting-closed.png' });

    // Open Door 01 and Door 02 to check lit interiors
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.doorcard [data-door-toggle]');
      btns.forEach(b => (b).click());
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'scratch-shots/doors-new-lighting-open.png' });

    // 2. Check 3D Asset Optimization on Home
    console.log('2. Checking 3D Asset Optimization on Main Page...');
    await page.evaluate(() => {
      const el = document.getElementById('asset-optimization');
      if (el) el.scrollIntoView({ block: 'start' });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scratch-shots/asset-opt-home.png' });

    // 3. Check 3D Asset Optimization on Detail
    console.log('3. Checking 3D Asset Optimization Detail...');
    await page.goto('http://localhost:4182/#/project/asset-optimization', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'scratch-shots/asset-opt-detail.png' });

    await browser.close();
    console.log('All verification captures complete!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    server.close();
  }
});
