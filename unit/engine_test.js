/* Unit tests for coach.js: builder, swaps, trim, add-on, progression rules, flags, blocks. */
global.window = {};
require(require('path').join(__dirname,'..','..','plans.js')); require(require('path').join(__dirname,'..','..','coach.js'));
const data = require(require('path').join(__dirname,'..','..','data/exercises.json'));
const RC = window.RepsmithCoach;
const ex = new Map(data.exercises.map(e => [e.id, { ...e, custom: false }]));
const T = { 10: [100, 95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0], 9.5: [97.8, 93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7], 9: [95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3], 8.5: [93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0], 8: [92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3, 62.6], 7.5: [90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0, 61.3], 7: [89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3, 62.6, 59.9], 6.5: [87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0, 61.3, 58.6] };
const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const normRpe = v => { const n = num(v); if (n == null || n < 1 || n > 10) return null; return Math.round(n * 2) / 2; };
const rpePct = (reps, rpe) => { const r = Math.round(num(reps)); if (!(r >= 1 && r <= 12)) return null; let q = normRpe(rpe); if (q == null) q = 10; if (q < 6.5) q = 6.5; return T[q][r - 1]; };
const e1rm = (w, r, rpe) => { const p = rpePct(r, rpe); return p ? w / (p / 100) : null; };
let sessions = [];
const settings = { increment: 2.5, backoffPct: 90, deloadEvery: 5, regressPct: 5 };
let n = 0; const uid = () => 'id' + (++n);
const loadOf = (e, s) => { const w = num(s.weight); return w > 0 ? w : null; };
const lastE1rm = (exId, before) => {
  const pts = sessions.filter(s => s.startedAt < before).sort((a, b) => a.startedAt - b.startedAt).map(s => { const it = s.items.find(i => i.exId === exId); if (!it) return null; let b = null; for (const x of it.sets) if (x.done && x.kind !== 'warmup') { const v = e1rm(num(x.weight), num(x.reps), x.rpe); if (v && (!b || v > b)) b = v; } return b; }).filter(Boolean);
  return pts.length ? pts[pts.length - 1] : null;
};
const C = RC.factory({ ex: () => ex, settings: () => settings, sessions: () => sessions, uid, num, normRpe, rpePct, e1rm, roundTo: (w, s) => Math.round(w / s) * s, lang: () => 0, lastE1rm, loadOf, sessionBw: () => null });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
const plan = id => RC.planById(id);
const allEx = tpl => tpl.days.flatMap(d => d.items.map(i => i.exId));

/* ---- builder ---- */
let tpl = C.buildTemplate(plan('HEAVY-3'), {}, {});
eq(tpl.days.length, 3, 'HEAVY-3 days');
eq(tpl.days[0].items[0].method, 'P1', 'HEAVY-3 D1 squat is P1'); eq(tpl.days[0].items[0].backoffPct, 92, 'backoff 92%');
eq(tpl.days[0].items[0].rest, 210, 'main rest 210 s');
tpl = C.buildTemplate(plan('SIZE-3'), { q8: 'q3_db' }, {});
const eqOk = allEx(tpl).every(id => ['DB', 'BW', 'BAR', 'KB'].includes(ex.get(id).equipment));
ok(eqOk, 'dumbbell-only plan uses only DB/BW/BAR/KB: ' + allEx(tpl).filter(id => !['DB', 'BW', 'BAR', 'KB'].includes(ex.get(id).equipment)));
ok(allEx(tpl).includes('goblet-squat') && allEx(tpl).includes('pull-up') && allEx(tpl).includes('dumbbell-row'), 'DB swaps: goblet, pull-up, DB row');
tpl = C.buildTemplate(plan('HEAVY-4'), { q8: 'q2' }, {});
ok(allEx(tpl).every(id => !['MACH', 'CAB', 'SMITH'].includes(ex.get(id).equipment)), 'no-machine plan has no machines/cables: ' + allEx(tpl).filter(id => ['MACH', 'CAB'].includes(ex.get(id).equipment)));
tpl = C.buildTemplate(plan('HEAVY-4'), { q9: ['m1'] }, {});
ok(allEx(tpl).includes('trap-bar-deadlift') && !allEx(tpl).includes('deadlift') && !allEx(tpl).includes('romanian-deadlift'), 'm1: DL -> trap bar, RDL swapped');
ok(tpl.days.flatMap(d => d.items).filter(i => i.exId === 'squat').every(i => i.rpe <= 8), 'm1: squat RPE capped at 8');
tpl = C.buildTemplate(plan('SIZE-5XL'), { q9: ['m2'] }, {});
ok(!allEx(tpl).includes('dip') && !allEx(tpl).includes('overhead-press') && !allEx(tpl).includes('bench-press'), 'm2: dip removed, OHP and bench swapped');
tpl = C.buildTemplate(plan('SIZE-4'), { q9: ['m3'] }, {});
ok(!allEx(tpl).includes('leg-extension') && !allEx(tpl).includes('split-squat') && allEx(tpl).includes('box-squat'), 'm3: leg ext removed, split squat swapped, box squat in');
tpl = C.buildTemplate(plan('HEAVY-3'), {}, { effort: 'rir_cap' });
ok(tpl.days.flatMap(d => d.items).filter(i => i.kind === 'main').every(i => i.rpe == null || i.rpe <= 8), 'rir_cap caps main RPE at 8');
tpl = C.buildTemplate(plan('SIZE-5'), {}, { cap: 60 });
ok(tpl.days.every(d => C.sessionMinutes(d.items) <= 60), 'SIZE-5 trimmed to 60 min: ' + tpl.days.map(d => C.sessionMinutes(d.items)));
ok(tpl.days.every(d => d.items.some(i => i.kind !== 'iso')), 'trim keeps non-iso work');
tpl = C.buildTemplate(plan('SIZE-3'), {}, { addon: 15 });
ok(tpl.addon && !tpl.addon.dropped && tpl.days.filter(d => d.items.some(i => i.pack)).length === 2, 'Size-15 pack added to 2 sessions');
const tal = C.tallyDays(tpl.days, tpl.perWeek).muscles;
ok(Object.values(tal).every(v => v <= 20.01), 'pack keeps every muscle <= 20 weekly sets');
tpl = C.buildTemplate(plan('HEAVY-4'), {}, { addon: 30 });
const packDays = tpl.days.map((d, i) => d.items.some(x => x.pack) ? i : -1).filter(i => i >= 0);
ok(!tpl.addon.dropped ? packDays.length === 2 && Math.abs(packDays[0] - packDays[1]) !== 1 : true, 'Heavy-30 pack on non-consecutive days: ' + packDays + ' ' + JSON.stringify(tpl.addon));
tpl = C.buildTemplate(plan('START-3'), {}, {});
eq(tpl.perWeek, 3, 'START-3 runs 3x/week from 2 days');

/* ---- progression ---- */
const day = 864e5; let T0 = Date.UTC(2026, 0, 5);
const ses = (at, items) => ({ id: uid(), startedAt: at, endedAt: at + 3600e3, items });
const set = (kind, w, r, rpe) => ({ id: uid(), kind, weight: String(w), reps: String(r), rpe: rpe == null ? '' : String(rpe), done: true });
const sug = (it, opts = {}) => C.suggest(it, { before: T0 + 100 * day, ...opts });
const P1 = { exId: 'squat', method: 'P1', scheme: 'topback', reps: '3', rpe: 8.5, rpeMax: 8.5 };
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 3, 8.5), set('backoff', 130, 3)] }])];
eq(sug(P1).load, 145, 'P1 on target -> +5 (lower body)'); eq(sug(P1).why, 'up', 'P1 why up');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 3, 9.5)] }])];
eq(sug(P1).load, 140, 'P1 1 RPE above -> hold');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 2, 10)] }])];
eq(sug(P1).load, 132.5, 'P1 reps missed -> -5% (133 -> 132.5)');
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('top', 100, 3, 8)] }])];
eq(sug({ ...P1, exId: 'bench-press' }).load, 102.5, 'P1 upper body -> +2.5');
const P2 = { exId: 'squat', method: 'P2', scheme: 'straight', reps: '5', rpe: null, sets: 3 };
sessions = [ses(T0, [{ exId: 'squat', sets: [set('work', 100, 5), set('work', 100, 5), set('work', 100, 5)] }])];
eq(sug(P2).load, 105, 'P2 all reps -> +5');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('work', 100, 5), set('work', 100, 4), set('work', 100, 3)] }])];
eq([sug(P2).load, sug(P2).why], [100, 'retry'], 'P2 first fail -> retry same load');
sessions = [ses(T0 - 2 * day, [{ exId: 'squat', sets: [set('work', 100, 5), set('work', 100, 4)] }]), ses(T0, [{ exId: 'squat', sets: [set('work', 100, 5), set('work', 100, 3)] }])];
eq([sug(P2).load, sug(P2).why], [90, 'reset'], 'P2 two fails at same load -> 90%');
const P3 = { exId: 'bench-press', method: 'P3', scheme: 'straight', reps: '5', rpe: 7, sets: 3 };
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('work', 80, 5, 6), set('work', 80, 5, 6), set('work', 80, 5, 6)] }])];
eq(sug(P3).load, 82.5, 'P3 all 1 RPE easier -> +2.5% (82 -> 82.5)');
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('work', 80, 5, 7), set('work', 80, 5, 8)] }])];
eq(sug(P3).load, 77.5, 'P3 one set 1 RPE harder -> -2.5% (78 -> 77.5)');
const H1 = { exId: 'dumbbell-curl', method: 'H1', scheme: 'straight', reps: '10-12', rpe: 9, rpeMax: 9, sets: 2 };
sessions = [ses(T0, [{ exId: 'dumbbell-curl', sets: [set('work', 14, 12, 9), set('work', 14, 12, 8.5)] }])];
eq(sug(H1).load, 16.5, 'H1 top of range at target RIR -> +step (14 + 2.5 = 16.5)');
sessions = [ses(T0, [{ exId: 'dumbbell-curl', sets: [set('work', 14, 12, 9), set('work', 14, 10, 9)] }])];
eq([sug(H1).load, sug(H1).reps], [14, [12, 11]], 'H1 not all at top -> same load, +1 rep on weakest set');
sessions = [ses(T0, [{ exId: 'dumbbell-curl', sets: [set('work', 14, 12, 10), set('work', 14, 12, 10)] }])];
eq(sug(H1).why, 'reps', 'H1 top reps but RPE above max -> no load jump');
const H2 = { exId: 'dumbbell-lateral-raise', method: 'H2', scheme: 'straight', reps: '12-15', rpe: 9.5, rpeMax: 10, sets: 2 };
sessions = [ses(T0, [{ exId: 'dumbbell-lateral-raise', sets: [set('work', 10, 15, 8), set('work', 10, 15, 7.5)] }])];
eq(sug(H2).load, 12.5, 'H2 last set 2 RPE easier -> +step');
const P5 = { exId: 'deadlift', method: 'P5', scheme: 'topback', reps: '3', rpe: 8, rpeMax: 8 };
sessions = [ses(T0, [{ exId: 'deadlift', sets: [set('top', 180, 3, 7)] }])];
eq(sug(P5).load, 180, 'P5 one easy session -> hold');
sessions = [ses(T0 - 3 * day, [{ exId: 'deadlift', sets: [set('top', 180, 3, 7)] }]), ses(T0, [{ exId: 'deadlift', sets: [set('top', 180, 3, 7)] }])];
eq(sug(P5).load, 185, 'P5 two easy sessions -> +step');
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('top', 100, 3, 8)] }])];
const fx = sug({ ...P1, exId: 'bench-press', reps: '3', rpe: 8 }, { effort: 'fixed' });
eq([fx.why, fx.load], ['fixed', 100], 'fixed mode: load from e1RM (100x3@8 -> e1RM 115.9, 3@8 -> 100)');
sessions = [];
eq(sug(P1).why, 'first', 'no history -> first');
// same lift on different day types: history prefers the same signature
sessions = [ses(T0 - 3 * day, [{ exId: 'squat', sig: 'P1|3|topback', sets: [set('top', 150, 3, 8.5)] }]), ses(T0, [{ exId: 'squat', sig: 'P3|6|straight', sets: [set('work', 120, 6, 7)] }])];
eq(C.suggest(P1, { before: T0 + day, sig: 'P1|3|topback' }).load, 155, 'heavy day reads heavy-day history, not the volume day');

/* ---- flags ---- */
const sq = (at, w, r, rpe) => ses(at, [{ exId: 'squat', method: 'P1', kind: 'main', sets: [set('top', w, r, rpe)] }]);
sessions = [sq(T0, 140, 3, 8), sq(T0 + 3 * day, 140, 3, 8.5), sq(T0 + 6 * day, 140, 3, 8.5), sq(T0 + 9 * day, 140, 3, 9)];
let f = C.evaluate(sessions[3], []);
ok(f.some(x => x.type === 'stall'), 'stall: e1RM flat for 3 exposures');
sessions = [sq(T0, 140, 3, 8), sq(T0 + 3 * day, 130, 3, 9), sq(T0 + 6 * day, 128, 3, 9.5)];
f = C.evaluate(sessions[2], []);
ok(f.some(x => x.type === 'regression'), 'regression: two exposures >5% under 4-week best');
const two = (at, w1, r1, w2, r2) => ses(at, [{ exId: 'squat', sets: [set('work', w1, 5, r1)] }, { exId: 'bench-press', sets: [set('work', w2, 5, r2)] }]);
sessions = [two(T0, 100, 7, 80, 7), two(T0 + 3 * day, 100, 8, 80, 8)];
f = C.evaluate(sessions[1], []);
ok(f.some(x => x.type === 'fatigue'), 'fatigue: same load 1 RPE harder on 2 lifts');
const pr = ses(T0, [{ exId: 'squat', sets: [{ ...set('work', 150, 5, 6), pr: ['w'] }] }]);
sessions = [pr]; f = C.evaluate(pr, []);
ok(f.some(x => x.type === 'fake') && pr.items[0].sets[0].pend, 'fake progress: PR at RPE 6 flagged and held back');
const rd = ses(T0, [{ exId: 'squat', sets: [set('work', 100, 5, 8)] }]); rd.ready = 2; sessions = [rd];
ok(C.evaluate(rd, []).some(x => x.type === 'readiness'), 'readiness flag at score 2');

/* ---- blocks ---- */
const bt = type => ({ block: { start: T0, type } });
eq([1, 2, 3, 4, 5, 6].map(w => C.blockInfo(bt('Heavy'), T0 + (w - 1) * 7 * day + day).deload), [false, false, false, false, true, false], 'Heavy: deload every 5th week');
eq([1, 2, 3, 4, 5].map(w => C.blockInfo(bt('Size'), T0 + (w - 1) * 7 * day + day).ramp), [0, 1, 2, 3, 0], 'Size: ramp +1/+2/+3 sets in weeks 2-4');
eq(C.blockInfo(bt('Size'), T0 + 4 * 7 * day + day).cut, 0.45, 'Size deload cut 45%');
eq(C.blockInfo(bt('Start'), T0 + 30 * 7 * day).deload, false, 'Start: no planned deload');
const early = { block: { start: T0, type: 'Heavy', deloadUntil: T0 + 10 * day } };
eq(C.blockInfo(early, T0 + 2 * day).deload, true, 'early deload from flags');

/* ---- volume ---- */
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('work', 80, 8, 8), set('work', 80, 8, 5), { ...set('warmup', 40, 10), kind: 'warmup' }] }])];
const v = C.windowVolume(T0 - day, T0 + day);
eq([v.vol.CH, v.vol.TRI, v.all, v.easy], [1, 0.5, 2, 1], 'hard sets only (RPE 5 and warm-ups excluded), fractional secondary');
eq(['low', 'eff', 'work', 'high'], [C.zone(3, { floor: 4, eff: 10, work: 20 }), C.zone(8, { floor: 4, eff: 10, work: 20 }), C.zone(15, { floor: 4, eff: 10, work: 20 }), C.zone(22, { floor: 4, eff: 10, work: 20 })], 'zones');

console.log(`engine tests: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
