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

server.listen(4175, async () => {
  console.log('Verification server running on port 4175');

  if (!fs.existsSync('scratch-shots')) fs.mkdirSync('scratch-shots');

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    // 1. Check Doors on Home page
    console.log('Testing Doors on Home page...');
    await page.goto('http://localhost:4175/#/work', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const el = document.getElementById('sci-fi-doors');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(1500); // Wait for Three.js to mount
    await page.screenshot({ path: 'scratch-shots/fix-doors-home.png' });
    console.log('Saved scratch-shots/fix-doors-home.png');

    // 2. Check Detail page for sci-fi gun
    console.log('Testing Detail page for scifi-gun...');
    await page.goto('http://localhost:4175/#/project/scifi-gun', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch-shots/fix-scifi-gun.png' });
    console.log('Saved scratch-shots/fix-scifi-gun.png');

    // 3. Check Detail page for vr-applications
    console.log('Testing Detail page for vr-applications...');
    await page.goto('http://localhost:4175/#/project/vr-applications', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch-shots/fix-vr-apps.png' });
    console.log('Saved scratch-shots/fix-vr-apps.png');

    // 4. Check Detail page for environments-vfx
    console.log('Testing Detail page for environments-vfx...');
    await page.goto('http://localhost:4175/#/project/environments-vfx', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'scratch-shots/fix-env-vfx.png' });
    console.log('Saved scratch-shots/fix-env-vfx.png');

    // 5. Check Optimization Game on home page
    console.log('Testing Optimization Game and Victory trigger...');
    await page.goto('http://localhost:4175/#/work', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const el = document.querySelector('[data-ogame]');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    // Jump to step 27 (last step)
    await page.evaluate(() => {
      const pills = document.querySelectorAll('[data-og-idx]');
      if (pills.length) (pills[pills.length - 1]).click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/fix-optgame-step28.png' });
    console.log('Saved scratch-shots/fix-optgame-step28.png');

    // Click finish action button to trigger Victory modal!
    await page.evaluate(() => {
      const btn = document.querySelector('[data-og-action]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch-shots/fix-optgame-victory.png' });
    console.log('Saved scratch-shots/fix-optgame-victory.png');

    await browser.close();
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    server.close();
  }
});
