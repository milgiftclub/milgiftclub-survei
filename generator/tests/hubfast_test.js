const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id'; ctx.adminSaveSettings({ KUPON_V1: 1, KUPON_V2: 1 }); ctx.SET_MEMO_ = null;
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
const sub = (sid, v, ig, wa) => ctx.submitResponse({ sid, variant: v, answers: Object.assign({}, base, { Z2: ig, Z3: wa }) });
sub('a1', 'v1', '@ani', '081211110001'); sub('b1', 'v1', '@budi', '081211110002');
ctx.snapBuild_(); ctx.SNAP_MEMO_ = null;
sub('a2', 'v2', '@ani', '081211110001');   // masuk setelah snapshot (ekor)
const h = ctx.hubList('@ani'); console.log(JSON.stringify(h.list.map(x => x.v + ':' + x.done)), 'kupon', h.kupon);
assert.strictEqual(JSON.stringify(h.list.map(x => x.done)), '[true,true]'); assert.strictEqual(h.kupon, 2);
assert.strictEqual(ctx.lookupIg('@ani', 'v2').state, 'sudah_isi'); assert.strictEqual(ctx.lookupIg('@budi', 'v2').state, 'ok'); assert.strictEqual(ctx.lookupIg('@budi', 'v2').known, true);
assert.strictEqual(ctx.lookupIg('@baru', 'v1').known, false);
console.log('OK hubfast_test');
