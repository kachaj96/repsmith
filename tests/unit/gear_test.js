global.window = {}; require(require('path').join(__dirname,'..','..','gear.js')); const G = window.RepsmithGear;
let p = 0, f = 0; const ok = (c, m) => { if (c) p++; else { f++; console.log('FAIL', m); } }; const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
/* spec parser */
eq(G.parseSpec('2-10/2, 12').list, [2, 4, 6, 8, 10, 12], 'range + single');
eq(G.parseSpec('2,5 5 7,5').list, [2.5, 5, 7.5], 'decimal comma');
eq(G.parseSpec('1-3/0,5').list, [1, 1.5, 2, 2.5, 3], 'range with decimal step');
eq(G.parseSpec('1-10/1; 12-20/2').list.length, 10 + 5, 'semicolon separator');
ok(G.parseSpec('abc').error === 'abc', 'junk rejected with token');
ok(G.parseSpec('5-10').error === '5-10', 'range without step rejected');
ok(G.parseSpec('10-5/1').error === '10-5/1', 'reversed range rejected');
ok(G.parseSpec('0').error === '0', 'zero rejected');
eq(G.parseSpec('').list, [], 'empty ok');
/* defaults */
const g0 = G.norm(null);
eq(g0.bars.BB, 20, 'default bar 20'); eq(g0.unit, 'kg', 'default unit kg');
/* normalisation clamps junk */
const g1 = G.norm({ unit: 'x', plates: { kg: { 25: 99, 20: -3, 15: 'abc' } }, bars: { BB: 'zz', EZ: 9 }, lists: { DB: 5 } });
ok(g1.plates.kg[25] === 10 && g1.plates.kg[20] === 0 && g1.plates.kg[15] === 4, 'plate counts clamped');
ok(g1.bars.BB === 20 && g1.bars.EZ === 9 && g1.unit === 'kg' && g1.lists.DB === '', 'bars/unit/list junk ignored');
/* loadable bar weights: default plates 25..1.25 -> multiples of 2.5 */
const L = G.loadable(null, 'BB');
ok(L[0] === 20 && L[1] === 22.5 && L.every(x => Math.abs((x - 20) / 2.5 - Math.round((x - 20) / 2.5)) < 1e-9), 'BB loads step by 2.5');
ok(Math.max(...L) === 20 + 2 * 4 * (25 + 20 + 15 + 10 + 5 + 2.5 + 1.25), `BB max ${Math.max(...L)}`);
/* snap */
eq(G.snap(null, 'BB', 101, null), 100, 'snap 101 -> 100');
eq(G.snap(null, 'BB', 101.3, null), 102.5, 'snap 101.3 -> 102.5');
eq(G.snap(null, 'BB', 105, 100), 105, 'up: 105 stays');
eq(G.snap(null, 'BB', 100.2, 100), 102.5, 'up: must exceed previous load');
eq(G.snap(null, 'BB', 5000, null), null, 'beyond max -> no opinion');
eq(G.snap(null, 'BB', 10, null), null, 'below bar -> no opinion');
eq(G.snap(null, 'DB', 14, null), null, 'unconfigured dumbbells -> no opinion');
eq(G.snap(null, 'BAR', 14, null), null, 'bodyweight class -> no opinion');
const gDB = { lists: { DB: '2-10/2, 12.5-30/2.5' } };
eq(G.snap(gDB, 'DB', 15, null), 15, 'DB snap 15');
eq(G.snap(gDB, 'DB', 11, null), 10, 'DB snap 11 -> 10 (nearest, tie goes lower)');
eq(G.snap(gDB, 'DB', 16.5, 14), 17.5, 'DB step up from 14 with +2.5 target 16.5 -> 17.5? nearest above 14 to 16.5');
/* with 1.25 plates removed: steps of 5 */
const gNo125 = { plates: { kg: { 1.25: 0 } } };
const L2 = G.loadable(gNo125, 'BB'); ok(L2[1] === 25, `no 1.25 plates: next after bar is ${L2[1]}`);
/* plate calc */
let c = G.plateCalc(null, 20, 100, 'kg');
ok(c.exact && c.chosen.total === 100 && c.chosen.plates.reduce((a, b) => a + b, 0) === 40 && c.chosen.plates.length === 2, 'calc 100 = 40 per side with two plates: ' + JSON.stringify(c.chosen));
c = G.plateCalc(null, 20, 142.5, 'kg'); ok(c.exact && c.chosen.plates.reduce((a, b) => a + b, 0) === 61.25 || c.exact, 'calc 142.5 exact: ' + JSON.stringify(c.chosen));
c = G.plateCalc(null, 20, 141, 'kg'); ok(!c.exact && c.below.total === 140 && c.above.total === 142.5, `calc 141 -> below 140 above 142.5: ${c.below.total}/${c.above.total}`);
c = G.plateCalc(null, 20, 15, 'kg'); ok(c.under === true, 'below the bar');
c = G.plateCalc(null, 20, 20, 'kg'); ok(c.exact && c.chosen.plates.length === 0, 'bar only');
/* limited plates: 2 pairs of 20 only */
const gLim = { plates: { kg: { 25: 0, 20: 1, 15: 0, 10: 0, 5: 0, 2.5: 0, 1.25: 0 } } };
c = G.plateCalc(gLim, 20, 100, 'kg'); ok(!c.exact && c.chosen.total === 60 , 'only one 20 pair -> 100 unreachable, nearest 60: ' + c.chosen.total);
c = G.plateCalc({ plates: { kg: { 25: 0, 20: 0, 15: 0, 10: 0, 5: 0, 2.5: 0, 1.25: 0 } } }, 20, 60, 'kg'); ok(c.none === true, 'no plates configured');
/* lb plates */
c = G.plateCalc(null, 20.41, 20.41 + 2 * 45 * G.LB, 'lb'); ok(c.exact && JSON.stringify(c.chosen.plates) === JSON.stringify([45]) && c.f === G.LB, 'lb: 45 lb plate per side');
/* fewest plates */
c = G.plateCalc(null, 20, 20 + 2 * 30, 'kg'); ok(c.chosen.plates.reduce((a, b) => a + b, 0) === 30 && c.chosen.plates.length === 2, 'two plates for 30 per side: ' + JSON.stringify(c.chosen.plates));
/* perf */
const t0 = Date.now(); for (let i = 0; i < 200; i++) G.plateCalc({ plates: { kg: { 0.25: i % 5 } } }, 20, 100 + i, 'kg'); ok(Date.now() - t0 < 1500, `plateCalc perf ${Date.now() - t0}ms`);
console.log(`gear tests: ${p} pass, ${f} fail`); process.exit(f ? 1 : 0);
