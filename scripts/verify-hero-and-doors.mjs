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

server.listen(4181, async () => {
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

    // 1. Verify Hero
    console.log('1. Checking Hero section...');
    await page.goto('http://localhost:4181/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch-shots/fix-hero-titles.png' });

    // 2. Scroll to Doors
    console.log('2. Checking Doors section (closed)...');
    await page.evaluate(() => {
      const el = document.getElementById('sci-fi-doors');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(2000); // 3D models load

    // Measure bounding boxes
    const metrics = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.doorcard'));
      return cards.map((c, i) => {
        const cr = c.getBoundingClientRect();
        const stage = c.querySelector('.doorstage');
        const sr = stage ? stage.getBoundingClientRect() : null;
        return {
          door: i + 1,
          cardWidth: cr.width,
          stageWidth: sr ? sr.width : null,
          overflowsRight: sr ? sr.right > cr.right + 1 : false,
          overflowsBottom: sr ? sr.bottom > cr.bottom + 1 : false,
          overflowsLeft: sr ? sr.left < cr.left - 1 : false
        };
      });
    });
    console.log('Door metrics (Closed):', JSON.stringify(metrics, null, 2));
    await page.screenshot({ path: 'scratch-shots/fix-doors-closed.png' });

    // 3. Open All 3 Doors!
    console.log('3. Opening all 3 doors and checking animations...');
    await page.evaluate(() => {
      const btns = document.querySelectorAll('.doorcard [data-door-toggle]');
      btns.forEach(b => (b).click());
    });
    await page.waitForTimeout(1500); // Wait for open animation to finish

    const openMetrics = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.doorcard'));
      return cards.map((c, i) => {
        const cr = c.getBoundingClientRect();
        const stage = c.querySelector('.doorstage');
        const sr = stage ? stage.getBoundingClientRect() : null;
        return {
          door: i + 1,
          cardWidth: cr.width,
          stageWidth: sr ? sr.width : null,
          overflowsRight: sr ? sr.right > cr.right + 1 : false,
          overflowsBottom: sr ? sr.bottom > cr.bottom + 1 : false
        };
      });
    });
    console.log('Door metrics (Open):', JSON.stringify(openMetrics, null, 2));
    await page.screenshot({ path: 'scratch-shots/fix-doors-open.png' });

    await browser.close();
    console.log('Hero and Doors verification complete!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    server.close();
  }
});
