/* Unit tests for drop sets (v0.10.4): a drop set must not steer the next load suggestion. */
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
const mkSes = (id, at, sets) => ({ id, startedAt: at, endedAt: at + 3600e3, items: [{ exId: 'bench-press', sig: 'P3|8|straight', sets }] });
const item = { exId: 'bench-press', method: 'P3', reps: '8', rpe: 8, rpeMax: 8, scheme: 'straight', sets: 3 };
const work = [{ kind: 'work', done: true, weight: '80', reps: '8', rpe: '7' }, { kind: 'work', done: true, weight: '80', reps: '8', rpe: '7' }];
sessions = [mkSes('a', T0, work)];
eq(C.suggest(item, { before: T0 + day, sig: 'P3|8|straight' }).why, 'up25', 'baseline: sets felt easy, load goes up');
sessions = [mkSes('b', T0, [...work, { kind: 'work', done: true, weight: '60', reps: '12', rpe: '10', drop: true }])];
eq(C.suggest(item, { before: T0 + day, sig: 'P3|8|straight' }).why, 'up25', 'a drop set at RPE 10 does not trigger a load cut');
sessions = [mkSes('c', T0, [...work, { kind: 'work', done: true, weight: '80', reps: '8', rpe: '10' }])];
eq(C.suggest(item, { before: T0 + day, sig: 'P3|8|straight' }).why, 'down25', 'the same RPE 10 on a normal set still cuts the load');

console.log(`dropset tests: ${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
