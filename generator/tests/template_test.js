// Uji: contoh siap pakai Onycha vs Zara -> publish -> isi di /s/ (cabang showIf)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup(); global.__viewer = 'robert@mildigital.id';
const SP = process.env.SHOTS || require('os').tmpdir() + '/', ROOT = path.join(__dirname, '..', '..', 'site');
(async () => {
  const b = await chromium.launch(), errs = [];
  const html = fs.readFileSync(path.join(__dirname, '..', 'survey_out', 'Admin.html'), 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id');
  fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); p.on('pageerror', e => errs.push('admin: ' + e.message)); p.on('dialog', d => d.accept());
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r => r.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(1500);
  await p.click('nav.side .sv-new'); await p.waitForTimeout(400);
  await p.click('#b-src button[data-m="tpl"]'); await p.waitForTimeout(200);
  await p.screenshot({ path: SP + 'tpl_0_tab.png' });
  await p.click('#b-tpls button'); await p.waitForTimeout(500);
  console.log('nama:', await p.inputValue('#b-name'), '| kupon:', await p.inputValue('#b-kupon'), '| est:', await p.inputValue('#b-est'), '| jumlah:', await p.$$eval('#b-qs .bq', e => e.length));
  await p.screenshot({ path: SP + 'tpl_1_editor.png', fullPage: false });
  await p.fill('#b-target', '100');
  await p.click('#b-pub'); await p.waitForTimeout(400); await p.click('#pub-go'); await p.waitForTimeout(1200);
  const reg = sheets['Daftar Survei'].d, id = reg[1][0], sch = JSON.parse(reg[1].slice(9).join(''));
  console.log('schema:', sch.questions.length, 'q | showIf:', sch.questions.filter(q => q.showIf).map(q => q.id + '<-' + q.showIf.q + (q.showIf.op === 'isnot' ? '≠' : '=') + q.showIf.val).join(' '), '| kupon', sch.kupon);
  async function respond(name, pick, shots) {
    const r = await b.newPage({ viewport: { width: 390, height: 844 } }); await r.addInitScript('window.__TEST_NO_CARELESS=1');
    r.on('pageerror', e => errs.push(name + ': ' + e.message)); r.on('dialog', d => d.accept());
    await r.route('https://survei.test/**', rt => { let u = new URL(rt.request().url()).pathname; if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(ROOT, u), 'utf8'); if (u.endsWith('config.js')) body = body.replace(/https:\/\/script[^']*/g, 'https://api.test/exec'); rt.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
    await r.route('https://api.test/**', rt => { const out = ctx.doPost({ postData: { contents: rt.request().postData() } }); rt.fulfill({ body: out.getContent(), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }); });
    await r.route('https://fonts.googleapis.com/**', rt => rt.abort());
    await r.goto('https://survei.test/s/?id=' + id + '&preview=1'); await r.waitForSelector('#next', { state: 'visible' });
    const seen = [];
    for (let k = 0; k < 90; k++) {
      await r.waitForTimeout(120);
      if (await r.evaluate(() => !!window.__done)) break;
      const at = await r.evaluate(() => window.__ctl && window.__ctl.at()); seen.push(at);
      if (shots.includes(at)) await r.screenshot({ path: SP + 'tpl_' + name + '_' + at + '.png' });
      const want = pick[at];
      if (at === 'Z2') await r.fill('#body input', '@' + name);
      else if (at === 'Z3') await r.fill('#body input', '0812' + String(Math.random()).slice(2, 10));
      else if (at === 'A1') { await r.fill('#body input', 'Surabaya'); await r.click('#body .opt >> nth=0'); }
      else if (await r.$('#body .scale')) await r.click('#body .scale button >> nth=3');
      else if (await r.$('#body select')) await r.selectOption('#body select', { index: at === 'S0' ? 15 : 1 });
      else if (await r.$('#body input[type=radio]')) { const L = await r.$$eval('#body .opt span', e => e.map(x => x.textContent)); const t = at === 'QC1' ? 'Biru' : want || L.find(t => !/^(Di bawah 18|Tidak bersedia|Pria|Tidak membeli)/.test(t)) || L[0]; await r.click('#body .opt:has-text("' + t + '") >> nth=0'); }
      else if (await r.$('#body input[type=checkbox]')) { const L = await r.$$eval('#body .opt span', e => e.map(x => x.textContent)); for (const t of [].concat(want || (at === 'S3' ? 'Tidak satu pun' : L[0]))) await r.click('#body .opt:has-text("' + t + '") >> nth=0'); }
      else if (await r.$('#body textarea')) await r.fill('#body textarea', 'Model lebih cepat berganti');
      else if (await r.$('#body input[type=text]')) await r.fill('#body input', 'x');
      await r.click('#next');
    }
    const end = await r.$eval('#app', e => e.innerText.replace(/\s+/g, ' ').slice(0, 200)); await r.close(); return { seen: process.env.ALL ? seen : seen.filter(x => /^Q/.test(x)), end };
  }
  const a = await respond('zarafan', { Q7: ['Zara', 'H&M'], Q8: ['Zara'] }, ['Q7', 'Q10', 'Q28', 'Q41']);
  const c = await respond('onyfan', { Q7: ['Zara', 'Onycha'], Q8: ['Onycha'] }, ['Q20', 'Q44']);
  console.log('zarafan', a.seen.length, a.seen.join(' '), '\n  END', a.end);
  console.log('onyfan ', c.seen.length, c.seen.join(' '), '\n  END', c.end);
  console.log('JS errors:', errs); await b.close();
})();
