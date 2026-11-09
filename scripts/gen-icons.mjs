#!/usr/bin/env node
// Writes the Repsmith logo files from scripts/brand.mjs: design/, icons/ (PWA), the in-app mark, the start screen art and the Android launcher icons.
// Needs playwright + chromium: NODE_PATH=<a node_modules with playwright> node scripts/gen-icons.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import { BRAND, PARTS, svgs, glyphMarkup, partMarkup, splashSvg } from './brand.mjs';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const res = join(root, 'android/app/src/main/res');
export const BG_LIGHT = '#F4F5F6', BG_DARK = '#0B0E11';
/* All geometry lives in scripts/brand.mjs (traced from the approved reference). This script only writes files. */
const px = (svgText, n) => svgText.replace('<svg ', `<svg width="${n}" height="${n}" `);
const legacy = n => px(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><g transform="translate(512 512) scale(.92) translate(-512 -512)"><rect width="1024" height="1024" rx="${BRAND.radius}" fill="${BRAND.tile}"/>${glyphMarkup()}</g></svg>`, n);
const parts = { legacy, round: n => px(svgs.round(), n), full: n => px(svgs.maskable(), n), glyph: n => px(svgs.foreground(), n), mono: n => px(svgs.monochrome(), n) };

mkdirSync(join(root, 'design'), { recursive: true });
const DESIGN = { 'logo.svg': svgs.logo(), 'logo-glyph.svg': svgs.glyph(), 'logo-mono.svg': svgs.mono(), 'logo-mark.svg': svgs.mark(),
  'logo-foreground.svg': svgs.foreground(), 'logo-background.svg': svgs.background(), 'logo-round.svg': svgs.round(), 'logo-maskable.svg': svgs.maskable() };
for (const [f, c] of Object.entries(DESIGN)) writeFileSync(join(root, 'design', f), c);
writeFileSync(join(root, 'icons/icon.svg'), svgs.logo());
// the in-app mark (app.js, I.tally) and the start screen (index.html) use the same geometry
const sub = (file, re, to) => { const f = join(root, file); const t = readFileSync(f, 'utf8'); if (!re.test(t)) throw new Error(`${file}: marker not found`); writeFileSync(f, t.replace(re, () => to)); };
const mark = `<svg viewBox="0 0 1024 1024" aria-hidden="true"><rect width="1024" height="1024" rx="${BRAND.radius}" fill="${BRAND.tile}"/>${PARTS.map(p => partMarkup(p)).join('')}</svg>`;
sub('app.js', /^  tally: '<svg[^\n]*',$/m, `  tally: '${mark}',`);
sub('index.html', /<!-- splash-art:start -->[\s\S]*?<!-- splash-art:end -->/, `<!-- splash-art:start -->${splashSvg()}<!-- splash-art:end -->`);

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
await png(parts.mono(512), 512, join(root, 'icons/monochrome-512.png'));

if (existsSync(res)) {
  const DENS = { mdpi: [48, 108], hdpi: [72, 162], xhdpi: [96, 216], xxhdpi: [144, 324], xxxhdpi: [192, 432] };
  for (const [d, [legacyPx, adaptivePx]] of Object.entries(DENS)) {
    const dir = join(res, `mipmap-${d}`); mkdirSync(dir, { recursive: true });
    await png(parts.legacy(legacyPx), legacyPx, join(dir, 'ic_launcher.png'));
    await png(parts.round(legacyPx), legacyPx, join(dir, 'ic_launcher_round.png'));
    await png(parts.glyph(adaptivePx), adaptivePx, join(dir, 'ic_launcher_foreground.png'));
    await png(parts.mono(adaptivePx), adaptivePx, join(dir, 'ic_launcher_monochrome.png'));
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
  writeFileSync(join(res, 'values/ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BRAND.tile}</color>\n</resources>\n`);
  const stock = join(res, 'drawable-v24/ic_launcher_foreground.xml'); if (existsSync(stock)) rmSync(stock);   // the stock Capacitor vector, not used by the adaptive icon
  await png(parts.legacy(512), 512, join(root, 'design/logo-512.png'));
  // native splash: a flat colour matching the theme and an empty system-splash icon; the web start screen draws the logo right after
  writeFileSync(join(res, 'drawable/splash_icon_empty.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">\n    <size android:width="1dp" android:height="1dp"/>\n    <solid android:color="#00000000"/>\n</shape>\n`);
  for (const d of readdirSync(res).filter(n => n.startsWith('drawable'))) { const f = join(res, d, 'splash.png'); if (existsSync(f)) rmSync(f); }
  writeFileSync(join(res, 'drawable/splash.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<color xmlns:android="http://schemas.android.com/apk/res/android" android:color="@color/splash_bg" />\n`);
  writeFileSync(join(res, 'values/colors_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="splash_bg">${BG_LIGHT}</color>\n</resources>\n`);
  mkdirSync(join(res, 'values-night'), { recursive: true });
  writeFileSync(join(res, 'values-night/colors_splash.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="splash_bg">${BG_DARK}</color>\n</resources>\n`);
}
await browser.close();
console.log('icons written');
