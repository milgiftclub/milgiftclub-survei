const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup();
const SP = (process.env.SHOTS || require('os').tmpdir() + '/') ;
const pick = a => a[Math.floor(Math.random() * a.length)];
const AGE = ['18-24 tahun','18-24 tahun','25-34 tahun','25-34 tahun','25-34 tahun','35-44 tahun','45-54 tahun','55 tahun ke atas'];
const CITY = [['Kota Bandung','Jawa Barat','Tidak'],['Kota Jakarta Selatan','DKI Jakarta','Ya'],['Kota Bekasi','Jawa Barat','Ya'],['Kota Surabaya','Jawa Timur','Tidak'],['Kota Medan','Sumatera Utara','Tidak'],['Kota Makassar','Sulawesi Selatan','Tidak'],['Kota Semarang','Jawa Tengah','Tidak']];
const CAT1 = ['Fashion wanita','Fashion muslim / modest','Tas & aksesori','Skincare','Makeup','Camilan & makanan ringan','HP & aksesori','Fashion pria','Sepatu & sandal'];
const CAT2 = ['Fashion wanita','Fashion muslim / modest','Tas & aksesori'];
const PROD = { 'Fashion wanita':['Dress','Blouse / kemeja kerja','Kaos / atasan kasual'], 'Fashion muslim / modest':['Pashmina','Gamis','Hijab instan / bergo'], 'Tas & aksesori':['Tote bag','Tas selempang / sling bag','Dompet'] };
let n = 0;
for (let d = 25; d >= 0; d--) {
  const per = 3 + Math.floor(Math.random() * 7);
  for (let k = 0; k < per; k++) {
    const v = Math.random() < 0.4 ? 'v2' : 'v1', c = pick(CITY), cat = pick(v === 'v2' ? CAT2 : CAT1), i = n++;
    const bad = Math.random() < 0.05;
    ctx.submitResponse({ sid: 's' + i, variant: v, durasi: 300 + Math.floor(Math.random() * 400), src: pick(['linktree','ig_story','langsung','ig_bio']), cats: [cat],
      answers: { QC1: bad ? 'Merah' : 'Biru', Z2: '@user' + i, Z3: '0812' + String(30000000 + i), Z1: Math.random() < .6 ? 'Ya, bersedia' : 'Tidak', S1: pick(AGE), S2: v === 'v2' ? 'Wanita' : pick(['Pria','Wanita']), A1: c[0], provinsi: c[1], jabodetabek: c[2], B2: pick(['Shopee','Shopee','TikTok Shop','Tokopedia']), L1_PT1: (PROD[cat] ? pick(PROD[cat]) : 'Lainnya'), S4: ['Shopee', 'TikTok Shop', 'Tokopedia', 'Lazada'].filter(() => Math.random() < .6), B4: { 'Harga paling murah': pick(['Shopee', 'TikTok Shop', 'Tokopedia']), 'Gratis ongkir': pick(['Shopee', 'TikTok Shop']), 'Banyak promo': pick(['Shopee', 'Tokopedia']) }, D3: String(Math.floor(Math.random() * 11)), Z4: pick(['Karena harganya murah dan cepat sampai', 'Suka promo live', 'Pengiriman cepat', 'Kualitas bagus']) + ' ' + i, L1_PT2: pick(['Rp50.001 – Rp75.000','Rp75.001 – Rp100.000','Rp100.001 – Rp125.000']) } });
    const T = sheets[v === 'v2' ? 'Jawaban - Fashion Tas Hijab' : 'Jawaban - Semua Kategori'].d; T[T.length - 1][0] = new Date(Date.now() - d * 864e5 - Math.random() * 3e7);
  }
}
for (let i = 0; i < 25; i++) ctx.logScreenout({ sid: 'x' + i, reason: pick(['Survei v2 khusus responden wanita','Tidak membeli kategori fokus dalam 1 bulan terakhir','Usia di bawah 18 tahun','Sudah pernah mengisi survei ini (Instagram sama)']), answers: {}, variant: 'v2' });
ctx.submitResponse({ sid:'sx', variant:'v1', durasi: 20, cats: ['Skincare'], answers: { QC1:'Biru', Z2:'@kilat', Z3:'081299990001', S1:'25-34 tahun' } });
ctx.markSpeeders(true);
global.__viewer = 'robert@mildigital.id';
console.log('admin?', ctx.isAdmin_(), '| outsider?', ctx.isAdmin_('orang@gmail.com'));
const html = fs.readFileSync('../survey_out/Admin.html', 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id');
fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept('Tidak bisa dihubungi'));
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r => r.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(2500);
  await p.screenshot({ path: SP + 'adm_home.png', fullPage: true });
  const nav = async (label, f) => { await p.locator('nav.side button', { hasText: label }).click(); await p.waitForTimeout(900); if (f) await f(); await p.screenshot({ path: SP + 'adm_' + label.split(' ')[0].toLowerCase() + '.png', fullPage: false }); };
  for (const v of ['v1', 'v2']) { await p.locator('#sv-list button[data-v="' + v + '"]').click(); await p.waitForTimeout(900); await p.screenshot({ path: SP + 'adm_survei_' + v + '.png', fullPage: true }); }
  await p.click('text=Lihat jawaban'); await p.waitForTimeout(800); console.log('resp filter after Lihat jawaban:', await p.$eval('#r-v', e => e.value));
  await p.locator('#sv-list button[data-v="v2"]').click(); await p.waitForTimeout(500); await p.click('#sv-toggle'); await p.waitForTimeout(1200);
  console.log('v2 open after page toggle:', ctx.isOpen_('v2'), '| nav:', await p.$eval('#sv-list', e => e.innerText.replace(/\n/g, ' | ')));
  await nav('Jawaban', async () => { await p.locator('#r-t tr.click').first().click(); await p.waitForTimeout(600); await p.screenshot({ path: SP + 'adm_detail.png' }); await p.locator('#m button', { hasText: 'Tutup' }).click(); });
  await nav('Panel');
  await nav('Undian', async () => { await p.fill('#d-prize', 'Voucher MAP Rp500.000'); await p.fill('#d-n', '3'); await p.click('text=Undi sekarang'); await p.waitForTimeout(900); });
  await nav('Daftar Blokir', async () => { const btn = p.locator('#bk-t button', { hasText: 'Buka akses' }).first(); if (await btn.count()) { await btn.click(); await p.waitForTimeout(700); } });
  await nav('Survei &', async () => { await p.locator('#open-V2').evaluate(e => e.click()); await p.locator('#p-set button', { hasText: 'Simpan' }).first().click(); await p.waitForTimeout(500); });
  await nav('API', async () => { await p.click('#p-api button:has-text("Tampilkan")'); });
  await p.locator('nav.side button', { hasText: 'Laporan' }).click(); await p.waitForTimeout(2500);
  await p.screenshot({ path: SP + 'adm_laporan.png', fullPage: false });
  await p.evaluate(() => window.scrollTo(0, 1400)); await p.waitForTimeout(1200); await p.screenshot({ path: SP + 'adm_laporan2.png' });
  await p.selectOption('#rp-v', 'v1'); await p.waitForTimeout(2000);
  await p.evaluate(() => { const q = [...document.querySelectorAll('#rp-list .rq')].find(e => /B4|matrix/i.test(e.innerText) || e.querySelector('.rq-n').textContent === 'B4'); if (q) q.scrollIntoView(); }); await p.waitForTimeout(1500); await p.screenshot({ path: SP + 'adm_laporan3.png' });
  await p.evaluate(() => { const q = [...document.querySelectorAll('#rp-list .rq')].find(e => e.querySelector('.rq-n').textContent === 'S4'); if (q) q.scrollIntoView(); window.scrollBy(0, -80); }); await p.waitForTimeout(1500); await p.screenshot({ path: SP + 'adm_laporan4.png' });
  await p.selectOption('#rp-fc', { index: 1 }); await p.waitForTimeout(800); await p.waitForTimeout(1500); console.log('report filtered meta:', await p.$eval('#rp-kpi', e => e.innerText.replace(/\n/g, ' ')));
  console.log('JS errors:', errs);
  console.log('V2 open after toggle:', ctx.isOpen_('v2'), '| winners rows:', sheets['Pemenang'].d.length - 1, '| blok:', sheets['Daftar Blokir'].d.slice(1).map(r => r[5]).join(','));
  // API test
  const key = ctx.settings_().API_KEY; ctx.SET_MEMO_ = null;
  const api = (q) => JSON.parse(ctx.doGet({ parameter: Object.assign({ key: ctx.set_('API_KEY') }, q) }).getContent());
  const s1 = api({ api: 'summary' }); console.log('API summary ok', s1.ok, JSON.stringify(s1.data.surveys.map(x => [x.id, x.valid, x.total])));
  const r1 = api({ api: 'responses', survei: 'v2' }); console.log('API responses', r1.ok, r1.data.length, 'has WA?', Object.keys(r1.data[0]).some(k => /Z3|wa_normal|Z2|ig_normal/.test(k)));
  console.log('API bad key', JSON.parse(ctx.doGet({ parameter: { api: 'summary', key: 'x' } }).getContent()).error);
  global.__viewer = 'tamu@gmail.com'; try { ctx.adminSummary(); console.log('LEAK!'); } catch (e) { console.log('outsider blocked:', e.message); }
  await b.close();
})();
