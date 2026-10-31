/* AR-1: one version everywhere, everything the app loads is shipped by the service worker, no external hosts. */
const fs = require('fs'), path = require('path'); const A = p => path.join(__dirname, '../..', p);
let P = 0, F = 0; const ok = (c, m) => { if (c) P++; else { F++; console.log('FAIL', m); } };
const app = fs.readFileSync(A('app.js'), 'utf8'), sw = fs.readFileSync(A('sw.js'), 'utf8'), readme = fs.readFileSync(A('README.md'), 'utf8'), html = fs.readFileSync(A('index.html'), 'utf8'), css = fs.readFileSync(A('app.css'), 'utf8');
const v = (app.match(/const VERSION = '([^']+)'/) || [])[1], cache = (sw.match(/const CACHE = 'repsmith-v([^']+)'/) || [])[1], rd = (readme.match(/^# Repsmith v(\S+)/m) || [])[1];
ok(v && v === cache && v === rd, `VERSION ${v}, sw CACHE ${cache}, README ${rd} must match`);
const shell = (sw.match(/const SHELL = \[([\s\S]*?)\];/) || [])[1] || ''; const inShell = f => shell.includes(`'${f}'`);
for (const m of html.matchAll(/<script src="([^"]+)"/g)) ok(inShell(m[1]), `script ${m[1]} is in SHELL`);
ok(inShell('app.css') && inShell('index.html') && inShell('data/exercises.json'), 'core files in SHELL');
const fonts = [...css.matchAll(/url\("(fonts\/[^"]+)"\)/g)].map(m => m[1]);
ok(fonts.length >= 10, `font files referenced: ${fonts.length}`);
for (const f of fonts) { ok(fs.existsSync(A(f)), `${f} exists`); ok(inShell(f), `${f} in SHELL`); }
ok(!/https?:\/\//.test(html.replace(/https?:\/\/www\.w3\.org[^"']*/g, '')), 'index.html has no external URL');
ok(!/url\(\s*["']?https?:/.test(css) && !/@import/.test(css), 'app.css loads nothing external');
ok(fs.existsSync(A('fonts/OFL-LICENSE.txt')), 'font licence shipped');
console.log(`version tests: ${P} pass, ${F} fail`); process.exit(F ? 1 : 0);
