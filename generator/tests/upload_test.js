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
  await p.route('https://cdnjs.cloudflare.com/**', r => { const u = r.request().url(); const f = /xlsx/.test(u) ? require.resolve('xlsx/dist/xlsx.full.min.js') : path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'); r.fulfill({ body: fs.readFileSync(f, 'utf8'), contentType: 'application/javascript' }); });
  await p.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(1500);
  await p.click('nav.side .sv-new'); await p.waitForTimeout(500);
  console.log('tab:', await p.$$eval('#b-src button', e => e.map(x => x.textContent + (x.classList.contains('on') ? '*' : '')).join(' | ')));
  // 1. unduh template
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('text=Unduh template Excel')]);
  const tpl = SP + 'tpl_up.xlsx'; await dl.saveAs(tpl); console.log('template:', dl.suggestedFilename());
  const X = require('xlsx'); const wb = X.readFile(tpl); console.log('sheets:', wb.SheetNames.join(','), '| baris contoh:', X.utils.sheet_to_json(wb.Sheets.Pertanyaan, { header: 1 }).length - 1);
  // 2. upload template apa adanya -> 6 pertanyaan (link contoh video belum dikenali? tiktok dikenali, youtube xxxx dikenali)
  await p.setInputFiles('#b-up', tpl); await p.waitForTimeout(1200);
  console.log('hasil upload template:', (await p.textContent('#b-up-msg')).replace(/\s+/g, ' '));
  console.log('pertanyaan:', await p.$$eval('#b-qs .bq', els => els.map(e => e.querySelector('select[data-f=type]').value + ':' + e.querySelectorAll('.bo').length).join(' ')));
  // 3. file dengan kesalahan
  const bad = X.utils.book_new(); X.utils.book_append_sheet(bad, X.utils.aoa_to_sheet([['No', 'Pertanyaan', 'Tipe', 'Pilihan jawaban', 'Wajib', 'Acak', 'Maks', 'Tampilkan jika'],
    [1, 'Gender?', 'Pilih satu', 'Pria', '', '', '', ''], [2, 'Merek?', 'Pilihan ganda', 'A|B', '', '', '', ''], [3, 'Kenapa?', 'Isian panjang', '', '', '', '', '9 = A'], [4, 'Skor', 'Skala', '1-50', '', '', '', '']]), 'Pertanyaan');
  X.writeFile(bad, SP + 'bad.xlsx'); await p.setInputFiles('#b-up', SP + 'bad.xlsx'); await p.waitForTimeout(800);
  console.log('file salah:', (await p.textContent('#b-up-msg')).replace(/\s+/g, ' '));
  // 4. CSV
  fs.writeFileSync(SP + 'q.csv', 'No,Pertanyaan,Tipe,Pilihan jawaban,Wajib,Acak urutan,Maks. pilihan,Tampilkan jika\n1,"Pernah beli Zara?",Pilih satu,Ya|Tidak,Ya,,,\n2,"Kenapa beli Zara?",Pilih beberapa,"Model|Harga|Lainnya, sebutkan",Ya,Ya,2,1 = Ya\n3,"Saran?",Isian panjang,,Tidak,,,\n');
  await p.setInputFiles('#b-up', SP + 'q.csv'); await p.waitForTimeout(1000);
  console.log('csv:', (await p.textContent('#b-up-msg')).replace(/\s+/g, ' '), '|', await p.$$eval('#b-qs .bq', els => els.map(e => e.querySelector('select[data-f=type]').value + ':' + e.querySelectorAll('.bo').length).join(' ')));
  await (await p.$('#b-src')).evaluate(e => e.closest('.card').scrollIntoView()); await p.screenshot({ path: SP + 'up_pane.png', clip: { x: 300, y: 0, width: 1060, height: 900 } });
  const sel = await p.$eval('#b-qs .bq[data-i="1"]', e => (e.querySelector('select[data-l="q"]') || {}).value + ' / ' + (e.querySelector('select[data-l="val"]') || {}).value); console.log('logika no.2:', sel);
  await p.fill('#b-name', 'Survei Zara (uji upload)'); await p.click('#b-pub'); await p.waitForTimeout(400); await p.click('#pub-go'); await p.waitForTimeout(1500);
  const reg = sheets['Daftar Survei'].d, sch = JSON.parse(reg[reg.length - 1].slice(9).join('')); console.log('tersimpan:', sch.questions.map(q => q.id + ':' + q.type + (q.showIf ? '<-' + q.showIf.q + '=' + q.showIf.val : '') + (q.max ? ' max' + q.max : '')).join(' '));
  await p.screenshot({ path: SP + 'up_ui.png', clip: { x: 300, y: 0, width: 1060, height: 900 } });
  console.log('JS errors:', errs); await b.close();
})();
