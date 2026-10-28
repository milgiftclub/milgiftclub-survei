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
  await p.waitForTimeout(2500);
  console.log('pill:', await p.textContent('#per-pill'), '| home per:', await p.$eval('#h-per', e => [...e.options].map(o => o.text).join(' / ')));
  await p.locator('nav.side button', { hasText: 'Periode Giveaway' }).click(); await p.waitForTimeout(800);
  console.log('rows:', await p.locator('#per-t tbody tr').count());
  // periode 1 = 30-11 hari lalu, tambah periode 2 = 10 hari lalu s/d +60
  const ymd = n => new Date(Date.now() + 7 * 36e5 + n * 864e5).toISOString().slice(0, 10);
  await p.fill('#per-t input[data-f=mulai]', ymd(-30)); await p.dispatchEvent('#per-t input[data-f=mulai]', 'change');
  await p.fill('#per-t input[data-f=selesai]', ymd(-11)); await p.dispatchEvent('#per-t input[data-f=selesai]', 'change');
  await p.click('text=+ Tambah periode'); await p.waitForTimeout(300);
  console.log('new row start:', await p.$eval('#per-t tbody tr input[data-f=mulai]', e => e.value), 'expect', ymd(-10));
  const sel = '#per-t tbody tr:first-child input[data-f=selesai]'; await p.fill(sel, ymd(60)); await p.dispatchEvent(sel, 'change');
  const um = '#per-t tbody tr:first-child input[data-f=umumkan]'; await p.fill(um, ymd(65)); await p.dispatchEvent(um, 'change');
  await p.check('#per-t tbody tr:first-child input[type=radio]');
  await p.waitForTimeout(300); console.log('preview:', (await p.evaluate(() => document.getElementById('per-prev').innerText)).replace(/\s+/g, ' '));
  await p.click('#p-period >> text=Simpan'); await p.waitForTimeout(1200);
  console.log('after save pill:', await p.textContent('#per-pill'), '| valid col:', await p.$$eval('#per-t tbody tr td:nth-child(7)', t => t.map(x => x.textContent).join(',')));
  await p.screenshot({ path: SP + 'adm_periode.png', fullPage: true });
  await p.locator('nav.side button', { hasText: 'Ringkasan' }).click(); await p.waitForTimeout(1200);
  const tot = async () => p.$eval('#h-per', e => e.value);
  console.log('home periode:', await tot(), '|', await p.$eval('#h-per', e => [...e.options].map(o => o.text).join(' / ')));
  await p.selectOption('#h-per', 'Periode 1 2026'); await p.waitForTimeout(1200); console.log('switched:', await tot());
  await p.screenshot({ path: SP + 'adm_home_per.png', fullPage: true });
  await p.locator('nav.side button', { hasText: 'Undian' }).click(); await p.waitForTimeout(1200);
  console.log('undian per:', await p.$eval('#d-per', e => e.value));
  console.log('builder per row gone:', await p.$('#b-pke') === null);
  console.log('JS errors:', errs); await b.close();
})();
