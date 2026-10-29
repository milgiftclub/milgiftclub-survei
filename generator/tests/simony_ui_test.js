const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup();
const SP = (process.env.SHOTS || require('os').tmpdir() + '/') ;
global.__viewer = 'robert@mildigital.id';
const html = fs.readFileSync('../survey_out/Admin.html', 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id'); fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept('Tidak bisa dihubungi'));
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r => r.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(2500);
  await p.waitForTimeout(2000);
  p.removeAllListeners('dialog'); p.on('dialog', d => d.accept(d.type() === 'prompt' ? 'HAPUS' : undefined));
  await p.locator('nav.side button', { hasText: 'Survei & Pengaturan' }).click(); await p.waitForTimeout(1500);
  await p.locator('nav.side button', { hasText: 'Survei & Pengaturan' }).click(); await p.waitForTimeout(1500);
  await p.screenshot({ path: SP + 'ony_0_card.png', clip: { x: 300, y: 0, width: 1060, height: 900 } });
  await p.click('#sim-ony'); for (let i = 0; i < 60; i++) { await p.waitForTimeout(1000); if (/aktif/.test(await p.textContent('#sim-st')) && !(await p.$eval('#sim-ony', e => e.disabled))) break; }
  console.log('status:', await p.textContent('#sim-st'));
  await p.evaluate(() => loadHome()); await p.waitForTimeout(2500);
  console.log('sidebar:', await p.$eval('#sv-list', e => e.innerText.replace(/\n+/g, ' | ')));
  const btn = p.locator('#sv-list button', { hasText: 'Onycha' }); await btn.click(); await p.waitForTimeout(5000);
  await p.screenshot({ path: SP + 'ony_1_page.png', fullPage: true });
  console.log('page:', (await p.textContent('main')).replace(/\s+/g, ' ').slice(0, 400));
  console.log('JS errors:', errs); await b.close();
})();
