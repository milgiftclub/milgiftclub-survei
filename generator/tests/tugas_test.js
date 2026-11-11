// Uji tugas sekali jalan (trigger): hapus semua survei buatan Dashboard; 2 survei utama tetap; survei yang sudah ada jawaban diarsipkan (data tetap)
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const mk = n => ctx.adminBuilderSave({ name: n, target: 300, questions: [{ text: 'x?', type: 'single', options: [{ t: 'a' }, { t: 'b' }] }] }, true);
const a = mk('Survei Gaya Berpenampilan'), b = mk('Survei Live Shopping'); mk('Survei Promosi & Diskon'); ctx.adminBuilderSave({ name: 'Survei Konten & Hook Video', questions: [{ text: 'y?', type: 'text' }] }, false);
ctx.submitResponse({ sid: 's1', variant: a.id, durasi: 300, answers: { O1: 'Ya, saya setuju dan bersedia mengikuti survei', Q1: 'a', Z2: '@ani', Z3: '081211110001', QC1: 'Biru' } });
const names = () => { ctx.CUSTOM_MEMO_ = null; ctx.MEMO_ = null; return ctx.surveyList_().map(x => x.name + '[' + x.status + ']').join(' | '); };
console.log('sebelum:', names());
global.__viewer = ''; ctx.autoSnapshot(); global.__viewer = 'robert@mildigital.id';
console.log('sesudah:', names());
const t = ctx.adminTugasStatus()['2026-11-11-hapus-survei-tambahan']; console.log('hasil tugas:', JSON.stringify(t.hasil));
assert(t.ok); assert.strictEqual(ctx.surveyList_().length, 2);
const tab = Object.values(sheets).find(s => /Gaya Berpenampilan/.test(s.name)); console.log('jawaban survei Gaya tetap ada di Sheet:', tab ? tab.d.length - 1 : 0); assert(tab && tab.d.length === 2);
const hub = ctx.hubList('@baru'); console.log('halaman depan:', (hub.surveys || hub.list || []).map(x => x.name).join(' | '));
ctx.autoSnapshot(); assert.strictEqual(ctx.surveyList_().length, 2);
console.log('OK tugas_test');
