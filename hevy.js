'use strict';
/* Repsmith: Hevy CSV import. Pure parsing and exercise matching, no DOM and no app state.
   window.RepsmithHevy = { parseCSV, parseDate, parse, suggest, EXPLICIT } (also module.exports for node tests). */
(function (root) {
  /* ---------- CSV / TSV ---------- */
  function parseCSV(text) {
    text = String(text || '').replace(/^﻿/, '');
    const first = text.split(/\r?\n/, 1)[0] || '';
    const count = ch => (first.match(new RegExp(ch === '\t' ? '\t' : '\\' + ch, 'g')) || []).length;
    const delim = count('\t') > count(',') && count('\t') >= count(';') ? '\t' : count(';') > count(',') ? ';' : ',';
    const rows = []; let row = [], cur = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === delim) { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.length > 1 || row[0] !== '') rows.push(row); row = []; }
      else cur += c;
    }
    if (cur !== '' || row.length) { row.push(cur); if (row.length > 1 || row[0] !== '') rows.push(row); }
    return { rows, delim };
  }

  /* ---------- dates ---------- */
  const strip = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').toLowerCase();
  const MON4 = { juil: 7, juin: 6, janv: 1, fevr: 2, sept: 9, avri: 4 };
  const MON3 = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
    sty: 1, lut: 2, kwi: 4, maj: 5, cze: 6, lip: 7, sie: 8, wrz: 9, paz: 10, lis: 11, gru: 12,
    mai: 5, okt: 10, dez: 12, ene: 1, abr: 4, ago: 8, dic: 12, fev: 2, avr: 4, gen: 1, mag: 5, giu: 6, lug: 7, set: 9, ott: 10, out: 10 };
  const monthOf = w => { const s = strip(w).replace(/\./g, ''); return MON4[s.slice(0, 4)] || MON3[s.slice(0, 3)] || null; };
  /* returns local-time ms or null. Accepts "9 Oct 2026, 06:42", "Oct 9, 2026, 6:42 AM", "2026-10-09 06:42[:00]" */
  function parseDate(str) {
    str = String(str || '').trim(); if (!str) return null;
    let m = str.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)).getTime();
    const tm = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AaPp][Mm])?/);
    if (!tm) return null;
    let h = +tm[1]; const mi = +tm[2]; const ap = tm[4] ? tm[4].toLowerCase() : '';
    if (ap === 'pm' && h < 12) h += 12; if (ap === 'am' && h === 12) h = 0;
    const rest = str.replace(tm[0], ' ');
    const y = rest.match(/\b(20\d{2}|19\d{2})\b/); if (!y) return null;
    const words = rest.match(/[A-Za-zÀ-žł]+\.?/g) || []; let mon = null;
    for (const w of words) { mon = monthOf(w); if (mon) break; }
    if (!mon) return null;
    const nums = (rest.replace(y[0], ' ').match(/\b\d{1,2}\b/g) || []);
    const d = +nums[0]; if (!(d >= 1 && d <= 31)) return null;
    return new Date(+y[1], mon - 1, d, h, mi, 0).getTime();
  }

  /* ---------- Hevy rows -> workouts ---------- */
  const num = v => { if (v == null) return null; const s = String(v).trim().replace(',', '.'); if (s === '') return null; const n = Number(s); return Number.isFinite(n) ? n : null; };
  const LB = 0.45359237, MI = 1609.344;
  const r2 = x => Math.round(x * 100) / 100;
  function parse(text) {
    const { rows } = parseCSV(text);
    if (rows.length < 2) return { error: 'empty' };
    const head = rows[0].map(h => strip(h).trim()); const col = n => head.indexOf(n);
    const need = ['title', 'start_time', 'exercise_title'];
    if (need.some(n => col(n) < 0)) return { error: 'format' };
    const c = { title: col('title'), start: col('start_time'), end: col('end_time'), desc: col('description'), ex: col('exercise_title'), ss: col('superset_id'), note: col('exercise_notes'),
      idx: col('set_index'), type: col('set_type'), wkg: col('weight_kg'), wlb: col('weight_lbs'), reps: col('reps'), dkm: col('distance_km'), dmi: col('distance_miles'), dur: col('duration_seconds'), rpe: col('rpe') };
    const get = (r, k) => (k >= 0 && k < r.length ? r[k] : '');
    const by = new Map(); let badDates = 0, skipped = 0;
    for (const r of rows.slice(1)) {
      const start = parseDate(get(r, c.start));
      if (start == null) { badDates++; continue; }
      const key = start + '|' + get(r, c.title);
      let w = by.get(key);
      if (!w) { const end = parseDate(get(r, c.end)); w = { title: get(r, c.title) || '', start, end: end && end >= start ? end : null, desc: get(r, c.desc) || '', exercises: [] }; by.set(key, w); }
      const name = (get(r, c.ex) || '').trim(); if (!name) { skipped++; continue; }
      const ss = get(r, c.ss);
      let ex = w.exercises[w.exercises.length - 1];
      if (!ex || ex.name !== name || ex.ss !== ss) { ex = { name, ss, note: (get(r, c.note) || '').trim(), sets: [] }; w.exercises.push(ex); }
      let kg = c.wkg >= 0 ? num(get(r, c.wkg)) : c.wlb >= 0 ? (num(get(r, c.wlb)) == null ? null : num(get(r, c.wlb)) * LB) : null;
      let dist = c.dkm >= 0 ? num(get(r, c.dkm)) : null; dist = dist == null ? (c.dmi >= 0 && num(get(r, c.dmi)) != null ? num(get(r, c.dmi)) * MI : null) : dist * 1000;
      const type = strip(get(r, c.type) || 'normal').trim();
      const set = { type: type === 'warmup' || type === 'warm_up' ? 'warmup' : type === 'dropset' || type === 'drop_set' ? 'drop' : type === 'failure' ? 'failure' : 'normal',
        weight: kg == null ? null : r2(kg), reps: num(get(r, c.reps)), dist: dist == null ? null : Math.round(dist), time: num(get(r, c.dur)), rpe: num(get(r, c.rpe)), i: num(get(r, c.idx)) };
      if (set.weight == null && set.reps == null && set.dist == null && set.time == null) { skipped++; continue; }
      ex.sets.push(set);
    }
    const workouts = [...by.values()].filter(w => w.exercises.length).sort((a, b) => a.start - b.start);
    for (const w of workouts) for (const ex of w.exercises) { ex.sets.sort((a, b) => (a.i ?? 0) - (b.i ?? 0)); if (!ex.note) ex.note = ''; }
    // note per exercise name: the most recent non-empty one
    return { workouts, badDates, skipped, units: c.wlb >= 0 && c.wkg < 0 ? 'lb' : 'kg' };
  }

  /* ---------- exercise matching ---------- */
  /* certain matches for Hevy's own names (value = Repsmith id). Checked by hand against the library. */
  const EXPLICIT = {
    'pull up (weighted)': 'pull-up', 'pull up': 'pull-up', 'pull up (assisted)': 'assisted-pull-up', 'chin up': 'chin-up', 'chin up (weighted)': 'chin-up',
    'overhead press (barbell)': 'overhead-press', 'lateral raise (dumbbell)': 'dumbbell-lateral-raise', 'lateral raise (cable)': 'cable-lateral-raise', 'single arm lateral raise (cable)': 'cable-lateral-raise',
    'squat (barbell)': 'squat', 'front squat': 'front-squat', 'bench press (barbell)': 'bench-press', 'deadlift (barbell)': 'deadlift', 'sumo deadlift (barbell)': 'sumo-deadlift', 'trap bar deadlift': 'trap-bar-deadlift',
    'seated leg curl (machine)': 'seated-leg-curl', 'lying leg curl (machine)': 'lying-leg-curl', 'leg extension (machine)': 'leg-extension', 'face pull': 'face-pull', 'face pull (cable)': 'face-pull',
    'romanian deadlift (barbell)': 'romanian-deadlift', 'romanian deadlift (dumbbell)': 'dumbbell-romanian-deadlift', 'back extension (weighted hyperextension)': 'back-extension', 'back extension (hyperextension)': 'back-extension',
    'chest supported t bar row': 'chest-supported-t-bar-row', 't bar row': 't-bar-row', 'bent over row (barbell)': 'barbell-row', 'pendlay row (barbell)': 'pendlay-row', 'ab wheel': 'ab-wheel-rollout',
    'incline bench press (smith machine)': 'smith-machine-incline-press', 'incline bench press (barbell)': 'incline-bench-press', 'incline bench press (dumbbell)': 'incline-dumbbell-press', 'bench press (dumbbell)': 'dumbbell-bench-press', 'bench press (smith machine)': 'smith-machine-bench-press',
    'bench press - close grip (barbell)': 'close-grip-bench-press', 'overhead triceps extension (cable)': 'overhead-cable-triceps-extension', 'chest dip (weighted)': 'dip', 'chest dip': 'dip', 'triceps dip': 'dip',
    'chest supported incline row (dumbbell)': 'chest-supported-dumbbell-row', 'preacher curl (dumbbell)': 'preacher-curl', 'preacher curl (barbell)': 'preacher-curl', 'preacher curl (machine)': 'machine-preacher-curl',
    'bicep curl (dumbbell)': 'dumbbell-curl', 'bicep curl (barbell)': 'barbell-curl', 'bicep curl (cable)': 'cable-curl', 'ez bar biceps curl': 'ez-bar-curl', 'hammer curl (dumbbell)': 'hammer-curl', 'seated incline curl (dumbbell)': 'incline-dumbbell-curl', 'single-arm bayesian curl': 'bayesian-curl',
    'butterfly (pec deck)': 'pec-deck', 'rear delt reverse fly (machine)': 'reverse-pec-deck', 'rear delt reverse fly (dumbbell)': 'bent-over-dumbbell-reverse-fly', 'chest press (machine)': 'machine-chest-press', 'chest fly (dumbbell)': 'dumbbell-fly',
    'triceps pressdown': 'triceps-pushdown', 'triceps rope pushdown': 'triceps-pushdown', 'triceps pushdown (cable - straight bar)': 'straight-bar-pushdown', 'skullcrusher (barbell)': 'skull-crusher', 'cable cross tricep extensions': 'cross-body-cable-triceps-extension',
    'kettlebell swing': 'kettlebell-swing', 'farmers walk': 'farmer-s-carry', 'farmers carry': 'farmer-s-carry', 'standing calf raise (machine)': 'standing-calf-raise', 'seated calf raise': 'seated-calf-raise', 'seated calf raise (machine)': 'seated-calf-raise',
    'lat pulldown - close grip (cable)': 'close-grip-lat-pulldown', 'lat pulldown (cable)': 'lat-pulldown', 'lat pulldown (machine)': 'lat-pulldown', 'bulgarian split squat': 'bulgarian-split-squat', 'bulgarian split squat (dumbbell)': 'bulgarian-split-squat',
    'low cable fly crossovers': 'cable-fly', 'cable fly crossover': 'cable-fly', 'hip adduction (machine)': 'hip-adduction-machine', 'hip abduction (machine)': 'hip-abduction-machine', 'hack squat (machine)': 'hack-squat', 'hip thrust (machine)': 'machine-hip-thrust', 'hip thrust (barbell)': 'hip-thrust',
    'seated shoulder press (machine)': 'machine-shoulder-press', 'shoulder press (dumbbell)': 'seated-dumbbell-shoulder-press', 'arnold press (dumbbell)': 'arnold-press', 'leg press horizontal (machine)': 'leg-press', 'leg press (machine)': 'leg-press',
    'cable crunch': 'cable-crunch', 'step up': 'step-up', 'cable core palloff press': 'pallof-press', 'zercher squat': null, 'seated row (cable)': 'seated-cable-row', 'iso-lateral row (machine)': 'machine-row', 'shrug (dumbbell)': 'dumbbell-shrug', 'shrug (barbell)': 'barbell-shrug',
    'plank': 'plank', 'crunch': 'crunch', 'push up': 'push-up', 'good morning (barbell)': 'good-morning', 'goblet squat (kettlebell)': 'goblet-squat', 'walking lunge (dumbbell)': 'walking-lunge', 'reverse lunge (dumbbell)': 'reverse-lunge', 'rack pull': 'rack-pull',
  };
  /* seen in real exports but the library has no clean equivalent: suggest the nearest one, the user confirms */
  const NEAR = {
    'calf extension (machine)': 'standing-calf-raise', 'iso-lateral high row (machine)': 'machine-row', 'chest supported row (machine)': 'machine-row', 'chest supported row': 'machine-row',
    'v-squat machine': 'hack-squat', 'single arm tricep overhead extension': 'one-arm-dumbbell-overhead-triceps-extension', 'front foot elevated split squat on toes': 'split-squat',
    'rotator cuff external rotation (cable)': null, 'box jump': null, 'side plank': null, 'bird dog': null,
  };
  const norm = s => strip(s).replace(/[-_/]/g, ' ').replace(/\s+/g, ' ').trim();
  const normKeys = o => { const out = {}; for (const [k, v] of Object.entries(o)) out[norm(k)] = v; return out; };
  const EXP = normKeys(EXPLICIT), NR = normKeys(NEAR);
  const STOP = new Set(['the', 'a', 'of', 'with', 'on', 'machine', 'cable', 'barbell', 'dumbbell', 'weighted', 'bodyweight']);
  const SYN = { bicep: 'curl', biceps: 'curl', 'bent over': 'barbell', hyperextension: 'back extension', crossover: 'fly', crossovers: 'fly', pressdown: 'pushdown', 'pull down': 'pulldown', 'pull up': 'pullup', 'chin up': 'chinup', 'push up': 'pushup', 'step up': 'stepup', 'rdl': 'romanian deadlift' };
  const toks = s => { let x = norm(s).replace(/\([^)]*\)/g, m => ' ' + m.slice(1, -1) + ' '); for (const [k, v] of Object.entries(SYN)) x = x.replace(new RegExp('\\b' + k + '\\b', 'g'), v); return x.split(' ').filter(w => w && !STOP.has(w)).map(w => w.replace(/s$/, '')); };
  const EQ = { barbell: ['BB'], dumbbell: ['DB'], cable: ['CAB'], machine: ['MACH', 'SMITH', 'LM'], smith: ['SMITH'], kettlebell: ['KB'], ez: ['EZ'] };
  /* lib = array of {id, name_en, equipment}. returns {id, conf:'auto'|'check'|'none', alts:[ids]} */
  function suggest(name, lib) {
    const n = norm(name); const byId = new Map(lib.map(e => [e.id, e]));
    if (Object.prototype.hasOwnProperty.call(EXP, n)) { const id = EXP[n]; if (id === null) return { id: null, conf: 'none', alts: [] }; if (byId.has(id)) return { id, conf: 'auto', alts: [] }; }
    const exact = lib.find(e => norm(e.name_en) === n); if (exact) return { id: exact.id, conf: 'auto', alts: [] };
    const near = Object.prototype.hasOwnProperty.call(NR, n) ? NR[n] : undefined;
    const q = toks(name); const qs = new Set(q); const raw = norm(name);
    const score = e => {
      const t = toks(e.name_en); if (!t.length || !q.length) return 0;
      const ts = new Set(t); let hit = 0; for (const w of qs) if (ts.has(w)) hit++;
      let s = hit / (qs.size + ts.size - hit);
      for (const [k, eqs] of Object.entries(EQ)) if (raw.includes(k) && eqs.includes(e.equipment)) s += 0.08;
      return s;
    };
    const ranked = lib.map(e => ({ e, s: score(e) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 6);
    const alts = ranked.map(x => x.e.id);
    if (near !== undefined) return { id: near && byId.has(near) ? near : null, conf: near ? 'check' : 'none', alts: alts.filter(a => a !== near) };
    if (ranked.length && ranked[0].s >= 0.5) return { id: ranked[0].e.id, conf: 'check', alts: alts.slice(1) };
    return { id: ranked.length && ranked[0].s >= 0.3 ? ranked[0].e.id : null, conf: ranked.length && ranked[0].s >= 0.3 ? 'check' : 'none', alts: alts.slice(ranked.length && ranked[0].s >= 0.3 ? 1 : 0) };
  }

  /* guess a type for a new custom exercise from what was logged */
  function guessLogging(sets) {
    const hasW = sets.some(s => s.weight > 0), hasR = sets.some(s => s.reps > 0), hasD = sets.some(s => s.dist > 0), hasT = sets.some(s => s.time > 0);
    if (hasD && hasW) return 'WD';
    if (hasT && !hasR) return 'T';
    if (hasR && !hasW) return 'BWX';
    return 'W';
  }
  const EQ_GUESS = [[/smith/, 'SMITH'], [/barbell/, 'BB'], [/dumbbell/, 'DB'], [/cable/, 'CAB'], [/machine|pec deck/, 'MACH'], [/kettlebell/, 'KB'], [/\bez\b/, 'EZ'], [/weighted|bodyweight|assisted/, 'BW']];
  const guessEquipment = name => { const n = norm(name); for (const [re, e] of EQ_GUESS) if (re.test(n)) return e; return 'BW'; };

  /* rough pattern and primary muscle from the name; empty primary when nothing matches (the user fills it in) */
  const MUS = [[/side plank|oblique/, 'CORE', ['OBL']], [/plank|crunch|ab wheel|sit up|leg raise|palloff|bird dog|dead bug|core/, 'CORE', ['ABS']],
    [/external rotation|rotator|face pull|rear delt|reverse fly/, 'REARDELT', ['RD']], [/lateral raise/, 'LATRAISE', ['SD']], [/front raise/, 'FRONTRAISE', ['FD']],
    [/calf/, 'CALF', ['CALF']], [/bicep|curl/, 'CURL', ['BI']], [/tricep|pushdown|pressdown|skull/, 'TRIEXT', ['TRI']], [/shrug/, 'SHRUG', ['TRP']],
    [/pull up|chin up|pulldown|pull down/, 'VPULL', ['LAT']], [/row/, 'HPULL', ['UB', 'LAT']], [/overhead press|shoulder press|military/, 'VPUSH', ['FD', 'SD']],
    [/bench|chest press|push up|dip|fly|pec deck/, 'HPUSH', ['CH']], [/deadlift|good morning|hyperextension|back extension/, 'HINGE', ['HAM', 'GL']],
    [/hip thrust|glute bridge|kickback/, 'HIPEXT', ['GL']], [/leg curl|hamstring/, 'KFLEX', ['HAM']], [/leg extension/, 'KEXT', ['Q']],
    [/split squat|lunge|step up/, 'SINGLE', ['Q', 'GL']], [/squat|leg press|jump/, 'SQUAT', ['Q', 'GL']], [/carry|farmer|walk/, 'CARRY', ['FA', 'TRP']]];
  function guessMuscles(name) { const n = norm(name); for (const [re, pattern, primary] of MUS) if (re.test(n)) return { pattern, primary: primary.slice() }; return { pattern: 'STAB', primary: [] }; }

  const api = { guessMuscles, parseCSV, parseDate, parse, suggest, guessLogging, guessEquipment, EXPLICIT, NEAR };
  root.RepsmithHevy = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
