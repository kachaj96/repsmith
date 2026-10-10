global.window = {};
require(require('path').join(__dirname,'..','..','plans.js')); require(require('path').join(__dirname,'..','..','coach.js'));
const C = window.RepsmithCoach;
const rows = require('fs').readFileSync(__dirname + '/fixture.csv', 'utf8').trim().split('\n').slice(1);
let bad = 0;
for (const r of rows) {
  const [g, d, t, l, plan, trim, addon, v1, v2] = r.split(',');
  const res = C.derive({ q1: g, q2: 'a2', q3: d, q4: t, q5: 'p2', q6: l, q7: 'e0', q8: 'q1', q10: 'r1', q11: 's2', q12: 'x1' });
  const got = [res.primary.id, res.trimmed ? String(res.cap) : '', res.addon ? String(res.addon) : '', res.variants[0] ? res.variants[0].plan.id : '', res.variants[1] ? res.variants[1].plan.id : ''];
  if (got.join() !== [plan, trim, addon, v1, v2].join()) { bad++; console.log('MISMATCH', r, got.join()); }
}
// worked examples from section 8
const ex = [
  [{ q1: 'g_strength', q2: 'a3', q3: 'd2', q4: 't1', q5: 'p2', q6: 'l1', q7: 'e0', q8: 'q1', q10: 'r1', q11: 's1', q12: 'x1' }, 'HEAVY-2', 'MIX-2,KEEP-2L', 0],
  [{ q1: 'g_size', q2: 'a2', q3: 'd3', q4: 't2', q5: 'p2', q6: 'l2', q7: 'e0', q8: 'q1', q10: 'r2', q11: 's3', q12: 'x1' }, 'SIZE-3', 'MIX-3,SIZE-2', 15],
  [{ q1: 'g_strength', q2: 'a0', q3: 'd4', q4: 't3', q5: 'p1', q6: 'l2', q7: 'e0', q8: 'q1', q10: 'r3', q11: 's2', q12: 'x1' }, 'START-4L', 'START-4,SIZE-4', 0],
  [{ q1: 'g_both', q2: 'a2', q3: 'd4', q4: 't2', q5: 'p2', q6: 'l1', q7: 'e2', q8: 'q1', q10: 'r2', q11: 's2', q12: 'x1' }, 'MIX-3', 'HEAVY-3,SIZE-3', 0],
  [{ q1: 'g_keep', q2: 'a3', q3: 'd3', q4: 't1', q5: 'p4', q6: 'l3', q7: 'e1', q8: 'q1', q10: 'r2', q11: 's2', q12: 'x2' }, 'KEEP-3L', 'KEEP-3,KEEP-2L', 0],
  [{ q1: 'g_strength', q2: 'a1', q3: 'd3', q4: 't2', q5: 'p2', q6: 'l2', q7: 'e0', q8: 'q3_db', q10: 'r2', q11: 's2', q12: 'x1' }, 'SIZE-3', 'MIX-3,SIZE-2', 15],
  [{ q1: 'g_both', q2: 'a1', q3: 'd3', q4: 't3', q5: 'p1', q6: 'l2', q7: 'e0', q8: 'q2', q10: 'r2', q11: 's2', q12: 'x1' }, 'START-3L', 'START-3,SIZE-3', 15],
  [{ q1: 'g_size', q2: 'a2', q3: 'd5', q4: 't1', q5: 'p2', q6: 'l2', q7: 'e0', q8: 'q1', q10: 'r2', q11: 's3', q12: 'x1' }, 'SIZE-5', 'MIX-5,SIZE-3', 0],
];
for (const [a, p, v, ad] of ex) { const r = C.derive(a); const g = [r.primary.id, r.variants.map(x => x.plan.id).join(','), r.addon]; if (g.join('|') !== [p, v, ad].join('|')) { bad++; console.log('EXAMPLE MISMATCH', p, g); } }
console.log('fixture rows', rows.length, 'examples', ex.length, 'bad', bad);
