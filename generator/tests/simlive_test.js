// Uji: isi data simulasi bertahap lewat fungsi Dashboard, lalu hapus bersih (data asli tetap utuh)
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Ya, bersedia', S1: '25-34 tahun', S2: 'Wanita' };
ctx.submitResponse({ sid: 'asli1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@asli', Z3: '081211110001' }) });
ctx.submitResponse({ sid: 'asli2', variant: 'v1', answers: Object.assign({}, base, { Z2: '@asal', Z3: '081211110002', QC1: 'Merah' }) });
const snap = () => JSON.stringify(Object.fromEntries(Object.entries(sheets).filter(([k]) => /^(Jawaban|Panel|Daftar Blokir|Pemenang)/.test(k)).map(([k, v]) => [k, v.d.filter(r => r.some(x => x !== '' && x != null)).length])));
const stok0 = JSON.stringify(ctx.adminKatalog().katalog.map(x => x.stok)); const before = snap(); console.log('awal', before);
let t = Date.now(), st = ctx.adminSimulasiMulai(), steps = 0;
while (!st.selesai && steps < 40) { st = ctx.adminSimulasiBatch(); steps++; }
console.log('selesai', st, steps, 'langkah', ((Date.now() - t) / 1000).toFixed(1) + 'd');
console.log('setelah isi', snap());
const sum = ctx.adminSummary(); console.log(sum.surveys.map(s => s.name + ' ' + s.valid + '/' + s.total).join(' | '), '| orang', sum.people);
const el = ctx.adminEligible('all'); console.log('eligible', el.count, 'kupon', el.stats.kupon, 'blokir', el.stats.diblokir);
assert.throws(() => ctx.adminDraw('all', 'X', 1), /simulasi/);
const T = sheets['Jawaban - Semua Kategori'], H = T.d[0]; const r = T.d[T.d.length - 1];
console.log('contoh baris:', ['session_id', 'status', 'S1', 'S2', 'A1', 'provinsi', 'A4M', 'A4N', 'A5', 'C1', 'L1_PT1', 'L1_AW5', 'ses', 'generasi', 'S4', 'B2'].map(k => k + '=' + r[H.indexOf(k)]).join(' · '));
const ct = ctx.adminCrosstab('all', 'Valid'); console.log('crosstab gabungan n', ct.meta.n, 'pertanyaan', ct.qs.length);
const ins = ctx.CT_LIB.insights(ct.qs, ct.data, { banners: ct.banners }); console.log('temuan:', ins.slice(0, 3).map(x => x.title).join(' || '));
const pc = ctx.adminPanelSearch([{ col: 'jenis_kelamin', op: 'adalah', val: ['Wanita'] }]); console.log('panel wanita', pc.rows.length);
const h = ctx.adminSimulasiHapus(); console.log('hapus', JSON.stringify(h));
ctx.MEMO_ = null; const stok1 = JSON.stringify(ctx.adminKatalog().katalog.map(x => x.stok)); console.log('stok', stok0, stok1); assert.strictEqual(stok1, stok0); const after = snap(); console.log('akhir', after); assert.strictEqual(after, before);
assert.strictEqual(ctx.adminSimulasiStatus().ada, false); assert(!ctx.adminSummary().surveys.some(s => /Simulasi/.test(s.name)));
console.log('OK simlive_test');
