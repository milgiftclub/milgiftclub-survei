// Uji: 1 survei valid = 1 kupon per periode, undian berbobot, cek status menampilkan kupon & survei lain
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
const sub = (sid, v, ig, wa, extra) => ctx.submitResponse({ sid, variant: v, answers: Object.assign({}, base, { Z2: ig, Z3: wa }, extra || {}) });
sub('a1', 'v1', '@ani', '081211110001'); sub('a2', 'v2', '@ani', '081211110001'); sub('a3', 'v1', '@ani', '081211110001');   // a3 duplikat
sub('b1', 'v1', '@budi', '081211110002');
const e = ctx.adminEligible('all'); console.log('stats', JSON.stringify(e.stats), e.rows.map(r => r[1] + ':' + r[4]).join(','));
assert.strictEqual(e.stats.kupon, 3); assert.strictEqual(e.count, 2);
assert.strictEqual(e.rows.find(r => r[1] === '@ani')[4], 2);
const g = ctx.giveawayStatus('@budi'); console.log('budi kupon', g.kupon, 'lain:', JSON.stringify(g.surveiLain));
assert.strictEqual(g.kupon, 1); assert(g.surveiLain.some(x => /Fashion/.test(x.name)));
const ga = ctx.giveawayStatus('ani'); assert.strictEqual(ga.kupon, 2); assert(!ga.surveiLain.some(x => /Fashion|Semua/.test(x.name)));
// bobot: simulasi banyak undian di salinan pool
let win = { ani: 0, budi: 0 };
for (let t = 0; t < 400; t++) {
  const env = makeEnv(); const c = env.ctx; c.setup();
  const s2 = (sid, v, ig, wa) => c.submitResponse({ sid, variant: v, answers: Object.assign({}, base, { Z2: ig, Z3: wa }) });
  s2('a1', 'v1', '@ani', '081211110001'); s2('a2', 'v2', '@ani', '081211110001'); s2('b1', 'v1', '@budi', '081211110002');
  win[c.adminDraw('all', 'X', 1)[0].ig.replace('@', '')]++;
}
console.log('menang dari 400 undian:', JSON.stringify(win)); assert(win.ani > win.budi * 1.4, 'bobot kupon');
const w2 = ctx.adminDraw('all', 'AirPods', 2); assert.strictEqual(w2.length, 2); assert.strictEqual(new Set(w2.map(x => x.wa)).size, 2);
console.log('OK kupon_test');
