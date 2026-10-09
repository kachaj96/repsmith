/* Repsmith v0.1 · local-first training log. No accounts, data lives in IndexedDB on the device. */
(() => {
'use strict';

const VERSION = '0.5.2';
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
    topbackInfo: 'Jedna ciężka seria (top set) na zadane RPE, potem lżejsze serie (backoff) na procent ciężaru z top setu.\n\nTop set mówi, jak jesteś dziś dysponowany, a backoffy dokładają objętość bez zajeżdżania się. Dobre do bojów głównych: przysiad, wyciskanie, martwy ciąg, OHP.',
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
    targetDist: 'Dystans (m)', targetTime: 'Czas (s)', rename: 'Zmień nazwę', workoutName: 'Nazwa treningu',
    summary: 'Podsumowanie', difficulty: 'Jak ciężko było? (1–10)', difficultyShort: 'Ciężkość',
    summaryNote: 'Notatka do treningu', summaryNotePh: 'Jak poszło, samopoczucie, sen, co poprawić następnym razem.',
    saveWorkout: 'Zapisz trening', unchecked: n => `Niezaznaczone serie (${n}) nie zapiszą się.`,
    prW: 'ciężar', prE: 'e1RM', prV: 'objętość serii', records: 'Rekordy', prNew: 'Nowy rekord',
    bestWeight: 'Najcięższa seria', bestE1rm: 'Najlepszy e1RM', bestVol: 'Największa objętość serii',
    noRecords: 'Rekordy pojawią się po pierwszym treningu z tym ćwiczeniem.', editSummary: 'Edytuj podsumowanie',
    noPlansYet: 'Nie masz jeszcze żadnego planu. Utwórz pierwszy i dodaj do niego dni treningowe.',
    prHint: 'PR liczy się względem wszystkich wcześniejszych serii tego ćwiczenia. e1RM z tabeli RPE Tuchscherera (1–12 powt.).',
    rpeHints: { 10: 'Maks. Nic w zapasie', 9.5: 'Może 1 powt. więcej, ciężaru już nie', 9: '1 powtórzenie w zapasie', 8.5: '1–2 powtórzenia w zapasie', 8: '2 powtórzenia w zapasie', 7.5: '2–3 powtórzenia w zapasie', 7: '3 powtórzenia w zapasie, szybko', 6.5: '3–4 powtórzenia w zapasie', 6: '4+ powtórzeń w zapasie, lekko' },
    rpeHintEmpty: 'RPE to liczba powtórzeń, które zostały w zapasie. 10 = nic, 8 = dwa.', clear: 'Wyczyść',
    progress: 'Postęp', strength: 'Siła', body: 'Ciało', firstTime: '1. raz · punkt odniesienia',
    lastE1rm: 'Ostatni e1RM', bestE1rmShort: 'Najlepszy e1RM', change: 'Zmiana', since: 'od pierwszego',
    e1rmChart: 'e1RM z każdego treningu', prList: 'Rekordy', prTimeline: 'Ostatnie rekordy',
    weeklyVolume: 'Objętość tygodniowa', setsUnit: 'serii', thisWeekS: 'Ten tydzień', lastWeekS: 'Poprzedni',
    volumeHint: 'Serie robocze: mięsień główny liczy się jako 1, pomocniczy jako 0,5. Seria jednorącz L+P to jedna seria.',
    noStrength: 'Wykresy siły pojawią się po pierwszym zakończonym treningu.', otherExercise: 'Inne ćwiczenie',
    noPrYet: 'Brak rekordów. Pierwszy trening z ćwiczeniem wyznacza punkt odniesienia, rekordy liczą się od drugiego.',
    addMeasurement: 'Dodaj pomiar', editMeasurement: 'Edytuj pomiar', date: 'Data', measureHint: 'Mierz zawsze w tym samym miejscu i o tej samej porze. Taśma przylega, ale nie wciska skóry. Wypełnij tylko to, co mierzysz dziś.',
    noBody: 'Tu zobaczysz masę ciała i obwody w czasie. Dodaj pierwszy pomiar, choćby samą wagę.',
    weight: 'Masa ciała', avg7: 'Średnia 7 dni', vsPrev: 'od ostatniego', vs4w: '4 tyg.', vsStart: 'od startu',
    measurement: 'Pomiar', measurements: 'Pomiary', sidesToggle: 'Mierz L i P osobno', oneSide: 'jedna strona',
    measureEmpty: 'Wpisz co najmniej jedną wartość.', deleteMeasurement: 'Usuń pomiar', startNow: 'Start → teraz',
    point: 'pomiar', bwMissing: 'Dodaj pomiar masy ciała w Postęp → Ciało, żeby liczyć rekordy w ćwiczeniach z masą ciała.',
    m_weight: 'Masa ciała', m_chest: 'Klatka', m_waist: 'Talia', m_hips: 'Biodra', m_arm: 'Ramię', m_armL: 'Ramię L', m_armR: 'Ramię P',
    m_thigh: 'Udo', m_thighL: 'Udo L', m_thighR: 'Udo P', m_calf: 'Łydka', m_bf: 'Tkanka tłuszczowa',
    h_weight: 'Rano, na czczo, po toalecie, w tej samej bieliźnie.', h_chest: 'Na wysokości sutków, ręce luźno, na spokojnym wydechu.',
    h_waist: 'Na wysokości pępka, na wydechu, bez wciągania brzucha.', h_hips: 'W najszerszym miejscu pośladków, stopy razem.',
    h_arm: 'W najszerszym miejscu ramienia, ręka luźno wzdłuż tułowia.', h_thigh: 'W połowie między pachwiną a kolanem, noga rozluźniona.',
    h_calf: 'W najszerszym miejscu łydki, na stojąco.', h_bf: 'Z wagi z pomiarem składu ciała. Zawsze ta sama waga i pora.',
    tapHint: 'Stuknij wykres, żeby zobaczyć wartość.',
    repeatWorkout: 'Powtórz trening', repeatHint: 'Te same ćwiczenia i serie, wyniki z tego treningu jako podpowiedź.', finishCurrentFirst: 'Najpierw zakończ albo odrzuć trwający trening.',
    repeatOfLbl: 'Powtórzenie treningu z', author: 'Autor', madeBy: 'Tworzy Adrian Drożdżyński',
    rpeTable: 'Tabela RPE', rpeTableInfo: 'Procent 1RM dla liczby powtórzeń i RPE według tabeli Mike’a Tuchscherera (RTS).\n\nZ niej aplikacja liczy e1RM i podpowiada ciężar na zadane powtórzenia i RPE. Seria bez RPE liczy się jak RPE 10, RPE poniżej 6,5 jak 6,5 (tabela niżej nie sięga).',
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
    topbackInfo: 'One heavy set (top set) at a target RPE, then lighter sets (backoff) at a percentage of the top set weight.\n\nThe top set tells you how you perform today, the backoffs add volume without burning you out. Good for main lifts: squat, bench, deadlift, OHP.',
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
    targetDist: 'Distance (m)', targetTime: 'Time (s)', rename: 'Rename', workoutName: 'Workout name',
    summary: 'Summary', difficulty: 'How hard was it? (1–10)', difficultyShort: 'Difficulty',
    summaryNote: 'Workout note', summaryNotePh: 'How it went, energy, sleep, what to change next time.',
    saveWorkout: 'Save workout', unchecked: n => `Unchecked sets (${n}) will not be saved.`,
    prW: 'weight', prE: 'e1RM', prV: 'set volume', records: 'Records', prNew: 'New record',
    bestWeight: 'Heaviest set', bestE1rm: 'Best e1RM', bestVol: 'Biggest set volume',
    noRecords: 'Records show up after your first workout with this exercise.', editSummary: 'Edit summary',
    noPlansYet: 'No plans yet. Create your first one and add training days to it.',
    prHint: 'A PR counts against every earlier set of this exercise. e1RM uses Tuchscherer’s RPE table (1–12 reps).',
    rpeHints: { 10: 'Max. Nothing left', 9.5: 'Maybe 1 more rep, but no more weight', 9: '1 rep left', 8.5: '1–2 reps left', 8: '2 reps left', 7.5: '2–3 reps left', 7: '3 reps left, bar moves fast', 6.5: '3–4 reps left', 6: '4+ reps left, easy' },
    rpeHintEmpty: 'RPE is how many reps you had left. 10 = none, 8 = two.', clear: 'Clear',
    progress: 'Progress', strength: 'Strength', body: 'Body', firstTime: '1st time · baseline',
    lastE1rm: 'Last e1RM', bestE1rmShort: 'Best e1RM', change: 'Change', since: 'since first',
    e1rmChart: 'e1RM per workout', prList: 'Records', prTimeline: 'Latest records',
    weeklyVolume: 'Weekly volume', setsUnit: 'sets', thisWeekS: 'This week', lastWeekS: 'Last week',
    volumeHint: 'Working sets: main muscle counts as 1, supporting as 0.5. A one-arm L+R pair is one set.',
    noStrength: 'Strength charts show up after your first finished workout.', otherExercise: 'Other exercise',
    noPrYet: 'No records yet. The first workout with an exercise sets the baseline; records count from the second.',
    addMeasurement: 'Add measurement', editMeasurement: 'Edit measurement', date: 'Date', measureHint: 'Always measure at the same spot and the same time of day. The tape sits flat without pressing in. Fill in only what you measure today.',
    noBody: 'Body weight and measurements over time show up here. Add your first entry, even just your weight.',
    weight: 'Body weight', avg7: '7-day average', vsPrev: 'since last', vs4w: '4 wk', vsStart: 'since start',
    measurement: 'Measurement', measurements: 'Measurements', sidesToggle: 'Measure L and R separately', oneSide: 'one side',
    measureEmpty: 'Enter at least one value.', deleteMeasurement: 'Delete measurement', startNow: 'Start → now',
    point: 'entry', bwMissing: 'Add a body weight entry in Progress → Body to get records for bodyweight exercises.',
    m_weight: 'Body weight', m_chest: 'Chest', m_waist: 'Waist', m_hips: 'Hips', m_arm: 'Arm', m_armL: 'Arm L', m_armR: 'Arm R',
    m_thigh: 'Thigh', m_thighL: 'Thigh L', m_thighR: 'Thigh R', m_calf: 'Calf', m_bf: 'Body fat',
    h_weight: 'Morning, fasted, after the bathroom, same clothing.', h_chest: 'At nipple height, arms relaxed, on a calm exhale.',
    h_waist: 'At the navel, on the exhale, without sucking in.', h_hips: 'At the widest point of the glutes, feet together.',
    h_arm: 'At the widest point of the upper arm, arm hanging relaxed.', h_thigh: 'Halfway between groin and knee, leg relaxed.',
    h_calf: 'At the widest point of the calf, standing.', h_bf: 'From a body composition scale. Same scale, same time of day.',
    tapHint: 'Tap the chart to see a value.',
    repeatWorkout: 'Repeat workout', repeatHint: 'Same exercises and sets, this workout\'s results as hints.', finishCurrentFirst: 'Finish or discard the workout in progress first.',
    repeatOfLbl: 'Repeat of the workout from', author: 'Author', madeBy: 'Made by Adrian Drożdżyński',
    rpeTable: 'RPE table', rpeTableInfo: 'Percent of 1RM for a given number of reps and RPE, from Mike Tuchscherer’s table (RTS).\n\nThe app uses it to calculate e1RM and to suggest a weight for target reps at a target RPE. A set without RPE counts as RPE 10, RPE below 6.5 counts as 6.5 (the table does not go lower).',
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
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 20v-8M12 20V5M19 20v-5"/></svg>',
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
const KEYS = ['settings', 'templates', 'sessions', 'notes', 'customExercises', 'active', 'measurements'];
const persist = (...keys) => Promise.all(keys.map(k => DB.set(k, clone(S[k]))));

/* ---------- state ---------- */
const S = {
  settings: { lang: (navigator.language || 'pl').startsWith('pl') ? 'pl' : 'en', restC: 180, restI: 90, increment: 2.5, backoffPct: 90, activeTemplateId: null, sides: { arm: false, thigh: false } },
  templates: [], sessions: [], notes: {}, customExercises: [], active: null, measurements: [],
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
  const log = e ? e.logging : 'W';
  const reps = log === 'T' ? '30' : log === 'WD' ? '30' : compound ? '6-8' : '10-12';
  return { id: uid(), exId, scheme: 'straight', warmups: 0, sets: 3, reps, rpe: log === 'T' || log === 'WD' ? null : compound ? 8 : 9, backoffSets: 2, backoffReps: '', backoffPct: S.settings.backoffPct, rest: compound ? S.settings.restC : S.settings.restI };
}
const logOf = exId => (S.ex.get(exId) || { logging: 'W' }).logging;
const targetLabel = exId => ({ T: t('targetTime'), WD: t('targetDist') }[logOf(exId)] || t('repsTarget'));
const targetUnit = exId => ({ T: ' s', WD: ' m' }[logOf(exId)] || '');

/* ---------- personal records ---------- */
/* Mike Tuchscherer (RTS) RPE table: % of 1RM, rows RPE 10..6.5, columns 1..12 reps */
const RPE_TABLE = {
  10:  [100, 95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0],
  9.5: [97.8, 93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7],
  9:   [95.5, 92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3],
  8.5: [93.9, 90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0],
  8:   [92.2, 89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3, 62.6],
  7.5: [90.7, 87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0, 61.3],
  7:   [89.2, 86.3, 83.7, 81.1, 78.6, 76.2, 73.9, 70.7, 68.0, 65.3, 62.6, 59.9],
  6.5: [87.8, 85.0, 82.4, 79.9, 77.4, 75.1, 72.3, 69.4, 66.7, 64.0, 61.3, 58.6],
};
const normRpe = v => { const n = num(v); if (n == null || n < 1 || n > 10) return null; return Math.round(n * 2) / 2; };
/* % of 1RM; missing RPE = 10, RPE under 6.5 = 6.5; null outside 1-12 reps */
function rpePct(reps, rpe) {
  const r = Math.round(num(reps));
  if (!(r >= 1 && r <= 12)) return null;
  let q = normRpe(rpe); if (q == null) q = 10; if (q < 6.5) q = 6.5;
  return RPE_TABLE[q][r - 1];
}
const e1rm = (w, r, rpe) => { const p = rpePct(r, rpe); return p ? w / (p / 100) : null; };
/* body weight: latest measurement on or before a moment */
function bodyweightAt(ts) {
  let best = null;
  for (const m of S.measurements) if (num(m.weight) > 0 && m.date <= ts && (!best || m.date > best.date)) best = m;
  return best ? num(best.weight) : null;
}
const sessionBw = ses => (ses && ses.bw != null ? ses.bw : ses ? bodyweightAt(ses.startedAt) : null);
const NO_PR = new Set(['assisted-pull-up']); // assistance weight: lower is harder
const canPR = ex => !!ex && !NO_PR.has(ex.id) && (ex.logging === 'W' || ex.logging === 'BWX');
/* the load that counts: plate weight, or body weight + added weight */
function loadOf(ex, set, bw) {
  if (!ex) return null;
  if (ex.logging === 'W') { const w = num(set.weight); return w > 0 ? w : null; }
  if (ex.logging === 'BWX') { if (!(bw > 0)) return null; const l = bw + (num(set.weight) || 0); return l > 0 ? l : null; }
  return null;
}
function prEligible(ex, set, bw) { return canPR(ex) && set.kind !== 'warmup' && loadOf(ex, set, bw) > 0 && num(set.reps) > 0; }
/* eligible sets of an exercise, oldest first: [{load, reps, rpe, set, at, sesId}] */
function entriesFor(exId, opts = {}) {
  const ex = S.ex.get(exId); const out = [];
  const add = (ses, active) => {
    const bw = active ? S.active.bw : sessionBw(ses);
    for (const it of ses.items) if (it.exId === exId) for (const x of it.sets) {
      if (!x.done || !prEligible(ex, x, bw)) continue;
      out.push({ load: loadOf(ex, x, bw), reps: num(x.reps), rpe: x.rpe, set: x, at: x.doneAt || ses.startedAt, sesAt: ses.startedAt, sesId: ses.id, bw });
    }
  };
  for (const ses of S.sessions) add(ses, false);
  if (opts.withActive && S.active) add(S.active, true);
  return out.sort((a, b) => a.sesAt - b.sesAt || a.at - b.at);
}
function prTypes(cur, prev) {
  const out = [];
  if (!prev.length) return out;
  const maxW = Math.max(...prev.map(x => x.load));
  const maxV = Math.max(...prev.map(x => x.load * x.reps));
  const eP = prev.map(x => e1rm(x.load, x.reps, x.rpe)).filter(Boolean);
  const eNow = e1rm(cur.load, cur.reps, cur.rpe);
  if (cur.load > maxW) out.push('w');
  if (eNow && eP.length && eNow > Math.max(...eP) + 0.01) out.push('e');
  if (cur.load * cur.reps > maxV) out.push('v');
  return out;
}
/* true when an earlier finished workout already has this exercise (first workout = baseline) */
function hasHistory(exId, beforeTs) {
  return S.sessions.some(ses => ses.startedAt < beforeTs && ses.items.some(it => it.exId === exId && it.sets.some(x => x.done)));
}
function detectPR(exId, set) {
  const ex = S.ex.get(exId);
  const bw = S.active ? S.active.bw : null;
  if (!prEligible(ex, set, bw)) return [];
  const startedAt = S.active ? S.active.startedAt : now();
  const all = entriesFor(exId, { withActive: true });
  const base = all.filter(e => e.sesAt < startedAt);
  if (!base.length) return [];
  const ts = set.doneAt || now();
  const prev = all.filter(e => e.set.id !== set.id && (e.sesAt < startedAt || e.at < ts));
  return prTypes({ load: loadOf(ex, set, bw), reps: num(set.reps), rpe: set.rpe }, prev);
}
/* every PR event of an exercise across history, recomputed with the current rules */
function prEvents(exId) {
  const all = entriesFor(exId);
  if (!all.length) return [];
  const firstSes = all[0].sesAt;
  const ev = [];
  all.forEach((e, i) => {
    if (e.sesAt === firstSes) return;
    const types = prTypes(e, all.slice(0, i));
    if (types.length) ev.push({ ...e, exId, types });
  });
  return ev;
}
function allPrEvents() {
  const ids = new Set(); S.sessions.forEach(s => s.items.forEach(i => ids.add(i.exId)));
  return [...ids].flatMap(id => prEvents(id)).sort((a, b) => b.at - a.at);
}
/* best e1RM per finished workout: [{x: ts, y}] */
function e1rmSeries(exId) {
  const by = new Map();
  for (const e of entriesFor(exId)) {
    const v = e1rm(e.load, e.reps, e.rpe); if (!v) continue;
    const cur = by.get(e.sesId);
    if (!cur || v > cur.y) by.set(e.sesId, { x: e.sesAt, y: v });
  }
  return [...by.values()].sort((a, b) => a.x - b.x);
}
/* best e1RM from the most recent finished workout with this exercise */
function lastE1rm(exId, beforeTs) {
  const pts = e1rmSeries(exId).filter(p => p.x < beforeTs);
  return pts.length ? pts[pts.length - 1].y : null;
}
const prLabel = codes => codes.map(c => t({ w: 'prW', e: 'prE', v: 'prV' }[c])).join(' · ');
function recordsFor(exId) {
  const best = { w: null, e: null, v: null };
  for (const x of entriesFor(exId)) {
    const cand = { w: x.load, e: e1rm(x.load, x.reps, x.rpe), v: x.load * x.reps };
    for (const k of ['w', 'e', 'v']) if (cand[k] != null && (!best[k] || cand[k] > best[k].val)) best[k] = { val: cand[k], set: x.set, at: x.sesAt, entry: x };
  }
  return best;
}
/* "load × reps @rpe" for an entry; bodyweight lifts show BW+added */
function fmtEntry(ex, e) {
  const r = `×${e.reps}${normRpe(e.rpe) ? ' @' + fmtN(normRpe(e.rpe)) : ''}`;
  if (ex && ex.logging === 'BWX') { const a = num(e.set.weight) || 0; return `BW${a ? (a > 0 ? '+' : '') + fmtN(a) : ''}${r} (${fmtN(e.load)} kg)`; }
  return `${fmtN(e.load)}${r}`;
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
    startedAt: now(), endedAt: null, items: day ? day.items.map(sessionItemFromTemplate) : [], bw: bodyweightAt(now()),
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
    case 'progress': html = vProgress(); break;
    default: html = vToday();
  }
  app.innerHTML = html + (S.view === 'workout' ? '' : nav());
  renderTimer();
  renderSheet();
  if (S.view === 'library') { const i = $('#libq'); if (i && S._libFocus) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}
function nav() {
  const tab = { today: 'today', plans: 'plans', plan: 'plans', history: 'history', session: 'history', library: 'library', progress: 'progress' }[S.view];
  const b = (v, icon, label) => `<button class="${tab === v ? 'on' : ''}" data-a="nav" data-v="${v}" aria-current="${tab === v ? 'page' : 'false'}">${I[icon]}${esc(t(label))}</button>`;
  return `<nav class="nav" aria-label="Menu"><div class="nav-inner">${b('today', 'home', 'today')}${b('plans', 'list', 'plans')}${b('progress', 'chart', 'progress')}${b('history', 'clock', 'history')}${b('library', 'dumbbell', 'library')}</div></nav>`;
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
  const u = targetUnit(it.exId);
  if (it.scheme === 'topback') return `top ${it.reps}${u}${it.rpe ? ' @' + fmtN(it.rpe) : ''} + ${it.backoffSets}×${it.backoffReps || it.reps}${u}`;
  return `${it.sets} × ${it.reps}${u}${it.rpe ? ' @' + fmtN(it.rpe) : ''}`;
}

/* ---------- view: plans ---------- */
function vPlans() {
  const list = S.templates.map(tp => `<button class="list-btn row" data-a="open-plan" data-v="${tp.id}"><span class="grow"><span class="name">${esc(tp.name)}</span><br><span class="meta">${tp.days.length} × ${esc(t('day').toLowerCase())}</span></span>${tp.id === S.settings.activeTemplateId ? `<span class="tag p">${esc(t('active'))}</span>` : ''}</button>`).join('');
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('plans'))}</h1>
    ${S.templates.length ? `<div class="card">${list}</div>` : `<div class="empty">${esc(t('noPlansYet'))}</div>`}
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
  const lastE = log === 'W' ? lastE1rm(it.exId, S.active.startedAt) : null;
  const rows = it.sets.map((s, idx) => {
    const p = matchPrev(prevItem, it, idx);
    let phW = p ? fmtN(num(p.weight)) : '';
    const tgt = s.target && s.target.reps ? String(s.target.reps).split('-')[0] : '';
    if (lastE && s.kind !== 'warmup' && s.kind !== 'backoff' && s.target && normRpe(s.target.rpe) && rpePct(tgt, s.target.rpe)) {
      phW = fmtN(roundTo(lastE * rpePct(tgt, s.target.rpe) / 100, S.settings.increment));
    }
    let phR = p ? (p.reps || '') : tgt;
    if (s.kind === 'backoff' && topDone) phW = fmtN(roundTo(num(topDone.weight) * (it.backoffPct || 90) / 100, S.settings.increment));
    const phRpe = s.target && s.target.rpe ? fmtN(s.target.rpe) : (p && p.rpe ? fmtN(num(p.rpe)) : '');
    const kindLbl = { warmup: t('warmup'), work: t('work') + ' ' + (it.sets.filter((x, j) => j <= idx && x.kind === 'work' && x.side === s.side).length), top: t('top'), backoff: t('backoff') }[s.kind];
    const side = s.side ? `<span class="side-tag">${esc(s.side === 'L' ? t('left') : t('right'))}</span>` : '';
    const f = (field, val, ph, cls = '') => `<input class="${cls}" inputmode="decimal" enterkeyhint="next" aria-label="${esc(field)}" data-f="set" data-i="${it.id}" data-s="${s.id}" data-k="${field}" value="${esc(val)}" placeholder="${esc(ph)}">`;
    let a, b;
    if (log === 'T') { a = f('time', s.time, p ? p.time || '' : tgt); b = '<span></span>'; }
    else if (log === 'WD') { a = f('weight', s.weight, phW); b = f('dist', s.dist, p ? p.dist || '' : tgt); }
    else { a = f('weight', s.weight, phW); b = f('reps', s.reps, phR); }
    return `<div class="set ${s.kind === 'top' ? 'is-top' : ''} ${s.done ? 'done' : ''}">
      <span class="kind ${s.kind === 'top' ? 'top' : ''}">${esc(kindLbl)}${side}${s.pr && s.pr.length ? `<span class="pr-badge" title="${esc(prLabel(s.pr))}">PR</span>` : ''}</span>
      <span class="prev">${esc(p ? fmtSet(p, ex) : '–')}</span>${a}${b}<button class="rpe-btn ${s.rpe ? '' : 'ph'}" data-a="rpe-open" data-i="${it.id}" data-s="${s.id}" aria-label="RPE ${esc(s.rpe ? fmtN(num(s.rpe)) : '')}">${esc(s.rpe ? fmtN(num(s.rpe)) : phRpe)}</button>
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
      ${hasHistory(it.exId, a.startedAt) ? '' : `<div class="muted small">${esc(t('firstTime'))}</div>`}
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
      <div class="wk-title"><button class="t" data-a="rename" style="background:none;border:0;padding:0;max-width:100%" aria-label="${esc(t('rename'))}">${esc(a.name)} <span class="muted" aria-hidden="true">✎</span></button><div class="clock" id="wclock">${fmtDur(now() - a.startedAt)}</div></div>
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
    const prs = s.items.reduce((n, it) => n + it.sets.filter(x => x.pr && x.pr.length).length, 0);
    return `<button class="list-btn row" data-a="open-session" data-v="${s.id}"><span class="grow"><span class="name">${esc(s.name)}</span><br><span class="meta">${esc(fmtDate(s.startedAt, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))} · ${esc(fmtDur(s.endedAt - s.startedAt))} · ${st.sets} ${esc(t('setsDone').toLowerCase())}${prs ? ` · <span class="pr-badge">PR ${prs}</span>` : ''}</span></span>${s.difficulty ? `<span class="diff-badge" aria-label="${esc(t('difficultyShort'))} ${s.difficulty}/10">${s.difficulty}<small>/10</small></span>` : ''}</button>`;
  }).join('');
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('history'))}</h1>${list ? `<div class="card">${list}</div>` : `<div class="empty">${esc(t('noSessions'))}</div>`}</main>`;
}
function vSession() {
  const s = S.sessions.find(x => x.id === S.viewArg);
  if (!s) return vHistory();
  const st = sessionStats(s);
  const items = s.items.map(it => {
    const ex = S.ex.get(it.exId);
    const sets = it.sets.filter(x => x.done).map(x => `<span class="tag ${x.kind === 'top' ? 'p' : ''}">${esc(fmtSet(x, ex))}${x.side ? ' ' + esc(x.side === 'L' ? t('left') : t('right')) : ''}${num(x.rpe) ? ' @' + fmtN(num(x.rpe)) : ''}${x.pr && x.pr.length ? ` <span class="pr-badge" title="${esc(prLabel(x.pr))}">PR</span>` : ''}</span>`).join('');
    const prNote = it.sets.filter(x => x.pr && x.pr.length).map(x => `${fmtSet(x, ex)}: ${prLabel(x.pr)}`).join(' · ');
    return `<div class="row" style="flex-direction:column;align-items:flex-start;padding:10px 0;gap:4px"><span class="name">${esc(exName(it.exId))}</span><div>${sets || '<span class="muted small">–</span>'}</div>${prNote ? `<div class="small" style="color:var(--accent)">PR · ${esc(prNote)}</div>` : ''}</div>`;
  }).join('');
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="nav" data-v="history" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(fmtDate(s.startedAt, { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}</div><span style="width:44px"></span></div>
    <h1 class="mid">${esc(s.name)}</h1>
    ${s.repeatOf ? (() => { const o = S.sessions.find(x => x.id === s.repeatOf); return o ? `<button class="btn small ghost" style="justify-content:flex-start;padding:0" data-a="open-session" data-v="${o.id}">${esc(t('repeatOfLbl'))} ${esc(fmtDate(o.startedAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))} →</button>` : ''; })() : ''}
    <div class="stat-row"><div class="stat"><div class="v">${esc(fmtDur(s.endedAt - s.startedAt))}</div><div class="k">${esc(t('duration'))}</div></div><div class="stat"><div class="v">${st.sets}</div><div class="k">${esc(t('setsDone'))}</div></div><div class="stat"><div class="v">${st.vol.toLocaleString(S.settings.lang === 'en' ? 'en-GB' : 'pl-PL')}</div><div class="k">${esc(t('volume'))} kg</div></div></div>
    ${s.difficulty || s.note ? `<div class="info">${s.difficulty ? `<div style="display:flex;align-items:baseline;gap:10px"><span class="diff-badge">${s.difficulty}<small>/10</small></span><span class="muted small">${esc(t('difficultyShort'))}</span></div>` : ''}${s.note ? `<div style="white-space:pre-wrap">${esc(s.note)}</div>` : ''}</div>` : ''}
    <div class="card">${items}</div>
    <button class="btn primary block" data-a="repeat" data-v="${s.id}">${esc(t('repeatWorkout'))}</button>
    <div class="muted small" style="margin-top:-8px">${esc(t('repeatHint'))}</div>
    <button class="btn block" data-a="summary-edit" data-v="${s.id}">${esc(t('editSummary'))}</button>
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


/* ---------- charts (single y-axis, thin marks, tap for value) ---------- */
const CHARTS = {};
function niceRange(lo, hi) {
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
  const step = Math.pow(10, Math.floor(Math.log10(hi - lo))) / 2;
  return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step];
}
function lineChart(id, { dots = [], line = [], unit = '', legend = null, connect = false }) {
  const all = [...dots, ...line];
  if (!all.length) return '';
  const W = 340, H = 170, L = 44, R = 12, T = 12, B = 26;
  const xs = all.map(p => p.x), ys = all.map(p => p.y);
  let x0 = Math.min(...xs), x1 = Math.max(...xs); if (x0 === x1) { x0 -= 864e5; x1 += 864e5; }
  const [y0, y1] = niceRange(Math.min(...ys), Math.max(...ys));
  const X = x => L + (x - x0) / (x1 - x0) * (W - L - R), Y = y => T + (1 - (y - y0) / (y1 - y0)) * (H - T - B);
  const ticks = [y0, (y0 + y1) / 2, y1];
  const dfmt = ts => fmtDate(ts, { day: 'numeric', month: 'short' });
  const grid = ticks.map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" class="cg"/><text x="${L - 6}" y="${(Y(v) + 4).toFixed(1)}" class="ct" text-anchor="end">${esc(fmtN(Math.round(v * 10) / 10))}</text>`).join('');
  const path = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)} ${Y(p.y).toFixed(1)}`).join(' ');
  const lineSvg = line.length > 1 ? `<path d="${path(line)}" class="cl"/>` : connect && dots.length > 1 ? `<path d="${path(dots)}" class="cl"/>` : '';
  const dotsSvg = dots.map((p, i) => `<circle cx="${X(p.x).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="${i === dots.length - 1 && !line.length ? 5 : 3.5}" class="${line.length ? 'cd2' : 'cd'}"/>`).join('');
  const lastL = line.length ? line[line.length - 1] : null;
  const endSvg = lastL ? `<circle cx="${X(lastL.x).toFixed(1)}" cy="${Y(lastL.y).toFixed(1)}" r="5" class="cd"/>` : '';
  const main = line.length ? line : dots;
  CHARTS[id] = { pts: main, alt: line.length ? dots : null, X, Y, unit, W };
  const xl = `<text x="${L}" y="${H - 6}" class="ct">${esc(dfmt(x0 + (Math.min(...xs) === Math.max(...xs) ? 864e5 : 0)))}</text><text x="${W - R}" y="${H - 6}" class="ct" text-anchor="end">${esc(dfmt(Math.max(...xs)))}</text>`;
  const leg = legend ? `<div class="legend">${legend.map(l => `<span><i class="${l.cls}"></i>${esc(l.label)}</span>`).join('')}</div>` : '';
  return `<figure class="chart">${leg}<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(legend ? legend.map(l => l.label).join(', ') : unit)}" data-a="chart-tap" data-v="${id}">
    ${grid}${xl}${lineSvg}${dotsSvg}${endSvg}<line id="${id}-cur" class="cc" x1="0" x2="0" y1="${T}" y2="${H - B}" visibility="hidden"/></svg>
    <figcaption class="tip" id="${id}-tip">${esc(t('tapHint'))}</figcaption></figure>`;
}
function chartTap(svg, ev) {
  const c = CHARTS[svg.dataset.v]; if (!c || !c.pts.length) return;
  const r = svg.getBoundingClientRect();
  const x = (ev.clientX - r.left) / r.width * c.W;
  let best = c.pts[0]; for (const p of c.pts) if (Math.abs(c.X(p.x) - x) < Math.abs(c.X(best.x) - x)) best = p;
  const cur = $('#' + svg.dataset.v + '-cur');
  if (cur) { cur.setAttribute('x1', c.X(best.x)); cur.setAttribute('x2', c.X(best.x)); cur.setAttribute('visibility', 'visible'); }
  const tip = $('#' + svg.dataset.v + '-tip');
  let txt = `${fmtDate(best.x, { day: 'numeric', month: 'short', year: 'numeric' })} · ${fmtN(Math.round(best.y * 10) / 10)} ${c.unit}`;
  if (c.alt) { const a = c.alt.find(p => p.x === best.x); if (a) txt += ` · ${t('point')}: ${fmtN(a.y)} ${c.unit}`; }
  if (best.label) txt += ` · ${best.label}`;
  if (tip) tip.textContent = txt;
}

/* ---------- view: progress ---------- */
function weekStart(ts) { const d = new Date(ts); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); return d.getTime(); }
function weeklyVolume(ws) {
  const we = ws + 7 * 864e5, vol = {};
  for (const s of S.sessions) {
    if (s.startedAt < ws || s.startedAt >= we) continue;
    for (const it of s.items) {
      const ex = S.ex.get(it.exId); if (!ex) continue;
      const n = it.sets.filter(x => x.done && x.kind !== 'warmup' && x.side !== 'R').length;
      if (!n) continue;
      ex.primary.forEach(m => { vol[m] = (vol[m] || 0) + n; });
      ex.secondary.forEach(m => { vol[m] = (vol[m] || 0) + n * 0.5; });
    }
  }
  return Object.entries(vol).sort((a, b) => b[1] - a[1]);
}
function progressExercises() {
  const cnt = new Map();
  for (const s of S.sessions) for (const it of s.items) {
    const ex = S.ex.get(it.exId);
    if (canPR(ex) && entriesFor(it.exId).length) cnt.set(it.exId, (cnt.get(it.exId) || 0) + 1);
  }
  return [...cnt.entries()].sort((a, b) => b[1] - a[1]).map(x => x[0]);
}
function vProgress() {
  const pg = S.prog || (S.prog = { tab: 'strength', exId: null, week: 0, metric: 'weight' });
  const seg = `<div class="seg" role="tablist"><button role="tab" aria-selected="${pg.tab === 'strength'}" class="${pg.tab === 'strength' ? 'on' : ''}" data-a="prog-tab" data-v="strength">${esc(t('strength'))}</button><button role="tab" aria-selected="${pg.tab === 'body'}" class="${pg.tab === 'body' ? 'on' : ''}" data-a="prog-tab" data-v="body">${esc(t('body'))}</button></div>`;
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('progress'))}</h1>${seg}${pg.tab === 'body' ? vBody() : vStrength()}</main>`;
}
function vStrength() {
  const pg = S.prog;
  if (!S.sessions.length) return `<div class="empty">${esc(t('noStrength'))}</div>`;
  const exs = progressExercises();
  if (!pg.exId || !exs.includes(pg.exId)) pg.exId = pg.exId && S.ex.get(pg.exId) && entriesFor(pg.exId).length ? pg.exId : exs[0] || null;
  const L_ = S.settings.lang === 'en' ? 'en-GB' : 'pl-PL';
  let exBlock = '';
  if (pg.exId) {
    const ex = S.ex.get(pg.exId);
    const series = e1rmSeries(pg.exId);
    const best = series.length ? Math.max(...series.map(p => p.y)) : null;
    const last = series.length ? series[series.length - 1].y : null;
    const delta = series.length > 1 ? last - series[0].y : null;
    const evs = prEvents(pg.exId).slice().reverse();
    const chips = exs.slice(0, 8).map(id => `<button class="chip ${id === pg.exId ? 'on' : ''}" data-a="prog-ex" data-v="${esc(id)}">${esc(exName(id))}</button>`).join('');
    exBlock = `
      <div class="chips">${chips}<button class="chip" data-a="prog-ex-pick">${esc(t('otherExercise'))}</button></div>
      <h2>${esc(exName(pg.exId))}</h2>
      ${series.length ? `<div class="stat-row"><div class="stat"><div class="v">${esc(fmtN(Math.round(last * 10) / 10))}</div><div class="k">${esc(t('lastE1rm'))} kg</div></div><div class="stat"><div class="v">${esc(fmtN(Math.round(best * 10) / 10))}</div><div class="k">${esc(t('bestE1rmShort'))} kg</div></div><div class="stat"><div class="v">${delta == null ? '–' : (delta >= 0 ? '+' : '−') + esc(fmtN(Math.abs(Math.round(delta * 10) / 10)))}</div><div class="k">${esc(t('change'))} kg</div></div></div>
      <div><label>${esc(t('e1rmChart'))}</label>${lineChart('c-e1rm', { dots: series, unit: 'kg', connect: true })}</div>` : ''}
      ${ex.logging === 'BWX' && !S.measurements.some(m => num(m.weight) > 0) ? `<div class="muted small">${esc(t('bwMissing'))}</div>` : ''}
      <div><label>${esc(t('prList'))}</label>${evs.length ? `<div class="card">${evs.slice(0, 20).map(e => `<div class="row"><span class="grow"><span class="name">${esc(fmtEntry(ex, e))}</span><br><span class="meta">${esc(prLabel(e.types))}</span></span><span class="meta">${esc(fmtDate(e.sesAt, { day: 'numeric', month: 'short' }))}</span></div>`).join('')}</div>` : `<div class="muted small">${esc(t('noPrYet'))}</div>`}</div>`;
  }
  const ws = weekStart(now()) - pg.week * 7 * 864e5;
  const vol = weeklyVolume(ws);
  const maxV = vol.length ? Math.max(...vol.map(v => v[1])) : 1;
  const volBlock = `<div><h2>${esc(t('weeklyVolume'))}</h2>
      <div class="chips" style="margin-top:10px"><button class="chip ${pg.week === 0 ? 'on' : ''}" data-a="prog-week" data-v="0">${esc(t('thisWeekS'))}</button><button class="chip ${pg.week === 1 ? 'on' : ''}" data-a="prog-week" data-v="1">${esc(t('lastWeekS'))}</button></div>
    ${vol.length ? `<div class="vol">${vol.map(([m, v]) => `<div class="vol-row"><span class="vm">${esc(muscleName(m))}</span><span class="vb"><i style="width:${(v / maxV * 100).toFixed(1)}%"></i></span><span class="vv">${esc(fmtN(v))}</span></div>`).join('')}</div>` : `<div class="muted small">–</div>`}
    <div class="muted small" style="margin-top:6px">${esc(t('volumeHint'))}</div></div>`;
  const tl = allPrEvents().slice(0, 15);
  const tlBlock = tl.length ? `<div><h2>${esc(t('prTimeline'))}</h2><div class="card">${tl.map(e => `<button class="list-btn row" data-a="prog-ex" data-v="${esc(e.exId)}"><span class="grow"><span class="name">${esc(exName(e.exId))}</span><br><span class="meta">${esc(fmtEntry(S.ex.get(e.exId), e))} · ${esc(prLabel(e.types))}</span></span><span class="meta">${esc(fmtDate(e.sesAt, { day: 'numeric', month: 'short' }))}</span></button>`).join('')}</div></div>` : '';
  return exBlock + volBlock + tlBlock;
}

/* ---------- body measurements ---------- */
const MFIELDS = ['weight', 'chest', 'waist', 'hips', 'arm', 'thigh', 'calf', 'bf'];
const SIDED = { arm: ['armL', 'armR'], thigh: ['thighL', 'thighR'] };
const mUnit = k => (k === 'weight' ? 'kg' : k === 'bf' ? '%' : 'cm');
function metricKeys() {
  const keys = [];
  for (const f of MFIELDS) {
    for (const k of [f, ...(SIDED[f] || [])]) if (S.measurements.some(m => num(m[k]) > 0)) keys.push(k);
  }
  return keys;
}
const metricSeries = k => S.measurements.filter(m => num(m[k]) > 0).map(m => ({ x: m.date, y: num(m[k]) })).sort((a, b) => a.x - b.x);
function movingAvg(pts, days = 7) {
  return pts.map(p => { const w = pts.filter(q => q.x <= p.x && q.x > p.x - days * 864e5); return { x: p.x, y: w.reduce((a, b) => a + b.y, 0) / w.length }; });
}
function deltaAt(pts, ts) { const prior = pts.filter(p => p.x <= ts); return prior.length ? prior[prior.length - 1] : null; }
const fmtDelta = (d, u) => (d == null ? '–' : `${d > 0 ? '+' : d < 0 ? '−' : '±'}${fmtN(Math.abs(Math.round(d * 10) / 10))} ${u}`);
function vBody() {
  const pg = S.prog;
  const add = `<button class="btn primary block" data-a="m-new">${esc(t('addMeasurement'))}</button>`;
  if (!S.measurements.length) return `${add}<div class="empty">${esc(t('noBody'))}</div>${sidesToggle()}`;
  const keys = metricKeys();
  if (!keys.includes(pg.metric)) pg.metric = keys[0];
  let chart = '';
  const pts = metricSeries(pg.metric);
  if (pg.metric === 'weight') {
    const ma = movingAvg(pts);
    const last = pts[pts.length - 1], lastMa = ma[ma.length - 1];
    const prev = pts.length > 1 ? pts[pts.length - 2] : null;
    const w4 = deltaAt(pts, last.x - 28 * 864e5);
    chart = `<div class="stat-row"><div class="stat"><div class="v">${esc(fmtN(last.y))}</div><div class="k">${esc(t('weight'))} kg</div></div><div class="stat"><div class="v">${esc(fmtN(Math.round(lastMa.y * 10) / 10))}</div><div class="k">${esc(t('avg7'))}</div></div><div class="stat"><div class="v small-v">${esc(fmtDelta(prev ? last.y - prev.y : null, ''))}</div><div class="k">${esc(t('vsPrev'))}</div></div></div>
      <div class="muted small">${esc(t('vs4w'))}: ${esc(fmtDelta(w4 ? lastMa.y - movingAvg(pts).find(p => p.x === w4.x).y : null, 'kg'))} · ${esc(t('vsStart'))}: ${esc(fmtDelta(last.y - pts[0].y, 'kg'))}</div>
      ${lineChart('c-body', { dots: pts, line: ma, unit: 'kg', legend: [{ cls: 'lg-dot', label: t('point') }, { cls: 'lg-line', label: t('avg7') }] })}`;
  } else {
    chart = lineChart('c-body', { dots: pts, unit: mUnit(pg.metric), connect: true });
  }
  const chips = keys.map(k => `<button class="chip ${k === pg.metric ? 'on' : ''}" data-a="m-metric" data-v="${k}">${esc(t('m_' + k))}</button>`).join('');
  const summary = keys.filter(k => k !== 'weight').map(k => { const p = metricSeries(k); const a = p[0], z = p[p.length - 1]; return `<div class="row"><span class="grow"><span class="name">${esc(t('m_' + k))}</span><br><span class="meta">${esc(fmtN(a.y))} → ${esc(fmtN(z.y))} ${mUnit(k)}</span></span><span class="meta">${esc(fmtDelta(z.y - a.y, mUnit(k)))}</span></div>`; }).join('');
  const hist = [...S.measurements].sort((a, b) => b.date - a.date).map(m => `<button class="list-btn row" data-a="m-edit" data-v="${m.id}"><span class="grow"><span class="name">${esc(fmtDate(m.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}</span><br><span class="meta">${esc(keys.filter(k => num(m[k]) > 0).map(k => `${t('m_' + k)} ${fmtN(num(m[k]))}`).join(' · '))}</span></span></button>`).join('');
  return `${add}<div class="chips">${chips}</div>${chart}
    ${summary ? `<div><label>${esc(t('startNow'))}</label><div class="card">${summary}</div></div>` : ''}
    <div><label>${esc(t('measurements'))}</label><div class="card">${hist}</div></div>${sidesToggle()}`;
}
function sidesToggle() {
  const sd = S.settings.sides || {};
  return `<div><label>${esc(t('sidesToggle'))}</label><div class="chips">${['arm', 'thigh'].map(f => `<button class="chip ${sd[f] ? 'on' : ''}" data-a="m-sides" data-v="${f}" aria-pressed="${!!sd[f]}">${esc(t('m_' + f))}: ${esc(sd[f] ? t('left') + ' + ' + t('right') : t('oneSide'))}</button>`).join('')}</div></div>`;
}
function measureSheet(sh) {
  const m = sh.draft; const sd = S.settings.sides || {};
  const d = new Date(m.date); const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const field = (k, f) => `<div><label for="m-${k}">${esc(t('m_' + k))} (${mUnit(f)})</label><input id="m-${k}" data-f="m" data-k="${k}" inputmode="decimal" value="${esc(m[k] ?? '')}"></div>`;
  const rows = MFIELDS.map(f => {
    const ins = SIDED[f] && sd[f] ? `<div class="grid2">${SIDED[f].map(k => field(k, f)).join('')}</div>` : field(f, f);
    return `<div class="mfield">${ins}<div class="muted small">${esc(t('h_' + f))}</div></div>`;
  }).join('');
  return `<div class="sheet-head"><h2>${esc(sh.editId ? t('editMeasurement') : t('addMeasurement'))}</h2><button class="icon-btn" data-a="sheet-close" aria-label="${esc(t('close'))}">${I.x}</button></div>
    <div class="muted small">${esc(t('measureHint'))}</div>
    <div><label for="m-date">${esc(t('date'))}</label><input id="m-date" type="date" value="${iso}"></div>
    ${rows}
    ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
    <div class="btn-row">${sh.editId ? `<button class="btn danger" data-a="m-del">${esc(t('deleteMeasurement'))}</button>` : ''}<button class="btn primary" data-a="m-save">${esc(t('save'))}</button></div>`;
}
function readMeasure() {
  const d = S.sheet.draft;
  document.querySelectorAll('[data-f="m"]').forEach(e => { d[e.dataset.k] = e.value.replace(',', '.').trim(); });
  const dv = ($('#m-date') || {}).value;
  if (dv) { const [y, mo, da] = dv.split('-').map(Number); const old = new Date(d.date); d.date = new Date(y, mo - 1, da, old.getHours(), old.getMinutes()).getTime(); }
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
        ${fld('it-reps', targetLabel(it.exId), it.reps, 'text')}
        <div><label>${esc(t('rpe'))}</label><button class="rpe-btn block-btn ${it.rpe ? '' : 'ph'}" data-a="item-rpe" aria-label="RPE">${it.rpe ? esc(fmtN(it.rpe)) : '–'}</button></div>
        ${fld('it-warmups', t('warmups'), it.warmups)}
        ${fld('it-rest', t('rest'), it.rest)}
      </div>
      ${isTop ? `<div class="grid3">${fld('it-backoffSets', t('backoffSets'), it.backoffSets)}${fld('it-backoffReps', logOf(it.exId) === 'W' || logOf(it.exId) === 'BWX' ? t('backoffReps') : targetLabel(it.exId), it.backoffReps, 'text')}${fld('it-backoffPct', t('backoffPct'), it.backoffPct)}</div>` : ''}
      <button class="btn primary block" data-a="item-save">${esc(t('save'))}</button>`;
  } else if (sh.type === 'measure') {
    body = measureSheet(sh);
  } else if (sh.type === 'rename') {
    body = `${head(t('rename'))}<div><label for="rn">${esc(t('workoutName'))}</label><input id="rn" value="${esc(sh.name)}" maxlength="60"></div><button class="btn primary block" data-a="rename-save">${esc(t('save'))}</button>`;
  } else if (sh.type === 'summary') {
    body = `${head(sh.mode === 'finish' ? t('finishWorkout') : t('editSummary'))}
      <div><label for="sum-name">${esc(t('workoutName'))}</label><input id="sum-name" value="${esc(sh.name)}" maxlength="60"></div>
      <div><label>${esc(t('difficulty'))}</label><div class="diff" role="group" aria-label="${esc(t('difficulty'))}">${Array.from({ length: 10 }, (_, i) => i + 1).map(v => `<button class="${sh.difficulty === v ? 'on' : ''}" data-a="diff-pick" data-v="${v}" aria-pressed="${sh.difficulty === v}">${v}</button>`).join('')}</div></div>
      <div><label for="sum-note">${esc(t('summaryNote'))}</label><textarea id="sum-note" rows="3" placeholder="${esc(t('summaryNotePh'))}">${esc(sh.note)}</textarea></div>
      ${sh.left ? `<div class="muted small">${esc(t('unchecked', sh.left))}</div>` : ''}
      <button class="btn primary block" data-a="summary-save">${esc(sh.mode === 'finish' ? t('saveWorkout') : t('save'))}</button>`;
  } else if (sh.type === 'schemeInfo') {
    body = `${head(t('whySchemes'))}<div class="info ${sh.cur === 'straight' ? 'sel' : ''}"><h3>${esc(t('straight'))}</h3><div>${esc(t('straightInfo'))}</div></div><div class="info ${sh.cur === 'topback' ? 'sel' : ''}"><h3>${esc(t('topback'))}</h3><div>${esc(t('topbackInfo'))}</div></div><button class="btn block" data-a="rpe-table">${esc(t('rpeTable'))}</button>`;
  } else if (sh.type === 'rpe') {
    const H = (STR[S.settings.lang] || STR.pl).rpeHints;
    const vals = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
    body = `${head('RPE')}<div class="muted small">${esc(t('rpeHintEmpty'))}</div>
      <div class="rpe-list" role="listbox" aria-label="RPE">${vals.map((v, i) => `<button role="option" aria-selected="${sh.cur === v}" class="rpe-opt ${sh.cur === v ? 'on' : ''}" style="--k:${(0.08 + i * 0.045).toFixed(3)}" data-a="rpe-set" data-v="${v}"><span class="n">${fmtN(v)}</span><span class="d">${esc(H[v])}</span>${sh.cur === v ? I.check : ''}</button>`).join('')}</div>
      <div class="btn-row"><button class="btn small ghost" data-a="rpe-set" data-v="">${esc(t('clear'))}</button><button class="btn small ghost" data-a="rpe-table">${esc(t('rpeTable'))}</button></div>`;
  } else if (sh.type === 'rpeTable') {
    const rows = Object.keys(RPE_TABLE).map(Number).sort((a, b) => b - a);
    body = `${head(t('rpeTable'))}<div class="muted small">${esc(t('rpeTableInfo'))}</div>
      <div class="rpe-wrap"><table class="rpe"><thead><tr><th scope="col">RPE</th>${Array.from({ length: 12 }, (_, i) => `<th scope="col">${i + 1}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr><th scope="row">${fmtN(r)}</th>${RPE_TABLE[r].map(v => `<td style="--h:${((v - 58) / 42).toFixed(2)}">${fmtN(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
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
      ${canPR(e) ? recordsBlock(e.id) : ''}
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
      ${window.REPSMITH_DATA ? '' : `<button class="btn block" data-a="export">${esc(t('exportBtn'))}</button>`}
      <button class="btn block" data-a="export-copy">${esc(t('copyBtn'))}</button>
      <button class="btn block" data-a="rpe-table">${esc(t('rpeTable'))}</button>
      <label class="btn block" for="importfile" style="margin:0;color:var(--text);font-size:16px">${esc(t('importBtn'))}</label><input id="importfile" type="file" accept="application/json,.json" hidden>
      <div class="credits"><div class="brand">${I.tally}<span>Repsmith</span></div><div>${esc(t('madeBy'))}</div><div class="muted small">${esc(t('version'))} ${VERSION} · ${esc(DB.ok ? t('dataLocal') : t('storageOff'))}</div></div>`;
  }
  el.innerHTML = `<div class="scrim" data-a="scrim"><div class="sheet" role="dialog" aria-modal="true">${body}</div></div>`;
  document.body.style.overflow = 'hidden';
  if (sh.type === 'picker' && sh._focus) { const i = $('#pickq'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}
function recordsBlock(exId) {
  const ex = S.ex.get(exId);
  const b = recordsFor(exId);
  const bwNote = ex.logging === 'BWX' && !S.measurements.some(m => num(m.weight) > 0) ? `<div class="muted small">${esc(t('bwMissing'))}</div>` : '';
  if (!b.w) return `<div><label>${esc(t('records'))}</label><div class="muted small">${esc(t('noRecords'))}</div>${bwNote}</div>`;
  const d = ts => fmtDate(ts, { day: 'numeric', month: 'short', year: 'numeric' });
  const row = (lbl, val, x) => `<div class="row"><span class="grow"><span class="name">${esc(val)}</span><br><span class="meta">${esc(lbl)} · ${esc(fmtEntry(ex, x.entry))}</span></span><span class="meta">${esc(d(x.at))}</span></div>`;
  return `<div><label>${esc(t('records'))}</label><div class="card">${row(t('bestWeight'), fmtN(b.w.val) + ' kg', b.w)}${b.e ? row(t('bestE1rm'), fmtN(Math.round(b.e.val * 10) / 10) + ' kg', b.e) : ''}${row(t('bestVol'), fmtN(Math.round(b.v.val)) + ' kg', b.v)}</div><div class="muted small" style="margin-top:6px">${esc(t('prHint'))}</div>${bwNote}</div>`;
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
    else if (tg.kind === 'progress') { S.prog.tab = 'strength'; S.prog.exId = id; closeSheet(); render(); }
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
      if (s.rpe !== '' && s.rpe != null) { const q = normRpe(s.rpe); s.rpe = q == null ? '' : String(q); }
      s.pr = detectPR(it.exId, s);
      if (s.pr.length) toast(`${t('prNew')}: ${prLabel(s.pr)}`);
      ensureAudio();
      startTimer(it.rest || S.settings.restI);
    } else { s.done = false; s.pr = []; }
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
  'prog-tab': el => { S.prog.tab = el.dataset.v; render(); },
  'prog-ex': el => { S.prog.tab = 'strength'; S.prog.exId = el.dataset.v; render(); window.scrollTo(0, 0); },
  'prog-ex-pick': () => openSheet({ type: 'picker', target: { kind: 'progress' } }),
  'prog-week': el => { S.prog.week = +el.dataset.v; render(); },
  'chart-tap': (el, ev) => chartTap(el, ev),
  'm-metric': el => { S.prog.metric = el.dataset.v; render(); },
  'm-sides': el => { const f = el.dataset.v; S.settings.sides = { ...(S.settings.sides || {}), [f]: !(S.settings.sides || {})[f] }; persist('settings'); render(); },
  'm-new': () => openSheet({ type: 'measure', draft: { date: now() } }),
  'm-edit': el => { const m = S.measurements.find(x => x.id === el.dataset.v); openSheet({ type: 'measure', editId: m.id, draft: clone(m) }); },
  'm-save': () => {
    readMeasure();
    const d = S.sheet.draft; const keys = [...MFIELDS, ...Object.values(SIDED).flat()];
    const rec = { id: S.sheet.editId || uid(), date: d.date };
    let any = false;
    for (const k of keys) { const v = num(d[k]); if (v > 0) { rec[k] = v; any = true; } }
    if (!any) { S.sheet.err = t('measureEmpty'); renderSheet(); return; }
    if (S.sheet.editId) S.measurements = S.measurements.map(x => (x.id === rec.id ? rec : x)); else S.measurements.push(rec);
    if (num(rec.weight) > 0) S.prog.metric = 'weight';
    persist('measurements'); closeSheet(); toast(t('saved')); render();
  },
  'm-del': () => { const id = S.sheet.editId; ask(t('deleteMeasurement') + '?', () => { S.measurements = S.measurements.filter(x => x.id !== id); persist('measurements'); render(); }, { danger: true, yes: t('delete') }); },
  'rpe-table': () => openSheet({ type: 'rpeTable' }),
  'item-rpe': () => { readItemFields(); const back = S.sheet; openSheet({ type: 'rpe', mode: 'item', back, cur: normRpe(back.item.rpe) }); },
  'rpe-open': el => { const it = findItem(el.dataset.i); const s = it.sets.find(x => x.id === el.dataset.s); openSheet({ type: 'rpe', itemId: it.id, setId: s.id, cur: normRpe(s.rpe) }); },
  'rpe-set': el => {
    if (S.sheet.mode === 'item') { const back = S.sheet.back; back.item.rpe = el.dataset.v === '' ? null : normRpe(el.dataset.v); openSheet(back); return; }
    const it = findItem(S.sheet.itemId); const s = it && it.sets.find(x => x.id === S.sheet.setId);
    if (s) { s.rpe = el.dataset.v; if (s.done) s.pr = detectPR(it.exId, s); saveActive(); }
    closeSheet(); render();
  },
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
    openSheet({ type: 'summary', mode: 'finish', left, name: S.active.name, difficulty: S.active.difficulty || null, note: S.active.note || '' });
  },
  rename: () => openSheet({ type: 'rename', name: S.active.name }),
  'rename-save': () => { const v = $('#rn').value.trim(); if (v) { S.active.name = v; saveActive(); } closeSheet(); render(); },
  'diff-pick': el => { readSummaryFields(); S.sheet.difficulty = +el.dataset.v === S.sheet.difficulty ? null : +el.dataset.v; renderSheet(); },
  'summary-save': () => {
    readSummaryFields();
    const sh = S.sheet;
    if (sh.mode === 'finish') {
      const s = clone(S.active); s.endedAt = now();
      s.name = sh.name || s.name; s.difficulty = sh.difficulty; s.note = sh.note;
      s.items = s.items.map(it => ({ ...it, sets: it.sets.filter(x => x.done) })).filter(it => it.sets.length);
      if (s.items.length) S.sessions.push(s);
      S.active = null; S.timer = null;
      persist('sessions', 'active');
      toast(t('workoutSaved'));
      go(s.items.length ? 'session' : 'today', s.id);
    } else {
      const s = S.sessions.find(x => x.id === sh.sessionId);
      s.name = sh.name || s.name; s.difficulty = sh.difficulty; s.note = sh.note;
      persist('sessions'); closeSheet(); render();
    }
  },
  repeat: el => {
    if (S.active) { toast(t('finishCurrentFirst')); return; }
    const src = S.sessions.find(x => x.id === el.dataset.v); if (!src) return;
    S.active = {
      id: uid(), name: src.name, templateId: src.templateId || null, dayId: src.dayId || null, repeatOf: src.id,
      startedAt: now(), endedAt: null, bw: bodyweightAt(now()),
      items: src.items.map(it => ({ id: uid(), exId: it.exId, scheme: it.scheme, rest: it.rest, backoffPct: it.backoffPct,
        sets: it.sets.map(x => newSet(x.kind, x.side, x.target || null)) })),
    };
    ensureAudio(); persist('active'); go('workout');
  },
  'summary-edit': el => { const s = S.sessions.find(x => x.id === el.dataset.v); openSheet({ type: 'summary', mode: 'edit', sessionId: s.id, name: s.name, difficulty: s.difficulty || null, note: s.note || '' }); },
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
function readSummaryFields() {
  const sh = S.sheet; if (!sh || sh.type !== 'summary') return;
  const n = $('#sum-name'), no = $('#sum-note');
  if (n) sh.name = n.value.trim(); if (no) sh.note = no.value.trim();
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
    settings: S.settings, templates: S.templates, sessions: S.sessions, notes: S.notes, customExercises: S.customExercises, active: S.active, measurements: S.measurements };
}
async function importBackup(text) {
  let o;
  try { o = JSON.parse(text); } catch (e) { o = null; }
  if (!o || o.app !== 'repsmith' || !Array.isArray(o.sessions)) { toast(t('importErr')); return; }
  ask(t('importQ'), async () => {
    S.settings = { ...S.settings, ...o.settings }; S.templates = o.templates || []; S.sessions = o.sessions || [];
    S.notes = o.notes || {}; S.customExercises = o.customExercises || []; S.active = o.active || null; S.measurements = o.measurements || [];
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
  if (el.dataset.a === 'chart-tap') { chartTap(el, ev); return; }
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
  const r = await fetch('data/exercises.json');
  if (!r.ok) throw new Error(`data/exercises.json: HTTP ${r.status}`);
  return r.json();
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
window.Repsmith = { S, A, substitutes, e1rm, rpePct, prEvents, weeklyVolume, weekStart, bodyweightAt };
boot().catch(err => {
  const pl = (navigator.language || 'pl').startsWith('pl');
  const app = document.getElementById('app');
  if (app) app.innerHTML = `<main class="screen"><div class="eyebrow">Repsmith</div><h1 class="mid">${pl ? 'Nie udało się uruchomić' : 'Could not start'}</h1>
    <p class="sub">${pl ? 'Brakuje pliku z bazą ćwiczeń <b>data/exercises.json</b> albo nie da się go wczytać. Sprawdź, czy w repozytorium jest folder <b>data</b> z tym plikiem oraz folder <b>icons</b>.' : 'The exercise file <b>data/exercises.json</b> is missing or cannot be read. Check that the repository has a <b>data</b> folder with this file and an <b>icons</b> folder.'}</p>
    <p class="muted small">${esc(String(err && err.message || err))}</p></main>`;
});
})();
