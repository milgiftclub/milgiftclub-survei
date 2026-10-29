const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita', C1: 'Fashion wanita' };
ctx.submitResponse({ sid: 'a1', variant: 'v2', cats: ['Fashion wanita'], answers: Object.assign({}, base, { Z2: '@ani', Z3: '081211110001' }) });
let r = ctx.lookupIg('@ani', 'v1'); console.log('lambat:', JSON.stringify(r)); assert.strictEqual(r.covered[0].kategori, 'Fashion wanita');
ctx.snapBuild_(); ctx.SNAP_MEMO_ = null;
r = ctx.lookupIg('@ani', 'v1'); console.log('snapshot:', JSON.stringify(r)); assert.strictEqual(r.covered[0].v, 'v2');
console.log('OK covered_test');
