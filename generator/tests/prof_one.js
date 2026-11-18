process.env.MOCK_CACHE = '1';
const { makeEnv } = require('./gsmock'); const { instrument } = require('./prof_lib'); const { ctx, sheets } = makeEnv(); ctx.setup();
global.__owner = 'admin@mildigital.id'; global.__viewer = 'admin@mildigital.id';
let s = ctx.adminSimulasiMulai(); while (!s.selesai) s = ctx.adminSimulasiBatch(); ctx.snapBuild_();
const I = instrument(ctx, sheets);
const R = Object.getPrototypeOf(Object.values(sheets)[0].getRange(1, 1)); const gv = R.getValues; let big = [];
R.getValues = function () { if (this.nr * this.nc > 20000) big.push(this.s.name + ' ' + this.nr + 'x' + this.nc); return gv.call(this); };
const calls = (process.argv[2] || 'adminKatalog,adminPeople,adminResponses:all,adminPeriods,adminEligible:all,adminKuponRekap,adminBlokList,adminSummary').split(',');
for (const c of calls) { const [fn, a] = c.split(':'); big = []; ctx.MEMO_ = null; ctx.CUSTOM_MEMO_ = null; ctx.SET_MEMO_ = null;
  const [r, m] = I.measure(() => ctx[fn](...(a ? [a] : []))); console.log(fn.padEnd(18), 'model', String(m.model).padStart(6), 'cpu', String(m.cpu).padStart(5), 'KB', Math.round(JSON.stringify(r).length / 1024), '| besar:', big.join(', ')); }
