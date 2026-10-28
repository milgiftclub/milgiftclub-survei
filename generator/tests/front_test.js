const { chromium } = require('playwright'); const path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
ctx.submitResponse({ sid: 'a1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@robertignatius', Z3: '081211110001' }) });
const cs = ctx.adminBuilderSave({ name: 'Survei Skincare', target: 50, questions: [{ id: 'Q1', text: 'A?', type: 'single', options: [{ t: 'Ya' }, { t: 'Tidak' }] }] }, true);
ctx.adminBuilderStatus(cs.id, 'Dibuka');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const page = async (url, shot, f) => {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }); p.on('pageerror', e => errs.push(shot + ': ' + e.message));
    await p.route('**/config.js', r => r.fulfill({ contentType: 'application/javascript', body: "window.SURVEI_CONFIG={API_V1:'https://api.test/x',API_V2:'https://api.test/x',TAMPILAN:{IG_HANDLE:'@milgiftclub'}};" }));
    await p.route('https://api.test/**', r => { const q = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: ctx.webApi(q.fn, q.args) }); });
    await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
    await p.goto('file://' + path.resolve(url)); await p.waitForTimeout(1500); if (f) await f(p);
    await p.screenshot({ path: '/tmp/' + shot + '.png', fullPage: true }); return p;
  };
  let p = await page('../../site/index.html', 'front_v1', async p => console.log('v1 sk box:', await p.locator('.skbox').count(), '| has MIL Digital:', (await p.content()).includes('MIL Digital'), '| tnc link:', await p.locator('text=Syarat & Ketentuan Giveaway').count()));
  p = await page('../../site/cek/index.html', 'cek', async p => { await p.fill('#ig', '@robertignatius'); await p.click('#go'); await p.waitForTimeout(1200); console.log('cek:', (await p.textContent('#out')).replace(/\s+/g, ' ').slice(0, 700)); });
  const sp = await b.newPage({ viewport: { width: 390, height: 844 } });
  await sp.route('**/config.js', r => r.fulfill({ contentType: 'application/javascript', body: "window.SURVEI_CONFIG={API_V1:'https://api.test/x',TAMPILAN:{IG_HANDLE:'@milgiftclub'}};" }));
  await sp.route('https://api.test/**', r => { const q = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: ctx.webApi(q.fn, q.args) }); });
  sp.on('pageerror', e => errs.push('s: ' + e.message));
  await sp.goto('file://' + path.resolve('../../site/s/index.html') + '?id=' + cs.id); await sp.waitForTimeout(1800);
  console.log('custom sk box:', await sp.locator('.skbox').count());
  console.log('JS errors:', errs); await b.close();
})();
