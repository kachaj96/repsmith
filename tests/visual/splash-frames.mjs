// Frames of the start animation: node tests/visual/splash-frames.mjs <webroot> <out dir> [light|dark]
// The animation is paused and moved to each time with the Web Animations API, so the frames are exact, not timer-dependent.
// Writes frame-<ms>.png and sheet-<theme>.png (a contact sheet).
import http from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const [webroot, out, theme = 'light'] = process.argv.slice(2);
if (!webroot || !out) { console.error('usage: splash-frames.mjs <webroot> <out> [light|dark]'); process.exit(2); }
mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const p = join(resolve(webroot), decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!existsSync(p)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }).end(readFileSync(p));
}).listen(0, '127.0.0.1');
await new Promise(r => server.on('listening', r));
const url = `http://127.0.0.1:${server.address().port}/`;
const TIMES = [0, 120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1400, 1600];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(url, { waitUntil: 'commit' });
await page.waitForSelector('#splash');
const files = [];
for (const t of TIMES) {
  await page.evaluate(ms => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; } }, t);
  await page.waitForTimeout(40);
  const f = join(out, `frame-${theme}-${String(t).padStart(4, '0')}.png`);
  await page.screenshot({ path: f, clip: { x: 0, y: 250, width: 390, height: 340 } });
  files.push([t, f]);
}
const sheet = await ctx.newPage();
await sheet.setViewportSize({ width: 390 * 4 + 50, height: 340 * 4 + 90 });
await sheet.setContent(`<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:10px;padding:10px;font:12px sans-serif">${files.map(([t, f]) => `<figure style="margin:0"><img src="data:image/png;base64,${readFileSync(f).toString('base64')}"><figcaption style="color:#fff">${t} ms</figcaption></figure>`).join('')}</body>`);
writeFileSync(join(out, `sheet-${theme}.png`), await sheet.screenshot({ fullPage: true }));
await browser.close(); server.close();
console.log(`frames written to ${out}`);
