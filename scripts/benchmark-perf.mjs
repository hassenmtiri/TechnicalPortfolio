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

async function runDeviceTest(browser, name, viewport, isMobile = false) {
  const context = await browser.newContext({
    viewport,
    isMobile,
    hasTouch: isMobile,
    userAgent: isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined
  });

  const page = await context.newPage();
  let totalBytes = 0;
  let requestCount = 0;

  page.on('response', (res) => {
    requestCount++;
    const len = Number(res.headers()['content-length'] || 0);
    totalBytes += len;
  });

  const t0 = Date.now();
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - t0;

  const perfData = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((p) => p.name === 'first-contentful-paint');
    return {
      fcp: fcp ? Math.round(fcp.startTime) : 0,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : 0,
      load: nav ? Math.round(nav.loadEventEnd) : 0,
    };
  });

  console.log(`\n=== [${name.toUpperCase()}] PERFORMANCE REPORT ===`);
  console.log(`Viewport: ${viewport.width}x${viewport.height} | Mobile: ${isMobile}`);
  console.log(`Total Requests on Load: ${requestCount}`);
  console.log(`Total Payload on Load: ${(totalBytes / 1024).toFixed(1)} KB`);
  console.log(`First Contentful Paint (FCP): ${perfData.fcp} ms`);
  console.log(`DOM Content Loaded (DCL): ${perfData.domContentLoaded} ms`);
  console.log(`Network Idle Complete: ${loadTime} ms`);

  await context.close();
}

server.listen(4173, async () => {
  console.log('Server started for benchmarks...');
  try {
    const browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });

    await runDeviceTest(browser, 'Desktop 1440p', { width: 1440, height: 900 }, false);
    await runDeviceTest(browser, 'Mobile iPhone/Android', { width: 390, height: 844 }, true);

    await browser.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    server.close();
  }
});
