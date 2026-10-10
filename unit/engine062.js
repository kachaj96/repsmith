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
const C = RC.factory({ ex: () => ex, settings: () => settings, sessions: () => sessions, uid, num, normRpe, rpePct, e1rm, roundTo: (w, s) => Math.round(w / s) * s, lang: () => 0, lastE1rm, loadOf, sessionBw: () => null, oneRm: (id, b) => maxes[id] ? { kg: maxes[id], src: "manual" } : (lastE1rm(id, b) ? { kg: lastE1rm(id, b), src: "app" } : null) });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('FAIL', m); } };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
const plan = id => RC.planById(id);
const day = 864e5; let T0 = Date.UTC(2026, 0, 5);
const ses = (at, items) => ({ id: uid(), startedAt: at, endedAt: at + 3600e3, items });
const set = (kind, w, r, rpe) => ({ id: uid(), kind, weight: String(w), reps: String(r), rpe: rpe == null ? '' : String(rpe), done: true });
const sug = (it, opts = {}) => C.suggest(it, { before: T0 + 100 * day, ...opts });
var maxes = {};
const P1 = { exId: 'squat', method: 'P1', scheme: 'topback', reps: '3', rpe: 8.5, rpeMax: 8.5 };
/* backwards compatible: fixed RPE behaves as before */
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 3, 8.5), set('backoff', 130, 3)] }])];
eq(sug(P1).load, 145, 'P1 fixed RPE on target -> +5');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 3, 9.5)] }])];
eq(sug(P1).why, 'hold', 'P1 fixed 1 over -> hold');
/* RPE range: inside the range is on target */
const P1r = { ...P1, rpe: 8, rpeMax: 9 };
eq(sug(P1r).why, 'hold', 'P1 range 8-9, got 9.5 (0.5 over top) -> hold');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 3, 9)] }])];
eq(sug(P1r).why, 'up', 'P1 range 8-9, got 9 -> up');
eq(sug(P1).why, 'hold', 'P1 fixed 8.5, got 9 -> hold (unchanged)');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('top', 140, 3, 11 - 0)] }])];
const P3r = { exId: 'bench-press', method: 'P3', scheme: 'straight', reps: '5', rpe: 7, rpeMax: 8, sets: 3 };
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('work', 80, 5, 7), set('work', 80, 5, 8)] }])];
eq(sug(P3r).why, 'holdP3', 'P3 range 7-8, set at 8 -> hold (fixed 7 would cut)');
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('work', 80, 5, 7), set('work', 80, 5, 9)] }])];
eq(sug(P3r).why, 'down25', 'P3 range 7-8, set at 9 -> -2.5%');
/* fixed effort mode with RPE range: lower end */
sessions = [ses(T0, [{ exId: 'bench-press', sets: [set('work', 100, 5, 8)] }])];
const fx = C.suggest({ exId: 'bench-press', method: 'P3', scheme: 'straight', reps: '5', rpe: 7, rpeMax: 8, sets: 3 }, { before: T0 + 100 * day, effort: 'fixed' });
const fx8 = C.suggest({ exId: 'bench-press', method: 'P3', scheme: 'straight', reps: '5', rpe: 8, rpeMax: 8, sets: 3 }, { before: T0 + 100 * day, effort: 'fixed' });
ok(fx.why === 'fixed' && fx.load < fx8.load, `fixed mode uses lower end of range: ${fx.load} < ${fx8.load}`);
/* AMRAP */
const AM = { exId: 'squat', method: 'P2', scheme: 'straight', reps: '5+', rpe: null, sets: 3 };
sessions = [];
eq(sug(AM).why, 'first', 'AMRAP no history -> first');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('work', 100, 5), set('work', 100, 6), set('work', 100, 8)] }])];
eq([sug(AM).load, sug(AM).why, sug(AM).d.best], [100, 'amrapOk', 8], 'AMRAP all >= 5 -> same load, no auto increase');
sessions = [ses(T0, [{ exId: 'squat', sets: [set('work', 100, 5), set('work', 100, 4)] }])];
eq([sug(AM).load, sug(AM).why], [100, 'amrapLow'], 'AMRAP below minimum -> same load, flagged low');
eq(C.range('5+'), { lo: 5, hi: 5 }, 'range parses 5+');
eq(C.methodOf({ exId: 'squat', scheme: 'straight', reps: '5+' }), 'P2', 'methodOf 5+ without RPE -> P2');
/* percent of 1RM */
const PC = { exId: 'squat', method: 'P2', scheme: 'straight', reps: '5', rpe: null, sets: 3, pct: 75 };
sessions = []; maxes = {};
eq([sug(PC).load, sug(PC).why], [null, 'pctNone'], 'pct without 1RM -> no load');
maxes = { squat: 160 };
eq([sug(PC).load, sug(PC).why, sug(PC).d.src], [120, 'pct', 'manual'], 'pct 75% of manual 160 -> 120');
eq(sug({ ...PC, pct: 72.5 }).load, 115, 'pct 72.5% of 160 = 116 -> rounded 115');
maxes = {};
sessions = [ses(T0, [{ exId: 'squat', sets: [set('work', 140, 3, 8.5)] }])];
const s3 = sug(PC); ok(s3.why === 'pct' && s3.d.src === 'app' && s3.load > 0, 'pct from app e1RM: ' + JSON.stringify(s3));
maxes = { squat: 200 };
eq(sug(PC).load, 150, 'manual 1RM wins over app e1RM');
eq(sug({ ...PC, scheme: 'topback', method: 'P1', reps: '3' }).load, 150, 'pct works for P1 top set');
eq(sug({ ...PC, reps: '5+' }).why, 'pct', 'pct + AMRAP -> pct load');
/* time model unchanged by targets */
eq(C.sessionMinutes([{ kind: 'main', scheme: 'straight', sets: 3, reps: '5+' }]), 10 + 13.5, 'time model ignores target format');
console.log(`engine 0.6.2 tests: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
