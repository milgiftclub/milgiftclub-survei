// Uji UI penukaran kupon: verifikasi -> data penerima -> konfirmasi; penukaran ke-2 pakai data tersimpan; kirim link konten; admin centang tag -> +1 kupon
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
ctx.adminSaveSettings({ KUPON_V1: 3, KUPON_V2: 3 }); ctx.SET_MEMO_ = null;
ctx.submitResponse({ sid: 'a1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@ani', Z3: '081211110001' }) });
ctx.submitResponse({ sid: 'a2', variant: 'v2', answers: Object.assign({}, base, { Z2: '@ani', Z3: '081211110001' }) });
const k = ctx.adminKatalog().katalog; ctx.adminKatalogSave(k.map((x, i) => Object.assign({}, x, i === 0 ? { kupon: 2 } : {})));
const root = path.join(__dirname, '../../site'); const SP = process.env.SHOTS || '/tmp/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('https://milgiftclub.github.io/**', r => { let u = new URL(r.request().url()).pathname.replace('/milgiftclub-survei', ''); if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(root, u), 'utf8');
    if (u.endsWith('config.js')) body = body.replace(/API_V1:\s*'[^']*'/, "API_V1: 'https://api.test/x'").replace(/API_V2:\s*'[^']*'/, "API_V2: 'https://api.test/x'");
    r.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
  await p.route('https://api.test/**', r => { const q = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: ctx.webApi(q.fn, q.args) }); });
  await p.route('https://fonts.googleapis.com/**', r => r.abort());
  const open = async () => { await p.goto('https://milgiftclub.github.io/milgiftclub-survei/?ig=ani&ok=1'); await p.waitForFunction(() => !!document.querySelector('.kt button:not([disabled])'), null, { timeout: 15000 }); };
  await open(); console.log('kupon:', (await p.textContent('.kup')).replace(/\s+/g, ' '));
  await p.locator('.kt button:not([disabled])').first().click(); await p.waitForTimeout(200);
  await p.screenshot({ path: SP + 'rd1_verif.png' });
  await p.fill('#rd-l4', '9999'); await p.click('#rd-go'); await p.waitForTimeout(500); console.log('salah wa:', await p.textContent('#rd-err'));
  await p.fill('#rd-l4', '0001'); await p.click('#rd-go'); await p.waitForSelector('#rd-nama');
  await p.screenshot({ path: SP + 'rd2_form.png', fullPage: true });
  await p.fill('#rd-nama', 'Ani Lestari'); await p.fill('#rd-hp', '081211110001'); await p.fill('#rd-al', 'Jl. Merdeka No. 10, RT 01/RW 02, Babakan Ciamis, Sumur Bandung'); await p.fill('#rd-kota', 'Kota Bandung'); await p.fill('#rd-kp', '40117');
  await p.click('#rd-go'); console.log('tanpa setuju:', await p.textContent('#rd-err'));
  await p.check('#rd-ok'); await p.click('#rd-go'); await p.waitForFunction(() => /tercatat/.test(document.getElementById('app').textContent), null, { timeout: 15000 });
  console.log('sukses:', (await p.textContent('#app')).replace(/\s+/g, ' ').slice(0, 330)); await p.screenshot({ path: SP + 'rd3_ok.png' });
  // penukaran ke-2: data tersimpan
  await p.click('#rd-x'); await p.waitForFunction(() => !!document.querySelector('.kt button:not([disabled])'), null, { timeout: 15000 });
  await p.locator('.kt button:not([disabled])').first().click(); await p.waitForTimeout(100); console.log('4 digit terisi otomatis:', await p.inputValue('#rd-l4'));
  await p.click('#rd-go'); await p.waitForSelector('label.opt[data-m]'); await p.screenshot({ path: SP + 'rd4_saved.png', fullPage: true });
  console.log('opsi tersimpan:', (await p.textContent('label.opt[data-m="simpan"]')).replace(/\s+/g, ' '));
  await p.check('#rd-ok'); await p.click('#rd-go'); await p.waitForFunction(() => /tercatat/.test(document.getElementById('app').textContent), null, { timeout: 15000 });
  // admin: kirim -> responden kirim link -> admin verifikasi
  const A = ctx.adminKatalog(); const row = A.tukar[1]; ctx.adminTukarStatus(row._row, 'Dikirim', '', 'JNT777');
  await open(); console.log('riwayat:', (await p.textContent('.ck')).replace(/\s+/g, ' '));
  await p.locator('.tk-tag').first().click(); await p.fill('#tg-l', 'https://www.instagram.com/p/XYZ987/'); await p.fill('#tg-4', '0001'); await p.click('#rd-go'); await p.waitForTimeout(1500); console.log('DBG app:', (await p.textContent('#app')).replace(/\s+/g, ' ').slice(0, 300)); await p.waitForSelector('.verdict.ok'); console.log('kirim link:', await p.textContent('.verdict'));
  await p.screenshot({ path: SP + 'rd5_riwayat.png', fullPage: true });
  ctx.adminTukarTag(ctx.adminKatalog().tukar.find(x => x.tag_status === 'Menunggu cek')._row, true, '');
  await open(); console.log('kupon setelah bonus:', (await p.textContent('.kup .kn')).trim(), '|', (await p.textContent('.ck')).replace(/\s+/g, ' ').slice(0, 260));
  console.log('JS errors:', errs); await b.close();
})();
