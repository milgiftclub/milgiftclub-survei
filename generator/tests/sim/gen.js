// Simulasi: N jawaban palsu (isi acak dengan sedikit pola) ke lingkungan mock Apps Script
const fs = require('fs'), path = require('path');
const { makeEnv } = require('../gsmock');
const N = +(process.env.N || 20000), SEED = 7;
let s = SEED; const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };   // mulberry32
const pick = a => a[Math.floor(rnd() * a.length)];
const wpick = (a, w) => { let t = w.reduce((x, y) => x + y, 0), r = rnd() * t; for (let i = 0; i < a.length; i++) { r -= w[i]; if (r <= 0) return a[i]; } return a[a.length - 1]; };
const src = fs.readFileSync(path.join(__dirname, '../../survey_out/Index.html'), 'utf8');
const SCH = JSON.parse(src.match(/var SCHEMAS = (\{.*?\});\nvar VARIANT/s)[1]);
const CITIES = JSON.parse(fs.readFileSync(path.join(__dirname, '../../cities.json'), 'utf8'));
const opts = q => (q.options || []).map(o => o.t).filter(Boolean);
// bobot acak per pertanyaan supaya sebaran tidak rata (lebih mirip data asli)
const W = {}; const wOf = (id, n) => (W[id + n] = W[id + n] || Array.from({ length: n }, (_, i) => Math.pow(rnd() + 0.15, 2.2) * (1 / (1 + i * 0.25))));
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const cs = ctx.adminBuilderSave({ name: 'Survei Skincare', target: 3000, questions: [
  { id: 'Q1', text: 'Merek skincare apa yang paling sering Anda pakai?', type: 'single', options: ['Wardah', 'Skintific', 'Somethinc', 'Emina', 'Azarine', 'Scarlett', 'The Originote', 'Lainnya'].map(t => ({ t })) },
  { id: 'Q2', text: 'Di mana Anda biasanya membeli skincare?', type: 'multi', options: ['Shopee', 'TikTok Shop', 'Tokopedia', 'Watsons / Guardian', 'Minimarket', 'Official store brand'].map(t => ({ t })) },
  { id: 'Q3', text: 'Berapa pengeluaran skincare per bulan?', type: 'single', options: ['< Rp100rb', 'Rp100–250rb', 'Rp250–500rb', '> Rp500rb'].map(t => ({ t })) }] }, true);
ctx.adminBuilderStatus(cs.id, 'Dibuka');
// orang: profil tetap per orang
const P = Array.from({ length: Math.round(N * 0.7) }, (_, i) => {
  const yr = String(wpick([2006, 2003, 2000, 1997, 1994, 1990, 1986, 1980, 1974, 1965].map(String), [3, 10, 14, 14, 12, 10, 8, 6, 3, 2]));
  return { wa: '0812' + String(10000000 + i), ig: '@sim' + i, S2: rnd() < 0.62 ? 'Wanita' : 'Pria', S0: String(+yr - Math.floor(rnd() * 3)), city: pick(CITIES) };
});
const ageBand = y => { const a = 2026 - +y; return a < 18 ? 'Di bawah 18 tahun' : a < 25 ? '18-24 tahun' : a < 35 ? '25-34 tahun' : a < 45 ? '35-44 tahun' : a < 55 ? '45-54 tahun' : '55 tahun ke atas'; };
function answers(v, p) {
  const a = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', Z2: p.ig, Z3: p.wa, S0: p.S0, S0B: 'Ya', S1: ageBand(p.S0), S2: p.S2, A1: p.city[0] };
  const young = 2026 - +p.S0 < 30;
  for (const q of SCH[v]) {
    if (a[q.id] != null || ['O1', 'Z2', 'Z3', 'PV', 'PR', 'Z5', 'QC1', 'Z1'].includes(q.id)) continue;
    let o = opts(q);
    if (q.pipe === 'S4' || q.pipeCols === 'MKT') o = [].concat(a.S4 || []);
    if (q.pipe === 'PROD') o = (q.byCat[a.C1] || []).map(x => x.t);
    if (q.pipe === 'GRP') o = (q.generic || []).map(x => x.t);
    if (q.type === 'city' || q.type === 'info') continue;
    if (q.type === 'oa') { if (q.id === 'PTB') a[q.id] = pick(['Erigo', 'Wardah', 'Uniqlo', 'Zoya', 'Skintific', 'Xiaomi', 'Samsung', 'Ms Glow', 'Rabbani', 'Lainnya']); else if (/^AW5[KC]$/.test(q.id)) a[q.id] = pick(['rekomendasi', 'murah', 'review', 'tutorial']); continue; }
    if (q.type === 'nps') { a[q.id] = String(Math.min(10, Math.floor(rnd() * 6) + 5 + (rnd() < 0.3 ? 1 : 0))); continue; }
    if (q.type === 'matrix_sa') { const cols = o.length ? o : ['Tidak ada']; (q.rows || []).forEach(r => { a[q.id + ': ' + r] = pick(cols); }); continue; }
    if (!o.length) continue;
    const w = wOf(q.id, o.length).slice();
    if (q.id === 'S4' || q.pipe === 'S4') o.forEach((x, i) => { if (/TikTok/.test(x)) w[i] *= young ? 3 : 0.7; });            // pola: anak muda lebih banyak TikTok Shop
    if (q.id === 'C1') o.forEach((x, i) => { if (/wanita|muslim|Kecantikan|Skincare|Makeup/i.test(x)) w[i] *= p.S2 === 'Wanita' ? 3 : 0.2; if (/pria/i.test(x)) w[i] *= p.S2 === 'Pria' ? 4 : 0.1; });
    if (q.id === 'S2') continue;
    if (q.type === 'ma') { const k = Math.min(o.length, q.max || 3, 1 + Math.floor(rnd() * 3)), set = new Set(); while (set.size < k) set.add(wpick(o, w)); a[q.id] = [...set]; }
    else a[q.id] = wpick(o, w);
  }
  if (v === 'v2' && !a.SC1) a.SC1 = 'Ya';
  a.QC1 = rnd() < 0.96 ? 'Biru' : pick(['Merah', 'Hijau', 'Kuning']);
  a.Z1 = rnd() < 0.55 ? 'Ya, bersedia' : 'Tidak';
  return a;
}
const t0 = Date.now(), start = new Date('2026-10-01T08:00:00+07:00').getTime(), span = new Date('2026-10-28T16:00:00+07:00').getTime() - start;
const done = { v1: new Set(), v2: new Set(), [cs.id]: new Set() };
const plan = []; for (let i = 0; i < N; i++) { const r = rnd(); plan.push(r < 0.6 ? 'v1' : r < 0.85 ? 'v2' : cs.id); }
let n = 0, tsList = [];
for (const v of plan) {
  let p, tries = 0; do { p = pick(P); tries++; } while ((done[v].has(p.wa) || (v === 'v2' && p.S2 !== 'Wanita')) && tries < 400);
  if (tries >= 400) continue; done[v].add(p.wa);
  const a = v === cs.id ? Object.assign(answers('v1', p), { Q1: pick(['Wardah', 'Skintific', 'Somethinc', 'Emina', 'Azarine', 'Scarlett', 'The Originote', 'Lainnya']), Q2: [pick(['Shopee', 'TikTok Shop', 'Tokopedia']), pick(['Watsons / Guardian', 'Minimarket', 'Official store brand'])], Q3: pick(['< Rp100rb', 'Rp100–250rb', 'Rp250–500rb', '> Rp500rb']) }) : answers(v, p);
  const dur = rnd() < 0.03 ? 60 + Math.floor(rnd() * 60) : Math.round(240 + Math.pow(rnd(), 0.7) * 600);
  ctx.submitResponse({ sid: 'sim' + n, variant: v, durasi: dur, src: wpick(['ig_story', 'linktree', 'ig_bio', 'langsung', 'wa'], [5, 3, 2, 2, 1]), cats: a.C1 ? [a.C1] : [], answers: a });
  const tab = Object.values(sheets).find(sh => sh.name === ctx.respTab_(v)); const T = tab.d; const ts = new Date(start + Math.pow(rnd(), 0.8) * span); T[T.length - 1][0] = ts;
  n++; if (n % 2000 === 0) console.log(n, 'jawaban,', ((Date.now() - t0) / 1000).toFixed(0) + 'd');
}
console.log('selesai', n, 'jawaban dalam', ((Date.now() - t0) / 1000).toFixed(0), 'detik'); ctx.markSpeeders(true);
fs.writeFileSync(path.join(__dirname, 'sim_state.json'), JSON.stringify({ sheets: Object.fromEntries(Object.entries(sheets).map(([k, v]) => [k, v.d])), props: null, customId: cs.id }));
