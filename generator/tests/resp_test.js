// Uji: halaman Jawaban — semua survei, hapus per baris (tempat sampah), Bersihkan per tanggal / per jawaban
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'); const assert = require('assert');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup();
const SP = process.env.SHOTS || require('os').tmpdir() + '/';
for (let i = 0; i < 30; i++) {
  const v = i % 3 === 0 ? 'v2' : 'v1';
  ctx.submitResponse({ sid: 's' + i, variant: v, cats: ['Skincare'], answers: { QC1: i % 5 === 0 ? 'Merah' : 'Biru', Z2: '@u' + i, Z3: '0812' + String(50000000 + i), Z1: 'Tidak', S1: i % 2 ? '25-34 tahun' : '18-24 tahun', S2: v === 'v2' ? 'Wanita' : 'Pria', A1: 'Kota Bandung' } });
  const T = sheets[v === 'v2' ? 'Jawaban - Fashion Tas Hijab' : 'Jawaban - Semua Kategori'].d; T[T.length - 1][0] = new Date(Date.UTC(2026, 9, 1 + (i % 10), 5));
}
global.__viewer = 'robert@mildigital.id';
const html = fs.readFileSync('../survey_out/Admin.html', 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id');
fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('dialog', d => d.accept());
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r => r.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(1500);
  await p.locator('nav.side button', { hasText: 'Jawaban' }).click(); await p.waitForTimeout(800);
  await p.selectOption('#r-v', 'all'); await p.waitForTimeout(800);
  console.log('semua survei:', await p.$eval('#r-n', e => e.textContent), '| sub:', await p.$eval('#r-t .svsub', e => e.textContent));
  await p.screenshot({ path: SP + 'resp_all.png' });
  const n0 = ctx.readAll_().length;
  await p.locator('#r-t .trash').first().click(); await p.waitForTimeout(800);
  const n1 = ctx.readAll_().length; assert.strictEqual(n1, n0 - 1, 'hapus 1 baris');
  // bersihkan per jawaban: status tidak valid
  await p.click('button:has-text("Bersihkan")'); await p.waitForTimeout(500);
  await p.check('input[name=cl-m][value=filter]'); await p.waitForTimeout(400);
  await p.selectOption('#cl-col', 'status'); await p.waitForTimeout(400);
  await p.selectOption('#cl-val', { index: 1 }); await p.waitForTimeout(500);
  const lbl = await p.$eval('#cl-go', e => e.textContent); console.log('filter:', await p.$eval('#cl-val', e => e.value), lbl);
  await p.screenshot({ path: SP + 'resp_clean.png' });
  await p.click('#cl-go'); await p.waitForTimeout(900);
  const n2 = ctx.readAll_().length; console.log('setelah bersihkan:', n1, '->', n2, '| sisa status:', [...new Set(ctx.readAll_().map(r => r.status))].join(','));
  // per tanggal
  await p.click('button:has-text("Bersihkan")'); await p.waitForTimeout(500);
  await p.check('input[name=cl-m][value=date]'); await p.fill('#cl-from', '2026-10-01'); await p.fill('#cl-to', '2026-10-03'); await p.dispatchEvent('#cl-to', 'change'); await p.waitForTimeout(600);
  console.log('tanggal:', await p.$eval('#cl-go', e => e.textContent)); await p.click('#cl-go'); await p.waitForTimeout(900);
  const left = ctx.readAll_(); assert(left.every(r => new Date(r.timestamp) >= new Date('2026-10-04T00:00:00+07:00')), 'per tanggal');
  console.log('sisa', left.length, '| arsip:', Object.keys(sheets).filter(k => /^Arsip hapus/.test(k)).map(k => k + ':' + (sheets[k].d.length - 1)).join(', '));
  console.log('JS errors:', errs);
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
