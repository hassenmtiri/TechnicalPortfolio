// Smoke test + performance probe. Needs `npm run build && npm run preview` running on :4173
// and a local Chrome. Run: node scripts/check.mjs
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:4173/';
const shots = 'scratch-shots';
fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [];
const log = (...a) => console.log(...a);

async function run(name, viewport, fn) {
  const ctx = await browser.newContext({ viewport, hasTouch: viewport.width < 700, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  const bytes = { total: 0, js: 0, img: 0, reqs: 0, three: false };
  page.on('response', async (r) => {
    try { const b = (await r.body()).length; bytes.total += b; bytes.reqs++; const u = r.url(); if (u.endsWith('.js')) bytes.js += b; if (/\.(svg|png|jpg|webp)/.test(u)) bytes.img += b; if (u.includes('three')) bytes.three = true; } catch {}
  });
  await page.goto(URL, { waitUntil: 'load' });
  await fn(page, bytes);
  await ctx.close();
}

await run('desktop', { width: 1440, height: 900 }, async (page, bytes) => {
  await page.waitForTimeout(1800);
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    const paint = Object.fromEntries(performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]));
    return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), ...paint };
  });
  const cls = await page.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; }).observe({ type: 'layout-shift', buffered: true }); setTimeout(() => res(v), 300); }));
  log('HOME  timings(ms)', nav, 'CLS', cls.toFixed(4));
  log('HOME  initial transfer: total', (bytes.total / 1024).toFixed(0), 'KB; js', (bytes.js / 1024).toFixed(0), 'KB; images', (bytes.img / 1024).toFixed(0), 'KB; requests', bytes.reqs, '; three.js loaded:', bytes.three);
  await page.screenshot({ path: `${shots}/01-hero.png` });
  await page.hover('#lens'); await page.mouse.move(700, 450); await page.waitForTimeout(400);
  await page.screenshot({ path: `${shots}/02-hero-lens.png` });
  await page.evaluate(() => document.getElementById('work').scrollIntoView()); await page.waitForTimeout(1200);
  for (const s of ['films-eevee', 'unity-cinematic', 'underwater-flood', 'sci-fi-doors', 'asset-optimization', 'vr-applications', 'environments-vfx']) {
    await page.evaluate((id) => document.getElementById(id).scrollIntoView({ block: 'start' }), s);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${shots}/h-${s}.png` });
  }
  // compare slider via keyboard + mouse
  await page.focus('#asset-optimization .cmp__handle');
  await page.keyboard.press('End');
  log('SLIDER after End:', await page.getAttribute('#asset-optimization .cmp__handle', 'aria-valuenow'));
  const box = await page.locator('#asset-optimization .cmp').boundingBox();
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width * 0.25, box.y + 50, { steps: 5 }); await page.mouse.up();
  log('SLIDER after drag:', await page.getAttribute('#asset-optimization .cmp__handle', 'aria-valuenow'));
  // film viewer
  await page.evaluate(() => document.getElementById('films-eevee').scrollIntoView()); await page.waitForTimeout(900);
  await page.click('#films-eevee .film >> nth=0');
  await page.waitForTimeout(600);
  log('VIEWER open:', await page.evaluate(() => document.getElementById('viewer').open));
  await page.screenshot({ path: `${shots}/viewer.png` });
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  log('VIEWER closed:', !(await page.evaluate(() => document.getElementById('viewer').open)));
  // detail views
  const before = bytes.three;
  for (const s of ['films-eevee', 'unity-cinematic', 'underwater-flood', 'sci-fi-doors', 'asset-optimization', 'vr-applications', 'environments-vfx']) {
    await page.evaluate((x) => (location.hash = '#/project/' + x), s);
    await page.waitForTimeout(1500);
    await page.click('[data-flow-toggle]');
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${shots}/d-${s}.png`, fullPage: true });
  }
  log('three loaded before door launch:', before);
  // 3D door
  await page.evaluate(() => (location.hash = '#/project/sci-fi-doors')); await page.waitForTimeout(1200);
  await page.click('[data-door-toggle]'); await page.waitForTimeout(900);
  log('CSS door status:', await page.textContent('[data-door-status]'));
  await page.click('[data-door-toggle]');
  await page.click('[data-door-launch]'); await page.waitForTimeout(2500);
  log('three loaded after launch:', bytes.three, 'canvas:', await page.locator('.door3d__canvas').count());
  await page.screenshot({ path: `${shots}/door3d-closed.png` });
  await page.click('.door3d__canvas'); await page.waitForTimeout(1500);
  await page.click('[data-door-dissolve]'); await page.waitForTimeout(2500);
  log('3D status:', await page.textContent('[data-door-status]'));
  await page.screenshot({ path: `${shots}/door3d-open-dissolve.png` });
  await page.evaluate(() => (location.hash = '#/')); await page.waitForTimeout(800);
  log('canvas after leaving:', await page.locator('.door3d__canvas').count());
});

await run('mobile', { width: 390, height: 844 }, async (page) => {
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${shots}/m-hero.png` });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  log('MOBILE horizontal overflow px:', ov);
  await page.evaluate(() => (location.hash = '#/project/asset-optimization')); await page.waitForTimeout(1500);
  log('MOBILE detail overflow px:', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await page.screenshot({ path: `${shots}/m-detail.png`, fullPage: true });
});

log('CONSOLE ERRORS:', errors.length ? errors : 'none');
await browser.close();
