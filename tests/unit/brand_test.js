/* The Repsmith logo: one geometry (scripts/brand.mjs) drawn everywhere, the launcher assets are right, no trace of the old monoline tally. */
const fs = require('fs'), path = require('path'); const A = p => path.join(__dirname, '../..', p);
let P = 0, F = 0; const ok = (c, m) => { if (c) P++; else { F++; console.log('FAIL', m); } };
const png = p => { const b = fs.readFileSync(A(p)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
const read = p => fs.readFileSync(A(p), 'utf8');
const TILE = '#9C421D';
(async () => {
  const brand = await import('../../scripts/brand.mjs');
  const logo = read('design/logo.svg'), page = read('index.html'), app = read('app.js');
  ok(brand.PARTS.length === 4 && brand.PARTS.filter(p => p.id.startsWith('bar')).length === 3 && brand.PARTS[3].id === 'diag', 'three bars and one diagonal, the diagonal last');
  ok(logo.includes(TILE) && logo === read('icons/icon.svg'), 'the master logo is the PWA icon and uses the copper tile');
  for (const p of brand.PARTS) { ok(logo.includes(`d="${p.d}"`), `logo has ${p.id}`); ok(page.includes(`d="${p.d}"`), `start screen draws ${p.id}`); ok(app.includes(`d="${p.d}"`), `in-app mark draws ${p.id}`); }
  for (const f of ['index.html', 'app.js', 'design/logo.svg', 'icons/icon.svg']) { const t = read(f); ok(!t.includes('skewX(-9)') && !t.includes('M38 34v52') && !t.includes('M27 75l66-30'), `${f}: no trace of the old tally`); }
  ok(!read('design/logo-background.svg').includes('rx=') && !read('design/logo-foreground.svg').includes('<rect'), 'adaptive layers: a flat full-bleed background, a foreground with no tile (no second rounding)');
  ok(read('design/logo-mono.svg').includes('#000000') && !read('design/logo-mono.svg').includes('<rect'), 'monochrome: one colour, no background');
  // the symbol sits inside the adaptive safe zone: its bounding circle is at most 66 dp of the 108 dp canvas
  const [x0, y0, x1, y1] = brand.BBOX; const s = (1024 * 0.6) / Math.hypot(x1 - x0, y1 - y0);
  ok(Math.hypot(x1 - x0, y1 - y0) * s / 1024 * 108 <= 66, 'adaptive foreground: bounding circle within 66 dp');
  const DENS = { mdpi: [48, 108], hdpi: [72, 162], xhdpi: [96, 216], xxhdpi: [144, 324], xxxhdpi: [192, 432] };
  for (const [d, [l, a]] of Object.entries(DENS)) {
    for (const f of ['ic_launcher.png', 'ic_launcher_round.png']) ok(png(`android/app/src/main/res/mipmap-${d}/${f}`).join() === [l, l].join(), `${d}/${f} is ${l}px`);
    for (const f of ['ic_launcher_foreground.png', 'ic_launcher_monochrome.png']) ok(png(`android/app/src/main/res/mipmap-${d}/${f}`).join() === [a, a].join(), `${d}/${f} is ${a}px`);
  }
  ok(png('icons/icon-192.png')[0] === 192 && png('icons/icon-512.png')[0] === 512 && png('icons/maskable-512.png')[0] === 512 && png('icons/monochrome-512.png')[0] === 512, 'PWA icons have their sizes');
  ok(read('android/app/src/main/res/values/ic_launcher_background.xml').includes(TILE), 'the launcher background is the tile colour');
  const x = read('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml');
  ok(x.includes('@color/ic_launcher_background') && x.includes('@mipmap/ic_launcher_foreground') && x.includes('@mipmap/ic_launcher_monochrome'), 'adaptive icon: background, foreground, monochrome layer');
  ok(!fs.existsSync(A('android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml')), 'the stock Capacitor foreground is gone');
  const styles = read('android/app/src/main/res/values/styles.xml');
  ok(styles.includes('windowSplashScreenBackground') && styles.includes('splash_icon_empty'), 'Android 12+ system splash: background only, no icon');
  ok(read('android/app/src/main/res/values/colors_splash.xml').includes('#F4F5F6') && read('android/app/src/main/res/values-night/colors_splash.xml').includes('#0B0E11'), 'the system splash colours are the app backgrounds');
  console.log(`brand tests: ${P} pass, ${F} fail`); process.exit(F ? 1 : 0);
})();
