const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { makeEnv } = require('./gsmock');

const { ctx, sheets } = makeEnv();
ctx.setup();

const html = fs.readFileSync(path.join(__dirname, '../survey_out/Index.html'), 'utf8')
  .replace('<?!= cfgJson ?>', JSON.stringify({ open: true, announce: '20 November 2026', privacy: 'https://example.com/p', tnc: 'https://example.com/t', src: 'ig_bio', variant: process.env.V2 ? 'v2' : 'v1' }));
const file = path.join(__dirname, 'page.html');
fs.writeFileSync(file, html);

const MOCK = `
window.google = { script: { run: (function mk(ok, fail){
  return new Proxy({}, { get(_, fn){
    if (fn === 'withSuccessHandler') return f => mk(f, fail);
    if (fn === 'withFailureHandler') return f => mk(ok, f);
    return (...args) => window.gsCall(fn, JSON.stringify(args)).then(r => ok && ok(JSON.parse(r)), e => fail && fail(e));
  }});
})() } };`;

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];

async function respondent(browser, i, scenario) {
  let V2 = !!process.env.V2; if (/^v[12]:/.test(scenario)) { V2 = scenario[1] === '2'; scenario = scenario.slice(3); }
  const who = (scenario.match(/(alice|bob|carol)/) || [])[1];
  const PH = { alice: '081200001111', bob: '081200002222', carol: '081200003333' };
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage(); if (!process.env.CARELESS) await page.addInitScript('window.__TEST_NO_CARELESS=1');
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  if (process.env.APPS) {
    // halaman Web_*.html seperti disajikan Apps Script (parameter link lewat window.__SEARCH, API lewat google.script.run)
    const f = path.join(__dirname, 'apps_page.html');
    global.__viewer = 'robert@mildigital.id'; ctx.adminSaveSettings({ PERIODE_KE: 2, PERIODE_TAHUN: 2027, TUTUP_V1: '2027-01-15T20:00' }); global.__viewer = '';
    const ovr = ctx.doGet({ parameter: { survei: V2 ? 'v2' : 'v1' }, queryString: '' }).vars.ovr;
    fs.writeFileSync(f, fs.readFileSync(path.join(__dirname, '../survey_out/' + (V2 ? 'Web_v2.html' : 'Web_v1.html')), 'utf8').replace('<?!= search ?>', JSON.stringify('?src=ig_bio')).replace('<?!= ovr ?>', () => ovr));
    await page.exposeFunction('gsCall', (fn, args) => JSON.stringify(ctx[fn](...JSON.parse(args))));
    await page.addInitScript(MOCK);
    await page.route('https://fonts.googleapis.com/**', r => r.abort());
    await page.goto('file://' + f);
    await page.waitForFunction(() => window.__ST, null, { timeout: 10000 });
  } else if (process.env.HOSTED) {
    const root = path.join(__dirname, '../../site');
    await page.route('https://survei.test/**', r => { let u = new URL(r.request().url()).pathname; if (u.endsWith('/')) u += 'index.html'; const f = path.join(root, u); let body = fs.readFileSync(f, 'utf8'); if (u.endsWith('config.js')) body = body.replace(/https:\/\/script[^']*/g, 'https://api.test/exec'); r.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
    await page.route('https://api.test/**', async r => { if (process.env.SLOW && /lookupIg|verifyProfile/.test(r.request().postData())) { await new Promise(z => setTimeout(z, 1500)); const m = /lookupIg|verifyProfile/.exec(r.request().postData())[0]; await page.screenshot({ path: (process.env.SHOTS || require('os').tmpdir() + '/') + 'wait_' + m + '.png' }); } if (process.env.FAILSUBMIT && /submitResponse/.test(r.request().postData())) return r.fulfill({ body: '<html>Script function not found: doPost</html>', contentType: 'text/html', headers: { 'access-control-allow-origin': '*' } }); const out = ctx.doPost({ postData: { contents: r.request().postData() } }); r.fulfill({ body: out.getContent(), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }); });
    await page.goto('https://survei.test/' + (V2 ? 'fokus/' : 'semua/'));
    await page.waitForFunction(() => window.__ST, null, { timeout: 10000 });
  } else {
  await page.exposeFunction('gsCall', (fn, args) => JSON.stringify(ctx[fn](...JSON.parse(args))));
  await page.addInitScript(MOCK);
  await page.goto('file://' + file);
  }
  const seen = [];
  for (let guard = 0; guard < 200; guard++) { if (process.env.DBG) console.log('step', JSON.stringify(await page.evaluate(() => window.__ST.cur)));
    if (await page.evaluate(() => window.__done)) break;
    const cur = await page.evaluate(() => window.__ST.cur);
    const id = cur.id; seen.push(cur.k == null ? id : `L${cur.k + 1}_${id}`);
    if (process.env.CAP && process.env.CAP.split(',').includes(id)) await page.screenshot({ path: `${process.env.SHOTS || require('os').tmpdir() + '/'}cap_${id}_${i}.png`, fullPage: true });
    // ----- answer -----
    const opts = page.locator('label.opt:not(.dis)');
    const n = await opts.count();
    const texts = n ? await opts.allTextContents() : [];
    const clickText = async (t) => { await page.locator('label.opt', { hasText: t }).first().click(); };
    if (id === 'O1') await clickText(scenario === 'refuse' ? 'Tidak bersedia' : 'Ya, saya setuju');
    else if (id === 'S2') await clickText(scenario === 'v2pria' ? 'Pria' : (V2 || who ? 'Wanita' : pick(['Pria', 'Wanita'])));
    else if (id === 'SC1') { if (scenario === 'v2none') await clickText('Tidak membeli'); else if (scenario === 'v2single') await clickText('Tas & aksesori'); else { await clickText('Fashion wanita'); await clickText('Fashion muslim'); } }
    else if (id === 'S0') await page.selectOption('select', scenario === 'minor' ? '2010' : pick(['2000', '1995', '1990', '1985', '1975', '1965']));
    else if (id === 'S0B') await clickText(scenario === 'minor18' ? 'Belum' : 'Ya, sudah');
    else if (id === 'S1') await clickText(scenario === 'minor' ? 'Di bawah 18' : pick(['18-24', '25-34', '35-44', '45-54', '55 tahun']));
    else if (id === 'S3') await clickText(scenario === 'industry' ? 'Perusahaan riset pasar' : 'Tidak satu pun');
    else if (id === 'S4') { if (scenario === 'noplat') await clickText('Lazada'); else if (scenario === 'single') await clickText('Shopee'); else { await clickText('Shopee'); if (Math.random() < .6) await clickText('TikTok Shop'); if (Math.random() < .3) { await clickText('Lainnya'); await page.fill('.other input', 'Zalora'); } } }
    else if (id === 'C1' && V2) await page.locator('label.opt').first().click();
    else if (id === 'C1') {
      const want = scenario === 'bunga' ? 'Tas & aksesori' : scenario === 'nohigh' ? 'Makeup' : scenario === 'other' ? 'Kategori lain' : pick(['Fashion wanita', 'Fashion muslim / modest', 'Skincare']);
      await page.locator('label.opt', { hasText: new RegExp('^' + want.replace(/[&/]/g, '.') + '$') }).click();
      if (want === 'Kategori lain') await page.fill('.other input', 'Tiket konser');
    }
    else if (id === 'A1') { await page.fill('input[type=text]', pick(['bandung', 'bekasi', 'medan', 'makassar', 'sleman'])); await page.locator('.opt').first().click(); }
    else if (id === 'QC1') await clickText(scenario === 'inattentive' || /bad/.test(scenario) ? 'Merah' : 'Biru');
    else if (await page.locator('select').count()) { const nOpt = await page.locator('select option').count(); await page.selectOption('select', { index: 1 + rnd(nOpt - 1) }); }
    else if (await page.locator('.mrow').count()) {
      const rows = page.locator('.mrow');
      for (let r = 0; r < await rows.count(); r++) { const ch = rows.nth(r).locator('.chip'); await ch.nth(rnd(await ch.count())).click(); }
    }
    else if (await page.locator('.nps button').count()) await page.locator('.nps button').nth(rnd(11)).click();
    else if (await page.locator('textarea').count()) { if (true) await page.fill('textarea', 'Semoga makin banyak promo.'); }
    else if (['PTB', 'AW5K', 'AW5C'].includes(id)) await page.fill('#body input[type=text]', id === 'PTB' ? 'Uniqlo' : 'kaos oversize');
    else if (id === 'Z2') await page.fill('input[type=text]', who ? '@' + who : scenario === 'dup' ? '@dupuser' : '@user' + i);
    else if (id === 'PV') await page.fill('input[type=tel]', /pvwrong/.test(scenario) ? '0000' : /pvskip/.test(scenario) ? '' : PH[who].slice(-4));
    else if (id === 'Z3') await page.fill('input[type=tel]', who ? PH[who] : scenario === 'dup' ? '081200000000' : '0812' + String(10000000 + i));
    else if (n) {
      const isMulti = await page.locator('input[type=checkbox]').count();
      const pickIdx = rnd(n);
      await opts.nth(pickIdx).click();
      if (isMulti && Math.random() < .5) { const n2 = await page.locator('label.opt:not(.dis)').count(); const j = rnd(n2); if (j !== pickIdx) await page.locator('label.opt:not(.dis)').nth(j).click(); }
      if (await page.locator('.other input:visible').count()) await page.fill('.other input:visible', 'lainnya-teks');
    }
    await page.click('#next');
    await page.waitForTimeout(id === 'Z2' || id === 'PV' || id === 'Z3' ? 800 : 5);
    const err = await page.locator('#err').textContent().catch(() => '');
    if (err && !(id === 'PV' && /pvwrong/.test(scenario))) throw new Error(`R${i} ${scenario} stuck at ${id}: ${err}`);
  }
  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT.replace('.png', '_' + i + '.png'), fullPage: true });
  const endText = await page.locator('main').innerText();
  await page.context().close();
  if (errs.length) throw new Error('JS errors: ' + errs.join('; '));
  return { seen, endText };
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' in {} ? undefined : undefined });
  const scen = ['normal', 'normal', 'refuse', 'minor', 'industry', 'noplat', 'nohigh', 'inattentive', 'dup', 'dup'];
  for (let i = 0; i < +(process.env.N||4); i++) scen.push('normal');
  if (process.env.SCEN) scen.splice(0, scen.length, ...process.env.SCEN.split(',')); else if (process.env.V2) scen.splice(0, scen.length, 'v2single', 'v2multi', 'v2pria', 'v2none'); else if (process.env.ONE) scen.splice(0, scen.length, 'bunga'); else if (process.env.QUICK) scen.splice(0, scen.length, 'bunga', 'normal', 'nohigh', 'other', 'single', 'dup', 'dup');
  const results = [];
  for (let i = 0; i < scen.length; i++) {
    const r = await respondent(browser, i, scen[i]);
    results.push([scen[i], r]);
  }
  await browser.close();
  // ---------- report ----------
  if (process.env.SCEN) { const t1 = sheets['Jawaban - Semua Kategori'].d, t2 = sheets['Jawaban - Fashion Tas Hijab'].d, B = sheets['Daftar Blokir'].d; const show = (t) => t.slice(1).map(r => ['ig_normal','status','profil_dari_survei_sebelumnya','S1','S2','A1','A7'].map(h => r[t[0].indexOf(h)]).join(' / ')); console.log('TAB1 ' + JSON.stringify(show(t1))); console.log('TAB2 ' + JSON.stringify(show(t2))); console.log('BLOK ' + JSON.stringify(B.map(r => r.slice(0, 10).join(' | ')))); console.log('SCR ' + JSON.stringify(sheets['Screenout'].d.slice(1).map(r => r[2]))); global.__ctx = ctx; global.__sheets = sheets; }
  results.forEach(([sc, r]) => console.log('PATH', sc, r.seen.filter(x => !/^L1_/.test(x)).join(' '), '| funnel:', r.seen.filter(x => /^L1_/.test(x)).length));
  fs.writeFileSync(path.join(__dirname, 'responses.json'), JSON.stringify((process.env.V2 ? sheets['Jawaban - Fashion Tas Hijab'] : sheets['Jawaban - Semua Kategori']).d)); fs.writeFileSync(path.join(__dirname, 'screenout.json'), JSON.stringify(sheets['Screenout'].d));
  const resp = (process.env.V2 ? sheets['Jawaban - Fashion Tas Hijab'] : sheets['Jawaban - Semua Kategori']).d, scr = sheets['Screenout'].d, kat = sheets['Kategori'].d;
  const H = resp[0] || [];
  const col = (n) => H.indexOf(n);
  console.log('Responses rows:', resp.length - 1, '| columns:', H.length, '| Screenout rows:', scr.length - 1);
  console.log('Screenout reasons:', scr.slice(1).map(r => r[2]));
  const st = {}; resp.slice(1).forEach(r => st[r[col('status')]] = (st[r[col('status')]] || 0) + 1); console.log('Status:', st);
  console.log('High cats (assigned/done):', kat.slice(1).filter(r => r[2] === 'High').map(r => `${r[1]}:${r[3]}/${r[4]}`).join(', '));
  const nohigh = resp.slice(1).find(r => r[col('C1')] === 'Makeup | Minuman');
  console.log('No-High respondent cats:', nohigh && JSON.stringify([nohigh[col('kategori_1')], nohigh[col('kategori_2')]]), 'has L1 cols filled:', nohigh && H.some((h, i) => h.startsWith('L1_') && nohigh[i] !== ''));
  const bunga = results.find(([s, r]) => r.seen.some(x => /_G1$/.test(x)));
  console.log('Gifting block shown for some respondent:', !!bunga);
  const normal = results.find(([s]) => s === 'bunga')?.[1] || results.find(([s]) => s === 'normal')[1];
  console.log('Sample path (normal):', normal.seen.join(' '));
  console.log('Sample end text:', normal.endText.replace(/\s+/g, ' ').slice(0, 160));
  console.log('Screenout end text:', (results.find(([s]) => s === 'minor')||[0,{endText:'-'}])[1].endText.replace(/\s+/g, ' ').slice(0, 120));
  console.log('Some headers:', H.slice(0, 14).join(' | '), '...', H.filter(h => h.startsWith('B4')).slice(0, 2), H.filter(h => h.startsWith('C2')).slice(0, 2));
  // durations nearly 0 in bot -> speeder marking check
  ctx.markSpeeders(); ctx.updateRekap(); ctx.buildEligibleList();
  console.log('Rekap first rows:', sheets['Rekap'].d.slice(0, 8).map(r => r.join(' / ')));
  console.log('Eligible rows:', sheets['Eligible Undian'].d.length - 1);
  const P = sheets['Panel'].d; console.log('Panel rows:', P.length - 1, '| cols:', P[0].length);
  if (P.length > 1) console.log('Panel sample:', P[0].map((h, i) => h + '=' + String(P[1][i]).slice(0, 25)).join(' ; '));
  const C = sheets['Cari Panel'].d; C[4] = ['jenis_kelamin', 'sama dengan', 'Wanita']; C[5] = ['kategori_terakhir_dibeli', 'sama dengan', 'fashion wanita'];
  ctx.searchPanel(); console.log('Search result:', sheets['Hasil Pencarian'].d[0].join(' -> '));
  resp.slice(1).forEach(r => { const o = {}; H.forEach((h, i) => o[h] = r[i]); console.log('ROW', o.A1, '/', o.provinsi, '/', o.jabodetabek, '/', o.tipe_wilayah, '| S4:', o.S4, '| B2:', o.B2, '| B4 cols:', H.filter(h => h.startsWith('B4')).map(h => o[h]).filter(Boolean).join(';').slice(0, 60), '| C1:', o.C1, '| kat:', o.kategori_1, '| C2:', o.C2); });
  const zi = H.indexOf('Z1'); console.log('Valid & opt-in count:', resp.slice(1).filter(r => r[col('status')] === 'Valid' && r[zi] === 'Ya, bersedia').length);
  fs.writeFileSync(path.join(__dirname, 'responses.json'), JSON.stringify(resp));
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
