/* Unit tests for plan cycles (v0.8): fixed length, week counting, deload, week overrides, strength blocks. */
global.window = {};
const path = require('path');
require(path.join(__dirname, '..', '..', 'plans.js')); require(path.join(__dirname, '..', '..', 'blocks.js')); require(path.join(__dirname, '..', '..', 'coach.js'));
const data = require(path.join(__dirname, '..', '..', 'data/exercises.json'));
const RC = window.RepsmithCoach;
const ex = new Map(data.exercises.map(e => [e.id, { ...e, custom: false }]));
const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const normRpe = v => { const n = num(v); if (n == null || n < 1 || n > 10) return null; return Math.round(n * 2) / 2; };
let sessions = [];
const settings = { increment: 2.5, backoffPct: 90, deloadEvery: 5 };
let n = 0; const uid = () => 'id' + (++n);
const maxes = { squat: 200, 'bench-press': 120, deadlift: 220 };
const C = RC.factory({ ex: () => ex, settings: () => settings, sessions: () => sessions, uid, num, normRpe, rpePct: () => 80, e1rm: () => null, roundTo: (w, s) => Math.round(w / s) * s, lang: () => 0, lastE1rm: () => null, loadOf: () => null, sessionBw: () => null, oneRm: id => (maxes[id] ? { kg: maxes[id], src: 'manual' } : null) });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
const day = 864e5, T0 = Date.UTC(2026, 0, 5, 12);
const mk = (tplId, at, extra = {}) => ({ id: uid(), templateId: tplId, startedAt: at, endedAt: at + 3600e3, items: [], ...extra });

/* ---- no cycle: custom plan unchanged ---- */
eq(C.blockInfo({ id: 'x', days: [{ items: [] }] }), null, 'custom plan without cycle has no block info');

/* ---- fixed: weeks count finished training weeks, not calendar ---- */
const fx = { id: 'F', perWeek: 3, days: [{}, {}, {}], cycle: { type: 'fixed', weeks: 6, start: T0, deload: { mode: 'weeks', weeks: [3, 6], sets: 40, load: 10 } } };
sessions = [];
eq(C.blockInfo(fx, T0 + day).week, 1, 'fixed: week 1 at start');
sessions = [mk('F', T0 + day), mk('F', T0 + 2 * day)];
eq(C.blockInfo(fx, T0 + 60 * day).week, 1, 'fixed: 2 of 3 sessions done, still week 1 after a long break');
sessions.push(mk('F', T0 + 3 * day));
eq(C.blockInfo(fx, T0 + 4 * day).week, 2, 'fixed: third session completes week 1');
sessions.push(mk('other', T0 + 4 * day));
eq(C.blockInfo(fx, T0 + 5 * day).week, 2, 'sessions of another plan do not count');
for (let i = 0; i < 3; i++) sessions.push(mk('F', T0 + (5 + i) * day));
let bi = C.blockInfo(fx, T0 + 9 * day);
eq([bi.week, bi.deload, bi.cut, bi.loadCut], [3, true, 0.4, 0.1], 'fixed: week 3 is a listed deload, -40% sets, -10% load');
for (let i = 0; i < 12; i++) sessions.push(mk("F", T0 + (10 + i) * day));
bi = C.blockInfo(fx, T0 + 30 * day);
eq([bi.week, bi.finished, bi.deload], [6, true, false], 'fixed: past the last week = finished, no deload');
fx.cycle.shift = -1; bi = C.blockInfo(fx, T0 + 30 * day);
eq([bi.week, bi.finished, bi.deload], [6, false, true], 'manual shift moves back into week 6 (deload)');
fx.cycle.shift = 0;
sessions = sessions.filter(s => s.startedAt < T0);
fx.cycle.shift = 2; eq(C.blockInfo(fx, T0 + day).week, 3, 'shift forward');
fx.cycle.shift = 0;

/* ---- repeat with deload every N; deload none ---- */
const rp = { id: 'R', days: [{}], cycle: { type: 'repeat', start: T0, deload: { mode: 'every', every: 4, sets: 30, load: 0 } } };
eq([1, 2, 3, 4, 5, 8].map(w => C.blockInfo(rp, T0 + (w - 1) * 7 * day + day).deload), [false, false, false, true, false, true], 'repeat: deload every 4th calendar week');
eq(C.blockInfo(rp, T0 + 3 * 7 * day + day).cut, 0.3, 'repeat: custom set cut');
rp.cycle.deload.mode = 'weeks';
eq(C.cycleOf(rp).deload.mode, 'none', 'repeat plans cannot use listed weeks');
rp.cycle.deload.mode = 'none';
eq(C.blockInfo(rp, T0 + 20 * 7 * day).deload, false, 'deload none');
rp.cycle.deloadUntil = T0 + 30 * day;
eq(C.blockInfo(rp, T0 + 25 * day).deload, true, 'early deload works without planned deload');

/* ---- derived cycle for wizard plans keeps old behaviour ---- */
const wz = { id: 'W', block: { start: T0, type: 'Heavy' } };
const wc = C.cycleOf(wz);
eq([wc.type, wc.deload.mode, wc.deload.every, wc.deload.sets, wc.deload.load], ['repeat', 'every', 5, 40, 0], 'wizard plan: derived cycle, every 5 weeks, sets -40%, load unchanged');
wz.cycle = { type: 'repeat', start: T0, deload: { mode: 'every', every: 6, sets: 40, load: 10 } };
eq([1, 5, 6].map(w => C.blockInfo(wz, T0 + (w - 1) * 7 * day + day).deload), [false, false, true], 'wizard plan with its own cycle follows it');

/* ---- week overrides ---- */
const it = { id: 'a', exId: 'squat', scheme: 'straight', sets: 4, reps: '6', pct: 70, rpe: null, wk: { 2: { reps: '5', pct: 75 }, 3: { sets: 0 }, 4: { rpe: 8 } } };
eq(C.weekItem(it, 1), it, 'week without override = base item');
eq([C.weekItem(it, 2).sets, C.weekItem(it, 2).reps, C.weekItem(it, 2).pct], [4, '5', 75], 'override merges reps and pct, keeps sets');
eq(C.weekItem(it, 3).sets, 0, 'sets 0 marks a skipped week');
const w4 = C.weekItem(it, 4); eq([w4.rpe, w4.rpeMax, w4.pct], [8, 8, 70], 'RPE override fills rpeMax');
eq(C.weekItem({ exId: 'squat', rpe: 8, rpeMax: 9, wk: { 2: { pct: 80 } } }, 2).rpe, null, 'pct override clears RPE');

/* ---- deload weeks do not reset progression ---- */
sessions = [
  { id: 's1', startedAt: T0, items: [{ exId: 'leg-press', sig: 'P2|8|straight', sets: [{ kind: 'work', done: true, weight: '100', reps: '8' }, { kind: 'work', done: true, weight: '100', reps: '8' }] }] },
  { id: 's2', startedAt: T0 + 7 * day, week: { week: 4, deload: true }, items: [{ exId: 'leg-press', sig: 'P2|8|straight', sets: [{ kind: 'work', done: true, weight: '90', reps: '8' }] }] },
];
const sg = C.suggest({ exId: 'leg-press', method: 'P2', reps: '8', scheme: 'straight', sets: 2 }, { before: T0 + 14 * day });
eq(sg.load, 105, 'after a deload the next load builds on the last normal week (100 + step), not the deload load');

/* ---- strength blocks ---- */
for (const id of ['PEAK-4', 'PEAK-8', 'PEAK-12']) {
  const p = RC.planById(id);
  ok(p && p.goal === 'Peak' && p.cycle && p.cycle.type === 'fixed', id + ' exists as fixed plan');
  const tpl = C.buildTemplate(p, {}, {});
  ok(tpl.cycle && tpl.cycle.weeks === p.cycle.weeks && tpl.cycle.start > 0, id + ' template gets cycle with start');
  const all = tpl.days.flatMap(d => d.items);
  ok(all.every(i => ex.has(i.exId)), id + ' uses known exercises: ' + all.filter(i => !ex.has(i.exId)).map(i => i.exId));
  const mains = all.filter(i => i.kind === 'main');
  ok(mains.length >= 4 && mains.every(i => i.pct >= 50 && i.pct <= 100 && i.rpe == null), id + ' main lifts are % based');
  for (let w = 1; w <= p.cycle.weeks; w++) for (const m of mains) {
    const r = C.weekItem(m, w);
    if (!(r.pct >= 50 && r.pct <= 100 && r.sets >= 1 && r.sets <= 6 && /^\d+$/.test(r.reps))) ok(false, `${id} week ${w} ${m.exId}: ${JSON.stringify(r)}`);
  }
  // load comes from 1RM through the pct branch
  const sq = mains.find(i => i.exId === 'squat');
  const s = C.suggest({ ...C.weekItem(sq, 2), method: 'P2' }, { before: Date.now() });
  ok(s && s.why === 'pct' && s.load === Math.round(200 * C.weekItem(sq, 2).pct / 100 / 2.5) * 2.5, `${id} week 2 squat load from 1RM: ${s && s.load}`);
  ok(RC.DATA.plans.filter(x => x.id === id).length === 1, id + ' registered once');
}
// wizard never picks the blocks
ok(['Heavy', 'Size', 'Mix', 'Start', 'Keep'].every(g => { const pk = RC.DATA.plans.filter(p => p.goal === g); return pk.every(p => p.goal !== 'Peak'); }), 'Peak plans are separate from wizard goals');
const p12 = C.buildTemplate(RC.planById('PEAK-12'), {}, {});
const tw = p12.days.flatMap(d => d.items).map(i => C.weekItem(i, 12));
ok(tw.filter(i => i.test).map(i => i.exId).sort().join() === 'bench-press,deadlift,squat', 'PEAK-12 week 12 tests squat, bench, deadlift: ' + tw.filter(i => i.test).map(i => i.exId));
ok(tw.filter(i => i.kind !== 'main').every(i => i.sets === 0), 'PEAK-12 week 12 drops accessories');
eq(C.cycleOf(p12).deload.weeks, [4, 8], 'PEAK-12 deload weeks 4 and 8');
ok(p12.days.every(d => d.items.some(i => C.weekItem(i, 12).sets > 0)), 'no empty day in the test week');

console.log(`cycle tests: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
