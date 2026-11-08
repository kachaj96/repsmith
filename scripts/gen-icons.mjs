#!/usr/bin/env node
// Repsmith logo in the Runsmith family construction: a 108 tile (radius 26), white monoline glyph, stroke 11, 9° lean.
// The glyph is the tally of reps from the first Repsmith icon. Writes icons/ (PWA) and the Android launcher icons.
// Needs playwright + chromium: NODE_PATH=<a node_modules with playwright> node scripts/gen-icons.mjs
import { writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = join(root, 'android/app/src/main/res');
export const ACCENT = '#A84B24', BG_LIGHT = '#F4F5F6', BG_DARK = '#0B0E11';
export const GLYPH_PATHS = ['M38 34v52', 'M60 34v52', 'M82 34v52', 'M27 75l66-30'];
const glyph = (k = 1, color = '#fff') => `<g transform="translate(54 54) scale(${k}) skewX(-9) translate(-54 -54) scale(.9)" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="11">${GLYPH_PATHS.map(d => `<path d="${d}"/>`).join('')}</g>`;
const svg = (inner, px) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" width="${px}" height="${px}">${inner}</svg>`;
const parts = {
  legacy: px => svg(`<rect width="108" height="108" rx="26" fill="${ACCENT}"/>${glyph()}`, px),
  round: px => svg(`<circle cx="54" cy="54" r="54" fill="${ACCENT}"/>${glyph()}`, px),
  full: px => svg(`<rect width="108" height="108" fill="${ACCENT}"/>${glyph(.8)}`, px),      // maskable: the mask keeps the middle ~80%
  glyph: px => svg(glyph(.8), px),                                                             // adaptive foreground and monochrome
};

writeFileSync(join(root, 'icons/icon.svg'), parts.legacy(108) + '\n');
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
async function png(markup, px, file) {
  await page.setViewportSize({ width: px, height: px });
  await page.setContent(`<style>html,body{margin:0;background:transparent}</style>${markup}`);
  writeFileSync(file, await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: px, height: px } }));
}
await png(parts.legacy(192), 192, join(root, 'icons/icon-192.png'));
await png(parts.legacy(512), 512, join(root, 'icons/icon-512.png'));
await png(parts.full(512), 512, join(root, 'icons/maskable-512.png'));
await png(parts.glyph(512), 512, join(root, 'icons/monochrome-512.png'));

if (existsSync(res)) {
  const DENS = { mdpi: [48, 108], hdpi: [72, 162], xhdpi: [96, 216], xxhdpi: [144, 324], xxxhdpi: [192, 432] };
  for (const [d, [legacyPx, adaptivePx]] of Object.entries(DENS)) {
    const dir = join(res, `mipmap-${d}`); mkdirSync(dir, { recursive: true });
    await png(parts.legacy(legacyPx), legacyPx, join(dir, 'ic_launcher.png'));
    await png(parts.round(legacyPx), legacyPx, join(dir, 'ic_launcher_round.png'));
    await png(parts.glyph(adaptivePx), adaptivePx, join(dir, 'ic_launcher_foreground.png'));
    await png(parts.glyph(adaptivePx), adaptivePx, join(dir, 'ic_launcher_monochrome.png'));
  }
  mkdirSync(join(res, 'mipmap-anydpi-v26'), { recursive: true });
  for (const name of ['ic_launcher', 'ic_launcher_round']) {
    writeFileSync(join(res, `mipmap-anydpi-v26/${name}.xml`), `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`);
  }
  writeFileSync(join(res, 'values/ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${ACCENT}</color>\n</resources>\n`);
  // native splash: a flat colour matching the theme; the web start screen draws the logo right after
  for (const d of readdirSync(res).filter(n => n.startsWith('drawable'))) { const f = join(res, d, 'splash.png'); if (existsSync(f)) rmSync(f); }
  writeFileSync(join(res, 'drawable/splash.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<color xmlns:android="http://schemas.android.com/apk/res/android" android:color="@color/splash_bg" />\n`);
  writeFileSync(join(res, 'values/colors_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="splash_bg">${BG_LIGHT}</color>\n</resources>\n`);
  mkdirSync(join(res, 'values-night'), { recursive: true });
  writeFileSync(join(res, 'values-night/colors_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="splash_bg">${BG_DARK}</color>\n</resources>\n`);
}
await browser.close();
console.log('icons written');
