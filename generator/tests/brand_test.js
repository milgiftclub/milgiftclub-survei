// Survei atas nama brand klien: halaman responden + gambar IG
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup();
const SP = process.env.SHOTS || require('os').tmpdir() + '/', ROOT = path.join(__dirname, '..', '..', 'site');
global.__viewer = 'robert@mildigital.id';
const logo = 'data:image/png;base64,' + fs.readFileSync(SP + 'logo_test.png').toString('base64');
const lid = ctx.adminImageSave(logo);
const r = ctx.adminBuilderSave({ name: 'Survei Camilan Pedas', target: 100, brand: { mode: 'client', name: 'Contoh Snack', logo: lid, primary: '#D62828', accent: '#FCBF49', ink: '#3C2A1E', bg: '#FDF1F1', ig: '@contohsnack' },
  hadiah: [{ nama: 'Hampers camilan untuk 5 pemenang', nilai: 250000 }, { nama: 'Saldo GoPay untuk 10 pemenang', nilai: 50000 }], periode: 'Hingga 30 November 2026',
  questions: [{ text: 'Seberapa sering Anda ngemil keripik pedas?', type: 'single', options: [{ t: 'Setiap hari' }, { t: 'Seminggu sekali' }, { t: 'Jarang' }] }] }, true);
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.route('https://survei.test/**', rt => { let u = new URL(rt.request().url()).pathname; if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(ROOT, u), 'utf8'); if (u.endsWith('config.js')) body = body.replace(/https:\/\/script[^']*/g, 'https://api.test/exec'); rt.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
  await pg.route('https://api.test/**', rt => { const out = ctx.doPost({ postData: { contents: rt.request().postData() } }); rt.fulfill({ body: out.getContent(), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }); });
  await pg.route('https://fonts.googleapis.com/**', rt => rt.abort());
  await pg.goto('https://survei.test/s/?id=' + r.id); await pg.waitForSelector('#next', { state: 'visible' }); await pg.waitForTimeout(500);
  await pg.screenshot({ path: SP + 'brand_O1.png', fullPage: true });
  console.log('title:', await pg.title(), '| header:', await pg.$eval('header', e => e.innerText.replace(/\n/g, ' ')), '| logo img:', !!(await pg.$('header img')));
  await pg.click('#body .opt >> nth=0'); await pg.click('#next'); await pg.waitForTimeout(300);
  console.log('Z2 text:', await pg.$eval('h1', e => e.innerText));
  // dashboard gambar IG
  const html = fs.readFileSync(path.join(__dirname, '..', 'survey_out', 'Admin.html'), 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id');
  fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); p.on('pageerror', e => errs.push('admin: ' + e.message)); p.on('dialog', d => d.accept());
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r2 => r2.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r2 => { const ff = (pkg, fam, w) => '@font-face{font-family:"' + fam + '";font-weight:' + w + ';src:url(https://fonts.gstatic.test/' + pkg + '/' + w + ')}'; r2.fulfill({ body: [ff('fredoka', 'Fredoka', 600), ff('fredoka', 'Fredoka', 700), ff('nunito', 'Nunito', 700), ff('nunito', 'Nunito', 800), ff('kalam', 'Kalam', 700)].join(''), contentType: 'text/css' }); });
  await p.route('https://fonts.gstatic.test/**', r2 => { try { const [, pkg, w] = new URL(r2.request().url()).pathname.split('/'); const dir = path.join(path.dirname(require.resolve('@fontsource/' + pkg + '/package.json')), 'files'); r2.fulfill({ body: fs.readFileSync(path.join(dir, pkg + '-latin-' + w + '-normal.woff2')), contentType: 'font/woff2' }); } catch (e) { r2.abort(); } });
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(1500);
  console.log('palette from logo:', JSON.stringify(await p.evaluate((id) => loadPrizeImgs([id]).then(() => logoPalette(IMGCACHE[id])), lid)));
  await p.click('#sv-list button[data-v="' + r.id + '"]'); await p.waitForTimeout(500);
  await p.click('#sv-edit'); await p.waitForTimeout(1200); await p.screenshot({ path: SP + 'brand_builder.png' });
  await p.click('#sv-list button[data-v="' + r.id + '"]'); await p.waitForTimeout(500);
  await p.click('text=Gambar IG & caption'); await p.waitForTimeout(2000);
  const save = async (n) => { const d = await p.$eval('#pm-c', c => c.toDataURL('image/png')); fs.writeFileSync(SP + n, Buffer.from(d.split(',')[1], 'base64')); };
  await save('brand_story.png'); await p.click('#pm-tabs button[data-f="feed"]'); await p.waitForTimeout(1200); await save('brand_feed.png');
  console.log('caption head:', (await p.$eval('#pm-cap', e => e.value)).split('\n').slice(0, 4).join(' / '));
  console.log('JS errors:', errs); await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
