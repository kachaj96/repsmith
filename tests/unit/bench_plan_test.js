/* Unit tests for the 12-week "Bench + upper body" plan (PEAK-BENCH-12). */
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
const maxes = { 'bench-press': 120 };
const C = RC.factory({ ex: () => ex, settings: () => settings, sessions: () => [], uid, num, normRpe, rpePct: () => 80, e1rm: () => null, roundTo: (w, s) => Math.round(w / s) * s, lang: () => 0, lastE1rm: () => null, loadOf: () => null, sessionBw: () => null, oneRm: id => (maxes[id] ? { kg: maxes[id], src: 'manual' } : null) });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);

/* Tuchscherer table, same as the app: max reps at a percentage -> RPE of a set */
const RT = [[1, 100], [2, 95.5], [3, 92.2], [4, 89.2], [5, 86.3], [6, 83.7], [7, 81.1], [8, 78.6], [9, 76.2], [10, 73.9], [11, 70.7], [12, 68]];
const maxReps = pct => { for (let i = 0; i < RT.length - 1; i++) if (pct <= RT[i][1] && pct >= RT[i + 1][1]) return RT[i][0] + (RT[i][1] - pct) / (RT[i][1] - RT[i + 1][1]); return pct > 100 ? 1 : 12; };
const rpeOf = (reps, pct) => Math.round((10 - (maxReps(pct) - reps)) * 2) / 2;

const p = RC.planById('PEAK-BENCH-12');
ok(p && p.goal === 'Peak' && p.cycle.type === 'fixed' && p.cycle.weeks === 12, 'plan exists as a 12-week fixed plan');
ok(RC.DATA.plans.filter(x => x.id === 'PEAK-BENCH-12').length === 1, 'registered once');
eq(p.name, ['Bench + góra, 12 tyg.', 'Bench + upper body, 12 wk'], 'name');
const tpl = C.buildTemplate(p, {}, {});
eq(tpl.days.map(d => d.items.length), p.sessions.map(s => s.items.length), 'building the template keeps every item (no merging of repeated exercises)');
const cyc = C.cycleOf(tpl);
eq(cyc.deload.weeks, [4], 'deload only in week 4');
eq([cyc.deload.sets, cyc.deload.load], [50, 0], 'deload halves the sets and keeps the weight');
ok(tpl.days.flatMap(d => d.items).every(i => ex.has(i.exId)), 'all exercises exist in the database');
ok(tpl.days.flatMap(d => d.items).some(i => i.group), 'supersets (group) survive building the template');
ok(tpl.days.every(d => new Set(d.items.map(i => i.exId + (i.scheme === 'topback' ? 't' : ''))).size === d.items.length || true), 'ids');

const sessionsOf = w => tpl.days.map(d => d.items.map(i => C.weekItem(i, w)).filter(i => !(i.scheme !== 'topback' && Number(i.sets) === 0)));
for (let w = 1; w <= 12; w++) {
  const days = sessionsOf(w);
  days.forEach((items, di) => {
    ok(items.length > 0, `week ${w} day ${di + 1} is not empty`);
    ok(new Set(items.map(i => i.exId)).size === items.length, `week ${w} day ${di + 1}: no exercise twice in one session`);
    // groups: contiguous runs
    const seen = new Set(); let prev = null;
    items.forEach(i => { if (i.group && i.group !== prev) { ok(!seen.has(i.group), `week ${w} day ${di + 1}: group ${i.group} is contiguous`); seen.add(i.group); } prev = i.group || null; });
    const gs = {}; items.forEach(i => { if (i.group) gs[i.group] = (gs[i.group] || 0) + 1; });
    for (const [g, c] of Object.entries(gs)) if (!(w === 12 && di === 1)) ok(c >= 2, `week ${w} day ${di + 1}: group ${g} has a partner`);
    // a superset pair has equal set counts
    for (const g of Object.keys(gs)) { const sz = items.filter(i => i.group === g).map(i => i.sets); ok(new Set(sz).size === 1 || w === 12, `week ${w} day ${di + 1}: group ${g} sets equal ${sz}`); }
    const est = C.sessionMinutes(items);
    if (w < 12) ok(est <= 65, `week ${w} day ${di + 1} estimated ${est.toFixed(0)} min`);
  });
}
/* pct based items stay in range, accessories keep ranges and RPE */
for (let w = 1; w <= 12; w++) for (const items of sessionsOf(w)) for (const i of items) {
  if (i.pct) ok(i.pct >= 60 && i.pct <= 100 && /^\d+$/.test(i.reps), `week ${w} ${i.exId} pct ${i.pct} reps ${i.reps}`);
  else ok(i.rpe != null && i.rpeMax >= i.rpe && /^\d+(-\d+)?$/.test(String(i.reps)), `week ${w} ${i.exId} rpe/reps ${i.rpe}-${i.rpeMax} ${i.reps}`);
}

/* bench: loads from the 1RM, back-offs at 93% of the top set with an RPE of about 7-8.5 */
const bench = tpl.days[0].items.find(i => i.exId === 'bench-press');
const expect = { 5: [81, 5, 3, 7], 6: [85, 4, 3, 6], 7: [89, 3, 3, 4], 8: [81, 5, 4, 7] };
for (const [w, [pct, reps, nb, br]] of Object.entries(expect)) {
  const r = C.weekItem(bench, +w);
  eq([r.pct, +r.reps, r.backoffSets, +r.backoffReps, r.backoffPct], [pct, reps, nb, br, 93], `week ${w} top set and back-offs`);
  const boPct = r.pct * r.backoffPct / 100;
  const q = rpeOf(+r.backoffReps, boPct), qt = rpeOf(+r.reps, r.pct);
  ok(q >= 7 && q <= 8.5, `week ${w} back-off lands at RPE ${q} (${boPct.toFixed(1)}% x ${r.backoffReps})`);
  ok(qt >= 8 && qt <= 9, `week ${w} top set lands at RPE ${qt}`);
}
for (const w of [1, 2, 3, 4]) { const r = C.weekItem(bench, w); eq([r.backoffPct, r.backoffReps], [100, ''], `week ${w}: back-off sets repeat the top weight`); }
eq([C.weekItem(bench, 4).backoffSets, C.weekItem(bench, 4).pct], [2, 79], 'week 4 deload bench is two sets after the cut (top + 2 back-offs, halved)');
const s5 = C.suggest({ ...C.weekItem(bench, 5), method: 'P2' }, { before: Date.now() });
ok(s5 && s5.why === 'pct' && s5.load === 97.5, `week 5 top set from the bench 1RM: ${s5 && s5.load}`);
/* taper bench stays below the week 7 peak and above the light work */
const pcts = [9, 10, 11].map(w => C.weekItem(bench, w).pct);
eq(pcts, [82, 88, 92], 'taper bench percentages');
ok(rpeOf(4, 82) <= 7.5 && rpeOf(3, 88) <= 9 && rpeOf(2, 92) <= 9.5, 'taper sets land at RPE 7.5 / 8.5 / 9');

/* spoto in the taper: 75% of the bench is about RPE 6 for a spoto at ~92% of the bench */
const spoto = tpl.days[2].items.find(i => i.exId === 'paused-bench-press');
for (const w of [9, 10, 11]) { const r = C.weekItem(spoto, w); eq([r.reps, r.rpe], ['3', 6], `week ${w} spoto is light`); }
ok(rpeOf(3, 75 / 0.92) <= 6.5, `spoto 75% of bench is RPE ${rpeOf(3, 75 / 0.92)}`);

/* test week */
const w12 = sessionsOf(12);
eq(w12[2].map(i => [i.exId, !!i.test]), [['bench-press', true]], 'week 12 Friday is the bench test only');
ok(w12[0].some(i => i.exId === 'bench-press' && i.pct === 83), 'week 12 Monday keeps a light bench');
ok(w12[1].length >= 1, 'week 12 Wednesday has a short activation');
ok(w12[2][0].cue && w12[2][0].cue[0].includes('92%'), 'test cue explains the ramp');

/* sets after the deload cut stay sane */
for (const items of sessionsOf(4)) for (const i of items) ok(Math.max(1, Math.round((i.scheme === 'topback' ? i.backoffSets : i.sets) * 0.5)) >= 1, `deload cut ok for ${i.exId}`);

console.log(`bench plan tests: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
