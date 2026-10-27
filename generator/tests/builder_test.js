// End-to-end: buat survei di Dashboard -> publish -> isi lewat halaman /s/ -> data masuk Dashboard
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const { makeEnv } = require('./gsmock'); const { ctx, sheets } = makeEnv(); ctx.setup();
const SP = (process.env.SHOTS || require('os').tmpdir() + '/') ;
const ROOT = path.join(__dirname, '..', '..', 'site');
const log = (...a) => console.log(...a);
// responden lama di survei v1 (untuk uji "pakai profil lama")
ctx.submitResponse({ sid: 'old1', variant: 'v1', durasi: 500, cats: ['Skincare'], answers: { QC1: 'Biru', Z2: '@alice', Z3: '081234561234', Z1: 'Ya, bersedia', S1: '25-34 tahun', S2: 'Wanita', S3: ['Tidak satu pun dari pilihan di atas'], A1: 'Kota Bandung', provinsi: 'Jawa Barat', tipe_wilayah: 'Kota', jabodetabek: 'Tidak', A4: 'Bekerja, belum menikah', A5: 'Karyawan swasta', A6: 'Sarjana (S1 / D4)', A7: 'Rp5.000.001 - Rp7.500.000' } });
ctx.adminSaveSettings && (global.__viewer = 'robert@mildigital.id');
ctx.adminSaveSettings({ ANTHROPIC_API_KEY: 'sk-test' });
global.__aiRes = { content: [{ type: 'text', text: 'Berikut JSON:\n' + JSON.stringify({ name: 'AI draft', intro: 'Halo', estimasi: 6, questions: [
  { text: 'Seberapa puas Anda dengan pengiriman?', type: 'scale', scale: { min: 1, max: 5, minLabel: 'Sangat tidak puas', maxLabel: 'Sangat puas' }, options: [] },
  { text: 'Apa yang paling perlu ditingkatkan?', type: 'longtext', options: [], showIf: { q: 1, op: 'is', val: '1' } }] }) }] };

const PASTE = `1. Seberapa sering Anda membeli skincare secara online? (pilih satu)
- Setiap minggu
- 2-3 kali sebulan
- Sebulan sekali
- Tidak pernah (tidak lolos)

2. Platform apa saja yang Anda pakai untuk membeli skincare? (boleh lebih dari satu)
- Shopee
- TikTok Shop
- Tokopedia
- Lainnya, sebutkan

3. Apa alasan utama Anda memilih brand skincare terakhir? (isian)

4. Berapa kali Anda menonton live shopping skincare minggu lalu? (angka)

5. Seberapa setuju: "Review kreator membuat saya percaya produk" (skala 1-5)
1 = Sangat tidak setuju
5 = Sangat setuju`;

(async () => {
  const b = await chromium.launch();
  const errs = [];
  // ---------- 1. Dashboard: buat survei ----------
  const html = fs.readFileSync(path.join(__dirname, '..', 'survey_out', 'Admin.html'), 'utf8').replace('<?= userEmail ?>', 'robert@mildigital.id');
  fs.writeFileSync(path.join(__dirname, 'admin_page.html'), html);
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on('pageerror', e => errs.push('admin: ' + e.message)); p.on('dialog', d => d.accept());
  const popups = []; p.context().on('page', pg => popups.push(pg.url()));
  await p.exposeFunction('gsCall', (fn, args) => { try { return JSON.stringify({ ok: ctx[fn](...JSON.parse(args)) }); } catch (e) { return JSON.stringify({ err: e.message }); } });
  await p.addInitScript(`window.google={script:{run:(function mk(ok,fail){return new Proxy({},{get(_,fn){if(fn==='withSuccessHandler')return f=>mk(f,fail);if(fn==='withFailureHandler')return f=>mk(ok,f);return (...a)=>window.gsCall(fn,JSON.stringify(a)).then(r=>{r=JSON.parse(r); if(r.err){fail&&fail(new Error(r.err))} else ok&&ok(r.ok)})}})})()}};`);
  await p.route('https://cdnjs.cloudflare.com/**', r => r.fulfill({ body: fs.readFileSync(path.join(path.dirname(require.resolve('chart.js')), 'chart.umd.js'), 'utf8'), contentType: 'application/javascript' }));
  await p.route('https://fonts.googleapis.com/**', r => { let css = ''; try { const ff = (pkg, fam, w) => '@font-face{font-family:"' + fam + '";font-weight:' + w + ';src:url(https://fonts.gstatic.test/' + pkg + '/' + w + ')}'; css = [ff('fredoka', 'Fredoka', 600), ff('fredoka', 'Fredoka', 700), ff('nunito', 'Nunito', 700), ff('nunito', 'Nunito', 800), ff('kalam', 'Kalam', 700)].join(''); } catch (e) {} r.fulfill({ body: css, contentType: 'text/css' }); });
  await p.route('https://fonts.gstatic.test/**', r => { try { const [, pkg, w] = new URL(r.request().url()).pathname.split('/'); const dir = path.join(path.dirname(require.resolve('@fontsource/' + pkg + '/package.json')), 'files'); r.fulfill({ body: fs.readFileSync(path.join(dir, pkg + '-latin-' + w + '-normal.woff2')), contentType: 'font/woff2' }); } catch (e) { r.abort(); } });

  await p.goto('file://' + path.join(__dirname, 'admin_page.html')); await p.waitForTimeout(1500);
  await p.click('nav.side .sv-new'); await p.waitForTimeout(500);
  await p.screenshot({ path: SP + 'bld_0_kosong.png' });
  await p.fill('#b-name', 'Skincare di TikTok Shop');
  await p.fill('#b-target', '3');
  await p.click('#b-src button[data-m="paste"]');
  await p.fill('#b-paste', PASTE);
  await p.click('text=Ubah jadi pertanyaan'); await p.waitForTimeout(400);
  log('parsed:', await p.$$eval('#b-qs .bq', els => els.map(e => e.querySelector('select[data-f=type]').value + ':' + e.querySelectorAll('.bo').length)).then(x => x.join(' ')));
  // logika: Q3 hanya muncul jika Q2 memilih TikTok Shop
  await p.selectOption('#b-qs .bq[data-i="2"] select[data-l="q"]', 'Q2'); await p.waitForTimeout(200);
  await p.selectOption('#b-qs .bq[data-i="2"] select[data-l="val"]', 'TikTok Shop'); await p.waitForTimeout(200);
  // AI tambahan (append)
  await p.click('#b-src button[data-m="ai"]');
  await p.fill('#b-brief', 'Kepuasan pengiriman skincare');
  await p.check('#b-append'); await p.click('#b-ai-btn'); await p.waitForTimeout(800);
  log('after AI:', await p.$$eval('#b-qs .bq', els => els.length), 'questions | AI prompt has brief:', /Kepuasan pengiriman/.test(JSON.parse(global.__aiReq.payload).messages[0].content));
  await p.screenshot({ path: SP + 'bld_1_editor.png', fullPage: true });
  log('prize rows default:', await p.$$eval('#b-hd .hd-row input[data-k=nama]', e => e.map(x => x.value).join(' | ')));
  await p.click('text=+ Tambah hadiah'); await p.fill('#b-hd .hd-row:last-child input[data-k=nama]', 'Saldo ShopeePay untuk 10 pemenang'); await p.fill('#b-hd .hd-row:last-child input[data-k=nilai]', '25000');
  await p.click('#b-pub'); await p.waitForTimeout(400); log('publish dialog:', await p.$eval('#pub', e => e.classList.contains('on')), '| toggle:', await p.$eval('#pub-img', e => e.checked)); await p.click('#pub-go'); await p.waitForTimeout(1200);
  await p.waitForTimeout(1500);
  log('promo modal after publish:', await p.$eval('#pm', e => e.classList.contains('on')), '|', await p.$eval('#pm-head', e => e.textContent));
  const dl = []; p.on('download', d => dl.push(d.suggestedFilename()));
  await p.click('text=Unduh Story + Feed'); await p.waitForTimeout(3000);
  log('downloads:', dl.join(', '));
  await p.screenshot({ path: SP + 'bld_2_published.png' });
  await p.click('#pm .btn.sec >> text=Tutup'); await p.waitForTimeout(300);
  const reg = sheets['Daftar Survei'].d;
  log('Daftar Survei:', reg.slice(1).map(r => r.slice(0, 5).join(' | ')));
  const id = reg[1][0];
  const sch = JSON.parse(reg[1].slice(9).join(''));
  log('schema q ids:', sch.questions.map(q => q.id + '/' + q.type + (q.showIf ? '[if ' + q.showIf.q + '=' + q.showIf.val + ']' : '')).join(' '), '| estimasi', sch.estimasi);

  // ---------- 2. Isi survei di halaman /s/ ----------
  async function respond(who) {
    const r = await b.newPage({ viewport: { width: 390, height: 844 } });
    r.on('pageerror', e => errs.push(who.name + ': ' + e.message));
    await r.route('https://survei.test/**', rt => { let u = new URL(rt.request().url()).pathname; if (u.endsWith('/')) u += 'index.html'; let body = fs.readFileSync(path.join(ROOT, u), 'utf8'); if (u.endsWith('config.js')) body = body.replace(/https:\/\/script[^']*/g, 'https://api.test/exec'); rt.fulfill({ body, contentType: u.endsWith('.js') ? 'application/javascript' : 'text/html' }); });
    await r.route('https://api.test/**', rt => { const out = ctx.doPost({ postData: { contents: rt.request().postData() } }); rt.fulfill({ body: out.getContent(), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } }); });
    await r.route('https://fonts.googleapis.com/**', rt => rt.abort());
    await r.goto('https://survei.test/s/?id=' + id + (who.preview ? '&preview=1' : ''));
    await r.waitForSelector('#next', { state: 'visible' });
    const seen = [];
    for (let step = 0; step < 60; step++) {
      await r.waitForTimeout(150);
      if (await r.evaluate(() => !!window.__done)) break;
      const at = await r.evaluate(() => window.__ctl && window.__ctl.at());
      seen.push(at);
      if (who.shot && who.shot.includes(at)) await r.screenshot({ path: SP + 'cus_' + who.name + '_' + at + '.png' });
      const ans = (who.a || {})[at];
      if (at === 'Z2') await r.fill('#body input', who.ig);
      else if (at === 'Z3') await r.fill('#body input', who.wa);
      else if (at === 'PV') await r.fill('#body input', who.pv || '');
      else if (at === 'A1') { await r.fill('#body input', 'Surabaya'); await r.click('#body .opt >> nth=0'); }
      else if (await r.$('#body .scale')) await r.click('#body .scale button >> nth=' + (ans || 3));
      else if (at === 'S0') await r.selectOption('#body select', '1995');
      else if (await r.$('#body select')) await r.selectOption('#body select', { index: 1 });
      else if (await r.$('#body input[type=radio]')) {
        const labels = await r.$$eval('#body .opt span', e => e.map(x => x.textContent));
        const pickT = ans || labels.find(t => !/^(Di bawah 18|Tidak bersedia|Merah|Hijau|Kuning|Pria)/.test(t) && !/tidak pernah/i.test(t)) || labels[0];
        await r.click('#body .opt:has-text("' + (at === 'QC1' ? 'Biru' : pickT) + '") >> nth=0');
      } else if (await r.$('#body input[type=checkbox]')) {
        const labels = await r.$$eval('#body .opt span', e => e.map(x => x.textContent));
        const pickT = ans || (at === 'S3' ? labels[labels.length - 1] : labels[1] || labels[0]);
        for (const t of [].concat(pickT)) await r.click('#body .opt:has-text("' + t + '") >> nth=0');
      } else if (await r.$('#body textarea')) await r.fill('#body textarea', 'Karena cocok di kulit');
      else if (await r.$('#body input[type=text]')) await r.fill('#body input', at === 'Q4' ? '3' : 'jawaban');
      await r.click('#next');
      if (at === 'Z2' || at === 'PV') await r.waitForTimeout(600);
    }
    const end = await r.$eval('#app', e => e.innerText.replace(/\s+/g, ' ').slice(0, 110));
    if (who.shotEnd) await r.screenshot({ path: SP + 'cus_' + who.name + '_end.png' });
    await r.close();
    return { seen, end };
  }
  const R = [];
  R.push(['bob(new)', await respond({ name: 'bob', ig: '@bob', wa: '081211112222', a: { Q2: ['Shopee', 'TikTok Shop'] }, shot: ['O1', 'Q1', 'Q2', 'Q5', 'Q6'], shotEnd: true })]);
  R.push(['alice(profil lama)', await respond({ name: 'alice', ig: '@alice', wa: '081234561234', pv: '1234', a: { Q2: ['Shopee'] }, shot: ['PV'] })]);
  R.push(['bob lagi', await respond({ name: 'bob2', ig: '@bob', wa: '081211112222' })]);
  R.push(['carol(tidak lolos)', await respond({ name: 'carol', ig: '@carol', wa: '081299998888', a: { Q1: 'Tidak pernah' } })]);
  // dina: profil format lama, terakhir diperbarui 8 bulan lalu -> diminta konfirmasi + hanya ditanya kolom profil yang belum ada
  ctx.submitResponse({ sid: 'seed-dina', variant: 'v1', answers: { O1: 'Ya, saya setuju dan bersedia mengikuti survei', Z2: '@dina', Z3: '081255556666', QC1: 'Biru', S1: '25-34 tahun', S2: 'Wanita', S3: ['Tidak satu pun dari pilihan di atas'], A1: 'Kota Surabaya', A4: 'Bekerja, belum menikah', A5: 'Karyawan swasta', A6: 'Sarjana (S1 / D4)', A7: 'Rp3.000.001 - Rp5.000.000' } });
  { const t = sheets['Jawaban - Semua Kategori'].d, ct = t[0].indexOf('timestamp'), cp = t[0].indexOf('profil_diperbarui'); t.forEach((r, i) => { if (i && r[t[0].indexOf('ig_normal')] === 'dina') { r[ct] = new Date(Date.now() - 240 * 864e5); r[cp] = ''; } }); }
  R.push(['dina(profil 8 bln)', await respond({ name: 'dina', ig: '@dina', wa: '081255556666', pv: '6666', a: { PR: 'Ya, masih sesuai' }, shot: ['PR'] })]);
  R.push(['preview', await respond({ name: 'pv', ig: '@pv', wa: '081200000000', preview: true })]);
  R.forEach(([n, x]) => log('PATH', n.padEnd(20), x.seen.join(' '), '\n     END', x.end));
  const tab = sheets[reg[1][4]] || sheets[ctx.customById_(id).tab];
  const H = tab.d[0];
  log('TAB', ctx.customById_(id).tab, 'rows', tab.d.length - 1, tab.d.slice(1).map(r => [r[H.indexOf('ig_normal')], r[H.indexOf('status')], r[H.indexOf('profil_dari_survei_sebelumnya')], String(r[H.indexOf('profil_diperbarui')]).slice(0, 15), r[H.indexOf('S0')], r[H.indexOf('A4')], r[H.indexOf('S1')], r[H.indexOf('A1')], r[H.indexOf('Q2')], r[H.indexOf('Q3')], r[H.indexOf('Q5')]].join(' / ')));
  log('Screenout', sheets['Screenout'].d.slice(1).map(r => r[2] + ' @ ' + r[8]));
  ctx.CUSTOM_MEMO_ = null;
  log('status after submits (target 3, autoclose):', ctx.customById_(id).status, '| open?', ctx.isOpen_(id));

  // ---------- 3. Dashboard: data survei baru ----------
  await p.click('nav.side button[data-p="home"]'); await p.waitForTimeout(300);
  await p.evaluate(() => loadHome()); await p.waitForTimeout(800);
  log('sidebar:', await p.$eval('#sv-list', e => e.innerText.replace(/\n/g, ' | ')));
  await p.click('#sv-list button[data-v="' + id + '"]'); await p.waitForTimeout(800);
  await p.screenshot({ path: SP + 'bld_3_surveipage.png', fullPage: true });
  await p.click('text=Lihat jawaban'); await p.waitForTimeout(800);
  await p.screenshot({ path: SP + 'bld_4_jawaban.png' });
  await p.locator('#r-t tr.click').first().click(); await p.waitForTimeout(600);
  log('detail has question text:', await p.$eval('#m-body', e => /Platform apa saja/.test(e.innerText)));
  await p.locator('#m button', { hasText: 'Tutup' }).click();
  await p.click('#sv-list button[data-v="' + id + '"]'); await p.waitForTimeout(400);
  await p.click('#sv-edit'); await p.waitForTimeout(800);
  await p.screenshot({ path: SP + 'bld_5_edit.png' });
  log('edit loaded:', await p.$eval('#b-title', e => e.textContent), '| q count', await p.$$eval('#b-qs .bq', e => e.length));
  // materi promosi
  await p.click('#sv-list button[data-v="' + id + '"]'); await p.waitForTimeout(500);
  await p.click('text=Gambar IG & caption'); await p.waitForTimeout(1500);
  const save = async (n) => { const d = await p.$eval('#pm-c', c => c.toDataURL('image/png')); fs.writeFileSync(SP + n, Buffer.from(d.split(',')[1], 'base64')); };
  await save('promo_story.png');
  log('caption:', (await p.$eval('#pm-cap', e => e.value)).slice(0, 400).replace(/\n/g, ' / '));
  await p.click('#pm-tabs button[data-f="feed"]'); await p.waitForTimeout(800); await save('promo_feed.png');
  await p.screenshot({ path: SP + 'promo_modal.png' });
  ctx.CUSTOM_MEMO_ = null; log('schema hadiah:', JSON.stringify(ctx.customById_(id).schema.hadiah));
  log('JS errors:', errs);
  // API ATLAS ikut memuat survei baru
  const api = JSON.parse(ctx.doGet({ parameter: { api: 'summary', key: ctx.set_('API_KEY') } }).getContent());
  log('API surveys:', api.data.surveys.map(s => s.id + ':' + s.valid).join(', '));
  await b.close();
})().catch(e => { console.error('FAIL', e); process.exit(1); });
