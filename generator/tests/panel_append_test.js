// Uji: snapshot lama (tanpa data Panel) -> buka Panel sekali menambahkan data Panel ke snapshot; berikutnya dari snapshot
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
let st = ctx.adminSimulasiMulai(), n = 0; while (!st.selesai && n++ < 60) st = ctx.adminSimulasiBatch();
ctx.snapBuild_();
const S = sheets['_Snapshot']; S.d = S.d.filter(r => r[0] !== 'panel' && r[0] !== 'pcols'); ctx.SNAP_MEMO_ = null;
assert(!ctx.snapRead_().idx.panel);
let t = Date.now(); const a = ctx.adminPanelData(); console.log('pertama (baca Sheet):', Date.now() - t, 'ms');
ctx.SNAP_MEMO_ = null; assert(ctx.snapRead_().idx.panel && ctx.snapRead_().idx.pcols);
t = Date.now(); const b = ctx.adminPanelData(); console.log('kedua (snapshot):', Date.now() - t, 'ms');
assert.strictEqual(a.packed, b.packed); assert.strictEqual(JSON.stringify(a.pcols), JSON.stringify(b.pcols));
assert.strictEqual(ctx.adminSummary().fromSnap, true);
console.log('OK panel_append_test');
