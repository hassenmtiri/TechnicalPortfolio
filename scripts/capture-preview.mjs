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
  '.wasm': 'application/wasm'
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

server.listen(4174, async () => {
  console.log('Capture server running on port 4174');

  if (!fs.existsSync('scratch-shots')) fs.mkdirSync('scratch-shots');

  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    // 1. Desktop full page
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
    await pageDesktop.screenshot({ path: 'scratch-shots/desktop-hero.png', fullPage: false });
    console.log('Saved scratch-shots/desktop-hero.png');

    // Scroll to work section and capture
    await pageDesktop.evaluate(() => window.scrollTo(0, 950));
    await pageDesktop.waitForTimeout(600);
    await pageDesktop.screenshot({ path: 'scratch-shots/desktop-work.png', fullPage: false });
    console.log('Saved scratch-shots/desktop-work.png');

    // Scroll to doors section
    await pageDesktop.evaluate(() => {
      const el = document.getElementById('sci-fi-doors');
      if (el) el.scrollIntoView();
    });
    await pageDesktop.waitForTimeout(1000);
    await pageDesktop.screenshot({ path: 'scratch-shots/desktop-doors.png', fullPage: false });
    console.log('Saved scratch-shots/desktop-doors.png');

    // 2. Mobile Hero
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await pageMobile.goto('http://localhost:4174/', { waitUntil: 'networkidle' });
    await pageMobile.screenshot({ path: 'scratch-shots/mobile-hero.png', fullPage: false });
    console.log('Saved scratch-shots/mobile-hero.png');

    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    server.close();
  }
});
