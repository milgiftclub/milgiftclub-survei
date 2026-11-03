// Uji: tugas sekali jalan (trigger) -> data & survei simulasi terhapus, 4 survei baru dibuat sekali saja; data asli utuh
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Ya, bersedia', S1: '25-34 tahun', S2: 'Wanita' };
ctx.submitResponse({ sid: 'asli1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@asli', Z3: '081211110001' }) });
let st = ctx.adminSimulasiMulai(), n = 0; while (!st.selesai && n++ < 60) st = ctx.adminSimulasiBatch();
st = ctx.adminSimulasiOnycha(); while (!st.selesai && n++ < 80) st = ctx.adminSimulasiBatch();
const lv = ctx.adminBuilderSave({ name: 'Survei Fashion: Brand Lokal vs Internasional', questions: [{ text: 'x?', type: 'single', options: [{ t: 'a' }, { t: 'b' }] }] }, false);
ctx.snapBuild_();
const names = () => { ctx.CUSTOM_MEMO_ = null; ctx.MEMO_ = null; return ctx.surveyList_().map(x => x.name + '[' + x.status + ']').join(' | '); };
console.log('sebelum:', names());
global.__viewer = '';   // trigger: tanpa pengguna aktif
ctx.autoSnapshot();
global.__viewer = 'robert@mildigital.id';
console.log('sesudah:', names());
const t = ctx.adminTugasStatus(); console.log(JSON.stringify(t).slice(0, 600));
assert(Object.values(t).every(x => x.ok));
const rows = Object.entries(sheets).filter(([k]) => /^Jawaban/.test(k)).map(([k, v]) => [k, v.d.slice(1).filter(r => r.some(x => x !== '' && x != null)).length]);
console.log('baris jawaban:', JSON.stringify(rows));
assert(!/Simulasi|Brand Lokal/.test(names())); assert(/Gaya Berpenampilan\[Dibuka\]/.test(names())); assert(/Konten & Hook Video\[Draf\]/.test(names()));
ctx.autoSnapshot(); assert.strictEqual(ctx.surveyList_().length, names().split(' | ').length);
const cnt = ctx.surveyList_().filter(x => /Live Shopping/.test(x.name)).length; assert.strictEqual(cnt, 1);
// survei baru langsung bisa diisi lewat API publik
const live = ctx.surveyList_().find(x => /Live Shopping/.test(x.name)); const hub = JSON.parse(ctx.webApi('hubList', ['@baru'])); console.log('hub:', JSON.stringify(hub).match(/"name":"[^"]+"/g).join(' '));
console.log('OK tugas_test');
