import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';

const server = spawn('npx', ['vite', 'preview', '--port', '4199'], { shell: true });

async function run() {
  await new Promise((r) => setTimeout(r, 2000));
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  console.log('--- 1. Testing Home & Hero ---');
  await page.goto('http://localhost:4199/#/');
  await page.waitForSelector('.hero__stage');

  const mainSrc = await page.$eval('.hero__main img', (el) => el.getAttribute('src'));
  const wireSrc = await page.$eval('.hero__wire', (el) => el.getAttribute('src'));
  const detailSrc = await page.$eval('.hero__detail img', (el) => el.getAttribute('src'));
  const badgeText = await page.$eval('.hero__badge-card', (el) => el.textContent.trim());

  console.log('Hero main src:', mainSrc);
  console.log('Hero wire src:', wireSrc);
  console.log('Hero detail src:', detailSrc);
  console.log('Hero badge text:', badgeText);

  if (!mainSrc.includes('hero-render.webp')) throw new Error('hero__main should be hero-render.webp');
  if (!wireSrc.includes('Hero-Wire.webp')) throw new Error('hero__wire should be Hero-Wire.webp');
  if (!detailSrc.includes('hero-detail.webp')) throw new Error('hero__detail should be hero-detail.webp');
  if (!badgeText.includes('Logo of AI Soft created in one week as test · 4MB WebGL ready')) throw new Error('Incorrect hero badge text');

  // Test mouse move causes badge to disappear
  await page.hover('.hero__stage');
  await page.waitForTimeout(400);
  const badgeOpacity = await page.$eval('.hero__badge-card', (el) => window.getComputedStyle(el).opacity);
  console.log('Hero badge opacity on hover:', badgeOpacity);
  if (badgeOpacity !== '0') throw new Error('Hero badge should disappear on hover/mouse move');

  console.log('--- 2. Testing Email in Contact Section ---');
  const mailtoHref = await page.$eval('.contact__mail', (el) => el.getAttribute('href'));
  console.log('Contact mailto:', mailtoHref);
  if (!mailtoHref.includes('hassenmtiri09@gmail.com')) throw new Error('Email should be hassenmtiri09@gmail.com');

  console.log('--- 3. Testing Sci-Fi Gun I0 in Detail Page ---');
  await page.click('a[href="#/project/scifi-gun"]');
  await page.waitForSelector('#detail:not([hidden])');
  const gunWf = await page.$eval('.dfilm__wfimg', (el) => el.getAttribute('src'));
  console.log('Sci-fi gun first workflow img:', gunWf);
  if (!gunWf.includes('i0.webp')) throw new Error('Sci-fi gun first workflow should be i0.webp');

  // Verify breakdown first item is I0
  const firstBd = await page.$eval('.bd__tabs button', (el) => el.textContent);
  console.log('First breakdown tab:', firstBd);
  if (!firstBd.includes('I0')) throw new Error('First breakdown tab should be I0');

  // Click "<- All work"
  console.log('Clicking "<- All work" button from Sci-Fi Gun...');
  await page.click('[data-back]');
  await page.waitForSelector('#home:not([hidden])');
  console.log('Successfully returned to home from Sci-Fi Gun!');

  console.log('--- 4. Testing Asset Optimization & Compare Slider ---');
  await page.click('a[href="#/project/asset-optimization"]');
  await page.waitForSelector('#detail:not([hidden])');
  console.log('Arrived at asset-optimization detail page');

  // Verify compare slider stats
  const statText = await page.$eval('.cmp__stats', (el) => el.textContent);
  console.log('Compare stats:', statText.replace(/\s+/g, ' '));
  if (!statText.includes('42,368 verts')) throw new Error('Stats should include 42,368 verts');
  if (!statText.includes('4,038 verts')) throw new Error('Stats should include 4,038 verts');
  if (!statText.includes('−93.5% TRIS')) throw new Error('Stats should include -93.5% TRIS');

  // Verify the 4 workflow steps order: 01 Original -> 02 Optimized -> 03 Original Rendered 45k -> 04 Optimized Rendered 4k
  const wfCaptions = await page.$$eval('.optflow figcaption .mono', (els) => els.map((e) => e.textContent.trim()));
  console.log('Opt flow captions:', wfCaptions);
  if (!wfCaptions[0]?.includes('01 · Original')) throw new Error('Step 1 should be 01 · Original');
  if (!wfCaptions[1]?.includes('02 · Optimized')) throw new Error('Step 2 should be 02 · Optimized');
  if (!wfCaptions[2]?.includes('03 · Original Rendered 45k')) throw new Error('Step 3 should be 03 · Original Rendered 45k');
  if (!wfCaptions[3]?.includes('04 · Optimized Rendered 4k')) throw new Error('Step 4 should be 04 · Optimized Rendered 4k');

  // Click "<- All work"
  console.log('Clicking "<- All work" button from Asset Optimization...');
  await page.click('[data-back]');
  await page.waitForSelector('#home:not([hidden])');
  const detailHidden = await page.$eval('#detail', (el) => el.hidden);
  console.log('Detail is hidden after clicking All work:', detailHidden);
  if (!detailHidden) throw new Error('Detail should be hidden after back click');

  console.log('--- 5. Testing VR Applications Attribution ---');
  await page.click('a[href="#/project/vr-applications"]');
  await page.waitForSelector('#detail:not([hidden])');
  const vrText = await page.$eval('.info', (el) => el.textContent);
  console.log('VR info contains DAZ attribution:', vrText.includes('DAZ'));
  if (!vrText.includes('DAZ')) throw new Error('VR details should mention DAZ starter base mesh');

  // Test back again from VR
  await page.click('[data-back]');
  await page.waitForSelector('#home:not([hidden])');
  console.log('Returned successfully from VR to home!');

  await browser.close();
  server.kill();
  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
}

run().catch((e) => {
  console.error('Test failed:', e);
  server.kill();
  process.exit(1);
});
