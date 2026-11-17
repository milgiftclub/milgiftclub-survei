// Uji peran Dashboard: admin / survei (buat survei + baca) / baca (lihat saja)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'); const assert = require('assert');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup();
const SP = '/tmp/claude-0/-home-claude/50b0d3e0-1ee4-51c7-ac80-d59da6a08266/scratchpad/';
global.__owner = 'admin@mildigital.id';
const as = (e, f) => { global.__viewer = e; ctx.MEMO_ = null; try { return { ok: f() }; } catch (x) { return { err: x.message }; } };
let st = as('admin@mildigital.id', () => { let s = ctx.adminSimulasiMulai(); while (!s.selesai) s = ctx.adminSimulasiBatch(); ctx.snapBuild_(); return 1; });
// mode lama: semua akun domain = admin
assert.strictEqual(ctx.roleOf_('siapa@mildigital.id'), 'admin'); assert.strictEqual(ctx.roleOf_('orang@gmail.com'), '');
// Robert (pemilik) tambah akun
let r = as('admin@mildigital.id', () => ctx.adminAksesSimpan('desvan@mildigital.id', 'survei')); assert(r.ok, r.err);
r = as('admin@mildigital.id', () => ctx.adminAksesSimpan('marsha@mildigital.id', 'baca')); assert(r.ok, r.err);
console.log('daftar:', r.ok.list.map(x => x.email + ':' + x.peran).join(', '), '| modeLama', r.ok.modeLama);
assert.strictEqual(ctx.roleOf_('siapa@mildigital.id'), '', 'akun domain lain tidak lagi otomatis masuk');
assert.strictEqual(ctx.roleOf_('admin@mildigital.id'), 'admin');
// pemilik tidak bisa diturunkan; email jahat ditolak
assert(as('admin@mildigital.id', () => ctx.adminAksesSimpan('admin@mildigital.id', 'baca')).err);
assert(as('admin@mildigital.id', () => ctx.adminAksesSimpan('=HYPERLINK("x")@a.com', 'baca')).err);
const M = { summary: () => ctx.adminSummary(), report: () => ctx.adminReport('v1'), ct: () => ctx.adminCrosstab({ v: 'v1' }), panel: () => ctx.adminPanelData(), people: () => ctx.adminPeople({}), export: () => ctx.adminExport('v1'),
  builderSave: () => ctx.adminBuilderSave({ name: 'Uji ' + global.__viewer, target: 50, questions: [{ text: 'x?', type: 'single', options: [{ t: 'a' }, { t: 'b' }] }] }, false), panelSave: () => ctx.adminPanelSave('Panel ' + global.__viewer, [], null),
  settings: () => ctx.adminSettings(), saveSettings: () => ctx.adminSaveSettings({ KIRIM_HARI_KERJA: 10 }), tukar: () => ctx.adminKatalog(), blok: () => ctx.adminBlokList(), del: () => ctx.adminDeleteResponses({ v: 'v1', sv: 'v1', mode: 'one', sid: 'zzz' }), akses: () => ctx.adminAkses() };
const expect = { 'admin@mildigital.id': 'all', 'desvan@mildigital.id': ['summary', 'report', 'ct', 'panel', 'people', 'export', 'builderSave', 'panelSave'], 'marsha@mildigital.id': ['summary', 'report', 'ct', 'panel', 'people', 'export'], 'siapa@mildigital.id': [] };
for (const [e, ok] of Object.entries(expect)) {
  const got = Object.keys(M).filter(k => { const x = as(e, M[k]); if (x.err && !/Akses ditolak/.test(x.err)) console.log('  ', e, k, 'error lain:', x.err.slice(0, 120)); return !x.err; });
  console.log(e.padEnd(24), '->', got.join(' '));
  assert.deepStrictEqual(got, ok === 'all' ? Object.keys(M) : ok, e);
}
// UI per peran
const label = { admin: 'Admin', survei: 'Buat survei & baca data', baca: 'Baca data saja' };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [e, role] of [['marsha@mildigital.id', 'baca'], ['desvan@mildigital.id', 'survei'], ['admin@mildigital.id', 'admin']]) {
    global.__viewer = e;
    const html = fs.readFileSync('../survey_out/Admin.html', 'utf8').replace('<?= userEmail ?>', e).replace('<?= userRole ?>', role).replace('<?= userRoleLabel ?>', label[role]);
    fs.writeFileSync(path.join(__dirname, 'admin_page_' + role + '.html'), html);
    const p = await b.newPage({ viewport: { width: 1360, height: 900 } }); const toasts = [];
    p.on('pageerror', x => errs.push(role + ': ' + x.message)); p.on('dialog', d => d.accept());
    await p.exposeFunction('gsCall', (fn, args) => { global.__viewer = e; ctx.MEMO_ = null; try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (x) { toasts.push(fn + ': ' + x.message); return JSON.stringify({ err: x.message }); } });
    await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
    await p.route('https://cdnjs.cloudflare.com/**', rt => rt.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
    await p.route('https://fonts.googleapis.com/**', rt => rt.fulfill({ body: '', contentType: 'text/css' }));
    await p.goto('file://' + path.join(__dirname, 'admin_page_' + role + '.html')); await p.waitForTimeout(2500);
    const menu = await p.$$eval('nav.side > button', x => x.filter(b => b.offsetParent).map(b => b.textContent.trim()));
    console.log(role.padEnd(7), 'menu:', menu.join(' | '), '| label:', await p.textContent('#u-role'));
    for (const nm of ['Jawaban', 'Laporan', 'Cross Tab', 'Database Responden', 'Panel Responden', 'Akses Pengguna']) {
      const bt = p.locator('nav.side > button', { hasText: nm }); if (!(await bt.isVisible())) continue; await bt.click(); await p.waitForTimeout(1500);
    }
    await p.locator('#sv-list button').first().click(); await p.waitForTimeout(800);
    const acts = await p.$$eval('#p-survey .acts > *', x => x.filter(b => b.offsetParent).map(b => b.textContent.trim()));
    console.log('        aksi survei:', acts.join(' | '));
    if (role === 'admin') { await p.locator('nav.side > button', { hasText: 'Akses Pengguna' }).click(); await p.waitForTimeout(800); await p.screenshot({ path: SP + 'akses_admin.png' }); }
    if (role === 'baca') await p.screenshot({ path: SP + 'akses_baca.png' });
    console.log('        ditolak server:', toasts.length ? toasts.join(' || ') : 'tidak ada');
    assert.strictEqual(toasts.length, 0, role + ' memanggil fungsi yang tidak diizinkan');
    if (role === 'baca') { assert(!menu.includes('Tukar Hadiah') && !menu.includes('Survei baru') && menu.includes('Laporan')); assert(!acts.some(a => /Edit|Tutup|Refresh|Gambar/.test(a))); }
    if (role === 'survei') { assert(menu.some(m => /Survei baru/.test(m)) && !menu.includes('Tukar Hadiah') && !menu.includes('Akses Pengguna')); }
    if (role === 'admin') assert(menu.includes('Akses Pengguna') && menu.includes('Tukar Hadiah'));
    await p.close();
  }
  console.log('JS errors:', errs); await b.close(); assert(!errs.length); console.log('OK akses_test');
})();
