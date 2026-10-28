// Uji: isi terlalu cepat -> peringatan -> ulangi; bila tetap asal -> tidak valid
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const qs = [1, 2, 3, 4, 5, 6].map(i => ({ id: 'Q' + i, text: 'Pertanyaan ' + i + '?', type: 'single', options: [{ t: 'Satu' }, { t: 'Dua' }, { t: 'Tiga' }] }));
const cs = ctx.adminBuilderSave({ name: 'Survei Cepat', target: 50, profile: false, questions: qs }, true); ctx.adminBuilderStatus(cs.id, 'Dibuka');
const root = path.join(__dirname, '../../site');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const run = async (ig, wa, slowSecond, label) => {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } }); p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
    await p.route('https://milgiftclub.github.io/**', r => { let u = new URL(r.request().url()).pathname.replace('/milgiftclub-survei', ''); if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(root, u), 'utf8'); if (u.endsWith('config.js')) body = body.replace(/API_V1:\s*'[^']*'/, "API_V1: 'https://api.test/x'"); r.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
    await p.route('https://api.test/**', r => { const q = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: ctx.webApi(q.fn, q.args) }); });
    await p.route('https://fonts.googleapis.com/**', r => r.abort());
    await p.goto('https://milgiftclub.github.io/milgiftclub-survei/s/?id=' + cs.id + '&ig=' + ig + '&ok=1'); await p.waitForTimeout(1500);
    const pass = async () => { for (let k = 0; k < 20; k++) {
        const cur = await p.evaluate(() => window.__ST && window.__ST.cur); if (await p.locator('#cl-retry').count()) return 'warn';
        if (await p.locator('h1', { hasText: 'Terima kasih' }).count()) return 'done';
        if (cur === 'Z3') { await p.fill('#body input', wa); } else if (cur === 'QC1') { await p.locator('label.opt', { hasText: 'Biru' }).click(); } else if (cur === 'Z2') {} else if (await p.locator('#body select').count()) { await p.selectOption('#body select', { index: 15 }); } else { const o = p.locator('label.opt'); if (await o.count()) await o.first().click(); }
        if (process.env.DBG) console.log(' cur', cur);
        await p.click('#next'); await p.waitForTimeout(400);
      } return 'stuck'; };
    let r1 = await pass(); console.log(label, 'percobaan 1:', r1, '|', (await p.textContent('#app')).slice(0, 90).replace(/\s+/g, ' '));
    if (r1 === 'warn') { await p.click('#cl-retry'); await p.waitForTimeout(500); if (slowSecond) await p.evaluate(() => { window.__ST.start = Date.now() - 600000; }); const r2 = await pass(); console.log(label, 'percobaan 2:', r2); }
    await p.close();
  };
  await run('cepat1', '081255550001', true, 'A (ulang teliti)');
  await run('cepat2', '081255550002', false, 'B (tetap asal)');
  const T = Object.values(sheets).find(s => /Survei Cepat/.test(s.name)), H = T.d[0];
  console.log('status:', T.d.slice(1).map(r => r[H.indexOf('ig_normal')] + '=' + r[H.indexOf('status')]).join(', '));
  console.log('screenout:', (sheets['Screenout'] || { d: [] }).d.slice(1).map(r => r[2]).join(' | '));
  console.log('JS errors:', errs); await b.close();
})();
