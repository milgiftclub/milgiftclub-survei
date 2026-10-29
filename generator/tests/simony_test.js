// Uji: simulasi survei contoh Onycha vs Zara (10.000) di atas simulasi 20rb, cabang konsisten, lalu hapus bersih
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const cnt = () => JSON.stringify(Object.fromEntries(Object.entries(sheets).filter(([k]) => /^(Jawaban|Panel|Daftar Blokir|Daftar Survei)/.test(k)).map(([k, v]) => [k, v.d.filter(r => r.some(x => x !== '' && x != null)).length])));
const before = cnt();
let st, n = 0, t = Date.now();
if (!process.env.ONLY) { st = ctx.adminSimulasiMulai(); while (!st.selesai && n++ < 60) st = ctx.adminSimulasiBatch(); console.log('20rb selesai', st.done); }
st = ctx.adminSimulasiOnycha(); console.log('mulai onycha', JSON.stringify(st));
while (!st.selesai && n++ < 80) st = ctx.adminSimulasiBatch();
console.log('selesai', st.done, '/', st.total, ((Date.now() - t) / 1000).toFixed(1) + 'd');
const sum = ctx.adminSummary(); console.log(sum.surveys.map(s => s.name + ' [' + s.status + '] ' + s.valid + '/' + s.total).join(' | '));
const sv = sum.surveys.find(s => /Onycha/.test(s.name)); assert(sv && sv.total === 10000 && sv.status === 'Ditutup');
const T = Object.values(sheets).find(s => /Onycha/.test(s.name)), H = T.d[0], rows = T.d.slice(1), col = k => rows.map(r => r[H.indexOf(k)]);
const has = (v, x) => String(v).split(/\s*[,|;]\s*/).indexOf(x) >= 0 || String(v).indexOf(x) >= 0;
let bad = 0; rows.forEach(r => { const k = r[H.indexOf('Q7')], b = r[H.indexOf('Q8')]; if (!!r[H.indexOf('Q10')] !== has(k, 'Zara')) bad++; if (!!r[H.indexOf('Q19')] !== has(k, 'Onycha')) bad++; if (!!r[H.indexOf('Q25')] === has(b, 'Onycha')) bad++; if (!!r[H.indexOf('Q44')] !== has(k, 'Onycha')) bad++; });
console.log('pelanggaran cabang:', bad); assert.strictEqual(bad, 0);
const tally = k => { const m = {}; col(k).forEach(v => String(v).split(/\s*\|\s*/).filter(Boolean).forEach(x => m[x] = (m[x] || 0) + 1)); return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([a, b]) => a + ':' + b).join(' ') };
['S2', 'Q7', 'Q8', 'Q28', 'Q30', 'Q41'].forEach(k => console.log(k, tally(k)));
const mean = k => { const v = col(k).filter(x => x !== '').map(Number); return (v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) + ' (n' + v.length + ')'; };
console.log('Zara  bahan/desain/harga:', mean('Q10'), mean('Q12'), mean('Q13'), '| Onycha bahan/desain/harga:', mean('Q19'), mean('Q21'), mean('Q22'), '| NPS', mean('Q44'));
const ct = ctx.adminCrosstab(sv.v, 'Valid'); console.log('crosstab n', ct.meta.n, 'q', ct.qs.length);
const story = ctx.CT_LIB.story(ct.qs, ct.data, { banners: ct.banners });
console.log('kesimpulan:', (story.kesimpulan || []).join(' || ').slice(0,1500));
(story.groups || []).forEach(g => console.log('GRUP', g.name + ' :: ' + g.ringkasan + ' :: ' + g.poin.slice(0,3).map(p=>p.text).join(' / ')));
const h = ctx.adminSimulasiHapus(); console.log('hapus', JSON.stringify(h)); const after = cnt(); console.log(before, after);
assert.strictEqual(ctx.adminSimulasiStatus().ada, false); assert(!ctx.adminSummary().surveys.some(s => /Simulasi/.test(s.name)));
console.log('OK simony_test');
