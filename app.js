/* Repsmith v0.1 · local-first training log. No accounts, data lives in IndexedDB on the device. */
(() => {
'use strict';

const VERSION = '0.1.0';
const SCHEMA = 1;

/* ---------- i18n ---------- */
const STR = {
  pl: {
    today: 'Dziś', plans: 'Plany', history: 'Historia', library: 'Ćwiczenia',
    settings: 'Ustawienia', startWorkout: 'Zacznij trening', emptyWorkout: 'Pusty trening',
    resume: 'Wróć do treningu', workoutRunning: 'Trening w toku', thisWeek: 'Ten tydzień',
    ofWorkouts: (a, b) => `${a} z ${b} treningów`, workoutsDone: n => `${n} ${plural(n, 'trening', 'treningi', 'treningów')}`,
    exercisesN: n => `${n} ${plural(n, 'ćwiczenie', 'ćwiczenia', 'ćwiczeń')}`,
    noPlanTitle: 'Zacznij od planu', noPlanText: 'Rozpisz dni treningowe raz, a aplikacja podpowie, który dzień jest następny. Możesz też od razu zrobić pusty trening.',
    createPlan: 'Utwórz plan', newPlan: 'Nowy plan', planName: 'Nazwa planu', active: 'Aktywny', setActive: 'Ustaw jako aktywny',
    day: 'Dzień', dayName: 'Nazwa dnia', addDay: 'Dodaj dzień', addExercise: 'Dodaj ćwiczenie', deleteDay: 'Usuń dzień',
    deletePlan: 'Usuń plan', done: 'Gotowe', save: 'Zapisz', cancel: 'Anuluj', delete: 'Usuń', close: 'Zamknij', back: 'Wróć',
    scheme: 'Schemat serii', straight: 'Serie proste', topback: 'Top set + backoff',
    sets: 'Serie', reps: 'Powt.', repsTarget: 'Powtórzenia', rpe: 'RPE', rest: 'Przerwa (s)', warmups: 'Rozgrzewkowe',
    backoffSets: 'Serie backoff', backoffReps: 'Powt. backoff', backoffPct: 'Backoff % top setu',
    whySchemes: 'Kiedy który schemat?',
    straightInfo: 'Ten sam ciężar i liczba powtórzeń we wszystkich seriach roboczych. Dobre do ćwiczeń izolowanych, maszyn i budowania objętości. Łatwe do śledzenia: jak zrobisz wszystkie serie w górnym zakresie powtórzeń, dokładasz ciężar.',
    topbackInfo: 'Jedna ciężka seria (top set) na zadane RPE, potem lżejsze serie (backoff) na procent ciężaru z top setu. Top set mówi, jak jesteś dziś dysponowany, a backoffy dokładają objętość bez zajeżdżania się. Dobre do bojów głównych: przysiad, wyciskanie, martwy ciąg, OHP.',
    warmup: 'Rozgrz.', work: 'Seria', top: 'Top set', backoff: 'Backoff',
    prev: 'Poprzednio', kg: 'kg', plusKg: '+kg', time: 'Czas (s)', dist: 'Dyst. (m)',
    addSet: '+ Dodaj serię', removeSet: 'Usuń ostatnią serię', finish: 'Zakończ', finishWorkout: 'Zakończ trening',
    discard: 'Odrzuć trening', discardQ: 'Odrzucić trening? Wpisane serie przepadną.',
    finishQ: n => n ? `Zostały niezaznaczone serie (${n}). Zakończyć? Niezaznaczone nie zapiszą się.` : 'Zakończyć i zapisać trening?',
    restTimer: 'Przerwa', skip: 'Pomiń', subs: 'Zamienniki', subsTitle: 'Zamień ćwiczenie',
    subsText: 'Ten sam wzorzec ruchu i mięsień główny, inny sprzęt.', subsNone: 'Brak zamiennika o tym samym wzorcu. Wybierz ręcznie.',
    pickOther: 'Wybierz z listy', note: 'Notatka', notePh: 'Dodaj notatkę do tego ćwiczenia, np. ustawienie siedziska, chwyt, wskazówki. Zostaje, dopóki jej nie zmienisz.',
    noteHint: 'Notatka jest przypięta do ćwiczenia i pokaże się przy każdym treningu.',
    search: 'Szukaj ćwiczenia', all: 'Wszystkie', custom: 'Własne', addCustom: 'Dodaj własne ćwiczenie',
    namePl: 'Nazwa (PL)', nameEn: 'Nazwa (EN)', pattern: 'Wzorzec ruchu', primary: 'Mięśnie główne', secondary: 'Mięśnie pomocnicze',
    equipment: 'Sprzęt', type: 'Typ', compound: 'wielostawowe', isolation: 'izolowane', unilateral: 'Jednostronne (L/P osobno)',
    logging: 'Rejestracja', logW: 'kg × powtórzenia', logBWX: 'masa ciała ± kg × powtórzenia', logT: 'czas', logWD: 'kg × dystans',
    deleteExercise: 'Usuń ćwiczenie', usedIn: 'Ćwiczenie jest w planie albo historii. Usunięcie ukryje je z listy, historia zostanie.',
    noSessions: 'Tu pojawią się zakończone treningi.', duration: 'Czas', volume: 'Objętość', setsDone: 'Serie',
    deleteSession: 'Usuń trening', deleteSessionQ: 'Usunąć ten trening z historii?',
    language: 'Język', defaultRestC: 'Przerwa domyślna, wielostawowe (s)', defaultRestI: 'Przerwa domyślna, izolowane (s)',
    increment: 'Najmniejszy skok ciężaru (kg)', defaultBackoff: 'Domyślny backoff (%)',
    backup: 'Kopia zapasowa', exportBtn: 'Pobierz kopię (JSON)', copyBtn: 'Kopiuj kopię do schowka', importBtn: 'Wczytaj kopię z pliku',
    importQ: 'Wczytanie kopii zastąpi wszystkie dane w aplikacji. Kontynuować?', imported: 'Kopia wczytana', copied: 'Skopiowano do schowka',
    exported: 'Kopia pobrana', importErr: 'To nie jest plik kopii Repsmith.', backupInfo: 'Dane są tylko na tym telefonie. Rób kopię co jakiś czas i trzymaj ją poza telefonem.',
    saved: 'Zapisano', workoutSaved: 'Trening zapisany', confirm: 'Potwierdź', next: 'Następny', freeWorkout: 'Pusty trening',
    min: 'min', left: 'L', right: 'P', planEmptyDay: 'Brak ćwiczeń w tym dniu.', addFirstDay: 'Dodaj pierwszy dzień treningowy.',
    nameRequired: 'Podaj nazwę.', primaryRequired: 'Wybierz co najmniej jeden mięsień główny.',
    moveUp: 'W górę', moveDown: 'W dół', remove: 'Usuń', edit: 'Edytuj', copyPlanDay: '',
    lastDone: 'Ostatnio', never: 'jeszcze nie', version: 'Wersja', dataLocal: 'Dane zapisane lokalnie',
    storageOff: 'Zapis w pamięci przeglądarki jest niedostępny. Dane znikną po zamknięciu.',
    bodyweight: 'masa ciała', exampleNote: '',
  },
  en: {
    today: 'Today', plans: 'Plans', history: 'History', library: 'Exercises',
    settings: 'Settings', startWorkout: 'Start workout', emptyWorkout: 'Empty workout',
    resume: 'Back to workout', workoutRunning: 'Workout in progress', thisWeek: 'This week',
    ofWorkouts: (a, b) => `${a} of ${b} workouts`, workoutsDone: n => `${n} workout${n === 1 ? '' : 's'}`,
    exercisesN: n => `${n} exercise${n === 1 ? '' : 's'}`,
    noPlanTitle: 'Start with a plan', noPlanText: 'Set up your training days once and the app suggests which day is next. Or start an empty workout right away.',
    createPlan: 'Create plan', newPlan: 'New plan', planName: 'Plan name', active: 'Active', setActive: 'Set as active',
    day: 'Day', dayName: 'Day name', addDay: 'Add day', addExercise: 'Add exercise', deleteDay: 'Delete day',
    deletePlan: 'Delete plan', done: 'Done', save: 'Save', cancel: 'Cancel', delete: 'Delete', close: 'Close', back: 'Back',
    scheme: 'Set scheme', straight: 'Straight sets', topback: 'Top set + backoff',
    sets: 'Sets', reps: 'Reps', repsTarget: 'Reps', rpe: 'RPE', rest: 'Rest (s)', warmups: 'Warm-up sets',
    backoffSets: 'Backoff sets', backoffReps: 'Backoff reps', backoffPct: 'Backoff % of top set',
    whySchemes: 'Which scheme when?',
    straightInfo: 'Same weight and reps on every working set. Good for isolation work, machines and building volume. Easy to progress: once you hit the top of the rep range on all sets, add weight.',
    topbackInfo: 'One heavy set (top set) at a target RPE, then lighter sets (backoff) at a percentage of the top set weight. The top set tells you how you perform today, the backoffs add volume without burning you out. Good for main lifts: squat, bench, deadlift, OHP.',
    warmup: 'Warm-up', work: 'Set', top: 'Top set', backoff: 'Backoff',
    prev: 'Previous', kg: 'kg', plusKg: '+kg', time: 'Time (s)', dist: 'Dist. (m)',
    addSet: '+ Add set', removeSet: 'Remove last set', finish: 'Finish', finishWorkout: 'Finish workout',
    discard: 'Discard workout', discardQ: 'Discard this workout? Logged sets will be lost.',
    finishQ: n => n ? `${n} set(s) not checked off. Finish anyway? Unchecked sets are not saved.` : 'Finish and save the workout?',
    restTimer: 'Rest', skip: 'Skip', subs: 'Swap', subsTitle: 'Swap exercise',
    subsText: 'Same movement pattern and main muscle, different equipment.', subsNone: 'No swap with the same pattern. Pick one manually.',
    pickOther: 'Pick from list', note: 'Note', notePh: 'Add a note for this exercise, e.g. seat setting, grip, cues. It stays until you change it.',
    noteHint: 'The note is pinned to the exercise and shows up in every workout.',
    search: 'Search exercises', all: 'All', custom: 'Custom', addCustom: 'Add custom exercise',
    namePl: 'Name (PL)', nameEn: 'Name (EN)', pattern: 'Movement pattern', primary: 'Main muscles', secondary: 'Supporting muscles',
    equipment: 'Equipment', type: 'Type', compound: 'compound', isolation: 'isolation', unilateral: 'Unilateral (log L/R separately)',
    logging: 'Logging', logW: 'kg × reps', logBWX: 'bodyweight ± kg × reps', logT: 'time', logWD: 'kg × distance',
    deleteExercise: 'Delete exercise', usedIn: 'This exercise is in a plan or in history. Deleting hides it from the list; history stays.',
    noSessions: 'Finished workouts show up here.', duration: 'Duration', volume: 'Volume', setsDone: 'Sets',
    deleteSession: 'Delete workout', deleteSessionQ: 'Delete this workout from history?',
    language: 'Language', defaultRestC: 'Default rest, compound (s)', defaultRestI: 'Default rest, isolation (s)',
    increment: 'Smallest weight step (kg)', defaultBackoff: 'Default backoff (%)',
    backup: 'Backup', exportBtn: 'Download backup (JSON)', copyBtn: 'Copy backup to clipboard', importBtn: 'Load backup from file',
    importQ: 'Loading a backup replaces all data in the app. Continue?', imported: 'Backup loaded', copied: 'Copied to clipboard',
    exported: 'Backup downloaded', importErr: 'This is not a Repsmith backup file.', backupInfo: 'Your data lives only on this phone. Make a backup now and then and keep it somewhere else.',
    saved: 'Saved', workoutSaved: 'Workout saved', confirm: 'Confirm', next: 'Next', freeWorkout: 'Empty workout',
    min: 'min', left: 'L', right: 'R', planEmptyDay: 'No exercises on this day.', addFirstDay: 'Add your first training day.',
    nameRequired: 'Enter a name.', primaryRequired: 'Pick at least one main muscle.',
    moveUp: 'Move up', moveDown: 'Move down', remove: 'Remove', edit: 'Edit', copyPlanDay: '',
    lastDone: 'Last', never: 'not yet', version: 'Version', dataLocal: 'Data stored locally',
    storageOff: 'Browser storage is unavailable. Data will be lost when you close the app.',
    bodyweight: 'bodyweight', exampleNote: '',
  },
};
function plural(n, one, few, many) {
  if (n === 1) return one;
  const d = n % 10, h = n % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
}
const t = (k, ...a) => { const v = (STR[S.settings.lang] || STR.pl)[k]; return typeof v === 'function' ? v(...a) : (v ?? k); };
const L = () => (S.settings.lang === 'en' ? 1 : 0);

/* ---------- icons ---------- */
const I = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  dumbbell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  swap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h11l-3-3M17 17H6l3 3"/></svg>',
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  tally: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="10" width="7" height="44" rx="3.5" fill="#F3ECF1"/><rect x="22" y="10" width="7" height="44" rx="3.5" fill="#F3ECF1"/><rect x="34" y="10" width="7" height="44" rx="3.5" fill="#F3ECF1"/><rect x="46" y="10" width="7" height="44" rx="3.5" fill="#F3ECF1"/><path d="M5 46 L59 18" stroke="#FF9F70" stroke-width="7" stroke-linecap="round"/></svg>',
};

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2));
const now = () => Date.now();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? n : null; };
const fmtN = n => (n == null ? '' : (Math.round(n * 100) / 100).toString().replace('.', S.settings.lang === 'pl' ? ',' : '.'));
const roundTo = (w, step) => Math.round(w / step) * step;
const fmtDur = ms => { const s = Math.max(0, Math.floor(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`; };
const fmtClock = sec => { const s = Math.max(0, Math.round(sec)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const fmtDate = (ts, opts = { weekday: 'long', day: 'numeric', month: 'short' }) => new Intl.DateTimeFormat(S.settings.lang === 'en' ? 'en-GB' : 'pl-PL', opts).format(new Date(ts));
const clone = o => JSON.parse(JSON.stringify(o));

/* ---------- storage (IndexedDB, falls back to memory) ---------- */
const DB = {
  db: null, ok: false, mem: {},
  async open() {
    try {
      if (!('indexedDB' in window)) throw new Error('no idb');
      this.db = await new Promise((res, rej) => {
        const r = indexedDB.open('repsmith', 1);
        r.onupgradeneeded = () => { r.result.createObjectStore('kv'); };
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      this.ok = true;
    } catch (e) { this.ok = false; }
  },
  async get(k) {
    if (!this.ok) return this.mem[k];
    try {
      return await new Promise((res, rej) => { const r = this.db.transaction('kv').objectStore('kv').get(k); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    } catch (e) { return this.mem[k]; }
  },
  async set(k, v) {
    this.mem[k] = v;
    if (!this.ok) return;
    try {
      await new Promise((res, rej) => { const tx = this.db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
    } catch (e) { /* keep in memory */ }
  },
};
const KEYS = ['settings', 'templates', 'sessions', 'notes', 'customExercises', 'active'];
const persist = (...keys) => Promise.all(keys.map(k => DB.set(k, clone(S[k]))));

/* ---------- state ---------- */
const S = {
  settings: { lang: (navigator.language || 'pl').startsWith('pl') ? 'pl' : 'en', restC: 180, restI: 90, increment: 2.5, backoffPct: 90, activeTemplateId: null },
  templates: [], sessions: [], notes: {}, customExercises: [], active: null,
  data: null, ex: new Map(),
  view: 'today', viewArg: null, sheet: null, timer: null, toast: null,
};

function rebuildExercises() {
  S.ex = new Map();
  for (const e of S.data.exercises) S.ex.set(e.id, { ...e, custom: false });
  for (const e of S.customExercises) S.ex.set(e.id, { ...e, custom: true });
}
const exName = id => { const e = S.ex.get(id); if (!e) return '?'; return (L() ? e.name_en : e.name_pl) || e.name_en || e.name_pl; };
const muscleName = c => (S.data.muscles[c] || [c, c])[L()];
const patternName = c => (S.data.patterns[c] || [c, c])[L()];
const equipName = c => (S.data.equipment[c] || [c, c])[L()];
const isVisible = e => !e.hidden;

/* ---------- domain ---------- */
function defaultItem(exId) {
  const e = S.ex.get(exId);
  const compound = e && e.type === 'compound';
  return { id: uid(), exId, scheme: 'straight', warmups: 0, sets: 3, reps: compound ? '6-8' : '10-12', rpe: compound ? 8 : 9, backoffSets: 2, backoffReps: '', backoffPct: S.settings.backoffPct, rest: compound ? S.settings.restC : S.settings.restI };
}
function newSet(kind, side, target) { return { id: uid(), kind, side: side || null, weight: '', reps: '', rpe: '', time: '', dist: '', done: false, target: target || null }; }
function pushSets(arr, ex, kind, count, target) {
  for (let i = 0; i < count; i++) {
    if (ex && ex.unilateral) { arr.push(newSet(kind, 'L', target)); arr.push(newSet(kind, 'R', target)); }
    else arr.push(newSet(kind, null, target));
  }
}
function sessionItemFromTemplate(it) {
  const ex = S.ex.get(it.exId);
  const sets = [];
  pushSets(sets, ex, 'warmup', it.warmups || 0, null);
  if (it.scheme === 'topback') {
    pushSets(sets, ex, 'top', 1, { reps: it.reps, rpe: it.rpe });
    pushSets(sets, ex, 'backoff', it.backoffSets || 0, { reps: it.backoffReps || it.reps, rpe: null });
  } else {
    pushSets(sets, ex, 'work', it.sets || 1, { reps: it.reps, rpe: it.rpe });
  }
  return { id: uid(), exId: it.exId, scheme: it.scheme, rest: it.rest, backoffPct: it.backoffPct || S.settings.backoffPct, sets };
}
function freeItem(exId) {
  const ex = S.ex.get(exId);
  const it = defaultItem(exId);
  const sets = [];
  pushSets(sets, ex, 'work', 3, null);
  return { id: uid(), exId, scheme: 'straight', rest: it.rest, backoffPct: S.settings.backoffPct, sets };
}
function activeTemplate() { return S.templates.find(x => x.id === S.settings.activeTemplateId) || null; }
function nextDay(tpl) {
  if (!tpl || !tpl.days.length) return null;
  const last = S.sessions.filter(s => s.templateId === tpl.id).sort((a, b) => b.startedAt - a.startedAt)[0];
  if (!last) return tpl.days[0];
  const i = tpl.days.findIndex(d => d.id === last.dayId);
  return tpl.days[(i + 1) % tpl.days.length] || tpl.days[0];
}
function startSession(tpl, day) {
  S.active = {
    id: uid(), name: day ? day.name : t('freeWorkout'), templateId: tpl ? tpl.id : null, dayId: day ? day.id : null,
    startedAt: now(), endedAt: null, items: day ? day.items.map(sessionItemFromTemplate) : [],
  };
  persist('active');
  go('workout');
}
/* previous sets for an exercise: last finished session with that exercise */
function previousFor(exId, beforeTs) {
  const s = S.sessions.filter(x => x.startedAt < (beforeTs || Infinity) && x.items.some(i => i.exId === exId)).sort((a, b) => b.startedAt - a.startedAt)[0];
  if (!s) return null;
  return s.items.find(i => i.exId === exId);
}
function matchPrev(prevItem, item, idx) {
  if (!prevItem) return null;
  const set = item.sets[idx];
  const ord = item.sets.slice(0, idx + 1).filter(s => s.kind === set.kind && s.side === set.side).length - 1;
  const cands = prevItem.sets.filter(s => s.kind === set.kind && s.side === set.side);
  return cands[ord] || null;
}
function fmtSet(s, ex) {
  if (!s) return '–';
  const log = ex ? ex.logging : 'W';
  if (log === 'T') return s.time ? `${fmtN(num(s.time))} s` : '–';
  if (log === 'WD') return `${fmtN(num(s.weight)) || 0}×${fmtN(num(s.dist)) || 0}m`;
  if (log === 'BWX') { const w = num(s.weight); return `${w ? (w > 0 ? '+' : '') + fmtN(w) : 'BW'}×${s.reps || 0}`; }
  return `${fmtN(num(s.weight)) || 0}×${s.reps || 0}`;
}
/* equipment that can be loaded heavy; a swap should stay in the same class (barbell squat -> hack squat, not goblet) */
const HEAVY = new Set(['BB', 'SMITH', 'MACH', 'TRAP', 'TBAR', 'LM', 'CAB']);
function substitutes(exId, n = 2) {
  const e = S.ex.get(exId);
  if (!e) return [];
  const prim = new Set(e.primary), sec = new Set(e.secondary);
  const sameSet = (a, b) => a.length === b.size && a.every(m => b.has(m));
  const score = c =>
    c.primary.filter(m => prim.has(m)).length * 2 + (sameSet(c.primary, prim) ? 2 : 0) +
    c.secondary.filter(m => sec.has(m)).length * 0.5 + (sameSet(c.secondary, sec) ? 1 : 0) +
    (c.type === e.type ? 2 : 0) + (c.unilateral === e.unilateral ? 2 : 0) +
    (c.equipment !== e.equipment ? 2 : 0) + (c.logging === e.logging ? 0 : -4) +
    (HEAVY.has(c.equipment) === HEAVY.has(e.equipment) ? 1.5 : 0);
  return [...S.ex.values()]
    .filter(c => c.id !== exId && isVisible(c) && c.pattern === e.pattern && c.primary.some(m => prim.has(m)))
    .map(c => ({ c, score: score(c) }))
    .sort((a, b) => b.score - a.score || exName(a.c.id).localeCompare(exName(b.c.id)))
    .slice(0, n).map(x => x.c);
}
function sessionStats(s) {
  let sets = 0, vol = 0;
  for (const it of s.items) {
    const ex = S.ex.get(it.exId);
    for (const x of it.sets) {
      if (!x.done || x.kind === 'warmup') continue;
      sets++;
      if (!ex || ex.logging === 'W') vol += (num(x.weight) || 0) * (num(x.reps) || 0);
    }
  }
  return { sets, vol: Math.round(vol) };
}
function weekCount() {
  const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day);
  return S.sessions.filter(s => s.startedAt >= d.getTime()).length;
}

/* ---------- rest timer ---------- */
let audioCtx = null;
function ensureAudio() { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); } catch (e) { audioCtx = null; } }
function beep() {
  try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) {}
  if (!audioCtx) return;
  try {
    [0, 0.25].forEach(off => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + off);
      g.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + off + 0.18);
      o.start(audioCtx.currentTime + off); o.stop(audioCtx.currentTime + off + 0.2);
    });
  } catch (e) {}
}
function startTimer(sec) { S.timer = { endAt: now() + sec * 1000, total: sec, fired: false }; renderTimer(); }
function adjustTimer(d) {
  if (!S.timer) return;
  S.timer.endAt += d * 1000; S.timer.total = Math.max(1, S.timer.total + d);
  if (S.timer.endAt - now() > 0) S.timer.fired = false;
  renderTimer();
}
function stopTimer() { S.timer = null; renderTimer(); }
function renderTimer() {
  let el = $('#timer');
  if (!S.timer || S.view !== 'workout') { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'timer'; el.className = 'timer'; document.body.appendChild(el); }
  const left = (S.timer.endAt - now()) / 1000;
  const over = left <= 0;
  const pct = over ? 100 : Math.min(100, (1 - left / S.timer.total) * 100);
  if (!el.firstChild) {
    el.innerHTML = `<div class="timer-inner"><div class="timer-row"><div><div class="eyebrow small">${esc(t('restTimer'))}</div><div class="big" id="tbig"></div></div>
      <div class="btns"><button class="btn" data-a="timer-adj" data-v="-15">−15 s</button><button class="btn" data-a="timer-adj" data-v="15">+15 s</button><button class="btn" data-a="timer-skip">${esc(t('skip'))}</button></div></div>
      <div class="bar"><i id="tbar"></i></div></div>`;
  }
  const big = $('#tbig');
  big.textContent = over ? '+' + fmtClock(-left) : fmtClock(left);
  big.classList.toggle('over', over);
  $('#tbar').style.width = pct + '%';
  if (over && !S.timer.fired) { S.timer.fired = true; beep(); }
}
setInterval(() => {
  if (S.timer) renderTimer();
  const c = $('#wclock'); if (c && S.active) c.textContent = fmtDur(now() - S.active.startedAt);
}, 1000);

/* ---------- navigation ---------- */
function go(view, arg) { S.view = view; S.viewArg = arg ?? null; S.sheet = null; render(); window.scrollTo(0, 0); }
function openSheet(sheet) { S.sheet = sheet; renderSheet(); }
function closeSheet() { S.sheet = null; renderSheet(); }
function toast(msg) {
  S.toast = msg; let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => { el.hidden = true; }, 2200);
}

/* ---------- render: shell ---------- */
function render() {
  const app = $('#app');
  let html = '';
  switch (S.view) {
    case 'today': html = vToday(); break;
    case 'plans': html = vPlans(); break;
    case 'plan': html = vPlan(); break;
    case 'workout': html = vWorkout(); break;
    case 'history': html = vHistory(); break;
    case 'session': html = vSession(); break;
    case 'library': html = vLibrary(); break;
    default: html = vToday();
  }
  app.innerHTML = html + (S.view === 'workout' ? '' : nav());
  renderTimer();
  renderSheet();
  if (S.view === 'library') { const i = $('#libq'); if (i && S._libFocus) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}
function nav() {
  const tab = { today: 'today', plans: 'plans', plan: 'plans', history: 'history', session: 'history', library: 'library' }[S.view];
  const b = (v, icon, label) => `<button class="${tab === v ? 'on' : ''}" data-a="nav" data-v="${v}" aria-current="${tab === v ? 'page' : 'false'}">${I[icon]}${esc(t(label))}</button>`;
  return `<nav class="nav" aria-label="Menu"><div class="nav-inner">${b('today', 'home', 'today')}${b('plans', 'list', 'plans')}${b('history', 'clock', 'history')}${b('library', 'dumbbell', 'library')}</div></nav>`;
}
function topbar(right = '') {
  return `<div class="topbar"><div class="brand">${I.tally}<span>Repsmith</span></div><div>${right}<button class="icon-btn" data-a="settings" aria-label="${esc(t('settings'))}">${I.gear}</button></div></div>`;
}
function resumeBanner() {
  if (!S.active) return '';
  return `<div class="banner"><div><div class="eyebrow small">${esc(t('workoutRunning'))}</div><div style="font-weight:600">${esc(S.active.name)}</div></div><button class="btn small" data-a="nav" data-v="workout">${esc(t('resume'))}</button></div>`;
}

/* ---------- view: today ---------- */
function vToday() {
  const tpl = activeTemplate();
  const day = (S._pickedDay && tpl && tpl.days.find(d => d.id === S._pickedDay)) || nextDay(tpl);
  const wc = weekCount();
  let main = '';
  if (tpl && day) {
    const items = day.items;
    const rows = items.slice(0, 5).map(it => `<div class="row"><span class="name grow">${esc(exName(it.exId))}</span><span class="meta">${esc(schemeShort(it))}</span></div>`).join('');
    const more = items.length > 5 ? `<div class="row"><span class="meta">+ ${items.length - 5}</span></div>` : '';
    main = `<div><div class="eyebrow">${esc(fmtDate(now()))}</div><h1>${esc(day.name)}</h1><div class="sub" style="margin-top:8px">${esc(tpl.name)} · ${esc(t('exercisesN', items.length))}</div></div>
      ${items.length ? `<div class="card">${rows}${more}</div>` : `<div class="empty">${esc(t('planEmptyDay'))}</div>`}
      ${S.active ? '' : `<div class="btn-row" style="flex-direction:column"><button class="btn primary block" data-a="start-day">${esc(t('startWorkout'))}</button><button class="btn block" data-a="start-free">${esc(t('emptyWorkout'))}</button></div>`}
      ${tpl.days.length > 1 ? `<div class="chips" role="group" aria-label="${esc(t('day'))}">${tpl.days.map(d => `<button class="chip ${d.id === day.id ? 'on' : ''}" data-a="pick-day" data-v="${d.id}">${esc(d.name)}</button>`).join('')}</div>` : ''}`;
  } else {
    main = `<div><div class="eyebrow">${esc(fmtDate(now()))}</div><h1>${esc(t('noPlanTitle'))}</h1><div class="sub" style="margin-top:8px">${esc(t('noPlanText'))}</div></div>
      ${S.active ? '' : `<div class="btn-row" style="flex-direction:column"><button class="btn primary block" data-a="new-plan">${esc(t('createPlan'))}</button><button class="btn block" data-a="start-free">${esc(t('emptyWorkout'))}</button></div>`}`;
  }
  const target = tpl ? tpl.days.length : 0;
  const week = target
    ? `<div><div class="sub small" style="display:flex;justify-content:space-between;margin-bottom:8px"><span>${esc(t('thisWeek'))}</span><span>${esc(t('ofWorkouts', Math.min(wc, target), target))}</span></div><div class="progress">${Array.from({ length: target }, (_, i) => `<span class="${i < wc ? 'on' : ''}"></span>`).join('')}</div></div>`
    : (wc ? `<div class="sub small">${esc(t('thisWeek'))}: ${esc(t('workoutsDone', wc))}</div>` : '');
  return `<main class="screen">${topbar()}${resumeBanner()}${main}${week}${DB.ok ? '' : `<div class="err">${esc(t('storageOff'))}</div>`}</main>`;
}
function schemeShort(it) {
  if (it.scheme === 'topback') return `top ${it.reps}${it.rpe ? ' @' + fmtN(it.rpe) : ''} + ${it.backoffSets}×${it.backoffReps || it.reps}`;
  return `${it.sets} × ${it.reps}${it.rpe ? ' @' + fmtN(it.rpe) : ''}`;
}

/* ---------- view: plans ---------- */
function vPlans() {
  const list = S.templates.map(tp => `<button class="list-btn row" data-a="open-plan" data-v="${tp.id}"><span class="grow"><span class="name">${esc(tp.name)}</span><br><span class="meta">${tp.days.length} × ${esc(t('day').toLowerCase())}</span></span>${tp.id === S.settings.activeTemplateId ? `<span class="tag p">${esc(t('active'))}</span>` : ''}</button>`).join('');
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('plans'))}</h1>
    ${S.templates.length ? `<div class="card">${list}</div>` : `<div class="empty">${esc(t('noPlanText'))}</div>`}
    <button class="btn primary block" data-a="new-plan">${esc(t('newPlan'))}</button></main>`;
}
function vPlan() {
  const tp = S.templates.find(x => x.id === S.viewArg);
  if (!tp) return vPlans();
  const days = tp.days.map((d, di) => `
    <section class="card" style="padding:14px 16px;display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;gap:8px;align-items:flex-end">
        <div style="flex:1;min-width:0"><label for="dn-${d.id}">${esc(t('dayName'))}</label><input id="dn-${d.id}" data-f="day-name" data-d="${d.id}" value="${esc(d.name)}"></div>
        <button class="icon-btn" data-a="day-menu" data-d="${d.id}" aria-label="${esc(t('edit'))}">${I.more}</button>
      </div>
      ${d.items.length ? d.items.map((it, ii) => `<div class="row"><button class="list-btn grow" style="padding:8px 0" data-a="edit-item" data-d="${d.id}" data-i="${it.id}"><span class="grow"><span class="name">${esc(exName(it.exId))}</span><br><span class="meta">${esc(schemeShort(it))} · ${it.rest} s</span></span></button>
        <button class="icon-btn" data-a="item-up" data-d="${d.id}" data-i="${it.id}" aria-label="${esc(t('moveUp'))}" ${ii === 0 ? 'disabled' : ''}>${I.up}</button>
        <button class="icon-btn" data-a="item-del" data-d="${d.id}" data-i="${it.id}" aria-label="${esc(t('remove'))}">${I.x}</button></div>`).join('') : `<div class="muted small">${esc(t('planEmptyDay'))}</div>`}
      <button class="btn small" data-a="day-add-ex" data-d="${d.id}">${esc(t('addExercise'))}</button>
    </section>`).join('');
  const isActive = tp.id === S.settings.activeTemplateId;
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="nav" data-v="plans" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(t('plans'))}</div><button class="icon-btn" data-a="plan-menu" aria-label="${esc(t('edit'))}">${I.more}</button></div>
    <div><label for="pn">${esc(t('planName'))}</label><input id="pn" data-f="plan-name" value="${esc(tp.name)}"></div>
    ${isActive ? `<div><span class="tag p">${esc(t('active'))}</span></div>` : `<button class="btn block" data-a="plan-activate">${esc(t('setActive'))}</button>`}
    ${days || `<div class="empty">${esc(t('addFirstDay'))}</div>`}
    <button class="btn block" data-a="plan-add-day">${esc(t('addDay'))}</button>
    <button class="btn primary block" data-a="nav" data-v="plans">${esc(t('done'))}</button>
  </main>`;
}

/* ---------- view: workout ---------- */
function setGrid(it) {
  const ex = S.ex.get(it.exId) || { logging: 'W' };
  const prevItem = previousFor(it.exId, S.active.startedAt);
  const log = ex.logging;
  const c2 = log === 'T' ? t('time') : log === 'BWX' ? t('plusKg') : t('kg');
  const c3 = log === 'T' ? '' : log === 'WD' ? t('dist') : t('reps');
  const topDone = it.sets.find(s => s.kind === 'top' && s.done && num(s.weight));
  const rows = it.sets.map((s, idx) => {
    const p = matchPrev(prevItem, it, idx);
    let phW = p ? fmtN(num(p.weight)) : '';
    let phR = p ? (p.reps || '') : (s.target && s.target.reps ? String(s.target.reps).split('-')[0] : '');
    if (s.kind === 'backoff' && topDone) phW = fmtN(roundTo(num(topDone.weight) * (it.backoffPct || 90) / 100, S.settings.increment));
    const phRpe = s.target && s.target.rpe ? fmtN(s.target.rpe) : (p && p.rpe ? fmtN(num(p.rpe)) : '');
    const kindLbl = { warmup: t('warmup'), work: t('work') + ' ' + (it.sets.filter((x, j) => j <= idx && x.kind === 'work' && x.side === s.side).length), top: t('top'), backoff: t('backoff') }[s.kind];
    const side = s.side ? `<span class="side-tag">${esc(s.side === 'L' ? t('left') : t('right'))}</span>` : '';
    const f = (field, val, ph, cls = '') => `<input class="${cls}" inputmode="decimal" enterkeyhint="next" aria-label="${esc(field)}" data-f="set" data-i="${it.id}" data-s="${s.id}" data-k="${field}" value="${esc(val)}" placeholder="${esc(ph)}">`;
    let a, b;
    if (log === 'T') { a = f('time', s.time, p ? p.time || '' : ''); b = '<span></span>'; }
    else if (log === 'WD') { a = f('weight', s.weight, phW); b = f('dist', s.dist, p ? p.dist || '' : ''); }
    else { a = f('weight', s.weight, phW); b = f('reps', s.reps, phR); }
    return `<div class="set ${s.kind === 'top' ? 'is-top' : ''} ${s.done ? 'done' : ''}">
      <span class="kind ${s.kind === 'top' ? 'top' : ''}">${esc(kindLbl)}${side}</span>
      <span class="prev">${esc(p ? fmtSet(p, ex) : '–')}</span>${a}${b}${f('rpe', s.rpe, phRpe, 'rpe')}
      <button class="check" data-a="set-done" data-i="${it.id}" data-s="${s.id}" aria-label="${esc(t('done'))}" aria-pressed="${s.done}">${s.done ? I.check : ''}</button></div>`;
  }).join('');
  return `<div class="sets"><div class="set-head"><span>${esc(t('sets'))}</span><span>${esc(t('prev'))}</span><span>${esc(c2)}</span><span>${esc(c3)}</span><span>RPE</span><span></span></div>${rows}</div>`;
}
function vWorkout() {
  const a = S.active;
  if (!a) return vToday();
  const cards = a.items.map((it, n) => {
    const ex = S.ex.get(it.exId);
    const note = S.notes[it.exId];
    return `<section class="ex-card" aria-label="${esc(exName(it.exId))}">
      <div class="eyebrow small">${n + 1} / ${a.items.length}</div>
      <div class="ex-name-row"><div class="ex-name">${esc(exName(it.exId))}</div><button class="icon-btn" data-a="item-menu" data-i="${it.id}" aria-label="${esc(t('edit'))}">${I.more}</button></div>
      <div class="chips">
        <button class="chip" data-a="scheme-info" data-i="${it.id}">${esc(it.scheme === 'topback' ? t('topback') : t('straight'))} ${I.info}</button>
        <button class="chip" data-a="subs" data-i="${it.id}">${I.swap} ${esc(t('subs'))}</button>
        <button class="chip" data-a="rest-edit" data-i="${it.id}">${I.clock.replace('<svg ', '<svg width="18" height="18" ')} ${it.rest} s</button>
      </div>
      <button class="note-box ${note && note.text ? '' : 'empty'}" data-a="note" data-v="${esc(it.exId)}">${note && note.text ? `<span class="lbl">${esc(t('note'))}</span>${esc(note.text)}` : `<span class="lbl">+ ${esc(t('note'))}</span>`}</button>
      ${setGrid(it)}
      <div class="set-actions"><button class="btn small" data-a="add-set" data-i="${it.id}">${esc(t('addSet'))}</button>${it.sets.length ? `<button class="btn small ghost" data-a="del-set" data-i="${it.id}">${esc(t('removeSet'))}</button>` : ''}</div>
    </section>`;
  }).join('');
  return `<main class="screen workout">
    <div class="wk-head"><button class="icon-btn" data-a="nav" data-v="today" aria-label="${esc(t('back'))}">${I.down}</button>
      <div class="wk-title"><div class="t">${esc(a.name)}</div><div class="clock" id="wclock">${fmtDur(now() - a.startedAt)}</div></div>
      <button class="btn small ghost" style="color:var(--accent)" data-a="finish">${esc(t('finish'))}</button></div>
    ${cards || `<div class="empty">${esc(t('addExercise'))}</div>`}
    <div class="workout-foot"><button class="btn block" data-a="session-add-ex">${esc(t('addExercise'))}</button>
      <button class="btn primary block" data-a="finish">${esc(t('finishWorkout'))}</button>
      <button class="btn block ghost" data-a="discard">${esc(t('discard'))}</button></div>
  </main>`;
}

/* ---------- view: history ---------- */
function vHistory() {
  const list = [...S.sessions].sort((a, b) => b.startedAt - a.startedAt).map(s => {
    const st = sessionStats(s);
    return `<button class="list-btn row" data-a="open-session" data-v="${s.id}"><span class="grow"><span class="name">${esc(s.name)}</span><br><span class="meta">${esc(fmtDate(s.startedAt, { weekday: 'short', day: 'numeric', month: 'short' }))} · ${esc(fmtDur(s.endedAt - s.startedAt))} · ${st.sets} ${esc(t('setsDone').toLowerCase())}</span></span><span class="meta">${st.vol ? st.vol.toLocaleString(S.settings.lang === 'en' ? 'en-GB' : 'pl-PL') + ' kg' : ''}</span></button>`;
  }).join('');
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('history'))}</h1>${list ? `<div class="card">${list}</div>` : `<div class="empty">${esc(t('noSessions'))}</div>`}</main>`;
}
function vSession() {
  const s = S.sessions.find(x => x.id === S.viewArg);
  if (!s) return vHistory();
  const st = sessionStats(s);
  const items = s.items.map(it => {
    const ex = S.ex.get(it.exId);
    const sets = it.sets.filter(x => x.done).map(x => `<span class="tag ${x.kind === 'top' ? 'p' : ''}">${esc(fmtSet(x, ex))}${x.side ? ' ' + esc(x.side === 'L' ? t('left') : t('right')) : ''}${num(x.rpe) ? ' @' + fmtN(num(x.rpe)) : ''}</span>`).join('');
    return `<div class="row" style="flex-direction:column;align-items:flex-start;padding:10px 0;gap:4px"><span class="name">${esc(exName(it.exId))}</span><div>${sets || '<span class="muted small">–</span>'}</div></div>`;
  }).join('');
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="nav" data-v="history" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(fmtDate(s.startedAt))}</div><span style="width:44px"></span></div>
    <h1 class="mid">${esc(s.name)}</h1>
    <div class="stat-row"><div class="stat"><div class="v">${esc(fmtDur(s.endedAt - s.startedAt))}</div><div class="k">${esc(t('duration'))}</div></div><div class="stat"><div class="v">${st.sets}</div><div class="k">${esc(t('setsDone'))}</div></div><div class="stat"><div class="v">${st.vol.toLocaleString(S.settings.lang === 'en' ? 'en-GB' : 'pl-PL')}</div><div class="k">${esc(t('volume'))} kg</div></div></div>
    <div class="card">${items}</div>
    <button class="btn danger block" data-a="session-del" data-v="${s.id}">${esc(t('deleteSession'))}</button></main>`;
}

/* ---------- view: library ---------- */
function filteredExercises(q, pat) {
  const qq = (q || '').trim().toLowerCase();
  return [...S.ex.values()].filter(isVisible)
    .filter(e => !pat || (pat === '__custom' ? e.custom : e.pattern === pat))
    .filter(e => !qq || [e.name_pl, e.name_en].some(n => (n || '').toLowerCase().includes(qq)) || e.primary.some(m => muscleName(m).toLowerCase().includes(qq)))
    .sort((a, b) => exName(a.id).localeCompare(exName(b.id), S.settings.lang));
}
function exRows(list, action, extra = '') {
  return list.map(e => `<button class="list-btn row" data-a="${action}" data-v="${esc(e.id)}" ${extra}><span class="grow"><span class="name">${esc(exName(e.id))}</span><br><span class="meta">${esc(e.primary.map(muscleName).join(', '))} · ${esc(equipName(e.equipment))}</span></span>${S.notes[e.id] && S.notes[e.id].text ? `<span class="tag">${esc(t('note'))}</span>` : ''}</button>`).join('');
}
function patternChips(cur, action) {
  const pats = Object.keys(S.data.patterns);
  return `<div class="chips"><button class="chip ${!cur ? 'on' : ''}" data-a="${action}" data-v="">${esc(t('all'))}</button>${S.customExercises.some(isVisible) ? `<button class="chip ${cur === '__custom' ? 'on' : ''}" data-a="${action}" data-v="__custom">${esc(t('custom'))}</button>` : ''}${pats.map(p => `<button class="chip ${cur === p ? 'on' : ''}" data-a="${action}" data-v="${p}">${esc(patternName(p))}</button>`).join('')}</div>`;
}
function vLibrary() {
  const st = S.lib || (S.lib = { q: '', pat: '' });
  const list = filteredExercises(st.q, st.pat);
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('library'))}</h1>
    <div><label for="libq" class="sr">${esc(t('search'))}</label><input id="libq" type="search" data-f="lib-q" placeholder="${esc(t('search'))}" value="${esc(st.q)}" autocomplete="off"></div>
    ${patternChips(st.pat, 'lib-pat')}
    <button class="btn block" data-a="custom-new">${esc(t('addCustom'))}</button>
    <div class="card" id="liblist">${exRows(list, 'ex-detail')}</div></main>`;
}

/* ---------- sheets ---------- */
function renderSheet() {
  let el = $('#sheet');
  if (!S.sheet) { if (el) el.remove(); document.body.style.overflow = ''; return; }
  if (!el) { el = document.createElement('div'); el.id = 'sheet'; document.body.appendChild(el); }
  const sh = S.sheet;
  let body = '';
  const head = (title) => `<div class="sheet-head"><h2>${esc(title)}</h2><button class="icon-btn" data-a="sheet-close" aria-label="${esc(t('close'))}">${I.x}</button></div>`;
  if (sh.type === 'confirm') {
    body = `${head(sh.title || t('confirm'))}<p style="margin:0">${esc(sh.text)}</p><div class="btn-row"><button class="btn" data-a="sheet-close">${esc(t('cancel'))}</button><button class="btn ${sh.danger ? 'danger' : 'primary'}" data-a="confirm-yes">${esc(sh.yes || t('confirm'))}</button></div>`;
  } else if (sh.type === 'picker') {
    const q = sh.q || '';
    body = `${head(t('addExercise'))}<input id="pickq" type="search" data-f="pick-q" placeholder="${esc(t('search'))}" value="${esc(q)}" autocomplete="off" aria-label="${esc(t('search'))}">
      ${patternChips(sh.pat || '', 'pick-pat')}
      <div class="card" id="picklist">${exRows(filteredExercises(q, sh.pat), 'pick')}</div>`;
  } else if (sh.type === 'item') {
    const it = sh.item;
    const isTop = it.scheme === 'topback';
    body = `${head(exName(it.exId))}
      <div><label>${esc(t('scheme'))}</label><div class="chips"><button class="chip ${!isTop ? 'on' : ''}" data-a="item-scheme" data-v="straight">${esc(t('straight'))}</button><button class="chip ${isTop ? 'on' : ''}" data-a="item-scheme" data-v="topback">${esc(t('topback'))}</button></div></div>
      <div class="info"><h3>${esc(isTop ? t('topback') : t('straight'))}</h3><div>${esc(isTop ? t('topbackInfo') : t('straightInfo'))}</div></div>
      <div class="grid3">
        ${isTop ? '' : fld('it-sets', t('sets'), it.sets)}
        ${fld('it-reps', t('repsTarget'), it.reps, 'text')}
        ${fld('it-rpe', t('rpe'), it.rpe ?? '')}
        ${fld('it-warmups', t('warmups'), it.warmups)}
        ${fld('it-rest', t('rest'), it.rest)}
      </div>
      ${isTop ? `<div class="grid3">${fld('it-backoffSets', t('backoffSets'), it.backoffSets)}${fld('it-backoffReps', t('backoffReps'), it.backoffReps, 'text')}${fld('it-backoffPct', t('backoffPct'), it.backoffPct)}</div>` : ''}
      <button class="btn primary block" data-a="item-save">${esc(t('save'))}</button>`;
  } else if (sh.type === 'schemeInfo') {
    body = `${head(t('whySchemes'))}<div class="info ${sh.cur === 'straight' ? 'sel' : ''}"><h3>${esc(t('straight'))}</h3><div>${esc(t('straightInfo'))}</div></div><div class="info ${sh.cur === 'topback' ? 'sel' : ''}"><h3>${esc(t('topback'))}</h3><div>${esc(t('topbackInfo'))}</div></div>`;
  } else if (sh.type === 'subs') {
    const it = S.active && S.active.items.find(x => x.id === sh.itemId);
    const opts = it ? substitutes(it.exId) : [];
    body = `${head(t('subsTitle'))}<div class="sub">${esc(opts.length ? t('subsText') : t('subsNone'))}</div>
      ${opts.map(c => `<button class="sub-opt" data-a="do-sub" data-v="${esc(c.id)}"><span class="n">${esc(exName(c.id))}</span><span class="muted small">${esc(equipName(c.equipment))} · ${esc(c.primary.map(muscleName).join(', '))}</span></button>`).join('')}
      <button class="btn block" data-a="sub-pick">${esc(t('pickOther'))}</button>`;
  } else if (sh.type === 'note') {
    const n = S.notes[sh.exId];
    body = `${head(exName(sh.exId))}<div><label for="notearea">${esc(t('note'))}</label><textarea id="notearea" rows="5" placeholder="${esc(t('notePh'))}">${esc(n ? n.text : '')}</textarea></div><div class="muted small">${esc(t('noteHint'))}</div>
      <div class="btn-row">${n && n.text ? `<button class="btn danger" data-a="note-del">${esc(t('delete'))}</button>` : ''}<button class="btn primary" data-a="note-save">${esc(t('save'))}</button></div>`;
  } else if (sh.type === 'rest') {
    body = `${head(t('rest'))}<div>${fld('rest-val', t('rest'), sh.val)}</div><div class="chips">${[60, 90, 120, 150, 180, 240, 300].map(v => `<button class="chip ${v === sh.val ? 'on' : ''}" data-a="rest-pick" data-v="${v}">${fmtClock(v)}</button>`).join('')}</div><button class="btn primary block" data-a="rest-save">${esc(t('save'))}</button>`;
  } else if (sh.type === 'menu') {
    body = `${head(sh.title)}${sh.items.map(m => `<button class="btn block ${m.danger ? 'danger' : ''}" data-a="menu-pick" data-v="${m.id}">${esc(m.label)}</button>`).join('')}`;
  } else if (sh.type === 'exDetail') {
    const e = S.ex.get(sh.exId);
    const n = S.notes[sh.exId];
    const subs = substitutes(sh.exId, 3);
    body = `${head(exName(sh.exId))}
      <div class="muted small">${esc(L() ? e.name_pl : e.name_en)}</div>
      <div><label>${esc(t('primary'))}</label>${e.primary.map(m => `<span class="tag p">${esc(muscleName(m))}</span>`).join('')}</div>
      ${e.secondary.length ? `<div><label>${esc(t('secondary'))}</label>${e.secondary.map(m => `<span class="tag">${esc(muscleName(m))}</span>`).join('')}</div>` : ''}
      <div class="grid2"><div><label>${esc(t('pattern'))}</label>${esc(patternName(e.pattern))}</div><div><label>${esc(t('equipment'))}</label>${esc(equipName(e.equipment))}</div><div><label>${esc(t('type'))}</label>${esc(t(e.type))}${e.unilateral ? ' · L/P' : ''}</div><div><label>${esc(t('logging'))}</label>${esc(t('log' + e.logging))}</div></div>
      <button class="note-box ${n && n.text ? '' : 'empty'}" data-a="note" data-v="${esc(e.id)}"><span class="lbl">${esc(t('note'))}</span>${n && n.text ? esc(n.text) : esc(t('notePh'))}</button>
      ${subs.length ? `<div><label>${esc(t('subs'))}</label>${subs.map(c => `<span class="tag">${esc(exName(c.id))}</span>`).join('')}</div>` : ''}
      ${e.custom ? `<div class="btn-row"><button class="btn" data-a="custom-edit" data-v="${esc(e.id)}">${esc(t('edit'))}</button><button class="btn danger" data-a="custom-del" data-v="${esc(e.id)}">${esc(t('deleteExercise'))}</button></div>` : ''}`;
  } else if (sh.type === 'custom') {
    const c = sh.draft;
    const opts = (obj, cur) => Object.entries(obj).map(([k, v]) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${esc(v[L()])}</option>`).join('');
    const mchips = (field, sel) => Object.keys(S.data.muscles).map(m => `<button class="chip ${sel.includes(m) ? 'on' : ''}" data-a="cx-m" data-f2="${field}" data-v="${m}" aria-pressed="${sel.includes(m)}">${esc(muscleName(m))}</button>`).join('');
    body = `${head(sh.editId ? t('edit') : t('addCustom'))}
      <div><label for="cx-pl">${esc(t('namePl'))}</label><input id="cx-pl" data-f="cx" data-k="name_pl" value="${esc(c.name_pl)}"></div>
      <div><label for="cx-en">${esc(t('nameEn'))}</label><input id="cx-en" data-f="cx" data-k="name_en" value="${esc(c.name_en)}"></div>
      <div class="grid2"><div><label for="cx-pat">${esc(t('pattern'))}</label><select id="cx-pat" data-f="cx" data-k="pattern">${opts(S.data.patterns, c.pattern)}</select></div>
      <div><label for="cx-eq">${esc(t('equipment'))}</label><select id="cx-eq" data-f="cx" data-k="equipment">${opts(S.data.equipment, c.equipment)}</select></div>
      <div><label for="cx-type">${esc(t('type'))}</label><select id="cx-type" data-f="cx" data-k="type"><option value="compound" ${c.type === 'compound' ? 'selected' : ''}>${esc(t('compound'))}</option><option value="isolation" ${c.type === 'isolation' ? 'selected' : ''}>${esc(t('isolation'))}</option></select></div>
      <div><label for="cx-log">${esc(t('logging'))}</label><select id="cx-log" data-f="cx" data-k="logging">${['W', 'BWX', 'T', 'WD'].map(k => `<option value="${k}" ${c.logging === k ? 'selected' : ''}>${esc(t('log' + k))}</option>`).join('')}</select></div></div>
      <label style="display:flex;align-items:center;gap:10px;color:var(--text);font-size:15px"><input type="checkbox" style="width:24px;min-height:24px" data-f="cx" data-k="unilateral" ${c.unilateral ? 'checked' : ''}> ${esc(t('unilateral'))}</label>
      <div><label>${esc(t('primary'))}</label><div style="display:flex;flex-wrap:wrap;gap:6px">${mchips('primary', c.primary)}</div></div>
      <div><label>${esc(t('secondary'))}</label><div style="display:flex;flex-wrap:wrap;gap:6px">${mchips('secondary', c.secondary)}</div></div>
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="cx-save">${esc(t('save'))}</button>`;
  } else if (sh.type === 'settings') {
    const st = S.settings;
    body = `${head(t('settings'))}
      <div><label>${esc(t('language'))}</label><div class="chips"><button class="chip ${st.lang === 'pl' ? 'on' : ''}" data-a="lang" data-v="pl">Polski</button><button class="chip ${st.lang === 'en' ? 'on' : ''}" data-a="lang" data-v="en">English</button></div></div>
      <div class="grid2">${fld('st-restC', t('defaultRestC'), st.restC)}${fld('st-restI', t('defaultRestI'), st.restI)}${fld('st-increment', t('increment'), fmtN(st.increment))}${fld('st-backoffPct', t('defaultBackoff'), st.backoffPct)}</div>
      <h2 style="font-size:20px;margin-top:6px">${esc(t('backup'))}</h2><div class="muted small">${esc(t('backupInfo'))}</div>
      <button class="btn block" data-a="export">${esc(t('exportBtn'))}</button>
      <button class="btn block" data-a="export-copy">${esc(t('copyBtn'))}</button>
      <label class="btn block" for="importfile" style="margin:0;color:var(--text);font-size:16px">${esc(t('importBtn'))}</label><input id="importfile" type="file" accept="application/json,.json" hidden>
      <div class="muted small">${esc(t('version'))} ${VERSION} · ${esc(DB.ok ? t('dataLocal') : t('storageOff'))}</div>`;
  }
  el.innerHTML = `<div class="scrim" data-a="scrim"><div class="sheet" role="dialog" aria-modal="true">${body}</div></div>`;
  document.body.style.overflow = 'hidden';
  if (sh.type === 'picker' && sh._focus) { const i = $('#pickq'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}
function fld(id, label, val, type = 'num') {
  return `<div><label for="${id}">${esc(label)}</label><input id="${id}" data-f="${id}" ${type === 'num' ? 'inputmode="decimal"' : ''} value="${esc(val ?? '')}"></div>`;
}

/* ---------- actions ---------- */
function findItem(id) { return S.active ? S.active.items.find(x => x.id === id) : null; }
function tplDay(dId) { const tp = S.templates.find(x => x.id === S.viewArg); return tp ? [tp, tp.days.find(d => d.id === dId)] : [null, null]; }
function ask(text, onYes, opts = {}) { S._onYes = onYes; openSheet({ type: 'confirm', text, ...opts }); }
const saveTemplates = () => persist('templates');
const saveActive = () => persist('active');

const A = {
  nav: el => go(el.dataset.v),
  settings: () => openSheet({ type: 'settings' }),
  'sheet-close': () => closeSheet(),
  scrim: (el, ev) => { if (ev.target === el) closeSheet(); },
  'confirm-yes': () => { const f = S._onYes; closeSheet(); if (f) f(); },
  'menu-pick': el => { const f = S.sheet && S.sheet.handlers && S.sheet.handlers[el.dataset.v]; closeSheet(); if (f) f(); },

  'start-day': () => { const tp = activeTemplate(); const d = S._pickedDay && tp && tp.days.find(x => x.id === S._pickedDay) || nextDay(tp); ensureAudio(); S._pickedDay = null; startSession(tp, d); },
  'start-free': () => { ensureAudio(); startSession(null, null); },
  'pick-day': el => { const tp = activeTemplate(); const d = tp.days.find(x => x.id === el.dataset.v); S._pickedDay = d.id; render(); },

  'new-plan': () => {
    const tp = { id: uid(), name: t('newPlan'), days: [{ id: uid(), name: (S.settings.lang === 'en' ? 'Day ' : 'Dzień ') + 'A', items: [] }], createdAt: now(), updatedAt: now() };
    S.templates.push(tp);
    if (!S.settings.activeTemplateId) { S.settings.activeTemplateId = tp.id; persist('settings'); }
    saveTemplates(); go('plan', tp.id);
  },
  'open-plan': el => go('plan', el.dataset.v),
  'plan-activate': () => { S.settings.activeTemplateId = S.viewArg; persist('settings'); render(); },
  'plan-add-day': () => {
    const tp = S.templates.find(x => x.id === S.viewArg);
    const letter = String.fromCharCode(65 + tp.days.length);
    tp.days.push({ id: uid(), name: (S.settings.lang === 'en' ? 'Day ' : 'Dzień ') + letter, items: [] });
    tp.updatedAt = now(); saveTemplates(); render();
  },
  'plan-menu': () => {
    const tp = S.templates.find(x => x.id === S.viewArg);
    openSheet({ type: 'menu', title: tp.name, items: [{ id: 'dup', label: S.settings.lang === 'en' ? 'Duplicate plan' : 'Duplikuj plan' }, { id: 'del', label: t('deletePlan'), danger: true }],
      handlers: {
        dup: () => { const c = clone(tp); c.id = uid(); c.name += ' (2)'; c.days.forEach(d => { d.id = uid(); d.items.forEach(i => { i.id = uid(); }); }); S.templates.push(c); saveTemplates(); go('plan', c.id); },
        del: () => ask(t('deletePlan') + '?', () => { S.templates = S.templates.filter(x => x.id !== tp.id); if (S.settings.activeTemplateId === tp.id) { S.settings.activeTemplateId = S.templates[0] ? S.templates[0].id : null; persist('settings'); } saveTemplates(); go('plans'); }, { danger: true, yes: t('delete') }),
      } });
  },
  'day-menu': el => {
    const [tp, d] = tplDay(el.dataset.d);
    const i = tp.days.indexOf(d);
    openSheet({ type: 'menu', title: d.name, items: [
      ...(i > 0 ? [{ id: 'up', label: t('moveUp') }] : []), ...(i < tp.days.length - 1 ? [{ id: 'down', label: t('moveDown') }] : []),
      { id: 'dup', label: S.settings.lang === 'en' ? 'Duplicate day' : 'Duplikuj dzień' }, { id: 'del', label: t('deleteDay'), danger: true }],
      handlers: {
        up: () => { tp.days.splice(i, 1); tp.days.splice(i - 1, 0, d); saveTemplates(); render(); },
        down: () => { tp.days.splice(i, 1); tp.days.splice(i + 1, 0, d); saveTemplates(); render(); },
        dup: () => { const c = clone(d); c.id = uid(); c.name += ' (2)'; c.items.forEach(x => { x.id = uid(); }); tp.days.splice(i + 1, 0, c); saveTemplates(); render(); },
        del: () => ask(t('deleteDay') + '?', () => { tp.days = tp.days.filter(x => x.id !== d.id); saveTemplates(); render(); }, { danger: true, yes: t('delete') }),
      } });
  },
  'day-add-ex': el => openSheet({ type: 'picker', target: { kind: 'day', dayId: el.dataset.d } }),
  'edit-item': el => { const [, d] = tplDay(el.dataset.d); const it = d.items.find(x => x.id === el.dataset.i); openSheet({ type: 'item', dayId: d.id, item: clone(it) }); },
  'item-up': el => { const [, d] = tplDay(el.dataset.d); const i = d.items.findIndex(x => x.id === el.dataset.i); if (i > 0) { const [x] = d.items.splice(i, 1); d.items.splice(i - 1, 0, x); saveTemplates(); render(); } },
  'item-del': el => { const [, d] = tplDay(el.dataset.d); d.items = d.items.filter(x => x.id !== el.dataset.i); saveTemplates(); render(); },
  'item-scheme': el => { readItemFields(); S.sheet.item.scheme = el.dataset.v; renderSheet(); },
  'item-save': () => {
    readItemFields();
    const [, d] = tplDay(S.sheet.dayId);
    const i = d.items.findIndex(x => x.id === S.sheet.item.id);
    if (i >= 0) d.items[i] = S.sheet.item;
    saveTemplates(); closeSheet(); render();
  },

  pick: el => {
    const id = el.dataset.v, tg = S.sheet.target;
    if (tg.kind === 'day') { const [, d] = tplDay(tg.dayId); const it = defaultItem(id); d.items.push(it); saveTemplates(); render(); openSheet({ type: 'item', dayId: d.id, item: clone(it) }); }
    else if (tg.kind === 'session') { S.active.items.push(freeItem(id)); saveActive(); closeSheet(); render(); setTimeout(() => { const c = document.querySelectorAll('.ex-card'); c[c.length - 1]?.scrollIntoView({ block: 'start' }); }, 30); }
    else if (tg.kind === 'swap') { doSwap(tg.itemId, id); }
  },
  'pick-pat': el => { S.sheet.pat = el.dataset.v; S.sheet._focus = false; renderSheet(); },
  'lib-pat': el => { S.lib.pat = el.dataset.v; S._libFocus = false; render(); },

  /* workout */
  'session-add-ex': () => openSheet({ type: 'picker', target: { kind: 'session' } }),
  'set-done': el => {
    const it = findItem(el.dataset.i); const s = it.sets.find(x => x.id === el.dataset.s);
    const row = el.closest('.set');
    if (!s.done) {
      // take placeholders as values when fields are empty
      row.querySelectorAll('input').forEach(inp => { if (inp.dataset.k !== 'rpe' && inp.value === '' && inp.placeholder) { s[inp.dataset.k] = inp.placeholder.replace(',', '.'); } });
      s.done = true; s.doneAt = now();
      ensureAudio();
      startTimer(it.rest || S.settings.restI);
    } else { s.done = false; }
    saveActive(); render();
  },
  'add-set': el => {
    const it = findItem(el.dataset.i); const ex = S.ex.get(it.exId);
    const last = it.sets[it.sets.length - 1];
    const kind = last ? (last.kind === 'top' ? 'backoff' : last.kind) : 'work';
    pushSets(it.sets, ex, kind, 1, last ? last.target : null);
    saveActive(); render();
  },
  'del-set': el => { const it = findItem(el.dataset.i); const ex = S.ex.get(it.exId); it.sets.splice(-(ex && ex.unilateral ? 2 : 1)); saveActive(); render(); },
  'scheme-info': el => { const it = findItem(el.dataset.i); openSheet({ type: 'schemeInfo', cur: it.scheme }); },
  subs: el => openSheet({ type: 'subs', itemId: el.dataset.i }),
  'do-sub': el => doSwap(S.sheet.itemId, el.dataset.v),
  'sub-pick': () => { const it = findItem(S.sheet.itemId); openSheet({ type: 'picker', target: { kind: 'swap', itemId: it.id }, pat: (S.ex.get(it.exId) || {}).pattern || '' }); },
  'rest-edit': el => { const it = findItem(el.dataset.i); openSheet({ type: 'rest', itemId: it.id, val: it.rest }); },
  'rest-pick': el => { S.sheet.val = +el.dataset.v; renderSheet(); },
  'rest-save': () => { const v = num($('#rest-val').value); const it = findItem(S.sheet.itemId); if (v && v > 0) it.rest = Math.round(v); saveActive(); closeSheet(); render(); },
  'item-menu': el => {
    const it = findItem(el.dataset.i); const i = S.active.items.indexOf(it);
    openSheet({ type: 'menu', title: exName(it.exId), items: [
      ...(i > 0 ? [{ id: 'up', label: t('moveUp') }] : []), ...(i < S.active.items.length - 1 ? [{ id: 'down', label: t('moveDown') }] : []),
      { id: 'del', label: t('remove'), danger: true }],
      handlers: {
        up: () => { S.active.items.splice(i, 1); S.active.items.splice(i - 1, 0, it); saveActive(); render(); },
        down: () => { S.active.items.splice(i, 1); S.active.items.splice(i + 1, 0, it); saveActive(); render(); },
        del: () => { S.active.items = S.active.items.filter(x => x !== it); saveActive(); render(); },
      } });
  },
  'timer-adj': el => adjustTimer(+el.dataset.v),
  'timer-skip': () => stopTimer(),
  finish: () => {
    const left = S.active.items.reduce((n, it) => n + it.sets.filter(s => !s.done).length, 0);
    ask(t('finishQ', left), () => {
      const s = clone(S.active); s.endedAt = now();
      s.items = s.items.map(it => ({ ...it, sets: it.sets.filter(x => x.done) })).filter(it => it.sets.length);
      if (s.items.length) S.sessions.push(s);
      S.active = null; S.timer = null;
      persist('sessions', 'active');
      toast(t('workoutSaved'));
      go(s.items.length ? 'session' : 'today', s.id);
    }, { yes: t('finish') });
  },
  discard: () => ask(t('discardQ'), () => { S.active = null; S.timer = null; persist('active'); go('today'); }, { danger: true, yes: t('discard') }),

  note: el => openSheet({ type: 'note', exId: el.dataset.v, back: S.sheet }),
  'note-save': () => {
    const v = $('#notearea').value.trim(); const id = S.sheet.exId;
    if (v) S.notes[id] = { text: v, updatedAt: now() }; else delete S.notes[id];
    persist('notes'); const back = S.sheet.back; toast(t('saved'));
    if (back && back.type === 'exDetail') openSheet(back); else closeSheet();
    render();
  },
  'note-del': () => { delete S.notes[S.sheet.exId]; persist('notes'); const back = S.sheet.back; if (back && back.type === 'exDetail') openSheet(back); else closeSheet(); render(); },

  /* history */
  'open-session': el => go('session', el.dataset.v),
  'session-del': el => ask(t('deleteSessionQ'), () => { S.sessions = S.sessions.filter(x => x.id !== el.dataset.v); persist('sessions'); go('history'); }, { danger: true, yes: t('delete') }),

  /* library */
  'ex-detail': el => openSheet({ type: 'exDetail', exId: el.dataset.v }),
  'custom-new': () => openSheet({ type: 'custom', draft: { name_pl: '', name_en: '', pattern: 'HPUSH', equipment: 'DB', type: 'compound', logging: 'W', unilateral: false, primary: [], secondary: [] } }),
  'custom-edit': el => { const e = S.customExercises.find(x => x.id === el.dataset.v); openSheet({ type: 'custom', editId: e.id, draft: clone(e) }); },
  'cx-m': el => {
    readCustomFields();
    const f = el.dataset.f2, o = f === 'primary' ? 'secondary' : 'primary', m = el.dataset.v, d = S.sheet.draft;
    if (d[f].includes(m)) d[f] = d[f].filter(x => x !== m); else { d[f].push(m); d[o] = d[o].filter(x => x !== m); }
    renderSheet();
  },
  'cx-save': () => {
    readCustomFields();
    const d = S.sheet.draft;
    if (!d.name_pl.trim() && !d.name_en.trim()) { S.sheet.err = t('nameRequired'); renderSheet(); return; }
    if (!d.primary.length) { S.sheet.err = t('primaryRequired'); renderSheet(); return; }
    d.name_pl = d.name_pl.trim() || d.name_en.trim(); d.name_en = d.name_en.trim() || d.name_pl;
    if (S.sheet.editId) { const i = S.customExercises.findIndex(x => x.id === S.sheet.editId); S.customExercises[i] = { ...d, updatedAt: now() }; }
    else S.customExercises.push({ ...d, id: 'custom-' + uid(), createdAt: now(), updatedAt: now() });
    persist('customExercises'); rebuildExercises(); closeSheet(); toast(t('saved')); render();
  },
  'custom-del': el => {
    const id = el.dataset.v;
    const used = S.sessions.some(s => s.items.some(i => i.exId === id)) || S.templates.some(tp => tp.days.some(d => d.items.some(i => i.exId === id)));
    ask(used ? t('usedIn') : t('deleteExercise') + '?', () => {
      if (used) { const e = S.customExercises.find(x => x.id === id); e.hidden = true; }
      else S.customExercises = S.customExercises.filter(x => x.id !== id);
      persist('customExercises'); rebuildExercises(); render();
    }, { danger: true, yes: t('delete') });
  },

  /* settings */
  lang: el => { readSettingsFields(); S.settings.lang = el.dataset.v; document.documentElement.lang = S.settings.lang; persist('settings'); render(); },
  export: () => {
    readSettingsFields();
    try {
      const blob = new Blob([JSON.stringify(backupObj(), null, 1)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `repsmith-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast(t('exported'));
    } catch (e) { toast(String(e)); }
  },
  'export-copy': async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(backupObj())); toast(t('copied')); } catch (e) { toast('✕'); }
  },
};

function doSwap(itemId, newExId) {
  const it = findItem(itemId); const ex = S.ex.get(newExId);
  const kinds = []; it.sets.filter(s => s.side !== 'R').forEach(s => kinds.push({ kind: s.kind, target: s.target, done: s.done }));
  it.exId = newExId; it.sets = [];
  kinds.forEach(k => pushSets(it.sets, ex, k.kind, 1, k.target));
  saveActive(); closeSheet(); render();
}
function readItemFields() {
  const it = S.sheet.item; const g = id => { const e = $('#' + id); return e ? e.value : undefined; };
  const n = (id, dflt) => { const v = g(id); if (v === undefined) return dflt; const x = num(v); return x == null ? dflt : x; };
  it.sets = Math.max(1, Math.round(n('it-sets', it.sets)));
  if (g('it-reps') !== undefined) it.reps = g('it-reps').trim();
  const rpe = g('it-rpe'); if (rpe !== undefined) it.rpe = num(rpe);
  it.warmups = Math.max(0, Math.round(n('it-warmups', it.warmups)));
  it.rest = Math.max(10, Math.round(n('it-rest', it.rest)));
  it.backoffSets = Math.max(0, Math.round(n('it-backoffSets', it.backoffSets)));
  if (g('it-backoffReps') !== undefined) it.backoffReps = g('it-backoffReps').trim();
  it.backoffPct = Math.min(100, Math.max(40, n('it-backoffPct', it.backoffPct)));
}
function readCustomFields() {
  const d = S.sheet.draft;
  document.querySelectorAll('[data-f="cx"]').forEach(e => { d[e.dataset.k] = e.type === 'checkbox' ? e.checked : e.value; });
}
function readSettingsFields() {
  if (!S.sheet || S.sheet.type !== 'settings') return;
  const st = S.settings; const g = id => num(($('#' + id) || {}).value);
  st.restC = Math.max(10, Math.round(g('st-restC') ?? st.restC));
  st.restI = Math.max(10, Math.round(g('st-restI') ?? st.restI));
  st.increment = Math.max(0.25, g('st-increment') ?? st.increment);
  st.backoffPct = Math.min(100, Math.max(40, g('st-backoffPct') ?? st.backoffPct));
  persist('settings');
}
function backupObj() {
  return { app: 'repsmith', schema: SCHEMA, version: VERSION, exportedAt: new Date().toISOString(),
    settings: S.settings, templates: S.templates, sessions: S.sessions, notes: S.notes, customExercises: S.customExercises, active: S.active };
}
async function importBackup(text) {
  let o;
  try { o = JSON.parse(text); } catch (e) { o = null; }
  if (!o || o.app !== 'repsmith' || !Array.isArray(o.sessions)) { toast(t('importErr')); return; }
  ask(t('importQ'), async () => {
    S.settings = { ...S.settings, ...o.settings }; S.templates = o.templates || []; S.sessions = o.sessions || [];
    S.notes = o.notes || {}; S.customExercises = o.customExercises || []; S.active = o.active || null;
    await persist(...KEYS); rebuildExercises(); toast(t('imported')); go('today');
  }, { yes: t('confirm') });
}

/* ---------- events ---------- */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-a]');
  if (!el) return;
  const fn = A[el.dataset.a];
  if (!fn) return;
  if (el.dataset.a === 'scrim') { if (ev.target === el) closeSheet(); return; }
  fn(el, ev);
});
document.addEventListener('input', ev => {
  const el = ev.target; const f = el.dataset.f;
  if (!f) return;
  if (f === 'set') {
    const it = findItem(el.dataset.i); if (!it) return;
    const s = it.sets.find(x => x.id === el.dataset.s); s[el.dataset.k] = el.value.replace(',', '.');
    clearTimeout(S._saveT); S._saveT = setTimeout(saveActive, 400);
  } else if (f === 'lib-q') {
    S.lib.q = el.value; const l = $('#liblist'); if (l) l.innerHTML = exRows(filteredExercises(S.lib.q, S.lib.pat), 'ex-detail');
  } else if (f === 'pick-q') {
    S.sheet.q = el.value; const l = $('#picklist'); if (l) l.innerHTML = exRows(filteredExercises(S.sheet.q, S.sheet.pat), 'pick');
  } else if (f === 'plan-name') {
    const tp = S.templates.find(x => x.id === S.viewArg); tp.name = el.value; tp.updatedAt = now(); clearTimeout(S._tT); S._tT = setTimeout(saveTemplates, 400);
  } else if (f === 'day-name') {
    const [tp, d] = tplDay(el.dataset.d); d.name = el.value; tp.updatedAt = now(); clearTimeout(S._tT); S._tT = setTimeout(saveTemplates, 400);
  }
});
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.id === 'importfile' && el.files && el.files[0]) {
    const r = new FileReader(); r.onload = () => importBackup(String(r.result)); r.readAsText(el.files[0]); el.value = '';
  } else if (el.id && el.id.startsWith('st-')) readSettingsFields();
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && S.sheet) closeSheet();
  if (ev.key === 'Enter' && ev.target.matches('.set input')) {
    const all = [...document.querySelectorAll('.set input')]; const i = all.indexOf(ev.target);
    if (all[i + 1]) { ev.preventDefault(); all[i + 1].focus(); }
  }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && S.active) saveActive(); });

/* ---------- boot ---------- */
async function loadData() {
  if (window.REPSMITH_DATA) return window.REPSMITH_DATA;
  const r = await fetch('data/exercises.json'); return r.json();
}
async function boot() {
  const [data] = await Promise.all([loadData(), DB.open()]);
  S.data = data;
  for (const k of KEYS) {
    const v = await DB.get(k);
    if (v !== undefined && v !== null) S[k] = k === 'settings' ? { ...S.settings, ...v } : v;
  }
  rebuildExercises();
  document.documentElement.lang = S.settings.lang;
  if (S.active) S.view = 'workout';
  render();
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.REPSMITH_DATA) {
    try { navigator.serviceWorker.register('sw.js'); } catch (e) {}
  }
  if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persist(); } catch (e) {} }
}
window.Repsmith = { S, A, substitutes };
boot();
})();
