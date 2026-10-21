import { chromium } from 'playwright-core';

async function checkLive() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to live GitHub Pages URL...');
  const res = await page.goto('https://hassenmtiri.github.io/TechnicalPortfolio/', { waitUntil: 'networkidle' });
  console.log('Response status:', res.status());
  
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'scratch-shots/live-github-pages.png' });
  console.log('Saved scratch-shots/live-github-pages.png');

  await browser.close();
}

checkLive().catch(console.error);
