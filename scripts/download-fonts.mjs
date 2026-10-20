import https from 'https';
import fs from 'fs';
import path from 'path';

const fontsDir = path.resolve('public/fonts');
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

const cssUrl = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Plus+Jakarta+Sans:wght@500;700&family=Space+Grotesk:wght@600;700&display=swap';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        // Modern Chrome User-Agent to receive WOFF2 format
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching Google Fonts CSS...');
  const cssBuffer = await fetchUrl(cssUrl);
  const css = cssBuffer.toString('utf8');

  // Match @font-face blocks and extract font-family, weight, and url
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  let localCss = '';
  let count = 0;

  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);

    if (familyMatch && weightMatch && urlMatch) {
      count++;
      const family = familyMatch[1].trim().replace(/\s+/g, '');
      const weight = weightMatch[1].trim();
      const url = urlMatch[1];
      const filename = `${family}-${weight}.woff2`;
      const filePath = path.join(fontsDir, filename);

      console.log(`Downloading ${filename} from ${url}...`);
      const fontData = await fetchUrl(url);
      fs.writeFileSync(filePath, fontData);
      console.log(`Saved ${filename} (${(fontData.length / 1024).toFixed(1)} KB)`);

      // Construct local @font-face
      localCss += `@font-face {
  font-family: '${familyMatch[1].trim()}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url('/fonts/${filename}') format('woff2');
}\n`;
    }
  }

  fs.writeFileSync('src/fonts.css', localCss);
  console.log('Successfully created src/fonts.css with self-hosted WOFF2 fonts!');
}

run().catch(err => {
  console.error('Download fonts error:', err);
  process.exit(1);
});
