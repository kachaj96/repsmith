const H = require('../../hevy.js'), fs = require('fs'), path = require('path');
let P = 0, F = 0; const ok = (c, m) => { if (c) P++; else { F++; console.log('FAIL', m); } };
const lib = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/exercises.json'))).exercises;
const sample = fs.readFileSync(path.join(__dirname, '../fixtures/hevy_sample.csv'), 'utf8');
// CSV
let c = H.parseCSV('a,b\r\n"x, y","he said ""hi""\nnext line"\r\n1,2\r\n');
ok(c.rows.length === 3 && c.rows[1][0] === 'x, y' && c.rows[1][1] === 'he said "hi"\nnext line', 'quotes, commas, newlines in fields');
ok(H.parseCSV('a\tb\n1\t2').delim === '\t', 'tsv detected'); ok(H.parseCSV('a;b\n1;2').delim === ';', 'semicolon detected');
ok(H.parseCSV('﻿a,b\n1,2').rows[0][0] === 'a', 'BOM stripped');
// dates
const d = (...a) => new Date(...a).getTime();
ok(H.parseDate('9 Oct 2026, 06:42') === d(2026, 9, 9, 6, 42), 'en date');
ok(H.parseDate('Oct 9, 2026, 6:42 PM') === d(2026, 9, 9, 18, 42), 'us 12h date');
ok(H.parseDate('12 Oct 2026, 12:05 AM') === d(2026, 9, 12, 0, 5), '12 AM');
ok(H.parseDate('12 paź 2026, 18:30') === d(2026, 9, 12, 18, 30), 'polish short month');
ok(H.parseDate('3 stycznia 2026, 07:00') === d(2026, 0, 3, 7, 0), 'polish genitive month');
ok(H.parseDate('5 juil. 2026, 09:15') === d(2026, 6, 5, 9, 15) && H.parseDate('5 juin 2026, 09:15') === d(2026, 5, 5, 9, 15), 'french juil vs juin');
ok(H.parseDate('2026-10-09 06:42:10') === d(2026, 9, 9, 6, 42, 10), 'iso date');
ok(H.parseDate('garbage') === null && H.parseDate('') === null, 'bad date null');
// parse
const r = H.parse(sample);
ok(!r.error && r.workouts.length === 2 && r.units === 'kg', 'two workouts');
const w1 = r.workouts[0];
ok(w1.title === 'Upper A' && w1.desc === 'Felt good, "fresh"' && w1.end > w1.start, 'title, escaped description, end');
ok(w1.exercises.map(e => e.name).join('|') === 'Bench Press (Barbell)|Pull Up (Weighted)|Face Pull|Zercher Squat|Side Plank|Farmers Walk', 'exercise order');
const bp = w1.exercises[0]; ok(bp.sets.map(s => s.type).join() === 'warmup,normal,normal,drop' && bp.note === 'Grip: narrow', 'set types and note');
ok(bp.sets[1].rpe === 8 && bp.sets[0].rpe === null, 'rpe parsed, empty is null');
ok(w1.exercises[1].ss === '0' && w1.exercises[2].ss === '0' && w1.exercises[0].ss === '', 'superset ids');
ok(w1.exercises[4].sets[0].time === 30 && w1.exercises[4].sets[0].weight === null, 'time-only set');
ok(w1.exercises[5].sets[0].dist === 40 && w1.exercises[5].sets[0].weight === 75, 'km -> metres');
ok(r.workouts[1].exercises[0].sets[1].type === 'failure', 'failure set');
// lbs
const lb = H.parse('title,start_time,exercise_title,set_index,set_type,weight_lbs,reps\nA,"2 Mar 2026, 07:01",Squat (Barbell),0,normal,225,5\n');
ok(lb.units === 'lb' && Math.abs(lb.workouts[0].exercises[0].sets[0].weight - 102.06) < 0.01, 'lbs converted to kg');
// decimal comma in tsv
const tsv = H.parse('title\tstart_time\texercise_title\tset_index\tset_type\tweight_kg\treps\nA\t2 Mar 2026, 07:01\tSquat (Barbell)\t0\tnormal\t62,5\t5\n');
ok(tsv.workouts.length === 1 && tsv.workouts[0].exercises[0].sets[0].weight === 62.5, 'tsv decimal comma');
ok(H.parse('foo,bar\n1,2').error === 'format' && H.parse('').error === 'empty', 'wrong files rejected');
ok(H.parse(sample.replace(/"2 Mar 2026, 07:01"/g, '"nonsense"')).badDates > 0, 'bad dates counted');
// matching
const sg = n => H.suggest(n, lib);
ok(sg('Bench Press (Barbell)').id === 'bench-press' && sg('Bench Press (Barbell)').conf === 'auto', 'explicit match');
ok(sg('Lat Pulldown - Close Grip (Cable)').id === 'close-grip-lat-pulldown', 'dash in name normalised');
ok(sg('Bench Press').id === 'bench-press', 'exact english name');
ok(sg('Zercher Squat').conf === 'none' && sg('Zercher Squat').id === null, 'no clean match stays unmatched');
ok(sg('Iso-Lateral High Row (Machine)').conf === 'check', 'near match needs a check');
const fz = sg('Incline Dumbbell Curl'); ok(fz.id === 'incline-dumbbell-curl', 'fuzzy finds exact words ' + fz.id);
ok(H.guessLogging([{ time: 30 }]) === 'T' && H.guessLogging([{ reps: 10 }]) === 'BWX' && H.guessLogging([{ weight: 5, dist: 40 }]) === 'WD' && H.guessLogging([{ weight: 5, reps: 5 }]) === 'W', 'logging guess');
ok(H.guessEquipment('Cable Thing (Cable)') === 'CAB' && H.guessEquipment('Wall Sit') === 'BW', 'equipment guess');
console.log(`hevy tests: ${P} pass, ${F} fail`); process.exit(F ? 1 : 0);
