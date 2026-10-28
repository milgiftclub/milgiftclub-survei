// Uji: jawaban dicap periode, eligible & undian per periode, 1 WA menang 1x per periode
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
const sub = (i, v, qc) => ctx.submitResponse({ sid: 's' + i, variant: v, answers: Object.assign({}, base, { Z2: '@u' + i, Z3: '0812' + String(60000000 + i), QC1: qc || 'Biru' }) });
for (let i = 0; i < 6; i++) sub(i, i % 2 ? 'v2' : 'v1', i === 5 ? 'Merah' : 'Biru');
let e = ctx.adminEligible('all'); console.log('P1', e.periode, e.count, JSON.stringify(e.stats));
assert.strictEqual(e.periode, 'Periode 1 2026'); assert.strictEqual(e.count, 5); assert.strictEqual(e.stats.valid, 5);
const w = ctx.adminDraw('all', 'AirPods', 2); assert.strictEqual(w.length, 2);
e = ctx.adminEligible('all'); assert.strictEqual(e.count, 3); assert.strictEqual(e.stats.sudahMenang, 2);
// ganti periode -> jawaban baru masuk periode 2; pemenang periode 1 boleh ikut lagi di periode 2
ctx.adminSaveSettings({ PERIODE_KE: 2 }); ctx.SET_MEMO_ = null;
const T = sheets['Jawaban - Semua Kategori'].d, H = T[0];
sub(10, 'v1'); sub(0 + 20, 'v2');
ctx.submitResponse({ sid: 'again', variant: 'v1', answers: Object.assign({}, base, { Z2: '@w', Z3: ctx.adminWinners().rows[0][4].replace(/^'/, '') }) });
e = ctx.adminEligible('all'); console.log('P2', e.periode, e.count, JSON.stringify(e.stats), e.periods);
assert.strictEqual(e.periode, 'Periode 2 2026'); assert(e.periods.includes('Periode 1 2026'));
const p1 = ctx.adminEligible('all', 'Periode 1 2026'); assert.strictEqual(p1.count, 3, 'periode 1 tetap');
assert.strictEqual(T[T.length - 1][H.indexOf('periode_giveaway')], 'Periode 2 2026');
console.log('OK period_test | semua periode:', ctx.adminEligible('all', '').count);
