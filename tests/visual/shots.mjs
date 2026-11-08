#!/usr/bin/env node
// Screenshots of the main Repsmith screens with data (Hevy history, a library plan, a running workout),
// light and dark, at 320/360/390/430/768 px, plus an overflow and nav check per screen.
// Usage: NODE_PATH=<node_modules with playwright> node tests/visual/shots.mjs <out dir>
import http from 'node:http';
import { readFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const out = process.argv[2] || '/tmp/repsmith-visual'; mkdirSync(out, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const srv = http.createServer((q, r) => { let f = join(root, decodeURIComponent(q.url.split('?')[0])); if (!existsSync(f) || statSync(f).isDirectory()) f = join(root, 'index.html'); r.setHeader('content-type', MIME[extname(f)] || 'application/octet-stream'); r.end(readFileSync(f)); }).listen(0);
const BASE = `http://127.0.0.1:${srv.address().port}/index.html`;
const WIDTHS = (process.env.WIDTHS || '320,360,390,430,768').split(',').map(Number);
const b = await chromium.launch();
let bad = 0;
for (const scheme of ['light', 'dark']) for (const w of WIDTHS) {
  const ctx = await b.newContext({ viewport: { width: w, height: w >= 700 ? 1024 : 844 }, colorScheme: scheme, locale: 'pl-PL' });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto(BASE); await p.waitForFunction(() => window.Repsmith && !document.getElementById('splash'), null, { timeout: 8000 }).catch(() => {});
  await p.evaluate(() => { const R = window.Repsmith; R.S.settings.seenIntro = true; R.render(); });
  const c = async s => { await p.locator(s).first().click(); await p.waitForTimeout(250); };
  // data: Hevy history and a library plan
  await c('button[data-a=settings]'); await p.evaluate(() => document.querySelectorAll('.sheet details').forEach(d => { d.open = true; }));
  await p.setInputFiles('#hevyfile', join(root, 'tests/fixtures/hevy_sample.csv')); await p.waitForSelector('.hv-r'); await c('button[data-a=hv-go]');
  await c('button[data-a=nav][data-v=plans]'); await c('button[data-a=nav][data-v=planlib]'); await c("button[data-a=plib-open][data-v='HEAVY-3']"); await c('button[data-a=plib-use]');
  const shot = async name => {
    await p.waitForTimeout(350);
    const a = await p.evaluate(() => {
      const on = document.querySelector('.nav button.on'), soft = getComputedStyle(document.documentElement).getPropertyValue('--accent-soft').trim();
      const brand = document.querySelector('.topbar .brand');
      return { over: document.documentElement.scrollWidth - innerWidth, navClip: [...document.querySelectorAll('.nav button')].filter(n => n.scrollWidth > n.clientWidth + 1).length,
        pill: !on || (on.getAttribute('aria-current') === 'page' && getComputedStyle(on).backgroundColor !== 'rgba(0, 0, 0, 0)'), brand: !!brand && brand.innerText.includes('Repsmith') && !!brand.querySelector('svg'), soft };
    });
    if (!a.pill) { bad++; console.log(`FAIL ${scheme} ${w} ${name}: active tab has no pill or aria-current`); }
    if (!['workout', 'dialog', 'settings'].includes(name) && !a.brand) { bad++; console.log(`FAIL ${scheme} ${w} ${name}: no brand lockup`); }
    if (a.over > 0 || a.navClip) { bad++; console.log(`FAIL ${scheme} ${w} ${name}: overflow ${a.over}px, clipped nav labels ${a.navClip}`); }
    await p.screenshot({ path: join(out, `${scheme}-${w}-${name}.png`), fullPage: w === 360 || w === 390 });
  };
  await c('button[data-a=nav][data-v=today]'); await shot('today');
  await c('button[data-a=nav][data-v=plans]'); await shot('plans');
  await c('button[data-a=nav][data-v=progress]'); await shot('progress');
  await c('button[data-a=nav][data-v=history]'); await shot('history');
  await c('button[data-a=nav][data-v=library]'); await shot('library');
  await c('button[data-a=settings]'); await shot('settings'); await c('button[data-a=sheet-close]');
  await c('button[data-a=nav][data-v=today]'); await c('button[data-a=start-day]'); await shot('dialog');
  await c('button[data-a=ready-pick][data-v=""]'); await shot('workout');
  if (errs.length) { bad++; console.log(`FAIL ${scheme} ${w}: page errors ${errs.slice(0, 2).join(' | ')}`); }
  await ctx.close();
}
await b.close(); srv.close();
console.log(`${bad ? 'FAIL' : 'ok'}: ${WIDTHS.length * 2 * 8} screenshots in ${out}, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
