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
for (let i = 0; i < 12; i++) ctx.submitResponse({ sid: 'r' + i, variant: i % 2 ? 'v2' : 'v1', durasi: 420, cats: ['Tas & aksesori'], prefilled: true, answers: { QC1: 'Biru', Z2: '@user' + (i * 3), Z3: '0812' + String(30000000 + i * 3), Z1: 'Ya, bersedia', S1: '25-34 tahun', S2: 'Wanita', S4: ['Shopee'] } });
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
  await p.waitForTimeout(2000);
  const cols = ctx.adminPanelColumns(); const by = n => cols.find(c => c.col === n);
  console.log('types:', ['usia', 'jenis_kelamin', 'platform_dipakai_1bln', 'media_sosial_harian', 'ses', 'kota', 'jumlah_survei', 'instagram'].map(n => n + '=' + (by(n) || {}).type + '/' + ((by(n) || {}).opts || []).length).join(' '));
  console.log('usia opts:', JSON.stringify(by('usia').opts.slice(0, 6)));
  await p.locator('nav.side button', { hasText: 'Panel' }).click(); await p.waitForTimeout(1500);
  console.log('awal:', await p.textContent('#pn-n'));
  // baris 2: usia (SA)
  const r2 = p.locator('#pn-crit .crit').nth(1);
  await r2.locator('.c-col').selectOption('usia'); await p.waitForTimeout(100);
  console.log('usia val options:', (await r2.locator('select.c-val option').allTextContents()).slice(0, 5).join(' | '));
  await r2.locator('select.c-val').selectOption('25-34 tahun');
  // baris 3: platform (MA)
  await p.click('text=+ Tambah kriteria'); const r3 = p.locator('#pn-crit .crit').nth(2);
  await r3.locator('.c-col').selectOption('platform_dipakai_1bln'); await r3.locator('summary').click();
  const boxes = r3.locator('.ms-l input[type=checkbox]'); console.log('platform choices:', await boxes.count(), (await r3.locator('.ms-l label').allTextContents()).slice(0, 4).join(' | '));
  await boxes.nth(0).check(); await boxes.nth(1).check(); console.log('summary:', await r3.locator('summary').textContent());
  await r3.locator('summary').click();
  await p.locator('#p-panel button', { hasText: /^Cari$/ }).click(); await p.waitForTimeout(1500);
  console.log('hasil:', await p.textContent('#pn-n'));
  const crit = await p.evaluate(() => [].map.call(document.querySelectorAll('#pn-crit .crit'), critGet)); console.log('crit:', JSON.stringify(crit));
  const n = ctx.adminPanelSearch(crit).rows.length; console.log('server cek:', n);
  await r3.locator('summary').click(); await p.screenshot({ path: SP + 'adm_panel.png' });
  console.log('JS errors:', errs); await b.close();
})();
