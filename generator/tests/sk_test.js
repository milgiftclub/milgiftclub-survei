const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
ctx.adminPeriodSave([{ ke: 1, tahun: 2026, mulai: '2026-10-01', selesai: '2026-12-31', umumkan: '2027-01-08' }], 'Periode 1 2026'); ctx.SET_MEMO_ = null;
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width: 390, height: 844 }, { width: 1200, height: 900 }]) {
    const p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(e.message));
    await p.route('**/config.js', r => r.fulfill({ contentType: 'application/javascript', body: "window.SURVEI_CONFIG={API_V1:'https://api.test/x',TAMPILAN:{IG_HANDLE:'@milgiftclub'}};" }));
    await p.route('https://api.test/**', async r => { const q = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, data: ctx.publicConfig_(...q.args) }) }); });
    await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
    await p.goto('file://' + path.resolve('../../site/sk/index.html')); await p.waitForTimeout(800);
    console.log(vp.width, (await p.textContent('#now')).replace(/\s+/g, ' '), '| scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
    await p.screenshot({ path: '/tmp/sk_' + vp.width + '.png', fullPage: true });
  }
  console.log('tnc:', ctx.publicConfig_('v1', '').tnc, 'JS errors:', errs); await b.close();
})();
