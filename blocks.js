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

/* ---------- 12 weeks: bench + upper body (Adrian's plan) ----------
   Mon heavy bench, Wed OHP/legs (light bench in the taper), Fri bench variant + arms. Week 4 deload, 5-8 strength, 9-11 taper, 12 test.
   An item is written once (base) plus a table of 12 weeks: undefined = same as base, 0 = skipped that week, object = overrides.
   Variants and accessories run by RPE (their own 1RM is unknown); only the bench is %-based. */
const WARM = ['Rozgrzewka 3-4 min: kot-wielbłąd, mostek biodrowy, rotacje zewnętrzne barków z gumą. Po nocy i długim siedzeniu zrób ją dokładnie.', 'Warm-up 3-4 min: cat-camel, hip bridge, band external rotations. Do it properly after a night or long sitting.'];
const cue = (pl, en) => [WARM[0] + ' ' + pl, WARM[1] + ' ' + en];
const week12 = (rows, base) => {
  const wk = {};
  rows.forEach((r, i) => {
    if (r == null) return;
    const o = {};
    if (r === 0) o.sets = 0;
    else for (const [k, v] of Object.entries(r)) if (String(v) !== String(base[k] ?? '')) o[k] = v;
    if (Object.keys(o).length) wk[i + 1] = o;
  });
  return wk;
};
/* sets per week from four values: weeks 1-4, 5-8, 9-11, 12 (null/0 = skipped); equal to the base sets = no override */
const ph = (a, b, c, d) => [a, a, a, a, b, b, b, b, c, c, c, d].map(n => (n === 0 ? 0 : { sets: n }));
function bi12(exId, base, rows, extra = {}) {
  const it = { exId, scheme: 'straight', method: 'H1', kind: 'comp', sets: 3, reps: '6-8', rpe: 8, rpeMax: 9, rest: 150, warmups: 0, ...base, ...extra };
  it.wk = week12(rows || [], it);
  return it;
}
const comp = (exId, reps, rpe, rpeMax, sets, extra = {}) => bi12(exId, { reps, rpe, rpeMax, sets: sets.find(x => x) ? sets.find(x => x).sets : 3 }, sets, extra);
const iso = (exId, reps, sets, extra = {}) => bi12(exId, { kind: 'iso', reps, rpe: 9, rpeMax: 10, rest: 90, sets: sets.find(x => x).sets }, sets, extra);

const benchRows = [
  { reps: '8', pct: 70, backoffSets: 3, cue: cue('Cztery serie tym samym ciężarem. Pierwsza to „top”, reszta bez zmiany ciężaru.', 'Four sets at the same weight. The first is the "top" set, the rest stay at that weight.') },
  { reps: '7', pct: 75 },
  { reps: '6', pct: 79 },
  { reps: '6', pct: 79, backoffSets: 2 },
  { reps: '5', pct: 81, backoffSets: 3, backoffReps: '7', backoffPct: 93, cue: cue('Top set na RPE 8, potem 3 back-offy na 93% ciężaru top setu (ok. RPE 7,5). Przerwa 3-4 min.', 'Top set at RPE 8, then 3 back-offs at 93% of the top weight (about RPE 7.5). Rest 3-4 min.') },
  { reps: '4', pct: 85, backoffSets: 3, backoffReps: '6', backoffPct: 93, cue: cue('Top set na RPE 8,5, potem 3 back-offy na 93% (ok. RPE 8). Przerwa 3-4 min.', 'Top set at RPE 8.5, then 3 back-offs at 93% (about RPE 8). Rest 3-4 min.') },
  { reps: '3', pct: 89, backoffSets: 3, backoffReps: '4', backoffPct: 93, cue: cue('Top set na RPE 9, potem 3 back-offy na 93% (ok. RPE 7,5). Przerwa 3-4 min.', 'Top set at RPE 9, then 3 back-offs at 93% (about RPE 7.5). Rest 3-4 min.') },
  { reps: '5', pct: 81, backoffSets: 4, backoffReps: '7', backoffPct: 93, cue: cue('Tydzień zmęczenia celowo: top set na RPE 8 i 4 back-offy na 93% (ok. RPE 7,5).', 'Planned fatigue week: top set at RPE 8 and 4 back-offs at 93% (about RPE 7.5).') },
  { reps: '4', pct: 82, backoffSets: 2, cue: cue('Taper. Trzy serie po 4 na RPE 7,5, tym samym ciężarem.', 'Taper. Three sets of 4 at RPE 7.5, same weight.') },
  { reps: '3', pct: 88, backoffSets: 2, cue: cue('Trzy serie po 3 na RPE 8,5, tym samym ciężarem.', 'Three sets of 3 at RPE 8.5, same weight.') },
  { reps: '2', pct: 92, backoffSets: 1, cue: cue('Dwie serie po 2 na RPE 9. Na koniec tygodnia przelicz e1RM z tych serii, od tego liczysz test.', 'Two sets of 2 at RPE 9. At the end of the week recalculate e1RM from these sets, the test is based on it.') },
  { reps: '2', pct: 83, backoffSets: 2, cue: cue('Trzy serie po 2 lekko (RPE 6). W piątek test, dziś bez kombinowania.', 'Three easy sets of 2 (RPE 6). Test on Friday, keep it simple today.') },
];
const bench12 = { exId: 'bench-press', scheme: 'topback', method: 'P2', kind: 'main', sets: 1, reps: '8', pct: 70, rpe: null, rpeMax: null, backoffSets: 3, backoffReps: '', backoffPct: 100, rest: 180, warmups: 4, cue: benchRows[0].cue };
bench12.wk = week12(benchRows, bench12);
const BENCH_START = ['Start: ok. 92% ciężaru zwykłego benchu na te same powtórzenia, dalej RPE.', 'Start: about 92% of your normal bench weight for the same reps, then go by RPE.'];

const lightBench = bi12('bench-press', { kind: 'comp', method: 'P2', reps: '5', pct: 75, rpe: null, rpeMax: null, sets: 3, rest: 150, warmups: 2, group: 'g1', cue: cue('Szybko i czysto. To nie jest dzień na ciężar.', 'Fast and clean. Not a day for load.') },
  [0, 0, 0, 0, 0, 0, 0, 0, { sets: 3 }, { sets: 3, reps: '4', pct: 79 }, { sets: 2, reps: '3', pct: 81 }, { sets: 2, reps: '3', pct: 65 }]);
const cgBench = bi12('close-grip-bench-press', { kind: 'comp', method: 'P3', reps: '8', rpe: 7.5, rpeMax: 7.5, sets: 3, rest: 165, warmups: 2, cue: cue(BENCH_START[0], BENCH_START[1]) },
  [{ reps: '8', rpe: 7.5 }, { reps: '7', rpe: 8 }, { reps: '6', rpe: 8 }, { reps: '6', rpe: 8 }, 0, 0, 0, 0, 0, 0, 0, 0]);
const spoto = bi12('paused-bench-press', { kind: 'comp', method: 'P3', reps: '5', rpe: 8, rpeMax: 8, sets: 3, rest: 165, warmups: 2, cue: cue('Spoto: pauza 1 s kilka cm nad klatką. Start: ok. 92% ciężaru zwykłego benchu, dalej RPE.', 'Spoto: 1 s pause a few cm above the chest. Start: about 92% of your normal bench weight, then go by RPE.') },
  [0, 0, 0, 0, { reps: '5', rpe: 8 }, { reps: '5', rpe: 8.5 }, { reps: '4', rpe: 9 }, { sets: 4, reps: '4', rpe: 8 },
    { reps: '3', rpe: 6, cue: cue('Spoto lekko (RPE 6, ok. 75% benchu). Taper, bez walki.', 'Spoto light (RPE 6, about 75% of bench). Taper, no grinding.') },
    { reps: '3', rpe: 6, cue: cue('Spoto lekko (RPE 6, ok. 75% benchu). Taper, bez walki.', 'Spoto light (RPE 6, about 75% of bench). Taper, no grinding.') },
    { sets: 2, reps: '3', rpe: 6, cue: cue('Spoto lekko (RPE 6, ok. 75% benchu). Taper, bez walki.', 'Spoto light (RPE 6, about 75% of bench). Taper, no grinding.') }, 0]);
const benchTest = bi12('bench-press', { kind: 'main', method: 'P2', reps: '1', pct: 95, rpe: null, rpeMax: null, sets: 3, rest: 270, warmups: 5 },
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, { reps: '1', pct: 95, test: true, cue: cue('Test 1RM. Rampa rozgrzewek do ok. 92%, potem trzy próby: pierwsza ok. 95% e1RM, druga ok. 100%, trzecia 100-104% (przeliczone po T11). Jeśli druga była RPE 10, trzeciej nie dokładasz. Przerwy 4-5 min, spotter albo bezpieczniki. Zapisz każdą próbę, także nieudaną (0 powtórzeń).', 'Test 1RM. Warm-up ramp to about 92%, then three attempts: first about 95% of e1RM, second about 100%, third 100-104% (recalculated after week 11). If the second was RPE 10, do not add a third. Rest 4-5 min, spotter or safeties. Log every attempt, including a miss (0 reps).') }]);

const BENCH12 = {
  id: 'PEAK-BENCH-12', goal: 'Peak', days: 3, perWeek: 3, reqCap: 60, needs1RM: true,
  name: ['Bench + góra, 12 tyg.', 'Bench + upper body, 12 wk'],
  for: ['Chcesz podnieść wyciskanie leżąc i zbudować masę górnej części ciała w trzech treningach po maks. 60 min, z testem 1RM w ostatnim tygodniu. Plan oszczędza dolne plecy: leg press z ograniczoną głębokością, wiosła tylko z podparciem klatki.', 'You want a stronger bench and more upper body mass in three sessions of 60 min at most, with a 1RM test in the last week. The plan spares the lower back: leg press with limited depth, rows only with chest support.'],
  design: ['Poniedziałek ciężki bench, środa OHP, plecy i nogi, piątek wariant benchu i ręce. Ćwiczenia dodatkowe w niskich zakresach (6-8 tam, gdzie ruch na to pozwala), izolacje wyżej, ostatnia seria blisko upadku. Tygodnie 1-3: objętość (4 serie po 8-6). Tydzień 4: deload, połowa serii. Tygodnie 5-8: top set plus back-offy na 93% ciężaru top setu z większą liczbą powtórzeń, w tygodniu 8 cztery back-offy. Tydzień 9: mniejsza objętość, tygodnie 10-11: taper z ciężkimi seriami. Tydzień 12: test 1RM w piątek. Przelicz e1RM po tygodniu 11.', 'Monday heavy bench, Wednesday OHP, back and legs, Friday a bench variant and arms. Accessories use low rep ranges where the movement allows (6-8), isolations higher, last set close to failure. Weeks 1-3: volume (4 sets of 8-6). Week 4: deload, half the sets. Weeks 5-8: a top set plus back-offs at 93% of the top weight for more reps, four back-offs in week 8. Week 9: lower volume, weeks 10-11: taper with heavy sets. Week 12: 1RM test on Friday. Recalculate e1RM after week 11.'],
  warning: null,
  cycle: { type: 'fixed', weeks: 12, deload: { mode: 'weeks', weeks: [4], sets: 50, load: 0 } },
  sessions: [
    { name: ['Ciężki bench', 'Heavy bench'], items: [
      bench12,
      comp('incline-dumbbell-press', '6-8', 8, 9, ph(3, 3, 2, 0)),
      comp('chest-supported-dumbbell-row', '6-8', 8, 10, ph(3, 3, 2, 2), { group: 'g1' }),
      iso('dumbbell-lateral-raise', '12-15', ph(3, 3, 2, 2), { group: 'g1' }),
      iso('one-arm-overhead-cable-triceps-extension', '8-12', ph(3, 3, 2, 0)),
    ] },
    { name: ['OHP, plecy, nogi', 'OHP, back, legs'], items: [
      comp('overhead-press', '6-8', 8, 9, ph(3, 3, 0, 0), { group: 'g1', warmups: 2, cue: cue('Żebra w dół, pośladki spięte.', 'Ribs down, glutes tight.') }),
      lightBench,
      comp('pull-up', '6-8', 8, 9, [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0].map(n => (n ? { sets: n } : 0)), { group: 'g1' }),
      comp('leg-press', '8-12', 8, 9, ph(3, 3, 2, 0), { warmups: 1, cue: ['Ogranicz głębokość: zatrzymaj ruch, zanim miednica odrywa się od oparcia. Ból pleców powyżej 3/10 albo rosnący w trakcie: zmień ćwiczenie.', 'Limit the depth: stop before the pelvis lifts off the pad. Back pain above 3/10 or growing during the exercise: change the exercise.'] }),
      iso('pec-deck', '8-12', ph(3, 3, 2, 0), { group: 'g2' }),
      iso('reverse-pec-deck', '12-15', ph(3, 3, 2, 0), { group: 'g2' }),
      iso('seated-leg-curl', '8-12', ph(3, 3, 2, 0), { group: 'g3' }),
      iso('dumbbell-lateral-raise', '12-15', ph(3, 3, 2, 0), { group: 'g3' }),
    ] },
    { name: ['Wariant benchu i ręce', 'Bench variant and arms'], items: [
      cgBench,
      spoto,
      benchTest,
      comp('machine-row', '6-8', 8, 10, ph(3, 3, 2, 0), { group: 'g1' }),
      iso('dumbbell-lateral-raise', '12-15', ph(3, 3, 2, 0), { group: 'g1' }),
      comp('lat-pulldown', '6-8', 8, 10, ph(3, 3, 2, 0)),
      iso('skull-crusher', '8-12', ph(3, 3, 2, 0), { group: 'g2' }),
      iso('one-arm-preacher-curl', '8-12', ph(3, 3, 2, 0), { group: 'g2' }),
      iso('hammer-curl', '8-12', [{ sets: 2 }, null, null, null, null, null, null, null, null, null, { sets: 1 }, 0]),
    ] },
  ],
};

for (const p of [PEAK4, PEAK8, PEAK12, BENCH12]) {
  if (!P.plans.some(x => x.id === p.id)) P.plans.push(p);
}
P.goalName.Peak = ['Bloki siłowe', 'Strength blocks'];
P.deload.Peak = ['Deload jest wpisany w tygodnie planu (oznaczone D): serie mniej o 40%, ciężar mniej o 10%. Zmienisz to w ustawieniach cyklu.', 'The deload is written into the plan weeks (marked D): 40% fewer sets, 10% less weight. Change it in the cycle settings.'];
})();
