/* Repsmith coach: plan selector, plan builder, progression engine, volume tallies and flags.
   Rules follow training-progression-blueprint.md, volume-training-blueprint.md and repsmith-plans-and-selector.md.
   Thresholds marked (D) in those files are conventions; the app exposes the main ones as settings. */
(() => {
'use strict';
const DATA = window.REPSMITH_PLANS;

/* ---------- time model (plans file 2.3) ---------- */
const PER_SET = { main: 4.5, comp: 3.5, iso: 2.5 };
const CAPS = { t1: 60, t2: 75, t3: 90, t4: 120 };
const TRIM_ALLOWANCE = 8;
const GOAL_OF = { g_strength: 'Heavy', g_size: 'Size', g_both: 'Mix', g_new: 'Start', g_keep: 'Keep' };
const nsets = e => (e.scheme === 'topback' ? 1 + (e.backoffSets || 0) : e.sets || 0);
const sessionMinutes = items => (items.some(e => e.kind === 'main') ? 10 : 8) + items.reduce((a, e, i) => {
  const per = PER_SET[e.kind] || PER_SET.comp;
  const linked = e.group && items[i + 1] && items[i + 1].group === e.group; // no rest before the next exercise of a superset
  return a + nsets(e) * (linked ? Math.max(1, per - Math.min(per - 1, (e.rest || 90) / 60)) : per);
}, 0);
const estMax = p => Math.max(...p.sessions.map(s => sessionMinutes(s.items)));
const planById = id => DATA.plans.find(p => p.id === id) || null;

/* ---------- selector (plans file 5.2, validated against the 240-row fixture) ---------- */
function fits(p, d, cap) { return p.days <= d && cap >= p.reqCap && estMax(p) <= cap + TRIM_ALLOWANCE; }
function pick(goal, d, cap, below) {
  let c = DATA.plans.filter(p => p.goal === goal && fits(p, d, cap));
  if (below) c = c.filter(p => p.days < below.days || (p.days === below.days && estMax(p) < estMax(below)));
  if (!c.length) return null;
  return c.reduce((best, p) => (p.days > best.days || (p.days === best.days && estMax(p) > estMax(best)) ? p : best));
}
function derive(a) {
  const notes = [];
  let goal = GOAL_OF[a.q1];
  const age = a.q2, prog = a.q5;
  if (a.q8 === 'q3_db') { if (goal !== 'Size') notes.push('DB_ONLY'); goal = 'Size'; }
  else if (age === 'a0' && (goal === 'Heavy' || goal === 'Mix')) { goal = 'Start'; notes.push('NOVICE'); }
  else if (age === 'a1' && (goal === 'Heavy' || goal === 'Mix')) { goal = prog === 'p1' ? 'Start' : 'Mix'; notes.push(prog === 'p1' ? 'EARLY_P1' : 'EARLY_MIX'); }
  let load = { l1: 1, l2: 2, l3: 3 }[a.q6] || 1;
  if (a.q7 === 'e2') load = 3; else if (a.q7 === 'e1') load = Math.max(load, 2);
  let d = +String(a.q3 || 'd3').slice(1); let cap = CAPS[a.q4] || 60;
  if (load === 3) { d = Math.min(d, 3); cap = Math.min(cap, 75); notes.push('LOAD_HIGH'); }
  if (prog === 'p3') notes.push('STALL_ENTRY');
  const prim = pick(goal, d, cap);
  const sib = g => pick(g, d, cap);
  const down = pick(goal, d, cap, prim);
  let pool;
  if (goal === 'Heavy') pool = [[sib('Mix'), 'MIX'], [down, 'DOWN'], [sib('Keep'), 'KEEP']];
  else if (goal === 'Size') pool = [[sib('Mix'), 'MIX'], [down, 'DOWN'], [sib('Start'), 'START']];
  else if (goal === 'Mix') { pool = a.q11 === 's3' ? [[sib('Size'), 'SIZE'], [sib('Heavy'), 'HEAVY']] : [[sib('Heavy'), 'HEAVY'], [sib('Size'), 'SIZE']]; pool.push([down, 'DOWN']); }
  else if (goal === 'Start') pool = [[down, 'DOWN'], [sib('Size'), 'SIZE'], [sib('Mix'), 'MIX']];
  else {
    const alts = DATA.plans.filter(p => p.goal === 'Keep' && p.id !== prim.id && fits(p, d, cap))
      .sort((x, y) => Math.abs(x.days - prim.days) - Math.abs(y.days - prim.days) || estMax(y) - estMax(x));
    pool = [...alts.map(x => [x, 'KEEPALT']), [sib('Mix'), 'MIX'], [sib('Heavy'), 'HEAVY']];
  }
  const variants = [];
  for (const [p, role] of pool) {
    if (p && p.id !== prim.id && !variants.some(v => v.plan.id === p.id)) variants.push({ plan: p, role });
    if (variants.length === 2) break;
  }
  const spare = cap - estMax(prim);
  let addon = 0;
  if (a.q12 === 'x1' && goal !== 'Keep' && load < 3 && !prim.id.endsWith('XL')) addon = spare >= 30 ? 30 : spare >= 15 ? 15 : 0;
  const effort = { r1: 'rir', r2: 'rir_cap', r3: 'fixed' }[a.q10] || 'rir';
  return { goal, d, cap, load, primary: prim, variants, addon, effort, trimmed: estMax(prim) > cap, notes };
}

/* ---------- plan builder ---------- */
function factory(H) {
  /* H: { ex: () => Map, settings: () => settings, sessions: () => [], uid, num, normRpe, rpePct, roundTo, lang: () => 0|1 } */
  const EX = id => H.ex().get(id);
  const allowedEq = q8 => (DATA.equip[q8] ? new Set(DATA.equip[q8]) : null);
  const okEq = (id, allow) => { const e = EX(id); return !!e && (!allow || allow.has(e.equipment)); };

  /* replacement for an exercise the user cannot do: same pattern + shared main muscle, allowed equipment */
  function fallback(id, allow) {
    const e = EX(id); if (!e) return null;
    const prim = new Set(e.primary);
    const cands = [...H.ex().values()].filter(c => !c.hidden && !c.custom && c.id !== id && (!allow || allow.has(c.equipment)) && c.logging === e.logging);
    const score = c => (c.pattern === e.pattern ? 5 : 0) + c.primary.filter(m => prim.has(m)).length * 2 + (c.type === e.type ? 1 : 0) + (c.unilateral === e.unilateral ? 0.5 : 0);
    const best = cands.filter(c => c.primary.some(m => prim.has(m))).sort((x, y) => score(y) - score(x))[0];
    return best ? best.id : null;
  }
  /* equipment swaps, limitation swaps, dedupe. items: plan entries (mutated copies) */
  function adapt(items, a) {
    const allow = allowedEq(a.q8);
    const map = a.q8 === 'q2' ? DATA.swapQ2 : a.q8 === 'q3_db' ? DATA.swapDB : {};
    let out = [];
    for (const it0 of items) {
      const it = { ...it0 };
      const m = map[it.exId];
      if (m && m.startsWith('X')) {
        const into = m.split(':')[1];
        if (into) { const host = out.find(x => x.exId === into) || items.find(x => x.exId === into && x !== it0); if (host && out.includes(host)) { host.sets += it.sets; continue; } it.exId = into; } else continue;
      } else if (m) it.exId = m;
      if (!okEq(it.exId, allow)) { const f = fallback(it.exId, allow); if (!f) continue; it.exId = f; }
      out.push(it);
    }
    const lim = (a.q9 || []).filter(x => DATA.limit[x]);
    for (const k of lim) {
      const L = DATA.limit[k];
      out = out.filter(it => {
        const cands = L.swap[it.exId];
        if (cands) {
          if (cands[0] === 'X') return false;
          const c = cands.find(x => okEq(x, allow));
          if (c) it.exId = c;
        }
        if (L.rpeCap && L.rpeCap.ids.includes(it.exId) && it.rpe != null) { it.rpe = Math.min(it.rpe, L.rpeCap.max); it.rpeMax = Math.min(it.rpeMax ?? it.rpe, L.rpeCap.max); }
        if (L.cue && L.cue[it.exId]) it.cue = L.cue[it.exId];
        return true;
      });
    }
    // same exercise twice in one session after swaps: keep the first, add sets
    const seen = new Map(); const res = [];
    for (const it of out) {
      const prev = seen.get(it.exId);
      if (prev && prev.scheme === 'straight' && it.scheme === 'straight') { prev.sets += it.sets; continue; }
      if (prev) continue;
      seen.set(it.exId, it); res.push(it);
    }
    return res;
  }
  function trim(items, cap) {
    const ents = items.map(e => ({ ...e }));
    while (sessionMinutes(ents) > cap) {
      let i = -1; for (let k = ents.length - 1; k >= 0; k--) if (ents[k].kind === 'iso') { i = k; break; }
      if (i >= 0) { ents.splice(i, 1); continue; }
      let j = -1; for (let k = ents.length - 1; k >= 0; k--) if (ents[k].kind === 'comp' && ents[k].sets > 2) { j = k; break; }
      if (j >= 0) { ents[j].sets -= 1; continue; }
      break;
    }
    return ents;
  }
  /* weekly fractional sets per muscle and direct sets per main lift for a set of sessions */
  function tallyDays(days, perWeek) {
    const f = days.length ? (perWeek || days.length) / days.length : 1;
    const muscles = {}, lifts = {}, perSession = [];
    for (const d of days) {
      const sm = {}, sl = {};
      for (const it of d.items) {
        const e = EX(it.exId); if (!e) continue;
        const n = nsets(it);
        e.primary.forEach(m => { sm[m] = (sm[m] || 0) + n; });
        e.secondary.forEach(m => { sm[m] = (sm[m] || 0) + n * 0.5; });
        if (kindOf(it) === 'main') sl[it.exId] = (sl[it.exId] || 0) + n;
      }
      perSession.push({ muscles: sm, lifts: sl });
      for (const [m, v] of Object.entries(sm)) muscles[m] = (muscles[m] || 0) + v * f;
      for (const [x, v] of Object.entries(sl)) lifts[x] = (lifts[x] || 0) + v * f;
    }
    return { muscles, lifts, perSession };
  }
  const lagging = (days, perWeek) => { const t = tallyDays(days, perWeek).muscles; return DATA.lagMuscles.slice().sort((x, y) => (t[x] || 0) - (t[y] || 0) || DATA.lagMuscles.indexOf(x) - DATA.lagMuscles.indexOf(y)).slice(0, 2); };

  function packItems(key, day, lag) {
    const items = DATA.packs[key]; if (!items) return [];
    const mainLift = day.items.find(i => i.kind === 'main' && DATA.var[i.exId]);
    const hasSquat = day.items.some(i => (EX(i.exId) || {}).pattern === 'SQUAT');
    const out = [];
    for (const p of items) {
      const it = { ...p };
      if (it.exId === 'VAR') { if (!mainLift) continue; it.exId = DATA.var[mainLift.exId]; }
      else if (it.exId === 'TECH') it.exId = hasSquat ? 'paused-squat' : 'paused-bench-press';
      else if (it.exId.startsWith('LAG')) { const m = lag[it.exId[3] === 'A' ? 0 : 1]; const pair = DATA.lag[m]; if (!pair) continue; it.exId = pair[it.exId.endsWith('C') ? 0 : 1]; }
      if (day.items.some(x => x.exId === it.exId)) continue;
      it.pack = true; out.push(it);
    }
    return out;
  }
  /* plan + answers -> template the app can run */
  function buildTemplate(plan, a, opts = {}) {
    const lang = H.lang();
    a = a || {};
    let days = plan.sessions.map(s => ({ name: s.name, items: adapt(s.items.map(i => ({ ...i })), a) }));
    if (opts.remove && opts.remove.length) days.forEach(d => { d.items = d.items.filter(i => !opts.remove.includes(i.exId)); });
    const effort = opts.effort || 'rir';
    if (effort === 'rir_cap') days.forEach(d => d.items.forEach(i => { if (i.kind === 'main' && i.rpe != null) { i.rpe = Math.min(i.rpe, 8); i.rpeMax = Math.min(i.rpeMax ?? i.rpe, 8); } }));
    const cap = opts.cap || null;
    if (cap) days.forEach(d => { if (sessionMinutes(d.items) > cap) d.items = trim(d.items, cap); });
    const lag = lagging(days, plan.perWeek);
    let addonInfo = null;
    if (opts.addon) {
      const key = `${plan.goal}-${opts.addon}`;
      const order = days.map((d, i) => ({ i, m: sessionMinutes(d.items) })).sort((x, y) => x.m - y.m || x.i - y.i);
      const chosen = [order[0].i];
      for (const o of order.slice(1)) { if (chosen.length === 2) break; if (days.length >= 4 && Math.abs(o.i - chosen[0]) === 1) continue; chosen.push(o.i); }
      if (chosen.length < 2 && order[1]) chosen.push(order[1].i);
      const trial = days.map((d, i) => (chosen.includes(i) ? { ...d, items: [...d.items, ...adapt(packItems(key, d, lag), a)] } : d));
      const over = Object.values(tallyDays(trial, plan.perWeek).muscles).some(v => v > 20.01);
      if (over) addonInfo = { dropped: true, minutes: opts.addon };
      else { days = trial; addonInfo = { minutes: opts.addon, days: chosen }; }
    }
    const id = H.uid();
    return {
      id, name: opts.name || plan.name[lang], planId: plan.id, goal: plan.goal, effort, perWeek: plan.perWeek,
      createdAt: Date.now(), updatedAt: Date.now(),
      block: { start: Date.now(), type: plan.goal }, lag, addon: addonInfo, stallEntry: !!opts.stallEntry,
      days: days.map((d, i) => ({ id: H.uid(), name: `${i + 1} · ${d.name[lang]}`, items: d.items.map(it => toItem(it)) })),
    };
  }
  function toItem(it) {
    const o = { id: H.uid(), exId: it.exId, scheme: it.scheme, sets: it.sets, reps: String(it.reps), rpe: it.rpe ?? null, rpeMax: it.rpeMax ?? null,
      warmups: it.warmups || 0, rest: it.rest, method: it.method, kind: it.kind,
      backoffSets: it.backoffSets || 2, backoffReps: it.backoffReps || '', backoffPct: it.backoffPct || H.settings().backoffPct };
    if (it.cue) o.cue = it.cue;
    if (it.pack) o.pack = true;
    return o;
  }

  /* ---------- methods ---------- */
  const LOWER = new Set(['SQUAT', 'HINGE', 'SINGLE', 'HIPEXT']);
  const HEAVYEQ = new Set(['BB', 'TRAP', 'SMITH', 'MACH']);
  function kindOf(it) {
    if (it.kind) return it.kind;
    const e = EX(it.exId); if (!e) return 'comp';
    if (e.type !== 'compound') return 'iso';
    return HEAVYEQ.has(e.equipment) && e.equipment !== 'MACH' && ['SQUAT', 'HINGE', 'HPUSH', 'VPUSH'].includes(e.pattern) ? 'main' : 'comp';
  }
  const range = reps => { const m = String(reps || '').match(/(\d+)\s*(?:-\s*(\d+))?/); if (!m) return null; const lo = +m[1], hi = m[2] ? +m[2] : lo; return { lo, hi }; };
  function methodOf(it) {
    if (it.noprog) return null;
    if (it.method) return it.method;
    const log = (EX(it.exId) || { logging: 'W' }).logging;
    if (log === 'T' || log === 'WD') return null;
    if (it.scheme === 'topback') return 'P1';
    const r = range(it.reps); if (!r) return null;
    if (r.hi > r.lo) return 'H1';
    return it.rpe ? 'P3' : 'P2';
  }
  function stepFor(exId) {
    const e = EX(exId); const inc = H.settings().increment || 2.5;
    if (e && LOWER.has(e.pattern) && HEAVYEQ.has(e.equipment)) return Math.max(5, inc);
    return inc;
  }
  const round = v => H.roundTo(v, H.settings().increment || 2.5);
  /* snap a computed load to what the lifter can actually load (plates, dumbbell rack, stack); falls back to plain rounding */
  const rnd = (exId, v, up) => { const s = H.snap ? H.snap(exId, v, up) : null; return s != null ? s : round(v); };

  /* previous finished session items for an exercise, newest first; same day-type first (same method + reps) */
  function history(exId, beforeTs, sig) {
    const list = H.sessions().filter(s => s.startedAt < beforeTs)
      .sort((a, b) => b.startedAt - a.startedAt)
      .map(s => ({ s, it: s.items.find(i => i.exId === exId && i.sets.some(x => x.done && x.kind !== 'warmup')) }))
      .filter(x => x.it);
    if (sig) { const same = list.filter(x => x.it.sig === sig); if (same.length) return same; }
    return list;
  }
  const doneWork = it => it.sets.filter(x => x.done && x.kind !== 'warmup' && x.kind !== 'calib' && x.side !== 'R');
  const w = x => H.num(x.weight);
  const rpeOf = (x, dflt) => { const q = H.normRpe(x.rpe); return q == null ? dflt : q; };

  /* load from e1RM (Tuchscherer table) for a rep target at an RPE */
  function fromE1(exId, reps, rpe, beforeTs) {
    const e1 = H.lastE1rm(exId, beforeTs); const p = H.rpePct(reps, rpe || 8);
    return e1 && p ? rnd(exId, e1 * p / 100) : null;
  }
  /* next-session suggestion. returns { load, reps: [per work set] | null, why, d } */
  function suggest(item, ctx) {
    const method = methodOf(item);
    const r = range(item.reps);
    if (!method || !r) return null;
    const before = ctx.before || Date.now();
    const target = item.rpe != null ? +item.rpe : null;
    const rmax = item.rpeMax != null ? +item.rpeMax : target;
    const step = stepFor(item.exId);
    const hist = history(item.exId, before, ctx.sig);
    const fixed = ctx.effort === 'fixed';
    const amrap = /\+\s*$/.test(String(item.reps || ''));
    // percentage-based loads get rounded to the plate step; kept or stepped loads stay exact (dumbbells come in 14, 16.5...)
    const res = (load, why, d = {}, reps = null, exact = false, up = null) => {
      let l = null;
      if (load != null && load > 0) {
        if (exact) { const s = up != null && H.snap ? H.snap(item.exId, load, up) : null; l = s != null ? s : Math.round(load * 100) / 100; }
        else l = rnd(item.exId, load, up);
      }
      return { load: l, why, d, reps, method };
    };
    // percentage of 1RM: load comes from the 1RM, method progression does not move it
    if (item.pct && H.oneRm) {
      const o = H.oneRm(item.exId, before);
      return o ? res(o.kg * item.pct / 100, 'pct', { pct: item.pct, orm: Math.round(o.kg * 10) / 10, src: o.src }) : res(null, 'pctNone', { pct: item.pct });
    }
    if (fixed && target && ['P1', 'P3', 'P5'].includes(method)) {
      const l = fromE1(item.exId, r.lo, target, before);
      if (l) return res(l, 'fixed', { rpe: target });
    }
    const last = hist[0] && hist[0].it;
    if (!last) { const l = target ? fromE1(item.exId, r.lo, target, before) : null; return res(l, l ? 'e1rm' : 'first', { rpe: target }); }
    const work = doneWork(last);
    // AMRAP: minimum N reps; keep the load, the lifter changes it
    if (amrap) {
      const loads = work.map(w).filter(x => x > 0);
      const load = loads.length ? Math.max(...loads) : null;
      const at = work.filter(x => (w(x) || 0) === (load || 0));
      const reps = at.map(x => H.num(x.reps) || 0);
      if (!reps.length) return res(null, 'first', { rpe: target });
      const best = Math.max(...reps);
      return res(load, reps.every(x => x >= r.lo) ? 'amrapOk' : 'amrapLow', { best, n: r.lo }, null, true);
    }
    if (method === 'P1' || method === 'P5') {
      const top = last.sets.find(x => x.kind === 'top' && x.done && w(x) > 0) || work.find(x => w(x) > 0);
      if (!top) return res(null, 'first', { rpe: target });
      const reps = H.num(top.reps) || 0, q = rpeOf(top, target), diff = target != null ? q - (rmax ?? target) : 0;
      if (method === 'P5') {
        const prevTop = hist[1] && hist[1].it.sets.find(x => x.kind === 'top' && x.done);
        const easy2 = target != null && diff <= -1 && prevTop && rpeOf(prevTop, target) <= target - 1 && w(prevTop) === w(top);
        if (reps < r.lo) return res(w(top) * 0.95, 'down5', { reps, q });
        return easy2 ? res(w(top) + step, 'up', { step }, null, true, w(top)) : res(w(top), 'holdKeep', {}, null, true);
      }
      if (reps < r.lo || diff >= 2) return res(w(top) * 0.95, 'down5', { reps, q });
      if (diff <= 0) return res(w(top) + step, 'up', { step }, null, true, w(top));
      return res(w(top), 'hold', { q }, null, true);
    }
    if (method === 'P2') {
      const load = Math.max(...work.map(w).filter(x => x > 0), 0);
      if (!load) return res(null, 'first', {});
      const ok = work.length && work.every(x => (H.num(x.reps) || 0) >= r.lo);
      if (ok) return res(load + step, 'up', { step }, null, true, load);
      const prev = hist[1] && doneWork(hist[1].it);
      const prevLoad = prev && prev.length ? Math.max(...prev.map(w)) : null;
      const prevFail = prev && prevLoad === load && prev.some(x => (H.num(x.reps) || 0) < r.lo);
      return prevFail ? res(load * 0.9, 'reset', {}) : res(load, 'retry', {}, null, true);
    }
    if (method === 'P3') {
      const load = work.map(w).filter(x => x > 0).sort((x, y) => y - x)[0];
      if (!load) return res(target ? fromE1(item.exId, r.lo, target, before) : null, 'first', {});
      const qs = work.map(x => H.normRpe(x.rpe)).filter(x => x != null);
      if (target != null && qs.length && qs.every(q => q <= target - 1)) return res(load * 1.025, 'up25', {}, null, false, load);
      if (target != null && qs.some(q => q >= (rmax ?? target) + 1)) return res(load * 0.975, 'down25', {});
      return res(load, 'holdP3', {}, null, true);
    }
    if (method === 'H1' || method === 'H2') {
      const loads = work.map(w).filter(x => x > 0);
      const load = loads.length ? loads.sort((x, y) => y - x)[0] : null;
      const log = (EX(item.exId) || {}).logging;
      if (load == null && log !== 'BWX') return res(null, 'first', {});
      const atLoad = work.filter(x => (w(x) || 0) === (load || 0));
      const reps = atLoad.map(x => H.num(x.reps) || 0);
      if (method === 'H1') {
        const allTop = reps.length && reps.every(x => x >= r.hi) && atLoad.every(x => { const q = H.normRpe(x.rpe); return q == null || rmax == null || q <= rmax; });
        if (allTop) return res((load || 0) + step, 'up', { step, lo: r.lo }, null, true, load || 0);
        const n = item.sets || reps.length || 1;
        const tg = Array.from({ length: n }, (_, i) => Math.min(r.hi, Math.max(r.lo, reps[i] != null ? reps[i] : r.lo)));
        if (reps.length) { let k = 0; tg.forEach((v, i) => { if (v < tg[k]) k = i; }); tg[k] = Math.min(r.hi, tg[k] + 1); }
        return res(load, 'reps', {}, tg, true);
      }
      const lastSet = atLoad[atLoad.length - 1];
      const q = lastSet ? H.normRpe(lastSet.rpe) : null;
      if (q != null && target != null && q <= target - 2) return res((load || 0) + step, 'upH2', { step }, null, true, load || 0);
      return res(load, 'holdH2', {}, null, true);
    }
    return null;
  }

  /* ---------- volume: hard sets in a time window (fractional counting) ---------- */
  const isHard = x => { const q = H.normRpe(x.rpe); return q == null || q >= 6; };
  function windowVolume(from, to, opts = {}) {
    const vol = {}; let all = 0, easy = 0;
    for (const s of H.sessions()) {
      if (s.startedAt < from || s.startedAt >= to) continue;
      for (const it of s.items) {
        const e = EX(it.exId); if (!e) continue;
        const sets = it.sets.filter(x => x.done && x.kind !== 'warmup' && x.side !== 'R');
        all += sets.length; easy += sets.filter(x => !isHard(x)).length;
        const n = sets.filter(x => opts.all || isHard(x)).length; if (!n) continue;
        e.primary.forEach(m => { vol[m] = (vol[m] || 0) + n; });
        e.secondary.forEach(m => { vol[m] = (vol[m] || 0) + n * 0.5; });
      }
    }
    return { vol, all, easy };
  }
  const zone = (v, z) => (v < z.floor ? 'low' : v <= z.eff ? 'eff' : v <= z.work ? 'work' : 'high');

  /* ---------- flags (plans file 6.3, progression 8.4, volume 8.3) ---------- */
  function bestE1(s, it) {
    const e = EX(it.exId); if (!e || (e.logging !== 'W' && e.logging !== 'BWX')) return null;
    let best = null;
    for (const x of it.sets) {
      if (!x.done || x.kind === 'warmup' || x.pend) continue;
      const load = H.loadOf(e, x, H.sessionBw(s)); const reps = H.num(x.reps);
      if (!(load > 0 && reps > 0)) continue;
      const v = H.e1rm(load, reps, x.rpe); if (v && (!best || v > best)) best = v;
    }
    return best;
  }
  function exposures(exId, upTo) {
    return H.sessions().filter(s => s.startedAt <= upTo).sort((a, b) => a.startedAt - b.startedAt)
      .map(s => { const it = s.items.find(i => i.exId === exId); return it ? { s, v: bestE1(s, it) } : null; })
      .filter(x => x && x.v);
  }
  /* compare a session item with the previous exposure: same load felt 1 RPE harder? */
  function harderThanBefore(s, it) {
    const prev = history(it.exId, s.startedAt)[0]; if (!prev) return false;
    for (const x of doneWork(it)) {
      const q = H.normRpe(x.rpe); if (q == null) continue;
      const y = doneWork(prev.it).find(z => w(z) === w(x) && H.normRpe(z.rpe) != null);
      if (y && q >= H.normRpe(y.rpe) + 1) return true;
    }
    return false;
  }
  /* evaluate after a finished session; returns new flag objects */
  function evaluate(s, existing) {
    const st = H.settings(); const out = [];
    const open = (type, exId) => existing.some(f => f.type === type && f.exId === exId && f.status === 'open');
    const add = (type, exId, d = {}) => { if (!open(type, exId)) out.push({ id: H.uid(), type, exId: exId || null, at: s.endedAt || Date.now(), sesId: s.id, status: 'open', d }); };
    const mains = s.items.filter(it => kindOf(it) === 'main' || ['P1', 'P2', 'P3', 'P5'].includes(it.method));
    for (const it of mains) {
      const ex = exposures(it.exId, s.startedAt);
      if (ex.length >= 4) {
        const last3 = ex.slice(-3).map(x => x.v), before = Math.max(...ex.slice(0, -3).map(x => x.v));
        if (Math.max(...last3) <= before + 0.01) add('stall', it.exId);
      }
      if (ex.length >= 3) {
        const lowVs28 = k => { const cur = ex[k]; const win = ex.slice(0, k).filter(x => x.s.startedAt >= cur.s.startedAt - 28 * 864e5); if (!win.length) return false; return cur.v < Math.max(...win.map(x => x.v)) * (1 - (st.regressPct ?? 5) / 100); };
        if (lowVs28(ex.length - 1) && lowVs28(ex.length - 2)) add('regression', it.exId);
      }
    }
    // fatigue: same load felt harder on 2+ lifts across the last 2 sessions
    s.harder = s.items.filter(it => harderThanBefore(s, it)).map(it => it.exId);
    const prevS = H.sessions().filter(x => x.startedAt < s.startedAt).sort((a, b) => b.startedAt - a.startedAt)[0];
    const lifts = new Set([...(s.harder || []), ...((prevS && prevS.harder) || [])]);
    if (lifts.size >= 2) add('fatigue', null, { lifts: [...lifts] });
    if (s.ready != null && s.ready <= 2) add('readiness', null, { score: s.ready });
    // fake progress: record set logged far from failure
    for (const it of s.items) for (const x of it.sets) {
      if (x.pr && x.pr.length && H.normRpe(x.rpe) != null && H.normRpe(x.rpe) <= 6) { x.pend = true; out.push({ id: H.uid(), type: 'fake', exId: it.exId, at: s.endedAt || Date.now(), sesId: s.id, setId: x.id, status: 'open', d: { rpe: H.normRpe(x.rpe) } }); }
    }
    // junk volume: more than 30% of the last 7 days' sets at RPE 5 or less
    const wv = windowVolume((s.endedAt || Date.now()) - 7 * 864e5, (s.endedAt || Date.now()) + 1);
    if (wv.all >= 10 && wv.easy / wv.all > 0.3) add('junk', null, { pct: Math.round(wv.easy / wv.all * 100) });
    return out;
  }

  /* ---------- blocks and deload ---------- */
  const WEEK = 7 * 864e5;
  function blockInfo(tpl, at = Date.now()) {
    if (!tpl || !tpl.block) return null;
    const st = H.settings();
    const type = tpl.block.type;
    const weeks = Math.floor((at - tpl.block.start) / WEEK);
    const len = type === 'Heavy' || type === 'Mix' ? (st.deloadEvery || 5) : type === 'Size' ? 5 : null;
    const week = len ? (weeks % len) + 1 : weeks + 1;
    const early = tpl.block.deloadUntil && at < tpl.block.deloadUntil;
    const deload = !!(early || (len && week === len));
    const cut = deload ? (type === 'Size' ? 0.45 : 0.4) : 0;
    const ramp = type === 'Size' && !deload && week >= 2 && week <= 4 ? week - 1 : 0;
    return { type, week, len, deload, early: !!early, cut, ramp, weeksTotal: weeks + 1 };
  }

  return { DATA, derive, pick, planById, estMax, sessionMinutes, nsets, buildTemplate, tallyDays, lagging, suggest, methodOf, kindOf, range,
    windowVolume, zone, evaluate, blockInfo, stepFor, history, isHard, adapt };
}

window.RepsmithCoach = { DATA, derive, estMax, sessionMinutes, planById, factory };
})();
