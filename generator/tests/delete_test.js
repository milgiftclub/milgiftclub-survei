// Uji: hapus data uji coba dari Dashboard (dengan arsip), definisi survei tetap ada
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Ya, bersedia', S1: '25-34 tahun', S2: 'Wanita' };
const r = ctx.adminBuilderSave({ name: 'Survei Tes Hapus', target: 50, questions: [{ id: 'Q1', text: 'A?', type: 'single', options: [{ t: 'Ya' }, { t: 'Tidak' }] }] }, true);
const sub = (sid, v, ig, wa) => ctx.submitResponse({ sid, variant: v, answers: Object.assign({}, base, { Z2: ig, Z3: wa, Q1: 'Ya' }) });
sub('a1', 'v1', '@a', '081211110001'); sub('a2', 'v1', '@b', '081211110002'); sub('a3', 'v2', '@c', '081211110003'); sub('a4', r.id, '@d', '081211110004');
ctx.logScreenout({ sid: 'x1', reason: 'Usia di bawah 18 tahun', variant: 'v1', answers: {} }); ctx.logScreenout({ sid: 'x2', reason: 'Menolak', variant: r.id, answers: {} });
const tab = ctx.customById_(r.id).tab, n = (t) => sheets[t].d.filter((row, i) => i && row.some(x => x !== '' && x != null)).length;
assert.strictEqual(n('Jawaban - Semua Kategori'), 2); assert.strictEqual(n(tab), 1); assert(n('Panel') >= 4);
assert.throws(() => ctx.adminDeleteData({ surveys: ['v1'], konfirmasi: 'hapus dong' }), /HAPUS/);
// 1) hapus hanya v1 + screenout v1
let o = ctx.adminDeleteData({ surveys: ['v1'], screenout: true, konfirmasi: 'HAPUS' });
assert.strictEqual(n('Jawaban - Semua Kategori'), 0); assert.strictEqual(n('Jawaban - Fashion Tas Hijab'), 1); assert.strictEqual(n(tab), 1);
assert.strictEqual(n('Screenout'), 1, 'screenout survei lain tetap');
const arsip = Object.keys(sheets).filter(k => /^Arsip /.test(k)); assert(arsip.length >= 2 && sheets[arsip[0]].hidden, 'arsip tersembunyi');
assert.strictEqual(sheets[arsip.find(k => /Semua Kategori/.test(k))].d.length, 3, 'arsip berisi header + 2 baris');
// 2) hapus semua + panel, tanpa arsip
ctx.adminDeleteData({ surveys: 'all', screenout: true, panel: true, blok: true, undian: true, arsip: false, konfirmasi: 'hapus' });
assert.strictEqual(n('Jawaban - Fashion Tas Hijab'), 0); assert.strictEqual(n(tab), 0); assert.strictEqual(n('Screenout'), 0); assert.strictEqual(n('Panel'), 0);
assert(ctx.customById_(r.id), 'definisi survei tetap ada'); ctx.CUSTOM_MEMO_ = null;
// header tetap, survei bisa diisi lagi
sub('b1', 'v1', '@a', '081211110001'); assert.strictEqual(n('Jawaban - Semua Kategori'), 1);
assert.strictEqual(ctx.readAll_().filter(x => x.ig_normal === 'a').length, 1);
console.log('OK delete_test', o.surveys.map(s => s.tab + ':' + s.rows).join(','), arsip.length + ' arsip');
