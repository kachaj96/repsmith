global.window = {}; require(require('path').join(__dirname, '..', '..', 'runs.js')); const R = window.RepsmithRuns;
let p = 0, f = 0; const ok = (c, m) => { if (c) p++; else { f++; console.log('FAIL', m); } }; const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: got ${JSON.stringify(a)}`);
const base = { name: ' Morning ', type: 'easy', date: 1, unit: 'km', dist: '10,03', pMin: '5', pSec: '32', tH: '', tM: '', tS: '', hr: '148', felt: 6 };
/* distance */
eq(R.parseDist('10,03', 'km'), 10030, 'km comma'); eq(R.parseDist('10500', 'm'), 10500, 'meters'); eq(R.parseDist('0', 'km'), null, 'zero'); eq(R.parseDist('abc', 'km'), null, 'junk');
eq(R.fmtKm(10030), '10.03', 'fmt 2 digits'); eq(R.fmtKm(10000), '10.00', 'trailing zeros kept'); eq(R.fmtKm(950, ','), '0,95', 'comma separator');
eq(R.fmtKm(12345), '12.35', 'rounds half up to 2 digits');
/* pace and duration */
eq(R.fmtPace(332), '5:32', 'pace fmt'); eq(R.fmtDur(3330), '55:30', 'dur mm:ss'); eq(R.fmtDur(3725), '1:02:05', 'dur h:mm:ss');
eq(R.durFromPace(10030, 332), 3330, 'time from pace'); eq(R.paceFromDur(10000, 3000), 300, 'pace from time');
/* build: pace only -> time derived */
let r = R.build(base); ok(r.run && r.run.durS === 3330 && r.run.paceSec === 332 && r.run.distM === 10030, 'pace only');
ok(r.run.name === 'Morning' && r.run.hr === 148 && r.run.felt === 6 && r.run.type === 'easy', 'fields kept and trimmed');
/* time only -> pace derived */
r = R.build({ ...base, pMin: '', pSec: '', tH: '0', tM: '55', tS: '30' }); ok(r.run && r.run.paceSec === 332 && r.run.durS === 3330, 'time only');
/* both, consistent (within rounding) */
r = R.build({ ...base, tH: '', tM: '55', tS: '31' }); ok(r.run && r.run.durS === 3331, 'both consistent');
/* both, mismatch */
r = R.build({ ...base, tM: '50', tS: '00' }); ok(r.err === 'mismatch' && r.expected === '55:30' && r.got === '50:00', 'mismatch caught');
r = R.build({ ...base, tH: '1', tM: '20', tS: '0' }); ok(r.err === 'mismatch', 'time far too long caught');
/* needs pace or time */
eq(R.build({ ...base, pMin: '', pSec: '' }).err, 'need', 'need pace or time');
/* ranges */
eq(R.build({ ...base, dist: '' }).err, 'dist', 'empty distance'); eq(R.build({ ...base, dist: '0,05' }).err, 'dist', 'too short'); eq(R.build({ ...base, dist: '600' }).err, 'dist', 'too long');
eq(R.build({ ...base, unit: 'm', dist: '50' }).err, 'dist', '50 m too short'); ok(R.build({ ...base, unit: 'm', dist: '5000', pMin: '5', pSec: '0' }).run.distM === 5000, 'meters unit');
eq(R.build({ ...base, pMin: '1', pSec: '0' }).err, 'pace', 'pace too fast'); eq(R.build({ ...base, pMin: '30', pSec: '0' }).err, 'pace', 'pace too slow'); eq(R.build({ ...base, pSec: '75' }).err, 'pace', 'seconds over 59');
eq(R.build({ ...base, pMin: '', pSec: '', tM: '75', tS: '0' }).err, 'time', 'minutes over 59'); eq(R.build({ ...base, pMin: '', pSec: '', tH: '0', tM: '0', tS: '0' }).err, 'time', 'zero time');
eq(R.build({ ...base, pMin: '', pSec: '', tM: '5', tS: '0' }).err, 'mismatch', 'derived pace out of range');
eq(R.build({ ...base, hr: '20' }).err, 'hr', 'hr too low'); eq(R.build({ ...base, hr: '300' }).err, 'hr', 'hr too high'); eq(R.build({ ...base, hr: '14x' }).err, 'hr', 'hr junk');
ok(R.build({ ...base, hr: '' }).run.hr === null, 'hr optional'); ok(R.build({ ...base, felt: null }).run.felt === null, 'felt optional'); ok(R.build({ ...base, type: 'zzz' }).run.type === 'easy', 'unknown type falls back');
/* note */
ok(R.build({ ...base, note: '  windy  ' }).run.note === 'windy', 'note trimmed'); ok(R.build({ ...base, note: 'x'.repeat(900) }).run.note.length === 500, 'note capped'); ok(R.build(base).run.note === '', 'note optional');
/* hint */
eq(R.hint({ ...base, pMin: '5', pSec: '0', dist: '10' }), { time: '50:00' }, 'hint time'); eq(R.hint({ ...base, pMin: '', pSec: '', tM: '50', tS: '0', dist: '10' }), { pace: '5:00' }, 'hint pace'); eq(R.hint({ ...base, dist: '' }), null, 'no hint without distance');
/* stats */
const d = (y, m, dd) => new Date(y, m - 1, dd, 12).getTime(); const now = d(2026, 10, 14); // a Wednesday
const runs = [{ distM: 5000, paceSec: 330, durS: 1650, date: d(2026, 10, 13) }, { distM: 21000, paceSec: 360, durS: 7560, date: d(2026, 10, 3) }, { distM: 400, paceSec: 240, durS: 96, date: d(2026, 10, 14) }, { distM: 8000, paceSec: 345, durS: 2760, date: d(2026, 6, 1) }];
const s = R.stats(runs, now);
eq(s.weekM, 5400, 'week total (Mon 12 Oct onward)'); eq(s.monthM, 26400, 'month total'); eq(s.totalM, 34400, 'all-time'); eq(s.count, 4, 'count');
eq(s.longest.distM, 21000, 'longest'); eq(s.bestPace.paceSec, 330, 'best pace ignores runs under 1 km');
eq(s.series.length, 12, '12 weeks'); eq(s.series[11].distM, 5400, 'current week bucket'); eq(s.series[9].distM, 21000, 'Saturday 3 Oct falls in the week of 28 Sep'); eq(s.series.reduce((a, x) => a + x.distM, 0), 26400, 'old runs outside the window');
eq(R.stats([], now).bestPace, null, 'empty stats');
console.log(`runs tests: ${p} pass, ${f} fail`);
