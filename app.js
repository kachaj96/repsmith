/* Repsmith v0.1 · local-first training log. No accounts, data lives in IndexedDB on the device. */
(() => {
'use strict';

const VERSION = '0.8.0';
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
    rpeHints: { 5: '5+ powtórzeń w zapasie, rozgrzewkowo', 10: 'Maks. Nic w zapasie', 9.5: 'Może 1 powt. więcej, ciężaru już nie', 9: '1 powtórzenie w zapasie', 8.5: '1–2 powtórzenia w zapasie', 8: '2 powtórzenia w zapasie', 7.5: '2–3 powtórzenia w zapasie', 7: '3 powtórzenia w zapasie, szybko', 6.5: '3–4 powtórzenia w zapasie', 6: '4+ powtórzeń w zapasie, lekko' },
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
    repeatOfLbl: 'Powtórzenie treningu z', restOver: 'Koniec przerwy', sounds: 'Dźwięki timera (odliczanie 5–1 i koniec przerwy)', on: 'Włączone', off: 'Wyłączone', front: 'Przód', back: 'Tył', showBody: 'Pokaż sylwetkę', hideBody: 'Ukryj sylwetkę', fewerSets: 'mniej serii', moreSets: 'więcej serii', tapMuscle: 'Stuknij mięsień, żeby zobaczyć liczbę serii.', movement: 'Ruch', muscleGroup: 'Partia (główna)', clearFilters: 'Wyczyść filtry', author: 'Autor', madeBy: 'Tworzy Adrian Drożdżyński', bodyCredit: 'Sylwetka mięśni: react-native-body-highlighter (ELABBASSI Hicham, licencja MIT)',
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
    rpeHints: { 5: '5+ reps left, warm-up feel', 10: 'Max. Nothing left', 9.5: 'Maybe 1 more rep, but no more weight', 9: '1 rep left', 8.5: '1–2 reps left', 8: '2 reps left', 7.5: '2–3 reps left', 7: '3 reps left, bar moves fast', 6.5: '3–4 reps left', 6: '4+ reps left, easy' },
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
    repeatOfLbl: 'Repeat of the workout from', restOver: 'Rest over', sounds: 'Timer sounds (5–1 countdown and end of rest)', on: 'On', off: 'Off', front: 'Front', back: 'Back', showBody: 'Show body', hideBody: 'Hide body', fewerSets: 'fewer sets', moreSets: 'more sets', tapMuscle: 'Tap a muscle to see its sets.', movement: 'Movement', muscleGroup: 'Muscle (main)', clearFilters: 'Clear filters', author: 'Author', madeBy: 'Made by Adrian Drożdżyński', bodyCredit: 'Muscle figure: react-native-body-highlighter (ELABBASSI Hicham, MIT License)',
    rpeTable: 'RPE table', rpeTableInfo: 'Percent of 1RM for a given number of reps and RPE, from Mike Tuchscherer’s table (RTS).\n\nThe app uses it to calculate e1RM and to suggest a weight for target reps at a target RPE. A set without RPE counts as RPE 10, RPE below 6.5 counts as 6.5 (the table does not go lower).',
  },
};
/* ---------- v0.6 strings: plans, selector, progression, flags ---------- */
Object.assign(STR.pl, {
  m_P1: 'Top set + backoff', m_P2: 'Liniowa', m_P3: 'Serie na RPE', m_P5: 'Minimalna dawka', m_H1: 'Podwójna progresja', m_H2: 'Serie na RIR',
  mi_P1: 'Jedna ciężka seria na zadane RPE, potem serie backoff na ustalony procent jej ciężaru.\n\nProgresja: top set na docelowym RPE lub lżej, następnym razem +krok. RPE o 1 wyżej: ten sam ciężar. O 2 wyżej albo zabrakło powtórzeń: −5%.\n\nKiedy: boje główne, gdy postęp zwolnił do 2-4 tygodni. Unikaj, jeśli nie umiesz ocenić RPE.',
  mi_P2: 'Stałe serie × powtórzenia, ten sam ciężar we wszystkich seriach.\n\nProgresja: każdy trening z kompletem powtórzeń to +krok. Dwa razy z rzędu nie weszło na tym samym ciężarze: zejście na 90% i budowanie od nowa.\n\nKiedy: nowe ćwiczenie albo powrót po przerwie, dopóki ciężar rośnie co trening. Gdy rośnie już tylko co 2-4 tygodnie, przejdź na top set albo RPE.',
  mi_P3: 'Stałe serie × powtórzenia, ciężar dobrany na zadane RPE.\n\nProgresja: wszystkie serie o 1 RPE lżej niż cel, następnym razem +2,5%. Któraś seria o 1 RPE ciężej: −2,5%.\n\nKiedy: objętość na bojach, dni lżejsze i średnie. Unikaj przy seriach 12+, bo wtedy ocena RPE jest mało dokładna.',
  mi_P5: 'Top set + backoff z małą liczbą serii, żeby utrzymać siłę przy minimum czasu.\n\nProgresja: ciężar stoi. Krok w górę tylko wtedy, gdy top set dwa razy z rzędu wyszedł o 1 RPE lżej niż cel.\n\nKiedy: utrzymanie, zajęty okres, 6-12 tygodni.',
  mi_H1: 'Zakres powtórzeń, np. 8-12, na stałym ciężarze.\n\nProgresja: najpierw dokładasz powtórzenia. Gdy wszystkie serie dojdą do górnej granicy przy docelowym RIR, dokładasz ciężar i wracasz do dolnej granicy.\n\nKiedy: domyślnie na akcesoria i pracę na masę.',
  mi_H2: 'Serie w zakresie powtórzeń, ciężar dobrany na docelowy RIR.\n\nProgresja: ciężar stoi, dopóki trafiasz w RIR. Gdy ostatnia seria wychodzi o 2+ RPE lżej niż cel, najmniejszy krok w górę.\n\nKiedy: izolacje, maszyny, nauka ruchu.',
  progression: 'Progresja', sugToday: 'Dziś',
  why_up: d => `+${fmtN(d.step)} kg: ostatnio cel osiągnięty`, why_hold: 'Ten sam ciężar: ostatnio RPE powyżej celu',
  why_down5: '−5%: ostatnio za ciężko albo zabrakło powtórzeń', why_holdKeep: 'Ten sam ciężar: utrzymanie',
  why_reset: 'Reset do 90%: dwa razy z rzędu nie weszło', why_retry: 'Ten sam ciężar: dobij wszystkie powtórzenia',
  why_up25: '+2,5%: ostatnio wszystkie serie lżej niż cel', why_down25: '−2,5%: ostatnio ciężej niż cel', why_holdP3: 'Ten sam ciężar: RPE w celu',
  why_reps: 'Ten sam ciężar, +1 powtórzenie w najsłabszej serii', why_upH2: d => `+${fmtN(d.step)} kg: ostatnia seria dużo lżej niż cel`,
  why_holdH2: 'Ten sam ciężar, trzymaj docelowy RIR', why_e1rm: d => `Z e1RM na RPE ${fmtN(d.rpe)}`,
  why_first: d => (d.rpe ? `Pierwszy raz: dobierz ciężar na RPE ${fmtN(d.rpe)}` : 'Pierwszy raz: dobierz ciężar, zostaw 2-3 powtórzenia w zapasie'),
  why_fixed: d => `Ciężar z e1RM na RPE ${fmtN(d.rpe)}`,
  cueReady: 'Słabszy dzień: top set zatrzymaj na RPE 7.', stopCue: 'Kończ serię, gdy sztanga wyraźnie zwolni względem pierwszego powtórzenia.',
  cueDeload: (p, l) => l ? `Tydzień deload: serie −${p}%, ciężar −${l}%.` : `Tydzień deload: serie −${p}%, ciężar bez zmian.`, cueFatigue: p => `Po sygnale zmęczenia: serie −${p}% na tym treningu.`,
  cueAdj90: 'Ciężar −10% po spadku e1RM.', cueStallEntry: 'Pierwszy tydzień na 90% ostatnich ciężarów.', cueBackoff: '+1 seria po sygnale stagnacji (przez 2 tygodnie).',
  cueRamp: n => `Blok masy: +${n} ${plural(n, 'seria', 'serie', 'serii')} dla partii do dociągnięcia.`,
  wizTitle: 'Dobór planu', wizNext: 'Dalej', wizStep: (a, b) => `Pytanie ${a} z ${b}`, wizRestart: 'Zacznij od nowa',
  usePlan: 'Użyj tego planu', yourPlan: 'Twój plan', alternatives: 'Inne opcje', estMin: n => `~${n} min`,
  trimmedNote: c => `Najdłuższy trening przytniemy do ${c} min: najpierw znikają izolacje z końca, potem serie akcesoriów. Boje główne zostają.`,
  addonOffer: m => `Masz zapas czasu. Dodać blok +${m} min do dwóch najkrótszych treningów?`,
  addonDropped: 'Blok dodatkowy pominięty: któraś partia przekroczyłaby 20 serii tygodniowo.', addonAdded: m => `Blok +${m} min dodany do dwóch treningów.`,
  effortLbl: 'Ocena wysiłku', effort_rir: 'RIR / RPE', effort_rir_cap: 'RPE max 8', effort_fixed: 'Ciężar z aplikacji',
  m4Title: 'Które ćwiczenia bolą? Usuń maksymalnie 2.', planCreated: 'Plan gotowy i ustawiony jako aktywny',
  planLib: 'Biblioteka planów', pickPlanWizard: 'Dobierz plan', perWeek: n => `${n}× w tygodniu`,
  tgReps: 'Powtórzenia', tgTime: 'Czas (s)', tgDist: 'Dystans (m)', tm_fixed: 'Stałe', tm_range: 'Zakres', tm_amrap: 'AMRAP / max', tmT_fixed: 'Czas', tmT_range: 'Zakres czasu', tmD_fixed: 'Dystans', tmD_range: 'Zakres dystansu',
  gearTitle: 'Ciężary i talerze', gearInfo: 'Aplikacja podpowiada tylko ciężary, które da się załadować. Puste listy oznaczają zaokrąglanie do kroku z ustawień.', gearPlates: 'Talerze', pairsLbl: 'par', gearBars: 'Gryfy (kg)', gearLists: 'Hantle, kettlebelle, maszyny, wyciągi',
  gearListHint: 'Zakres od-do/krok albo pojedyncze liczby, np. 2-10/2 12.5-30/2.5. Oddzielaj spacją lub średnikiem. Puste = bez ograniczeń.', gearListErr: tk => `Nie rozumiem: "${tk}". Użyj od-do/krok (np. 2-10/2).`, gearListCount: (n, a, b) => `${n} ciężarów, ${a}-${b} kg`, gearSaved: 'Zapisano ciężary',
  plateCalc: 'Kalkulator talerzy', pcTarget: 'Ciężar docelowy (kg)', pcBar: 'Gryf (kg)', pcSide: 'Na każdą stronę', pcExact: 'Dokładnie', pcNearest: 'Dokładnie tego się nie da. Najbliżej:', pcLower: '◀ Lżej', pcUpper: 'Ciężej ▶', pcUnder: 'Poniżej wagi gryfu.', pcNone: 'Nie masz ustawionych talerzy w tej jednostce.', pcBarOnly: 'Sam gryf', pcSet: 'Ustaw talerze', plateChip: 'Talerze',
  freeTitle: 'Dziś trening', freeText: 'Zapisuj serie, ciężary i RPE. Plan nie jest potrzebny, ćwiczenia dodajesz w trakcie.', startFree: 'Zacznij trening', startFreeHint: 'Pusty trening, ćwiczenia dodajesz po drodze',
  lastWorkout: 'Ostatni trening', lastWeek: 'Ostatnie 7 dni', weekMore: n => `Pokaż pozostałe (${n})`, weekLess: 'Pokaż mniej', repeatLast: 'Powtórz', planCardTitle: 'Wolisz trenować z planem?', planCardText: 'Dobierz plan w 12 pytaniach, wybierz gotowy z biblioteki albo zbuduj własny.', planCardBtn: 'Plany',
  plansEmptyTitle: 'Dobierz plan w 2 minuty', plansEmptyText: '12 krótkich pytań: cel, dni, czas, sprzęt. Dostajesz gotowy plan, a aplikacja prowadzi progresję za Ciebie.',
  wakeSet: 'Ekran podczas treningu', wakeOn: 'Nie wygaszaj', wakeOff: 'Standardowo', wakeNo: 'Ta przeglądarka nie pozwala blokować wygaszania ekranu.',
  lastBackupLbl: 'Ostatnia kopia', neverBackup: 'jeszcze nie robiona', persistOk: 'Dane chronione przed automatycznym czyszczeniem przez przeglądarkę.', persistNo: 'Przeglądarka może usunąć dane przy braku miejsca. Rób kopie.', 
  bkRemind: (n, d) => d ? `Ostatnia kopia sprzed ${d} dni, od tamtej pory ${n} ${n === 1 ? 'trening' : 'treningów'}. Zapisz nową.` : `Masz ${n} ${n === 1 ? 'trening' : 'treningów'} i żadnej kopii. Dane są tylko na tym telefonie.`, bkNow: 'Zapisz kopię', bkLater: 'Później',
  introTitle: 'Zanim zaczniesz', introText: 'Repsmith zapisuje wszystko tylko na tym telefonie, bez konta i bez synchronizacji. Zmiana telefonu albo wyczyszczenie danych przeglądarki kasuje historię, więc rób kopię w Ustawieniach.', introOk: 'Rozumiem',
  cycTitle: 'Cykl planu', cycRepeat: 'Powtarzany tydzień', cycFixed: 'Stała długość',
  cycRepeatD: 'Ten sam tydzień w kółko. Ciężary rosną z Twoich wyników.', cycFixedD: 'Plan ma określoną liczbę tygodni. Każdy tydzień może mieć inne serie, powtórzenia, %1RM albo RPE.',
  cycWeeks: 'Liczba tygodni', cycWeeksN: n => `${n} ${plural(n, 'tydzień', 'tygodnie', 'tygodni')}`, cycWeekOf: (w, n) => `Tydzień ${w} z ${n}`, cycDone: 'zakończony',
  cycNow: (w, n) => `Teraz: tydzień ${w} z ${n}`, cycCount: 'Tydzień zalicza się po zrobieniu tylu treningów, ile dni w tygodniu ma plan. Przerwa nie przesuwa planu, strzałkami poprawisz tydzień ręcznie.',
  cycStartNote: 'Liczenie tygodni ruszy od zapisu.', cycSumRepeat: 'Powtarzany tydzień', dlSumNone: 'bez deloadu', dlSumEvery: n => `deload co ${n} tyg.`, dlSumWeeks: l => `deload: tydz. ${l}`,
  cycRestart: 'Zacznij cykl od nowa', cycRestartQ: 'Liczenie tygodni wróci do tygodnia 1. Historia treningów zostaje.', cycSaved: 'Cykl zapisany', cycErrWeeks: 'Liczba tygodni: od 2 do 24.', cycErrEvery: 'Deload co 2 do 12 tygodni.', cycErrCut: 'Serie: 0-80%, ciężar: 0-30%.',
  dlTitle: 'Deload', dlNone: 'Bez deloadu', dlEvery: 'Co N tygodni', dlWeeks: 'Wybrane tygodnie', dlEveryLbl: 'Co ile tygodni', dlSets: 'Mniej serii (%)', dlLoad: 'Mniejszy ciężar (%)', dlPick: 'Dotknij tygodni, w których ma być deload.',
  dlInfo: (a, b) => `W tygodniu deloadu aplikacja zetnie serie o ${a}%${b ? ` i ciężar o ${b}%` : ''}, licząc od wartości z tego tygodnia. Progresja po deloadzie liczy się od zwykłych tygodni.`,
  pwLbl: 'Podgląd tygodnia', pwDl: 'Tydzień deloadu: serie i ciężar zetnie aplikacja przy starcie treningu.', skipWeek: 'pominięte w tym tygodniu',
  wkTitle: 'Tygodnie', wkBtn: n => `Rozpisz ${n} ${plural(n, 'tydzień', 'tygodnie', 'tygodni')}`, wkSet: n => `Zmienione: ${n} ${plural(n, 'tydzień', 'tygodnie', 'tygodni')}.`, wkNone: 'Każdy tydzień jak wyżej.',
  wkHint: b => `Puste pole = wartość bazowa (${b}). 0 serii = ćwiczenie pominięte w tym tygodniu.`, wkSets: 'Serie', wkReps: 'Powt.', wkPct: '%1RM', wkRpe: 'RPE', wkBack: 'Backoff',
  wkGen: 'Generator fali', wkGenD: 'Wartość rośnie albo spada równo z tygodnia na tydzień, tygodnie deloadu są pomijane. Ta sama wartość od i do kopiuje ją na wybrane tygodnie.',
  wkField: 'Co zmieniać', wkFrom: 'Wartość od', wkTo: 'Wartość do', wkW1: 'Od tygodnia', wkW2: 'Do tygodnia', wkApply: 'Wypełnij', wkClear: 'Wyczyść tygodnie', wkDone: 'Gotowe', wkGenErr: 'Wpisz obie wartości i zakres tygodni.',
  wkErr: (w, m) => `Tydzień ${w}: ${m}`, wkErrSets: 'serie od 0 do 20', wkErrReps: 'powtórzenia jak 5, 6-8 albo 5+', wkErrPct: '%1RM od 30 do 110', wkErrRpe: 'RPE od 5 do 10 co 0,5', wkErrBack: 'backoff od 0 do 10 serii',
  endTitle: 'Plan zakończony', endText: n => `Zrobione wszystkie tygodnie (${n}). Powtórz blok, ustaw nowy cykl albo wybierz inny plan.`, endRepeat: 'Powtórz blok', endCycle: 'Ustaw cykl', endPlans: 'Inny plan', endRestarted: 'Blok od nowa, tydzień 1',
  testTitle: 'Wyniki testu 1RM', testWas: kg => `teraz ${kg} kg`, testNoMax: 'bez zapisanego 1RM', testSave: 'Zapisz', testSaveAll: 'Zapisz nowe maksy', testSaved: 'Maksy zapisane', testFrom: (w, r) => `z serii ${w}×${r}`,
  needs1RM: 'Plan liczy ciężary z 1RM. Przed startem ustaw maksy głównych bojów (w treningu przy ćwiczeniu: Ustaw 1RM) albo zrób jedną sesję kalibracyjną.',
  whyBtn: 'Dlaczego tak? Źródła', whyTitle: 'Skąd te liczby', whySrc: 'Źródła',
  esTitle: 'Edytuj serię', esAdd: 'Dodaj serię', esNew: 'Nowa seria', esDel: 'Usuń serię', esRpe: 'RPE (puste = brak)', esWeightPlus: 'Dodatkowy ciężar (kg)', esErrRpe: 'RPE: od 1 do 10, co 0,5.', esErrEmpty: 'Wpisz wartość.', esSaved: 'Zapisano', esDeleted: 'Seria usunięta', tapToEdit: 'Dotknij serię, aby ją poprawić.', calList: 'Lista', calCal: 'Kalendarz', calMonthStat: 'Treningi', calStreak: 'Tyg. z rzędu', calNone: 'Brak treningów tego dnia.', calPrev: 'Poprzedni miesiąc', calNext: 'Następny miesiąc', cardBtn: 'Karta do udostępnienia', cardTitle: 'Karta treningu', cardHide: 'Ukryj ciężary', cardShare: 'Udostępnij', cardSave: 'Zapisz obraz', cardAlt: 'Podgląd karty treningu', cardMore: 'więcej', cardTop: 'Najlepsze serie',
  feedbackBtn: 'Wyślij uwagi', feedbackSub: 'Uwagi do aplikacji (v', feedbackBody: 'Co działa, co nie, czego brakuje:',
  npTitle: 'Nowy plan', npAsk: 'Jak chcesz budować plan?', npSimple: 'Prosty', npSimpleD: 'Ćwiczenie, serie, powtórzenia (stałe albo zakres) i przerwa. Aplikacja sama podpowiada ciężar i powtórzenia na kolejny trening. Dla większości wystarczy.',
  npAdv: 'Zaawansowany', npAdvD: 'Wszystko: metody progresji (top set + backoff, serie na RPE i RIR), zakres RPE albo % 1RM, rozgrzewki, backoff, AMRAP. Dla tych, którzy wiedzą, czego chcą.', npLater: 'Tryb możesz zmienić później w menu planu. Zapisane ustawienia nie znikają.', npNext: 'Dalej: wybór ćwiczeń',
  modeSimple: 'Tryb prosty', modeAdv: 'Tryb zaawansowany', modeToAdv: 'Przełącz na tryb zaawansowany', modeToSimple: 'Przełącz na tryb prosty', autoProg: 'Podpowiadaj ciężar i powtórzenia', autoProgD: 'Aplikacja liczy ciężar i powtórzenia na kolejny trening z Twojej historii. Wyłącz, jeśli chcesz wszystko ustawiać sam.', hiddenAdv: 'To ćwiczenie ma ustawienia zaawansowane (progresja, RPE, % 1RM). Zostają bez zmian. Edytujesz je w trybie zaawansowanym.', simpleHint: 'Serie × powtórzenia × przerwa',
  tgFrom: 'Od', tgTo: 'Do', bkLbl: 'Powtórzenia backoff', bkSame: 'Jak top set', bkSets: 'Serie backoff', tgMin: 'Minimum', tgVal: 'Liczba', efLbl: 'Intensywność', em_rpe: 'RPE', em_rrange: 'Zakres RPE', em_pct: '% 1RM', pctLbl: '% 1RM',
  amrapInfo: 'AMRAP: ile się da w dobrej technice, minimum podane wyżej. Ciężar zmieniasz sam, aplikacja go nie podnosi.',
  pctInfo: 'Ciężar = procent z 1RM. 1RM wpisane ręcznie ma pierwszeństwo, inaczej aplikacja bierze najlepszy e1RM z ostatnich 6 tygodni.',
  ormNone: 'Brak 1RM. Wpisz je albo zrób trening z RPE, aplikacja policzy e1RM.', ormLine: (kg, src) => `1RM: ${kg} kg (${src})`, ormManual: 'wpisane', ormApp: 'e1RM z aplikacji', ormSet: 'Ustaw 1RM',
  ormTitle: '1RM', ormField: 'Twoje 1RM (kg)', ormAppLine: v => v ? `e1RM z aplikacji (6 tyg.): ${v} kg` : 'Aplikacja nie ma jeszcze e1RM dla tego ćwiczenia.', ormClear: 'Usuń wpisane 1RM', ormHint: 'Puste pole = aplikacja liczy z e1RM.',
  err_tgEmpty: 'Wpisz liczbę.', err_tgOrder: 'Górna granica musi być większa od dolnej.', err_tgLim: (a, b) => `Dozwolone ${a}-${b}.`, err_rpeRange: 'Zakres RPE: ustaw "od" i "do", "do" większe od "od".', err_pct: 'Procent 1RM: od 30 do 100.', err_orm: 'Wpisz ciężar większy od 0.',
  methodSwitched: m => `Metoda zmieniona na: ${m}`, bkRepsHint: 'Puste = jak top set', rpeFrom: 'RPE od', rpeTo: 'RPE do',
  why_pct: d => `${fmtN(d.pct)}% z 1RM ${fmtN(d.orm)} kg (${d.src === 'manual' ? 'wpisane' : 'e1RM'})`, why_pctNone: d => `${fmtN(d.pct)}% 1RM: brak 1RM, ustaw je`, why_amrapOk: d => `AMRAP: ostatnio ${d.best} powt. (min. ${d.n}). Ciężar zostaje, zmieniasz go sam`, why_amrapLow: d => `AMRAP: ostatnio ${d.best} powt., poniżej minimum ${d.n}`, supLink: 'Połącz z następnym', supUnlink: 'Rozłącz z serii łączonej', supPick: 'Wybierz ćwiczenia do połączenia', supTag: 'seria łączona', supHint: n => n < 2 ? 'Dotknij kolejnych ćwiczeń, które chcesz połączyć' : `Wybrane: ${n}. Dotknij kolejne lub połącz`, supDo: 'Połącz', supBtn: 'Seria łączona',
  forLbl: 'Dla kogo', designLbl: 'Jak działa', deloadPlanLbl: 'Bloki i deload', warningLbl: 'Uwaga', notesLbl: 'Dlaczego tak',
  seeDetails: 'Zobacz rozpiskę', hideDetails: 'Ukryj rozpiskę', allGoals: 'Wszystkie',
  heroTitle: 'Dobierz plan w 2 minuty', heroText: '12 krótkich pytań: cel, dni, czas, sprzęt. Dostajesz gotowy plan, a aplikacja prowadzi progresję za Ciebie.',
  selfBuild: 'Ułożę plan sam',
  blockWeek: (w, l) => `Tydzień ${w} z ${l} bloku`, weekN: w => `Tydzień ${w} planu`, deloadNow: (p, l) => l ? `Deload: serie −${p}%, ciężar −${l}%` : `Deload: serie −${p}%, ciężary bez zmian`,
  flagsTitle: 'Sygnały',
  flag_stall: ex => `${ex}: e1RM stoi od 3 treningów.`, flag_regression: ex => `${ex}: e1RM spadł o ponad ${fmtN(S.settings.regressPct ?? 5)}% względem najlepszego z 4 tygodni, dwa razy z rzędu.`,
  flag_fatigue: () => `Ten sam ciężar szedł ciężej na co najmniej 2 ćwiczeniach. Następny trening: serie −${S.settings.fatigueCut ?? 30}%.`,
  flag_readiness: s => `Słabe samopoczucie przed treningiem (${s}/5). Serie były ścięte o 30%.`,
  flag_fake: ex => `${ex}: rekord przy RPE 6 lub lżej. Sprawdź wpis, zanim e1RM pójdzie w górę.`,
  flag_junk: p => `${p}% serii z ostatnich 7 dni było na RPE 5 lub lżej. Takie serie prawie nie budują mięśni.`,
  act_backoff: '+1 seria backoff na 2 tyg.', act_cut10: 'Obniż ciężar o 10%', act_ok: 'OK', act_confirm: 'Wpis jest poprawny', act_open: 'Otwórz trening',
  act_variant: 'Inne plany', act_deload: 'Deload na 7 dni', act_down: p => `Zejdź do: ${p}`, act_wizard: 'Kreator', act_later: 'Jeszcze nie',
  deloadOffer: 'Dwa sygnały w ciągu tygodnia. Zrób lżejszy tydzień: serie −40%, ciężary bez zmian.', deloadSet: 'Deload włączony na 7 dni',
  keepReview: n => `Utrzymanie trwa ${n} tyg. Ten plan jest na 6-12 tygodni. Zmieniasz cel?`,
  readyTitle: 'Jak się dziś czujesz?', readyText: 'Sen, zakwasy i nastrój razem. 1 = bardzo źle, 5 = świetnie.',
  readyLow: 'Przy 1-2 aplikacja zetnie serie o 30%, a top set zatrzymasz na RPE 7.', readySkip: 'Pomiń',
  calibChip: 'Kalibracja RPE', calibTitle: 'Seria kalibracyjna',
  calibText: 'Po rozgrzewce weź ciężar na około 8 powtórzeń. Rób powtórzenia, aż uznasz, że zostały 2 w zapasie. Zapamiętaj tę liczbę i rób dalej, ile się da w dobrej technice. Stop przy zmianie techniki.\n\nAplikacja porówna Twój strzał z rzeczywistością.',
  calibSafety: 'Nie rób tego na ciężkim przysiadzie bez asekuracji. Wyciskanie z asekuracją, maszyna albo suwnica są bezpieczniejsze.',
  calibW: 'Ciężar (kg)', calibGuess: 'Powtórzenia, gdy uznałeś, że zostały 2', calibTotal: 'Powtórzenia łącznie', calibSave: 'Zapisz serię',
  calibErr: 'Wpisz ciężar i oba powtórzenia (łącznie co najmniej tyle, ile przy strzale).',
  calibRes: e => `Pomyłka: ${e} ${plural(e, 'powtórzenie', 'powtórzenia', 'powtórzeń')}.`,
  calib_rir: 'Trafiasz dobrze. Zostań przy RIR / RPE.', calib_rir_cap: 'Pomyłka o około 2 powtórzenia. Lepiej RPE max 8 na bojach.',
  calib_fixed: 'Pomyłka o 3 lub więcej powtórzeń. Bezpieczniej, żeby ciężar liczyła aplikacja.', calibApply: m => `Ustaw w planie: ${m}`, calib: 'Kalibr.',
  feelTitle: 'Jak poszło?', feelEasy: 'Łatwo', feelOk: 'Zgodnie z planem', feelHard: 'Ciężko',
  feelEasyD: 'Zostało sporo w zapasie', feelOkD: 'Tak, jak miało być', feelHardD: 'Na granicy, ledwo weszło', fullScale: 'Pełna skala RPE',
  lagTitle: 'Partie do dociągnięcia', lagHint: 'W bloku masy dostają w tygodniach 2-4 po +1 serii tygodniowo. Wybierz dwie.',
  tallyTitle: 'Serie tygodniowo na partię', tallyHint: 'Wyliczone z planu: mięsień główny 1, pomocniczy 0,5.',
  zonesHint: 'Strefy: poniżej 4 minimum, 4-10 efektywna, 10-20 typowa, ponad 20 wysoko (mniej z każdej kolejnej serii).',
  z_low: 'poniżej minimum', z_eff: 'efektywna', z_work: 'typowa', z_high: 'wysoko',
  spikeMuscle: (m, v) => `${m}: ${fmtN(v)} serii na jednym treningu. Powyżej 10 kolejne serie dają mało.`,
  spikeLift: (x, v) => `${x}: ${fmtN(v)} serii jednego boju na treningu. Powyżej 5 zmęczenie rośnie szybciej niż siła.`,
  changePlan: 'Zmień plan (kreator)', last7: 'Ostatnie 7 dni', prev7: '7 dni wcześniej',
  volumeHint2: 'Liczą się serie ciężkie: RPE 6 lub więcej albo bez RPE. Mięsień główny 1, pomocniczy 0,5. Jednorącz L+P to jedna seria.',
  coachSec: 'Plan i sygnały', readinessSet: 'Pytanie o samopoczucie przed treningiem z planu', flagsSet: 'Sygnały ostrzegawcze',
  deloadEverySet: 'Deload co N tyg. (plany z kreatora bez własnego cyklu)', regressSet: 'Spadek e1RM liczony jako regres (%)', fatigueSet: 'Cięcie serii przy zmęczeniu (%)',
  spikeTitle: 'Uwagi do objętości', goalLbl: 'Cel', planFrom: 'Z biblioteki', noMethod: 'Bez progresji',
});
Object.assign(STR.en, {
  m_P1: 'Top set + backoff', m_P2: 'Linear', m_P3: 'RPE sets', m_P5: 'Minimum dose', m_H1: 'Double progression', m_H2: 'Sets at RIR',
  mi_P1: 'One heavy set at a target RPE, then backoff sets at a fixed percentage of its load.\n\nProgression: top set at or below target RPE, add one step next time. 1 RPE above target: keep the load. 2 above or reps missed: −5%.\n\nWhen: main lifts once progress has slowed to every 2-4 weeks. Avoid if you cannot rate RPE.',
  mi_P2: 'Fixed sets × reps, same load on every set.\n\nProgression: every session with all reps done adds one step. Same load failed twice in a row: reset to 90% and build up again.\n\nWhen: new to the lift or returning after a break, while the load still goes up every session. Once it only moves every 2-4 weeks, switch to top set or RPE.',
  mi_P3: 'Fixed sets × reps, load chosen to hit the RPE.\n\nProgression: all sets 1 RPE or more below target, +2.5% next time. Any set 1 RPE or more above target, −2.5%.\n\nWhen: volume work on main lifts, light and medium days. Avoid for sets of 12+, where RPE gets inaccurate.',
  mi_P5: 'Top set + backoff with few sets to hold strength on minimal time.\n\nProgression: hold the load. Add a step only if the top set came in 1 RPE or more below target twice in a row.\n\nWhen: maintenance, busy phases, 6-12 weeks.',
  mi_H1: 'A rep range, e.g. 8-12, at a fixed load.\n\nProgression: add reps first. When all sets reach the top of the range at the target RIR, add load and drop back to the bottom.\n\nWhen: default for accessories and size work.',
  mi_H2: 'Sets in a rep range, load picked for the RIR target.\n\nProgression: keep the load while you hit the RIR. When the last set ends 2+ RPE easier than target, add the smallest step.\n\nWhen: isolation, machines, learning a movement.',
  progression: 'Progression', sugToday: 'Today',
  why_up: d => `+${fmtN(d.step)} kg: target hit last time`, why_hold: 'Same load: RPE above target last time',
  why_down5: '−5%: too heavy or reps missed last time', why_holdKeep: 'Same load: maintenance',
  why_reset: 'Reset to 90%: failed twice in a row', why_retry: 'Same load: get all the reps',
  why_up25: '+2.5%: all sets easier than target last time', why_down25: '−2.5%: harder than target last time', why_holdP3: 'Same load: RPE on target',
  why_reps: 'Same load, +1 rep on the weakest set', why_upH2: d => `+${fmtN(d.step)} kg: last set much easier than target`,
  why_holdH2: 'Same load, keep the target RIR', why_e1rm: d => `From e1RM at RPE ${fmtN(d.rpe)}`,
  why_first: d => (d.rpe ? `First time: pick a load for RPE ${fmtN(d.rpe)}` : 'First time: pick a load, leave 2-3 reps in reserve'),
  why_fixed: d => `Load from e1RM at RPE ${fmtN(d.rpe)}`,
  cueReady: 'Rough day: stop the top set at RPE 7.', stopCue: 'Stop the set when the bar clearly slows compared with the first rep.',
  cueDeload: (p, l) => l ? `Deload week: sets −${p}%, weight −${l}%.` : `Deload week: sets −${p}%, same load.`, cueFatigue: p => `After a fatigue flag: sets −${p}% in this workout.`,
  cueAdj90: 'Load −10% after an e1RM drop.', cueStallEntry: 'First week at 90% of your last loads.', cueBackoff: '+1 set after a stall flag (for 2 weeks).',
  cueRamp: n => `Size block: +${n} set${n === 1 ? '' : 's'} for the lagging muscles.`,
  wizTitle: 'Plan finder', wizNext: 'Next', wizStep: (a, b) => `Question ${a} of ${b}`, wizRestart: 'Start over',
  usePlan: 'Use this plan', yourPlan: 'Your plan', alternatives: 'Other options', estMin: n => `~${n} min`,
  trimmedNote: c => `The longest session gets trimmed to ${c} min: isolation work at the end goes first, then accessory sets. Main lifts stay.`,
  addonOffer: m => `You have spare time. Add a +${m} min block to the two shortest sessions?`,
  addonDropped: 'Add-on block skipped: a muscle would go above 20 weekly sets.', addonAdded: m => `+${m} min block added to two sessions.`,
  effortLbl: 'Effort rating', effort_rir: 'RIR / RPE', effort_rir_cap: 'RPE max 8', effort_fixed: 'App sets the load',
  m4Title: 'Which exercises hurt? Remove up to 2.', planCreated: 'Plan ready and set as active',
  planLib: 'Plan library', pickPlanWizard: 'Find a plan', perWeek: n => `${n}× per week`,
  tgReps: 'Reps', tgTime: 'Time (s)', tgDist: 'Distance (m)', tm_fixed: 'Fixed', tm_range: 'Range', tm_amrap: 'AMRAP / max', tmT_fixed: 'Time', tmT_range: 'Time range', tmD_fixed: 'Distance', tmD_range: 'Distance range',
  gearTitle: 'Weights and plates', gearInfo: 'The app only suggests loads you can actually make. Empty lists mean rounding to the step in settings.', gearPlates: 'Plates', pairsLbl: 'pairs', gearBars: 'Bars (kg)', gearLists: 'Dumbbells, kettlebells, machines, cables',
  gearListHint: 'Range from-to/step or single numbers, e.g. 2-10/2 12.5-30/2.5. Separate with a space or semicolon. Empty = no limit.', gearListErr: tk => `Cannot read: "${tk}". Use from-to/step (e.g. 2-10/2).`, gearListCount: (n, a, b) => `${n} weights, ${a}-${b} kg`, gearSaved: 'Weights saved',
  plateCalc: 'Plate calculator', pcTarget: 'Target weight (kg)', pcBar: 'Bar (kg)', pcSide: 'Per side', pcExact: 'Exactly', pcNearest: 'Cannot make exactly that. Closest:', pcLower: '◀ Lighter', pcUpper: 'Heavier ▶', pcUnder: 'Below the bar weight.', pcNone: 'No plates set up in this unit.', pcBarOnly: 'Bar only', pcSet: 'Set up plates', plateChip: 'Plates',
  freeTitle: 'Train today', freeText: 'Log sets, loads and RPE. No plan needed, add exercises as you go.', startFree: 'Start workout', startFreeHint: 'Empty workout, add exercises along the way',
  lastWorkout: 'Last workout', lastWeek: 'Last 7 days', weekMore: n => `Show ${n} more`, weekLess: 'Show less', repeatLast: 'Repeat', planCardTitle: 'Prefer training with a plan?', planCardText: 'Find a plan in 12 questions, pick one from the library or build your own.', planCardBtn: 'Plans',
  plansEmptyTitle: 'Find a plan in 2 minutes', plansEmptyText: '12 short questions: goal, days, time, equipment. You get a ready plan and the app runs the progression for you.',
  wakeSet: 'Screen during workout', wakeOn: 'Keep awake', wakeOff: 'Default', wakeNo: 'This browser cannot keep the screen awake.',
  lastBackupLbl: 'Last backup', neverBackup: 'never', persistOk: 'Data is protected from automatic clearing by the browser.', persistNo: 'The browser may delete data when storage runs low. Keep backups.',
  bkRemind: (n, d) => d ? `Last backup was ${d} days ago, ${n} workout${n === 1 ? '' : 's'} since. Save a new one.` : `You have ${n} workout${n === 1 ? '' : 's'} and no backup. Your data lives only on this phone.`, bkNow: 'Save backup', bkLater: 'Later',
  introTitle: 'Before you start', introText: 'Repsmith keeps everything only on this phone, with no account and no sync. Changing phones or clearing browser data deletes your history, so make a backup in Settings.', introOk: 'Got it',
  cycTitle: 'Plan cycle', cycRepeat: 'Repeating week', cycFixed: 'Fixed length',
  cycRepeatD: 'The same week on repeat. Loads go up from your results.', cycFixedD: 'The plan has a set number of weeks. Each week can have its own sets, reps, %1RM or RPE.',
  cycWeeks: 'Number of weeks', cycWeeksN: n => `${n} week${n === 1 ? '' : 's'}`, cycWeekOf: (w, n) => `Week ${w} of ${n}`, cycDone: 'finished',
  cycNow: (w, n) => `Now: week ${w} of ${n}`, cycCount: 'A week counts once you have done as many workouts as the plan has days per week. A break does not move the plan; use the arrows to fix the week by hand.',
  cycStartNote: 'Week counting starts when you save.', cycSumRepeat: 'Repeating week', dlSumNone: 'no deload', dlSumEvery: n => `deload every ${n} wk`, dlSumWeeks: l => `deload: wk ${l}`,
  cycRestart: 'Restart the cycle', cycRestartQ: 'Week counting goes back to week 1. Your workout history stays.', cycSaved: 'Cycle saved', cycErrWeeks: 'Number of weeks: 2 to 24.', cycErrEvery: 'Deload every 2 to 12 weeks.', cycErrCut: 'Sets: 0-80%, load: 0-30%.',
  dlTitle: 'Deload', dlNone: 'No deload', dlEvery: 'Every N weeks', dlWeeks: 'Chosen weeks', dlEveryLbl: 'Every how many weeks', dlSets: 'Fewer sets (%)', dlLoad: 'Less weight (%)', dlPick: 'Tap the weeks that should be a deload.',
  dlInfo: (a, b) => `In a deload week the app cuts sets by ${a}%${b ? ` and weight by ${b}%` : ''}, starting from that week's values. Progression after the deload continues from normal weeks.`,
  pwLbl: 'Preview week', pwDl: 'Deload week: the app cuts sets and weight when the workout starts.', skipWeek: 'skipped this week',
  wkTitle: 'Weeks', wkBtn: n => `Set up ${n} weeks`, wkSet: n => `Changed: ${n} week${n === 1 ? '' : 's'}.`, wkNone: 'Every week as above.',
  wkHint: b => `Empty field = base value (${b}). 0 sets = exercise skipped that week.`, wkSets: 'Sets', wkReps: 'Reps', wkPct: '%1RM', wkRpe: 'RPE', wkBack: 'Backoff',
  wkGen: 'Wave generator', wkGenD: 'The value rises or falls evenly week to week, deload weeks are skipped. The same value for from and to copies it to the chosen weeks.',
  wkField: 'What to change', wkFrom: 'Value from', wkTo: 'Value to', wkW1: 'From week', wkW2: 'To week', wkApply: 'Fill', wkClear: 'Clear weeks', wkDone: 'Done', wkGenErr: 'Enter both values and the week range.',
  wkErr: (w, m) => `Week ${w}: ${m}`, wkErrSets: 'sets 0 to 20', wkErrReps: 'reps like 5, 6-8 or 5+', wkErrPct: '%1RM 30 to 110', wkErrRpe: 'RPE 5 to 10 in steps of 0.5', wkErrBack: 'backoff 0 to 10 sets',
  endTitle: 'Plan finished', endText: n => `All ${n} weeks done. Repeat the block, set a new cycle or pick another plan.`, endRepeat: 'Repeat block', endCycle: 'Set cycle', endPlans: 'Other plan', endRestarted: 'Block restarted, week 1',
  testTitle: '1RM test results', testWas: kg => `now ${kg} kg`, testNoMax: 'no saved 1RM', testSave: 'Save', testSaveAll: 'Save new maxes', testSaved: 'Maxes saved', testFrom: (w, r) => `from ${w}×${r}`,
  needs1RM: 'This plan calculates loads from your 1RM. Before starting, set maxes for the main lifts (in a workout, next to the exercise: Set 1RM) or do one calibration session.',
  whyBtn: 'Why? Sources', whyTitle: 'Where these numbers come from', whySrc: 'Sources',
  esTitle: 'Edit set', esAdd: 'Add set', esNew: 'New set', esDel: 'Delete set', esRpe: 'RPE (empty = none)', esWeightPlus: 'Added weight (kg)', esErrRpe: 'RPE: 1 to 10 in steps of 0.5.', esErrEmpty: 'Enter a value.', esSaved: 'Saved', esDeleted: 'Set deleted', tapToEdit: 'Tap a set to fix it.', calList: 'List', calCal: 'Calendar', calMonthStat: 'Workouts', calStreak: 'Weeks in a row', calNone: 'No workouts on this day.', calPrev: 'Previous month', calNext: 'Next month', cardBtn: 'Shareable card', cardTitle: 'Workout card', cardHide: 'Hide weights', cardShare: 'Share', cardSave: 'Save image', cardAlt: 'Workout card preview', cardMore: 'more', cardTop: 'Top sets',
  feedbackBtn: 'Send feedback', feedbackSub: 'App feedback (v', feedbackBody: 'What works, what does not, what is missing:',
  npTitle: 'New plan', npAsk: 'How do you want to build it?', npSimple: 'Simple', npSimpleD: 'Exercise, sets, reps (fixed or a range) and rest. The app suggests the load and reps for your next workout. Enough for most people.',
  npAdv: 'Advanced', npAdvD: 'Everything: progression methods (top set + backoff, RPE and RIR sets), RPE range or % 1RM, warm-ups, backoff, AMRAP. For those who know what they want.', npLater: 'You can change the mode later in the plan menu. Saved settings stay.', npNext: 'Next: pick exercises',
  modeSimple: 'Simple mode', modeAdv: 'Advanced mode', modeToAdv: 'Switch to advanced mode', modeToSimple: 'Switch to simple mode', autoProg: 'Suggest load and reps', autoProgD: 'The app works out the load and reps for your next workout from your history. Turn off to set everything yourself.', hiddenAdv: 'This exercise has advanced settings (progression, RPE, % 1RM). They stay as they are. Edit them in advanced mode.', simpleHint: 'Sets × reps × rest',
  tgFrom: 'From', tgTo: 'To', bkLbl: 'Backoff reps', bkSame: 'Same as top set', bkSets: 'Backoff sets', tgMin: 'Minimum', tgVal: 'Value', efLbl: 'Intensity', em_rpe: 'RPE', em_rrange: 'RPE range', em_pct: '% 1RM', pctLbl: '% 1RM',
  amrapInfo: 'AMRAP: as many good reps as you can, at least the minimum above. You change the load yourself, the app does not raise it.',
  pctInfo: 'Load = percent of 1RM. A 1RM you enter wins, otherwise the app uses your best e1RM from the last 6 weeks.',
  ormNone: 'No 1RM yet. Enter it, or log a workout with RPE and the app will estimate it.', ormLine: (kg, src) => `1RM: ${kg} kg (${src})`, ormManual: 'entered', ormApp: 'app e1RM', ormSet: 'Set 1RM',
  ormTitle: '1RM', ormField: 'Your 1RM (kg)', ormAppLine: v => v ? `App e1RM (6 wks): ${v} kg` : 'The app has no e1RM for this exercise yet.', ormClear: 'Remove entered 1RM', ormHint: 'Leave empty to use the app e1RM.',
  err_tgEmpty: 'Enter a number.', err_tgOrder: 'The upper bound must be higher than the lower one.', err_tgLim: (a, b) => `Allowed ${a}-${b}.`, err_rpeRange: 'RPE range: set both ends, "to" higher than "from".', err_pct: '% of 1RM: 30 to 100.', err_orm: 'Enter a load above 0.',
  methodSwitched: m => `Method changed to: ${m}`, bkRepsHint: 'Empty = same as top set', rpeFrom: 'RPE from', rpeTo: 'RPE to',
  why_pct: d => `${fmtN(d.pct)}% of 1RM ${fmtN(d.orm)} kg (${d.src === 'manual' ? 'entered' : 'e1RM'})`, why_pctNone: d => `${fmtN(d.pct)}% 1RM: no 1RM yet, set it`, why_amrapOk: d => `AMRAP: last time ${d.best} reps (min. ${d.n}). Load stays, you change it`, why_amrapLow: d => `AMRAP: last time ${d.best} reps, below the minimum of ${d.n}`, supLink: 'Link with next', supUnlink: 'Remove from superset', supPick: 'Pick exercises to link', supTag: 'superset', supHint: n => n < 2 ? 'Tap the other exercises you want to link' : `Selected: ${n}. Tap more or link`, supDo: 'Link', supBtn: 'Superset',
  forLbl: 'Who it is for', designLbl: 'How it works', deloadPlanLbl: 'Blocks and deload', warningLbl: 'Warning', notesLbl: 'Why this',
  seeDetails: 'Show the plan', hideDetails: 'Hide the plan', allGoals: 'All',
  heroTitle: 'Find a plan in 2 minutes', heroText: '12 short questions: goal, days, time, equipment. You get a ready plan and the app runs the progression for you.',
  selfBuild: 'I will build my own',
  blockWeek: (w, l) => `Week ${w} of ${l} in the block`, weekN: w => `Week ${w} of the plan`, deloadNow: (p, l) => l ? `Deload: sets −${p}%, weight −${l}%` : `Deload: sets −${p}%, same loads`,
  flagsTitle: 'Flags',
  flag_stall: ex => `${ex}: e1RM has not moved in 3 workouts.`, flag_regression: ex => `${ex}: e1RM fell more than ${fmtN(S.settings.regressPct ?? 5)}% below the 4-week best, twice in a row.`,
  flag_fatigue: () => `The same load felt harder on 2 or more lifts. Next workout: sets −${S.settings.fatigueCut ?? 30}%.`,
  flag_readiness: s => `Low readiness before the workout (${s}/5). Sets were cut by 30%.`,
  flag_fake: ex => `${ex}: record logged at RPE 6 or easier. Check the entry before e1RM goes up.`,
  flag_junk: p => `${p}% of sets in the last 7 days were at RPE 5 or easier. Those sets barely build muscle.`,
  act_backoff: '+1 backoff set for 2 wk', act_cut10: 'Lower the load by 10%', act_ok: 'OK', act_confirm: 'The entry is correct', act_open: 'Open workout',
  act_variant: 'Other plans', act_deload: 'Deload for 7 days', act_down: p => `Step down to: ${p}`, act_wizard: 'Plan finder', act_later: 'Not yet',
  deloadOffer: 'Two flags within a week. Take a lighter week: sets −40%, same loads.', deloadSet: 'Deload on for 7 days',
  keepReview: n => `Maintenance has run for ${n} weeks. This plan is meant for 6-12 weeks. Change the goal?`,
  readyTitle: 'How do you feel today?', readyText: 'Sleep, soreness and mood together. 1 = very bad, 5 = great.',
  readyLow: 'At 1-2 the app cuts sets by 30% and you stop the top set at RPE 7.', readySkip: 'Skip',
  calibChip: 'RPE calibration', calibTitle: 'Calibration set',
  calibText: 'After warming up, take a load you can do about 8 reps with. Do reps until you believe 2 are left. Remember that number, then keep going as long as form holds. Stop at a form change.\n\nThe app compares your call with what really happened.',
  calibSafety: 'Do not do this on a heavy squat without safeties. A bench with safeties, a machine or a leg press is safer.',
  calibW: 'Load (kg)', calibGuess: 'Reps when you thought 2 were left', calibTotal: 'Total reps', calibSave: 'Save set',
  calibErr: 'Enter the load and both rep counts (total at least as many as the call).',
  calibRes: e => `Off by ${e} rep${e === 1 ? '' : 's'}.`,
  calib_rir: 'Your calls are good. Stay with RIR / RPE.', calib_rir_cap: 'Off by about 2 reps. RPE max 8 on main lifts is safer.',
  calib_fixed: 'Off by 3 or more reps. Better to let the app set the load.', calibApply: m => `Set for the plan: ${m}`, calib: 'Calib.',
  feelTitle: 'How did it go?', feelEasy: 'Easy', feelOk: 'As planned', feelHard: 'Hard',
  feelEasyD: 'Plenty left in the tank', feelOkD: 'Just as it should be', feelHardD: 'At the limit, barely made it', fullScale: 'Full RPE scale',
  lagTitle: 'Lagging muscles', lagHint: 'In a size block they get +1 weekly set in weeks 2-4. Pick two.',
  tallyTitle: 'Weekly sets per muscle', tallyHint: 'From the plan: main muscle 1, supporting 0.5.',
  zonesHint: 'Zones: under 4 below minimum, 4-10 efficient, 10-20 common, over 20 high (less from each extra set).',
  z_low: 'below minimum', z_eff: 'efficient', z_work: 'common', z_high: 'high',
  spikeMuscle: (m, v) => `${m}: ${fmtN(v)} sets in one workout. Above 10, extra sets add little.`,
  spikeLift: (x, v) => `${x}: ${fmtN(v)} sets of one lift in a workout. Above 5, fatigue grows faster than strength.`,
  changePlan: 'Change plan (finder)', last7: 'Last 7 days', prev7: 'Previous 7 days',
  volumeHint2: 'Hard sets count: RPE 6 or more, or no RPE. Main muscle 1, supporting 0.5. A one-arm L+R pair is one set.',
  coachSec: 'Plan and flags', readinessSet: 'Ask about readiness before a plan workout', flagsSet: 'Warning flags',
  deloadEverySet: 'Deload every N wk (wizard plans without their own cycle)', regressSet: 'e1RM drop that counts as regression (%)', fatigueSet: 'Set cut after fatigue (%)',
  spikeTitle: 'Volume notes', goalLbl: 'Goal', planFrom: 'From the library', noMethod: 'No progression',
});
function plural(n, one, few, many) {
  if (n === 1) return one;
  const d = n % 10, h = n % 100;
  return d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
}
const t = (k, ...a) => { const v = (STR[S.settings.lang] || STR.pl)[k]; return typeof v === 'function' ? v(...a) : (v ?? k); };
const L = () => (S.settings.lang === 'en' ? 1 : 0);

/* ---------- icons ---------- */
const I = {
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/></svg>',
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
// input hygiene: no spaces anywhere, reps are whole numbers, weights take at most one separator (',' or '.')
const cleanInt = v => String(v).replace(/\D/g, '');
const cleanDec = v => { const s = String(v).replace(/[^\d.,]/g, ''); const m = s.search(/[.,]/); return m < 0 ? s : s.slice(0, m + 1) + s.slice(m + 1).replace(/[.,]/g, ''); };
const cleanField = (k, v) => k === 'reps' ? cleanInt(v) : cleanDec(v);
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
const G = window.RepsmithGear;
const gearCfg = () => G.norm(S.settings && S.settings.gear);
const eqOf = exId => (S.ex.get(exId) || {}).equipment || '';
const snapLoad = (exId, v, up) => G.snap(gearCfg(), eqOf(exId), v, up);
const roundLoad = (exId, v) => { const s = snapLoad(exId, v); return s != null ? s : roundTo(v, S.settings.increment); };
const isBarEx = exId => G.BAR_CLASSES.includes(eqOf(exId));
const FEEDBACK_EMAIL = ''; // set to a real address to show the feedback button
const KEYS = ['settings', 'templates', 'sessions', 'notes', 'customExercises', 'active', 'measurements', 'flags', 'calib', 'maxes'];
const persist = (...keys) => Promise.all(keys.map(k => DB.set(k, clone(S[k]))));

/* ---------- state ---------- */
const S = {
  settings: { lang: (navigator.language || 'pl').startsWith('pl') ? 'pl' : 'en', restC: 180, restI: 90, increment: 2.5, backoffPct: 90, activeTemplateId: null, sides: { arm: false, thigh: false },
    readiness: true, flagsOn: true, deloadEvery: 5, regressPct: 5, fatigueCut: 30, effortDefault: 'rir' },
  templates: [], sessions: [], notes: {}, customExercises: [], active: null, measurements: [], flags: [], calib: [], maxes: {},
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
/* ---------- targets: reps / time / distance and intensity (v0.6.2) ---------- */
const tgtKind = exId => ({ T: 'T', WD: 'WD' }[logOf(exId)] || 'reps');
const TGT_LIM = { reps: [1, 100], T: [1, 600], WD: [1, 2000] };
const REP_MODES = { P1: ['fixed', 'range'], P2: ['fixed', 'amrap'], P3: ['fixed', 'range'], P5: ['fixed'], H1: ['range'], H2: ['fixed', 'range'] };
const EF_MODES = { P1: ['rpe', 'rrange', 'pct'], P2: ['rpe', 'rrange', 'pct'], P3: ['rpe', 'rrange'], P5: ['rpe', 'rrange', 'pct'], H1: ['rpe', 'rrange'], H2: ['rpe', 'rrange'] };
function parseTarget(v) {
  const s = String(v ?? '').trim();
  let m = s.match(/^(\d+)\s*\+$/); if (m) return { mode: 'amrap', lo: +m[1], hi: +m[1] };
  m = s.match(/^(\d+)\s*-\s*(\d+)$/); if (m) return +m[1] === +m[2] ? { mode: 'fixed', lo: +m[1], hi: +m[1] } : { mode: 'range', lo: +m[1], hi: +m[2] };
  m = s.match(/^(\d+)$/); if (m) return { mode: 'fixed', lo: +m[1], hi: +m[1] };
  return null;
}
const fmtTarget = o => (o.mode === 'amrap' ? `${o.lo}+` : o.mode === 'range' && o.hi !== o.lo ? `${o.lo}-${o.hi}` : `${o.lo}`);
/* repair any old free-text target into a valid one */
function normTarget(v, exId, dflt) {
  const kind = tgtKind(exId); const [a, b] = TGT_LIM[kind];
  let o = parseTarget(v);
  if (!o) {
    const ns = (String(v ?? '').replace(/(\d+)[.,]\d+/g, '$1').match(/\d+/g) || []).map(Number);
    if (ns.length >= 2) o = { mode: 'range', lo: ns[0], hi: ns[1] };
    else if (ns.length === 1) o = { mode: /\+/.test(String(v)) ? 'amrap' : 'fixed', lo: ns[0], hi: ns[0] };
    else return dflt;
  }
  const cl = x => Math.min(b, Math.max(a, x));
  o.lo = cl(o.lo); o.hi = cl(o.hi);
  if (o.lo > o.hi) [o.lo, o.hi] = [o.hi, o.lo];
  if (o.mode === 'range' && o.lo === o.hi) o.mode = 'fixed';
  if (o.mode === 'amrap' && kind !== 'reps') o.mode = 'fixed';
  return fmtTarget(o);
}
function normItem(it) {
  const before = JSON.stringify(it);
  const d = defaultItem(it.exId);
  it.reps = normTarget(it.reps, it.exId, d.reps);
  if (it.backoffReps != null && it.backoffReps !== '') { const o = parseTarget(normTarget(String(it.backoffReps).replace('+', ''), it.exId, '')); it.backoffReps = o && o.mode !== 'amrap' ? fmtTarget(o) : ''; }
  const ri = x => { const v = num(x); return v == null ? null : Math.round(v); };
  it.sets = Math.min(20, Math.max(1, ri(it.sets) ?? 3));
  it.warmups = Math.min(10, Math.max(0, ri(it.warmups) ?? 0));
  it.rest = Math.min(900, Math.max(10, ri(it.rest) ?? d.rest));
  const q = normRpe(it.rpe); it.rpe = q == null ? null : q;
  const qm = normRpe(it.rpeMax); it.rpeMax = it.rpe == null ? null : qm == null || qm < it.rpe ? it.rpe : qm;
  if (it.pct != null) { const p = num(it.pct); if (p >= 30 && p <= 100 && logOf(it.exId) === 'W') { it.pct = p; it.rpe = null; it.rpeMax = null; } else delete it.pct; }
  return JSON.stringify(it) !== before;
}
function normTemplates() {
  let ch = false;
  for (const tp of S.templates) for (const d of tp.days || []) for (const it of d.items || []) if (normItem(it)) ch = true;
  return ch;
}
/* 1RM for percentage loads: entered value wins, else best e1RM from the last 6 weeks, else the latest */
function appOneRm(exId, beforeTs = now()) {
  const pts = e1rmSeries(exId).filter(p => p.x < beforeTs);
  if (!pts.length) return null;
  const recent = pts.filter(p => p.x >= beforeTs - 42 * 864e5);
  return Math.round(Math.max(...(recent.length ? recent : pts.slice(-1)).map(p => p.y)) * 10) / 10;
}
function oneRm(exId, beforeTs) {
  const m = S.maxes && S.maxes[exId];
  if (m && num(m.kg) > 0) return { kg: num(m.kg), src: 'manual' };
  const a = appOneRm(exId, beforeTs);
  return a ? { kg: a, src: 'app' } : null;
}
const repMode = it => (parseTarget(it.reps) || { mode: 'fixed' }).mode;
const efMode = it => (it.pct ? 'pct' : it.rpe != null && it.rpeMax != null && it.rpeMax > it.rpe ? 'rrange' : 'rpe');
function repModesFor(exId, mth) {
  const kind = tgtKind(exId);
  return kind !== 'reps' ? ['fixed', 'range'] : ['fixed', 'range', 'amrap'];
}
function efModesFor(exId) { return logOf(exId) === 'W' ? ['rpe', 'rrange', 'pct'] : ['rpe', 'rrange']; }
function intensityShort(it) {
  if (it.pct) return ` @${fmtN(it.pct)}%`;
  if (it.rpe == null) return '';
  return it.rpeMax != null && it.rpeMax > it.rpe ? ` @${fmtN(it.rpe)}-${fmtN(it.rpeMax)}` : ` @${fmtN(it.rpe)}`;
}
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
      if (!x.done || x.pend || !prEligible(ex, x, bw)) continue;
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
/* recompute stored PR badges for one exercise after editing a finished workout */
function recalcPRs(ses, exId) {
  const ex = S.ex.get(exId); const bw = sessionBw(ses); const it = ses.items.find(x => x.exId === exId); if (!it) return;
  const all = entriesFor(exId);
  for (const s of it.sets) {
    if (!s.done) continue;
    if (!prEligible(ex, s, bw)) { s.pr = []; continue; }
    const base = all.filter(e => e.sesAt < ses.startedAt);
    if (!base.length) { s.pr = []; continue; }
    const ts = s.doneAt || ses.startedAt;
    const prev = all.filter(e => e.set.id !== s.id && (e.sesAt < ses.startedAt || (e.sesId === ses.id && e.at < ts)));
    s.pr = prTypes({ load: loadOf(ex, s, bw), reps: num(s.reps), rpe: s.rpe }, prev);
  }
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
/* template item -> session item. mods: cut (0..1), extraSets, extraBackoff, rpeCap, loadPct, cues */
function sessionItemFromTemplate(it, mods = {}, ctx = {}) {
  const ex = S.ex.get(it.exId);
  const method = C.methodOf(it), kind = C.kindOf(it);
  let nWork = it.sets || 1, nBack = it.backoffSets || 0;
  if (mods.extraSets) nWork += mods.extraSets;
  if (mods.cut) { if (it.scheme === 'topback') nBack = Math.max(0, Math.round(nBack * (1 - mods.cut))); else nWork = Math.max(1, Math.round(nWork * (1 - mods.cut))); }
  if (mods.extraBackoff && it.scheme === 'topback') nBack += 1;
  let rpe = it.rpe, rpeMax = it.rpeMax ?? null;
  if (mods.rpeCap && rpe != null && kind === 'main') { rpe = Math.min(rpe, mods.rpeCap); if (rpeMax != null) rpeMax = Math.min(rpeMax, mods.rpeCap); }
  const pct = it.pct || null;
  const sets = [];
  pushSets(sets, ex, 'warmup', it.warmups || 0, null);
  if (it.scheme === 'topback') {
    pushSets(sets, ex, 'top', 1, { reps: it.reps, rpe, rpeMax, pct });
    pushSets(sets, ex, 'backoff', nBack, { reps: it.backoffReps || String(it.reps).replace('+', ''), rpe: null });
  } else {
    pushSets(sets, ex, 'work', nWork, { reps: it.reps, rpe, rpeMax, pct });
  }
  const sig = `${method || ''}|${it.reps}|${it.scheme}`;
  const out = { id: uid(), exId: it.exId, scheme: it.scheme, rest: it.rest, backoffPct: it.backoffPct || S.settings.backoffPct, sets,
    method, kind, reps: it.reps, rpe, rpeMax, sig, tplItemId: it.id || null };
  if (pct) out.pct = pct;
  if (it.group) out.group = it.group;
  const cues = [...(mods.cues || [])];
  if (it.cue) cues.unshift(tx(it.cue));
  if (ctx.effort === 'rir_cap' && kind === 'main') cues.push(t('stopCue'));
  if (cues.length) out.cues = cues;
  if (it.noprog) out.noprog = true;
  if (it.test) out.test = true;
  const sug = it.noprog ? null : C.suggest({ exId: it.exId, method, reps: it.reps, rpe, rpeMax: rpeMax ?? rpe, scheme: it.scheme, sets: nWork, pct }, { before: ctx.at || now(), sig, effort: ctx.effort });
  if (sug) { if (sug.load != null && mods.loadPct) sug.load = roundLoad(it.exId, sug.load * mods.loadPct); out.sug = sug; }
  return out;
}
/* first exercise per lagging muscle that gets the size-block ramp sets */
function lagItemIds(tpl) {
  const ids = [];
  for (const m of tpl.lag || []) {
    const all = tpl.days.flatMap(d => d.items).filter(i => !ids.includes(i.id) && (S.ex.get(i.exId) || { primary: [] }).primary.includes(m));
    const best = all.find(i => i.method === 'H1' || i.method === 'H2') || all[0];
    if (best) ids.push(best.id);
  }
  return ids;
}
function planMods(tpl, it, bi, ready) {
  const m = { cues: [] };
  if (bi && bi.deload) m.cut = bi.cut;
  else if (tpl.fatigueNext) m.cut = (S.settings.fatigueCut ?? 30) / 100;
  if (ready != null && ready <= 2) { m.cut = Math.max(m.cut || 0, 0.3); m.rpeCap = 7; if (C.kindOf(it) === 'main') m.cues.push(t('cueReady')); }
  if (bi && bi.ramp && lagItemIds(tpl).includes(it.id)) { m.extraSets = bi.ramp; m.cues.push(t('cueRamp', bi.ramp)); }
  const adj = tpl.adjust && tpl.adjust[it.exId];
  if (adj && adj.until && adj.until > now() && adj.extraBackoff) { if (it.scheme === 'topback') m.extraBackoff = 1; else m.extraSets = (m.extraSets || 0) + 1; m.cues.push(t('cueBackoff')); }
  if (adj && adj.loadPct) { m.loadPct = adj.loadPct; m.cues.push(t('cueAdj90')); }
  if (tpl.stallEntry && bi && bi.weeksTotal === 1) { m.loadPct = (m.loadPct || 1) * 0.9; m.cues.push(t('cueStallEntry')); }
  if (bi && bi.deload && bi.loadCut) m.loadPct = (m.loadPct || 1) * (1 - bi.loadCut);
  return m;
}
function freeItem(exId) {
  const ex = S.ex.get(exId);
  const it = defaultItem(exId);
  const sets = [];
  pushSets(sets, ex, 'work', 3, null);
  return { id: uid(), exId, scheme: 'straight', rest: it.rest, backoffPct: S.settings.backoffPct, sets };
}
const wkItem = (it, bi) => (bi && bi.fixed ? C.weekItem(it, bi.week) : it);
const skipped = it => it.scheme !== 'topback' && Number(it.sets) === 0;
const dlLabel = bi => t('deloadNow', bi.cycle.deload.sets, bi.cycle.deload.load);
const weekLabel = bi => (bi.fixed ? t('cycWeekOf', bi.week, bi.weeks) : bi.len ? t('blockWeek', bi.week, bi.len) : t('weekN', bi.weeksTotal));
function dlSummary(c) {
  return c.deload.mode === 'every' ? t('dlSumEvery', c.deload.every) : c.deload.mode === 'weeks' && c.deload.weeks.length ? t('dlSumWeeks', c.deload.weeks.join(', ')) : t('dlSumNone');
}
function cycleSummary(tp) {
  const c = C.cycleOf(tp);
  if (!c) return `${t('cycSumRepeat')} · ${t('dlSumNone')}`;
  if (c.type === 'fixed') { const bi = C.blockInfo(tp); return `${t('cycWeeksN', c.weeks)} · ${bi.finished ? t('cycDone') : t('cycWeekOf', bi.week, c.weeks)} · ${dlSummary(c)}`; }
  return `${t('cycSumRepeat')} · ${dlSummary(c)}`;
}
/* best test-week result per lift since the cycle started */
function testResults(tp, c) {
  const out = {};
  for (const ses of S.sessions) {
    if (ses.templateId !== tp.id || ses.startedAt < c.start) continue;
    for (const it of ses.items) {
      if (!it.test) continue;
      for (const x of it.sets) {
        if (!x.done || x.kind === 'warmup') continue;
        const w = num(x.weight), r = num(x.reps);
        if (!(w > 0) || !(r >= 1)) continue;
        const kg = r === 1 ? w : Math.floor((e1rm(w, r, normRpe(x.rpe) || 10) || w) * 2) / 2;
        if (!out[it.exId] || kg > out[it.exId].kg) out[it.exId] = { kg, w, r };
      }
    }
  }
  return out;
}
function endCard(tp, bi) {
  const res = testResults(tp, bi.cycle);
  const ids = Object.keys(res);
  const rows = ids.map(id => { const o = oneRm(id); const r = res[id]; return `<div class="row"><span class="grow"><span class="name">${esc(exName(id))}: ${esc(fmtN(r.kg))} kg</span><br><span class="meta">${r.r > 1 ? esc(t('testFrom', fmtN(r.w), r.r)) + ' · ' : ''}${esc(o ? t('testWas', fmtN(o.kg)) : t('testNoMax'))}</span></span><button class="btn small" data-a="test-save" data-v="${esc(id)}">${esc(t('testSave'))}</button></div>`; }).join('');
  return `<div class="info"><h3 style="font-size:18px">${esc(t('endTitle'))}</h3><div>${esc(t('endText', bi.weeks))}</div>
    ${ids.length ? `<div><div class="eyebrow small" style="margin-top:6px">${esc(t('testTitle'))}</div>${rows}${ids.length > 1 ? `<button class="btn small block" data-a="test-save" data-v="">${esc(t('testSaveAll'))}</button>` : ''}</div>` : ''}
    <div class="btn-row wrap"><button class="btn small primary" data-a="cyc-again" data-v="${tp.id}">${esc(t('endRepeat'))}</button><button class="btn small" data-a="cyc-open" data-v="${tp.id}">${esc(t('endCycle'))}</button><button class="btn small ghost" data-a="nav" data-v="plans">${esc(t('endPlans'))}</button></div></div>`;
}
function weekChips(id, n, sel, c) {
  return `<div><label>${esc(t('pwLbl'))}</label><div class="chips wrap wk-chips" role="group" aria-label="${esc(t('pwLbl'))}">${Array.from({ length: n }, (_, i) => i + 1).map(w => { const dl = c && C.isDeloadWeek(c, w); return `<button class="chip ${w === sel ? 'on' : ''} ${dl ? 'dl' : ''}" data-a="pw-pick" data-k="${id}" data-v="${w}" aria-pressed="${w === sel}">${w}${dl ? '<small>D</small>' : ''}</button>`; }).join('')}</div>${c && C.isDeloadWeek(c, sel) ? `<div class="muted small" style="margin-top:6px">${esc(t('pwDl'))}</div>` : ''}</div>`;
}
const pwOf = (id, bi) => { const v = S.pw && S.pw[id]; return v && v <= (bi.weeks || 1) ? v : (bi.finished ? 1 : bi.week); };
const resolvedDays = (days, w) => (w ? days.map(d => ({ ...d, items: d.items.map(it => C.weekItem(it, w)).filter(it => !skipped(it)) })) : days);
function activeTemplate() { return S.templates.find(x => x.id === S.settings.activeTemplateId) || null; }
function nextDay(tpl) {
  if (!tpl || !tpl.days.length) return null;
  const last = S.sessions.filter(s => s.templateId === tpl.id).sort((a, b) => b.startedAt - a.startedAt)[0];
  if (!last) return tpl.days[0];
  const i = tpl.days.findIndex(d => d.id === last.dayId);
  return tpl.days[(i + 1) % tpl.days.length] || tpl.days[0];
}
function startSession(tpl, day, opts = {}) {
  const at = now();
  const bi = tpl ? C.blockInfo(tpl, at) : null;
  const effort = tpl ? tpl.effort || null : null;
  const notes = [];
  if (bi && bi.deload) notes.push(t('cueDeload', bi.cycle.deload.sets, bi.cycle.deload.load));
  else if (tpl && tpl.fatigueNext) notes.push(t('cueFatigue', S.settings.fatigueCut ?? 30));
  const items = day ? day.items.map(it => wkItem(it, bi)).filter(it => !skipped(it)).map(it => sessionItemFromTemplate(it, tpl ? planMods(tpl, it, bi, opts.ready) : {}, { effort, at })) : [];
  S.active = {
    id: uid(), name: day ? day.name : t('freeWorkout'), templateId: tpl ? tpl.id : null, dayId: day ? day.id : null,
    startedAt: at, endedAt: null, items, bw: bodyweightAt(at), effort, ready: opts.ready ?? null, notes,
    week: bi ? { week: bi.week, len: bi.len, deload: bi.deload, fixed: bi.fixed, weeks: bi.weeks } : null,
  };
  if (tpl && day) {
    // one-shot adjustments are used up by this workout
    tpl.fatigueNext = false;
    if (tpl.adjust) for (const it of day.items) { const a = tpl.adjust[it.exId]; if (a && a.loadPct) delete a.loadPct; }
    persist('templates');
  }
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
/* ---------- coach (plans, selector, progression, flags) ---------- */
const C = window.RepsmithCoach.factory({
  ex: () => S.ex, settings: () => S.settings, sessions: () => S.sessions, uid, num, normRpe, rpePct, e1rm, roundTo,
  lang: () => L(), lastE1rm, loadOf, sessionBw, oneRm, snap: snapLoad,
});
const CD = window.RepsmithCoach.DATA;
const tx = arr => (Array.isArray(arr) ? arr[L()] || arr[0] : arr || '');
const planName = p => tx(p.name);
const goalName = g => tx(CD.goalName[g]);
const methodName = m => (m ? t('m_' + m) : t('noMethod'));
const ZONES = { floor: 4, eff: 10, work: 20 };
const METHODS = ['P1', 'P5', 'P2', 'P3', 'H1', 'H2'];

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
function tone(freq, start, dur, vol) {
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.value = freq; o.connect(g); g.connect(audioCtx.destination);
  const t0 = audioCtx.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
const soundOn = () => S.settings.sound !== false;
/* short soft tick for 5..1 s left */
function tick() { if (!audioCtx || !soundOn()) return; try { tone(660, 0, 0.09, 0.18); } catch (e) {} }
/* end of rest: two rising tones + vibration */
function beep() {
  try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) {}
  if (!audioCtx || !soundOn()) return;
  try { tone(880, 0, 0.18, 0.3); tone(1175, 0.2, 0.28, 0.3); } catch (e) {}
}
function startTimer(sec) { S.timer = { endAt: now() + sec * 1000, total: sec, fired: false, lastTick: null }; clearTimeout(S._timerHide); renderTimer(); }
function adjustTimer(d) {
  if (!S.timer) return;
  if (S.timer.fired) { if (d > 0) startTimer(d); return; } // after the end, +15 s starts a fresh 15 s
  S.timer.endAt += d * 1000; S.timer.total = Math.max(1, S.timer.total + d);
  if (S.timer.endAt <= now()) S.timer.endAt = now();
  S.timer.lastTick = null;
  renderTimer();
}
function stopTimer() { clearTimeout(S._timerHide); S.timer = null; renderTimer(); }
function renderTimer() {
  let el = $('#timer');
  if (!S.timer || S.view !== 'workout') { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.id = 'timer'; el.className = 'timer'; document.body.appendChild(el); }
  const left = Math.max(0, (S.timer.endAt - now()) / 1000);
  const done = left <= 0;
  const pct = done ? 100 : Math.min(100, (1 - left / S.timer.total) * 100);
  if (!el.firstChild) {
    el.innerHTML = `<div class="timer-inner"><div class="timer-row"><div><div class="eyebrow small" id="tlbl"></div><div class="big" id="tbig"></div></div>
      <div class="btns"><button class="btn" data-a="timer-adj" data-v="-15">−15 s</button><button class="btn" data-a="timer-adj" data-v="15">+15 s</button><button class="btn" data-a="timer-skip">${esc(t('skip'))}</button></div></div>
      <div class="bar"><i id="tbar"></i></div></div>`;
  }
  const secs = Math.ceil(left);
  $('#tlbl').textContent = done ? t('restOver') : t('restTimer');
  $('#tbig').textContent = fmtClock(secs);
  $('#tbig').classList.toggle('over', done || secs <= 5);
  $('#tbar').style.width = pct + '%';
  if (!done && secs <= 5 && secs >= 1 && S.timer.lastTick !== secs) { S.timer.lastTick = secs; tick(); }
  if (done && !S.timer.fired) {
    S.timer.fired = true; beep();
    clearTimeout(S._timerHide); S._timerHide = setTimeout(() => { if (S.timer && S.timer.fired) stopTimer(); }, 4000);
  }
}
setInterval(() => {
  if (S.timer && !S.timer.fired) renderTimer();
  const c = $('#wclock'); if (c && S.active) c.textContent = fmtDur(now() - S.active.startedAt);
}, 250);

/* ---------- navigation ---------- */
function go(view, arg) { S.view = view; S.viewArg = arg ?? null; S.sheet = null; S._navAnim = true; render(); window.scrollTo(0, 0); }
function openSheet(sheet) { S.sheet = sheet; renderSheet(); }
function closeSheet() { S.sheet = null; renderSheet(); }
function toast(msg) {
  S.toast = msg; let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg; el.hidden = false; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => { el.hidden = true; el.classList.remove('show'); }, 2200);
}

/* ---------- render: shell ---------- */
let _wake = null;
function syncWake() {
  if (!('wakeLock' in navigator)) return;
  const want = !!S.active && S.settings.wake !== false && document.visibilityState === 'visible';
  if (want && !_wake) {
    _wake = 'pending';
    navigator.wakeLock.request('screen').then(l => { if (S.active && S.settings.wake !== false) { _wake = l; l.addEventListener('release', () => { if (_wake === l) _wake = null; }); } else { l.release(); _wake = null; } }).catch(() => { _wake = null; });
  } else if (!want && _wake && _wake !== 'pending') { const l = _wake; _wake = null; l.release().catch(() => {}); }
}
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
    case 'wizard': html = vWizard(); break;
    case 'wizres': html = vWizRes(); break;
    case 'planlib': html = vPlanLib(); break;
    case 'newplan': html = vNewPlan(); break;
    case 'planprev': html = vPlanPrev(); break;
    default: html = vToday();
  }
  app.innerHTML = html + (S.view === 'workout' || S.view === 'wizard' ? '' : nav());
  if (S._navAnim && app.firstElementChild) app.firstElementChild.classList.add('enter');
  S._navAnim = false; S._justDone = null;
  renderTimer();
  renderSheet();
  syncWake();
  if (S.view === 'library') { const i = $('#libq'); if (i && S._libFocus) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}
function nav() {
  const tab = { today: 'today', plans: 'plans', plan: 'plans', wizard: 'plans', wizres: 'plans', planlib: 'plans', planprev: 'plans', history: 'history', session: 'history', library: 'library', progress: 'progress' }[S.view];
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
function introCard() {
  if (S.settings.seenIntro || S.sessions.length >= 3) return '';
  return `<div class="info"><h3 style="font-size:18px">${esc(t('introTitle'))}</h3><div>${esc(t('introText'))}</div><div><button class="btn small" data-a="intro-ok">${esc(t('introOk'))}</button></div></div>`;
}
const DAY = 864e5;
function recentCard() {
  const all = S.sessions.slice().sort((x, y) => y.startedAt - x.startedAt);
  if (!all.length) return '';
  let list = all.filter(x => x.startedAt > now() - 7 * DAY);
  if (!list.length) list = [all[0]];
  const LIM = 3, open = !!S._weekAll, shown = open ? list : list.slice(0, LIM);
  const rows = shown.map(x => `<div class="row" style="border:0;min-height:48px"><span class="grow"><span class="name">${esc(x.name)}</span><br><span class="meta">${esc(fmtDate(x.startedAt, { weekday: 'short', day: 'numeric', month: 'short' }))} · ${sessionStats(x).sets} ${esc(t('setsDone').toLowerCase())}</span></span><button class="btn small" data-a="repeat" data-v="${x.id}">${esc(t('repeatLast'))}</button></div>`).join('');
  const tog = list.length > LIM ? `<button class="btn small ghost" data-a="week-toggle" style="width:100%">${esc(open ? t('weekLess') : t('weekMore', list.length - LIM))}</button>` : '';
  return `<div class="card" style="padding:12px 16px"><div class="eyebrow small">${esc(list.length > 1 || list[0].startedAt > now() - 7 * DAY ? t('lastWeek') : t('lastWorkout'))}</div>${rows}${tog}</div>`;
}
function backupDue() {
  const st = S.settings; const n = S.sessions.length;
  if (n < 3 || (st.bkSnooze && st.bkSnooze > now())) return null;
  const last = st.lastBackup || 0;
  const since = S.sessions.filter(s => s.startedAt > last).length;
  const oldest = Math.min(...S.sessions.map(s => s.startedAt));
  if (!last) return now() - oldest > 7 * DAY ? { n: since, d: 0 } : null;
  const days = Math.floor((now() - last) / DAY);
  return days >= 28 && since >= 3 ? { n: since, d: days } : null;
}
function backupCard() {
  if (S.active) return '';
  const due = backupDue(); if (!due) return '';
  return `<div class="banner coach"><div class="grow"><div class="eyebrow small">${esc(t('backup'))}</div><div>${esc(t('bkRemind', due.n, due.d))}</div><div class="btn-row wrap"><button class="btn small primary" data-a="bk-now">${esc(t('bkNow'))}</button><button class="btn small ghost" data-a="bk-later">${esc(t('bkLater'))}</button></div></div></div>`;
}
function vToday() {
  const tpl = activeTemplate();
  const day = (S._pickedDay && tpl && tpl.days.find(d => d.id === S._pickedDay)) || nextDay(tpl);
  const wc = weekCount();
  let main = '';
  const tbi = tpl ? C.blockInfo(tpl) : null;
  if (tpl && day && tbi && tbi.finished && !S.active) {
    main = `<div><div class="eyebrow">${esc(fmtDate(now()))}</div><h1>${esc(tpl.name)}</h1></div>${endCard(tpl, tbi)}
      <button class="btn block" data-a="start-free">${esc(t('emptyWorkout'))}</button>`;
  } else if (tpl && day) {
    const items = day.items.map(it => wkItem(it, tbi)).filter(it => !skipped(it));
    const rows = items.slice(0, 5).map(it => `<div class="row"><span class="name grow">${esc(exName(it.exId))}</span><span class="meta">${esc(schemeShort(it))}</span></div>`).join('');
    const more = items.length > 5 ? `<div class="row"><span class="meta">+ ${items.length - 5}</span></div>` : '';
    const bi = tbi;
    const blk = bi ? `<div class="blk"><span>${esc(weekLabel(bi))}</span>${bi.deload ? `<span class="tag p">${esc(dlLabel(bi))}</span>` : ''}</div>` : '';
    main = `<div><div class="eyebrow">${esc(fmtDate(now()))}</div><h1>${esc(day.name)}</h1><div class="sub" style="margin-top:8px">${esc(tpl.name)} · ${esc(t('exercisesN', items.length))}</div>${blk}</div>
      ${coachCards(tpl, bi)}
      ${items.length ? `<div class="card">${rows}${more}</div>` : `<div class="empty">${esc(t('planEmptyDay'))}</div>`}
      ${S.active ? '' : `<div class="btn-row" style="flex-direction:column"><button class="btn primary block" data-a="start-day">${esc(t('startWorkout'))}</button><button class="btn block" data-a="start-free">${esc(t('emptyWorkout'))}</button></div>`}
      ${tpl.days.length > 1 ? `<div class="chips" role="group" aria-label="${esc(t('day'))}">${tpl.days.map(d => `<button class="chip ${d.id === day.id ? 'on' : ''}" data-a="pick-day" data-v="${d.id}">${esc(d.name)}</button>`).join('')}</div>` : ''}`;
  } else {
    main = `<div><div class="eyebrow">${esc(fmtDate(now()))}</div><h1>${esc(t('freeTitle'))}</h1><div class="sub" style="margin-top:8px">${esc(t('freeText'))}</div></div>
      ${S.active ? '' : `<div><button class="btn primary block" data-a="start-free">${esc(t('startFree'))}</button><div class="muted small" style="margin-top:8px;text-align:center">${esc(t('startFreeHint'))}</div></div>`}
      ${S.active ? '' : recentCard()}
      ${coachCards(null, null)}
      <div class="info"><h3 style="font-size:18px">${esc(t('planCardTitle'))}</h3><div>${esc(t('planCardText'))}</div><div><button class="btn small" data-a="nav" data-v="plans">${esc(t('planCardBtn'))}</button></div></div>`;
  }
  const target = tpl ? (tpl.perWeek || tpl.days.length) : 0;
  const week = target
    ? `<div><div class="sub small" style="display:flex;justify-content:space-between;margin-bottom:8px"><span>${esc(t('thisWeek'))}</span><span>${esc(t('ofWorkouts', Math.min(wc, target), target))}</span></div><div class="progress">${Array.from({ length: target }, (_, i) => `<span class="${i < wc ? 'on' : ''}"></span>`).join('')}</div></div>`
    : (wc ? `<div class="sub small">${esc(t('thisWeek'))}: ${esc(t('workoutsDone', wc))}</div>` : '');
  return `<main class="screen">${topbar()}${resumeBanner()}${introCard()}${backupCard()}${main}${week}${DB.ok ? '' : `<div class="err">${esc(t('storageOff'))}</div>`}</main>`;
}
function schemeShort(it, simple) {
  const u = targetUnit(it.exId);
  if (it.scheme === 'topback') return `top ${it.reps}${u}${intensityShort(it)} + ${it.backoffSets}×${it.backoffReps || String(it.reps).replace('+', '')}${u}`;
  return `${it.sets} × ${it.reps}${u}${simple ? '' : intensityShort(it)}`;
}

/* ---------- view: plans ---------- */
function vNewPlan() {
  const np = S.np || (S.np = { name: t('newPlan') });
  const card = (m, title, desc) => `<button class="sub-opt" data-a="np-create" data-v="${m}"><span class="n">${esc(title)}</span><span class="muted">${esc(desc)}</span></button>`;
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="nav" data-v="plans" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(t('plans'))}</div><span style="width:44px"></span></div>
    <h1 class="mid">${esc(t('npTitle'))}</h1>
    <div><label for="np-name">${esc(t('planName'))}</label><input id="np-name" data-f="np-name" maxlength="60" value="${esc(np.name)}"></div>
    <div class="sub">${esc(t('npAsk'))}</div>
    ${card('simple', t('npSimple'), t('npSimpleD'))}
    ${card('advanced', t('npAdv'), t('npAdvD'))}
    <div class="muted small">${esc(t('npLater'))}</div></main>`;
}
const planMode = tp => (tp && tp.mode === 'simple' ? 'simple' : 'advanced');
function vPlans() {
  const list = S.templates.map(tp => `<button class="list-btn row" data-a="open-plan" data-v="${tp.id}"><span class="grow"><span class="name">${esc(tp.name)}</span><br><span class="meta">${tp.days.length} × ${esc(t('day').toLowerCase())}</span></span>${tp.id === S.settings.activeTemplateId ? `<span class="tag p">${esc(t('active'))}</span>` : ''}</button>`).join('');
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('plans'))}</h1>
    ${S.templates.length ? `<div class="card">${list}</div>` : `<div class="info"><h3 style="font-size:18px">${esc(t('plansEmptyTitle'))}</h3><div>${esc(t('plansEmptyText'))}</div></div>`}
    <button class="btn primary block" data-a="wiz-start">${esc(t('pickPlanWizard'))}</button>
    <button class="btn block" data-a="nav" data-v="planlib">${esc(t('planLib'))}</button>
    <button class="btn block" data-a="new-plan">${esc(t('newPlan'))}</button></main>`;
}
function vPlan() {
  const tp = S.templates.find(x => x.id === S.viewArg);
  if (!tp) return vPlans();
  const pbi = C.blockInfo(tp);
  const pv = pbi && pbi.fixed ? pwOf(tp.id, pbi) : 0;
  const days = tp.days.map((d, di) => `
    <section class="card" style="padding:14px 16px;display:flex;flex-direction:column;gap:10px">
      ${d.items.length ? `<div class="muted small">${esc(t('estMin', Math.round(C.sessionMinutes(resolvedDays([d], pv)[0].items.map(i => ({ ...i, kind: C.kindOf(i) }))))))}</div>` : ''}
      <div style="display:flex;gap:8px;align-items:flex-end">
        <div style="flex:1;min-width:0"><label for="dn-${d.id}">${esc(t('dayName'))}</label><input id="dn-${d.id}" data-f="day-name" data-d="${d.id}" value="${esc(d.name)}"></div>
        <button class="icon-btn" data-a="day-menu" data-d="${d.id}" aria-label="${esc(t('edit'))}">${I.more}</button>
      </div>
      ${d.items.length ? d.items.map((it, ii) => { const g = groupInfo(d.items)[it.id]; const rit = pv ? C.weekItem(it, pv) : it; const L = S.link && S.link.where === 'plan' && S.link.dayId === d.id ? S.link : null; return `<div class="row ${g ? 'grp' : ''} ${L && L.ids.includes(it.id) ? 'lsel' : ''}"><button class="list-btn grow" style="padding:8px 0" data-lp="${it.id}" data-lpd="${d.id}" ${L ? `data-a="link-toggle" data-i="${it.id}"` : `data-a="edit-item" data-d="${d.id}" data-i="${it.id}"`}><span class="grow"><span class="name">${L ? (L.ids.includes(it.id) ? '✓ ' : '○ ') : ''}${g ? `<span class="gtag">${g.label}</span> ` : ''}${esc(exName(it.exId))}</span><br><span class="meta">${pv && skipped(rit) ? esc(t('skipWeek')) : esc(schemeShort(rit, planMode(tp) === 'simple'))} · ${it.rest} s${C.methodOf(it) && planMode(tp) !== 'simple' ? ' · ' + esc(methodName(C.methodOf(it))) : ''}</span></span></button>
        <button class="icon-btn" data-a="item-up" data-d="${d.id}" data-i="${it.id}" aria-label="${esc(t('moveUp'))}" ${ii === 0 ? 'disabled' : ''}>${I.up}</button>
        <button class="icon-btn" data-a="item-link" data-d="${d.id}" data-i="${it.id}" aria-label="${esc(t('supBtn'))}">${I.link}</button>
        <button class="icon-btn" data-a="item-del" data-d="${d.id}" data-i="${it.id}" aria-label="${esc(t('remove'))}">${I.x}</button></div>`; }).join('') : `<div class="muted small">${esc(t('planEmptyDay'))}</div>`}
      <button class="btn small" data-a="day-add-ex" data-d="${d.id}">${esc(t('addExercise'))}</button>
    </section>`).join('');
  const isActive = tp.id === S.settings.activeTemplateId;
  return `<main class="screen">${linkBar()}<div class="topbar"><button class="icon-btn" data-a="nav" data-v="plans" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(t('plans'))}</div><button class="icon-btn" data-a="plan-menu" aria-label="${esc(t('edit'))}">${I.more}</button></div>
    <div><label for="pn">${esc(t('planName'))}</label><input id="pn" data-f="plan-name" value="${esc(tp.name)}"></div>
    ${isActive ? `<div><span class="tag p">${esc(t('active'))}</span> <button class="tag" data-a="plan-mode" style="background:none">${esc(planMode(tp) === 'simple' ? t('modeSimple') : t('modeAdv'))}</button></div>` : `<button class="btn block" data-a="plan-activate">${esc(t('setActive'))}</button><div><button class="tag" data-a="plan-mode" style="background:none">${esc(planMode(tp) === 'simple' ? t('modeSimple') : t('modeAdv'))}</button></div>`}
    <div class="card" style="padding:4px 16px"><button class="list-btn row" data-a="cyc-open" data-v="${tp.id}" style="border:0"><span class="grow"><span class="eyebrow small">${esc(t('cycTitle'))}</span><br><span class="name">${esc(cycleSummary(tp))}</span></span><span class="meta">›</span></button></div>
    ${pbi && pbi.finished ? endCard(tp, pbi) : ''}
    ${pv ? weekChips(tp.id, pbi.weeks, pv, pbi.cycle) : ''}
    ${planMode(tp) === 'simple' ? '' : planCoachBlock(tp)}
    ${days || `<div class="empty">${esc(t('addFirstDay'))}</div>`}
    ${tallyBlock(resolvedDays(tp.days, pv), tp.perWeek)}
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
  const sug = it.sug && it.sug.load != null ? it.sug : null;
  const rows = it.sets.map((s, idx) => {
    const p = matchPrev(prevItem, it, idx);
    let phW = p ? fmtN(num(p.weight)) : '';
    const tgt = s.target && s.target.reps ? String(parseInt(s.target.reps, 10) || '') : '';
    const amrap = s.target && /\+$/.test(String(s.target.reps || '')) && (s.kind === 'work' || s.kind === 'top');
    if (lastE && s.kind !== 'warmup' && s.kind !== 'backoff' && s.target && normRpe(s.target.rpe) && rpePct(tgt, s.target.rpe)) {
      phW = fmtN(roundLoad(it.exId, lastE * rpePct(tgt, s.target.rpe) / 100));
    }
    let phR = p ? (p.reps || '') : tgt;
    if (sug && (s.kind === 'work' || s.kind === 'top')) phW = fmtN(sug.load);
    if (it.sug && it.sug.reps && s.kind === 'work') { const k = it.sets.slice(0, idx + 1).filter(x => x.kind === 'work' && x.side === s.side).length - 1; if (it.sug.reps[k] != null) phR = String(it.sug.reps[k]); }
    else if (it.sug && it.sug.why === 'up' && it.method === 'H1' && s.kind === 'work') phR = tgt;
    if (s.kind === 'backoff' && sug && !topDone) phW = fmtN(roundLoad(it.exId, sug.load * (it.backoffPct || 90) / 100));
    if (s.kind === 'backoff' && topDone) phW = fmtN(roundLoad(it.exId, num(topDone.weight) * (it.backoffPct || 90) / 100));
    const phRpe = s.target && s.target.rpe ? (s.target.rpeMax > s.target.rpe ? `${fmtN(s.target.rpe)}-${fmtN(s.target.rpeMax)}` : fmtN(s.target.rpe)) : (p && p.rpe ? fmtN(num(p.rpe)) : '');
    const kindLbl = { warmup: t('warmup'), work: t('work') + ' ' + (it.sets.filter((x, j) => j <= idx && x.kind === 'work' && x.side === s.side).length), top: t('top'), backoff: t('backoff'), calib: t('calib') }[s.kind];
    const side = (s.side ? `<span class="side-tag">${esc(s.side === 'L' ? t('left') : t('right'))}</span>` : '') + (amrap ? '<span class="side-tag amrap">AMRAP</span>' : '');
    const f = (field, val, ph, cls = '') => `<input class="${cls}" inputmode="${field === 'reps' ? 'numeric' : 'decimal'}" autocomplete="off" enterkeyhint="next" aria-label="${esc(field)}" data-f="set" data-i="${it.id}" data-s="${s.id}" data-k="${field}" value="${esc(val)}" placeholder="${esc(ph)}">`;
    let a, b;
    if (log === 'T') { a = f('time', s.time, p ? p.time || '' : tgt); b = '<span></span>'; }
    else if (log === 'WD') { a = f('weight', s.weight, phW); b = f('dist', s.dist, p ? p.dist || '' : tgt); }
    else { a = f('weight', s.weight, phW); b = f('reps', s.reps, phR); }
    return `<div class="set ${s.kind === 'top' ? 'is-top' : ''} ${s.done ? 'done' : ''} ${S._justDone === s.id ? 'just' : ''} ${S._justDone === s.id && s.pr && s.pr.length ? 'just-pr' : ''}">
      <span class="kind ${s.kind === 'top' ? 'top' : ''}">${esc(kindLbl)}${side}${s.pr && s.pr.length ? `<span class="pr-badge" title="${esc(prLabel(s.pr))}">PR</span>` : ''}</span>
      <span class="prev">${esc(p ? fmtSet(p, ex) : '–')}</span>${a}${b}<button class="rpe-btn ${s.rpe ? '' : 'ph'} ${!s.rpe && phRpe.includes('-') ? 'rng' : ''}" data-a="rpe-open" data-i="${it.id}" data-s="${s.id}" aria-label="RPE ${esc(s.rpe ? fmtN(num(s.rpe)) : '')}">${esc(s.rpe ? fmtN(num(s.rpe)) : phRpe)}</button>
      <button class="check" data-a="set-done" data-i="${it.id}" data-s="${s.id}" aria-label="${esc(t('done'))}" aria-pressed="${s.done}">${s.done ? I.check : ''}</button></div>`;
  }).join('');
  return `<div class="sets"><div class="set-head"><span>${esc(t('sets'))}</span><span>${esc(t('prev'))}</span><span>${esc(c2)}</span><span>${esc(c3)}</span><span>RPE</span><span></span></div>${rows}</div>`;
}
function sugLine(it) {
  const g = it.sug; if (!g) return '';
  const ex = S.ex.get(it.exId) || {};
  const load = g.load != null ? (ex.logging === 'BWX' ? (g.load ? `+${fmtN(g.load)} kg` : 'BW') : `${fmtN(g.load)} kg`) : '';
  const reps = g.reps ? ` × ${g.reps.join('/')}` : g.load != null && (g.why === 'pct' || g.why === 'amrapOk' || g.why === 'amrapLow' || g.why === 'fixed') ? ` × ${it.reps}${targetUnit(it.exId)}` : '';
  const why = t('why_' + g.why, g.d || {});
  return `<div class="sug">${load ? `<b>${esc(t('sugToday'))}: ${esc(load + reps)}</b> · ` : ''}${esc(why)}</div>`;
}
function canCalib(it) {
  if (C.kindOf(it) !== 'main' || logOf(it.exId) !== 'W') return false;
  if (it.sets.some(s => s.kind === 'calib')) return false;
  return !S.calib.some(c => c.exId === it.exId && c.at > now() - 42 * 864e5);
}

/* ---------- supersets (v0.6.1) ---------- */
function groupInfo(items) {
  const out = {}; const order = [];
  items.forEach(it => { if (it.group && !order.includes(it.group)) order.push(it.group); });
  order.forEach((g, gi) => {
    const mem = items.filter(x => x.group === g);
    mem.forEach((x, k) => { out[x.id] = { g, pos: k, size: mem.length, label: String.fromCharCode(65 + gi) + (k + 1), first: k === 0, last: k === mem.length - 1 }; });
  });
  return out;
}
function normGroups(items) {
  // runs of the same group must be contiguous; a run of one is no group
  let i = 0;
  const seen = new Set();
  while (i < items.length) {
    const g = items[i].group;
    if (!g) { i++; continue; }
    let j = i; while (j < items.length && items[j].group === g) j++;
    if (seen.has(g)) { const ng = uid(); for (let k = i; k < j; k++) items[k].group = ng; }
    seen.add(items[i].group);
    if (j - i < 2) delete items[i].group;
    i = j;
  }
}
function linkItems(items, ids) {
  const sel = new Set(ids);
  items.forEach(x => { if (x.group && ids.includes(x.id)) items.forEach(y => { if (y.group === x.group) sel.add(y.id); }); });
  const picked = items.filter(x => sel.has(x.id));
  if (picked.length < 2) return;
  const g = picked.find(x => x.group)?.group || uid();
  const at = items.findIndex(x => sel.has(x.id));
  const rest = items.filter(x => !sel.has(x.id));
  picked.forEach(x => { x.group = g; });
  rest.splice(at, 0, ...picked);
  items.splice(0, items.length, ...rest);
  normGroups(items);
}
function unlinkItem(items, id) {
  const it = items.find(x => x.id === id); if (!it) return;
  delete it.group; normGroups(items);
}
function groupMenu(items, it, afterSave) {
  const i = items.indexOf(it); const nx = items[i + 1];
  const opts = [];
  if (nx && !(it.group && nx.group === it.group)) opts.push({ id: 'lnk', label: t('supLink') });
  opts.push({ id: 'pick', label: t('supPick') });
  if (it.group) opts.push({ id: 'unl', label: t('supUnlink') });
  const where = S.view === 'workout' ? 'session' : 'plan';
  const dayId = where === 'plan' ? (S.viewArg && S.templates.find(tp => tp.id === S.viewArg)?.days.find(d => d.items === items)?.id) : null;
  openSheet({ type: 'menu', title: exName(it.exId), items: opts, handlers: {
    lnk: () => { linkItems(items, [it.id, nx.id]); afterSave(); render(); },
    pick: () => { S.link = { where, dayId, ids: [it.id] }; render(); },
    unl: () => { unlinkItem(items, it.id); afterSave(); render(); } } });
}
function linkItemsOf() {
  const L = S.link; if (!L) return null;
  if (L.where === 'session') return S.active ? S.active.items : null;
  const tp = S.templates.find(x => x.id === S.viewArg); const d = tp && tp.days.find(x => x.id === L.dayId);
  return d ? d.items : null;
}
function linkBar() {
  const L = S.link; if (!L) return '';
  return `<div class="link-bar"><div class="grow">${esc(t('supHint', L.ids.length))}</div><button class="btn small primary" data-a="link-go" ${L.ids.length < 2 ? 'disabled' : ''}>${esc(t('supDo'))}</button><button class="btn small ghost" data-a="link-cancel">${esc(t('cancel'))}</button></div>`;
}
function vWorkout() {
  const a = S.active;
  if (!a) return vToday();
  const gi = groupInfo(a.items); const L = S.link && S.link.where === 'session' ? S.link : null;
  const cards = a.items.map((it, n) => {
    const ex = S.ex.get(it.exId);
    const note = S.notes[it.exId];
    const g = gi[it.id];
    return `<section class="ex-card ${g ? 'grp' + (g.first ? ' g-first' : '') + (g.last ? ' g-last' : '') : ''} ${L && L.ids.includes(it.id) ? 'lsel' : ''}" data-item="${it.id}" aria-label="${esc(exName(it.exId))}">
      <div class="eyebrow small">${n + 1} / ${a.items.length}${g ? ` · <span class="gtag">${g.label}</span> ${esc(t('supTag'))}` : ''}</div>
      <div class="ex-name-row" data-lp="${it.id}">${L ? `<button class="ex-name lk" data-a="link-toggle" data-i="${it.id}">${L.ids.includes(it.id) ? '✓ ' : '○ '}${esc(exName(it.exId))}</button>` : ''}<div class="ex-name" ${L ? 'hidden' : ''}>${esc(exName(it.exId))}</div><button class="icon-btn" data-a="item-menu" data-i="${it.id}" aria-label="${esc(t('edit'))}">${I.more}</button></div>
      ${hasHistory(it.exId, a.startedAt) ? '' : `<div class="muted small">${esc(t('firstTime'))}</div>`}
      ${sugLine(it)}
      ${it.cues && it.cues.length ? `<div class="cues">${it.cues.map(c => `<div>${esc(c)}</div>`).join('')}</div>` : ''}
      <div class="chips">
        <button class="chip" data-a="scheme-info" data-i="${it.id}">${esc(it.method ? methodName(it.method) : it.scheme === 'topback' ? t('topback') : t('straight'))} ${I.info}</button>
        ${canCalib(it) ? `<button class="chip" data-a="calib-open" data-i="${it.id}">${esc(t('calibChip'))}</button>` : ''}
        ${isBarEx(it.exId) ? `<button class="chip" data-a="plates-open" data-v="${it.id}">${esc(t('plateChip'))}</button>` : ''}
        ${it.pct ? `<button class="chip" data-a="orm-open" data-v="${esc(it.exId)}">${(o => esc(o ? `1RM ${fmtN(o.kg)} kg` : t('ormSet')))(oneRm(it.exId))}</button>` : ''}
        <button class="chip" data-a="subs" data-i="${it.id}">${I.swap} ${esc(t('subs'))}</button>
        <button class="chip" data-a="rest-edit" data-i="${it.id}">${I.clock.replace('<svg ', '<svg width="18" height="18" ')} ${it.rest} s</button>
      </div>
      <button class="note-box ${note && note.text ? '' : 'empty'}" data-a="note" data-v="${esc(it.exId)}">${note && note.text ? `<span class="lbl">${esc(t('note'))}</span>${esc(note.text)}` : `<span class="lbl">+ ${esc(t('note'))}</span>`}</button>
      ${setGrid(it)}
      <div class="set-actions"><button class="btn small" data-a="add-set" data-i="${it.id}">${esc(t('addSet'))}</button>${it.sets.length ? `<button class="btn small ghost" data-a="del-set" data-i="${it.id}">${esc(t('removeSet'))}</button>` : ''}</div>
    </section>`;
  }).join('');
  return `<main class="screen workout">${linkBar()}
    <div class="wk-head"><button class="icon-btn" data-a="nav" data-v="today" aria-label="${esc(t('back'))}">${I.down}</button>
      <div class="wk-title"><button class="t" data-a="rename" style="background:none;border:0;padding:0;max-width:100%" aria-label="${esc(t('rename'))}">${esc(a.name)} <span class="muted" aria-hidden="true">✎</span></button><div class="clock" id="wclock">${fmtDur(now() - a.startedAt)}</div></div>
      <button class="btn small ghost" style="color:var(--accent)" data-a="finish">${esc(t('finish'))}</button></div>
    ${a.notes && a.notes.length ? `<div class="info wk-notes">${a.notes.map(n => `<div>${esc(n)}</div>`).join('')}</div>` : ''}
    ${cards || `<div class="empty">${esc(t('addExercise'))}</div>`}
    <div class="workout-foot"><button class="btn block" data-a="session-add-ex">${esc(t('addExercise'))}</button>
      <button class="btn primary block" data-a="finish">${esc(t('finishWorkout'))}</button>
      <button class="btn block ghost" data-a="discard">${esc(t('discard'))}</button></div>
  </main>`;
}

/* ---------- v0.6: coach cards on Today ---------- */
const FLAG_TYPES_DELOAD = new Set(['stall', 'regression', 'fatigue', 'readiness', 'junk']);
function openFlags() { return S.settings.flagsOn === false ? [] : S.flags.filter(f => f.status === 'open'); }
function flagText(f) {
  const ex = f.exId ? exName(f.exId) : '';
  if (f.type === 'readiness') return t('flag_readiness', f.d && f.d.score);
  if (f.type === 'junk') return t('flag_junk', f.d && f.d.pct);
  if (f.type === 'fatigue') return t('flag_fatigue');
  return t('flag_' + f.type, ex);
}
function flagActions(f) {
  const b = (x, label, cls = '') => `<button class="btn small ${cls}" data-a="flag-act" data-v="${f.id}" data-x="${x}">${esc(label)}</button>`;
  if (f.type === 'stall') return b('backoff', t('act_backoff')) + b('variant', t('act_variant'), 'ghost') + b('ok', t('act_ok'), 'ghost');
  if (f.type === 'regression') return b('cut10', t('act_cut10')) + b('ok', t('act_ok'), 'ghost');
  if (f.type === 'fake') return b('confirm', t('act_confirm')) + b('open', t('act_open'), 'ghost');
  return b('ok', t('act_ok'), 'ghost');
}
function deloadOffer(tpl, bi) {
  if (!tpl || !C.cycleOf(tpl) || !bi || bi.deload || bi.finished || S.settings.flagsOn === false) return null;
  const dAt = (tpl.cycle && tpl.cycle.deloadAt) || (tpl.block && tpl.block.deloadAt) || 0;
  const since = now() - 7 * 864e5;
  const types = new Set(S.flags.filter(f => f.at >= since && FLAG_TYPES_DELOAD.has(f.type) && !(dAt && f.at <= dAt)).map(f => f.type));
  if (types.size < 2) return null;
  return { down: tpl.planId && tpl.planId.endsWith('XL') ? tpl.planId.slice(0, -2) : null };
}
function coachCards(tpl, bi) {
  let out = '';
  const off = deloadOffer(tpl, bi);
  if (off) {
    const dp = off.down && window.RepsmithCoach.planById(off.down);
    out += `<div class="banner coach"><div class="grow"><div class="eyebrow small">${esc(t('flagsTitle'))}</div><div>${esc(t('deloadOffer'))}</div>
      <div class="btn-row wrap"><button class="btn small primary" data-a="deload-now">${esc(t('act_deload'))}</button>${dp ? `<button class="btn small" data-a="plan-down" data-v="${dp.id}">${esc(t('act_down', planName(dp)))}</button>` : ''}</div></div></div>`;
  }
  if (tpl && tpl.goal === 'Keep' && bi && bi.weeksTotal >= 7 && !(tpl.reviewSnooze > now())) {
    out += `<div class="banner coach"><div class="grow"><div>${esc(t('keepReview', bi.weeksTotal - 1))}</div>
      <div class="btn-row wrap"><button class="btn small primary" data-a="wiz-start">${esc(t('act_wizard'))}</button><button class="btn small ghost" data-a="keep-later">${esc(t('act_later'))}</button></div></div></div>`;
  }
  const fl = openFlags().slice(-5).reverse();
  if (fl.length) {
    out += `<div><label>${esc(t('flagsTitle'))}</label><div class="flags">${fl.map(f => `<div class="flag f-${f.type}"><div>${esc(flagText(f))}</div><div class="btn-row wrap">${flagActions(f)}</div></div>`).join('')}</div></div>`;
  }
  return out;
}

/* ---------- v0.6: plan screen blocks ---------- */
function planCoachBlock(tp) {
  const bi = C.blockInfo(tp);
  const plan = tp.planId && window.RepsmithCoach.planById(tp.planId);
  const eff = tp.effort || 'rir';
  let h = '';
  if (plan) {
    h += `<div class="info"><div class="eyebrow small">${esc(t('planFrom'))} · ${esc(goalName(plan.goal))}</div>
      <div>${esc(planName(plan))} · ${esc(t('perWeek', tp.perWeek || plan.perWeek))}</div>
      ${bi ? `<div class="muted small">${esc(weekLabel(bi))}${bi.deload ? ' · ' + esc(dlLabel(bi)) : ''}</div>` : ''}
      <div class="muted small">${esc(tx(CD.deload[plan.goal]))}</div>
      ${plan.warning ? `<div class="small" style="color:var(--accent)">${esc(tx(plan.warning))}</div>` : ''}
      ${tp.addon && tp.addon.minutes ? `<div class="muted small">${esc(tp.addon.dropped ? t('addonDropped') : t('addonAdded', tp.addon.minutes))}</div>` : ''}</div>`;
  }
  h += `<div><label>${esc(t('effortLbl'))}</label><div class="chips">${['rir', 'rir_cap', 'fixed'].map(m => `<button class="chip ${eff === m ? 'on' : ''}" data-a="plan-effort" data-v="${m}" aria-pressed="${eff === m}">${esc(t('effort_' + m))}</button>`).join('')}</div>
    <div class="muted small" style="margin-top:6px">${esc(tx(CD.effort[eff]))}</div></div>`;
  if (tp.goal === 'Size' || (tp.lag && tp.lag.length)) {
    const lag = tp.lag || [];
    h += `<div><label>${esc(t('lagTitle'))}</label><div class="chips">${CD.lagMuscles.map(m => `<button class="chip ${lag.includes(m) ? 'on' : ''}" data-a="plan-lag" data-v="${m}" aria-pressed="${lag.includes(m)}">${esc(muscleName(m))}</button>`).join('')}</div><div class="muted small" style="margin-top:6px">${esc(t('lagHint'))}</div></div>`;
  }
  return h;
}
function volRows(vol, opts = {}) {
  const rows = Object.entries(vol).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (!rows.length) return `<div class="muted small">–</div>`;
  const max = Math.max(22, ...rows.map(r => r[1]));
  const mk = v => `<i class="mk" style="left:${(v / max * 100).toFixed(1)}%"></i>`;
  return `<div class="vol">${rows.map(([m, v]) => { const z = C.zone(v, ZONES); return `<div class="vol-row" ${opts.tap ? `data-a="bm-pick" data-v="${m}"` : ''}><span class="vm">${esc(muscleName(m))}</span><span class="vb z-${z}"><i style="width:${(Math.min(v, max) / max * 100).toFixed(1)}%"></i>${mk(ZONES.floor)}${mk(ZONES.eff)}${mk(ZONES.work)}</span><span class="vv">${esc(fmtN(Math.round(v * 10) / 10))}</span></div>`; }).join('')}</div>
    <div class="zones"><span class="z-low">${esc(t('z_low'))}</span><span class="z-eff">${esc(t('z_eff'))}</span><span class="z-work">${esc(t('z_work'))}</span><span class="z-high">${esc(t('z_high'))}</span></div>`;
}
function spikesOf(perSession, names) {
  const out = [];
  perSession.forEach((ps, i) => {
    for (const [m, v] of Object.entries(ps.muscles)) if (v > 10) out.push((names ? names[i] + ': ' : '') + t('spikeMuscle', muscleName(m), v));
    for (const [x, v] of Object.entries(ps.lifts)) if (v > 5) out.push((names ? names[i] + ': ' : '') + t('spikeLift', exName(x), v));
  });
  return out;
}
function tallyBlock(days, perWeek) {
  const withItems = days.filter(d => d.items.length);
  if (!withItems.length) return '';
  const tl = C.tallyDays(days, perWeek);
  const sp = spikesOf(tl.perSession, days.map(d => d.name));
  return `<div><h2>${esc(t('tallyTitle'))}</h2><div class="muted small" style="margin:6px 0 10px">${esc(t('tallyHint'))} ${esc(t('zonesHint'))} <button class="linkish" data-a="why-open" data-v="vol">${esc(t('whyBtn'))}</button></div>${volRows(tl.muscles)}
    ${sp.length ? `<div class="info" style="margin-top:10px"><h3>${esc(t('spikeTitle'))}</h3>${sp.map(x => `<div class="small">${esc(x)}</div>`).join('')}</div>` : ''}</div>`;
}
/* hard sets per muscle and per main lift in the workout being finished */
function sessionSpikes(a) {
  const days = [{ items: a.items.map(it => ({ exId: it.exId, kind: it.kind || C.kindOf(it), scheme: 'straight', sets: it.sets.filter(x => x.done && x.kind !== 'warmup' && x.side !== 'R' && C.isHard(x)).length })) }];
  return spikesOf(C.tallyDays(days, 1).perSession);
}

/* ---------- v0.6: plan finder (questionnaire) ---------- */
function vWizard() {
  const w = S.wiz || (S.wiz = { i: 0, a: { q9: [] } });
  const Q = CD.questions; const [key, pl, en, opts] = Q[w.i];
  const multi = key === 'q9';
  const sel = multi ? w.a.q9 || [] : [w.a[key]];
  const pct = ((w.i) / Q.length * 100).toFixed(0);
  return `<main class="screen wiz"><div class="topbar"><button class="icon-btn" data-a="wiz-back" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(t('wizTitle'))}</div><span style="width:44px"></span></div>
    <div><div class="sub small" style="display:flex;justify-content:space-between;margin-bottom:8px"><span>${esc(t('wizStep', w.i + 1, Q.length))}</span></div><div class="wbar"><i style="width:${pct}%"></i></div></div>
    <h1 class="mid">${esc(L() ? en : pl)}</h1>
    <div class="opts" role="${multi ? 'group' : 'radiogroup'}">${opts.map(([id, p, e]) => `<button class="opt ${sel.includes(id) ? 'on' : ''}" data-a="wiz-pick" data-v="${id}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${sel.includes(id)}">${esc(L() ? e : p)}${sel.includes(id) ? I.check : ''}</button>`).join('')}</div>
    ${multi ? `<div class="muted small">${esc(tx(CD.q9note))}</div><button class="btn primary block" data-a="wiz-next" ${sel.length ? '' : 'disabled'}>${esc(t('wizNext'))}</button>` : ''}
  </main>`;
}
function wizState() {
  const w = S.wiz; const res = w.res;
  const plan = window.RepsmithCoach.planById(w.sel || res.primary.id);
  const isPrim = plan.id === res.primary.id;
  const spare = res.cap - C.estMax(plan);
  let addon = isPrim ? res.addon : (w.a.q12 === 'x1' && plan.goal !== 'Keep' && res.load < 3 && !plan.id.endsWith('XL') ? (spare >= 30 ? 30 : spare >= 15 ? 15 : 0) : 0);
  const effort = w.effort || res.effort;
  const opts = { effort, cap: res.cap, addon: w.addonOn === false ? 0 : addon, remove: w.remove || [], stallEntry: res.notes.includes('STALL_ENTRY') };
  const tpl = C.buildTemplate(plan, w.a, opts);
  return { res, plan, addon, effort, opts, tpl, trimmed: C.estMax(plan) > res.cap };
}
function vWizRes() {
  if (!S.wiz || !S.wiz.res) return vWizard();
  const w = S.wiz; const st = wizState(); const { res, plan, tpl } = st;
  const mins = tpl.days.map(d => Math.round(C.sessionMinutes(d.items)));
  const notes = res.notes.map(k => tx(CD.notes[k])).filter(Boolean);
  const exIds = [...new Set(plan.sessions.flatMap(s => C.adapt(s.items.map(i => ({ ...i })), { ...w.a, q9: (w.a.q9 || []).filter(x => x !== 'm4') }).map(i => i.exId)))];
  const vcard = v => `<button class="sub-opt ${w.sel === v.plan.id ? 'sel' : ''}" data-a="wiz-sel" data-v="${v.plan.id}"><span class="n">${esc(planName(v.plan))}</span><span class="muted small">${esc(tx(CD.role[v.role]))} · ${esc(t('perWeek', v.plan.perWeek))}</span></button>`;
  const primCard = { plan: res.primary, role: null };
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="wiz-back" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(t('wizTitle'))}</div><span style="width:44px"></span></div>
    <div><div class="eyebrow">${esc(plan.id === res.primary.id ? t('yourPlan') : t('alternatives'))} · ${esc(goalName(plan.goal))}</div><h1>${esc(planName(plan))}</h1>
      <div class="sub" style="margin-top:8px">${esc(t('perWeek', plan.perWeek))} · ${esc(mins.map(m => t('estMin', m)).join(', '))}</div></div>
    <div class="info"><h3>${esc(t('forLbl'))}</h3><div>${esc(tx(plan.for))}</div><h3>${esc(t('designLbl'))}</h3><div>${esc(tx(plan.design))}</div></div>
    ${notes.length ? `<div class="info"><h3>${esc(t('notesLbl'))}</h3>${notes.map(n => `<div>${esc(n)}</div>`).join('')}</div>` : ''}
    ${st.trimmed ? `<div class="muted small">${esc(t('trimmedNote', res.cap))}</div>` : ''}
    ${plan.warning ? `<div class="err">${esc(tx(plan.warning))}</div>` : ''}
    <div><label>${esc(t('effortLbl'))}</label><div class="chips">${['rir', 'rir_cap', 'fixed'].map(m => `<button class="chip ${st.effort === m ? 'on' : ''}" data-a="wiz-effort" data-v="${m}" aria-pressed="${st.effort === m}">${esc(t('effort_' + m))}</button>`).join('')}</div><div class="muted small" style="margin-top:6px">${esc(tx(CD.effort[st.effort]))}</div></div>
    ${st.addon ? `<label class="check-row"><input type="checkbox" data-a="wiz-addon" ${w.addonOn === false ? '' : 'checked'}> ${esc(t('addonOffer', st.addon))}</label>${tpl.addon && tpl.addon.dropped ? `<div class="muted small">${esc(t('addonDropped'))}</div>` : ''}` : ''}
    ${(w.a.q9 || []).includes('m4') ? `<div><label>${esc(t('m4Title'))}</label><div class="chips">${exIds.map(id => `<button class="chip ${(w.remove || []).includes(id) ? 'on' : ''}" data-a="wiz-rm" data-v="${esc(id)}">${esc(exName(id))}</button>`).join('')}</div></div>` : ''}
    <div><label>${esc(t('deloadPlanLbl'))}</label><div class="muted small">${esc(tx(CD.deload[plan.goal]))}</div></div>
    <button class="btn block ghost" data-a="wiz-details">${esc(w.details ? t('hideDetails') : t('seeDetails'))}</button>
    ${w.details ? planDaysHtml(tpl) + tallyBlock(tpl.days, tpl.perWeek) : ''}
    <button class="btn primary block" data-a="wiz-use">${esc(t('usePlan'))}</button>
    ${res.variants.length ? `<div><label>${esc(t('alternatives'))}</label>${[...(plan.id !== res.primary.id ? [primCard] : []), ...res.variants].map(v => v.role ? vcard(v) : `<button class="sub-opt" data-a="wiz-sel" data-v="${v.plan.id}"><span class="n">${esc(planName(v.plan))}</span><span class="muted small">${esc(t('yourPlan'))}</span></button>`).join('')}</div>` : ''}
    <div class="btn-row"><button class="btn ghost" data-a="wiz-start">${esc(t('wizRestart'))}</button><button class="btn ghost" data-a="nav" data-v="planlib">${esc(t('planLib'))}</button></div>
  </main>`;
}
function planDaysHtml(tpl, w) {
  return resolvedDays(tpl.days, w).map(d => `<div class="card" style="padding:12px 16px"><div class="row" style="border:0"><span class="name grow">${esc(d.name)}</span><span class="meta">${esc(t('estMin', Math.round(C.sessionMinutes(d.items))))}</span></div>
    ${d.items.map(it => `<div class="row"><span class="grow"><span class="name">${esc(exName(it.exId))}</span><br><span class="meta">${esc(schemeShort(it))} · ${esc(it.pct ? "%1RM" : methodName(it.method))}</span></span></div>`).join('')}</div>`).join('');
}

/* ---------- v0.6: plan library ---------- */
function vPlanLib() {
  const st = S.plib || (S.plib = { goal: '' });
  const goals = ['Heavy', 'Size', 'Mix', 'Start', 'Keep', 'Peak'];
  const list = CD.plans.filter(p => !st.goal || p.goal === st.goal);
  return `<main class="screen">${topbar()}<h1 class="mid">${esc(t('planLib'))}</h1>
    <button class="btn primary block" data-a="wiz-start">${esc(t('pickPlanWizard'))}</button>
    <div class="chips"><button class="chip ${!st.goal ? 'on' : ''}" data-a="plib-goal" data-v="">${esc(t('allGoals'))}</button>${goals.map(g => `<button class="chip ${st.goal === g ? 'on' : ''}" data-a="plib-goal" data-v="${g}">${esc(goalName(g))}</button>`).join('')}</div>
    <div class="card">${list.map(p => { const ms = p.sessions.map(s => Math.round(C.sessionMinutes(s.items))); return `<button class="list-btn row" data-a="plib-open" data-v="${p.id}"><span class="grow"><span class="name">${esc(planName(p))}</span><span class="meta">${esc(t('perWeek', p.perWeek))} · ${esc(t('estMin', Math.min(...ms) === Math.max(...ms) ? ms[0] : Math.min(...ms) + '-' + Math.max(...ms)))}</span><span class="meta">${esc(tx(p.for))}</span></span></button>`; }).join('')}</div></main>`;
}
function vPlanPrev() {
  const plan = window.RepsmithCoach.planById(S.viewArg);
  if (!plan) return vPlanLib();
  const tpl = C.buildTemplate(plan, {}, { effort: S.settings.effortDefault || 'rir' });
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="nav" data-v="planlib" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(t('planLib'))}</div><span style="width:44px"></span></div>
    <div><div class="eyebrow">${esc(goalName(plan.goal))}</div><h1>${esc(planName(plan))}</h1><div class="sub" style="margin-top:8px">${esc(t('perWeek', plan.perWeek))}${plan.cycle ? ' · ' + esc(t('cycWeeksN', plan.cycle.weeks)) + ' · ' + esc(dlSummary(C.cycleOf({ cycle: plan.cycle }))) : ''}</div></div>
    ${plan.needs1RM ? `<div class="info"><div>${esc(t('needs1RM'))}</div></div>` : ''}
    <div class="info"><h3>${esc(t('forLbl'))}</h3><div>${esc(tx(plan.for))}</div><h3>${esc(t('designLbl'))}</h3><div>${esc(tx(plan.design))}</div><h3>${esc(t('deloadPlanLbl'))}</h3><div>${esc(tx(CD.deload[plan.goal]))}</div></div>
    ${plan.warning ? `<div class="err">${esc(tx(plan.warning))}</div>` : ''}
    <button class="btn primary block" data-a="plib-use" data-v="${plan.id}">${esc(t('usePlan'))}</button>
    ${(() => { if (!plan.cycle) return planDaysHtml(tpl) + tallyBlock(tpl.days, tpl.perWeek); const c = C.cycleOf(tpl); const w = Math.min(c.weeks, (S.pw && S.pw[plan.id]) || 1); return weekChips(plan.id, c.weeks, w, c) + planDaysHtml(tpl, w) + tallyBlock(resolvedDays(tpl.days, w), tpl.perWeek) + `<button class="btn ghost small" data-a="why-open" data-v="plan">${esc(t('whyBtn'))}</button>`; })()}
    <button class="btn primary block" data-a="plib-use" data-v="${plan.id}">${esc(t('usePlan'))}</button></main>`;
}
function adoptTemplate(tpl, answers) {
  if (answers) tpl.answers = clone(answers);
  S.templates.push(tpl);
  S.settings.activeTemplateId = tpl.id; S.settings.onboarded = true; S._pickedDay = null;
  persist('templates', 'settings'); toast(t('planCreated')); go('today');
}

/* ---------- view: history ---------- */
const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const monday = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
function weekStreak(sessions, at) {
  const wk = new Set(sessions.map(s => monday(s.startedAt)));
  let w = monday(at); if (!wk.has(w)) w = monday(w - 1);
  let n = 0;
  while (wk.has(w)) { n++; w = monday(w - 1); }
  return n;
}
function histRow(s) {
  const st = sessionStats(s);
  const prs = s.items.reduce((n, it) => n + it.sets.filter(x => x.pr && x.pr.length).length, 0);
  return `<button class="list-btn row" data-a="open-session" data-v="${s.id}"><span class="grow"><span class="name">${esc(s.name)}</span><br><span class="meta">${esc(fmtDate(s.startedAt, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))} · ${esc(fmtDur(s.endedAt - s.startedAt))} · ${st.sets} ${esc(t('setsDone').toLowerCase())}${prs ? ` · <span class="pr-badge">PR ${prs}</span>` : ''}</span></span>${s.difficulty ? `<span class="diff-badge" aria-label="${esc(t('difficultyShort'))} ${s.difficulty}/10">${s.difficulty}<small>/10</small></span>` : ''}</button>`;
}
function calView() {
  const nowD = new Date(now());
  if (S.calY == null) { S.calY = nowD.getFullYear(); S.calM = nowD.getMonth(); }
  const y = S.calY, m = S.calM;
  const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const by = new Map();
  for (const s of S.sessions) { const k = dayKey(s.startedAt); if (!by.has(k)) by.set(k, []); by.get(k).push(s); }
  const inMonth = S.sessions.filter(s => { const d = new Date(s.startedAt); return d.getFullYear() === y && d.getMonth() === m; });
  const sets = inMonth.reduce((n, s) => n + sessionStats(s).sets, 0);
  const lang = S.settings.lang === 'en' ? 'en-GB' : 'pl-PL';
  const wd = [...Array(7)].map((_, i) => new Intl.DateTimeFormat(lang, { weekday: 'narrow' }).format(new Date(2024, 0, 1 + i)));
  const todayK = dayKey(now());
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span class="cal-c empty"></span>';
  for (let d = 1; d <= days; d++) {
    const k = y + '-' + (m + 1) + '-' + d, n = (by.get(k) || []).length;
    cells += `<button class="cal-c ${n ? 'has' : ''} ${k === todayK ? 'today' : ''} ${S.calDay === k ? 'sel' : ''}" data-a="cal-day" data-v="${k}" aria-label="${d}${n ? ', ' + n : ''}">${d}${n > 1 ? `<i>${n}</i>` : ''}</button>`;
  }
  const sel = S.calDay ? (by.get(S.calDay) || []).sort((a, b) => a.startedAt - b.startedAt) : null;
  return `<div class="cal-head"><button class="icon-btn" data-a="cal-nav" data-v="-1" aria-label="${esc(t('calPrev'))}">${I.left}</button><div class="cal-title">${esc(new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(first))}</div><button class="icon-btn" data-a="cal-nav" data-v="1" aria-label="${esc(t('calNext'))}" style="transform:scaleX(-1)">${I.left}</button></div>
    <div class="stat-row"><div class="stat"><div class="v">${inMonth.length}</div><div class="k">${esc(t('calMonthStat'))}</div></div><div class="stat"><div class="v">${sets}</div><div class="k">${esc(t('setsDone'))}</div></div><div class="stat"><div class="v">${weekStreak(S.sessions, now())}</div><div class="k">${esc(t('calStreak'))}</div></div></div>
    <div class="cal"><div class="cal-w">${wd.map(x => `<span>${esc(x)}</span>`).join('')}</div><div class="cal-g">${cells}</div></div>
    ${sel ? (sel.length ? `<div class="card">${sel.map(histRow).join('')}</div>` : `<div class="empty">${esc(t('calNone'))}</div>`) : ''}`;
}
function vHistory() {
  const mode = S.histMode === 'cal' ? 'cal' : 'list';
  const list = [...S.sessions].sort((a, b) => b.startedAt - a.startedAt).map(histRow).join('');
  const seg = S.sessions.length ? `<div class="seg"><button class="${mode === 'list' ? 'on' : ''}" data-a="hist-mode" data-v="list">${esc(t('calList'))}</button><button class="${mode === 'cal' ? 'on' : ''}" data-a="hist-mode" data-v="cal">${esc(t('calCal'))}</button></div>` : '';
  const body = mode === 'cal' ? calView() : (list ? `<div class="card">${list}</div>` : `<div class="empty">${esc(t('noSessions'))}</div>`);
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('history'))}</h1>${seg}${body}</main>`;
}
function drawCard() {
  const cv = $('#card-cv'); const sh = S.sheet; if (!cv || !sh) return;
  const s = S.sessions.find(x => x.id === sh.sesId); if (!s) return;
  const cs = getComputedStyle(document.documentElement), v = n => (cs.getPropertyValue(n) || '').trim();
  const bg = v('--bg') || '#1d1220', ac = v('--accent') || '#FF9F70', tx = v('--text') || '#F3ECF1', mu = v('--muted') || '#b9a9b6', su = v('--surface') || '#2a1c2e';
  const body = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const disp = v('--display') || body;
  const c = cv.getContext('2d'), W = 1080, H = 1350, lang = S.settings.lang === 'en' ? 'en-GB' : 'pl-PL';
  c.clearRect(0, 0, W, H); c.fillStyle = bg; c.fillRect(0, 0, W, H);
  const g = c.createRadialGradient(W, 0, 0, W, 0, 900); g.addColorStop(0, 'rgba(255,159,112,.20)'); g.addColorStop(1, 'rgba(255,159,112,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  // logo
  c.fillStyle = tx; for (let i = 0; i < 4; i++) { c.beginPath(); c.roundRect(60 + i * 20, 60, 10, 62, 5); c.fill(); }
  c.strokeStyle = ac; c.lineWidth = 11; c.lineCap = 'round'; c.beginPath(); c.moveTo(52, 108); c.lineTo(148, 62); c.stroke();
  c.fillStyle = tx; c.font = `700 40px ${disp}`; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText('Repsmith', 178, 92);
  const fit = (txt, max, size, wt, fam) => { let z = size; do { c.font = `${wt} ${z}px ${fam}`; z -= 2; } while (c.measureText(txt).width > max && z > 24); };
  c.fillStyle = tx; fit(s.name, W - 120, 84, 800, disp); c.textBaseline = 'alphabetic'; c.fillText(s.name, 60, 250);
  c.fillStyle = mu; c.font = `500 34px ${body}`; c.fillText(fmtDate(s.startedAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), 60, 304);
  // stats
  const st = sessionStats(s), prs = s.items.reduce((n, it) => n + it.sets.filter(x => x.pr && x.pr.length).length, 0);
  const cells = [[fmtDur(s.endedAt - s.startedAt), t('duration')], [String(st.sets), t('setsDone')]];
  if (!sh.hide) cells.push([st.vol.toLocaleString(lang) + ' kg', t('volume')]); else if (prs) cells.push([String(prs), 'PR']);
  const cw = (W - 120 - 24 * (cells.length - 1)) / cells.length;
  cells.forEach((cl, i) => {
    const x = 60 + i * (cw + 24); c.fillStyle = su; c.beginPath(); c.roundRect(x, 360, cw, 170, 28); c.fill();
    c.fillStyle = ac; fit(cl[0], cw - 30, 56, 800, disp); c.fillText(cl[0], x + 28, 450);
    c.fillStyle = mu; c.font = `500 28px ${body}`; c.fillText(cl[1], x + 28, 498);
  });
  // top exercises by volume
  const rows = s.items.map(it => {
    const ex = S.ex.get(it.exId); const done = it.sets.filter(x => x.done && x.kind !== 'warmup');
    let best = null, bv = -1;
    for (const x of done) { const sc = (num(x.weight) || 0) * (num(x.reps) || 0) || (num(x.reps) || num(x.time) || 0); if (sc > bv) { bv = sc; best = x; } }
    return { name: exName(it.exId), n: done.length, best, ex, pr: done.some(x => x.pr && x.pr.length), vol: done.reduce((a, x) => a + (num(x.weight) || 0) * (num(x.reps) || 0), 0) };
  }).filter(r => r.n).sort((a, b) => b.vol - a.vol);
  c.fillStyle = mu; c.font = `700 28px ${body}`; c.fillText(t('cardTop').toUpperCase(), 60, 610);
  const max = 6, show = rows.slice(0, max); let y = 650;
  show.forEach(r => {
    c.fillStyle = tx; fit(r.name, 560, 38, 700, body); c.fillText(r.name, 60, y + 50);
    const right = sh.hide ? `${r.n} × ` + t('setsDone').toLowerCase() : (r.best ? fmtSet(r.best, r.ex) : '');
    c.textAlign = 'right'; c.fillStyle = r.pr ? ac : mu; c.font = `600 34px ${body}`; c.fillText((r.pr ? 'PR  ' : '') + (sh.hide ? '' : '') + right, W - 60, y + 50); c.textAlign = 'left';
    c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(60, y + 78, W - 120, 2); y += 100;
  });
  if (rows.length > max) { c.fillStyle = mu; c.font = `500 30px ${body}`; c.fillText(`+${rows.length - max} ${t('cardMore')}`, 60, y + 40); }
  c.fillStyle = mu; c.font = `500 28px ${body}`; c.textAlign = 'center'; c.fillText('repsmith', W / 2, H - 50); c.textAlign = 'left';
}
function vSession() {
  const s = S.sessions.find(x => x.id === S.viewArg);
  if (!s) return vHistory();
  const st = sessionStats(s);
  const items = s.items.map(it => {
    const ex = S.ex.get(it.exId);
    const sets = it.sets.filter(x => x.done).map(x => `<button class="tag ${x.kind === 'top' ? 'p' : ''}" data-a="es-open" data-ses="${s.id}" data-i="${it.id}" data-s="${x.id}">${esc(fmtSet(x, ex))}${x.side ? ' ' + esc(x.side === 'L' ? t('left') : t('right')) : ''}${num(x.rpe) ? ' @' + fmtN(num(x.rpe)) : ''}${x.pr && x.pr.length ? ` <span class="pr-badge" title="${esc(prLabel(x.pr))}">PR</span>` : ''}</button>`).join('') + `<button class="tag add" data-a="es-open" data-ses="${s.id}" data-i="${it.id}" data-s="" aria-label="${esc(t('esAdd'))}">+</button>`;
    const prNote = it.sets.filter(x => x.pr && x.pr.length).map(x => `${fmtSet(x, ex)}: ${prLabel(x.pr)}`).join(' · ');
    return `<div class="row" style="flex-direction:column;align-items:flex-start;padding:10px 0;gap:4px"><span class="name">${esc(exName(it.exId))}</span><div>${sets || '<span class="muted small">–</span>'}</div>${prNote ? `<div class="small" style="color:var(--accent)">PR · ${esc(prNote)}</div>` : ''}</div>`;
  }).join('');
  return `<main class="screen"><div class="topbar"><button class="icon-btn" data-a="nav" data-v="history" aria-label="${esc(t('back'))}">${I.left}</button><div class="eyebrow">${esc(fmtDate(s.startedAt, { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))}</div><span style="width:44px"></span></div>
    <h1 class="mid">${esc(s.name)}</h1>
    ${s.repeatOf ? (() => { const o = S.sessions.find(x => x.id === s.repeatOf); return o ? `<button class="btn small ghost" style="justify-content:flex-start;padding:0" data-a="open-session" data-v="${o.id}">${esc(t('repeatOfLbl'))} ${esc(fmtDate(o.startedAt, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))} →</button>` : ''; })() : ''}
    <div class="stat-row"><div class="stat"><div class="v">${esc(fmtDur(s.endedAt - s.startedAt))}</div><div class="k">${esc(t('duration'))}</div></div><div class="stat"><div class="v">${st.sets}</div><div class="k">${esc(t('setsDone'))}</div></div><div class="stat"><div class="v">${st.vol.toLocaleString(S.settings.lang === 'en' ? 'en-GB' : 'pl-PL')}</div><div class="k">${esc(t('volume'))} kg</div></div></div>
    ${s.difficulty || s.note ? `<div class="info">${s.difficulty ? `<div style="display:flex;align-items:baseline;gap:10px"><span class="diff-badge">${s.difficulty}<small>/10</small></span><span class="muted small">${esc(t('difficultyShort'))}</span></div>` : ''}${s.note ? `<div style="white-space:pre-wrap">${esc(s.note)}</div>` : ''}</div>` : ''}
    <div class="card">${items}</div>
    <div class="muted small">${esc(t('tapToEdit'))}</div>
    <button class="btn primary block" data-a="repeat" data-v="${s.id}">${esc(t('repeatWorkout'))}</button>
    <div class="muted small" style="margin-top:-8px">${esc(t('repeatHint'))}</div>
    <button class="btn block" data-a="card-open" data-v="${s.id}">${esc(t('cardBtn'))}</button>
    <button class="btn block" data-a="summary-edit" data-v="${s.id}">${esc(t('editSummary'))}</button>
    <button class="btn danger block" data-a="session-del" data-v="${s.id}">${esc(t('deleteSession'))}</button></main>`;
}

/* ---------- view: library ---------- */
function filteredExercises(q, pat, mus) {
  const qq = (q || '').trim().toLowerCase();
  return [...S.ex.values()].filter(isVisible)
    .filter(e => !pat || (pat === '__custom' ? e.custom : e.pattern === pat))
    .filter(e => !mus || e.primary.includes(mus))
    .filter(e => !qq || [e.name_pl, e.name_en].some(n => (n || '').toLowerCase().includes(qq)) || e.primary.some(m => muscleName(m).toLowerCase().includes(qq)))
    .sort((a, b) => exName(a.id).localeCompare(exName(b.id), S.settings.lang));
}
function exRows(list, action, extra = '') {
  return list.map(e => `<button class="list-btn row" data-a="${action}" data-v="${esc(e.id)}" ${extra}><span class="grow"><span class="name">${esc(exName(e.id))}</span><br><span class="meta">${esc(e.primary.map(muscleName).join(', '))} · ${esc(equipName(e.equipment))}</span></span>${S.notes[e.id] && S.notes[e.id].text ? `<span class="tag">${esc(t('note'))}</span>` : ''}</button>`).join('');
}
/* body map wrapper: front/back silhouette with Repsmith labels */
function bm(opts, extraCls = '') {
  if (!window.RepsmithBodyMap) return '';
  return `<div class="bm-wrap ${extraCls}">${window.RepsmithBodyMap({ ...opts, labels: [t('front'), t('back')], names: muscleName })}</div>`;
}
function bodyToggle(where) {
  const on = S.settings.showBody !== false;
  return `<button class="chip" data-a="bm-toggle" aria-pressed="${on}">${esc(on ? t('hideBody') : t('showBody'))}</button>`;
}
/* movement pattern + main muscle filters, combinable with search */
function filterBar(st, pre) {
  const pats = Object.keys(S.data.patterns).sort((a, b) => patternName(a).localeCompare(patternName(b), S.settings.lang));
  const mus = Object.keys(S.data.muscles).sort((a, b) => muscleName(a).localeCompare(muscleName(b), S.settings.lang));
  const n = filteredExercises(st.q, st.pat, st.mus).length;
  return `<div class="filters"><div class="grid2">
    <div><label for="${pre}-pat">${esc(t('movement'))}</label><select id="${pre}-pat" data-f="${pre}-pat"><option value="">${esc(t('all'))}</option>${S.customExercises.some(isVisible) ? `<option value="__custom" ${st.pat === '__custom' ? 'selected' : ''}>${esc(t('custom'))}</option>` : ''}${pats.map(p => `<option value="${p}" ${st.pat === p ? 'selected' : ''}>${esc(patternName(p))}</option>`).join('')}</select></div>
    <div><label for="${pre}-mus">${esc(t('muscleGroup'))}</label><select id="${pre}-mus" data-f="${pre}-mus"><option value="">${esc(t('all'))}</option>${mus.map(m => `<option value="${m}" ${st.mus === m ? 'selected' : ''}>${esc(muscleName(m))}</option>`).join('')}</select></div></div>
    <div class="filter-meta"><span id="${pre}-count">${esc(t('exercisesN', n))}</span>${st.pat || st.mus || st.q ? `<button class="btn small ghost" data-a="${pre}-clear">${esc(t('clearFilters'))}</button>` : ''}</div></div>`;
}
function vLibrary() {
  const st = S.lib || (S.lib = { q: '', pat: '', mus: '' });
  const list = filteredExercises(st.q, st.pat, st.mus);
  return `<main class="screen">${topbar()}${resumeBanner()}<h1 class="mid">${esc(t('library'))}</h1>
    <div><label for="libq" class="sr">${esc(t('search'))}</label><input id="libq" type="search" data-f="lib-q" placeholder="${esc(t('search'))}" value="${esc(st.q)}" autocomplete="off"></div>
    <div class="chips">${bodyToggle()}</div>
    ${S.settings.showBody !== false ? bm({ sel: st.mus, interactive: true, aria: t('muscleGroup') }) : ''}
    ${filterBar(st, 'lib')}
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
/* rolling 7-day hard sets per muscle: back = 0 last 7 days, 1 the 7 days before */
function rollingVolume(back = 0) {
  const to = now() - back * 7 * 864e5 + 1, from = to - 7 * 864e5;
  return Object.entries(C.windowVolume(from, to).vol).sort((a, b) => b[1] - a[1]);
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
  const vol = rollingVolume(pg.week);
  const maxV = vol.length ? Math.max(...vol.map(v => v[1])) : 1;
  const volBlock = `<div><h2>${esc(t('weeklyVolume'))}</h2>
      <div class="chips" style="margin-top:10px"><button class="chip ${pg.week === 0 ? 'on' : ''}" data-a="prog-week" data-v="0">${esc(t('last7'))}</button><button class="chip ${pg.week === 1 ? 'on' : ''}" data-a="prog-week" data-v="1">${esc(t('prev7'))}</button></div>
    ${vol.length ? bm({ heat: Object.fromEntries(vol.map(([m, v]) => [m, v / maxV])), interactive: true, aria: t('weeklyVolume') }) + `<div class="bm-legend"><span><i style="background:var(--bm-h1)"></i>${esc(t('fewerSets'))}</span><span><i style="background:var(--bm-h4)"></i>${esc(t('moreSets'))}</span></div><div class="tip muted small" id="bm-tip" style="text-align:center;min-height:20px">${esc(t('tapMuscle'))}</div>` : ''}
    ${volRows(Object.fromEntries(vol))}
    <div class="muted small" style="margin-top:6px">${esc(t('volumeHint2'))} ${esc(t('zonesHint'))} <button class="linkish" data-a="why-open" data-v="vol">${esc(t('whyBtn'))}</button></div></div>`;
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
  document.querySelectorAll('[data-f="m"]').forEach(e => { d[e.dataset.k] = cleanDec(e.value).replace(',', '.'); });
  const dv = ($('#m-date') || {}).value;
  if (dv) { const [y, mo, da] = dv.split('-').map(Number); const old = new Date(d.date); d.date = new Date(y, mo - 1, da, old.getHours(), old.getMinutes()).getTime(); }
}

/* ---------- sheets ---------- */
function renderSheet() {
  let el = $('#sheet');
  if (!S.sheet) { if (el) el.remove(); document.body.style.overflow = ''; return; }
  const fresh = !el;
  if (!el) { el = document.createElement('div'); el.id = 'sheet'; document.body.appendChild(el); }
  const sh = S.sheet;
  let body = '';
  const head = (title) => `<div class="sheet-head"><h2>${esc(title)}</h2><button class="icon-btn" data-a="sheet-close" aria-label="${esc(t('close'))}">${I.x}</button></div>`;
  if (sh.type === 'confirm') {
    body = `${head(sh.title || t('confirm'))}<p style="margin:0">${esc(sh.text)}</p><div class="btn-row"><button class="btn" data-a="sheet-close">${esc(t('cancel'))}</button><button class="btn ${sh.danger ? 'danger' : 'primary'}" data-a="confirm-yes">${esc(sh.yes || t('confirm'))}</button></div>`;
  } else if (sh.type === 'picker') {
    const q = sh.q || '';
    body = `${head(t('addExercise'))}<input id="pickq" type="search" data-f="pick-q" placeholder="${esc(t('search'))}" value="${esc(q)}" autocomplete="off" aria-label="${esc(t('search'))}">
      <div class="chips">${bodyToggle()}</div>
      ${S.settings.showBody !== false ? bm({ sel: sh.mus || '', interactive: true, aria: t('muscleGroup') }, 'compact') : ''}
      ${filterBar({ q, pat: sh.pat || '', mus: sh.mus || '' }, 'pick')}
      <div class="card" id="picklist">${exRows(filteredExercises(q, sh.pat, sh.mus), 'pick')}</div>`;
  } else if (sh.type === 'item') {
    const it = sh.item;
    if (!sh.tg) initItemSheet(sh);
    const isTop = it.scheme === 'topback';
    const mth = it.method || C.methodOf(it) || '';
    const kind = tgtKind(it.exId);
    const tl = m => t((kind === 'T' ? 'tmT_' : kind === 'WD' ? 'tmD_' : 'tm_') + m);
    const tg = sh.tg, ef = sh.ef;
    const inp = (k, label, val, san = 'int') => `<div><label for="tg-${k}">${esc(label)}</label><input id="tg-${k}" data-f="tg" data-k="${k}" data-san="${san}" inputmode="${san === 'int' ? 'numeric' : 'decimal'}" autocomplete="off" maxlength="5" value="${esc(val ?? '')}"></div>`;
    const tgFields = tg.mode === 'range' ? `<div class="grid2">${inp('lo', t('tgFrom'), tg.lo)}${inp('hi', t('tgTo'), tg.hi)}</div>`
      : `<div class="grid2">${inp('lo', tg.mode === 'amrap' ? t('tgMin') : t('tgVal'), tg.lo)}<div></div></div>`;
    const rb = (which, label, v) => `<div><label>${esc(label)}</label><button class="rpe-btn block-btn ${v ? '' : 'ph'}" data-a="item-rpe" data-v="${which}" aria-label="${esc(label)}">${v ? esc(fmtN(v)) : '–'}</button></div>`;
    let efFields = '';
    if (ef.mode === 'rpe') efFields = `<div class="grid2">${rb('lo', 'RPE', it.rpe)}<div></div></div>`;
    else if (ef.mode === 'rrange') efFields = `<div class="grid2">${rb('lo', t('rpeFrom'), it.rpe)}${rb('hi', t('rpeTo'), it.rpeMax)}</div>`;
    else {
      const o = oneRm(it.exId);
      const pv = num(ef.pct); const load = o && pv ? roundLoad(it.exId, o.kg * pv / 100) : null;
      efFields = `<div class="grid2"><div><label for="ef-pct">${esc(t('pctLbl'))}</label><input id="ef-pct" data-f="ef-pct" data-san="dec" inputmode="decimal" autocomplete="off" maxlength="5" value="${esc(ef.pct ?? '')}"></div>
        <div><label>&nbsp;</label><button class="btn block" data-a="orm-open" data-v="${esc(it.exId)}">${esc(t('ormSet'))}</button></div></div>
        <div class="muted small" id="orm-line">${o ? esc(t('ormLine', fmtN(o.kg), o.src === 'manual' ? t('ormManual') : t('ormApp'))) + (load ? ` · ${esc(fmtN(pv))}% = ${esc(fmtN(load))} kg` : '') : esc(t('ormNone'))}</div>
        <div class="muted small">${esc(t('pctInfo'))}</div>`;
    }
    const hasAdv = !!(it.pct || it.rpe != null || it.scheme === 'topback' || it.warmups || (it.method && !['P2', 'H1'].includes(it.method)));
    if (sh.simple) {
      const modes = ['fixed', 'range'].concat(tg.mode === 'amrap' ? ['amrap'] : []);
      body = `${head(exName(it.exId))}
        <div class="muted small">${esc(t('simpleHint'))}</div>
        ${hasAdv ? `<div class="info">${esc(t('hiddenAdv'))}</div>` : ''}
        <div class="grid2">${it.scheme === 'topback' ? '' : fld('it-sets', t('sets'), it.sets, 'int')}${fld('it-rest', t('rest'), it.rest, 'int')}</div>
        <div class="tg-block"><label>${esc(kind === 'T' ? t('tgTime') : kind === 'WD' ? t('tgDist') : t('tgReps'))}</label>
          <div class="seg" role="group">${modes.map(m => `<button class="${tg.mode === m ? 'on' : ''}" data-a="tg-mode" data-v="${m}" aria-pressed="${tg.mode === m}">${esc(tl(m))}</button>`).join('')}</div>
          ${tgFields}</div>
        ${kind === 'reps' ? `<label class="check-row"><input type="checkbox" data-a="item-prog" ${it.noprog ? '' : 'checked'}> ${esc(t('autoProg'))}</label><div class="muted small">${esc(t('autoProgD'))}</div>` : ''}
        ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
        <button class="btn primary block" data-a="item-save">${esc(t('save'))}</button>`;
    } else
    body = `${head(exName(it.exId))}
      <div><label>${esc(t('progression'))}</label><div class="chips wrap">${METHODS.map(m => `<button class="chip ${mth === m ? 'on' : ''}" data-a="item-method" data-v="${m}" aria-pressed="${mth === m}">${esc(t('m_' + m))}</button>`).join('')}</div></div>
      ${mth ? `<details class="info"><summary><h3 style="display:inline">${esc(t('m_' + mth))}</h3></summary><div style="white-space:pre-line">${esc(t('mi_' + mth))}</div></details>` : ''}
      <div class="grid3">
        ${isTop ? '' : fld('it-sets', t('sets'), it.sets, 'int')}
        ${fld('it-warmups', t('warmups'), it.warmups, 'int')}
        ${fld('it-rest', t('rest'), it.rest, 'int')}
      </div>
      <div class="tg-block"><label>${esc(kind === 'T' ? t('tgTime') : kind === 'WD' ? t('tgDist') : t('tgReps'))}${isTop ? ' · ' + esc(t('top')) : ''}</label>
        <div class="seg" role="group">${repModesFor(it.exId, mth).map(m => `<button class="${tg.mode === m ? 'on' : ''}" data-a="tg-mode" data-v="${m}" aria-pressed="${tg.mode === m}">${esc(tl(m))}</button>`).join('')}</div>
        ${tgFields}
        ${tg.mode === 'amrap' ? `<div class="muted small">${esc(t('amrapInfo'))}</div>` : ''}</div>
      <div class="tg-block"><label>${esc(t('efLbl'))}</label>
        <div class="seg" role="group">${efModesFor(it.exId).map(m => `<button class="${ef.mode === m ? 'on' : ''}" data-a="ef-mode" data-v="${m}" aria-pressed="${ef.mode === m}">${esc(t('em_' + m))}</button>`).join('')}</div>
        ${efFields}</div>
      ${isTop ? `<div class="tg-block"><label>${esc(t('bkLbl'))}</label>
        <div class="seg" role="group">${['same', 'fixed', 'range'].map(m => `<button class="${sh.bk.mode === m ? 'on' : ''}" data-a="bk-mode" data-v="${m}" aria-pressed="${sh.bk.mode === m}">${esc(m === 'same' ? t('bkSame') : tl(m))}</button>`).join('')}</div>
        ${sh.bk.mode === 'same' ? '' : sh.bk.mode === 'range' ? `<div class="grid2">${inp('bklo', t('tgFrom'), sh.bk.lo)}${inp('bkhi', t('tgTo'), sh.bk.hi)}</div>` : `<div class="grid2">${inp('bklo', t('tgVal'), sh.bk.lo)}<div></div></div>`}
        <div class="grid2">${fld('it-backoffSets', t('bkSets'), it.backoffSets, 'int')}${fld('it-backoffPct', t('backoffPct'), it.backoffPct, 'int')}</div></div>` : ''}
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="item-save">${esc(t('save'))}</button>`;
    const tpw = sh.dayId && S.view === 'plan' ? tplDay(sh.dayId)[0] : null; const bw = tpw && C.blockInfo(tpw);
    if (bw && bw.fixed) {
      const nW = it.wk ? Object.keys(it.wk).length : 0;
      body = body.replace('<button class="btn primary block" data-a="item-save">', `<div class="tg-block"><label>${esc(t('wkTitle'))}</label><button class="btn block" data-a="wk-open">${esc(t('wkBtn', bw.weeks))}</button><div class="muted small">${esc(nW ? t('wkSet', nW) : t('wkNone'))}</div></div><button class="btn primary block" data-a="item-save">`);
    }
  } else if (sh.type === 'cycle') {
    const c = sh.c, fixed = c.type === 'fixed', dl = c.deload;
    const tp = S.templates.find(x => x.id === sh.tpId); const cur = tp && tp.cycle && C.cycleOf(tp);
    const bi = cur && cur.type === 'fixed' && fixed ? C.blockInfo(tp) : null;
    const nW = Math.min(24, Math.max(2, parseInt(c.weeks, 10) || 2));
    const inp = (k, label, val, ml = 2) => `<div><label for="cy-${k}">${esc(label)}</label><input id="cy-${k}" data-f="cy" data-k="${k}" data-san="int" inputmode="numeric" autocomplete="off" maxlength="${ml}" value="${esc(val ?? '')}"></div>`;
    body = `${head(t('cycTitle'))}
      <div class="seg" role="group"><button class="${!fixed ? 'on' : ''}" data-a="cyc-type" data-v="repeat" aria-pressed="${!fixed}">${esc(t('cycRepeat'))}</button><button class="${fixed ? 'on' : ''}" data-a="cyc-type" data-v="fixed" aria-pressed="${fixed}">${esc(t('cycFixed'))}</button></div>
      <div class="muted small">${esc(fixed ? t('cycFixedD') : t('cycRepeatD'))}</div>
      ${fixed ? `<div class="grid2">${inp('weeks', t('cycWeeks'), c.weeks)}<div></div></div>
        ${bi ? `<div class="row" style="border:0;min-height:48px"><span class="grow">${esc(bi.finished ? t('cycDone') : t('cycNow', bi.week, bi.weeks))}</span><button class="icon-btn" data-a="cyc-shift" data-v="-1" aria-label="−1">−</button><button class="icon-btn" data-a="cyc-shift" data-v="1" aria-label="+1">+</button></div>` : `<div class="muted small">${esc(t('cycStartNote'))}</div>`}
        <div class="muted small">${esc(t('cycCount'))}</div>` : ''}
      <div class="tg-block"><label>${esc(t('dlTitle'))}</label>
        <div class="chips wrap">${['none', 'every'].concat(fixed ? ['weeks'] : []).map(m => `<button class="chip ${dl.mode === m ? 'on' : ''}" data-a="cyc-dl" data-v="${m}" aria-pressed="${dl.mode === m}">${esc(t(m === 'none' ? 'dlNone' : m === 'every' ? 'dlEvery' : 'dlWeeks'))}</button>`).join('')}</div>
        ${dl.mode === 'every' ? `<div class="grid2">${inp('every', t('dlEveryLbl'), dl.every)}<div></div></div>` : ''}
        ${dl.mode === 'weeks' ? `<div class="muted small">${esc(t('dlPick'))}</div><div class="chips wrap wk-chips">${Array.from({ length: nW }, (_, i) => i + 1).map(w => `<button class="chip ${dl.weeks.includes(w) ? 'on' : ''}" data-a="cyc-dlw" data-v="${w}" aria-pressed="${dl.weeks.includes(w)}">${w}</button>`).join('')}</div>` : ''}
        ${dl.mode !== 'none' ? `<div class="grid2">${inp('sets', t('dlSets'), dl.sets)}${inp('load', t('dlLoad'), dl.load)}</div><div class="muted small">${esc(t('dlInfo', +dl.sets || 0, +dl.load || 0))}</div>` : ''}
        <button class="linkish" data-a="why-open" data-v="deload">${esc(t('whyBtn'))}</button></div>
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="cyc-save">${esc(t('save'))}</button>
      ${tp && tp.cycle ? `<button class="btn block" data-a="cyc-restart">${esc(t('cycRestart'))}</button>` : ''}`;
  } else if (sh.type === 'weeks') {
    const it = sh.back.item; const cols = wkCols(sh);
    const lbl = { sets: t('wkSets'), reps: t('wkReps'), x: sh.x === 'pct' ? t('wkPct') : t('wkRpe'), bs: t('wkBack') };
    const ph = { sets: fmtN(it.sets), reps: it.reps, x: sh.x === 'pct' ? fmtN(it.pct) : it.rpe != null ? fmtN(it.rpe) : '', bs: fmtN(it.backoffSets || 0) };
    const san = { sets: 'int', reps: 'reps', x: 'dec', bs: 'int' };
    const im = { sets: 'numeric', reps: 'text', x: 'decimal', bs: 'numeric' };
    const rows = Array.from({ length: sh.n }, (_, i) => i + 1).map(w => { const dl = C.isDeloadWeek(sh.c, w); const r = sh.rows[w] || {};
      return `<div class="wk-r ${dl ? 'dl' : ''}"><span class="wk-n">${w}${dl ? '<small>D</small>' : ''}</span>${cols.map(k => `<input data-f="wk" data-w="${w}" data-k="${k}" data-san="${san[k]}" inputmode="${im[k]}" autocomplete="off" maxlength="5" placeholder="${esc(ph[k])}" value="${esc(r[k] ?? '')}" aria-label="${esc(t('cycWeekOf', w, sh.n) + ' · ' + lbl[k])}">`).join('')}</div>`; }).join('');
    const g = sh.gen;
    const gi = (k, label) => `<div><label for="wg-${k}">${esc(label)}</label><input id="wg-${k}" data-f="wg" data-k="${k}" data-san="${k === 'a' || k === 'b' ? (g.f === 'x' ? 'dec' : 'int') : 'int'}" inputmode="${(k === 'a' || k === 'b') && g.f === 'x' ? 'decimal' : 'numeric'}" autocomplete="off" maxlength="5" value="${esc(g[k] ?? '')}"></div>`;
    body = `${head(t('wkTitle') + ' · ' + exName(it.exId))}
      <div class="muted small">${esc(t('wkHint', schemeShort(it, sh.back.simple)))}</div>
      <div class="wk-tbl" style="--cols:${cols.length}"><div class="wk-r wk-h"><span></span>${cols.map(k => `<span>${esc(lbl[k])}</span>`).join('')}</div>${rows}</div>
      <div class="tg-block"><label>${esc(t('wkGen'))}</label><div class="muted small">${esc(t('wkGenD'))}</div>
        <div class="chips wrap">${cols.map(k => `<button class="chip ${g.f === k ? 'on' : ''}" data-a="wg-f" data-v="${k}" aria-pressed="${g.f === k}">${esc(lbl[k])}</button>`).join('')}</div>
        <div class="grid2">${gi('a', t('wkFrom'))}${gi('b', t('wkTo'))}</div><div class="grid2">${gi('w1', t('wkW1'))}${gi('w2', t('wkW2'))}</div>
        <button class="btn block" data-a="wg-apply">${esc(t('wkApply'))}</button></div>
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="wk-done">${esc(t('wkDone'))}</button>
      <button class="btn ghost block" data-a="wk-clear">${esc(t('wkClear'))}</button>`;
  } else if (sh.type === 'why') {
    body = `${head(t('whyTitle'))}${whyHtml()}`;
  } else if (sh.type === 'gear') {
    const g = sh.g, u = g.unit;
    const bars = G.BAR_CLASSES.map(c => `<div><label for="gb-${c}">${esc(equipName(c))}</label><input id="gb-${c}" data-f="gear-bar" data-c="${c}" data-san="dec" inputmode="decimal" autocomplete="off" maxlength="5" value="${esc(g.bars[c])}"></div>`).join('');
    const rows = G.PLATES[u].map(p => `<div class="row" style="min-height:44px"><span class="name grow">${fmtN(p)} ${u}</span><input aria-label="${esc(fmtN(p) + ' ' + u)}" data-f="gear-pl" data-p="${p}" data-san="int" inputmode="numeric" autocomplete="off" maxlength="2" style="width:72px;text-align:center" value="${esc(g.plates[u][p])}"><span class="meta" style="width:34px">${esc(t('pairsLbl'))}</span></div>`).join('');
    const lists = G.LIST_CLASSES.map(c => `<div><label for="gl-${c}">${esc(equipName(c))}</label><input id="gl-${c}" data-f="gear-list" data-c="${c}" data-san="list" autocomplete="off" maxlength="400" value="${esc(g.lists[c])}"><div class="muted small" id="gp-${c}">${gearPreview(g.lists[c])}</div></div>`).join('');
    body = `${head(t('gearTitle'))}<div class="muted small">${esc(t('gearInfo'))}</div>
      <div><label>${esc(t('gearPlates'))}</label><div class="chips"><button class="chip ${u === 'kg' ? 'on' : ''}" data-a="gear-unit" data-v="kg">kg</button><button class="chip ${u === 'lb' ? 'on' : ''}" data-a="gear-unit" data-v="lb">lb</button></div></div>
      <div class="card" style="padding:4px 16px">${rows}</div>
      <div><label>${esc(t('gearBars'))}</label><div class="grid2">${bars}</div></div>
      <div><label>${esc(t('gearLists'))}</label><div class="muted small" style="margin-bottom:8px">${esc(t('gearListHint'))}</div><div style="display:flex;flex-direction:column;gap:12px">${lists}</div></div>
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="gear-save">${esc(t('save'))}</button>`;
  } else if (sh.type === 'plates') {
    body = `${head(t('plateCalc'))}
      <div class="grid2"><div><label for="pc-target">${esc(t('pcTarget'))}</label><input id="pc-target" data-f="pc" data-k="target" data-san="dec" inputmode="decimal" autocomplete="off" maxlength="6" value="${esc(fmtN(sh.target))}"></div>
        <div><label for="pc-bar">${esc(t('pcBar'))}</label><input id="pc-bar" data-f="pc" data-k="bar" data-san="dec" inputmode="decimal" autocomplete="off" maxlength="5" value="${esc(fmtN(sh.bar))}"></div></div>
      <div class="chips"><button class="chip ${sh.unit === 'kg' ? 'on' : ''}" data-a="pc-unit" data-v="kg">kg</button><button class="chip ${sh.unit === 'lb' ? 'on' : ''}" data-a="pc-unit" data-v="lb">lb</button></div>
      <div id="pc-res">${platesResult(sh)}</div>`;
  } else if (sh.type === 'card') {
    body = `${head(t('cardTitle'))}<canvas id="card-cv" width="1080" height="1350" class="card-cv" role="img" aria-label="${esc(t('cardAlt'))}"></canvas>
      <div class="chips"><button class="chip ${sh.hide ? 'on' : ''}" data-a="card-hide" aria-pressed="${sh.hide ? 'true' : 'false'}">${esc(t('cardHide'))}</button></div>
      <div class="btn-row"><button class="btn primary" data-a="card-share">${esc(t('cardShare'))}</button><button class="btn" data-a="card-save">${esc(t('cardSave'))}</button></div>`;
  } else if (sh.type === 'editset') {
    const it = (S.sessions.find(x => x.id === sh.sesId) || { items: [] }).items.find(x => x.id === sh.itemId);
    const ex = it ? S.ex.get(it.exId) : null; const log = ex ? ex.logging : 'W';
    const v = sh.v || {};
    const f = (k, label, san) => `<div><label for="es-${k}">${esc(label)}</label><input id="es-${k}" data-f="es" data-k="${k}" data-san="${san}" inputmode="${san === 'int' ? 'numeric' : 'decimal'}" autocomplete="off" maxlength="6" value="${esc(v[k] ?? '')}"></div>`;
    const fields = log === 'T' ? f('time', t('targetTime'), 'int')
      : log === 'WD' ? f('weight', t('kg'), 'dec') + f('dist', t('targetDist'), 'int')
      : f('weight', log === 'BWX' ? t('esWeightPlus') : t('kg'), 'dec') + f('reps', t('reps'), 'int');
    body = `${head(sh.setId ? t('esTitle') : t('esNew'))}<div class="muted small">${esc(it ? exName(it.exId) : '')}</div>
      <div class="grid2">${fields}</div>
      ${log === 'T' ? '' : `<div class="grid2">${f('rpe', t('esRpe'), 'dec')}<div></div></div>`}
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="es-save">${esc(t('save'))}</button>
      ${sh.setId ? `<button class="btn danger block" data-a="es-del">${esc(t('esDel'))}</button>` : ''}`;
  } else if (sh.type === 'orm') {
    const m = S.maxes[sh.exId]; const a = appOneRm(sh.exId);
    body = `${head(t('ormTitle') + ' · ' + exName(sh.exId))}
      <div class="muted small">${esc(t('ormAppLine', a ? fmtN(a) : null))}</div>
      <div class="grid2"><div><label for="orm-kg">${esc(t('ormField'))}</label><input id="orm-kg" data-f="orm" data-san="dec" inputmode="decimal" autocomplete="off" maxlength="6" value="${esc(sh.val ?? (m ? fmtN(m.kg) : ''))}"></div><div></div></div>
      <div class="muted small">${esc(t('ormHint'))}</div>
      ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
      <button class="btn primary block" data-a="orm-save">${esc(t('save'))}</button>
      ${m ? `<button class="btn block ghost" data-a="orm-clear">${esc(t('ormClear'))}</button>` : ''}`;
  } else if (sh.type === 'ready') {
    body = `${head(t('readyTitle'))}<div class="muted small">${esc(t('readyText'))}</div>
      <div class="diff ready" role="group" aria-label="${esc(t('readyTitle'))}">${[1, 2, 3, 4, 5].map(v => `<button data-a="ready-pick" data-v="${v}">${v}</button>`).join('')}</div>
      <div class="muted small">${esc(t('readyLow'))}</div>
      <button class="btn block ghost" data-a="ready-pick" data-v="">${esc(t('readySkip'))}</button>`;
  } else if (sh.type === 'calib') {
    const it = findItem(sh.itemId);
    body = `${head(t('calibTitle'))}<div class="sub" style="white-space:pre-line">${esc(t('calibText'))}</div>
      <div class="err" style="background:none;padding:0">${esc(t('calibSafety'))}</div>
      <div class="muted small">${esc(it ? exName(it.exId) : '')}</div>
      ${sh.res ? `<div class="info sel"><h3>${esc(t('calibRes', sh.res.err))}</h3><div>${esc(t('calib_' + sh.res.mode))}</div></div>
        ${S.active && S.active.templateId ? `<button class="btn primary block" data-a="calib-apply" data-v="${sh.res.mode}">${esc(t('calibApply', t('effort_' + sh.res.mode)))}</button>` : ''}
        <button class="btn block" data-a="sheet-close">${esc(t('close'))}</button>`
      : `<div class="grid3 calib">${fld('cw', t('calibW'), sh.w ?? '')}${fld('cg', t('calibGuess'), sh.g ?? '')}${fld('ct', t('calibTotal'), sh.tot ?? '')}</div>
        ${sh.err ? `<div class="err" role="alert">${esc(sh.err)}</div>` : ''}
        <button class="btn primary block" data-a="calib-save">${esc(t('calibSave'))}</button>`}`;
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
      ${sh.spikes && sh.spikes.length ? `<div class="info"><h3>${esc(t('spikeTitle'))}</h3>${sh.spikes.map(x => `<div class="small">${esc(x)}</div>`).join('')}</div>` : ''}
      <button class="btn primary block" data-a="summary-save">${esc(sh.mode === 'finish' ? t('saveWorkout') : t('save'))}</button>`;
  } else if (sh.type === 'schemeInfo') {
    body = `${head(t('progression'))}${METHODS.map(m => `<div class="info ${sh.cur === m ? 'sel' : ''}"><h3>${esc(t('m_' + m))}</h3><div style="white-space:pre-line">${esc(t('mi_' + m))}</div></div>`).join('')}<button class="btn block" data-a="rpe-table">${esc(t('rpeTable'))}</button>`;
  } else if (sh.type === 'rpe') {
    const H = (STR[S.settings.lang] || STR.pl).rpeHints;
    const vals = [5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
    if (sh.feel && !sh.full) {
      body = `${head(t('feelTitle'))}<div class="rpe-list feel" role="listbox" aria-label="${esc(t('feelTitle'))}">${['easy', 'ok', 'hard'].map((f, i) => `<button role="option" class="rpe-opt" style="--k:${(0.1 + i * 0.15).toFixed(2)}" data-a="feel-set" data-v="${f}"><span class="n">${esc(t('feel' + f[0].toUpperCase() + f.slice(1)))}</span><span class="d">${esc(t('feel' + f[0].toUpperCase() + f.slice(1) + 'D'))}</span></button>`).join('')}</div>
        <div class="btn-row"><button class="btn small ghost" data-a="rpe-full">${esc(t('fullScale'))}</button></div>`;
    } else
    body = `${head('RPE')}<div class="muted small">${esc(t('rpeHintEmpty'))}</div>
      <div class="rpe-list" role="listbox" aria-label="RPE">${vals.map((v, i) => `<button role="option" aria-selected="${sh.cur === v}" class="rpe-opt ${sh.cur === v ? 'on' : ''}" style="--k:${(0.05 + i * 0.042).toFixed(3)}" data-a="rpe-set" data-v="${v}"><span class="n">${fmtN(v)}</span><span class="d">${esc(H[v])}</span>${sh.cur === v ? I.check : ''}</button>`).join('')}</div>
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
      ${bm({ prim: e.primary, sec: e.secondary, aria: e.primary.map(muscleName).join(', ') }, 'compact')}
      <div class="bm-legend"><span><i style="background:var(--accent)"></i>${esc(t('primary'))}</span><span><i style="background:var(--bm-sec)"></i>${esc(t('secondary'))}</span></div>
      <div><label>${esc(t('primary'))}</label>${e.primary.map(m => `<span class="tag p">${esc(muscleName(m))}</span>`).join('')}</div>
      ${e.secondary.length ? `<div><label>${esc(t('secondary'))}</label>${e.secondary.map(m => `<span class="tag">${esc(muscleName(m))}</span>`).join('')}</div>` : ''}
      <div class="grid2"><div><label>${esc(t('pattern'))}</label>${esc(patternName(e.pattern))}</div><div><label>${esc(t('equipment'))}</label>${esc(equipName(e.equipment))}</div><div><label>${esc(t('type'))}</label>${esc(t(e.type))}${e.unilateral ? ' · L/P' : ''}</div><div><label>${esc(t('logging'))}</label>${esc(t('log' + e.logging))}</div></div>
      <button class="note-box ${n && n.text ? '' : 'empty'}" data-a="note" data-v="${esc(e.id)}">${n && n.text ? `<span class="lbl">${esc(t('note'))}</span>${esc(n.text)}` : `<span class="lbl">+ ${esc(t('note'))}</span>`}</button>
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
      <div><label>${esc(t('sounds'))}</label><div class="chips"><button class="chip ${st.sound !== false ? 'on' : ''}" data-a="sound" data-v="1">${esc(t('on'))}</button><button class="chip ${st.sound === false ? 'on' : ''}" data-a="sound" data-v="0">${esc(t('off'))}</button></div></div>
      <div class="grid2">${fld('st-restC', t('defaultRestC'), st.restC)}${fld('st-restI', t('defaultRestI'), st.restI)}${fld('st-increment', t('increment'), fmtN(st.increment))}${fld('st-backoffPct', t('defaultBackoff'), st.backoffPct)}</div>
      ${'wakeLock' in navigator ? `<div><label>${esc(t('wakeSet'))}</label><div class="chips"><button class="chip ${st.wake !== false ? 'on' : ''}" data-a="set-flag" data-k="wake" data-v="1">${esc(t('wakeOn'))}</button><button class="chip ${st.wake === false ? 'on' : ''}" data-a="set-flag" data-k="wake" data-v="0">${esc(t('wakeOff'))}</button></div></div>` : `<div class="muted small">${esc(t('wakeNo'))}</div>`}
      <button class="btn block" data-a="gear-open">${esc(t('gearTitle'))}</button><button class="btn block" data-a="plates-open" data-v="">${esc(t('plateCalc'))}</button>
      <h2 style="font-size:20px;margin-top:6px">${esc(t('coachSec'))}</h2>
      <div><label>${esc(t('readinessSet'))}</label><div class="chips"><button class="chip ${st.readiness !== false ? 'on' : ''}" data-a="set-flag" data-k="readiness" data-v="1">${esc(t('on'))}</button><button class="chip ${st.readiness === false ? 'on' : ''}" data-a="set-flag" data-k="readiness" data-v="0">${esc(t('off'))}</button></div></div>
      <div><label>${esc(t('flagsSet'))}</label><div class="chips"><button class="chip ${st.flagsOn !== false ? 'on' : ''}" data-a="set-flag" data-k="flagsOn" data-v="1">${esc(t('on'))}</button><button class="chip ${st.flagsOn === false ? 'on' : ''}" data-a="set-flag" data-k="flagsOn" data-v="0">${esc(t('off'))}</button></div></div>
      <div class="grid2">${fld('st-deloadEvery', t('deloadEverySet'), st.deloadEvery ?? 5)}${fld('st-regressPct', t('regressSet'), st.regressPct ?? 5)}${fld('st-fatigueCut', t('fatigueSet'), st.fatigueCut ?? 30)}</div>
      <h2 style="font-size:20px;margin-top:6px">${esc(t('backup'))}</h2><div class="muted small">${esc(t('backupInfo'))}</div>
      <div class="muted small">${esc(t('lastBackupLbl'))}: ${st.lastBackup ? esc(fmtDate(st.lastBackup, { day: 'numeric', month: 'short', year: 'numeric' })) : esc(t('neverBackup'))}${S._persisted != null ? ' · ' + esc(S._persisted ? t('persistOk') : t('persistNo')) : ''}</div>
      ${window.REPSMITH_DATA ? '' : `<button class="btn block" data-a="export">${esc(t('exportBtn'))}</button>`}
      <button class="btn block" data-a="export-copy">${esc(t('copyBtn'))}</button>
      <button class="btn block" data-a="rpe-table">${esc(t('rpeTable'))}</button>
      ${FEEDBACK_EMAIL ? `<button class="btn block" data-a="feedback">${esc(t('feedbackBtn'))}</button>` : ''}
      <label class="btn block" for="importfile" style="margin:0;color:var(--text);font-size:16px">${esc(t('importBtn'))}</label><input id="importfile" type="file" accept="application/json,.json" hidden>
      <div class="credits"><div class="brand">${I.tally}<span>Repsmith</span></div><div>${esc(t('madeBy'))}</div><div class="muted small">${esc(t('bodyCredit'))}</div><div class="muted small">${esc(t('version'))} ${VERSION} · ${esc(DB.ok ? t('dataLocal') : t('storageOff'))}</div></div>`;
  }
  el.innerHTML = `<div class="scrim ${fresh ? 'enter' : ''}" data-a="scrim"><div class="sheet" role="dialog" aria-modal="true">${body}</div></div>`;
  document.body.style.overflow = 'hidden';
  if (sh.type === 'picker' && sh._focus) { const i = $('#pickq'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }
}
function gearPreview(spec) {
  const p = G.parseSpec(spec);
  if (p.error) return `<span style="color:var(--error)">${esc(t('gearListErr', p.error))}</span>`;
  return p.list.length ? esc(t('gearListCount', p.list.length, fmtN(p.list[0]), fmtN(p.list[p.list.length - 1]))) : '';
}
function platesResult(sh) {
  const g = gearCfg(); const c = G.plateCalc(g, sh.bar, sh.target, sh.unit);
  if (c.none) return `<div class="muted">${esc(t('pcNone'))}</div><button class="btn block" data-a="gear-open">${esc(t('pcSet'))}</button>`;
  if (c.under) return `<div class="muted">${esc(t('pcUnder'))}</div>`;
  const ch = c.chosen; const max = Math.max(...G.PLATES[sh.unit]);
  const stack = ch.plates.length ? `<div class="stack" aria-hidden="true"><span class="bar-end"></span>${ch.plates.map(p => `<span class="disc" style="--h:${Math.round(34 + 66 * p / max)}%">${fmtN(p)}</span>`).join('')}</div>` : '';
  const sideTxt = ch.plates.length ? ch.plates.map(p => fmtN(p)).join(' + ') + ' ' + sh.unit : t('pcBarOnly');
  const lbTotal = sh.unit === 'lb' ? ` · ${fmtN(Math.round(ch.total / G.LB * 10) / 10)} lb` : '';
  return `${c.exact ? '' : `<div class="muted">${esc(t('pcNearest'))}</div>`}
    <div class="pc-total"><span class="v">${fmtN(ch.total)} kg</span><span class="muted">${esc(lbTotal)}</span></div>
    ${stack}
    <div><span class="eyebrow small">${esc(t('pcSide'))}</span><div class="pc-side">${esc(sideTxt)}</div></div>
    ${!c.exact ? `<div class="btn-row">${c.below ? `<button class="btn small" data-a="pc-set" data-v="${c.below.total}">${esc(t('pcLower'))} ${fmtN(c.below.total)}</button>` : ''}${c.above ? `<button class="btn small" data-a="pc-set" data-v="${c.above.total}">${esc(t('pcUpper'))} ${fmtN(c.above.total)}</button>` : ''}</div>` : ''}`;
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
function fld(id, label, val, type = 'num', ph = '') {
  const im = type === 'int' ? 'inputmode="numeric" data-san="int" maxlength="4" autocomplete="off"' : type === 'num' ? 'inputmode="decimal" data-san="dec" autocomplete="off"' : '';
  return `<div><label for="${id}">${esc(label)}</label><input id="${id}" data-f="${id}" ${im} ${ph ? `placeholder="${esc(ph)}"` : ''} value="${esc(val ?? '')}"></div>`;
}
/* switching between top set + backoff and straight sets keeps the total number of sets */
function setMethod(it, m) {
  const was = it.scheme; it.method = m; it.scheme = m === 'P1' || m === 'P5' ? 'topback' : 'straight';
  if (was === 'topback' && it.scheme === 'straight') it.sets = Math.min(20, Math.max(it.sets || 1, 1 + (it.backoffSets || 0)));
  if (was !== 'topback' && it.scheme === 'topback') it.backoffSets = Math.min(10, Math.max(1, (it.sets || 3) - 1));
}
function applyItemTargets(sh) {
  const it = sh.item; const tg = sh.tg, ef = sh.ef; if (!tg) return null;
  const [a, b] = TGT_LIM[tgtKind(it.exId)];
  const lo = parseInt(tg.lo, 10), hi = parseInt(tg.hi, 10);
  if (!(lo > 0)) return t('err_tgEmpty');
  if (lo < a || lo > b) return t('err_tgLim', a, b);
  if (tg.mode === 'range') {
    if (!(hi > 0)) return t('err_tgEmpty');
    if (hi < a || hi > b) return t('err_tgLim', a, b);
    if (hi <= lo) return t('err_tgOrder');
  }
  it.reps = fmtTarget({ mode: tg.mode, lo, hi: tg.mode === 'range' ? hi : lo });
  if (it.scheme === 'topback' && sh.bk) {
    const bk = sh.bk;
    if (bk.mode === 'same') it.backoffReps = '';
    else {
      const bl = parseInt(bk.lo, 10), bh = parseInt(bk.hi, 10);
      if (!(bl > 0)) return t('err_tgEmpty');
      if (bl < a || bl > b) return t('err_tgLim', a, b);
      if (bk.mode === 'range') { if (!(bh > 0)) return t('err_tgEmpty'); if (bh < a || bh > b) return t('err_tgLim', a, b); if (bh <= bl) return t('err_tgOrder'); }
      it.backoffReps = fmtTarget({ mode: bk.mode, lo: bl, hi: bk.mode === 'range' ? bh : bl });
    }
  }
  if (ef.mode === 'pct') {
    const p = num(String(ef.pct).replace(',', '.'));
    if (!(p >= 30 && p <= 100)) return t('err_pct');
    it.pct = Math.round(p * 10) / 10; it.rpe = null; it.rpeMax = null;
  } else {
    delete it.pct;
    if (ef.mode === 'rrange') { if (it.rpe == null || it.rpeMax == null || it.rpeMax <= it.rpe) return t('err_rpeRange'); }
    else it.rpeMax = it.rpe;
  }
  return null;
}
function wkCols(sh) {
  const it = sh.back.item;
  if (it.scheme === 'topback') return ['reps'].concat(sh.x ? ['x'] : []).concat(['bs']);
  return ['sets', 'reps'].concat(sh.x ? ['x'] : []);
}
function wkRowsFrom(it, x) {
  const rows = {};
  for (const [w, o] of Object.entries(it.wk || {})) {
    rows[w] = { sets: o.sets != null ? String(o.sets) : '', reps: o.reps != null ? String(o.reps) : '', bs: o.backoffSets != null ? String(o.backoffSets) : '',
      x: x === 'pct' ? (o.pct != null ? fmtN(o.pct) : '') : x === 'rpe' ? (o.rpe != null ? fmtN(o.rpe) : '') : '' };
  }
  return rows;
}
/* sheet rows -> it.wk; returns an error string or null */
function wkApplyRows(sh) {
  const it = sh.back.item; const [a, b] = TGT_LIM[tgtKind(it.exId)];
  const out = {};
  for (let w = 1; w <= sh.n; w++) {
    const r = sh.rows[w]; if (!r) continue;
    const o = {};
    const v = k => String(r[k] ?? '').trim();
    if (v('sets')) { const n = parseInt(v('sets'), 10); if (!(n >= 0 && n <= 20)) return t('wkErr', w, t('wkErrSets')); o.sets = n; }
    if (v('reps')) { const p = parseTarget(v('reps')); if (!p || p.lo < a || p.hi > b || (p.mode === 'amrap' && tgtKind(it.exId) !== 'reps')) return t('wkErr', w, t('wkErrReps')); o.reps = fmtTarget(p); }
    if (v('x')) {
      const n = num(v('x').replace(',', '.'));
      if (sh.x === 'pct') { if (!(n >= 30 && n <= 110)) return t('wkErr', w, t('wkErrPct')); o.pct = Math.round(n * 10) / 10; }
      else { const q = normRpe(n); if (q == null || q < 5 || Math.abs(q - n) > 1e-9) return t('wkErr', w, t('wkErrRpe')); o.rpe = q; o.rpeMax = q; }
    }
    if (v('bs')) { const n = parseInt(v('bs'), 10); if (!(n >= 0 && n <= 10)) return t('wkErr', w, t('wkErrBack')); o.backoffSets = n; }
    // a value equal to the base is not an override (so later base edits still apply to that week)
    if (o.sets === it.sets) delete o.sets; if (o.reps === it.reps) delete o.reps; if (o.pct != null && o.pct === it.pct) delete o.pct;
    if (o.rpe != null && o.rpe === it.rpe && (it.rpeMax == null || it.rpeMax === it.rpe)) { delete o.rpe; delete o.rpeMax; } if (o.backoffSets === it.backoffSets) delete o.backoffSets;
    const keep = it.wk && it.wk[w] ? Object.fromEntries(['cue', 'test'].filter(k => it.wk[w][k] != null).map(k => [k, it.wk[w][k]])) : {};
    if (Object.keys(o).length || Object.keys(keep).length) out[w] = { ...keep, ...o };
  }
  // test markers on weeks the sheet does not show as rows still survive
  for (const [w, o] of Object.entries(it.wk || {})) if (!out[w] && (o.cue || o.test)) out[w] = Object.fromEntries(['cue', 'test'].filter(k => o[k] != null).map(k => [k, o[k]]));
  if (Object.keys(out).length) it.wk = out; else delete it.wk;
  return null;
}
/* ---------- volume and deload: reasoning and sources ---------- */
const WHY_SRC = {
  schoenfeld: ['Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass: a systematic review and meta-analysis. J Sports Sci. 2017;35(11):1073-1082.', 'https://doi.org/10.1080/02640414.2016.1210197'],
  baz: ['Baz-Valle E, Balsalobre-Fernández C, Alix-Fages C, Santos-Concejero J. A systematic review of the effects of different resistance training volumes on muscle hypertrophy. J Hum Kinet. 2022;81:199-210.', 'https://doi.org/10.2478/hukin-2022-0017'],
  pelland: ['Pelland JC, Remmert JF, Robinson ZP, Hinson SR, Zourdos MC. The resistance training dose-response: meta-regressions exploring the effects of weekly volume and frequency on muscle hypertrophy and strength gain. SportRxiv (preprint), 2024.', 'https://sportrxiv.org/index.php/server/preprint/view/460'],
  bickel: ['Bickel CS, Cross JM, Bamman MM. Exercise dosing to retain resistance training adaptations in young and older adults. Med Sci Sports Exerc. 2011;43(7):1177-1187.', 'https://doi.org/10.1249/MSS.0b013e318207c15d'],
  refalo: ['Refalo MC, Helms ER, Trexler ET, Hamilton DL, Fyfe JJ. Influence of resistance training proximity-to-failure on skeletal muscle hypertrophy: a systematic review with meta-analysis. Sports Med. 2023;53(3):649-665.', 'https://doi.org/10.1007/s40279-022-01784-y'],
  robinson: ['Robinson ZP, Pelland JC, Remmert JF, Refalo MC, Jukic I, Steele J, Zourdos MC. Exploring the dose-response relationship between estimated resistance training proximity to failure, strength gain, and muscle hypertrophy: a series of meta-regressions. Sports Med. 2024;54(9):2209-2231.', 'https://doi.org/10.1007/s40279-024-02069-2'],
  bell: ['Bell L, Strafford BW, Coleman M, Androulakis Korakakis P, Nolan D. Integrating deloading into strength and physique sports training programmes: an international Delphi consensus approach. Sports Med Open. 2023;9.', 'https://doi.org/10.1186/s40798-023-00633-0'],
  rogerson: ['Rogerson D, Nolan D, Androulakis Korakakis P, Immonen V, Wolf M, Bell L. Deloading practices in strength and physique sports: a cross-sectional survey. Sports Med Open. 2024;10.', 'https://doi.org/10.1186/s40798-024-00691-y'],
  coleman: ['Coleman M, Burke R, Augustin F, et al. Gaining more from doing less? The effects of a one-week deload period during supervised resistance training on muscular adaptations. PeerJ. 2024;12:e16777.', 'https://doi.org/10.7717/peerj.16777'],
  travis: ['Travis SK, Mujika I, Gentles JA, Stone MH, Bazyler CD. Tapering and peaking maximal strength for powerlifting performance: a review. Sports. 2020;8(9):125.', 'https://doi.org/10.3390/sports8090125'],
  zourdos: ['Zourdos MC, Klemp A, Dolan C, et al. Novel resistance training-specific rating of perceived exertion scale measuring repetitions in reserve. J Strength Cond Res. 2016;30(1):267-275.', 'https://doi.org/10.1519/JSC.0000000000001049'],
};
const WHY = {
  pl: [
    { id: 'vol', h: 'Co liczymy jako serię', p: [
      'Do objętości liczą się serie robocze, bez rozgrzewki, i tylko ciężkie: z RPE 6 lub więcej albo bez wpisanego RPE. Próg RPE 6 to nasze uproszczenie, żeby lekkie serie nie zawyżały liczby, nie wartość z jednego badania.',
      'Mięsień główny ćwiczenia dostaje 1 serię, pomocniczy 0,5. Tak liczy się ułamkowo. W meta-regresji Pellanda i współpracowników (2024) z trzech sposobów liczenia (pełny, ułamkowy, tylko bezpośredni) właśnie ułamkowy najlepiej opisywał przyrost mięśni.',
      'Bliskość upadku ma znaczenie, ale nie trzeba dochodzić do zera. Refalo i współpracownicy (2023) nie znaleźli przewagi treningu do upadku nad zatrzymaniem tuż przed nim. Robinson i współpracownicy (2024) pokazali, że przyrost masy rośnie, im bliżej upadku kończysz serię, a przyrost siły prawie od tego nie zależy.'],
      src: ['pelland', 'refalo', 'robinson'] },
    { id: 'zones', h: 'Strefy tygodniowe na partię', p: [
      'Poniżej 4: mało. Utrzymać jest łatwiej niż zbudować: u Bickela i współpracowników (2011) młodzi ludzie zachowali masę mięśni przy 1/3 wcześniejszej objętości (starsi nie). Granica 4 serii to nasza umowna linia, poniżej której nie liczymy na wyraźny postęp.',
      '4-10, efektywna: każda seria daje tu dużo. W meta-analizie Schoenfelda i współpracowników (2017) przedziały poniżej 5, 5-9 i 10+ serii tygodniowo dały kolejno większe przyrosty masy (średnio 5,4%, 6,6% i 9,8%), choć różnica była na granicy istotności statystycznej.',
      '10-20, typowa: przegląd Baz-Valle i współpracowników (2022) wskazał 12-20 serii na partię tygodniowo jako rozsądny standard dla osób trenujących.',
      'Ponad 20, wysoko: więcej serii nadal może coś dać, ale każda kolejna daje mniej. Pelland i współpracownicy (2024) widzą malejące zyski dla masy i jeszcze wyraźniej dla siły. U Baz-Valle powyżej 20 serii nie było przewagi dla większości badanych mięśni. Rośnie za to koszt regeneracji.',
      'Granice stref są umowne. Badania dotyczą głównie młodych mężczyzn i trwają zwykle 8-12 tygodni, a masę mierzy się różnymi metodami. Traktuj strefy jak mapę, nie wyrok.'],
      src: ['bickel', 'schoenfeld', 'baz', 'pelland'] },
    { id: 'deload', h: 'Deload', p: [
      'Domyślnie aplikacja w tygodniu deloadu tnie serie o 40% i ciężar o 10%. Bell i współpracownicy (2023) w konsensusie ekspertów opisują deload jako celowe, okresowe zmniejszenie obciążenia treningowego, które ma poprawić regenerację i gotowość do dalszego treningu.',
      'W ankiecie Rogersona i współpracowników (2024) wśród 246 zawodników sportów siłowych i sylwetkowych podczas deloadu spadały objętość, ciężar i wysiłek, a częstotliwość i dobór ćwiczeń zostawały. Tak samo działa aplikacja: te same dni i ćwiczenia, mniej i lżej.',
      'Coleman i współpracownicy (2024) sprawdzili tydzień całkowitej przerwy w połowie 9 tygodni treningu. Masa mięśni nie ucierpiała, ale przyrost siły nóg był mniejszy. Dlatego deload tnie trening zamiast go odwoływać.',
      'Liczby 40% i 10% to nasz punkt wyjścia zgodny z tą praktyką, nie wynik jednego badania. Zmienisz je w ustawieniach cyklu każdego planu.'],
      src: ['bell', 'rogerson', 'coleman'] },
    { id: 'plan', h: 'Bloki z procentami i test 1RM', p: [
      'Plany blokowe liczą ciężar z 1RM: z wartości wpisanej ręcznie albo z najlepszego e1RM z ostatnich 6 tygodni. Tabela RPE, z której aplikacja liczy e1RM, opiera się na skali RPE opisanej przez powtórzenia w zapasie (Zourdos i współpracownicy, 2016).',
      'Przed testem objętość spada, a intensywność zostaje. Tak opisuje tapering przegląd Travisa i współpracowników (2020) dla trójboju. Dlatego w planie 12-tygodniowym tydzień 11 ma mało serii przy wysokim procencie, a tydzień 12 to test.',
      'Tabele w planach blokowych ułożyliśmy sami na tych zasadach. Nie są kopią żadnego nazwanego programu.'],
      src: ['zourdos', 'travis'] },
  ],
  en: [
    { id: 'vol', h: 'What counts as a set', p: [
      'Volume counts working sets only, no warm-ups, and only hard ones: RPE 6 or higher, or no RPE logged. The RPE 6 cut-off is our simplification so light sets do not inflate the number, not a value from one study.',
      'The main muscle of an exercise gets 1 set, a supporting muscle 0.5. That is fractional counting. In the meta-regression by Pelland and colleagues (2024), out of three counting methods (total, fractional, direct only) fractional described muscle growth best.',
      'Proximity to failure matters, but you do not need to hit zero. Refalo and colleagues (2023) found no advantage of training to failure over stopping just short of it. Robinson and colleagues (2024) showed muscle growth improves the closer to failure you stop, while strength gain barely depends on it.'],
      src: ['pelland', 'refalo', 'robinson'] },
    { id: 'zones', h: 'Weekly zones per muscle', p: [
      'Under 4: low. Keeping muscle is easier than building it: in Bickel and colleagues (2011) young adults kept their muscle at 1/3 of the earlier volume (older adults did not). The 4-set line is our own threshold below which we do not expect clear progress.',
      '4-10, efficient: every set does a lot here. In the meta-analysis by Schoenfeld and colleagues (2017), under 5, 5-9 and 10+ weekly sets gave progressively larger gains (about 5.4%, 6.6% and 9.8%), although the difference was borderline significant.',
      '10-20, common: the review by Baz-Valle and colleagues (2022) points to 12-20 weekly sets per muscle as a reasonable standard for trained people.',
      'Over 20, high: more sets can still help, but each extra set gives less. Pelland and colleagues (2024) see diminishing returns for muscle and even more for strength. In Baz-Valle, over 20 sets showed no advantage for most muscles studied. Recovery cost keeps rising.',
      'Zone limits are a convention. Studies mostly involve young men over 8-12 weeks, and muscle is measured in different ways. Treat the zones as a map, not a verdict.'],
      src: ['bickel', 'schoenfeld', 'baz', 'pelland'] },
    { id: 'deload', h: 'Deload', p: [
      'By default a deload week cuts sets by 40% and weight by 10%. Bell and colleagues (2023), in an expert consensus, describe a deload as a planned, periodic reduction in training load meant to improve recovery and readiness to keep training.',
      'In the survey by Rogerson and colleagues (2024) of 246 strength and physique athletes, deloads reduced volume, load and effort, while frequency and exercise choice stayed the same. The app does the same: same days and exercises, less and lighter.',
      'Coleman and colleagues (2024) tested a full week off in the middle of 9 weeks of training. Muscle growth was unaffected, but lower-body strength gains were smaller. That is why a deload cuts training rather than cancelling it.',
      'The 40% and 10% figures are our starting point in line with that practice, not the result of one study. Change them in each plan\'s cycle settings.'],
      src: ['bell', 'rogerson', 'coleman'] },
    { id: 'plan', h: 'Percentage blocks and the 1RM test', p: [
      'Block plans calculate loads from your 1RM: the value you entered, or the best e1RM from the last 6 weeks. The RPE table the app uses for e1RM is based on the repetitions-in-reserve RPE scale (Zourdos and colleagues, 2016).',
      'Before a test, volume drops and intensity stays. That is how the review by Travis and colleagues (2020) describes tapering for powerlifting. So in the 12-week plan week 11 has few sets at a high percentage, and week 12 is the test.',
      'We wrote the tables in the block plans ourselves on these principles. They are not a copy of any named program.'],
      src: ['zourdos', 'travis'] },
  ],
};
function whyHtml() {
  const L = S.settings.lang === 'en' ? 'en' : 'pl';
  return WHY[L].map(sec => `<section class="why" id="why-${sec.id}"><h3>${esc(sec.h)}</h3>${sec.p.map(x => `<p>${esc(x)}</p>`).join('')}
    <div class="why-src"><div class="eyebrow small">${esc(t('whySrc'))}</div><ol>${sec.src.map(k => `<li>${esc(WHY_SRC[k][0])} <a href="${WHY_SRC[k][1]}" target="_blank" rel="noopener">${esc(WHY_SRC[k][1].replace(/^https:\/\//, ''))}</a></li>`).join('')}</ol></div></section>`).join('');
}
function ormDone() {
  const sh = S.sheet; const back = sh.back;
  if (S.active) for (const it of S.active.items) if (it.exId === sh.exId && it.pct) { const g = C.suggest({ exId: it.exId, method: it.method, reps: it.reps, rpe: it.rpe, rpeMax: it.rpeMax, scheme: it.scheme, sets: it.sets.filter(x => x.kind === 'work').length, pct: it.pct }, { before: S.active.startedAt, sig: it.sig, effort: S.active.effort }); if (g) it.sug = g; else delete it.sug; saveActive(); }
  if (back) openSheet(back); else { closeSheet(); render(); }
}
function initItemSheet(sh) {
  const it = sh.item;
  const o = parseTarget(it.reps) || parseTarget(normTarget(it.reps, it.exId, defaultItem(it.exId).reps)) || { mode: 'fixed', lo: 8, hi: 8 };
  sh.tg = { mode: o.mode, lo: String(o.lo), hi: o.mode === 'range' ? String(o.hi) : '' };
  sh.ef = { mode: efMode(it), pct: it.pct ? fmtN(it.pct) : '' };
  const bo = parseTarget(it.backoffReps);
  sh.bk = bo && bo.mode !== 'amrap' ? { mode: bo.mode, lo: String(bo.lo), hi: bo.mode === 'range' ? String(bo.hi) : '' } : { mode: 'same', lo: '', hi: '' };
  if (!efModesFor(it.exId).includes(sh.ef.mode)) sh.ef.mode = 'rpe';
  sh.err = null;
}
/* keep method, rep mode and intensity mode compatible; returns the new method if it had to change */
function reconcileItem(sh, changed) {
  const it = sh.item; const tg = sh.tg, ef = sh.ef;
  let m = it.method || C.methodOf(it);
  const kind = tgtKind(it.exId);
  if (!m || kind !== 'reps') return null;
  const m0 = m;
  const okR = REP_MODES[m] || [], okE = EF_MODES[m] || [];
  let nm = null;
  if (changed === 'rep' && !okR.includes(tg.mode)) nm = tg.mode === 'amrap' ? 'P2' : tg.mode === 'range' ? 'H1' : 'P3';
  if (changed === 'ef' && !okE.includes(ef.mode)) nm = ef.mode === 'pct' ? 'P2' : m;
  if (nm && nm !== m) {
    setMethod(it, nm); m = nm;
  }
  // after a method change, adapt whatever no longer fits
  const R = REP_MODES[m] || ['fixed'], E = EF_MODES[m] || ['rpe'];
  if (!R.includes(tg.mode)) {
    const lo = +tg.lo || 8;
    if (R.includes('range')) { tg.mode = 'range'; tg.lo = String(lo); tg.hi = String(Math.min(100, lo + (lo >= 8 ? 4 : 2))); }
    else { tg.mode = 'fixed'; tg.hi = ''; }
  }
  if (!E.includes(ef.mode)) ef.mode = 'rpe';
  return m !== m0 ? m : null;
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
  'sheet-close': () => { if (S.sheet && (S.sheet.type === 'why' || S.sheet.type === 'weeks') && S.sheet.back) openSheet(S.sheet.back); else closeSheet(); },
  scrim: (el, ev) => { if (ev.target === el) closeSheet(); },
  'confirm-yes': () => { const f = S._onYes; closeSheet(); if (f) f(); },
  'menu-pick': el => { const f = S.sheet && S.sheet.handlers && S.sheet.handlers[el.dataset.v]; closeSheet(); if (f) f(); },

  'start-day': () => {
    const tp = activeTemplate(); const d = S._pickedDay && tp && tp.days.find(x => x.id === S._pickedDay) || nextDay(tp); ensureAudio(); S._pickedDay = null;
    if (tp && tp.planId && S.settings.readiness !== false) { openSheet({ type: 'ready', tplId: tp.id, dayId: d.id }); return; }
    startSession(tp, d);
  },
  'ready-pick': el => {
    const sh = S.sheet; const tp = S.templates.find(x => x.id === sh.tplId); const d = tp && tp.days.find(x => x.id === sh.dayId);
    closeSheet(); if (!tp || !d) return;
    startSession(tp, d, { ready: el.dataset.v === '' ? null : +el.dataset.v });
  },
  'start-free': () => { ensureAudio(); startSession(null, null); },
  'pick-day': el => { const tp = activeTemplate(); const d = tp.days.find(x => x.id === el.dataset.v); S._pickedDay = d.id; render(); },

  'new-plan': () => { S.np = { name: t('newPlan') }; go('newplan'); },
  'np-create': el => {
    const nm = (S.np && S.np.name || '').trim() || t('newPlan');
    const tp = { id: uid(), name: nm, mode: el.dataset.v === 'simple' ? 'simple' : 'advanced', days: [{ id: uid(), name: (S.settings.lang === 'en' ? 'Day ' : 'Dzień ') + 'A', items: [] }], createdAt: now(), updatedAt: now() };
    S.templates.push(tp);
    if (!S.settings.activeTemplateId) { S.settings.activeTemplateId = tp.id; persist('settings'); }
    saveTemplates(); S.np = null; go('plan', tp.id); setTimeout(() => { if (S.view === 'plan' && S.viewArg === tp.id) A['day-add-ex']({ dataset: { d: tp.days[0].id } }); }, 60);
  },
  'plan-mode': () => { const tp = S.templates.find(x => x.id === S.viewArg); tp.mode = planMode(tp) === 'simple' ? 'advanced' : 'simple'; tp.updatedAt = now(); saveTemplates(); render(); },
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
    openSheet({ type: 'menu', title: tp.name, items: [{ id: 'mode', label: planMode(tp) === 'simple' ? t('modeToAdv') : t('modeToSimple') }, { id: 'dup', label: S.settings.lang === 'en' ? 'Duplicate plan' : 'Duplikuj plan' }, { id: 'del', label: t('deletePlan'), danger: true }],
      handlers: {
        mode: () => A['plan-mode'](),
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
  'edit-item': el => { const [, d] = tplDay(el.dataset.d); const it = d.items.find(x => x.id === el.dataset.i); openSheet({ type: 'item', simple: planMode(tplDay(d.id)[0]) === 'simple', dayId: d.id, item: clone(it), _m0: it.method || C.methodOf(it) || null, _rpe0: it.rpe }); },
  'item-up': el => { const [, d] = tplDay(el.dataset.d); const i = d.items.findIndex(x => x.id === el.dataset.i); if (i > 0) { const [x] = d.items.splice(i, 1); d.items.splice(i - 1, 0, x); normGroups(d.items); saveTemplates(); render(); } },
  'item-link': el => { const [, d] = tplDay(el.dataset.d); const it = d.items.find(x => x.id === el.dataset.i); groupMenu(d.items, it, saveTemplates); },
  'link-toggle': el => { const L = S.link; if (!L) return; const k = L.ids.indexOf(el.dataset.i); if (k >= 0) L.ids.splice(k, 1); else L.ids.push(el.dataset.i); render(); },
  'link-cancel': () => { S.link = null; render(); },
  'link-go': () => { const items = linkItemsOf(); const w = S.link && S.link.where; if (items) linkItems(items, S.link.ids); S.link = null; if (w === 'session') saveActive(); else saveTemplates(); render(); },
  'item-del': el => { const [, d] = tplDay(el.dataset.d); d.items = d.items.filter(x => x.id !== el.dataset.i); normGroups(d.items); saveTemplates(); render(); },
  'item-scheme': el => { readItemFields(); S.sheet.item.scheme = el.dataset.v; renderSheet(); },
  'item-method': el => {
    readItemFields(); const it = S.sheet.item; const m = el.dataset.v;
    setMethod(it, m);
    if (it.rpeMax == null && it.rpe != null) it.rpeMax = it.rpe;
    reconcileItem(S.sheet, 'method'); S.sheet.err = null;
    renderSheet();
  },
  'item-prog': el => { readItemFields(); if (el.checked) delete S.sheet.item.noprog; else S.sheet.item.noprog = true; },
  'tg-mode': el => {
    readItemFields(); const sh = S.sheet; const tg = sh.tg; const m = el.dataset.v; if (tg.mode === m) return;
    const lo = +tg.lo || null;
    if (m === 'range') { tg.hi = lo ? String(Math.min(TGT_LIM[tgtKind(sh.item.exId)][1], lo + (lo >= 8 ? 4 : 2))) : ''; }
    else tg.hi = '';
    tg.mode = m; sh.err = null;
    const nm = sh.simple ? null : reconcileItem(sh, 'rep'); if (nm) toast(t('methodSwitched', t('m_' + nm)));
    renderSheet();
  },
  'bk-mode': el => {
    readItemFields(); const bk = S.sheet.bk; const m = el.dataset.v; if (bk.mode === m) return;
    const base = parseTarget(S.sheet.tg.lo) ? +S.sheet.tg.lo : 8;
    if (m === 'same') { bk.lo = ''; bk.hi = ''; }
    else { if (!bk.lo) bk.lo = String(base + 2); bk.hi = m === 'range' ? String(Math.min(100, (+bk.lo || base) + 3)) : ''; }
    bk.mode = m; S.sheet.err = null; renderSheet();
  },
  'ef-mode': el => {
    readItemFields(); const sh = S.sheet; const it = sh.item; const m = el.dataset.v; if (sh.ef.mode === m) return;
    sh.ef.mode = m; sh.err = null;
    if (m === 'rrange') { if (it.rpe == null) it.rpe = 7.5; if (it.rpeMax == null || it.rpeMax <= it.rpe) it.rpeMax = Math.min(10, it.rpe + 1); }
    if (m === 'rpe' && it.rpe == null && sh._rpe0 != null) it.rpe = sh._rpe0;
    if (m === 'pct' && !sh.ef.pct) sh.ef.pct = '75';
    const nm = reconcileItem(sh, 'ef'); if (nm) toast(t('methodSwitched', t('m_' + nm)));
    renderSheet();
  },
  'orm-open': el => { if (S.sheet && S.sheet.type === 'item') readItemFields(); const back = S.sheet && S.sheet.type === 'item' ? S.sheet : null; openSheet({ type: 'orm', exId: el.dataset.v, back }); },
  'orm-save': () => {
    const v = num(cleanDec(($('#orm-kg') || {}).value || '').replace(',', '.'));
    if (!(v > 0) || v > 1000) { S.sheet.err = t('err_orm'); S.sheet.val = ($('#orm-kg') || {}).value; renderSheet(); return; }
    S.maxes[S.sheet.exId] = { kg: v, at: now() }; persist('maxes'); ormDone();
  },
  'orm-clear': () => { delete S.maxes[S.sheet.exId]; persist('maxes'); ormDone(); },
  'item-save': () => {
    readItemFields();
    const err = applyItemTargets(S.sheet);
    if (err) { S.sheet.err = err; renderSheet(); return; }
    const [, d] = tplDay(S.sheet.dayId);
    const i = d.items.findIndex(x => x.id === S.sheet.item.id);
    if (i >= 0) d.items[i] = S.sheet.item;
    saveTemplates(); closeSheet(); render();
  },

  pick: el => {
    const id = el.dataset.v, tg = S.sheet.target;
    if (tg.kind === 'day') { const [, d] = tplDay(tg.dayId); const it = defaultItem(id); const sm = planMode(tplDay(d.id)[0]) === 'simple'; if (sm) { it.rpe = null; it.rpeMax = null; } d.items.push(it); saveTemplates(); render(); openSheet({ type: 'item', simple: sm, dayId: d.id, item: clone(it) }); }
    else if (tg.kind === 'session') { S.active.items.push(freeItem(id)); saveActive(); closeSheet(); render(); setTimeout(() => { const c = document.querySelectorAll('.ex-card'); c[c.length - 1]?.scrollIntoView({ block: 'start' }); }, 30); }
    else if (tg.kind === 'swap') { doSwap(tg.itemId, id); }
    else if (tg.kind === 'progress') { S.prog.tab = 'strength'; S.prog.exId = id; closeSheet(); render(); }
  },
  'pick-clear': () => { S.sheet.pat = ''; S.sheet.mus = ''; S.sheet.q = ''; renderSheet(); },
  'lib-clear': () => { S.lib = { q: '', pat: '', mus: '' }; render(); },

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
      s.pr = detectPR(it.exId, s); S._justDone = s.id;
      if (s.pr.length) toast(`${t('prNew')}: ${prLabel(s.pr)}`);
      ensureAudio();
      const items = S.active.items, ix = items.indexOf(it), sIdx = it.sets.indexOf(s);
      const later = it.group ? items.slice(ix + 1).filter(x => x.group === it.group) : [];
      const wait = later.some(x => x.sets.length > sIdx);
      if (!wait) startTimer(it.rest || S.settings.restI);
      else { const nx = later.find(x => x.sets.length > sIdx); S._focusNext = { i: nx.id, s: nx.sets[sIdx].id }; }
    } else { s.done = false; s.pr = []; }
    saveActive(); render();
    if (S._focusNext) { const f = S._focusNext; S._focusNext = null; setTimeout(() => { const inp = document.querySelector(`input[data-f="set"][data-i="${f.i}"][data-s="${f.s}"]`); if (inp && !inp.value) { try { inp.focus({ preventScroll: false }); } catch (e) {} } }, 60); }
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
  'bm-toggle': () => { S.settings.showBody = S.settings.showBody === false; persist('settings'); if (S.sheet && S.sheet.type === 'picker') renderSheet(); else render(); },
  'bm-pick': el => {
    const m = el.dataset.v;
    if (S.sheet && S.sheet.type === 'picker') { S.sheet.mus = S.sheet.mus === m ? '' : m; renderSheet(); return; }
    if (S.view === 'library') { S.lib.mus = S.lib.mus === m ? '' : m; render(); return; }
    if (S.view === 'progress') {
      const v = Math.round(((rollingVolume(S.prog.week).find(x => x[0] === m) || [m, 0])[1]) * 10) / 10;
      const word = S.settings.lang === 'en' ? (v === 1 ? 'set' : 'sets') : (Number.isInteger(v) ? plural(v, 'seria', 'serie', 'serii') : 'serii');
      const tip = $('#bm-tip'); if (tip) tip.textContent = `${muscleName(m)} · ${fmtN(v)} ${word}`;
      document.querySelectorAll('.bodymap .bm-m.pick').forEach(x => x.classList.remove('pick'));
      document.querySelectorAll(`.bodymap .bm-m[data-m="${m}"]`).forEach(x => x.classList.add('pick'));
    }
  },
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
  'item-rpe': el => { readItemFields(); const back = S.sheet; const hi = el.dataset.v === 'hi'; openSheet({ type: 'rpe', mode: 'item', which: hi ? 'hi' : 'lo', back, cur: normRpe(hi ? back.item.rpeMax : back.item.rpe) }); },
  'rpe-open': el => {
    const it = findItem(el.dataset.i); const s = it.sets.find(x => x.id === el.dataset.s);
    const feel = S.active.effort === 'fixed' && s.target && s.target.rpe != null;
    openSheet({ type: 'rpe', itemId: it.id, setId: s.id, cur: normRpe(s.rpe), feel });
  },
  'rpe-full': () => { S.sheet.full = true; renderSheet(); },
  'feel-set': el => {
    const it = findItem(S.sheet.itemId); const s = it && it.sets.find(x => x.id === S.sheet.setId);
    if (s) {
      const tg = +s.target.rpe; const v = { easy: Math.max(5, tg - 2), ok: tg, hard: Math.min(10, tg + 1.5) }[el.dataset.v];
      s.rpe = String(normRpe(v)); s.feel = el.dataset.v; if (s.done) s.pr = detectPR(it.exId, s); saveActive();
    }
    closeSheet(); render();
  },
  'calib-open': el => openSheet({ type: 'calib', itemId: el.dataset.i }),
  'calib-save': () => {
    const sh = S.sheet; const g = id => num(($('#' + id) || {}).value);
    sh.w = g('cw'); sh.g = g('cg'); sh.tot = g('ct');
    if (!(sh.w > 0 && sh.g > 0 && sh.tot >= sh.g)) { sh.err = t('calibErr'); renderSheet(); return; }
    const it = findItem(sh.itemId); const ex = S.ex.get(it.exId);
    const err = Math.round(Math.abs(sh.tot - (sh.g + 2)));
    const mode = err <= 1 ? 'rir' : err === 2 ? 'rir_cap' : 'fixed';
    const set = newSet('calib', null, null); set.weight = String(sh.w); set.reps = String(Math.round(sh.tot)); set.rpe = '10'; set.done = true; set.doneAt = now();
    const firstWork = it.sets.findIndex(x => x.kind !== 'warmup' && !x.done);
    it.sets.splice(firstWork < 0 ? it.sets.length : firstWork, 0, set);
    set.pr = detectPR(it.exId, set);
    S.calib.push({ id: uid(), exId: it.exId, at: now(), w: sh.w, guess: sh.g, total: sh.tot, err, mode });
    persist('calib'); saveActive();
    sh.res = { err, mode }; sh.err = null; render(); renderSheet();
    if (ex && !ex.unilateral) startTimer(it.rest || S.settings.restC);
  },
  'calib-apply': el => {
    const tp = S.active && S.templates.find(x => x.id === S.active.templateId);
    if (tp) { tp.effort = el.dataset.v; persist('templates'); }
    if (S.active) { S.active.effort = el.dataset.v; saveActive(); }
    closeSheet(); toast(t('saved')); render();
  },
  'set-flag': el => { readSettingsFields(); S.settings[el.dataset.k] = el.dataset.v === '1'; persist('settings'); renderSheet(); },
  'rpe-set': el => {
    if (S.sheet.mode === 'item') {
      const back = S.sheet.back; const v = el.dataset.v === '' ? null : normRpe(el.dataset.v);
      if (S.sheet.which === 'hi') back.item.rpeMax = v; else back.item.rpe = v;
      if (back.ef && back.ef.mode === 'rpe') back.item.rpeMax = back.item.rpe;
      back.err = null; openSheet(back); return;
    }
    const it = findItem(S.sheet.itemId); const s = it && it.sets.find(x => x.id === S.sheet.setId);
    if (s) { s.rpe = el.dataset.v; if (s.done) s.pr = detectPR(it.exId, s); saveActive(); }
    closeSheet(); render();
  },
  'scheme-info': el => { const it = findItem(el.dataset.i); openSheet({ type: 'schemeInfo', cur: it.method || C.methodOf(it) }); },
  subs: el => openSheet({ type: 'subs', itemId: el.dataset.i }),
  'do-sub': el => doSwap(S.sheet.itemId, el.dataset.v),
  'sub-pick': () => { const it = findItem(S.sheet.itemId); openSheet({ type: 'picker', target: { kind: 'swap', itemId: it.id }, pat: (S.ex.get(it.exId) || {}).pattern || '' }); },
  'rest-edit': el => { const it = findItem(el.dataset.i); openSheet({ type: 'rest', itemId: it.id, val: it.rest }); },
  'rest-pick': el => { S.sheet.val = +el.dataset.v; renderSheet(); },
  'rest-save': () => { const v = num($('#rest-val').value); const it = findItem(S.sheet.itemId); if (v && v > 0) it.rest = Math.round(v); saveActive(); closeSheet(); render(); },
  'item-menu': el => {
    const it = findItem(el.dataset.i); const i = S.active.items.indexOf(it);
    openSheet({ type: 'menu', title: exName(it.exId), items: [
      { id: 'grp', label: t('supBtn') + '…' },
      ...(i > 0 ? [{ id: 'up', label: t('moveUp') }] : []), ...(i < S.active.items.length - 1 ? [{ id: 'down', label: t('moveDown') }] : []),
      { id: 'del', label: t('remove'), danger: true }],
      handlers: {
        grp: () => groupMenu(S.active.items, it, saveActive),
        up: () => { S.active.items.splice(i, 1); S.active.items.splice(i - 1, 0, it); normGroups(S.active.items); saveActive(); render(); },
        down: () => { S.active.items.splice(i, 1); S.active.items.splice(i + 1, 0, it); normGroups(S.active.items); saveActive(); render(); },
        del: () => { S.active.items = S.active.items.filter(x => x !== it); normGroups(S.active.items); saveActive(); render(); },
      } });
  },
  'timer-adj': el => adjustTimer(+el.dataset.v),
  'timer-skip': () => stopTimer(),
  finish: () => {
    const left = S.active.items.reduce((n, it) => n + it.sets.filter(s => !s.done).length, 0);
    openSheet({ type: 'summary', mode: 'finish', left, name: S.active.name, difficulty: S.active.difficulty || null, note: S.active.note || '', spikes: sessionSpikes(S.active) });
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
      let nf = [];
      if (s.items.length && S.settings.flagsOn !== false) {
        nf = C.evaluate(s, S.flags);
        S.flags.push(...nf);
        const tp = S.templates.find(x => x.id === s.templateId);
        if (tp && nf.some(f => f.type === 'fatigue')) { tp.fatigueNext = true; persist('templates'); }
        persist('flags');
      }
      S.active = null; S.timer = null;
      persist('sessions', 'active');
      toast(nf.length ? `${t('workoutSaved')} · ${t('flagsTitle')}: ${nf.length}` : t('workoutSaved'));
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
      items: src.items.map(it => {
        const o = { id: uid(), exId: it.exId, scheme: it.scheme, rest: it.rest, backoffPct: it.backoffPct, method: it.method || null, kind: it.kind || null,
          reps: it.reps || null, rpe: it.rpe ?? null, rpeMax: it.rpeMax ?? null, sig: it.sig || null,
          sets: it.sets.filter(x => x.kind !== 'calib').map(x => newSet(x.kind, x.side, x.target || null)) };
        if (o.method && o.reps) { const g = C.suggest({ ...o, sets: o.sets.filter(x => x.kind === 'work' && x.side !== 'R').length }, { before: now(), sig: o.sig }); if (g) o.sug = g; }
        return o;
      }),
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

  /* v0.6: plan finder, library, flags */
  'wiz-start': () => { S.wiz = { i: 0, a: { q9: [] } }; go('wizard'); },
  'wiz-pick': el => {
    const w = S.wiz; const key = CD.questions[w.i][0]; const v = el.dataset.v;
    if (key === 'q9') {
      let s = w.a.q9 || [];
      if (v === 'm0') s = s.includes('m0') ? [] : ['m0'];
      else { s = s.filter(x => x !== 'm0'); s = s.includes(v) ? s.filter(x => x !== v) : [...s, v]; }
      w.a.q9 = s; render(); return;
    }
    w.a[key] = v; wizAdvance();
  },
  'wiz-next': () => wizAdvance(),
  'wiz-back': () => {
    const w = S.wiz;
    if (S.view === 'wizres') { w.i = CD.questions.length - 1; go('wizard'); return; }
    if (!w || w.i === 0) { go(S.templates.length ? 'plans' : 'today'); return; }
    w.i--; render();
  },
  'wiz-sel': el => { S.wiz.sel = el.dataset.v; S.wiz.remove = []; S.wiz.addonOn = undefined; render(); window.scrollTo(0, 0); },
  'wiz-effort': el => { S.wiz.effort = el.dataset.v; render(); },
  'wiz-addon': el => { S.wiz.addonOn = !!el.checked; render(); },
  'wiz-rm': el => { const r = S.wiz.remove || []; const v = el.dataset.v; S.wiz.remove = r.includes(v) ? r.filter(x => x !== v) : r.length >= 2 ? r : [...r, v]; render(); },
  'wiz-details': () => { S.wiz.details = !S.wiz.details; render(); },
  'wiz-use': () => { const st = wizState(); st.tpl.cap = st.res.cap; adoptTemplate(st.tpl, S.wiz.a); },
  'plib-goal': el => { S.plib.goal = el.dataset.v; render(); },
  'plib-open': el => go('planprev', el.dataset.v),
  'plib-use': el => { const p = window.RepsmithCoach.planById(el.dataset.v); adoptTemplate(C.buildTemplate(p, {}, { effort: S.settings.effortDefault || 'rir' }), null); },
  'plan-effort': el => { const tp = S.templates.find(x => x.id === S.viewArg); tp.effort = el.dataset.v; tp.updatedAt = now(); persist('templates'); render(); },
  'plan-lag': el => {
    const tp = S.templates.find(x => x.id === S.viewArg); const m = el.dataset.v; let lag = tp.lag || [];
    lag = lag.includes(m) ? lag.filter(x => x !== m) : [...lag, m].slice(-2);
    tp.lag = lag; persist('templates'); render();
  },
  'flag-act': el => {
    const f = S.flags.find(x => x.id === el.dataset.v); if (!f) return;
    const x = el.dataset.x; const tp = activeTemplate();
    if ((x === 'backoff' || x === 'cut10') && tp) {
      tp.adjust = tp.adjust || {};
      tp.adjust[f.exId] = { ...(tp.adjust[f.exId] || {}), ...(x === 'backoff' ? { extraBackoff: true, until: now() + 14 * 864e5 } : { loadPct: 0.9 }) };
      persist('templates');
    }
    if (x === 'confirm') { const s = S.sessions.find(y => y.id === f.sesId); if (s) s.items.forEach(it => it.sets.forEach(z => { if (z.id === f.setId) delete z.pend; })); persist('sessions'); }
    if (x === 'open') { go('session', f.sesId); return; }
    f.status = 'done'; persist('flags');
    if (x === 'variant') { S.plib = { goal: tp ? tp.goal || '' : '' }; go('planlib'); return; }
    render();
  },
  'deload-now': () => {
    const tp = activeTemplate(); if (!tp || !C.cycleOf(tp)) return;
    const until = now() + 7 * 864e5;
    if (tp.cycle) { tp.cycle.deloadUntil = until; tp.cycle.deloadAt = now(); }
    if (tp.block) { tp.block.deloadUntil = until; tp.block.deloadAt = now(); }
    S.flags.forEach(f => { if (f.status === 'open' && FLAG_TYPES_DELOAD.has(f.type)) f.status = 'done'; });
    persist('templates', 'flags'); toast(t('deloadSet')); render();
  },
  'plan-down': el => {
    const tp = activeTemplate(); const p = window.RepsmithCoach.planById(el.dataset.v); if (!p) return;
    adoptTemplate(C.buildTemplate(p, (tp && tp.answers) || {}, { effort: tp ? tp.effort : 'rir', cap: tp && tp.cap || null }), tp && tp.answers);
  },
  'keep-later': () => { const tp = activeTemplate(); if (tp) { tp.reviewSnooze = now() + 14 * 864e5; persist('templates'); } render(); },

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
  sound: el => { readSettingsFields(); S.settings.sound = el.dataset.v === '1'; persist('settings'); renderSheet(); if (S.settings.sound) { ensureAudio(); tick(); } },
  lang: el => { readSettingsFields(); S.settings.lang = el.dataset.v; document.documentElement.lang = S.settings.lang; persist('settings'); render(); },
  feedback: () => {
    const body = `${t('feedbackBody')}\n\n\n--\nRepsmith ${VERSION} · ${S.settings.lang} · ${S.sessions.length} sessions\n${navigator.userAgent}`;
    location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Repsmith ' + VERSION)}&body=${encodeURIComponent(body)}`;
  },
  'es-open': el => {
    const ses = S.sessions.find(x => x.id === el.dataset.ses); const it = ses && ses.items.find(x => x.id === el.dataset.i); if (!it) return;
    const s = el.dataset.s ? it.sets.find(x => x.id === el.dataset.s) : null;
    const last = it.sets.filter(x => x.done && x.kind !== 'warmup').slice(-1)[0];
    const src = s || last || {};
    openSheet({ type: 'editset', sesId: ses.id, itemId: it.id, setId: s ? s.id : null, v: { weight: src.weight ?? '', reps: s ? src.reps : (src.reps ?? ''), dist: src.dist ?? '', time: s ? src.time : (src.time ?? ''), rpe: s ? (src.rpe ?? '') : '' } });
  },
  'es-save': () => {
    const sh = S.sheet; const ses = S.sessions.find(x => x.id === sh.sesId); const it = ses && ses.items.find(x => x.id === sh.itemId); if (!it) return;
    const ex = S.ex.get(it.exId); const log = ex ? ex.logging : 'W';
    const g = k => { const e = $('#es-' + k); return e ? e.value.replace(',', '.').trim() : ''; };
    const v = { weight: g('weight'), reps: g('reps'), dist: g('dist'), time: g('time'), rpe: g('rpe') };
    sh.v = v; sh.err = null;
    if (log === 'T' && !(num(v.time) > 0)) sh.err = t('esErrEmpty');
    else if (log === 'WD' && !(num(v.dist) > 0)) sh.err = t('esErrEmpty');
    else if (log !== 'T' && log !== 'WD' && !(num(v.reps) > 0)) sh.err = t('esErrEmpty');
    else if (log === 'W' && !(num(v.weight) > 0)) sh.err = t('esErrEmpty');
    if (!sh.err && v.rpe !== '' && normRpe(v.rpe) == null) sh.err = t('esErrRpe');
    if (sh.err) { renderSheet(); return; }
    let s = sh.setId ? it.sets.find(x => x.id === sh.setId) : null;
    if (!s) { s = newSet('work', null, null); s.done = true; s.doneAt = ses.endedAt || ses.startedAt; it.sets.push(s); }
    s.weight = log === 'T' ? '' : v.weight; s.reps = log === 'T' || log === 'WD' ? s.reps : v.reps; s.dist = log === 'WD' ? v.dist : s.dist; s.time = log === 'T' ? v.time : s.time;
    s.rpe = v.rpe === '' ? '' : String(normRpe(v.rpe));
    recalcPRs(ses, it.exId);
    persist('sessions'); closeSheet(); toast(t('esSaved')); render();
  },
  'es-del': () => {
    const sh = S.sheet; const ses = S.sessions.find(x => x.id === sh.sesId); const it = ses && ses.items.find(x => x.id === sh.itemId); if (!it) return;
    it.sets = it.sets.filter(x => x.id !== sh.setId);
    if (!it.sets.some(x => x.done)) ses.items = ses.items.filter(x => x !== it);
    recalcPRs(ses, it.exId); persist('sessions'); closeSheet(); toast(t('esDeleted'));
    if (!ses.items.length) { S.sessions = S.sessions.filter(x => x !== ses); persist('sessions'); go('history'); } else render();
  },
  'gear-open': () => { openSheet({ type: 'gear', g: clone(gearCfg()), err: null }); },
  'gear-unit': el => { S.sheet.g.unit = el.dataset.v; renderSheet(); },
  'gear-save': () => {
    const sh = S.sheet; const g = G.norm(sh.g);
    for (const c of G.LIST_CLASSES) { const p = G.parseSpec(g.lists[c]); if (p.error) { sh.err = `${equipName(c)}: ${t('gearListErr', p.error)}`; renderSheet(); return; } }
    S.settings.gear = g; persist('settings'); toast(t('gearSaved')); openSheet({ type: 'settings' });
  },
  'plates-open': el => {
    const it = el.dataset.v ? findItem(el.dataset.v) : null; const g = gearCfg();
    let target = 60, bar = g.bars.BB;
    if (it) {
      bar = g.bars[eqOf(it.exId)] || bar;
      const next = it.sets.find(s => !s.done && s.kind !== 'warmup' && num(s.weight) > 0) || null;
      const last = it.sets.filter(s => s.done && num(s.weight) > 0).slice(-1)[0];
      target = (next && num(next.weight)) || (it.sug && it.sug.load) || (last && num(last.weight)) || bar + 40;
    }
    openSheet({ type: 'plates', target, bar, unit: g.unit });
  },
  'week-toggle': () => { S._weekAll = !S._weekAll; render(); },
  'pw-pick': el => { S.pw = S.pw || {}; S.pw[el.dataset.k] = +el.dataset.v; render(); },
  'cyc-open': el => {
    const tp = S.templates.find(x => x.id === (el.dataset.v || S.viewArg)); if (!tp) return;
    const c = C.cycleOf(tp) || { type: 'repeat', weeks: 8, shift: 0, deload: { mode: 'none', every: 5, weeks: [], sets: 40, load: 10 } };
    openSheet({ type: 'cycle', tpId: tp.id, c: { type: c.type, weeks: String(c.weeks), deload: { mode: c.deload.mode, every: String(c.deload.every), weeks: [...c.deload.weeks], sets: String(c.deload.sets), load: String(c.deload.load) } }, err: null });
  },
  'cyc-type': el => { S.sheet.c.type = el.dataset.v; if (el.dataset.v === 'repeat' && S.sheet.c.deload.mode === 'weeks') S.sheet.c.deload.mode = 'every'; S.sheet.err = null; renderSheet(); },
  'cyc-dl': el => { S.sheet.c.deload.mode = el.dataset.v; S.sheet.err = null; renderSheet(); },
  'cyc-dlw': el => { const l = S.sheet.c.deload.weeks; const w = +el.dataset.v; const i = l.indexOf(w); if (i >= 0) l.splice(i, 1); else { l.push(w); l.sort((a, b) => a - b); } renderSheet(); },
  'cyc-shift': el => {
    const tp = S.templates.find(x => x.id === S.sheet.tpId); if (!tp || !tp.cycle) return;
    const d = +el.dataset.v; const bi = C.blockInfo(tp);
    if ((d > 0 && bi.finished) || (d < 0 && bi.week <= 1 && !bi.finished)) return;
    tp.cycle.shift = (tp.cycle.shift || 0) + d; tp.updatedAt = now(); saveTemplates(); renderSheet(); render();
  },
  'cyc-save': () => {
    const sh = S.sheet; const c = sh.c; const tp = S.templates.find(x => x.id === sh.tpId); if (!tp) return;
    const iv = v => parseInt(v, 10);
    const weeks = iv(c.weeks), every = iv(c.deload.every), ds = iv(c.deload.sets), dlL = iv(c.deload.load);
    if (c.type === 'fixed' && !(weeks >= 2 && weeks <= 24)) { sh.err = t('cycErrWeeks'); renderSheet(); return; }
    if (c.deload.mode === 'every' && !(every >= 2 && every <= 12)) { sh.err = t('cycErrEvery'); renderSheet(); return; }
    if (c.deload.mode !== 'none' && !(ds >= 0 && ds <= 80 && dlL >= 0 && dlL <= 30)) { sh.err = t('cycErrCut'); renderSheet(); return; }
    const prev = C.cycleOf(tp);
    const W = c.type === 'fixed' ? weeks : (prev && prev.weeks) || 8;
    let mode = c.deload.mode; const dw = c.deload.weeks.filter(w => w <= W);
    if (mode === 'weeks' && !dw.length) mode = 'none';
    const keepStart = prev && prev.type === c.type && (tp.cycle || c.type === 'repeat');
    tp.cycle = { type: c.type, weeks: W, start: keepStart ? prev.start : now(), shift: keepStart ? prev.shift || 0 : 0, deloadUntil: prev ? prev.deloadUntil || 0 : 0,
      deload: { mode, every: every >= 2 ? every : 5, weeks: dw, sets: ds >= 0 ? ds : 40, load: dlL >= 0 ? dlL : 10 } };
    tp.updatedAt = now(); saveTemplates(); closeSheet(); toast(t('cycSaved')); render();
  },
  'cyc-restart': () => { const id = S.sheet.tpId; ask(t('cycRestartQ'), () => { const tp = S.templates.find(x => x.id === id); if (!tp || !tp.cycle) return; tp.cycle.start = now(); tp.cycle.shift = 0; tp.cycle.deloadUntil = 0; saveTemplates(); toast(t('endRestarted')); render(); }, { yes: t('cycRestart') }); },
  'cyc-again': el => { const tp = S.templates.find(x => x.id === el.dataset.v); if (!tp || !tp.cycle) return; tp.cycle.start = now(); tp.cycle.shift = 0; tp.cycle.deloadUntil = 0; tp.updatedAt = now(); saveTemplates(); toast(t('endRestarted')); render(); },
  'test-save': el => {
    const tp = S.view === 'plan' ? S.templates.find(x => x.id === S.viewArg) : activeTemplate(); if (!tp) return;
    const res = testResults(tp, C.cycleOf(tp));
    const ids = el.dataset.v ? [el.dataset.v] : Object.keys(res);
    for (const id of ids) if (res[id]) S.maxes[id] = { kg: res[id].kg, at: now() };
    persist('maxes'); toast(t('testSaved')); render();
  },
  'wk-open': () => {
    const sh = S.sheet; readItemFields();
    const err = applyItemTargets(sh); if (err) { sh.err = err; renderSheet(); return; }
    const tp = tplDay(sh.dayId)[0]; const bi = C.blockInfo(tp); if (!bi || !bi.fixed) return;
    const it = sh.item; const x = sh.simple ? null : it.pct ? 'pct' : it.rpe != null ? 'rpe' : null;
    const nsh = { type: 'weeks', back: sh, n: bi.weeks, c: bi.cycle, x, rows: wkRowsFrom(it, x), err: null };
    nsh.gen = { f: wkCols(nsh)[0], a: '', b: '', w1: '1', w2: String(bi.weeks) };
    openSheet(nsh);
  },
  'wg-f': el => { S.sheet.gen.f = el.dataset.v; S.sheet.gen.a = ''; S.sheet.gen.b = ''; renderSheet(); },
  'wg-apply': () => {
    const sh = S.sheet, g = sh.gen;
    const a = num(String(g.a).replace(',', '.')), b = num(String(g.b).replace(',', '.'));
    const w1 = Math.max(1, parseInt(g.w1, 10) || 0), w2 = Math.min(sh.n, parseInt(g.w2, 10) || 0);
    if (a == null || b == null || !(w1 >= 1) || !(w2 >= w1)) { sh.err = t('wkGenErr'); renderSheet(); return; }
    const ws = []; for (let w = w1; w <= w2; w++) if (!C.isDeloadWeek(sh.c, w)) ws.push(w);
    const step = g.f === 'x' ? 0.5 : 1;
    ws.forEach((w, i) => { const v = ws.length === 1 ? a : a + (b - a) * i / (ws.length - 1); const r = Math.round(v / step) * step; sh.rows[w] = sh.rows[w] || {}; sh.rows[w][g.f] = fmtN(r); });
    sh.err = null; renderSheet();
  },
  'wk-clear': () => { S.sheet.rows = {}; S.sheet.err = null; renderSheet(); },
  'wk-done': () => { const sh = S.sheet; const err = wkApplyRows(sh); if (err) { sh.err = err; renderSheet(); return; } openSheet(sh.back); },
  'why-open': el => { const back = S.sheet && S.sheet.type !== 'why' ? S.sheet : null; openSheet({ type: 'why', back }); setTimeout(() => { const x = document.getElementById('why-' + (el.dataset.v === 'vol' ? 'vol' : el.dataset.v)); if (x && el.dataset.v !== 'vol') x.scrollIntoView({ block: 'start' }); }, 30); },
  'hist-mode': el => { S.histMode = el.dataset.v; render(); },
  'cal-nav': el => { let m = S.calM + (+el.dataset.v), y = S.calY; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } S.calM = m; S.calY = y; S.calDay = null; render(); },
  'cal-day': el => { S.calDay = S.calDay === el.dataset.v ? null : el.dataset.v; render(); },
  'card-open': el => { openSheet({ type: 'card', sesId: el.dataset.v, hide: false }); drawCard(); },
  'card-hide': () => { S.sheet.hide = !S.sheet.hide; renderSheet(); drawCard(); },
  'card-save': () => { const cv = $('#card-cv'); if (!cv) return; cv.toBlob(b => { if (!b) return; const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'repsmith-' + new Date(S.sessions.find(x => x.id === S.sheet.sesId)?.startedAt || now()).toISOString().slice(0, 10) + '.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }, 'image/png'); },
  'card-share': () => {
    const cv = $('#card-cv'); if (!cv) return;
    cv.toBlob(async b => {
      if (!b) return;
      const f = new File([b], 'repsmith.png', { type: 'image/png' });
      try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      A['card-save']();
    }, 'image/png');
  },
  'pc-unit': el => { S.sheet.unit = el.dataset.v; renderSheet(); },
  'pc-set': el => { S.sheet.target = +el.dataset.v; renderSheet(); },
  'intro-ok': () => { S.settings.seenIntro = true; persist('settings'); render(); },
  'bk-later': () => { S.settings.bkSnooze = now() + 7 * DAY; persist('settings'); render(); },
  'bk-now': () => { if (window.REPSMITH_DATA) A['export-copy'](); else A.export(); render(); },
  export: () => {
    readSettingsFields();
    try {
      const blob = new Blob([JSON.stringify(backupObj(), null, 1)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `repsmith-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      S.settings.lastBackup = now(); persist('settings'); toast(t('exported'));
    } catch (e) { toast(String(e)); }
  },
  'export-copy': async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(backupObj())); S.settings.lastBackup = now(); persist('settings'); toast(t('copied')); } catch (e) { toast('✕'); }
  },
};

function wizAdvance() {
  const w = S.wiz; w.i++;
  if (w.i >= CD.questions.length) {
    w.i = CD.questions.length - 1;
    w.res = C.derive(w.a); w.sel = w.res.primary.id; w.effort = null; w.remove = []; w.addonOn = undefined; w.details = false;
    go('wizres'); return;
  }
  render(); window.scrollTo(0, 0);
}
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
  it.sets = Math.min(20, it.sets);
  it.warmups = Math.min(10, Math.max(0, Math.round(n('it-warmups', it.warmups))));
  it.rest = Math.min(900, Math.max(10, Math.round(n('it-rest', it.rest))));
  it.backoffSets = Math.min(10, Math.max(0, Math.round(n('it-backoffSets', it.backoffSets))));
  it.backoffPct = Math.min(100, Math.max(40, n('it-backoffPct', it.backoffPct)));
  const tg = $('#tg-lo'); if (tg && S.sheet.tg) S.sheet.tg.lo = cleanInt(tg.value);
  const bl = $('#tg-bklo'); if (bl && S.sheet.bk) S.sheet.bk.lo = cleanInt(bl.value);
  const bh = $('#tg-bkhi'); if (bh && S.sheet.bk) S.sheet.bk.hi = cleanInt(bh.value);
  const th = $('#tg-hi'); if (th && S.sheet.tg) S.sheet.tg.hi = cleanInt(th.value);
  const pc = $('#ef-pct'); if (pc && S.sheet.ef) S.sheet.ef.pct = cleanDec(pc.value);
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
  st.deloadEvery = Math.min(12, Math.max(3, Math.round(g('st-deloadEvery') ?? st.deloadEvery ?? 5)));
  st.regressPct = Math.min(20, Math.max(2, g('st-regressPct') ?? st.regressPct ?? 5));
  st.fatigueCut = Math.min(60, Math.max(10, Math.round(g('st-fatigueCut') ?? st.fatigueCut ?? 30)));
  persist('settings');
}
function backupObj() {
  return { app: 'repsmith', schema: SCHEMA, version: VERSION, exportedAt: new Date().toISOString(),
    settings: S.settings, templates: S.templates, sessions: S.sessions, notes: S.notes, customExercises: S.customExercises, active: S.active, measurements: S.measurements, flags: S.flags, calib: S.calib, maxes: S.maxes };
}
async function importBackup(text) {
  let o;
  try { o = JSON.parse(text); } catch (e) { o = null; }
  if (!o || o.app !== 'repsmith' || !Array.isArray(o.sessions)) { toast(t('importErr')); return; }
  ask(t('importQ'), async () => {
    S.settings = { ...S.settings, ...o.settings }; S.templates = o.templates || []; S.sessions = o.sessions || [];
    S.notes = o.notes || {}; S.customExercises = o.customExercises || []; S.active = o.active || null; S.measurements = o.measurements || []; S.flags = o.flags || []; S.calib = o.calib || []; S.maxes = o.maxes || {};
    await persist(...KEYS); rebuildExercises(); toast(t('imported')); go('today');
  }, { yes: t('confirm') });
}

/* ---------- events ---------- */
(function () {
  let tm = null, sx = 0, sy = 0;
  const clear = () => { clearTimeout(tm); tm = null; };
  document.addEventListener('pointerdown', ev => {
    S._swallow = 0;
    const el = ev.target.closest('[data-lp]'); if (!el || S.link || ev.target.closest('.icon-btn')) return;
    sx = ev.clientX; sy = ev.clientY; clear();
    tm = setTimeout(() => {
      tm = null; const items = S.view === 'workout' ? (S.active && S.active.items) : null;
      const where = S.view === 'workout' ? 'session' : S.view === 'plan' ? 'plan' : null; if (!where) return;
      S.link = { where, dayId: el.dataset.lpd || null, ids: [el.dataset.lp] }; S._swallow = Date.now();
      try { navigator.vibrate && navigator.vibrate(30); } catch (e) {}
      render();
    }, 550);
  });
  document.addEventListener('pointermove', ev => { if (tm && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) clear(); });
  ['pointerup', 'pointercancel', 'scroll'].forEach(n => document.addEventListener(n, clear, true));
  document.addEventListener('contextmenu', ev => { if (ev.target.closest('[data-lp]')) ev.preventDefault(); });
  document.addEventListener('click', ev => { if (S._swallow && Date.now() - S._swallow < 700) { ev.stopPropagation(); ev.preventDefault(); S._swallow = 0; } }, true);
})();
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
  if (el.dataset.san) { const cv = el.dataset.san === 'int' ? cleanInt(el.value) : el.dataset.san === 'list' ? el.value.replace(/[^0-9.,;\-\/ ]/g, '') : el.dataset.san === 'reps' ? el.value.replace(/[^0-9+\-]/g, '') : cleanDec(el.value); if (cv !== el.value) el.value = cv; }
  if (f === 'gear-pl' && S.sheet && S.sheet.g) { const g = S.sheet.g; g.plates[g.unit][el.dataset.p] = Math.min(10, parseInt(el.value || '0', 10) || 0); return; }
  if (f === 'gear-bar' && S.sheet && S.sheet.g) { S.sheet.g.bars[el.dataset.c] = el.value; return; }
  if (f === 'cy' && S.sheet && S.sheet.c) { const k = el.dataset.k; if (k === 'weeks') S.sheet.c.weeks = el.value; else S.sheet.c.deload[k] = el.value; return; }
  if (f === 'wk' && S.sheet && S.sheet.rows) { const w = el.dataset.w; S.sheet.rows[w] = S.sheet.rows[w] || {}; S.sheet.rows[w][el.dataset.k] = el.value; return; }
  if (f === 'wg' && S.sheet && S.sheet.gen) { S.sheet.gen[el.dataset.k] = el.value; return; }
  if (f === 'gear-list' && S.sheet && S.sheet.g) { S.sheet.g.lists[el.dataset.c] = el.value; const pv = $('#gp-' + el.dataset.c); if (pv) pv.innerHTML = gearPreview(el.value); return; }
  if (f === 'pc' && S.sheet && S.sheet.type === 'plates') { const v = num(el.value.replace(',', '.')); S.sheet[el.dataset.k] = v == null ? 0 : v; const r = $('#pc-res'); if (r) r.innerHTML = platesResult(S.sheet); return; }
  if (f === 'np-name') { (S.np || (S.np = {})).name = el.value; return; }
  if (f === 'tg' && S.sheet && S.sheet.tg) { if (el.dataset.k === 'bklo' || el.dataset.k === 'bkhi') S.sheet.bk[el.dataset.k.slice(2)] = el.value; else S.sheet.tg[el.dataset.k] = el.value; return; }
  if (f === 'ef-pct' && S.sheet && S.sheet.ef) {
    S.sheet.ef.pct = el.value;
    const ln = $('#orm-line'); const o = oneRm(S.sheet.item.exId); const pv = num(el.value.replace(',', '.'));
    if (ln && o) ln.textContent = t('ormLine', fmtN(o.kg), o.src === 'manual' ? t('ormManual') : t('ormApp')) + (pv ? ` · ${fmtN(pv)}% = ${fmtN(roundLoad(S.sheet.item.exId, o.kg * pv / 100))} kg` : '');
    return;
  }
  if (f === 'm') { const cv = cleanDec(el.value); if (cv !== el.value) el.value = cv; return; }
  if (f === 'set') {
    const it = findItem(el.dataset.i); if (!it) return;
    const s = it.sets.find(x => x.id === el.dataset.s);
    const cv = cleanField(el.dataset.k, el.value); if (cv !== el.value) el.value = cv;
    s[el.dataset.k] = cv.replace(',', '.');
    clearTimeout(S._saveT); S._saveT = setTimeout(saveActive, 400);
  } else if (f === 'lib-q') {
    S.lib.q = el.value; const list = filteredExercises(S.lib.q, S.lib.pat, S.lib.mus); const l = $('#liblist'); if (l) l.innerHTML = exRows(list, 'ex-detail');
    const c = $('#lib-count'); if (c) c.textContent = t('exercisesN', list.length);
  } else if (f === 'pick-q') {
    S.sheet.q = el.value; const list = filteredExercises(S.sheet.q, S.sheet.pat, S.sheet.mus); const l = $('#picklist'); if (l) l.innerHTML = exRows(list, 'pick');
    const c = $('#pick-count'); if (c) c.textContent = t('exercisesN', list.length);
  } else if (f === 'lib-pat' || f === 'lib-mus') {
    S.lib[f.slice(4)] = el.value; render();
  } else if (f === 'pick-pat' || f === 'pick-mus') {
    S.sheet[f.slice(5)] = el.value; renderSheet();
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
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && S.active) saveActive(); syncWake(); });

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
  if (normTemplates()) persist('templates');
  document.documentElement.lang = S.settings.lang;
  if (S.active) S.view = 'workout';
  try { if (navigator.storage && navigator.storage.persisted) navigator.storage.persisted().then(v => { S._persisted = v; }); if (navigator.storage && navigator.storage.persist) navigator.storage.persist().then(v => { S._persisted = !!v; }).catch(() => {}); } catch (e) {}
  render();
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.REPSMITH_DATA) {
    try {
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
        reg.update().catch(() => {});
        // new version installed while the app is open: reload once so it takes effect
        let reloaded = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloaded || S.active) return; reloaded = true; location.reload(); });
      }).catch(() => {});
    } catch (e) {}
  }
}
window.Repsmith = { S, A, C, CD, substitutes, e1rm, rpePct, prEvents, weeklyVolume, weekStart, bodyweightAt, normTarget, normItem, initItemSheet, applyItemTargets, defaultItem, render, persist, backupObj, oneRm };
boot().catch(err => {
  const pl = (navigator.language || 'pl').startsWith('pl');
  const app = document.getElementById('app');
  if (app) app.innerHTML = `<main class="screen"><div class="eyebrow">Repsmith</div><h1 class="mid">${pl ? 'Nie udało się uruchomić' : 'Could not start'}</h1>
    <p class="sub">${pl ? 'Brakuje pliku z bazą ćwiczeń <b>data/exercises.json</b> albo nie da się go wczytać. Sprawdź, czy w repozytorium jest folder <b>data</b> z tym plikiem oraz folder <b>icons</b>.' : 'The exercise file <b>data/exercises.json</b> is missing or cannot be read. Check that the repository has a <b>data</b> folder with this file and an <b>icons</b> folder.'}</p>
    <p class="muted small">${esc(String(err && err.message || err))}</p></main>`;
});
})();
