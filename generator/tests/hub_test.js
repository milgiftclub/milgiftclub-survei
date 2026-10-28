// Uji halaman depan: setuju -> username IG -> daftar survei (yang sudah diisi abu-abu) -> masuk survei tanpa mengulang persetujuan
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const base = { O1: 'Ya, saya setuju dan bersedia mengikuti survei', QC1: 'Biru', Z1: 'Tidak', S1: '25-34 tahun', S2: 'Wanita' };
ctx.submitResponse({ sid: 'a1', variant: 'v1', answers: Object.assign({}, base, { Z2: '@ani', Z3: '081211110001' }) });
const cs = ctx.adminBuilderSave({ name: 'Survei Skincare', target: 50, questions: [{ id: 'Q1', text: 'A?', type: 'single', options: [{ t: 'Ya' }, { t: 'Tidak' }] }] }, true); ctx.adminBuilderStatus(cs.id, 'Dibuka');
const root = path.join(__dirname, '../../site'); const SP = '/tmp/claude-0/-home-claude/50b0d3e0-1ee4-51c7-ac80-d59da6a08266/scratchpad/';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route('https://milgiftclub.github.io/**', r => { let u = new URL(r.request().url()).pathname.replace('/milgiftclub-survei', ''); if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(root, u), 'utf8');
    if (u.endsWith('config.js')) body = body.replace(/API_V1:\s*'[^']*'/, "API_V1: 'https://api.test/x'").replace(/API_V2:\s*'[^']*'/, "API_V2: 'https://api.test/x'");
    r.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
  await p.route('https://api.test/**', r => { const q = JSON.parse(r.request().postData()); r.fulfill({ contentType: 'application/json', body: ctx.webApi(q.fn, q.args) }); });
  await p.route('https://fonts.googleapis.com/**', r => r.abort());
  await p.goto('https://milgiftclub.github.io/milgiftclub-survei/'); await p.waitForTimeout(1200);
  console.log('depan:', (await p.textContent('#app')).replace(/\s+/g, ' ').slice(0, 160)); await p.screenshot({ path: SP + 'hub1.png', fullPage: true });
  await p.click('#next'); console.log('tanpa pilih:', await p.textContent('#err'));
  await p.locator('label.opt').first().click(); await p.click('#next'); await p.fill('#igv', '@ani'); await p.click('#next'); await p.waitForTimeout(1200);
  console.log('daftar:', (await p.textContent('#app')).replace(/\s+/g, ' ').slice(0, 400)); await p.screenshot({ path: SP + 'hub2.png', fullPage: true });
  console.log('abu-abu:', await p.$$eval('a.sv', l => l.map(x => x.className + ':' + x.querySelector('b').textContent)));
  await p.locator('a.sv:not(.done)').first().click(); await p.waitForTimeout(2000);
  console.log('masuk survei:', p.url().replace('https://milgiftclub.github.io', ''), '| di', await p.evaluate(() => window.__ST && JSON.stringify(window.__ST.cur)), '| Z2 =', await p.evaluate(() => window.__ST && window.__ST.a.Z2));
  await p.screenshot({ path: SP + 'hub3.png' });
  await p.goto('https://milgiftclub.github.io/milgiftclub-survei/s/?id=' + cs.id + '&ig=ani&ok=1'); await p.waitForTimeout(2000);
  console.log('custom:', await p.evaluate(() => window.__ST && window.__ST.cur), await p.evaluate(() => window.__ST && window.__ST.a.Z2));
  await p.goto('https://milgiftclub.github.io/milgiftclub-survei/?ig=ani&ok=1'); await p.waitForTimeout(1200); console.log('kembali ke daftar:', (await p.textContent('#app')).slice(0, 60));
  console.log('JS errors:', errs); await b.close();
})();
