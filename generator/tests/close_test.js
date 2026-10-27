// Uji: tanggal tutup otomatis & periode giveaway (survei utama + survei buatan Dashboard)
const { makeEnv } = require('./gsmock'); const assert = require('assert');
const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const fmt = (d) => new Date(d.getTime() + 7 * 3600e3).toISOString().slice(0, 16);
assert.strictEqual(ctx.fmtTutup_('2026-12-31T23:59'), '31 Desember 2026');
assert.strictEqual(ctx.fmtTutup_('2026-11-05T17:00'), '5 November 2026, 17.00 WIB');
assert.strictEqual(ctx.isOpen_('v1'), true, 'v1 buka (tutup 31 Des)');
let pc = ctx.publicConfig_('v1', ''); assert.strictEqual(pc.periode, 'Hingga 31 Desember 2026'); assert.strictEqual(pc.periodeLabel, 'Survei MIL Gift Club · Periode 1 2026');
// ganti periode & tanggal tutup lewat Dashboard
ctx.adminSaveSettings({ PERIODE_KE: 2, PERIODE_TAHUN: 2027, TUTUP_V1: '2027-06-30T23:59' });
pc = ctx.publicConfig_('v1', ''); assert.strictEqual(pc.periodeLabel, 'Survei MIL Gift Club · Periode 2 2027'); assert.strictEqual(pc.periode, 'Hingga 30 Juni 2027');
const pg = ctx.doGet({ parameter: { survei: 'v1' }, queryString: 'survei=v1' }); assert(/Periode 2 2027/.test(pg.vars.ovr) && /30 Juni 2027/.test(pg.vars.ovr), 'override halaman');
// lewat tanggal -> tertutup
ctx.adminSaveSettings({ TUTUP_V2: fmt(new Date(Date.now() - 60e3)) });
assert.strictEqual(ctx.isOpen_('v2'), false, 'v2 tertutup otomatis');
const sv = ctx.surveyList_().find(s => s.v === 'v2'); assert(sv.tutupLewat && !sv.open && sv.switchOn);
// survei Dashboard
const r = ctx.adminBuilderSave({ name: 'Uji Tutup', target: 50, periodeKe: 3, tahun: 2026, tutup: fmt(new Date(Date.now() + 3600e3)), questions: [{ id: 'Q1', text: 'A?', type: 'single', options: [{ t: 'Ya' }, { t: 'Tidak' }] }] }, true);
let g = ctx.getSurvey(r.id); assert(g.open && /^Hingga /.test(g.schema.periode) && g.schema.periodeLabel === 'Survei MIL Gift Club · Periode 3 2026', JSON.stringify(g.schema.periodeLabel));
ctx.adminBuilderSave(Object.assign({}, ctx.adminBuilderGet(r.id).schema, { id: r.id, tutup: fmt(new Date(Date.now() - 60e3)) }), true); ctx.CUSTOM_MEMO_ = null;
g = ctx.getSurvey(r.id); assert.strictEqual(g.open, false, 'survei Dashboard tertutup otomatis');
assert.strictEqual(ctx.surveyList_().find(s => s.v === r.id).status, 'Ditutup');
console.log('OK close_test');
