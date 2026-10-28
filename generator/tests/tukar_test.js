// Uji: nilai kupon per survei, saldo, tukar hadiah, status penukaran, katalog
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
const sub = (sid, v, ig, wa) => ctx.submitResponse({ sid, variant: v, answers: Object.assign({}, base, { Z2: ig, Z3: wa }) });
ctx.adminSaveSettings({ KUPON_V1: 3, KUPON_V2: 2 }); ctx.SET_MEMO_ = null;
const cs = ctx.adminBuilderSave({ name: 'Pendek', target: 50, kupon: 1, questions: [{ id: 'Q1', text: 'A?', type: 'single', options: [{ t: 'Ya' }, { t: 'Tidak' }] }] }, true); ctx.adminBuilderStatus(cs.id, 'Dibuka');
sub('a1', 'v1', '@ani', '081211110001'); sub('a2', 'v2', '@ani', '081211110001'); sub('a3', cs.id, '@ani', '081211110001');
let h = ctx.hubList('@ani'); console.log('nilai', JSON.stringify(h.list.map(x => x.v + ':' + x.nilai)), 'undian', h.kupon, 'saldo', JSON.stringify(h.saldo), 'katalog', h.katalog.length);
assert.strictEqual(h.saldo.sisa, 6); assert.strictEqual(h.kupon, 6); assert.strictEqual(h.katalog.length, 10);
const el = ctx.adminEligible('all'); assert.strictEqual(el.stats.kupon, 6);
const cheap = h.katalog[0]; console.log('hadiah termurah', cheap.nama, cheap.kupon);
let r = ctx.tukarKupon('@ani', '9999', cheap.id); assert.strictEqual(r.ok, false); console.log('salah wa:', r.msg);
const k6 = h.katalog.find(k => k.kupon > 6); r = ctx.tukarKupon('@ani', '0001', k6.id); assert.strictEqual(r.ok, false); console.log('kurang:', r.msg);
// tambah kupon lewat data simulasi kecil: anggap 10 kupon cukup? ganti nilai survei
ctx.adminSaveSettings({ KUPON_V1: 3 }); ctx.SET_MEMO_ = null;
const k = ctx.adminKatalog().katalog; ctx.adminKatalogSave(k.map(x => Object.assign({}, x, x.id === k[2].id ? { kupon: 5 } : {})));
const it = ctx.adminKatalog().katalog.find(x => x.kupon === 5); const st0 = it.stok;
r = ctx.tukarKupon('ani', '0001', it.id); console.log('tukar:', JSON.stringify(r)); assert.strictEqual(r.ok, true); assert.strictEqual(r.sisa, 1);
assert.strictEqual(ctx.adminKatalog().katalog.find(x => x.id === it.id).stok, st0 - 1);
h = ctx.hubList('@ani'); assert.strictEqual(h.saldo.sisa, 1); assert.strictEqual(h.kupon, 6, 'undian tidak berkurang'); console.log('riwayat', JSON.stringify(h.tukar));
const t = ctx.adminKatalog().tukar[0]; ctx.adminTukarStatus(t._row, 'Ditolak', 'uji');
h = ctx.hubList('@ani'); assert.strictEqual(h.saldo.sisa, 6, 'kupon kembali'); assert.strictEqual(ctx.adminKatalog().katalog.find(x => x.id === it.id).stok, st0);
console.log('OK tukar_test');
