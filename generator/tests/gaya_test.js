// Uji: tugas memperluas survei Gaya Berpenampilan yang sudah punya jawaban -> id baru G.., jawaban lama utuh, jawaban baru tersimpan
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const old = ctx.adminBuilderSave({ name: 'Survei Gaya Berpenampilan', target: 300, profile: false, questions: [{ text: 'Gaya?', type: 'single', options: [{ t: 'Kasual' }, { t: 'Klasik' }] }] }, true);
const T = () => Object.values(sheets).find(s => /Gaya Berpenampilan/.test(s.name));
ctx.submitResponse({ sid: 's-lama', variant: old.id, durasi: 300, answers: { O1: 'Ya, saya setuju dan bersedia mengikuti survei', Q1: 'Kasual', Z2: '@lama', Z3: '081277770001', QC1: 'Biru' } });
console.log('baris lama:', T() ? T().d.length - 1 : 'tab?', T() && T().d[0].join(',').slice(0, 200));
ctx.tugasSekali_();
ctx.CUSTOM_MEMO_ = null; const c = ctx.customById_(old.id);
console.log('status', c.status, '| jml pertanyaan', c.schema.questions.length, '| id', c.schema.questions.slice(0, 6).map(q => q.id).join(','), '| teks Q10:', c.schema.questions[9].text);
console.log('tugas:', JSON.stringify(ctx.adminTugasStatus()['2026-11-04-gaya-penampilan-merek']));
assert.strictEqual(c.status, 'Dibuka');
ctx.submitResponse({ sid: 's-baru', variant: old.id, durasi: 600, answers: { O1: 'Ya, saya setuju dan bersedia mengikuti survei', G1: 'Klasik & elegan', G4: ['Kerja / kantor'], G9: 'Onycha', G10: ['Terlihat profesional / rapi'], Z2: '@baru', Z3: '081277770002', QC1: 'Biru' } });
const t = T(), H = t.d[0]; console.log('header punya Q1 & G9:', H.indexOf('Q1') >= 0, H.indexOf('G9') >= 0);
const rows = t.d.slice(1).map(r => [r[H.indexOf('ig_normal')], r[H.indexOf('Q1')], r[H.indexOf('G9')], r[H.indexOf('G10')]].join(' / ')); console.log(rows.join(' || '));
assert(H.indexOf('G9') >= 0 && t.d.length === 3);
console.log('OK gaya_test');
