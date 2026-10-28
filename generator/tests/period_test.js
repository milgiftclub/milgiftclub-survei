// Uji: periode giveaway berbasis tanggal (menu Periode Giveaway), berlaku untuk semua survei
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
const sub = (i, v, qc) => ctx.submitResponse({ sid: 's' + i, variant: v, answers: Object.assign({}, base, { Z2: '@u' + i, Z3: '0812' + String(60000000 + i), QC1: qc || 'Biru' }) });
const now = new Date(), ymd = d => new Date(d.getTime() + 7 * 36e5).toISOString().slice(0, 10), add = n => ymd(new Date(now.getTime() + n * 864e5));
// periode lalu (40-11 hari lalu) & periode aktif (10 hari lalu - 60 hari lagi)
const ps = ctx.adminPeriodSave([{ ke: 1, tahun: 2026, mulai: add(-40), selesai: add(-11) }, { ke: 2, tahun: 2026, mulai: add(-10), selesai: add(60) }], 'Periode 2 2026');
assert.strictEqual(ps.active, 'Periode 2 2026'); assert.strictEqual(ps.list.length, 2);
assert.throws(() => ctx.adminPeriodSave([{ ke: 1, tahun: 2026, mulai: 'x', selesai: add(1) }], ''));
ctx.SET_MEMO_ = null;
for (let i = 0; i < 6; i++) sub(i, i % 2 ? 'v2' : 'v1', i === 5 ? 'Merah' : 'Biru');
// pindahkan 2 jawaban ke tanggal periode 1
const T = sheets['Jawaban - Semua Kategori'].d, H = T[0], tc = H.indexOf('timestamp');
T[1][tc] = new Date(now.getTime() - 20 * 864e5); T[2][tc] = new Date(now.getTime() - 20 * 864e5);
let e = ctx.adminEligible('all'); console.log('aktif', e.periode, e.count, JSON.stringify(e.stats), e.periods);
assert.strictEqual(e.periode, 'Periode 2 2026'); assert(e.periods.includes('Periode 1 2026'));
const p1 = ctx.adminEligible('all', 'Periode 1 2026'); assert.strictEqual(p1.count, 2, 'periode 1 dari tanggal');
assert.strictEqual(e.count + p1.count, 5);
const w = ctx.adminDraw('all', 'AirPods', 1); assert.strictEqual(w.length, 1);
assert.strictEqual(ctx.adminEligible('all').count, e.count - 1);
// ringkasan ikut periode
const s2 = ctx.adminSummary(), s1 = ctx.adminSummary('Periode 1 2026'), sAll = ctx.adminSummary('');
console.log('summary', s2.periode, s1.periode, JSON.stringify(s2.periods));
assert.strictEqual(s2.periode, 'Periode 2 2026'); assert.strictEqual(s2.activePeriod, 'Periode 2 2026');
const tot = s => s.surveys.reduce((a, x) => a + (x.total || 0), 0);
assert.strictEqual(tot(s1) + tot(s2), tot(sAll)); assert.strictEqual(tot(s1), 2);
// label survei mengikuti periode aktif, termasuk survei buatan Dashboard (tanpa setting periode sendiri)
const cs = ctx.adminBuilderSave({ name: 'Survei Baru', target: 50, questions: [{ id: 'Q1', text: 'A?', type: 'single', options: [{ t: 'Ya' }, { t: 'Tidak' }] }] }, true);
assert.strictEqual(ctx.getSurvey(cs.id).schema.periodeLabel, 'Survei MIL Gift Club · Periode 2 2026');
ctx.adminPeriodSave(ps.list.map(p => ({ ke: p.ke, tahun: p.tahun, mulai: p.mulai, selesai: p.selesai })), 'Periode 1 2026'); ctx.SET_MEMO_ = null;
assert.strictEqual(ctx.getSurvey(cs.id).schema.periodeLabel, 'Survei MIL Gift Club · Periode 1 2026');
assert.strictEqual(ctx.adminPeriods().active, 'Periode 1 2026');
console.log('OK period_test');
