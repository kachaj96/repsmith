'use strict';
/* Repsmith runs: manual run log. Pure functions, no DOM.
   A run: { id, name, type, date, distM, paceSec, durS, hr, felt }. Distance in meters, pace in seconds per km, duration in seconds.
   type is a free key so more kinds (tempo, intervals with a segments list) can be added without a migration. */
(function () {
const LIM = { distMin: 100, distMax: 500000, paceMin: 120, paceMax: 1200, hrMin: 30, hrMax: 230, durMax: 24 * 3600 };
const TYPES = ['easy', 'long'];
const DAY = 864e5;
const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const int = v => { const s = String(v ?? '').trim(); return /^\d+$/.test(s) ? parseInt(s, 10) : null; };
const blank = v => String(v ?? '').trim() === '';

/* "10,5" in km or "10500" in m -> meters (whole), null when not a number */
function parseDist(str, unit) {
  const n = num(str);
  if (n == null || n <= 0) return null;
  return Math.round(unit === 'm' ? n : n * 1000);
}
const fmtKm = (m, sep = '.') => (Math.round(m / 10) / 100).toFixed(2).replace('.', sep);
const fmtPace = s => { s = Math.round(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const fmtDur = s => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`; };
const paceFromDur = (distM, durS) => Math.round(durS / (distM / 1000));
const durFromPace = (distM, paceSec) => Math.round(distM / 1000 * paceSec);
/* pace is rounded to whole seconds per km and watches round too, so allow a small gap */
const tolerance = (distM, durS) => Math.max(5, 0.5 * distM / 1000 + 0.005 * durS);

/* form strings -> run, or an error code.
   in: { name, type, date, unit, dist, pMin, pSec, tH, tM, tS, hr, felt }
   codes: dist, pace, time, need, mismatch, hr */
function build(i) {
  const distM = parseDist(i.dist, i.unit);
  if (distM == null || distM < LIM.distMin || distM > LIM.distMax) return { err: 'dist', min: LIM.distMin, max: LIM.distMax };
  let paceSec = null, durS = null;
  if (!blank(i.pMin) || !blank(i.pSec)) {
    const m = blank(i.pMin) ? 0 : int(i.pMin), s = blank(i.pSec) ? 0 : int(i.pSec);
    if (m == null || s == null || s > 59) return { err: 'pace', min: fmtPace(LIM.paceMin), max: fmtPace(LIM.paceMax) };
    paceSec = m * 60 + s;
    if (paceSec < LIM.paceMin || paceSec > LIM.paceMax) return { err: 'pace', min: fmtPace(LIM.paceMin), max: fmtPace(LIM.paceMax) };
  }
  if (!blank(i.tH) || !blank(i.tM) || !blank(i.tS)) {
    const h = blank(i.tH) ? 0 : int(i.tH), m = blank(i.tM) ? 0 : int(i.tM), s = blank(i.tS) ? 0 : int(i.tS);
    if (h == null || m == null || s == null || m > 59 || s > 59) return { err: 'time' };
    durS = h * 3600 + m * 60 + s;
    if (!(durS > 0) || durS > LIM.durMax) return { err: 'time' };
  }
  if (paceSec == null && durS == null) return { err: 'need' };
  if (paceSec != null && durS != null) {
    const expected = durFromPace(distM, paceSec);
    if (Math.abs(durS - expected) > tolerance(distM, expected)) return { err: 'mismatch', expected: fmtDur(expected), got: fmtDur(durS), pace: fmtPace(paceSec), km: fmtKm(distM) };
  } else if (durS != null) {
    paceSec = paceFromDur(distM, durS);
    if (paceSec < LIM.paceMin || paceSec > LIM.paceMax) return { err: 'mismatch', expected: null, got: fmtDur(durS), pace: fmtPace(paceSec), km: fmtKm(distM) };
  } else durS = durFromPace(distM, paceSec);
  let hr = null;
  if (!blank(i.hr)) { hr = int(i.hr); if (hr == null || hr < LIM.hrMin || hr > LIM.hrMax) return { err: 'hr', min: LIM.hrMin, max: LIM.hrMax }; }
  const felt = i.felt >= 1 && i.felt <= 10 ? Math.round(i.felt) : null;
  const type = TYPES.includes(i.type) ? i.type : 'easy';
  return { run: { name: String(i.name || '').trim().slice(0, 60), type, date: i.date, distM, paceSec, durS, hr, felt } };
}

/* live hint while typing: what pace or time the entered numbers imply (null = nothing to say yet) */
function hint(i) {
  const distM = parseDist(i.dist, i.unit);
  if (distM == null || distM < LIM.distMin) return null;
  const hasP = !blank(i.pMin) || !blank(i.pSec), hasT = !blank(i.tH) || !blank(i.tM) || !blank(i.tS);
  if (hasP && !hasT) { const m = int(blank(i.pMin) ? '0' : i.pMin), s = int(blank(i.pSec) ? '0' : i.pSec); if (m == null || s == null || s > 59) return null; const p = m * 60 + s; return p > 0 ? { time: fmtDur(durFromPace(distM, p)) } : null; }
  if (hasT && !hasP) { const h = int(blank(i.tH) ? '0' : i.tH), m = int(blank(i.tM) ? '0' : i.tM), s = int(blank(i.tS) ? '0' : i.tS); if (h == null || m == null || s == null || m > 59 || s > 59) return null; const d = h * 3600 + m * 60 + s; return d > 0 ? { pace: fmtPace(paceFromDur(distM, d)) } : null; }
  return null;
}

const mondayOf = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
const monthStartOf = ts => { const d = new Date(ts); return new Date(d.getFullYear(), d.getMonth(), 1).getTime(); };

/* totals, records and the last `weeks` weeks of distance (oldest first) */
function stats(runs, at, weeks = 12) {
  const wk0 = mondayOf(at), mo0 = monthStartOf(at);
  let weekM = 0, monthM = 0, totalM = 0, totalS = 0, longest = null, bestPace = null;
  const series = Array.from({ length: weeks }, (_, k) => { const d = new Date(wk0); d.setDate(d.getDate() - 7 * (weeks - 1 - k)); return { start: d.getTime(), distM: 0, n: 0 }; });
  for (const r of runs) {
    totalM += r.distM; totalS += r.durS || 0;
    if (r.date >= wk0) weekM += r.distM;
    if (r.date >= mo0) monthM += r.distM;
    if (!longest || r.distM > longest.distM) longest = r;
    if (r.distM >= 1000 && (!bestPace || r.paceSec < bestPace.paceSec)) bestPace = r;
    for (let k = series.length - 1; k >= 0; k--) if (r.date >= series[k].start) { series[k].distM += r.distM; series[k].n++; break; }
  }
  return { count: runs.length, weekM, monthM, totalM, totalS, longest, bestPace, series };
}

window.RepsmithRuns = { LIM, TYPES, DAY, parseDist, fmtKm, fmtPace, fmtDur, paceFromDur, durFromPace, tolerance, build, hint, stats, mondayOf };
})();
