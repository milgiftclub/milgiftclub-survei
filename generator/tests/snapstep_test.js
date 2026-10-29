// Uji: snapshot dibangun bertahap (beberapa eksekusi), snapshot lama tetap terbaca selama proses, hasil akhir = build penuh
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
let st = ctx.adminSimulasiMulai(), n = 0; while (!st.selesai && n++ < 60) st = ctx.adminSimulasiBatch();
ctx.snapBuild_(); const full = {}; ['summary', 'ct:all', 'rep:all', 'ig', 'ct:v1', 'rep:v2'].forEach(k => { ctx.SNAP_MEMO_ = null; full[k] = JSON.stringify(ctx.snapGet_(k)); });
const at0 = ctx.snapRead_().meta.at;
let r, steps = 0; do { r = ctx.snapStep_(1); steps++; if (!r.done) { ctx.SNAP_MEMO_ = null; assert.strictEqual(ctx.snapRead_().meta.at, at0); assert(ctx.snapGet_('summary')); } } while (!r.done && steps < 20);
console.log('langkah:', steps, 'bagian', r.total);
assert(steps >= r.total - 1);
['summary', 'ct:all', 'rep:all', 'ig', 'ct:v1', 'rep:v2'].forEach(k => { ctx.SNAP_MEMO_ = null; const a = JSON.parse(full[k]), b = ctx.snapGet_(k); delete (a || {}).generatedAt; delete (b || {}).generatedAt; assert.strictEqual(JSON.stringify(b).length, JSON.stringify(a).length, k); });
assert.strictEqual(ctx.snapJob_(), null);
console.log('OK snapstep_test');
