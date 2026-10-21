import { chromium } from 'playwright-core';

async function checkLiveDoors() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  
  console.log('Navigating to live GitHub Pages doors section...');
  await page.goto('https://hassenmtiri.github.io/TechnicalPortfolio/#/work', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('sci-fi-doors');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  
  await page.waitForTimeout(2500); // Wait for Three.js GLBs to load on CDN
  await page.screenshot({ path: 'scratch-shots/live-doors.png' });
  console.log('Saved scratch-shots/live-doors.png');

  await browser.close();
}

checkLiveDoors().catch(console.error);
