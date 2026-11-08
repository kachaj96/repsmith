/* Smith icon set: the names both apps share are drawn with the same paths (smith-design-system-v1/smith-icons.json), one stroke. */
const fs = require('fs'), path = require('path'); const A = p => path.join(__dirname, '../..', p);
let P = 0, F = 0; const ok = (c, m) => { if (c) P++; else { F++; console.log('FAIL', m); } };
const set = JSON.parse(fs.readFileSync(A('smith-design-system-v1/smith-icons.json'), 'utf8')).icons;
const app = fs.readFileSync(A('app.js'), 'utf8');
const blk = app.slice(app.indexOf('const I = {'), app.indexOf('\n};', app.indexOf('const I = {')));
const line = k => (blk.match(new RegExp(`^  ${k}: '([^\\n]*)',$`, 'm')) || [])[1] || '';
const MAP = { home: 'today', list: 'plan', chart: 'progress', gear: 'settings', cal: 'calendar', left: 'back', x: 'close', plus: 'plus', hist: 'history', dumbbell: 'dumbbell' };
for (const [own, fam] of Object.entries(MAP)) ok(line(own).includes(set[fam]) && line(own).includes('stroke-width="2"'), `I.${own} draws the family "${fam}" icon with stroke 2`);
ok(line('more').includes(set.more.replace(/ fill="currentColor" stroke="none"/g, '')), 'I.more draws the family dots');
ok(!/stroke-width="1\.8"/.test(blk), 'no icon keeps the old 1.8 stroke');
console.log(`smith icon tests: ${P} pass, ${F} fail`); process.exit(F ? 1 : 0);
