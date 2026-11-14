/* Unit tests for the 4-week wave plan "Bench Priority (HARDSET)" (BENCH-PRIO-W4). The 120 kg base is a test value only. */
global.window = {};
const path = require('path');
require(path.join(__dirname, '..', '..', 'plans.js')); require(path.join(__dirname, '..', '..', 'blocks.js')); require(path.join(__dirname, '..', '..', 'coach.js'));
const data = require(path.join(__dirname, '..', '..', 'data/exercises.json'));
const RC = window.RepsmithCoach;
const ex = new Map(data.exercises.map(e => [e.id, { ...e, custom: false }]));
const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const normRpe = v => { const n = num(v); if (n == null || n < 1 || n > 10) return null; return Math.round(n * 2) / 2; };
const settings = { increment: 2.5, backoffPct: 90, deloadEvery: 5 };
let n = 0; const uid = () => 'id' + (++n);
const C = RC.factory({ ex: () => ex, settings: () => settings, sessions: () => [], uid, num, normRpe, rpePct: () => 80, e1rm: () => null, roundTo: (w, s) => Math.round(w / s) * s, lang: () => 0, lastE1rm: () => null, loadOf: () => null, sessionBw: () => null, oneRm: () => null });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);

const p = RC.planById('BENCH-PRIO-W4');
ok(p && p.cycle.type === 'fixed' && p.cycle.weeks === 4 && p.perWeek === 3, 'plan exists: 3 sessions, fixed 4-week cycle');
ok(RC.DATA.plans.filter(x => x.id === 'BENCH-PRIO-W4').length === 1, 'registered once');
eq(p.name, ['Bench Priority (HARDSET), fala 4 tyg.', 'Bench Priority (HARDSET), 4-week wave'], 'names');
ok(p.cycle.deload.mode === 'none', 'no deload from need: week 4 is lighter by calendar and only for the bench');
const tpl = C.buildTemplate(p, {}, {});
const items = tpl.days.flatMap(d => d.items);
ok(items.every(i => ex.has(i.exId)), 'all exercises exist');
ok(ex.has('machine-chest-supported-row') && ex.get('machine-chest-supported-row').name_en === 'Machine Chest-Supported Row', 'new exercise is spelled correctly');
eq(tpl.days.map(d => d.items.length), [5, 6, 6], 'items per session');
const nsets = it => (it.scheme === 'topback' ? 1 + it.backoffSets : it.sets);
eq(tpl.days.map(d => d.items.reduce((a, i) => a + nsets(i), 0)), [11, 12, 12], 'sets per session 11 / 12 / 12 (35 in total)');
ok(items.some(i => i.single && i.exId === 'reverse-lunge'), 'reverse lunge is a single row (both legs)');
ok(items.filter(i => i.wv).every(i => i.exId.includes('bench') && i.noprog), 'only the bench has wave loads and is left out of auto progression');
ok(items.filter(i => !i.wv).every(i => !i.noprog), 'accessories use the normal progression');

/* control example, WB = 120: round to 2.5 kg, loads as ranges */
const kg = (it, w) => { const r = C.wave(C.weekItem(it, w), { wb: 120, amrapPct: 82.5 }); return r; };
const [mon, wed, fri] = tpl.days.map(d => d.items[0]);
const rng = r => [r.lo, r.hi];
const want = {
  mon: [[[105, 107.5], [90, 92.5]], [[107.5, 110], [92.5, 97.5]], [[110, 112.5], [97.5, 102.5]], [[102.5, 105], [87.5, 92.5]]],
  wed: [[85, 90], [87.5, 92.5], [92.5, 95], [82.5, 87.5]],
  fri: [[87.5, 90], [90, 95], [100, 100], [85, 90]],
};
for (let w = 1; w <= 4; w++) {
  const m = kg(mon, w); eq([rng(m), rng(m.bo)], want.mon[w - 1], `Mon T${w} single and back-off`);
  eq(rng(kg(wed, w)), want.wed[w - 1], `Wed T${w}`);
  eq(rng(kg(fri, w)), want.fri[w - 1], `Fri T${w}`);
}
eq(rng(kg(fri, 3).bo), [87.5, 90], 'Fri T3: easy 1x4 after the AMRAP (72.5-75%)');
ok(kg(fri, 3).amrap && !kg(fri, 2).amrap, 'AMRAP only in week 3 on Friday');
eq(C.wave(C.weekItem(mon, 1), null), null, 'no base, no kilograms');
eq(C.wave(C.weekItem(fri, 3), { wb: 120, amrapPct: 85 }).lo, 102.5, 'AMRAP percentage is a parameter');

/* structure of the wave */
for (let w = 1; w <= 4; w++) {
  const m = C.weekItem(mon, w);
  eq([m.sets, +m.reps], [1, 1], `Mon T${w} is a single`);
}
eq([1, 2, 3, 4].map(w => +C.weekItem(mon, w).backoffReps), [5, 4, 3, 4], 'Mon back-off reps');
eq([1, 2, 3, 4].map(w => [C.weekItem(mon, w).rpe, C.weekItem(mon, w).rpeMax]), [[7, 7], [7.5, 7.5], [8, 8], [6, 7]], 'Mon single RPE');
eq([1, 2, 3, 4].map(w => [C.weekItem(wed, w).reps, C.weekItem(wed, w).rpe, C.weekItem(wed, w).rpeMax]), [['5', 6, 7], ['4', 6.5, 7.5], ['3', 7, 7.5], ['4', 6, 6]], 'Wed reps and RPE');
eq([1, 2, 3, 4].map(w => C.weekItem(fri, w).reps), ['6', '5', '4+', '5'], 'Fri reps (AMRAP in T3)');
eq(C.weekItem(fri, 3).rpe, 9, 'AMRAP @9');
for (let w = 1; w <= 4; w++) ok(items.filter(i => !i.wv).every(i => JSON.stringify(C.weekItem(i, w)) === JSON.stringify(i)), `accessories do not change in week ${w}`);
ok(C.weekItem(wed, 1).exId === 'paused-bench-press', 'Wednesday uses the paused bench');

/* time: the estimate is shown, never called verified */
tpl.days.forEach((d, di) => { const est = C.sessionMinutes(d.items.map(i => C.weekItem(i, 1))); ok(est > 20 && est < 90, `day ${di + 1} estimate ${est.toFixed(1)} min is sane`); });

/* wave base from a 1RM or an e1RM */
eq(C.waveBase('1rm', 122.4), 120, '1RM rounded down to 2.5');
eq(C.waveBase('1rm', 120), 120, '1RM exactly on the step');
eq(C.waveBase('e1rm', 123.3), 120, 'e1RM x 0.975 rounded down (120.2 -> 120)');
eq(C.waveBase('e1rm', 130), 125, 'e1RM 130 -> 126.75 -> 125');
eq(C.waveBase('1rm', 0), null, 'no weight, no base');
eq(C.waveBase('1rm', 123, 1.25), 122.5, 'step is a parameter');

/* new base after week 4 (rules 1-6) */
const cur = (kg, reps, e1, rpe = 9) => ({ kg, reps, rpe, e1 });
const sgl = { kg: 110, plannedKg: 110, rpe: 8, targetRpe: 8 };
eq(C.nextBase({ wb: 120, cur: cur(100, 5, 120), prev: null, single: sgl }).rule, 3, 'first cycle: base stays, a starting point');
eq(C.nextBase({ wb: 120, cur: cur(100, 5, 120), prev: null, single: sgl }).wb, 120, 'first cycle: base unchanged');
const up = C.nextBase({ wb: 120, cur: cur(100, 6, 123.3), prev: cur(100, 5, 120), single: sgl });
eq([up.wb, up.up, up.rule], [122.5, true, 2], 'spec example: 100x6 after 100x5, single confirms -> 122.5');
eq(C.nextBase({ wb: 120, cur: cur(100, 6, 123.3), prev: cur(100, 5, 120), single: sgl, step: 1.25 }).wb, 121.25, 'step is adjustable');
eq(C.nextBase({ wb: 120, cur: cur(100, 6, 123.3), prev: cur(100, 5, 120), single: { ...sgl, rpe: 9 } }).up, false, 'single above planned RPE: no raise');
eq(C.nextBase({ wb: 120, cur: cur(100, 6, 123.3), prev: cur(100, 5, 120), single: { ...sgl, kg: 105 } }).up, false, 'single lowered: no raise');
eq(C.nextBase({ wb: 120, cur: cur(100, 6, 123.3), prev: cur(100, 5, 120), single: null }).why, 'undecided', 'single missing: undecided');
eq(C.nextBase({ wb: 120, cur: cur(102.5, 5, 123), prev: cur(100, 5, 120), single: sgl }).up, false, 'e1RM +3.0 < 102.5/30 = 3.42: small change, no raise');
eq(C.nextBase({ wb: 120, cur: cur(102.5, 5, 123.5), prev: cur(100, 5, 120), single: sgl }).up, true, 'e1RM +3.5 >= 3.42 raises (weight changed, e1RM compared)');
eq(C.nextBase({ wb: 120, cur: cur(100, 5, 120), prev: cur(100, 5, 120), single: sgl }).rule, 4, 'small change: base stays');
const weak = C.nextBase({ wb: 120, cur: cur(100, 4, 116.7), prev: cur(100, 5, 120), single: sgl });
eq([weak.up, weak.rule, weak.wb], [false, 5, 120], 'weaker control set, stable single: base stays (rule 5)');
const weak2 = C.nextBase({ wb: 120, cur: cur(100, 4, 116.7), prev: { ...cur(100, 5, 120), weaker: true }, single: sgl });
eq([weak2.up, weak2.rule, weak2.wb], [false, 6, 120], 'weak twice: base stays (rule 6)');
eq(C.nextBase({ wb: 120, cur: cur(100, 4, 116.7), prev: cur(100, 5, 120), single: { ...sgl, kg: 105 } }).rule, 6, 'weaker set and a lowered single: rule 6');
eq(C.nextBase({ wb: 120, cur: cur(100, 6, 123.3), prev: cur(100, 5, 120), single: sgl, comparable: false }).why, 'undecided', 'not comparable: undecided, base stays');
eq(C.nextBase({ wb: 120, cur: null, prev: cur(100, 5, 120), single: sgl }).wb, 120, 'no control set: base stays');
for (const c of [cur(60, 1, 62), cur(100, 0, 100), cur(100, 12, 140)]) ok(C.nextBase({ wb: 120, cur: c, prev: cur(100, 5, 120), single: sgl }).wb >= 120, 'base never goes down by itself');

/* AMRAP outside 4-7 reps: hint about the control set weight in the next wave */
eq(C.amrapHint(8), { pct: 85, dir: 'up' }, '8 reps: heavier control set');
eq(C.amrapHint(3), { pct: 80, dir: 'down' }, '3 reps: lighter control set');
eq(C.amrapHint(5), null, '4-7 reps: no change');

console.log(`${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
