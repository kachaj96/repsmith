'use strict';
/* Repsmith strength blocks: fixed-length plans with week-by-week tables (% of 1RM on the main lifts).
   Own tables, written for Repsmith. Loaded after plans.js and before coach.js; adds goal "Peak" to the library. */
(function () {
const P = window.REPSMITH_PLANS; if (!P) return;

/* main lift with a week table: rows = [sets, reps, pct] per week, null = same as week 1 (deload weeks reuse an earlier row) */
function main(exId, rows, extra = {}) {
  const [s0, r0, p0] = rows[0];
  const wk = {};
  rows.forEach((r, i) => {
    if (i === 0 || !r) return;
    const o = {};
    if (r[0] !== s0) o.sets = r[0];
    if (String(r[1]) !== String(r0)) o.reps = String(r[1]);
    if (r[2] !== p0) o.pct = r[2];
    if (r[3]) Object.assign(o, r[3]);
    if (Object.keys(o).length) wk[i + 1] = o;
  });
  return { exId, method: 'P2', kind: 'main', scheme: 'straight', sets: s0, reps: String(r0), pct: p0, rpe: null, rpeMax: null, rest: extra.rest || 180, warmups: extra.warmups ?? 3, wk };
}
/* accessory driven by RPE and a rep range; sets per week optional */
function acc(exId, sets, reps, rpe, setsByWeek = {}, rest = 120) {
  const wk = {};
  for (const [w, n] of Object.entries(setsByWeek)) wk[w] = { sets: n };
  return { exId, method: 'H1', kind: 'comp', scheme: 'straight', sets, reps, rpe, rpeMax: rpe, rest, warmups: 0, wk };
}
const shift = (rows, d) => rows.map(r => (r ? [r[0], r[1], Math.round((r[2] + d) * 2) / 2, r[3]] : r));
const TEST = { cue: ['Test 1RM: rozgrzej się jak przed zawodami. Pierwsza seria to otwarcie około 90% starego maksa, druga około 95-97%, trzecia to próba nowego maksa. Zapisz każdą próbę, także nieudaną (0 powtórzeń).', 'Test 1RM: warm up like for a meet. First set is an opener around 90% of the old max, second around 95-97%, third is the new max attempt. Log every attempt, including a miss (0 reps).'], test: true };

/* ---------- 4 weeks: one wave, week 4 deload ---------- */
const sq4 = [[4, 6, 70], [4, 5, 75], [4, 4, 80], [4, 6, 70]];
const bp4 = [[4, 6, 70], [4, 5, 75], [4, 4, 80], [4, 6, 70]];
const bpH4 = [[4, 4, 75], [4, 3, 80], [4, 2, 85], [4, 4, 75]];
const dl4 = [[3, 5, 70], [3, 4, 75], [3, 3, 80], [3, 5, 70]];
const PEAK4 = {
  id: 'PEAK-4', goal: 'Peak', days: 3, perWeek: 3, reqCap: 75, needs1RM: true,
  name: ['Blok siłowy 4 tyg.', 'Strength block 4 wk'],
  for: ['Znasz technikę przysiadu, wyciskania i martwego ciągu, masz aktualne maksy i chcesz prostej fali z procentami zamiast autoregulacji.', 'You know the squat, bench and deadlift, have current maxes and want a simple percentage wave instead of autoregulation.'],
  design: ['Trzy tygodnie narastania: mniej powtórzeń, więcej kilogramów. Czwarty tydzień to deload. Przysiad dwa razy w tygodniu (ciężki i lżejszy dzień), wyciskanie dwa razy, martwy ciąg raz. Akcesoria idą po RPE. Po deloadzie powtórz blok z wyższymi maksami.', 'Three weeks of build-up: fewer reps, more weight. Week four is a deload. Squat twice a week (heavy and lighter day), bench twice, deadlift once. Accessories run by RPE. After the deload repeat the block with higher maxes.'],
  warning: null,
  cycle: { type: 'fixed', weeks: 4, deload: { mode: 'weeks', weeks: [4], sets: 40, load: 10 } },
  sessions: [
    { name: ['Przysiad + wyciskanie', 'Squat + Bench'], items: [main('squat', sq4, { rest: 210 }), main('bench-press', bp4), acc('barbell-row', 3, '8-10', 8)] },
    { name: ['Martwy ciąg + wyciskanie nad głowę', 'Deadlift + Press'], items: [main('deadlift', dl4, { rest: 210 }), acc('overhead-press', 3, '6-8', 8), acc('lat-pulldown', 3, '8-12', 8)] },
    { name: ['Lżejszy przysiad + ciężkie wyciskanie', 'Light squat + Heavy bench'], items: [main('squat', shift(sq4, -10), { warmups: 2 }), main('bench-press', bpH4), acc('romanian-deadlift', 3, '8-10', 7)] },
  ],
};

/* ---------- 8 weeks: volume wave, deload, intensity wave, heavy finish ---------- */
const sq8 = [[5, 5, 70], [5, 5, 72.5], [5, 4, 77.5], [5, 5, 70], [4, 3, 80], [4, 3, 82.5], [4, 2, 85], [3, 2, 87.5]];
const bp8 = [[5, 5, 70], [5, 5, 72.5], [5, 4, 77.5], [5, 5, 70], [4, 3, 80], [4, 3, 82.5], [4, 2, 85], [3, 2, 87.5]];
const dl8 = [[3, 5, 70], [3, 5, 72.5], [3, 4, 77.5], [3, 5, 70], [3, 3, 80], [3, 3, 82.5], [3, 2, 85], [2, 2, 87.5]];
const PEAK8 = {
  id: 'PEAK-8', goal: 'Peak', days: 3, perWeek: 3, reqCap: 80, needs1RM: true,
  name: ['Fala siłowa 8 tyg.', 'Strength wave 8 wk'],
  for: ['Masz za sobą co najmniej rok regularnego treningu siłowego i chcesz dwóch fal: najpierw objętość, potem ciężar.', 'At least a year of steady strength training and you want two waves: volume first, then load.'],
  design: ['Tygodnie 1-3 budują objętość (5 serii po 4-5 powtórzeń). Tydzień 4 to deload. Tygodnie 5-7 podnoszą ciężar i obcinają powtórzenia, tydzień 8 to ciężkie dwójki przy małej objętości. Po tym bloku zrób deload albo test maksa.', 'Weeks 1-3 build volume (5 sets of 4-5). Week 4 is a deload. Weeks 5-7 raise the load and cut reps, week 8 is heavy doubles at low volume. After this block deload or test your max.'],
  warning: null,
  cycle: { type: 'fixed', weeks: 8, deload: { mode: 'weeks', weeks: [4], sets: 40, load: 10 } },
  sessions: [
    { name: ['Przysiad + wyciskanie', 'Squat + Bench'], items: [main('squat', sq8, { rest: 210 }), main('bench-press', bp8), acc('barbell-row', 3, '8-10', 8, { 8: 2 })] },
    { name: ['Martwy ciąg + wyciskanie nad głowę', 'Deadlift + Press'], items: [main('deadlift', dl8, { rest: 240 }), acc('overhead-press', 3, '6-8', 8, { 8: 2 }), acc('lat-pulldown', 3, '8-12', 8, { 8: 2 })] },
    { name: ['Lżejszy przysiad + wyciskanie', 'Light squat + Bench'], items: [main('squat', shift(sq8, -10), { warmups: 2 }), main('close-grip-bench-press', shift(bp8, -10), { warmups: 2 }), acc('romanian-deadlift', 3, '8-10', 7, { 8: 2 })] },
  ],
};

/* ---------- 12 weeks: build, strength, peak, taper, 1RM test ---------- */
const sq12 = [[5, 6, 67.5], [5, 6, 70], [5, 5, 72.5], [5, 6, 67.5], [5, 4, 77.5], [4, 4, 80], [4, 3, 82.5], [5, 4, 77.5], [4, 2, 87.5], [3, 1, 92.5], [2, 2, 85], [3, 1, 90, TEST]];
const bp12 = sq12;
const dl12 = [[3, 5, 70], [3, 5, 72.5], [3, 4, 75], [3, 5, 70], [3, 4, 77.5], [3, 3, 80], [3, 3, 82.5], [3, 4, 77.5], [3, 2, 87.5], [2, 1, 92.5], [2, 2, 85], [3, 1, 90, TEST]];
const light12 = [[3, 5, 60], [3, 5, 62.5], [3, 5, 65], [3, 5, 60], [3, 4, 67.5], [3, 4, 70], [3, 3, 72.5], [3, 4, 67.5], [3, 3, 72.5], [2, 2, 75], [2, 2, 70], [2, 2, 60]];
const lightBp12 = [[4, 6, 65], [4, 6, 67.5], [4, 5, 70], [4, 6, 65], [4, 5, 72.5], [4, 4, 75], [4, 4, 77.5], [4, 5, 72.5], [3, 3, 80], [3, 2, 82.5], [2, 3, 70], [2, 3, 60]];
const PEAK12 = {
  id: 'PEAK-12', goal: 'Peak', days: 3, perWeek: 3, reqCap: 80, needs1RM: true,
  name: ['Pod test 1RM, 12 tyg.', '1RM test prep, 12 wk'],
  for: ['Chcesz sprawdzić nowe maksy w przysiadzie, wyciskaniu i martwym ciągu, na zawodach albo na własnej sali. Masz za sobą co najmniej rok treningu siłowego.', 'You want to test new maxes in squat, bench and deadlift, at a meet or in your own gym. At least a year of strength training behind you.'],
  design: ['Tygodnie 1-3: objętość. Tydzień 4: deload. Tygodnie 5-7: siła, mniej powtórzeń. Tydzień 8: deload. Tygodnie 9-10: ciężkie dwójki i single. Tydzień 11: tapering, objętość w dół, intensywność zostaje. Tydzień 12: test 1RM w przysiadzie i wyciskaniu (dzień 1) oraz martwym ciągu (dzień 2). Po teście aplikacja zaproponuje zapisanie nowych maksów.', 'Weeks 1-3: volume. Week 4: deload. Weeks 5-7: strength, fewer reps. Week 8: deload. Weeks 9-10: heavy doubles and singles. Week 11: taper, volume down, intensity kept. Week 12: 1RM test in squat and bench (day 1) and deadlift (day 2). After the test the app offers to save the new maxes.'],
  warning: null,
  cycle: { type: 'fixed', weeks: 12, deload: { mode: 'weeks', weeks: [4, 8], sets: 40, load: 10 } },
  sessions: [
    { name: ['Przysiad + wyciskanie', 'Squat + Bench'], items: [main('squat', sq12, { rest: 240, warmups: 4 }), main('bench-press', bp12, { rest: 210, warmups: 4 }), acc('barbell-row', 3, '8-10', 8, { 9: 2, 10: 2, 11: 1, 12: 0 })] },
    { name: ['Martwy ciąg + wyciskanie nad głowę', 'Deadlift + Press'], items: [main('deadlift', dl12, { rest: 240, warmups: 4 }), acc('overhead-press', 3, '6-8', 8, { 9: 2, 10: 2, 11: 1, 12: 0 }), acc('lat-pulldown', 3, '8-12', 8, { 9: 2, 10: 2, 11: 1, 12: 0 })] },
    { name: ['Lżejszy przysiad + wyciskanie', 'Light squat + Bench'], items: [main('squat', light12, { warmups: 2 }), main('bench-press', lightBp12, { warmups: 2 }), acc('romanian-deadlift', 3, '8-10', 7, { 9: 2, 10: 2, 11: 0, 12: 0 })] },
  ],
};

for (const p of [PEAK4, PEAK8, PEAK12]) {
  if (!P.plans.some(x => x.id === p.id)) P.plans.push(p);
}
P.goalName.Peak = ['Bloki siłowe', 'Strength blocks'];
P.deload.Peak = ['Deload jest wpisany w tygodnie planu (oznaczone D): serie mniej o 40%, ciężar mniej o 10%. Zmienisz to w ustawieniach cyklu.', 'The deload is written into the plan weeks (marked D): 40% fewer sets, 10% less weight. Change it in the cycle settings.'];
})();
