// Uji: cross tab + temuan otomatis (server, API ATLAS, halaman Dashboard)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'); const assert = require('assert');
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup();
const SP = process.env.SHOTS || require('os').tmpdir() + '/';
const pick = a => a[Math.floor(Math.random() * a.length)];
const P = (p) => Math.random() < p;
const AGE = ['18-24 tahun', '25-34 tahun', '35-44 tahun', '45-54 tahun'];
const CITY = [['Kota Bandung', 'Jawa Barat', 'Tidak'], ['Kota Jakarta Selatan', 'DKI Jakarta', 'Ya'], ['Kota Medan', 'Sumatera Utara', 'Tidak'], ['Kota Makassar', 'Sulawesi Selatan', 'Tidak']];
const A7 = ctx.QOPTS.A7, LIVE = ctx.QOPTS.D1;
for (let i = 0; i < 420; i++) {
  const g = pick(['Pria', 'Wanita']), age = pick(AGE), c = pick(CITY);
  // efek yang ditanam: Wanita lebih memilih Shopee; usia 18-24 lebih sering beli saat live
  const b2 = g === 'Wanita' ? (P(0.7) ? 'Shopee' : 'Tokopedia') : (P(0.35) ? 'Shopee' : pick(['Tokopedia', 'TikTok Shop']));
  const d1 = age === '18-24 tahun' ? (P(0.6) ? LIVE[3] : pick(LIVE)) : pick(LIVE);
  ctx.submitResponse({ sid: 's' + i, variant: 'v1', cats: ['Skincare'], answers: { QC1: 'Biru', Z2: '@u' + i, Z3: '0812' + String(40000000 + i), Z1: 'Tidak', S1: age, S2: g, A1: c[0], provinsi: c[1], jabodetabek: c[2],
    S4: ['Shopee', 'Tokopedia', 'TikTok Shop'], B2: b2, D1: d1, D0: pick(ctx.QOPTS.D0), A7: pick(A7), A7N: pick(['1 orang (hanya saya)', '2 orang', '3 orang', '4 orang']), A13: pick(['Android', 'iPhone']), A10: [pick(['Instagram', 'TikTok']), 'YouTube'] } });
}
const d = ctx.ctData_('v1', 'Valid');
const ids = d.qs.map(q => q.id);
assert(['S1', 'S2', 'B2', 'D1', 'ses', 'wilayah', 'A10'].every(x => ids.includes(x)), ids.join(','));
assert(!ids.some(x => /^(Z2|Z3|A1|wa_normal|ig_normal|O1)$/.test(x)), 'tanpa data pribadi');
const ins = ctx.CT_LIB.insights(d.qs, d.data, { banners: d.banners });
console.log('insights:', ins.map(f => f.row + ' x ' + f.col + ': ' + f.title + ' ' + f.pct + '% vs ' + f.avg + '%'));
assert(ins.some(f => f.row === 'B2' && f.col === 'S2'), 'temuan gender x platform');
assert(ins.some(f => f.row === 'D1' && f.col === 'S1'), 'temuan usia x live');
// API ATLAS
global.__viewer = 'robert@mildigital.id'; const key = ctx.adminRegenKey(); ctx.SET_MEMO_ = null;
const api = (q) => JSON.parse(ctx.doGet({ parameter: Object.assign({ key }, q) }).getContent());
const q1 = api({ api: 'questions', survei: 'v1' }); assert(q1.ok && q1.data.questions.length > 5);
const t1 = api({ api: 'crosstab', survei: 'v1', row: 'B2', col: 'S2' }); assert(t1.ok, JSON.stringify(t1));
const sh = t1.data.lines.find(l => l.name === 'Shopee'); console.log('API crosstab B2xS2 Shopee:', sh.tot.v + '% total |', t1.data.cols.map((c, j) => c.name + ' ' + sh.cells[j].v + '%' + (sh.cells[j].sig ? '*' : '')).join(' | '));
const i1 = api({ api: 'insights', survei: 'v1' }); assert(i1.ok && i1.data.insights.length >= 2);
assert(!api({ api: 'crosstab', survei: 'v1', row: 'XX', col: 'S2' }).ok);
// Dashboard
const html = fs.readFileSync('../survey_out/Admin.html', 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id');
fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r => r.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(2000);
  await p.locator('nav.side button', { hasText: 'Cross Tab' }).click(); await p.waitForTimeout(2000);
  await p.screenshot({ path: SP + 'ct_1.png', fullPage: true });
  console.log('findings on page:', await p.$$eval('.ct-find', e => e.length), '| title:', await p.$eval('#ct-title', e => e.textContent));
  await p.locator('.ct-find button').first().click(); await p.waitForTimeout(800);
  console.log('after Lihat tabel:', await p.$eval('#ct-title', e => e.textContent));
  // filter: hanya Wanita
  await p.click('#ct-fq input'); await p.fill('#ct-fq input', 'jenis kelamin'); await p.waitForTimeout(300);
  await p.locator('#ct-fq .ct-item[data-i]').first().dispatchEvent('mousedown'); await p.waitForTimeout(400);
  await p.locator('#ct-fcats label', { hasText: 'Wanita' }).click(); await p.waitForTimeout(600);
  console.log('filter:', await p.$eval('#ct-fsum', e => e.textContent));
  await p.screenshot({ path: SP + 'ct_2.png', fullPage: true });
  await p.click('button:has-text("Salin tabel")');
  console.log('JS errors:', errs);
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
