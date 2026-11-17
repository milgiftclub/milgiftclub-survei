// Uji tugas sekali jalan (trigger): hapus semua survei buatan Dashboard; 2 survei utama tetap; survei yang sudah ada jawaban diarsipkan (data tetap)
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const mk = n => ctx.adminBuilderSave({ name: n, target: 300, questions: [{ text: 'x?', type: 'single', options: [{ t: 'a' }, { t: 'b' }] }] }, true);
const a = mk('Survei Gaya Berpenampilan'), b = mk('Survei Live Shopping'); mk('Survei Promosi & Diskon'); ctx.adminBuilderSave({ name: 'Survei Konten & Hook Video', questions: [{ text: 'y?', type: 'text' }] }, false);
ctx.submitResponse({ sid: 's1', variant: a.id, durasi: 300, answers: { O1: 'Ya, saya setuju dan bersedia mengikuti survei', Q1: 'a', Z2: '@ani', Z3: '081211110001', QC1: 'Biru' } });
const names = () => { ctx.CUSTOM_MEMO_ = null; ctx.MEMO_ = null; return ctx.surveyList_().map(x => x.name + '[' + x.status + ']').join(' | '); };
console.log('sebelum:', names());
global.__viewer = ''; ctx.autoSnapshot(); global.__viewer = 'robert@mildigital.id';

const t = ctx.adminTugasStatus()['2026-11-11-hapus-survei-tambahan']; console.log('hasil tugas:', JSON.stringify(t.hasil));
assert(t.ok);
const tab = Object.values(sheets).find(s => /Gaya Berpenampilan/.test(s.name)); console.log('jawaban survei Gaya tetap ada di Sheet:', tab ? tab.d.length - 1 : 0); assert(tab && tab.d.length === 2);
// tugas 2026-11-17 (dijalankan pada trigger yang sama karena berurutan): survei dikembalikan
const st = ctx.adminTugasStatus(); console.log('kembalikan:', JSON.stringify(st['2026-11-17-kembalikan-survei'] && st['2026-11-17-kembalikan-survei'].hasil));
console.log('akhir:', names());
const L = ctx.surveyList_(); assert.strictEqual(L.length, 6);
const g = L.find(x => /Gaya/.test(x.name)); assert.strictEqual(g.status, 'Dibuka');
assert.strictEqual(L.find(x => /Konten/.test(x.name)).status, 'Draf');
assert.strictEqual(tab.d.length, 2);
ctx.autoSnapshot(); assert.strictEqual(ctx.surveyList_().length, 6);
console.log('OK tugas_test');
