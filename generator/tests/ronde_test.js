// Uji: refresh survei -> responden lama boleh isi lagi, ronde tercatat, kupon tetap 1 per survei per periode
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Ya, bersedia', S1: '25-34 tahun', S2: 'Wanita' };
const sub = (sid, v, ig, wa) => ctx.submitResponse({ sid, variant: v, answers: Object.assign({}, base, { Z2: ig, Z3: wa }) });
sub('a1', 'v1', '@ani', '081211110001');
assert.strictEqual(ctx.lookupIg('@ani', 'v1').state, 'sudah_isi');
sub('a2', 'v1', '@ani', '081211110001');
const T = sheets['Jawaban - Semua Kategori'].d, H = T[0], st = () => T.slice(1).map(r => r[H.indexOf('status')]);
assert.deepStrictEqual(st(), ['Valid', 'Duplikat']);
// pindahkan jawaban lama ke 1 menit lalu, lalu refresh
T[1][H.indexOf('timestamp')] = T[2][H.indexOf('timestamp')] = new Date(Date.now() - 60000);
const r = ctx.adminSurveyRefresh('v1', 'Kondisi pasar berubah'); ctx.SET_MEMO_ = null; console.log('refresh ->', JSON.stringify(r));
assert.strictEqual(r.ronde, 2);
assert.strictEqual(ctx.lookupIg('@ani', 'v1').state, 'ok', 'boleh isi lagi');
sub('a3', 'v1', '@ani', '081211110001'); sub('a4', 'v1', '@ani', '081211110001');
console.log('status:', st().join(', '));
assert.deepStrictEqual(st(), ['Valid', 'Duplikat', 'Valid', 'Duplikat']);
const rs = ctx.adminResponses('v1'); console.log('src:', JSON.stringify(rs.src.slice(0, 2)));
assert(rs.src[0][1].includes('ronde 2'));
const e = ctx.adminEligible('all'); console.log('kupon', e.stats.kupon); assert.strictEqual(e.stats.kupon, 1, '1 kupon per survei per periode');
const g = ctx.giveawayStatus('@ani'); console.log('cek:', g.kupon, JSON.stringify(g.surveys.map(x => x.name + ':' + x.kupon)));
assert.strictEqual(g.kupon, 1);
const s = ctx.adminSummary().surveys.find(x => x.v === 'v1'); assert.strictEqual(s.ronde, 2); assert.strictEqual(s.rondeInfo.catatan, 'Kondisi pasar berubah');
const panel = sheets['Panel'] || Object.values(sheets).find(x => x.d && x.d[0] && x.d[0].includes('riwayat_survei'));
console.log('riwayat panel:', panel.d[1][panel.d[0].indexOf('riwayat_survei')], '| jumlah:', panel.d[1][panel.d[0].indexOf('jumlah_survei')]);
const u = ctx.adminSurveyRefreshUndo('v1'); ctx.SET_MEMO_ = null; assert.strictEqual(u.ronde, 1);
assert.strictEqual(ctx.lookupIg('@ani', 'v1').state, 'sudah_isi');
console.log('OK ronde_test');
