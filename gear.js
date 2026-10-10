'use strict';
/* Repsmith gear: which loads the lifter can actually put on the bar / pick from the rack.
   Pure functions, no DOM. Loads are always kilograms; lb plates are converted. */
(function () {
const LB = 0.45359237;
const PLATES = { kg: [25, 20, 15, 10, 5, 2.5, 1.25, 1, 0.5, 0.25], lb: [45, 35, 25, 10, 5, 2.5, 1.25] };
const BAR_CLASSES = ['BB', 'EZ', 'TRAP', 'SMITH', 'TBAR', 'LM'];
const LIST_CLASSES = ['DB', 'KB', 'MACH', 'CAB'];
const DEFAULT = () => ({
  unit: 'kg',
  plates: { kg: { 25: 4, 20: 4, 15: 4, 10: 4, 5: 4, 2.5: 4, 1.25: 4, 1: 0, 0.5: 0, 0.25: 0 }, lb: { 45: 4, 35: 2, 25: 2, 10: 2, 5: 2, 2.5: 2, 1.25: 0 } },
  bars: { BB: 20, EZ: 8, TRAP: 25, SMITH: 15, TBAR: 20, LM: 20 },
  lists: { DB: '', KB: '', MACH: '', CAB: '' },
});
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const r2 = x => Math.round(x * 100) / 100;

/* merge stored gear with defaults and clamp junk */
function norm(g) {
  const d = DEFAULT(); g = g || {};
  d.unit = g.unit === 'lb' ? 'lb' : 'kg';
  for (const u of ['kg', 'lb']) for (const p of PLATES[u]) {
    const v = g.plates && g.plates[u] && g.plates[u][p];
    const n = Math.round(num(v) ?? d.plates[u][p]); d.plates[u][p] = Math.min(10, Math.max(0, n));
  }
  for (const c of BAR_CLASSES) { const n = num(g.bars && g.bars[c]); if (n != null && n > 0 && n <= 60) d.bars[c] = r2(n); }
  for (const c of LIST_CLASSES) if (g.lists && typeof g.lists[c] === 'string') d.lists[c] = g.lists[c].slice(0, 400);
  return d;
}

/* "2-10/1, 12-40/2, 45" -> sorted unique list of loads */
function parseSpec(text) {
  const s = String(text || '').trim();
  if (!s) return { list: [], error: null };
  const out = new Set();
  for (const tok of s.split(/;|,\s+|\s+/).filter(Boolean)) {
    const m = tok.match(/^(\d+(?:[.,]\d+)?)(?:-(\d+(?:[.,]\d+)?)(?:\/(\d+(?:[.,]\d+)?))?)?$/);
    if (!m) return { list: [], error: tok };
    const a = num(m[1]);
    if (m[2] == null) { if (!(a > 0) || a > 1000) return { list: [], error: tok }; out.add(r2(a)); continue; }
    const b = num(m[2]), st = m[3] == null ? null : num(m[3]);
    if (st == null || !(st > 0) || !(a > 0) || b < a || b > 1000 || (b - a) / st > 400) return { list: [], error: tok };
    for (let v = a, i = 0; v <= b + 1e-9 && i <= 400; i++, v = a + i * st) out.add(r2(v));
  }
  return { list: [...out].sort((x, y) => x - y), error: null };
}

/* every per-side plate total the lifter can build (grams -> plates used, fewest plates) */
const _tab = new Map();
function table(g, unit) {
  const counts = g.plates[unit];
  const key = unit + JSON.stringify(counts);
  if (_tab.has(key)) return _tab.get(key);
  const f = unit === 'lb' ? LB : 1;
  const units = [];
  for (const p of PLATES[unit]) for (let i = 0; i < (counts[p] || 0); i++) units.push(p);
  const best = new Map([[0, []]]);
  for (const p of units) {
    const w = Math.round(p * f * 1000);
    for (const [sum, arr] of [...best.entries()]) {
      const ns = sum + w, cand = arr.concat(p);
      const cur = best.get(ns);
      if (!cur || cand.length < cur.length) best.set(ns, cand);
    }
  }
  const sorted = [...best.keys()].sort((a, b) => a - b);
  const t = { best, sorted };
  if (_tab.size > 30) _tab.clear();
  _tab.set(key, t);
  return t;
}
const hasPlates = (g, unit) => PLATES[unit].some(p => (g.plates[unit][p] || 0) > 0);

/* ascending list of loads (kg) for an equipment class, or null when nothing is configured */
function loadable(g, cls) {
  g = norm(g);
  if (BAR_CLASSES.includes(cls)) {
    if (!hasPlates(g, g.unit)) return null;
    const bar = g.bars[cls];
    const arr = table(g, g.unit).sorted.map(s => r2(bar + 2 * s / 1000));
    return arr.length > 1 ? arr : null;
  }
  if (LIST_CLASSES.includes(cls)) {
    const p = parseSpec(g.lists[cls]);
    return !p.error && p.list.length > 1 ? p.list : null;
  }
  return null;
}

/* nearest loadable weight; with `up` the result must be heavier than that load. null = no opinion */
function snap(g, cls, v, up) {
  const arr = loadable(g, cls);
  if (!arr || !(v > 0)) return null;
  if (v > arr[arr.length - 1] + 1e-9 || v < arr[0] - 1e-9) return null;
  let pool = arr;
  if (up != null) { pool = arr.filter(x => x > up + 1e-9); if (!pool.length) return null; }
  let best = pool[0];
  for (const x of pool) if (Math.abs(x - v) < Math.abs(best - v) - 1e-9) best = x;
  return best;
}

/* plate breakdown for a target total. unit picks the plate set (kg or lb). */
function plateCalc(g, barKg, targetKg, unit) {
  g = norm(g); unit = unit || g.unit;
  if (!hasPlates(g, unit)) return { none: true };
  const side = (targetKg - barKg) / 2;
  if (side < -1e-9) return { under: true, bar: barKg };
  const { best, sorted } = table(g, unit);
  const gm = Math.round(side * 1000);
  const f = unit === 'lb' ? LB : 1;
  const pick = s => ({ total: r2(barKg + 2 * s / 1000), plates: best.get(s).slice().sort((a, b) => b - a), side: s / 1000 });
  if (best.has(gm)) return { exact: true, chosen: pick(gm), unit, f };
  let lo = null, hi = null;
  for (const s of sorted) { if (s <= gm) lo = s; if (s >= gm && hi == null) hi = s; }
  const below = lo != null ? pick(lo) : null, above = hi != null ? pick(hi) : null;
  const chosen = below && above ? (gm - lo <= hi - gm ? below : above) : (below || above);
  return { exact: false, chosen, below, above, unit, f };
}

window.RepsmithGear = { DEFAULT, norm, parseSpec, loadable, snap, plateCalc, hasPlates, BAR_CLASSES, LIST_CLASSES, PLATES, LB };
})();
